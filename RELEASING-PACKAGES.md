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

| 包 | 级别 | 来源 |
|---|---|---|
| `@autional/api-oauth` | patch | `.changeset/api-oauth-client-kind.md`（U556 波：补 `kind` 字段） |
| `@autional/core` | patch | `.changeset/core-portal-oauth-client-id.md`（U554 波：`portalOAuthClientId`，回落旧字段） |

前置校验现状（2026-10-31 实测）：`core` tsc 通过 / 单测 **186/186**；`api-oauth` tsc 通过。
**唯一阻塞 = npm 凭据**，拿到即可按 §3–§4 一条线走完。
