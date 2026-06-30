# @autional/next

Autional Next.js SDK — middleware, server-side session, and provider for Next.js App Router.

## What's Inside

- **`authmsMiddleware`** — edge middleware that redirects unauthenticated users from protected paths
- **`getServerSession`** — server-side session lookup via cookie token + `/auth/me` API call
- **`AuthmsProvider`** — client component wrapper (re-exports from `@autional/react` with SSR support)

## Install

```bash
npm install @autional/core @autional/react @autional/next
```

## Quick Start

```ts
// middleware.ts
import { authmsMiddleware } from '@autional/next';

export const config = { matcher: ['/dashboard/:path*', '/settings/:path*'] };

export default authmsMiddleware({
  protectedPaths: ['/dashboard/(.*)', '/settings/(.*)'],
  loginPath: '/login',
  publicPaths: ['/'],
});
```

```tsx
// app/layout.tsx
import { AuthmsProvider } from '@autional/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthmsProvider appId="my-app" issuer="https://auth.iam.tianv.com">
          {children}
        </AuthmsProvider>
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

Copy [`examples/next-authms.ts`](../../examples/next-authms.ts) to `src/authms.ts`, edit `appId` and `issuer`. All your components import from `./authms`.

See the [root SDK README](../../README.md) for full documentation.
