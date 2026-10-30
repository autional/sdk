import type { AutionalPlatform } from './platform/types';
import type { TokenManager } from './token-manager';
import type { Discovery } from './discovery';
import type {
  AuthResult, LoginRequest, RegisterRequest, OAuthOptions, LogoutOptions,
  TenantAuthConfig, PasswordPolicyConfig, RevokeTokensOptions,
  ResetPasswordRequest, ProfileUpdate, SessionList, ReauthenticateResult,
  DeleteAccountOptions, TrialTenantResult, DeviceCodeInfo, DeviceLoginOptions,
} from './types';
import { AutionalAuthError } from './errors';
import type { DpopManager } from './dpop';
import { processPasswordForTransmission } from './crypto/password-transmission';
import { solveProofOfWork } from './crypto/pow-solver';
import type { KeyExchangeFn } from './crypto/password-transmission';
import {
  buildAuthorizeUrl, buildEndSessionUrl, clearPkceSession, generatePkce, generateState,
  loadPkceSession, resolveAuthOrigin, resolveSsoAuthorizeUrl, savePkceSession,
} from './pkce';

interface AuthClientConfig {
  tokenManager: TokenManager;
  http: AutionalPlatform['http'];
  baseUrl: string;
  keyExchangeFn?: KeyExchangeFn;
  /** 租户 ID（init 时确定，后续所有操作复用）*/
  tenantId?: string;
  /** 应用 ID = OAuth client_id（SSO 登录时使用） */
  appId?: string;
  /** 端点覆盖（留空使用默认路径）。后续从 auth-config 读取。 */
  endpoints?: Record<string, string>;
  /** OIDC Discovery（SSO 会话 logout 用 end_session_endpoint；缺省时不升级跳转） */
  discovery?: Discovery;
  /** DPoP proof（opt-in；仅作用于 oauth 服务的令牌类端点） */
  dpop?: DpopManager;
}

const MAX_CAPTCHA_RETRIES = 3;
const CACHE_TTL_MS = 5 * 60 * 1000;

export class AuthClient {
  private tokenManager: TokenManager;
  private http: AutionalPlatform['http'];
  private baseUrl: string;
  private keyExchangeFn?: KeyExchangeFn;
  private appId: string;
  private discovery?: Discovery;
  private dpop?: DpopManager;
  private configCache: Map<string, { data: TenantAuthConfig; at: number }> = new Map();
  /** 同一授权码的在飞换票（React StrictMode 等会并发触发两次回调） */
  private inflightCallback: { code: string; promise: Promise<AuthResult> } | null = null;
  readonly tenantId: string;

  constructor(config: AuthClientConfig) {
    this.tokenManager = config.tokenManager;
    this.http = config.http;
    this.baseUrl = config.baseUrl;
    this.keyExchangeFn = config.keyExchangeFn;
    this.appId = config.appId || '';
    this.discovery = config.discovery;
    this.tenantId = config.tenantId || '';
    this.dpop = config.dpop;
  }

  /**
   * DPoP proof 请求头（未启用 dpop 时为空对象）。
   * proof 构造失败（环境缺 WebCrypto）会抛出 —— 启用即明示要求，不静默降级。
   */
  private async dpopHeaders(method: string, url: string, accessToken?: string | null): Promise<Record<string, string>> {
    if (!this.dpop) return {};
    return this.dpop.proofHeaders(method, url, accessToken);
  }

  async fetchAuthConfig(tenantId?: string): Promise<TenantAuthConfig> {
    const key = tenantId || '__default__';
    const cached = this.configCache.get(key);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
      return cached.data;
    }

    const path = tenantId
      ? `/identity/api/v1/public/auth-config/${tenantId}`
      : '/identity/api/v1/public/auth-config/default';

    const response = await this.http.request(`${this.baseUrl}${path}`);
    const json = await response.json() as Record<string, unknown>;
    const data = (json.data ?? json) as Record<string, unknown>;
    const pp = (data.password_policy ?? {}) as Record<string, unknown>;

    const config: TenantAuthConfig = {
      tenantId: (data.tenant_id as string) || '',
      tenantName: (data.tenant_name as string) || '',
      displayName: (data.display_name as string) || '',
      membershipApproval: (data.membership_approval as string) || 'open',
      loginMethods: (data.login_methods as string[]) || [],
      oauthProviders: (data.oauth_providers as string[]) || [],
      passwordPolicy: {
        mode: (pp.password_transmission as string) || (data.password_transmission as string) || 'plain',
        minLength: (pp.min_length as number) || 8,
        maxLength: (pp.max_length as number) || 128,
        requireUpper: (pp.require_upper as boolean) || false,
        requireLower: (pp.require_lower as boolean) || false,
        requireDigit: (pp.require_digit as boolean) || false,
        requireSpecial: (pp.require_special as boolean) || false,
        tenantId: data.tenant_id as string || '',
        publicKey: data.transmission_public_key as string || '',
      },
      captchaEnabled: (data.captcha_enabled as boolean) || false,
      captchaProvider: (data.captcha_provider as string) || 'pow',
      silentChallengeEnabled: (data.silent_challenge_enabled as boolean) || false,
      transmissionPublicKey: (data.transmission_public_key as string) || '',
      oauthClientId: (data.oauth_client_id as string) || '',
      passkeyEnabled: (data.passkey_enabled as boolean) || false,
      magicLinkEnabled: (data.magic_link_enabled as boolean) || false,
      branding: (data.branding ?? null) as TenantAuthConfig['branding'],
    };

    this.configCache.set(key, { data: config, at: Date.now() });
    return config;
  }

  clearConfigCache(): void {
    this.configCache.clear();
  }

  async login(credentials: LoginRequest): Promise<AuthResult> {
    const authConfig = await this.fetchAuthConfig(credentials.tenantId);
    let captchaRetries = 0;

    while (true) {
      const body = await this.buildLoginBody(credentials, authConfig);

      if (!body['captcha_token'] && authConfig.silentChallengeEnabled && authConfig.captchaProvider === 'pow') {
        try {
          const token = await this.solveCaptchaChallenge();
          body['captcha_token'] = token;
          body['captcha_provider'] = 'pow';
        } catch {
          // PoW solver failed — proceed without
        }
      }

      const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
        const code = String(errJson.code ?? '');
        if (code.includes('captcha') && captchaRetries < MAX_CAPTCHA_RETRIES) {
          captchaRetries++;
          continue;
        }
        throw new AutionalAuthError(code, (errJson.message as string) || `Login failed`, 401);
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
        throw new AutionalAuthError(
          String(errJson.code ?? response.status),
          (errJson.message as string) || `Login failed`,
          response.status,
        );
      }

      const json = await response.json() as Record<string, unknown>;
      return this.handleAuthResponse(json);
    }
  }

  async register(data: RegisterRequest): Promise<AuthResult> {
    const authConfig = await this.fetchAuthConfig(data.tenantId);

    const processed = await processPasswordForTransmission(
      data.password,
      {
        mode: authConfig.passwordPolicy.mode,
        tenantId: authConfig.tenantId || data.tenantId || '',
        requireUpper: false,
        minLength: 0,
        publicKey: authConfig.transmissionPublicKey || '',
      },
      this.keyExchangeFn,
    );

    const body: Record<string, unknown> = {
      ...data as unknown as Record<string, unknown>,
      password: processed.password,
      password_transmission: processed.passwordTransmission,
    };
    if (processed.keyExchangeId) body.key_exchange_id = processed.keyExchangeId;
    if (processed.clientPubKey) body.client_pub_key = processed.clientPubKey;

    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || `Registration failed`,
        response.status,
      );
    }

    const json = await response.json() as Record<string, unknown>;
    const payload = (json.data ?? json) as Record<string, unknown>;

    if (payload.access_token) {
      const result = this.handleAuthResponse(json);
      return result;
    }

    // 注册返回 user_id，归一化为 id
    const user: Record<string, unknown> = { ...payload as Record<string, unknown> };
    if (user.user_id && !user.id) user.id = user.user_id;

    return { user: user as any, accessToken: '', refreshToken: '', expiresIn: 0, tokenType: '' };
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    // 取登录侧同一租户的配置（此前不带 tenantId → default 配置，hash 输入会拼上错误 tenant id）
    const authConfig = await this.fetchAuthConfig(this.tenantId || undefined);

    const policy = {
      mode: authConfig.passwordPolicy.mode,
      tenantId: authConfig.tenantId || this.tenantId || '',
      requireUpper: false,
      minLength: 0,
      publicKey: authConfig.transmissionPublicKey || '',
    };

    // 新旧密码都必须按传输策略预处理：hash 模式下服务端直接以收到的值 verify/哈希，
    // 只处理新密码会让旧密码校验恒失败（identity 侧 dto.ChangePasswordRequest 契约）。
    const processedOld = await processPasswordForTransmission(currentPassword, policy, this.keyExchangeFn);
    const processedNew = await processPasswordForTransmission(newPassword, policy, this.keyExchangeFn);

    const body: Record<string, unknown> = {
      old_password: processedOld.password,
      new_password: processedNew.password,
      password_transmission: processedNew.passwordTransmission,
    };
    if (processedNew.keyExchangeId) body.key_exchange_id = processedNew.keyExchangeId;
    if (processedNew.clientPubKey) body.client_pub_key = processedNew.clientPubKey;

    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/me/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || `Password change failed`,
        response.status,
      );
    }
  }

  /** 发起找回密码（服务端防枚举：无论账号是否存在都返回成功） */
  async forgotPassword(identity: string): Promise<void> {
    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity }),
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || 'Forgot password request failed',
        response.status,
      );
    }
  }

  /** 完成密码重置（验证码来自 forgot-password 邮件/短信；新密码按租户传输策略预处理） */
  async resetPassword(input: ResetPasswordRequest): Promise<void> {
    const authConfig = await this.fetchAuthConfig(this.tenantId || undefined);
    const processed = await processPasswordForTransmission(input.newPassword, {
      mode: authConfig.passwordPolicy.mode,
      tenantId: authConfig.tenantId || this.tenantId || '',
      requireUpper: false,
      minLength: 0,
      publicKey: authConfig.transmissionPublicKey || '',
    }, this.keyExchangeFn);

    const body: Record<string, unknown> = {
      identity: input.identity,
      code: input.code,
      new_password: processed.password,
      password_transmission: processed.passwordTransmission,
    };

    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || 'Password reset failed',
        response.status,
      );
    }
  }

  /** 发送邮箱验证码（注册/换邮箱场景；服务端防枚举恒返回成功） */
  async sendVerificationEmail(email: string): Promise<{ expiresIn: number }> {
    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/send-verification-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || 'Send verification email failed',
        response.status,
      );
    }
    const json = await response.json().catch(() => ({})) as Record<string, unknown>;
    const data = (json.data ?? {}) as Record<string, unknown>;
    return { expiresIn: (data.expires_in as number) || 0 };
  }

  /** 校验邮箱验证码 */
  async verifyEmail(email: string, code: string): Promise<void> {
    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || 'Email verification failed',
        response.status,
      );
    }
  }

  /** 更新当前用户资料（部分更新：缺省字段不改） */
  async updateProfile(update: ProfileUpdate): Promise<void> {
    const body: Record<string, unknown> = {};
    if (update.username !== undefined) body.username = update.username;
    if (update.mfaEnabled !== undefined) body.mfa_enabled = update.mfaEnabled;
    if (update.metadata !== undefined) body.metadata = update.metadata;

    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/me`, {
      method: 'PUT',
      headers: this.authHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || 'Profile update failed',
        response.status,
      );
    }
  }

  /** 我的活跃会话列表（服务端按当前 JWT 的 sid 标记 isCurrentSession） */
  async getSessions(page = 1, pageSize = 20): Promise<SessionList> {
    const response = await this.http.request(
      `${this.baseUrl}/identity/api/v1/auth/me/sessions?page=${page}&page_size=${pageSize}`,
      { headers: this.authHeaders() },
    );
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || 'Failed to load sessions',
        response.status,
      );
    }
    // ListResponse 为平铺结构：{ code, message, items, total, pagination }（非 data 包裹）
    const json = await response.json() as Record<string, unknown>;
    const items = (json.items ?? []) as Array<Record<string, unknown>>;
    const pagination = (json.pagination ?? {}) as Record<string, unknown>;
    return {
      sessions: items.map((s) => ({
        id: s.id as string,
        deviceType: s.device_type as string | undefined,
        ip: s.ip as string | undefined,
        geoIp: s.geoip as string | undefined,
        userAgent: s.user_agent as string | undefined,
        amr: s.amr as string | undefined,
        isCurrentSession: Boolean(s.is_current_session),
        authenticatedAt: s.authenticated_at as string | undefined,
        idleExpiresAt: s.idle_expires_at as string | undefined,
        lastActiveAt: s.last_active_at as string | undefined,
        createdAt: s.created_at as string | undefined,
        expiresAt: s.expires_at as string | undefined,
      })),
      total: (json.total as number) || 0,
      page: (pagination.page as number) || page,
      pageSize: (pagination.page_size as number) || pageSize,
    };
  }

  /** 登出指定会话（按 session id 吊销服务端会话） */
  async revokeSession(sessionId: string): Promise<void> {
    const response = await this.http.request(
      `${this.baseUrl}/identity/api/v1/auth/me/sessions/${encodeURIComponent(sessionId)}`,
      { method: 'DELETE', headers: this.authHeaders() },
    );
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || 'Failed to revoke session',
        response.status,
      );
    }
  }

  /** 登出所有其他会话（服务端按当前 JWT 的 sid 排除当前会话） */
  async revokeOtherSessions(): Promise<void> {
    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/me/sessions`, {
      method: 'DELETE',
      headers: this.authHeaders(),
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || 'Failed to revoke other sessions',
        response.status,
      );
    }
  }

  /**
   * step-up 重认证：验证当前密码，返回单次使用的 step-up token（5 分钟有效）。
   * 服务端对敏感操作（销户、换绑标识）要求最近 step-up —— token 用过即焚（防重放）。
   */
  async reauthenticate(password: string, mfaCode?: string): Promise<ReauthenticateResult> {
    const processed = await this.processPasswordOnly(password);
    return this.reauthenticateProcessed(processed, mfaCode);
  }

  private async reauthenticateProcessed(password: string, mfaCode?: string): Promise<ReauthenticateResult> {
    const body: Record<string, unknown> = { password };
    if (mfaCode) body.mfa_code = mfaCode;

    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/me/reauthenticate`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || 'Re-authentication failed',
        response.status,
      );
    }
    const json = await response.json() as Record<string, unknown>;
    const data = (json.data ?? json) as Record<string, unknown>;
    return {
      stepUpToken: (data.step_up_token as string) || '',
      expiresIn: (data.expires_in as number) || 0,
    };
  }

  /**
   * 销户（GDPR 被遗忘权）。内部先 reauthenticate 取 step-up token（单次使用），
   * 再携带 X-StepUp-Token 调用删除端点；密码必填，服务端二次校验。
   */
  async deleteAccount(password: string, options: DeleteAccountOptions = {}): Promise<void> {
    const processed = await this.processPasswordOnly(password);
    const { stepUpToken } = await this.reauthenticateProcessed(processed, options.mfaCode);

    const body: Record<string, unknown> = { password: processed };
    if (options.reason) body.reason = options.reason;

    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/me/delete-account`, {
      method: 'POST',
      headers: this.authHeaders(stepUpToken ? { 'X-StepUp-Token': stepUpToken } : {}),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || 'Account deletion failed',
        response.status,
      );
    }
  }

  /** 当前会话认证头（Bearer）；未登录时不带 Authorization，由服务端 401。
   *  注：identity/oauth 的对称与非对称加密传输模式下，敏感端点 DTO 暂无传输字段，
   *  step-up/销户仅支持 plain / hash 模式。 */
  private authHeaders(extra: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', ...extra };
    const token = this.tokenManager.getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  /** 敏感端点的密码预处理：按租户传输策略转换后只取 password 值（端点 DTO 不收 transmission 字段） */
  private async processPasswordOnly(password: string): Promise<string> {
    const authConfig = await this.fetchAuthConfig(this.tenantId || undefined);
    const processed = await processPasswordForTransmission(password, {
      mode: authConfig.passwordPolicy.mode,
      tenantId: authConfig.tenantId || this.tenantId || '',
      requireUpper: false,
      minLength: 0,
      publicKey: authConfig.transmissionPublicKey || '',
    }, this.keyExchangeFn);
    return processed.password;
  }


  /**
   * SSO 登录：整页跳转 Autional 授权端点（auth 域）。
   * 需要应用注册回调地址（redirectUri）；回调页调用 handleOAuthCallback 完成换票。
   */
  async loginWithOAuth(options: OAuthOptions = {}): Promise<void> {
    if (typeof window === 'undefined') {
      throw new AutionalAuthError('NOT_BROWSER', 'OAuth login requires a browser environment', 400);
    }
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      throw new AutionalAuthError('PKCE_UNAVAILABLE', 'Web Crypto API is unavailable — PKCE requires a secure (HTTPS) context', 400);
    }
    const clientId = options.clientId || this.appId;
    if (!clientId) {
      throw new AutionalAuthError('OAUTH_CLIENT_ID_REQUIRED', 'clientId is required — pass it in options or set appId in SDK config', 400);
    }
    const redirectUri = options.redirectUri || this.defaultRedirectUri();
    const authorizeBase = options.authorizeUrl || resolveSsoAuthorizeUrl(this.baseUrl);

    const { verifier, challenge } = await generatePkce();
    const state = generateState();
    savePkceSession({ verifier, state, redirectUri, clientId });

    const params: Record<string, string> = {
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: options.scope || 'openid profile email',
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      ...options.extraParams,
    };
    window.location.href = buildAuthorizeUrl(authorizeBase, params);
  }

  /**
   * 处理授权回调：校验 state → 用 PKCE verifier 换取令牌。
   * 必须在 loginWithOAuth 的同一标签页调用（verifier 存 sessionStorage）。
   */
  async handleOAuthCallback(url: string): Promise<AuthResult> {
    let urlObj: URL;
    try {
      urlObj = new URL(url);
    } catch {
      throw new AutionalAuthError('OAUTH_FAILED', 'Invalid callback URL', 400);
    }

    const errorParam = urlObj.searchParams.get('error');
    if (errorParam) {
      throw new AutionalAuthError(
        errorParam,
        urlObj.searchParams.get('error_description') || 'OAuth authorization failed',
        400,
      );
    }

    const code = urlObj.searchParams.get('code');
    if (!code) throw new AutionalAuthError('OAUTH_FAILED', 'No authorization code in callback URL', 400);

    // 授权码一次性：StrictMode/双挂载并发调用时复用同一在飞换票，避免第二次撞「already used」
    if (this.inflightCallback && this.inflightCallback.code === code) {
      return this.inflightCallback.promise;
    }
    const promise = this.exchangeOAuthCode(urlObj, code);
    this.inflightCallback = { code, promise };
    try {
      return await promise;
    } finally {
      if (this.inflightCallback && this.inflightCallback.code === code) {
        this.inflightCallback = null;
      }
    }
  }

  private async exchangeOAuthCode(urlObj: URL, code: string): Promise<AuthResult> {
    const pending = loadPkceSession();
    if (!pending) {
      throw new AutionalAuthError('OAUTH_SESSION_LOST', 'PKCE session not found — loginWithOAuth must run in this tab before the callback', 400);
    }
    const state = urlObj.searchParams.get('state') || '';
    if (state !== pending.state) {
      throw new AutionalAuthError('OAUTH_STATE_MISMATCH', 'OAuth state mismatch — possible CSRF attempt', 400);
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: pending.clientId,
      redirect_uri: pending.redirectUri || this.defaultRedirectUri(),
      code_verifier: pending.verifier,
    });

    const tokenUrl = `${this.baseUrl}/oauth/api/v1/oauth/token`;
    const response = await this.http.request(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...await this.dpopHeaders('POST', tokenUrl),
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.error ?? errJson.code ?? response.status),
        String(errJson.error_description ?? errJson.message ?? `OAuth token exchange failed (${response.status})`),
        response.status,
      );
    }

    const json = await response.json() as Record<string, unknown>;
    const result = this.handleAuthResponse(json);
    this.tokenManager.setAuthMode('sso', pending.clientId);
    try {
      const info = await this.fetchUserInfo();
      if (info) {
        result.user = info as AuthResult['user'];
        this.tokenManager.setUser(info);
      }
    } catch {
      // userinfo 失败不阻断登录 — token 已到手，用户信息可稍后重试
    }
    await this.tokenManager.persist();
    clearPkceSession();
    return result;
  }

  /** OIDC userinfo（SSO 会话下获取用户信息） */
  async fetchUserInfo(): Promise<Record<string, unknown> | null> {
    const token = this.tokenManager.getAccessToken();
    if (!token) return null;
    const url = `${this.baseUrl}/oauth/api/v1/oauth/userinfo`;
    const response = await this.http.request(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...await this.dpopHeaders('GET', url, token),
      },
    });
    if (!response.ok) return null;
    const json = await response.json() as Record<string, unknown>;
    const data = (json.data ?? json) as Record<string, unknown>;
    if (data.sub && !data.id) data.id = data.sub;
    this.tokenManager.setUser(data);
    return data;
  }

  private defaultRedirectUri(): string {
    return typeof window !== 'undefined' ? `${window.location.origin}/oauth/callback` : '';
  }

  async refreshToken(): Promise<void> {
    if (this.tokenManager.getAuthMode() === 'sso') {
      return this.refreshSsoToken();
    }

    const refreshToken = this.tokenManager.getRefreshToken();
    if (!refreshToken) throw new AutionalAuthError('NO_REFRESH_TOKEN', 'No refresh token available', 401);

    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      const code = String(errJson.code ?? '');
      const message = String(errJson.message ?? '');
      // 复用检测：现役服务端为 40000502 + "refresh token has been reused" 文案（全族已撤销）。
      // 其余失败（expired/invalid RT、429、5xx）不清会话——预刷新路径要保会话，清理由 401 路径统一执行。
      if (code === '40000502' && /reus/i.test(message)) {
        this.tokenManager.clear();
        this.tokenManager.persist();
        throw new AutionalAuthError('TOKEN_REUSE', 'Refresh token reused — all sessions revoked', 401);
      }
      throw new AutionalAuthError('REFRESH_FAILED', 'Token refresh failed', 401);
    }

    const json = await response.json() as Record<string, unknown>;
    const data = (json.data ?? json) as Record<string, unknown>;
    this.tokenManager.setTokens(
      data.access_token as string,
      (data.refresh_token as string) || refreshToken,
      (data.expires_in as number) || 900,
    );
    if (data.user) this.tokenManager.setUser(data.user as Record<string, unknown>);
    this.tokenManager.persist();
  }

  /** SSO 会话刷新：走 oauth 服务刷新端点（公开客户端凭 client_id 即可） */
  private async refreshSsoToken(): Promise<void> {
    const refreshToken = this.tokenManager.getRefreshToken();
    if (!refreshToken) throw new AutionalAuthError('NO_REFRESH_TOKEN', 'No refresh token available', 401);

    const clientId = this.tokenManager.getOAuthClientId() || this.appId;
    const params: Record<string, string> = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };
    if (clientId) params['client_id'] = clientId;

    const refreshUrl = `${this.baseUrl}/oauth/api/v1/oauth/refresh`;
    const response = await this.http.request(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...await this.dpopHeaders('POST', refreshUrl),
      },
      body: new URLSearchParams(params).toString(),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      const errCode = String(errJson.error ?? '');
      const desc = String(errJson.error_description ?? errJson.message ?? '');
      // 复用检测：oauth 面 invalid_grant + "refresh token reused" 描述（全族已撤销）。
      // 其余失败（含会话被撤销、会话过期的 invalid_grant）不清会话——清理由 401 路径统一执行。
      if (errCode === 'invalid_grant' && /reus/i.test(desc)) {
        this.tokenManager.clear();
        this.tokenManager.persist();
        throw new AutionalAuthError('TOKEN_REUSE', 'Refresh token reused — all sessions revoked', 401);
      }
      throw new AutionalAuthError('REFRESH_FAILED', 'SSO token refresh failed', 401);
    }

    const json = await response.json() as Record<string, unknown>;
    const data = (json.data ?? json) as Record<string, unknown>;
    this.tokenManager.setTokens(
      data.access_token as string,
      (data.refresh_token as string) || refreshToken,
      (data.expires_in as number) || 900,
    );
    if (data.user) this.tokenManager.setUser(data.user as Record<string, unknown>);
    this.tokenManager.persist();
  }

  /**
   * RFC 7009 令牌撤销：撤销当前会话（或显式传入）的 access / refresh 令牌。
   * 端点优先取 discovery 的 revocation_endpoint，缺省回落 <apiUrl>/oauth/api/v1/oauth/revoke。
   * 公开客户端仅凭 client_id 认证（与 PKCE 流程一致，无需 secret）。
   * 只做服务端撤销，不清本地会话状态；完整登出用 logout()。
   */
  async revokeTokens(options: RevokeTokensOptions = {}): Promise<void> {
    const scope = options.tokens ?? 'all';
    const targets: Array<{ value: string; hint: 'access_token' | 'refresh_token' }> = [];
    if (scope !== 'refresh') {
      const at = options.accessToken ?? this.tokenManager.getAccessToken();
      if (at) targets.push({ value: at, hint: 'access_token' });
    }
    if (scope !== 'access') {
      const rt = options.refreshToken ?? this.tokenManager.getRefreshToken();
      if (rt) targets.push({ value: rt, hint: 'refresh_token' });
    }
    if (targets.length === 0) return;

    const endpoint = this.discovery?.getRevocationEndpoint()
      ?? `${this.baseUrl}/oauth/api/v1/oauth/revoke`;
    const clientId = this.tokenManager.getOAuthClientId() || this.appId;

    const results = await Promise.allSettled(
      targets.map(({ value, hint }) => this.revokeSingleToken(endpoint, value, hint, clientId)),
    );
    if (results.every((r) => r.status === 'rejected')) {
      const reason = (results[0] as PromiseRejectedResult).reason as Error;
      throw new AutionalAuthError('REVOKE_FAILED', reason?.message || 'Token revocation failed', 0);
    }
  }

  private async revokeSingleToken(
    endpoint: string,
    token: string,
    hint: 'access_token' | 'refresh_token',
    clientId: string,
  ): Promise<void> {
    const body: Record<string, string> = { token, token_type_hint: hint };
    if (clientId) body['client_id'] = clientId;
    const response = await this.http.request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...await this.dpopHeaders('POST', endpoint),
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.error ?? errJson.code ?? response.status),
        String(errJson.error_description ?? errJson.message ?? `Token revocation failed (${response.status})`),
        response.status,
      );
    }
  }

  /**
   * 登出。先清本地，再按会话模式分流：
   * - identity（password）会话：fire-and-forget POST 吊销 refresh token；
   * - SSO（sso）会话：RFC 7009 撤销本地令牌（限时 1.5s，不阻塞登出）→
   *   RP-Initiated Logout —— 整页跳转 discovery 的 end_session_endpoint
   *   （id_token_hint[未过期时] + client_id + post_logout_redirect_uri + state）。
   *   endpoint 不可得（未注入 discovery / 未发现）→ fallback：仅清本地 + 既有行为。
   *
   * 过期/解码失败的 id_token_hint 会被服务端拒绝（400），故省略该参数。
   */
  async logout(options: LogoutOptions = {}): Promise<void> {
    const accessToken = this.tokenManager.getAccessToken();
    const refreshToken = this.tokenManager.getRefreshToken();
    const authMode = this.tokenManager.getAuthMode();
    const idToken = this.tokenManager.getIdToken();
    const clientId = this.tokenManager.getOAuthClientId() || this.appId;
    this.tokenManager.clear();
    this.tokenManager.persist();
    // SSO 会话的令牌由 oauth 服务签发，identity logout 端点不适用。
    if (accessToken && authMode !== 'sso') {
      this.http.request(`${this.baseUrl}/identity/api/v1/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }).catch(() => {});
    }
    if (typeof window !== 'undefined') window.localStorage.removeItem('autional_auth_tokens');

    // SSO 会话：RP-Initiated Logout 整页跳转（服务端据回流决定 302 确认页/落点）
    if (authMode === 'sso' && typeof window !== 'undefined') {
      const endSessionEndpoint = this.discovery?.getEndSessionEndpoint();
      if (!endSessionEndpoint) return;
      // OAuth 2.0 BCP：跳 end_session 前撤销本客户端令牌（后端黑名单 AT + 吊销 RT）。
      // 限时 1.5s —— 撤销端不可达不阻塞登出；整页导航会中止未完成请求，须在跳转前等待。
      await Promise.race([
        this.revokeTokens({
          accessToken: accessToken ?? undefined,
          refreshToken: refreshToken ?? undefined,
        }).catch(() => {}),
        new Promise<void>((resolve) => setTimeout(resolve, 1500)),
      ]);
      const usableHint = idToken && !this.tokenManager.isTokenExpired(idToken) ? idToken : undefined;
      window.location.href = buildEndSessionUrl(endSessionEndpoint, {
        idTokenHint: usableHint,
        clientId: clientId || undefined,
        postLogoutRedirectUri: options.postLogoutRedirectUri || `${window.location.origin}/`,
        state: options.state || generateState(),
      });
    }
  }

  async getProfile(): Promise<Record<string, unknown> | null> {
    const response = await this.http.request(`${this.baseUrl}/identity/api/v1/auth/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.tokenManager.getAccessToken()}` },
    });
    if (response.status === 401) return null;
    if (!response.ok) return null;
    const json = await response.json() as Record<string, unknown>;
    const data = (json.data ?? json) as Record<string, unknown>;
    this.tokenManager.setUser(data);
    return data;
  }

  /** 公开注册试用租户（无需 JWT）。name 即 URL slug（门户路由 /<slug>/ 使用）。 */
  async createTrialTenant(config: {
    name: string;
    adminEmail: string;
    adminPassword: string;
    agreementAccepted?: boolean;
  }): Promise<TrialTenantResult> {
    const body: Record<string, unknown> = {
      name: config.name,
      admin_email: config.adminEmail,
      admin_password: config.adminPassword,
      agreement_accepted: config.agreementAccepted !== false,
    };
    // 公开注册路由带服务段，必须与网关的精确公开条目逐段一致：
    // 本段拼接后 = /bff/tenant/api/v1/tenant/public/tenants（public 受众）。
    // 少一层 tenant 的形态是网关已删除的死条目，会落进宽前缀 /bff/tenant/api/v1（user 受众），
    // 被 JWT 守卫前置拦成 401/40000502，请求到不了 tenant-service。
    const response = await this.http.request(`${this.baseUrl}/tenant/api/v1/tenant/public/tenants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || 'Trial registration failed',
        response.status,
      );
    }
    const json = await response.json() as Record<string, unknown>;
    const data = (json.data ?? json) as Record<string, unknown>;
    const name = (data.name as string) || config.name;
    return { tenantId: data.id as string, name, slug: name, status: data.status as string };
  }

  /** 试用升级为正式版 */
  async upgradeTrial(tenantId: string, plan: string = 'basic'): Promise<void> {
    const response = await this.http.request(`${this.baseUrl}/tenant/api/v1/admin/tenants/${tenantId}/upgrade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.code ?? response.status),
        (errJson.message as string) || 'Upgrade failed',
        response.status,
      );
    }
  }

  private async buildLoginBody(credentials: LoginRequest, authConfig: TenantAuthConfig): Promise<Record<string, unknown>> {
    const processed = await processPasswordForTransmission(
      credentials.password,
      {
        mode: authConfig.passwordPolicy.mode,
        tenantId: authConfig.tenantId || credentials.tenantId || '',
        requireUpper: false,
        minLength: 0,
        publicKey: authConfig.transmissionPublicKey || '',
      },
      this.keyExchangeFn,
    );

    const body: Record<string, unknown> = {
      identity: credentials.email || credentials.phone || credentials.username || '',
      password: processed.password,
      password_transmission: processed.passwordTransmission,
    };
    if (credentials.tenantId) body['tenant_id'] = credentials.tenantId;
    if (processed.keyExchangeId) body['key_exchange_id'] = processed.keyExchangeId;
    if (processed.clientPubKey) body['client_pub_key'] = processed.clientPubKey;
    if (credentials.captchaToken) body['captcha_token'] = credentials.captchaToken;
    if (credentials.captchaProvider) body['captcha_provider'] = credentials.captchaProvider;
    if (credentials.captchaChallengeId) body['captcha_challenge_id'] = credentials.captchaChallengeId;
    return body;
  }

  private async solveCaptchaChallenge(): Promise<string> {
    const challengeResp = await this.http.request(
      `${this.baseUrl}/identity/api/v1/auth/captcha/challenge?provider=pow&difficulty=4`,
    );
    const cJson = await challengeResp.json() as Record<string, unknown>;
    const cData = (cJson.data ?? cJson) as Record<string, unknown>;
    const cd = (cData.data ?? cData) as Record<string, unknown> ?? cData;
    const powChallenge = String(cd.challenge ?? cd['challenge'] ?? '');
    const difficulty = Number(cd.difficulty ?? cd['difficulty'] ?? 4);
    return solveProofOfWork(powChallenge, difficulty);
  }

  private handleAuthResponse(json: Record<string, unknown>): AuthResult {
    const data = (json.data ?? json) as Record<string, unknown>;
    const result: AuthResult = {
      accessToken: data.access_token as string,
      refreshToken: data.refresh_token as string,
      expiresIn: (data.expires_in as number) || 900,
      tokenType: (data.token_type as string) || 'Bearer',
      user: (data.user as AuthResult['user']) || { id: data.user_id as string || '' },
    };
    this.tokenManager.setTokens(result.accessToken, result.refreshToken, result.expiresIn);
    // id_token 仅 OIDC 授权码流返回（SSO 会话）；identity/register 响应无此字段 → 显式清空，
    // 避免上一段 SSO 会话的 id_token 残留成 stale hint。
    this.tokenManager.setIdToken((data.id_token as string) || null);
    this.tokenManager.setUser(result.user as Record<string, unknown>);
    this.tokenManager.persist();
    return result;
  }

  /** 机器间认证 (Client Credentials) */
  async loginWithClientCredentials(options: {
    clientId: string;
    clientSecret: string;
    scopes?: string[];
  }): Promise<AuthResult> {
    const response = await this.http.request(`${this.baseUrl}/oauth/api/v1/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: options.clientId,
        client_secret: options.clientSecret,
        scope: (options.scopes || []).join(' '),
      }).toString(),
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.code ?? 'CC_FAILED'),
        (errJson.message as string) || 'Client Credentials auth failed',
        response.status,
      );
    }
    const json = await response.json() as Record<string, unknown>;
    const result = this.handleAuthResponse(json);
    return result;
  }

  /**
   * RFC 8628 设备授权请求：返回 user_code / verification_uri / 轮询参数。
   * 单独使用场景（如在非浏览器设备上分两段展示）请自行轮询；
   * 浏览器/一般场景直接用 loginWithDeviceCode 一体化完成。
   */
  async requestDeviceCode(options?: { clientId?: string; scope?: string }): Promise<DeviceCodeInfo> {
    const clientId = options?.clientId || this.appId;
    const body: Record<string, string> = { client_id: clientId };
    if (options?.scope) body['scope'] = options.scope;

    const response = await this.http.request(`${this.baseUrl}/oauth/api/v1/oauth/device/authorize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      throw new AutionalAuthError(
        String(errJson.error ?? errJson.code ?? response.status),
        String(errJson.error_description ?? errJson.message ?? `Device authorization failed (${response.status})`),
        response.status,
      );
    }
    const json = await response.json() as Record<string, unknown>;
    const data = (json.data ?? json) as Record<string, unknown>;
    return {
      deviceCode: data.device_code as string,
      userCode: data.user_code as string,
      verificationUri: this.resolveVerificationUri((data.verification_uri as string) || ''),
      expiresIn: (data.expires_in as number) || 600,
      interval: (data.interval as number) || 5,
    };
  }

  /**
   * RFC 8628 设备流登录（一体化）：请求设备码 → onUserCode 回调（展示 userCode
   * 与 verificationUri）→ 按 interval 轮询换票，处理 authorization_pending /
   * slow_down（+5s）/ expired_token / access_denied → signal 取消。
   * 成功后认证模式标记 sso（令牌由 oauth 服务签发，刷新走 /oauth/refresh）。
   */
  async loginWithDeviceCode(options: DeviceLoginOptions = {}): Promise<AuthResult> {
    const info = await this.requestDeviceCode(options);
    options.onUserCode?.(info);

    const clientId = options.clientId || this.appId;
    const deadline = Date.now() + info.expiresIn * 1000;
    let interval = info.interval;
    const tokenUrl = `${this.baseUrl}/oauth/api/v1/oauth/token`;

    while (true) {
      if (options.signal?.aborted) {
        throw new AutionalAuthError('DEVICE_FLOW_ABORTED', 'Device login aborted by caller', 0);
      }
      if (Date.now() >= deadline) {
        throw new AutionalAuthError('DEVICE_CODE_EXPIRED', 'Device code expired — start a new login', 400);
      }
      await sleepWithSignal(interval * 1000, options.signal);

      const form = new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        device_code: info.deviceCode,
      });
      if (clientId) form.set('client_id', clientId);

      const response = await this.http.request(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...await this.dpopHeaders('POST', tokenUrl),
        },
        body: form.toString(),
      });

      if (response.ok) {
        const json = await response.json() as Record<string, unknown>;
        const result = this.handleAuthResponse(json);
        this.tokenManager.setAuthMode('sso', clientId);
        try {
          const userInfo = await this.fetchUserInfo();
          if (userInfo) {
            result.user = userInfo as AuthResult['user'];
            this.tokenManager.setUser(userInfo);
          }
        } catch {
          // userinfo 失败不阻断登录 — token 已到手，用户信息可稍后重试
        }
        await this.tokenManager.persist();
        return result;
      }

      const errJson = await response.json().catch(() => ({})) as Record<string, unknown>;
      const error = String(errJson.error ?? '');
      if (error === 'authorization_pending') continue;
      if (error === 'slow_down') {
        interval += 5;
        continue;
      }
      if (error === 'expired_token') {
        throw new AutionalAuthError('DEVICE_CODE_EXPIRED', 'Device code expired — start a new login', 400);
      }
      if (error === 'access_denied') {
        throw new AutionalAuthError('DEVICE_ACCESS_DENIED', 'Device authorization denied by user', 403);
      }
      throw new AutionalAuthError(
        error || String(errJson.code ?? response.status),
        String(errJson.error_description ?? errJson.message ?? `Device token polling failed (${response.status})`),
        response.status,
      );
    }
  }

  /** 服务端 verification_uri 为相对路径（/device）→ 解析为 auth 域绝对地址 */
  private resolveVerificationUri(uri: string): string {
    if (!uri || /^https?:\/\//i.test(uri)) return uri;
    return `${resolveAuthOrigin(this.baseUrl)}${uri.startsWith('/') ? '' : '/'}${uri}`;
  }
}

/** 可取消 sleep（AbortSignal → DEVICE_FLOW_ABORTED） */
function sleepWithSignal(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new AutionalAuthError('DEVICE_FLOW_ABORTED', 'Device login aborted by caller', 0));
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(new AutionalAuthError('DEVICE_FLOW_ABORTED', 'Device login aborted by caller', 0));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort);
  });
}
