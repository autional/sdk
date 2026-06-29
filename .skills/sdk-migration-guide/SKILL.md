---
name: sdk-migration-guide
description: >
  帮助用户将现有系统升级为通过 AuthMS SDK 对接的金融级多用户系统。
  覆盖系统分析、策略推荐、租户注册、依赖安装、代码接入、测试验证、配置保存、文档更新的全流程。
  触发关键词: 接入AuthMS、对接AuthMS、迁移到AuthMS、升级用户系统、AuthMS SDK、migrate to AuthMS、integrate AuthMS、用户系统升级。
  核心原则: 分析→推荐→确认→执行，最小化用户操作、最大化用户收益、充分尊重用户选择。
  无限重试策略（不设上限），网络不通/凭证错误除外。
---

# SDK Migration Guide — AuthMS 系统接入升级

> 金融级用户系统安全 ready 的一站式迁移 Skill

## 核心原则

1. **充分尊重用户选择**——每步关键决策展示选项 + 推荐 + 理由，用户确认后才执行。
2. **合规驱动推荐**——策略选择基于 NIST/PCI/GDPR 等标准，标注合规级别。
3. **无限重试**——租户名/测试等不设重试上限。网络不通和凭证错误除外。
4. **安全第一**——私密信息不提交 git，公开信息自动写入配置。
5. **文档即配置**——每个阶段产出的配置、决策、理由都记录为文档。

## ⚠️ 强制执行规则（AI 必须遵守）

```
1. 按 Phase 1→8 顺序执行，不得跳过任何 Phase。
2. 每个 Phase 开始前声明「Phase N 开始」。
3. 每个 Phase 结束后向用户展示结果，等待确认。
4. 用户确认后才进入下一个 Phase。
5. 遇到错误时：展示错误 → 修复 → 从当前 Phase 重新开始，不回退。
6. 任务完成后输出清单，逐项确认。
```

**如果你跳过任何 Phase，用户将无法正确接入 AuthMS。**

---

## 前置准备（启动时自动执行）

### 必读参考文档（远程可读）

- SDK README: `https://gitee.com/authms/sdk/raw/master/README.zh.md`
- 接入入口: `https://gitee.com/authms/sdk/raw/master/SETUP.md`
- React 模板: `https://gitee.com/authms/sdk/raw/master/examples/react-authms.ts`
- Vue 模板: `https://gitee.com/authms/sdk/raw/master/examples/vue-authms.ts`
- Next.js 模板: `https://gitee.com/authms/sdk/raw/master/examples/next-authms.ts`

### 工具包检查

确保以下工具可用：
- `npm` / `pnpm` — 包管理
- `curl` — API 连通性测试
- `git` — 版本管理
- `node` ≥ 18 — 运行时

---

## Phase 1：系统分析（只读）

### 目标
扫描当前项目，识别框架、已有用户系统、差异分析。**不修改任何文件。**

### 1.1 框架检测

```
操作：读取 package.json → 检测依赖
  react / react-dom     → React
  vue                   → Vue 3
  next                  → Next.js
  @angular/core         → Angular
  none of above         → 询问用户

输出：展示检测结果，让用户确认。

互动模板：
  "检测到你的项目使用 React 18 + Vite 构建。正确吗？"
  选项: [确认] [不，我用的是 Vue]
```

### 1.2 用户系统检测

扫描以下签名：

| 签名 | 对应功能 | 判断 |
|------|---------|------|
| `users` 表模型（含 `email`/`password`/`username`） | 用户表 | 有自建 User 系统 |
| `Login.tsx` / `Login.vue` / `signin` 页面 | 登录页 | 有自建登录 UI |
| `bcrypt`/`argon2`/`crypto` 密码相关 import | 密码哈希 | 有自建密码系统 |
| `jwt`/`token`/`session` 相关代码 | Token 管理 | 有自建认证 |
| `middleware`/`auth`/`guard` 路由保护 | 权限守卫 | 有自建权限 |

```
输出：
  "你的系统当前有：
    ✅ User 表（src/models/User.ts — email, password, name, role）
    ✅ 登录页（src/pages/Login.tsx）
    ✅ JWT 中间件（src/middleware/auth.ts）
  
  AuthMS 可以接管：email/password 管理、JWT 签发、Token 刷新、登出撤销
  你保留的是：User 表的扩展字段（name, role）、业务逻辑"
```

### 1.3 冲突检测

| 冲突类型 | 示例 | 处理建议 |
|---------|------|---------|
| 路径冲突 | 你的 `/api/login` vs AuthMS `/bff/identity/api/v1/auth/login` | SDK 替换页面逻辑，API 路径不改 |
| 字段冲突 | User 表 `password_hash` vs AuthMS 自己管理密码 | 保留你的表，去掉 password 列 |
| 中间件冲突 | 你的 `authMiddleware` vs AuthMS `RequireAuth` | SDK 的优先级更高 |
| Cookie 冲突 | 你的 `auth_token` vs AuthMS cookie | 统一用 AuthMS 的 cookie 名 |

```
交互模式：
  "⚠️ 检测到冲突：你的 src/middleware/auth.ts 和 AuthMS 的 RequireAuth 功能重叠。
   建议：用 AuthMS RequireAuth 替换你的中间件（获得自动 token 刷新 + 多 Tab 同步）。
   选项: [A] 替换（推荐） [B] 两者共存 [C] 暂不处理"
```

### 1.4 收益分析

```
替换你的自建认证 → AuthMS SDK：
  📦 减少代码：~500 行认证逻辑 → 1 行 import
  🔒 安全升级：plain 密码 → hash/SHA-256 传输
  🔄 Token 自动化：手动刷新 → 自动 refresh + 并发去重
  🛡️ CAPTCHA：无 → 渐进式 PoW + Turnstile
  📊 审计：无 → 全链路事件追踪
  👥 多用户：单用户 → 多租户 + RBAC 权限

影响分析：
  ⚠️ 用户数据：新用户由 AuthMS 创建。现有用户需要迁移（提供迁移脚本）
  ⚠️ 登录页：你的 Login.tsx 将被替换
  ⚠️ 部署：需要 AuthMS 服务器可访问

### 1.5 性能影响评估

```
@authms/core + @authms/react 对项目的影响：
  Bundle 增量: ~15KB (gzipped ~5KB)
  首次加载: +~50ms (OIDC Discovery)
  Token 刷新: ~100ms (仅 401 时触发)
  页面渲染: 无影响（React Context，O(1)）
  
对比自建认证:
  自建: ~500 行代码 → ~15KB 额外体积 + 维护成本
  SDK:  1 行 import → ~5KB gzipped + 零维护
  
结论：SDK 体积几乎等同于自建认证代码，但获得安全更新和功能迭代。
```
```

---

## Phase 2：策略推荐（展示 + 确认）

### 2.1 租户命名

```
推荐命名（基于项目名自动生成）：
  项目名 "my-blog-app" → 租户 "my-blog"
  项目名 "公司内部OA" → 租户 "corp-oa"

规则：3-64 位，字母/数字/连字符，不能纯数字。

交互：
  "推荐租户名: my-blog。自动检查可用性..."
  
  不可用？→ "my-blog 已存在。备选: my-blog-2024, my-blog-app, myblog-hq"
  用户也可输入: [_________]
  
  无限重试直到找到可用名。
```

### 2.2 安全策略（合规驱动）

| 场景 | 合规标准 | 推荐配置 | 级别 |
|------|---------|---------|:--:|
| 内部工具 | 最小 | `min_length: 6`, `plain` 传输 | 基础 |
| SaaS 应用 | NIST SP 800-63B | `min_length: 8`, `hash`, 大小写+数字 | **推荐** |
| 金融/支付 | PCI DSS v4.0 | `min_length: 12`, `expiry: 90d`, `hash` | 高安全 |
| 医疗 | HIPAA | + MFA 强制, `breached_check` | 合规强制 |
| 欧洲用户 | GDPR | + `breached_check`, 数据导出 API | 合规强制 |

```
交互：
  "你的场景: SaaS 应用，存储用户上传内容。
   推荐: NIST SP 800-63B AAL2 级别。
   
   密码策略:
     ✅ password_transmission = hash（默认，免费）
     ✅ min_length = 8
     ✅ require_upper/lower/digit = true
     ⬜ MFA 强制 — 增加安全性，但用户体验有影响
     ⬜ breached_password_check — 检查泄露密码库
   
   选择你的配置:
     [A] NIST 基准（推荐） [B] 仅基础 [C] 高安全(+MFA) [D] 自定义"
```

### 2.3 登录方式

```
根据你的用户场景推荐:
  ✅ password（邮箱+密码）— 默认
  ⬜ magic_link — 无密码登录，适合非技术用户
  ⬜ oauth — 微信/Google/GitHub 登录
  ⬜ sms_code — 手机验证码登录

交互:
  "你的用户主要是: [A] 企业内部员工 [B] 公众用户 [C] 两者都有"
  → 根据答案自动推荐登录方式组合
```

---

## Phase 3：租户注册（预校验 + 无限重试）

### 3.1 预校验清单

```
每个字段在提交前验证：
  ☑ 租户名: 3-64 字，匹配 ^[a-z0-9][a-z0-9-]*[a-z0-9]$，非纯数字
  ☑ 管理员邮箱: 匹配 RFC 5322
  ☑ 管理员密码: 满足 Phase 2 选择的策略
  ☑ 租户名可用性: 调 AuthMS API 检查（409 = 不可用）
  ☑ 域名（如填）: 格式有效
```

### 3.2 注册流程

```
POST /bff/tenant/api/v1/admin/tenants
  成功 → 进入 Phase 3.3（保存凭证）
  
  409 租户名冲突 → "my-blog 已被占用。试试: my-blog-app, my-blog-2024？"
  400 格式错误 → 显示具体违规字段
  500 服务器错误 → "AuthMS 服务器异常，30 秒后自动重试..."
  
  重试策略: 无上限（用户主动取消才停）
```

### 3.3 凭证安全保存

```
注册成功！请保存以下信息：

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 私密信息（不要提交到 git！）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  管理员邮箱:   admin@my-blog.authms.com
  管理员密码:   Kx9#mP2$vL7@qR4!  ← 仅显示一次！
  API Key:      ak_01KW7XV...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 公开配置（可提交 git）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  appId:        app_01KW7XV...
  tenantId:     tnt_01KW7XV...
  issuer:       https://auth.iam.tianv.com

操作：
  1. 📋 公开配置已自动写入 .env 和 src/authms.ts
  2. 🔒 私密信息请立即保存到密码管理器
  3. 📄 .env.local 已创建并加入 .gitignore
  4. ⚠️ 以上私密信息不会再次显示
```

---

## Phase 4：依赖安装

### 4.1 SDK 安装

```bash
# React
npm install @authms/core @authms/react @authms/api-identity

# Vue
npm install @authms/core @authms/vue @authms/api-identity

# Next.js
npm install @authms/core @authms/react @authms/next @authms/api-identity
```

```
交互：
  "将在你的项目中安装: @authms/core @authms/react @authms/api-identity
   预计增加 ~50KB（gzipped ~15KB）。
   继续？ [确认] [取消]"
```

### 4.2 配置注入

```
自动检测 .env 文件位置 → 注入：
  VITE_AUTHMS_APP_ID=app_01KW7XV...
  VITE_AUTHMS_ISSUER=https://auth.iam.tianv.com

自动检测 src/ 目录 → 复制 example → 填写 appId + issuer
  → src/authms.ts 生成完毕
```

---

## Phase 5：代码接入（选项制）

### 5.1 路由包裹

```tsx
// 自动在 App.tsx 中外层包裹 AuthmsProvider
<AuthmsProvider config={authmsConfig}>
  <Router>
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
  </Router>
</AuthmsProvider>
```

### 5.2 登录页替换

```
检测到 src/pages/Login.tsx
选项：
  [A] 用 AuthMS 登录完全替换（推荐）— 获得密码传输安全 + CAPTCHA + 自动 token 管理
  [B] 保留你的登录页，在旁边新增 AuthMS 登录 — 灰度迁移
  [C] 暂不替换，只加路由守卫 — 先用你的登录，后续再迁移

每种选项都标注: 侵入程度 / 收益 / 回退难度

[A] → 生成新的 Login.tsx（使用 useAuthms().login()）
[B] → 保留原文件，新增 AuthmsLogin.tsx，路由共存
[C] → 只加 RequireAuth 包裹，不改 Login 页面
```

### 5.3 User 表迁移

```
检测到你的 User 模型。选项：
  [A] 保留你的 User 表，新增 external_id 字段关联 AuthMS user_id — 推荐
  [B] 删除 User 表，完全使用 AuthMS API — 数据丢失风险
  [C] 暂时双写 — 灰度期用

推荐 [A]:
  users 表新增: external_id VARCHAR(26) — 指向 AuthMS 的 user_id
  你的业务字段（name, role, avatar）保持不变
  登录后通过 external_id 关联你的 User 记录
```

**迁移 SQL 模板**（PostgreSQL）：

```sql
-- 1. 添加 external_id 列
ALTER TABLE users ADD COLUMN external_id VARCHAR(26);
CREATE UNIQUE INDEX idx_users_external_id ON users(external_id);

-- 2. 现有用户迁移（需先在 AuthMS 中创建对应账号后执行）
-- UPDATE users SET external_id = '01KW...' WHERE email = 'user@example.com';

-- 3. 可选：移除不再需要的认证列（确认迁移完成后）
-- ALTER TABLE users DROP COLUMN password_hash;
-- ALTER TABLE users DROP COLUMN reset_token;

-- 4. 登录时关联逻辑（TypeScript）
async function findOrCreateLocalUser(authmsUser: { id: string; email: string }) {
  let local = await db.user.findFirst({ where: { externalId: authmsUser.id } });
  if (!local) {
    // 首次登录：通过 email 匹配已有用户
    local = await db.user.findFirst({ where: { email: authmsUser.email } });
    if (local) {
      await db.user.update({ where: { id: local.id }, data: { externalId: authmsUser.id } });
    } else {
      // 新用户：创建本地记录
      local = await db.user.create({ data: { email: authmsUser.email, externalId: authmsUser.id } });
    }
  }
  return local;
}
```


---

## Phase 6：单元测试

### 6.1 测试清单

| 模块 | 用例 | 验证 |
|------|------|------|
| TokenManager | 存储/过期/解码 | 写→读→过期→null |
| AuthClient | login/register/logout | Mock HTTP → 返回正确 |
| ApiClient | GET/POST/401 刷新 | Mock 401 → 自动 refresh → 重试 |
| 密码传输 | hash 模式 | SHA-256 计算正确 |
| 路由守卫 | RequireAuth | 未登录 → 跳转 |

### 6.2 重试策略

```
每个测试失败 → 显示错误原因 → 修复 → 重试
仅以下情况停止重试：
  ❌ import 失败（依赖未安装）
  ❌ 编译错误（语法问题）
其他所有失败 → 自动修复 → 重试
```

---

## Phase 7：集成测试

### 7.1 连通性测试

```
1. Health Check → Gateway 可达
2. Auth Config → 配置正确
3. Register → 用户创建成功
4. Login → Token 获取成功
5. Profile → /auth/me 可访问
6. Refresh → Token 刷新
7. Logout → Token 撤销
8. Revoked Verify → 旧 Token 401
```

### 7.2 重试策略

```
每个步骤失败：
  网络超时 → "无法连接到 AuthMS。检查网络或 AuthMS 服务状态。" → 等待 → 重试
  401/403 → "凭证无效，检查 appId 和 issuer。" → 让用户确认配置
  404 → "端点不存在，检查 apiUrl 配置。" → 自动修正路径
  500 → "AuthMS 服务异常。" → 等待 30s → 重试
  其他 → 显示错误详情 → 自动重试

仅网络不通或凭证错误停止自动重试。其他所有错误 → 重试。
```

---

## Phase 8：收尾

### 8.1 文件清单

```
创建的文件：
  src/authms.ts          — SDK 配置（可提交 git）
  AUTHMS_SETUP.md        — 接入摘要文档
  .env.local             — 私密环境变量（已 gitignore）

修改的文件：
  .env                   — 追加公开配置
  .gitignore             — 添加 .env.local
  src/App.tsx            — 包裹 AuthmsProvider
  src/pages/Login.tsx    — 替换登录逻辑（选项 A）
  README.md              — 补充 AuthMS 接入说明
```

### 8.2 接入摘要（AUTHMS_SETUP.md）

```markdown
# AuthMS 接入配置 — my-blog-app

## 基本信息
- 接入日期: 2026-06-28
- 框架: React 18 + Vite
- 租户: my-blog
- 环境: 生产 / 开发

## 配置信息
- App ID: app_01KW7XV...
- Issuer: https://auth.iam.tianv.com
- 管理员: admin@my-blog.authms.com

## 安全策略
- 密码传输: hash (SHA-256)
- 最小长度: 8
- 要求: 大写 + 小写 + 数字

## 重要提醒
- 管理员密码已单独保存（不在此文档中）
- .env.local 不在 git 中
- 定期检查 AuthMS 控制台的安全建议
```

### 8.3 最后提醒

```
✅ 接入完成。请确认：
  1. 📄 AUTHMS_SETUP.md 记录完整
  2. 🔒 管理员密码已保存到密码管理器
  3. 🚫 .env.local 不要提交到 git（已自动加 .gitignore）
  4. 🧪 运行 npm run dev 验证登录→Dashboard→登出全流程
  5. 🌐 生产环境已启用 Gateway CORS（CORS_ENABLED=true）
  6. 📊 建议 7 天后检查登录成功率、Token 刷新率等指标
```

---

## 闭环验证清单（专业测试员视角）

### 功能闭环

| 用户故事 | 验收标准 | 测试方式 |
|---------|---------|---------|
| 新用户注册 | 收到欢迎邮件 → 首次登录成功 | 集成测试 |
| 已有用户登录 | 输入邮箱密码 → 进入 Dashboard | 集成测试 |
| Token 过期续期 | 30 分钟后访问 API → 自动刷新 → 不跳登录 | 单元测试 |
| 多 Tab 同步 | Tab A 登出 → Tab B 自动感知 | 单元测试 |
| 错误处理 | 错误密码 → 显示友好错误 → 不崩溃 | 集成测试 |
| CAPTCHA 保护 | 3 次失败后 → 弹 PoW challenge → 求解 → 重试 | 集成测试 |

### 安全闭环

| 检查项 | 验证 |
|--------|------|
| 密码不在 URL 中传输 | ✅ hash 模式 |
| Token 不在 localStorage 明文 | ⬜ BFF cookie 模式（可选） |
| 登出后 Token 不可用 | ✅ 连通测试验证 |
| Refresh Token 重放检测 | ✅ 单元测试验证 |
| CAPTCHA 防止暴力破解 | ✅ PoW 自动求解 |

### 配置闭环

| 检查项 | 验证 |
|--------|------|
| .env.local 在 gitignore | ✅ |
| 密码仅显示一次 | ✅ Phase 3.3 |
| AUTHMS_SETUP.md 生成 | ✅ Phase 8.2 |
| 接入摘要包含所有必要信息 | ✅ Phase 8.3 |

---

## 边界情况处理

| 情况 | 处理 |
|------|------|
| 用户系统是第三方服务（Firebase/Auth0） | 分析切换成本 → 推荐迁移或共存 |
| 用户系统完全不存在 | 跳过 Phase 1.2-1.4，直接创建 |
| 项目使用非标准构建工具 | 降级为手动配置，输出所有命令 |
| AuthMS 服务器不可达 | 标记为阻塞，等待网络恢复 |
| 租户名尝试 100 次仍不可用 | 建议用户更改命名策略 |
| 用户拒绝替换现有登录页 | 仅加路由守卫，不修改登录逻辑 |
| 多个项目需要接入同一个租户 | 跳过注册，直接使用已有 appId+issuer（见下方"已有租户"） |

### 已有租户分支（跳过 Phase 3）

如果用户已有 AuthMS 租户，检测到已有 `appId`：
```
"检测到你已有 AuthMS 租户配置。跳过注册，直接使用已有配置。
  appId:     app_01KW7XV...
  issuer:    https://auth.iam.tianv.com
  tenantId:  tnt_01KW7XV...
  
  这将是你的第 {N} 个接入此租户的 App。
  所有 App 共享用户体系，单点登录。
  
  确认使用此配置？ [确认] [创建新租户]"
```

### 回退 / 卸载指南

如果用户决定移除 AuthMS SDK：

```bash
# 1. 卸载包
npm uninstall @authms/core @authms/react @authms/api-identity

# 2. 删除 SDK 配置
rm src/authms.ts

# 3. 恢复 .env
# 移除 VITE_AUTHMS_* 变量

# 4. 恢复路由
# 移除 App.tsx 中的 AuthmsProvider 包裹

# 5. 恢复登录页
# 如果你用了 [A] 替换，需要从 git 恢复原始 Login.tsx
git checkout src/pages/Login.tsx
```

**注意**：已通过 AuthMS 注册的用户数据不会自动迁移回你的用户表。

---

## 参考文档

- `README.md` — 接入指南
- `README.zh.md` — 中文接入指南
- `examples/` — 框架接入模板
- 本 Skill `references/compliance-matrix.md` — 合规对照表
- 本 Skill `references/config-template.md` — 配置模板参考

---

*创建：2026-06-28*  
*版本：1.0*

---

## 自审（2026-06-28）

### 完整性检查

| 用户要求 | 覆盖 |
|---------|:--:|
| 分析用户原有系统 | ✅ Phase 1.1-1.4 |
| 检查用户数据/差异/冲突 | ✅ Phase 1.2-1.3 |
| 推荐 SDK 对接方案 + 收益/影响 | ✅ Phase 1.4 + Phase 5 |
| 租户策略合规推荐 | ✅ Phase 2.2 + compliance-matrix.md |
| 配置信息辅助 + 预校验 | ✅ Phase 2.1 + Phase 3.1 |
| 凭证安全保存 | ✅ Phase 3.3 |
| SDK 配置公开性分析 | ✅ Phase 4 + config-template.md |
| 文档补充完善 | ✅ Phase 8.2 + config-template.md |
| 无限重试 | ✅ Phase 3.2 + Phase 6.2 + Phase 7.2 |
| 单元测试逐个验证 | ✅ Phase 6 |
| 集成测试逐个验证 | ✅ Phase 7 |
| 充分尊重用户选择 | ✅ 每个 Phase 的交互模板 |
| 闭环验证（测试员视角） | ✅ 闭环验证清单 |

### 遗漏项（已修复，2026-06-28）

| # | 项目 | 状态 |
|----|------|:--:|
| A | 多项目同时接入（已有租户分支） | ✅ Phase 3-外 |
| B | 回退/卸载指南 | ✅ Phase 8-后 |
| C | 性能影响评估（Bundle size） | ✅ Phase 1.5 |
| D | 数据迁移脚本模板（SQL + TS） | ✅ Phase 5.3 |

### 后续（P2+）

| 项目 | 优先级 |
|------|:--:|
| Firebase/Auth0 迁移专属路径 | P2 |
| 多语言提示（中文/英文） | P3 |
| Playwright 自动化 E2E 集成到迁移流程 | P3 |

---

## ⚠️ 任务完成检查清单（AI 必须逐项确认）

**未全部打勾 = 任务未完成。**

```
Phase 完成:
  ☐ Phase 1: 系统分析完成
  ☐ Phase 2: 策略推荐完成
  ☐ Phase 3: 租户注册完成（凭证已保存）
  ☐ Phase 4: 依赖安装完成
  ☐ Phase 5: 代码接入完成
  ☐ Phase 6: 单元测试通过
  ☐ Phase 7: 集成测试通过
  ☐ Phase 8: 收尾完成

产物检查:
  ☐ src/authms.ts 存在且已填写
  ☐ .env 含公开配置
  ☐ AUTHMS_SETUP.md 存在
  ☐ 管理员密码已提醒"只显示一次"
  ☐ npm run dev 可正常启动
```

向用户输出最终摘要：

```
✅ AuthMS 接入完成
  App ID:     app_01KW...
  Issuer:     https://auth.iam.tianv.com
  管理员:     admin@xxx.authms.com
  登录页:     https://xxx.com/login
  npm 启动:   npm run dev
  接入文档:   AUTHMS_SETUP.md
```
