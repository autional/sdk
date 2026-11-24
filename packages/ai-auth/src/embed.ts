/**
 * Embedded passwordless login (QR / email code).
 *
 * Flow: customer page → this BFF (`/api/auth/embed/*`) → platform identity
 * APIs → BFF holds the identity access token transiently → records consent
 * through the platform internal endpoint → issues the encrypted HttpOnly BFF
 * session. The identity token never reaches the browser.
 */
import { appendSetCookie, serializeCookie } from './cookies.js';
import { newSession, sealSession, sessionCookieName } from './session.js';
import type { AiEmbedHandlers, AiSession } from './types.js';

export interface EmbedIdentityConfig {
  /** Platform identity API base, e.g. `https://api.autional.cn/bff`. */
  api: string;
  /** Tenant that owns the QR/email login flow (the union tenant). */
  tenantId: string;
  /** Internal consent-create endpoint. */
  consentCreateUrl: string;
  /** API key accepted by the internal consent endpoint. */
  internalApiKey: string;
  /** Scopes recorded on the consent row. Default `['openid', 'email']`. */
  scopes?: string[];
}

export interface EmbedContext {
  fetcher: typeof fetch;
  issuer: string;
  clientId: string;
  sessionSecret: string;
  absoluteTtl: number;
  idleTtl: number;
  cookiePrefix: string;
  secureCookies: boolean;
  identity: EmbedIdentityConfig | null;
  onError?: (error: unknown, context: string) => void;
}

function trimSlash(value: string): string {
  return value.replace(/\/+$/u, '');
}

function json(body: unknown, status = 200, headers?: Headers): Response {
  const out = headers ?? new Headers();
  out.set('content-type', 'application/json; charset=utf-8');
  out.set('cache-control', 'no-store');
  out.set('x-content-type-options', 'nosniff');
  out.set('referrer-policy', 'no-referrer');
  out.set('content-security-policy', "default-src 'none'; frame-ancestors 'none'");
  return new Response(JSON.stringify(body), { status, headers: out });
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const normalized = part.replace(/-/gu, '+').replace(/_/gu, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function report(ctx: EmbedContext, error: unknown, context: string): void {
  try {
    ctx.onError?.(error, context);
  } catch {
    // Observability hooks must never break the auth flow.
  }
}

export function createEmbedHandlers(ctx: EmbedContext): AiEmbedHandlers {
  const identity = ctx.identity;
  const identityBase = identity ? trimSlash(identity.api) : '';

  async function identityFetch(path: string, init: RequestInit = {}): Promise<{ res: Response; body: any }> {
    const res = await ctx.fetcher(`${identityBase}${path}`, init);
    const body = (await res.json().catch(() => null)) as any;
    return { res, body };
  }

  async function identityMe(token: string, tenantId: string): Promise<any | null> {
    const { res, body } = await identityFetch('/identity/api/v1/auth/me', {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        'x-tenant-id': tenantId,
      },
    });
    if (res.status !== 200 || body?.code !== 0) return null;
    return body.data ?? null;
  }

  async function recordConsent(userId: string, tenantId: string): Promise<void> {
    if (!identity) throw new Error('embed is not configured');
    const res = await ctx.fetcher(identity.consentCreateUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-api-key': identity.internalApiKey,
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify({
        user_id: userId,
        client_id: ctx.clientId,
        scopes: identity.scopes ?? ['openid', 'email'],
      }),
    });
    const body = (await res.json().catch(() => null)) as any;
    if (res.status !== 200 || body?.code !== 0) {
      throw new Error(`consent record failed: HTTP ${res.status}`);
    }
  }

  async function sessionResponse(token: string, emailHint?: string): Promise<Response> {
    const claims = decodeJwtPayload(token);
    const tenantId = typeof claims?.tenant_id === 'string' ? claims.tenant_id : '';
    if (!tenantId) throw new Error('identity token has no tenant_id');
    const me = await identityMe(token, tenantId);
    if (!me?.id) throw new Error('identity /me failed');
    await recordConsent(String(me.id), tenantId);

    const email = typeof me.email === 'string' && me.email ? me.email : emailHint;
    const emailVerified = typeof me.email_verified === 'boolean' ? me.email_verified : me.emailVerified;
    const session: AiSession = newSession({
      iss: ctx.issuer,
      sub: String(me.id),
      tenantId,
      clientId: ctx.clientId,
      ...(email ? { email } : {}),
      ...(typeof emailVerified === 'boolean' ? { emailVerified } : {}),
      ttl: { absoluteSeconds: ctx.absoluteTtl, idleSeconds: ctx.idleTtl },
    });
    const sealed = await sealSession(ctx.sessionSecret, session);
    const headers = new Headers();
    appendSetCookie(
      headers,
      serializeCookie(sessionCookieName(ctx.cookiePrefix), sealed, {
        secure: ctx.secureCookies,
        httpOnly: true,
        sameSite: 'Lax',
        path: '/',
      }),
    );
    return json(
      {
        user: {
          sub: session.sub,
          email: session.email ?? null,
          tenantId: session.tenantId,
        },
      },
      200,
      headers,
    );
  }

  function notConfigured(): Response | null {
    return identity ? null : json({ error: 'embed_not_configured' }, 503);
  }

  async function sendEmail(request: Request): Promise<Response> {
    const missing = notConfigured();
    if (missing) return missing;
    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
    const body = (await request.json().catch(() => null)) as any;
    const email = String(body?.email ?? '').trim();
    if (!email) return json({ error: 'email_required' }, 400);
    const { res, body: rb } = await identityFetch('/identity/api/v1/auth/send-verification-email', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ email, tenant_id: identity!.tenantId }),
    });
    if (res.status !== 200 || rb?.code !== 0) return json({ error: 'send_failed' }, 502);
    return json({ ok: true });
  }

  async function loginEmail(request: Request): Promise<Response> {
    const missing = notConfigured();
    if (missing) return missing;
    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
    const body = (await request.json().catch(() => null)) as any;
    const email = String(body?.email ?? '').trim();
    const code = String(body?.code ?? '').trim();
    if (!email || !/^\d{6}$/u.test(code)) return json({ error: 'invalid_input' }, 400);
    const { res, body: rb } = await identityFetch('/identity/api/v1/auth/login/email-code', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ email, code, tenant_id: identity!.tenantId }),
    });
    if (res.status !== 200 || rb?.code !== 0) {
      if (rb?.data?.requires_mfa || rb?.requires_mfa) return json({ error: 'mfa_required' }, 401);
      return json({ error: 'login_failed' }, 401);
    }
    const token = rb?.data?.access_token;
    if (typeof token !== 'string' || !token) return json({ error: 'login_failed' }, 502);
    try {
      return await sessionResponse(token, rb?.data?.user?.email || email);
    } catch (error) {
      report(ctx, error, 'embed_email_session');
      return json({ error: 'login_failed' }, 502);
    }
  }

  async function qrInitiate(request: Request): Promise<Response> {
    const missing = notConfigured();
    if (missing) return missing;
    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
    const { res, body } = await identityFetch('/identity/api/v1/auth/qr-login/initiate', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ tenant_id: identity!.tenantId }),
    });
    if (res.status !== 200 || body?.code !== 0) return json({ error: 'qr_initiate_failed' }, 502);
    const data = body.data ?? {};
    return json({
      sessionToken: data.session_token,
      numberMatching: data.number_matching,
      expiresIn: data.expires_in ?? 300,
    });
  }

  async function qrStatus(request: Request): Promise<Response> {
    const missing = notConfigured();
    if (missing) return missing;
    if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405);
    const token = new URL(request.url).searchParams.get('token') || '';
    if (!token) return json({ error: 'token_required' }, 400);
    const { res, body } = await identityFetch(
      `/identity/api/v1/auth/qr-login/status?token=${encodeURIComponent(token)}`,
      { headers: { accept: 'application/json' } },
    );
    if (res.status !== 200 || body?.code !== 0) return json({ error: 'qr_status_failed' }, 502);
    const data = body.data ?? {};
    const status = String(data.status || 'pending');
    const out = {
      status,
      numberMatching: data.number_matching,
      superseded: data.superseded === true,
    };
    if (status !== 'confirmed') return json(out);
    if (!data.access_token) return json({ ...out, status: 'no_token' });
    try {
      const response = await sessionResponse(data.access_token, data.user?.email);
      const payload = (await response.json()) as any;
      const headers = new Headers(response.headers);
      headers.set('content-type', 'application/json; charset=utf-8');
      return new Response(JSON.stringify({ ...out, user: payload.user }), { status: 200, headers });
    } catch (error) {
      report(ctx, error, 'embed_qr_session');
      return json({ error: 'login_failed' }, 502);
    }
  }

  async function qrRevoke(request: Request): Promise<Response> {
    const missing = notConfigured();
    if (missing) return missing;
    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
    const body = (await request.json().catch(() => null)) as any;
    const token = String(body?.token ?? '');
    if (token) {
      await identityFetch('/identity/api/v1/auth/qr-login/revoke', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ token }),
      }).catch(() => undefined);
    }
    return json({ ok: true });
  }

  return { sendEmail, loginEmail, qrInitiate, qrStatus, qrRevoke };
}
