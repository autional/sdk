// @ts-nocheck — vitest mock types
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { mockVueInject, mockVueRef, mockVueComputed, mockVueOnMounted, mockVueOnUnmounted } = vi.hoisted(() => ({
  mockVueInject: vi.fn(),
  mockVueRef: vi.fn((initial: any) => ({ value: initial })),
  mockVueComputed: vi.fn((fn: () => any) => ({ value: fn() })),
  mockVueOnMounted: vi.fn((fn: () => void) => fn()),
  mockVueOnUnmounted: vi.fn(),
}));

vi.mock('vue', () => ({
  inject: mockVueInject,
  ref: mockVueRef,
  computed: mockVueComputed,
  onMounted: mockVueOnMounted,
  onUnmounted: mockVueOnUnmounted,
}));

vi.mock('@authms/core', () => {
  const mockAuthMS = vi.fn().mockImplementation(function (this: any) {
    this.on = vi.fn().mockReturnValue(() => {});
    this.initialize = vi.fn().mockResolvedValue(undefined);
    this.login = vi.fn().mockResolvedValue({});
    this.loginWithOAuth = vi.fn().mockResolvedValue(undefined);
    this.register = vi.fn().mockResolvedValue({});
    this.logout = vi.fn().mockResolvedValue(undefined);
    this.isReady = vi.fn().mockReturnValue(true);
    this.isAuthenticated = vi.fn().mockReturnValue(false);
    this.getAccessToken = vi.fn().mockResolvedValue(null);
    this.user = null;
  });
  return {
    AuthMS: mockAuthMS,
    browserPlatform: {},
    AuthmsError: class extends Error {
      code = '';
      status = 0;
      constructor(c: string, m: string, s: number) {
        super(m);
        this.code = c;
        this.status = s;
      }
    },
  };
});

import { createAuthms, getAuthms } from '../createAuthms';
import { useAuthms } from '../useAuthms';
import { authmsGuard } from '../guard';

describe('createAuthms', () => {
  it('returns a Vue Plugin with install method', () => {
    const plugin = createAuthms({ appId: 'test', issuer: 'https://auth.example.com' });

    expect(plugin).toHaveProperty('install');
    expect(typeof plugin.install).toBe('function');
  });

  it('install calls app.provide with the authms instance', () => {
    const plugin = createAuthms({ appId: 'test', issuer: 'https://auth.example.com' });
    const mockApp = { provide: vi.fn() };

    plugin.install(mockApp as any);

    expect(mockApp.provide).toHaveBeenCalled();
    const [key, instance] = mockApp.provide.mock.calls[0];
    expect(instance).toBeDefined();
  });
});

describe('useAuthms', () => {
  let mockAuthms: any;

  beforeEach(() => {
    mockAuthms = {
      on: vi.fn().mockReturnValue(() => {}),
      initialize: vi.fn().mockResolvedValue(undefined),
      login: vi.fn().mockResolvedValue({ access_token: 'token' }),
      loginWithOAuth: vi.fn().mockResolvedValue(undefined),
      register: vi.fn().mockResolvedValue({ access_token: 'token' }),
      logout: vi.fn().mockResolvedValue(undefined),
      isReady: vi.fn().mockReturnValue(true),
      isAuthenticated: vi.fn().mockReturnValue(true),
      getAccessToken: vi.fn().mockResolvedValue('token'),
      user: { sub: 'user-1', email: 'test@test.com' },
    };

    mockVueInject.mockReturnValue(mockAuthms);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns reactive user, isLoading, isAuthenticated', () => {
    const result = useAuthms();

    expect(result).toHaveProperty('authms');
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('isLoading');
    expect(result).toHaveProperty('isAuthenticated');
    expect(result).toHaveProperty('login');
    expect(result).toHaveProperty('logout');
    expect(result).toHaveProperty('getAccessToken');
  });

  it('login method delegates to authms.login', async () => {
    const result = useAuthms();
    const credentials = { email: 'test@test.com', password: 'secret' };

    await result.login(credentials as any);

    expect(mockAuthms.login).toHaveBeenCalledWith(credentials);
  });

  it('logout delegates to authms.logout', async () => {
    const result = useAuthms();

    await result.logout();

    expect(mockAuthms.logout).toHaveBeenCalled();
  });
});

describe('getAuthms', () => {
  let freshCreateAuthms: typeof createAuthms;
  let freshGetAuthms: typeof getAuthms;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('../createAuthms');
    freshCreateAuthms = mod.createAuthms;
    freshGetAuthms = mod.getAuthms;
  });

  it('returns null before createAuthms', () => {
    expect(freshGetAuthms()).toBeNull();
  });

  it('returns instance after createAuthms', () => {
    freshCreateAuthms({ appId: 'test', issuer: 'https://auth.example.com' });

    expect(freshGetAuthms()).not.toBeNull();
  });
});

describe('authmsGuard', () => {
  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('../createAuthms');
    mod.createAuthms({ appId: 'test', issuer: 'https://auth.example.com' });
  });

  it('returns a function for router use', () => {
    const guard = authmsGuard();

    expect(typeof guard).toBe('function');
  });
});
