<!-- lang:en -->
# Backend request verification

> Reference file for the Autional Onboarding skill.
> Read it when the app stores user data on a server.
> A front-end guard is UX; this file defines the security boundary.
<!-- /lang:en -->
<!-- lang:zh -->
# 服务端请求认证

> Autional 接入 Skill 的引用文件。
> 服务端保存用户数据时阅读。
> 前端守卫只改善体验；本文件定义安全边界。
<!-- /lang:zh -->

<!-- lang:en -->
## Contract

**Server**

1. Read `Authorization: Bearer <token>`.
2. Decode `exp`; reject expired tokens without a network call.
3. Validate with `GET {{API_URL}}/identity/api/v1/auth/me` → `{ data: { id } }` (or `userinfo` → `sub`). High-traffic resource servers may instead use `{{NPM_SCOPE}}/node` `verify: 'jwks'` (optional, conditional — see below).
4. Owner key: the app's own user id (linked via `external_identities`), or `data.id` when there is no user table. Never email.
5. Invalid/expired → 401 · `entry_plane`/claims mismatch → 403 (do not refresh) · 5xx → 503.
6. Cache positive results ≤60s; clear on logout/delete.

**Client**

On 401 refresh once (single-flight, Web Lock) and retry; on 403 do not retry.
<!-- /lang:en -->
<!-- lang:zh -->
## 契约

**服务端**

1. 读取 `Authorization: Bearer <token>`。
2. 解码 `exp`；过期直接拒绝，不打网络。
3. 用 `GET {{API_URL}}/identity/api/v1/auth/me` 校验 → `{ data: { id } }`（或 `userinfo` → `sub`）。高流量资源服务可改用 `{{NPM_SCOPE}}/node` `verify: 'jwks'`（可选、有条件——见下）。
4. owner key：应用自己的 user id（经 `external_identities` 关联），没有用户表时用 `data.id`。**不要用邮箱**。
5. 无效/过期 → 401 · `entry_plane`/claims 不匹配 → 403（不刷新）· 5xx → 503。
6. 正结果缓存 ≤60 秒；登出/删号时清缓存。

**客户端**

401 时刷新一次（单飞 + Web Lock）并重试；403 不重试。
<!-- /lang:zh -->

<!-- lang:en -->
## JWKS verification (optional, conditional)

Since 2026-11-07 access tokens carry `kid`, and `{{ISSUER}}/.well-known/jwks.json` publishes
the signing keys. JWKS is therefore usable — as an **optional high-performance path**, not the
default. The default stays `userinfo`; `introspect` and `/me` remain authoritative for revocation.

Use `{{NPM_SCOPE}}/node` `verify: 'jwks'` (≥0.5) if you need local verification: it does RS256
verification plus a `/.well-known/jwt-status.json` revocation check. Pass `appId` (audience) and
keep `issuer`; the JWKS/status URLs hang off the API **origin** (`/bff` prefixes are stripped).
Key rotation is server-side (platform `reload`); clients need no redeploy — an unknown `kid`
triggers a refetch.

If you verify JWTs yourself, enforce **all** of:

1. `alg` allowlist = `RS256` (never `none`; never HS256 with a public key).
2. Select the key by `kid` from the fixed JWKS URL; an unknown `kid` → refetch once (rate-limited),
   then fail closed. Tokens without `kid` are only acceptable while the status document allows it.
3. `type === 'access'` (reject id_token / refresh_token confusion).
4. `iss` ∈ an explicit allowlist taken from discovery; `aud` contains your app id; header `typ` ∈
   {`JWT`, `at+jwt`}; `exp` valid (and `nbf` with small skew).
5. Cache the key set (≤5 min) and verification results (≤15 s); never share a cache across
   issuers/apps. Do not trust `jku` / `x5u` / embedded keys, and never hard-code a public key.

Sensitive operations (account deletion, password/credential change, admin or payment actions) must
still call `/me` or introspect on every request — local verification cannot see a token/session
revocation immediately.

Do not hard-code `iss`: it can vary by region/flow (SAML unifies to identity-service). Take it from
discovery or the region config and validate it, instead of assuming another region's value.

**Revocation SLO**: internal verifiers ≤60 s; official SDK worst case ≈55 s (oauth keyset 30 s +
jwt-status 10 s + result cache 15 s); external apps are bounded by their own cache — keep it short
for sensitive paths.
<!-- /lang:en -->
<!-- lang:zh -->
## JWKS 验签（可选、有条件）

自 2026-11-07 起 access token 带 `kid`，`{{ISSUER}}/.well-known/jwks.json` 也发布签名公钥。
因此 JWKS **可用**——但它是**可选的高性能路径**，不是默认。默认仍是 `userinfo`；
`introspect` 与 `/me` 仍是撤销判断的权威来源。

需要本地验签时用 `{{NPM_SCOPE}}/node` 的 `verify: 'jwks'`（≥0.5）：本地 RS256 验签 +
`/.well-known/jwt-status.json` 撤销检查。必须配 `appId`（audience）并保留 `issuer`；
JWKS/status 挂在 API **origin** 根（`/bff` 前缀会被剥离）。换钥在服务端完成（平台 `reload`），
客户端无需重新部署——未知 `kid` 会触发重取。

自研验签必须**同时**满足：

1. `alg` 白名单 = `RS256`（拒绝 `none`；拒绝用公钥跑 HS256）。
2. 按 `kid` 从固定 JWKS URL 选键；未知 `kid` → 强制重取一次（限频），仍失败则拒绝。
   无 `kid` 的 token 仅在 status 文档允许的窗口内接受。
3. `type === 'access'`（拒绝 id_token / refresh_token 混淆）。
4. `iss` ∈ 来自 discovery 的显式白名单；`aud` 包含你的 app id；header `typ` ∈
   {`JWT`, `at+jwt`}；`exp` 有效（`nbf` 允许小 skew）。
5. 缓存密钥集（≤5 分钟）与验证结果（≤15 秒）；缓存不得跨 issuer/app 复用。
   不信任 `jku` / `x5u` / 内嵌密钥，不硬编码公钥。

敏感操作（删号、改密/凭证、管理或支付动作）仍必须每次请求走 `/me` 或 introspect——
本地验签看不到 token/session 的即时撤销。

不要写死 `iss`：它会随区域/流程变化（SAML 统一到 identity-service）。从 discovery 或区域配置取值
并校验，不要套用另一个区域的值。

**撤销 SLO**：内部验签方 ≤60 秒；官方 SDK 最坏约 55 秒（oauth keyset 30 秒 + jwt-status 10 秒 +
结果缓存 15 秒）；外部应用由自身缓存决定——敏感路径要把缓存压短。
<!-- /lang:zh -->

<!-- lang:en -->
## Owner key

- App has its own user table: `app_user.id` is the owner; map `(issuer, subject)` → `external_identities.app_user_id`.
- No user table: `data.id` (or `sub`) is the owner.
- Never use email as the owner key.
<!-- /lang:en -->
<!-- lang:zh -->
## Owner key

- 应用有自己的用户表：owner 是 `app_user.id`；把 `(issuer, subject)` 映射到 `external_identities.app_user_id`。
- 没有用户表：owner 是 `data.id`（或 `sub`）。
- **不要用邮箱**做 owner key。
<!-- /lang:zh -->

<!-- lang:en -->
## Next.js (App Router)
<!-- /lang:en -->
<!-- lang:zh -->
## Next.js（App Router）
<!-- /lang:zh -->

```ts
// lib/server/caller.ts
import { decodeJwt } from "jose";
import { createHash } from "node:crypto";

const ME = `${process.env.AUTIONAL_API_URL}/identity/api/v1/auth/me`;
const cache = new Map<string, { id: string; exp: number }>();
const cacheKey = (token: string) => createHash("sha256").update(token).digest("hex").slice(0, 16);

export async function requireCaller(req: Request) {
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) throw new Response("unauthorized", { status: 401 });

  const { exp = 0, sub } = decodeJwt(token);
  if (exp * 1000 < Date.now()) throw new Response("expired", { status: 401 });

  const key = cacheKey(token);
  const hit = cache.get(key);
  if (hit && hit.exp > Date.now()) return hit.id;

  const res = await fetch(ME, {
    headers: { authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(3000),
  });
  if (res.status === 401 || res.status === 403) {
    throw new Response("unauthorized", { status: 401 });
  }
  if (!res.ok) throw new Response("auth unavailable", { status: 503 });

  const body = await res.json();
  const id = body?.data?.id;
  if (!id) throw new Response("unauthorized", { status: 401 });
  // /me returns the same subject as `sub`; a mismatch means schema drift.
  if (sub && sub !== id) throw new Response("unauthorized", { status: 401 });

  if (cache.size >= 500) cache.delete(cache.keys().next().value!);
  cache.set(key, { id, exp: Date.now() + 60_000 });
  return id;
}

/** Call on logout / account deletion. */
export function clearCallerCache() {
  cache.clear();
}
```

> `jose` is only used to decode `exp`. To avoid the dependency, decode the payload with `Buffer.from(token.split(".")[1], "base64url")`.

<!-- lang:en -->
## Express
<!-- /lang:en -->
<!-- lang:zh -->
## Express
<!-- /lang:zh -->

```ts
app.use(async (req, res, next) => {
  try {
    req.userId = await requireCaller(req);
    next();
  } catch (err) {
    if (err instanceof Response) {
      const status = err.status === 503 ? 503 : 401;
      res.status(status).json({ error: status === 503 ? "auth unavailable" : "unauthorized" });
      return;
    }
    res.status(500).json({ error: "internal error" });
  }
});
```

<!-- lang:en -->
## Node SDK

If you use `{{NPM_SCOPE}}/node`, the middleware verifies by default:

- `verify: 'userinfo'` (default) — calls the OAuth userinfo endpoint; simplest and always correct;
- `verify: 'introspect'` — requires `clientId` / `clientSecret`, returns scope;
- `verify: 'jwks'` — local RS256 verification + `jwt-status` revocation check; optional path for
  high-traffic resource servers (configure `appId` / `issuer`; unknown `kid` triggers a refetch);
- `verify: 'decode-only'` — local debugging only; the injected user is marked `verified: false`.

Do not enable `decode-only` on protected routes — it is not a security boundary. Sensitive
operations stay on `/me` or `introspect` even when reads use `jwks`.
<!-- /lang:en -->
<!-- lang:zh -->
## Node SDK

使用 `{{NPM_SCOPE}}/node` 时，中间件默认会校验：

- `verify: 'userinfo'`（默认）——调 OAuth userinfo；最简单也最稳；
- `verify: 'introspect'`——需要 `clientId` / `clientSecret`，可拿到 scope；
- `verify: 'jwks'`——本地 RS256 验签 + `jwt-status` 撤销检查；高流量资源服务的可选路径
  （配 `appId` / `issuer`；未知 `kid` 会自动重取）；
- `verify: 'decode-only'`——仅本地调试；注入的 user 会标记 `verified: false`。

保护路由不要开 `decode-only`——它不是安全边界。读请求用 `jwks` 时，敏感操作仍走 `/me` 或 introspect。
<!-- /lang:zh -->

<!-- lang:en -->
## `useCookie` / BFF

`useCookie` only disables local persistence. The SDK does not send credentials
and does not read tokens from cookies. A BFF must:

1. keep the token server-side and set an httpOnly cookie;
2. expose an endpoint that returns the access token (or calls Autional on behalf of the browser);
3. call `setTokens()` after a reload, or proxy the API itself.

Without this, a page refresh logs the user out.
<!-- /lang:en -->
<!-- lang:zh -->
## `useCookie` / BFF

`useCookie` 只关闭本地持久化。SDK 不会自动携带 cookie，也不会从 cookie 读 token。BFF 必须：

1. 在服务端保存 token，并设置 httpOnly cookie；
2. 提供返回 access token 的接口（或代浏览器调 Autional）；
3. 刷新后调用 `setTokens()`，或者由 BFF 直接代理 API。

否则刷新页面就会掉线。
<!-- /lang:zh -->

<!-- lang:en -->
## Cache

- Positive results only; TTL ≤60s.
- Bound the map (e.g. 500 entries) to avoid unbounded growth in long-lived processes.
- Clear on logout and account deletion; do not wait for the TTL.
- Serverless instances each keep their own cache; a logout on one instance does not clear the others, so keep the TTL short.
- Revocation and logout can therefore lag up to 60s. For immediate revocation, query `/me` on every request or use Redis-backed introspection.
- Revocation SLO by verification path: internal verifiers ≤60s; official SDK (`jwks`) worst case ≈55s (oauth keyset 30s + jwt-status 10s + result cache 15s); external apps are bounded by their own cache. Keep caches short on sensitive routes.
- `jwks` mode adds its own caches: key set (default 5 min, with unknown-`kid` refetch) and jwt-status (10s); do not raise them on sensitive routes.
<!-- /lang:en -->
<!-- lang:zh -->
## 缓存

- 只缓存正结果；TTL ≤60 秒。
- 给 Map 设上限（如 500 条），避免长驻进程无限增长。
- 登出与删号时清缓存，不要等 TTL。
- Serverless 每个实例各有缓存；一个实例登出不会清其它实例，所以 TTL 要短。
- 因此撤销与登出最多滞后 60 秒。需要立即生效时，每次请求都查 `/me`，或用 Redis 支撑的 introspect。
- 撤销 SLO 按验签路径分列：内部验签方 ≤60 秒；官方 SDK（`jwks`）最坏约 55 秒（oauth keyset 30 秒 + jwt-status 10 秒 + 结果缓存 15 秒）；外部应用由自身缓存决定。敏感路由要把缓存压短。
- `jwks` 模式另有自己的缓存：密钥集（默认 5 分钟，未知 `kid` 会重取）与 jwt-status（10 秒）；敏感路由不要调大。
<!-- /lang:zh -->
