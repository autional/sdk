import { describe, it, expect, afterEach, vi } from 'vitest';
import { TokenManager } from '../token-manager';
import { AuthClient } from '../auth-client';
import type { Discovery } from '../discovery';
import type { StorageAdapter } from '../platform/types';

class MockStorage implements StorageAdapter {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
}

interface RecordedRequest { url: string; method: string; body: string; headers: Record<string, string> }

/** 支持顺序响应（数组按序 shift）；对象响应可重复返回 */
function createMockHttp(responses: Record<string, unknown>) {
  const requests: RecordedRequest[] = [];
  return {
    request: async (url: string, init?: RequestInit) => {
      const method = init?.method || 'GET';
      requests.push({ url, method, body: (init?.body as string) || '', headers: (init?.headers as Record<string, string>) || {} });
      const key = `${method} ${url}`;
      const entry = responses[key];
      const res = Array.isArray(entry) ? entry.shift() : entry;
      if (!res) {
        return new Response(JSON.stringify({ code: 404, message: `Unexpected: ${key}` }), { status: 404 });
      }
      const status = (res as any).__status || 200;
      return new Response(JSON.stringify(res), { status, headers: { 'Content-Type': 'application/json' } });
    },
    getRequests: () => requests,
    getLastRequest: () => requests.length ? requests[requests.length - 1] : null,
  };
}

function createToken(expInSeconds = 900): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: 'user-1', user_id: 'user-1', tenant_id: 'tenant-1', exp: Math.floor(Date.now() / 1000) + expInSeconds }));
  return `${header}.${payload}.sig`;
}

const BASE_URL = 'https://api.example.com';

const AUTH_CONFIG_KEY = `GET ${BASE_URL}/identity/api/v1/public/auth-config/default`;
const FORGOT_KEY = `POST ${BASE_URL}/identity/api/v1/auth/forgot-password`;
const RESET_KEY = `POST ${BASE_URL}/identity/api/v1/auth/reset-password`;
const SEND_VE_KEY = `POST ${BASE_URL}/identity/api/v1/auth/send-verification-email`;
const VERIFY_EMAIL_KEY = `POST ${BASE_URL}/identity/api/v1/auth/verify-email`;
const UPDATE_PROFILE_KEY = `PUT ${BASE_URL}/identity/api/v1/auth/me`;
const SESSIONS_P2_KEY = `GET ${BASE_URL}/identity/api/v1/auth/me/sessions?page=2&page_size=10`;
const REVOKE_SESSION_KEY = `DELETE ${BASE_URL}/identity/api/v1/auth/me/sessions/sess%2F1`;
const REVOKE_OTHERS_KEY = `DELETE ${BASE_URL}/identity/api/v1/auth/me/sessions`;
const REAUTH_KEY = `POST ${BASE_URL}/identity/api/v1/auth/me/reauthenticate`;
const DELETE_ACCOUNT_KEY = `POST ${BASE_URL}/identity/api/v1/auth/me/delete-account`;
const REVOKE_EP = `${BASE_URL}/oauth/api/v1/oauth/revoke`;
const REVOKE_KEY = `POST ${REVOKE_EP}`;

function plainAuthConfig() {
  return {
    data: {
      tenant_id: 't1',
      login_methods: ['password'],
      password_policy: { password_transmission: 'plain', min_length: 8 },
      captcha_enabled: false,
    },
  };
}

describe('AuthClient self-service (B2C)', () => {
  let storage: MockStorage;
  let tokenManager: TokenManager;
  let mockHttp: ReturnType<typeof createMockHttp>;
  let client: AuthClient;

  function setupClient(responses: Record<string, unknown>, options?: { appId?: string; discovery?: Discovery }) {
    mockHttp = createMockHttp(responses);
    storage = new MockStorage();
    tokenManager = new TokenManager(storage);
    client = new AuthClient({
      tokenManager,
      http: mockHttp,
      baseUrl: BASE_URL,
      appId: options?.appId ?? 'app-1',
      discovery: options?.discovery,
    });
  }

  function authenticate(): string {
    const at = createToken();
    tokenManager.setTokens(at, 'rt-1', 900);
    return at;
  }

  function parseBody(body: string): Record<string, unknown> {
    return JSON.parse(body) as Record<string, unknown>;
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // ── 密码找回 / 邮箱验证 ─────────────────────────────────────────
  it('forgotPassword posts the identity', async () => {
    setupClient({ [FORGOT_KEY]: { code: 0, data: {} } });

    await client.forgotPassword('user@example.com');

    expect(parseBody(mockHttp.getLastRequest()!.body)).toEqual({ identity: 'user@example.com' });
  });

  it('forgotPassword surfaces server errors', async () => {
    setupClient({ [FORGOT_KEY]: { code: '400001', message: 'rate limited', __status: 429 } });

    await expect(client.forgotPassword('user@example.com')).rejects.toMatchObject({
      name: 'AutionalAuthError',
      code: '400001',
      message: 'rate limited',
      status: 429,
    });
  });

  it('resetPassword preprocesses the new password per tenant policy', async () => {
    setupClient({ [AUTH_CONFIG_KEY]: plainAuthConfig(), [RESET_KEY]: { code: 0, data: {} } });

    await client.resetPassword({ identity: 'user@example.com', code: '123456', newPassword: 'newpass1' });

    expect(parseBody(mockHttp.getLastRequest()!.body)).toEqual({
      identity: 'user@example.com',
      code: '123456',
      new_password: 'newpass1',
      password_transmission: 'plain',
    });
  });

  it('sendVerificationEmail returns expiresIn from data', async () => {
    setupClient({ [SEND_VE_KEY]: { code: 0, data: { expires_in: 300 } } });

    const res = await client.sendVerificationEmail('user@example.com');

    expect(res).toEqual({ expiresIn: 300 });
    expect(parseBody(mockHttp.getLastRequest()!.body)).toEqual({ email: 'user@example.com' });
  });

  it('verifyEmail posts email + code', async () => {
    setupClient({ [VERIFY_EMAIL_KEY]: { code: 0, data: {} } });

    await client.verifyEmail('user@example.com', '654321');

    expect(parseBody(mockHttp.getLastRequest()!.body)).toEqual({ email: 'user@example.com', code: '654321' });
  });

  // ── 资料 / 会话管理 ─────────────────────────────────────────────
  it('updateProfile sends only provided fields (partial update) with auth header', async () => {
    setupClient({ [UPDATE_PROFILE_KEY]: { code: 0, data: {} } });
    authenticate();

    await client.updateProfile({ mfaEnabled: true });

    const req = mockHttp.getLastRequest()!;
    expect(req.method).toBe('PUT');
    expect(parseBody(req.body)).toEqual({ mfa_enabled: true });
    expect(req.headers['Authorization']).toMatch(/^Bearer /);
  });

  it('updateProfile maps username + metadata', async () => {
    setupClient({ [UPDATE_PROFILE_KEY]: { code: 0, data: {} } });
    authenticate();

    await client.updateProfile({ username: 'neo', metadata: { theme: 'dark' } });

    expect(parseBody(mockHttp.getLastRequest()!.body)).toEqual({ username: 'neo', metadata: { theme: 'dark' } });
  });

  it('getSessions maps snake_case session fields and pagination', async () => {
    setupClient({
      [SESSIONS_P2_KEY]: {
        code: 0,
        items: [
          { id: 's1', device_type: 'web', ip: '1.2.3.4', geoip: 'CN', user_agent: 'UA', amr: 'pwd', is_current_session: true, created_at: '2026-01-01T00:00:00Z' },
          { id: 's2', device_type: 'mobile' },
        ],
        total: 2,
        pagination: { page: 2, page_size: 10 },
      },
    });
    authenticate();

    const list = await client.getSessions(2, 10);

    expect(list.total).toBe(2);
    expect(list.page).toBe(2);
    expect(list.pageSize).toBe(10);
    expect(list.sessions[0]).toMatchObject({
      id: 's1', deviceType: 'web', ip: '1.2.3.4', geoIp: 'CN', userAgent: 'UA', amr: 'pwd',
      isCurrentSession: true, createdAt: '2026-01-01T00:00:00Z',
    });
    expect(list.sessions[1]).toMatchObject({ id: 's2', deviceType: 'mobile', isCurrentSession: false });
  });

  it('revokeSession encodes the session id in the path', async () => {
    setupClient({ [REVOKE_SESSION_KEY]: { code: 0, data: {} } });
    authenticate();

    await client.revokeSession('sess/1');

    const req = mockHttp.getLastRequest()!;
    expect(req.method).toBe('DELETE');
    expect(req.url).toBe(`${BASE_URL}/identity/api/v1/auth/me/sessions/sess%2F1`);
  });

  it('revokeOtherSessions deletes the sessions collection', async () => {
    setupClient({ [REVOKE_OTHERS_KEY]: { code: 0, data: {} } });
    authenticate();

    await client.revokeOtherSessions();

    expect(mockHttp.getLastRequest()!.url).toBe(`${BASE_URL}/identity/api/v1/auth/me/sessions`);
  });

  // ── step-up 重认证 / 销户 ───────────────────────────────────────
  it('reauthenticate returns the step-up token without mfa_code by default', async () => {
    setupClient({
      [AUTH_CONFIG_KEY]: plainAuthConfig(),
      [REAUTH_KEY]: { code: 0, data: { step_up_token: 'su-1', expires_in: 300 } },
    });
    authenticate();

    const res = await client.reauthenticate('pw-secret');

    expect(res).toEqual({ stepUpToken: 'su-1', expiresIn: 300 });
    expect(parseBody(mockHttp.getLastRequest()!.body)).toEqual({ password: 'pw-secret' });
  });

  it('reauthenticate forwards mfa_code when provided', async () => {
    setupClient({
      [AUTH_CONFIG_KEY]: plainAuthConfig(),
      [REAUTH_KEY]: { code: 0, data: { step_up_token: 'su-2', expires_in: 300 } },
    });
    authenticate();

    await client.reauthenticate('pw-secret', '123456');

    expect(parseBody(mockHttp.getLastRequest()!.body)).toEqual({ password: 'pw-secret', mfa_code: '123456' });
  });

  it('deleteAccount chains reauthenticate then delete with X-StepUp-Token', async () => {
    setupClient({
      [AUTH_CONFIG_KEY]: plainAuthConfig(),
      [REAUTH_KEY]: { code: 0, data: { step_up_token: 'su-9', expires_in: 300 } },
      [DELETE_ACCOUNT_KEY]: { code: 0, data: {} },
    });
    authenticate();

    await client.deleteAccount('pw-secret', { reason: 'no longer needed' });

    const chain = mockHttp.getRequests().map((r) => `${r.method} ${r.url}`);
    expect(chain).toEqual([AUTH_CONFIG_KEY, REAUTH_KEY, DELETE_ACCOUNT_KEY]);
    const del = mockHttp.getLastRequest()!;
    expect(del.headers['X-StepUp-Token']).toBe('su-9');
    expect(parseBody(del.body)).toEqual({ password: 'pw-secret', reason: 'no longer needed' });
  });

  it('deleteAccount omits X-StepUp-Token when reauthenticate returns no token', async () => {
    setupClient({
      [AUTH_CONFIG_KEY]: plainAuthConfig(),
      [REAUTH_KEY]: { code: 0, data: {} },
      [DELETE_ACCOUNT_KEY]: { code: 0, data: {} },
    });
    authenticate();

    await client.deleteAccount('pw-secret');

    expect(mockHttp.getLastRequest()!.headers['X-StepUp-Token']).toBeUndefined();
    expect(parseBody(mockHttp.getLastRequest()!.body)).toEqual({ password: 'pw-secret' });
  });
});

describe('AuthClient revokeTokens (RFC 7009)', () => {
  let storage: MockStorage;
  let tokenManager: TokenManager;
  let mockHttp: ReturnType<typeof createMockHttp>;
  let client: AuthClient;

  function setupClient(responses: Record<string, unknown>, options?: { appId?: string; discovery?: Discovery }) {
    mockHttp = createMockHttp(responses);
    storage = new MockStorage();
    tokenManager = new TokenManager(storage);
    client = new AuthClient({
      tokenManager,
      http: mockHttp,
      baseUrl: BASE_URL,
      appId: options?.appId ?? 'app-1',
      discovery: options?.discovery,
    });
  }

  function authenticate(): string {
    const at = createToken();
    tokenManager.setTokens(at, 'rt-1', 900);
    return at;
  }

  it('revokes access + refresh tokens by default', async () => {
    setupClient({ [REVOKE_KEY]: { code: 0, data: {} } });
    const at = authenticate();

    await client.revokeTokens();

    const reqs = mockHttp.getRequests();
    expect(reqs).toHaveLength(2);
    expect(reqs.map((r) => JSON.parse(r.body))).toEqual([
      { token: at, token_type_hint: 'access_token', client_id: 'app-1' },
      { token: 'rt-1', token_type_hint: 'refresh_token', client_id: 'app-1' },
    ]);
    expect(reqs.every((r) => r.method === 'POST' && r.url === REVOKE_EP)).toBe(true);
  });

  it('tokens=access revokes only the access token', async () => {
    setupClient({ [REVOKE_KEY]: { code: 0, data: {} } });
    const at = authenticate();

    await client.revokeTokens({ tokens: 'access' });

    const reqs = mockHttp.getRequests();
    expect(reqs).toHaveLength(1);
    expect(JSON.parse(reqs[0].body)).toEqual({ token: at, token_type_hint: 'access_token', client_id: 'app-1' });
  });

  it('tokens=refresh revokes only the refresh token', async () => {
    setupClient({ [REVOKE_KEY]: { code: 0, data: {} } });
    authenticate();

    await client.revokeTokens({ tokens: 'refresh' });

    const reqs = mockHttp.getRequests();
    expect(reqs).toHaveLength(1);
    expect(JSON.parse(reqs[0].body)).toEqual({ token: 'rt-1', token_type_hint: 'refresh_token', client_id: 'app-1' });
  });

  it('resolves without requests when no tokens are present', async () => {
    setupClient({ [REVOKE_KEY]: { code: 0 } });

    await client.revokeTokens();

    expect(mockHttp.getRequests()).toHaveLength(0);
  });

  it('throws REVOKE_FAILED when every revocation fails', async () => {
    setupClient({ [REVOKE_KEY]: { code: '500', message: 'boom', __status: 500 } });
    authenticate();

    await expect(client.revokeTokens()).rejects.toMatchObject({
      name: 'AutionalAuthError',
      code: 'REVOKE_FAILED',
      message: 'boom',
    });
  });

  it('resolves when at least one revocation succeeds (allSettled)', async () => {
    setupClient({
      [REVOKE_KEY]: [
        { code: '500', message: 'boom', __status: 500 },
        { code: 0, data: {} },
      ],
    });
    authenticate();

    await expect(client.revokeTokens()).resolves.toBeUndefined();
  });

  it('prefers discovery revocation_endpoint and the OAuth client id', async () => {
    const discovery = {
      getRevocationEndpoint: () => 'https://sso.example.com/revoke',
      getEndSessionEndpoint: () => null,
    } as unknown as Discovery;
    setupClient({ 'POST https://sso.example.com/revoke': { code: 0, data: {} } }, { discovery });
    const at = authenticate();
    tokenManager.setAuthMode('sso', 'sso-cli-1');

    await client.revokeTokens({ tokens: 'access' });

    const req = mockHttp.getLastRequest()!;
    expect(req.url).toBe('https://sso.example.com/revoke');
    expect(JSON.parse(req.body)).toEqual({ token: at, token_type_hint: 'access_token', client_id: 'sso-cli-1' });
  });
});
