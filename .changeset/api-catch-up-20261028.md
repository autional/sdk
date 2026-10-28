---
"@autional/api-compliance": minor
"@autional/api-profile": minor
"@autional/api-storage": minor
---

补齐服务侧新增/变更的 API（2026-10-28 对齐）：

- `@autional/api-profile`：新增 `putProfileAvatar`（`PUT /profile/api/v1/profile/avatar`，头像上传）。
- `@autional/api-storage`：新增 `getStoragePublicFilesContentByFiles`（`GET /storage/api/v1/storage/public/files/{file_id}/content`）。
- `@autional/api-compliance`：模型跟随服务 swagger —— 新增 `Evidence` / `DeletedAt`，移除 `PublicEvidenceItem`，`putAdminComplianceAiDecisionsByAiDecisions` 返回类型由 `SimpleResponse` 改为 `AIDecisionResponse`（**对 TS 消费者是破坏性变更**；0.x 阶段按 minor 计）。

三个包此前落后于服务 swagger，因 SDK 仓与服务仓互相不可见而无人发现。同批新增两道门禁：
`scripts/check-generated-packages.mjs` + `.github/workflows/sdk-gate.yml`（本仓自洽与构建），
以及工作区仓 `scripts/ci/check-sdk-generated.py`（服务 API 面对基线对账，CI 步 [79]）。
