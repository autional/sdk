<!-- generated: core@d7304ea45499 · region: cn · lang: zh — do not edit directly -->

# 标识符与账号找回

> Autional 接入 Skill 的引用文件。
> 用于选择标识符策略与找回方式。
> 两个答案都必须在注册流程完成前给出。

## 标识符对照

| 标识符 | 摩擦 | 找回 | 防滥用 |
|---|---|---|---|
| 用户名 + 密码 | 最低 | 恢复码 / 管理员 | CAPTCHA + 限流 |
| 用户名 + 可选邮箱 | 低 | 邮箱线索 / 恢复码 / 管理员 | CAPTCHA + 限流 |
| 邮箱 + 验证 | 中 | 邮件重置 | CAPTCHA + 限流 |
| 手机号 + 短信 | 中 | 短信重置 | 短信成本 + 限流 |

## 找回方式

| 方式 | 无邮箱/手机可用 | 用户丢失后 | 说明 |
|---|---|---|---|
| 恢复码 | 是 | 账号不可恢复 | 注册时生成，只显示一次 |
| 可选邮箱 | 是（未验证） | 无法找回 | 只是线索，不是证明 |
| 管理员重置 | 是 | 需要人工 | 把流程写进文档 |
| 不支持找回 | 是 | 账号不可恢复 | 必须记录在 AUTIONAL_SETUP.md |

## SSO 用户

SSO 用户没有本应用密码，找回在身份提供方完成。
若用户同时有密码与 SSO，先定义账号合并规则，再同时启用。

## 决策记录

复制到 `AUTIONAL_SETUP.md`：

```
Identifier: <username | email | phone>
Recovery: <code | email hint | admin | none>
If none: account is unrecoverable (accepted by <user> on <date>)
```
