/**
 * BFF login handler: OAuth 2.0 Authorization Code + PKCE (S256), OIDC nonce,
 * encrypted HttpOnly session, consent-revocation check and an optional
 * BFF→AI internal JWT.
 *
 * Runtime target: any Web `Request`/`Response` environment (Cloudflare Workers,
 * Vercel Edge, Node 20+). No tokens are persisted anywhere.
 */

import {
  base64UrlEncode,
  base64UrlDecode,
  decryptJson,
  encryptJson,
  fromUtf8,
  importRs256PrivateKey,
  randomBytes,
  safeEqual,
  sha256Base64Url,
  signRs256,
  utf8,
} from './crypto.js';
import { appendSetCookie, clearCookie, readCookie, serializeCookie } from './cookies.js';
import { createConsentChecker } from './consent.js';
import { createEmbedHandlers } from './embed.js';
import { createEndpointResolver, pkceChallenge, verifyIdToken } from './oidc.js';
import { newSession, openSession, sealSession, sessionCookieName, touchSession } from './session.js';
import type { AiAuth, AiAuthConfig, AiSession, TokenResponse, UserInfoResponse } from './types.js';

const DEFAULT_SCOPES = ['openid', 'email'];
const DEFAULT_ABSOLUTE_TTL = 8 * 60 * 60;
const DEFAULT_IDLE_TTL = 30 * 60;
const DEFAULT_STATE_TTL = 10 * 60;

interface NormalizedConfig {
  raw: AiAuthConfig;
  onError?: (error: unknown, context: string) => void;
  issuer: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  resource: string;
  siteOrigin: string;
  scopes: string[];
  sessionSecret: string;
  absoluteTtl: number;
  idleTtl: number;
  stateTtl: number;
  cookiePrefix: string;
  secureCookies: boolean;
  allowedNextPrefixes: string[];
  loginPath: string;
  requireEmail: boolean;
  fetcher: typeof fetch;
  identity: {
    api: string;
    tenantId: string;
    consentCreateUrl: string;
    internalApiKey: string;
    scopes: string[];
  } | null;
}

interface StatePayload {
  v: 1;
  state: string;
  nonce: string;
  verifier: string;
  next: string;
  browserNonce: string;
  expiresAt: number;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function normalizeConfig(config: AiAuthConfig): NormalizedConfig {
  if (!isNonEmptyString(config.issuer)) throw new Error('ai-auth: issuer is required');
  if (!isNonEmptyString(config.clientId)) throw new Error('ai-auth: clientId is required');
  if (!isNonEmptyString(config.clientSecret)) throw new Error('ai-auth: clientSecret is required');
  if (!isNonEmptyString(config.redirectUri)) throw new Error('ai-auth: redirectUri is required');
  if (!isNonEmptyString(config.resource)) throw new Error('ai-auth: resource is required');
  if (!isNonEmptyString(config.sessionSecret) || config.sessionSecret.length < 32) {
    throw new Error('ai-auth: sessionSecret must be at least 32 characters');
  }
  const redirect = new URL(config.redirectUri);
  if (redirect.protocol !== 'https:' && !config.allowInsecureHttp) {
    throw new Error('ai-auth: redirectUri must use https');
  }
  const issuer = config.issuer.replace(/\/+$/u, '');
  const scopes = (config.scopes ?? DEFAULT_SCOPES).map((scope) => scope.trim()).filter(Boolean);
  if (scopes.length === 0) throw new Error('ai-auth: scopes must not be empty');
  for (const required of ['openid', 'email']) {
    if (!scopes.includes(required)) throw new Error(`ai-auth: scope '${required}' is required`);
  }
  const cookiePrefix = config.cookiePrefix ?? '__Host-ai';
  const secureCookies = config.secureCookies ?? true;
  if (cookiePrefix.startsWith('__Host-') && !secureCookies) {
    throw new Error('ai-auth: __Host- cookies require secureCookies=true; use cookiePrefix "ai" for local http');
  }
  const allowedNextPrefixes = (config.allowedNextPrefixes ?? ['/ai']).map((prefix) =>
    prefix.endsWith('/') ? prefix.slice(0, -1) || '/' : prefix,
  );
  let identity: NormalizedConfig['identity'] = null;
  if (config.identity) {
    const api = config.identity.api.replace(/\/+$/u, '');
    if (!/^https:\/\//u.test(api) && !config.allowInsecureHttp) {
      throw new Error('ai-auth: identity.api must use https');
    }
    if (!isNonEmptyString(config.identity.tenantId)) {
      throw new Error('ai-auth: identity.tenantId is required');
    }
    const consentEndpoint = config.identity.consentCreate?.endpoint ?? '';
    const consentApiKey = config.identity.consentCreate?.apiKey ?? '';
    if (!/^https:\/\//u.test(consentEndpoint) && !config.allowInsecureHttp) {
      throw new Error('ai-auth: identity.consentCreate.endpoint must use https');
    }
    if (!isNonEmptyString(consentApiKey)) {
      throw new Error('ai-auth: identity.consentCreate.apiKey is required');
    }
    identity = {
      api,
      tenantId: config.identity.tenantId,
      consentCreateUrl: consentEndpoint,
      internalApiKey: consentApiKey,
      scopes: config.identity.scopes ?? DEFAULT_SCOPES,
    };
  }
  return {
    raw: config,
    ...(config.onError ? { onError: config.onError } : {}),
    issuer,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
    resource: config.resource,
    siteOrigin: redirect.origin,
    scopes,
    sessionSecret: config.sessionSecret,
    absoluteTtl: config.sessionAbsoluteTtlSeconds ?? DEFAULT_ABSOLUTE_TTL,
    idleTtl: config.sessionIdleTtlSeconds ?? DEFAULT_IDLE_TTL,
    stateTtl: config.stateTtlSeconds ?? DEFAULT_STATE_TTL,
    cookiePrefix,
    secureCookies,
    allowedNextPrefixes,
    loginPath: '/ai/login',
    requireEmail: config.requireEmail ?? true,
    fetcher: config.fetch ?? fetch,
    identity,
  };
}

function cookieOptions(config: NormalizedConfig, maxAgeSeconds?: number) {
  return {
    secure: config.secureCookies,
    httpOnly: true as const,
    sameSite: 'Lax' as const,
    path: '/',
    ...(maxAgeSeconds !== undefined ? { maxAgeSeconds } : {}),
  };
}

function stateCookieName(config: NormalizedConfig, stateHash: string): string {
  return `${config.cookiePrefix}-oauth-state-${stateHash}`;
}

function browserCookieName(config: NormalizedConfig): string {
  return `${config.cookiePrefix}-browser`;
}

function defaultNext(config: NormalizedConfig): string {
  const first = config.allowedNextPrefixes[0];
  if (!first || first === '/') return '/';
  return `${first}/`;
}

function sanitizeNext(config: NormalizedConfig, raw: string | null): string {
  const fallback = defaultNext(config);
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.includes('\\') || /[\r\n]/u.test(raw)) {
    return fallback;
  }
  let url: URL;
  try {
    url = new URL(raw, config.siteOrigin);
  } catch {
    return fallback;
  }
  if (url.origin !== config.siteOrigin) return fallback;
  const pathname = url.pathname;
  const allowed = config.allowedNextPrefixes.some((prefix) => {
    if (prefix === '/') return true;
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
  if (!allowed) return fallback;
  return `${pathname}${url.search}${url.hash}`;
}

function loginErrorRedirect(config: NormalizedConfig, code: string, headers?: Headers): Response {
  const url = new URL(config.loginPath, config.siteOrigin);
  url.searchParams.set('error', code);
  return redirect(url.toString(), headers);
}

function redirect(location: string, headers?: Headers): Response {
  const finalHeaders = headers ?? new Headers();
  finalHeaders.set('location', location);
  finalHeaders.set('cache-control', 'no-store');
  return new Response(null, { status: 302, headers: finalHeaders });
}

function jsonResponse(body: unknown, status = 200, headers?: Headers): Response {
  const finalHeaders = headers ?? new Headers();
  finalHeaders.set('content-type', 'application/json; charset=utf-8');
  finalHeaders.set('cache-control', 'no-store');
  finalHeaders.set('x-content-type-options', 'nosniff');
  finalHeaders.set('referrer-policy', 'no-referrer');
  finalHeaders.set('content-security-policy', "default-src 'none'; frame-ancestors 'none'");
  return new Response(JSON.stringify(body), { status, headers: finalHeaders });
}

function methodNotAllowed(): Response {
  return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
    status: 405,
    headers: { 'content-type': 'application/json; charset=utf-8', allow: 'GET, POST' },
  });
}

function reportError(config: NormalizedConfig, error: unknown, context: string): void {
  try {
    config.onError?.(error, context);
  } catch {
    // Observability hooks must never break the auth flow.
  }
}

async function exchangeCode(
  config: NormalizedConfig,
  endpoints: { token: string },
  code: string,
  verifier: string,
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.redirectUri,
    code_verifier: verifier,
  });
  const basic = btoa(`${config.clientId}:${config.clientSecret}`);
  const response = await config.fetcher(endpoints.token, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
      authorization: `Basic ${basic}`,
    },
    body: body.toString(),
  });
  if (!response.ok) throw new Error(`token endpoint returned HTTP ${response.status}`);
  const payload = (await response.json()) as Partial<TokenResponse> & { error?: string };
  if (payload.error) throw new Error(`token endpoint error: ${payload.error}`);
  if (!isNonEmptyString(payload.access_token) || !isNonEmptyString(payload.id_token)) {
    throw new Error('token response is missing access_token/id_token');
  }
  if (String(payload.token_type ?? '').toLowerCase() !== 'bearer') {
    throw new Error('token response token_type is not Bearer');
  }
  return payload as TokenResponse;
}

async function fetchUserInfo(
  config: NormalizedConfig,
  endpoints: { userinfo: string },
  accessToken: string,
): Promise<UserInfoResponse> {
  const response = await config.fetcher(endpoints.userinfo, {
    headers: { authorization: `Bearer ${accessToken}`, accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`userinfo returned HTTP ${response.status}`);
  const payload = (await response.json()) as UserInfoResponse;
  if (!isNonEmptyString(payload.sub)) throw new Error('userinfo is missing sub');
  return payload;
}

function sessionCookieNameFor(config: NormalizedConfig): string {
  return sessionCookieName(config.cookiePrefix);
}

function readSessionCookie(config: NormalizedConfig, request: Request): string | null {
  return readCookie(request, sessionCookieNameFor(config));
}

async function issueSessionCookie(config: NormalizedConfig, headers: Headers, session: AiSession): Promise<void> {
  const sealed = await sealSession(config.sessionSecret, session);
  appendSetCookie(headers, serializeCookie(sessionCookieNameFor(config), sealed, cookieOptions(config)));
}

export interface CreateAiAuthHooks {
  onError?: (error: unknown, context: string) => void;
}

export function createAiAuth(configInput: AiAuthConfig, hooks: CreateAiAuthHooks = {}): AiAuth {
  const config = normalizeConfig({
    ...configInput,
    ...(hooks.onError ? { onError: hooks.onError } : {}),
  } as AiAuthConfig);
  const endpoints = createEndpointResolver({
    ...config.raw,
    issuer: config.issuer,
    fetch: config.fetcher,
    allowInsecureHttp: config.raw.allowInsecureHttp,
  });
  const consent = createConsentChecker({ ...config.raw, fetch: config.fetcher });
  const embed = createEmbedHandlers({
    fetcher: config.fetcher,
    issuer: config.issuer,
    clientId: config.clientId,
    sessionSecret: config.sessionSecret,
    absoluteTtl: config.absoluteTtl,
    idleTtl: config.idleTtl,
    cookiePrefix: config.cookiePrefix,
    secureCookies: config.secureCookies,
    identity: config.identity,
    ...(config.onError ? { onError: config.onError } : {}),
  });
  let privateKey: Promise<CryptoKey> | null = null;

  async function login(request: Request): Promise<Response> {
    if (request.method !== 'GET') return methodNotAllowed();
    try {
      const url = new URL(request.url);
      const next = sanitizeNext(config, url.searchParams.get('next'));
      const resolved = await endpoints();
      const state = base64UrlEncode(randomBytes(32));
      const nonce = base64UrlEncode(randomBytes(32));
      const verifier = base64UrlEncode(randomBytes(32));
      const browserNonce = base64UrlEncode(randomBytes(32));
      const challenge = await pkceChallenge(verifier);
      const stateHash = (await sha256Base64Url(state)).slice(0, 16);
      const payload: StatePayload = {
        v: 1,
        state,
        nonce,
        verifier,
        next,
        browserNonce,
        expiresAt: Math.floor(Date.now() / 1000) + config.stateTtl,
      };
      const stateCookie = await encryptJson(config.sessionSecret, payload);
      const headers = new Headers();
      appendSetCookie(headers, serializeCookie(stateCookieName(config, stateHash), stateCookie, cookieOptions(config, config.stateTtl)));
      appendSetCookie(headers, serializeCookie(browserCookieName(config), browserNonce, cookieOptions(config, config.stateTtl)));

      const authorize = new URL(resolved.authorize);
      authorize.searchParams.set('response_type', 'code');
      authorize.searchParams.set('client_id', config.clientId);
      authorize.searchParams.set('redirect_uri', config.redirectUri);
      authorize.searchParams.set('scope', config.scopes.join(' '));
      authorize.searchParams.set('state', state);
      authorize.searchParams.set('nonce', nonce);
      authorize.searchParams.set('code_challenge', challenge);
      authorize.searchParams.set('code_challenge_method', 'S256');
      return redirect(authorize.toString(), headers);
    } catch (error) {
      reportError(config, error, 'login');
      return loginErrorRedirect(config, 'login_unavailable');
    }
  }

  async function callback(request: Request): Promise<Response> {
    if (request.method !== 'GET') return methodNotAllowed();
    const headers = new Headers();
    let stateHashForClear = '';
    const fail = (code: string): Response => {
      const clearHeaders = new Headers();
      if (stateHashForClear) {
        appendSetCookie(clearHeaders, clearCookie(stateCookieName(config, stateHashForClear), cookieOptions(config)));
      }
      appendSetCookie(clearHeaders, clearCookie(browserCookieName(config), cookieOptions(config)));
      return loginErrorRedirect(config, code, clearHeaders);
    };
    try {
      const url = new URL(request.url);
      const oauthError = url.searchParams.get('error');
      if (oauthError) {
        return fail(oauthError === 'access_denied' ? 'access_denied' : 'login_failed');
      }
      const state = url.searchParams.get('state') ?? '';
      const code = url.searchParams.get('code') ?? '';
      if (!state || !code) return fail('state_invalid');

      stateHashForClear = (await sha256Base64Url(state)).slice(0, 16);
      const sealedState = readCookie(request, stateCookieName(config, stateHashForClear));
      if (!sealedState) return fail('state_invalid');
      const payload = await decryptJson<StatePayload>(config.sessionSecret, sealedState);
      if (!payload || payload.v !== 1 || !safeEqual(payload.state, state)) {
        return fail('state_invalid');
      }
      if (payload.expiresAt <= Math.floor(Date.now() / 1000)) {
        return fail('state_expired');
      }
      const browserNonce = readCookie(request, browserCookieName(config)) ?? '';
      if (!safeEqual(payload.browserNonce, browserNonce)) {
        return fail('state_invalid');
      }

      const resolved = await endpoints();
      const tokens = await exchangeCode(config, resolved, code, payload.verifier);
      const claims = await verifyIdToken({
        token: tokens.id_token as string,
        issuer: config.issuer,
        clientId: config.clientId,
        nonce: payload.nonce,
        accessToken: tokens.access_token,
        jwksUri: resolved.jwks,
        fetcher: config.fetcher,
        allowInsecureHttp: config.raw.allowInsecureHttp === true,
      });
      const userInfo = await fetchUserInfo(config, resolved, tokens.access_token);
      if (!safeEqual(userInfo.sub, claims.sub)) {
        throw new Error('userinfo sub does not match ID token sub');
      }
      if (config.requireEmail && !isNonEmptyString(userInfo.email)) {
        return fail('email_required');
      }
      const session = newSession({
        iss: config.issuer,
        sub: claims.sub,
        tenantId: claims.tenant_id as string,
        clientId: config.clientId,
        ...(isNonEmptyString(userInfo.email) ? { email: userInfo.email } : {}),
        ...(typeof userInfo.email_verified === 'boolean' ? { emailVerified: userInfo.email_verified } : {}),
        ttl: { absoluteSeconds: config.absoluteTtl, idleSeconds: config.idleTtl },
      });
      if (consent && !(await consent(session))) {
        return fail('consent_revoked');
      }
      // Successful path: clear the one-shot state cookies alongside the new session.
      if (stateHashForClear) {
        appendSetCookie(headers, clearCookie(stateCookieName(config, stateHashForClear), cookieOptions(config)));
      }
      appendSetCookie(headers, clearCookie(browserCookieName(config), cookieOptions(config)));
      await issueSessionCookie(config, headers, session);
      return redirect(new URL(payload.next || defaultNext(config), config.siteOrigin).toString(), headers);
    } catch (error) {
      reportError(config, error, 'callback');
      return fail('login_failed');
    }
  }

  async function loadSession(request: Request): Promise<{ session: AiSession; headers: Headers } | { response: Response }> {
    const headers = new Headers();
    const raw = readSessionCookie(config, request);
    if (!raw) return { response: jsonResponse({ authenticated: false }, 200, headers) };
    const opened = await openSession(config.sessionSecret, raw);
    if (!opened) return { response: jsonResponse({ authenticated: false }, 200, headers) };
    const touched = touchSession(opened, config.idleTtl);
    if (!touched) {
      appendSetCookie(headers, clearCookie(sessionCookieNameFor(config), cookieOptions(config)));
      return { response: jsonResponse({ authenticated: false }, 200, headers) };
    }
    if (consent && !(await consent(touched))) {
      appendSetCookie(headers, clearCookie(sessionCookieNameFor(config), cookieOptions(config)));
      return { response: jsonResponse({ authenticated: false, error: 'consent_revoked' }, 200, headers) };
    }
    await issueSessionCookie(config, headers, touched);
    return { session: touched, headers };
  }

  async function session(request: Request): Promise<Response> {
    if (request.method !== 'GET') return methodNotAllowed();
    const result = await loadSession(request);
    if ('response' in result) return result.response;
    return jsonResponse(
      {
        authenticated: true,
        user: {
          sub: result.session.sub,
          email: result.session.email ?? null,
          emailVerified: result.session.emailVerified ?? false,
          tenantId: result.session.tenantId,
          issuer: result.session.iss,
        },
      },
      200,
      result.headers,
    );
  }

  async function logout(request: Request): Promise<Response> {
    if (request.method !== 'POST') return methodNotAllowed();
    const headers = new Headers();
    appendSetCookie(headers, clearCookie(sessionCookieNameFor(config), cookieOptions(config)));
    return jsonResponse({ ok: true }, 200, headers);
  }

  async function getUser(request: Request): Promise<AiSession | null> {
    const raw = readSessionCookie(config, request);
    if (!raw) return null;
    const opened = await openSession(config.sessionSecret, raw);
    if (!opened) return null;
    const touched = touchSession(opened, config.idleTtl);
    if (!touched) return null;
    if (consent && !(await consent(touched))) return null;
    return touched;
  }

  async function mintInternalToken(sessionValue: AiSession): Promise<string | null> {
    const settings = config.raw.internalJwt;
    if (!settings) return null;
    privateKey ??= importRs256PrivateKey(settings.privateKeyPkcs8);
    const now = Math.floor(Date.now() / 1000);
    const ttl = Math.min(Math.max(settings.ttlSeconds ?? 60, 1), 60);
    const header = { alg: 'RS256', typ: 'JWT', kid: settings.kid };
    const payload = {
      iss: settings.issuer,
      sub: `${sessionValue.iss}:${sessionValue.sub}`,
      aud: settings.audience,
      tenant_id: sessionValue.tenantId,
      client_id: sessionValue.clientId,
      iat: now,
      exp: now + ttl,
      jti: base64UrlEncode(randomBytes(16)),
    };
    const signingInput = `${base64UrlEncode(utf8(JSON.stringify(header)))}.${base64UrlEncode(utf8(JSON.stringify(payload)))}`;
    const signature = await signRs256(await privateKey, utf8(signingInput));
    return `${signingInput}.${base64UrlEncode(signature)}`;
  }

  async function route(request: Request): Promise<Response> {
    let pathname: string;
    try {
      pathname = new URL(request.url).pathname.replace(/\/+$/u, '');
    } catch {
      return jsonResponse({ error: 'bad_request' }, 400);
    }
    // Embedded endpoints must be matched before the OAuth suffixes: otherwise
    // `/embed/email/login` would be dispatched as the OAuth login handler.
    if (pathname.endsWith('/embed/email/send')) return embed.sendEmail(request);
    if (pathname.endsWith('/embed/email/login')) return embed.loginEmail(request);
    if (pathname.endsWith('/embed/qr/initiate')) return embed.qrInitiate(request);
    if (pathname.endsWith('/embed/qr/status')) return embed.qrStatus(request);
    if (pathname.endsWith('/embed/qr/revoke')) return embed.qrRevoke(request);
    if (pathname.endsWith('/login')) return login(request);
    if (pathname.endsWith('/callback')) return callback(request);
    if (pathname.endsWith('/session')) return session(request);
    if (pathname.endsWith('/logout')) return logout(request);
    return jsonResponse({ error: 'not_found' }, 404);
  }

  return { route, embed, login, callback, session, logout, getUser, mintInternalToken };
}

// Re-export helpers used by adapters/tests without expanding the public surface too much.
export { base64UrlDecode, fromUtf8 };
