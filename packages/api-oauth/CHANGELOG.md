# @autional/api-oauth

## 0.6.1

### Patch Changes

- c7ac451: 同步服务 API：OAuth 客户端新增 `kind` 字段（`portal` / `idp`，空 = 普通应用），
  供同意页与接入工具区分「租户门户客户端」与独立应用客户端。
- Updated dependencies [c7ac451]
- Updated dependencies [c7ac451]
  - @autional/core@0.4.1

## 0.6.0

### Minor Changes

- f6f703a: 补齐服务侧新增/变更的 API（2026-10-28，对齐服务入库的 `internal/docs/docs.go`）：

  - `@autional/api-profile`：新增 `putProfileAvatar`（`PUT /profile/api/v1/profile/avatar`，头像上传）。
  - `@autional/api-storage`：新增 `getStoragePublicFilesContentByFiles`（`GET /storage/api/v1/storage/public/files/{file_id}/content`）。
  - `@autional/api-oauth`：`ConsentResponse` 补 `clientName` / `logoUri` / `website`（服务 dto 早已有，SDK 落后）。

  生成器与工作区守卫改为同读服务入库的 `internal/docs/docs.go`：`swagger/swagger.json` 被各服务
  `.gitignore` 排除（fresh clone / CI 上没有这个文件），且可能是旧一代 swag 的产物 —— 按它生成会
  把已入库的正确形态换掉（本次 `@autional/api-compliance` 就是这么被改错的，已回正，故不升版本）。
  同批两道门禁：`scripts/check-generated-packages.mjs` + `.github/workflows/sdk-gate.yml`（本仓自洽与构建），
  以及工作区仓 `scripts/ci/check-sdk-generated.py`（服务 API 面对基线对账，CI 步 [79]）。
