# Autional SDK

[![npm version](https://badge.fury.io/js/@autional%2Fcore.svg)](https://www.npmjs.com/package/@autional/core)

**Multi-framework authentication SDK for Autional.** Drop-in identity with built-in token management, multi-tab sync, password transmission security, and framework adapters for React, Vue, Next.js, React Native, and WeChat Mini Programs.

---

## Installation

Install the core SDK plus the framework adapter for your project:

```bash
# React
npm install @autional/react @autional/core

# Vue 3
npm install @autional/vue @autional/core

# Next.js (App Router)
npm install @autional/next @autional/react @autional/core

# React Native
npm install @autional/react-native @autional/core

# WeChat Mini Program
npm install @autional/miniapp @autional/core
```

Add API packages for typed service calls:

```bash
npm install @autional/api-identity @autional/api-tenant @autional/api-mfa @autional/api-billing
```

---

## Quick Start

**1. Install packages:**

```bash
# React
npm install @autional/core @autional/react @autional/api-identity
# Vue 3
npm install @autional/core @autional/vue @autional/api-identity
# Next.js
npm install @autional/core @autional/react @autional/next @autional/api-identity
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
  appId: 'YOUR_APP_ID',               // ← your Autional console App ID
  issuer: 'https://auth.example.com',  // ← your Autional server URL
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
| `@autional/core` | Framework-agnostic core: token management, API client, auth flows, discovery, tab sync, crypto | — |
| `@autional/react` | React 18+: `AuthmsProvider`, `useAuthms` hook, `RequireAuth` guard | `react`, `react-dom`, `@autional/core` |
| `@autional/vue` | Vue 3: `createAuthms` plugin, `useAuthms` composable, `v-auth` directive, `authmsGuard` | `vue`, `@autional/core` |
| `@autional/next` | Next.js 14+ App Router: middleware, `getServerSession`, `AuthmsProvider` | `next`, `@autional/react`, `@autional/core` |
| `@autional/react-native` | React Native 0.70+: `AuthmsProvider`, `useAuthms`, `RequireAuth` for iOS/Android | `react`, `react-native`, `@autional/core` |
| `@autional/miniapp` | WeChat Mini Program adapter: platform binding, WeChat login, token persistence | `@autional/core` |
| `@autional/api-identity` | Auto-generated TypeScript client for Identity Service (login, register, profile, RBAC, NHI, etc.) | `@autional/core` |
| `@autional/api-tenant` | Auto-generated TypeScript client for Tenant Service (tenant CRUD, plans, branding) | `@autional/core` |
| `@autional/api-mfa` | Auto-generated TypeScript client for MFA Service (TOTP, SMS, passkey, backup codes) | `@autional/core` |
| `@autional/api-billing` | Auto-generated TypeScript client for Billing Service (plans, invoices, usage) | `@autional/core` |
| `@autional/plugin-mfa` | React MFA plugin: pre-built TOTP setup, passkey registration, backup code UI | `@autional/react`, `@autional/core` |

---

## Configuration

Pass a config object to the framework provider or `createAuthms`:

```ts
interface AuthmsConfig {
  appId: string;               // Your Autional application ID (required)
  issuer: string;              // Autional server origin, e.g. "https://auth.example.com" (required)
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

Autional supports four password transmission modes, configured per-tenant. The SDK's built-in
`processPasswordForTransmission` handles client-side preprocessing automatically. Select the
mode via your tenant's password policy — all modes are handled transparently.

| Mode | Description | When to Use |
|------|-------------|-------------|
| `plain` | Raw password sent over TLS | Dev/CI environments |
| `hash` | SHA-256(password \| tenantId) — 注意 `password\|tenantId` 中间有 **竖线分隔符** | Lightweight defense against passive observers |
| `symmetric` | ECDH key exchange + AES-256-GCM encryption | Full encryption without persistent keys |
| `asymmetric` | RSA-OAEP public key encryption with per-tenant key | Strongest: server holds private key, client encrypts with public key |

The SDK reads the tenant's `passwordPolicy.mode` from the discovery response and
automatically applies the correct transformation on `login()` and `register()`. You can
also call the crypto functions directly:

```ts
import { processPasswordForTransmission } from '@autional/core';

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

The API packages provide type-safe functions backed by `@autional/core`'s token-managed
HTTP client. Tokens are automatically refreshed and attached to every request.

```ts
import { Autional } from '@autional/core';
import { login, getProfile } from '@autional/api-identity';

const authms = new Autional({
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

// Cross-service calls with @autional/api-tenant
import { getTenant } from '@autional/api-tenant';
const tenant = await getTenant(authms, 'tn_abc123');
console.log(tenant.name, tenant.plan);
```

The `Autional` instance exposes additional methods directly:

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
Autional gateway.

---

## AI-Assisted Integration

If you use AI coding tools (Cursor, Claude, opencode), just tell your AI:

> "Connect this project to Autional"

The AI will automatically:
1. Read `SETUP.md` for the entry point
2. Fetch the Skill guide (`.skills/sdk-migration-guide/SKILL.md`)
3. Complete dependency installation, configuration, code integration, and testing

For manual setup, see [Quick Start](#quick-start) above.

## License

MIT

## Feedback

[Gitee Issues](https://gitee.com/authms/sdk/issues) — see [LICENSE](./LICENSE) for details.
