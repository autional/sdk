# AuthMS SDK

[![npm version](https://badge.fury.io/js/@authms%2Fcore.svg)](https://www.npmjs.com/package/@authms/core)

**Multi-framework authentication SDK for AuthMS.** Drop-in identity with built-in token management, multi-tab sync, password transmission security, and framework adapters for React, Vue, Next.js, React Native, and WeChat Mini Programs.

---

## Installation

Install the core SDK plus the framework adapter for your project:

```bash
# React
npm install @authms/react @authms/core

# Vue 3
npm install @authms/vue @authms/core

# Next.js (App Router)
npm install @authms/next @authms/react @authms/core

# React Native
npm install @authms/react-native @authms/core

# WeChat Mini Program
npm install @authms/miniapp @authms/core
```

Add API packages for typed service calls:

```bash
npm install @authms/api-identity @authms/api-tenant @authms/api-mfa @authms/api-billing
```

---

## Quick Start

**1. Install packages:**

```bash
# React
npm install @authms/core @authms/react @authms/api-identity
# Vue 3
npm install @authms/core @authms/vue @authms/api-identity
# Next.js
npm install @authms/core @authms/react @authms/next @authms/api-identity
```

**2. Copy the example file for your framework:**

```bash
# React
cp examples/react-authms.ts src/authms.ts
# Vue 3
cp examples/vue-authms.ts src/authms.ts
# Next.js
cp examples/next-authms.ts src/authms.ts
```

**3. Edit 2 fields in `src/authms.ts`:**

```ts
export const authmsConfig = {
  appId: 'YOUR_APP_ID',               // ← your AuthMS console App ID
  issuer: 'https://auth.example.com',  // ← your AuthMS server URL
};
```

**4. Use it — same import path, any framework:**

```tsx
import { useAuthms } from './authms';   // ← always './authms'
const { user, isLoading, login, logout } = useAuthms();
```

> The example files (`examples/react-authms.ts`, `examples/vue-authms.ts`, `examples/next-authms.ts`) wrap the framework adapter with your config and re-export it. Your entire app imports from one file: `./authms`.

export default function Layout({ children }) {
  return (
    <AuthmsProvider config={{ appId: 'app_xxx', issuer: 'https://auth.example.com' }}>
      {children}
    </AuthmsProvider>
---

## Available Packages

| Package | Description | Peer Deps |
|---------|-------------|-----------|
| `@authms/core` | Framework-agnostic core: token management, API client, auth flows, discovery, tab sync, crypto | — |
| `@authms/react` | React 18+: `AuthmsProvider`, `useAuthms` hook, `RequireAuth` guard | `react`, `react-dom`, `@authms/core` |
| `@authms/vue` | Vue 3: `createAuthms` plugin, `useAuthms` composable, `v-auth` directive, `authmsGuard` | `vue`, `@authms/core` |
| `@authms/next` | Next.js 14+ App Router: middleware, `getServerSession`, `AuthmsProvider` | `next`, `@authms/react`, `@authms/core` |
| `@authms/react-native` | React Native 0.70+: `AuthmsProvider`, `useAuthms`, `RequireAuth` for iOS/Android | `react`, `react-native`, `@authms/core` |
| `@authms/miniapp` | WeChat Mini Program adapter: platform binding, WeChat login, token persistence | `@authms/core` |
| `@authms/api-identity` | Auto-generated TypeScript client for Identity Service (login, register, profile, RBAC, NHI, etc.) | `@authms/core` |
| `@authms/api-tenant` | Auto-generated TypeScript client for Tenant Service (tenant CRUD, plans, branding) | `@authms/core` |
| `@authms/api-mfa` | Auto-generated TypeScript client for MFA Service (TOTP, SMS, passkey, backup codes) | `@authms/core` |
| `@authms/api-billing` | Auto-generated TypeScript client for Billing Service (plans, invoices, usage) | `@authms/core` |
| `@authms/plugin-mfa` | React MFA plugin: pre-built TOTP setup, passkey registration, backup code UI | `@authms/react`, `@authms/core` |

---

## Configuration

Pass a config object to the framework provider or `createAuthms`:

```ts
interface AuthmsConfig {
  appId: string;               // Your AuthMS application ID (required)
  issuer: string;              // AuthMS server origin, e.g. "https://auth.example.com" (required)
  apiUrl?: string;             // API base URL if different from issuer
  storagePrefix?: string;      // localStorage key prefix (default: "authms_")
  syncTabs?: boolean;          // Sync auth state across browser tabs (default: true)
}
```

### CAPTCHA Support

When the tenant requires CAPTCHA, provide a `captchaToken` + `captchaProvider` in the login request:

```ts
const { login } = useAuthms();

await login({
  email: 'user@example.com',
  password: 'secret123',
  captchaToken: '<turnstile-captcha-token>',
  captchaProvider: 'turnstile',
});
```

---

## Password Transmission

AuthMS supports four password transmission modes, configured per-tenant. The SDK's built-in
`processPasswordForTransmission` handles client-side preprocessing automatically. Select the
mode via your tenant's password policy — all modes are handled transparently.

| Mode | Description | When to Use |
|------|-------------|-------------|
| `plain` | Raw password sent over TLS | Dev/CI environments |
| `hash` | SHA-256(password + tenantId) before transmission | Lightweight defense against passive observers |
| `symmetric` | ECDH key exchange + AES-256-GCM encryption | Full encryption without persistent keys |
| `asymmetric` | RSA-OAEP public key encryption with per-tenant key | Strongest: server holds private key, client encrypts with public key |

The SDK reads the tenant's `passwordPolicy.mode` from the discovery response and
automatically applies the correct transformation on `login()` and `register()`. You can
also call the crypto functions directly:

```ts
import { processPasswordForTransmission } from '@authms/core';

const result = await processPasswordForTransmission('mypassword', {
  mode: 'hash',
  tenantId: 'tn_xxx',
  minLength: 8,
  requireUpper: true,
  publicKey: '',
});
// result.password → SHA-256 hex digest
// result.passwordTransmission → 'hash'
```

---

## API Usage

The API packages provide type-safe functions backed by `@authms/core`'s token-managed
HTTP client. Tokens are automatically refreshed and attached to every request.

```ts
import { AuthMS } from '@authms/core';
import { login, getProfile } from '@authms/api-identity';

const authms = new AuthMS({
  appId: 'app_xxx',
  issuer: 'https://auth.example.com',
});
await authms.initialize();

// Login
const result = await login(authms, {
  email: 'user@example.com',
  password: 'securePassword123',
});
console.log(result.user.email, result.accessToken);

// Fetch profile (auto-authenticated)
const profile = await getProfile(authms);
console.log(profile);

// Cross-service calls with @authms/api-tenant
import { getTenant } from '@authms/api-tenant';
const tenant = await getTenant(authms, 'tn_abc123');
console.log(tenant.name, tenant.plan);
```

The `AuthMS` instance exposes additional methods directly:

| Method | Description |
|--------|-------------|
| `authms.initialize()` | Load persisted tokens, discover OIDC config |
| `authms.login(credentials)` | Authenticate and store tokens |
| `authms.register(data)` | Register a new user |
| `authms.logout()` | Clear tokens, broadcast to other tabs |
| `authms.loginWithOAuth(opts)` | Initiate OAuth PKCE flow |
| `authms.handleOAuthCallback(url)` | Complete OAuth callback |
| `authms.getAccessToken()` | Get current access token (refreshes if expired) |
| `authms.isAuthenticated()` | Check if a valid token exists |
| `authms.setTenantId(id)` | Switch active tenant |
| `authms.fetchAuthConfig(tenantId?)` | Fetch tenant's password policy, login methods, branding |
| `authms.on(event, handler)` | Subscribe to auth events (`READY`, `USER_CHANGED`, `LOGGED_OUT`, etc.) |
| `authms.dispose()` | Clean up listeners and tab sync |

---

## Examples

Copy-and-paste integration templates for each framework are available in
[`sdk/examples/`](https://github.com/linmes/authms/tree/master/sdk/examples):

| File | Framework |
|------|-----------|
| `react-authms.ts` | React 18+ with AuthmsProvider + useAuthms |
| `vue-authms.ts` | Vue 3 with createAuthms plugin + composable |
| `next-authms.ts` | Next.js App Router with middleware + provider |

Each template contains the minimum code needed — replace `appId` and `issuer` with your
values to start.

---

## Demo

A working demo application with login, registration, profile display, and MFA flows:

```bash
cd sdk/demo
pnpm install
pnpm dev
```

Open `http://localhost:5173` and configure the issuer in the UI to point to your
AuthMS gateway.

---

## License

MIT — see [LICENSE](./LICENSE) for details.
