---
"@autional/core": patch
"@autional/node": patch
---

修复 OIDC 端点/scope 两类缺陷：`.well-known` 恒挂 origin 根（`@autional/node` 的 `jwks` 模式不再受 `/bff` 前缀影响），默认登录 scope 补 `read`（平台 18 个读服务 + 网关 BFF 强制项）
