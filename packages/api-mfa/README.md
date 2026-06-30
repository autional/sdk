# @autional/api-mfa

Autional MFA Service API — auto-generated TypeScript client for mfa-service (10 functions).

## Functions

| Function | Description |
|----------|-------------|
| `setupTotp(client)` | Setup TOTP — returns provisioning URI and QR code |
| `verifyTotp(client, data)` | Verify TOTP setup with a test code |
| `enableTotp(client, data)` | Enable TOTP after successful verification |
| `disableTotp(client)` | Disable TOTP MFA method |
| `getMfaMethods(client)` | Get available MFA methods for the current user |
| `sendSmsCode(client, data)` | Send SMS verification code to a phone number |
| `verifySmsCode(client, data)` | Verify SMS code |
| `generateBackupCodes(client)` | Generate new backup codes |
| `getBackupCodes(client)` | Get existing backup codes (masked) |
| `getPushChallenge(client)` | Get push challenge for MFA verification |

## Install

```bash
npm install @autional/core @autional/api-mfa
```

## Quick Start

```ts
import { Autional, browserPlatform } from '@autional/core';
import { setupTotp, verifyTotp, enableTotp } from '@autional/api-mfa';

const authms = new Autional({ appId: 'my-app', issuer: 'https://auth.iam.tianv.com', platform: browserPlatform });
await authms.initialize();

const setup = await setupTotp(authms.api);
// Show QR code to user, then verify:
await verifyTotp(authms.api, { code: '123456' });
await enableTotp(authms.api, { code: '123456' });
```

See the [root SDK README](../../README.md) for full documentation.
