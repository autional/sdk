# npm 包发版手册（`@autional/*`）

> 适用：`sdk/packages/**` 的 npm 产物。**技能（skills/）不算**——技能走 CDN 通道，见 `skills/RELEASING.md`。
> 本文只写「从待发 changeset 到 npm 上出现新版本」这一条最短路径，避免每次现推。

## 0. 发版前必看

- **一天最多一波**（工作区提交纪律）：攒够 changeset 再发，别每天一版刷 CI/配额。
- 发版仓 = `sdk`（GitHub，main 分支）。工作区其它仓不参与。
- 需要 **npm 凭据**（`NPM_TOKEN` 或已 `npm login`）。本机目前**没有**，所以发版常被卡在这一步。

## 1. 查待发内容

```bash
cd sdk
npx changeset status        # 列出将被 bump 的包与级别
ls .changeset/*.md          # 除 README.md 外即待发条目
```

## 2. 发版前置校验（不全绿就别发）

```bash
cd sdk
npx tsc -p packages/core --noEmit
npx tsc -p packages/api-oauth --noEmit
(cd packages/core && npx vitest run)
(cd packages/api-oauth && npx tsup --version >/dev/null)   # 确认构建工具在位
```

## 3. 消费版本号并提交

```bash
cd sdk
npx changeset version        # 改各包 version + 生成 CHANGELOG，删除已消费的 changeset
# ⚠️ version 会把「内部依赖下限」抬高（updateInternalDependencies=patch），
#    与生成器不变量冲突 ⇒ 必须紧接两步还原：
cd .. && python sdk/scripts/generate-api-packages.py   # 依赖下限回到 >=0.1.0
cd sdk && npx pnpm@10 install --lockfile-only          # lockfile 跟着回到一致
git add -A && git commit -m "RELEASING: Releasing <N> package(s)"
git push origin main
```

## 4. 发布到 npm

```bash
cd sdk
npm login                    # 或 export NPM_TOKEN=<token>（CI 环境下）
npx changeset publish
```

发布后立刻复核：

```bash
npm view @autional/core version
npm view @autional/api-oauth version
```

## 5. 回退口径

npm **不支持**覆盖已发版本。发错了只有一个办法：**修完发下一个 patch**，不要 `unpublish`
（会让已装用户拿到不一致的 dist-tags）。

## 6. 当前待发（2026-10-31）

**已发（2026-10-31）**：

| 包 | 版本 | 说明 |
|---|---|---|
| `@autional/core` | **0.4.1** | `portalOAuthClientId`（U554） |
| `@autional/api-oauth` | **0.6.1** | `PublicClientInfo.kind`（U556） |

复核：`https://registry.npmjs.org/-/package/@autional%2fcore/dist-tags` → `latest=0.4.1`；
`…/api-oauth/dist-tags` → `latest=0.6.1`。git tag `@autional/core@0.4.1`、`@autional/api-oauth@0.6.1` 已推。

## 7. 本机发版踩过的坑（都在 2026-10-31 实测）

| 坑 | 现象 | 正确做法 |
|---|---|---|
| 默认 registry = 国内镜像 | `npm whoami` 报 `need auth`；镜像根本不接受发布 | 发布与校验一律显式 `--registry https://registry.npmjs.org`（或 `NPM_CONFIG_REGISTRY`）；镜像只能读 |
| 内部依赖顺序 | `changeset version` 把 `api-oauth` 的 `@autional/core` 抬到 `>=0.4.1`，core 未发时 `pnpm install` 解析失败 → node_modules 被清、tsup 变悬空链接 | **先发 core，再装再看 api-oauth**；顺序错了靠 revert 回滚重来 |
| lockfile 写入方版本 | 用 pnpm 12 生成 → peer 后缀整体重写（600+ 行噪音）；且 12 会顺手写 `minimumReleaseAgeExclude` | 用 **pnpm 10**（`npx pnpm@10 install --lockfile-only`）维护 lockfileVersion 9.0；frozen 校验加 `CI=true` 免 TTY 中止 |
| `allowBuilds.sharp` 占位符 | 值写成 `set this to true or false` → pnpm 12 判为未获准 → `ERR_PNPM_IGNORED_BUILDS` | 已修（`sharp: true`，见 `a56a201`） |
| 新版本刚发就装 | pnpm 12 的 `minimumReleaseAge` 会拒绝「太新」的包 | 用 pnpm 10，或加 `minimumReleaseAgeExclude` |
| `changeset version` 抬高内部依赖下限 | api-oauth 的 `@autional/core` 被抬到 `>=0.4.1` → SDK Gate 判「生成物漂移」，且 frozen 安装报 `OUTDATED_LOCKFILE` | version 后必须重跑 `generate-api-packages.py` + `pnpm@10 install --lockfile-only`，再提交（见 §3） |

