import { describe, it, expect, beforeEach } from 'vitest';
import { processPasswordForTransmission } from '../crypto/password-transmission';
import type { KeyExchangeFn } from '../crypto/password-transmission';
import type { PasswordPolicyConfig } from '../types';

const mockKeyExchange: KeyExchangeFn = async () => {
  const kp = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const pubRaw = await crypto.subtle.exportKey('raw', kp.publicKey);
  return { serverPubKey: btoa(String.fromCharCode(...new Uint8Array(pubRaw))), keyExchangeId: 'ke_123' };
};

async function generateRsaPublicKeyPEM(): Promise<string> {
  const kp = await crypto.subtle.generateKey(
    { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['encrypt', 'decrypt'],
  );
  const spki = await crypto.subtle.exportKey('spki', kp.publicKey);
  const b64 = btoa(String.fromCharCode(...new Uint8Array(spki)));
  const lines = b64.match(/.{1,64}/g) ?? [];
  return `-----BEGIN PUBLIC KEY-----\n${lines.join('\n')}\n-----END PUBLIC KEY-----`;
}

function createPolicy(overrides: Partial<PasswordPolicyConfig> = {}): PasswordPolicyConfig {
  return {
    mode: 'plain',
    minLength: 8,
    requireUpper: true,
    tenantId: 'tenant-1',
    publicKey: '',
    ...overrides,
  };
}

describe('processPasswordForTransmission', () => {
  let rawPassword: string;

  beforeEach(() => {
    rawPassword = 'MySecurePass123!';
  });

  it('plain mode - returns password unchanged with transmission plain', async () => {
    const policy = createPolicy({ mode: 'plain' });
    const result = await processPasswordForTransmission(rawPassword, policy);

    expect(result.password).toBe(rawPassword);
    expect(result.passwordTransmission).toBe('plain');
  });

  it('hash mode - returns SHA-256(password|tenantId) in hex with transmission hash', async () => {
    const policy = createPolicy({ mode: 'hash' });
    const result = await processPasswordForTransmission(rawPassword, policy);

    expect(result.password).not.toBe(rawPassword);
    expect(result.password.length).toBe(64);
    expect(/^[0-9a-f]{64}$/.test(result.password)).toBe(true);
    expect(result.passwordTransmission).toBe('hash');
  });

  it('hash mode with missing crypto.subtle - falls back to pure JS SHA-256', async () => {
    const originalDigest = crypto.subtle.digest;
    // Simulate missing Web Crypto API by making digest throw
    (crypto.subtle as { digest: typeof crypto.subtle.digest }).digest = () => {
      throw new Error('Not available');
    };

    const policy = createPolicy({ mode: 'hash' });
    const result = await processPasswordForTransmission(rawPassword, policy);

    crypto.subtle.digest = originalDigest;

    expect(result.password).not.toBe(rawPassword);
    expect(result.password.length).toBe(64);
    expect(/^[0-9a-f]{64}$/.test(result.password)).toBe(true);
    expect(result.passwordTransmission).toBe('hash');
  });

  it('symmetric mode - requires keyExchangeFn, throws if missing', async () => {
    const policy = createPolicy({ mode: 'symmetric' });

    await expect(
      processPasswordForTransmission(rawPassword, policy),
    ).rejects.toThrow('keyExchangeFn is required for symmetric mode');
  });

  it('symmetric mode with mock keyExchangeFn - returns encrypted result with correct transmission', async () => {
    const policy = createPolicy({ mode: 'symmetric' });
    const result = await processPasswordForTransmission(rawPassword, policy, mockKeyExchange);

    expect(result.password).not.toBe(rawPassword);
    expect(result.passwordTransmission).toBe('symmetric');
    expect(result.keyExchangeId).toBe('ke_123');
    expect(typeof result.password).toBe('string');
    expect(result.password.length).toBeGreaterThan(0);
  });

  it('asymmetric mode - requires publicKey in policy, throws if missing or too short', async () => {
    const policyMissing = createPolicy({ mode: 'asymmetric', publicKey: '' });
    await expect(
      processPasswordForTransmission(rawPassword, policyMissing),
    ).rejects.toThrow('public_key is required for asymmetric mode');

    const policyShort = createPolicy({ mode: 'asymmetric', publicKey: 'short' });
    await expect(
      processPasswordForTransmission(rawPassword, policyShort),
    ).rejects.toThrow('public_key is required for asymmetric mode');
  });

  it('asymmetric mode with valid publicKey - returns encrypted result with transmission asymmetric', async () => {
    const validPEM = await generateRsaPublicKeyPEM();
    const policy = createPolicy({ mode: 'asymmetric', publicKey: validPEM });
    const result = await processPasswordForTransmission(rawPassword, policy);

    expect(result.password).not.toBe(rawPassword);
    expect(result.passwordTransmission).toBe('asymmetric');
    expect(typeof result.password).toBe('string');
    expect(result.password.length).toBeGreaterThan(0);
  });

  it('undefined/empty mode - defaults to plain', async () => {
    const policyUndefined = createPolicy({ mode: undefined as unknown as string });
    const result1 = await processPasswordForTransmission(rawPassword, policyUndefined);
    expect(result1.password).toBe(rawPassword);
    expect(result1.passwordTransmission).toBe('plain');

    const policyEmpty = createPolicy({ mode: '' });
    const result2 = await processPasswordForTransmission(rawPassword, policyEmpty);
    expect(result2.password).toBe(rawPassword);
    expect(result2.passwordTransmission).toBe('plain');
  });
});
