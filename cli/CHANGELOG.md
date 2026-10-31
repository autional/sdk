# @autional/onboard

## Unreleased

### Minor Changes

- **appId 预检（拒绝租户门户客户端）**：写文件前调 `GET /oauth/api/v1/oauth/client/{appId}`，命中 `kind=portal` 或名称以 `Default Client for` 开头即硬失败并以退出码 1 终止——避免「脚手架成功、首次 SSO 登录却报 `redirect_uri not registered`」。
- 新增 `--check-client=<id> [--region=<com|cn>]` 纯探针模式（不落盘；0 = 可用应用客户端，1 = 门户客户端/不存在/网络不可达）。
- 新增 `--app-id=<id>`：跳过交互式 appId 输入（CI/agent 用）。
- 网络不可达时降级为警告（明确标注「未验证」）而非阻断，保留离线脚手架能力。

## 0.4.2

### Patch Changes

- 登录模板补 autocomplete（username / current-password），消除 Chrome 密码框告警
