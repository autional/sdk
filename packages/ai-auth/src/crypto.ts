/** WebCrypto helpers shared by Cloudflare Workers, Vercel Edge and Node 20+. */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function utf8(value: string): Uint8Array {
  return encoder.encode(value);
}

export function fromUtf8(value: Uint8Array): string {
  return decoder.decode(value);
}

export function randomBytes(length: number): Uint8Array {
  const out = new Uint8Array(length);
  crypto.getRandomValues(out);
  return out;
}

export function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}

export function base64UrlDecode(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
  return out;
}

export function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

/** Constant-time comparison for short secrets (state, nonce). */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function sha256(value: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', value as BufferSource));
}

export async function sha256Base64Url(value: string): Promise<string> {
  return base64UrlEncode(await sha256(utf8(value)));
}

async function aesKey(secret: string): Promise<CryptoKey> {
  const digest = await sha256(utf8(secret));
  return crypto.subtle.importKey('raw', digest as BufferSource, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

/** AES-256-GCM encrypt JSON; returns base64url(iv || ciphertext || tag). */
export async function encryptJson(secret: string, value: unknown): Promise<string> {
  const key = await aesKey(secret);
  const iv = randomBytes(12);
  const plaintext = utf8(JSON.stringify(value));
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, plaintext as BufferSource),
  );
  return base64UrlEncode(concatBytes(iv, ciphertext));
}

/** AES-256-GCM decrypt; returns null on malformed/tampered input. */
export async function decryptJson<T>(secret: string, value: string): Promise<T | null> {
  try {
    const bytes = base64UrlDecode(value);
    if (bytes.length < 12 + 16) return null;
    const key = await aesKey(secret);
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: bytes.slice(0, 12) as BufferSource },
      key,
      bytes.slice(12) as BufferSource,
    );
    return JSON.parse(fromUtf8(new Uint8Array(plaintext))) as T;
  } catch {
    return null;
  }
}

/** RSASSA-PKCS1-v1_5/SHA-256 verify for RS256 JWT signatures. */
export async function verifyRs256(jwk: JsonWebKey, signingInput: Uint8Array, signature: Uint8Array): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    return await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature as BufferSource, signingInput as BufferSource);
  } catch {
    return false;
  }
}

/** Import a PKCS#8 RSA private key for RS256 signing (internal JWTs). */
export async function importRs256PrivateKey(pem: string): Promise<CryptoKey> {
  const body = pem
    .replace(/-----BEGIN [^-]+-----/gu, '')
    .replace(/-----END [^-]+-----/gu, '')
    .replace(/\s+/gu, '');
  const der = base64UrlDecode(body.replace(/\+/g, '-').replace(/\//g, '_'));
  return crypto.subtle.importKey(
    'pkcs8',
    der as BufferSource,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
}

export async function signRs256(key: CryptoKey, signingInput: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, signingInput as BufferSource));
}
