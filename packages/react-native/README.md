# @authms/react-native

AuthMS React Native SDK — `AuthmsProvider`, `useAuthms()` hook, and `RequireAuth` guard for iOS/Android.

## What's Inside

- **`AuthmsProvider`** — context provider that creates and initializes an `AuthMS` instance (same API as `@authms/react`)
- **`useAuthms()`** — hook returning `{ authms, user, isLoading, isAuthenticated, login, logout }`
- **`RequireAuth`** — wrapper that redirects unauthenticated users to a login screen
- **`createRNPlatform(storage)`** — creates an `AuthmsPlatform` backed by `AsyncStorage`

## Install

```bash
npm install @authms/core @authms/react-native @react-native-async-storage/async-storage
```

## Quick Start

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createRNPlatform, AuthmsProvider, useAuthms } from '@authms/react-native';

export default function App() {
  const platform = createRNPlatform(AsyncStorage);

  return (
    <AuthmsProvider
      appId="my-app"
      issuer="https://auth.iam.tianv.com"
      platform={platform}
    >
      <HomeScreen />
    </AuthmsProvider>
  );
}

function HomeScreen() {
  const { user, isLoading, login, logout } = useAuthms();

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
