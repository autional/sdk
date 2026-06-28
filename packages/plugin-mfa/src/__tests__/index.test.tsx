import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useState } from 'react';
import { MfaSetup, MfaGuard, BackupCodes, mfaPlugin } from '../index';

vi.mock('react', () => ({
  useState: vi.fn((initial: any) => [initial, vi.fn()]),
  useRef: vi.fn(() => ({ current: null })),
  createElement: vi.fn((tag: any, props: any, ...children: any[]) => ({ tag, props, children })),
}));

vi.mock('@authms/react', () => ({
  useAuthmsContext: vi.fn(() => ({ authms: { api: { post: vi.fn(), get: vi.fn() } } })),
}));

type VNode = { tag: string | Function; props: any; children: any[] };

function renderSnapshot(el: VNode): VNode {
  return el;
}

function findChildByTag(root: any, tag: string): any | null {
  if (!root) return null;
  if (root.tag === tag) return root;
  if (root.children) {
    for (const child of root.children) {
      if (typeof child === 'object' && child !== null) {
        const found = findChildByTag(child, tag);
        if (found) return found;
      }
    }
  }
  return null;
}

function extractText(root: any): string {
  if (typeof root === 'string') return root;
  if (!root) return '';
  let text = '';
  if (root.children) {
    for (const c of root.children) {
      text += extractText(c);
    }
  }
  return text;
}

describe('plugin-mfa', () => {
  describe('MfaSetup', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(useState).mockImplementation((initial: any) => [initial, vi.fn()]);
    });

    it('renders setup step content', () => {
      const el = renderSnapshot(MfaSetup() as any);

      const text = extractText(el);

      expect(text).toContain('Set Up Two-Factor Authentication');
    });

    it('has verify button', () => {
      let callIndex = 0;
      vi.mocked(useState).mockImplementation((initial: any) => {
        callIndex++;
        if (callIndex === 1) return ['verify', vi.fn()] as any;
        if (callIndex === 2) return [{ secret: 'TESTSECRET', qrCodeUri: 'otpauth://test', backupCodes: [] }, vi.fn()] as any;
        if (callIndex === 3) return ['', vi.fn()] as any;
        if (callIndex === 4) return [false, vi.fn()] as any;
        if (callIndex === 5) return ['', vi.fn()] as any;
        return [initial, vi.fn()] as any;
      });

      const el = renderSnapshot(MfaSetup() as any);
      const text = extractText(el);

      expect(text).toContain('Confirm');
    });
  });

  describe('BackupCodes', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(useState).mockImplementation((initial: any) => [initial, vi.fn()]);
    });

    it('renders list of codes', () => {
      const codes = ['ABC123', 'DEF456', 'GHI789'];
      const el = renderSnapshot(BackupCodes({ codes }) as any);

      const text = extractText(el);
      expect(text).toContain('ABC123');
      expect(text).toContain('DEF456');
      expect(text).toContain('GHI789');
    });

    it('includes copy button', () => {
      const codes = ['ABC123', 'DEF456'];
      const el = renderSnapshot(BackupCodes({ codes }) as any);

      const button = findChildByTag(el, 'button');
      expect(button).not.toBeNull();
      expect(extractText(button)).toContain('Copy All Codes');
    });
  });

  describe('MfaGuard', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(useState).mockImplementation((initial: any) => [initial, vi.fn()]);
    });

    it('passes through children when no MFA', () => {
      let callIndex = 0;
      vi.mocked(useState).mockImplementation((initial: any) => {
        callIndex++;
        if (callIndex === 1) return [{ enrolled: false, challenged: false }, vi.fn()] as any;
        if (callIndex === 2) return [false, vi.fn()] as any;
        return [initial, vi.fn()] as any;
      });

      const el = renderSnapshot(
        MfaGuard({ children: 'dashboard-content' as any }) as any,
      );

      const text = extractText(el);
      expect(text).toContain('dashboard-content');
    });

    it('shows challenge when MFA is enrolled', () => {
      let callIndex = 0;
      vi.mocked(useState).mockImplementation((initial: any) => {
        callIndex++;
        if (callIndex === 1) return [{ enrolled: true, challenged: false }, vi.fn()] as any;
        if (callIndex === 2) return [false, vi.fn()] as any;
        if (callIndex === 3) return ['', vi.fn()] as any;
        if (callIndex === 4) return [false, vi.fn()] as any;
        if (callIndex === 5) return ['', vi.fn()] as any;
        return [initial, vi.fn()] as any;
      });

      const el = renderSnapshot(
        MfaGuard({ children: 'dashboard-content' as any }) as any,
      );

      const text = extractText(el);
      expect(text).toContain('Two-Factor Authentication');
    });
  });

  describe('mfaPlugin', () => {
    it('returns an object with name and version', () => {
      const plugin = mfaPlugin();

      expect(plugin).toHaveProperty('name', '@authms/plugin-mfa');
      expect(plugin).toHaveProperty('version', '0.1.0');
    });

    it('has install method', () => {
      const plugin = mfaPlugin();

      expect(plugin).toHaveProperty('install');
      expect(typeof plugin.install).toBe('function');
    });
  });
});
