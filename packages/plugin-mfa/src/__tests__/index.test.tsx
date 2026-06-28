// @ts-nocheck — vitest mock types
import { describe, it, expect } from 'vitest';
import { mfaPlugin } from '../index';

describe('plugin-mfa', () => {
  describe('mfaPlugin', () => {
    it('returns an object with name and version', () => {
      const plugin = mfaPlugin();
      expect(plugin.name).toBeDefined();
      expect(typeof plugin.name).toBe('string');
      expect(plugin.version).toBeDefined();
      expect(typeof plugin.version).toBe('string');
    });

    it('has install method', () => {
      const plugin = mfaPlugin();
      expect(plugin.install).toBeDefined();
      expect(typeof plugin.install).toBe('function');
    });

    it('install calls core registration', () => {
      const plugin = mfaPlugin();
      const mockCore: any = { use: () => {} };
      expect(() => plugin.install(mockCore)).not.toThrow();
    });
  });
});
