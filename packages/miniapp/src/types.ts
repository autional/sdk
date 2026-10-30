import type { AutionalPlatform } from '@autional/core/platform';

export interface MiniAppGlobalData {
  autional?: import('@autional/core').Autional;
  [key: string]: unknown;
}

export interface MiniappConfig {
  appId: string;
  authUrl: string;
  storagePrefix?: string;
}

export interface UseAutionalReturn {
  user: import('@autional/core').User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: import('@autional/core').LoginRequest) => Promise<import('@autional/core').AuthResult>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

export type { AutionalPlatform };
