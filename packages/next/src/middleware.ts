import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export interface AuthmsMiddlewareConfig {
  protectedPaths: string[];
  loginPath: string;
  publicPaths?: string[];
  cookieName?: string;
}

const DEFAULT_COOKIE_NAME = 'authms_token';

const NEXTJS_INTERNAL = [
  '/_next/',
  '/favicon.ico',
  '/api/auth/',
];

function matchesPattern(pathname: string, pattern: string): boolean {
  if (pattern.endsWith('/:path*')) {
    const base = pattern.replace('/:path*', '');
    return pathname === base || pathname.startsWith(base + '/');
  }
  if (pattern.endsWith('/(.*)')) {
    const base = pattern.replace('/(.*)', '');
    return pathname === base || pathname.startsWith(base + '/');
  }
  if (pattern.endsWith('/*')) {
    const base = pattern.slice(0, -2);
    return pathname === base || pathname.startsWith(base + '/');
  }
  return pathname === pattern;
}

function isPublicPath(pathname: string, publicPaths: string[]): boolean {
  return publicPaths.some((p) => matchesPattern(pathname, p));
}

function isProtectedPath(pathname: string, protectedPaths: string[]): boolean {
  return protectedPaths.some((p) => matchesPattern(pathname, p));
}

function isNextInternal(pathname: string): boolean {
  return NEXTJS_INTERNAL.some((p) => pathname.startsWith(p));
}

function extractToken(request: NextRequest, cookieName: string): string | null {
  return (
    request.cookies.get(cookieName)?.value ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
    null
  );
}

export function authmsMiddleware(config: AuthmsMiddlewareConfig) {
  const {
    protectedPaths,
    loginPath,
    publicPaths = [],
    cookieName = DEFAULT_COOKIE_NAME,
  } = config;

  return (request: NextRequest): NextResponse => {
    const { pathname } = request.nextUrl;

    if (isNextInternal(pathname)) {
      return NextResponse.next();
    }

    if (isPublicPath(pathname, publicPaths)) {
      return NextResponse.next();
    }

    if (matchesPattern(pathname, loginPath)) {
      return NextResponse.next();
    }

    if (!isProtectedPath(pathname, protectedPaths)) {
      return NextResponse.next();
    }

    const token = extractToken(request, cookieName);

    if (!token) {
      const loginUrl = new URL(loginPath, request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  };
}
