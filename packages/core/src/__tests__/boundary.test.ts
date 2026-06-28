import { describe, it, expect, vi } from 'vitest';
import { TokenManager } from '../token-manager';
import { ApiClient } from '../api-client';
import { AuthClient } from '../auth-client';
import { Discovery } from '../discovery';
import { AuthmsNetworkError } from '../errors';
import type { StorageAdapter } from '../platform/types';

class MockStorage implements StorageAdapter {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
}

function createToken(expInSeconds = 900): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: 'user-1', user_id: 'user-1', tenant_id: 'tenant-1', exp: Math.floor(Date.now() / 1000) + expInSeconds }));
  return `${header}.${payload}.sig`;
}

function createExpiredToken(): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: 'user-1', user_id: 'user-1', tenant_id: 'tenant-1', exp: Math.floor(Date.now() / 1000) - 120 }));
  return `${header}.${payload}.sig`;
}

const BASE_URL = 'https://api.example.com';

describe('Boundary & Edge Cases', () => {
  describe('api-client: request timeout', () => {
    it('should throw AuthmsNetworkError on timeout', async () => {
      const mockHttp = {
        request: async () => {
          const err = new Error('Request timed out');
          err.name = 'TimeoutError';
          throw err;
        },
      };

      const storage = new MockStorage();
      const tokenManager = new TokenManager(storage);
      tokenManager.setTokens(createToken(), 'rt-1', 900);

      const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: vi.fn() });

      await expect(client.get('/api/v1/users/me')).rejects.toBeInstanceOf(AuthmsNetworkError);
    });
  });

  describe('api-client: concurrent 401 / single-flight stress', () => {
    it('should call refreshFn exactly once for 5 concurrent 401s', async () => {
      let refreshCallCount = 0;
      let httpCallCount = 0;
      const mockHttp = {
        request: async (url: string, _init?: RequestInit) => {
          httpCallCount++;
          if (url.includes('/api/v1/auth/refresh')) {
            refreshCallCount++;
            return new Response(JSON.stringify({ code: 0, data: { access_token: createToken(900), refresh_token: 'new_rt', expires_in: 900 } }), { status: 200 });
          }
          if (httpCallCount <= 5) {
            return new Response(JSON.stringify({ code: 401001, message: 'unauthorized' }), { status: 401 });
          }
          return new Response(JSON.stringify({ code: 0, message: 'success', data: { id: '1', user_name: 'test' } }), { status: 200 });
        },
      };

      const storage = new MockStorage();
      const tokenManager = new TokenManager(storage);
      tokenManager.setTokens(createToken(), 'rt-1', 900);

      const refreshFn = vi.fn(async () => {
        const resp = await mockHttp.request(`${BASE_URL}/api/v1/auth/refresh`, { method: 'POST' });
        const json: Record<string, unknown> = await resp.json();
        const d = json.data as Record<string, unknown>;
        tokenManager.setTokens(d.access_token as string, d.refresh_token as string, d.expires_in as number);
      });

      const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: refreshFn });

      const results = await Promise.all([
        client.get('/api/v1/resource-1'),
        client.get('/api/v1/resource-2'),
        client.get('/api/v1/resource-3'),
        client.get('/api/v1/resource-4'),
        client.get('/api/v1/resource-5'),
      ]);

      expect(results).toHaveLength(5);
      for (const r of results) {
        expect(r).toEqual({ id: '1', userName: 'test' });
      }
      expect(refreshCallCount).toBe(1);
      expect(refreshFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('auth-client: logout while not authenticated', () => {
    it('should skip HTTP request when no access token', async () => {
      const httpRequestSpy = vi.fn(async () => {
        return new Response(JSON.stringify({ data: {} }), { status: 200 });
      });

      const mockHttp = { request: httpRequestSpy };

      const storage = new MockStorage();
      const tokenManager = new TokenManager(storage);

      const client = new AuthClient({ tokenManager, http: mockHttp, baseUrl: BASE_URL });

      await client.logout();

      expect(httpRequestSpy).not.toHaveBeenCalled();
      expect(tokenManager.getAccessToken()).toBeNull();
      expect(tokenManager.getRefreshToken()).toBeNull();
    });
  });

  describe('discovery: network error', () => {
    it('should throw readable error on network failure', async () => {
      const mockHttp = {
        request: async () => {
          throw new Error('NetworkError');
        },
      };

      const ISSUER = 'https://auth.example.com';
      const discovery = new Discovery(mockHttp);

      await expect(discovery.discover(ISSUER)).rejects.toThrow('NetworkError');
    });
  });

  describe('discovery: JSON parse failure', () => {
    it('should throw readable error on non-JSON response', async () => {
      const mockHttp = {
        request: async () => {
          return new Response('<html>not json</html>', { status: 200, headers: { 'Content-Type': 'text/html' } });
        },
      };

      const ISSUER = 'https://auth.example.com';
      const discovery = new Discovery(mockHttp);

      await expect(discovery.discover(ISSUER)).rejects.toThrow();
    });
  });

  describe('token-manager: expired token', () => {
    it('should return null for very old token', () => {
      const storage = new MockStorage();
      const tm = new TokenManager(storage);

      const expiredToken = createExpiredToken();
      tm.setTokens(expiredToken, 'refresh-1', 900);

      expect(tm.getAccessToken()).toBeNull();
      expect(tm.isAuthenticated()).toBe(false);
    });
  });
});
