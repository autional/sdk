import type { AuthmsPlatform } from '@authms/core/platform';

export interface MiniAppGlobalData {
  authms?: import('@authms/core').AuthMS & WechatExtensions;
  [key: string]: unknown;
}

interface WechatExtensions {
  loginWithWechat(): Promise<import('@authms/core').AuthResult>;
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

export interface UseAuthmsReturn {
  user: import('@authms/core').User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: import('@authms/core').LoginRequest) => Promise<import('@authms/core').AuthResult>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  loginWithWechat: () => Promise<import('@authms/core').AuthResult>;
}

export type { AuthmsPlatform };
