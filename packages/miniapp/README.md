# @autional/miniapp

Autional WeChat Mini Program SDK — platform adapter + client bootstrap.

## Platform Specifics

Includes `miniappPlatform` — a pre-configured `AutionalPlatform` using `wx.request` as the HTTP adapter and `wx.setStorageSync/wx.getStorageSync` for token persistence.

No BroadcastChannel or Web Crypto — key exchange and SHA-256 use pure-JS fallbacks.

## What's Inside

- **`createAutional(config)`** — creates and bootstraps an `Autional` instance (also mounted on `app.globalData.autional`)
- **`miniappPlatform`** — ready-made platform binding for WeChat Mini Programs
- **`useAutional()`** — hook-style function (non-reactive, for component data)

## Install

```bash
npm install @autional/core @autional/miniapp
```

## Quick Start

```ts
import { createAutional } from '@autional/miniapp';

const autional = createAutional({
  appId: 'wx1234567890',
  authUrl: 'https://api.autional.cn/bff',
});

// Standard Autional flows (password / OTP / social OAuth)
const result = await autional.login({ email: 'user@example.com', password: '...' });
console.log('Logged in:', result.user);
```

## WeChat-specific flows (removed in 0.4.0)

`loginWithWechat()` and `getPhoneNumber()` were removed in **0.4.0**: they called identity
endpoints that the server never implemented, so every call failed (gateway fallback 404/401).
Until the server ships WeChat endpoints, use Autional's standard login flows; if you need the
WeChat-native flow, keep using an older version *only* if you have a backend endpoint to point at,
or open an issue so the endpoints get prioritised.

See the [root SDK README](../../README.md) for full documentation.
