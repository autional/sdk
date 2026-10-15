# @autional/next

Autional Next.js SDK — middleware, server-side session, and provider for Next.js App Router.

## What's Inside

Use the subpath that matches the runtime — do not import middleware from the package root (the root bundle mixes client hooks and breaks the react-server graph):

- **`@autional/next/middleware`** — edge middleware that redirects unauthenticated users from protected paths
- **`@autional/next/server`** — server-side session lookup via cookie token + `/auth/me` API call
- **`@autional/next/provider`** — client component wrapper (re-exports from `@autional/react` with SSR support; ships the `"use client"` directive)

The package root (`@autional/next`) re-exports all three for backward compatibility; client-context imports work, but middleware/server code should always use the subpaths.

## Install

```bash
npm install @autional/core @autional/react @autional/next
```

## Quick Start

```ts
// middleware.ts
import { autionalMiddleware } from '@autional/next/middleware';

export const config = { matcher: ['/dashboard/:path*', '/settings/:path*'] };

export default autionalMiddleware({
  protectedPaths: ['/dashboard/(.*)', '/settings/(.*)'],
  loginPath: '/login',
  publicPaths: ['/'],
});
```

```tsx
// app/layout.tsx
import { AutionalProvider } from '@autional/next/provider';

const config = { appId: 'my-app', issuer: 'https://auth.autional.cn' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AutionalProvider config={config}>
          {children}
        </AutionalProvider>
      </body>
    </html>
  );
}
```

```tsx
// app/dashboard/page.tsx
import { getServerSession } from '@autional/next/server';

export default async function DashboardPage() {
  const session = await getServerSession({ authUrl: 'https://auth.autional.cn' });
  if (!session.user) return <div>Not authenticated</div>;
  return <h1>Welcome, {session.user.displayName}</h1>;
}
```

## Project Setup

Copy [`examples/next-autional.ts`](../../examples/next-autional.ts) to `src/autional.ts`, edit `appId` and `issuer`. All your components import from `./autional`.

See the [root SDK README](../../README.md) for full documentation.
