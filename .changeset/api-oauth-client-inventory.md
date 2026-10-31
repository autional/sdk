---
"@autional/api-oauth": patch
---

同步服务 API：新增 `GET /admin/oauth/clients/inventory`（OAuth 客户端台账，跨租户只读），
返回 `ClientInventoryItem`（client_id / name / alias / kind / tenant_id / website /
redirect_hosts / cors_origins / is_confidential / status / created_at）。
同时补齐此前落后于 `docs.go` 的类型变更（`CORSOriginsResponse`、`ConsentResponse.alias` 等）。
