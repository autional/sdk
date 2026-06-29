# AuthMS SDK — AI 接入入口

> ⚠️ 必须严格按 Skill 的 8 个 Phase 顺序执行，不得跳过。  
> 每个 Phase 结束后等待用户确认，再进入下一个。

## 快速路径

```
1. 读取完整 Skill:
   https://gitee.com/authms/sdk/raw/master/.skills/sdk-migration-guide/SKILL.md

2. 严格按 Phase 1→8 执行：
   Phase 1: 扫描项目 → 展示 → 用户确认
   Phase 2: 推荐策略 → 展示 → 用户确认
   Phase 3: 注册租户 → 展示 → 用户确认
   Phase 4: npm install → 展示 → 用户确认
   Phase 5: 代码接入 → 展示 → 用户确认
   Phase 6: 单元测试 → 通过 → 用户确认
   Phase 7: 集成测试 → 通过 → 用户确认
   Phase 8: 收尾 → AUTHMS_SETUP.md → 提醒

3. ⚠️ 每个 Phase 必须先声明「Phase N 开始」，结束时展示结果。
   ⚠️ 任务完成后必须逐项确认检查清单（Skill 末尾）。
   ⚠️ 如果跳过任何 Phase，用户将无法正确接入 AuthMS。
```

## 参考文件（远程可读）

| 文件 | URL |
|------|-----|
| 完整 Skill | `https://gitee.com/authms/sdk/raw/master/.skills/sdk-migration-guide/SKILL.md` |
| 合规对照表 | `https://gitee.com/authms/sdk/raw/master/.skills/sdk-migration-guide/references/compliance-matrix.md` |
| React 模板 | `https://gitee.com/authms/sdk/raw/master/examples/react-authms.ts` |
| Vue 模板 | `https://gitee.com/authms/sdk/raw/master/examples/vue-authms.ts` |
| Next.js 模板 | `https://gitee.com/authms/sdk/raw/master/examples/next-authms.ts` |
