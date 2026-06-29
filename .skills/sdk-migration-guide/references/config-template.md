# 配置模板参考

> SDK Migration Guide 引用文件

## src/authms.ts（React 示例）

```ts
/**
 * AuthMS 配置 — 由 sdk-migration-guide 自动生成
 * 接入日期: {DATE}
 * 框架: {FRAMEWORK}
 */

import { AuthmsProvider, useAuthms, RequireAuth } from '@authms/react';

export const authmsConfig = {
  appId: '{APP_ID}',
  issuer: '{ISSUER}',
  apiUrl: '{API_URL}',
  syncTabs: true,
};

export { AuthmsProvider, useAuthms, RequireAuth };
```

## .env

```env
# AuthMS — 公开配置（可提交 git）
VITE_AUTHMS_APP_ID={APP_ID}
VITE_AUTHMS_ISSUER={ISSUER}
VITE_AUTHMS_API_URL={API_URL}
```

## .env.local

```env
# AuthMS — 私密配置（不要提交 git！已自动 .gitignore）
# 创建日期: {DATE}
# 管理员邮箱: {ADMIN_EMAIL}
# 管理员密码: 已单独保存，不在此文件中
```

## AUTHMS_SETUP.md

```markdown
# AuthMS 接入配置 — {PROJECT_NAME}

## 基本信息
- 接入日期: {DATE}
- 框架: {FRAMEWORK}
- 租户: {TENANT_NAME}
- 环境: {ENVIRONMENT}

## 配置信息
- App ID: {APP_ID}
- Issuer: {ISSUER}
- API URL: {API_URL}
- 管理员: {ADMIN_EMAIL}

## 安全策略
- 密码传输: {PASSWORD_TRANSMISSION}
- 最小长度: {MIN_LENGTH}
- 要求: {REQUIREMENTS}
- MFA: {MFA_STATUS}
- 泄露密码检查: {BREACHED_CHECK_STATUS}

## 接入范围
- 登录: {LOGIN_METHODS}
- OAuth: {OAUTH_PROVIDERS}

## 重要提醒
1. 管理员密码已单独保存（不在此文档中）
2. .env.local 不在 git 中
3. 定期检查 AuthMS 控制台的安全建议
4. 生产环境启用 Gateway CORS: CORS_ENABLED=true
```
