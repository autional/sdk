/**
 * JWKS 取用、选键与 aud 判定 —— `verify: 'jwks'` 的核心逻辑。
 *
 * 单独成模块的原因：
 *  1. 与 Express / Fastify 中间件解耦，可直接做单元测试（无需起 HTTP 服务）；
 *  2. G4（未知 kid 立即重取 + 限频）与 G5（`aud` 默认值）集中在一处，便于审计。
 *
 * 缓存语义（与中间件旧实现保持一致）：
 *  - 每个 `cacheKey`（由调用方按 `issuer|jwksUrl|statusUrl|audience` 生成）独立缓存整份 keyset；
 *  - 并发请求共享同一个 in-flight 请求（singleflight），不会放大上游流量；
 *  - 刷新失败或返回空 keyset 时保留上一版 keyset（可用性优先）；从未成功过则返回 `null`；
 *  - `force` 只绕过 TTL，不改变上述语义；同一 `cacheKey` 在限频窗内最多 force 一次。
 */

import { createPublicKey, type KeyObject } from 'node:crypto';

export interface JwksKeySet {
  keys: Map<string, KeyObject>;
  fetchedAt: number;
}

export interface JwksFetchOptions {
  /** JWKS 地址（调用方已完成 `.well-known` origin 归一） */
  url: string;
  /** 缓存 TTL（毫秒），默认 300000 */
  ttlMs?: number;
  /** 单次请求超时（毫秒），默认 3000 */
  timeoutMs?: number;
  /**
   * 强制刷新限频窗（毫秒），默认 60000。
   * 同一 `cacheKey` 在窗内最多 force 一次；`<= 0` 表示不限频（仅供测试/特殊场景）。
   */
  forceCooldownMs?: number;
}

export interface AudienceConfig {
  /** 令牌签发方（平台资源即其 origin 根域） */
  issuer: string;
  /** 兼容旧 token 的 audience（历史默认值） */
  appId?: string;
  /** 显式配置的 audience（推荐；多值白名单） */
  audience?: string[];
}

export const DEFAULT_JWKS_TTL_MS = 300_000;
export const DEFAULT_JWKS_FORCE_COOLDOWN_MS = 60_000;

/** 限频表上限：配置数量通常很小，超过时清理最旧的一半，避免无界增长。 */
const FORCE_LIMITER_MAX = 1000;

const cache = new Map<string, JwksKeySet>();
const inflight = new Map<string, Promise<JwksKeySet | null>>();
const lastForcedAt = new Map<string, number>();

async function fetchKeys(url: string, timeoutMs: number): Promise<Map<string, KeyObject> | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const body = (await res.json()) as Record<string, unknown>;
    if (!Array.isArray(body.keys)) return null;
    const keys = new Map<string, KeyObject>();
    for (const raw of body.keys as Array<Record<string, unknown>>) {
      if (raw.kty !== 'RSA' || typeof raw.kid !== 'string') continue;
      try {
        keys.set(raw.kid, createPublicKey({ key: raw as never, format: 'jwk' }));
      } catch {
        // 忽略畸形键；全部失败时按空集处理（fail closed）。
      }
    }
    return keys.size > 0 ? keys : null;
  } catch {
    // 网络 / 超时 / JSON 错误：返回 null，由上层保留旧 keyset。
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function markForced(cacheKey: string, now: number): void {
  lastForcedAt.set(cacheKey, now);
  if (lastForcedAt.size <= FORCE_LIMITER_MAX) return;
  let toDrop = Math.floor(lastForcedAt.size / 2);
  for (const key of lastForcedAt.keys()) {
    if (toDrop-- <= 0) break;
    lastForcedAt.delete(key);
  }
}

/**
 * 取 keyset。`force=true` 绕过 TTL，受同一 `cacheKey` 的限频窗约束：
 * 窗内请求退化为「缓存新鲜则直接用，否则按 TTL 语义普通刷新」。
 */
export async function getJwksKeys(
  cacheKey: string,
  opts: JwksFetchOptions,
  force = false,
): Promise<JwksKeySet | null> {
  const ttl = opts.ttlMs ?? DEFAULT_JWKS_TTL_MS;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (!force && cached && now - cached.fetchedAt < ttl) return cached;

  const running = inflight.get(cacheKey);
  if (running) return running;

  let bypassTtl = force;
  if (bypassTtl) {
    const cooldown = opts.forceCooldownMs ?? DEFAULT_JWKS_FORCE_COOLDOWN_MS;
    const last = lastForcedAt.get(cacheKey) ?? 0;
    if (cooldown > 0 && now - last < cooldown) {
      // 限频窗内不再强制刷新。缓存仍新鲜 → 直接使用；已过期 → 交给普通刷新路径。
      if (cached && now - cached.fetchedAt < ttl) return cached;
      bypassTtl = false;
    }
  }
  if (bypassTtl) markForced(cacheKey, now);

  const pending = (async () => {
    const fetched = await fetchKeys(opts.url, opts.timeoutMs ?? 3000);
    if (!fetched) return cache.get(cacheKey) ?? null;
    // 每次刷新整份替换 key set（不合并旧键）：被撤下的 kid 不再可验。
    const next: JwksKeySet = { keys: fetched, fetchedAt: Date.now() };
    cache.set(cacheKey, next);
    return next;
  })().finally(() => {
    inflight.delete(cacheKey);
  });
  inflight.set(cacheKey, pending);
  return pending;
}

/** 按 kid 选键；无 kid 时仅在 keyset 恰好一把键的情况下可用，多键不猜（fail closed）。 */
export function selectSigningKey(set: JwksKeySet | null | undefined, kid: string): KeyObject | null {
  if (!set) return null;
  if (kid) return set.keys.get(kid) ?? null;
  if (set.keys.size === 1) return set.keys.values().next().value ?? null;
  return null;
}

/**
 * 解析签名公钥（G4）：先查缓存/按 TTL 取；未知 kid 时**立即重取一次**（绕过 TTL），
 * 再按 kid 选键；仍无键则返回 `null`（fail closed）。
 *
 * 强制重取受 `forceCooldownMs` 限频：同一 `cacheKey` 在窗内最多一次，
 * 防止伪造 kid 把 JWKS 端点打成放大攻击入口。
 */
export async function resolveSigningKey(
  cacheKey: string,
  opts: JwksFetchOptions,
  kid: string,
): Promise<KeyObject | null> {
  const first = await getJwksKeys(cacheKey, opts);
  if (!first) return null;
  const hit = selectSigningKey(first, kid);
  if (hit) return hit;
  if (!kid) return null;

  const refreshed = await getJwksKeys(cacheKey, opts, true);
  return selectSigningKey(refreshed, kid);
}

/** 归一化 audience：去空白与尾斜杠（`https://api.x/` 与 `https://api.x` 视为同一资源）。 */
export function normalizeAudience(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

/**
 * 计算允许的 audience 白名单（G5）。
 *
 * 优先级：
 *  1. 显式配置 `audience`（**推荐**）—— 原样使用，做空白/尾斜杠归一化；
 *  2. 否则回退 `issuer` 本身 + 其 origin 根域（平台资源形如 `https://api.<root>`，
 *     issuer 可能带 `/oauth` 等路径）；
 *  3. 再兼容旧配置的 `appId`（历史默认 `aud = [appId]`）。
 *
 * 返回空数组表示「没有任何可接受值」，调用方必须 fail closed，
 * **不得**把空白名单解释为「跳过 aud 校验」。
 */
export function resolveAudiences(config: AudienceConfig): string[] {
  const explicit = (config.audience ?? []).map(normalizeAudience);
  if (explicit.some(Boolean)) return unique(explicit);

  const out: string[] = [];
  const issuer = normalizeAudience(config.issuer ?? '');
  if (issuer) {
    out.push(issuer);
    try {
      const origin = new URL(issuer).origin;
      if (origin) out.push(origin);
    } catch {
      // 非绝对 URL：不臆造 origin，只保留原值。
    }
  }
  const appId = (config.appId ?? '').trim();
  if (appId) out.push(appId);
  return unique(out);
}

/**
 * 判断 token 的 `aud`（字符串或数组）是否命中白名单。
 * 白名单为空时返回 `false`（fail closed），不会退化为「任何 aud 都接受」。
 */
export function audienceMatches(tokenAud: unknown, allowed: string[]): boolean {
  const normalized = unique(allowed.map(normalizeAudience));
  if (normalized.length === 0) return false;
  const values = Array.isArray(tokenAud) ? tokenAud : [tokenAud];
  return values.some(
    (value) => typeof value === 'string' && normalized.includes(normalizeAudience(value)),
  );
}
