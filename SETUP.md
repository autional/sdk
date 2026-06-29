# AuthMS SDK — AI 接入入口

> AI 工具请读取此文件，然后获取完整迁移指南。

## 快速路径

```
1. 读取完整 Skill:
   https://gitee.com/authms/sdk/raw/master/.skills/sdk-migration-guide/SKILL.md

2. 按 Skill 的 8 个 Phase 执行：
   Phase 1: 扫描项目 → 识别框架/用户系统
   Phase 2: 推荐策略 → 让用户选择
   Phase 3: 注册租户 → 保存凭证
   Phase 4: npm install @authms/core @authms/react @authms/api-identity
   Phase 5: 复制 example → 包裹 Provider → 替换登录页
   Phase 6-7: 逐项测试 → 失败重试
   Phase 8: 生成 AUTHMS_SETUP.md → 保存 .env → 提醒用户

3. 原则：每一步先展示给用户确认，不擅自修改。
```

## 参考文件（远程可读）

| 文件 | URL |
|------|-----|
| 完整 Skill | `https://gitee.com/authms/sdk/raw/master/.skills/sdk-migration-guide/SKILL.md` |
| 合规对照表 | `https://gitee.com/authms/sdk/raw/master/.skills/sdk-migration-guide/references/compliance-matrix.md` |
| React 模板 | `https://gitee.com/authms/sdk/raw/master/examples/react-authms.ts` |
| Vue 模板 | `https://gitee.com/authms/sdk/raw/master/examples/vue-authms.ts` |
| Next.js 模板 | `https://gitee.com/authms/sdk/raw/master/examples/next-authms.ts` |
