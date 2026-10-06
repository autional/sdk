import { inject, ref, computed, onMounted, onUnmounted, type Ref, type ComputedRef } from 'vue';
import { AUTIONAL_KEY } from './createAutional';
import {
  Autional,
  AutionalError,
  type User,
  type AuthResult,
  type LoginRequest,
  type RegisterRequest,
  type OAuthOptions,
} from '@autional/core';

export interface UseAutionalReturn {
  autional: Autional;
  user: Ref<User | null>;
  isLoading: Ref<boolean>;
  isAuthenticated: ComputedRef<boolean>;
  login: (credentials: LoginRequest) => Promise<AuthResult>;
  loginWithOAuth: (options: OAuthOptions) => Promise<void>;
  register: (data: RegisterRequest) => Promise<AuthResult>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

export function useAutional(): UseAutionalReturn {
  const autional = inject(AUTIONAL_KEY);

  if (!autional) {
    throw new AutionalError(
      'CONFIG_ERROR',
      'useAutional() must be used within a Vue app that has createAutional() plugin installed',
      500,
    );
  }

  const user = ref<User | null>(autional.user);
  const isLoading = ref<boolean>(!autional.isReady());
  const isAuthenticated = computed(() => !!user.value);

  let unsubReady: (() => void) | undefined;
  let unsubUser: (() => void) | undefined;

  onMounted(() => {
    if (autional.isReady()) {
      isLoading.value = false;
    }

    unsubReady = autional.on('READY', () => {
      isLoading.value = false;
    });

    unsubUser = autional.on('USER_CHANGED', () => {
      user.value = autional.user;
    });
  });

  onUnmounted(() => {
    unsubReady?.();
    unsubUser?.();
  });

  return {
    autional,
    user,
    isLoading,
    isAuthenticated,
    login: (credentials) => autional.login(credentials),
    loginWithOAuth: (options) => autional.loginWithOAuth(options),
    register: (data) => autional.register(data),
    logout: () => autional.logout(),
    getAccessToken: () => autional.getAccessToken(),
  };
}
