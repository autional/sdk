/**
 * OAuth client guard (skill 5.2b step 4 / fix plan L1-3).
 *
 * Why: a tenant's *portal* client (`Default Client for <slug>`, `kind=portal`) only
 * whitelists the platform portal hosts. Using it as a third-party app's `appId`
 * passes every build check and then fails on the first real login with
 * `invalid_request: redirect_uri not registered for this client`.
 *
 * This guard rejects that client id *before* any file is written, and offers a
 * machine-checkable probe (`--check-client`) that CI/agents can assert on.
 */

export interface OAuthClientInfo {
  client_name?: string;
  kind?: string;
  tenant_id?: string;
  scopes?: string[];
  is_confidential?: boolean;
}

export type ClientProbe =
  | { status: 'found'; info: OAuthClientInfo }
  | { status: 'not-found' }
  | { status: 'unreachable'; detail: string };

export type GuardVerdict =
  | { status: 'ok'; info: OAuthClientInfo }
  | { status: 'portal'; info: OAuthClientInfo }
  | { status: 'tenant-mismatch'; info: OAuthClientInfo }
  | { status: 'missing-scope'; info: OAuthClientInfo; missing: string[] }
  | { status: 'not-found' }
  | { status: 'unverified'; detail: string };

const PORTAL_NAME_PREFIX = 'Default Client for';

/**
 * `kind=portal` is authoritative; the name prefix is a fallback for servers that
 * predate the `kind` field (L2-3) or for legacy rows.
 */
export function isPortalClient(info: OAuthClientInfo | null | undefined): boolean {
  if (!info) return false;
  if ((info.kind ?? '').trim().toLowerCase() === 'portal') return true;
  return (info.client_name ?? '').trim().startsWith(PORTAL_NAME_PREFIX);
}

export function clientInfoUrl(issuer: string, appId: string): string {
  const base = issuer.replace(/\/+$/, '');
  return `${base}/oauth/api/v1/oauth/client/${encodeURIComponent(appId)}`;
}

/** Public, non-sensitive client metadata (name / kind). Never returns secrets. */
export async function probeClient(
  issuer: string,
  appId: string,
  timeoutMs = 8000,
): Promise<ClientProbe> {
  try {
    const res = await fetch(clientInfoUrl(issuer, appId), {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status === 404) return { status: 'not-found' };
    if (!res.ok) return { status: 'unreachable', detail: `HTTP ${res.status}` };
    const body = (await res.json()) as { data?: OAuthClientInfo };
    return { status: 'found', info: body.data ?? {} };
  } catch (err) {
    return { status: 'unreachable', detail: err instanceof Error ? err.message : String(err) };
  }
}

export interface CheckClientOptions {
  /** Expected tenant id; when set, reject a client owned by another tenant. */
  tenantId?: string;
  /** Required scopes (e.g. openid); missing entries are rejected. */
  requiredScopes?: string[];
}

export async function checkOAuthClient(
  issuer: string,
  appId: string,
  opts: CheckClientOptions = {},
): Promise<GuardVerdict> {
  const probe = await probeClient(issuer, appId);
  if (probe.status === 'not-found') return { status: 'not-found' };
  if (probe.status === 'unreachable') return { status: 'unverified', detail: probe.detail };
  if (isPortalClient(probe.info)) return { status: 'portal', info: probe.info };

  const expectedTenant = (opts.tenantId ?? '').trim();
  if (expectedTenant && probe.info.tenant_id && probe.info.tenant_id !== expectedTenant) {
    return { status: 'tenant-mismatch', info: probe.info };
  }

  const required = (opts.requiredScopes ?? []).map((s) => s.trim()).filter(Boolean);
  if (required.length > 0) {
    const have = new Set(probe.info.scopes ?? []);
    const missing = required.filter((s) => !have.has(s));
    if (missing.length > 0) return { status: 'missing-scope', info: probe.info, missing };
  }

  return { status: 'ok', info: probe.info };
}

/* ------------------------------------------------------------------------- *
 * CORS 预检（skill 5.2b 第 5 步）
 *
 * 为什么：第三方应用浏览器直连换票/取用户信息是跨域请求，浏览器先发预检。
 * 源没登记在**该 client** 的 `cors_origins`（或值与浏览器 Origin 不逐字一致、
 * 或刚登记未到生效窗口 ≤60s）时，服务端照常 200/401，但浏览器读不到响应 ——
 * 表现为「换票在服务端成功、前端却报 CORS」。这条探针在写代码前就能判定。
 *
 * 只发一个 OPTIONS，不携带任何凭据；判据 = 204/200 且 ACAO **逐字**等于该源。
 * ------------------------------------------------------------------------- */

export type CorsProbe =
  | { status: 'ok'; httpStatus: number; echoed: string }
  | { status: 'no-echo'; httpStatus: number; echoed: string | null }
  | { status: 'unreachable'; detail: string }
  | { status: 'invalid-origin'; detail: string };

/** 预检端点 = OIDC 换票端点（与 `/.well-known` 广播的一致；`/bff/oauth/...` 同判定）。 */
export function corsPreflightUrl(issuer: string): string {
  return `${issuer.replace(/\/+$/, '')}/oauth/api/v1/oauth/token`;
}

/**
 * 归一化并校验 Origin：只接受 scheme + host[:port]（无路径/查询/片段/尾斜杠）。
 * 与服务端 `normalizeCorsOrigins` 同口径；带路径的值会被拒绝（登记也过不了）。
 */
export function normalizeOriginInput(origin: string): { ok: true; origin: string } | { ok: false; detail: string } {
  const raw = (origin || '').trim();
  if (!raw) return { ok: false, detail: 'empty origin' };
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return { ok: false, detail: 'not an absolute URL (expected https://host[:port])' };
  }
  if (u.protocol !== 'https:' && !(u.protocol === 'http:' && ['localhost', '127.0.0.1', '::1'].includes(u.hostname))) {
    return { ok: false, detail: 'must use https (http is allowed only for localhost)' };
  }
  if (u.pathname !== '/' || u.search || u.hash || u.username || u.password) {
    return { ok: false, detail: 'origin only: no path / query / fragment / userinfo' };
  }
  return { ok: true, origin: `${u.protocol}//${u.host}` };
}

export async function probeCors(issuer: string, origin: string, timeoutMs = 8000): Promise<CorsProbe> {
  const norm = normalizeOriginInput(origin);
  if (!norm.ok) return { status: 'invalid-origin', detail: norm.detail };
  const want = norm.origin;

  try {
    const res = await fetch(corsPreflightUrl(issuer), {
      method: 'OPTIONS',
      headers: {
        Origin: want,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type',
        Accept: '*/*',
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
    });
    const echoed = res.headers.get('access-control-allow-origin');
    if (echoed && echoed.trim() === want) return { status: 'ok', httpStatus: res.status, echoed: echoed.trim() };
    return { status: 'no-echo', httpStatus: res.status, echoed: echoed ? echoed.trim() : null };
  } catch (err) {
    return { status: 'unreachable', detail: err instanceof Error ? err.message : String(err) };
  }
}

/** Human-readable one-liner for CLI output（含三种失败原因与 60s 生效窗口提示）。 */
export function describeCorsVerdict(origin: string, verdict: CorsProbe): string {
  switch (verdict.status) {
    case 'ok':
      return `CORS OK: ${origin} is registered and echoed (HTTP ${verdict.httpStatus}).`;
    case 'no-echo':
      return [
        `CORS NOT READY for ${origin}: preflight returned HTTP ${verdict.httpStatus} with`,
        verdict.echoed ? `Access-Control-Allow-Origin: ${verdict.echoed} (expected exactly ${origin}).` : 'no Access-Control-Allow-Origin header.',
        'Three causes, in order:',
        '  1) this origin is not on THIS client\'s cors_origins (register it in the admin console);',
        '  2) the registered value is not byte-identical (origin only: no path, no trailing slash);',
        '  3) it was registered just now — the API refreshes the origin set within ~60s; retry after a minute.',
      ].join('\n');
    case 'unreachable':
      return `Could not reach the CORS preflight endpoint (${verdict.detail}). Check the issuer / network, then retry.`;
    case 'invalid-origin':
      return `Invalid origin "${origin}": ${verdict.detail}.`;
  }
}

/** Human-readable one-liner for CLI output. */
export function describeVerdict(appId: string, verdict: GuardVerdict): string {
  switch (verdict.status) {
    case 'ok':
      return `OAuth client OK: ${appId}${verdict.info.client_name ? ` (${verdict.info.client_name})` : ''}`;
    case 'portal': {
      const name = verdict.info.client_name ?? 'Default Client for …';
      const why = verdict.info.kind ? `kind=${verdict.info.kind}` : 'name matches the portal-client pattern';
      return [
        `Refusing appId ${appId}: this is the tenant PORTAL client (${name}, ${why}).`,
        'Its redirect_uris only cover the platform portal hosts, so your app login would fail with',
        '"invalid_request: redirect_uri not registered".',
        'Register a dedicated app client (admin console → OAuth clients), then use ITS client_id as appId.',
      ].join('\n');
    }
    case 'tenant-mismatch':
      return [
        `Refusing appId ${appId}: client belongs to tenant ${verdict.info.tenant_id ?? '(unknown)'},`,
        'but the expected tenant is different. Use a client from the tenant you are onboarding.',
      ].join('\n');
    case 'missing-scope':
      return [
        `Refusing appId ${appId}: client is missing required scope(s): ${verdict.missing.join(' ')}.`,
        'Add them in the admin console → OAuth clients → scopes, then retry.',
      ].join('\n');
    case 'not-found':
      return `OAuth client ${appId} not found on this issuer. Check the client_id (or the --region flag).`;
    case 'unverified':
      return `Could not verify OAuth client ${appId} (${verdict.detail}). Continuing WITHOUT verification — confirm manually that it is your app client, not the portal client.`;
  }
}

/* ------------------------------------------------------------------------- *
 * Authorize 预检（skill 5.2b 第 4 步）
 *
 * 为什么：client_id 用错、redirect_uri 差一个斜杠、或客户端属于别的租户，
 * 构建都能过，但第一次真实登录才报 invalid_request。这个探针在写文件前判定。
 * 只发一个无凭据 GET；PASS = 302 + Location 回指 callback + error=login_required。
 * ------------------------------------------------------------------------- */

export type AuthorizeProbe =
  | { status: 'ok'; httpStatus: number; location: string }
  | { status: 'not-redirected'; httpStatus: number; location: string | null; body?: string }
  | { status: 'unreachable'; detail: string };

const PREFLIGHT_CHALLENGE = 'mR_nE7EeJopQmji77eZUdD4_rLzw5A5HdlRSiLQQCzU';

export function authorizePreflightUrl(issuer: string, appId: string, redirectUri: string): string {
  const base = issuer.replace(/\/+$/, '');
  const q = new URLSearchParams({
    response_type: 'code',
    client_id: appId,
    redirect_uri: redirectUri,
    scope: 'openid',
    state: 'preflight',
    code_challenge: PREFLIGHT_CHALLENGE,
    code_challenge_method: 'S256',
  });
  return `${base}/oauth/api/v1/oauth/authorize?${q.toString()}`;
}

export async function probeAuthorize(
  issuer: string,
  appId: string,
  redirectUri: string,
  timeoutMs = 8000,
): Promise<AuthorizeProbe> {
  try {
    const res = await fetch(authorizePreflightUrl(issuer, appId, redirectUri), {
      headers: { Accept: 'application/json' },
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
    });
    const location = res.headers.get('location');
    if (res.status === 302 && location) {
      const want = redirectUri.replace(/\/+$/, '');
      const got = location.replace(/\/+$/, '');
      if (got.startsWith(want) && got.includes('error=login_required')) {
        return { status: 'ok', httpStatus: res.status, location };
      }
      return { status: 'not-redirected', httpStatus: res.status, location };
    }
    // 200 说明命中了 auth 站 SPA 外壳（不是 API 面），不能当通过。
    const body = res.status === 200 ? (await res.text()).slice(0, 200) : undefined;
    return { status: 'not-redirected', httpStatus: res.status, location, body };
  } catch (err) {
    return { status: 'unreachable', detail: err instanceof Error ? err.message : String(err) };
  }
}

export function describeAuthorizeVerdict(redirectUri: string, verdict: AuthorizeProbe): string {
  switch (verdict.status) {
    case 'ok':
      return `Authorize OK: ${redirectUri} is registered and redirects back to the app.`;
    case 'not-redirected':
      return [
        `Authorize preflight FAILED (HTTP ${verdict.httpStatus}).`,
        verdict.httpStatus === 200
          ? 'HTTP 200 means you hit the auth-site SPA shell, not the API — use the api base (e.g. https://api.autional.cn), not auth.*.'
          : verdict.location
            ? `Location: ${verdict.location}`
            : 'No Location header — redirect_uri is likely not registered for this client.',
        'Register the exact callback in the admin console (byte-identical, no trailing slash) and retry.',
      ].join('\n');
    case 'unreachable':
      return `Could not reach the authorize endpoint (${verdict.detail}). Check the issuer / network, then retry.`;
  }
}
