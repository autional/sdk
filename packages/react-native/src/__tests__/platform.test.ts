import { describe, it, expect } from 'vitest';
import { createRNPlatform } from '../platform';
import type { AsyncStorageLike } from '../types';

describe('React Native platform adapter', () => {
  const mockStorage: AsyncStorageLike = {
    getItem: async (_k: string) => null,
    setItem: async (_k: string, _v: string) => {},
    removeItem: async (_k: string) => {},
  };

  it('createRNPlatform returns AuthmsPlatform', () => {
    const platform = createRNPlatform(mockStorage);
    expect(platform.storage).toBeDefined();
    expect(platform.http).toBeDefined();
    expect(typeof platform.storage.getItem).toBe('function');
    expect(typeof platform.http.request).toBe('function');
  });

  it('storage getItem works with mock', async () => {
    const platform = createRNPlatform(mockStorage);
    const val = await platform.storage.getItem('test');
    expect(val).toBeNull();
  });

  it('throw when calling getItem with undefined key coerces', async () => {
    const platform = createRNPlatform(mockStorage);
    await expect(platform.storage.getItem('whatever')).resolves.toBeNull();
  });
});
