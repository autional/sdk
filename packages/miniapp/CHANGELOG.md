# @autional/miniapp

## 0.4.2

- **发布收敛（请用本版）**：`0.4.0` / `0.4.1` / `0.4.2` 三个版本**内容完全一致**。
  `0.4.0`、`0.4.1` 是发布期本机网络对 tarball 路径误报 404 引发的冗余补发——事后经代理复核，
  三个版本的 tarball 均已正常上传。为避免多版本漂移，统一以 **0.4.2** 为 `latest`，
  `0.4.0` / `0.4.1` 已在 npm 标记 deprecate。

## 0.4.0

### Minor Changes（0.x breaking）

- 移除 `loginWithWechat()` / `getPhoneNumber()` 及相关类型（`AutionalWithWechat`、
  `WechatPhoneEvent`、`UseAutionalReturn.loginWithWechat`）。它们调用 identity 的
  `auth/wechat/*` 端点，而服务端从未实现（全仓检索零命中）—— 任何调用只会拿到网关
  兜底 404/401。小程序端请走标准登录方式（密码 / 验证码 / 社交 OAuth 的 H5 跳转）；
  服务端微信能力就绪后再以独立包提供。
- `createAutional()` 返回类型由 `AutionalWithWechat` 收窄为 `Autional`。
