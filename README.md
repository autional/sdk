# AuthMS SDK

AuthMS 多框架 SDK — 让 AI 生成的应用 3 行代码接入认证。

## 包列表

| 包 | 用途 | npm |
|----|------|:--:|
| `@authms/core` | Token/Api/Auth/Discovery/Sync/Crypto | — |
| `@authms/react` | React: AuthmsProvider + useAuthms + RequireAuth | — |
| `@authms/vue` | Vue: Plugin + Composable + v-auth + Guard | — |
| `@authms/next` | Next.js: Middleware + getServerSession | — |
| `@authms/miniapp` | 微信小程序适配 | — |
| `@authms/react-native` | React Native 适配 | — |
| `@authms/api-identity` | 身份认证 API (21 函数) | — |
| `@authms/api-tenant` | 租户管理 API (10 函数) | — |
| `@authms/api-mfa` | 多因素认证 API (10 函数) | — |
| `@authms/api-billing` | 计费管理 API (9 函数) | — |
| `@authms/plugin-mfa` | MFA UI 组件 | — |

## 快速开始

```bash
# React
npm install @authms/react @authms/api-identity
```

```tsx
import { AuthmsProvider, useAuthms, RequireAuth } from '@authms/react';

function App() {
  return (
    <AuthmsProvider config={{ issuer: 'https://auth.example.com', appId: 'app_xxx' }}>
      <Router />
    </AuthmsProvider>
  );
}

function Dashboard() {
  const { user, isLoading, login, logout } = useAuthms();
  if (isLoading) return <Spinner />;
  if (!user) return <button onClick={login}>Sign In</button>;
  return <div>Hello {user.email} <button onClick={logout}>Sign Out</button></div>;
}
```

## Demo

```bash
cd demo && pnpm dev
```

## 许可证

MIT
