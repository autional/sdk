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

vi.mock('@autional/core', () => {
  const mockAutional = vi.fn().mockImplementation(function (this: any) {
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
    Autional: mockAutional,
    browserPlatform: {},
    AutionalError: class extends Error {
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

import { createAutional, getAutional } from '../createAutional';
import { useAutional } from '../useAutional';
import { autionalGuard } from '../guard';

describe('createAutional', () => {
  it('returns a Vue Plugin with install method', () => {
    const plugin = createAutional({ appId: 'test', issuer: 'https://auth.example.com' });

    expect(plugin).toHaveProperty('install');
    expect(typeof plugin.install).toBe('function');
  });

  it('install calls app.provide with the autional instance', () => {
    const plugin = createAutional({ appId: 'test', issuer: 'https://auth.example.com' });
    const mockApp = { provide: vi.fn() };

    plugin.install(mockApp as any);

    expect(mockApp.provide).toHaveBeenCalled();
    const [key, instance] = mockApp.provide.mock.calls[0];
    expect(instance).toBeDefined();
  });
});

describe('useAutional', () => {
  let mockAutional: any;

  beforeEach(() => {
    mockAutional = {
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

    mockVueInject.mockReturnValue(mockAutional);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns reactive user, isLoading, isAuthenticated', () => {
    const result = useAutional();

    expect(result).toHaveProperty('autional');
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('isLoading');
    expect(result).toHaveProperty('isAuthenticated');
    expect(result).toHaveProperty('login');
    expect(result).toHaveProperty('logout');
    expect(result).toHaveProperty('getAccessToken');
  });

  it('login method delegates to autional.login', async () => {
    const result = useAutional();
    const credentials = { email: 'test@test.com', password: 'secret' };

    await result.login(credentials as any);

    expect(mockAutional.login).toHaveBeenCalledWith(credentials);
  });

  it('logout delegates to autional.logout', async () => {
    const result = useAutional();

    await result.logout();

    expect(mockAutional.logout).toHaveBeenCalled();
  });
});

describe('getAutional', () => {
  let freshCreateAutional: typeof createAutional;
  let freshGetAutional: typeof getAutional;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('../createAutional');
    freshCreateAutional = mod.createAutional;
    freshGetAutional = mod.getAutional;
  });

  it('returns null before createAutional', () => {
    expect(freshGetAutional()).toBeNull();
  });

  it('returns instance after createAutional', () => {
    freshCreateAutional({ appId: 'test', issuer: 'https://auth.example.com' });

    expect(freshGetAutional()).not.toBeNull();
  });
});

describe('autionalGuard', () => {
  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('../createAutional');
    mod.createAutional({ appId: 'test', issuer: 'https://auth.example.com' });
  });

  it('returns a function for router use', () => {
    const guard = autionalGuard();

    expect(typeof guard).toBe('function');
  });
});
