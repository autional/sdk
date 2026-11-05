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
3. Validate with `GET {{API_URL}}/identity/api/v1/auth/me` → `{ data: { id } }` (or `userinfo` → `sub`).
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
3. 用 `GET {{API_URL}}/identity/api/v1/auth/me` 校验 → `{ data: { id } }`（或 `userinfo` → `sub`）。
4. owner key：应用自己的 user id（经 `external_identities` 关联），没有用户表时用 `data.id`。**不要用邮箱**。
5. 无效/过期 → 401 · `entry_plane`/claims 不匹配 → 403（不刷新）· 5xx → 503。
6. 正结果缓存 ≤60 秒；登出/删号时清缓存。

**客户端**

401 时刷新一次（单飞 + Web Lock）并重试；403 不重试。
<!-- /lang:zh -->

<!-- lang:en -->
## Why not JWKS

Access tokens have no `kid`, and their signing key is not the one published at
`{{ISSUER}}/.well-known/jwks.json` (that key serves id_tokens).
JWKS verification therefore fails for real access tokens.
RS256 signing is live (2026-11-05), but kid/JWKS distribution for access tokens is still pending;
until it ships, the supported server-side paths are `/me`, `userinfo`, or `introspect`.

Do not hard-code `iss`: it can vary by region/flow (SAML now unifies to identity-service,
2026-11-05). Validate through `/me` or `userinfo` instead of pinning it.
<!-- /lang:en -->
<!-- lang:zh -->
## 为什么不能用 JWKS

Access token 没有 `kid`，签名密钥也不在
`{{ISSUER}}/.well-known/jwks.json`（那个密钥服务的是 id_token）。
用 JWKS 验真实 access token 会失败。
RS256 签发已于 2026-11-05 上线，但 access token 的 kid/JWKS 分发仍未上线；
在此之前，服务端可用路径是 `/me`、`userinfo` 或 `introspect`。

不要写死 `iss`：它会随区域/流程变化（SAML 已于 2026-11-05 统一到 identity-service）。
用 `/me` 或 `userinfo` 做校验，不要 pin 死。
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

const ME = `${process.env.AUTIONAL_API_URL}/identity/api/v1/auth/me`;
const cache = new Map<string, { id: string; exp: number }>();

export async function requireCaller(req: Request) {
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) throw new Response("unauthorized", { status: 401 });

  const { exp = 0, sub } = decodeJwt(token);
  if (exp * 1000 < Date.now()) throw new Response("expired", { status: 401 });

  const hit = cache.get(token);
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
  cache.set(token, { id, exp: Date.now() + 60_000 });
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
  } catch {
    res.status(401).json({ error: "unauthorized" });
  }
});
```

<!-- lang:en -->
## Node SDK

If you use `{{NPM_SCOPE}}/node`, the middleware verifies by default:

- `verify: 'userinfo'` (default) — calls the OAuth userinfo endpoint;
- `verify: 'introspect'` — requires `clientId` / `clientSecret`, returns scope;
- `verify: 'decode-only'` — local debugging only; the injected user is marked `verified: false`.

Do not enable `decode-only` on protected routes.
<!-- /lang:en -->
<!-- lang:zh -->
## Node SDK

使用 `{{NPM_SCOPE}}/node` 时，中间件默认会校验：

- `verify: 'userinfo'`（默认）——调 OAuth userinfo；
- `verify: 'introspect'`——需要 `clientId` / `clientSecret`，可拿到 scope；
- `verify: 'decode-only'`——仅本地调试；注入的 user 会标记 `verified: false`。

保护路由不要开 `decode-only`。
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
<!-- /lang:en -->
<!-- lang:zh -->
## 缓存

- 只缓存正结果；TTL ≤60 秒。
- 给 Map 设上限（如 500 条），避免长驻进程无限增长。
- 登出与删号时清缓存，不要等 TTL。
- Serverless 每个实例各有缓存；一个实例登出不会清其它实例，所以 TTL 要短。
- 因此撤销与登出最多滞后 60 秒。需要立即生效时，每次请求都查 `/me`，或用 Redis 支撑的 introspect。
<!-- /lang:zh -->
