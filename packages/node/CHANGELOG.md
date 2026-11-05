# @autional/node

## Unreleased

### Minor Changes

- 新增 `verify: 'jwks'`：本地 RS256 验签 + `jwt-status` 撤销/`require_kid_after` 检查；
  支持 `jwksUrl` / `statusUrl` / `allowedIssuers` / `audience` / `jwksTtlMs`。
  默认缓存 JWKS 5 分钟、status 10 秒；未知 kid fail-closed。

## 0.4.0

### Minor Changes

- 默认改为服务端验签（userinfo / introspect），移除本地解码与 role 注入。

  - 旧实现只做 base64 解码 + `exp` 判断，不验签、不校验 `iss/aud`。
  - 现在默认调用 `/oauth/api/v1/oauth/userinfo`；可选 `verify: 'introspect'`。
  - `verify: 'decode-only'` 仅保留给本地调试，注入的 user 带 `verified: false`。
