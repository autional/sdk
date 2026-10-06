'use client';

import { useRef, type ReactNode } from 'react';
import {
  AutionalProvider as ReactAutionalProvider,
  type AutionalProviderConfig,
} from '@autional/react';

export interface AutionalNextProviderConfig extends AutionalProviderConfig {
  initialToken?: string;
  cookieName?: string;
}

const STORAGE_KEY = 'autional_tokens';
const DEFAULT_COOKIE = 'autional_token';

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
  config: AutionalNextProviderConfig;
  children: ReactNode;
  loadingFallback?: ReactNode;
}

export function AutionalProvider({ config, children, loadingFallback }: Props) {
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
    <ReactAutionalProvider config={reactConfig} loadingFallback={loadingFallback}>
      {children}
    </ReactAutionalProvider>
  );
}
