---
"@autional/core": patch
---

修复 `createTrialTenant()` 公开注册 401（`40000502`）：请求路径少一层服务段，被网关 JWT 守卫前置拦截，从未到达 tenant-service。

- 旧：`POST {baseUrl}/tenant/api/v1/public/tenants` → 命中网关 `/bff/tenant/api/v1`（`audience: user`）宽前缀 → 无 JWT → 401 `40000502`（`service:"middleware"`）。
- 新：`POST {baseUrl}/tenant/api/v1/tenant/public/tenants` → 命中网关精确公开条目（`public: true`）→ tenant-service 公开注册。
- 影响版本：**0.3.0–0.3.7**（`createTrialTenant` 自 0.3.0 首发即带此错路径）。判据是发布包 `main`/`module` 指向的 dist 入口：0.2.x 的 dist 不含该方法，0.3.0 起 dist 均为错路径（逐版原样输出见 `lite/sdk-trial-tenant-path-20261030/version-matrix.md`）。所有按 Skill 走「试用租户」的新接入都会被 401 阻断。
- 回归保护：新增 3 例单测（URL 精确断言 pin 住服务段 + `agreement_accepted` 透传 + 网关 401 错误面）。
- `@autional/api-tenant` 的 `postTenantPublicTenants()` 路径本就正确，不受影响。

线上复现与根因：`lite/sdk-trial-tenant-path-20261030/rca.md`。
