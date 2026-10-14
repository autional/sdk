import type { StorageAdapter } from './platform/types';
import type { AuthMode, TokenClaims } from './types';

interface TokenStore {
  accessToken: string | null;
  refreshToken: string | null;
  /** OIDC id_token —— RP-Initiated Logout 的 id_token_hint 来源（与 AT/RT 同级持久化） */
  idToken: string | null;
  user: Record<string, unknown> | null;
  tenantId: string | null;
  expiresAt: number | null;
  authMode: AuthMode | null;
  oauthClientId: string | null;
}

const STORAGE_PREFIX = 'autional_';

export class TokenManager {
  private storage: StorageAdapter;
  private prefix: string;
  private store: TokenStore;
  private changeListeners: Set<(token: string | null) => void> = new Set();

  /** 是否 httpOnly cookie 模式（不持久化 token） */
  private cookieMode: boolean;

  constructor(storage: StorageAdapter, prefix?: string, cookieMode?: boolean) {
    this.storage = storage;
    this.prefix = prefix ?? STORAGE_PREFIX;
    this.cookieMode = cookieMode ?? false;
    this.store = this.initialStore();
  }

  private initialStore(): TokenStore {
    return {
      accessToken: null,
      refreshToken: null,
      idToken: null,
      user: null,
      tenantId: null,
      expiresAt: null,
      authMode: null,
      oauthClientId: null,
    };
  }

  private storageKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async load(): Promise<void> {
    if (this.cookieMode) return;
    try {
      const raw = await this.storage.getItem(this.storageKey('tokens'));
      if (raw) {
        const parsed = JSON.parse(raw) as TokenStore;
        this.store = { ...this.initialStore(), ...parsed };
      }
    } catch {
      this.store = this.initialStore();
    }
  }

  async persist(): Promise<void> {
    if (this.cookieMode) return;
    try {
      await this.storage.setItem(this.storageKey('tokens'), JSON.stringify(this.store));
    } catch { /* quota exceeded, non-critical */ }
  }

  getAccessToken(): string | null {
    if (this.store.accessToken && this.isTokenExpired(this.store.accessToken)) {
      return null;
    }
    return this.store.accessToken;
  }

  /**
   * 是否应在请求前主动刷新：有 token 且剩余寿命 ≤ skewMs（已过期亦为 true）。
   * 无 token（未登录）返回 false —— 由 401 路径处理。
   */
  needsRefresh(skewMs: number): boolean {
    const token = this.store.accessToken;
    if (!token) return false;
    const claims = this.decodeToken(token);
    if (!claims?.exp) return false;
    return claims.exp * 1000 - Date.now() <= skewMs;
  }

  getRefreshToken(): string | null {
    return this.store.refreshToken;
  }

  /**
   * OIDC id_token（RP-Initiated Logout 的 id_token_hint 来源）。
   * 不做过期过滤 —— 由调用方（logout）判断：过期 hint 会被服务端拒绝（400），须省略。
   * 旧版持久化载荷无此字段 → 返回 null。
   */
  getIdToken(): string | null {
    return this.store.idToken ?? null;
  }

  getUser(): Record<string, unknown> | null {
    return this.store.user;
  }

  getTenantId(): string | null {
    return this.store.tenantId;
  }

  getExpiresAt(): number | null {
    return this.store.expiresAt;
  }

  isAuthenticated(): boolean {
    return !!this.store.accessToken && !this.isTokenExpired(this.store.accessToken!);
  }

  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    this.store.accessToken = accessToken;
    this.store.refreshToken = refreshToken;
    this.store.expiresAt = Date.now() + expiresIn * 1000;
    this.notifyListeners(accessToken);
  }

  setIdToken(idToken: string | null): void {
    this.store.idToken = idToken;
  }

  setUser(user: Record<string, unknown>): void {
    this.store.user = user;
  }

  setTenantId(tenantId: string | null): void {
    this.store.tenantId = tenantId;
  }

  setAuthMode(mode: AuthMode, oauthClientId?: string): void {
    this.store.authMode = mode;
    if (oauthClientId !== undefined) {
      this.store.oauthClientId = oauthClientId;
    }
  }

  getAuthMode(): AuthMode | null {
    return this.store.authMode;
  }

  getOAuthClientId(): string | null {
    return this.store.oauthClientId;
  }

  clear(): void {
    this.store = this.initialStore();
    this.notifyListeners(null);
  }

  onTokenChange(listener: (token: string | null) => void): () => void {
    this.changeListeners.add(listener);
    return () => this.changeListeners.delete(listener);
  }

  private notifyListeners(token: string | null): void {
    this.changeListeners.forEach(fn => {
      try { fn(token); } catch { /* listener error shouldn't break others */ }
    });
  }

  decodeToken(token: string): TokenClaims | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      return JSON.parse(json) as TokenClaims;
    } catch {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const claims = this.decodeToken(token);
    if (!claims?.exp) return true;
    return Date.now() >= claims.exp * 1000;
  }

  getTokenRemainingTime(token: string): number {
    const claims = this.decodeToken(token);
    if (!claims?.exp) return 0;
    return Math.max(0, claims.exp * 1000 - Date.now());
  }
}
