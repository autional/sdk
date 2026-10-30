# Skill 分发 CHANGELOG

skill 分发内容的变更记录。真源 = `skills/_core/`；交付物 = `skills/autional-{com,cn}/`（经 `_gen/build-skills.mjs` 生成，_gen/check-skills.mjs 门校验）。发布流程见 `RELEASING.md`。

**三条交付通道**（同一内容、三个去处；按 region 二选一）：

| 通道 | .com | .cn | 性质 |
|------|------|-----|------|
| 站点 canonical | `https://www.autional.com/ai/skill.md` | `https://www.autional.cn/ai/skill.md` | 主入口（agent 拉取） |
| CDN 兜底镜像 | `https://cdn.autional.com/ai/latest/SKILL.md` | `https://cdn.autional.cn/ai/latest/SKILL.md` | canonical 域不可达时兜底 |
| npm | `npx @autional/onboard` | `npx -y @autional/onboard --registry=https://registry.npmmirror.com` | 接入 CLI |

**版本号 = 内容指纹** `v0.1.0-<8hex>`：`sha256(entries.map(rel + '\u0000' + 'sha384-' + sha384b64).sort().join('\n'))` 取前 8 位（配方见 `autional/cdn` 仓 README「ai/ 版本号（内容指纹）」节；两区各算各的）。**CDN 版本目录不可变**（铁律 1）：内容一改就发新版本号，绝不原地改已发布版本。

---

## [2026-10-30] core@3058b3e8e110 —— 试用注册 401/5xx 语义 + SDK 版本下限（sdk `386921c`）

**内容**（`_core/PROCEDURE.md`，EN/ZH 对称）：
- 新增 **§7.1「怎么读 401/403」**：按响应体 `service` + `code` 分流——`service:"middleware"`（网关）= 路由/受众/认证头问题，**公开端点出现 401 必非凭证问题**；`service:"identity-service"` + invalid credentials = 真凭证错；403 `40000503` = 平面不符。
- Phase 3 新增 **3.1a 注册后自检（强制）**：建租户后立刻登录管理员；`5xx trial provisioning failed` = 服务端已补偿软删、可同名重试一次；`401 invalid credentials` = 管理员未建成，**禁止重复注册**（占配额且 409），改走邀请码/开发者门户并上报 `request_id`。
- Phase 4 增加 **`@autional/core >= 0.3.8` 硬下限**（0.3.0–0.3.7 的 `createTrialTenant` 路径错误，已在 npm 弃用）。

**发布（两区各算内容指纹）**：

| 区 | 版本 | SKILL.md sha256 | 站点 commit | CDN commit |
|---|---|---|---|---|
| com | `v0.1.0-eb42e5a1` | `3e980772c1ff8eb783a18160af299f603db0553e1cfe01fef3c30be8d9e7c193` | web `9b6bfce` | cdn `fa26bd6` |
| cn | `v0.1.0-94acaff0` | `55cce02f06ef3972aa9670eccd18dad333b20961ff6fae6e28cfb9aea7a1c748` | 同上 | 同上 |

**复验**：站点 `/ai/skill.md` 与 CDN `/ai/latest/SKILL.md` 两区四路 sha256 == sdk blob（落盘法）；站点 `.sha256` 与线上文件一致。

## [2026-10-16] core@ab58de0146e5 —— 门户供给边界情况并入（租户门户登录 not-configured 核验；实验 3 门户供给修复波）

**内容**（sdk `8d57a96`；`_core` PROCEDURE 2 处；EN/ZH 对称）：

- 边界表（EN/ZH）各补 1 行：租户门户登录显示「This organization's sign-in is not configured」= 平台自动供给链未落位（修复前老租户或供给故障）。核验：`GET auth.autional.{{REGION}}/bff/identity/api/v1/public/auth-config/by-slug/{slug}` → `oauth_client_id` 存在（新租户数秒内落位）；缺失 → 上报平台支持补供给；勿用无关客户端顶替。

**触发**：lab 实验 3（nextchat）租户门户登录（user.autional.cn/nextchat-demo）报 not-configured —— 三层根因：① 建户时门户默认 OAuth 客户端未供给；② service-tenant 试用注册链不发布 `tenant.created`（`CreateTrialTenant` 缺发布）；③ `tenant.events` 交换迁移半波（发布侧直连队列 vs 消费侧 fanout）。平台侧修复：客户端背填 + service-tenant `a1b933b`（补发 tenant.created）+ MQ 交换键补齐；门户 E2E landed=ok（19.5s）；新租户 `exg-verify-1` 复验 `oauth_client_id` 回读 3.8s（判据脚本 lab `provision/trial-register-verify.mjs` + `nextchat-portal-e2e.mjs`）。

| 区 | CDN 版本 | 交付物（字节） | SKILL 主文件 sha256（前 8） |
|----|----------|----------------|------------------------------|
| com | `v0.1.0-4f539405` | SKILL.md 36235 / SKILL.zh.md 33998 / references 1514 + 3705 | `5b5b0e8a` |
| cn  | `v0.1.0-48334a28` | SKILL.md 34153 / SKILL.en.md 36439 / references 2042 + 3727 | `d3e57157` |

**发布记录**：

- 站点快照：web `64af71b`（双站 `public/ai/` 镜像 + `.sha256` 刷新；`fafb383..64af71b`）。
- CDN 上架：`a315f28` —— 8 文件 `git hash-object --no-filters` 与 sdk `8d57a96:skills/**` blob **全等**；区域指针 `latest.com.json → 4f539405`、`latest.cn.json → 48334a28`；`vercel.json` rewrite 跟版（`6f99a8d..a315f28`）。
- 复验：**T4 全绿 34/34**（CDN 直链 8 + latest 别名 8 + 双站资产 8 + `.sha256` 6 + 指针 2 + `/ai` 页 2）。鲜度标记：EN `Tenant portal sign-in shows` / ZH `租户门户登录显示` 命中。完整 sha256 与矩阵见 workspace `docs/positioning/12-skill-reachability-registry.md` §20。
- CI：`skills-gate`（Skills Consistency Gate）success（`8d57a96`，run 38857099398）。

**备注**：

- 本轮为内容指引变更（非工作区协议/门禁行为变更）→ T3 干跑按 `RELEASING.md` §2.3 范围判定跳过。
- references ×4：仅 `generated:` 行更替（core 指纹换代，字节零变化）；SKILL ×4 为实质变更（边界表各补 1 行）。
- 生成机制零改动；两区渲染由既有 G2 区纯净门保证。
- npm 交付线本轮无变更。

## [2026-10-16] core@be4097dfdc14 —— 换号守卫并入 1.6（本地优先应用数据隔离；nextchat R1 反哺波）

**内容**（sdk `bca56e5`；`_core` PROCEDURE 8 处；EN/ZH 对称）：

- §1.6 应用数据隔离检查：检查项 4 补「不经登出的会话终结」对照 —— token 过期 / 平台侧撤销 / 清 cookie 等路径结束后，换另一账号登录，前一账号数据是否仍可见；报告块拆两行（经登出所见 / 不经登出所见）。
- §1.6 新增「换号守卫（本地优先应用）」段：持久化 last signed-in user id；会话启动比对 —— 不匹配（含无标记）→ 先清本地用户数据 + 整页重载，再进入 pull / merge / push；同 id 不动；清理清单复用登出路径（两条路径不漂移）。
- Security 清单行补：换号不得见前账号数据（1.6 守卫覆盖无登出终结路径）。

**触发**：lab 实验 3（nextchat）安全分析 7 问发现 R1（无登出终结后换号：前账号本地残留并入下一账号视图，并经下次同步推入其云端）+ R5（`ACAO:*` 与 `Allow-Credentials` 同发畸形组合）；nextchat 修复 `603fe4e2`（双分支同版）+ 生产部署 8 `4mrryqcdh` + E2E 8/8（含换号残留守卫轮）；R1 检查项沉淀平台 skill（lab README `20aebf4` 回填）。

| 区 | CDN 版本 | 交付物（字节） | SKILL 主文件 sha256（前 8） |
|----|----------|----------------|------------------------------|
| com | `v0.1.0-6aef473d` | SKILL.md 35717 / SKILL.zh.md 33552 / references 1514 + 3705 | `69aba812` |
| cn  | `v0.1.0-be3dab86` | SKILL.md 33708 / SKILL.en.md 35922 / references 2042 + 3727 | `ef03801c` |

**发布记录**：

- 站点快照：web `fafb383`（双站 `public/ai/` 镜像 + `.sha256` 刷新；`533916f..fafb383`）。
- CDN 上架：`6f99a8d` —— 8 文件 `git hash-object --no-filters` 与 sdk `bca56e5:skills/**` blob **全等**；区域指针 `latest.com.json → 6aef473d`、`latest.cn.json → be3dab86`；`vercel.json` rewrite 跟版（`9d6546c..6f99a8d`）。
- 复验：**T4 全绿 34/34**（CDN 直链 8 + latest 别名 8 + 双站资产 8 + `.sha256` 6 + 指针 2 + `/ai` 页 2）。鲜度标记：EN `Account-switch guard` / ZH `换号守卫` 命中。完整 sha256 与矩阵见 workspace `docs/positioning/12-skill-reachability-registry.md` §19。
- CI：`skills-gate`（Skills Consistency Gate）success（`bca56e5`，run 38810402399）。

**备注**：

- 本轮为内容指引变更（非工作区协议/门禁行为变更）→ T3 干跑按 `RELEASING.md` §2.3 范围判定跳过。
- references ×4：仅 `generated:` 行更替（core 指纹换代，字节零变化）；SKILL ×4 为实质变更（§1.6 三处 + Security 行）。
- 复验口径补录：CDN 版本目录次级语言文件 = **同区**产物（com `SKILL.zh.md` `4f5246b2…` / cn `SKILL.en.md` `f6c9eec6…`），≠ 对方区 primary；站点侧次级映射仍为对方区 primary（见 registry §19.4）——复验期望值勿混用（本轮首跑 4 项假红，已核正）。
- 生成机制零改动；两区渲染由既有 G2 区纯净门保证。
- npm 交付线本轮无变更。

## [2026-10-15] npm 交付线（SDK 运行包）—— core 0.3.5 / next 0.4.0 / react 0.3.1（会话交付链修复波）

**内容**（sdk `df9c127`，版本提交 `3a87678`）：会话交付链修复波 —— core `initialize()` 冷启动过期恢复 + 会话桥恒注册；next `seedStorage` 富会话降覆写（C13）+ 包粒化子路径导出（C3N/C7）；react 源 + 构建保留 `'use client'`（C7）。

| 包 | 版本 | changeset | dist-tags（npmjs） |
|----|------|-----------|--------------------|
| `@autional/core` | `0.3.5` | patch | `latest` = `next` = `0.3.5` |
| `@autional/next` | `0.4.0` | minor | `latest` = `next` = `0.4.0` |
| `@autional/react` | `0.3.1` | patch | `latest` = `next` = `0.3.1` |

**发布记录**：

- npmjs 三包上线；npmmirror 三版本同步（两 registry 产物 **88/88 文件 sha256 全等**）。
- `next` dist-tag 已对齐 `latest`（与 core@0.3.4 轮惯例一致）。
- git tags `@autional/core@0.3.5` / `@autional/next@0.4.0` / `@autional/react@0.3.1` 已推 origin。
- 双 registry 复验：fresh-consumer 四件套（CJS / ESM / 导出名 / tsc `--strict`）双绿；已发布构件指令核验过（`provider.mjs` 首行 `"use client"`、`middleware.*` / `server.*` 无、`index.mjs` = middleware 再导出）。
- lockfile 同步：sdk `63c3af5`（next/react 依赖解析升 0.3.5 / 0.3.1；旧 specifier `>=0.1.0` 与新范围不一致，`--frozen-lockfile` 会报过期）。

**备注**：

- **发布须用 pnpm ≥10**（`npx -y pnpm@10.34.6 publish:ci`）：pnpm ≤9 委托 `npm publish` 会把 changesets 注入的 `--no-git-checks` 透传给 npm 12 → `EUNKNOWNCONFIG` 全量失败（本机系统 pnpm 9.5 实测踩中）。细则见 `RELEASING.md` §5。
- changesets 2.31.0 在 npm 12 下 info 检查失效：误判已发布包为未发布，对 28 个已发布包发起重发尝试（全部被 registry 拒，无害）。durable fix 已落地：`@changesets/cli` `2.31.0 → 2.31.1`（v2 维护线补丁，新增 `normalizeInfoJson` 解包 npm 12 的 `info --json` 数组输出）。
- npm 12 publish 异步：`PUT 202` 后数分钟才可查，立即可查 `E404` 属正常；以 npm 调试日志 `PUT 202` + exit 0 为准。

## [2026-10-14] core@3bc775d388f6 —— 行业缺口三波并入（多标签会话 / RFC 7009 / B2C 暴露 / 预刷新 / 设备流 / DPoP / 租户 slug）

**内容**（sdk `11a3335`；`_core` PROCEDURE 6 处 + config-template 2 处）：

- 头行补「Tenant links:」提示（EN/ZH）：租户 slug 决定控制台门户链接形态。
- §3.2 配置清单补 `tenantSlug`（共享 issuer 下门户路由所需）。
- §5.2 登出段补 RFC 7009 令牌撤销：`logout()` 在重定向前撤销 access/refresh（限时 1.5 s）。
- §5.2 补多标签会话段：`syncTabs` 默认开；刷新成功广播 `TOKEN_REFRESHED`（旧 refresh token 复用会触服务端整族撤销）；登出与复用检测广播 `LOGOUT`。
- §5.4 API 勘正：`revokeSession()` / `revokeOtherSessions()`（替换旧 `deleteSession`）+ step-up 说明（`X-StepUp-Token`，仅 `plain` / `hash` 传输模式）。
- §8.2 门户 slug 表：Admin/User/Security 拼 `/{TENANT_SLUG}/`；Developer/Status 全局站。config-template EN/ZH 补 `tenantSlug`。

**触发**：SDK 行业缺口扫描（10 主流 SDK 对照 + RFC 10017/ASVS）→ 三波实施（波 1 多标签会话/RFC 7009/sessionStorage platform；波 2 B2C 方法暴露 ×7；波 3 预刷新/step-up/设备流/DPoP）+ 租户 slug 全链修复 + 独立复查四阻断处置。

| 区 | CDN 版本 | 交付物（字节） | SKILL 主文件 sha256（前 8） |
|----|----------|----------------|------------------------------|
| com | `v0.1.0-cc5e0ce9` | SKILL.md 34573 / SKILL.zh.md 32584 / references 1514 + 3705 | `abfee91f` |
| cn  | `v0.1.0-82a72c38` | SKILL.md 32740 / SKILL.en.md 34778 / references 2042 + 3727 | `0a56cf9c` |

**发布记录**：

- 站点快照：web `ee93070`（双站 `public/ai/` 镜像 + `.sha256` 刷新；`9cef1cb..ee93070`）。
- CDN 上架：`9d6546c` —— 8 文件 `git hash-object --no-filters` 与 sdk `fea14af:skills/**` blob **全等**；区域指针 `latest.com.json → cc5e0ce9`、`latest.cn.json → 82a72c38`；`vercel.json` rewrite 跟版。
- 复验：**T4 全绿 34/34**（CDN 直链 8 + latest 别名 8 + 双站资产 8 + `.sha256` 6 + 指针 2 + `/ai` 页 2）。鲜度标记：双站 `/ai` 页内联 `core@3bc775d388f6` 指纹命中。完整 sha256 与矩阵见 workspace `docs/positioning/12-skill-reachability-registry.md` §18。
- npm 交付线：`@autional/core@0.3.4`（本波 changeset `fea14af`；npmjs `latest = next = 0.3.4` + npmmirror 同步）+ 机械连带 `@autional/onboard@0.4.1`（CLI 登出指引 `112d402` 已提交未发布，被 changeset publish 顺带发出；两 registry 同 tag）。git tags：`@autional/core@0.3.4` / `@autional/onboard@0.4.1` 已推 origin。

**备注**：

- npm 2026 staged publishing 政策首遇（bypass-2FA granular token 默认 stage-only：`PUT 202` → ~1–2 min auto-finalize 上线；stage 窗口内重发同版本报 `E409` 属正常保护；`npm stage` 命令族需 CLI ≥ 11.15）。
- 本轮为内容指引变更（非工作区协议/门禁行为变更）→ T3 干跑按 `RELEASING.md` §2.3 范围判定跳过。
- 生成机制零改动；两区渲染由既有 G2 区纯净门保证。

## [2026-10-14] core@8de9d33f2536 —— 登出章节 5.2c（RP-Initiated Logout；E9 波）

**内容**（sdk `30037c3`）：`_core` PROCEDURE 新增 §5.2c「登出章节」：

- 两步序：先撤销令牌（RFC 7009）再跳 `end_session_endpoint`。
- 参数表：`post_logout_redirect_uri`（须在应用中预登记）/ `client_id` / `id_token_hint`。
- SDK `buildEndSessionUrl` 强制跳转；确认页与无过渡预期（跳转前落地确认页属正常）。

**触发**：E9 登出线 —— SDK 登出能力补全（CLI 脚手架 + examples 登出示例）+ skill 登出章节随线发布。

| 区 | CDN 版本 | 交付物（字节） | SKILL 主文件 sha256（前 8） |
|----|----------|----------------|------------------------------|
| com | `v0.1.0-0f60b7cc` | SKILL.md 33136 / SKILL.zh.md 31244 / references 1514 + 3306 | `6a7589f7` |
| cn  | `v0.1.0-2f32e31e` | SKILL.md 31400 / SKILL.en.md 33341 / references 2042 + 3323 | `d4e63101` |

**发布记录**：

- 站点快照：web `34f87d1`（双站 `public/ai/` 刷新，8 文件 +94/−12）。
- CDN 上架：`47c89b7` —— 8 文件与 sdk `30037c3:skills/**` blob 逐字节全等；区域指针 `latest.com.json → 0f60b7cc`、`latest.cn.json → 2f32e31e`；`vercel.json` rewrite 跟版。
- 复核（回填补录）：版本直链 `cdn.autional.{com,cn}` 双区 SKILL.md 2/2 → 200 且逐字节 == sdk blob（immutable 目录事后复核）；当时未跑全量 T4。记录见 registry §17。

## [2026-10-11] core@87c827301112 —— 接入摩擦 F5–F7 并入（第四轮内容发布）

**内容**（sdk `aef3527`；`_core` PROCEDURE 6 处 + config-template 2 处）：

- §5.2b 补「同源代理形态必须显式引脚 `authorizeUrl`」段（EN/ZH + ts 示例）：默认授权地址只把 `api.` 主机改写为 `auth.`（如 `api.autional.{{REGION}}` → `auth.autional.{{REGION}}`）；其余主机（同源 `/bff` 代理、自定义网关）原样保留 → 落到 API 平面（不提供登录界面）。
- §2.3 补「登录页零输入项」排查段：`login_methods` 死路（声明的方法无对应 provider）→ 经 tenant auth-policy 修复（`PUT /admin/tenants/:id/auth-policy`，`login_methods` 为 JSON 字符串）；identity `PUT /admin/security/auth-config` 的 200 不可信（可静默成功无实效）。
- EN/ZH 边界表各补 2 行：① 登录页零输入项（同上修复路径）；② 授权页挂起 ~30s 落品牌门户 = 本区 auth 主机后端代理故障 → 跨区对照（换 `auth.autional.{{REGION}}` 区后缀）并引脚健康区 `authorizeUrl`。
- 配置模板 EN/ZH 补 `authorizeUrl` 注释块（同源代理形态引脚示例）。

**触发**：takenote SSO 改造真机摩擦实证（F5 代理形态授权地址落 API 平面 / F6 .com auth `/bff` 502 / F7 `login_methods` 死路 + identity 假成功；台账 fork `e829964` / lab `221ecb3`，真机 12/12）。

| 区 | CDN 版本 | 交付物（字节） | SKILL 主文件 sha256（前 8） |
|----|----------|----------------|------------------------------|
| com | `v0.1.0-6039ff74` | SKILL.md 29652 / SKILL.zh.md 28093 / references 1514 + 3306 | `c59e6d7b` |
| cn  | `v0.1.0-343fde3d` | SKILL.md 28252 / SKILL.en.md 29860 / references 2042 + 3323 | `46e8abcb` |

**发布记录**：

- 站点快照：web `033ae05`（双站 `public/ai/` 镜像 + `.sha256` 刷新）。
- CDN 上架：`2b0ace1` —— 8 文件 `git hash-object --no-filters` 与 sdk `aef3527:skills/**` blob **全等**；区域指针 `latest.com.json → 6039ff74`、`latest.cn.json → 343fde3d`；`vercel.json` rewrite 跟版。
- 复验：**T4 全绿 34/34**（CDN 直链 8 + latest 别名 8 + 双站资产 8 + `.sha256` 6 + 指针 2 + `/ai` 页 2）。鲜度标记：EN `Same-origin proxy forms must pin` / ZH `同源代理形态必须显式引脚` 命中。完整 sha256 与矩阵见 workspace `docs/positioning/12-skill-reachability-registry.md` §15。
- CI：`skills-gate`（Skills Consistency Gate）success（`aef3527`，推送 `4bedde2..aef3527`）。

**备注**：

- 本轮为内容指引变更（非工作区协议/门禁行为变更）→ T3 干跑按 `RELEASING.md` §2.3 范围判定跳过。
- 生成机制零改动：新增示例复用既有 `{{REGION}}` 变量内联（G2 区纯净门自动保证两区渲染互不串区）。
- npm 交付线（`@autional/onboard`）本轮无变更。

## [2026-10-11] core@2bfed789ef9f —— SSO 接入对齐（第三轮内容发布）

**内容**（sdk `1f5af5b` + `d0c66bd`）：

- 新增 §5.2b「SSO 登录——用 Autional 登录」接入步骤（公开客户端 + PKCE；authorize 整页跳转；SDK `loginWithOAuth` / `handleOAuthCallback` 自动换票；登录表单与全部社交登录保留在 Autional 授权页）。
- 配置模板 / 合规矩阵修正：`apiUrl` 补网关 `/bff` 前缀（`d0c66bd`；配套 SDK `handleOAuthCallback` 并发幂等修复）。

**生成器修复**（sdk `3213050`）：`build-skills.mjs` 读 `_core` 源归一 CRLF→LF（`readCore`）——根治 G3 跨平台假红（Windows autocrlf 检出散列 ≠ CI LF 散列）；`coreHash` 与产物字节保真自此与平台无关。

| 区 | CDN 版本 | 交付物（字节） | SKILL 主文件 sha256（前 8） |
|----|----------|----------------|------------------------------|
| com | `v0.1.0-6cdb6716` | SKILL.md 27975 / SKILL.zh.md 26626 / references 1514 + 2915 | `2cbec429` |
| cn  | `v0.1.0-ecb907ae` | SKILL.md 26789 / SKILL.en.md 28187 / references 2042 + 2970 | `8bcc891f` |

**发布记录**：

- 站点快照：web `f3e94ed`（双站 `public/ai/` 镜像 + `.sha256` 刷新）。
- CDN 上架：`f3b4024` —— 8 文件 `git hash-object --no-filters` 与 sdk `f690c38:skills/**` blob **全等**；区域指针 `latest.com.json → 6cdb6716`、`latest.cn.json → ecb907ae`；`vercel.json` rewrite 跟版。
- 复验：**T4 全绿 34/34**（CDN 直链 8 + latest 别名 8 + 双站资产 8 + `.sha256` 6 + 指针 2 + `/ai` 页 2）。鲜度标记：EN `5.2b · SSO login` / ZH `5.2b · SSO 登录` 命中。计数口径勘正见 `RELEASING.md` §6。完整 sha256 与矩阵见 workspace `docs/positioning/12-skill-reachability-registry.md` §14。

**备注**：

- 配套线：服务端 SSO 修复（oauth `1950a7d` + core `v1.0.36` 等三仓）与 SDK `@autional/core@0.3.2`（OAuth 换票契约修复，npmjs）——skill 正文的 SSO 步骤以该组合为真机验证基线（dev E2E 三腿 18/18 · 12/12 · 9/9）。

## [2026-10-10] core@ffb54a28b76c —— 工作区协议强化（第二轮内容发布）

**内容**（sdk `eb7aa9d`，分支 `task/skill-workspace-protocol`）：硬性规则 10→14 条。

- 默认分支检测（`symbolic-ref` 探测 → main → master 回退）
- 脏工作树 stop-and-ask（三选询问；绝不静默 stash/commit）
- 阶段边界 checkpoint 提交
- 新增 1.6 应用数据隔离检查（只读检出披露 + 同意门；整改动作须用户明确同意）
- 新增 8.4 分支交付出口门（[A] merge `--no-ff` / [B] 保留分支 / [C] 丢弃；未经用户显式选择，绝不 merge 默认分支、绝不 push）
- 透明降级 + plan-only；完成检查清单新增「Workspace & delivery」区块

**配套**（sdk `127d9b6`）：T3 干跑装置——6 夹具 prepare/audit 脚本 + 受测说明书，47/47 断言 PASS（`skills/_tests/`）。

| 区 | CDN 版本 | 交付物（字节） | SKILL 主文件 sha256（前 8） |
|----|----------|----------------|------------------------------|
| com | `v0.1.0-d7f3c177` | SKILL.md 26492 / SKILL.zh.md 25236 / references 1514 + 2903 | `624e71fc` |
| cn  | `v0.1.0-64120c4b` | SKILL.md 25400 / SKILL.en.md 26705 / references 2042 + 2958 | `11d0d253` |

**发布记录**：

- 站点快照：web `9f6acf2`（双站 `public/ai/` 刷新）；同日 `5e9c67b`（references 按区落位修复，见下）。
- CDN 上架：`a5094ad` —— 8 文件 `git hash-object --no-filters` 与 sdk `eb7aa9d:skills/**` blob **全等**；区域指针 `latest.com.json → d7f3c177`、`latest.cn.json → 64120c4b`；`vercel.json` rewrite 跟版。
- 复验：**T4 30/30 全绿**（CDN 14 URL + 双站资产 8 + `.sha256` 6 + 指针 2；另双站 `/ai` 页内联鲜度标记 2）。完整 sha256 与复验矩阵见 workspace `docs/positioning/12-skill-reachability-registry.md` §12。
- 站点侧修复（web `5e9c67b`）：references 原单份（cn 变体）服务双站 → .com 站发错区文件（lab notes B1）；修复 = 入仓镜像按区命名（`*.com.md`/`*.cn.md`）+ 构建期按 `REGION` 落位 + 双守卫（skill 区/lang、references 首行区标记，不符拒构建）。线上复验 com 站 = com 版、cn 站 = cn 版。

**备注**：

- 版本号配方**自本版起可复现**（历史 6 版本不追溯重命名，见 2026-10-05 条目）。
- `/ai/zh`、`/ai/en` 语言变体页随本轮**退役**（每区只保留 `/ai/`）；两 URL 404 为预期，勿按 200 断言。
- 本版内容变更点 = 站点引用模型收敛为「自有 CDN 兜底」后的第二轮（第一轮见 2026-10-05）。

## [2026-10-06] npm 交付线（接入 CLI，独立版本列车）

| 包 | 版本 | 时间 | 备注 |
|----|------|------|------|
| `@autional/onboard` | `0.4.1` | 2026-10-14 | sdk `112d402`（CLI 登出指引）；随 `core@0.3.4` changeset publish 机械连带发布（详见 2026-10-14 条目） |
| `@autional/onboard` | `0.4.0` | 2026-10-11 | sdk `be7debd`（区域感知 + SSO 脚手架 + `/bff`；registry §16）；dist-tags `latest` = `next` = `0.4.0` |
| `@autional/onboard` | `0.3.0` | 2026-10-06 | sdk `97331d8`（波 2 发版列车，31 包升版；tag-first next→latest）；dist-tags `latest` = `next` = `0.3.0`（此前 0.1.0，2026-10-05） |
| `@autional-cn/onboard` | `0.1.0` | 2026-10-05 | .cn 走 npmmirror 镜像 |

说明：npm 包版本号与 skill 内容指纹**独立**（CLI 工具链 vs 内容）；两线发版流程见 `RELEASING.md`。

## [2026-10-08] CDN 单源化（分发基建，内容零变更）

- `autional/cdn` 仓 `e79ee26`：`ai/` 并入单仓双区（此前 com/cn 双仓分存）→ 两 Vercel 项目（`cdn` / `cn-cdn`）从同一仓部署；区域指针 `latest.com.json` / `latest.cn.json` + `vercel.json` host 分流 `/ai/latest.json`；版本目录保留 KEEP=5。
- **内容零变更**：版本目录原样并入，无新内容版本。

## [2026-10-05] 首批发布（历史记录，版本号不可复现）

| 区 | 版本序列 | 备注 |
|----|----------|------|
| com | `53003a10` → `f9c494f7` → `da036107` | 首版 → 兜底改指 `cdn.autional.com` → 修复版 |
| cn  | `5677a4e0` → `7234c299` → `ca23fc19` | 首发并存于独立 CDN 仓，10-08 并入单仓 |

- 同日分发线切换：兜底镜像改指**自有 CDN**（`cdn.autional.{com,cn}`）——Gitee EN 451 不再阻塞交付、jsDelivr 兜底退役（registry §11）。
- ⚠ 这 6 个版本号出自当时未文档化流程，**已不可复现**；不追溯重命名（铁律 1）。当时站点/分发接线修复（资源落位、`.sha256` 补发、`/ai` 页面入口补齐）见 registry §1–§6。
