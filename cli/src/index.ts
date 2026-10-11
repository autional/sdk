#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import inquirer from 'inquirer';

const AUTIONAL_DEPS = {
  react: ['react', 'react-dom', 'react-router-dom', '@autional/react', '@autional/core'],
  vue: ['vue', 'vue-router', '@autional/core'],
  next: ['next', 'react', 'react-dom', '@autional/react', '@autional/core'],
} as const;

const AUTIONAL_DEV_DEPS: Record<string, string[]> = {
  react: ['@types/react', '@types/react-dom', 'typescript', 'vite', '@vitejs/plugin-react'],
  vue: ['typescript', 'vite', '@vitejs/plugin-vue', 'vue-tsc'],
  next: ['@types/react', '@types/react-dom', 'typescript', '@types/node'],
};

const AUTIONAL_SERVICES = [
  { name: 'identity', value: 'identity', checked: true },
  { name: 'mfa', value: 'mfa', checked: false },
  { name: 'billing', value: 'billing', checked: false },
  { name: 'wallet', value: 'wallet', checked: false },
];

const REGION_DEFAULTS = {
  com: {
    issuer: 'https://api.autional.com',
    apiUrl: 'https://api.autional.com/bff',
    authorizeUrl: 'https://auth.autional.com/oauth/api/v1/oauth/authorize',
  },
  cn: {
    issuer: 'https://api.autional.cn',
    apiUrl: 'https://api.autional.cn/bff',
    authorizeUrl: 'https://auth.autional.cn/oauth/api/v1/oauth/authorize',
  },
} as const;

type RegionKey = keyof typeof REGION_DEFAULTS;

const REGION_FLAG: string | undefined = (() => {
  const eq = process.argv.find((a) => a.startsWith('--region='));
  if (eq) return eq.slice('--region='.length);
  const i = process.argv.indexOf('--region');
  return i !== -1 ? process.argv[i + 1] : undefined;
})();

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeIfNotExists(filePath: string, content: string) {
  ensureDir(path.dirname(filePath));
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

function scaffoldReact(projectDir: string, answers: Answers) {
  const srcDir = path.join(projectDir, 'src');
  const region = REGION_DEFAULTS[answers.region];

  ensureDir(srcDir);

  const appTsx = `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AutionalProvider } from '@autional/react';
import { RequireAuth } from '@autional/react';
import LoginPage from './pages/Login';
import OAuthCallbackPage from './pages/OAuthCallback';

function HomePage() {
  return (
    <div>
      <h1>Welcome to {appName}</h1>
      <p>You are logged in.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AutionalProvider
        config={{
          appId: import.meta.env.VITE_AUTIONAL_APP_ID || '${answers.appId}',
          issuer: import.meta.env.VITE_AUTIONAL_ISSUER || '${region.issuer}',
          apiUrl: import.meta.env.VITE_AUTIONAL_API_URL || '${region.apiUrl}',
          syncTabs: true,
        }}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          <Route
            path="/*"
            element={
              <RequireAuth roles={['super_admin', 'admin']}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                </Routes>
              </RequireAuth>
            }
          />
        </Routes>
      </AutionalProvider>
    </BrowserRouter>
  );
}

export default App;
`.replace(/\{appName\}/g, answers.projectName);

  writeIfNotExists(path.join(srcDir, 'App.tsx'), appTsx);

  const oauthCallbackTsx = `import { useEffect, useState } from 'react';
import { useAutionalContext } from '@autional/react';

/** SSO callback — must match the redirect_uri registered for your OAuth client. */
export default function OAuthCallbackPage() {
  const { autional } = useAutionalContext();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    autional
      .handleOAuthCallback(window.location.href)
      .then(() => {
        if (!cancelled) window.location.replace('/');
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'OAuth callback failed');
      });
    return () => { cancelled = true; };
  }, [autional]);

  if (error) {
    return (
      <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
        <h1>Sign-in failed</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <a href="/login">Back to sign in</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <p>Signing you in…</p>
    </div>
  );
}
`;

  writeIfNotExists(path.join(srcDir, 'pages', 'OAuthCallback.tsx'), oauthCallbackTsx);

  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
});
`;
  writeIfNotExists(path.join(projectDir, 'vite.config.ts'), viteConfig);

  writeIfNotExists(path.join(srcDir, 'vite-env.d.ts'), `/// <reference types="vite/client" />\n`);

  writeIfNotExists(path.join(srcDir, 'main.tsx'), `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>
);
`);

  writeIfNotExists(path.join(srcDir, 'index.css'), `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; background: #f5f5f5; color: #111; }
`);

  writeIfNotExists(path.join(projectDir, 'index.html'), `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${answers.projectName}</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
`);
}

function scaffoldVue(projectDir: string, answers: Answers) {
  const srcDir = path.join(projectDir, 'src');
  const region = REGION_DEFAULTS[answers.region];

  ensureDir(srcDir);

  const mainTs = `import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import LoginPage from './pages/Login.vue';
import OAuthCallbackPage from './pages/OAuthCallback.vue';

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/oauth/callback', component: OAuthCallbackPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.provide('autionalConfig', {
  appId: import.meta.env.VITE_AUTIONAL_APP_ID || '${answers.appId}',
  issuer: import.meta.env.VITE_AUTIONAL_ISSUER || '${region.issuer}',
  apiUrl: import.meta.env.VITE_AUTIONAL_API_URL || '${region.apiUrl}',
});
app.use(router);
app.mount('#app');
`;

  writeIfNotExists(path.join(srcDir, 'main.ts'), mainTs);

  const oauthCallbackVue = `<template>
  <div style="max-width: 400px; margin: 80px auto; padding: 24px;">
    <h1 v-if="error">Sign-in failed</h1>
    <p v-if="error" style="color: red;">{{ error }}</p>
    <a v-if="error" href="/login">Back to sign in</a>
    <p v-else>Signing you in…</p>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import { Autional, browserPlatform } from '@autional/core';

/** SSO callback — must match the redirect_uri registered for your OAuth client. */
const config = inject<{ appId: string; issuer: string; apiUrl?: string }>('autionalConfig');
if (!config) throw new Error('autionalConfig not provided');

const client = new Autional({
  appId: config.appId,
  issuer: config.issuer,
  apiUrl: config.apiUrl,
  platform: browserPlatform,
});

const error = ref('');

onMounted(async () => {
  try {
    await client.handleOAuthCallback(window.location.href);
    window.location.replace('/');
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'OAuth callback failed';
  }
});
</script>
`;

  writeIfNotExists(path.join(srcDir, 'pages', 'OAuthCallback.vue'), oauthCallbackVue);

  const appVue = `<template>
  <router-view />
</template>

<script setup lang="ts">
</script>
`;

  writeIfNotExists(path.join(srcDir, 'App.vue'), appVue);

  const viteConfig = `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: { port: 3000 },
});
`;
  writeIfNotExists(path.join(projectDir, 'vite.config.ts'), viteConfig);

  writeIfNotExists(path.join(srcDir, 'env.d.ts'), `/// <reference types="vite/client" />\n`);

  writeIfNotExists(path.join(projectDir, 'index.html'), `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${answers.projectName}</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
`);
}

function scaffoldNextJs(projectDir: string, answers: Answers) {
  const srcDir = path.join(projectDir, 'src');
  const region = REGION_DEFAULTS[answers.region];

  ensureDir(srcDir);

  const layoutTsx = `import type { Metadata } from 'next';
import { AutionalProvider } from '@autional/react';

export const metadata: Metadata = {
  title: '${answers.projectName}',
  description: '${answers.projectName} — powered by Autional',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AutionalProvider
          config={{
            appId: process.env.NEXT_PUBLIC_AUTIONAL_APP_ID || '${answers.appId}',
            issuer: process.env.NEXT_PUBLIC_AUTIONAL_ISSUER || '${region.issuer}',
            apiUrl: process.env.NEXT_PUBLIC_AUTIONAL_API_URL || '${region.apiUrl}',
            syncTabs: true,
          }}
        >
          {children}
        </AutionalProvider>
      </body>
    </html>
  );
}
`;

  writeIfNotExists(path.join(srcDir, 'app', 'layout.tsx'), layoutTsx);

  const pageTsx = `import { RequireAuth } from '@autional/react';

export default function HomePage() {
  return (
    <RequireAuth roles={['super_admin', 'admin']}>
      <div>
        <h1>Welcome to ${answers.projectName}</h1>
        <p>You are logged in.</p>
      </div>
    </RequireAuth>
  );
}
`;

  writeIfNotExists(path.join(srcDir, 'app', 'page.tsx'), pageTsx);

  const middlewareTs = `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/oauth/callback'];

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('autional_access_token');
  const { pathname } = request.nextUrl;

  if (!authCookie && !PUBLIC_PATHS.includes(pathname)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
`;

  writeIfNotExists(path.join(srcDir, 'middleware.ts'), middlewareTs);

  const oauthCallbackTsx = `'use client';

import { useEffect, useState } from 'react';
import { useAutionalContext } from '@autional/react';

/** SSO callback — must match the redirect_uri registered for your OAuth client. */
export default function OAuthCallbackPage() {
  const { autional } = useAutionalContext();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    autional
      .handleOAuthCallback(window.location.href)
      .then(() => {
        if (!cancelled) window.location.replace('/');
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'OAuth callback failed');
      });
    return () => { cancelled = true; };
  }, [autional]);

  if (error) {
    return (
      <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
        <h1>Sign-in failed</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <a href="/login">Back to sign in</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <p>Signing you in…</p>
    </div>
  );
}
`;

  writeIfNotExists(path.join(srcDir, 'app', 'oauth', 'callback', 'page.tsx'), oauthCallbackTsx);

  writeIfNotExists(path.join(projectDir, 'next.config.ts'), `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`);
}

function scaffoldLoginPage(projectDir: string, answers: Answers) {
  const pagesDir = path.join(projectDir, 'src', 'pages');
  const region = REGION_DEFAULTS[answers.region];

  if (answers.framework === 'react' || answers.framework === 'next') {
    const loginTsx = `import { useState, type FormEvent } from 'react';
import { useAutional } from '@autional/react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login, loginWithOAuth, isAuthenticated } = useAutional();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async () => {
    setError('');
    try {
      // SSO (OAuth 2.1 + PKCE). The default authorize URL derives auth.<root> from apiUrl.
      // Same-origin /bff proxy? The derivation only rewrites an "api." host — pin the auth plane:
      //   await loginWithOAuth({ authorizeUrl: '${region.authorizeUrl}' });
      await loginWithOAuth({});
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'SSO login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <button
          type="button"
          onClick={handleOAuth}
          disabled={loading}
          style={{ width: '100%', padding: 10, marginTop: 12 }}
        >
          Continue with Autional
        </button>
      </form>
    </div>
  );
}
`;
    // For Next.js, the login page goes to src/app/login/page.tsx (Next.js App Router convention)
    if (answers.framework === 'next') {
      const nextLoginTsx = `import { LoginForm } from './LoginForm';

/** Next.js App Router — login page (no layout wrapping for auth pages) */
export default function LoginPage() {
  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h1>Sign In</h1>
      <LoginForm />
    </div>
  );
}
`;
      const nextLoginFormTsx = `'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAutional } from '@autional/react';

export function LoginForm() {
  const { login, loginWithOAuth } = useAutional();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async () => {
    setError('');
    try {
      // SSO (OAuth 2.1 + PKCE). The default authorize URL derives auth.<root> from apiUrl.
      // Same-origin /bff proxy? The derivation only rewrites an "api." host — pin the auth plane:
      //   await loginWithOAuth({ authorizeUrl: '${region.authorizeUrl}' });
      await loginWithOAuth({});
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'SSO login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 16 }}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          style={{ width: '100%', padding: 8, marginTop: 4 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          style={{ width: '100%', padding: 8, marginTop: 4 }} />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      <button
        type="button"
        onClick={handleOAuth}
        disabled={loading}
        style={{ width: '100%', padding: 10, marginTop: 12 }}
      >
        Continue with Autional
      </button>
    </form>
  );
}
`;
      writeIfNotExists(path.join(projectDir, 'src', 'app', 'login', 'page.tsx'), nextLoginTsx);
      writeIfNotExists(path.join(projectDir, 'src', 'app', 'login', 'LoginForm.tsx'), nextLoginFormTsx);
    } else {
      writeIfNotExists(path.join(pagesDir, 'Login.tsx'), loginTsx);
    }
  } else if (answers.framework === 'vue') {
    const loginVue = `<template>
  <div style="max-width: 400px; margin: 80px auto; padding: 24px;">
    <h1>Sign In</h1>
    <form @submit.prevent="handleSubmit">
      <div style="margin-bottom: 16px;">
        <label>Email</label>
        <input v-model="email" type="email" required
          style="width: 100%; padding: 8px; margin-top: 4px;" />
      </div>
      <div style="margin-bottom: 16px;">
        <label>Password</label>
        <input v-model="password" type="password" required
          style="width: 100%; padding: 8px; margin-top: 4px;" />
      </div>
      <p v-if="error" style="color: red;">{{ error }}</p>
      <button type="submit" :disabled="loading"
        style="width: 100%; padding: 10px;">
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
      <button type="button" :disabled="loading" @click="handleOAuth"
        style="width: 100%; padding: 10px; margin-top: 12px;">
        Continue with Autional
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { Autional, browserPlatform } from '@autional/core';

const config = inject<{ appId: string; issuer: string; apiUrl?: string }>('autionalConfig');
if (!config) throw new Error('autionalConfig not provided');

const client = new Autional({
  appId: config.appId,
  issuer: config.issuer,
  apiUrl: config.apiUrl,
  platform: browserPlatform,
});

client.initialize();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await client.login({ email: email.value, password: password.value });
    window.location.href = '/';
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Login failed';
  } finally {
    loading.value = false;
  }
}

async function handleOAuth() {
  error.value = '';
  try {
    // SSO (OAuth 2.1 + PKCE). The default authorize URL derives auth.<root> from apiUrl.
    // Same-origin /bff proxy? The derivation only rewrites an "api." host — pin the auth plane:
    //   await client.loginWithOAuth({ authorizeUrl: '${region.authorizeUrl}' });
    await client.loginWithOAuth({});
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'SSO login failed';
  }
}
</script>
`;

    writeIfNotExists(path.join(pagesDir, 'Login.vue'), loginVue);
  }
}

interface Answers {
  projectName: string;
  framework: 'react' | 'vue' | 'next';
  typescript: boolean;
  region: RegionKey;
  services: string[];
  appId: string;
}

function generateEnv(answers: Answers): string {
  const prefix = answers.framework === 'next' ? 'NEXT_PUBLIC_' : 'VITE_';
  const region = REGION_DEFAULTS[answers.region];
  const lines = [
    '# Autional — public configuration (safe to commit)',
    `${prefix}AUTIONAL_APP_ID=${answers.appId}`,
    `${prefix}AUTIONAL_ISSUER=${region.issuer}`,
    `${prefix}AUTIONAL_API_URL=${region.apiUrl}`,
  ];
  for (const s of answers.services) {
    lines.push(`${prefix}AUTIONAL_${s.toUpperCase()}_ENABLED=true`);
  }
  return lines.join('\n') + '\n';
}

async function main() {
  if (REGION_FLAG !== undefined && !(REGION_FLAG in REGION_DEFAULTS)) {
    console.error(`Unknown region "${REGION_FLAG}" — expected "com" or "cn".`);
    process.exit(1);
  }

  console.log(`
  █████╗ ██╗   ██╗████████╗██╗  ██╗███╗   ███╗███████╗
 ██╔══██╗██║   ██║╚══██╔══╝██║  ██║████╗ ████║██╔════╝
 ███████║██║   ██║   ██║   ███████║██╔████╔██║███████╗
 ██╔══██║██║   ██║   ██║   ██╔══██║██║╚██╔╝██║╚════██║
 ██║  ██║╚██████╔╝   ██║   ██║  ██║██║ ╚═╝ ██║███████║
 ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝

  @autional/onboard — scaffold a new Autional project
`);

  const answers = await inquirer.prompt<Answers>([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'my-autional-app',
      validate: (v: string) => v.trim().length > 0 || 'Project name is required',
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Framework:',
      choices: [
        { name: 'React (Vite)', value: 'react' },
        { name: 'Vue (Vite)', value: 'vue' },
        { name: 'Next.js (App Router)', value: 'next' },
      ],
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Use TypeScript?',
      default: true,
    },
    {
      type: 'list',
      name: 'region',
      message: 'Autional region:',
      when: () => REGION_FLAG === undefined,
      choices: [
        { name: '.com (global)', value: 'com' },
        { name: '.cn (mainland China)', value: 'cn' },
      ],
    },
    {
      type: 'checkbox',
      name: 'services',
      message: 'Autional services to enable:',
      choices: AUTIONAL_SERVICES,
    },
    {
      type: 'input',
      name: 'appId',
      message: 'App ID (from OAuth client registration):',
      default: 'my-app',
      validate: (v: string) => v.trim().length > 0 || 'App ID is required',
    },
  ]);

  answers.region = (REGION_FLAG as RegionKey | undefined) ?? answers.region ?? 'com';
  answers.projectName = answers.projectName.trim();
  answers.appId = answers.appId.trim();

  const projectDir = path.resolve(process.cwd(), answers.projectName);

  if (fs.existsSync(projectDir)) {
    const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Directory "${answers.projectName}" already exists. Overwrite?`,
        default: false,
      },
    ]);
    if (!overwrite) {
      console.log('Aborted.');
      process.exit(0);
    }
    fs.rmSync(projectDir, { recursive: true, force: true });
  }

  ensureDir(projectDir);

  // --- package.json ---
  const pkgDeps = AUTIONAL_DEPS[answers.framework];
  const pkgDevDeps = AUTIONAL_DEV_DEPS[answers.framework];

  const pkg: Record<string, unknown> = {
    name: answers.projectName,
    private: true,
    version: '0.1.0',
    type: 'module',
    scripts: {},
    dependencies: {},
    devDependencies: {},
  };

  if (answers.framework === 'react') {
    pkg.scripts = {
      dev: 'vite',
      build: answers.typescript ? 'tsc -b && vite build' : 'vite build',
      preview: 'vite preview',
      typecheck: answers.typescript ? 'tsc --noEmit' : undefined,
    };
  } else if (answers.framework === 'vue') {
    pkg.scripts = {
      dev: 'vite',
      build: answers.typescript ? 'vue-tsc -b && vite build' : 'vite build',
      preview: 'vite preview',
      typecheck: answers.typescript ? 'vue-tsc --noEmit' : undefined,
    };
  } else {
    pkg.scripts = {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    };
  }

  for (const dep of pkgDeps) {
    (pkg.dependencies as Record<string, string>)[dep] = 'latest';
  }
  for (const dep of pkgDevDeps) {
    (pkg.devDependencies as Record<string, string>)[dep] = 'latest';
  }

  fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify(pkg, null, 2) + '\n',
    'utf-8',
  );

  // --- tsconfig.json ---
  if (answers.typescript) {
    const tsconfig = answers.framework === 'next'
      ? {
          compilerOptions: {
            target: 'ES2017',
            lib: ['dom', 'dom.iterable', 'esnext'],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            noEmit: true,
            esModuleInterop: true,
            module: 'esnext',
            moduleResolution: 'bundler',
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: 'preserve',
            incremental: true,
            plugins: [{ name: 'next' }],
            paths: { '@/*': ['./src/*'] },
          },
          include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
          exclude: ['node_modules'],
        }
      : {
          compilerOptions: {
            target: 'ES2020',
            useDefineForClassFields: true,
            lib: ['ES2020', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            skipLibCheck: true,
            moduleResolution: 'bundler',
            allowImportingTsExtensions: true,
            isolatedModules: true,
            moduleDetection: 'force',
            noEmit: true,
            jsx: answers.framework === 'react' ? 'react-jsx' : 'preserve',
            strict: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noFallthroughCasesInSwitch: true,
          },
          include: ['src'],
        };

    fs.writeFileSync(
      path.join(projectDir, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2) + '\n',
      'utf-8',
    );
  }

  // --- .env ---
  writeIfNotExists(
    path.join(projectDir, '.env'),
    generateEnv(answers),
  );

  // --- .env.example ---
  writeIfNotExists(
    path.join(projectDir, '.env.example'),
    generateEnv(answers),
  );

  // --- .gitignore ---
  writeIfNotExists(
    path.join(projectDir, '.gitignore'),
    `# dependencies
node_modules/

# build
dist/
.next/

# env
.env.local
.env.*.local

# IDE
.idea/
*.swp
*.swo
`,
  );

  // --- Framework-specific scaffolds ---
  switch (answers.framework) {
    case 'react':
      scaffoldReact(projectDir, answers);
      break;
    case 'vue':
      scaffoldVue(projectDir, answers);
      break;
    case 'next':
      scaffoldNextJs(projectDir, answers);
      break;
  }

  // --- Login page (all frameworks) ---
  scaffoldLoginPage(projectDir, answers);

  // --- README ---
  const pkgManager = 'npm';
  const envPrefix = answers.framework === 'next' ? 'NEXT_PUBLIC_' : 'VITE_';
  const region = REGION_DEFAULTS[answers.region];
  writeIfNotExists(
    path.join(projectDir, 'README.md'),
    `# ${answers.projectName}

Scaffolded with the Autional onboarding CLI.

Autional services: ${answers.services.join(', ') || 'none selected'} · Region: .${answers.region}

## Getting Started

\`\`\`bash
${pkgManager} install
${pkgManager} run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

Sign in at [http://localhost:3000/login](http://localhost:3000/login) — password, or SSO via "Continue with Autional".

## Register your OAuth client

Browser login (password and SSO) requires the app to be registered on your Autional
tenant — developer portal → OAuth clients, or the registration endpoint:

| Field | Value |
|-------|-------|
| redirect_uris | \`http://localhost:3000/oauth/callback\` |
| cors_origins | \`http://localhost:3000\` |

Use the returned client_id as \`${envPrefix}AUTIONAL_APP_ID\`.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| \`${envPrefix}AUTIONAL_APP_ID\` | OAuth client ID | \`${answers.appId}\` |
| \`${envPrefix}AUTIONAL_ISSUER\` | Autional API origin | \`${region.issuer}\` |
| \`${envPrefix}AUTIONAL_API_URL\` | API base URL — must include \`/bff\` | \`${region.apiUrl}\` |
${answers.services.map(s => `| \`${envPrefix}AUTIONAL_${s.toUpperCase()}_ENABLED\` | Enable ${s} service | \`true\` |`).join('\n')}

## SSO

The scaffold wires the full SSO chain: \`loginWithOAuth\` (login page) → \`/oauth/callback\` route → \`handleOAuthCallback\` (token exchange).

Using a same-origin \`/bff\` reverse proxy instead of the region API URL? The default
authorize URL only rewrites an \`api.\` host into \`auth.\` — pin it explicitly:

\`\`\`ts
loginWithOAuth({ authorizeUrl: '${region.authorizeUrl}' })
\`\`\`

## Autional SDK

This project uses the Autional SDK for authentication and API access:

- [@autional/core] — Framework-agnostic core
- [@autional/react] — React bindings
- [API packages](https://github.com/autional) — Auto-generated from swagger
`,
  );

  console.log(`
  Scaffold complete! Created project at: ${projectDir}

  Next steps:
    cd ${answers.projectName}
    ${pkgManager} install
    npm run dev

  Register your OAuth client (once) so browser login works:
    redirect_uris: [http://localhost:3000/oauth/callback]
    cors_origins:  [http://localhost:3000]

  Framework:  ${answers.framework}
  TypeScript: ${answers.typescript ? 'yes' : 'no'}
  Region:     .${answers.region}
  Services:   ${answers.services.join(', ') || 'none'}
  App ID:     ${answers.appId}
`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
