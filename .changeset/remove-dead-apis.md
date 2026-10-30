---
"@autional/core": minor
"@autional/miniapp": minor
---

移除两条**架构上不可用/服务端不存在**的 API（breaking，0.x minor）：

- `@autional/core`：删除 `upgradeTrial(tenantId, plan)`（含 `Autional` 与 `AuthClient` 双层）。
  该方法打 `POST /tenant/api/v1/admin/tenants/{id}/upgrade`——网关按最长前缀匹配到
  `/bff/tenant/api/v1/admin/tenants`（audiences admin/platform + required_roles），
  且客户端从不携带 `Authorization`。SDK 永远拿不到 admin 平面凭据，方法在任何调用形态下
  都不可能成功。试用升级请走管理门户（`{PORTAL_ADMIN}/{slug}/…`）或计费/管理面 API。
- `@autional/miniapp`：删除 `loginWithWechat()` / `getPhoneNumber()` 与相关类型
  （`AutionalWithWechat`、`WechatPhoneEvent`、`UseAutionalReturn.loginWithWechat`）。
  它们调用 identity 的 wechat 登录/手机号端点，而 identity 服务端**从未实现**这些端点
  （全仓检索零命中）——任何调用都只会拿到网关兜底 404/401。小程序端请走标准登录方式
  （密码/验证码/社交 OAuth 的 H5 跳转）；服务端微信能力就绪后再以独立包提供。
- `createAutional()` 返回类型由 `AutionalWithWechat` 收窄为 `Autional`。

回归保护：`scripts/ci/check-gateway-route-policy.py` 的 P15（SDK 调用点 ↔ 网关/上游对账）
已覆盖此类缺陷；移除后该门禁不再有 miniapp 的 3 条已知例外。
