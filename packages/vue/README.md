# @authms/vue

AuthMS Vue SDK — `createAuthms()` plugin, `useAuthms()` composable, `v-auth` directive, and `authmsGuard` router guard.

## What's Inside

- **`createAuthms(config)`** — Vue plugin that creates and initializes an `AuthMS` instance, injects via `provide`
- **`useAuthms()`** — composable returning `{ authms, user, isLoading, isAuthenticated, login, logout }`
- **`vAuth`** — directive for conditional rendering based on auth state
- **`authmsGuard`** — `beforeEach` navigation guard for vue-router

## Install

```bash
npm install @authms/core @authms/vue
```

## Quick Start

```ts
// main.ts
import { createApp } from 'vue';
import { createAuthms } from '@authms/vue';
import App from './App.vue';

const app = createApp(App);
app.use(createAuthms({
  appId: 'my-app',
  issuer: 'https://auth.iam.tianv.com',
}));
app.mount('#app');
```

```vue
<!-- Dashboard.vue -->
<script setup lang="ts">
import { useAuthms } from '@authms/vue';

const { user, isLoading, login, logout } = useAuthms();
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="!user">
    <button @click="login({ email: 'a@b.com', password: 'x' })">Login</button>
  </div>
  <div v-else>
    <h1>Welcome, {{ user.displayName }}</h1>
    <button @click="logout">Logout</button>
  </div>
</template>
```

## Project Setup

Copy [`examples/vue-authms.ts`](../../examples/vue-authms.ts) to `src/authms.ts`, edit `appId` and `issuer`. All your components import from `./authms`.

See the [root SDK README](../../README.md) for full documentation.
