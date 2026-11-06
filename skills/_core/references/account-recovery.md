<!-- lang:en -->
# Identifier and account recovery

> Registration requires email or phone (platform `RegisterRequest.Validate`); username is only a login alias.
> The app does not send email/SMS codes by default.
> Recovery uses an app-side recovery code; admin reset is the fallback.
<!-- /lang:en -->
<!-- lang:zh -->
# 标识符与账号找回

> 注册必须填邮箱或手机号（平台 `RegisterRequest.Validate`）；用户名只作登录别名。
> 默认不发送邮件/短信验证码。
> 找回用应用侧恢复码；管理员重置兜底。
<!-- /lang:zh -->

<!-- lang:en -->
## Identifier matrix

| Identifier | Friction | Recovery | Anti-abuse |
|---|---|---|---|
| email + password (default) | low | app-side recovery code / admin | CAPTCHA + rate limit |
| phone + password | medium | app-side recovery code / admin | CAPTCHA + rate limit |
| email + phone (dual) | high | app-side recovery code / admin | both fields |
| SSO only | depends on IdP | at the IdP | IdP policy |

Registration without email or phone is rejected (`email or phone is required`).
The email/phone is stored unverified; no code is sent. It is a registration identifier, not a recovery channel by itself.
An optional username (3–32 chars) is the day-to-day login alias.

## Recovery options

| Option | Requires | If the user loses it | Notes |
|---|---|---|---|
| app-side recovery code (default) | codes generated at signup / in settings | account unrecoverable | 10 single-use codes, hashed, shown once; verify, never reuse |
| admin reset | an operator | requires an operator | audited runbook |
| email/phone OTP (optional) | the app can send email/SMS | unrecoverable unless another channel exists | do not enable without a delivery channel |
| recovery contact (optional) | the app can send | contact must still be reachable | only with a delivery channel |
| none | — | account unrecoverable | record it in `AUTIONAL_SETUP.md` |

The platform has no account recovery code; the app owns this mechanism.
The platform's `/auth/recovery/*` endpoints require delivery; use them only when the app can send.
Admin resets must be audited.

## Decision → implementation

| Decision | Where to apply | How to verify |
|---|---|---|
| Identifier | registration form (`email` or `phone`) + tenant `login_methods` | submit each chosen identifier; a missing email/phone returns 400 |
| Recovery code | app-side table + settings page | generate once, redeem once, reject reuse |
| Admin reset | operator runbook | reset one test account and check the audit log |
| Registration protection | CAPTCHA + rate limit | 3 failures → challenge; per-IP limit trips |

Field names vary by region and version; verify behaviour instead of trusting a 200.
<!-- /lang:en -->
<!-- lang:zh -->
## 标识符对照

| 标识符 | 摩擦 | 找回 | 防滥用 |
|---|---|---|---|
| 邮箱 + 密码（默认） | 低 | 应用侧恢复码 / 管理员 | CAPTCHA + 限流 |
| 手机号 + 密码 | 中 | 应用侧恢复码 / 管理员 | CAPTCHA + 限流 |
| 邮箱 + 手机号（双通道） | 高 | 应用侧恢复码 / 管理员 | 双字段 |
| 仅 SSO | 取决于 IdP | 在 IdP 找回 | IdP 策略 |

注册时邮箱和手机号都没有 → 拒绝（`email or phone is required`）。
邮箱/手机号按未验证保存，**不发送验证码**。它只是注册标识符，本身不是找回通道。
可选用户名（3–32 位）是日常登录别名。

## 找回方式

| 方式 | 前提 | 用户丢失后 | 说明 |
|---|---|---|---|
| 应用侧恢复码（默认） | 注册时/设置页生成 | 账号不可恢复 | 10 个一次性码，哈希存储，只显示一次；校验后作废，拒绝复用 |
| 管理员重置 | 有运维人员 | 需要人工 | 必须审计 |
| 邮箱/手机验证码（可选） | 客户有邮件/短信发送能力 | 没有其他通道则不可恢复 | 没有投递通道时不要启用 |
| 恢复联系人（可选） | 客户有发送能力 | 联系人仍须可达 | 仅有投递通道时启用 |
| 不支持找回 | — | 账号不可恢复 | 写进 `AUTIONAL_SETUP.md` |

平台没有账号恢复码；这个机制由应用自己实现。
平台的 `/auth/recovery/*` 依赖投递能力；只有客户能发送时才使用。
管理员重置必须审计。

## 决策 → 落地

| 决策 | 落地位置 | 怎么验证 |
|---|---|---|
| 标识符 | 注册表单（`email` 或 `phone`）+ 租户 `login_methods` | 分别提交每种标识符；缺邮箱/手机应返回 400 |
| 恢复码 | 应用侧表 + 设置页 | 生成一次、兑换一次、拒绝复用 |
| 管理员重置 | 运维手册 | 重置一个测试账号并查审计日志 |
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

```
Identifier: email | phone | email+phone | SSO only (username is a login alias)
Recovery: app-side recovery code | admin | none
If none: account is unrecoverable (accepted by <user> on <date>)
```
<!-- /lang:en -->
<!-- lang:zh -->
## 决策记录

复制到 `AUTIONAL_SETUP.md`：

```
Identifier: email | phone | email+phone | SSO only (username is a login alias)
Recovery: app-side recovery code | admin | none
If none: account is unrecoverable (accepted by <user> on <date>)
```
<!-- /lang:zh -->
