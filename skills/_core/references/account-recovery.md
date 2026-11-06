<!-- lang:en -->
# Identifier and account recovery

> Reference file for the Autional Onboarding skill.
> Registration requires email or phone; username is only a login alias.
> Both answers are required before signup is considered complete.
<!-- /lang:en -->
<!-- lang:zh -->
# 标识符与账号找回

> Autional 接入 Skill 的引用文件。
> 注册必须使用邮箱或手机号；用户名只作登录别名。
> 两个答案都必须在注册流程完成前给出。
<!-- /lang:zh -->

<!-- lang:en -->
## Identifier matrix

| Identifier | Friction | Recovery | Anti-abuse |
|---|---|---|---|
| email + password (default) | low | code to the same email | CAPTCHA + rate limit |
| phone + password / SMS | medium | code to the same phone | SMS cost + rate limit |
| email + phone (dual) | high | either channel | both channels |
| SSO only | depends on IdP | at the IdP | IdP policy |

Registration without email or phone is rejected (`email or phone is required`).
An optional username (3–32 chars) can sign in, but cannot replace email/phone at signup.
Email verification is optional for login; it is required for email-based recovery.

## Recovery options

| Option | Requires | If the user loses it | Notes |
|---|---|---|---|
| code to the account's own email/phone | email or phone on file | unrecoverable unless another channel exists | `/auth/recovery/request`, `/verify`, `/complete` |
| recovery contact | a contact bound in settings | contact must still be reachable | `/auth/me/recovery-contacts`; `/auth/recover-account`, `/reset` |
| admin reset | an operator | requires an operator | audited runbook |
| none | — | account is unrecoverable | record it in `AUTIONAL_SETUP.md` |

There is no user-facing account recovery code. MFA backup codes are a separate second-factor mechanism, not an account recovery channel.
Codes expire and requests are rate-limited; admin resets must be audited.

## Decision → implementation

| Decision | Where to apply | How to verify |
|---|---|---|
| Identifier | registration form (`email` or `phone`) + tenant `login_methods` | submit each chosen identifier; a missing email/phone returns 400 |
| Email/phone recovery | identity `/auth/recovery/*` | request a code, receive it, complete the reset |
| Recovery contact | `/auth/me/recovery-contacts` | bind a contact, run `/auth/recover-account` |
| Admin reset | operator runbook | reset one test account and check the audit log |
| Registration protection | CAPTCHA + rate limit | 3 failures → challenge; per-IP limit trips |

Field names vary by region and version; verify behaviour instead of trusting a 200.
<!-- /lang:en -->
<!-- lang:zh -->
## 标识符对照

| 标识符 | 摩擦 | 找回 | 防滥用 |
|---|---|---|---|
| 邮箱 + 密码（默认） | 低 | 验证码发到同一邮箱 | CAPTCHA + 限流 |
| 手机号 + 密码 / 短信 | 中 | 验证码发到同一手机 | 短信成本 + 限流 |
| 邮箱 + 手机号（双通道） | 高 | 任一通道 | 双通道 |
| 仅 SSO | 取决于 IdP | 在 IdP 找回 | IdP 策略 |

注册时邮箱和手机号都没有 → 拒绝（`email or phone is required`）。
可选用户名（3–32 位）可用于登录，但不能替代注册时的邮箱/手机号。
邮箱验证对登录可选；但邮箱找回要求邮箱已验证。

## 找回方式

| 方式 | 前提 | 用户丢失后 | 说明 |
|---|---|---|---|
| 验证码发到账号自身邮箱/手机 | 已登记邮箱或手机 | 没有其他通道则不可恢复 | `/auth/recovery/request`、`/verify`、`/complete` |
| 恢复联系人 | 已在设置中绑定联系人 | 联系人仍须可达 | `/auth/me/recovery-contacts`；`/auth/recover-account`、`/reset` |
| 管理员重置 | 有运维人员 | 需要人工 | 必须审计 |
| 不支持找回 | — | 账号不可恢复 | 写进 `AUTIONAL_SETUP.md` |

没有用户自存的“账号恢复码”。MFA 备份码是独立的第二因素机制，不是账号找回通道。
验证码会过期，请求有限流；管理员重置必须审计。

## 决策 → 落地

| 决策 | 落地位置 | 怎么验证 |
|---|---|---|
| 标识符 | 注册表单（`email` 或 `phone`）+ 租户 `login_methods` | 分别提交每种标识符；缺邮箱/手机应返回 400 |
| 邮箱/手机找回 | identity `/auth/recovery/*` | 请求验证码、收到、完成重置 |
| 恢复联系人 | `/auth/me/recovery-contacts` | 绑定联系人，跑 `/auth/recover-account` |
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
Identifier: email | phone | email+phone | SSO only
Recovery: email/phone OTP | recovery contact | admin | none
If none: account is unrecoverable (accepted by <user> on <date>)
```
<!-- /lang:en -->
<!-- lang:zh -->
## 决策记录

复制到 `AUTIONAL_SETUP.md`：

```
Identifier: email | phone | email+phone | SSO only
Recovery: email/phone OTP | recovery contact | admin | none
If none: account is unrecoverable (accepted by <user> on <date>)
```
<!-- /lang:zh -->
