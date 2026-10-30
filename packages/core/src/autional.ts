import { TokenManager } from './token-manager';
import { ApiClient } from './api-client';
import { AuthClient } from './auth-client';
import { Discovery } from './discovery';
import { TabSync } from './sync';
import { DpopManager } from './dpop';
import { AutionalError, AutionalAuthError } from './errors';
import { extractTenantSlugFromIssuer, buildPortalUrl } from './portal';
import type { PortalName } from './portal';
import type { AutionalPlatform } from './platform/types';
import type { AutionalPlugin } from './plugin';
import type {
  User, AuthResult, LoginRequest, RegisterRequest,
  OAuthOptions, LogoutOptions, RevokeTokensOptions, AutionalEvent, SecurityAlert, TenantAuthConfig,
  ResetPasswordRequest, ProfileUpdate, SessionList, ReauthenticateResult,
  DeleteAccountOptions, TrialTenantResult, DeviceCodeInfo, DeviceLoginOptions,
} from './types';

export interface AutionalConfig {
  appId?: string;
  issuer: string;
  apiUrl?: string;
  /** @deprecated 使用 issuer + apiUrl */
  authUrl?: string;
  platform: AutionalPlatform;
  storagePrefix?: string;
  syncTabs?: boolean;
  /** 启用 BFF httpOnly cookie 模式（token 不存 localStorage） */
  useCookie?: boolean;
  /** 租户 ID (可选, 从 issuer 子域名自动提取或显式传入) */
  tenantId?: string;
  /** 租户 slug（控制台门户 /<slug>/ 路由用；共享 issuer 下需显式传入） */
  tenantSlug?: string;
  /**
   * 请求前预刷新提前量（秒；默认 30，0 = 禁用）。
   * access token 剩余寿命 ≤ 该值时，业务请求前先刷新，避免 401 往返。
   */
  tokenExpirySkew?: number;
  /**
   * 启用 DPoP（RFC 9449，需服务端 OAuth 面支持；浏览器/Node 18+ 的 WebCrypto 环境）。
   * proof 仅作用于 oauth 服务的令牌类端点（token/refresh/revoke/userinfo）。
   */
  dpop?: boolean;
}

type EventHandler = (...args: unknown[]) => void;

export class Autional {
  private config: AutionalConfig;
  tokenManager: TokenManager;
  api: ApiClient;
  private authClient: AuthClient;
  private discovery: Discovery;
  private tabSync: TabSync | null = null;
  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  private _ready = false;
  private _userCache: Record<string, unknown> | null = null;
  private _authConfig: Record<string, unknown> | null = null;
  private _sessionBridgeBound = false;
  /** 确定的租户 ID (从 config 或 issuer 提取) */
  readonly tenantId: string;
  /** 确定的租户 slug (显式配置 > issuer 提取；共享 issuer 下为 '') */
  readonly tenantSlug: string;

  constructor(config: AutionalConfig) {
    if (!config.issuer) throw new AutionalError('CONFIG_ERROR', 'issuer is required', 500);
    if (!config.appId && typeof console !== 'undefined') {
      console.warn('[Autional] appId 未设置。建议在 Autional 控制台创建应用后填写 appId，便于多应用管理和权限隔离。');
    }

    this.config = config;
    const apiUrl = config.apiUrl ?? config.issuer;

    // 确定 tenantId: 显式传入 > issuer 提取 > null (后续按需获取)
    this.tenantId = config.tenantId || extractTenantSlugFromIssuer(config.issuer) || '';
    this.tenantSlug = config.tenantSlug || extractTenantSlugFromIssuer(config.issuer) || '';

    this.tokenManager = new TokenManager(config.platform.storage, config.storagePrefix, config.useCookie);
    this.discovery = new Discovery(config.platform.http, config.apiUrl);
    const dpop = config.dpop
      ? new DpopManager(config.platform.storage, config.storagePrefix)
      : undefined;
    this.authClient = new AuthClient({
      tokenManager: this.tokenManager,
      http: config.platform.http,
      baseUrl: apiUrl,
      tenantId: this.tenantId,
      appId: config.appId,
      discovery: this.discovery,
      dpop,
    });

    const skewSeconds = config.tokenExpirySkew ?? 30;
    this.api = new ApiClient({
      baseUrl: apiUrl,
      tokenManager: this.tokenManager,
      http: config.platform.http,
      refreshTokenFn: () => this.refreshSession(),
      onForceLogout: () => {
        this.emit('LOGGED_OUT');
        this.tabSync?.broadcast('LOGOUT');
      },
      refreshSkewMs: skewSeconds > 0 ? skewSeconds * 1000 : 0,
    });

    if (config.syncTabs !== false) {
      this.tabSync = new TabSync(
        () => {
          this.tokenManager.clear();
          this._userCache = null;
          this.emit('LOGGED_OUT');
        },
        async () => {
          await this.tokenManager.load();
          this._userCache = this.tokenManager.getUser();
          this.emit('TOKEN_CHANGED');
          this.emit('USER_CHANGED');
        },
      );
      this.tabSync.listen();
    }
  }

  async initialize(): Promise<void> {
    await this.tokenManager.load();
    try {
      await this.discovery.discover(this.config.issuer);
    } catch {
      // OIDC Discovery 失败 — API 调用不受影响（apiUrl 已配置）
    }

    // 冷启动过期恢复：access 过期但 refresh 尚存 → 先刷新再水合（含 SSO 模式）。
    // 刷新失败（RT 过期/撤销、网络、无 offline_access 的 401）静默按未登录继续，不阻塞启动。
    if (!this.tokenManager.getAccessToken() && this.tokenManager.getRefreshToken()) {
      try {
        await this.refreshSession();
      } catch { /* 按未登录继续 */ }
    }

    // 会话桥恒注册（含未登录态启动）：tokenManager 的 token 变更必须上抛公共事件，
    // 否则「登录前启动」的页面在随后登录/刷新时事件断链（跨标签同步、应用侧 cookie 桥失效）。
    if (!this._sessionBridgeBound) {
      this._sessionBridgeBound = true;
      this.tokenManager.onTokenChange((token) => {
        if (!token) {
          this._userCache = null;
          this.emit('LOGGED_OUT');
        }
        this.emit('TOKEN_CHANGED', { token });
        this.emit('USER_CHANGED');
      });
    }

    const accessToken = this.tokenManager.getAccessToken();
    if (accessToken) {
      this._userCache = this.tokenManager.getUser();
      if (!this._userCache) {
        try {
          this._userCache = await this.authClient.getProfile();
          if (this._userCache) {
            this.tokenManager.setUser(this._userCache);
            this.tokenManager.persist();
          }
        } catch {
          if (!this.tokenManager.isTokenExpired(accessToken)) {
            const claims = this.tokenManager.decodeToken(accessToken);
            this._userCache = claims ?? {};
          }
        }
      }
    }

    this._ready = true;
    this.emit('READY');

    if (this._userCache) {
      this.emit('USER_CHANGED');
    }
  }

  isReady(): boolean {
    return this._ready;
  }

  /** 等待 SDK 就绪 (租户配置加载完毕) */
  async ready(): Promise<void> {
    if (this._ready) return;
    await new Promise<void>((resolve) => {
      const unsubscribe = this.on('READY', () => {
        unsubscribe();
        resolve();
      });
    });
  }

  /**
   * 刷新会话（两条刷新路径的唯一入口）：成功后广播 TOKEN_REFRESHED，
   * 其他标签页据此重读存储 —— 否则它们拿旧 refresh token 刷新会触发
   * 服务端复用检测（identity 40000502 / oauth invalid_grant + reused），全族会话被撤销。
   */
  private async refreshSession(): Promise<void> {
    try {
      await this.authClient.refreshToken();
      this.tabSync?.broadcast('TOKEN_REFRESHED');
    } catch (err) {
      if (err instanceof AutionalAuthError && err.code === 'TOKEN_REUSE') {
        // 复用检测 = 服务端已撤销全族令牌：通知其他标签页立即清理
        this.tabSync?.broadcast('LOGOUT');
        this._userCache = null;
        this.emit('LOGGED_OUT');
      }
      throw err;
    }
  }

  get user(): User | null {
    return (this._userCache ?? this.tokenManager.getUser()) as unknown as User | null;
  }

  get authConfig(): Record<string, unknown> | null {
    return this._authConfig;
  }

  async fetchAuthConfig(tenantId?: string): Promise<Record<string, unknown>> {
    const config = await (this.authClient as any).fetchAuthConfig(tenantId);
    this._authConfig = config;
    return config;
  }

  async getAccessToken(): Promise<string | null> {
    const token = this.tokenManager.getAccessToken();
    if (token) return token;

    try {
      await this.refreshSession();
      return this.tokenManager.getAccessToken();
    } catch {
      return null;
    }
  }

  getRefreshToken(): string | null {
    return this.tokenManager.getRefreshToken();
  }

  isAuthenticated(): boolean {
    return this.tokenManager.isAuthenticated();
  }

  async login(credentials: LoginRequest): Promise<AuthResult> {
    const result = await this.authClient.login(credentials);
    this._userCache = result.user as unknown as Record<string, unknown>;
    this.emit('USER_CHANGED');
    this.emit('TOKEN_CHANGED');
    this.tabSync?.broadcast('LOGIN');
    return result;
  }

  async loginWithOAuth(options: OAuthOptions): Promise<void> {
    await this.authClient.loginWithOAuth(options);
  }

  /** 机器间认证 (Client Credentials) */
  async loginWithClientCredentials(options: {
    clientId: string;
    clientSecret: string;
    scopes?: string[];
  }): Promise<AuthResult> {
    return this.authClient.loginWithClientCredentials(options);
  }

  async handleOAuthCallback(url: string): Promise<AuthResult> {
    const result = await this.authClient.handleOAuthCallback(url);
    this._userCache = result.user as unknown as Record<string, unknown>;
    this.emit('USER_CHANGED');
    this.tabSync?.broadcast('LOGIN');
    return result;
  }

  /**
   * RFC 8628 设备流登录（一体化）：onUserCode 回调展示用户码/验证地址 → 按 interval
   * 轮询换票（pending 持续、slow_down 自动 +5s、过期/拒绝抛错），signal 可取消。
   * 成功后广播 LOGIN（其他标签页重读存储）。
   */
  async loginWithDeviceCode(options: DeviceLoginOptions = {}): Promise<AuthResult> {
    const result = await this.authClient.loginWithDeviceCode(options);
    this._userCache = result.user as unknown as Record<string, unknown>;
    this.emit('USER_CHANGED');
    this.tabSync?.broadcast('LOGIN');
    return result;
  }

  /** RFC 8628 设备授权请求（分两段展示场景；一体化登录直接用 loginWithDeviceCode） */
  async requestDeviceCode(options?: { clientId?: string; scope?: string }): Promise<DeviceCodeInfo> {
    return this.authClient.requestDeviceCode(options);
  }

  async register(data: RegisterRequest): Promise<AuthResult> {
    const result = await this.authClient.register(data);
    if (result.accessToken) {
      this._userCache = result.user as unknown as Record<string, unknown>;
      this.emit('USER_CHANGED');
      this.tabSync?.broadcast('LOGIN');
    }
    return result;
  }

  async logout(options?: LogoutOptions): Promise<void> {
    await this.authClient.logout(options);
    this._userCache = null;
    this.emit('LOGGED_OUT');
    this.emit('USER_CHANGED');
    this.tabSync?.broadcast('LOGOUT');
  }

  /** RFC 7009 令牌撤销（仅服务端；不清理本地会话状态——完整登出用 logout()） */
  async revokeTokens(options?: RevokeTokensOptions): Promise<void> {
    return this.authClient.revokeTokens(options);
  }

  /** 修改密码（新旧密码都按租户传输策略自动预处理） */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return this.authClient.changePassword(currentPassword, newPassword);
  }

  /** 发起找回密码（服务端防枚举：无论账号是否存在都返回成功） */
  async forgotPassword(identity: string): Promise<void> {
    return this.authClient.forgotPassword(identity);
  }

  /** 完成密码重置（验证码来自 forgot-password 邮件/短信） */
  async resetPassword(input: ResetPasswordRequest): Promise<void> {
    return this.authClient.resetPassword(input);
  }

  /** 发送邮箱验证码（注册/换邮箱场景） */
  async sendVerificationEmail(email: string): Promise<{ expiresIn: number }> {
    return this.authClient.sendVerificationEmail(email);
  }

  /** 校验邮箱验证码 */
  async verifyEmail(email: string, code: string): Promise<void> {
    return this.authClient.verifyEmail(email, code);
  }

  /** 更新当前用户资料（部分更新：缺省字段不改） */
  async updateProfile(update: ProfileUpdate): Promise<void> {
    return this.authClient.updateProfile(update);
  }

  /** 我的活跃会话列表（含 isCurrentSession 标记） */
  async getSessions(page?: number, pageSize?: number): Promise<SessionList> {
    return this.authClient.getSessions(page, pageSize);
  }

  /** 登出指定会话（不影响本机） */
  async revokeSession(sessionId: string): Promise<void> {
    return this.authClient.revokeSession(sessionId);
  }

  /** 登出所有其他会话（保留当前会话） */
  async revokeOtherSessions(): Promise<void> {
    return this.authClient.revokeOtherSessions();
  }

  /**
   * step-up 重认证：验证当前密码换取单次使用的 step-up token（5 分钟有效）。
   * deleteAccount 内部自动完成此步；需要精细控制敏感操作时可直接调用。
   */
  async reauthenticate(password: string, mfaCode?: string): Promise<ReauthenticateResult> {
    return this.authClient.reauthenticate(password, mfaCode);
  }

  /** 销户（GDPR 被遗忘权）。成功后本地会话即时清理并广播登出。 */
  async deleteAccount(password: string, options?: DeleteAccountOptions): Promise<void> {
    await this.authClient.deleteAccount(password, options);
    this.tokenManager.clear();
    this.tokenManager.persist();
    this._userCache = null;
    this.emit('LOGGED_OUT');
    this.emit('USER_CHANGED');
    this.tabSync?.broadcast('LOGOUT');
  }

  /** 公开注册试用租户（无需登录）。返回 slug 可直接拼门户地址（getPortalUrl）。 */
  async createTrialTenant(config: {
    name: string;
    adminEmail: string;
    adminPassword: string;
    agreementAccepted?: boolean;
  }): Promise<TrialTenantResult> {
    return this.authClient.createTrialTenant(config);
  }

  async getProfile(): Promise<Record<string, unknown> | null> {
    return this.authClient.getProfile();
  }

  setTenantId(tenantId: string | null): void {
    this.tokenManager.setTenantId(tenantId);
    this.tokenManager.persist();
    this._authConfig = null;
    try { this.authClient.clearConfigCache(); } catch {}
  }

  getTenantId(): string | null {
    return this.tokenManager.getTenantId();
  }

  /** 租户 slug（显式配置 > issuer 提取；共享 issuer 下需在 config 传入） */
  getTenantSlug(): string | null {
    return this.tenantSlug || null;
  }

  /**
   * 控制台门户地址（admin/user/security/platform/authenticator 带 /<tenant-slug>/；
   * developer/status 为全局站）。根域由 apiUrl/issuer 推导（剥离 api./auth. 前缀）。
   */
  getPortalUrl(portal: PortalName): string | null {
    return buildPortalUrl(this.config.apiUrl ?? this.config.issuer, portal, this.tenantSlug || null);
  }

  use(plugin: AutionalPlugin): void {
    plugin.install(this);
  }

  on(event: AutionalEvent, handler: EventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
    return () => this.eventHandlers.get(event)?.delete(handler);
  }

  emit(event: AutionalEvent, ...args: unknown[]): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(fn => {
        try { fn(...args); } catch { /* handler error shouldn't break others */ }
      });
    }
  }

  dispose(): void {
    this.tabSync?.close();
    this.eventHandlers.clear();
  }
}
