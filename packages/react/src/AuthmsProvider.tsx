import {
  createContext, useContext, useEffect, useState, useMemo, useCallback,
  type ReactNode,
} from 'react';
import {
  AuthMS,
  browserPlatform,
  type AuthmsConfig as CoreConfig,
  type User,
  type AuthResult,
  type LoginRequest,
  type OAuthOptions,
  AuthmsError,
} from '@authms/core';

export interface AuthmsProviderConfig {
  appId: string;
  issuer: string;
  apiUrl?: string;
  storagePrefix?: string;
  syncTabs?: boolean;
}

interface AuthmsContextValue {
  authms: AuthMS;
}

const AuthmsContext = createContext<AuthmsContextValue | null>(null);

export function useAuthmsContext(): AuthmsContextValue {
  const ctx = useContext(AuthmsContext);
  if (!ctx) {
    throw new AuthmsError('CONFIG_ERROR', 'useAuthms must be used within AuthmsProvider', 500);
  }
  return ctx;
}

interface AuthmsProviderProps {
  config: AuthmsProviderConfig;
  children: ReactNode;
  loadingFallback?: ReactNode;
}

export function AuthmsProvider({ config, children, loadingFallback }: AuthmsProviderProps) {
  const [authms] = useState(() => {
    const coreConfig: CoreConfig = {
      appId: config.appId,
      issuer: config.issuer,
      apiUrl: config.apiUrl,
      platform: browserPlatform,
      storagePrefix: config.storagePrefix,
      syncTabs: config.syncTabs,
    };
    return new AuthMS(coreConfig);
  });

  const [ready, setReady] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    authms.initialize()
      .then(() => { if (!cancelled) setReady(true); })
      .catch((e: unknown) => { if (!cancelled) setInitError(e instanceof Error ? e : new Error(String(e))); });
    return () => {
      cancelled = true;
    };
  }, [authms]);

  useEffect(() => {
    return () => { authms.dispose(); };
  }, [authms]);

  const value = useMemo(() => ({ authms }), [authms]);

  if (initError) {
    return <div style={{ maxWidth: 480, margin: '60px auto', padding: 32, background: '#fee2e2', borderRadius: 12 }}>
      <h3 style={{ margin: '0 0 8px' }}>Connection Error</h3>
      <p style={{ fontSize: 14, color: '#991b1b', margin: '0 0 4px' }}>{initError.message}</p>
      {(initError as any).cause ? <p style={{ fontSize: 12, color: '#7f1d1d', margin: 0 }}>{((initError as any).cause as Error).message}</p> : null}
    </div>;
  }
  if (!ready) return loadingFallback ? <>{loadingFallback}</> : null;

  return <AuthmsContext.Provider value={value}>{children}</AuthmsContext.Provider>;
}

interface UseAuthmsReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authConfig: Record<string, unknown> | null;
  login: (credentials: LoginRequest) => Promise<AuthResult>;
  loginWithOAuth: (options: OAuthOptions) => Promise<void>;
  register: (data: LoginRequest) => Promise<AuthResult>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  setTenantId: (tenantId: string | null) => void;
  getTenantId: () => string | null;
}

export function useAuthms(): UseAuthmsReturn {
  const { authms } = useAuthmsContext();
  const [user, setUser] = useState<User | null>(() => authms.user);
  const [isLoading, setIsLoading] = useState(!authms.isReady());
  const [authConfig, setAuthConfig] = useState<Record<string, unknown> | null>(() => authms.authConfig);

  useEffect(() => {
    const unsubReady = authms.on('READY', () => {
      setIsLoading(false);
      authms.fetchAuthConfig().then(cfg => setAuthConfig(cfg));
    });
    const unsubUser = authms.on('USER_CHANGED', () => setUser(authms.user));
    return () => { unsubReady(); unsubUser(); };
  }, [authms]);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    authConfig,
    login: (c) => authms.login(c),
    loginWithOAuth: (o) => authms.loginWithOAuth(o),
    register: (d) => authms.register(d),
    logout: () => authms.logout(),
    getAccessToken: () => authms.getAccessToken(),
    setTenantId: (id) => authms.setTenantId(id),
    getTenantId: () => authms.getTenantId(),
  }), [user, isLoading, authConfig, authms]);
}
