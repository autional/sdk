---
"@autional/core": patch
"@autional/next": minor
"@autional/react": patch
---

会话交付链修复波（novel C7/C12/C13 · nextchat C3N/C5N 同源）：

- **core**：`initialize()` 冷启动过期恢复 —— access 过期但 refresh 尚存时先刷新再水合（含 SSO 模式）；会话桥（tokenManager → 公共事件）改为恒注册，修复「登录前启动」页面在随后登录/刷新时事件断链；刷新失败静默按未登录继续，复用检测仍单发 `LOGGED_OUT`。
- **next**：`seedStorage` 不再无条件覆写 —— 已有富会话（refreshToken/user 等）时保留 core 持久化，仅空/裸/损坏存储播种；新增 `@autional/next/middleware`、`@autional/next/server`、`@autional/next/provider` 子路径导出 —— middleware/server 与 React 入口分构建，middleware 不再混入客户端 hooks（react-server 图编译失败修复），provider 产物保留 `"use client"`。
- **react**：源码与产物补 `"use client"` 指令（React Server Component 直引不再编译失败）。
