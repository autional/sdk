# AuthMS 合规对照表

> SDK Migration Guide 引用文件  
> 帮助用户根据行业合规标准选择安全策略配置

## 标准对照

| 合规标准 | 适用场景 | password_transmission | min_length | require_upper/lower/digit | MFA | breached_check | expiry_days |
|---------|---------|:--:|:--:|:--:|:--:|:--:|:--:|
| **NIST SP 800-63B AAL1** | 低风险应用 | hash | 8 | ✅ | ❌ | ❌ | 0 |
| **NIST SP 800-63B AAL2** | 标准 SaaS | hash | 8 | ✅ | ✅ | 推荐 | 0 |
| **NIST SP 800-63B AAL3** | 高安全 | symmetric | 15 | ✅ | ✅ | ✅ | 0 |
| **PCI DSS v4.0** | 支付/金融 | hash | 12 | ✅ | ✅ | ✅ | 90 |
| **GDPR** | 欧盟用户 | hash | 8 | ✅ | 推荐 | ✅ | 0 |
| **HIPAA** | 医疗 | hash | 8 | ✅ | ✅ | ✅ | 90 |
| **等保 2.0 L3** | 国内合规 | hash | 8 | ✅ | ✅ | 推荐 | 90 |

## 推荐策略速查

| 你的场景 | 推荐配置 |
|---------|---------|
| 个人项目/内部工具 | NIST AAL1 |
| SaaS 应用（默认） | NIST AAL2 |
| 金融/支付 | PCI DSS v4.0 |
| 面向欧洲用户 | NIST AAL2 + GDPR |
| 医疗保健 | HIPAA |

## 密码传输模式选择

| 模式 | 安全级别 | 性能 | 何时使用 |
|------|:--:|:--:|------|
| `plain` | 低 | 最快 | 仅开发环境 |
| `hash` | 中 | 快 | **生产推荐**——SHA-256，零额外开销 |
| `symmetric` | 高 | 中 | 需要端到端加密时 |
| `asymmetric` | 最高 | 慢 | 高合规场景（PCI/HIPAA） |
