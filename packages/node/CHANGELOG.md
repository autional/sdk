# @autional/node

## 0.6.0

### Minor Changes

- 680cd86: JWKS verification hardening (G4/G5/G18):

  - Unknown `kid` now forces one JWKS refresh (60s per-config cooldown), then fails closed.
  - `aud` is fail-closed: `audience` → issuer/origin → `appId`; empty allowlist rejects.
  - `verify: 'jwks'` requires `type=access` and `iss`; cache keys are partitioned by config.

## 0.5.0

### Minor Changes

- b5b933a: Onboarding: existing-tenant multi-app flow (one OAuth client per app), tenant/authorize/CORS preflight flags, and secret-hygiene in the generated setup doc. Node: add `verify: 'jwks'` local verification with `jwt-status` revocation checks.

### Patch Changes

- 5758462: 修复 OIDC 端点/scope 两类缺陷：`.well-known` 恒挂 origin 根（`@autional/node` 的 `jwks` 模式不再受 `/bff` 前缀影响），默认登录 scope 补 `read`（平台 18 个读服务 + 网关 BFF 强制项）
- Updated dependencies [5758462]
  - @autional/core@0.4.2

## Unreleased

### Minor Changes

- 新增 `verify: 'jwks'`：本地 RS256 验签 + `jwt-status` 撤销/`require_kid_after` 检查；
  支持 `jwksUrl` / `statusUrl` / `allowedIssuers` / `audience` / `jwksTtlMs`。
  默认缓存 JWKS 5 分钟、status 10 秒；未知 kid fail-closed。
- G4：未知 `kid` 立即强制重取一次 JWKS（绕过 TTL），同一 config 60 秒内最多一次
  （新增 `jwksForceCooldownMs` 可调）；重取后仍无键返回 `null`（fail closed）。
  缓存/并发语义不变：按 config 分区、singleflight、刷新失败保留上一版 keyset。
- G5：`aud` 默认值调整。显式 `audience` 优先（**推荐生产显式配置**）；未配置时回退
  `issuer` 本身及其 origin 根域（平台资源形如 `https://api.<root>`）→ `appId`（兼容旧 token）。
  白名单为空时一律拒绝，不再出现「未配置 aud 就接受任意值」。

## 0.4.0

### Minor Changes

- 默认改为服务端验签（userinfo / introspect），移除本地解码与 role 注入。

  - 旧实现只做 base64 解码 + `exp` 判断，不验签、不校验 `iss/aud`。
  - 现在默认调用 `/oauth/api/v1/oauth/userinfo`；可选 `verify: 'introspect'`。
  - `verify: 'decode-only'` 仅保留给本地调试，注入的 user 带 `verified: false`。
