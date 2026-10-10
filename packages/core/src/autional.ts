import { TokenManager } from './token-manager';
import { ApiClient } from './api-client';
import { AuthClient } from './auth-client';
import { Discovery } from './discovery';
import { TabSync } from './sync';
import { AutionalError } from './errors';
import type { AutionalPlatform } from './platform/types';
import type { AutionalPlugin } from './plugin';
import type {
  User, AuthResult, LoginRequest, RegisterRequest,
  OAuthOptions, AutionalEvent, SecurityAlert, TenantAuthConfig,
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
  /** 确定的租户 ID (从 config 或 issuer 提取) */
  readonly tenantId: string;

  constructor(config: AutionalConfig) {
    if (!config.issuer) throw new AutionalError('CONFIG_ERROR', 'issuer is required', 500);
    if (!config.appId && typeof console !== 'undefined') {
      console.warn('[Autional] appId 未设置。建议在 Autional 控制台创建应用后填写 appId，便于多应用管理和权限隔离。');
    }

    this.config = config;
    const apiUrl = config.apiUrl ?? config.issuer;

    // 确定 tenantId: 显式传入 > issuer 子域名提取 > null (后续按需获取)
    this.tenantId = config.tenantId || this.extractTenantFromIssuer(config.issuer) || '';

    this.tokenManager = new TokenManager(config.platform.storage, config.storagePrefix, config.useCookie);
    this.discovery = new Discovery(config.platform.http, config.apiUrl);
    this.authClient = new AuthClient({
      tokenManager: this.tokenManager,
      http: config.platform.http,
      baseUrl: apiUrl,
      tenantId: this.tenantId,
      appId: config.appId,
    });

    this.api = new ApiClient({
      baseUrl: apiUrl,
      tokenManager: this.tokenManager,
      http: config.platform.http,
      refreshTokenFn: () => this.authClient.refreshToken(),
      onForceLogout: () => {
        this.emit('LOGGED_OUT');
        this.tabSync?.broadcast('LOGOUT');
      },
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
    await     this.tokenManager.load();
    try {
      await this.discovery.discover(this.config.issuer);
    } catch {
      // OIDC Discovery 失败 — API 调用不受影响（apiUrl 已配置）
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

      this.tokenManager.onTokenChange((token) => {
        if (!token) {
          this._userCache = null;
          this.emit('LOGGED_OUT');
        }
        this.emit('TOKEN_CHANGED', { token });
        this.emit('USER_CHANGED');
      });
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

  /** 从 issuer URL 提取子域名作为 tenant */
  private extractTenantFromIssuer(issuer: string): string | null {
    try {
      const url = new URL(issuer);
      const parts = url.hostname.split('.');
      // 三级及以上域名: acme.auth.tianv.com → acme
      if (parts.length >= 3) {
        return parts[0];
      }
      return null;
    } catch {
      return null;
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
      await this.authClient.refreshToken();
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

  async register(data: RegisterRequest): Promise<AuthResult> {
    const result = await this.authClient.register(data);
    if (result.accessToken) {
      this._userCache = result.user as unknown as Record<string, unknown>;
      this.emit('USER_CHANGED');
      this.tabSync?.broadcast('LOGIN');
    }
    return result;
  }

  async logout(): Promise<void> {
    await this.authClient.logout();
    this._userCache = null;
    this.emit('LOGGED_OUT');
    this.emit('USER_CHANGED');
    this.tabSync?.broadcast('LOGOUT');
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
