export interface User {
  id: string;
  username?: string;
  email?: string;
  phone?: string;
  status?: string;
  avatar?: string;
  [key: string]: unknown;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface LoginRequest {
  email?: string;
  phone?: string;
  username?: string;
  password: string;
  tenantId?: string;
  captchaToken?: string;
  captchaProvider?: string;
  captchaChallengeId?: string;
}

export interface RegisterRequest {
  email?: string;
  phone?: string;
  username?: string;
  password: string;
  tenantId?: string;
  name?: string;
}

export interface OAuthOptions {
  provider: string;
  redirectUri?: string;
}

export interface TokenClaims {
  sub?: string;
  user_id?: string;
  tenant_id?: string;
  exp?: number;
  iat?: number;
  session_id?: string;
  type?: string;
  role?: string;
  [key: string]: unknown;
}

export type AuthmsEvent =
  | 'READY'
  | 'USER_CHANGED'
  | 'TOKEN_CHANGED'
  | 'NOT_AUTHENTICATED'
  | 'LOGGED_OUT'
  | 'SECURITY_ALERT';

export interface SecurityAlert {
  reason: 'token_reuse' | 'suspicious_activity' | 'session_revoked';
  message: string;
}

export interface PasswordPolicyConfig {
  mode: string;
  minLength: number;
  maxLength?: number;
  requireUpper: boolean;
  requireLower?: boolean;
  requireDigit?: boolean;
  requireSpecial?: boolean;
  tenantId: string;
  publicKey: string;
}

export interface BrandingInfo {
  logoUrl?: string;
  primaryColor?: string;
  companyName?: string;
  loginPageTitle?: string;
}

export interface TenantAuthConfig {
  tenantId: string;
  tenantName: string;
  displayName: string;
  membershipApproval: string;
  loginMethods: string[];
  oauthProviders: string[];
  passwordPolicy: PasswordPolicyConfig;
  captchaEnabled: boolean;
  captchaProvider: string;
  silentChallengeEnabled: boolean;
  transmissionPublicKey: string;
  oauthClientId: string;
  passkeyEnabled: boolean;
  magicLinkEnabled: boolean;
  branding: BrandingInfo | null;
}

export const ERROR_CODES = {
  CAPTCHA_REQUIRED: 'CAPTCHA_REQUIRED',
  INVALID_CAPTCHA: 'INVALID_CAPTCHA',
  TOKEN_REUSE: 'TOKEN_REUSE',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  REFRESH_FAILED: 'REFRESH_FAILED',
  NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
} as const;

/**
 * 已安装 API 包的类型占位接口。
 * 各 API 包通过 module augmentation 扩展此接口。
 *
 * 安装 @authms/api-identity 后：
 *   const { identity } = useAuthms().api;  // ← 类型安全
 */
export interface RegisteredApis {}
