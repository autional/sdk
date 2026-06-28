# create-authms-app

Scaffold a new AuthMS project with React, Vue, or Next.js in seconds.

## Usage

```bash
npx create-authms-app
# or after local build:
pnpm build && node dist/index.js
```

You'll be prompted for:

| Prompt | Description |
|--------|-------------|
| Project name | Directory name for the new project |
| Framework | React (Vite), Vue (Vite), or Next.js (App Router) |
| TypeScript | Whether to scaffold with TypeScript (default: yes) |
| AuthMS services | Checkbox selection: identity, mfa, billing, wallet |
| App ID | OAuth client ID registered in AuthMS |

## What Gets Created

### React (Vite)

```
my-app/
├── src/
│   ├── App.tsx          ← AuthmsProvider + RequireAuth + Routes
│   ├── main.tsx         ← ReactDOM entry
│   ├── pages/
│   │   └── Login.tsx    ← Email/password login form
│   └── index.css
├── index.html
├── vite.config.ts
├── tsconfig.json
├── .env / .env.example
├── .gitignore
├── package.json
└── README.md
```

### Vue (Vite)

```
my-app/
├── src/
│   ├── App.vue          ← Root component with router-view
│   ├── main.ts          ← Vue app + router + provide(authmsConfig)
│   ├── pages/
│   │   └── Login.vue    ← Email/password login (AuthMS core direct)
│   └── env.d.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
├── .env / .env.example
├── .gitignore
├── package.json
└── README.md
```

### Next.js (App Router)

```
my-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx   ← RootLayout with AuthmsProvider
│   │   ├── page.tsx     ← Home page (RequireAuth protected)
│   │   └── login/
│   │       ├── page.tsx     ← Login page (server component)
│   │       └── LoginForm.tsx ← Client login form
│   └── middleware.ts    ← Auth guard redirect
├── next.config.ts
├── tsconfig.json
├── .env / .env.example
├── .gitignore
├── package.json
└── README.md
```

## SDK Dependencies

The scaffolded project uses:

- `@authms/core` — Framework-agnostic auth client
- `@authms/react` — React bindings (for React / Next.js)

Vue scaffolds use `@authms/core` directly with provide/inject.

## AuthMS Backend

The scaffold assumes the AuthMS gateway is available at:

```
http://localhost:11080   (default dev)
```

Configure this via the `VITE_AUTH_URL` (Vite) or `NEXT_PUBLIC_AUTH_URL` (Next.js) environment variable, and register your App ID via the OAuth client registration endpoint in the AuthMS admin console.

## Build

```bash
# Build the CLI itself
pnpm install
pnpm build

# Run locally
node dist/index.js
```
