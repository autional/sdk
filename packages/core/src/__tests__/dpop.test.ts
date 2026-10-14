import { describe, it, expect, afterEach, vi } from 'vitest';
import { DpopManager } from '../dpop';
import { base64UrlEncode } from '../pkce';
import type { StorageAdapter } from '../platform/types';

class MockStorage implements StorageAdapter {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
  keys() { return Array.from(this.store.keys()); }
}

function b64urlDecode(seg: string): Uint8Array {
  const b64 = seg.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 ? '='.repeat(4 - (b64.length % 4)) : '';
  const bin = atob(b64 + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

interface DecodedProof {
  header: Record<string, any>;
  payload: Record<string, any>;
  signingInput: string;
  signature: Uint8Array;
}

function decodeProof(proof: string): DecodedProof {
  const [h, p, s] = proof.split('.');
  return {
    header: JSON.parse(new TextDecoder().decode(b64urlDecode(h))),
    payload: JSON.parse(new TextDecoder().decode(b64urlDecode(p))),
    signingInput: `${h}.${p}`,
    signature: b64urlDecode(s),
  };
}

const TOKEN_URL = 'https://api.example.com/oauth/api/v1/oauth/token';

describe('DpopManager (RFC 9449)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('produces an ES256 dpop+jwt header with public-only JWK coordinates', async () => {
    const mgr = new DpopManager(new MockStorage());
    const { header } = decodeProof(await mgr.createProof('POST', TOKEN_URL));

    expect(header.typ).toBe('dpop+jwt');
    expect(header.alg).toBe('ES256');
    expect(header.jwk).toMatchObject({ kty: 'EC', crv: 'P-256' });
    expect(header.jwk.x).toBeTruthy();
    expect(header.jwk.y).toBeTruthy();
    expect(header.jwk.d).toBeUndefined();
  });

  it('payload carries jti, uppercase htm, query-stripped htu and iat', async () => {
    const mgr = new DpopManager(new MockStorage());
    const before = Math.floor(Date.now() / 1000);
    const proof = await mgr.createProof('get', 'https://api.example.com/oauth/api/v1/oauth/userinfo?foo=1#frag');
    const { payload } = decodeProof(proof);

    expect(payload.jti).toMatch(/^[A-Za-z0-9_-]{20,}$/);
    expect(payload.htm).toBe('GET');
    expect(payload.htu).toBe('https://api.example.com/oauth/api/v1/oauth/userinfo');
    expect(payload.iat).toBeGreaterThanOrEqual(before);
    expect(payload.iat).toBeLessThanOrEqual(Math.floor(Date.now() / 1000) + 1);
  });

  it('adds ath = base64url(sha256(accessToken)) only when a token is present', async () => {
    const mgr = new DpopManager(new MockStorage());
    const token = 'at-123';

    const withToken = decodeProof(await mgr.createProof('POST', TOKEN_URL, token));
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
    expect(withToken.payload.ath).toBe(base64UrlEncode(new Uint8Array(digest)));

    const withoutToken = decodeProof(await mgr.createProof('POST', TOKEN_URL));
    expect(withoutToken.payload.ath).toBeUndefined();
  });

  it('signature verifies against the embedded JWK', async () => {
    const mgr = new DpopManager(new MockStorage());
    const { header, signingInput, signature } = decodeProof(await mgr.createProof('POST', TOKEN_URL, 'at-1'));

    const publicKey = await crypto.subtle.importKey(
      'jwk',
      { kty: header.jwk.kty, crv: header.jwk.crv, x: header.jwk.x, y: header.jwk.y },
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify'],
    );
    const ok = await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      publicKey,
      signature,
      new TextEncoder().encode(signingInput),
    );
    expect(ok).toBe(true);
  });

  it('persists the P-256 key across manager instances sharing one storage', async () => {
    const storage = new MockStorage();
    const p1 = decodeProof(await new DpopManager(storage).createProof('POST', TOKEN_URL));
    const p2 = decodeProof(await new DpopManager(storage).createProof('POST', TOKEN_URL));

    expect(p2.header.jwk.x).toBe(p1.header.jwk.x);
    expect(p2.header.jwk.y).toBe(p1.header.jwk.y);
  });

  it('regenerates the key when the stored JWK is corrupt', async () => {
    const storage = new MockStorage();
    storage.setItem('autional_dpop_key', 'not-json{{{');

    const { header } = decodeProof(await new DpopManager(storage).createProof('POST', TOKEN_URL));

    expect(header.jwk.crv).toBe('P-256');
    const stored = JSON.parse(storage.getItem('autional_dpop_key')!) as Record<string, unknown>;
    expect(stored.kty).toBe('EC');
    expect(stored.d).toBeTruthy();
  });

  it('honours a custom storage prefix', async () => {
    const storage = new MockStorage();
    await new DpopManager(storage, 'myapp_').createProof('POST', TOKEN_URL);

    expect(storage.keys()).toContain('myapp_dpop_key');
    expect(storage.keys()).not.toContain('autional_dpop_key');
  });

  it('proofHeaders wraps the proof in the DPoP request header', async () => {
    const headers = await new DpopManager(new MockStorage()).proofHeaders('POST', TOKEN_URL);

    expect(Object.keys(headers)).toEqual(['DPoP']);
    expect(headers['DPoP'].split('.')).toHaveLength(3);
  });

  it('throws DPOP_UNSUPPORTED when WebCrypto is unavailable', async () => {
    vi.stubGlobal('crypto', {});
    const mgr = new DpopManager(new MockStorage());

    await expect(mgr.createProof('POST', TOKEN_URL)).rejects.toMatchObject({
      name: 'AutionalError',
      code: 'DPOP_UNSUPPORTED',
    });
  });
});
