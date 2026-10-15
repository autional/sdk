import { describe, it, expect, afterEach, vi } from 'vitest';
import { Autional } from '../autional';
import type { StorageAdapter } from '../platform/types';

class MockStorage implements StorageAdapter {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
}

/** 同名 channel 后注册者覆盖前者 —— 与 refresh-broadcast.test 同款装置 */
class MockBroadcastChannel {
  name: string;
  onmessage: ((event: any) => void) | null = null;
  private static channels: Map<string, MockBroadcastChannel> = new Map();
  constructor(name: string) { this.name = name; MockBroadcastChannel.channels.set(name, this); }
  postMessage(data: any) {
    MockBroadcastChannel.channels.forEach((ch, key) => {
      // 真实 BroadcastChannel 不向发送者自身投递
      if (key === this.name && ch !== this && ch.onmessage) ch.onmessage({ data });
    });
  }
  close() { MockBroadcastChannel.channels.delete(this.name); }
}

(globalThis as any).BroadcastChannel = MockBroadcastChannel;

function createToken(expInSeconds = 900): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: 'user-1', exp: Math.floor(Date.now() / 1000) + expInSeconds }));
  return `${header}.${payload}.sig`;
}

interface RecordedRequest { url: string; method: string; body: string; headers: Record<string, string> }

function createMockHttp(responses: Record<string, unknown>) {
  const requests: RecordedRequest[] = [];
  return {
    request: async (url: string, init?: RequestInit) => {
      const method = init?.method || 'GET';
      requests.push({ url, method, body: (init?.body as string) || '', headers: (init?.headers as Record<string, string>) || {} });
      const res = responses[`${method} ${url}`];
      if (!res) {
        return new Response(JSON.stringify({ code: 404, message: `Unexpected: ${method} ${url}` }), { status: 404 });
      }
      const status = (res as any).__status || 200;
      return new Response(JSON.stringify(res), { status, headers: { 'Content-Type': 'application/json' } });
    },
    getRequests: () => requests,
  };
}

const BASE_URL = 'https://api.example.com';
const REFRESH_KEY = `POST ${BASE_URL}/identity/api/v1/auth/refresh`;
const SSO_REFRESH_KEY = `POST ${BASE_URL}/oauth/api/v1/oauth/refresh`;
const PROFILE_KEY = `GET ${BASE_URL}/identity/api/v1/auth/me`;
const STORAGE_KEY = 'autional_tokens';

describe('Autional.initialize — 冷启动会话恢复与会话桥', () => {
  let disposeFns: Array<() => void> = [];

  afterEach(() => {
    MockBroadcastChannel['channels'].clear();
    disposeFns.forEach((fn) => fn());
    disposeFns = [];
  });

  /** 冷启动模拟：存储预置裸 JSON，再新建实例 initialize() */
  function setup(responses: Record<string, unknown>, rawStore?: Record<string, unknown>) {
    const storage = new MockStorage();
    if (rawStore) storage.setItem(STORAGE_KEY, JSON.stringify(rawStore));
    const http = createMockHttp(responses);
    const autional = new Autional({
      issuer: BASE_URL,
      appId: 'app-1',
      platform: { storage, http },
    });
    disposeFns.push(() => autional.dispose());
    return { autional, http };
  }

  it('refreshes expired session on cold start (identity 模式) and hydrates user', async () => {
    const newToken = createToken(900);
    const { autional, http } = setup(
      {
        [REFRESH_KEY]: { code: 0, data: { access_token: newToken, refresh_token: 'rt-2', expires_in: 900 } },
        [PROFILE_KEY]: { code: 0, data: { username: 'bob' } },
      },
      { accessToken: createToken(-60), refreshToken: 'rt-1' },
    );

    const events: string[] = [];
    autional.on('READY', () => events.push('READY'));
    autional.on('USER_CHANGED', () => events.push('USER_CHANGED'));
    autional.on('LOGGED_OUT', () => events.push('LOGGED_OUT'));

    await autional.initialize();

    expect(autional.tokenManager.getAccessToken()).toBe(newToken);
    expect(autional.tokenManager.getRefreshToken()).toBe('rt-2');
    expect(events).not.toContain('LOGGED_OUT');
    expect(events).toContain('READY');
    expect(events).toContain('USER_CHANGED');
    expect((autional.user as Record<string, unknown> | null)?.username).toBe('bob');

    const refreshCalls = http.getRequests().filter((r) => `${r.method} ${r.url}` === REFRESH_KEY);
    expect(refreshCalls).toHaveLength(1);
  });

  it('refreshes expired SSO session via oauth refresh endpoint', async () => {
    const newToken = createToken(900);
    const { autional, http } = setup(
      {
        [SSO_REFRESH_KEY]: { code: 0, data: { access_token: newToken, refresh_token: 'rt-sso-2', expires_in: 900 } },
        [PROFILE_KEY]: { code: 0, data: { username: 'sso-bob' } },
      },
      { accessToken: createToken(-60), refreshToken: 'rt-sso-1', authMode: 'sso', oauthClientId: 'cid-1' },
    );

    await autional.initialize();

    expect(autional.tokenManager.getAccessToken()).toBe(newToken);
    expect(autional.tokenManager.getRefreshToken()).toBe('rt-sso-2');
    const ssoCalls = http.getRequests().filter((r) => `${r.method} ${r.url}` === SSO_REFRESH_KEY);
    expect(ssoCalls).toHaveLength(1);
    const identityCalls = http.getRequests().filter((r) => `${r.method} ${r.url}` === REFRESH_KEY);
    expect(identityCalls).toHaveLength(0);
  });

  it('falls through silently when refresh fails on cold start (401)', async () => {
    const { autional, http } = setup(
      { [REFRESH_KEY]: { code: '10004', message: 'invalid refresh token', __status: 401 } },
      { accessToken: createToken(-60), refreshToken: 'rt-dead' },
    );

    const ready = vi.fn();
    const loggedOut = vi.fn();
    autional.on('READY', ready);
    autional.on('LOGGED_OUT', loggedOut);

    await autional.initialize();

    expect(ready).toHaveBeenCalledTimes(1);
    // 静默语义（与 401 路径统一）：失败不清会话、不发 LOGGED_OUT，按未登录继续
    expect(loggedOut).not.toHaveBeenCalled();
    expect(autional.tokenManager.getAccessToken()).toBeNull();
    expect(autional.isAuthenticated()).toBe(false);
    expect(http.getRequests().some((r) => `${r.method} ${r.url}` === REFRESH_KEY)).toBe(true);
  });

  it('emits LOGGED_OUT exactly once on refresh-token reuse during cold start', async () => {
    const { autional } = setup(
      { [REFRESH_KEY]: { code: '40000502', message: 'refresh token has been reused - all sessions revoked', __status: 401 } },
      { accessToken: createToken(-60), refreshToken: 'rt-reused' },
    );

    const loggedOut = vi.fn();
    autional.on('LOGGED_OUT', loggedOut);

    await autional.initialize();

    expect(loggedOut).toHaveBeenCalledTimes(1);
    expect(autional.isAuthenticated()).toBe(false);
  });

  it('does not attempt refresh without a refresh token', async () => {
    const { autional, http } = setup({}, { accessToken: createToken(-60), refreshToken: null });

    await autional.initialize();

    const refreshCalls = http.getRequests().filter((r) => r.url.includes('/auth/refresh') || r.url.includes('/oauth/refresh'));
    expect(refreshCalls).toHaveLength(0);
    expect(autional.isAuthenticated()).toBe(false);
  });

  it('binds session bridge on logged-out start — later token changes emit public events', async () => {
    const { autional } = setup({});

    await autional.initialize();

    const tokenChanged = vi.fn();
    const userChanged = vi.fn();
    const loggedOut = vi.fn();
    autional.on('TOKEN_CHANGED', tokenChanged);
    autional.on('USER_CHANGED', userChanged);
    autional.on('LOGGED_OUT', loggedOut);

    autional.tokenManager.setTokens(createToken(900), 'rt-x', 900);
    expect(tokenChanged).toHaveBeenCalledTimes(1);
    expect(userChanged).toHaveBeenCalledTimes(1);
    expect(loggedOut).not.toHaveBeenCalled();

    autional.tokenManager.clear();
    expect(loggedOut).toHaveBeenCalledTimes(1);
    expect(autional.user).toBeNull();
  });

  it('initialize is idempotent — session bridge binds once', async () => {
    const { autional } = setup({});

    await autional.initialize();
    await autional.initialize();

    const tokenChanged = vi.fn();
    autional.on('TOKEN_CHANGED', tokenChanged);

    autional.tokenManager.setTokens(createToken(900), 'rt-y', 900);
    expect(tokenChanged).toHaveBeenCalledTimes(1);
  });
});
