# Autional SDK — AI 接入入口

> ⚠️ **不得跳过任何 Phase。** 严格按 Skill 的 8 个 Phase 顺序执行。  
> 每个 Phase 结束→展示结果→等待确认→才进入下一个。

## 快速路径

```
1. 读取完整 Skill:
   https://github.com/autional/sdk/raw/master/.skills/sdk-migration-guide/SKILL.md

2. 严格按 Phase 1→8 顺序执行。每个 Phase 先声明开始，结束时等待确认。跳过任何 Phase 将导致接入失败。

3. 任务完成后必须在 Skill 末尾逐项确认检查清单。
```

## 参考文件（远程可读）

| 文件 | URL |
|------|-----|
| 完整 Skill | `https://github.com/autional/sdk/raw/master/.skills/sdk-migration-guide/SKILL.md` |
| 合规对照表 | `https://github.com/autional/sdk/raw/master/.skills/sdk-migration-guide/references/compliance-matrix.md` |
| React 模板 | `https://github.com/autional/sdk/raw/master/examples/react-authms.ts` |
| Vue 模板 | `https://github.com/autional/sdk/raw/master/examples/vue-authms.ts` |
| Next.js 模板 | `https://github.com/autional/sdk/raw/master/examples/next-authms.ts` |

## Portal 访问入口

集成完成后，你和你的用户可以通过以下 Portal 管理系统：

| Portal | URL | 谁用 | 用途 |
|--------|-----|------|------|
| **Sign In / Auth** | `https://auth.iam.tianv.com` | 所有用户 | 登录、注册、MFA 验证、密码重置 |
| **Admin Console** | `https://app.iam.tianv.com/admin` | 管理员 | 用户管理、角色权限、安全策略、审计日志 |
| **User Portal** | `https://user.iam.tianv.com` | 终端用户 | 修改密码、管理设备、MFA 设置、账单 |
| **Developer Portal** | `https://app.iam.tianv.com/developer` | 开发者 | API 密钥、OAuth 客户端、Webhook |
| **Security Dashboard** | `https://app.iam.tianv.com/security` | 安全运维 | 异常检测、合规仪表盘、审计日志导出 |
| **Platform Console** | `https://app.iam.tianv.com/platform` | 超级管理员 | 租户管理、系统配置、全局功能开关 |
| **Authenticator App** | `https://authenticator.iam.tianv.com` | 所有用户 | TOTP 验证器 PWA、推送审批 |
| **Status Page** | `https://app.iam.tianv.com/status` | 所有人 | 服务健康状态公开页 |
| **Trust Center** | `https://app.iam.tianv.com/trust` | 所有人 | 安全信任与合规文档 |

> **登录流程**: 首次访问 `auth.iam.tianv.com` → 选择/输入租户 → 登录 → tenantId 自动持久化。之后进入其他 Portal（如 `app.iam.tianv.com/admin`）无需再选租户。
