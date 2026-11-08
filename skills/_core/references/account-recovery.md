<!-- lang:en -->
# Identifier and account recovery

> Default registration is username + password.
> Email/phone are account identifiers only after verification; unverified values are never stored.
> Recovery uses an app-side recovery code; admin reset is the fallback.
<!-- /lang:en -->
<!-- lang:zh -->
# 标识符与账号找回

> 默认注册是用户名 + 密码。
> 邮箱/手机只有在验证通过后才作为账号标识；未验证值不入库。
> 找回用应用侧恢复码；管理员重置兜底。
<!-- /lang:zh -->

<!-- lang:en -->
## Identifier matrix

| Identifier | Friction | Recovery | Anti-abuse |
|---|---|---|---|
| username + password (default) | lowest | app-side recovery code / admin | CAPTCHA + rate limit |
| verified email + password | medium | recovery code; verified email OTP optional | CAPTCHA + rate limit |
| verified phone + password | medium | recovery code; verified phone OTP optional | SMS cost + rate limit |
| SSO only | depends on IdP | at the IdP | IdP policy |

Registration without a username is rejected. Email/phone are optional account identifiers, but they must pass a verification code before the account is created or the identifier is attached.
An unverified email/phone must not be written to the identity table, used for login, recovery, notifications, or uniqueness checks.
The default login is username + password; email/phone login is allowed only after verification.

## Recovery options

| Option | Requires | If the user loses it | Notes |
|---|---|---|---|
| app-side recovery code (default) | codes generated at signup / in settings | account unrecoverable | 10 single-use codes, hashed, shown once; verify, never reuse |
| admin reset | an operator | requires an operator | audited runbook |
| verified email/phone OTP (optional) | the identifier was verified and the app can send | unrecoverable unless another channel exists | do not enable without a delivery channel |
| recovery contact (optional) | the app can send | contact must still be reachable | only with a delivery channel |
| none | — | account unrecoverable | record it in `AUTIONAL_SETUP.md` |

The platform has no account recovery code; the app owns this mechanism.
The platform's `/auth/recovery/*` endpoints require delivery; use them only when the app can send.
Admin resets must be audited.

## Decision → implementation

| Decision | Where to apply | How to verify |
|---|---|---|
| Identifier | registration form (username) / verified code registration for email/phone | username registration returns 201; email/phone without code returns 400 |
| Email/phone verification | identity code endpoints; attach only after code success | verify DB has `verified_at`; no unverified identity row |
| Recovery code | app-side table + settings page | generate once, redeem once, reject reuse |
| Admin reset | operator runbook | reset one test account and check the audit log |
| Registration protection | CAPTCHA + rate limit | 3 failures → challenge; per-IP limit trips |

Field names vary by region and version; verify behaviour instead of trusting a 200.
<!-- /lang:en -->
<!-- lang:zh -->
## 标识符对照

| 标识符 | 摩擦 | 找回 | 防滥用 |
|---|---|---|---|
| 用户名 + 密码（默认） | 最低 | 应用侧恢复码 / 管理员 | CAPTCHA + 限流 |
| 已验证邮箱 + 密码 | 中 | 恢复码；已验证邮箱 OTP 可选 | CAPTCHA + 限流 |
| 已验证手机号 + 密码 | 中 | 恢复码；已验证手机 OTP 可选 | 短信成本 + 限流 |
| 仅 SSO | 取决于 IdP | 在 IdP 找回 | IdP 策略 |

注册必须有用户名。邮箱/手机是可选账号标识，但必须先通过验证码，才能创建账号或绑定标识。
未验证邮箱/手机不得写入身份表，不得用于登录、找回、通知或唯一性判断。
默认登录是用户名 + 密码；邮箱/手机登录只在验证通过后允许。

## 找回方式

| 方式 | 前提 | 用户丢失后 | 说明 |
|---|---|---|---|
| 应用侧恢复码（默认） | 注册时/设置页生成 | 账号不可恢复 | 10 个一次性码，哈希存储，只显示一次；校验后作废，拒绝复用 |
| 管理员重置 | 有运维人员 | 需要人工 | 必须审计 |
| 已验证邮箱/手机验证码（可选） | 标识已验证且客户能发送 | 没有其他通道则不可恢复 | 没有投递通道时不要启用 |
| 恢复联系人（可选） | 客户有发送能力 | 联系人仍须可达 | 仅有投递通道时启用 |
| 不支持找回 | — | 账号不可恢复 | 写进 `AUTIONAL_SETUP.md` |

平台没有账号恢复码；这个机制由应用自己实现。
平台的 `/auth/recovery/*` 依赖投递能力；只有客户能发送时才使用。
管理员重置必须审计。

## 决策 → 落地

| 决策 | 落地位置 | 怎么验证 |
|---|---|---|
| 标识符 | 注册表单（用户名）；邮箱/手机走验证码注册 | 用户名注册返回 201；邮箱/手机无验证码返回 400 |
| 邮箱/手机验证 | identity 验证码接口；通过后才绑定 | 查库确认 `verified_at`；不存在未验证身份行 |
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
Identifier: username (default) | verified email | verified phone | SSO only
Recovery: app-side recovery code | admin | none
If none: account is unrecoverable (accepted by <user> on <date>)
```
<!-- /lang:en -->
<!-- lang:zh -->
## 决策记录

复制到 `AUTIONAL_SETUP.md`：

```
Identifier: username (default) | verified email | verified phone | SSO only
Recovery: app-side recovery code | admin | none
If none: account is unrecoverable (accepted by <user> on <date>)
```
<!-- /lang:zh -->
