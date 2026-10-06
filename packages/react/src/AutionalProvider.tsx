import {
  createContext, useContext, useEffect, useState, useMemo, useCallback,
  type ReactNode,
} from 'react';
import {
  Autional,
  browserPlatform,
  type AutionalConfig as CoreConfig,
  type User,
  type AuthResult,
  type LoginRequest,
  type OAuthOptions,
  AutionalError,
} from '@autional/core';

export interface AutionalProviderConfig {
  appId: string;
  issuer: string;
  apiUrl?: string;
  storagePrefix?: string;
  syncTabs?: boolean;
}

interface AutionalContextValue {
  autional: Autional;
}

const AutionalContext = createContext<AutionalContextValue | null>(null);

export function useAutionalContext(): AutionalContextValue {
  const ctx = useContext(AutionalContext);
  if (!ctx) {
    throw new AutionalError('CONFIG_ERROR', 'useAutional must be used within AutionalProvider', 500);
  }
  return ctx;
}

interface AutionalProviderProps {
  config: AutionalProviderConfig;
  children: ReactNode;
  loadingFallback?: ReactNode;
}

export function AutionalProvider({ config, children, loadingFallback }: AutionalProviderProps) {
  const [autional] = useState(() => {
    const coreConfig: CoreConfig = {
      appId: config.appId,
      issuer: config.issuer,
      apiUrl: config.apiUrl,
      platform: browserPlatform,
      storagePrefix: config.storagePrefix,
      syncTabs: config.syncTabs,
    };
    return new Autional(coreConfig);
  });

  const [ready, setReady] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    autional.initialize()
      .then(() => { if (!cancelled) setReady(true); })
      .catch((e: unknown) => { if (!cancelled) setInitError(e instanceof Error ? e : new Error(String(e))); });
    return () => {
      cancelled = true;
    };
  }, [autional]);

  useEffect(() => {
    return () => { autional.dispose(); };
  }, [autional]);

  const value = useMemo(() => ({ autional }), [autional]);

  if (initError) {
    return <div style={{ maxWidth: 480, margin: '60px auto', padding: 32, background: '#fee2e2', borderRadius: 12 }}>
      <h3 style={{ margin: '0 0 8px' }}>Connection Error</h3>
      <p style={{ fontSize: 14, color: '#991b1b', margin: '0 0 4px' }}>{initError.message}</p>
      {(initError as any).cause ? <p style={{ fontSize: 12, color: '#7f1d1d', margin: 0 }}>{((initError as any).cause as Error).message}</p> : null}
    </div>;
  }
  if (!ready) return loadingFallback ? <>{loadingFallback}</> : null;

  return <AutionalContext.Provider value={value}>{children}</AutionalContext.Provider>;
}

interface UseAutionalReturn {
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

export function useAutional(): UseAutionalReturn {
  const { autional } = useAutionalContext();
  const [user, setUser] = useState<User | null>(() => autional.user);
  const [isLoading, setIsLoading] = useState(!autional.isReady());
  const [authConfig, setAuthConfig] = useState<Record<string, unknown> | null>(() => autional.authConfig);

  useEffect(() => {
    const unsubReady = autional.on('READY', () => {
      setIsLoading(false);
      autional.fetchAuthConfig().then(cfg => setAuthConfig(cfg));
    });
    const unsubUser = autional.on('USER_CHANGED', () => setUser(autional.user));
    return () => { unsubReady(); unsubUser(); };
  }, [autional]);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    authConfig,
    login: (c) => autional.login(c),
    loginWithOAuth: (o) => autional.loginWithOAuth(o),
    register: (d) => autional.register(d),
    logout: () => autional.logout(),
    getAccessToken: () => autional.getAccessToken(),
    setTenantId: (id) => autional.setTenantId(id),
    getTenantId: () => autional.getTenantId(),
  }), [user, isLoading, authConfig, autional]);
}
