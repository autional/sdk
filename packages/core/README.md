# @autional/core

Autional Core SDK — framework-agnostic token management, API client, and authentication flows.

## What's Inside

- **`Autional`** — main client: login, register, logout, OAuth, token refresh, device flow, session management, step-up, portal URLs, tenant switching, event system
- **`ApiClient`** — HTTP client with auto token injection, pre-request refresh, refresh on 401, and snake_case/camelCase conversion
- **`AuthClient`** — authentication calls with password transmission preprocessing and PoW captcha solving
- **`Discovery`** — OIDC discovery document fetching
- **`TokenManager`** — access/refresh token storage, JWT decoding, expiry tracking
- **`TabSync`** — cross-tab session synchronization via BroadcastChannel
- **`browserPlatform` / `sessionStoragePlatform` / `memoryPlatform`** — ready-made platform bindings (localStorage / sessionStorage / memory)
- **`DpopManager`** — opt-in DPoP (RFC 9449) proof generation for the OAuth token endpoints
- **`buildPortalUrl` / `extractTenantSlugFromIssuer`** — tenant slug and console-portal URL helpers

## Install

```bash
npm install @autional/core
```

## Quick Start

```ts
import { Autional, browserPlatform } from '@autional/core';

const autional = new Autional({
  appId: 'my-app',
  issuer: 'https://auth.iam.tianv.com',
  platform: browserPlatform,
});

await autional.initialize();

await autional.login({ email: 'user@example.com', password: 's3cret' });

const profile = await autional.api.get('/profile/api/v1/profiles/me');
console.log(profile);
```

## Password Transmission

`processPasswordForTransmission` preprocesses passwords based on tenant policy with 4 modes:

| Mode | Transport | Description |
|------|-----------|-------------|
| `plain` | Raw password | No processing |
| `hash` | SHA-256(password + "|" + tenantId) | Client-side hashing with separator |
| `symmetric` | ECDH + AES-256-GCM | Key exchange, encrypted |
| `asymmetric` | RSA-OAEP | Public-key encrypted |

The SDK reads the mode from `TenantAuthConfig.passwordPolicy.mode` and applies it automatically on login/register/change-password.

## Sessions & Account Self-service

Same calls on `Autional` and `AuthClient`:

| Call | Purpose |
|------|---------|
| `getSessions()` / `revokeSession(id)` / `revokeOtherSessions()` | List / revoke my sessions (`isCurrentSession` is marked from the JWT `sid`) |
| `reauthenticate(password)` | Step-up token for sensitive operations (single-use, 5 min) |
| `deleteAccount(password)` | GDPR erasure — runs step-up internally and sends `X-StepUp-Token` |
| `forgotPassword()` / `resetPassword()` / `sendVerificationEmail()` / `verifyEmail()` | Password reset and email verification |
| `updateProfile({ username?, mfaEnabled?, metadata? })` | Partial profile update |
| `revokeTokens()` | RFC 7009 revocation of the access/refresh token (SSO `logout()` revokes automatically before redirecting, time-boxed at 1.5 s) |

Sensitive endpoints (step-up, account deletion) currently support `plain` and `hash` transmission modes only.

## Multi-tab Sessions & Pre-refresh

`syncTabs` is on by default. A successful refresh broadcasts `TOKEN_REFRESHED` so other tabs re-read storage — a stale refresh token would trip the server's token-reuse detection and revoke the whole token family. Logout and `TOKEN_REUSE` broadcast `LOGOUT` to sign out every tab. `tokenExpirySkew` (seconds, default 30, `0` disables) refreshes before a request when the access token is about to expire; a failed pre-refresh keeps the session intact — only a server-reported reuse (identity `40000502` / OAuth `invalid_grant` with a `reused` description) still clears it and broadcasts `LOGOUT`.

## Device Flow (RFC 8628)

`loginWithDeviceCode({ onUserCode })` covers device-constrained environments: it shows the user code and verification URI, polls at the server `interval`, backs off on `slow_down`, and accepts an `AbortSignal`. `requestDeviceCode()` is the two-stage variant. The verification page is served by the auth domain (`/device`).

## DPoP (RFC 9449 — opt-in)

`new Autional({ dpop: true })` binds tokens to a P-256 key (persisted via the platform storage, `DpopManager`). Proofs go to the OAuth token-family endpoints only: token / refresh / revoke / userinfo (the client-credentials grant of `loginWithClientCredentials` is not DPoP-bound in this release). Requires WebCrypto and server-side DPoP support.

## Tenant Slug & Portal URLs

`tenantSlug` drives tenant-scoped portal links: `getPortalUrl('admin' | 'user' | 'security' | 'platform' | 'authenticator')` appends `/<slug>/`; `developer` and `status` are global. `createTrialTenant()` returns the slug; `buildPortalUrl` / `extractTenantSlugFromIssuer` are exported for custom use — `buildPortalUrl` supports shared bases only (`api.`/`auth.`-prefixed hosts); tenant-subdomain or IP bases return `null`.

## Project Setup

For framework integration, pick the example for your framework: [`examples/react-autional.ts`](../../examples/react-autional.ts), [`examples/vue-autional.ts`](../../examples/vue-autional.ts), or [`examples/next-autional.ts`](../../examples/next-autional.ts). Copy to `src/autional.ts`, edit `appId` and `issuer`.

See the [root SDK README](../../README.md) for full documentation.
