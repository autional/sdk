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
