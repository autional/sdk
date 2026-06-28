import { describe, it, expect } from 'vitest';
import { miniappPlatform } from '../platform';
import type { AuthmsPlatform } from '../types';

describe('miniapp platform adapter', () => {
  it('provides storage adapter', () => {
    expect(miniappPlatform.storage).toBeDefined();
    expect(typeof miniappPlatform.storage.getItem).toBe('function');
    expect(typeof miniappPlatform.storage.setItem).toBe('function');
    expect(typeof miniappPlatform.storage.removeItem).toBe('function');
  });

  it('provides http adapter', () => {
    expect(miniappPlatform.http).toBeDefined();
    expect(typeof miniappPlatform.http.request).toBe('function');
  });
});
