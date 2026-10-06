import type { AutionalPlatform } from '@autional/core';
import type { AsyncStorageLike } from './types';

export function createRNPlatform(storage: AsyncStorageLike): AutionalPlatform {
  return {
    storage: {
      getItem(key) { return storage.getItem(key); },
      setItem(key, value) { return storage.setItem(key, value); },
      removeItem(key) { return storage.removeItem(key); },
    },
    http: {
      request(input, init) { return fetch(input, init); },
    },
  };
}
