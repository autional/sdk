<!-- generated: core@feb2db8f64f2 · region: com · lang: en — do not edit directly -->

# Backend request verification

> Reference file for the Autional Onboarding skill.
> Read it when the app stores user data on a server.
> A front-end guard is UX; this file defines the security boundary.

## Contract

1. Read `Authorization: Bearer <token>`.
2. Decode `exp`; reject expired tokens without a network call.
3. Call `GET https://api.autional.com/bff/identity/api/v1/auth/me` with the same token.
4. Cache positive results for 30–60s (token hash → user id).
5. Use `data.id` as the owner key in every query.
6. On 401: refresh once and retry; still failing → sign out.

## Why not JWKS

Access tokens have no `kid`, and their signing key is not the one published at
`https://api.autional.com/.well-known/jwks.json` (that key serves id_tokens).
JWKS verification therefore fails for real access tokens.

## Next.js (App Router)

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

## `useCookie` / BFF

`useCookie` only disables local persistence. The SDK does not send credentials
and does not read tokens from cookies. A BFF must:

1. keep the token server-side and set an httpOnly cookie;
2. expose an endpoint that returns the access token (or calls Autional on behalf of the browser);
3. call `setTokens()` after a reload, or proxy the API itself.

Without this, a page refresh logs the user out.

## Cache side effects

A 30–60s positive cache means revocation and logout can lag up to 60s.
Clear local state immediately on logout; do not rely on the cache expiring.
