import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn(() => ({ type: 'next' })),
    redirect: vi.fn((url: URL) => ({ type: 'redirect', url: url.href })),
  },
}));

import { NextResponse } from 'next/server';
import { authmsMiddleware } from '../middleware';

function createMockRequest(
  pathname: string,
  cookies: Record<string, string> = {},
  headers: Record<string, string> = {},
): any {
  const cookieStore = new Map(Object.entries(cookies));
  return {
    nextUrl: {
      pathname,
      search: '',
      searchParams: new URLSearchParams(),
    },
    cookies: {
      get: (name: string) =>
        cookieStore.has(name) ? { value: cookieStore.get(name) } : undefined,
    },
    headers: {
      get: (name: string) => headers[name.toLowerCase()] ?? null,
    },
    url: `http://localhost:3000${pathname}`,
  };
}

describe('authmsMiddleware', () => {
  const config = {
    protectedPaths: ['/dashboard', '/admin', '/settings'],
    loginPath: '/login',
    cookieName: 'authms_token',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to login when no token on protected path', () => {
    const middleware = authmsMiddleware(config);
    const req = createMockRequest('/dashboard');

    const result = middleware(req as any);

    expect(result).toMatchObject({ type: 'redirect' });
    expect(result.url).toContain('/login');
    expect(result.url).toContain('callbackUrl=%2Fdashboard');
  });

  it('passes through when valid token is on protected path', () => {
    const middleware = authmsMiddleware(config);
    const req = createMockRequest('/dashboard', { authms_token: 'valid-token' });

    const result = middleware(req as any);

    expect(result).toMatchObject({ type: 'next' });
  });

  it('always passes through for public paths', () => {
    const middleware = authmsMiddleware({
      ...config,
      publicPaths: ['/about', '/contact'],
    });
    const req = createMockRequest('/about');

    const result = middleware(req as any);

    expect(result).toMatchObject({ type: 'next' });
  });

  it('always passes through for login path (no redirect loop)', () => {
    const middleware = authmsMiddleware(config);
    const req = createMockRequest('/login');

    const result = middleware(req as any);

    expect(result).toMatchObject({ type: 'next' });
  });

  it('blocks all configured protected paths when no token', () => {
    const middleware = authmsMiddleware(config);

    for (const path of config.protectedPaths) {
      const req = createMockRequest(path);
      const result = middleware(req as any);

      expect(result).toMatchObject({ type: 'redirect' });
      expect(result.url).toContain('/login');
    }
  });

  it('passes through when token is in Authorization header instead of cookie', () => {
    const middleware = authmsMiddleware(config);
    const req = createMockRequest(
      '/dashboard',
      {},
      { authorization: 'Bearer header-token-123' },
    );

    const result = middleware(req as any);

    expect(result).toMatchObject({ type: 'next' });
  });
});
