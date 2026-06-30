# @autional/miniapp

Autional WeChat Mini Program SDK — platform adapter, WeChat login, and token management.

## Platform Specifics

Uses **`wx.login`** for WeChat OAuth authentication and **`wx.setStorageSync/wx.getStorageSync`** for token persistence. Includes `miniappPlatform` — a pre-configured `AuthmsPlatform` using `wx.request` as the HTTP adapter and synchronous storage APIs.

No BroadcastChannel or Web Crypto — key exchange and SHA-256 use pure-JS fallbacks.

## What's Inside

- **`createAuthms(config)`** — creates an `Autional` instance with `.loginWithWechat()` and `.getPhoneNumber()` extensions
- **`miniappPlatform`** — ready-made platform binding for WeChat Mini Programs
- **`useAuthms()`** — hook-style function (non-reactive, for component data)

## Install

```bash
npm install @autional/core @autional/miniapp
```

## Quick Start

```ts
import { createAuthms } from '@autional/miniapp';

const authms = createAuthms({
  appId: 'wx1234567890',
  authUrl: 'https://auth.iam.tianv.com',
});

// In a page's onLoad or a button handler:
const result = await authms.loginWithWechat();
console.log('Logged in:', result.user);

// Get phone number from <button open-type="getPhoneNumber">
// <button open-type="getPhoneNumber" bindgetphonenumber="onGetPhone">
Page({
  async onGetPhone(e: WechatPhoneEvent) {
    const phone = await authms.getPhoneNumber(e);
    console.log('Phone:', phone);
  },
});
```

See the [root SDK README](../../README.md) for full documentation.
