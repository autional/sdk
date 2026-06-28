import { inject, ref, computed, onMounted, onUnmounted, type Ref, type ComputedRef } from 'vue';
import { AUTHMS_KEY } from './createAuthms';
import {
  AuthMS,
  AuthmsError,
  type User,
  type AuthResult,
  type LoginRequest,
  type RegisterRequest,
  type OAuthOptions,
} from '@authms/core';

export interface UseAuthmsReturn {
  authms: AuthMS;
  user: Ref<User | null>;
  isLoading: Ref<boolean>;
  isAuthenticated: ComputedRef<boolean>;
  login: (credentials: LoginRequest) => Promise<AuthResult>;
  loginWithOAuth: (options: OAuthOptions) => Promise<void>;
  register: (data: RegisterRequest) => Promise<AuthResult>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

export function useAuthms(): UseAuthmsReturn {
  const authms = inject(AUTHMS_KEY);

  if (!authms) {
    throw new AuthmsError(
      'CONFIG_ERROR',
      'useAuthms() must be used within a Vue app that has createAuthms() plugin installed',
      500,
    );
  }

  const user = ref<User | null>(authms.user);
  const isLoading = ref<boolean>(!authms.isReady());
  const isAuthenticated = computed(() => !!user.value);

  let unsubReady: (() => void) | undefined;
  let unsubUser: (() => void) | undefined;

  onMounted(() => {
    if (authms.isReady()) {
      isLoading.value = false;
    }

    unsubReady = authms.on('READY', () => {
      isLoading.value = false;
    });

    unsubUser = authms.on('USER_CHANGED', () => {
      user.value = authms.user;
    });
  });

  onUnmounted(() => {
    unsubReady?.();
    unsubUser?.();
  });

  return {
    authms,
    user,
    isLoading,
    isAuthenticated,
    login: (credentials) => authms.login(credentials),
    loginWithOAuth: (options) => authms.loginWithOAuth(options),
    register: (data) => authms.register(data),
    logout: () => authms.logout(),
    getAccessToken: () => authms.getAccessToken(),
  };
}
