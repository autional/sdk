/**
 * DPoP (RFC 9449) 客户端 —— Demonstrating Proof of Possession。
 *
 * 为发往 oauth 服务的令牌类请求附 proof JWS（typ=dpop+jwt, alg=ES256）：
 *   header {typ, alg, jwk(公开 P-256 坐标)} + payload {jti, htm, htu, iat, ath?}
 *   经 ES256 签名 → JWS compact 序列化 → DPoP 请求头。
 *
 * 密钥对（P-256）持久化于 storage，跨会话稳定 —— 刷新令牌与密钥指纹（jkt）绑定，
 * 换键会导致已绑定令牌刷新失败。不实现 nonce（服务端 dpop_nonce 可选，空则跳过）。
 *
 * 依赖 WebCrypto（crypto.subtle）：浏览器 / Node 18+ / RN 新架构可用；
 * 不可用时抛 DPOP_UNSUPPORTED（opt-in 特性，不影响未启用 DPoP 的调用方）。
 */

import type { StorageAdapter } from './platform/types';
import { AutionalError } from './errors';
import { base64UrlEncode } from './pkce';

const DPOP_STORAGE_PREFIX = 'autional_';
const KEY_STORAGE_SUFFIX = 'dpop_key';

interface DpopKey {
  privateKey: CryptoKey;
  /** 仅含 RFC 9449 允许的公开成员（crv/kty/x/y） */
  publicJwk: JsonWebKey;
}

function webCrypto(): Crypto {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (!c?.subtle || typeof TextEncoder === 'undefined' || typeof btoa === 'undefined') {
    throw new AutionalError(
      'DPOP_UNSUPPORTED',
      'DPoP requires WebCrypto (crypto.subtle) — available in browsers and Node 18+; disable AutionalConfig.dpop in this environment',
      0,
    );
  }
  return c;
}

function encodeJson(value: unknown): string {
  return base64UrlEncode(new TextEncoder().encode(JSON.stringify(value)));
}

/** RFC 9449 proof 的 jti（随机 16 字节 base64url，防重放标识） */
function randomId(): string {
  const bytes = new Uint8Array(16);
  webCrypto().getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

/** 去除 query/fragment 的完整 URL（服务端 htu 比对口径） */
function htuOf(url: string): string {
  return url.split('#')[0].split('?')[0];
}

export class DpopManager {
  private storage: StorageAdapter;
  private storageKey: string;
  private keyPromise: Promise<DpopKey> | null = null;

  constructor(storage: StorageAdapter, prefix?: string) {
    this.storage = storage;
    this.storageKey = `${prefix ?? DPOP_STORAGE_PREFIX}${KEY_STORAGE_SUFFIX}`;
  }

  /**
   * 生成一次请求的 DPoP proof（compact JWS）。
   * accessToken 非空时附加 ath = base64url(sha256(token))（服务端要求：Authorization 存在时 ath 必填）。
   */
  async createProof(method: string, url: string, accessToken?: string | null): Promise<string> {
    const subtle = webCrypto().subtle;
    const { privateKey, publicJwk } = await this.getKey();

    const payload: Record<string, unknown> = {
      jti: randomId(),
      htm: method.toUpperCase(),
      htu: htuOf(url),
      iat: Math.floor(Date.now() / 1000),
    };
    if (accessToken) {
      const digest = await subtle.digest('SHA-256', new TextEncoder().encode(accessToken));
      payload['ath'] = base64UrlEncode(new Uint8Array(digest));
    }

    const header = { typ: 'dpop+jwt', alg: 'ES256', jwk: publicJwk };
    const signingInput = `${encodeJson(header)}.${encodeJson(payload)}`;
    const signature = await subtle.sign(
      { name: 'ECDSA', hash: 'SHA-256' },
      privateKey,
      new TextEncoder().encode(signingInput),
    );
    return `${signingInput}.${base64UrlEncode(new Uint8Array(signature))}`;
  }

  /** 请求头便捷方法：返回 { DPoP: proof } */
  async proofHeaders(method: string, url: string, accessToken?: string | null): Promise<Record<string, string>> {
    return { DPoP: await this.createProof(method, url, accessToken) };
  }

  private getKey(): Promise<DpopKey> {
    if (!this.keyPromise) {
      this.keyPromise = this.loadOrCreateKey();
    }
    return this.keyPromise;
  }

  private async loadOrCreateKey(): Promise<DpopKey> {
    const subtle = webCrypto().subtle;
    let jwk = await this.loadStoredJwk();
    if (!jwk) {
      const pair = await subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
      jwk = await subtle.exportKey('jwk', pair.privateKey);
      try {
        await this.storage.setItem(this.storageKey, JSON.stringify(jwk));
      } catch {
        // 存储不可用（隐私模式/配额）→ 本次会话内存密钥；刷新页面换键，已绑定令牌将失效
      }
    }
    const privateKey = await subtle.importKey(
      'jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign'],
    );
    return {
      privateKey,
      publicJwk: { kty: 'EC', crv: 'P-256', x: jwk.x, y: jwk.y },
    };
  }

  private async loadStoredJwk(): Promise<JsonWebKey | null> {
    try {
      const raw = await this.storage.getItem(this.storageKey);
      if (!raw) return null;
      const jwk = JSON.parse(raw) as JsonWebKey;
      if (jwk.kty === 'EC' && jwk.crv === 'P-256' && jwk.d && jwk.x && jwk.y) return jwk;
      return null;
    } catch {
      return null;
    }
  }
}
