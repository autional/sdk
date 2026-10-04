<!-- lang:en -->
# Autional Compliance Matrix

> Reference file for the Autional Onboarding skill.
> Use it to pick a security policy that matches the user's industry and jurisdiction.
<!-- /lang:en -->
<!-- lang:zh -->
# Autional 合规对照表

> Autional 接入 Skill 的引用文件。
> 用于按用户的行业与司法辖区选择安全策略。
<!-- /lang:zh -->

<!-- lang:en -->
## Standards overview

| Standard | Scenario | password_transmission | min_length | require_upper/lower/digit | MFA | breached_check | expiry_days |
|---|---|:--:|:--:|:--:|:--:|:--:|:--:|
| **NIST SP 800-63B AAL1** | low-risk apps | hash | 8 | yes | no | no | 0 |
| **NIST SP 800-63B AAL2** | standard SaaS | hash | 8 | yes | yes | recommended | 0 |
| **NIST SP 800-63B AAL3** | high security | symmetric | 15 | yes | yes | yes | 0 |
| **PCI DSS v4.0** | payments / finance | hash | 12 | yes | yes | yes | 90 |
| **GDPR** | EU users | hash | 8 | yes | recommended | yes | 0 |
| **HIPAA** | healthcare | hash | 8 | yes | yes | yes | 90 |
<!-- /lang:en -->
<!-- lang:zh -->
## 标准对照

| 合规标准 | 适用场景 | password_transmission | min_length | require_upper/lower/digit | MFA | breached_check | expiry_days |
|---|---|:--:|:--:|:--:|:--:|:--:|:--:|
| **NIST SP 800-63B AAL1** | 低风险应用 | hash | 8 | 是 | 否 | 否 | 0 |
| **NIST SP 800-63B AAL2** | 标准 SaaS | hash | 8 | 是 | 是 | 推荐 | 0 |
| **NIST SP 800-63B AAL3** | 高安全 | symmetric | 15 | 是 | 是 | 是 | 0 |
| **PCI DSS v4.0** | 支付/金融 | hash | 12 | 是 | 是 | 是 | 90 |
| **GDPR** | 欧盟用户 | hash | 8 | 是 | 推荐 | 是 | 0 |
| **HIPAA** | 医疗 | hash | 8 | 是 | 是 | 是 | 90 |
<!-- /lang:zh -->

<!-- region:cn -->
<!-- lang:en -->
## Mainland compliance addendum (.cn)

| Standard | Scenario | password_transmission | min_length | require_upper/lower/digit | MFA | breached_check | expiry_days |
|---|---|:--:|:--:|:--:|:--:|:--:|:--:|
| **MLPS 2.0 (等保 2.0) Level 3** | mainland production systems | hash | 8 | yes | yes | recommended | 90 |
| **PIPL** | personal data of mainland users | hash | 8 | yes | recommended | yes | 0 |

Notes:

- Serving mainland users generally requires an ICP filing (备案) for the domain; check with the account team before launch.
- PIPL requires explicit consent for personal-data processing and supports data-subject export/erasure requests — enable the corresponding Autional features.
<!-- /lang:en -->
<!-- lang:zh -->
## 国内合规补充（.cn）

| 合规标准 | 适用场景 | password_transmission | min_length | require_upper/lower/digit | MFA | breached_check | expiry_days |
|---|---|:--:|:--:|:--:|:--:|:--:|:--:|
| **等保 2.0 三级** | 大陆生产系统 | hash | 8 | 是 | 是 | 推荐 | 90 |
| **PIPL 个人信息保护法** | 大陆用户个人信息 | hash | 8 | 是 | 推荐 | 是 | 0 |

注：

- 面向大陆用户服务通常需要域名 ICP 备案；上线前与对接人确认。
- PIPL 要求个人信息处理取得明示同意，并支持个人的导出/删除请求——启用 Autional 的对应能力。
<!-- /lang:zh -->
<!-- /region:cn -->

<!-- lang:en -->
## Quick pick

| Your scenario | Recommended profile |
|---|---|
| Personal project / internal tool | NIST AAL1 |
| SaaS product (default) | NIST AAL2 |
| Finance / payments | PCI DSS v4.0 |
| Users in the EU | NIST AAL2 + GDPR |
| Healthcare | HIPAA |
<!-- /lang:en -->
<!-- lang:zh -->
## 推荐策略速查

| 你的场景 | 推荐配置 |
|---|---|
| 个人项目/内部工具 | NIST AAL1 |
| SaaS 应用（默认） | NIST AAL2 |
| 金融/支付 | PCI DSS v4.0 |
| 面向欧盟用户 | NIST AAL2 + GDPR |
| 医疗保健 | HIPAA |
<!-- /lang:zh -->

<!-- lang:en -->
## Password transmission modes

| Mode | Security | Performance | When |
|---|:--:|:--:|---|
| `plain` | low | fastest | development only |
| `hash` | medium | fast | **production default** — SHA-256, zero extra overhead |
| `symmetric` | high | medium | end-to-end encryption required |
| `asymmetric` | highest | slow | high-compliance setups (PCI/HIPAA) |
<!-- /lang:en -->
<!-- lang:zh -->
## 密码传输模式

| 模式 | 安全级别 | 性能 | 何时使用 |
|---|:--:|:--:|---|
| `plain` | 低 | 最快 | 仅开发环境 |
| `hash` | 中 | 快 | **生产默认**——SHA-256，零额外开销 |
| `symmetric` | 高 | 中 | 需要端到端加密 |
| `asymmetric` | 最高 | 慢 | 高合规场景（PCI/HIPAA） |
<!-- /lang:zh -->
