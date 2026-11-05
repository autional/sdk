<!-- generated: core@36d05db9d969 · region: cn · lang: zh — do not edit directly -->

# 服务端请求认证

> Autional 接入 Skill 的引用文件。
> 服务端保存用户数据时阅读。
> 前端守卫只改善体验；本文件定义安全边界。

## 契约

1. 读取 `Authorization: Bearer <token>`。
2. 解码 `exp`；过期直接拒绝，不打网络。
3. 用同一 token 调 `GET https://api.autional.cn/bff/identity/api/v1/auth/me`。
4. 正结果缓存 30–60 秒（token 哈希 → user id）。
5. 用 `data.id` 作为每条查询的 owner 条件。
6. 401/403 时刷新并重试一次；仍失败则登出。403 可能是缺少严格 claim（`principal_type` / `entry_plane`）。

## 为什么不能用 JWKS

Access token 没有 `kid`，签名密钥也不在
`https://api.autional.cn/.well-known/jwks.json`（那个密钥服务的是 id_token）。
用 JWKS 验真实 access token 会失败。
RS256 密钥分发尚未上线；在此之前，服务端可用路径是 `/me`、`userinfo` 或 `introspect`。

不要写死 `iss`：不同流程会变（SAML 用 SP EntityID）。
用 `/me` 或 `userinfo` 做校验。

## Next.js（App Router）

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

## Express

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

## Node SDK

使用 `@autional/node` 时，中间件默认会校验：

- `verify: 'userinfo'`（默认）——调 OAuth userinfo；
- `verify: 'introspect'`——需要 `clientId` / `clientSecret`，可拿到 scope；
- `verify: 'decode-only'`——仅本地调试；注入的 user 会标记 `verified: false`。

保护路由不要开 `decode-only`。

## `useCookie` / BFF

`useCookie` 只关闭本地持久化。SDK 不会自动携带 cookie，也不会从 cookie 读 token。BFF 必须：

1. 在服务端保存 token，并设置 httpOnly cookie；
2. 提供返回 access token 的接口（或代浏览器调 Autional）；
3. 刷新后调用 `setTokens()`，或者由 BFF 直接代理 API。

否则刷新页面就会掉线。

## 缓存的副作用

30–60 秒的正缓存意味着撤销与登出最多滞后 60 秒。
本机登出必须立即清状态，不要依赖缓存过期。
