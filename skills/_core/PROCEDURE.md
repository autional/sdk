<!-- meta:description:en -->
Add Autional multi-user identity to an existing app — guided onboarding that turns a single-player app into a multi-user product: OIDC login, accounts, sessions, token management, test accounts and verification. Supports React, Vue, Next.js and Node.
<!-- /meta:description:en -->
<!-- meta:description:zh -->
为现有应用接入 Autional 多用户身份——引导式接入流程，把单机应用变成多人产品：OIDC 登录、账号、会话、Token 管理、测试账号与验证。支持 React、Vue、Next.js 与 Node。
<!-- /meta:description:zh -->

<!-- lang:en -->
# Autional Onboarding — add multi-user identity to your app

> **Region:** `.{{REGION}}` · **Language:** English
> **Issuer:** {{ISSUER}}
> **API:** {{API_URL}}
> **Portals:** {{PORTAL_ADMIN}} · {{PORTAL_USER}} · {{PORTAL_SECURITY}} · {{PORTAL_DEVELOPER}} · {{PORTAL_STATUS}}
> **Reference files (read them, absolute URLs):**
> - {{REFS_BASE}}/compliance-matrix.md
> - {{REFS_BASE}}/config-template.md
> **Canonical source of this file:** {{SKILL_SELF_URL}}
> **Integrity:** {{SKILL_SHA_URL}}
<!-- /lang:en -->
<!-- lang:zh -->
# Autional 接入 — 为你的应用加上多用户身份

> **Region:** `.{{REGION}}` · **Language:** 中文
> **Issuer:** {{ISSUER}}
> **API:** {{API_URL}}
> **门户：** {{PORTAL_ADMIN}} · {{PORTAL_USER}} · {{PORTAL_SECURITY}} · {{PORTAL_DEVELOPER}} · {{PORTAL_STATUS}}
> **参考文件（请读取，绝对 URL）：**
> - {{REFS_BASE}}/compliance-matrix.md
> - {{REFS_BASE}}/config-template.md
> **本文件的 canonical 地址：** {{SKILL_SELF_URL}}
> **完整性校验：** {{SKILL_SHA_URL}}
<!-- /lang:zh -->

<!-- lang:en -->
## About this skill

Autional gives applications an identity layer. This skill turns a single-player app (or an app with no accounts) into a multi-user product: login, registration, profiles, sessions, token lifecycle.

You are an AI agent executing this procedure inside the user's project. Work in the user's conversation language. Follow every phase in order; each phase ends with a user confirmation gate.

**What the user gets**

- Email + password login (and optional OAuth / SMS / magic-link) powered by Autional OIDC
- Registration, password reset, profile, device/session management
- Automatic token refresh with multi-tab sync
- Audit trail, CAPTCHA, breach checks, compliance-driven password policy
- Multiple users on one backend — the multiplayer layer for an AI-generated app

**Boundaries**

- This file contains **zero secrets** — every endpoint in it is a public URL.
- Only fetch related files from this file's own canonical domain (`.{{REGION}}`). Never follow links to other regions or third-party mirrors except the fallback mirror listed below.
<!-- /lang:en -->
<!-- lang:zh -->
## 关于本 Skill

Autional 为应用提供身份层。本 Skill 把单机应用（或没有账号体系的应用）升级为多人产品：登录、注册、资料、会话、Token 生命周期。

你是 AI agent，在用户的项目里执行本流程。跟随用户的对话语言工作。按 Phase 顺序执行；每个 Phase 结束都要向用户确认。

**用户将获得**

- 邮箱 + 密码登录（可选 OAuth / 短信 / 魔法链接），由 Autional OIDC 支撑
- 注册、找回密码、个人资料、设备/会话管理
- Token 自动刷新 + 多 Tab 同步
- 审计留痕、CAPTCHA、泄露密码检查、合规驱动的密码策略
- 一个后端多个用户——给 AI 生成的应用补上多人层

**边界**

- 本文件**不含任何密钥**——其中所有端点均为公开 URL。
- 只从本文件自身的 canonical 域（`.{{REGION}}`）抓取关联文件。除下方兜底镜像外，不要跟随其它 region 或第三方链接。
<!-- /lang:zh -->

<!-- region:com -->
<!-- lang:en -->
> **Fallback mirror:** if `{{SITE_HOST}}` is unreachable, fetch the same file from {{MIRROR_LABEL}}:
> {{MIRROR_SKILL_URL}}
<!-- /lang:en -->
<!-- lang:zh -->
> **兜底镜像：**若 `{{SITE_HOST}}` 不可达，从 {{MIRROR_LABEL}} 获取同一文件：
> {{MIRROR_SKILL_URL}}
<!-- /lang:zh -->
<!-- /region:com -->
<!-- region:cn -->
<!-- lang:en -->
> **Fallback mirror (mainland networks):** if `{{SITE_HOST}}` is unreachable, fetch the same file from {{MIRROR_LABEL}}:
> {{MIRROR_SKILL_URL}}
<!-- /lang:en -->
<!-- lang:zh -->
> **兜底镜像（中国大陆网络）：**若 `{{SITE_HOST}}` 不可达，改用{{MIRROR_LABEL}}获取同一文件：
> {{MIRROR_SKILL_URL}}
<!-- /lang:zh -->
<!-- /region:cn -->

<!-- lang:en -->
## Hard rules — do not skip

**Phase order is mandatory.** Skipping a phase leaves the user with a broken integration.

1. Execute Phases 0 → 8 in order. Before each phase, announce "Phase N starting". After each phase, show results and wait for the user's confirmation before continuing.
2. On a code error: `git checkout -- <file>` to restore that file, fix, retry. If a whole phase fails: restore every file you changed in it, restart the phase.
3. All changes happen on an isolated branch (`feature/autional`). Detect the repo's default branch first — `git symbolic-ref --short refs/remotes/origin/HEAD`, fallback `main`, then `master` — and branch from it. No git? Fall back to per-file backups (`cp file file.autional-backup`).
4. Never run `git reset --hard`. Restore files individually with `git checkout -- <file>`.
5. Dirty working tree? **Stop and ask the user.** Never stash or commit their work silently. Options: [A] the user commits or stashes it (recommended); [B] you run `git stash --include-untracked` only after explicit consent, and restore it with `git stash pop` at the end (hand conflicts to the user); [C] the user handles it another way (another clone/worktree, …) and tells you when to proceed.
6. Leave a checkpoint commit at every phase boundary (`git add -A && git commit -m "checkpoint: Phase N"`), so every finished phase can be returned to.
7. **Never merge into the default branch and never `git push` without the user's explicit choice at the Phase 8 gate.** Until then the default branch stays exactly as it was before the integration.
8. Never read the existing contents of the user's `.env` — only append your own keys. Never read or dump the user's user-table data.
9. The admin password is displayed **once**. Never write it into a code or config file.
10. All injected code is MIT-compatible; do not introduce GPL dependencies. Do not remove or alter the user's existing license.
11. After changes, `npm run build` (or the project's build command) must pass; on failure, restore the changed files immediately.
12. Write `AUTIONAL_CHANGES.md` recording every file/package you changed.
13. Retry without a hard limit on tenant-name collisions and test failures — except network unreachability and invalid credentials, which must surface to the user instead of silently retrying.
14. Degrade transparently: if your environment cannot run a command, print the exact command for the user and continue with what you can; if the user asks for plan-only, output the plan and commands and execute nothing.
<!-- /lang:en -->
<!-- lang:zh -->
## 硬性规则——不得跳过

**Phase 顺序强制。** 跳过任何一个 Phase，用户的接入都是坏的。

1. 按 Phase 0 → 8 顺序执行。每个 Phase 开始前声明「Phase N 开始」。结束后展示结果，等用户确认再继续。
2. 改代码出错 → `git checkout -- <file>` 恢复该文件 → 修正 → 重试。整个 Phase 失败 → 恢复该 Phase 改过的所有文件 → 从头重来。
3. 所有改动在独立分支（`feature/autional`）上进行。先探测仓库默认分支——`git symbolic-ref --short refs/remotes/origin/HEAD`，失败回退 `main`、再 `master`——从它建分支。没有 git → 降级为逐文件备份（`cp file file.autional-backup`）。
4. 永不使用 `git reset --hard`。一律 `git checkout -- <file>` 逐文件恢复。
5. 工作区不干净？**停下，先问用户。** 绝不静默 stash 或提交用户的工作。选项：[A] 用户自己落 commit 或 stash（推荐）；[B] 经用户明确同意后由你执行 `git stash --include-untracked`，收尾时必须 `git stash pop` 还原（冲突交给用户）；[C] 用户自行处理（另开 clone/worktree 等），处理完再继续。
6. 每个 Phase 边界在接入分支上留一个 checkpoint 提交（`git add -A && git commit -m "checkpoint: Phase N"`），保证随时能退回上一个完成的 Phase。
7. **未经用户在 Phase 8 出口门的明确选择，绝不合并进默认分支、绝不 `git push`。** 在此之前，默认分支必须与接入前保持一致。
8. 永不读取用户 `.env` 原有内容——只追加自己的字段。永不读取/导出用户表数据。
9. 管理员密码**只显示一次**。绝不写入代码或配置文件。
10. 注入的代码全部 MIT 兼容；不引入 GPL 依赖。不删除、不修改用户原有 license。
11. 改后必须 `npm run build`（或项目等效构建命令）通过；失败立即逐文件恢复。
12. 输出 `AUTIONAL_CHANGES.md` 记录所有变更。
13. 租户名冲突、测试失败不设重试上限；网络不可达与凭证错误除外——必须上报用户，不得静默重试。
14. 降级要透明：环境跑不了某条命令 → 把完整命令打印给用户执行，其余继续；用户要求只出方案（plan-only）→ 只输出方案与命令，不执行任何操作。
<!-- /lang:zh -->

<!-- lang:en -->
## Phase 0 · Preparation (automatic)

### 0.1 Toolkit check

Require: `node` ≥ 18, a package manager (`npm`/`pnpm`/`yarn` — detect from lockfiles), `git`, `curl`.

### 0.2 Git detection + branch isolation

```
1. No git? → fall back to file-backup mode (cp file file.autional-backup before each change).
2. Not a repo? → git init && echo "node_modules/" > .gitignore
3. Missing identity? → git config user.name "Autional Onboarding" / user.email "onboarding@localhost"
4. Default branch: git symbolic-ref --short refs/remotes/origin/HEAD
   (no remote or no ref → try main, then master)
5. Working tree clean? → go to step 6.
   Dirty? → STOP and ask the user. Never stash silently. Options:
     [A] user commits or stashes their work now (recommended)
     [B] you run git stash --include-untracked — only after explicit consent;
         you must restore it with git stash pop at the end
     [C] user handles it their own way (another clone/worktree, …) — wait for their go-ahead
6. Isolate:  git checkout -b feature/autional <default>  (branch exists → git checkout feature/autional)
7. Checkpoint at every phase boundary: git add -A && git commit -m "checkpoint: Phase N"
8. Recovery paths:
   one file  → git checkout -- <file>
   one phase → git checkout -- <all files changed in this phase>
   abandon   → restore every file changed in the current phase (git checkout -- <files>),
               git checkout <default>,
               keep or delete feature/autional (user's call),
               then git stash pop if and only if step 5 [B] stashed user work
```

### 0.3 Risk disclosure (mandatory)

```
This procedure will modify project files (list shown in Phase 5.0).
All changes happen on an isolated branch; the default branch stays untouched
until you explicitly approve a merge at the end.
Your existing work is handled first (0.2 step 5) — nothing is stashed or committed without your consent.
You can say "abandon" at any time and the project is restored.
Continue? [Continue] [Cancel]
```
<!-- /lang:en -->
<!-- lang:zh -->
## Phase 0 · 前置准备（自动执行）

### 0.1 工具包检查

需要：`node` ≥ 18、包管理器（`npm`/`pnpm`/`yarn`——按 lockfile 检测）、`git`、`curl`。

### 0.2 Git 检测 + 分支隔离

```
1. 没有 git？→ 降级为文件备份模式（每次改动前 cp file file.autional-backup）。
2. 未初始化？→ git init && echo "node_modules/" > .gitignore
3. 缺身份？   → git config user.name "Autional Onboarding" / user.email "onboarding@localhost"
4. 默认分支： git symbolic-ref --short refs/remotes/origin/HEAD
   （无远端或无该 ref → 依次尝试 main、master）
5. 工作区干净？→ 跳到第 6 步。
   不干净 → 停下问用户，绝不静默 stash。选项：
     [A] 用户自己落 commit 或 stash（推荐）
     [B] 经用户明确同意后由你执行 git stash --include-untracked；
         收尾时必须 git stash pop 还原
     [C] 用户自行处理（另开 clone/worktree 等）——等用户确认再继续
6. 隔离分支： git checkout -b feature/autional <默认分支>（已存在 → git checkout feature/autional）
7. 每个 Phase 边界落 checkpoint： git add -A && git commit -m "checkpoint: Phase N"
8. 回退路径：
   单个文件 → git checkout -- <file>
   整个 Phase → git checkout -- <本 Phase 改过的所有文件>
   放弃接入 → 恢复本 Phase 改过的所有文件（git checkout -- <files>），
             git checkout <默认分支>，
             保留或删除 feature/autional（由用户定），
             仅当第 5 步走了 [B] 才 git stash pop 还原用户工作
```

### 0.3 风险告知（强制）

```
本流程将修改你的项目文件（清单见 Phase 5.0）。
所有改动先落在独立分支；默认分支在你最终明确同意合并前保持原样。
你的现有工作先被妥善处理（0.2 第 5 步）——未经你同意，不 stash、不提交。
随时可以说「放弃接入」，项目会恢复原状。
继续？[继续] [取消]
```
<!-- /lang:zh -->

<!-- lang:en -->
## Phase 1 · System analysis (read-only)

Scan the project. **Do not modify anything in this phase.**

### 1.1 Framework detection

Read `package.json`:

| Dependency | Framework |
|---|---|
| `react` / `react-dom` | React |
| `vue` | Vue 3 |
| `next` | Next.js (React) |
| `@angular/core` | Angular |
| none of the above | ask the user |

Show the result and let the user confirm ("Detected React 18 + Vite. Correct? [Yes] [No, it's Vue]").

### 1.2 Existing user-system detection

| Signature | Meaning |
|---|---|
| `users` table/model with `email`/`password` | Own user system |
| `Login.tsx` / `Login.vue` / signin page | Own login UI |
| `bcrypt` / `argon2` / `crypto` imports | Own password hashing |
| `jwt` / `token` / `session` code | Own auth |
| `middleware` / `auth` / `guard` route protection | Own guards |

Report what exists. Autional takes over: password verification, token issuance/refresh/revocation, session management. The user keeps: their own user table's business fields (name, role, avatar) and business logic.

### 1.3 Conflict detection

| Conflict | Example | Recommendation |
|---|---|---|
| Route clash | your `/api/login` vs Autional endpoints | SDK replaces page logic; your API routes stay |
| Field clash | your `password_hash` column vs Autional-managed passwords | keep the table, drop the auth columns after migration |
| Middleware clash | your auth middleware vs the SDK guard | SDK guard wins (gets auto-refresh + tab sync) |
| Cookie clash | your `auth_token` vs SDK cookie | use the SDK's cookie |

Flag each conflict with options: [A] replace (recommended) [B] coexist [C] postpone.

### 1.4 Gains and impact

```
Replacing hand-rolled auth with Autional:
  ~500 lines of auth logic → one provider import
  plaintext password handling → hashed transmission (SHA-256 / symmetric)
  manual token refresh → automatic refresh with concurrent de-dup
  no CAPTCHA → progressive PoW
  no audit trail → full event tracking
  single user → multi-user + RBAC

Impact:
  New users are created in Autional. Existing users need a one-time link (Phase 5.3).
  The existing login page is replaced (option-based, Phase 5.2).
  The app must be able to reach the Autional endpoints above.
```

### 1.5 Bundle-size impact

```
core + framework package adds ≈ 15 KB (≈ 5 KB gzipped).
First load: +≈ 50 ms (OIDC discovery, cached afterwards). Token refresh only on 401.
Identical weight to the auth code it replaces — plus security updates you no longer maintain.
```

### 1.6 App-data isolation check (read-only)

Login is only half of "multi-user". Check where the app keeps its **application data** (notes, todos, documents…) and whether that data is isolated per account:

```
1. Locate the data layer: localStorage / IndexedDB / SQLite / a backend API.
2. Are storage keys scoped per user?  "notes" (shared) vs "notes:<userId>" (isolated).
3. Are backend rows scoped per user?  a user_id / owner_id column, or none?
4. Once login works (Phase 7): log out, log in as another account — does the data change?
```

Report honestly:

```
Data isolation: ISOLATED / NOT ISOLATED / NOT APPLICABLE (no app data yet)
Where: <storage keys or tables>
What another login sees: <a fresh account's empty state | the same shared data>
```

If NOT isolated, present options — **do not touch the data layer on your own; any change happens only after the user explicitly approves it**:

```
[A] Namespace the existing storage per user id (small; local-first apps)
[B] Move app data behind a backend with per-user scoping (larger; enables multi-device)
[C] Keep as-is for now (e.g. single-machine demo) — record the finding instead
```

Record the finding and the user's decision in `AUTIONAL_CHANGES.md`. An approved change is extra scope: list it in the Phase 5.0 preview and keep it on the same branch.
<!-- /lang:en -->
<!-- lang:zh -->
## Phase 1 · 系统分析（只读）

扫描项目。**本 Phase 不修改任何文件。**

### 1.1 框架检测

读 `package.json`：

| 依赖 | 框架 |
|---|---|
| `react` / `react-dom` | React |
| `vue` | Vue 3 |
| `next` | Next.js（React） |
| `@angular/core` | Angular |
| 以上皆无 | 询问用户 |

展示结果让用户确认（「检测到 React 18 + Vite。对吗？[是] [不，是 Vue]」）。

### 1.2 已有用户系统检测

| 签名 | 含义 |
|---|---|
| 含 `email`/`password` 的 `users` 表/模型 | 自建用户表 |
| `Login.tsx` / `Login.vue` / signin 页面 | 自建登录 UI |
| `bcrypt` / `argon2` / `crypto` import | 自建密码哈希 |
| `jwt` / `token` / `session` 相关代码 | 自建认证 |
| `middleware` / `auth` / `guard` 路由保护 | 自建守卫 |

报告检测结果。Autional 接管：密码校验、Token 签发/刷新/撤销、会话管理。用户保留：自建表的业务字段（name、role、avatar）与业务逻辑。

### 1.3 冲突检测

| 冲突 | 示例 | 建议 |
|---|---|---|
| 路径冲突 | 你的 `/api/login` vs Autional 端点 | SDK 替换页面逻辑；你的 API 路由不动 |
| 字段冲突 | 自建 `password_hash` vs Autional 管密码 | 保留表，迁移后去掉认证列 |
| 中间件冲突 | 自建认证中间件 vs SDK 守卫 | SDK 守卫优先（自动刷新 + 多 Tab 同步）|
| Cookie 冲突 | 自建 `auth_token` vs SDK cookie | 统一用 SDK cookie |

每项冲突给出选项：[A] 替换（推荐） [B] 共存 [C] 暂不处理。

### 1.4 收益与影响

```
用 Autional 替换手写认证：
  ~500 行认证逻辑 → 一次 Provider 引入
  明文密码处理 → 哈希传输（SHA-256 / symmetric）
  手动刷新 Token → 自动刷新 + 并发去重
  无 CAPTCHA → 渐进式 PoW
  无审计 → 全链路事件追踪
  单用户 → 多用户 + RBAC

影响：
  新用户在 Autional 创建；存量用户做一次性关联（Phase 5.3）。
  现有登录页会被替换（选项制，Phase 5.2）。
  应用必须能访问上方 Autional 端点。
```

### 1.5 体积影响

```
core + 框架包 增加约 15 KB（gzip 后约 5 KB）。
首屏 +约 50 ms（OIDC discovery，之后走缓存）。Token 刷新仅 401 时触发。
与被替换掉的认证代码等重——还免去了后续安全维护。
```

### 1.6 应用数据隔离检查（只读）

登录只是「多用户」的一半。检查应用的**业务数据**（笔记、待办、文档……）存在哪里、是否按账号隔离：

```
1. 定位数据层：localStorage / IndexedDB / SQLite / 后端 API。
2. 存储键是否按用户区分？  "notes"（共享）vs "notes:<userId>"（隔离）。
3. 后端行是否带用户维度？  有 user_id / owner_id 列，还是完全没有？
4. 登录打通后（Phase 7）：登出、换一个账号登录——数据变了吗？
```

如实报告：

```
数据隔离：已隔离 / 未隔离 / 不适用（应用尚无业务数据）
位置：<存储键或表>
换账号所见：<新账号的空状态 | 与之前完全相同的共享数据>
```

如果「未隔离」，给出选项——**不要自作主张动数据层；任何整改动作必须经用户明确同意后才执行**：

```
[A] 现有存储按用户 id 做键名空间（小改；本地优先应用）
[B] 业务数据迁到带用户维度的后端（较大；可跨设备）
[C] 暂不处理（如单机演示）——把结论记录下来即可
```

结论（与用户的选择）写入 `AUTIONAL_CHANGES.md`。用户批准的整改属于附加范围：列入 Phase 5.0 改动预览，留在同一分支上。
<!-- /lang:zh -->

<!-- lang:en -->
## Phase 2 · Strategy recommendation (options + confirmation)

### 2.1 Tenant naming

Auto-derive from the project name (`my-blog-app` → `my-blog`). Rules: 3–64 chars, letters/digits/hyphens, not all digits. Check availability; on collision propose variants (`my-blog-2024`, `my-blog-app`, `myblog-hq`) and retry without limit.

### 2.2 Security policy (compliance-driven)

Match the user's scenario against the full matrix in `{{REFS_BASE}}/compliance-matrix.md` (NIST SP 800-63B AAL1–3, PCI DSS v4.0, GDPR, HIPAA). Present options with a recommendation:

```
[A] NIST baseline (recommended for most SaaS) — hash transmission, min 8, upper+lower+digit
[B] Basic (internal tools) — min 6
[C] High security (+MFA mandatory, breached-password check)
[D] Custom
```

### 2.3 Login methods

Recommend from the user's audience: password (default), magic link, OAuth, SMS code. Enterprise → password + SSO; consumer → password + OAuth + SMS.
<!-- /lang:en -->
<!-- lang:zh -->
## Phase 2 · 策略推荐（选项 + 确认）

### 2.1 租户命名

按项目名自动推导（`my-blog-app` → `my-blog`）。规则：3–64 位、字母/数字/连字符、不能纯数字。自动查重；冲突时给备选（`my-blog-2024`、`my-blog-app`、`myblog-hq`），重试不设上限。

### 2.2 安全策略（合规驱动）

把用户场景对照 `{{REFS_BASE}}/compliance-matrix.md` 全表（NIST SP 800-63B AAL1–3、PCI DSS v4.0、GDPR、HIPAA）。展示选项 + 推荐：

```
[A] NIST 基准（多数 SaaS 推荐）——hash 传输、最小 8 位、大写+小写+数字
[B] 基础（内部工具）——最小 6 位
[C] 高安全（强制 MFA、泄露密码检查）
[D] 自定义
```

### 2.3 登录方式

按用户群体推荐：password（默认）、magic link、OAuth、短信验证码。企业 → password + SSO；消费者 → password + OAuth + 短信。
<!-- /lang:zh -->

<!-- lang:en -->
## Phase 3 · Tenant + app credentials

### 3.1 Choose the path

Ask the user:

```
[A] Trial tenant — fastest, no invitation code (recommended to start)
[B] Invitation code — permanent tenant
[C] I already have a tenant — skip registration, reuse existing appId/issuer (see "Existing tenant" edge case)
```

For [A]/[B]: if the installed SDK client exposes `createTrialTenant(...)` / an invitation-based registration call, drive it programmatically (it creates the tenant and the admin user). If the installed version does not expose it, open the developer portal ({{PORTAL_DEVELOPER}}) and walk the user through the same flow in the browser. Do not invent API calls that are not exposed by the installed SDK or documented by the portal.

### 3.2 Credential handling

```
- Admin password: shown ONCE. Tell the user to save it in their password manager now. Never write it to code or config files.
- tenantId / appId / issuer / api URL: public configuration — write to .env (public block) and src/autional.ts.
```

### 3.3 Test accounts

Offer to create 3 test accounts (`player1`…`player3` by default, named to the user's domain) with auto-generated passwords satisfying the Phase 2 policy:
- [A] create 3 (recommended) — via the SDK register call
- [B] skip — later via the admin portal

Record the test accounts in `AUTIONAL_SETUP.md` (passwords shown once).
<!-- /lang:en -->
<!-- lang:zh -->
## Phase 3 · 租户与应用凭证

### 3.1 选择路径

询问用户：

```
[A] 试用租户——最快，无需邀请码（推荐起步）
[B] 邀请码——永久租户
[C] 我已有租户——跳过注册，直接复用现有 appId/issuer（见「已有租户」边界情况）
```

[A]/[B]：若安装的 SDK 客户端提供 `createTrialTenant(...)` / 带邀请码的注册调用，直接编程驱动（它会同时创建租户与管理员）。若当前版本未提供，打开开发者门户（{{PORTAL_DEVELOPER}}）带用户在浏览器里走同一流程。不要臆造 SDK 未暴露、门户未记载的 API。

### 3.2 凭证处理

```
- 管理员密码：只显示一次。让用户立刻存入密码管理器。绝不写入代码或配置文件。
- tenantId / appId / issuer / api URL：公开配置——写入 .env（公开块）与 src/autional.ts。
```

### 3.3 测试账号

建议创建 3 个测试账号（默认 `player1`…`player3`，按用户领域命名），密码自动生成并满足 Phase 2 策略：
- [A] 创建 3 个（推荐）——走 SDK 注册调用
- [B] 跳过——之后在 admin 门户添加

测试账号记录进 `AUTIONAL_SETUP.md`（密码只显示一次）。
<!-- /lang:zh -->

<!-- lang:en -->
## Phase 4 · Dependencies

### 4.1 Install (match the framework)

```bash
# React
npm install {{NPM_SCOPE}}/core {{NPM_SCOPE}}/react {{NPM_SCOPE}}/api-identity

# Vue
npm install {{NPM_SCOPE}}/core {{NPM_SCOPE}}/vue {{NPM_SCOPE}}/api-identity

# Next.js
npm install {{NPM_SCOPE}}/core {{NPM_SCOPE}}/react {{NPM_SCOPE}}/next {{NPM_SCOPE}}/api-identity

# Node backend
npm install {{NPM_SCOPE}}/core {{NPM_SCOPE}}/node {{NPM_SCOPE}}/api-identity
```
<!-- /lang:en -->
<!-- lang:zh -->
## Phase 4 · 依赖安装

### 4.1 安装（按框架）

```bash
# React
npm install {{NPM_SCOPE}}/core {{NPM_SCOPE}}/react {{NPM_SCOPE}}/api-identity

# Vue
npm install {{NPM_SCOPE}}/core {{NPM_SCOPE}}/vue {{NPM_SCOPE}}/api-identity

# Next.js
npm install {{NPM_SCOPE}}/core {{NPM_SCOPE}}/react {{NPM_SCOPE}}/next {{NPM_SCOPE}}/api-identity

# Node 后端
npm install {{NPM_SCOPE}}/core {{NPM_SCOPE}}/node {{NPM_SCOPE}}/api-identity
```
<!-- /lang:zh -->

<!-- region:cn -->
<!-- lang:en -->
> `.cn` note: if your default registry is not already a mainland mirror, append `--registry={{NPM_REGISTRY}}` to the install command above.
<!-- /lang:en -->
<!-- lang:zh -->
> `.cn` 提示：若默认 registry 不是国内镜像，在上方安装命令后追加 `--registry={{NPM_REGISTRY}}`。
<!-- /lang:zh -->
<!-- /region:cn -->

<!-- lang:en -->
Confirm before installing: "Will install Autional SDK packages (≈ 50 KB, ≈ 15 KB gzipped). Continue? [yes] [no]". Use the package manager detected in Phase 0 (pnpm/yarn → equivalent `add` commands).

### 4.2 Configuration injection

Detect the env-file location and the framework's public env prefix:

| Framework | Prefix |
|---|---|
| Vite (React/Vue) | `VITE_` |
| Next.js | `NEXT_PUBLIC_` |
| Create React App | `REACT_APP_` |
| Node | plain (`AUTIONAL_`) |

Append to the public env file (never touch other keys):

```env
AUTIONAL_APP_ID=<appId>
AUTIONAL_ISSUER={{ISSUER}}
AUTIONAL_API_URL={{API_URL}}
```

Then generate `src/autional.ts` from the template in `{{REFS_BASE}}/config-template.md` with the real `appId` / `issuer` / `apiUrl` filled in.
<!-- /lang:en -->
<!-- lang:zh -->
安装前确认：「将安装 Autional SDK 包（约 50 KB，gzip 后约 15 KB）。继续？[是] [否]」。使用 Phase 0 检测到的包管理器（pnpm/yarn → 等效 `add` 命令）。

### 4.2 配置注入

检测 env 文件位置与框架的公开前缀：

| 框架 | 前缀 |
|---|---|
| Vite (React/Vue) | `VITE_` |
| Next.js | `NEXT_PUBLIC_` |
| Create React App | `REACT_APP_` |
| Node | 无前缀（`AUTIONAL_`） |

向公开 env 文件追加（不动其它键）：

```env
AUTIONAL_APP_ID=<appId>
AUTIONAL_ISSUER={{ISSUER}}
AUTIONAL_API_URL={{API_URL}}
```

然后按 `{{REFS_BASE}}/config-template.md` 模板生成 `src/autional.ts`，填入真实 `appId` / `issuer` / `apiUrl`。
<!-- /lang:zh -->

<!-- lang:en -->
## Phase 5 · Code integration (option-based)

### 5.0 Risk disclosure + change preview (mandatory)

Before modifying code, show the file list:

```
⚠️ Confirm before changes:

Will be added:
  + src/autional.ts — SDK config
  + AUTIONAL_CHANGES.md — change log
Will be modified:
  ~ <app entry> — provider wrapping (e.g. src/App.tsx, src/main.ts)
  ~ <login page> — login replacement
  ~ .env — append public config
Will NOT be touched:
  ✓ your business logic
  ✓ your user-table data
  ✓ existing .env contents

Continue? [Continue] [Cancel]
```

Wait for an explicit [Continue] before touching files.

### 5.1 Provider wrapping

```tsx
import { AutionalProvider, RequireAuth } from '{{NPM_SCOPE}}/react';

<AutionalProvider config={autionalConfig}>
  <Router>
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
  </Router>
</AutionalProvider>
```

> **API surface note:** the exports above are this procedure's target API surface. If the installed package version exports different names, read the package's `.d.ts`/README and wire the equivalent provider/hook/guard — keep the same structure (provider wraps the app, guard protects routes). Vue: `createAutional(config)` + install; Next.js: provider in the app root + middleware for protected routes.

### 5.2 Login page

Detect the existing login page, then:

```
[A] Replace with Autional login (recommended) — hashed transmission + CAPTCHA + full token management
[B] Keep yours, add Autional login beside it — gradual migration
[C] Keep yours, only add the route guard — migrate later
```

Label each option with invasiveness / gain / rollback difficulty.

### 5.3 Existing user table

```
[A] Keep the table, add external_id linking to the Autional user id (recommended — no data loss)
[B] Drop the table, use Autional only (data-loss risk)
[C] Dual-write during a transition window
```

Migration template (option A, PostgreSQL):
<!-- /lang:en -->
<!-- lang:zh -->
## Phase 5 · 代码接入（选项制）

### 5.0 风险告知 + 改动预览（强制）

改代码前先展示文件清单：

```
⚠️ 开始修改前请确认：

新增：
  + src/autional.ts — SDK 配置
  + AUTIONAL_CHANGES.md — 变更记录
修改：
  ~ <应用入口> — Provider 包裹（如 src/App.tsx、src/main.ts）
  ~ <登录页> — 登录替换
  ~ .env — 追加公开配置
不会触碰：
  ✓ 你的业务逻辑
  ✓ 你的用户表数据
  ✓ .env 的原有内容

继续？[继续] [取消]
```

等待用户明确 [继续] 后再动文件。

### 5.1 Provider 包裹

```tsx
import { AutionalProvider, RequireAuth } from '{{NPM_SCOPE}}/react';

<AutionalProvider config={autionalConfig}>
  <Router>
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
  </Router>
</AutionalProvider>
```

> **API 面注记：**上方导出名是本流程的目标 API 面。若安装版本的实际导出名不同，读包内 `.d.ts`/README，接线等价实现——保持同一结构（Provider 包应用、守卫保护路由）。Vue：`createAutional(config)` + install；Next.js：根组件放 Provider + middleware 保护路由。

### 5.2 登录页

检测现有登录页，然后：

```
[A] 用 Autional 登录完全替换（推荐）——哈希传输 + CAPTCHA + 完整 Token 管理
[B] 保留你的，旁边新增 Autional 登录——灰度迁移
[C] 保留你的，只加路由守卫——后续再迁
```

每个选项标注：侵入程度 / 收益 / 回退难度。

### 5.3 存量用户表

```
[A] 保留表，新增 external_id 关联 Autional 用户 id（推荐——零数据丢失）
[B] 删表，完全用 Autional（有数据丢失风险）
[C] 过渡期双写
```

迁移模板（选项 A，PostgreSQL）：
<!-- /lang:zh -->

<!-- lang:en -->
```sql
-- 1. Add the linking column
ALTER TABLE users ADD COLUMN external_id VARCHAR(26);
CREATE UNIQUE INDEX idx_users_external_id ON users(external_id);

-- 2. Link existing users (after their accounts exist in Autional)
-- UPDATE users SET external_id = '01KW...' WHERE email = 'user@example.com';

-- 3. Optional: drop auth columns once migration is verified
-- ALTER TABLE users DROP COLUMN password_hash;
-- ALTER TABLE users DROP COLUMN reset_token;
```

```ts
async function findOrCreateLocalUser(autionalUser: { id: string; email: string }) {
  let local = await db.user.findFirst({ where: { externalId: autionalUser.id } });
  if (!local) {
    local = await db.user.findFirst({ where: { email: autionalUser.email } });
    if (local) {
      await db.user.update({ where: { id: local.id }, data: { externalId: autionalUser.id } });
    } else {
      local = await db.user.create({ data: { email: autionalUser.email, externalId: autionalUser.id } });
    }
  }
  return local;
}
```

### 5.4 User center

After login, users manage their own account:

| Feature | SDK call | Page |
|---|---|---|
| Change password | `changePassword()` | /settings/password |
| Profile | `getProfile()` / `updateProfile()` | /settings/profile |
| Forgot password | `forgotPassword()` / `resetPassword()` | /forgot-password |
| Devices/sessions | `getSessions()` / `deleteSession()` | /settings/sessions |
| Delete account | `deleteAccount()` | /settings/delete |

### 5.5 Build verification (mandatory)

```
npm run build (or the project's build command)
  → pass ✅ → Phase 6
  → fail ❌ → checkpoint commit → analyze → fix → retry
  → 3 consecutive failures → git checkout -- <changed files> → analyze → fix → retry
If the project has `npm test`, run it; fix only failures caused by this integration.
```
<!-- /lang:en -->
<!-- lang:zh -->
```sql
-- 1. 添加关联列
ALTER TABLE users ADD COLUMN external_id VARCHAR(26);
CREATE UNIQUE INDEX idx_users_external_id ON users(external_id);

-- 2. 存量用户关联（先在 Autional 建好对应账号后执行）
-- UPDATE users SET external_id = '01KW...' WHERE email = 'user@example.com';

-- 3. 可选：迁移验证后删除认证列
-- ALTER TABLE users DROP COLUMN password_hash;
-- ALTER TABLE users DROP COLUMN reset_token;
```

```ts
async function findOrCreateLocalUser(autionalUser: { id: string; email: string }) {
  let local = await db.user.findFirst({ where: { externalId: autionalUser.id } });
  if (!local) {
    local = await db.user.findFirst({ where: { email: autionalUser.email } });
    if (local) {
      await db.user.update({ where: { id: local.id }, data: { externalId: autionalUser.id } });
    } else {
      local = await db.user.create({ data: { email: autionalUser.email, externalId: autionalUser.id } });
    }
  }
  return local;
}
```

### 5.4 用户中心

登录后用户自行管理账号：

| 功能 | SDK 调用 | 页面 |
|---|---|---|
| 修改密码 | `changePassword()` | /settings/password |
| 个人资料 | `getProfile()` / `updateProfile()` | /settings/profile |
| 忘记密码 | `forgotPassword()` / `resetPassword()` | /forgot-password |
| 设备/会话 | `getSessions()` / `deleteSession()` | /settings/sessions |
| 注销账号 | `deleteAccount()` | /settings/delete |

### 5.5 构建验证（强制）

```
npm run build（或项目等效构建命令）
  → 通过 ✅ → 进入 Phase 6
  → 失败 ❌ → 落 checkpoint 提交 → 分析 → 修复 → 重试
  → 连续 3 次失败 → git checkout -- <改动文件> → 分析 → 修复 → 重试
若项目有 `npm test`，一并运行；只修本次接入导致的失败。
```
<!-- /lang:zh -->

<!-- lang:en -->
## Phase 6 · Unit tests

| Module | Cases | Verify |
|---|---|---|
| TokenManager | store / expire / decode | write → read → expire → null |
| AuthClient | login / register / logout | mock HTTP → correct results |
| ApiClient | GET/POST + 401 refresh | mock 401 → auto refresh → retry |
| Password transmission | hash mode | SHA-256 computed correctly |
| Route guard | RequireAuth | logged-out → redirect |

Retry policy: every failure → show cause → fix → retry. Only stop on import failure (missing dependency) or compile error (syntax) — those need a real fix first.
<!-- /lang:en -->
<!-- lang:zh -->
## Phase 6 · 单元测试

| 模块 | 用例 | 验证 |
|---|---|---|
| TokenManager | 存储 / 过期 / 解码 | 写 → 读 → 过期 → null |
| AuthClient | login / register / logout | Mock HTTP → 返回正确 |
| ApiClient | GET/POST + 401 刷新 | Mock 401 → 自动刷新 → 重试 |
| 密码传输 | hash 模式 | SHA-256 计算正确 |
| 路由守卫 | RequireAuth | 未登录 → 跳转 |

重试策略：每个失败 → 显示原因 → 修复 → 重试。仅在 import 失败（依赖未装）或编译错误时停下——先做真实修复。
<!-- /lang:zh -->

<!-- lang:en -->
## Phase 7 · Integration tests

Run against the live endpoints:

```
1. Discovery — GET {{ISSUER}}/.well-known/openid-configuration → 200, issuer === {{ISSUER}}
2. Register  — sdk.register() creates a user
3. Login     — sdk.login() returns a token set
4. Profile   — sdk.getProfile() returns the registered user
5. Refresh   — sdk.refreshToken() rotates the token set
6. Logout    — sdk.logout() clears the session
7. Revoked   — the old access token is rejected (401 on a protected call)
8. Config    — fetchAuthConfig() returns the tenant policy chosen in Phase 2
```

Failure map:

```
network timeout → "Cannot reach Autional. Check network or status page ({{PORTAL_STATUS}})." → wait → retry
401/403         → "Credentials invalid — check appId and issuer." → ask the user to confirm config
404             → "Endpoint missing — check the apiUrl/issuer values." → verify against the discovery document
500             → "Autional service error." → wait 30 s → retry
other           → show details → retry
```
Only network unreachability and invalid credentials stop the automatic retry loop — both must surface to the user.
<!-- /lang:en -->
<!-- lang:zh -->
## Phase 7 · 集成测试

对线上端点实测：

```
1. Discovery — GET {{ISSUER}}/.well-known/openid-configuration → 200 且 issuer === {{ISSUER}}
2. Register  — sdk.register() 创建用户成功
3. Login     — sdk.login() 拿到 Token
4. Profile   — sdk.getProfile() 返回刚注册的用户
5. Refresh   — sdk.refreshToken() 轮换 Token
6. Logout    — sdk.logout() 清理会话
7. Revoked   — 旧 Token 被拒绝（受保护调用返回 401）
8. Config    — fetchAuthConfig() 返回 Phase 2 选定的租户策略
```

失败映射：

```
网络超时 → 「无法连接 Autional。检查网络或状态页（{{PORTAL_STATUS}}）。」→ 等待 → 重试
401/403  → 「凭证无效——检查 appId 与 issuer。」→ 请用户确认配置
404      → 「端点不存在——检查 apiUrl/issuer 配置。」→ 对照 discovery 文档校验
500      → 「Autional 服务异常。」→ 等待 30s → 重试
其它     → 显示错误详情 → 重试
```
仅网络不可达与凭证错误停止自动重试——两者都必须上报用户。
<!-- /lang:zh -->

<!-- lang:en -->
## Phase 8 · Wrap-up

### 8.1 File inventory

```
Created:  src/autional.ts · AUTIONAL_SETUP.md · AUTIONAL_CHANGES.md · .env.local (gitignored)
Modified: .env (public keys) · .gitignore · app entry · login page · README.md (integration note)
```

### 8.2 Portal guide (for AUTIONAL_SETUP.md)

| Portal | Address | Who | What |
|---|---|---|---|
| Admin | {{PORTAL_ADMIN}} | administrator | users / roles / security policy / audit log |
| User | {{PORTAL_USER}} | end users | change password / devices / MFA |
| Security | {{PORTAL_SECURITY}} | security ops | anomaly detection / login trends / log export |
| Developer | {{PORTAL_DEVELOPER}} | developer | API docs / OAuth clients / app settings |
| Status | {{PORTAL_STATUS}} | everyone | service health |

Common operations: add user → Admin › Users › Add; reset password → Admin › Users › user › Reset; security policy → Admin › Security settings; create app → Admin › Apps (or Developer portal); audit log → Admin › Audit.

### 8.3 Final reminders

```
✅ Integration complete. Confirm:
  1. AUTIONAL_SETUP.md written
  2. Admin password stored in a password manager (shown once)
  3. .env.local NOT committed (gitignored automatically)
  4. npm run dev → exercise login → dashboard → logout
  5. Production: make sure the app origin is allowed for the app in the developer portal
  6. After a few days: check login success rate and token-refresh metrics
```

### 8.4 Branch delivery gate (explicit confirmation required)

```
Integration complete on branch feature/autional. Nothing has been merged.

Deliverables:
  branch:   feature/autional — <N> checkpoint commits ahead of <default>
  changes:  <diffstat summary>
  evidence: build <pass/fail> · unit tests <pass/fail> · integration tests <pass/fail>

Choose:
  [A] Merge into <default>
  [B] Keep the branch for review — merge later yourself
  [C] Discard the branch

Then return to the default branch; restore stashed user work if any (0.2 step 5 [B]):
  [A] git checkout <default> && git merge --no-ff feature/autional && git stash pop
  [B] git checkout <default> && git stash pop          (feature/autional stays)
  [C] git checkout <default> && git branch -D feature/autional && git stash pop
  (conflicts on git stash pop → hand to the user)
Never merge, push, or delete the branch before the user explicitly picks an option.
```
<!-- /lang:en -->
<!-- lang:zh -->
## Phase 8 · 收尾

### 8.1 文件清单

```
新增： src/autional.ts · AUTIONAL_SETUP.md · AUTIONAL_CHANGES.md · .env.local（已 gitignore）
修改： .env（公开键） · .gitignore · 应用入口 · 登录页 · README.md（接入说明）
```

### 8.2 Portal 指引（写入 AUTIONAL_SETUP.md）

| Portal | 地址 | 谁用 | 做什么 |
|---|---|---|---|
| 管理后台 | {{PORTAL_ADMIN}} | 管理员 | 用户/角色/安全策略/审计日志 |
| 用户门户 | {{PORTAL_USER}} | 普通用户 | 改密码/设备/MFA |
| 安全仪表盘 | {{PORTAL_SECURITY}} | 安全运营 | 异常检测/登录趋势/日志导出 |
| 开发者门户 | {{PORTAL_DEVELOPER}} | 开发者 | API 文档/OAuth 客户端/应用设置 |
| 系统状态 | {{PORTAL_STATUS}} | 所有人 | 服务运行状况 |

常用操作：添加用户 → 管理后台 › 用户管理 › 添加；重置密码 → 管理后台 › 用户管理 › 用户 › 重置；安全策略 → 管理后台 › 安全设置；创建应用 → 管理后台 › 应用管理（或开发者门户）；审计日志 → 管理后台 › 审计。

### 8.3 最后提醒

```
✅ 接入完成。请确认：
  1. AUTIONAL_SETUP.md 已写入
  2. 管理员密码已存入密码管理器（只显示一次）
  3. .env.local 未提交 git（已自动 gitignore）
  4. npm run dev → 跑通 登录 → Dashboard → 登出
  5. 生产环境：在开发者门户为该应用放行你的站点 origin
  6. 数日后：检查登录成功率与 Token 刷新指标
```

### 8.4 分支交付出口门（必须显式确认）

```
接入已在 feature/autional 分支上完成，尚未合并。

交付物：
  分支：   feature/autional——领先 <默认分支> <N> 个 checkpoint 提交
  改动：   <diffstat 摘要>
  证据：   构建 <通过/失败> · 单元测试 <通过/失败> · 集成测试 <通过/失败>

请选择：
  [A] 合并进 <默认分支>
  [B] 保留分支再检视——之后你自己合并
  [C] 丢弃分支

之后回到默认分支；若曾代管用户工作（0.2 第 5 步 [B]）则还原：
  [A] git checkout <默认分支> && git merge --no-ff feature/autional && git stash pop
  [B] git checkout <默认分支> && git stash pop          （feature/autional 保留）
  [C] git checkout <默认分支> && git branch -D feature/autional && git stash pop
  （git stash pop 冲突 → 交给用户处理）
未经用户明确选择，绝不合并、不 push、不删分支。
```
<!-- /lang:zh -->

<!-- lang:en -->
## Verification checklist

**Functional**

| Story | Acceptance | How |
|---|---|---|
| New user registers | welcome → first login works | integration test |
| Existing user logs in | email+password → dashboard | integration test |
| Token expiry | silent refresh, no login bounce | unit test |
| Multi-tab | logout in tab A → tab B notices | unit test |
| Wrong password | friendly error, no crash | integration test |
| CAPTCHA | 3 failures → challenge → retry | integration test |

**Security**: password never in URL (hash mode) · tokens not in plaintext localStorage · logout actually revokes · refresh-replay detected · CAPTCHA slows brute force.

**Config**: .env.local gitignored · password shown once · AUTIONAL_SETUP.md generated · summary contains everything.
<!-- /lang:en -->
<!-- lang:zh -->
## 闭环验证清单

**功能**

| 用户故事 | 验收 | 方式 |
|---|---|---|
| 新用户注册 | 欢迎 → 首次登录成功 | 集成测试 |
| 已有用户登录 | 邮箱+密码 → Dashboard | 集成测试 |
| Token 过期 | 静默续期，不跳登录 | 单元测试 |
| 多 Tab | A 登出 → B 感知 | 单元测试 |
| 错误密码 | 友好报错，不崩 | 集成测试 |
| CAPTCHA | 3 次失败 → 挑战 → 重试 | 集成测试 |

**安全**：密码不走 URL（hash 模式）· Token 不明文落 localStorage · 登出真撤销 · 刷新重放可检测 · CAPTCHA 抗爆破。

**配置**：.env.local 已 gitignore · 密码只显示一次 · AUTIONAL_SETUP.md 已生成 · 摘要信息完整。
<!-- /lang:zh -->

<!-- lang:en -->
## Edge cases

| Case | Handling |
|---|---|
| Third-party auth (Firebase/Auth0) | analyze switching cost → migrate or coexist |
| No user system at all | skip 1.2–1.4, create from scratch |
| Non-standard build tool | degrade to manual config, print every command |
| Autional endpoints unreachable | mark blocked, wait for network, surface to user |
| Tenant name unavailable 100× | suggest a new naming strategy |
| User refuses to replace the login page | guard-only mode (5.2 option C) |
| Several projects, one tenant | skip Phase 3, reuse appId + issuer |

### Existing tenant (skip Phase 3)

If the project already has Autional config:

```
"Found existing Autional config — reusing it.
  appId: <appId> · issuer: {{ISSUER}} · tenantId: <tenantId>
  This will be app #N on this tenant. All apps share one user pool (SSO).
  [Reuse] [Create new tenant]"
```

### Rollback / uninstall

```bash
npm uninstall {{NPM_SCOPE}}/core {{NPM_SCOPE}}/react {{NPM_SCOPE}}/api-identity
rm src/autional.ts
# remove AUTIONAL_* keys from .env
# remove the provider wrapper from the app entry
git checkout <login page>   # if option A was used
```

Note: users already registered in Autional are not migrated back into the local table.
<!-- /lang:en -->
<!-- lang:zh -->
## 边界情况

| 情况 | 处理 |
|---|---|
| 第三方认证（Firebase/Auth0） | 分析切换成本 → 迁移或共存 |
| 完全没有用户系统 | 跳过 1.2–1.4，直接创建 |
| 非标准构建工具 | 降级为手动配置，输出所有命令 |
| Autional 端点不可达 | 标记阻塞，等网络恢复，上报用户 |
| 租户名 100 次不可用 | 建议更换命名策略 |
| 用户拒绝替换登录页 | 仅加守卫模式（5.2 选项 C） |
| 多项目共用一个租户 | 跳过 Phase 3，复用 appId + issuer |

### 已有租户（跳过 Phase 3）

项目里已有 Autional 配置时：

```
「检测到已有 Autional 配置，直接复用。
  appId: <appId> · issuer: {{ISSUER}} · tenantId: <tenantId>
  这将是该租户的第 N 个应用。所有应用共享用户体系（单点登录）。
  [复用] [创建新租户]」
```

### 回退 / 卸载

```bash
npm uninstall {{NPM_SCOPE}}/core {{NPM_SCOPE}}/react {{NPM_SCOPE}}/api-identity
rm src/autional.ts
# 移除 .env 中的 AUTIONAL_* 键
# 移除应用入口的 Provider 包裹
git checkout <登录页>   # 若用了选项 A
```

注意：已在 Autional 注册的用户不会自动迁回本地表。
<!-- /lang:zh -->

<!-- lang:en -->
## References

- `{{REFS_BASE}}/compliance-matrix.md` — compliance matrix (NIST / PCI / GDPR / HIPAA and more)
- `{{REFS_BASE}}/config-template.md` — config, env and AUTIONAL_SETUP.md templates
- Human-readable tutorial: {{TUTORIAL_URL}}
- Scaffold CLI (alternative to the manual phases): `{{ONBOARD_CMD}}`
- This file: {{SKILL_SELF_URL}} · checksum: {{SKILL_SHA_URL}}
<!-- /lang:en -->
<!-- lang:zh -->
## 参考

- `{{REFS_BASE}}/compliance-matrix.md` — 合规对照表（NIST / PCI / GDPR / HIPAA 等）
- `{{REFS_BASE}}/config-template.md` — 配置、env 与 AUTIONAL_SETUP.md 模板
- 人类教程：{{TUTORIAL_URL}}
- 脚手架 CLI（手动接入的替代路径）：`{{ONBOARD_CMD}}`
- 本文件：{{SKILL_SELF_URL}} · 校验和：{{SKILL_SHA_URL}}
<!-- /lang:zh -->

<!-- region:com -->
<!-- lang:en -->
> Mirror: {{MIRROR_SKILL_URL}} ({{MIRROR_LABEL}}) — keep the mirror in sync with the canonical URL above.
<!-- /lang:en -->
<!-- lang:zh -->
> 镜像：{{MIRROR_SKILL_URL}}（{{MIRROR_LABEL}}）——与上方 canonical 地址保持同步。
<!-- /lang:zh -->
<!-- /region:com -->
<!-- region:cn -->
<!-- lang:en -->
> Mirror (mainland): {{MIRROR_SKILL_URL}} ({{MIRROR_LABEL}}) — keep the mirror in sync with the canonical URL above.
<!-- /lang:en -->
<!-- lang:zh -->
> 镜像（大陆网络）：{{MIRROR_SKILL_URL}}（{{MIRROR_LABEL}}）——与上方 canonical 地址保持同步。
<!-- /lang:zh -->
<!-- /region:cn -->

<!-- lang:en -->
## Completion checklist (the agent must tick every box)

```
Phases:
  ☐ Phase 0 preparation (default branch detected; dirty-tree decision recorded; isolation branch active)
  ☐ Phase 1 analysis
  ☐ Phase 2 strategy confirmed by the user
  ☐ Phase 3 tenant + app + credentials saved
  ☐ Phase 4 dependencies installed
  ☐ Phase 5 integration + build passed
  ☐ Phase 6 unit tests passed
  ☐ Phase 7 integration tests passed
  ☐ Phase 8 wrap-up

Artifacts:
  ☐ src/autional.ts written
  ☐ 3 test accounts created (or explicitly declined)
  ☐ portal guide generated (admin / user / security / developer / status)
  ☐ .env contains the public config
  ☐ AUTIONAL_SETUP.md exists
  ☐ admin password flagged as "shown once"
  ☐ AUTIONAL_CHANGES.md exists
  ☐ npm run dev boots the app

Workspace + delivery:
  ☐ checkpoints committed at each phase boundary
  ☐ default branch untouched (no merge / no push without the exit-gate choice)
  ☐ stashed user work restored (git stash pop), or conflicts handed to the user
  ☐ data-isolation finding disclosed; any change only with explicit user consent
  ☐ exit gate answered: merge / keep / discard

Final summary to the user:
  App ID: <appId> · Issuer: {{ISSUER}} · Admin: <admin email>
  Login page: <url>/login · Start: npm run dev · Docs: AUTIONAL_SETUP.md
```
<!-- /lang:en -->
<!-- lang:zh -->
## 任务完成检查清单（AI 必须逐项确认）

```
Phase：
  ☐ Phase 0 前置准备（默认分支已探测；脏树处置已记录；分支隔离生效）
  ☐ Phase 1 系统分析
  ☐ Phase 2 策略已获用户确认
  ☐ Phase 3 租户 + 应用 + 凭证已保存
  ☐ Phase 4 依赖已安装
  ☐ Phase 5 代码接入 + 构建通过
  ☐ Phase 6 单元测试通过
  ☐ Phase 7 集成测试通过
  ☐ Phase 8 收尾

产物：
  ☐ src/autional.ts 已写入
  ☐ 已创建 3 个测试账号（或用户明确放弃）
  ☐ Portal 指引已生成（admin / user / security / developer / status）
  ☐ .env 含公开配置
  ☐ AUTIONAL_SETUP.md 存在
  ☐ 管理员密码已提醒「只显示一次」
  ☐ AUTIONAL_CHANGES.md 存在
  ☐ npm run dev 可启动

工作区与交付：
  ☐ 各 Phase 边界已落 checkpoint
  ☐ 默认分支保持原样（未经出口门选择不合并、不 push）
  ☐ 代管的用户工作已还原（git stash pop），或冲突已交给用户
  ☐ 数据隔离结论已披露；整改仅在用户明确同意后进行
  ☐ 出口门已答复：合并 / 保留 / 丢弃

向用户输出最终摘要：
  App ID: <appId> · Issuer: {{ISSUER}} · 管理员: <管理员邮箱>
  登录页: <url>/login · 启动: npm run dev · 文档: AUTIONAL_SETUP.md
```
<!-- /lang:zh -->
