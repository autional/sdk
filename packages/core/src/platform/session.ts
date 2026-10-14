import type { AutionalPlatform } from './types';

/** sessionStorage 平台：会话令牌随标签页关闭即失效（比 localStorage 更严的持存边界） */
export const sessionStoragePlatform: AutionalPlatform = {
  storage: {
    getItem(key) {
      try { return sessionStorage.getItem(key); } catch { return null; }
    },
    setItem(key, value) {
      try { sessionStorage.setItem(key, value); } catch { /* quota exceeded */ }
    },
    removeItem(key) {
      try { sessionStorage.removeItem(key); } catch { }
    },
    keys() {
      try { return Object.keys(sessionStorage); } catch { return []; }
    },
  },
  http: {
    request(input, init) {
      return fetch(input, init);
    },
  },
};
