import { describe, it, expect, vi } from 'vitest';
import { TokenManager } from '../token-manager';
import { ApiClient } from '../api-client';
import { AutionalApiError, AutionalAuthError, AutionalNetworkError } from '../errors';

class MockStorage {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
}

function createToken(expInSeconds = 900): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: 'user-1', tenant_id: 'tenant-1', exp: Math.floor(Date.now() / 1000) + expInSeconds }));
  return `${header}.${payload}.sig`;
}

const BASE_URL = 'https://api.example.com';

describe('ApiClient', () => {
  // ── 1. GET request ──────────────────────────────────────────────
  it('should auto-inject Authorization header and unwrap DataResponse envelope', async () => {
    let capturedHeaders: Record<string, string> = {};
    const mockHttp = {
      request: async (_url: string, init?: RequestInit) => {
        capturedHeaders = (init?.headers as Record<string, string>) || {};
        return new Response(JSON.stringify({ code: 0, message: 'success', data: { id: '1', user_name: 'test' } }), { status: 200 });
      },
    };

    const storage = new MockStorage();
    const tokenManager = new TokenManager(storage);
    tokenManager.setTokens(createToken(), 'rt-1', 900);

    const refreshFn = vi.fn();
    const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: refreshFn });

    const result = await client.get('/api/v1/users/me');

    expect(capturedHeaders['Authorization']).toBe(`Bearer ${tokenManager.getAccessToken()}`);
    expect(result).toEqual({ id: '1', userName: 'test' });
    expect(refreshFn).not.toHaveBeenCalled();
  });

  // ── 2. POST request ─────────────────────────────────────────────
  it('should convert camelCase body to snake_case and send with Content-Type', async () => {
    let capturedInit: RequestInit | undefined;
    const mockHttp = {
      request: async (_url: string, init?: RequestInit) => {
        capturedInit = init;
        return new Response(JSON.stringify({ code: 0, message: 'success', data: { id: '2', created_at: '2025-01-01' } }), { status: 200 });
      },
    };

    const storage = new MockStorage();
    const tokenManager = new TokenManager(storage);
    tokenManager.setTokens(createToken(), 'rt-1', 900);

    const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: vi.fn() });

    const result = await client.post('/api/v1/users', { userName: 'alice', displayName: 'Alice' });

    expect(capturedInit?.headers).toMatchObject({ 'Content-Type': 'application/json' });
    const body = JSON.parse(capturedInit?.body as string);
    expect(body).toEqual({ user_name: 'alice', display_name: 'Alice' });
    expect(result).toEqual({ id: '2', createdAt: '2025-01-01' });
  });

  // ── 3. 401 triggers refresh + retry ─────────────────────────────
  it('should trigger token refresh on 401 and retry the original request', async () => {
    let callCount = 0;
    const mockHttp = {
      request: async (url: string, _init?: RequestInit) => {
        callCount++;
        if (url.includes('/api/v1/auth/refresh')) {
          return new Response(JSON.stringify({ code: 0, data: { access_token: createToken(), refresh_token: 'new_rt', expires_in: 900 } }), { status: 200 });
        }
        if (callCount === 1) {
          return new Response(JSON.stringify({ code: 401001, message: 'unauthorized' }), { status: 401 });
        }
        return new Response(JSON.stringify({ code: 0, message: 'success', data: { id: '3', user_name: 'bob' } }), { status: 200 });
      },
    };

    const storage = new MockStorage();
    const tokenManager = new TokenManager(storage);
    tokenManager.setTokens(createToken(), 'rt-old', 900);

    const refreshFn = vi.fn(async () => {
      const resp = await mockHttp.request(`${BASE_URL}/api/v1/auth/refresh`, { method: 'POST' });
      const json: Record<string, unknown> = await resp.json();
      const d = json.data as Record<string, unknown>;
      tokenManager.setTokens(d.access_token as string, d.refresh_token as string, d.expires_in as number);
    });

    const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: refreshFn });

    const result = await client.get('/api/v1/users/me');

    expect(result).toEqual({ id: '3', userName: 'bob' });
    expect(refreshFn).toHaveBeenCalledTimes(1);
    expect(callCount).toBe(3);
  });

  // ── 4. 401 with no refresh token → force logout ─────────────────
  it('should force logout when refresh fails (no refresh token)', async () => {
    const mockHttp = {
      request: async () => {
        return new Response(JSON.stringify({ code: 401001, message: 'unauthorized' }), { status: 401 });
      },
    };

    const storage = new MockStorage();
    const tokenManager = new TokenManager(storage);
    tokenManager.setTokens(createToken(), 'rt-expired', 900);

    const refreshFn = vi.fn(async () => {
      throw new Error('No refresh token available');
    });
    const onForceLogout = vi.fn();

    const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: refreshFn, onForceLogout });

    await expect(client.get('/api/v1/users/me')).rejects.toMatchObject({
      name: 'AutionalAuthError',
      code: 'SESSION_EXPIRED',
      message: 'Session expired, please login again',
      status: 401,
    });

    expect(refreshFn).toHaveBeenCalledTimes(1);
    expect(onForceLogout).toHaveBeenCalledTimes(1);
    expect(tokenManager.getAccessToken()).toBeNull();
    expect(tokenManager.getRefreshToken()).toBeNull();
  });

  // ── 5. Single-flight: concurrent 401s → only one refresh ────────
  it('should deduplicate concurrent 401s (single-flight refresh)', async () => {
    let refreshCallCount = 0;
    let httpCallCount = 0;
    const mockHttp = {
      request: async (url: string, _init?: RequestInit) => {
        httpCallCount++;
        if (url.includes('/api/v1/auth/refresh')) {
          refreshCallCount++;
          return new Response(JSON.stringify({ code: 0, data: { access_token: createToken(), refresh_token: 'new_rt', expires_in: 900 } }), { status: 200 });
        }
        if (httpCallCount <= 2) {
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

    const [r1, r2] = await Promise.all([
      client.get('/api/v1/resource-1'),
      client.get('/api/v1/resource-2'),
    ]);

    expect(r1).toEqual({ id: '1', userName: 'test' });
    expect(r2).toEqual({ id: '1', userName: 'test' });
    expect(refreshCallCount).toBe(1);
    expect(refreshFn).toHaveBeenCalledTimes(1);
  });

  // ── 6. snake_case response keys → camelCase ─────────────────────
  it('should convert snake_case response keys to camelCase', async () => {
    const mockHttp = {
      request: async () => {
        return new Response(JSON.stringify({
          code: 0,
          message: 'success',
          data: {
            user_id: 'u-1',
            first_name: 'John',
            last_name: 'Doe',
            created_at: '2025-01-01T00:00:00Z',
            nested_obj: { inner_key: 'val' },
          },
        }), { status: 200 });
      },
    };

    const storage = new MockStorage();
    const tokenManager = new TokenManager(storage);
    tokenManager.setTokens(createToken(), 'rt-1', 900);

    const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: vi.fn() });

    const result = await client.get('/api/v1/profile');

    expect(result).toEqual({
      userId: 'u-1',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2025-01-01T00:00:00Z',
      nestedObj: { innerKey: 'val' },
    });
  });

  // ── 7. List response unwrapping ──────────────────────────────────
  it('should unwrap list response (items + total + pagination) correctly', async () => {
    const mockHttp = {
      request: async () => {
        return new Response(JSON.stringify({
          code: 0,
          message: 'success',
          items: [
            { user_id: 'u-1', user_name: 'alice' },
            { user_id: 'u-2', user_name: 'bob' },
          ],
          total: 42,
          pagination: { page: 1, page_size: 20, total_pages: 3 },
        }), { status: 200 });
      },
    };

    const storage = new MockStorage();
    const tokenManager = new TokenManager(storage);
    tokenManager.setTokens(createToken(), 'rt-1', 900);

    const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: vi.fn() });

    const result = await client.get('/api/v1/users');

    expect(result).toEqual({
      items: [
        { userId: 'u-1', userName: 'alice' },
        { userId: 'u-2', userName: 'bob' },
      ],
      total: 42,
      pagination: { page: 1, pageSize: 20, totalPages: 3 },
    });
  });

  // ── 8. 401 on refresh endpoint → no refresh loop ─────────────────
  it('should NOT trigger another refresh on 401 from refresh endpoint', async () => {
    let callCount = 0;
    const mockHttp = {
      request: async () => {
        callCount++;
        return new Response(JSON.stringify({ code: 401002, message: 'refresh token expired' }), { status: 401 });
      },
    };

    const storage = new MockStorage();
    const tokenManager = new TokenManager(storage);
    tokenManager.setTokens(createToken(), 'rt-1', 900);

    const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: vi.fn() });

    await expect(client.get('/api/v1/auth/refresh')).rejects.toMatchObject({
      name: 'AutionalApiError',
      code: '401002',
      message: 'refresh token expired',
      status: 401,
    });

    expect(callCount).toBe(1);
  });

  // ── 9. 404 tenant not found → error handling ────────────────────
  it('should handle 404 tenant not found gracefully', async () => {
    const mockHttp = {
      request: async () => {
        return new Response(JSON.stringify({ code: 404001, message: 'tenant not found' }), { status: 404 });
      },
    };

    const storage = new MockStorage();
    const tokenManager = new TokenManager(storage);
    tokenManager.setTokens(createToken(), 'rt-1', 900);

    const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: vi.fn() });

    await expect(client.get('/api/v1/tenants/unknown')).rejects.toMatchObject({
      name: 'AutionalApiError',
      code: '404001',
      message: 'tenant not found',
      status: 404,
    });
  });

  // ── 10. Network error → AutionalNetworkError ───────────────────────
  it('should throw AutionalNetworkError on network failure', async () => {
    const mockHttp = {
      request: async () => {
        throw new TypeError('Failed to fetch');
      },
    };

    const storage = new MockStorage();
    const tokenManager = new TokenManager(storage);
    tokenManager.setTokens(createToken(), 'rt-1', 900);

    const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: vi.fn() });

    await expect(client.get('/api/v1/users/me')).rejects.toBeInstanceOf(AutionalNetworkError);
  }, 15000);

  // ── 11. 预刷新（波 3）：剩余寿命 ≤ skew → 请求前先刷新 ─────────────
  describe('pre-refresh (tokenExpirySkew)', () => {
    it('refreshes before the request when token is within skew', async () => {
      const newAt = createToken(900);
      let businessAuthHeader = '';
      const mockHttp = {
        request: async (url: string, init?: RequestInit) => {
          if (url.includes('/api/v1/auth/refresh')) {
            return new Response(JSON.stringify({ code: 0, data: { access_token: newAt, refresh_token: 'rt-2', expires_in: 900 } }), { status: 200 });
          }
          businessAuthHeader = ((init?.headers as Record<string, string>) || {})['Authorization'] || '';
          return new Response(JSON.stringify({ code: 0, message: 'ok', data: { id: '1' } }), { status: 200 });
        },
      };

      const storage = new MockStorage();
      const tokenManager = new TokenManager(storage);
      tokenManager.setTokens(createToken(10), 'rt-1', 10); // 剩 10s

      const refreshFn = vi.fn(async () => {
        const resp = await mockHttp.request(`${BASE_URL}/api/v1/auth/refresh`, { method: 'POST' });
        const json: Record<string, unknown> = await resp.json();
        const d = json.data as Record<string, unknown>;
        tokenManager.setTokens(d.access_token as string, d.refresh_token as string, d.expires_in as number);
      });

      const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: refreshFn, refreshSkewMs: 30_000 });
      await client.get('/api/v1/users/me');

      expect(refreshFn).toHaveBeenCalledTimes(1);
      expect(businessAuthHeader).toBe(`Bearer ${newAt}`);
    });

    it('does NOT pre-refresh when token lifetime exceeds skew', async () => {
      const mockHttp = {
        request: async () => new Response(JSON.stringify({ code: 0, message: 'ok', data: {} }), { status: 200 }),
      };
      const storage = new MockStorage();
      const tokenManager = new TokenManager(storage);
      tokenManager.setTokens(createToken(900), 'rt-1', 900);
      const refreshFn = vi.fn();

      const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: refreshFn, refreshSkewMs: 30_000 });
      await client.get('/api/v1/users/me');

      expect(refreshFn).not.toHaveBeenCalled();
    });

    it('does NOT pre-refresh when skew is 0 (disabled)', async () => {
      const mockHttp = {
        request: async () => new Response(JSON.stringify({ code: 0, message: 'ok', data: {} }), { status: 200 }),
      };
      const storage = new MockStorage();
      const tokenManager = new TokenManager(storage);
      tokenManager.setTokens(createToken(5), 'rt-1', 5); // 即将过期
      const refreshFn = vi.fn();

      const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: refreshFn, refreshSkewMs: 0 });
      await client.get('/api/v1/users/me');

      expect(refreshFn).not.toHaveBeenCalled();
    });

    it('pre-refresh failure keeps session intact and still sends the request (留给 401 路径)', async () => {
      let businessAuthHeader: string | undefined;
      const mockHttp = {
        request: async (_url: string, init?: RequestInit) => {
          businessAuthHeader = ((init?.headers as Record<string, string>) || {})['Authorization'];
          return new Response(JSON.stringify({ code: 0, message: 'ok', data: {} }), { status: 200 });
        },
      };
      const storage = new MockStorage();
      const tokenManager = new TokenManager(storage);
      const oldAt = createToken(10);
      tokenManager.setTokens(oldAt, 'rt-1', 10);

      const refreshFn = vi.fn(async () => { throw new Error('network blip'); });
      const onForceLogout = vi.fn();

      const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: refreshFn, onForceLogout, refreshSkewMs: 30_000 });
      const result = await client.get('/api/v1/users/me');

      expect(result).toEqual({});
      expect(refreshFn).toHaveBeenCalledTimes(1);
      expect(onForceLogout).not.toHaveBeenCalled();
      expect(tokenManager.getRefreshToken()).toBe('rt-1'); // 会话未被清除
      expect(businessAuthHeader).toBe(`Bearer ${oldAt}`);   // 仍带旧 token 发出
    });

    it('concurrent requests near expiry share one pre-refresh (single-flight)', async () => {
      const newAt = createToken(900);
      let refreshCalls = 0;
      const mockHttp = {
        request: async (url: string, _init?: RequestInit) => {
          if (url.includes('/api/v1/auth/refresh')) {
            refreshCalls++;
            return new Response(JSON.stringify({ code: 0, data: { access_token: newAt, refresh_token: 'rt-2', expires_in: 900 } }), { status: 200 });
          }
          return new Response(JSON.stringify({ code: 0, message: 'ok', data: {} }), { status: 200 });
        },
      };

      const storage = new MockStorage();
      const tokenManager = new TokenManager(storage);
      tokenManager.setTokens(createToken(10), 'rt-1', 10);

      const refreshFn = vi.fn(async () => {
        const resp = await mockHttp.request(`${BASE_URL}/api/v1/auth/refresh`, { method: 'POST' });
        const json: Record<string, unknown> = await resp.json();
        const d = json.data as Record<string, unknown>;
        tokenManager.setTokens(d.access_token as string, d.refresh_token as string, d.expires_in as number);
      });

      const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: refreshFn, refreshSkewMs: 30_000 });
      await Promise.all([client.get('/api/v1/a'), client.get('/api/v1/b')]);

      expect(refreshCalls).toBe(1);
      expect(refreshFn).toHaveBeenCalledTimes(1);
    });

    it('401 path clears + force-logs-out even when it joins an in-flight pre-refresh (race)', async () => {
      let releaseBusiness!: (r: Response) => void;
      const businessGate = new Promise<Response>((res) => { releaseBusiness = res; });
      let rejectRefresh!: (e: Error) => void;
      const refreshGate = new Promise<void>((_, rej) => { rejectRefresh = rej; });

      const mockHttp = { request: async () => businessGate };
      const storage = new MockStorage();
      const tokenManager = new TokenManager(storage);
      tokenManager.setTokens(createToken(900), 'rt-1', 900);

      const refreshFn = vi.fn(() => refreshGate);
      const onForceLogout = vi.fn();
      const client = new ApiClient({ baseUrl: BASE_URL, tokenManager, http: mockHttp, refreshTokenFn: refreshFn, onForceLogout, refreshSkewMs: 30_000 });

      // ① 慢请求：AT 未临期 → 直接发出（挂在 businessGate 上）
      const slow = client.get('/api/v1/slow');
      await new Promise(r => setTimeout(r, 0));

      // ② 令牌临期 → 快请求触发预刷新（在飞，pending）
      tokenManager.setTokens(createToken(5), 'rt-1', 5);
      const fast = client.get('/api/v1/fast');
      await new Promise(r => setTimeout(r, 0));
      expect(refreshFn).toHaveBeenCalledTimes(1);

      // ③ 释放慢请求的 401 → handle401 加入同一在飞预刷新
      releaseBusiness(new Response(JSON.stringify({ code: 401, message: 'unauthorized' }), { status: 401 }));
      await new Promise(r => setTimeout(r, 0));

      // ④ 在飞刷新失败 → 401 路径必须清会话 + 强制登出（不能随预刷新沉默失败）
      rejectRefresh(new Error('refresh backend down'));

      await expect(slow).rejects.toMatchObject({ code: 'SESSION_EXPIRED' });
      expect(onForceLogout).toHaveBeenCalledTimes(1);
      expect(tokenManager.getAccessToken()).toBeNull();

      // 快请求收敛：预刷新被吞 → 请求照发 → 401 → 二次刷新（立即失败）→ 闩锁已置 → REFRESH_FAILED
      await expect(fast).rejects.toMatchObject({ code: 'REFRESH_FAILED' });
      expect(onForceLogout).toHaveBeenCalledTimes(1);
    });
  });
});
