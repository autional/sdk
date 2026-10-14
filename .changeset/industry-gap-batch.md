---
"@autional/core": patch
---

定级说明（照 0.3.2 / 0.3.3 先例）：minor 会触发 0.x peer 依赖级联——`changeset status` 探针实测：core minor ⇒ 29 个依赖包被升 major（→ 1.0.0），远超本轮范围，故按 patch 发布。本波以增量为主，含两处既有行为微调、需下游周知：① `tokenExpirySkew` 默认 30 秒——既有应用默认开启请求前预刷新（正常会话行为不变，仅减少临期 401；失败不清会话，唯服务端复用检测例外）；② `tenantId` 属性在共享 issuer 下的旧误值（主机首段，如 `api`）改正为 `''`，并新增 `tenantSlug` / `getPortalUrl`。

行业缺口补齐（三波）+ 租户 slug 工具：

- **多标签会话修复**：刷新成功广播 `TOKEN_REFRESHED`（此前无发送点——其他标签页复用旧 refresh token 会触发服务端复用检测，整族令牌被撤销）；`TOKEN_REUSE` 与登出广播 `LOGOUT`。复用检测对齐现役服务端码：identity 面 `40000502` + "has been reused" 文案、oauth 面 `invalid_grant` + "reused" 描述（原匹配的 400002xx 系历史误值，现役栈不触发）；其余刷新失败不清会话（清理由 401 路径统一执行，5xx/429 等瞬态失败不再误杀会话）。新增平台 `sessionStoragePlatform`（随标签页关闭失效）。
- **RFC 7009 令牌撤销**：`revokeTokens()`（按 token_type_hint 分别撤销 AT/RT；部分失败静默、全失败抛错）；SSO 登出先撤销本客户端令牌（限时 1.5s，不阻塞）再跳 `end_session_endpoint`。
- **B2C 方法暴露**（`AuthClient` + 主类双层）：`forgotPassword` / `resetPassword` / `sendVerificationEmail` / `verifyEmail` / `updateProfile` / `getSessions` / `revokeSession` / `revokeOtherSessions` / `reauthenticate`（step-up，单次 5 分钟）/ `deleteAccount`（内部自动 step-up + `X-StepUp-Token`）；`createTrialTenant` 返回 `slug`；新增 `upgradeTrial`。
- **请求前预刷新**：`tokenExpirySkew`（秒，默认 30，0 禁用）——剩余寿命不足时先刷新再发请求；预刷新失败不清会话（留给 401 路径兜底；唯服务端复用检测命中例外——全族已撤销，立即清本地并广播 `LOGOUT`）。
- **RFC 8628 设备码流**：`requestDeviceCode` / `loginWithDeviceCode`（用户码回调、interval / slow_down / 过期 / 拒绝处理、`AbortSignal` 取消）。
- **DPoP（RFC 9449，opt-in）**：`dpop: true` 启用 `DpopManager`（P-256 JWS proof；仅作用于 oauth 令牌族端点）。
- **租户 slug 与门户 URL**：`tenantSlug` 配置 + `getPortalUrl(portal)`（控制台门户拼 `/<slug>/`；developer/status 全局）；导出 `buildPortalUrl` / `extractTenantSlugFromIssuer` / `resolveAuthOrigin`。

新导出类型：`RevokeTokensOptions` / `ResetPasswordRequest` / `SessionInfo` / `SessionList` / `ProfileUpdate` / `ReauthenticateResult` / `DeleteAccountOptions` / `TrialTenantResult` / `DeviceCodeInfo` / `DeviceLoginOptions` / `PortalName`。

已知限制：敏感端点（step-up / 销户）仅支持 `plain` / `hash` 传输模式；DPoP 需服务端支持且仅 oauth 面；设备流验证页（`/device`）依赖服务端部署。
