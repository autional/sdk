import type { AuthmsPlatform } from './types';

export function memoryPlatform(): AuthmsPlatform {
  const store = new Map<string, string>();

  return {
    storage: {
      getItem(key) { return store.get(key) ?? null; },
      setItem(key, value) { store.set(key, value); },
      removeItem(key) { store.delete(key); },
      keys() { return Array.from(store.keys()); },
    },
    http: {
      request(_input, _init) {
        throw new Error('HttpAdapter.request not implemented in memory platform');
      },
    },
  };
}
