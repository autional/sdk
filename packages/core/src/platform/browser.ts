import type { AuthmsPlatform } from './types';

export const browserPlatform: AuthmsPlatform = {
  storage: {
    getItem(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    setItem(key, value) {
      try { localStorage.setItem(key, value); } catch { /* quota exceeded */ }
    },
    removeItem(key) {
      try { localStorage.removeItem(key); } catch { }
    },
    keys() {
      try { return Object.keys(localStorage); } catch { return []; }
    },
  },
  http: {
    request(input, init) {
      return fetch(input, init);
    },
  },
};
