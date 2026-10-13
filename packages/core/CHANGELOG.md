# @autional/core

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
