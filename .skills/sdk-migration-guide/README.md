# ⚠️ 已退役（Deprecated）

本目录（原 `sdk-migration-guide` Skill）已**退役**，不再维护。

- 新的 skill 分发体系位于 [`sdk/skills/`](../../skills/)：
  - `skills/_core/` — 单一真源（`PROCEDURE.md` + `references/`）
  - `skills/_gen/` — 生成器（`build-skills.mjs` + `config.<region>.json`）
  - `skills/autional-com/`、`skills/autional-cn/` — 两 region 生成物
- 对外入口（canonical）：
  - `.com` — https://www.autional.com/ai/skill.md
  - `.cn` — https://www.autional.cn/ai/skill.md
- 兜底镜像：
  - `.com` — https://cdn.autional.com/ai/latest/SKILL.md
  - `.cn` — https://cdn.autional.cn/ai/latest/SKILL.md

本目录仅保留此 README 作为历史留痕；原 `SKILL.md` 与 `references/` 已删除，其内容已被上述新体系取代。
