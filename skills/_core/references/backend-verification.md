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

1. Read `Authorization: Bearer <token>`.
2. Decode `exp`; reject expired tokens without a network call.
3. Call `GET {{API_URL}}/identity/api/v1/auth/me` with the same token.
4. Cache positive results for 30–60s (token hash → user id).
5. Use `data.id` as the owner key in every query.
6. On 401/403: refresh once and retry; still failing → sign out. A 403 can mean missing strict claims (`principal_type` / `entry_plane`).
<!-- /lang:en -->
<!-- lang:zh -->
## 契约

1. 读取 `Authorization: Bearer <token>`。
2. 解码 `exp`；过期直接拒绝，不打网络。
3. 用同一 token 调 `GET {{API_URL}}/identity/api/v1/auth/me`。
4. 正结果缓存 30–60 秒（token 哈希 → user id）。
5. 用 `data.id` 作为每条查询的 owner 条件。
6. 401/403 时刷新并重试一次；仍失败则登出。403 可能是缺少严格 claim（`principal_type` / `entry_plane`）。
<!-- /lang:zh -->

<!-- lang:en -->
## Why not JWKS

Access tokens have no `kid`, and their signing key is not the one published at
`{{ISSUER}}/.well-known/jwks.json` (that key serves id_tokens).
JWKS verification therefore fails for real access tokens.
RS256 key distribution is still pending; until it ships, the supported server-side
paths are `/me`, `userinfo`, or `introspect`.

Do not hard-code `iss`: it varies by flow (SAML uses the SP EntityID).
Validate through `/me` or `userinfo` instead.
<!-- /lang:en -->
<!-- lang:zh -->
## 为什么不能用 JWKS

Access token 没有 `kid`，签名密钥也不在
`{{ISSUER}}/.well-known/jwks.json`（那个密钥服务的是 id_token）。
用 JWKS 验真实 access token 会失败。
RS256 密钥分发尚未上线；在此之前，服务端可用路径是 `/me`、`userinfo` 或 `introspect`。

不要写死 `iss`：不同流程会变（SAML 用 SP EntityID）。
用 `/me` 或 `userinfo` 做校验。
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

  const res = await fetch(ME, { headers: { authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Response("unauthorized", { status: 401 });

  const body = await res.json();
  const id = body?.data?.id ?? body?.id;
  if (!id || (sub && sub !== id)) throw new Response("unauthorized", { status: 401 });

  cache.set(token, { id, exp: Date.now() + 60_000 });
  return id as string;
}
```

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
## Cache side effects

A 30–60s positive cache means revocation and logout can lag up to 60s.
Clear local state immediately on logout; do not rely on the cache expiring.
<!-- /lang:en -->
<!-- lang:zh -->
## 缓存的副作用

30–60 秒的正缓存意味着撤销与登出最多滞后 60 秒。
本机登出必须立即清状态，不要依赖缓存过期。
<!-- /lang:zh -->
