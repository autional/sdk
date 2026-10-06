# @autional/vue

Autional Vue SDK — `createAutional()` plugin, `useAutional()` composable, `v-auth` directive, and `autionalGuard` router guard.

## What's Inside

- **`createAutional(config)`** — Vue plugin that creates and initializes an `Autional` instance, injects via `provide`
- **`useAutional()`** — composable returning `{ autional, user, isLoading, isAuthenticated, login, logout }`
- **`vAuth`** — directive for conditional rendering based on auth state
- **`autionalGuard`** — `beforeEach` navigation guard for vue-router

## Install

```bash
npm install @autional/core @autional/vue
```

## Quick Start

```ts
// main.ts
import { createApp } from 'vue';
import { createAutional } from '@autional/vue';
import App from './App.vue';

const app = createApp(App);
app.use(createAutional({
  appId: 'my-app',
  issuer: 'https://auth.iam.tianv.com',
}));
app.mount('#app');
```

```vue
<!-- Dashboard.vue -->
<script setup lang="ts">
import { useAutional } from '@autional/vue';

const { user, isLoading, login, logout } = useAutional();
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

Copy [`examples/vue-autional.ts`](../../examples/vue-autional.ts) to `src/autional.ts`, edit `appId` and `issuer`. All your components import from `./autional`.

See the [root SDK README](../../README.md) for full documentation.
