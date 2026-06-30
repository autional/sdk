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

## 测试账号
| 账号 | 密码 | 角色 |
|------|------|:----:|
| {TEST1_EMAIL} | {TEST1_PASSWORD} | 测试用户 1 |
| {TEST2_EMAIL} | {TEST2_PASSWORD} | 测试用户 2 |
| {TEST3_EMAIL} | {TEST3_PASSWORD} | 测试用户 3 |

> 测试账号密码仅第一次显示，后续可在 admin-console 重置。

## 管理入口
| Portal | 地址 | 用途 |
|--------|------|------|
| 管理后台 | https://auth.iam.tianv.com/admin | 用户管理、角色权限、审计日志 |
| 用户门户 | https://auth.iam.tianv.com/user | 修改密码、设备管理 |
| 安全仪表盘 | https://auth.iam.tianv.com/security | 异常检测、登录趋势 |
| 开发者门户 | https://auth.iam.tianv.com/developer | API 文档、OAuth 管理 |
| 系统状态 | https://auth.iam.tianv.com/status | 服务运行状况 |

## 常用操作
| 操作 | 步骤 |
|------|------|
| 添加用户 | admin-console → 用户管理 → 添加用户 |
| 重置密码 | admin-console → 用户管理 → 用户 → 重置密码 |
| 修改策略 | admin-console → 安全设置 |
| 查看日志 | admin-console → 审计日志 |
| 修改密码 | 用户门户 → 安全 → 修改密码 |
| 忘记密码 | 登录页 → 忘记密码链接 |
```
