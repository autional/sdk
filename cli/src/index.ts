#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import inquirer from 'inquirer';

const AUTHMS_DEPS = {
  react: ['react', 'react-dom', 'react-router-dom', '@authms/react', '@authms/core'],
  vue: ['vue', 'vue-router', '@authms/core'],
  next: ['next', 'react', 'react-dom', '@authms/react', '@authms/core'],
} as const;

const AUTHMS_DEV_DEPS: Record<string, string[]> = {
  react: ['@types/react', '@types/react-dom', 'typescript', 'vite', '@vitejs/plugin-react'],
  vue: ['typescript', 'vite', '@vitejs/plugin-vue', 'vue-tsc'],
  next: ['@types/react', '@types/react-dom', 'typescript', '@types/node'],
};

const AUTHMS_SERVICES = [
  { name: 'identity', value: 'identity', checked: true },
  { name: 'mfa', value: 'mfa', checked: false },
  { name: 'billing', value: 'billing', checked: false },
  { name: 'wallet', value: 'wallet', checked: false },
];

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

  ensureDir(srcDir);

  const appTsx = `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthmsProvider } from '@authms/react';
import { RequireAuth } from '@authms/react';
import LoginPage from './pages/Login';

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
      <AuthmsProvider
        config={{
          appId: '${answers.appId}',
          authUrl: process.env.REACT_APP_AUTH_URL || 'http://localhost:11080',
        }}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
      </AuthmsProvider>
    </BrowserRouter>
  );
}

export default App;
`.replace(/\{appName\}/g, answers.projectName);

  writeIfNotExists(path.join(srcDir, 'App.tsx'), appTsx);

  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
});
`;
  writeIfNotExists(path.join(projectDir, 'vite.config.ts'), viteConfig);

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

  ensureDir(srcDir);

  const mainTs = `import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import LoginPage from './pages/Login.vue';

const routes = [
  { path: '/login', component: LoginPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.provide('authmsConfig', {
  appId: '${answers.appId}',
  authUrl: import.meta.env.VITE_AUTH_URL || 'http://localhost:11080',
});
app.use(router);
app.mount('#app');
`;

  writeIfNotExists(path.join(srcDir, 'main.ts'), mainTs);

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

  ensureDir(srcDir);

  const layoutTsx = `import type { Metadata } from 'next';
import { AuthmsProvider } from '@authms/react';

export const metadata: Metadata = {
  title: '${answers.projectName}',
  description: '${answers.projectName} — powered by AuthMS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthmsProvider
          config={{
            appId: '${answers.appId}',
            authUrl: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:11080',
          }}
        >
          {children}
        </AuthmsProvider>
      </body>
    </html>
  );
}
`;

  writeIfNotExists(path.join(srcDir, 'app', 'layout.tsx'), layoutTsx);

  const pageTsx = `import { RequireAuth } from '@authms/react';

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

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('authms_access_token');
  const { pathname } = request.nextUrl;

  if (!authCookie && pathname !== '/login') {
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

  writeIfNotExists(path.join(projectDir, 'next.config.ts'), `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`);
}

function scaffoldLoginPage(projectDir: string, answers: Answers) {
  const pagesDir = path.join(projectDir, 'src', 'pages');

  if (answers.framework === 'react' || answers.framework === 'next') {
    const loginTsx = `import { useState, type FormEvent } from 'react';
import { useAuthms } from '@authms/react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuthms();
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
import { useAuthms } from '@authms/react';

export function LoginForm() {
  const { login } = useAuthms();
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
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { AuthMS, browserPlatform } from '@authms/core';
import type { AuthmsConfig } from '@authms/core';

const config = inject<{ appId: string; authUrl: string }>('authmsConfig');
if (!config) throw new Error('authmsConfig not provided');

const authms = new AuthMS({
  appId: config.appId,
  authUrl: config.authUrl,
  platform: browserPlatform,
});

authms.initialize();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await authms.login({ email: email.value, password: password.value });
    window.location.href = '/';
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Login failed';
  } finally {
    loading.value = false;
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
  services: string[];
  appId: string;
}

function generateServicesEnv(services: string[]): string {
  const lines = ['# AuthMS Services'];
  for (const s of services) {
    lines.push(`VITE_AUTHMS_${s.toUpperCase()}_ENABLED=true`);
  }
  lines.push(`VITE_AUTHMS_AUTH_URL=http://localhost:11080`);
  return lines.join('\n') + '\n';
}

async function main() {
  console.log(`
  █████╗ ██╗   ██╗████████╗██╗  ██╗███╗   ███╗███████╗
 ██╔══██╗██║   ██║╚══██╔══╝██║  ██║████╗ ████║██╔════╝
 ███████║██║   ██║   ██║   ███████║██╔████╔██║███████╗
 ██╔══██║██║   ██║   ██║   ██╔══██║██║╚██╔╝██║╚════██║
 ██║  ██║╚██████╔╝   ██║   ██║  ██║██║ ╚═╝ ██║███████║
 ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝

  create-authms-app — scaffold a new AuthMS project
`);

  const answers = await inquirer.prompt<Answers>([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'my-authms-app',
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
      type: 'checkbox',
      name: 'services',
      message: 'AuthMS services to enable:',
      choices: AUTHMS_SERVICES,
    },
    {
      type: 'input',
      name: 'appId',
      message: 'App ID (from OAuth client registration):',
      default: 'my-app',
      validate: (v: string) => v.trim().length > 0 || 'App ID is required',
    },
  ]);

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
  const pkgDeps = AUTHMS_DEPS[answers.framework];
  const pkgDevDeps = AUTHMS_DEV_DEPS[answers.framework];

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
    generateServicesEnv(answers.services),
  );

  // --- .env.example ---
  writeIfNotExists(
    path.join(projectDir, '.env.example'),
    generateServicesEnv(answers.services),
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
  writeIfNotExists(
    path.join(projectDir, 'README.md'),
    `# ${answers.projectName}

Scaffolded with [create-authms-app](https://github.com/authms/create-authms-app).

AuthMS services: ${answers.services.join(', ') || 'none selected'}

## Getting Started

\`\`\`bash
${pkgManager} install
${answers.framework === 'next' ? `${pkgManager} run dev` : `${pkgManager} run dev`}
\`\`\`

${answers.framework === 'next'
    ? `Open [http://localhost:3000](http://localhost:3000) in your browser.\n\nSign in at [http://localhost:3000/login](http://localhost:3000/login).`
    : `Open [http://localhost:3000](http://localhost:3000) in your browser.\n\nSign in at [http://localhost:3000/login](http://localhost:3000/login).`
}

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| \`${answers.framework === 'next' ? 'NEXT_PUBLIC_AUTH_URL' : 'VITE_AUTH_URL'}\` | AuthMS gateway URL | \`http://localhost:11080\` |
${answers.services.map(s => `| \`VITE_AUTHMS_${s.toUpperCase()}_ENABLED\` | Enable ${s} service | \`true\` |`).join('\n')}

## AuthMS SDK

This project uses the AuthMS SDK for authentication and API access:

- [@authms/core] — Framework-agnostic core
- [@authms/react] — React bindings
- [API packages](https://github.com/authms) — Auto-generated from swagger
`,
  );

  console.log(`
  Scaffold complete! Created project at: ${projectDir}

  Next steps:
    cd ${answers.projectName}
    ${pkgManager} install
    ${answers.framework === 'next' ? 'npm run dev' : 'npm run dev'}

  Framework:  ${answers.framework}
  TypeScript: ${answers.typescript ? 'yes' : 'no'}
  Services:   ${answers.services.join(', ') || 'none'}
  App ID:     ${answers.appId}
`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
