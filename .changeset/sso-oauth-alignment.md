---
"@autional/core": minor
---

OAuth 登录方法对齐 Autional SSO（授权码 + PKCE 强制）：

- `loginWithOAuth` 重写为跳到 Autional auth 域 `/oauth/api/v1/oauth/authorize`（PKCE S256 + state 防 CSRF，verifier 存 sessionStorage）。`OAuthOptions` 破坏性变更：移除 `provider`/`tenantId`，新增 `clientId`（默认取 SDK 配置 `appId`）、`scope`、`authorizeUrl`、`extraParams`；`appId` 现在同时充当 OAuth client_id。
- `handleOAuthCallback` 重写：校验 state → 以 `client_id + code_verifier` 换票（此前缺这两个参数，服务端必拒）→ 拉取 OIDC userinfo 填充用户 → 记录会话为 SSO 模式。
- `refreshToken` 按会话模式分派：SSO 会话自动走 oauth `/oauth/api/v1/oauth/refresh`（公开客户端凭 client_id），密码会话行为不变。
- 新增导出：`generatePkce` / `generateState` / `buildAuthorizeUrl` / `resolveSsoAuthorizeUrl` 及 PKCE session 工具，供自定义流程使用。
