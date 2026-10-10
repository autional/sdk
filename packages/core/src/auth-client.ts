import type { AutionalPlatform } from './platform/types';
import type { TokenManager } from './token-manager';
import type {
  AuthResult, LoginRequest, RegisterRequest, OAuthOptions,
  TenantAuthConfig, PasswordPolicyConfig,
} from './types';
import { AutionalAuthError } from './errors';
import { processPasswordForTransmission } from './crypto/password-transmission';
import { solveProofOfWork } from './crypto/pow-solver';
import type { KeyExchangeFn } from './crypto/password-transmission';
import {
  buildAuthorizeUrl, clearPkceSession, generatePkce, generateState,
  loadPkceSession, resolveSsoAuthorizeUrl, savePkceSession,
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
}

const MAX_CAPTCHA_RETRIES = 3;
const CACHE_TTL_MS = 5 * 60 * 1000;

export class AuthClient {
  private tokenManager: TokenManager;
  private http: AutionalPlatform['http'];
  private baseUrl: string;
  private keyExchangeFn?: KeyExchangeFn;
  private appId: string;
  private configCache: Map<string, { data: TenantAuthConfig; at: number }> = new Map();
  readonly tenantId: string;

  constructor(config: AuthClientConfig) {
    this.tokenManager = config.tokenManager;
    this.http = config.http;
    this.baseUrl = config.baseUrl;
    this.keyExchangeFn = config.keyExchangeFn;
    this.appId = config.appId || '';
    this.tenantId = config.tenantId || '';
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

    const response = await this.http.request(`${this.baseUrl}/oauth/api/v1/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
    const response = await this.http.request(`${this.baseUrl}/oauth/api/v1/oauth/userinfo`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
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
      if (code.startsWith('400002')) {
        this.tokenManager.clear();
        this.tokenManager.persist();
        throw new AutionalAuthError('TOKEN_REUSE', 'Refresh token reused — all sessions revoked', 401);
      }
      this.tokenManager.clear();
      this.tokenManager.persist();
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

    const response = await this.http.request(`${this.baseUrl}/oauth/api/v1/oauth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params).toString(),
    });

    if (!response.ok) {
      this.tokenManager.clear();
      this.tokenManager.persist();
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

  async logout(): Promise<void> {
    const accessToken = this.tokenManager.getAccessToken();
    const refreshToken = this.tokenManager.getRefreshToken();
    const authMode = this.tokenManager.getAuthMode();
    this.tokenManager.clear();
    this.tokenManager.persist();
    // SSO 会话的令牌由 oauth 服务签发，identity logout 端点不适用；
    // RP-Initiated Logout（auth 域 /oauth/logout）需整页跳转，由应用自行发起。
    if (accessToken && authMode !== 'sso') {
      this.http.request(`${this.baseUrl}/identity/api/v1/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }).catch(() => {});
    }
    if (typeof window !== 'undefined') window.localStorage.removeItem('autional_auth_tokens');
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

  /** 公开注册试用租户（无需 JWT） */
  async createTrialTenant(config: {
    name: string;
    adminEmail: string;
    adminPassword: string;
    agreementAccepted?: boolean;
  }): Promise<{ tenantId: string; name: string; status: string }> {
    const body: Record<string, unknown> = {
      name: config.name,
      admin_email: config.adminEmail,
      admin_password: config.adminPassword,
      agreement_accepted: config.agreementAccepted !== false,
    };
    const response = await this.http.request(`${this.baseUrl}/tenant/api/v1/public/tenants`, {
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
    return { tenantId: data.id as string, name: data.name as string, status: data.status as string };
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
}
