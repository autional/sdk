---
"@autional/core": patch
---

修正 `exports["./platform"]` 的条件顺序：`types` 前置（原先置尾）。

Node/TS 按对象键顺序求值条件导出，`types` 置尾不符合规范形式；当前 dist 因 tsup 同时产出
`index.d.mts` 靠同名兄弟查找侥幸可用，一旦产物形态变化或走 publint / arethetypeswrong 严格校验
即会失去类型解析。运行时 `import` / `require` 目标路径未变（U491）。
