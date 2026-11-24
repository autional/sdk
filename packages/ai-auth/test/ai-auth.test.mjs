import { test } from 'node:test';
import assert from 'node:assert/strict';

import { clearConsentCache, clearOidcCache, createAiAuth } from '../dist/index.js';

const ISSUER = 'https://api.test';
const AUTHORIZE = 'https://auth.test/oauth/api/v1/oauth/authorize';
const TOKEN = 'https://api.test/oauth/api/v1/oauth/token';
const USERINFO = 'https://api.test/oauth/api/v1/oauth/userinfo';
const JWKS = 'https://api.test/oauth/api/v1/oauth/jwks';
const DISCOVERY = 'https://api.test/.well-known/openid-configuration';
const CONSENT = 'https://api.test/internal/oauth/consent-status';

const encoder = new TextEncoder();

function b64url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}

function b64urlJson(value) {
  return b64url(encoder.encode(JSON.stringify(value)));
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

async function makeSigner() {
  const pair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  );
  const publicJwk = await crypto.subtle.exportKey('jwk', pair.publicKey);
  const privateDer = new Uint8Array(await crypto.subtle.exportKey('pkcs8', pair.privateKey));
  const pem = `-----BEGIN PRIVATE KEY-----\n${btoa(String.fromCharCode(...privateDer)).match(/.{1,64}/gu).join('\n')}\n-----END PRIVATE KEY-----\n`;
  return {
    publicJwk: { ...publicJwk, kid: 'k1', alg: 'RS256', use: 'sig' },
    privateKey: pair.privateKey,
    publicKey: pair.publicKey,
    pkcs8Pem: pem,
  };
}

async function signIdToken(signer, claims) {
  const header = b64urlJson({ alg: 'RS256', typ: 'JWT', kid: 'k1' });
  const payload = b64urlJson(claims);
  const signingInput = `${header}.${payload}`;
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', signer.privateKey, encoder.encode(signingInput));
  return `${signingInput}.${b64url(new Uint8Array(signature))}`;
}

function makeMockFetch({ signer, stateRef, userinfo, consentActive = true, calls = [] }) {
  return async (input, init = {}) => {
    const url = String(input);
    calls.push({ url, init });
    if (url === DISCOVERY) {
      return json({
        issuer: ISSUER,
        authorization_endpoint: AUTHORIZE,
        token_endpoint: TOKEN,
        userinfo_endpoint: USERINFO,
        jwks_uri: JWKS,
      });
    }
    if (url === JWKS) return json({ keys: [signer.publicJwk] });
    if (url === TOKEN) {
      assert.equal(init.method, 'POST');
      assert.match(String(init.headers?.authorization ?? ''), /^Basic /u);
      const body = new URLSearchParams(String(init.body));
      assert.equal(body.get('grant_type'), 'authorization_code');
      assert.equal(body.get('code'), 'code-1');
      assert.ok(body.get('code_verifier'), 'PKCE verifier must be sent');
      assert.equal(body.get('client_secret'), null, 'secret must not be in the form body');
      return json({
        access_token: 'at-secret-token',
        token_type: 'Bearer',
        expires_in: 300,
        id_token: stateRef.idToken,
      });
    }
    if (url === USERINFO) {
      assert.equal(init.headers?.authorization, 'Bearer at-secret-token');
      return json(userinfo);
    }
    if (url.startsWith(CONSENT)) {
      const parsed = new URL(url);
      assert.equal(parsed.searchParams.get('user_id'), 'user-1');
      assert.equal(parsed.searchParams.get('client_id'), 'ai-client');
      assert.equal(init.headers?.['x-api-key'], 'internal-key');
      assert.equal(init.headers?.['x-tenant-id'], 'tenant-1');
      return json({ data: { active: consentActive, granted_at: '2026-11-23T00:00:00Z', epoch: 1 } });
    }
    return new Response('not found', { status: 404 });
  };
}

function baseConfig(fetcher, extra = {}) {
  return {
    issuer: ISSUER,
    clientId: 'ai-client',
    clientSecret: 'client-secret',
    redirectUri: 'https://www.test/api/auth/callback',
    resource: 'https://www.test/ai/api',
    endpointAllowlist: [AUTHORIZE, TOKEN, USERINFO, JWKS],
    sessionSecret: 'test-session-secret-with-more-than-32-characters',
    cookiePrefix: 'ai',
    secureCookies: false,
    allowedNextPrefixes: ['/ai'],
    consentStatus: { endpoint: CONSENT, apiKey: 'internal-key', cacheTtlSeconds: 0 },
    fetch: fetcher,
    ...extra,
  };
}

function cookiesFrom(response) {
  const all = typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
  return all.map((value) => value.split(';')[0]).join('; ');
}

function setCookieHeaders(response) {
  return typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
}

async function beginLogin(auth, next = '/ai/chat') {
  const response = await auth.login(new Request(`https://www.test/api/auth/login?next=${encodeURIComponent(next)}`));
  assert.equal(response.status, 302);
  const location = new URL(response.headers.get('location'));
  return {
    response,
    location,
    state: location.searchParams.get('state'),
    nonce: location.searchParams.get('nonce'),
    cookies: cookiesFrom(response),
  };
}

async function completeLogin({ signer, userinfo, consentActive = true, next = '/ai/chat' }) {
  clearConsentCache();
  clearOidcCache();
  const stateRef = { idToken: '' };
  const calls = [];
  const fetcher = makeMockFetch({ signer, stateRef, userinfo, consentActive, calls });
  const auth = createAiAuth(baseConfig(fetcher));
  const login = await beginLogin(auth, next);
  const now = Math.floor(Date.now() / 1000);
  stateRef.idToken = await signIdToken(signer, {
    iss: ISSUER,
    sub: 'user-1',
    aud: 'ai-client',
    exp: now + 300,
    iat: now,
    nonce: login.nonce,
    tenant_id: 'tenant-1',
  });
  const callback = await auth.callback(
    new Request(`https://www.test/api/auth/callback?code=code-1&state=${encodeURIComponent(login.state)}`, {
      headers: { cookie: login.cookies },
    }),
  );
  return { auth, login, callback, calls, stateRef };
}

test('login builds an OAuth authorize redirect with PKCE and one-shot state cookies', async () => {
  const signer = await makeSigner();
  const calls = [];
  const auth = createAiAuth(baseConfig(makeMockFetch({ signer, stateRef: { idToken: '' }, userinfo: {}, calls })));

  const login = await beginLogin(auth);

  assert.equal(login.location.origin + login.location.pathname, AUTHORIZE);
  assert.equal(login.location.searchParams.get('response_type'), 'code');
  assert.equal(login.location.searchParams.get('client_id'), 'ai-client');
  assert.equal(login.location.searchParams.get('redirect_uri'), 'https://www.test/api/auth/callback');
  assert.equal(login.location.searchParams.get('scope'), 'openid email');
  assert.equal(login.location.searchParams.get('code_challenge_method'), 'S256');
  assert.equal(login.location.searchParams.get('code_challenge').length, 43);
  assert.ok(login.cookies.includes('ai-oauth-state-'));
  assert.ok(login.cookies.includes('ai-browser'));
  for (const cookie of setCookieHeaders(login.response)) {
    assert.match(cookie, /HttpOnly/u);
    assert.match(cookie, /SameSite=Lax/u);
    assert.match(cookie, /Max-Age=600/u);
  }
});

test('callback exchanges the code, verifies the ID token and sets an encrypted session', async () => {
  const signer = await makeSigner();
  const { auth, callback } = await completeLogin({
    signer,
    userinfo: { sub: 'user-1', email: 'user@example.com', email_verified: true },
  });

  assert.equal(callback.status, 302);
  assert.equal(callback.headers.get('location'), 'https://www.test/ai/chat');
  const cookies = setCookieHeaders(callback);
  const sessionCookie = cookies.find((value) => value.startsWith('ai-session='));
  assert.ok(sessionCookie, 'session cookie must be set');
  assert.match(sessionCookie, /HttpOnly/u);
  assert.match(sessionCookie, /SameSite=Lax/u);
  assert.doesNotMatch(sessionCookie, /at-secret-token/u);
  assert.ok(cookies.some((value) => value.startsWith('ai-oauth-state-') && /Max-Age=0/u.test(value)), 'state cookie must be cleared');
  assert.ok(cookies.some((value) => value.startsWith('ai-browser=') && /Max-Age=0/u.test(value)), 'browser nonce must be cleared');

  const sessionResponse = await auth.session(
    new Request('https://www.test/api/auth/session', { headers: { cookie: cookiesFrom(callback) } }),
  );
  assert.equal(sessionResponse.status, 200);
  const body = await sessionResponse.json();
  assert.deepEqual(body.user, {
    sub: 'user-1',
    email: 'user@example.com',
    emailVerified: true,
    tenantId: 'tenant-1',
    issuer: ISSUER,
  });
  assert.ok(setCookieHeaders(sessionResponse).some((value) => value.startsWith('ai-session=')), 'idle expiry must slide');
});

test('callback rejects a missing state cookie', async () => {
  const signer = await makeSigner();
  const stateRef = { idToken: '' };
  const auth = createAiAuth(baseConfig(makeMockFetch({ signer, stateRef, userinfo: {} })));
  const login = await beginLogin(auth);

  const callback = await auth.callback(
    new Request(`https://www.test/api/auth/callback?code=code-1&state=${encodeURIComponent(login.state)}`),
  );
  assert.equal(callback.status, 302);
  assert.match(callback.headers.get('location'), /\/ai\/login\?error=state_invalid$/u);
});

test('callback rejects an ID token nonce mismatch', async () => {
  const signer = await makeSigner();
  const stateRef = { idToken: '' };
  const calls = [];
  const auth = createAiAuth(baseConfig(makeMockFetch({ signer, stateRef, userinfo: { sub: 'user-1', email: 'a@b.c' }, calls })));
  const login = await beginLogin(auth);
  const now = Math.floor(Date.now() / 1000);
  stateRef.idToken = await signIdToken(signer, {
    iss: ISSUER,
    sub: 'user-1',
    aud: 'ai-client',
    exp: now + 300,
    iat: now,
    nonce: 'wrong-nonce',
    tenant_id: 'tenant-1',
  });

  const callback = await auth.callback(
    new Request(`https://www.test/api/auth/callback?code=code-1&state=${encodeURIComponent(login.state)}`, {
      headers: { cookie: login.cookies },
    }),
  );
  assert.match(callback.headers.get('location'), /error=login_failed$/u);
});

test('session fails closed when consent has been revoked', async () => {
  const signer = await makeSigner();
  const { auth, callback } = await completeLogin({
    signer,
    userinfo: { sub: 'user-1', email: 'user@example.com', email_verified: true },
    consentActive: false,
  });
  // Consent is checked during callback too; revoked consent never creates a session.
  assert.match(callback.headers.get('location'), /error=consent_revoked$/u);
  assert.equal(setCookieHeaders(callback).some((value) => value.startsWith('ai-session=')), false);
});

test('session is rejected after consent revocation flips (no cache)', async () => {
  const signer = await makeSigner();
  let consentActive = true;
  const stateRef = { idToken: '' };
  const fetcher = makeMockFetch({ signer, stateRef, userinfo: { sub: 'user-1', email: 'u@e.test' }, consentActive: true });
  const wrapped = async (input, init) => {
    const url = String(input);
    if (url.startsWith(CONSENT)) {
      return json({ data: { active: consentActive } });
    }
    return fetcher(input, init);
  };
  clearConsentCache();
  clearOidcCache();
  const auth = createAiAuth(baseConfig(wrapped));
  const login = await beginLogin(auth);
  const now = Math.floor(Date.now() / 1000);
  stateRef.idToken = await signIdToken(signer, {
    iss: ISSUER,
    sub: 'user-1',
    aud: 'ai-client',
    exp: now + 300,
    iat: now,
    nonce: login.nonce,
    tenant_id: 'tenant-1',
  });
  const callback = await auth.callback(
    new Request(`https://www.test/api/auth/callback?code=code-1&state=${encodeURIComponent(login.state)}`, {
      headers: { cookie: login.cookies },
    }),
  );
  assert.equal(callback.headers.get('location'), 'https://www.test/ai/chat');

  consentActive = false;
  clearConsentCache();
  const session = await auth.session(
    new Request('https://www.test/api/auth/session', { headers: { cookie: cookiesFrom(callback) } }),
  );
  assert.equal(session.status, 200);
  const body = await session.json();
  assert.equal(body.authenticated, false);
  assert.equal(body.error, 'consent_revoked');
});

test('unlisted endpoints fail closed at login', async () => {
  const signer = await makeSigner();
  const auth = createAiAuth(
    baseConfig(makeMockFetch({ signer, stateRef: { idToken: '' }, userinfo: {} }), {
      endpointAllowlist: ['https://api.test/oauth/api/v1/oauth/token'],
    }),
  );
  const response = await auth.login(new Request('https://www.test/api/auth/login'));
  assert.equal(response.status, 302);
  assert.match(response.headers.get('location'), /error=login_unavailable$/u);
});

test('next open redirects are clamped to the allowed prefix', async () => {
  const signer = await makeSigner();
  const { callback } = await completeLogin({
    signer,
    userinfo: { sub: 'user-1', email: 'user@example.com' },
    next: 'https://evil.example/phish',
  });
  assert.equal(callback.headers.get('location'), 'https://www.test/ai/');
});

test('logout clears the session cookie and rejects GET', async () => {
  const signer = await makeSigner();
  const { auth } = await completeLogin({ signer, userinfo: { sub: 'user-1', email: 'u@e.test' } });
  const get = await auth.logout(new Request('https://www.test/api/auth/logout'));
  assert.equal(get.status, 405);
  const post = await auth.logout(new Request('https://www.test/api/auth/logout', { method: 'POST' }));
  assert.equal(post.status, 200);
  assert.ok(setCookieHeaders(post).some((value) => value.startsWith('ai-session=') && /Max-Age=0/u.test(value)));
});

test('mintInternalToken issues a short-lived RS256 JWT bound to the session', async () => {
  const signer = await makeSigner();
  const auth = createAiAuth(
    baseConfig(makeMockFetch({ signer, stateRef: { idToken: '' }, userinfo: {} }), {
      internalJwt: {
        issuer: 'https://bff.test',
        audience: 'https://api.test/ai',
        privateKeyPkcs8: signer.pkcs8Pem,
        kid: 'b1',
        ttlSeconds: 60,
      },
    }),
  );
  const token = await auth.mintInternalToken({
    iss: ISSUER,
    sub: 'user-1',
    tenantId: 'tenant-1',
    clientId: 'ai-client',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    idleExp: Math.floor(Date.now() / 1000) + 1800,
  });
  assert.ok(token);
  const [headerB64, payloadB64, signatureB64] = token.split('.');
  const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString());
  const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
  assert.equal(header.alg, 'RS256');
  assert.equal(header.kid, 'b1');
  assert.equal(payload.iss, 'https://bff.test');
  assert.equal(payload.aud, 'https://api.test/ai');
  assert.equal(payload.sub, `${ISSUER}:user-1`);
  assert.equal(payload.tenant_id, 'tenant-1');
  assert.ok(payload.exp - payload.iat <= 60);
  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    signer.publicKey,
    Buffer.from(signatureB64, 'base64url'),
    encoder.encode(`${headerB64}.${payloadB64}`),
  );
  assert.equal(ok, true);
});
