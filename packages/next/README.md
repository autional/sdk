# @autional/next

Autional Next.js SDK — middleware, server-side session, and provider for Next.js App Router.

## What's Inside

- **`autionalMiddleware`** — edge middleware that redirects unauthenticated users from protected paths
- **`getServerSession`** — server-side session lookup via cookie token + `/auth/me` API call
- **`AutionalProvider`** — client component wrapper (re-exports from `@autional/react` with SSR support)

## Install

```bash
npm install @autional/core @autional/react @autional/next
```

## Quick Start

```ts
// middleware.ts
import { autionalMiddleware } from '@autional/next';

export const config = { matcher: ['/dashboard/:path*', '/settings/:path*'] };

export default autionalMiddleware({
  protectedPaths: ['/dashboard/(.*)', '/settings/(.*)'],
  loginPath: '/login',
  publicPaths: ['/'],
});
```

```tsx
// app/layout.tsx
import { AutionalProvider } from '@autional/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AutionalProvider appId="my-app" issuer="https://auth.iam.tianv.com">
          {children}
        </AutionalProvider>
      </body>
    </html>
  );
}
```

```tsx
// app/dashboard/page.tsx
import { getServerSession } from '@autional/next';

export default async function DashboardPage() {
  const session = await getServerSession({ authUrl: 'https://auth.iam.tianv.com' });
  if (!session.user) return <div>Not authenticated</div>;
  return <h1>Welcome, {session.user.displayName}</h1>;
}
```

## Project Setup

Copy [`examples/next-autional.ts`](../../examples/next-autional.ts) to `src/autional.ts`, edit `appId` and `issuer`. All your components import from `./autional`.

See the [root SDK README](../../README.md) for full documentation.
