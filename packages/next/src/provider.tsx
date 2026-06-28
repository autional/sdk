'use client';

import { useRef, type ReactNode } from 'react';
import {
  AuthmsProvider as ReactAuthmsProvider,
  type AuthmsProviderConfig,
} from '@authms/react';

export interface AuthmsNextProviderConfig extends AuthmsProviderConfig {
  initialToken?: string;
  cookieName?: string;
}

const STORAGE_KEY = 'authms_tokens';
const DEFAULT_COOKIE = 'authms_token';

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function seedStorage(token: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      accessToken: token,
      refreshToken: null,
      user: null,
      tenantId: null,
      expiresAt: null,
    }));
  } catch { /* localStorage unavailable */ }
}

interface Props {
  config: AuthmsNextProviderConfig;
  children: ReactNode;
  loadingFallback?: ReactNode;
}

export function AuthmsProvider({ config, children, loadingFallback }: Props) {
  const { initialToken, cookieName = DEFAULT_COOKIE, ...reactConfig } = config;
  const synced = useRef(false);

  if (!synced.current) {
    synced.current = true;

    const token = initialToken ?? readCookie(cookieName);
    if (token) {
      seedStorage(token);
    }
  }

  return (
    <ReactAuthmsProvider config={reactConfig} loadingFallback={loadingFallback}>
      {children}
    </ReactAuthmsProvider>
  );
}
