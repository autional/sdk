/**
 * SDK Integration Test — connects to running AuthMS Docker monolith
 *
 * Prerequisites: Docker services running (gateway on localhost:11080)
 * Run: npx vitest run src/__tests__/integration.test.ts
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { AuthMS } from '../authms';
import { browserPlatform } from '../platform/browser';

const BFF_URL = 'http://localhost:11080/bff';

let authms: AuthMS;

beforeAll(async () => {
  authms = new AuthMS({
    appId: 'int-test-app',
    issuer: 'http://localhost:11080',
    apiUrl: BFF_URL,
    platform: browserPlatform,
    syncTabs: false,
  });
  await authms.initialize();
});

describe('SDK Integration Tests — AuthMS Docker', () => {
  it('1. Health Check', async () => {
    const r = await fetch(`http://localhost:11080/health`);
    expect(r.status).toBe(200);
    const j = await r.json();
    expect(j.status).toBe('healthy');
  });

  it('2. Auth Config from running gateway', async () => {
    const config = await authms.fetchAuthConfig('default');
    expect(config.tenantId).toBeTruthy();
    expect(config.passwordPolicy).toBeTruthy();
    expect(config.passwordPolicy.mode).toBe('hash');
    expect(config.captchaEnabled).toBe(false);
  });

  it('3. Login failure — wrong credentials returns error', async () => {
    try {
      await authms.login({ email: 'no-such@test.com', password: 'wrong' });
      expect(true).toBe(false);
    } catch (e: any) {
      expect(e.message).toBeTruthy();
    }
  });

  it('4. Login failure — empty password returns error', async () => {
    try {
      await authms.login({ email: 'x@test.com', password: '' });
      expect(true).toBe(false);
    } catch (e: any) {
      expect(e.message).toBeTruthy();
    }
  });

  it('5. Logout without login — no-op', async () => {
    await authms.logout();
    expect(true).toBe(true);
  });
});
