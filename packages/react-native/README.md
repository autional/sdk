# @autional/react-native

Autional React Native SDK — `AutionalProvider`, `useAutional()` hook, and `RequireAuth` guard for iOS/Android.

## What's Inside

- **`AutionalProvider`** — context provider that creates and initializes an `Autional` instance (same API as `@autional/react`)
- **`useAutional()`** — hook returning `{ autional, user, isLoading, isAuthenticated, login, logout }`
- **`RequireAuth`** — wrapper that redirects unauthenticated users to a login screen
- **`createRNPlatform(storage)`** — creates an `AutionalPlatform` backed by `AsyncStorage`

## Install

```bash
npm install @autional/core @autional/react-native @react-native-async-storage/async-storage
```

## Quick Start

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createRNPlatform, AutionalProvider, useAutional } from '@autional/react-native';

export default function App() {
  const platform = createRNPlatform(AsyncStorage);

  return (
    <AutionalProvider
      appId="my-app"
      issuer="https://auth.iam.tianv.com"
      platform={platform}
    >
      <HomeScreen />
    </AutionalProvider>
  );
}

function HomeScreen() {
  const { user, isLoading, login, logout } = useAutional();

  if (isLoading) return null;
  if (!user) return <Button title="Login" onPress={() => login({ email: 'a@b.com', password: 'x' })} />;

  return (
    <View>
      <Text>Welcome, {user.displayName}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

See the [root SDK README](../../README.md) for full documentation.
