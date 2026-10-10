# T3 干跑报告 — skill 工作区协议（S1–S7）

结论：7 场景全部 PASS（磁盘级独立审计 **47/47** 断言）。agent 行为与协议文本一致；首轮 6 项 FAIL 全部诊断为审计脚本误报（非协议违规），已修正。

## 方法

- 夹具：6 个独立 git 仓（takenote fork 克隆）于 `/d/tmp/skill-dryrun/`，前态哈希留档 `state/*-pre.txt`；origin 重写为不存在路径（push 必败的安全网）。
- 受测对象：重建后的交付物 `skills/autional-com/SKILL.md`（core@ffb54a28b76c）；受测说明书 `dryrun-brief.md`（范围 = Phase 0 + 模拟改动 + 8.4 出口）。
- 独立审计：`dryrun-audit.sh` 只对磁盘断言（reflog / master 指针 / 文件哈希 / stash 列表），不采信 agent 自述。
- S6 = 负例扫描：全部夹具禁「reset 位移」与「origin 推送」。

## 场景结果

| # | 场景 | 验证的协议条款 | 结果 |
| --- | --- | --- | --- |
| S1 | 干净仓 · 出口[B]保留分支 | 默认分支检测 / 建分支 / 检查点 / 出口门 | PASS |
| S2 | 脏仓 · 停住询问 | 0.2-5 脏树 stop-and-ask，零触碰 | PASS |
| S3 | 脏仓 · 中途放弃 | 经同意 stash → 建分支 → 检查点 → 放弃复原 | PASS |
| S4 | 终点出口[A]合并 | merge --no-ff / 分支保留 / 不 push | PASS |
| S5 | 终点出口[C]丢弃 | 删分支 / WIP 复原 / 不 push | PASS |
| S6 | 负例扫描（全夹具） | 无 reset 位移 / origin/master 未动 | PASS |
| S7 | 数据隔离检查（只读） | 1.6 检出 + 披露 + 同意门，零修改 | PASS |

## 关键行为 → 证据

| 行为 | 证据（磁盘断言） |
| --- | --- |
| 默认分支检测 | `origin/HEAD → master`（全部夹具）；S1 分支基于 master 且 master 指针未动 |
| 脏树停住零触碰 | S2 双 WIP 文件字节级 = pre 哈希；无分支、无 stash、脏树 2 条原样 |
| stash 同意门 + 归还 | S3/S5 仅在场景明确同意后 stash；最终 stash 列表全空 |
| 检查点纪律 | S1 分支领先 master 1（checkpoint 提交） |
| 出口[A]合并 | S4 master = 2 亲代 merge 提交 + `mock-phase5.txt` 并入；分支保留 |
| 出口[C]丢弃 | S5 分支已删；mock 文件未残留于 master；WIP 语义复原 |
| 绝不 push / reset | 全夹具 `origin/master` = pre head；reflog 无非 HEAD 位移 |
| 数据隔离同意门 | S7 报告 NOT ISOLATED → 停于询问；工作树与 master 零改动 |

## 审计脚本 2 处误报（诊断留痕，非协议违规）

| 首轮误报 | 根因 | 修正 |
| --- | --- | --- |
| S3/S5 reflog 出现 `reset: moving to HEAD` | git stash push 内部行为（同提交记录，无位移） | 断言精确化：仅禁非 HEAD 目标的 reset |
| S3/S5 WIP 哈希不匹配（4 项） | `core.autocrlf=true`：stash 往返 EOL 归一为 CRLF（内容无丢失；去 `\r` 逐字节对照已证明一致） | 比较改为 EOL 归一哈希、对照 S2 未触碰件；S2 无 git 往返，保留原始字节断言 |

首轮 40 PASS / 6 FAIL → 修正后 **47 PASS / 0 FAIL**。协议文本未因误报改动。

## 覆盖与未覆盖

- 覆盖：Phase 0.2（默认分支 / 脏树 / 建支）、检查点纪律、8.4 三出口（merge / 删支 / stash 复原）、1.6 数据隔离同意门、全局禁 push。
- 未覆盖（有意）：Phase 1-7 真实内容、8.1-8.3 产物生成（标 SKIP）、网络与 API 调用（场景禁止）——由 takenote 实验室的真实接入承担。
- 夹具保留于 `/d/tmp/skill-dryrun/` 供复核；重跑 = `dryrun-prepare.sh` → 场景 → `dryrun-audit.sh`。
