# @autional/core

## 0.3.4

### Patch Changes

- 11a3335: 定级说明（照 0.3.2 / 0.3.3 先例）：minor 会触发 0.x peer 依赖级联——`changeset status` 探针实测：core minor ⇒ 29 个依赖包被升 major（→ 1.0.0），远超本轮范围，故按 patch 发布。本波以增量为主，含两处既有行为微调、需下游周知：① `tokenExpirySkew` 默认 30 秒——既有应用默认开启请求前预刷新（正常会话行为不变，仅减少临期 401；失败不清会话，唯服务端复用检测例外）；② `tenantId` 属性在共享 issuer 下的旧误值（主机首段，如 `api`）改正为 `''`，并新增 `tenantSlug` / `getPortalUrl`。

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

## 0.3.3

### Patch Changes

- 717a5f3: > 定级说明（照 sso-oauth-alignment 先例）：minor 会触发 0.x peer 依赖级联（~40 包 → 1.0.0），远超本轮范围；logout 为增强性变更（SSO 会话补全链注销 + 新增可选参数），identity 路径行为不变。

  登出升级：RP-Initiated Logout（OIDC end_session_endpoint）：

  - `logout(options?)`：先清本地（内存 + 持久化）后按会话模式分流。SSO 会话整页跳转 discovery 的 `end_session_endpoint`（`id_token_hint`[未过期时] + `client_id` + `post_logout_redirect_uri`[默认 `window.location.origin + '/'`] + `state`[默认生成]）；endpoint 不可得（未注入 discovery / 未发现）→ fallback 仅清本地。identity（password）会话保持原 POST 吊销行为不变。新增类型 `LogoutOptions`。
  - `TokenManager`：新增 `idToken` 落存/读取/清理三态（`setIdToken` / `getIdToken`），与 AT/RT 同级持久化；旧版持久化载荷缺字段兼容（读取得 null）。
  - `handleAuthResponse`：落存响应中的 `id_token`；identity/register 等无该字段的响应显式清空（防 stale hint）。
  - 新增导出：`buildEndSessionUrl`（URL 构造工具）及 `EndSessionParams` 类型。

  注：过期/解码失败的 `id_token_hint` 会被服务端拒绝（400），SDK 自动省略该参数。

## 0.3.2

### Patch Changes

- f856d12: OAuth 登录方法对齐 Autional SSO（授权码 + PKCE 强制）：

  - `loginWithOAuth` 重写为跳到 Autional auth 域 `/oauth/api/v1/oauth/authorize`（PKCE S256 + state 防 CSRF，verifier 存 sessionStorage）。`OAuthOptions` 破坏性变更：移除 `provider`/`tenantId`，新增 `clientId`（默认取 SDK 配置 `appId`）、`scope`、`authorizeUrl`、`extraParams`；`appId` 现在同时充当 OAuth client_id。
  - `handleOAuthCallback` 重写：校验 state → 以 `client_id + code_verifier` 换票（此前缺这两个参数，服务端必拒）→ 拉取 OIDC userinfo 填充用户 → 记录会话为 SSO 模式。
  - `refreshToken` 按会话模式分派：SSO 会话自动走 oauth `/oauth/api/v1/oauth/refresh`（公开客户端凭 client_id），密码会话行为不变。
  - 新增导出：`generatePkce` / `generateState` / `buildAuthorizeUrl` / `resolveSsoAuthorizeUrl` 及 PKCE session 工具，供自定义流程使用。
  - `handleOAuthCallback` 并发幂等：同一授权码的在飞换票共享一个 Promise（React StrictMode 双 effect 等场景不再撞「authorization code already used」）。

  定级说明：旧 OAuth 路径此前无法完成换票（回调缺 `client_id` / `code_verifier`，服务端必拒），实际无可用旧行为可破坏，故按 patch 发布。

## 0.3.1

### Patch Changes

- e20ad03: fix(core): align changePassword with server contract

  - Send `old_password` / `new_password` (was `current_password` / `password`; the server DTO rejects the old names with
    400).
  - Preprocess both passwords for transmission per the tenant's auth config, so hash-mode tenants can actually change
    passwords.
  - Fetch the auth config for the client's configured tenant instead of always the `default` config (wrong hash input
    for tenant-scoped hash mode).
  - `symmetric` / `asymmetric` transmission: the server change-password chain has no decrypt path, so those requests now
    fail with an explicit error (`61001670`) instead of silently storing an unrecoverable password.
