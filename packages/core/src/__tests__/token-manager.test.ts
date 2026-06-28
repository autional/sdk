import { describe, it, expect, beforeEach } from 'vitest';
import { TokenManager } from '../token-manager';
import type { StorageAdapter } from '../platform/types';

class MemoryStorage implements StorageAdapter {
  private store = new Map<string, string>();
  getItem(key: string) { return this.store.get(key) ?? null; }
  setItem(key: string, value: string) { this.store.set(key, value); }
  removeItem(key: string) { this.store.delete(key); }
  keys() { return Array.from(this.store.keys()); }
}

function createToken(overrides: Record<string, unknown> = {}): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: 'user-1',
    user_id: 'user-1',
    tenant_id: 'tenant-1',
    exp: Math.floor(Date.now() / 1000) + 900,
    iat: Math.floor(Date.now() / 1000),
    ...overrides,
  }));
  return `${header}.${payload}.signature`;
}

describe('TokenManager', () => {
  let storage: MemoryStorage;
  let tm: TokenManager;

  beforeEach(() => {
    storage = new MemoryStorage();
    tm = new TokenManager(storage);
  });

  it('should start with no tokens', () => {
    expect(tm.getAccessToken()).toBeNull();
    expect(tm.getRefreshToken()).toBeNull();
    expect(tm.isAuthenticated()).toBe(false);
  });

  it('should store and retrieve tokens', async () => {
    const accessToken = createToken();
    tm.setTokens(accessToken, 'refresh-1', 900);
    await tm.persist();

    expect(tm.getAccessToken()).toBe(accessToken);
    expect(tm.getRefreshToken()).toBe('refresh-1');
    expect(tm.isAuthenticated()).toBe(true);
  });

  it('should detect expired tokens', () => {
    const expiredToken = createToken({ exp: Math.floor(Date.now() / 1000) - 60 });
    tm.setTokens(expiredToken, 'refresh-1', 900);
    expect(tm.getAccessToken()).toBeNull();
    expect(tm.isAuthenticated()).toBe(false);
  });

  it('should clear all tokens', () => {
    tm.setTokens(createToken(), 'refresh-1', 900);
    tm.clear();
    expect(tm.getAccessToken()).toBeNull();
    expect(tm.getRefreshToken()).toBeNull();
    expect(tm.isAuthenticated()).toBe(false);
  });

  it('should persist and load tokens', async () => {
    const accessToken = createToken();
    tm.setTokens(accessToken, 'refresh-1', 900);
    tm.setUser({ id: 'user-1', name: 'Test' });
    await tm.persist();

    const tm2 = new TokenManager(storage);
    await tm2.load();
    expect(tm2.getAccessToken()).toBe(accessToken);
    expect(tm2.getRefreshToken()).toBe('refresh-1');
    expect(tm2.getUser()).toEqual({ id: 'user-1', name: 'Test' });
  });

  it('should notify listeners on token change', () => {
    const calls: (string | null)[] = [];
    const unsub = tm.onTokenChange((t) => calls.push(t));
    tm.setTokens(createToken(), 'r1', 900);
    tm.clear();
    unsub();
    tm.setTokens(createToken(), 'r2', 900);
    expect(calls.length).toBe(2);
    expect(calls[0]).toBeTruthy();
    expect(calls[1]).toBeNull();
  });

  it('should decode JWT claims', () => {
    const token = createToken({ sub: 'user-1', tenant_id: 'tenant-1' });
    const claims = tm.decodeToken(token);
    expect(claims?.sub).toBe('user-1');
    expect(claims?.tenant_id).toBe('tenant-1');
  });

  it('should manage tenant id', () => {
    tm.setTenantId('tenant-1');
    expect(tm.getTenantId()).toBe('tenant-1');
    tm.setTenantId(null);
    expect(tm.getTenantId()).toBeNull();
  });
});
