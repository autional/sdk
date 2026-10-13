---
"@autional/core": minor
---

登出升级：RP-Initiated Logout（OIDC end_session_endpoint）：

- `logout(options?)`：先清本地（内存 + 持久化）后按会话模式分流。SSO 会话整页跳转 discovery 的 `end_session_endpoint`（`id_token_hint`[未过期时] + `client_id` + `post_logout_redirect_uri`[默认 `window.location.origin + '/'`] + `state`[默认生成]）；endpoint 不可得（未注入 discovery / 未发现）→ fallback 仅清本地。identity（password）会话保持原 POST 吊销行为不变。新增类型 `LogoutOptions`。
- `TokenManager`：新增 `idToken` 落存/读取/清理三态（`setIdToken` / `getIdToken`），与 AT/RT 同级持久化；旧版持久化载荷缺字段兼容（读取得 null）。
- `handleAuthResponse`：落存响应中的 `id_token`；identity/register 等无该字段的响应显式清空（防 stale hint）。
- 新增导出：`buildEndSessionUrl`（URL 构造工具）及 `EndSessionParams` 类型。

注：过期/解码失败的 `id_token_hint` 会被服务端拒绝（400），SDK 自动省略该参数。
