# @autional/onboard

Scaffold a new Autional project with React, Vue, or Next.js in seconds.

## Usage

```bash
npx @autional/onboard
# or after local build:
pnpm build && node dist/index.js
```

### Probe-only modes (no scaffolding)

| Flag | What it proves | Exit |
|---|---|---|
| `--check-client=<client_id>` | the `client_id` exists, is an app client (not the tenant portal client), belongs to `--tenant` (when given), and has `openid` | 0 ok / 1 fail / 2 unreachable |
| `--check-authorize=<redirect_uri>` | the client + exact callback are registered (`302` back to callback with `login_required`) | 0 ok / 1 fail / 2 unreachable |
| `--check-cors=<origin>` | the origin passes the CORS preflight (registered on **this** client, already propagated) | 0 ok / 1 no ACAO / 2 unreachable |

```bash
node dist/index.js --check-client=client-xxxxxxxx --tenant=tenant-xxxxxxxx --region=cn
node dist/index.js --check-authorize=https://app.example.com/oauth/callback --app-id=client-xxxxxxxx --region=cn
node dist/index.js --check-cors=https://app.example.com --region=cn
```

For scaffolding, `--app-id=<id>` skips the appId prompt; `--tenant=<id>`, `--redirect=<url>` and
`--origin=<url>` run the same client/authorize/CORS gates before any file is written. Skipping the
preflight prints a visible warning.

`--check-cors` sends one `OPTIONS` to the token endpoint with your `Origin`; nothing is authenticated.
It fails with the three usual causes (not registered / not byte-identical — origin only, no path or
trailing slash / registered seconds ago, propagation is ≤60 s).

You'll be prompted for:

| Prompt | Description |
|--------|-------------|
| Project name | Directory name for the new project |
| Framework | React (Vite), Vue (Vite), or Next.js (App Router) |
| TypeScript | Whether to scaffold with TypeScript (default: yes) |
| Region | `.com` (global) or `.cn` (mainland China) — sets region defaults |
| Autional services | Checkbox selection: identity, mfa, billing, wallet |
| App ID | OAuth client ID registered in Autional |

Skip the region prompt with a flag:

```bash
npx @autional/onboard --region cn
```

## What Gets Created

### React (Vite)

```
my-app/
├── src/
│   ├── App.tsx              ← AutionalProvider + RequireAuth + Routes (incl. /oauth/callback)
│   ├── main.tsx             ← ReactDOM entry
│   ├── pages/
│   │   ├── Login.tsx        ← Email/password form + "Continue with Autional" (SSO)
│   │   └── OAuthCallback.tsx ← SSO callback (handleOAuthCallback)
│   ├── vite-env.d.ts        ← Vite client types
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
│   ├── App.vue              ← Root component with router-view
│   ├── main.ts              ← Vue app + router + provide(autionalConfig)
│   ├── pages/
│   │   ├── Login.vue        ← Email/password login + "Continue with Autional" (SSO)
│   │   └── OAuthCallback.vue ← SSO callback (handleOAuthCallback)
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
│   │   ├── layout.tsx       ← RootLayout with AutionalProvider
│   │   ├── page.tsx         ← Home page (RequireAuth protected)
│   │   ├── login/
│   │   │   ├── page.tsx     ← Login page (server component)
│   │   │   └── LoginForm.tsx ← Client login form + SSO button
│   │   └── oauth/
│   │       └── callback/
│   │           └── page.tsx ← SSO callback (handleOAuthCallback)
│   └── middleware.ts        ← Auth guard (public: /login, /oauth/callback)
├── next.config.ts
├── tsconfig.json
├── .env / .env.example
├── .gitignore
├── package.json
└── README.md
```

## SDK Dependencies

The scaffolded project uses:

- `@autional/core` — Framework-agnostic auth client
- `@autional/react` — React bindings (for React / Next.js)

Vue scaffolds use `@autional/core` directly with provide/inject.

## Autional Backend

The scaffold targets the Autional cloud for the selected region:

| Region | `AUTIONAL_ISSUER` | `AUTIONAL_API_URL` |
|--------|-------------------|--------------------|
| `.com` | `https://api.autional.com` | `https://api.autional.com/bff` |
| `.cn` | `https://api.autional.cn` | `https://api.autional.cn/bff` |

Override via env vars (`VITE_` for Vite, `NEXT_PUBLIC_` for Next.js), e.g.
`VITE_AUTIONAL_API_URL`. The API URL must include the `/bff` gateway path.

## SSO (OAuth + PKCE)

Every scaffold wires both sign-in paths:

1. Password login (`login` / `client.login`)
2. SSO via "Continue with Autional" (`loginWithOAuth`) → `/oauth/callback` page (`handleOAuthCallback`)

Register the app once (developer portal → OAuth clients, or the registration endpoint):

| Field | Local development value |
|-------|-------------------------|
| `redirect_uris` | `http://localhost:3000/oauth/callback` |
| `cors_origins` | `http://localhost:3000` |

Set the returned client ID as `AUTIONAL_APP_ID` (the scaffold puts it in `.env`).

Using a same-origin `/bff` reverse proxy instead of the region API URL? The default
authorize URL only rewrites an `api.` host into `auth.` — pin the auth plane explicitly:

```ts
loginWithOAuth({ authorizeUrl: 'https://auth.autional.cn/oauth/api/v1/oauth/authorize' })
```

## Build

```bash
# Build the CLI itself
pnpm install
pnpm build

# Run locally
node dist/index.js
```
