# @autional/onboard

## Unreleased

### Minor Changes

- **已有租户多应用接入**：`--tenant=<tenant_id>` 校验 client 归属；`--redirect=<url>` / `--origin=<url>` 在写文件前跑 authorize + CORS 预检；新增 `--check-authorize=<redirect_uri> + --app-id` 纯探针。
- **client 校验增强**：除 `kind=portal` 外，新增租户不匹配、缺 `openid` scope 两类硬失败。
- **安全**：脚手架 README 改指管理后台（developer 站只是文档）；skill/config-template 不再把测试账号密码写入 `AUTIONAL_SETUP.md`。

## 0.5.1

### Patch Changes

- **新增 `--check-cors=<origin>` 跨域预检探针**：一条 `OPTIONS` 打到换票端点，判据 = 204/200 且 `Access-Control-Allow-Origin` **逐字**等于该源。失败按序给出三种原因（未登记在该 client 的 `cors_origins` / 值与浏览器 Origin 不逐字一致 / 刚登记未到 ~60s 生效窗口），退出码 1；不可达 = 2。

  为什么：第三方应用浏览器直连换票时，源没登记会表现为「服务端成功、前端报 CORS」，只能在用户登录时暴露（2026-10-31 事故）。

  另修：`start-worker` 自愈判据用 `-f`（仓内 `.sh` 是 644，`-x` 恒假）——属 CI 侧，本条仅记录 CLI 变更。

## 0.5.0

### Minor Changes

- **appId 预检：拒绝租户门户客户端**。写文件前调 `GET /oauth/api/v1/oauth/client/{appId}`，命中 `kind=portal` 或名称以 `Default Client for` 开头即硬失败（退出码 1）——避免「脚手架全绿、首次 SSO 登录才报 `redirect_uri not registered`」。

  - 新增 `--check-client=<id> [--region=<com|cn>]`：纯探针，不落盘；0 = 可用应用客户端，1 = 门户客户端/不存在/网络不可达，可直接被 CI 与 agent 断言。
  - 新增 `--app-id=<id>`：跳过交互式 appId 输入（CI/agent 用）。
  - 网络不可达降级为警告（标注「未验证」）而非阻断，保留离线脚手架能力。

## 0.4.2

### Patch Changes

- 登录模板补 autocomplete（username / current-password），消除 Chrome 密码框告警
