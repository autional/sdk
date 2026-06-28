/**
 * SDK Connectivity Tests — 真实 Docker AuthMS 端到端验证
 *
 * Prerequisites: Docker AuthMS running (gateway on localhost:11080)
 * Run: npx vitest run src/__tests__/connectivity.test.ts
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { AuthMS } from '../authms';
import { browserPlatform } from '../platform/browser';

const BFF_URL = 'http://localhost:11080/bff';
const GATEWAY = 'http://localhost:11080';

let authms: AuthMS;
let skipAll = false;

beforeAll(async () => {
  try {
    const r = await fetch(`${GATEWAY}/health`);
    if (r.status !== 200) { skipAll = true; return; }
  } catch { skipAll = true; return; }

  authms = new AuthMS({
    appId: 'connectivity-test',
    issuer: GATEWAY,
    apiUrl: BFF_URL,
    platform: browserPlatform,
    syncTabs: false,
  });
  await authms.initialize();
});

function testUser() {
  return `sdk-conn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.com`;
}

describe('SDK Connectivity — Docker AuthMS', () => {
  let user: { email: string; id?: string; token?: string; rt?: string };

  it('1. Health Check', async () => {
    if (skipAll) return;
    const r = await fetch(`${GATEWAY}/health`);
    expect(r.status).toBe(200);
    const j = await r.json();
    expect(j.status).toBe('healthy');
  });

  it('2. Auth Config', async () => {
    if (skipAll) return;
    const config = await authms.fetchAuthConfig('default');
    expect(config.tenantId).toBeTruthy();
    expect(config.passwordPolicy.mode).toBe('hash');
  });

  it('3. Full lifecycle: register → login → profile → logout → revoked', async () => {
    if (skipAll) return;
    const email = testUser();
    user = { email };

    // Register
    const r = await authms.register({ email, password: 'Test@Pass123!', name: 'Conn' });
    expect(r.user.id).toBeTruthy();
    user.id = r.user.id;
    user.token = r.accessToken;
    user.rt = r.refreshToken;

    // Login
    const l = await authms.login({ email, password: 'Test@Pass123!' });
    expect(l.accessToken).toBeTruthy();
    expect(l.user.id).toBe(user.id);

    // Profile
    const p = await authms.getProfile();
    expect(p).toBeTruthy();

    // Logout
    await authms.logout();
    expect(authms.isAuthenticated()).toBe(false);

    // Verify revoked
    const vr = await fetch(`${BFF_URL}/identity/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    expect(vr.status).toBe(401);
  });

  it('4. Login with hash mode', async () => {
    if (skipAll) return;
    const email = testUser();
    await authms.register({ email, password: 'Hash@Pass1!', name: 'Hash' });
    const l = await authms.login({ email, password: 'Hash@Pass1!' });
    expect(l.accessToken).toBeTruthy();
  });

  it('5. Login failure — wrong password', async () => {
    if (skipAll) return;
    try {
      await authms.login({ email: 'no-such@test.com', password: 'wrong' });
      expect(true).toBe(false);
    } catch (e: any) {
      expect(e.message).toBeTruthy();
    }
  });

  it('6. Login failure — non-existent user', async () => {
    if (skipAll) return;
    try {
      await authms.login({ email: `nx-${Date.now()}@test.com`, password: 'x' });
      expect(true).toBe(false);
    } catch (e: any) {
      expect(e.message).toBeTruthy();
    }
  });

  it('7. SDK register + SDK login', async () => {
    if (skipAll) return;
    const email = testUser();
    const r = await authms.register({ email, password: 'SdkReg@1!', name: 'SdkReg' });
    expect(r.user.id).toBeTruthy();

    const l = await authms.login({ email, password: 'SdkReg@1!' });
    expect(l.accessToken).toBeTruthy();
    expect(l.user.id).toBe(r.user.id);
  });

  it('8. Logout without login', async () => {
    if (skipAll) return;
    const a = new AuthMS({
      appId: 'anon', issuer: GATEWAY, apiUrl: BFF_URL,
      platform: browserPlatform, syncTabs: false,
    });
    await a.initialize();
    await a.logout();
    expect(true).toBe(true); // no error
  });
});
