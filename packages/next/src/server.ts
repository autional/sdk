import { cookies } from 'next/headers';
import type { User } from '@authms/core';

export interface ServerSessionConfig {
  authUrl: string;
  cookieName?: string;
}

export interface ServerSession {
  user: User | null;
  accessToken: string | null;
}

const DEFAULT_COOKIE_NAME = 'authms_token';

function getTokenFromCookies(cookieStore: Awaited<ReturnType<typeof cookies>>, cookieName: string): string | null {
  const cookie = cookieStore.get(cookieName);
  return cookie?.value ?? null;
}

interface AuthMeResponse {
  code?: number;
  data?: Record<string, unknown>;
}

export async function getServerSession(
  config?: ServerSessionConfig,
): Promise<ServerSession> {
  const cookieName = config?.cookieName ?? DEFAULT_COOKIE_NAME;

  try {
    const cookieStore = await cookies();
    const token = getTokenFromCookies(cookieStore, cookieName);

    if (!token) {
      return { user: null, accessToken: null };
    }

    if (config?.authUrl) {
      const baseUrl = config.authUrl.replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/identity/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      if (!response.ok) {
        return { user: null, accessToken: null };
      }

      const json = (await response.json()) as AuthMeResponse;
      const user = (json.data ?? json) as unknown as User;
      return { user, accessToken: token };
    }

    return { user: null, accessToken: token };
  } catch {
    return { user: null, accessToken: null };
  }
}
