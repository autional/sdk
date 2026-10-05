# Autional SDK — AI 接入入口

> ⚠️ **不得跳过任何 Phase。** 严格按 Skill 的 Phase 0→8 顺序执行。  
> 每个 Phase 结束→展示结果→等待确认→才进入下一个。

## 快速路径

```
1. 读取完整 Skill（按 region 二选一）:
   .com: https://www.autional.com/ai/skill.md
   .cn:  https://www.autional.cn/ai/skill.md

2. 严格按 Phase 0→8 顺序执行。每个 Phase 先声明开始，结束时等待确认。跳过任何 Phase 将导致接入失败。

3. 任务完成后必须在 Skill 末尾逐项确认检查清单。
```

## 参考文件（远程可读）

| 文件 | .com | .cn |
|------|------|-----|
| 完整 Skill | `https://www.autional.com/ai/skill.md` | `https://www.autional.cn/ai/skill.md` |
| 合规对照表 | `https://www.autional.com/ai/references/compliance-matrix.md` | `https://www.autional.cn/ai/references/compliance-matrix.md` |
| 配置模板 | `https://www.autional.com/ai/references/config-template.md` | `https://www.autional.cn/ai/references/config-template.md` |
| 兜底镜像 | `https://cdn.autional.com/ai/latest/SKILL.md` | `https://cdn.autional.cn/ai/latest/SKILL.md` |

> 兜底镜像仅在上表 canonical 域不可达时使用。只从当前 region 的 canonical 域抓取关联文件。

## 源码与模板

| 内容 | 地址 |
|------|------|
| Skill 实体源 | `sdk/skills/`（`_core/` 单一真源 · `_gen/` 生成器 · `autional-com/`、`autional-cn/` 生成物） |
| SDK 仓库 | `https://github.com/autional/sdk` |
| 框架接入模板 | `https://github.com/autional/sdk/tree/master/examples` |

## Portal 访问入口

集成完成后，你和你的用户可以通过以下 Portal 管理系统（按 region 选择）：

| Portal | .com | .cn | 谁用 | 用途 |
|--------|------|-----|------|------|
| **Auth / API** | `https://api.autional.com` | `https://api.autional.cn` | 所有用户 | 登录、注册、MFA 验证、密码重置 |
| **Admin** | `https://admin.autional.com` | `https://admin.autional.cn` | 管理员 | 用户管理、角色权限、安全策略、审计日志 |
| **User** | `https://user.autional.com` | `https://user.autional.cn` | 终端用户 | 修改密码、管理设备、MFA 设置 |
| **Security** | `https://security.autional.com` | `https://security.autional.cn` | 安全运维 | 异常检测、合规仪表盘、审计日志导出 |
| **Developer** | `https://developer.autional.com` | `https://developer.autional.cn` | 开发者 | API 密钥、OAuth 客户端、Webhook |
| **Status** | `https://status.autional.com` | `https://status.autional.cn` | 所有人 | 服务健康状态公开页 |

> **登录流程**: SDK 通过 `{issuer}/.well-known/openid-configuration` 发现认证端点；登录成功后 tenantId 自动关联并持久化（issuer 取对应 region 的 API 地址，如 `https://api.autional.com` / `https://api.autional.cn`）。
