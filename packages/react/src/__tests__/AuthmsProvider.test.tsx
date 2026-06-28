import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import type { ReactNode } from 'react';

// ---- shared init-state control ----

const initState = vi.hoisted(() => {
  let _deferResolve: (() => void) | null = null;
  let _deferReject: ((e: Error) => void) | null = null;

  return {
    /** When true, initialize() returns a pending promise controlled by resolve() */
    deferInit: false as boolean,
    /** When true, initialize() rejects with rejectError */
    rejectInit: false as boolean,
    rejectError: new Error('Network error') as Error,
    /** Pre-seeded user (null = unauthenticated) */
    initialUser: null as Record<string, unknown> | null,
    /** When true, the mock starts with _ready=true */
    preReady: false as boolean,
    /**
     * When true, initialize() resolves normally (so Provider shows children)
     * but does NOT set _ready=true. useAuthms.isLoading stays true until
     * authms emits 'READY' some other way. Used for RequireAuth loadingFallback test.
     */
    stayUnready: false as boolean,

    resolve() {
      _deferResolve?.();
    },
    reject(e?: Error) {
      _deferReject?.(e ?? new Error('Init failed'));
    },
    reset() {
      this.deferInit = false;
      this.rejectInit = false;
      this.initialUser = null;
      this.preReady = false;
      this.stayUnready = false;
      _deferResolve = null;
      _deferReject = null;
    },
    getDeferred(): Promise<void> {
      return new Promise<void>((res, rej) => {
        _deferResolve = res;
        _deferReject = rej;
      });
    },
  };
});

// ---- mock @authms/core ----

vi.mock('@authms/core', () => ({
  AuthMS: vi.fn().mockImplementation(function AuthMSMock(this: any, config: any) {
    const self = this;
    this.config = config;
    this._handlers = new Map<string, Set<Function>>();
    this._userCache = initState.initialUser;
    this._authConfig = null;
    this._ready = initState.preReady;

    Object.defineProperty(this, 'user', {
      get: () => this._userCache,
      set: (v: any) => {
        this._userCache = v;
      },
      configurable: true,
    });
    Object.defineProperty(this, 'authConfig', {
      get: () => this._authConfig,
      set: (v: any) => {
        this._authConfig = v;
      },
      configurable: true,
    });

    this.isReady = vi.fn(() => this._ready);
    this.isAuthenticated = vi.fn(() => !!this._userCache);

    this.initialize = vi.fn(() => {
      if (initState.rejectInit) return Promise.reject(initState.rejectError);

      if (initState.deferInit) {
        // Deferred: Provider stays in loading, RequireAuth never mounts.
        // On resolve, set _ready + emit READY so useAuthms transitions.
        return initState.getDeferred().then(() => {
          self._ready = true;
          (self.emit as Function)('READY');
        });
      }

      if (initState.stayUnready) {
        // Provider shows children (ready=true) but useAuthms sees isLoading=true.
        // Never set _ready or emit READY — RequireAuth's loadingFallback appears.
        return Promise.resolve();
      }

      // Normal flow
      self._ready = true;
      (self.emit as Function)('READY');
      return Promise.resolve();
    });

    this.getAccessToken = vi.fn().mockResolvedValue(null);
    this.dispose = vi.fn();
    this.fetchAuthConfig = vi.fn().mockResolvedValue({ loginMethods: ['password'] });

    this.login = vi.fn().mockResolvedValue({
      user: { id: 'u1' },
      accessToken: 'at',
      refreshToken: 'rt',
      expiresIn: 3600,
      tokenType: 'Bearer',
    });
    this.loginWithOAuth = vi.fn().mockResolvedValue(undefined);
    this.register = vi.fn().mockResolvedValue({
      user: { id: 'u1' },
      accessToken: 'at',
      refreshToken: 'rt',
      expiresIn: 3600,
      tokenType: 'Bearer',
    });
    this.logout = vi.fn().mockResolvedValue(undefined);
    this.setTenantId = vi.fn();
    this.getTenantId = vi.fn().mockReturnValue(null);
    this.api = { post: vi.fn(), get: vi.fn() };

    this.on = vi.fn(function (this: any, event: string, handler: Function) {
      if (!this._handlers.has(event)) this._handlers.set(event, new Set());
      this._handlers.get(event)!.add(handler);
      return () => {
        this._handlers.get(event)?.delete(handler);
      };
    });

    this.emit = vi.fn(function (this: any, event: string, ...args: unknown[]) {
      this._handlers.get(event)?.forEach((h: Function) => h(...args));
    });
  }),

  browserPlatform: {},

  AuthmsError: class extends Error {
    code: string;
    status: number;
    constructor(c: string, m: string, s: number) {
      super(m);
      this.code = c;
      this.status = s;
    }
  },
}));

// eslint-disable-next-line import/first
import { AuthmsProvider, useAuthms, RequireAuth } from '../index';

// ---- helpers ----

const baseConfig = { appId: 'test-app', issuer: 'https://auth.example.com' };

function TestConsumer() {
  const { user, isLoading, isAuthenticated } = useAuthms();
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="user">{user ? (user as any).id : 'null'}</span>
    </div>
  );
}

// ---- setup / teardown ----

beforeEach(() => {
  initState.reset();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ---- tests ----

describe('AuthmsProvider', () => {
  // 1
  it('renders children after initialization', async () => {
    render(
      <AuthmsProvider config={baseConfig}>
        <div data-testid="child">Hello</div>
      </AuthmsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  // 2
  it('shows loadingFallback while loading', async () => {
    initState.deferInit = true;

    render(
      <AuthmsProvider
        config={baseConfig}
        loadingFallback={<div data-testid="loader">Loading...</div>}
      >
        <div data-testid="child">Hello</div>
      </AuthmsProvider>,
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByTestId('child')).toBeNull();

    initState.resolve();

    await waitFor(() => {
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('loader')).toBeNull();
  });

  // 8
  it('renders error UI on init failure', async () => {
    initState.rejectInit = true;

    render(
      <AuthmsProvider config={baseConfig}>
        <div data-testid="child">Hello</div>
      </AuthmsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Connection Error')).toBeInTheDocument();
    });
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.queryByTestId('child')).toBeNull();
  });
});

describe('useAuthms', () => {
  // 3
  it('returns user, isLoading, isAuthenticated', async () => {
    render(
      <AuthmsProvider config={baseConfig}>
        <TestConsumer />
      </AuthmsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  // 4
  it('throws when used outside Provider', () => {
    function BadConsumer() {
      useAuthms();
      return null;
    }
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<BadConsumer />)).toThrow(
      'useAuthms must be used within AuthmsProvider',
    );
    spy.mockRestore();
  });
});

describe('RequireAuth', () => {
  // 5
  it('renders children when authenticated', async () => {
    initState.preReady = true;
    initState.initialUser = { id: 'user-1', email: 'a@b.com' };

    render(
      <AuthmsProvider config={baseConfig}>
        <RequireAuth>
          <div data-testid="protected">Secret</div>
        </RequireAuth>
      </AuthmsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('protected')).toBeInTheDocument();
    });
  });

  // 6
  it('shows fallback when not authenticated', async () => {
    initState.preReady = true;

    render(
      <AuthmsProvider config={baseConfig}>
        <RequireAuth fallback={<div data-testid="fallback">Please log in</div>}>
          <div data-testid="protected">Secret</div>
        </RequireAuth>
      </AuthmsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('protected')).toBeNull();
  });

  // 7
  it('shows loadingFallback during initialization', async () => {
    initState.stayUnready = true;

    render(
      <AuthmsProvider config={baseConfig}>
        <RequireAuth loadingFallback={<div data-testid="auth-loading">Checking...</div>}>
          <div data-testid="protected">Secret</div>
        </RequireAuth>
      </AuthmsProvider>,
    );

    // Provider ready=true → renders children → RequireAuth mounts
    // useAuthms.isLoading = !isReady() = true → RequireAuth shows loadingFallback
    await waitFor(() => {
      expect(screen.getByTestId('auth-loading')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('protected')).toBeNull();
  });
});
