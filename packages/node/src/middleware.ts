/**
 * Autional Node.js SDK — Express / Fastify 中间件
 *
 * 服务端令牌验证。默认走「问服务端」：
 *   - userinfo：用 Bearer token 调 /oauth/api/v1/oauth/userinfo（无需客户端密钥）
 *   - introspect：调 /oauth/api/v1/oauth/introspect（需要 clientId/clientSecret，可拿到 scope）
 *   - jwks：本地验签（RS256）+ jwt-status 撤销检查；适合高流量资源服务
 *
 * 安全说明（2026-11-04）：旧实现只做 base64 解码 + 本地 exp 判断，不验签、不校验
 * iss/aud —— 任何自造 token 都能通过。现在默认改为服务端验证；`decode-only` 仅供
 * 本地调试，必须显式开启，且注入的 user 会标记 unverified。
 */

import { createPublicKey, verify as cryptoVerify, type KeyObject } from 'node:crypto';
import { wellKnownURL } from './wellknown';

export type VerifyMode = 'userinfo' | 'introspect' | 'jwks' | 'decode-only';

export interface NodeAutionalConfig {
  issuer: string;
  apiUrl?: string;
  appId?: string;
  /** 排除路径（不验证 token） */
  exclude?: string[];
  /** 验证方式，默认 userinfo */
  verify?: VerifyMode;
  /** introspect 模式必填 */
  clientId?: string;
  clientSecret?: string;
  /** jwks 模式：JWKS URL（默认为 `${apiUrl||issuer}` 的 **origin** + `/.well-known/jwks.json`，路径前缀会被剥离） */
  jwksUrl?: string;
  /** jwks 模式：status URL（默认同上，挂 origin 根） */
  statusUrl?: string;
  /** jwks 模式：允许的 issuer（默认 [issuer]） */
  allowedIssuers?: string[];
  /** jwks 模式：允许的 audience（默认 [appId]；为空则不校验 aud） */
  audience?: string[];
  /** jwks 缓存（毫秒），默认 300000 */
  jwksTtlMs?: number;
  /** 单次验证超时（毫秒），默认 3000 */
  timeoutMs?: number;
  /** 验证结果缓存（毫秒），默认 15000；0 关闭 */
  cacheTtlMs?: number;
}

export interface VerifiedUser {
  id: string;
  tenantId?: string;
  scope?: string;
  /** decode-only 模式下为 false */
  verified: boolean;
  [key: string]: unknown;
}

interface CacheEntry {
  user: VerifiedUser;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_MAX = 2000;

function configCacheKey(config: NodeAutionalConfig): string {
  const aud = config.audience?.length ? config.audience.join(',') : config.appId ?? '';
  return `${config.issuer}|${config.jwksUrl ?? ''}|${config.statusUrl ?? ''}|${aud}`;
}

function baseUrl(config: NodeAutionalConfig): string {
  return (config.apiUrl || config.issuer).replace(/\/+$/, '');
}

function withTimeout(ms: number): { signal: AbortSignal; cancel: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

async function verifyWithUserinfo(config: NodeAutionalConfig, token: string): Promise<VerifiedUser | null> {
  const { signal, cancel } = withTimeout(config.timeoutMs ?? 3000);
  try {
    const res = await fetch(`${baseUrl(config)}/oauth/api/v1/oauth/userinfo`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    const sub = typeof data.sub === 'string' ? data.sub : '';
    if (!sub) return null;
    return {
      id: sub,
      tenantId: typeof data.tenant_id === 'string' ? data.tenant_id : undefined,
      verified: true,
      ...data,
    };
  } finally {
    cancel();
  }
}

async function verifyWithIntrospect(config: NodeAutionalConfig, token: string): Promise<VerifiedUser | null> {
  if (!config.clientId || !config.clientSecret) {
    throw new Error('verify="introspect" requires clientId and clientSecret');
  }
  const { signal, cancel } = withTimeout(config.timeoutMs ?? 3000);
  try {
    const body = new URLSearchParams({
      token,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    });
    const res = await fetch(`${baseUrl(config)}/oauth/api/v1/oauth/introspect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: body.toString(),
      signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    if (data.active !== true) return null;
    const sub = typeof data.sub === 'string' ? data.sub : '';
    if (!sub) return null;
    return {
      id: sub,
      tenantId:
        (typeof data.tenant_id === 'string' && data.tenant_id) ||
        (typeof data.tenantId === 'string' && data.tenantId) ||
        undefined,
      scope: typeof data.scope === 'string' ? data.scope : undefined,
      verified: true,
    };
  } finally {
    cancel();
  }
}

interface JWKSState {
  keys: Map<string, KeyObject>;
  fetchedAt: number;
}

const jwksCache = new Map<string, JWKSState>();
const jwksInflight = new Map<string, Promise<JWKSState | null>>();

interface StatusState {
  revoked: Set<string>;
  requireKidAfter: number;
  version: number;
  fetchedAt: number;
}

const statusCache = new Map<string, StatusState>();
const statusInflight = new Map<string, Promise<StatusState | null>>();

async function fetchJSON(url: string, timeoutMs: number): Promise<Record<string, unknown> | null> {
  const { signal, cancel } = withTimeout(timeoutMs);
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' }, signal });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } finally {
    cancel();
  }
}

async function getJWKS(config: NodeAutionalConfig, force = false): Promise<JWKSState | null> {
  const key = configCacheKey(config);
  const ttl = config.jwksTtlMs ?? 300_000;
  const cached = jwksCache.get(key);
  if (!force && cached && Date.now() - cached.fetchedAt < ttl) return cached;
  const inflight = jwksInflight.get(key);
  if (inflight) return inflight;

  const p = (async () => {
    // `.well-known` 恒在 origin 根：apiUrl 可能带 /bff 前缀（脚手架默认），
    // 直接拼会 404 → 所有受保护请求恒 401。见 wellknown.ts。
    const url = config.jwksUrl || wellKnownURL(baseUrl(config), '/.well-known/jwks.json');
    const body = await fetchJSON(url, config.timeoutMs ?? 3000);
    const prev = jwksCache.get(key) ?? null;
    if (!body || !Array.isArray(body.keys)) return prev;
    const keys = new Map<string, KeyObject>();
    for (const raw of body.keys as Array<Record<string, unknown>>) {
      if (raw.kty !== 'RSA' || typeof raw.kid !== 'string') continue;
      try {
        keys.set(raw.kid, createPublicKey({ key: raw as never, format: 'jwk' }));
      } catch {
        // Ignore malformed keys; fail closed if none remain.
      }
    }
    if (keys.size === 0) return prev;
    const next = { keys, fetchedAt: Date.now() };
    jwksCache.set(key, next);
    return next;
  })().finally(() => {
    jwksInflight.delete(key);
  });
  jwksInflight.set(key, p);
  return p;
}

async function getStatus(config: NodeAutionalConfig): Promise<StatusState | null> {
  const key = configCacheKey(config);
  const ttl = 10_000;
  const cached = statusCache.get(key);
  if (cached && Date.now() - cached.fetchedAt < ttl) return cached;
  const inflight = statusInflight.get(key);
  if (inflight) return inflight;

  const p = (async () => {
    const url = config.statusUrl || wellKnownURL(baseUrl(config), '/.well-known/jwt-status.json');
    const body = await fetchJSON(url, config.timeoutMs ?? 3000);
    const prev = statusCache.get(key) ?? null;
    if (!body) return prev;
    const version = typeof body.version === 'number' ? body.version : 0;
    // Reject version rollback (cache replay).
    if (prev && version < prev.version) return prev;
    const revoked = new Set<string>();
    if (Array.isArray(body.revoked_kids)) {
      for (const item of body.revoked_kids as Array<Record<string, unknown>>) {
        if (typeof item.kid === 'string') revoked.add(item.kid);
      }
    }
    const next = {
      revoked,
      requireKidAfter: typeof body.require_kid_after === 'number' ? body.require_kid_after : 0,
      version,
      fetchedAt: Date.now(),
    };
    statusCache.set(key, next);
    return next;
  })().finally(() => {
    statusInflight.delete(key);
  });
  statusInflight.set(key, p);
  return p;
}

function asStringArray(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  return [];
}

async function verifyWithJWKS(config: NodeAutionalConfig, token: string): Promise<VerifiedUser | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;
  try {
    header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8')) as Record<string, unknown>;
    payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as Record<string, unknown>;
  } catch {
    return null;
  }

  const alg = typeof header.alg === 'string' ? header.alg : '';
  if (alg !== 'RS256') return null;
  const typ = typeof header.typ === 'string' ? header.typ : '';
  if (typ && typ !== 'JWT' && typ !== 'at+jwt') return null;

  const kid = typeof header.kid === 'string' ? header.kid : '';
  const status = await getStatus(config);
  if (!status) return null; // fail closed: status is authoritative for revocation
  if (kid && status.revoked.has(kid)) return null;
  if (!kid && status.requireKidAfter > 0 && Math.floor(Date.now() / 1000) >= status.requireKidAfter) return null;

  let jwks = await getJWKS(config);
  if (!jwks) return null;
  let key = kid ? jwks.keys.get(kid) : jwks.keys.size === 1 ? [...jwks.keys.values()][0] : undefined;
  // G4：未知 kid 强制重取一次 JWKS（绕过 TTL），覆盖轮换窗口。
  if (!key && kid) {
    jwks = await getJWKS(config, true);
    if (!jwks) return null;
    key = jwks.keys.get(kid);
  }
  if (!key) return null;

  const signingInput = Buffer.from(`${parts[0]}.${parts[1]}`);
  const signature = Buffer.from(parts[2], 'base64url');
  if (!cryptoVerify('RSA-SHA256', signingInput, key, signature)) return null;

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp <= now) return null;
  if (typeof payload.nbf === 'number' && payload.nbf > now + 30) return null;
  if (payload.type !== 'access') return null;

  const iss = typeof payload.iss === 'string' ? payload.iss : '';
  const allowedIssuers = config.allowedIssuers?.length ? config.allowedIssuers : [config.issuer];
  if (!iss || !allowedIssuers.includes(iss)) return null;

  const allowedAud = config.audience?.length ? config.audience : config.appId ? [config.appId] : [];
  if (allowedAud.length) {
    const aud = asStringArray(payload.aud);
    if (!aud.some((a) => allowedAud.includes(a))) return null;
  }

  const sub =
    (typeof payload.sub === 'string' && payload.sub) ||
    (typeof payload.user_id === 'string' && payload.user_id) ||
    '';
  if (!sub) return null;

  return {
    id: sub,
    tenantId: typeof payload.tenant_id === 'string' ? payload.tenant_id : undefined,
    scope: typeof payload.scope === 'string' ? payload.scope : undefined,
    verified: true,
    aid: typeof payload.aid === 'string' ? payload.aid : undefined,
    ...payload,
  };
}

function decodeOnly(token: string): VerifiedUser | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as Record<string, unknown>;
    if (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) return null;
    const sub = (typeof payload.sub === 'string' && payload.sub) || (typeof payload.user_id === 'string' && payload.user_id) || '';
    if (!sub) return null;
    return { id: sub, tenantId: typeof payload.tenant_id === 'string' ? payload.tenant_id : undefined, verified: false };
  } catch {
    return null;
  }
}

/** 验证 Bearer token；返回 null 表示无效。 */
export async function verifyToken(config: NodeAutionalConfig, token: string): Promise<VerifiedUser | null> {
  const ttl = config.cacheTtlMs ?? 15000;
  const now = Date.now();
  const cacheKey = `${configCacheKey(config)}|${token}`;

  if (ttl > 0) {
    const hit = cache.get(cacheKey);
    if (hit && hit.expiresAt > now) return hit.user;
    if (hit) cache.delete(cacheKey);
  }

  let user: VerifiedUser | null;
  switch (config.verify ?? 'userinfo') {
    case 'introspect':
      user = await verifyWithIntrospect(config, token);
      break;
    case 'jwks':
      user = await verifyWithJWKS(config, token);
      break;
    case 'decode-only':
      user = decodeOnly(token);
      break;
    case 'userinfo':
    default:
      user = await verifyWithUserinfo(config, token);
      break;
  }

  if (user && ttl > 0) {
    if (cache.size >= CACHE_MAX) cache.clear();
    cache.set(cacheKey, { user, expiresAt: now + ttl });
  }
  return user;
}

function extractBearer(header: unknown): string | null {
  if (typeof header !== 'string') return null;
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

async function handle(config: NodeAutionalConfig, token: string | null): Promise<VerifiedUser | null> {
  if (!token) return null;
  try {
    return await verifyToken(config, token);
  } catch {
    return null;
  }
}

/**
 * Express 中间件——验证 Bearer token 并注入 req.user
 */
export function autionalExpress(config: NodeAutionalConfig) {
  return async (req: any, res: any, next: any) => {
    if (config.exclude?.some((p: string) => req.path?.startsWith(p))) {
      return next();
    }

    const user = await handle(config, extractBearer(req.headers?.authorization));
    if (req.headers?.authorization && !user) {
      return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  };
}

/**
 * Fastify 插件——验证 Bearer token 并注入 request.user
 */
export function autionalFastify(fastify: any, config: NodeAutionalConfig, done: any) {
  fastify.decorateRequest('user', null);

  fastify.addHook('onRequest', async (request: any, reply: any) => {
    if (config.exclude?.some((p: string) => request.url?.startsWith(p))) {
      return;
    }

    const user = await handle(config, extractBearer(request.headers?.authorization));
    if (request.headers?.authorization && !user) {
      return reply.code(401).send({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
    }
    request.user = user;
  });

  done();
}

/** 获取当前用户信息（Express） */
export function getUser(req: any): VerifiedUser | null {
  return req.user || null;
}
