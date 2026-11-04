/**
 * Autional Node.js SDK — Express / Fastify 中间件
 *
 * 服务端令牌验证。默认走「问服务端」：
 *   - userinfo：用 Bearer token 调 /oauth/api/v1/oauth/userinfo（无需客户端密钥）
 *   - introspect：调 /oauth/api/v1/oauth/introspect（需要 clientId/clientSecret，可拿到 scope）
 *
 * 安全说明（2026-11-04）：旧实现只做 base64 解码 + 本地 exp 判断，不验签、不校验
 * iss/aud —— 任何自造 token 都能通过。现在默认改为服务端验证；`decode-only` 仅供
 * 本地调试，必须显式开启，且注入的 user 会标记 unverified。
 */

export type VerifyMode = 'userinfo' | 'introspect' | 'decode-only';

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

  if (ttl > 0) {
    const hit = cache.get(token);
    if (hit && hit.expiresAt > now) return hit.user;
    if (hit) cache.delete(token);
  }

  let user: VerifiedUser | null;
  switch (config.verify ?? 'userinfo') {
    case 'introspect':
      user = await verifyWithIntrospect(config, token);
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
    cache.set(token, { user, expiresAt: now + ttl });
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
