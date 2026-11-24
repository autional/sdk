import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createAiAuth } from '../dist/index.js';

const TENANT = '01M60J7J1WZRC0K3BSSVS5J6S1';
const USER_ID = '01M86DQGXCWHZAQVVFBR14PET3';

const encoder = new TextEncoder();
function b64url(value) {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}
function fakeIdentityToken(tenantId = TENANT) {
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({ tenant_id: tenantId, sub: USER_ID }));
  return `${header}.${payload}.signature`;
}
function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

function makeAuth(overrides = {}) {
  const calls = [];
  const fetcher = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input.url;
    calls.push({ url, method: init.method ?? 'GET', body: init.body });
    if (url.endsWith('/identity/api/v1/auth/send-verification-email')) {
      return json({ code: 0, data: { expires_in: 600 } });
    }
    if (url.endsWith('/identity/api/v1/auth/login/email-code')) {
      return json({ code: 0, data: { access_token: fakeIdentityToken(), user: { email: 'user@example.com' } } });
    }
    if (url.endsWith('/identity/api/v1/auth/qr-login/initiate')) {
      return json({ code: 0, data: { session_token: 'qr-token', number_matching: '123456', expires_in: 300 } });
    }
    if (url.includes('/identity/api/v1/auth/qr-login/status')) {
      return json({
        code: 0,
        data: { status: 'confirmed', number_matching: '123456', access_token: fakeIdentityToken(), user: { email: 'qr@example.com' } },
      });
    }
    if (url.endsWith('/identity/api/v1/auth/me')) {
      return json({ code: 0, data: { id: USER_ID, email: 'user@example.com', email_verified: true } });
    }
    if (url.endsWith('/internal/oauth/consents')) {
      return json({ code: 0, data: { active: true } });
    }
    if (url.includes('/internal/oauth/consent-status')) {
      return json({ code: 0, data: { active: true } });
    }
    return json({ code: 0, data: {} });
  };
  const auth = createAiAuth(
    {
      issuer: 'https://api.test',
      clientId: 'client-test',
      clientSecret: 'secret-test',
      redirectUri: 'https://app.example.com/api/auth/callback',
      resource: 'https://app.example.com/api',
      sessionSecret: 'x'.repeat(48),
      identity: {
        api: 'https://api.test/bff',
        tenantId: TENANT,
        consentCreate: {
          endpoint: 'https://api.test/bff/oauth/api/v1/internal/oauth/consents',
          apiKey: 'internal-key',
        },
      },
      fetch: fetcher,
      ...overrides,
    },
    { onError: () => {} },
  );
  return { auth, calls };
}

function request(path, init = {}) {
  return new Request(`https://app.example.com${path}`, init);
}

test('embed routes are dispatched before the OAuth login suffix', async () => {
  const { auth, calls } = makeAuth();
  const res = await auth.route(
    request('/api/auth/embed/email/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com' }),
    }),
  );
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.ok(calls.some((c) => c.url.endsWith('/auth/send-verification-email')));
});

test('embed email login issues an encrypted session cookie', async () => {
  const { auth } = makeAuth();
  const res = await auth.route(
    request('/api/auth/embed/email/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', code: '123456' }),
    }),
  );
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.user.email, 'user@example.com');
  assert.equal(body.user.tenantId, TENANT);
  const cookie = res.headers.getSetCookie().join(';');
  assert.match(cookie, /__Host-ai-session=/);
  assert.match(cookie, /HttpOnly/);
});

test('embed QR status confirmed issues a session and keeps the user payload', async () => {
  const { auth } = makeAuth();
  const res = await auth.route(request('/api/auth/embed/qr/status?token=qr-token'));
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'confirmed');
  assert.equal(body.user.email, 'user@example.com');
  assert.match(res.headers.getSetCookie().join(';'), /__Host-ai-session=/);
});

test('embed email login rejects a bad code shape before calling identity', async () => {
  const { auth, calls } = makeAuth();
  const res = await auth.route(
    request('/api/auth/embed/email/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', code: '12' }),
    }),
  );
  assert.equal(res.status, 400);
  assert.equal(calls.some((c) => c.url.endsWith('/auth/login/email-code')), false);
});

test('embed endpoints return 503 when identity is not configured', async () => {
  const { auth } = makeAuth({ identity: undefined });
  const res = await auth.route(request('/api/auth/embed/qr/initiate', { method: 'POST' }));
  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), { error: 'embed_not_configured' });
});
