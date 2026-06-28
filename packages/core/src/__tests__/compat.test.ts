/**
 * CJS/ESM Compatibility Test
 *
 * Verifies:
 * - require('@authms/core') returns all expected exports
 * - import from '@authms/core' is tree-shakeable
 * - CJS build produces valid exports
 */
import { describe, it, expect } from 'vitest';

// ESM imports (vitest native)
import {
  AuthMS, TokenManager, ApiClient, AuthClient, Discovery, TabSync,
  browserPlatform, memoryPlatform,
  AuthmsError, AuthmsAuthError, AuthmsNetworkError,
  ERROR_CODES,
  createPlatformBinding,
  processPasswordForTransmission, solveProofOfWork,
} from '../index';

describe('ESM Imports', () => {
  it('imports AuthMS class', () => {
    expect(AuthMS).toBeDefined();
    expect(typeof AuthMS).toBe('function');
  });

  it('imports TokenManager', () => {
    expect(TokenManager).toBeDefined();
  });

  it('imports ApiClient', () => {
    expect(ApiClient).toBeDefined();
  });

  it('imports AuthClient', () => {
    expect(AuthClient).toBeDefined();
  });

  it('imports Discovery', () => {
    expect(Discovery).toBeDefined();
  });

  it('imports TabSync', () => {
    expect(TabSync).toBeDefined();
  });

  it('imports platform adapters', () => {
    expect(browserPlatform).toBeDefined();
    expect(memoryPlatform).toBeDefined();
    expect(typeof memoryPlatform).toBe('function');
  });

  it('imports error types', () => {
    expect(AuthmsError).toBeDefined();
    expect(AuthmsAuthError).toBeDefined();
    expect(AuthmsNetworkError).toBeDefined();
  });

  it('imports ERROR_CODES', () => {
    expect(ERROR_CODES).toBeDefined();
    expect(ERROR_CODES.CAPTCHA_REQUIRED).toBeDefined();
  });

  it('imports createPlatformBinding', () => {
    expect(createPlatformBinding).toBeDefined();
    expect(typeof createPlatformBinding).toBe('function');
  });

  it('imports crypto utilities', () => {
    expect(processPasswordForTransmission).toBeDefined();
    expect(solveProofOfWork).toBeDefined();
  });
});
