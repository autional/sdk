/**
 * createPlatformBinding — 共享的 Core 绑定逻辑
 *
 * 用于各框架适配器，消除重复的 AuthMS 初始化/状态管理/事件订阅代码。
 * 适配器只需将此 binding 包装成框架特定的组件/hook。
 */
import { AuthMS } from './authms';
import type { AuthmsConfig, AuthResult, LoginRequest, OAuthOptions } from './types';
import type { AuthmsPlatform } from './platform/types';
import { browserPlatform } from './platform/browser';

export interface BindingConfig {
  appId: string;
  issuer: string;
  apiUrl?: string;
  platform?: AuthmsPlatform;
  storagePrefix?: string;
  syncTabs?: boolean;
}

export interface PlatformBinding {
  authms: AuthMS;

  /** 获取当前用户（由适配器调用） */
  getUser(): Record<string, unknown> | null;

  /** 获取 auth config（由适配器调用） */
  getAuthConfig(): Record<string, unknown> | null;

  /** 是否已就绪 */
  isReady(): boolean;

  /** 是否已认证 */
  isAuthenticated(): boolean;

  /** 注册状态变更回调，返回取消订阅函数 */
  onChange(handler: () => void): () => void;

  /** 登录 */
  login(credentials: LoginRequest): Promise<AuthResult>;

  /** OAuth 登录 */
  loginWithOAuth(options: OAuthOptions): Promise<void>;

  /** 注册 */
  register(data: LoginRequest): Promise<AuthResult>;

  /** 登出 */
  logout(): Promise<void>;

  /** 获取 access token */
  getAccessToken(): Promise<string | null>;

  /** 切换租户 */
  setTenantId(tenantId: string | null): void;

  /** 获取当前租户 */
  getTenantId(): string | null;

  /** 销毁 */
  dispose(): void;
}

export function createPlatformBinding(config: BindingConfig): PlatformBinding {
  const coreConfig: AuthmsConfig = {
    appId: config.appId,
    issuer: config.issuer,
    apiUrl: config.apiUrl,
    platform: config.platform || browserPlatform,
    storagePrefix: config.storagePrefix,
    syncTabs: config.syncTabs,
  };

  const authms = new AuthMS(coreConfig);

  let user: Record<string, unknown> | null = null;
  let authConfig: Record<string, unknown> | null = null;
  let ready = false;
  const changeHandlers = new Set<() => void>();

  const emitChange = () => {
    changeHandlers.forEach((fn) => { try { fn(); } catch {} });
  };

  // 初始化
  authms.initialize().then(async () => {
    user = authms.user as unknown as Record<string, unknown> | null;
    try {
      authConfig = await authms.fetchAuthConfig();
    } catch {}
    ready = true;
    emitChange();
  }).catch(() => {
    ready = true;
    emitChange();
  });

  // 订阅事件
  authms.on('USER_CHANGED', () => {
    user = authms.user as unknown as Record<string, unknown> | null;
    emitChange();
  });

  return {
    authms,
    getUser: () => user,
    getAuthConfig: () => authConfig,
    isReady: () => ready,
    isAuthenticated: () => authms.isAuthenticated(),
    onChange: (handler) => {
      changeHandlers.add(handler);
      return () => changeHandlers.delete(handler);
    },
    login: (c) => authms.login(c),
    loginWithOAuth: (o) => authms.loginWithOAuth(o),
    register: (d) => authms.register(d),
    logout: () => authms.logout(),
    getAccessToken: () => authms.getAccessToken(),
    setTenantId: (id) => authms.setTenantId(id),
    getTenantId: () => authms.getTenantId(),
    dispose: () => {
      changeHandlers.clear();
      authms.dispose();
    },
  };
}
