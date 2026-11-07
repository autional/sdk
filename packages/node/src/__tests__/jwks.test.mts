import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';

import {
  audienceMatches,
  getJwksKeys,
  resolveAudiences,
  resolveSigningKey,
  type JwksFetchOptions,
} from '../jwks.ts';

const JWKS_URL = 'https://api.example.test/.well-known/jwks.json';

function rsaJwk(kid: string): Record<string, unknown> {
  const { publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const jwk = publicKey.export({ format: 'jwk' }) as Record<string, unknown>;
  return { ...jwk, kid, use: 'sig', alg: 'RS256' };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

interface FetchProbe {
  /** 已发生的 JWKS 请求次数 */
  readonly calls: number;
}

/**
 * 安装按调用次序返回不同 keyset 的 fetch 桩：
 * `script[n]` 是第 n 次请求（从 0 开始）返回的 keyset；越界时沿用最后一个。
 */
function installFetch(
  t: { after: (fn: () => void) => void },
  script: Array<Array<Record<string, unknown>>>,
): FetchProbe {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    const keys = script[Math.min(calls, script.length - 1)];
    calls += 1;
    return jsonResponse({ keys });
  }) as typeof globalThis.fetch;
  t.after(() => {
    globalThis.fetch = original;
  });
  return {
    get calls() {
      return calls;
    },
  };
}

const baseOpts = (): JwksFetchOptions => ({ url: JWKS_URL, ttlMs: 300_000 });

// ---------------------------------------------------------------- G4

test('G4：未知 kid 触发一次强制重取（绕过 TTL），随后可验签', async (t) => {
  const k1 = rsaJwk('k1');
  const k2 = rsaJwk('k2');
  const probe = installFetch(t, [[k1], [k1, k2]]);
  const opts = baseOpts();
  const cacheKey = 'g4-force-once';

  // 预热缓存（只含 k1）
  assert.ok(await resolveSigningKey(cacheKey, opts, 'k1'));
  assert.equal(probe.calls, 1);

  // k2 未知 → 立即重取一次，拿到新键
  assert.ok(await resolveSigningKey(cacheKey, opts, 'k2'));
  assert.equal(probe.calls, 2);
});

test('G4：限频窗内第二个未知 kid 不再强制重取（fail closed）', async (t) => {
  const k1 = rsaJwk('k1');
  const k2 = rsaJwk('k2');
  // 服务端始终只有 k1：k2 触发的 force 也拿不到键
  const probe = installFetch(t, [[k1], [k1]]);
  const opts = baseOpts();
  const cacheKey = 'g4-cooldown';

  assert.ok(await resolveSigningKey(cacheKey, opts, 'k1'));
  assert.equal(probe.calls, 1);

  assert.equal(await resolveSigningKey(cacheKey, opts, 'k2'), null);
  assert.equal(probe.calls, 2, '第一个未知 kid 应强制重取一次');

  // 60s 限频窗内：k3 未知也不再打 JWKS 端点
  assert.equal(await resolveSigningKey(cacheKey, opts, 'k3'), null);
  assert.equal(probe.calls, 2, '窗内不得重复 force');
});

test('G4：forceCooldownMs=0 时每次未知 kid 都可重取（限频可配）', async (t) => {
  const k1 = rsaJwk('k1');
  const k2 = rsaJwk('k2');
  const probe = installFetch(t, [[k1], [k1], [k1, k2]]);
  const opts: JwksFetchOptions = { ...baseOpts(), forceCooldownMs: 0 };
  const cacheKey = 'g4-no-cooldown';

  assert.ok(await resolveSigningKey(cacheKey, opts, 'k1'));
  assert.equal(await resolveSigningKey(cacheKey, opts, 'k2'), null); // force 1，未拿到
  assert.ok(await resolveSigningKey(cacheKey, opts, 'k2')); // force 2，拿到
  assert.equal(probe.calls, 3);
});

test('G4：强制重取失败时保留旧 keyset（旧 kid 仍可验、未知 kid fail closed）', async (t) => {
  const k1 = rsaJwk('k1');
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    calls += 1;
    if (calls === 1) return jsonResponse({ keys: [k1] });
    return jsonResponse({ error: 'unavailable' }, 503);
  }) as typeof globalThis.fetch;
  t.after(() => {
    globalThis.fetch = original;
  });

  const opts = baseOpts();
  const cacheKey = 'g4-fail-keeps-prev';
  assert.ok(await resolveSigningKey(cacheKey, opts, 'k1'));

  assert.equal(await resolveSigningKey(cacheKey, opts, 'k2'), null);
  assert.equal(calls, 2);
  // 旧 keyset 未被清空
  assert.ok(await resolveSigningKey(cacheKey, opts, 'k1'));
  assert.equal(calls, 2);
});

test('G4：并发取键走 singleflight（只打一次 JWKS）', async (t) => {
  const k1 = rsaJwk('k1');
  const original = globalThis.fetch;
  let calls = 0;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  globalThis.fetch = (async () => {
    calls += 1;
    await gate;
    return jsonResponse({ keys: [k1] });
  }) as typeof globalThis.fetch;
  t.after(() => {
    globalThis.fetch = original;
  });

  const opts = baseOpts();
  const cacheKey = 'g4-singleflight';
  const p1 = getJwksKeys(cacheKey, opts);
  const p2 = getJwksKeys(cacheKey, opts);
  release();
  const [a, b] = await Promise.all([p1, p2]);

  assert.equal(calls, 1);
  assert.equal(a, b, '并发调用应共享同一个 keyset 对象');
});

// ---------------------------------------------------------------- G5

test('G5：显式 audience 优先，并做空白/尾斜杠归一化', () => {
  assert.deepEqual(
    resolveAudiences({
      issuer: 'https://api.autional.cn',
      appId: 'app_1',
      audience: [' https://api.autional.cn/ ', 'https://cdn.example'],
    }),
    ['https://api.autional.cn', 'https://cdn.example'],
  );
});

test('G5：未配置 audience 时回退 issuer / origin 根域 / appId', () => {
  assert.deepEqual(resolveAudiences({ issuer: 'https://api.autional.cn' }), [
    'https://api.autional.cn',
  ]);
  // 平台资源是 issuer 的根域（issuer 可能带 /oauth 等路径）
  assert.deepEqual(resolveAudiences({ issuer: 'https://api.autional.cn/oauth' }), [
    'https://api.autional.cn/oauth',
    'https://api.autional.cn',
  ]);
  // 兼容旧配置：aud = appId
  assert.deepEqual(resolveAudiences({ issuer: 'https://api.autional.cn', appId: 'app_1' }), [
    'https://api.autional.cn',
    'app_1',
  ]);
});

test('G5：完全没配置时 fail closed（不接受任意 aud）', () => {
  assert.deepEqual(resolveAudiences({ issuer: '' }), []);
  assert.equal(audienceMatches('anything', []), false);
  assert.equal(audienceMatches(undefined, []), false);
});

test('G5：aud 命中/未命中（字符串与数组两种形态）', () => {
  const allowed = resolveAudiences({ issuer: 'https://api.autional.cn' });
  assert.equal(audienceMatches('https://api.autional.cn', allowed), true);
  assert.equal(audienceMatches(['https://api.autional.cn/'], allowed), true);
  assert.equal(audienceMatches('app_1', allowed), false);
  assert.equal(audienceMatches(undefined, allowed), false);
  assert.equal(audienceMatches(123, allowed), false);
});
