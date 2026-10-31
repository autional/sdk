---
"@autional/api-oauth": patch
---

同步服务 API：OAuth 客户端新增 `kind` 字段（`portal` / `idp`，空 = 普通应用），
供同意页与接入工具区分「租户门户客户端」与独立应用客户端。
