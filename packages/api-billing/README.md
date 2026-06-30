# @autional/api-billing

Autional Billing Service API — auto-generated TypeScript client for billing-service (9 functions).

## Functions

| Function | Description |
|----------|-------------|
| `getPlans(client)` | Get available billing plans (public endpoint) |
| `getSubscription(client)` | Get current tenant subscription |
| `subscribe(client, data)` | Subscribe to a billing plan |
| `cancelSubscription(client)` | Cancel current subscription |
| `getUsage(client)` | Get current usage metrics |
| `getInvoices(client)` | Get invoices list |
| `getInvoice(client, id)` | Get a specific invoice by ID |
| `getBalance(client)` | Get account balance |
| `getFeatureGates(client)` | Get feature gates for current tenant |

## Install

```bash
npm install @autional/core @autional/api-billing
```

## Quick Start

```ts
import { Autional, browserPlatform } from '@autional/core';
import { getPlans, getSubscription, subscribe } from '@autional/api-billing';

const authms = new Autional({ appId: 'my-app', issuer: 'https://auth.iam.tianv.com', platform: browserPlatform });
await authms.initialize();

const plans = await getPlans(authms.api);
const sub = await getSubscription(authms.api);
await subscribe(authms.api, { planId: plans[0].id });
```

See the [root SDK README](../../README.md) for full documentation.
