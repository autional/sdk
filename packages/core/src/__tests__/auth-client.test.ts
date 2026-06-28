import { describe, it, expect, beforeEach } from 'vitest';
import { TokenManager } from '../token-manager';
import { AuthClient } from '../auth-client';
import { AuthmsAuthError } from '../errors';
import type { StorageAdapter } from '../platform/types';

class MockStorage implements StorageAdapter {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
}

function createMockHttp(responses: Record<string, unknown>) {
  let lastRequest: { url: string; method: string; body: string; headers?: Record<string, string> } | null = null;
  return {
    request: async (url: string, init?: RequestInit) => {
      const method = init?.method || 'GET';
      lastRequest = { url, method, body: (init?.body as string) || '', headers: (init?.headers as Record<string, string>) || {} };
      const key = `${method} ${url}`;
      const res = responses[key];
      if (!res) {
        return new Response(JSON.stringify({ code: 404, message: `Unexpected: ${key}` }), { status: 404 });
      }
      const status = (res as any).__status || 200;
      return new Response(JSON.stringify(res), { status, headers: { 'Content-Type': 'application/json' } });
    },
    getLastRequest: () => lastRequest,
  };
}

function createToken(expInSeconds = 900): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: 'user-1', user_id: 'user-1', tenant_id: 'tenant-1', exp: Math.floor(Date.now() / 1000) + expInSeconds }));
  return `${header}.${payload}.sig`;
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

  function setupClient(responses: Record<string, unknown>) {
    mockHttp = createMockHttp(responses);
    storage = new MockStorage();
    tokenManager = new TokenManager(storage);
    client = new AuthClient({
      tokenManager,
      http: mockHttp,
      baseUrl: BASE_URL,
    });
  }

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

    it('throws AuthmsAuthError on 401', async () => {
      setupClient({
        [AUTH_CONFIG_KEY]: plainAuthConfig(),
        [LOGIN_KEY]: { code: '40100001', message: 'Invalid credentials', __status: 401 },
      });

      await expect(
        client.login({ email: 'bad@example.com', password: 'wrong' }),
      ).rejects.toThrow(AuthmsAuthError);

      await expect(
        client.login({ email: 'bad@example.com', password: 'wrong' }),
      ).rejects.toMatchObject({
        name: 'AuthmsAuthError',
        code: '40100001',
        status: 401,
      });
    });
  });

  describe('register', () => {
    it('registers with password preprocessing', async () => {
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
      expect(body.password_transmission).toBe('plain');
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
        name: 'AuthmsAuthError',
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

    it('sends processed password with transmission', async () => {
      setupClient({
        [AUTH_CONFIG_KEY]: plainAuthConfig(),
        [CHANGE_PASSWORD_KEY]: { data: {} },
      });

      await client.changePassword('oldpass', 'newpass123');

      const lastReq = mockHttp.getLastRequest()!;
      const body = parseBody(lastReq.body);
      expect(body.current_password).toBe('oldpass');
      expect(body.password_transmission).toBe('plain');
    });

    it('throws AuthmsAuthError on 4xx', async () => {
      setupClient({
        [AUTH_CONFIG_KEY]: plainAuthConfig(),
        [CHANGE_PASSWORD_KEY]: { code: '40000001', message: 'Invalid current password', __status: 400 },
      });

      await expect(
        client.changePassword('wrongold', 'newpass123'),
      ).rejects.toThrow(AuthmsAuthError);
    });
  });

  describe('loginWithOAuth', () => {
    it('throws NOT_BROWSER when window is undefined', async () => {
      setupClient({});

      await expect(
        client.loginWithOAuth({ provider: 'google' }),
      ).rejects.toThrow(AuthmsAuthError);

      await expect(
        client.loginWithOAuth({ provider: 'google' }),
      ).rejects.toMatchObject({
        name: 'AuthmsAuthError',
        code: 'NOT_BROWSER',
      });
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
});
