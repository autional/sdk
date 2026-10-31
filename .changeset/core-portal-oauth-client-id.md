---
"@autional/core": patch
---

`TenantAuthConfig` 新增 `portalOAuthClientId`（租户门户客户端 `client_id`）。

- 优先读服务端新字段 `portal_oauth_client_id`，缺失时回落旧字段 `oauth_client_id`；
- 旧字段 `oauthClientId` 标 `@deprecated`（值仍保留，服务端兼容下发）；
- 语义提醒：门户客户端**不是**应用 `appId`，第三方应用须在管理后台建独立 OAuth 客户端。
