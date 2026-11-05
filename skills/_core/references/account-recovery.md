<!-- lang:en -->
# Identifier and account recovery

> Reference file for the Autional Onboarding skill.
> Use it to pick an identifier strategy and a recovery path.
> Both answers are required before signup is considered complete.
<!-- /lang:en -->
<!-- lang:zh -->
# 标识符与账号找回

> Autional 接入 Skill 的引用文件。
> 用于选择标识符策略与找回方式。
> 两个答案都必须在注册流程完成前给出。
<!-- /lang:zh -->

<!-- lang:en -->
## Identifier matrix

| Identifier | Friction | Recovery | Anti-abuse |
|---|---|---|---|
| username + password | lowest | recovery code / admin | CAPTCHA + rate limit |
| username + optional email | low | email hint / code / admin | CAPTCHA + rate limit |
| email + verification | medium | email reset | CAPTCHA + rate limit |
| phone + SMS | medium | SMS reset | SMS cost + rate limit |
<!-- /lang:en -->
<!-- lang:zh -->
## 标识符对照

| 标识符 | 摩擦 | 找回 | 防滥用 |
|---|---|---|---|
| 用户名 + 密码 | 最低 | 恢复码 / 管理员 | CAPTCHA + 限流 |
| 用户名 + 可选邮箱 | 低 | 邮箱线索 / 恢复码 / 管理员 | CAPTCHA + 限流 |
| 邮箱 + 验证 | 中 | 邮件重置 | CAPTCHA + 限流 |
| 手机号 + 短信 | 中 | 短信重置 | 短信成本 + 限流 |
<!-- /lang:zh -->

<!-- lang:en -->
## Recovery options

| Option | Works without email/phone | User loses it → | Notes |
|---|---|---|---|
| recovery code | yes | account unrecoverable | generate at signup, show once |
| optional email | yes (unverified) | no recovery | only a hint, not proof |
| admin reset | yes | requires operator | document the process |
| none | yes | account unrecoverable | must be recorded in AUTIONAL_SETUP.md |

Limits: recovery codes are single-use (10 per batch; 5 attempts/hour); email links expire in 15–30 minutes; admin resets must be audited.

## Decision → implementation

| Decision | Where to apply | How to verify |
|---|---|---|
| Identifier | tenant auth policy / `login_methods` | open the login page; the chosen field renders |
| Recovery code | app-side table + settings page | generate once, redeem once, reject reuse |
| Optional email | profile + verification flow | send a test email; only verified emails can reset |
| Admin reset | operator runbook | one test account reset, audited |
| Registration protection | CAPTCHA + rate limit | 3 failures → challenge; per-IP limit trips |

Exact portal field names vary by region and version; verify behaviour instead of trusting a 200.
<!-- /lang:en -->
<!-- lang:zh -->
## 找回方式

| 方式 | 无邮箱/手机可用 | 用户丢失后 | 说明 |
|---|---|---|---|
| 恢复码 | 是 | 账号不可恢复 | 注册时生成，只显示一次 |
| 可选邮箱 | 是（未验证） | 无法找回 | 只是线索，不是证明 |
| 管理员重置 | 是 | 需要人工 | 把流程写进文档 |
| 不支持找回 | 是 | 账号不可恢复 | 必须记录在 AUTIONAL_SETUP.md |

限制：恢复码一次性（一批 10 个；每小时最多尝试 5 次）；邮件链接 15–30 分钟过期；管理员重置必须审计。

## 决策 → 落地

| 决策 | 落地位置 | 怎么验证 |
|---|---|---|
| 标识符 | 租户认证策略 / `login_methods` | 打开登录页，目标输入项已渲染 |
| 恢复码 | 应用侧表 + 设置页 | 生成一次、兑换一次、拒绝复用 |
| 可选邮箱 | 资料页 + 验证流程 | 发一封测试邮件；只有已验证邮箱能重置 |
| 管理员重置 | 运维手册 | 重置一个测试账号并留审计 |
| 注册防护 | CAPTCHA + 限流 | 3 次失败出挑战；同 IP 限流生效 |

门户字段名随区域与版本变化；用行为验证，不要只信 200。
<!-- /lang:zh -->

<!-- lang:en -->
## SSO users

SSO users have no local password. Recovery happens at the identity provider.
If a user has both password and SSO, define the linking rule before enabling both.
<!-- /lang:en -->
<!-- lang:zh -->
## SSO 用户

SSO 用户没有本应用密码，找回在身份提供方完成。
若用户同时有密码与 SSO，先定义账号合并规则，再同时启用。
<!-- /lang:zh -->

<!-- lang:en -->
## Decision record

Copy this into `AUTIONAL_SETUP.md`:
<!-- /lang:en -->
<!-- lang:zh -->
## 决策记录

复制到 `AUTIONAL_SETUP.md`：
<!-- /lang:zh -->

```
Identifier: <username | email | phone>
Recovery: <code | email hint | admin | none>
If none: account is unrecoverable (accepted by <user> on <date>)
```
