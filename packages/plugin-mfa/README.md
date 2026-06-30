# @autional/plugin-mfa

Autional MFA Plugin — Multi-Factor Authentication UI components and flows for `@autional/react`.

## Components

- **`MfaSetup`** — guided TOTP setup with QR code display and verification
- **`MfaGuard`** — wrapper that requires MFA challenge before rendering children
- **`BackupCodes`** — display and regenerate one-time backup codes
- **`mfaPlugin`** — plugin factory to register with `Autional.use()`

## Install

```bash
npm install @autional/core @autional/react @autional/plugin-mfa
```

## Quick Start

```tsx
import { AuthmsProvider, useAuthms } from '@autional/react';
import { MfaSetup, MfaGuard, BackupCodes } from '@autional/plugin-mfa';

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
