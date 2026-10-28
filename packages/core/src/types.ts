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

/** 会话获取方式：password = 账号密码（identity），sso = OAuth 授权码 + PKCE（oauth 服务） */
export type AuthMode = 'password' | 'sso';

export interface OAuthOptions {
  /** OAuth client_id（默认取 SDK 配置的 appId） */
  clientId?: string;
  /** 回调地址（默认 window.location.origin + '/oauth/callback'） */
  redirectUri?: string;
  /** 请求 scope（默认 'openid profile email'） */
  scope?: string;
  /** SSO 授权入口覆盖（默认由 apiUrl 推导 auth.<root> 域） */
  authorizeUrl?: string;
  /** 附加授权参数（如 prompt、login_hint、nonce） */
  extraParams?: Record<string, string>;
}

/** 设备授权码信息（RFC 8628 设备流，登录前展示给用户） */
export interface DeviceCodeInfo {
  deviceCode: string;
  /** 用户码（形如 XXXX-XXXX，用户在验证页输入） */
  userCode: string;
  /** 验证页地址（服务端返回相对路径时已解析为 auth 域绝对地址） */
  verificationUri: string;
  /** 设备码有效期（秒，默认 600） */
  expiresIn: number;
  /** 轮询间隔（秒，默认 5；slow_down 时自动 +5） */
  interval: number;
}

/** 设备流登录选项 */
export interface DeviceLoginOptions {
  /** OAuth client_id（默认取 SDK 配置的 appId） */
  clientId?: string;
  /** 请求 scope */
  scope?: string;
  /** 拿到 user_code 后回调（用于向用户展示 userCode 与 verificationUri） */
  onUserCode?: (info: DeviceCodeInfo) => void;
  /** 取消轮询 */
  signal?: AbortSignal;
}

/** RP-Initiated Logout 选项（SSO 会话 logout 整页跳转 end_session_endpoint 时使用） */
export interface LogoutOptions {
  /** 登出后回跳地址（默认 window.location.origin + '/'） */
  postLogoutRedirectUri?: string;
  /** 透传 state（默认 SDK 生成随机值）；与门户登出 state 语义独立 */
  state?: string;
}

/** RFC 7009 令牌撤销选项 */
export interface RevokeTokensOptions {
  /** 撤销范围：'all'（默认，access + refresh）/ 'access' / 'refresh' */
  tokens?: 'all' | 'access' | 'refresh';
  /** 显式 access token 覆盖（默认取当前会话；logout 后撤销已捕获令牌时使用） */
  accessToken?: string;
  /** 显式 refresh token 覆盖（同上） */
  refreshToken?: string;
}

/** 重置密码（验证码来自 forgot-password 发出的邮件/短信） */
export interface ResetPasswordRequest {
  /** 邮箱 / 手机号 / 用户名 */
  identity: string;
  /** 重置验证码 */
  code: string;
  /** 新密码（按租户传输策略自动预处理） */
  newPassword: string;
}

/** 我的会话条目（GET /auth/me/sessions 归一化，snake_case → camelCase） */
export interface SessionInfo {
  id: string;
  deviceType?: string;
  ip?: string;
  geoIp?: string;
  userAgent?: string;
  /** 认证方法（如 password,totp） */
  amr?: string;
  /** 是否当前会话（服务端按 JWT sid 标记） */
  isCurrentSession: boolean;
  authenticatedAt?: string;
  idleExpiresAt?: string;
  lastActiveAt?: string;
  createdAt?: string;
  expiresAt?: string;
}

export interface SessionList {
  sessions: SessionInfo[];
  total: number;
  page: number;
  pageSize: number;
}

/** 资料部分更新：缺省字段 = 不修改（mfaEnabled 传 false 才是显式关闭） */
export interface ProfileUpdate {
  username?: string;
  mfaEnabled?: boolean;
  metadata?: Record<string, string>;
}

/** step-up 重认证结果（token 单次使用，5 分钟内有效） */
export interface ReauthenticateResult {
  stepUpToken: string;
  /** 有效期（秒） */
  expiresIn: number;
}

export interface DeleteAccountOptions {
  /** 删除原因（审计记录用） */
  reason?: string;
  /** MFA 验证码（租户要求 reauthenticate 走 MFA 时） */
  mfaCode?: string;
}

/** 试用租户注册结果 */
export interface TrialTenantResult {
  tenantId: string;
  name: string;
  /** URL slug —— 控制台门户路由 /<slug>/... 使用（= 租户名，可直接拼门户地址） */
  slug: string;
  status: string;
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

export type AutionalEvent =
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
  REVOKE_FAILED: 'REVOKE_FAILED',
} as const;

