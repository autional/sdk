import {
  createContext, useContext, useEffect, useState, useMemo,
  type ReactNode,
} from 'react';
import {
  Autional,
  AutionalError,
  type AutionalConfig as CoreConfig,
  type User,
  type AuthResult,
  type LoginRequest,
  type OAuthOptions,
} from '@autional/core';
import { createRNPlatform } from './platform';
import type { AsyncStorageLike } from './types';

export interface AutionalProviderConfig {
  appId: string;
  authUrl: string;
  storagePrefix?: string;
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
  storage: AsyncStorageLike;
  children: ReactNode;
  loadingFallback?: ReactNode;
}

export function AutionalProvider({ config, storage, children, loadingFallback }: AutionalProviderProps) {
  const [autional] = useState(() => {
    const coreConfig: CoreConfig = {
      appId: config.appId,
      issuer: config.authUrl,
      platform: createRNPlatform(storage),
      storagePrefix: config.storagePrefix,
      syncTabs: false,
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
    return () => { cancelled = true; };
  }, [autional]);

  useEffect(() => {
    return () => { autional.dispose(); };
  }, [autional]);

  const value = useMemo(() => ({ autional }), [autional]);

  if (initError) throw initError;
  if (!ready) return loadingFallback ? <>{loadingFallback}</> : null;

  return <AutionalContext.Provider value={value}>{children}</AutionalContext.Provider>;
}

interface UseAutionalReturn {
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

export function useAutional(): UseAutionalReturn {
  const { autional } = useAutionalContext();
  const [user, setUser] = useState<User | null>(() => autional.user);
  const [isLoading, setIsLoading] = useState(!autional.isReady());

  useEffect(() => {
    const unsubReady = autional.on('READY', () => setIsLoading(false));
    const unsubUser = autional.on('USER_CHANGED', () => setUser(autional.user));
    return () => { unsubReady(); unsubUser(); };
  }, [autional]);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login: (c) => autional.login(c),
    loginWithOAuth: (o) => autional.loginWithOAuth(o),
    register: (d) => autional.register(d),
    logout: () => autional.logout(),
    getAccessToken: () => autional.getAccessToken(),
    setTenantId: (id) => autional.setTenantId(id),
    getTenantId: () => autional.getTenantId(),
  }), [user, isLoading, autional]);
}
