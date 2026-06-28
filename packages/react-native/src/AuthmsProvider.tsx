import {
  createContext, useContext, useEffect, useState, useMemo,
  type ReactNode,
} from 'react';
import {
  AuthMS,
  AuthmsError,
  type AuthmsConfig as CoreConfig,
  type User,
  type AuthResult,
  type LoginRequest,
  type OAuthOptions,
} from '@authms/core';
import { createRNPlatform } from './platform';
import type { AsyncStorageLike } from './types';

export interface AuthmsProviderConfig {
  appId: string;
  authUrl: string;
  storagePrefix?: string;
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
  storage: AsyncStorageLike;
  children: ReactNode;
  loadingFallback?: ReactNode;
}

export function AuthmsProvider({ config, storage, children, loadingFallback }: AuthmsProviderProps) {
  const [authms] = useState(() => {
    const coreConfig: CoreConfig = {
      appId: config.appId,
      issuer: config.authUrl,
      platform: createRNPlatform(storage),
      storagePrefix: config.storagePrefix,
      syncTabs: false,
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
    return () => { cancelled = true; };
  }, [authms]);

  useEffect(() => {
    return () => { authms.dispose(); };
  }, [authms]);

  const value = useMemo(() => ({ authms }), [authms]);

  if (initError) throw initError;
  if (!ready) return loadingFallback ? <>{loadingFallback}</> : null;

  return <AuthmsContext.Provider value={value}>{children}</AuthmsContext.Provider>;
}

interface UseAuthmsReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
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

  useEffect(() => {
    const unsubReady = authms.on('READY', () => setIsLoading(false));
    const unsubUser = authms.on('USER_CHANGED', () => setUser(authms.user));
    return () => { unsubReady(); unsubUser(); };
  }, [authms]);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login: (c) => authms.login(c),
    loginWithOAuth: (o) => authms.loginWithOAuth(o),
    register: (d) => authms.register(d),
    logout: () => authms.logout(),
    getAccessToken: () => authms.getAccessToken(),
    setTenantId: (id) => authms.setTenantId(id),
    getTenantId: () => authms.getTenantId(),
  }), [user, isLoading, authms]);
}
