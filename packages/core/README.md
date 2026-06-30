# @autional/core

Autional Core SDK — framework-agnostic token management, API client, and authentication flows.

## What's Inside

- **`Autional`** — main client: login, register, logout, OAuth, token refresh, tenant switching, event system
- **`ApiClient`** — HTTP client with auto token injection, refresh on 401, and snake_case/camelCase conversion
- **`AuthClient`** — authentication calls with password transmission preprocessing and PoW captcha solving
- **`Discovery`** — OIDC discovery document fetching
- **`TokenManager`** — access/refresh token storage, JWT decoding, expiry tracking
- **`TabSync`** — cross-tab session synchronization via BroadcastChannel
- **`browserPlatform` / `memoryPlatform`** — ready-made platform bindings for browsers and SSR/memory

## Install

```bash
npm install @autional/core
```

## Quick Start

```ts
import { Autional, browserPlatform } from '@autional/core';

const authms = new Autional({
  appId: 'my-app',
  issuer: 'https://auth.iam.tianv.com',
  platform: browserPlatform,
});

await authms.initialize();

await authms.login({ email: 'user@example.com', password: 's3cret' });

const profile = await authms.api.get('/profile/api/v1/profiles/me');
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

## Project Setup

For framework integration, pick the example for your framework: [`examples/react-authms.ts`](../../examples/react-authms.ts), [`examples/vue-authms.ts`](../../examples/vue-authms.ts), or [`examples/next-authms.ts`](../../examples/next-authms.ts). Copy to `src/authms.ts`, edit `appId` and `issuer`.

See the [root SDK README](../../README.md) for full documentation.
