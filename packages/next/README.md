# @authms/next

AuthMS Next.js SDK — middleware, server-side session, and provider for Next.js App Router.

## What's Inside

- **`authmsMiddleware`** — edge middleware that redirects unauthenticated users from protected paths
- **`getServerSession`** — server-side session lookup via cookie token + `/auth/me` API call
- **`AuthmsProvider`** — client component wrapper (re-exports from `@authms/react` with SSR support)

## Install

```bash
npm install @authms/core @authms/react @authms/next
```

## Quick Start

```ts
// middleware.ts
import { authmsMiddleware } from '@authms/next';

export const config = { matcher: ['/dashboard/:path*', '/settings/:path*'] };

export default authmsMiddleware({
  protectedPaths: ['/dashboard/(.*)', '/settings/(.*)'],
  loginPath: '/login',
  publicPaths: ['/'],
});
```

```tsx
// app/layout.tsx
import { AuthmsProvider } from '@authms/next';

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
import { getServerSession } from '@authms/next';

export default async function DashboardPage() {
  const session = await getServerSession({ authUrl: 'https://auth.iam.tianv.com' });
  if (!session.user) return <div>Not authenticated</div>;
  return <h1>Welcome, {session.user.displayName}</h1>;
}
```

See the [root SDK README](../../README.md) for full documentation.
