# @autional/react

Autional React SDK — `<AutionalProvider>`, `useAutional()` hook, and `<RequireAuth>` guard component.

## What's Inside

- **`AutionalProvider`** — context provider that creates and initializes an `Autional` instance
- **`useAutional()`** — hook returning `{ autional, user, isLoading, isAuthenticated, login, logout }`
- **`RequireAuth`** — wrapper that redirects unauthenticated users to a login page

## Install

```bash
npm install @autional/core @autional/react
```

## Quick Start

```tsx
import { AutionalProvider } from '@autional/react';

function App() {
  return (
    <AutionalProvider appId="my-app" issuer="https://auth.iam.tianv.com">
      <Dashboard />
    </AutionalProvider>
  );
}
```

```tsx
import { useAutional, RequireAuth } from '@autional/react';

function Dashboard() {
  const { user, isLoading, login, logout } = useAutional();

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

Copy [`examples/react-autional.ts`](../../examples/react-autional.ts) to `src/autional.ts`, edit `appId` and `issuer`. All your components import from `'./autional'`.

See the [root SDK README](../../README.md) for full documentation.
