import type { AutionalPlatform } from '@autional/core/platform';

export interface MiniAppGlobalData {
  autional?: import('@autional/core').Autional & WechatExtensions;
  [key: string]: unknown;
}

interface WechatExtensions {
  loginWithWechat(): Promise<import('@autional/core').AuthResult>;
  getPhoneNumber(e: WechatPhoneEvent): Promise<string>;
}

export interface MiniappConfig {
  appId: string;
  authUrl: string;
  storagePrefix?: string;
}

export interface WechatPhoneEvent {
  detail: {
    errMsg: string;
    code?: string;
    encryptedData?: string;
    iv?: string;
  };
}

export interface UseAutionalReturn {
  user: import('@autional/core').User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: import('@autional/core').LoginRequest) => Promise<import('@autional/core').AuthResult>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  loginWithWechat: () => Promise<import('@autional/core').AuthResult>;
}

export type { AutionalPlatform };
