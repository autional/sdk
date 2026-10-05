# Autional SDK

[![npm version](https://badge.fury.io/js/@autional%2Fcore.svg)](https://www.npmjs.com/package/@autional/core)
[![GitHub](https://img.shields.io/badge/GitHub-autional%2Fsdk-blue)](https://github.com/autional/sdk)

**Autional 多框架认证 SDK。** 内置 token 管理、多标签同步、密码传输安全、框架适配器（React / Vue / Next.js / 小程序）。

---

## 快速接入（3 步）

**步骤 1：安装**

```bash
# React
npm install @autional/core @autional/react @autional/api-identity
# Vue 3
npm install @autional/core @autional/vue @autional/api-identity
# Next.js
npm install @autional/core @autional/react @autional/next @autional/api-identity
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
  appId: 'YOUR_APP_ID',                       // ← 在 Autional 控制台创建的应用 ID
  issuer: 'https://api.autional.cn',          // ← Autional 服务器地址
};
```
> **issuer 解释**：Autional 服务器的地址，**不是你网站的域名**。SDK 会去 `{issuer}/.well-known/openid-configuration` 发现认证端点。中国大陆用 `https://api.autional.cn`（国际用 `https://api.autional.com`），直接填对应 region 的地址即可。

**完成。** 你的项目里所有文件都从 `./authms` 导入，不用管是什么框架：

```tsx
import { useAuthms } from './authms';  // ← 永远是 './authms'
const { user, isLoading, login, logout } = useAuthms();
```

---

## 包列表

| 包 | 说明 |
|----|------|
| `@autional/core` | 框架无关核心：token、API、认证流程、Discovery、多标签同步、密码加密 |
| `@autional/react` | React 适配器：AuthmsProvider + useAuthms + RequireAuth |
| `@autional/vue` | Vue 3 适配器：createAuthms + useAuthms + v-auth + 路由守卫 |
| `@autional/next` | Next.js 适配器：中间件 + getServerSession + Provider |
| `@autional/api-identity` | 身份认证 API（21 个函数，树摇导出） |
| `@autional/api-tenant` | 租户管理 API（10 个函数） |
| `@autional/api-mfa` | 多因素认证 API（10 个函数） |
| `@autional/api-billing` | 计费管理 API（9 个函数） |
| `@autional/plugin-mfa` | MFA UI 组件（TOTP 设置/挑战/备份码） |
| `@autional/miniapp` | 微信小程序适配器 |
| `@autional/react-native` | React Native 适配器 |

---

## 密码传输模式

SDK 自动根据租户配置处理密码传输，无需写任何代码：

| 模式 | 说明 |
|------|------|
| `plain` | 明文传输 |
| `hash` | SHA-256(password \| tenantId) — `password\|tenantId` 中间有 **竖线分隔符** |
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

# 集成测试（需要 Docker Autional 运行）
cd packages/core && npx vitest run src/__tests__/integration.test.ts
```

---

## AI 辅助接入

如果你使用 AI 编码工具（Cursor、Claude、opencode），直接对 AI 说：

> "帮我把这个项目接入 Autional"

AI 会自动：
1. 读取 `SETUP.md` 获取入口
2. 下载 Skill 指南（`https://www.autional.cn/ai/skill.md`，兜底镜像 `https://cdn.autional.cn/ai/latest/SKILL.md`）
3. 完成依赖安装、配置注入、代码接入和测试

手动接入请参考上方的"快速接入"章节。

## 许可证

MIT

## 反馈

[GitHub Issues](https://github.com/autional/sdk/issues)
