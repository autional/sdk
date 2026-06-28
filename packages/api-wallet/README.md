# @authms/api-identity

AuthMS Identity Service API — auto-generated TypeScript client for identity-service (21 functions).

## Functions

| Function | Description |
|----------|-------------|
| `login(client, data)` | Authenticate with email/phone/username and password |
| `register(client, data)` | Register a new user account |
| `refreshToken(client, data)` | Refresh access token using refresh token |
| `getProfile(client)` | Get current user profile |
| `updateProfile(client, data)` | Update current user profile |
| `logout(client)` | Logout and revoke tokens |
| `verifyEmail(client, data)` | Verify email with verification code |
| `sendVerificationEmail(client, data)` | Send email verification code |
| `changePassword(client, data)` | Change password (requires current password) |
| `forgotPassword(client, data)` | Request password reset email |
| `resetPassword(client, data)` | Reset password with token from email |
| `checkPermission(client, data)` | Check if user has a specific permission |
| `getPermissions(client)` | Get user's permission list |
| `getTenants(client)` | Get user's tenants |
| `switchTenant(client, data)` | Switch active tenant |
| `requestRoleActivation(client, data)` | Request PIM/JIT role activation |
| `getRoleActivations(client)` | Get active role activations |
| `deleteAccount(client)` | Delete current user account |
| `getSessions(client)` | Get user's sessions |
| `deleteSession(client, sessionId)` | Delete a specific session |
| `getMFAMethods(client)` | Get user's MFA methods |

## Install

```bash
npm install @authms/core @authms/api-identity
```

## Quick Start

```ts
import { AuthMS, browserPlatform } from '@authms/core';
import { login, getProfile } from '@authms/api-identity';

const authms = new AuthMS({ appId: 'my-app', issuer: 'https://auth.iam.tianv.com', platform: browserPlatform });
await authms.initialize();

const result = await login(authms.api, { email: 'user@example.com', password: 's3cret' });
console.log(result.user);

const profile = await getProfile(authms.api);
console.log(profile);
```

See the [root SDK README](../../README.md) for full documentation.
