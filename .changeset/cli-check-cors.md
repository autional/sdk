---
"@autional/onboard": patch
---

新增 `--check-cors=<origin>` 探针模式：一条 `OPTIONS` 预检验证「该源已登记且在网关生效」
（判据 = 204/200 且 `Access-Control-Allow-Origin` 逐字等于该源）。失败时按序给出三种原因
（未登记 / 值与浏览器 Origin 不逐字一致 / 刚登记未到 ~60s 生效窗口），退出码 1；不可达 = 2。

为什么：第三方应用浏览器直连换票时，源没登记在 `cors_origins` 会表现为「服务端成功、
前端报 CORS」，只能在用户登录时暴露（2026-10-31 事故）。该探针让 CLI/CI 在写代码前就能判定。
