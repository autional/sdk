# AuthMS SDK

[![npm version](https://badge.fury.io/js/@authms%2Fcore.svg)](https://www.npmjs.com/package/@authms/core)
[![Gitee](https://img.shields.io/badge/Gitee-authms%2Fsdk-blue)](https://gitee.com/authms/sdk)

**AuthMS 多框架认证 SDK。** 内置 token 管理、多标签同步、密码传输安全、框架适配器（React / Vue / Next.js / 小程序）。

---

## 快速接入（3 步）

**步骤 1：安装**

```bash
# React
npm install @authms/core @authms/react @authms/api-identity
# Vue 3
npm install @authms/core @authms/vue @authms/api-identity
# Next.js
npm install @authms/core @authms/react @authms/next @authms/api-identity
```

**步骤 2：复制 example 文件**

```bash
# React 用户
cp examples/react-authms.ts src/authms.ts
# Vue 3 用户
cp examples/vue-authms.ts src/authms.ts
# Next.js 用户
cp examples/next-authms.ts src/authms.ts
```

**步骤 3：改 2 个字段**

打开 `src/authms.ts`，修改 `appId` 和 `issuer`：

```ts
export const authmsConfig = {
  appId: 'YOUR_APP_ID',                       // ← 在 AuthMS 控制台创建的应用 ID
  issuer: 'https://auth.iam.tianv.com',       // ← AuthMS 服务器地址
};
```
> **issuer 解释**：AuthMS 服务器的地址，**不是你网站的域名**。SDK 会去 `{issuer}/.well-known/openid-configuration` 发现认证端点。如果你的 AuthMS 在 `auth.iam.tianv.com` 上运行，就直接填这个。

**完成。** 你的项目里所有文件都从 `./authms` 导入，不用管是什么框架：

```tsx
import { useAuthms } from './authms';  // ← 永远是 './authms'
const { user, isLoading, login, logout } = useAuthms();
```

---

## 包列表

| 包 | 说明 |
|----|------|
| `@authms/core` | 框架无关核心：token、API、认证流程、Discovery、多标签同步、密码加密 |
| `@authms/react` | React 适配器：AuthmsProvider + useAuthms + RequireAuth |
| `@authms/vue` | Vue 3 适配器：createAuthms + useAuthms + v-auth + 路由守卫 |
| `@authms/next` | Next.js 适配器：中间件 + getServerSession + Provider |
| `@authms/api-identity` | 身份认证 API（21 个函数，树摇导出） |
| `@authms/api-tenant` | 租户管理 API（10 个函数） |
| `@authms/api-mfa` | 多因素认证 API（10 个函数） |
| `@authms/api-billing` | 计费管理 API（9 个函数） |
| `@authms/plugin-mfa` | MFA UI 组件（TOTP 设置/挑战/备份码） |
| `@authms/miniapp` | 微信小程序适配器 |
| `@authms/react-native` | React Native 适配器 |

---

## 密码传输模式

SDK 自动根据租户配置处理密码传输，无需写任何代码：

| 模式 | 说明 |
|------|------|
| `plain` | 明文传输 |
| `hash` | SHA-256(password + tenantId) |
| `symmetric` | ECDH 密钥交换 + AES-256-GCM 加密 |
| `asymmetric` | RSA-OAEP 公钥加密 |

---

## 运行 Demo

```bash
cd demo && pnpm dev
```

---

## 测试

```bash
# 单元测试（131 个）
cd packages/core && npx vitest run

# 集成测试（需要 Docker AuthMS 运行）
cd packages/core && npx vitest run src/__tests__/integration.test.ts
```

---

## 许可证

MIT

## 反馈

[Gitee Issues](https://gitee.com/authms/sdk/issues)
