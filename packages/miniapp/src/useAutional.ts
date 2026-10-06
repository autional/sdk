import type { UseAutionalReturn } from './types';
import type { AutionalWithWechat } from './createAutional';

const noopAutional: UseAutionalReturn = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => Promise.reject(new Error('createAutional must be called before useAutional')),
  logout: () => Promise.resolve(),
  getAccessToken: () => Promise.resolve(null),
  loginWithWechat: () => Promise.reject(new Error('createAutional must be called before useAutional')),
};

function getAutional(): AutionalWithWechat | undefined {
  try {
    const app = getApp({ allowDefault: true });
    return app?.globalData?.autional as AutionalWithWechat | undefined;
  } catch {
    return undefined;
  }
}

export function useAutional(): UseAutionalReturn {
  const autional = getAutional();

  if (!autional) return noopAutional;

  return {
    get user() {
      return autional.user;
    },

    get isLoading() {
      return !autional.isReady();
    },

    get isAuthenticated() {
      return autional.isAuthenticated();
    },

    login(credentials) {
      return autional.login(credentials);
    },

    logout() {
      return autional.logout();
    },

    getAccessToken() {
      return autional.getAccessToken();
    },

    loginWithWechat() {
      return autional.loginWithWechat();
    },
  };
}
