import { describe, it, expect, afterEach, vi } from 'vitest';
import { TokenManager } from '../token-manager';
import { AuthClient } from '../auth-client';
import { DpopManager } from '../dpop';
import { base64UrlEncode } from '../pkce';
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
  };
}

function createToken(expInSeconds = 900): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: 'user-1', exp: Math.floor(Date.now() / 1000) + expInSeconds }));
  return `${header}.${payload}.sig`;
}

function b64urlDecode(seg: string): Uint8Array {
  const b64 = seg.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 ? '='.repeat(4 - (b64.length % 4)) : '';
  const bin = atob(b64 + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function decodeProofPayload(proof: string): Record<string, any> {
  return JSON.parse(new TextDecoder().decode(b64urlDecode(proof.split('.')[1])));
}

/** 轮询流依赖 sleep → 用假时钟按 1s 步进推进，直到 promise 落定 */
async function settleWithFakeTimers<T>(promise: Promise<T>, maxSteps = 40): Promise<T> {
  let settled = false;
  const tracked = promise.then(
    (v) => { settled = true; return v; },
    (e) => { settled = true; throw e; },
  );
  tracked.catch(() => { /* 防未处理拒绝（调用方仍会收到） */ });
  for (let i = 0; i < maxSteps && !settled; i++) {
    await vi.advanceTimersByTimeAsync(1000);
  }
  if (!settled) throw new Error('device flow did not settle within fake-timer budget');
  return tracked;
}

const BASE_URL = 'https://api.example.com';
const AUTH_ORIGIN = 'https://auth.example.com';
const DEVICE_AUTHORIZE_URL = `${BASE_URL}/oauth/api/v1/oauth/device/authorize`;
const TOKEN_URL = `${BASE_URL}/oauth/api/v1/oauth/token`;
const USERINFO_URL = `${BASE_URL}/oauth/api/v1/oauth/userinfo`;
const DEVICE_AUTHORIZE_KEY = `POST ${DEVICE_AUTHORIZE_URL}`;
const TOKEN_KEY = `POST ${TOKEN_URL}`;
const USERINFO_KEY = `GET ${USERINFO_URL}`;

function deviceAuthorizeResponse(overrides: Record<string, unknown> = {}) {
  return {
    code: 0,
    data: {
      device_code: 'dc-1',
      user_code: 'ABCD-1234',
      verification_uri: '/device',
      expires_in: 600,
      interval: 1,
      ...overrides,
    },
  };
}

describe('device flow (RFC 8628)', () => {
  let storage: MockStorage;
  let tokenManager: TokenManager;
  let mockHttp: ReturnType<typeof createMockHttp>;
  let client: AuthClient;

  function setupClient(responses: Record<string, unknown>, options?: { appId?: string; dpop?: boolean }) {
    mockHttp = createMockHttp(responses);
    storage = new MockStorage();
    tokenManager = new TokenManager(storage);
    client = new AuthClient({
      tokenManager,
      http: mockHttp,
      baseUrl: BASE_URL,
      appId: options?.appId ?? 'app-1',
      dpop: options?.dpop ? new DpopManager(storage) : undefined,
    });
  }

  afterEach(() => {
    vi.useRealTimers();
  });

  it('requestDeviceCode posts client_id and resolves the relative verification_uri to the auth origin', async () => {
    setupClient({ [DEVICE_AUTHORIZE_KEY]: deviceAuthorizeResponse({ interval: 5 }) });

    const info = await client.requestDeviceCode();

    expect(info).toEqual({
      deviceCode: 'dc-1',
      userCode: 'ABCD-1234',
      verificationUri: `${AUTH_ORIGIN}/device`,
      expiresIn: 600,
      interval: 5,
    });
    const req = mockHttp.getRequests()[0];
    expect(req.method).toBe('POST');
    expect(JSON.parse(req.body)).toEqual({ client_id: 'app-1' });
  });

  it('requestDeviceCode honours clientId/scope overrides, absolute URIs and defaults', async () => {
    setupClient({
      [DEVICE_AUTHORIZE_KEY]: {
        code: 0,
        data: { device_code: 'dc-2', user_code: 'WXYZ-9876', verification_uri: 'https://sso.example.org/verify' },
      },
    });

    const info = await client.requestDeviceCode({ clientId: 'cli-9', scope: 'openid profile' });

    expect(info.verificationUri).toBe('https://sso.example.org/verify');
    expect(info.expiresIn).toBe(600);
    expect(info.interval).toBe(5);
    expect(JSON.parse(mockHttp.getRequests()[0].body)).toEqual({ client_id: 'cli-9', scope: 'openid profile' });
  });

  it('requestDeviceCode maps RFC error payloads to AutionalAuthError', async () => {
    setupClient({
      [DEVICE_AUTHORIZE_KEY]: { error: 'invalid_client', error_description: 'unknown client', __status: 401 },
    });

    await expect(client.requestDeviceCode()).rejects.toMatchObject({
      name: 'AutionalAuthError',
      code: 'invalid_client',
      message: 'unknown client',
      status: 401,
    });
  });

  it('loginWithDeviceCode polls through pending/slow_down, persists the session and marks auth mode sso', async () => {
    vi.useFakeTimers();
    const accessToken = createToken();
    setupClient({
      [DEVICE_AUTHORIZE_KEY]: deviceAuthorizeResponse(),
      [TOKEN_KEY]: [
        { error: 'authorization_pending', __status: 400 },
        { error: 'slow_down', __status: 400 },
        { access_token: accessToken, refresh_token: 'rt-device', token_type: 'Bearer', expires_in: 900 },
      ],
      [USERINFO_KEY]: { code: 0, data: { sub: 'user-9', email: 'u9@example.com' } },
    });

    const onUserCode = vi.fn();
    const result = await settleWithFakeTimers(client.loginWithDeviceCode({ onUserCode }));

    expect(onUserCode).toHaveBeenCalledTimes(1);
    expect(onUserCode.mock.calls[0][0]).toMatchObject({
      userCode: 'ABCD-1234',
      verificationUri: `${AUTH_ORIGIN}/device`,
    });
    expect(result.accessToken).toBe(accessToken);
    expect(result.user).toMatchObject({ id: 'user-9', email: 'u9@example.com' });
    expect(tokenManager.getAccessToken()).toBe(accessToken);
    expect(tokenManager.getAuthMode()).toBe('sso');
    expect(tokenManager.getOAuthClientId()).toBe('app-1');

    const polls = mockHttp.getRequests().filter((r) => r.url === TOKEN_URL);
    expect(polls).toHaveLength(3);
    const form = new URLSearchParams(polls[0].body);
    expect(form.get('grant_type')).toBe('urn:ietf:params:oauth:grant-type:device_code');
    expect(form.get('device_code')).toBe('dc-1');
    expect(form.get('client_id')).toBe('app-1');
  });

  it('aborts the flow when the signal fires (no polling request is sent)', async () => {
    setupClient({ [DEVICE_AUTHORIZE_KEY]: deviceAuthorizeResponse() });
    const controller = new AbortController();

    await expect(
      client.loginWithDeviceCode({ signal: controller.signal, onUserCode: () => controller.abort() }),
    ).rejects.toMatchObject({ name: 'AutionalAuthError', code: 'DEVICE_FLOW_ABORTED' });

    expect(mockHttp.getRequests().some((r) => r.url === TOKEN_URL)).toBe(false);
  });

  it('maps expired_token to DEVICE_CODE_EXPIRED', async () => {
    vi.useFakeTimers();
    setupClient({
      [DEVICE_AUTHORIZE_KEY]: deviceAuthorizeResponse(),
      [TOKEN_KEY]: { error: 'expired_token', __status: 400 },
    });

    await expect(settleWithFakeTimers(client.loginWithDeviceCode())).rejects.toMatchObject({
      code: 'DEVICE_CODE_EXPIRED',
      status: 400,
    });
  });

  it('maps access_denied to DEVICE_ACCESS_DENIED', async () => {
    vi.useFakeTimers();
    setupClient({
      [DEVICE_AUTHORIZE_KEY]: deviceAuthorizeResponse(),
      [TOKEN_KEY]: { error: 'access_denied', __status: 400 },
    });

    await expect(settleWithFakeTimers(client.loginWithDeviceCode())).rejects.toMatchObject({
      code: 'DEVICE_ACCESS_DENIED',
      status: 403,
    });
  });

  // 注：本用例走真实时钟 —— WebCrypto 的 promise 在 vitest fake timers 下不落定
  it('attaches DPoP to token/userinfo calls but not to the device authorization request', async () => {
    const accessToken = createToken();
    setupClient(
      {
        [DEVICE_AUTHORIZE_KEY]: deviceAuthorizeResponse(),
        [TOKEN_KEY]: { access_token: accessToken, refresh_token: 'rt-dpop', expires_in: 900 },
        [USERINFO_KEY]: { code: 0, data: { sub: 'u-dpop' } },
      },
      { dpop: true },
    );

    await client.loginWithDeviceCode();

    const [authorizeReq, pollReq, userinfoReq] = mockHttp.getRequests();
    expect(authorizeReq.headers['DPoP']).toBeUndefined();

    expect(pollReq.headers['DPoP']).toBeTruthy();
    const pollPayload = decodeProofPayload(pollReq.headers['DPoP']);
    expect(pollPayload.htm).toBe('POST');
    expect(pollPayload.htu).toBe(TOKEN_URL);
    expect(pollPayload.ath).toBeUndefined();

    expect(userinfoReq.headers['DPoP']).toBeTruthy();
    const userinfoPayload = decodeProofPayload(userinfoReq.headers['DPoP']);
    const expectedAth = base64UrlEncode(
      new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(accessToken))),
    );
    expect(userinfoPayload.ath).toBe(expectedAth);
  });
});
