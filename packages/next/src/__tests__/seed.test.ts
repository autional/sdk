import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { computeSeedPayload, seedStorage, STORAGE_KEY } from '../seed';

const TOKEN = 'header.payload.sig';

const BARE = JSON.stringify({ accessToken: 'old', refreshToken: null, user: null, tenantId: null, expiresAt: null });

function createLocalStorageStub() {
  const store = new Map<string, string>();
  return {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, v); },
    removeItem: (k: string) => { store.delete(k); },
  };
}

describe('computeSeedPayload — 播种降覆写 (C13)', () => {
  it('storage 为空 → 播种裸载荷（cookie 冷启动桥）', () => {
    const payload = computeSeedPayload(null, TOKEN);
    expect(JSON.parse(payload!)).toEqual({
      accessToken: TOKEN, refreshToken: null, user: null, tenantId: null, expiresAt: null,
    });
  });

  it('现存裸形态 → 覆写 accessToken（裸形态重播种零损失）', () => {
    const payload = computeSeedPayload(BARE, TOKEN);
    expect(JSON.parse(payload!).accessToken).toBe(TOKEN);
  });

  it('现存富会话（refreshToken）→ 不播种', () => {
    const rich = JSON.stringify({ accessToken: 'old', refreshToken: 'rt-1', user: null, tenantId: null, expiresAt: null });
    expect(computeSeedPayload(rich, TOKEN)).toBeNull();
  });

  it('现存富会话（user）→ 不播种', () => {
    const rich = JSON.stringify({ accessToken: 'old', refreshToken: null, user: { username: 'bob' }, tenantId: null, expiresAt: null });
    expect(computeSeedPayload(rich, TOKEN)).toBeNull();
  });

  it('现存富会话（tenantId / expiresAt）→ 不播种', () => {
    expect(computeSeedPayload(JSON.stringify({ accessToken: 'old', tenantId: 'tnt-1' }), TOKEN)).toBeNull();
    expect(computeSeedPayload(JSON.stringify({ accessToken: 'old', expiresAt: 1730000000000 }), TOKEN)).toBeNull();
  });

  it('坏 JSON → 按空处理重新播种', () => {
    expect(JSON.parse(computeSeedPayload('{not-json', TOKEN)!).accessToken).toBe(TOKEN);
  });

  it('非对象 JSON → 重新播种', () => {
    expect(JSON.parse(computeSeedPayload('"str"', TOKEN)!).accessToken).toBe(TOKEN);
    expect(JSON.parse(computeSeedPayload('42', TOKEN)!).accessToken).toBe(TOKEN);
  });
});

describe('seedStorage — 接线（localStorage 桩）', () => {
  let stub: ReturnType<typeof createLocalStorageStub>;

  beforeEach(() => {
    stub = createLocalStorageStub();
    (globalThis as any).localStorage = stub;
  });

  afterEach(() => {
    delete (globalThis as any).localStorage;
  });

  it('空存储 → 写入裸载荷', () => {
    seedStorage(TOKEN);
    expect(JSON.parse(stub.getItem(STORAGE_KEY)!).accessToken).toBe(TOKEN);
  });

  it('富会话在存 → 不写（refreshToken/user 保留原样）', () => {
    const rich = JSON.stringify({ accessToken: 'old', refreshToken: 'rt-1', user: { username: 'bob' }, tenantId: 't1', expiresAt: 1 });
    stub.setItem(STORAGE_KEY, rich);
    seedStorage(TOKEN);
    expect(stub.getItem(STORAGE_KEY)).toBe(rich);
  });

  it('localStorage 不可用（getItem 抛）→ 静默不崩溃', () => {
    (globalThis as any).localStorage = { getItem: () => { throw new Error('denied'); }, setItem: () => {} };
    expect(() => seedStorage(TOKEN)).not.toThrow();
  });
});
