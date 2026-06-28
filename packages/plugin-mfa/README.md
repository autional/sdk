# @authms/plugin-mfa

AuthMS MFA Plugin — Multi-Factor Authentication UI components and flows for `@authms/react`.

## Components

- **`MfaSetup`** — guided TOTP setup with QR code display and verification
- **`MfaGuard`** — wrapper that requires MFA challenge before rendering children
- **`BackupCodes`** — display and regenerate one-time backup codes
- **`mfaPlugin`** — plugin factory to register with `AuthMS.use()`

## Install

```bash
npm install @authms/core @authms/react @authms/plugin-mfa
```

## Quick Start

```tsx
import { AuthmsProvider, useAuthms } from '@authms/react';
import { MfaSetup, MfaGuard, BackupCodes } from '@authms/plugin-mfa';

function SecurityPage() {
  return (
    <div>
      <h2>Two-Factor Authentication</h2>
      <MfaSetup />
      <BackupCodes />
    </div>
  );
}

function Dashboard() {
  return (
    <MfaGuard>
      <h1>Sensitive Content</h1>
    </MfaGuard>
  );
}
```

See the [root SDK README](../../README.md) for full documentation.
