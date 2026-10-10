# Skill 分发发布 Runbook

> 对象：本目录 skill 内容线（`_core/` 单源 → `autional-{com,cn}/` 交付物）与 npm 交付线（`@autional/onboard`）。
> 每轮发布的交付物记录 → `CHANGELOG.md`；线上可达性矩阵与实测散列 → 工作区 `docs/positioning/12-skill-reachability-registry.md`。
> 最近执行：2026-10-11（SSO 接入对齐波；com `v0.1.0-6cdb6716` / cn `v0.1.0-ecb907ae`；复验 34/34）。

## 0. 一图总览

```
skills/_core/（单源：PROCEDURE.md + references/）
   │  node _gen/build-skills.mjs（生成+校验; --check 只验）／_gen/check-skills.mjs（G1-G5）
   ▼
skills/autional-{com,cn}/（生成物；与 _core 同提交）
   │
   ├─ 通道 A 站点快照 ► autional/web 仓 public/ai/* 镜像 ─► www.autional.{com,cn}/ai/skill.md（canonical）
   ├─ 通道 B CDN 上架 ► autional/cdn 仓 ai/v0.1.0-<8hex>/ + latest.<region>.json ─► cdn.autional.{com,cn}/ai/latest/…（兜底）
   └─ 通道 C npm ─────► @autional/onboard（npmjs）／@autional-cn/onboard（npmmirror）——独立版本列车
   │
   ▼
全链复验（T4 矩阵 30 项）────► 记录回填（CHANGELOG.md + registry §12）
```

三条交付通道 = 同一内容、三个去处；按 region 二选一。通道 A/B 属 skill 内容线（同一次内容变更一起发），通道 C 独立。

## 1. 不变量（发布前必读；违反 = 发布作废）

| # | 不变量 | 说明 |
|---|--------|------|
| 1 | 只改 `_core/` | `autional-{com,cn}/` 是生成物。手改即漂移，G1/G3 门会红。 |
| 2 | 区域互斥 | com 产物禁出现 gitee / autional.cn；cn 产物禁 github / autional.com。生成器 fail-closed 拦。 |
| 3 | 字节保真 = git blob 原始字节（LF） | Windows 工作区检出是 CRLF。散列、复制、上架一律取 git blob，勿用工作区文件。 |
| 4 | CDN 版本目录不可变（铁律 1） | `ai/<version>/` 有 immutable 缓存。内容一变 → 发新版本号；**绝不原地改已发布版本**。 |
| 5 | CDN CORS 保持 `*` | 全局头不可删（`cdn/vercel.json`）。 |
| 6 | 版本号两区各算各的 | 内容不同 → 指纹不同；配方与脚本见 §4.1。 |

## 2. Step 0：内容变更与本地门（sdk 仓）

### 2.1 改内容

改 `skills/_core/PROCEDURE.md` 与 `skills/_core/references/*.md`。标记语法（速查，详规见生成器头部注释）：

| 语法 | 作用 |
|------|------|
| `<!-- lang:en -->…<!-- /lang:en -->` | 仅按语言发射的区段 |
| `<!-- region:cn -->…<!-- /region:cn -->` | 仅按区域发射的区段（可嵌套） |
| `<!-- meta:description:<lang> -->…` | frontmatter 文案 |
| `{{NAME}}` | 占位符，从 `_gen/config.<region>.json` 解析；残留即失败 |

### 2.2 生成与校验（无网络依赖）

```bash
cd <sdk>
node skills/_gen/build-skills.mjs     # 生成 + 全门校验（fail-closed：全部通过才写盘）
node skills/_gen/check-skills.mjs     # 独立门：G1 单源一致 / G2 区纯净 / G3 鲜度 / G4 品牌 / G5 canonical
```

### 2.3 协议类变更：T3 干跑

改动影响 agent 工作区协议行为时（提交协议、分支/交付出口等），先跑干跑装置：

```bash
bash skills/_tests/dryrun-prepare.sh   # 建 6 夹具（默认 ROOT=/d/tmp/skill-dryrun；强制 /d/tmp 下防误删）
# … 按 skills/_tests/dryrun-brief.md 受测说明书执行场景 …
bash skills/_tests/dryrun-audit.sh     # 磁盘级审计（不信自述）；判定 = 全 PASS（47/47）零 FAIL
```

### 2.4 提交与 CI

`_core` 与生成物**同提交**。push 到 `github.com:autional/sdk`（开发线 main）触发 `skills-gate` CI（自动跑 check-skills）。

> ⚠ 本仓双 remote：github = 开发线（main）；gitee = 旧线（master，sdk-ci 只跑 pnpm typecheck+test，不跑 skills 门）。

## 3. 通道 A：站点快照（canonical，web 仓）

仓 = `github.com:autional/web`（branch `main`，单仓 → 双 Vercel 项目 REGION=com/cn）。

### 3.1 镜像映射（入仓，勿手改生成物）

| sdk 生成物 | web 入仓镜像（`public/ai/`） | 站点 URL |
|------------|------------------------------|----------|
| `autional-com/SKILL.md` | `skill.en.md`（+ `.sha256`） | com 站 `/ai/skill.md`（主语言 EN） |
| `autional-cn/SKILL.md` | `skill.zh.md`（+ `.sha256`） | cn 站 `/ai/skill.md`（主语言 ZH） |
| `autional-com/references/<名>.md` | `references/<名>.com.md` | 两站通用路径 `/ai/references/<名>.md`（按站落位） |
| `autional-cn/references/<名>.md` | `references/<名>.cn.md` | 同上 |

- 无名版（`skill.md`、`references/<名>.md`）是**构建期生成物**（gitignored），勿手改勿提交。
- 次级语言文件 = 对方区的 SKILL（com 站 `skill.zh.md` = cn 产物，canonical 指 .cn 站；反之亦然）。

### 3.2 `.sha256` 同步（只对 skill 镜像）

更新镜像后重算对应 `.sha256`（格式 = sha256sum 标准 `<64hex>␣␣<文件名>\n`；文件名写镜像自身名）：

```bash
cd <web>
h=$(sha256sum public/ai/skill.en.md | cut -d" " -f1); printf "%s  %s\n" "$h" "skill.en.md" > public/ai/skill.en.md.sha256
h=$(sha256sum public/ai/skill.zh.md | cut -d" " -f1); printf "%s  %s\n" "$h" "skill.zh.md" > public/ai/skill.zh.md.sha256
```

> 抽查 LF 行尾（防 CRLF 混入）：`od -c public/ai/skill.en.md.sha256 | tail -2`（行尾应为 `\n`）。

### 3.3 提交与构建守卫

commit（镜像 + `.sha256`）→ push `main` → 双 Vercel 生产部署。

构建期守卫在 `scripts/gen-static.mjs`（不符**抛错拒构建**）：

| 守卫 | 检查 |
|------|------|
| skill 镜像（§3） | frontmatter `region`/`lang` 行锚 == 本站 REGION/主语言 |
| references 镜像（§3b） | 首行含 `region: <REGION>` 标记 |

### 3.4 复验

同 §6（站点侧 8 资产 + 6 `.sha256` + 指针 + 页面）。

## 4. 通道 B：CDN 上架（兜底，cdn 仓）

仓 = `github.com:autional/cdn`（branch `main`，双 Vercel 项目 cdn / cn-cdn）。上架 = 新版本目录 + 更新本区指针与 rewrite。

### 4.1 计算内容指纹（版本号 = `v0.1.0-<8hex>`）

配方（= ui 仓 build-cdn 同款）：`sha256(entries.map(rel + NUL + "sha384-" + sha384b64).sort().join("\n")).slice(0, 8)`；
`rel` = 版本目录相对路径，`bytes` = **git blob 原始字节**。脚本（已验证可复现：2026-10-10、2026-10-11 两轮四版本号）：

```bash
cd <sdk>
for R in com cn; do REGION=$R node --input-type=module -e '
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const NUL = String.fromCharCode(0);
const repo = ".";                                          // = 当前目录（已 cd 到 sdk 仓）
const prefix = "skills/autional-" + process.env.REGION;
const files = execFileSync("git", ["-C", repo, "ls-tree", "-r", "HEAD", "--name-only", "--", prefix], {encoding: "utf8"}).trim().split("\n");
const entries = files.map(rel => {
  const buf = execFileSync("git", ["-C", repo, "cat-file", "blob", "HEAD:" + rel], {maxBuffer: 1 << 24});
  return rel.slice(prefix.length + 1) + NUL + "sha384-" + createHash("sha384").update(buf).digest("base64");
}).sort().join("\n");
console.log(process.env.REGION, "v0.1.0-" + createHash("sha256").update(entries).digest("hex").slice(0, 8));
'; done
```

> 版本目录内文件集合 = 4 文件（`SKILL.md` + 次级语言 + `references/`×2）；`ls-tree -r` 自然取材。

### 4.2 放版本目录（git blob 直落，避 CRLF）

```bash
REGION=com                         # or cn
VER=v0.1.0-xxxxxxxx                # §4.1 输出
SECOND=SKILL.zh.md                 # com→SKILL.zh.md；cn→SKILL.en.md
DEST=<cdn>/ai/$VER
for f in SKILL.md "$SECOND" references/compliance-matrix.md references/config-template.md; do
  mkdir -p "$DEST/$(dirname "$f")"
  git -C <sdk> cat-file blob HEAD:skills/autional-$REGION/$f > "$DEST/$f"
done
```

### 4.3 字节级复核（推送前）

```bash
cd <cdn>/ai/$VER
for f in …（同 §4.2 清单）; do
  a=$(git hash-object --no-filters "$f")
  b=$(git -C <sdk> rev-parse "HEAD:skills/autional-$REGION/$f")
  [ "$a" = "$b" ] && echo "OK  $f" || echo "MISMATCH  $f"
done
```

全 OK = CDN 文件与 sdk 产物逐字节一致。

### 4.4 更新指针与 rewrite

| 文件 | 改动 |
|------|------|
| `ai/latest.<region>.json` | `version` + `files` 指向新版本（两区互不影响） |
| `vercel.json` | `/ai/latest/:path*` rewrite 目标改新版本目录（cn host 条件 → cn 版本；默认 → com 版本） |

`/ai/latest.json` 的 host 分流指向 `latest.<region>.json`，无需动。

### 4.5 提交推送

commit + push `main` → 双 Vercel 生产部署 → 复验（§6）。

> 铁律 1 提醒：已推送的版本目录**永不再改**。发现内容错误 → 修内容、发**新**版本号，把指针与 rewrite 指过去。

## 5. 通道 C：npm 交付线（独立版本列车）

| 项 | 值 |
|----|-----|
| 包 | `@autional/onboard`（npmjs；`npx @autional/onboard`）／`@autional-cn/onboard`（npmmirror） |
| 版本语义 | 与 skill 内容指纹**独立**（CLI 工具链版本 vs 内容版本） |
| 常规发版 | changesets：`pnpm changeset`（记变更）→ 版本 PR → `pnpm publish:ci`（= build + changeset publish） |
| 包级守卫 | `prepublishOnly` → `scripts/prepublish-guard.mjs`（scope 一致性 + fresh build 断言） |
| 首发/大波 | tag-first（N-05）：`pnpm -r publish --tag next` → 四件套 + 双 registry 闸门 → 逐名 `npm dist-tag add <pkg>@<ver> latest`（坏件暴露面缩到 next 通道） |

**时序约束（C11 教训，2026-10-10）**：SDK 变更牵涉服务端行为（传输口径 / 字段名 / 错误码）时，**先部署服务端修复，再发 npm**。反例：changePassword 契约修复的 npm 发版必须等 identity prod fail-loud 修复上线——否则新旧组合在真实链路上仍踩坑。

**回滚（npm 侧不可删）**：前滚 = 撤 latest 指针（`npm dist-tag`）→ 发补丁版本。弃用用 `npm deprecate`（留公开历史）。

> 细则与波次记录：工作区 `docs/NPM-SCOPE-UNIFICATION-PLAN.md`（波 2 / N-02/N-04/N-05/N-06）。
> ⚠ 若变更牵涉 npm 包名或接入命令（skill 正文引用了发布事实），**先完成 npm 发布，再生成并发布 skill 内容**（N-04）。

## 6. 全链复验（T4 模板，34 项）

| 链 | 项数 | 判据 |
|----|------|------|
| CDN 版本直链（2 区 × 4 文件） | 8 | 落盘散列 == §4.3 blob；头 = immutable + CORS `*` + text/markdown |
| CDN latest 别名（2 区 × 4 文件逐查） | 8 | latest 路径内容 == 版本直链 |
| 双站资产（skill ×4 + references ×4） | 8 | 落盘散列 == sdk / 镜像真源 |
| 双站 `.sha256`（skill.md + 双语言镜像） | 6 | 内容 = `<hash>␣␣<名>`，hash == 对应文件线上散列 |
| 站点指针 `cdn.autional.{com,cn}/ai/latest.json` | 2 | 200 且 version = 新区版本 |
| 双站 `/ai` 页 | 2 | 200 + 构建期内联鲜度标记命中 |
| **合计** | **34** | 全绿 |

> 计数勘正（2026-10-11）：此前记「合计 30」为行合计笔误（行和实为 32）；latest 别名自本轮起按区 × 4 文件逐查（+2），合计 = 34。

```bash
# 落盘散列（⚠ 禁 curl | sha256sum——本机管道散列曾两次误值，见 registry §1）
curl -sS -o s.md -L "https://cdn.autional.com/ai/latest/SKILL.md?cb=$(date +%s)" && sha256sum s.md
# 头核对
curl -sSI "https://cdn.autional.com/ai/latest/SKILL.md" | grep -iE "cache-control|access-control|content-type"
# 真源对照（两值相等 = 逐字节一致）
git -C <sdk> cat-file blob HEAD:skills/autional-com/SKILL.md > ref.md && sha256sum ref.md
```

坑（已验证）：

- 管道散列会出假值 → 一律「落盘再散列」。
- 部署窗口：推送后 ~2 分钟翻转；首探可能命中边缘旧 404 → 带 `?cb=` 破缓存复探，勿即时判红。
- latest 别名 TTL=300s：刚发布时可能短暂指旧版，等 TTL 或破缓存复探。
- `/ai/zh`、`/ai/en` 已退役（每区只留 `/ai/`），404 为预期，勿按 200 断言。

## 7. 记录回填

| 落点 | 内容 |
|------|------|
| `skills/CHANGELOG.md`（本目录） | 新区版本 + 文件字节 / sha256 前 8 + 发布记录（站点快照 commit、CDN commit、复验结果） |
| 工作区 `docs/positioning/12-skill-reachability-registry.md` §14（当前；历史波见 §12） | 版本与配方、完整 sha256、复验矩阵、站点映射 |
| 工作区 12 号 §13（度量台账） | 快照行随发布更新（遥测另立） |
| 双站 `/ai` 页 | 构建期注入的鲜度标记（发布后抽验） |

## 8. 失败与回滚

| 通道 | 失败信号 | 处置 |
|------|----------|------|
| 生成门 | build/check exit ≠ 0 | 修 `_core` 源或 config 重跑；**不得手改产物** |
| T3 干跑 | audit 有 FAIL | 修协议文本；47/47 才放行 |
| 站点 | Vercel 构建抛守卫错 | 查镜像 region/lang 与 references 首行标记，修镜像重推 |
| CDN | §4.3 复核不符 | 未推送：删版本目录重放；**已推送：绝不改** → 发新版本号 + 指针/rewrite 跟随 |
| npm | 坏版已发布 | 前滚：撤 latest 指针 → 发补丁版；不可删包 |
| 部分通道中断 | 三通道组合不一致 | 只补未完成通道；已发布通道不重发 |
