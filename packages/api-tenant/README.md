# @autional/api-tenant

Autional Tenant Service API — auto-generated TypeScript client for tenant-service (10 functions).

## Functions

| Function | Description |
|----------|-------------|
| `createTenant(client, data)` | Create a new tenant |
| `getTenant(client, tenantId)` | Get tenant by ID |
| `updateTenant(client, tenantId, data)` | Update tenant settings |
| `listMembers(client, tenantId)` | List members of a tenant |
| `addMember(client, tenantId, data)` | Add a member to a tenant |
| `removeMember(client, tenantId, userId)` | Remove a member from a tenant |
| `inviteMember(client, tenantId, data)` | Invite a user to join a tenant |
| `getInvitations(client, tenantId)` | Get pending invitations for a tenant |
| `acceptInvitation(client, token)` | Accept a tenant invitation by token |
| `getApplications(client, tenantId)` | Get membership applications for a tenant |

## Install

```bash
npm install @autional/core @autional/api-tenant
```

## Quick Start

```ts
import { Autional, browserPlatform } from '@autional/core';
import { getTenant, listMembers } from '@autional/api-tenant';

const authms = new Autional({ appId: 'my-app', issuer: 'https://auth.iam.tianv.com', platform: browserPlatform });
await authms.initialize();

const tenant = await getTenant(authms.api, 'tenant-id-here');
const members = await listMembers(authms.api, tenant.id);
```

See the [root SDK README](../../README.md) for full documentation.
