# @authms/react

AuthMS React SDK — `<AuthmsProvider>`, `useAuthms()` hook, and `<RequireAuth>` guard component.

## What's Inside

- **`AuthmsProvider`** — context provider that creates and initializes an `AuthMS` instance
- **`useAuthms()`** — hook returning `{ authms, user, isLoading, isAuthenticated, login, logout }`
- **`RequireAuth`** — wrapper that redirects unauthenticated users to a login page

## Install

```bash
npm install @authms/core @authms/react
```

## Quick Start

```tsx
import { AuthmsProvider } from '@authms/react';

function App() {
  return (
    <AuthmsProvider appId="my-app" issuer="https://auth.iam.tianv.com">
      <Dashboard />
    </AuthmsProvider>
  );
}
```

```tsx
import { useAuthms, RequireAuth } from '@authms/react';

function Dashboard() {
  const { user, isLoading, login, logout } = useAuthms();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <button onClick={() => login({ email: 'a@b.com', password: 'x' })}>Login</button>;

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// Or wrap protected routes:
// <RequireAuth loginPath="/login"><Dashboard /></RequireAuth>
```

## Project Setup

Copy [`examples/react-authms.ts`](../../examples/react-authms.ts) to `src/authms.ts`, edit `appId` and `issuer`. All your components import from `'./authms'`.

See the [root SDK README](../../README.md) for full documentation.
