# T3 干跑 · 受测 agent 说明书（agent-facing；不含审计断言）

你在扮演一个「按 skill 执行接入」的 AI agent。skill 全文（执行手册）：

`D:\go\auth_ms_new\sdk\skills\autional-com\SKILL.md` —— 严格按它执行。

## 本干跑的硬约束

- 范围只到：Phase 0（0.2 Git 检测 / 0.3 风险告知）→ 一次「模拟 Phase 的改动」→ 收尾出口（8.4）。
- 「模拟 Phase 的改动」= 在你的工作目录里新建 `mock-phase5.txt`（内容一行），并按 skill 对分支/提交/检查点的纪律处理。不做 Phase 1-7 的任何真实内容；8.1-8.3 的产物生成标 SKIP。
- 禁止：网络调用、npm install、Autional API、租户创建、`git push`。
- 只在你自己的工作目录内操作（见派发消息）。不要碰 D:\go 下的任何目录（skill 手册除外，只读）。
- 环境为 git-bash（Windows）；路径可写 `D:/tmp/skill-dryrun/s1` 或 `/d/tmp/skill-dryrun/s1`。

## 无人值守的模拟用户

skill 让你「问用户」时：把问题原文写进报告（`QUESTION:` 行），然后按派发消息给出的「场景回答」匹配取答案继续。
若某问题没有对应回答 → 停下（不要再动作），报告标记 `UNANSWERED`。

## 报告格式（纯文本，≤40 行）

1. 关键命令序列（按序；所有 git 命令必须列出）
2. `QUESTION:` 行（如有；原文）
3. 最终 git 状态：`branch --show-current` / `status --porcelain` / `log --oneline -5` / `stash list`
4. 特别声明：是否 stash 过 / 是否 push 过 / 是否 merge 过 / 是否删除过分支
