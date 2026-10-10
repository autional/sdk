import { describe, it, expect, afterEach, vi } from 'vitest';
import { TokenManager } from '../token-manager';
import { AuthClient } from '../auth-client';
import { AutionalAuthError } from '../errors';
import { loadPkceSession, savePkceSession } from '../pkce';
import type { StorageAdapter } from '../platform/types';

class MockStorage implements StorageAdapter {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
}

interface RecordedRequest { url: string; method: string; body: string; headers: Record<string, string> }

function createMockHttp(responses: Record<string, unknown>) {
  const requests: RecordedRequest[] = [];
  return {
    request: async (url: string, init?: RequestInit) => {
      const method = init?.method || 'GET';
      requests.push({ url, method, body: (init?.body as string) || '', headers: (init?.headers as Record<string, string>) || {} });
      const key = `${method} ${url}`;
      const res = responses[key];
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

/** 模拟浏览器 window（location + sessionStorage），location.href 赋值仅记录不跳转 */
function stubBrowserWindow(origin = 'https://app.example.com') {
  const sessionStore = new Map<string, string>();
  const win = {
    location: { origin, href: '' },
    sessionStorage: {
      getItem: (k: string) => sessionStore.get(k) ?? null,
      setItem: (k: string, v: string) => { sessionStore.set(k, v); },
      removeItem: (k: string) => { sessionStore.delete(k); },
    },
  };
  vi.stubGlobal('window', win);
  return win;
}

function createToken(expInSeconds = 900): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: 'user-1', user_id: 'user-1', tenant_id: 'tenant-1', exp: Math.floor(Date.now() / 1000) + expInSeconds }));
  return `${header}.${payload}.sig`;
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

const BASE_URL = 'https://api.example.com';

const AUTH_CONFIG_KEY = `GET ${BASE_URL}/identity/api/v1/public/auth-config/default`;
const AUTH_CONFIG_TENANT_KEY = `GET ${BASE_URL}/identity/api/v1/public/auth-config/t1`;
const LOGIN_KEY = `POST ${BASE_URL}/identity/api/v1/auth/login`;
const REGISTER_KEY = `POST ${BASE_URL}/identity/api/v1/auth/register`;
const LOGOUT_KEY = `POST ${BASE_URL}/identity/api/v1/auth/logout`;
const REFRESH_KEY = `POST ${BASE_URL}/identity/api/v1/auth/refresh`;

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

function hashAuthConfig() {
  return {
    data: {
      tenant_id: 't1',
      login_methods: ['password'],
      password_policy: { password_transmission: 'hash', min_length: 8 },
      captcha_enabled: false,
    },
  };
}

const LOGIN_SUCCESS_RESPONSE = {
  data: { access_token: 'at', refresh_token: 'rt', expires_in: 900, user: { id: 'user-1' } },
};

const REGISTER_SUCCESS_RESPONSE = {
  data: { access_token: 'at', refresh_token: 'rt', user: { id: 'user-1' } },
};

const REFRESH_TOKEN_REUSE_RESPONSE = {
  code: '40000201',
  message: 'Token reused',
  __status: 401,
};

describe('AuthClient', () => {
  let storage: MockStorage;
  let tokenManager: TokenManager;
  let mockHttp: ReturnType<typeof createMockHttp>;
  let client: AuthClient;

  function setupClient(responses: Record<string, unknown>, options?: { tenantId?: string; appId?: string }) {
    mockHttp = createMockHttp(responses);
    storage = new MockStorage();
    tokenManager = new TokenManager(storage);
    client = new AuthClient({
      tokenManager,
      http: mockHttp,
      baseUrl: BASE_URL,
      tenantId: options?.tenantId,
      appId: options?.appId,
    });
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function parseBody(body: string): Record<string, unknown> {
    return JSON.parse(body) as Record<string, unknown>;
  }

  describe('login', () => {
    it('sends password as-is in plain mode', async () => {
      setupClient({
        [AUTH_CONFIG_KEY]: plainAuthConfig(),
        [LOGIN_KEY]: LOGIN_SUCCESS_RESPONSE,
      });

      const result = await client.login({ email: 'test@example.com', password: 'testpass' });

      expect(result.accessToken).toBe('at');
      expect(result.refreshToken).toBe('rt');
      expect(result.expiresIn).toBe(900);
      expect(result.user.id).toBe('user-1');

      const lastReq = mockHttp.getLastRequest()!;
      const body = parseBody(lastReq.body);
      expect(body.password).toBe('testpass');
      expect(body.password_transmission).toBe('plain');
      expect(body.identity).toBe('test@example.com');
    });

    it('sends SHA-256 hashed password in hash mode', async () => {
      setupClient({
        [AUTH_CONFIG_KEY]: plainAuthConfig(),
        [AUTH_CONFIG_TENANT_KEY]: hashAuthConfig(),
        [LOGIN_KEY]: LOGIN_SUCCESS_RESPONSE,
      });

      await client.login({ email: 'test@example.com', password: 'testpass', tenantId: 't1' });

      const lastReq = mockHttp.getLastRequest()!;
      const body = parseBody(lastReq.body);
      expect(body.password).not.toBe('testpass');
      expect(body.password).toMatch(/^[0-9a-f]{64}$/);
      expect(body.password_transmission).toBe('hash');
    });

    it('throws AutionalAuthError on 401', async () => {
      setupClient({
        [AUTH_CONFIG_KEY]: plainAuthConfig(),
        [LOGIN_KEY]: { code: '40100001', message: 'Invalid credentials', __status: 401 },
      });

      await expect(
        client.login({ email: 'bad@example.com', password: 'wrong' }),
      ).rejects.toThrow(AutionalAuthError);

      await expect(
        client.login({ email: 'bad@example.com', password: 'wrong' }),
      ).rejects.toMatchObject({
        name: 'AutionalAuthError',
        code: '40100001',
        status: 401,
      });
    });
  });

  describe('register', () => {
    it('registers with password as-is', async () => {
      setupClient({
        [AUTH_CONFIG_KEY]: plainAuthConfig(),
        [REGISTER_KEY]: REGISTER_SUCCESS_RESPONSE,
      });

      const result = await client.register({
        email: 'new@example.com',
        password: 'newpass',
        username: 'newuser',
      });

      expect(result.accessToken).toBe('at');
      expect(result.refreshToken).toBe('rt');
      expect(result.user.id).toBe('user-1');

      const lastReq = mockHttp.getLastRequest()!;
      const body = parseBody(lastReq.body);
      expect(body.email).toBe('new@example.com');
      expect(body.password).toBe('newpass');
      // 注册时不发送 password_transmission — 后端负责哈希
    });
  });

  describe('logout', () => {
    it('clears tokens', async () => {
      setupClient({
        [AUTH_CONFIG_KEY]: plainAuthConfig(),
        [LOGIN_KEY]: LOGIN_SUCCESS_RESPONSE,
        [LOGOUT_KEY]: { data: {} },
      });

      await client.login({ email: 'test@example.com', password: 'testpass' });
      expect(tokenManager.getRefreshToken()).toBe('rt');

      await client.logout();
      expect(tokenManager.getRefreshToken()).toBeNull();
      expect(tokenManager.getAccessToken()).toBeNull();
    });

    it('sends Authorization header on logout', async () => {
      const validToken = createToken(900);
      tokenManager.setTokens(validToken, 'rt', 900);
      const capturedHeaders: Record<string, string> = {};
      
      const http = {
        request: async (url: string, init?: RequestInit) => {
          Object.assign(capturedHeaders, init?.headers || {});
          return new Response(JSON.stringify({ data: {} }), { status: 200 });
        },
      };

      const testClient = new AuthClient({ tokenManager, http, baseUrl: BASE_URL });
      await testClient.logout();
      expect(capturedHeaders['Authorization']).toBe(`Bearer ${validToken}`);
    });
  });

  describe('refreshToken', () => {
    it('refreshes tokens on success', async () => {
      const newAt = createToken(900);
      setupClient({
        [REFRESH_KEY]: {
          data: { access_token: newAt, refresh_token: 'new_rt', expires_in: 900 },
        },
      });

      tokenManager.setTokens(createToken(), 'old_rt', 900);

      await client.refreshToken();

      expect(tokenManager.getRefreshToken()).toBe('new_rt');
      expect(tokenManager.getAccessToken()).toBe(newAt);
    });

    it('throws TOKEN_REUSE on 400002xx code', async () => {
      setupClient({
        [REFRESH_KEY]: REFRESH_TOKEN_REUSE_RESPONSE,
      });

      tokenManager.setTokens(createToken(), 'old_rt', 900);

      await expect(client.refreshToken()).rejects.toMatchObject({
        name: 'AutionalAuthError',
        code: 'TOKEN_REUSE',
        status: 401,
      });

      expect(tokenManager.getRefreshToken()).toBeNull();
    });
  });

  describe('fetchAuthConfig', () => {
    it('fetches and returns auth config', async () => {
      setupClient({
        [AUTH_CONFIG_KEY]: plainAuthConfig(),
      });

      const config = await client.fetchAuthConfig();

      expect(config.tenantId).toBe('t1');
      expect(config.loginMethods).toEqual(['password']);
      expect(config.passwordPolicy.mode).toBe('plain');
      expect(config.passwordPolicy.minLength).toBe(8);
      expect(config.captchaEnabled).toBe(false);
    });

    it('second call returns cached data', async () => {
      let callCount = 0;
      const trackingHttp = {
        request: async (url: string, init?: RequestInit) => {
          callCount++;
          const key = (init?.method || 'GET') + ' ' + url;
          const res = ({ [AUTH_CONFIG_KEY]: plainAuthConfig() } as Record<string, unknown>)[key];
          return new Response(JSON.stringify(res), { status: 200, headers: { 'Content-Type': 'application/json' } });
        },
      };

      storage = new MockStorage();
      tokenManager = new TokenManager(storage);
      client = new AuthClient({ tokenManager, http: trackingHttp, baseUrl: BASE_URL });

      await client.fetchAuthConfig();
      expect(callCount).toBe(1);

      await client.fetchAuthConfig();
      expect(callCount).toBe(1);
    });

    it('clearConfigCache invalidates cache', async () => {
      let callCount = 0;
      const trackingHttp = {
        request: async (url: string, init?: RequestInit) => {
          callCount++;
          const key = (init?.method || 'GET') + ' ' + url;
          const res = ({ [AUTH_CONFIG_KEY]: plainAuthConfig() } as Record<string, unknown>)[key];
          return new Response(JSON.stringify(res), { status: 200, headers: { 'Content-Type': 'application/json' } });
        },
      };

      storage = new MockStorage();
      tokenManager = new TokenManager(storage);
      client = new AuthClient({ tokenManager, http: trackingHttp, baseUrl: BASE_URL });

      await client.fetchAuthConfig();
      expect(callCount).toBe(1);

      await client.fetchAuthConfig();
      expect(callCount).toBe(1);

      client.clearConfigCache();

      await client.fetchAuthConfig();
      expect(callCount).toBe(2);
    });
  });

  describe('changePassword', () => {
    const CHANGE_PASSWORD_KEY = `PUT ${BASE_URL}/identity/api/v1/auth/me/password`;

    it('sends old_password/new_password with transmission in plain mode', async () => {
      setupClient({
        [AUTH_CONFIG_KEY]: plainAuthConfig(),
        [CHANGE_PASSWORD_KEY]: { data: {} },
      });

      await client.changePassword('oldpass', 'newpass123');

      const lastReq = mockHttp.getLastRequest()!;
      const body = parseBody(lastReq.body);
      expect(body.old_password).toBe('oldpass');
      expect(body.new_password).toBe('newpass123');
      expect(body.password_transmission).toBe('plain');
      // 旧契约字段名已废弃（服务端 dto.ChangePasswordRequest 只认 old_password/new_password）
      expect(body.current_password).toBeUndefined();
      expect(body.password).toBeUndefined();
    });

    it('hashes both passwords against tenant config in hash mode', async () => {
      // 只注册租户级配置：若客户端按 default 取配置会命中 404 → 退化为 plain → 断言失败。
      setupClient({
        [AUTH_CONFIG_TENANT_KEY]: hashAuthConfig(),
        [CHANGE_PASSWORD_KEY]: { data: {} },
      }, { tenantId: 't1' });

      await client.changePassword('oldpass', 'newpass123');

      const lastReq = mockHttp.getLastRequest()!;
      const body = parseBody(lastReq.body);
      expect(body.old_password).toBe(await sha256Hex('oldpass|t1'));
      expect(body.new_password).toBe(await sha256Hex('newpass123|t1'));
      expect(body.old_password).toMatch(/^[0-9a-f]{64}$/);
      expect(body.new_password).toMatch(/^[0-9a-f]{64}$/);
      expect(body.password_transmission).toBe('hash');
    });

    it('throws AutionalAuthError on 4xx', async () => {
      setupClient({
        [AUTH_CONFIG_KEY]: plainAuthConfig(),
        [CHANGE_PASSWORD_KEY]: { code: '40000001', message: 'Invalid current password', __status: 400 },
      });

      await expect(
        client.changePassword('wrongold', 'newpass123'),
      ).rejects.toThrow(AutionalAuthError);
    });
  });

  describe('loginWithOAuth', () => {
    it('throws NOT_BROWSER when window is undefined', async () => {
      setupClient({});

      await expect(
        client.loginWithOAuth({}),
      ).rejects.toThrow(AutionalAuthError);

      await expect(
        client.loginWithOAuth({}),
      ).rejects.toMatchObject({
        name: 'AutionalAuthError',
        code: 'NOT_BROWSER',
      });
    });

    it('throws OAUTH_CLIENT_ID_REQUIRED without clientId or appId', async () => {
      stubBrowserWindow();
      setupClient({});

      await expect(
        client.loginWithOAuth({}),
      ).rejects.toMatchObject({ code: 'OAUTH_CLIENT_ID_REQUIRED' });
    });

    it('redirects to auth-domain authorize endpoint with PKCE params', async () => {
      const win = stubBrowserWindow();
      setupClient({}, { appId: 'app-1' });

      await client.loginWithOAuth({});

      const url = new URL(win.location.href);
      expect(url.origin).toBe('https://auth.example.com');
      expect(url.pathname).toBe('/oauth/api/v1/oauth/authorize');
      const p = url.searchParams;
      expect(p.get('response_type')).toBe('code');
      expect(p.get('client_id')).toBe('app-1');
      expect(p.get('redirect_uri')).toBe('https://app.example.com/oauth/callback');
      expect(p.get('scope')).toBe('openid profile email');
      expect(p.get('code_challenge_method')).toBe('S256');
      expect(p.get('code_challenge')).toMatch(/^[A-Za-z0-9_-]{43}$/);
      expect(p.get('state')).toBeTruthy();

      const pending = loadPkceSession()!;
      expect(pending).not.toBeNull();
      expect(pending.state).toBe(p.get('state'));
      expect(pending.clientId).toBe('app-1');
      expect(pending.redirectUri).toBe('https://app.example.com/oauth/callback');
    });

    it('honours clientId / redirectUri / scope / authorizeUrl / extraParams overrides', async () => {
      const win = stubBrowserWindow();
      setupClient({});

      await client.loginWithOAuth({
        clientId: 'c9',
        redirectUri: 'https://app.example.com/cb',
        scope: 'openid',
        authorizeUrl: 'https://sso.example.org/oauth/api/v1/oauth/authorize',
        extraParams: { prompt: 'consent' },
      });

      const url = new URL(win.location.href);
      expect(url.origin).toBe('https://sso.example.org');
      expect(url.searchParams.get('client_id')).toBe('c9');
      expect(url.searchParams.get('redirect_uri')).toBe('https://app.example.com/cb');
      expect(url.searchParams.get('scope')).toBe('openid');
      expect(url.searchParams.get('prompt')).toBe('consent');
    });
  });

  describe('handleOAuthCallback', () => {
    const TOKEN_KEY = `POST ${BASE_URL}/oauth/api/v1/oauth/token`;
    const USERINFO_KEY = `GET ${BASE_URL}/oauth/api/v1/oauth/userinfo`;

    function seedSession(overrides?: Partial<{ verifier: string; state: string; redirectUri: string; clientId: string }>) {
      savePkceSession({
        verifier: 'test-verifier',
        state: 'test-state',
        redirectUri: 'https://app.example.com/oauth/callback',
        clientId: 'app-1',
        ...overrides,
      });
    }

    it('exchanges code with client_id + code_verifier and loads userinfo', async () => {
      const at = createToken(3600);
      stubBrowserWindow();
      seedSession();
      setupClient({
        [TOKEN_KEY]: { access_token: at, refresh_token: 'rt', expires_in: 3600, token_type: 'Bearer' },
        [USERINFO_KEY]: { sub: 'user-9', email: 'u9@example.com' },
      });

      const result = await client.handleOAuthCallback('https://app.example.com/oauth/callback?code=abc&state=test-state');

      expect(result.accessToken).toBe(at);
      expect(result.user.id).toBe('user-9');
      expect(result.user.email).toBe('u9@example.com');

      const tokenReq = mockHttp.getRequests().find((r) => r.url.endsWith('/oauth/api/v1/oauth/token'))!;
      const form = new URLSearchParams(tokenReq.body);
      expect(form.get('grant_type')).toBe('authorization_code');
      expect(form.get('code')).toBe('abc');
      expect(form.get('client_id')).toBe('app-1');
      expect(form.get('code_verifier')).toBe('test-verifier');
      expect(form.get('redirect_uri')).toBe('https://app.example.com/oauth/callback');

      const userinfoReq = mockHttp.getRequests().find((r) => r.url.endsWith('/oauth/api/v1/oauth/userinfo'))!;
      expect(userinfoReq.headers['Authorization']).toBe(`Bearer ${at}`);

      expect(tokenManager.getAuthMode()).toBe('sso');
      expect(tokenManager.getOAuthClientId()).toBe('app-1');
      expect(loadPkceSession()).toBeNull();
    });

    it('rejects state mismatch before any token exchange', async () => {
      stubBrowserWindow();
      seedSession();
      setupClient({});

      await expect(
        client.handleOAuthCallback('https://app.example.com/oauth/callback?code=abc&state=evil'),
      ).rejects.toMatchObject({ code: 'OAUTH_STATE_MISMATCH' });

      expect(mockHttp.getRequests().length).toBe(0);
    });

    it('throws with error from callback URL', async () => {
      stubBrowserWindow();
      setupClient({});

      await expect(
        client.handleOAuthCallback('https://app.example.com/oauth/callback?error=access_denied&error_description=User%20denied'),
      ).rejects.toMatchObject({ code: 'access_denied', message: 'User denied' });
    });

    it('throws OAUTH_SESSION_LOST without pending session', async () => {
      stubBrowserWindow();
      setupClient({});

      await expect(
        client.handleOAuthCallback('https://app.example.com/oauth/callback?code=abc&state=test-state'),
      ).rejects.toMatchObject({ code: 'OAUTH_SESSION_LOST' });
    });

    it('surfaces server error_description on failed exchange', async () => {
      stubBrowserWindow();
      seedSession();
      setupClient({
        [TOKEN_KEY]: { error: 'invalid_grant', error_description: 'code expired', __status: 401 },
      });

      await expect(
        client.handleOAuthCallback('https://app.example.com/oauth/callback?code=abc&state=test-state'),
      ).rejects.toMatchObject({ code: 'invalid_grant', message: 'code expired', status: 401 });
    });
  });

  describe('refreshToken (SSO mode)', () => {
    const SSO_REFRESH_KEY = `POST ${BASE_URL}/oauth/api/v1/oauth/refresh`;

    it('dispatches to oauth refresh endpoint when authMode is sso', async () => {
      const newAt = createToken(900);
      setupClient({
        [SSO_REFRESH_KEY]: { access_token: newAt, refresh_token: 'new_rt', expires_in: 900 },
      });
      tokenManager.setTokens(createToken(), 'old_rt', 900);
      tokenManager.setAuthMode('sso', 'app-1');

      await client.refreshToken();

      expect(tokenManager.getRefreshToken()).toBe('new_rt');
      expect(tokenManager.getAccessToken()).toBe(newAt);
      expect(tokenManager.getAuthMode()).toBe('sso');

      const req = mockHttp.getLastRequest()!;
      expect(req.url).toBe(`${BASE_URL}/oauth/api/v1/oauth/refresh`);
      const form = new URLSearchParams(req.body);
      expect(form.get('grant_type')).toBe('refresh_token');
      expect(form.get('refresh_token')).toBe('old_rt');
      expect(form.get('client_id')).toBe('app-1');
    });

    it('clears tokens and throws REFRESH_FAILED on SSO refresh failure', async () => {
      setupClient({
        [SSO_REFRESH_KEY]: { error: 'invalid_grant', error_description: 'refresh token expired', __status: 400 },
      });
      tokenManager.setTokens(createToken(), 'old_rt', 900);
      tokenManager.setAuthMode('sso', 'app-1');

      await expect(client.refreshToken()).rejects.toMatchObject({ code: 'REFRESH_FAILED', status: 401 });
      expect(tokenManager.getRefreshToken()).toBeNull();
    });
  });

  describe('login with captcha', () => {
    it('includes captcha fields in body', async () => {
      setupClient({
        [AUTH_CONFIG_KEY]: plainAuthConfig(),
        [LOGIN_KEY]: LOGIN_SUCCESS_RESPONSE,
      });

      await client.login({
        email: 'test@example.com',
        password: 'testpass',
        captchaToken: 'captcha-abc',
        captchaProvider: 'turnstile',
        captchaChallengeId: 'challenge-123',
      });

      const lastReq = mockHttp.getLastRequest()!;
      const body = parseBody(lastReq.body);
      expect(body.captcha_token).toBe('captcha-abc');
      expect(body.captcha_provider).toBe('turnstile');
      expect(body.captcha_challenge_id).toBe('challenge-123');
    });
  });

  describe('getProfile', () => {
    const PROFILE_KEY = `GET ${BASE_URL}/identity/api/v1/auth/me`;

    it('fetches and returns user data, caches in tokenManager', async () => {
      setupClient({
        [AUTH_CONFIG_KEY]: plainAuthConfig(),
        [LOGIN_KEY]: LOGIN_SUCCESS_RESPONSE,
        [PROFILE_KEY]: {
          data: { id: 'user-1', email: 'test@example.com', username: 'testuser' },
        },
      });

      await client.login({ email: 'test@example.com', password: 'testpass' });

      const profile = await client.getProfile();

      expect(profile).not.toBeNull();
      expect(profile!.id).toBe('user-1');
      expect(profile!.email).toBe('test@example.com');
      expect(profile!.username).toBe('testuser');
      expect(tokenManager.getUser()).not.toBeNull();
      expect(tokenManager.getUser()!.email).toBe('test@example.com');
    });
  });

  describe('loginWithClientCredentials', () => {
    it('sends correct grant_type and returns token', async () => {
      const mockHttp = {
        lastRequest: null as Record<string, unknown> | null,
        request: async (url: string, options: RequestInit) => {
          mockHttp.lastRequest = { url, method: options.method, body: options.body };
          return {
            ok: true,
            json: async () => ({
              access_token: 'cc_test_token',
              refresh_token: '',
              expires_in: 3600,
              token_type: 'Bearer',
            }),
          };
        },
      };

      const storage = new MockStorage();
      const tokenManager = new TokenManager(storage);
      const client = new AuthClient({
        tokenManager,
        http: mockHttp as any,
        baseUrl: 'https://auth.test.com',
      });

      const result = await client.loginWithClientCredentials({
        clientId: 'my-service',
        clientSecret: 'secret-key',
        scopes: ['identity:read', 'tenant:write'],
      });

      const body = (mockHttp.lastRequest as any)?.body as string;
      const decodedBody = decodeURIComponent(body);
      expect(body).toContain('grant_type=client_credentials');
      expect(body).toContain('client_id=my-service');
      expect(body).toContain('client_secret=secret-key');
      expect(decodedBody).toContain('identity:read');
      expect(decodedBody).toContain('tenant:write');
      expect(result.accessToken).toBe('cc_test_token');
    });

    it('throws AutionalAuthError on failure', async () => {
      const mockHttp = {
        request: async () => ({
          ok: false,
          status: 401,
          json: async () => ({ code: 'INVALID_CLIENT', message: 'invalid client' }),
        }),
      };

      const storage = new MockStorage();
      const tokenManager = new TokenManager(storage);
      const client = new AuthClient({
        tokenManager,
        http: mockHttp as any,
        baseUrl: 'https://auth.test.com',
      });

      await expect(client.loginWithClientCredentials({
        clientId: 'bad',
        clientSecret: 'bad',
      })).rejects.toBeInstanceOf(AutionalAuthError);
    });
  });
});
