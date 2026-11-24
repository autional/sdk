# @autional/ai-auth

Passwordless login for Autional AI sites (`/ai`). OAuth 2.0 Authorization Code +
PKCE (S256), OIDC nonce, HttpOnly BFF session, and a consent-revocation check.
No access/refresh/ID token is ever stored in the browser or on the BFF.

```
browser ── /api/auth/login ──▶ BFF ── 302 ──▶ platform authorize (union tenant)
browser ── /api/auth/callback ─▶ BFF ── code+verifier ──▶ token endpoint
                                    ├─ verify ID Token (RS256, nonce, aud)
                                    ├─ userinfo (openid email)
                                    └─ encrypted __Host-ai-session cookie
browser ── /api/auth/session ──▶ BFF ── consent-status ──▶ platform (≤60s cache)
```

## Endpoints

| Path | Method | Purpose |
|---|---|---|
| `/api/auth/login` | GET | Start login; optional `next=/ai/...` |
| `/api/auth/callback` | GET | OAuth callback (registered redirect URI) |
| `/api/auth/session` | GET | Current identity; slides idle expiry |
| `/api/auth/logout` | POST | Clear the BFF session |

The BFF only exposes `sub`, `email`, `emailVerified`, `tenantId` and `issuer`.

## Embedded login (no redirect)

When `identity` is configured, the same BFF also serves passwordless login on
the customer's own domain. The browser never sees an identity or OAuth token;
it only receives the encrypted `__Host-ai-session` cookie.

| Path | Method | Purpose |
|---|---|---|
| `/api/auth/embed/qr/initiate` | POST | Start a QR login session |
| `/api/auth/embed/qr/status?token=` | GET | Poll; on `confirmed` sets the session cookie |
| `/api/auth/embed/qr/revoke` | POST | Cancel the QR session |
| `/api/auth/embed/email/send` | POST | Send a 6-digit email code |
| `/api/auth/embed/email/login` | POST | Verify the code and set the session cookie |

```ts
const auth = createAiAuth({
  // ...OAuth fields (still required for callback compatibility)
  identity: {
    api: 'https://api.autional.cn/bff',
    tenantId: '01M60J7J1WZRC0K3BSSVS5J6S1', // union tenant
    consentCreate: {
      endpoint: 'https://api.autional.cn/bff/oauth/api/v1/internal/oauth/consents',
      apiKey: env.AI_INTERNAL_API_KEY,
    },
    scopes: ['openid', 'email'],
  },
});

// Optional: mount the individual handlers instead of route()
await auth.embed.sendEmail(request);
```

Login success records consent through the platform internal endpoint
(`grant_method=embedded_bff`) and reuses `consentStatus` for revocation checks:
after the user revokes access, `/session` returns
`{ authenticated: false, error: 'consent_revoked' }` within the cache TTL
(default 60s).

## Usage

### Cloudflare Workers

```ts
import { createAiAuth, createCloudflareHandler } from '@autional/ai-auth';

const auth = createAiAuth({
  issuer: 'https://api.autional.cn',
  clientId: env.AI_OAUTH_CLIENT_ID,
  clientSecret: env.AI_OAUTH_CLIENT_SECRET,
  redirectUri: 'https://www.autional.cn/api/auth/callback',
  resource: 'https://www.autional.cn/ai/api',
  endpointAllowlist: [
    'https://auth.autional.cn/oauth/api/v1/oauth/authorize',
    'https://api.autional.cn/oauth/api/v1/oauth/token',
    'https://api.autional.cn/oauth/api/v1/oauth/userinfo',
    'https://api.autional.cn/.well-known/jwks.json',
  ],
  sessionSecret: env.AI_SESSION_SECRET,
  consentStatus: {
    endpoint: 'https://api.autional.cn/bff/oauth/api/v1/internal/oauth/consent-status',
    apiKey: env.AI_INTERNAL_API_KEY,
  },
});

export default createCloudflareHandler(auth);
```

### Vercel Node function

```ts
import { createAiAuth, createNodeHandler } from '@autional/ai-auth';

const auth = createAiAuth({ /* same config */ });
export default createNodeHandler(auth);
```

`createVercelEdgeHandler(auth)` returns a Web `(Request) => Response` handler.

## Config

| Field | Required | Notes |
|---|---|---|
| `issuer` | yes | `https://api.autional.cn` / `.com` |
| `clientId` / `clientSecret` | yes | confidential client in the `union` tenant |
| `redirectUri` | yes | `https://www.<root>/api/auth/callback` |
| `resource` | yes | AI API `aud`, e.g. `https://www.autional.cn/ai/api` |
| `scopes` | no | default `['openid','email']`; both required |
| `endpointAllowlist` | yes | exact `scheme://host/path` entries |
| `sessionSecret` | yes | ≥32 chars; encrypts state + session cookies |
| `consentStatus` | prod | `{ endpoint, apiKey, cacheTtlSeconds? }` |
| `internalJwt` | no | BFF→AI API RS256 key: `{ issuer, audience, privateKeyPkcs8, kid }` |
| `allowedNextPrefixes` | no | default `['/ai']` |
| `cookiePrefix` | no | default `__Host-ai`; use `ai` only for local http |
| `secureCookies` | no | default `true`; must be `true` for `__Host-` |
| `allowInsecureHttp` | no | local development only |

## Security properties

- PKCE S256; state + browser nonce are stored in one-shot HttpOnly cookies.
- ID Token: RS256 only, JWKS by `kid`, `iss`/`aud`/`exp`/`iat`/`nonce` checked.
- `next` is same-origin and restricted to `/ai`.
- Session cookie is AES-256-GCM encrypted; `HttpOnly; Secure; SameSite=Lax`.
- Consent revocation (`RevokeConsent`) is checked on callback and on every
  session read; active results cache ≤60s → revocation is effective ≤5 min.
- Every consent-status failure is fail-closed.
- Access/refresh/ID tokens are used once and discarded; never logged or stored.

## Session lifetime

Default: 30-minute sliding idle, 8-hour absolute. The cookie is a browser-session
cookie (no `Max-Age`) and the server timestamps are authoritative.
