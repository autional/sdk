import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Autional } from '../autional';
import { TabSync } from '../sync';
import type { StorageAdapter } from '../platform/types';

class MockStorage implements StorageAdapter {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
}

/** 同名 channel 后注册者覆盖前者 —— 以此模拟「另一个标签页」 */
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

describe('Autional — cross-tab refresh broadcast', () => {
  beforeEach(() => {
    MockBroadcastChannel['channels'].clear();
  });

  afterEach(() => {
    MockBroadcastChannel['channels'].clear();
  });

  function setup(responses: Record<string, unknown>) {
    const storage = new MockStorage();
    const http = createMockHttp(responses);
    const autional = new Autional({
      issuer: BASE_URL,
      appId: 'app-1',
      platform: { storage, http },
    });
    // 过期 AT + 有效 RT —— 逼出刷新路径
    autional.tokenManager.setTokens(createToken(-60), 'rt-1', 900);
    return { autional };
  }

  it('broadcasts TOKEN_REFRESHED to other tabs after a successful refresh', async () => {
    const newToken = createToken(900);
    const { autional } = setup({
      [REFRESH_KEY]: { code: 0, data: { access_token: newToken, refresh_token: 'rt-2', expires_in: 900 } },
    });

    const onTokenChange = vi.fn();
    const onLogout = vi.fn();
    const observer = new TabSync(onLogout, onTokenChange);
    observer.listen();

    const token = await autional.getAccessToken();

    expect(token).toBe(newToken);
    expect(onTokenChange).toHaveBeenCalledTimes(1);
    expect(onLogout).not.toHaveBeenCalled();

    observer.close();
    autional.dispose();
  });

  it('broadcasts LOGOUT and emits LOGGED_OUT on token reuse detection', async () => {
    const { autional } = setup({
      [REFRESH_KEY]: { code: '40000502', message: 'refresh token has been reused - all sessions revoked', __status: 401 },
    });

    const onTokenChange = vi.fn();
    const onLogout = vi.fn();
    const observer = new TabSync(onLogout, onTokenChange);
    observer.listen();

    const loggedOut = vi.fn();
    autional.on('LOGGED_OUT', loggedOut);

    const token = await autional.getAccessToken();

    expect(token).toBeNull();
    expect(onLogout).toHaveBeenCalledTimes(1);
    expect(onTokenChange).not.toHaveBeenCalled();
    expect(loggedOut).toHaveBeenCalledTimes(1);

    observer.close();
    autional.dispose();
  });
});
