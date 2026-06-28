import type { UseAuthmsReturn } from './types';
import type { AuthmsWithWechat } from './createAuthms';

const noopAuthms: UseAuthmsReturn = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => Promise.reject(new Error('createAuthms must be called before useAuthms')),
  logout: () => Promise.resolve(),
  getAccessToken: () => Promise.resolve(null),
  loginWithWechat: () => Promise.reject(new Error('createAuthms must be called before useAuthms')),
};

function getAuthms(): AuthmsWithWechat | undefined {
  try {
    const app = getApp({ allowDefault: true });
    return app?.globalData?.authms as AuthmsWithWechat | undefined;
  } catch {
    return undefined;
  }
}

export function useAuthms(): UseAuthmsReturn {
  const authms = getAuthms();

  if (!authms) return noopAuthms;

  return {
    get user() {
      return authms.user;
    },

    get isLoading() {
      return !authms.isReady();
    },

    get isAuthenticated() {
      return authms.isAuthenticated();
    },

    login(credentials) {
      return authms.login(credentials);
    },

    logout() {
      return authms.logout();
    },

    getAccessToken() {
      return authms.getAccessToken();
    },

    loginWithWechat() {
      return authms.loginWithWechat();
    },
  };
}
