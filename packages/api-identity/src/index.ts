/**
 * @autional/api-identity — Auto-generated from identity-service swagger.json
 * Generated: 2026-10-28
 * DO NOT EDIT — run `python sdk/scripts/generate-api-packages.py` to regenerate
 */

import type { ApiClient } from '@autional/core';

// ====== Types ======

/** 列表端点分页信息（ApiClient 解包后字段已转 camelCase）。 */
export interface ApiPaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** 列表端点的运行时返回值：ApiClient 已解包为 { items, total, pagination }。 */
export interface ApiListResult<T> {
  items: T[];
  total?: number;
  pagination?: ApiPaginationInfo;
}

export interface AgentActivityInfo {
  action?: string;
  createdAt?: string;
  detail?: string;
  operatorId?: string;
}

export interface AgentCredentialInfo {
  agentId?: string;
  createdAt?: string;
  credType?: string;
  id?: string;
  keyPrefix?: string;
  name?: string;
  status?: string;
}

export interface AgentInfo {
  callbackUrl?: string;
  createdAt?: string;
  description?: string;
  identityId?: string;
  jitTtl?: number;
  lastRotatedAt?: string;
  name?: string;
  ownerId?: string;
  ownerPrincipalId?: string;  // OwnerPrincipalID additive（json omitempty）；保留 OwnerID 字段与值以向后兼容（C-4）。
  rotationDays?: number;
  status?: string;
  updatedAt?: string;
  workloadSubtype?: string;
}

export interface AgentPermissionInfo {
  action?: string;
  code?: string;
  effect?: string;
  name?: string;
  resource?: string;
}

export interface CreateAgentCredentialRequest {
  credType?: string;
  name: string;
}

export interface CreateAgentCredentialResult {
  credential?: AgentCredentialInfo;
  rawKey?: string;
}

export interface CreateAgentRequest {
  description?: string;
  jitTtl?: number;
  name: string;
  roleCode?: string;  // default: agent_executor
  rotationDays?: number;
  workloadSubtype?: "agent" | "service_account" | "automation";  // default: agent
}

export interface UpdateAgentRequest {
  callbackUrl?: string;
  description?: string;
  jitTtl?: number;
  name?: string;
  rotationDays?: number;
  workloadSubtype?: "agent" | "service_account" | "automation";
}

export interface AddFamilyMemberRequest {
  email: string;  // 成员邮箱（必须为租户内已存在用户）
  role: string;  // 成员角色（枚举）
}

export interface CreateDeviceRequest {
  firmwareVer?: string;
  hardwareId?: string;
  manufacturer?: string;
  name: string;
  workloadSubtype?: string;
}

export interface DeviceInfo {
  createdAt?: string;
  firmwareVer?: string;
  hardwareId?: string;
  identityId?: string;
  manufacturer?: string;
  name?: string;
  ownerId?: string;
  ownerPrincipalId?: string;  // OwnerPrincipalID additive（json omitempty）；保留 OwnerID 以向后兼容（C-4）。
  pairingCode?: string;
  status?: string;
  updatedAt?: string;
  workloadSubtype?: string;
}

export interface FamilyMemberInfo {
  assignedAt?: string;  // 加入时间（RFC3339）
  deviceId?: string;  // 设备ID
  email?: string;  // 成员邮箱（补查，缺失置空）
  id?: string;  // 成员ID（= user_id = 元组 subject_id）
  role?: string;  // 成员角色（枚举）
  status?: string;  // 状态（固定 active）
  userId?: string;  // 用户ID（= id）
  username?: string;  // 成员用户名（补查，缺失置空）
}

export interface PairDeviceRequest {
  userCode?: string;
}

export interface TransferDeviceRequest {
  newOwnerId?: string;
}

export interface RiskEventDayCount {
  count?: number;
  date?: string;
}

export interface RiskEventTypeCount {
  count?: number;
  eventType?: string;
}

export interface RiskScoreRange {
  count?: number;
  range?: string;  // low, medium, high, critical
}

export interface SignalWeights {
  credentialLeaked?: number;
  ipBadReputation?: number;
  ipUnknown?: number;
  ipVpn?: number;
  loginFailureHigh?: number;
  loginFailureModerate?: number;
  mfaMethodChanged?: number;
  newCountry?: number;
  newDeviceOrIp?: number;
  sessionHijack?: number;
  unknownDevice?: number;
  unusualLocation?: number;
  unusualTime?: number;
  velocityAnomaly?: number;
}

export interface TopRiskUser {
  avgScore?: number;
  count?: number;
  maxScore?: number;
  userId?: string;
}

export interface UserConsent {
  granted?: boolean;
  id?: string;
  ipAddress?: string;
  recordedAt?: string;
  revokedAt?: string;
  scope?: string;  // marketing, analytics, third_party, terms, privacy
  tenantId?: string;
  userAgent?: string;
  userId?: string;
  version?: string;  // 政策版本号（R4.3 语义分流：DB 列 policy_version，JSON 契约保持 version）
}

export interface FieldViolation {
  code?: string;  // Code 是错误代码（可选） 用于程序识别错误类型，如 "required", "format", "range"
  description?: string;  // Description 是人类可读的错误描述 应该说明违反了什么规则，如 "必须是一个有效的邮箱地址"
  field?: string;  // Field 是错误字段的路径 使用点号表示嵌套字段，如 "user.email" 或 "addresses[0].city"
  standard?: string;  // Standard 是指向权威规范文档的 URI 引用 用于告知 API 消费者具体违反哪个标准 示例："https://www.rfc-editor.org/info/rfc5322"
  value?: unknown;  // Value 是导致错误的值（可选，开发模式下使用） 生产环境可能不返回此字段以避免泄露敏感信息
}

export interface Problem {
  code?: number;  // Code 是业务错误码 用于程序处理特定错误场景 示例：30101001
  detail?: string;  // Detail 是针对此具体错误实例的人类可读解释 可以包含具体的错误细节，如"Field 'email' is required"
  errors?: FieldViolation[];  // Errors 是字段级验证错误列表（扩展字段） 遵循 Web API 标准实践，每个错误包含字段名和错误信息
  i18nArgs?: Record<string, unknown>;  // I18nArgs 是国际化参数 用于动态填充翻译模板
  i18nKey?: string;  // I18nKey 是国际化键 用于客户端本地化错误消息 示例："error.user_not_found"
  instance?: string;  // Instance 是发生问题的具体URI引用 通常是请求的URL，可能包含查询参数 示例："/api/v1/users?limit=invalid"
  requestId?: string;  // RequestID 是请求唯一标识 用于日志关联和问题追踪 示例："req_550e8400-e29b-41d4-a716-446655440000"
  retryAfter?: number;  // RetryAfter 用于 429 Too Many Requests 响应 指示客户端应在多少秒后重试请求（RFC 6585）
  service?: string;  // Service 是服务名 用于微服务架构中定位错误来源 示例："auth-service"
  spanId?: string;  // SpanID 是当前 span 标识 用于精确定位分布式链路中的当前节点
  status?: number;  // Status 是产生的HTTP状态码 用于客户端区分问题类型，不随Accept-Language变化 示例：400, 401, 403, 404, 500
  timestamp?: string;  // Timestamp 是错误发生时间 ISO 8601 格式 示例："2026-04-03T12:00:00Z"
  title?: string;  // Title 是简短、人类可读的问题类型摘要 相同的 Type 应该始终有相同的 Title（不随实例变化） 示例："Invalid Request Parameters"
  traceId?: string;  // TraceID 是分布式追踪标识 遵循 W3C Trace Context 标准 示例："00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01"
  Type?: string;  // Type 是标识问题类型的URI引用 当该URI被解引用时，应提供人类可读的文档 示例："https://api.example.com/errors/invalid-request"
}

export interface PageInfo {
  hasNext?: boolean;  // HasNext indicates whether there is a next page
  hasPrev?: boolean;  // HasPrev indicates whether there is a previous page
  page?: number;  // Page is the current page number (1-based)
  pageSize?: number;  // PageSize is the number of items per page
  total?: number;  // Total is the total number of items across all pages
  totalPages?: number;  // TotalPages is the total number of pages
}

export interface SimpleResponse {
  code?: number;
  message?: string;
  timestamp?: string;
}

export interface ABACPolicyResponse {
  condition?: string;
  createdAt?: string;
  description?: string;
  effect?: string;
  enabled?: boolean;
  id?: string;
  name?: string;
  priority?: number;
  tenantId?: string;
  updatedAt?: string;
}

export interface ActivationResponse {
  activatedAt?: string;
  createdAt?: string;
  expireAt?: string;
  id?: string;
  justification?: string;
  revokedAt?: string;
  roleId?: string;
  status?: string;
  tenantId?: string;
  userId?: string;
}

export interface AddIPRestrictionRequest {
  label?: string;
  value: string;
}

/** 添加身份凭证请求参数 */
export interface AddIdentityRequest {
  code?: string;  // 验证码
  identifier: string;  // 标识
  password?: string;  // 密码
  Type: "email" | "phone";  // 类型
}

/** 添加备用联系方式 */
export interface AddRecoveryContactRequest {
  Type: "email" | "phone";  // 类型
  value: string;  // 联系方式
}

/** 管理员模拟其他用户登录请求 */
export interface AdminImpersonateRequest {
  reason?: string;
  userId: string;
}

/** 管理员模拟用户登录响应 */
export interface AdminImpersonateResponse {
  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
  tokenType?: string;
  user?: UserInfo;
}

export interface AdminStatsData {
  active?: number;
  inactive?: number;
  revoked?: number;
  total?: number;
}

/** 匿名认证请求参数 */
export interface AnonymousSigninRequest {
  tenantId?: string;  // 租户ID
}

/** API Key异常检测结果 */
export interface ApiKeyAnomalyResponse {
  description?: string;
  keyId?: string;
  severity?: string;
  Type?: string;
  value?: number;
}

export interface ApiKeyAuditLogResponse {
  action?: string;
  apiKeyId?: string;
  createdAt?: string;
  detail?: string;
  id?: string;
  ip?: string;
  success?: boolean;
  userAgent?: string;
}

export interface ApiKeyResponse {
  createdAt?: string;
  environment?: string;
  expiresAt?: string;
  id?: string;
  ipRestrictions?: IpRestrictionDTO[];
  keyPrefix?: string;
  lastUsedAt?: string;
  lastUsedIp?: string;
  name?: string;
  scopes?: string[];
  status?: string;
  tenantId?: string;
  updatedAt?: string;
  usageCount?: number;
  userId?: string;
}

export interface ApiKeyUsageResponse {
  id?: string;
  lastUsedAt?: string;
  lastUsedIp?: string;
  name?: string;
  status?: string;
  usageCount?: number;
}

/** 审计日志记录 */
export interface AuditLogResponse {
  action?: string;  // Action
  createdAt?: string;  // 时间
  details?: string;  // Details
  id?: string;  // 日志ID
  ip?: string;  // IP
  resource?: string;  // Resource
  resourceId?: string;  // Resource ID
  status?: string;  // 状态：success/failed；空串=未知（ADR-06）
  tenantId?: string;  // 租户ID
  userAgent?: string;  // User-Agent
  userId?: string;  // 用户ID
}

/** 认证用户信息 */
export interface AuthUserResponse {
  ageGroup?: string;  // 年龄分组
  birthDate?: string;  // 出生日期 (RFC3339)
  createdAt?: string;  // 创建时间
  email?: string;  // 邮箱
  emailVerifiedAt?: string;  // 邮箱验证时间
  id?: string;  // 用户ID
  isMinor?: boolean;  // 是否未成年人
  lastLoginAt?: string;  // 最后登录
  lastLoginIp?: string;  // 最后登录IP
  lockedUntil?: string;  // 锁定截止
  loginFailCount?: number;  // 失败次数
  metadata?: Record<string, unknown>;  // 扩展元数据
  mfaEnabled?: boolean;  // 是否启用MFA
  mfaType?: string;  // MFA类型
  mustChangePassword?: boolean;  // 需要强制修改密码
  passwordChangedAt?: string;  // 密码最后修改时间
  pendingParentalConsent?: boolean;  // 是否等待家长同意
  phone?: string;  // 手机号
  phoneVerifiedAt?: string;  // 手机验证时间
  status?: string;  // 状态
  tenantId?: string;  // 租户ID
  updatedAt?: string;  // 更新时间
  username?: string;  // 用户名
}

export interface AuthenticatorBackupResponse {
  accountCount?: number;
  backupType?: string;
  checksum?: string;
  createdAt?: string;
  deviceName?: string;
  encryptedData?: string;
  id?: string;
  version?: number;
}

export interface AuthenticatorBackupUploadRequest {
  accountCount?: number;
  backupType?: string;
  checksum?: string;
  deviceName?: string;
  encryptedData: string;
}

export interface AuthenticatorDeviceItem {
  createdAt?: string;
  deviceId?: string;
  deviceName?: string;
  deviceType?: string;
  enabled?: boolean;
  lastUsedAt?: string;
}

export interface AvailableRoleResponse {
  code?: string;
  description?: string;
  id?: string;
  name?: string;
}

/** 批量创建用户单项 */
export interface BatchCreateUserItem {
  email?: string;  // 邮箱
  metadata?: Record<string, string>;  // 扩展元数据
  password: string;  // 密码
  phone?: string;  // 手机号
  username?: string;  // 用户名
}

/** 批量创建用户请求 */
export interface BatchCreateUserRequest {
  users: BatchCreateUserItem[];  // 用户列表
}

export interface BatchRevokeRequest {
  ids: string[];
}

export interface BatchRevokeResponse {
  failed?: string[];
  revoked?: number;
}

/** 批量更新用户状态请求 */
export interface BatchUpdateUserStatusRequest {
  status: "active" | "banned" | "pending" | "suspended" | "locked" | "deleted";  // 目标状态
  userIds: string[];  // 用户ID列表
}

/** 绑定OAuth账户请求 */
export interface BindOAuthRequest {
  code: string;  // Code
  codeVerifier?: string;  // PKCE code verifier
  provider: string;  // Provider
}

export interface BootstrapAdminRequest {
  userId: string;
}

export interface BootstrapAdminResponse {
  message?: string;
  roleId?: string;
}

/** 登录页品牌定制（Logo/主色/自定义CSS/隐私条款URL） */
export interface BrandingInfo {
  companyName?: string;
  customCss?: string;
  faviconUrl?: string;
  loginPageDescription?: string;
  loginPageTitle?: string;
  logoUrl?: string;
  primaryColor?: string;
  privacyPolicyUrl?: string;
  secondaryColor?: string;
  termsOfServiceUrl?: string;
}

/** 发起邮箱变更请求（password 可选：携带即单密码放行，缺省走重认证闸门，AC-006/008） */
export interface ChangeEmailRequest {
  newEmail: string;  // 新邮箱
  password?: string;  // 当前密码（可选，*string 兼容三态：缺省/nil/空串 → 走闸门）
}

export interface ChangePasswordResponse {
  code?: number;
  message?: string;
}

/** 发起手机号变更请求（password 可选：携带即单密码放行，缺省走重认证闸门，AC-006/008） */
export interface ChangePhoneRequest {
  newPhone: string;  // 新手机号(E.164格式)
  password?: string;  // 当前密码（可选，*string 兼容三态：缺省/nil/空串 → 走闸门）
}

/** 检查邮箱可用性请求 */
export interface CheckEmailRequest {
  email: string;  // Email
  tenantId?: string;  // TenantID 显式租户（地址栏）：body > query > X-Tenant-ID；空即 400（AUTH-09）。
}

/** 检查邮箱可用性结果 */
export interface CheckEmailResponse {
  available?: boolean;  // Is available
  email?: string;  // Email
}

/** 内部检查权限请求 */
export interface CheckPermissionInternalRequest {
  action: string;  // Action
  resource: string;  // Resource
  tenantId: string;  // Tenant ID
  userId: string;  // User ID
}

/** 检查权限请求 (user_id derived from JWT context) */
export interface CheckPermissionRequest {
  action: string;  // Action
  resource: string;  // Resource
}

/** 检查角色请求 (user_id derived from JWT context) */
export interface CheckRoleRequest {
  roleCode: string;  // Role code
}

/** 检查用户名可用性请求 */
export interface CheckUsernameRequest {
  tenantId?: string;  // 目标租户（地址栏租户优先）
  username: string;  // Username
}

/** 检查用户名可用性结果 */
export interface CheckUsernameResponse {
  available?: boolean;  // Is available
  username?: string;  // Username
}

/** 未成年人家长同意验证状态 */
export interface ChildrenConsentResponse {
  id?: string;  // 记录ID
  method?: string;  // 验证方式
  parentEmail?: string;  // 家长邮箱
  parentPhone?: string;  // 家长手机
  recordedAt?: string;  // 记录时间
  status?: string;  // 状态
  tenantId?: string;  // 租户ID
  userId?: string;  // 用户ID
  verified?: boolean;  // 是否已验证
  verifiedAt?: string;  // 验证时间
}

export interface CleanupExpiredResponse {
  expiredCount?: number;
  message?: string;
}

/** 完成账户恢复（重置密码） */
export interface CompleteAccountRecoveryRequest {
  code: string;  // 验证码
  newPassword: string;  // 新密码
  passwordTransmission?: string;  // plain|hash|symmetric|asymmetric
  recoveryToken: string;  // 恢复令牌
  tenantId?: string;  // TenantID 显式租户（地址栏）。非空时必须与令牌租户一致；空 = 令牌权威。
}

export interface CompleteAccountRecoveryResponse {
  message?: string;
}

/** 租户选中的合规标准信息 */
export interface ComplianceProfileInfo {
  resolvedAt?: string;
  standards?: string[];
}

/** 当前配置与合规标准之间的差距 */
export interface ComplianceWarningItem {
  current?: unknown;
  description?: string;
  parameter?: string;
  required?: unknown;
  severity?: string;
}

/** 用户隐私同意历史 */
export interface ConsentHistoryResponse {
  history?: UserConsent[];  // History
  userId?: string;  // User ID
}

/** 同意管理请求参数 */
export interface ConsentRequest {
  granted?: boolean;  // Granted
  metadata?: Record<string, unknown>;  // Metadata
  scope: string;  // Scope
}

export interface CreateABACPolicyRequest {
  condition: string;
  description?: string;
  effect?: string;
  name: string;
  priority?: number;
}

export interface CreateApiKeyRequest {
  environment?: "live" | "test";
  expiresAt?: string;
  name: string;
  scopes?: string[];
}

export interface CreateApiKeyResponse {
  createdAt?: string;
  environment?: string;
  expiresAt?: string;
  id?: string;
  name?: string;
  rawKey?: string;
  scopes?: string[];
  status?: string;
}

/** 为身份提供商上传签名/加密证书 */
export interface CreateCertificateRequest {
  certPem: string;
  name: string;
  Type: "signing" | "encryption";
}

/** 创建身份提供商请求参数 */
export interface CreateIDPRequest {
  attributeMapping?: Record<string, string>;  // 字段映射
  authUrl?: string;  // 授权端点
  clientId: string;  // Client ID
  clientSecret: string;  // Client Secret
  config?: Record<string, unknown>;  // 额外配置
  displayName?: string;  // 前端展示名称
  iconUrl?: string;  // 图标URL
  name: string;  // 显示名称
  scopes?: string[];  // 权限范围
  sortOrder?: number;  // 排序
  tokenUrl?: string;  // Token端点
  Type: string;  // 类型
  userInfoUrl?: string;  // 用户信息端点
}

/** 停用账户请求参数 */
export interface DeactivateAccountRequest {
  password?: string;  // Password
}

export interface DeactivateAccountResponse {
  code?: number;
  message?: string;
}

/** 删除账户请求参数 */
export interface DeleteAccountRequest {
  password: string;  // Password
  reason?: string;  // Reason
}

/** 删除账户结果 */
export interface DeleteAccountResponse {
  deletedAt?: string;  // Deletion time
  message?: string;  // Message
  userId?: string;  // User ID
}

/** 用户设备信息（含安全增强字段） */
export interface DeviceResponse {
  browser?: string;  // 浏览器
  createdAt?: string;  // 首次登录
  deviceFingerprint?: string;  // 设备指纹
  deviceName?: string;  // 设备名称
  id?: string;  // 设备ID
  ip?: string;  // IP
  isTrusted?: boolean;  // 是否信任
  lastSeen?: string;  // 最近使用
  loginCount?: number;  // 登录次数
  os?: string;  // 系统
  sessionId?: string;  // 关联会话
  trustScore?: number;  // 信任评分
  Type?: string;  // 类型
  userId?: string;  // 用户ID
}

export interface DiscoverTenantInfo {
  displayName?: string;
  id?: string;
  membershipApproval?: string;
  name?: string;
}

export interface EmailStatusResponse {
  email?: string;
  emailVerified?: boolean;
  verificationSent?: boolean;
}

export interface EmailVerificationResponse {
  expiresIn?: number;
}

export interface EmailVerifiedResponse {
  email?: string;
}

/** GDPR数据导出结果 GDPR数据导出结果（个人信息聚合数据） */
export interface ExportMyDataResponse {
  auditLogs?: unknown;
  billingData?: unknown;
  communicationData?: unknown;
  devices?: unknown;
  exportAt?: string;
  notificationData?: unknown;
  oauthData?: unknown;
  pointData?: unknown;
  profileData?: unknown;
  sessionData?: unknown;
  storageData?: unknown;
  user?: unknown;
  walletData?: unknown;
}

/** 忘记密码请求参数 */
export interface ForgotPasswordRequest {
  identity: string;  // Email or phone
  tenantId?: string;  // TenantID 显式租户（地址栏）：body > query > X-Tenant-ID；空即 400（AUTH-04/09）。
}

/** 忘记密码响应 */
export interface ForgotPasswordResponse {
  expiresIn?: number;  // Expiration time
  message?: string;  // Message
}

/** 生成一次性票据请求参数 */
export interface GenerateTicketInput {
  tenantId?: string;  // 租户ID（空 → 默认 JWT 租户）
  userId?: string;  // 用户ID（空 → 默认 JWT actor）
}

/** Web3钱包登录票据 */
export interface GenerateTicketResponse {
  expiresIn?: number;
  ticket?: string;
}

/** HTTP修改密码请求 */
export interface HTTPChangePasswordRequest {
  newPassword: string;  // New password
  oldPassword?: string;  // Old password (optional for admin reset)
  passwordTransmission?: string;  // plain|hash|symmetric|asymmetric
}

/** HTTP重置密码请求 */
export interface HTTPResetPasswordRequest {
  forceChange?: boolean;  // Force user to change password on next login
  newPassword: string;  // New password (或 hash)
  passwordTransmission?: string;  // plain|hash|symmetric|asymmetric
  resetToken: string;  // Reset token
}

/** HTTP创建用户请求 */
export interface HTTPUserCreateRequest {
  email?: string;  // Email
  forcePasswordChange?: boolean;  // Force user to change password on first login
  metadata?: Record<string, string>;  // Metadata
  password: string;  // Password or hash (取决于 password_transmission)
  passwordTransmission?: string;  // plain|hash|symmetric|asymmetric
  phone?: string;  // Phone
  username?: string;  // Username
}

/** 身份提供商详细信息 */
export interface IDPResponse {
  attributeMapping?: Record<string, string>;  // 字段映射
  authUrl?: string;  // 授权端点
  clientId?: string;  // Client ID
  config?: Record<string, unknown>;  // 额外配置
  createdAt?: string;  // 创建时间
  displayName?: string;  // 前端展示名称
  iconUrl?: string;  // 图标URL
  id?: string;  // 提供商ID
  isPopular?: boolean;  // 常用提供商
  isSystem?: boolean;  // 系统内置
  name?: string;  // 显示名称
  scopes?: string[];  // 权限范围
  sortOrder?: number;  // 排序
  status?: string;  // 状态
  tenantId?: string;  // 租户ID
  tokenUrl?: string;  // Token端点
  Type?: string;  // 类型
  typeDisplayName?: string;  // 类型显示名称
  updatedAt?: string;  // 更新时间
  userInfoUrl?: string;  // 用户信息端点
}

export interface IdentityListData {
  identities?: IdentityResponse[];
}

/** 用户身份凭证信息 */
export interface IdentityResponse {
  createdAt?: string;  // 创建时间
  id?: string;  // 凭证ID
  identifier?: string;  // 标识(脱敏)
  isPrimary?: boolean;  // 是否主凭证
  isVerified?: boolean;  // 是否验证
  Type?: string;  // 类型
  userId?: string;  // 用户ID
  verifiedAt?: string;  // 验证时间
}

export interface ImpersonateRequest {
  reason?: string;  // 模拟原因
}

export interface ImpersonateResponse {
  expiresAt?: string;
  impersonationToken?: string;
}

/** 从OIDC discovery URL导入身份提供商配置 */
export interface ImportOIDCDiscoveryRequest {
  discoveryUrl: string;
}

/** 从SAML metadata URL导入身份提供商配置 */
export interface ImportSAMLMetadataRequest {
  metadataUrl: string;
}

export interface KeyExchangeResponse {
  algorithm?: string;  // "ECDH-P256-HKDF-SHA256-AES256GCM"
  expiresIn?: number;  // TTL in seconds
  keyExchangeId?: string;
  serverPubKey?: string;  // base64 ECDH P-256 public key
}

export interface LdapGroupRoleMappingRequest {
  mapping: Record<string, string>;
}

export interface LdapGroupRoleMappingResponse {
  directoryName?: string;
  mapping?: Record<string, string>;
}

export interface LdapHealthResponse {
  directoryName?: string;
  error?: string;
  healthy?: boolean;
}

export interface LdapLoginRequest {
  password: string;
  tenantId?: string;  // 显式指定租户（可选，兜底 X-Tenant-ID header）
  username: string;
}

export interface LdapLoginResponse {
  accessToken?: string;
  isNewUser?: boolean;
  refreshToken?: string;
  userId?: string;
}

export interface LdapTestConnectionRequest {
  directoryName: string;
}

export interface LdapTestConnectionResponse {
  connected?: boolean;
  directoryName?: string;
  error?: string;
  latencyMs?: number;
  mapping?: Record<string, string>;
  success?: boolean;
}

export interface LinkSAMLUserRequest {
  email?: string;  // Email 与 UserID 至少一个（AUTH-12：SAML 已链接路径按 user_id 解析）。
  name?: string;
  nameId: string;
  providerId: string;
  tenantId?: string;  // 显式租户；空 → X-Tenant-ID
  userId?: string;
}

export interface LinkSAMLUserResponse {
  isNew?: boolean;
  status?: string;  // AUTH-12：active/pending/...；saml-service 据此拒绝非 active
  tenantId?: string;  // 解析所用租户（调用方校验与 provider 租户一致）
  userId?: string;
}

export interface LoginByCodeResponse {
  accessToken?: string;
  expiresIn?: number;
  isNewUser?: boolean;
  membershipStatus?: string;  // MembershipStatus 新注册待审批（WS-A A3）；pending 时不返回 token。
  refreshToken?: string;
  tokenType?: string;
  user?: UserInfo;
  userId?: string;  // User ID (redundant with User.ID for flat access)
}

export interface LoginByEmailCodeRequest {
  captchaChallengeId?: string;
  captchaToken?: string;
  code: string;
  email: string;
  registerIfNew?: boolean;
  tenantId?: string;
}

export interface LoginByPhoneCodeRequest {
  captchaChallengeId?: string;
  captchaToken?: string;
  code: string;
  phone: string;
  registerIfNew?: boolean;
  tenantId?: string;
}

/** 用户登录历史记录 */
export interface LoginHistoryResponse {
  browser?: string;  // 浏览器
  createdAt?: string;  // 登录时间
  deviceType?: string;  // 设备类型
  failReason?: string;  // 失败原因
  id?: string;  // 记录ID
  ip?: string;  // IP地址
  location?: string;  // 地理位置
  loginType?: string;  // 登录类型
  os?: string;  // 操作系统
  sessionId?: string;  // 会话ID
  status?: string;  // 状态
  tenantId?: string;  // 租户ID
  userAgent?: string;  // User-Agent
  userId?: string;  // 用户ID
}

/** 用户登录请求参数 */
export interface LoginRequest {
  captchaChallengeId?: string;  // CAPTCHA challenge ID
  captchaProvider?: string;  // CAPTCHA provider (pow/turnstile)
  captchaToken?: string;  // CAPTCHA verification token (PoW/Turnstile)
  clientNonce?: string;  // hash 模式: 客户端随机 nonce
  clientPubKey?: string;  // symmetric 模式: 客户端 ECDH 临时公钥
  identity: string;  // Username/Email/Phone
  keyExchangeId?: string;  // symmetric 模式: ECDH 密钥交换 ID
  keyId?: string;  // asymmetric 模式: 服务端公钥 ID
  password: string;  // Password or hash/ciphertext (取决于 password_transmission)
  passwordTransmission?: string;  // plain|hash|symmetric|asymmetric
  tenantId?: string;  // Tenant ID
}

/** 用户登录结果 */
export interface LoginResponse {
  accessToken?: string;  // Access token
  challengeToken?: string;  // MFA challenge token (short-lived, requires MFA verification)
  enrolledMfaMethods?: string[];  // 用户已开通的 MFA 方法（挑战页仅展示这些）
  expiresIn?: number;  // Expiration time
  membershipStatus?: string;  // MembershipStatus 新注册待审批（WS-A A3）；pending 时不返回 token。
  mfaCheckReason?: string;  // MFA触发原因描述
  mustChangePassword?: boolean;  // Password must be changed
  passwordExpiresIn?: number;  // Days until password expires
  passwordWarning?: string;  // Password warning: expiring/expired_grace/expired
  refreshToken?: string;  // Refresh token
  requiredMfaMethods?: string[];  // MFA推荐方法列表
  requiresMfa?: boolean;  // 自适应MFA: 需要额外MFA验证
  riskAssessment?: RiskAssessmentInfo;  // Risk assessment
  riskLevel?: string;  // 风险等级: low/medium/high
  tokenType?: string;  // Token type
  user?: UserInfo;  // User info
  userId?: string;  // User ID (redundant with User.ID for flat access)
}

export interface LogoutAllSessionsResponse {
  code?: number;
  message?: string;
}

export interface LogoutSessionResponse {
  code?: number;
  message?: string;
}

export interface MFAChallengeCodeSentResponse {
  sent?: boolean;
}

/** 双人复核记录请求 */
export interface MakerCheckerRecordRequest {
  approver: string;  // Approver
  details?: Record<string, unknown>;  // Details
  operation: string;  // Operation
  requester: string;  // Requester
}

/** 双人复核记录响应 */
export interface MakerCheckerRecordResponse {
  approver?: string;  // Approver
  operation?: string;  // Operation
  recordId?: string;  // Record ID
  requester?: string;  // Requester
  status?: string;  // Status
}

export interface MembershipInfo {
  joinedAt?: string;
  role?: string;
  status?: string;  // active / pending / disabled
  tenantId?: string;
  tenantName?: string;
}

/** 合并用户请求（合并从账户到主账户） */
export interface MergeUsersRequest {
  primaryUserId: string;  // 主账户用户ID
  secondaryUserId: string;  // 从账户用户ID
}

export interface MyPermissionsResponse {
  permissions?: string[];
}

export interface MyTenantsResponse {
  tenants?: TenantInfo[];
}

/** NHI (非人类身份) 策略配置请求 */
export interface NHIPolicyRequest {
  agentDefaultTtl?: string;
  agentMaxCount?: number;
  deviceMaxPerOwner?: number;
  robotMaxCount?: number;
  rotationDaysDefault?: number;
}

/** NHI (非人类身份) 策略配置 */
export interface NHIPolicyResponse {
  agentDefaultTtl?: string;
  agentMaxCount?: number;
  deviceMaxPerOwner?: number;
  robotMaxCount?: number;
  rotationDaysDefault?: number;
  updatedAt?: string;
}

/** OAuth/SSO回调响应 */
export interface OAuthCallbackResponse {
  accessToken?: string;  // Access token
  challengeToken?: string;  // MFA challenge token
  enrolledMfaMethods?: string[];  // User's enrolled MFA methods
  expiresIn?: number;  // Expiration time
  isNewUser?: boolean;  // Is new user
  linkRequired?: boolean;  // LinkRequired 现有账号与本次第三方身份未绑定：需登录本地账号后显式绑定。 为 true 时不携带任何令牌。
  membershipStatus?: string;  // MembershipStatus 新注册待审批（WS-A A4）；pending 时不携带令牌。
  mfaCheckReason?: string;  // MFA check reason
  provider?: string;  // Provider
  refreshToken?: string;  // Refresh token
  requiredMfaMethods?: string[];  // MFA recommended methods
  requiresMfa?: boolean;  // Requires MFA
  riskLevel?: string;  // Risk level
  state?: string;  // State
  tokenType?: string;  // Token type
}

export interface OAuthProviderHealthResponse {
  providers?: unknown;
}

export interface PasskeyAuthBeginRequest {
  email?: string;
  mediation?: string;  // "conditional" 启用条件UI(免填写邮箱自动填充)
  tenantId?: string;
}

export interface PasskeyAuthenticateCompleteRequest {
  credential: AuthenticationResponse;
  email?: string;
  tenantId?: string;  // 公开路由无租户 ctx，子租户登录须显式传入
}

/** 密码策略配置 */
export interface PasswordPolicyResponse {
  captchaEnabled?: boolean;  // 是否启用CAPTCHA验证
  changeCooldownMinutes?: number;  // 密码修改冷却时间
  checkBreachedPasswords?: boolean;  // 是否检测已泄露密码
  expiryDays?: number;  // 密码过期天数
  forceChangeOnFirstLogin?: boolean;  // 首次登录强制修改密码
  gracePeriodDays?: number;  // 过期宽限天数
  historyCount?: number;  // 密码历史保留数量
  identityThreshold?: number;  // 登录限速账号阈值
  ipThreshold?: number;  // 登录限速IP阈值
  loginMethods?: string[];
  maxLength?: number;  // 最大长度
  minLength?: number;  // 最小长度
  oauthProviders?: string[];
  passwordTransmission?: string;  // 密码传输方式
  pepperEnabled?: boolean;  // US-P13: 服务端Pepper加密启用
  requireDigit?: boolean;  // 需要数字
  requireLower?: boolean;  // 需要小写字母
  requireSpecial?: boolean;  // 需要特殊字符
  requireUpper?: boolean;  // 需要大写字母
  ssoProviders?: string[];
  unicodeAllowed?: boolean;  // 是否允许Unicode密码（NFC标准化）
}

export interface PasswordStatusResponse {
  active?: boolean;  // 密码是否有效
  mustChangePassword?: boolean;  // 需要强制修改密码
  passwordChangedAt?: string;  // 密码最后修改时间
  passwordExpiresIn?: number;  // 密码剩余天数
  passwordWarning?: string;  // 密码警告: expiring/expired_grace/expired
}

/** 密码强度检查中的单个检查项 */
export interface PasswordStrengthCheckItem {
  key?: string;
  label?: string;
  passed?: boolean;
}

/** 密码强度检查结果，包含分数和各项检查详情 */
export interface PasswordStrengthResponse {
  checks?: PasswordStrengthCheckItem[];
  crackSeconds?: number;
  crackTime?: string;
  isStrong?: boolean;
  score?: number;
  suggestions?: string[];
  warning?: string;
}

export interface PermissionCheckDetailResponse {
  action?: string;
  allowed?: boolean;
  resource?: string;
  userId?: string;
}

export interface PermissionCheckResponse {
  allowed?: boolean;
}

export interface PhoneStatusResponse {
  phone?: string;
  phoneVerified?: boolean;
  verificationSent?: boolean;
}

export interface PhoneVerificationResponse {
  expiresIn?: number;
  phone?: string;
}

export interface PhoneVerifiedResponse {
  phone?: string;
}

/** 身份提供商证书信息 */
export interface ProviderCertificateResponse {
  createdAt?: string;
  expiresAt?: string;
  fingerprint?: string;
  id?: string;
  name?: string;
  providerId?: string;
  status?: string;
  Type?: string;
}

/** 公开认证配置，包含租户基本信息、密码策略、品牌定制 */
export interface PublicAuthConfigResponse {
  branding?: BrandingInfo;
  breachCheckEnabled?: boolean;
  captchaEnabled?: boolean;
  captchaProvider?: string;
  complianceProfile?: ComplianceProfileInfo;
  complianceWarnings?: ComplianceWarningItem[];
  crossTenantSwitchEnabled?: boolean;
  deviceFingerprintEnabled?: boolean;
  displayName?: string;
  identityThreshold?: number;
  ipThreshold?: number;
  issuer?: string;  // OIDC issuer（按根域+租户 slug 派生；18 §0）
  loginMethods?: string[];
  magicLinkEnabled?: boolean;
  maxConcurrentSessions?: number;
  membershipApproval?: string;
  oauthClientId?: string;
  oauthProviders?: string[];
  passkeyEnabled?: boolean;
  passwordPolicy?: PasswordPolicyResponse;
  pepperEnabled?: boolean;
  silentChallengeEnabled?: boolean;
  ssoProviders?: string[];
  tenantId?: string;
  tenantName?: string;
  transmissionNonce?: string;
  transmissionNonceExpiresAt?: string;
  transmissionPublicKey?: string;
  transmissionPublicKeyId?: string;
}

export interface QrLoginCancelRequest {
  token: string;
}

export interface QrLoginConfirmRequest {
  token: string;
}

export interface QrLoginInitiateRequest {
  tenantId?: string;  // Explicit tenant from the address bar
}

export interface QrLoginInitiateResponse {
  expiresIn?: number;
  numberMatching?: string;
  sessionToken?: string;
}

export interface QrLoginScanRequest {
  deviceInfo?: string;
  token: string;
}

export interface QrLoginStatusResponse {
  accessToken?: string;
  expiresIn?: number;
  numberMatching?: string;
  refreshToken?: string;
  status?: string;
}

/** 敏感操作前强制重新认证 */
export interface ReAuthenticateRequest {
  mfaCode?: string;  // MFA验证码
  password: string;  // 当前密码
}

/** 重新认证成功响应 */
export interface ReAuthenticateResponse {
  expiresIn?: number;  // 有效期
  message?: string;  // 结果消息
  stepUpToken?: string;  // Step-up token
}

export interface ReapplyRegistrationRequest {
  email: string;  // Email
  invitationCode?: string;  // 邀请码
  reason?: string;  // 申请理由
  tenantId?: string;  // 目标租户（地址栏租户优先）
}

export interface ReapplyRegistrationResponse {
  message?: string;
}

/** 记录登录失败请求 */
export interface RecordLoginFailureRequest {
  identifier: string;  // Identifier
  ip?: string;  // IP address
}

/** 记录登录成功请求 */
export interface RecordLoginSuccessRequest {
  ip?: string;  // IP address
  userId: string;  // User ID
}

export interface RecoverAccountRequest {
  identity: string;
  tenantId?: string;  // TenantID 显式租户（地址栏）：body > query > X-Tenant-ID；空即 400（AUTH-04/09）。
}

export interface RecoverAccountResetRequest {
  code: string;
  identity: string;
  newPassword: string;
  passwordTransmission?: string;  // plain|hash|symmetric|asymmetric
  tenantId?: string;  // TenantID 显式租户（地址栏）：body > query > X-Tenant-ID；空即 400（AUTH-04/09）。
}

export interface RecoverAccountResetResponse {
  message?: string;
}

export interface RecoverAccountResponse {
  contactTypes?: string[];
  expiresIn?: number;
  maskedTo?: string;
  message?: string;
}

/** 备用联系方式 */
export interface RecoveryContactResponse {
  createdAt?: string;  // 创建时间
  id?: string;  // 联系方式ID
  Type?: string;  // 类型
  value?: string;  // 脱敏值
  verified?: boolean;  // 是否已验证
}

/** 刷新令牌请求参数 */
export interface RefreshTokenRequest {
  refreshToken: string;  // Refresh token
}

export interface RegisterByEmailCodeRequest {
  code: string;
  email: string;
  tenantId?: string;
  username?: string;
}

/** 邀请注册请求参数 */
export interface RegisterByInvitationRequest {
  invitationCode: string;
  password: string;
  tenantId?: string;  // TenantID 可选：仅用于邀请一致性校验（body 显式租户）；不参与租户解析。
  username?: string;
}

/** OAuth显式补充注册请求参数 */
export interface RegisterByOAuthRequest {
  agreeTerms: boolean;
  password: string;
  pendingToken: string;
  phone?: string;
  username?: string;
}

export interface RegisterByPhoneCodeRequest {
  code: string;
  phone: string;
  tenantId?: string;
  username?: string;
}

/** 用户注册请求参数 */
export interface RegisterRequest {
  birthDate?: string;  // Birth date (format: "2006-01-02")
  clientNonce?: string;  // hash 模式: 客户端随机 nonce
  email?: string;  // Email
  initialRole?: string;  // InitialRole 开通链初始角色（super_admin|admin|member）。仅当 X-API-Key 命中内部 key 时生效， 其余场景静默忽略（fail-closed，防公开注册提权）。试用/建租户链由 servi...
  invitationCode?: string;  // 邀请码（invitation_only 模式下必填）
  password: string;  // Password or hash/ciphertext
  passwordTransmission?: string;  // plain|hash|symmetric|asymmetric
  phone?: string;  // Phone
  tenantId?: string;  // 对齐 LoginRequest — 若填写则覆盖 header 推导值
  username?: string;  // Username
}

/** 用户注册结果 */
export interface RegisterResponse {
  membershipStatus?: string;  // 成员状态（审批模式下为 pending）
  message?: string;  // Message
  status?: string;  // Status
  userId?: string;  // User ID
}

/** 通过备用邮箱/安全问题/信任设备发起账户恢复 */
export interface RequestAccountRecoveryRequest {
  identity: string;  // 已知的身份标识
  method: "backup_email" | "security_qa" | "trusted_device" | "sms";  // 恢复方法
  tenantId?: string;  // TenantID 公开面无 JWT：显式 body 租户优先于 X-Tenant-ID / 默认租户。
}

export interface RequestAccountRecoveryResponseWrapper {
  code?: number;
  message?: string;
  timestamp?: string;
}

export interface RequestActivationRequest {
  duration: string;
  justification: string;
  roleId: string;
}

export interface RequestMagicLinkRequest {
  email: string;
  tenantId?: string;
}

export interface ResendSMSCodeRequest {
  phone: string;
  tenantId?: string;  // TenantID 显式租户（地址栏）：body > query > X-Tenant-ID；空即 400（AUTH-04）。
}

export interface ResendVerificationEmailRequest {
  email: string;
  tenantId?: string;  // TenantID 显式租户（地址栏）：body > query > X-Tenant-ID；空即 400（AUTH-04）。
}

/** 重置密码请求参数 */
export interface ResetPasswordRequest {
  code: string;  // Verification code
  identity: string;  // Email or phone
  newPassword: string;
  passwordTransmission?: string;  // plain|hash|symmetric|asymmetric
  tenantId?: string;  // TenantID 显式租户（地址栏）：body > query > X-Tenant-ID；空即 400（AUTH-04/09）。
}

/** 重置密码响应 */
export interface ResetPasswordResponse {
  message?: string;  // Message
}

export interface RevokeActivationRequest {
  reason: string;
}

export interface RevokeConsentResponse {
  code?: number;
  message?: string;
}

export interface RiskAssessmentInfo {
  level?: string;
  recommendedMfaMethods?: string[];
  requireMfa?: boolean;
  score?: number;
}

export interface RiskEventResponse {
  createdAt?: string;  // 事件时间
  deviceId?: string;  // 设备ID
  eventType?: string;  // 事件类型
  geoLocation?: string;  // 地理位置
  id?: string;  // 事件ID
  ip?: string;  // 来源IP
  metadata?: string;  // 元数据
  riskScore?: number;  // 风险分数
  userId?: string;  // 用户ID
}

export interface RoleCheckResponse {
  hasRole?: boolean;
}

/** 吊销旧证书并上传新证书 */
export interface RotateCertificateRequest {
  certPem: string;
  name?: string;
}

/** 标记安全事件为已处理 */
export interface SecurityEventDismissRequest {
  reason?: string;  // 处理原因
}

/** 用户安全事件 */
export interface SecurityEventResponse {
  createdAt?: string;  // 事件时间
  description?: string;  // 描述
  dismissed?: boolean;  // 是否已处理
  id?: string;  // 事件ID
  ip?: string;  // 来源IP
  location?: string;  // 来源位置
  severity?: string;  // 严重级别
  Type?: string;  // 事件类型
}

/** 用户账户安全状态 */
export interface SecurityStatusResponse {
  canLogin?: boolean;  // 是否可以登录
  emailVerified?: boolean;  // 邮箱验证
  isLocked?: boolean;  // 是否锁定
  lockUntil?: string;  // 锁定截止
  lockoutDurationMinutes?: number;  // 锁定时长（分钟）
  loginFailCount?: number;  // 失败次数
  maxAttempts?: number;  // 最大尝试次数
  mfaEnabled?: boolean;  // MFA启用
  phoneVerified?: boolean;  // 手机验证
}

/** 信任设备请求参数 */
export interface SelfTrustDeviceRequest {
  trusted?: boolean;  // Is trusted
}

export interface SendMFAChallengeCodeRequest {
  challengeToken: string;
  mfaMethod: string;  // sms/email
}

export interface SendSMSCodeRequest {
  phone: string;
  tenantId?: string;  // TenantID 显式租户（地址栏）：body > query > X-Tenant-ID；空即 400（AUTH-04）。
}

export interface SendVerificationEmailRequest {
  email: string;
  tenantId?: string;  // TenantID 显式租户（地址栏）：body > query > X-Tenant-ID；空即 400（AUTH-04）。
}

export interface SessionPolicyResponse {
  refreshTokenRotation?: boolean;
  sessionBindToDevice?: boolean;
  sessionConcurrentLimit?: number;
  sessionIdleTtlMinutes?: number;
  sessionTtlMinutes?: number;
}

export interface StopImpersonationResponse {
  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
  tokenType?: string;
}

export interface SwitchTenantRequest {
  tenantId: string;
}

export interface SwitchTenantResponse {
  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
  tokenType?: string;
  user?: UserInfo;
}

export interface TenantInfo {
  id?: string;
  name?: string;
  role?: string;
}

/** 票据签名登录请求参数 */
export interface TicketSigninRequest {
  ticket: string;  // 一次性票据
}

/** 信任设备请求参数 */
export interface TrustDeviceRequest {
  trust: boolean;  // 是否信任
}

/** 解绑OAuth账户请求 */
export interface UnbindOAuthRequest {
  provider: string;  // Provider
}

/** 解锁账户请求参数 */
export interface UnlockAccountRequest {
  reason: string;  // 解锁原因（审计追踪必需）
}

export interface UpdateABACPolicyRequest {
  condition?: string;
  description?: string;
  effect?: string;
  enabled?: boolean;
  name?: string;
  priority?: number;
}

export interface UpdateAgeClassificationRequest {
  birthDate: string;
  digitalConsentAge?: number;
  minorsAgeThreshold?: number;
}

export interface UpdateApiKeyScopesRequest {
  scopes: string[];
}

export interface UpdateApiKeyStatusRequest {
  status: "active" | "inactive";
}

/** 更新身份提供商的字段映射配置 */
export interface UpdateAttributeMappingRequest {
  mappings: Record<string, string>;
}

/** 更新全局认证安全配置 */
export interface UpdateAuthConfigRequest {
  breachCheckEnabled?: boolean;
  captchaEnabled?: boolean;
  changeCooldownMinutes?: number;  // 密码修改冷却时间（分钟）
  crossTenantSwitchEnabled?: boolean;
  deviceFingerprintEnabled?: boolean;
  expiryDays?: number;  // 密码过期天数
  gracePeriodDays?: number;  // 过期宽限天数
  historyCount?: number;  // 密码历史保留数量
  identityThreshold?: number;
  ipThreshold?: number;
  lockDurationSec?: number;  // 账户锁定时间（秒）
  loginMethods?: string[];
  magicLinkEnabled?: boolean;
  maxLength?: number;  // 最大长度
  maxLoginAttempts?: number;  // 最大登录失败次数
  membershipApproval?: string;
  minLength?: number;  // 最小长度
  oauthProviders?: string[];
  passkeyEnabled?: boolean;
  passwordTransmission?: string;  // 密码传输方式
  pepperEnabled?: boolean;
  requireDigit?: boolean;  // 需要数字
  requireLower?: boolean;  // 需要小写字母
  requireSpecial?: boolean;  // 需要特殊字符
  requireUpper?: boolean;  // 需要大写字母
  silentChallengeEnabled?: boolean;
  ssoProviders?: string[];
  unicodeAllowed?: boolean;
}

export interface UpdateCurrentUserAuthResponse {
  code?: number;
  message?: string;
}

/** 更新身份提供商请求参数 */
export interface UpdateIDPRequest {
  attributeMapping?: Record<string, string>;  // 字段映射
  authUrl?: string;  // 授权端点
  clientId?: string;  // Client ID
  clientSecret?: string;  // Client Secret
  config?: Record<string, unknown>;  // 额外配置
  displayName?: string;  // 前端展示名称
  iconUrl?: string;  // 图标URL
  name?: string;  // 显示名称
  scopes?: string[];  // 权限范围
  sortOrder?: number;  // 排序
  status?: string;  // 状态
  tokenUrl?: string;  // Token端点
  userInfoUrl?: string;  // 用户信息端点
}

/** 更新身份提供商的JIT（Just-In-Time）用户自动创建策略配置 */
export interface UpdateJITConfigRequest {
  attributeMappingId?: string;
  autoCreateUser?: boolean;
  defaultRole?: string;
  enabled?: boolean;
}

/** 运行时更新密码策略请求 */
export interface UpdatePasswordPolicyRequest {
  changeCooldownMinutes?: number;  // 密码修改冷却时间（分钟）
  checkBreachedPasswords?: boolean;  // 是否检测已泄露密码
  expiryDays?: number;  // 密码过期天数
  gracePeriodDays?: number;  // 过期宽限天数
  historyCount?: number;  // 密码历史保留数量
  lockDurationSec?: number;  // 账户锁定时间（秒）
  maxLength?: number;  // 最大长度
  maxLoginAttempts?: number;  // 最大登录失败次数
  minLength?: number;  // 最小长度
  passwordTransmission?: string;  // 密码传输方式
  requireDigit?: boolean;  // 需要数字
  requireLower?: boolean;  // 需要小写字母
  requireSpecial?: boolean;  // 需要特殊字符
  requireUpper?: boolean;  // 需要大写字母
}

/** 更新当前认证用户请求 */
export interface UpdateUserAuthRequest {
  metadata?: Record<string, string>;  // Metadata (flat string map)
  mfaEnabled?: boolean;  // MFAEnabled
  username?: string;  // Username
}

/** 更新用户状态请求参数 */
export interface UpdateUserStatusRequest {
  reason?: string;  // 原因
  status: "active" | "banned" | "pending" | "suspended" | "locked" | "deleted";  // 目标状态
}

/** 用户基本信息 */
export interface UserInfo {
  createdAt?: string;  // Account creation time
  email?: string;  // Email
  id?: string;  // User ID
  lastLoginAt?: string;  // Last login time
  metadata?: Record<string, unknown>;  // AUTH-44：metadata 仅 /auth/me 回传（portal 偏好等）；其余构造点省略。
  mfaEnabled?: boolean;  // AUTH-44：指针 + omitempty —— 仅权威构造点（/auth/me）填充；其余构造点省略该键， 避免登录响应等处误报 mfa_enabled=false（零值不等于"未启用"）。
  mustChangePassword?: boolean;  // Password must be changed
  passwordExpiresIn?: number;  // Days until password expires
  passwordWarning?: string;  // Password warning: expiring/expired_grace/expired
  phone?: string;  // Phone
  status?: string;  // Status
  username?: string;  // Username
}

/** 更新用户请求参数 */
export interface UserUpdateRequest {
  ageGroup?: string;  // 年龄段
  birthDate?: string;  // 出生日期
  departmentId?: string;  // 部门ID
  email?: string;  // 邮箱
  isMinor?: boolean;  // 是否未成年
  nickname?: string;  // 昵称
  pendingParentalConsent?: boolean;  // 是否等待家长同意
  phone?: string;  // 手机号
  reason?: string;  // 变更原因（变更 email 时必填，ADR-07）
  role?: string;  // 角色
  username?: string;  // 用户名
}

export interface UserWithIdentitiesResponse {
  identities?: IdentityResponse[];
  user?: AuthUserResponse;
}

export interface ValidateKeyRequest {
  apiKey: string;
}

export interface ValidateKeyResult {
  ipRestrictions?: IpRestrictionDTO[];
  keyId?: string;
  scopes?: string[];
  status?: string;
  tenantId?: string;
  userId?: string;
}

export interface VerificationTrackingQueryResponse {
  channel?: string;
  createdAt?: string;
  error?: string;
  expiresAt?: string;
  purpose?: string;
  sentAt?: string;
  status?: string;
  trackingId?: string;
}

/** 验证账户恢复验证码 */
export interface VerifyAccountRecoveryRequest {
  code: string;  // 验证码
  recoveryToken: string;  // 恢复令牌
  tenantId?: string;  // TenantID 显式租户（地址栏）。非空时必须与令牌租户一致；空 = 令牌权威。
}

/** 验证邮箱/手机号变更 */
export interface VerifyChangeRequest {
  code: string;  // 验证码
}

export interface VerifyEmailRequest {
  code: string;
  email: string;
  tenantId?: string;  // TenantID 显式租户（地址栏或邮件链接）：body > query > X-Tenant-ID；空即 400（AUTH-04）。
}

export interface VerifyMFAChallengeRequest {
  challengeToken: string;
  code: string;
  mfaMethod?: string;  // totp/sms/email/push — default totp; for push, code is challenge_id
}

export interface VerifyPasswordData {
  userId?: string;
  valid?: boolean;
}

/** 验证密码请求 */
export interface VerifyPasswordRequest {
  identifier: string;  // Identifier
  password: string;  // Password
}

export interface VerifyPhoneRequest {
  code: string;
  phone: string;
  tenantId?: string;  // TenantID 显式租户（地址栏）：body > query > X-Tenant-ID；空即 400（AUTH-04）。
}

/** 校验发送到该恢复联系方式的验证码 */
export interface VerifyRecoveryContactRequest {
  code: string;
}

/** 验证重置码请求参数 */
export interface VerifyResetCodeRequest {
  code: string;  // Verification code
  identity: string;  // Email or phone
  tenantId?: string;  // TenantID 显式租户（地址栏）：body > query > X-Tenant-ID；空即 400（AUTH-04/09）。
}

export interface Web3VerifyRequest {
  address: string;
  message: string;
  signature: string;
}

export interface Web3VerifyResponse {
  address?: string;
  message?: string;
  verified?: boolean;
}

export interface WebAuthnAuthenticatorSelection {
  authenticatorAttachment?: string;
  residentKey?: string;
  userVerification?: string;
}

export interface WebAuthnCredentialDescriptor {
  id?: string;
  transports?: string[];
  Type?: string;
}

export interface WebAuthnCredentialParameter {
  alg?: number;
  Type?: string;
}

export interface WebAuthnCredentialResponse {
  aaguid?: string;
  attestationType?: string;
  authenticatorAttachment?: string;
  authenticatorName?: string;
  backupEligible?: boolean;
  backupState?: boolean;
  createdAt?: string;
  credentialId?: string;
  id?: string;
  lastUsedAt?: string;
  name?: string;
  signCount?: number;
  transports?: string;
  userId?: string;
  userVerified?: boolean;
}

export interface WebAuthnLoginOptionsResponse {
  allowCredentials?: WebAuthnCredentialDescriptor[];
  challenge?: string;
  rpId?: string;
  timeout?: number;
  userVerification?: string;
}

export interface WebAuthnLoginResponse {
  publicKey?: WebAuthnLoginOptionsResponse;
}

export interface WebAuthnRPEntity {
  id?: string;
  name?: string;
}

/** WebAuthn navigator.credentials.create() 的 publicKey 参数 */
export interface WebAuthnRegistrationOptionsResponse {
  attestation?: string;
  authenticatorSelection?: WebAuthnAuthenticatorSelection;
  challenge?: string;
  pubKeyCredParams?: WebAuthnCredentialParameter[];
  rp?: WebAuthnRPEntity;
  timeout?: number;
  user?: WebAuthnUserEntity;
}

export interface WebAuthnRegistrationResponse {
  publicKey?: WebAuthnRegistrationOptionsResponse;
}

export interface WebAuthnUserEntity {
  displayName?: string;
  id?: string;
  name?: string;
}

export interface IpRestrictionDTO {
  id?: string;
  label?: string;
  status?: string;
  value?: string;
}

export interface AuthenticationResponse {
  id?: string;
  rawId?: string;
  response?: Record<string, unknown>;
  Type?: string;
  userId?: string;
}

export interface CredentialCreation {
  id?: string;
  rawId?: string;
  response?: Record<string, unknown>;
  Type?: string;
}

export interface BackchannelLogoutRequest {
  logoutToken?: string;
}

export interface CheckPublicPasswordStrengthRequest {
  password: string;
}

export interface SamlLinkedAccountInfo {
  email?: string;
  id?: string;
  linkedAt?: string;
  nameId?: string;
  providerId?: string;
  providerName?: string;
}

export interface SelfServicePasswordStrengthRequest {
  password: string;
}

export interface BeginLoginRequest {
  password: string;
}

export interface BeginRegistrationRequest {
  displayName?: string;
  password: string;
  userName?: string;  // UserName 仅作凭据 label（UP-91-A）：可缺省，服务端派生链补全（user_name → email → user-<id>）。
}

export interface CompleteLoginRequest {
  id?: string;
  rawId?: string;
  response?: Record<string, unknown>;
  Type?: string;
  userId?: string;
}

export interface CompleteRegistrationRequest {
  credential: CredentialCreation;
}

export interface RiskConfigRequest {
  criticalThreshold?: number;
  elevatedThreshold?: number;
  highThreshold?: number;
  learningPeriodDays?: number;
  moderateThreshold?: number;
  sessionRiskEnabled?: boolean;
  signalWeights?: SignalWeights;
}

export interface RiskConfigResponse {
  criticalThreshold?: number;
  elevatedThreshold?: number;
  highThreshold?: number;
  learningPeriodDays?: number;
  moderateThreshold?: number;
  sessionRiskEnabled?: boolean;
  signalWeights?: SignalWeights;
  tenantId?: string;
}

export interface RiskDashboardResponse {
  dayCounts?: RiskEventDayCount[];
  scoreRanges?: RiskScoreRange[];
  tenantId?: string;
  todayTotal?: number;
  topEventTypes?: RiskEventTypeCount[];
  topRiskUsers?: TopRiskUser[];
}

export interface CreateRobotRequest {
  firmwareVer?: string;
  location?: string;
  model?: string;
  name: string;
  workloadSubtype?: string;
}

export interface RobotInfo {
  createdAt?: string;
  firmwareVer?: string;
  identityId?: string;
  lastHealthAt?: string;
  location?: string;
  model?: string;
  name?: string;
  ownerId?: string;
  ownerPrincipalId?: string;  // OwnerPrincipalID additive（json omitempty）；保留 OwnerID 以向后兼容（C-4）。
  safetyPolicy?: string;
  status?: string;
  updatedAt?: string;
  workloadSubtype?: string;
}

export interface UpdateRobotRequest {
  firmwareVer?: string;
  location?: string;
  model?: string;
  name?: string;
  safetyPolicy?: string;
}

export interface IssueIntentTokenRequest {
  actions?: string[];
  allowedZones?: string[];
  maxSpeed?: number;
}

export interface IssueIntentTokenResponse {
  intentToken?: string;
}

export interface RevokeIntentTokenRequest {
  intentToken?: string;
}


// ====== API Functions (tree-shakeable: independent exports) ======

// ApiClient 的 post/put 不收 query 参数，这里统一拼接到 URL
function appendQuery(url: string, params?: Record<string, unknown>): string {
  if (!params) return url;
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) query.append(k, String(v));
  }
  const qs = query.toString();
  return qs ? `${url}?${qs}` : url;
}

/** 查询ABAC策略列表 */
export function getAdminAbacPolicies(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<ABACPolicyResponse>> {
  return client.get(`/identity/api/v1/admin/abac-policies`, { params });
}

/** 创建ABAC策略 */
export function postAdminAbacPolicies(client: ApiClient, data: CreateABACPolicyRequest): Promise<ABACPolicyResponse> {
  return client.post(`/identity/api/v1/admin/abac-policies`, data);
}

/** 删除ABAC策略 */
export function deleteAdminAbacPoliciesByAbacPolicies(client: ApiClient, policyId: string): Promise<void> {
  return client.delete(`/identity/api/v1/admin/abac-policies/${policyId}`);
}

/** 获取ABAC策略详情 */
export function getAdminAbacPoliciesByAbacPolicies(client: ApiClient, policyId: string): Promise<ABACPolicyResponse> {
  return client.get(`/identity/api/v1/admin/abac-policies/${policyId}`);
}

/** 更新ABAC策略 */
export function putAdminAbacPoliciesByAbacPolicies(client: ApiClient, policyId: string, data: UpdateABACPolicyRequest): Promise<ABACPolicyResponse> {
  return client.put(`/identity/api/v1/admin/abac-policies/${policyId}`, data);
}

/** List Agents */
export function getAdminAgents(client: ApiClient, params?: {
  tenant_id: string;  // 租户ID
  status?: string;  // 状态过滤
  workload_subtype?: string;  // 工作负载子类型
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<AgentInfo>> {
  return client.get(`/identity/api/v1/admin/agents`, { params });
}

/** Create Agent */
export function postAdminAgents(client: ApiClient, data: CreateAgentRequest): Promise<AgentInfo> {
  return client.post(`/identity/api/v1/admin/agents`, data);
}

/** Revoke Agent */
export function deleteAdminAgentsByAgents(client: ApiClient, agentId: string): Promise<SimpleResponse> {
  return client.delete(`/identity/api/v1/admin/agents/${agentId}`);
}

/** Get Agent */
export function getAdminAgentsByAgents(client: ApiClient, agentId: string): Promise<AgentInfo> {
  return client.get(`/identity/api/v1/admin/agents/${agentId}`);
}

/** Update Agent */
export function putAdminAgentsByAgents(client: ApiClient, agentId: string, data: UpdateAgentRequest): Promise<AgentInfo> {
  return client.put(`/identity/api/v1/admin/agents/${agentId}`, data);
}

/** Get Agent Activity */
export function getAdminAgentsActivityByAgents(client: ApiClient, agentId: string): Promise<ApiListResult<AgentActivityInfo>> {
  return client.get(`/identity/api/v1/admin/agents/${agentId}/activity`);
}

/** List Agent Credentials */
export function getAdminAgentsCredentialsByAgents(client: ApiClient, agentId: string): Promise<ApiListResult<AgentCredentialInfo>> {
  return client.get(`/identity/api/v1/admin/agents/${agentId}/credentials`);
}

/** Create Agent Credential */
export function postAdminAgentsCredentialsByAgents(client: ApiClient, agentId: string, data: CreateAgentCredentialRequest): Promise<CreateAgentCredentialResult> {
  return client.post(`/identity/api/v1/admin/agents/${agentId}/credentials`, data);
}

/** Revoke Agent Credential */
export function deleteAdminAgentsCredentialsByAgentsByCredentials(client: ApiClient, agentId: string, credId: string): Promise<SimpleResponse> {
  return client.delete(`/identity/api/v1/admin/agents/${agentId}/credentials/${credId}`);
}

/** Get Agent Credential */
export function getAdminAgentsCredentialsByAgentsByCredentials(client: ApiClient, agentId: string, credId: string): Promise<AgentCredentialInfo> {
  return client.get(`/identity/api/v1/admin/agents/${agentId}/credentials/${credId}`);
}

/** Rotate Agent Credential */
export function postAdminAgentsCredentialsRotateByAgentsByCredentials(client: ApiClient, agentId: string, credId: string): Promise<CreateAgentCredentialResult> {
  return client.post(`/identity/api/v1/admin/agents/${agentId}/credentials/${credId}/rotate`);
}

/** Get Agent Permissions */
export function getAdminAgentsPermissionsByAgents(client: ApiClient, agentId: string): Promise<ApiListResult<AgentPermissionInfo>> {
  return client.get(`/identity/api/v1/admin/agents/${agentId}/permissions`);
}

/** 管理员查询 API Key 列表 */
export function getAdminAuthApiKeys(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
  status?: string;  // 状态筛选: active/inactive/revoked
  environment?: string;  // 环境筛选: live/test
  search?: string;  // 搜索名称或前缀
}): Promise<ApiListResult<ApiKeyResponse>> {
  return client.get(`/identity/api/v1/admin/auth/api-keys`, { params });
}

/** 安全异常检测 */
export function getAdminAuthApiKeysAnomalies(client: ApiClient): Promise<unknown & Record<string, unknown>> {
  return client.get(`/identity/api/v1/admin/auth/api-keys/anomalies`);
}

/** 批量吊销 API Key */
export function postAdminAuthApiKeysBatchRevoke(client: ApiClient, data: BatchRevokeRequest): Promise<unknown & Record<string, unknown>> {
  return client.post(`/identity/api/v1/admin/auth/api-keys/batch-revoke`, data);
}

/** 清理旧审计日志 */
export function postAdminAuthApiKeysCleanupAuditLogs(client: ApiClient, params?: {
  days?: number;  // 保留天数
}): Promise<void> {
  return client.post(appendQuery(`/identity/api/v1/admin/auth/api-keys/cleanup-audit-logs`, params));
}

/** 获取即将过期的 API Key */
export function getAdminAuthApiKeysExpiring(client: ApiClient, params?: {
  days?: number;  // 过期天数范围
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<ApiKeyResponse>> {
  return client.get(`/identity/api/v1/admin/auth/api-keys/expiring`, { params });
}

/** 管理员 API Key 统计 */
export function getAdminAuthApiKeysStats(client: ApiClient): Promise<unknown & Record<string, unknown>> {
  return client.get(`/identity/api/v1/admin/auth/api-keys/stats`);
}

/** 管理员强制吊销 API Key */
export function deleteAdminAuthApiKeysForceByApiKeys(client: ApiClient, apiKeyId: string): Promise<void> {
  return client.delete(`/identity/api/v1/admin/auth/api-keys/${apiKeyId}/force`);
}

/** 儿童同意记录列表 */
export function getAdminConsents(client: ApiClient, params?: {
  status?: string;  // 状态（pending/approved/denied/expired）
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<ChildrenConsentResponse>> {
  return client.get(`/identity/api/v1/admin/consents`, { params });
}

/** 列出身份提供商 */
export function getAdminIdentityProviders(client: ApiClient, params?: {
  type?: string;  // 提供商类型过滤
  status?: string;  // 状态过滤: active/inactive
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<IDPResponse>> {
  return client.get(`/identity/api/v1/admin/identity-providers`, { params });
}

/** 创建身份提供商 */
export function postAdminIdentityProviders(client: ApiClient, data: CreateIDPRequest): Promise<IDPResponse> {
  return client.post(`/identity/api/v1/admin/identity-providers`, data);
}

/** 导入OIDC Discovery */
export function postAdminIdentityProvidersImportOidcDiscovery(client: ApiClient, data: ImportOIDCDiscoveryRequest): Promise<IDPResponse> {
  return client.post(`/identity/api/v1/admin/identity-providers/import-oidc-discovery`, data);
}

/** 导入SAML Metadata */
export function postAdminIdentityProvidersImportSamlMetadata(client: ApiClient, data: ImportSAMLMetadataRequest): Promise<IDPResponse> {
  return client.post(`/identity/api/v1/admin/identity-providers/import-saml-metadata`, data);
}

/** 删除身份提供商 */
export function deleteAdminIdentityProvidersByIdentityProviders(client: ApiClient, providerId: string): Promise<SimpleResponse> {
  return client.delete(`/identity/api/v1/admin/identity-providers/${providerId}`);
}

/** 获取身份提供商详情 */
export function getAdminIdentityProvidersByIdentityProviders(client: ApiClient, providerId: string): Promise<IDPResponse> {
  return client.get(`/identity/api/v1/admin/identity-providers/${providerId}`);
}

/** 更新身份提供商 */
export function putAdminIdentityProvidersByIdentityProviders(client: ApiClient, providerId: string, data: UpdateIDPRequest): Promise<IDPResponse> {
  return client.put(`/identity/api/v1/admin/identity-providers/${providerId}`, data);
}

/** 启用身份提供商 */
export function postAdminIdentityProvidersActivateByIdentityProviders(client: ApiClient, providerId: string): Promise<IDPResponse> {
  return client.post(`/identity/api/v1/admin/identity-providers/${providerId}/activate`);
}

/** 获取属性映射 */
export function getAdminIdentityProvidersAttributeMappingByIdentityProviders(client: ApiClient, providerId: string): Promise<Record<string, unknown>> {
  return client.get(`/identity/api/v1/admin/identity-providers/${providerId}/attribute-mapping`);
}

/** 更新属性映射 */
export function putAdminIdentityProvidersAttributeMappingByIdentityProviders(client: ApiClient, providerId: string, data: UpdateAttributeMappingRequest): Promise<SimpleResponse> {
  return client.put(`/identity/api/v1/admin/identity-providers/${providerId}/attribute-mapping`, data);
}

/** 列出证书 */
export function getAdminIdentityProvidersCertificatesByIdentityProviders(client: ApiClient, providerId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<ProviderCertificateResponse>> {
  return client.get(`/identity/api/v1/admin/identity-providers/${providerId}/certificates`, { params });
}

/** 上传证书 */
export function postAdminIdentityProvidersCertificatesByIdentityProviders(client: ApiClient, providerId: string, data: CreateCertificateRequest): Promise<ProviderCertificateResponse> {
  return client.post(`/identity/api/v1/admin/identity-providers/${providerId}/certificates`, data);
}

/** 删除证书 */
export function deleteAdminIdentityProvidersCertificatesByIdentityProvidersByCertificates(client: ApiClient, providerId: string, certId: string): Promise<SimpleResponse> {
  return client.delete(`/identity/api/v1/admin/identity-providers/${providerId}/certificates/${certId}`);
}

/** 证书轮转 */
export function postAdminIdentityProvidersCertificatesRotateByIdentityProvidersByCertificates(client: ApiClient, providerId: string, certId: string, data: RotateCertificateRequest): Promise<ProviderCertificateResponse> {
  return client.post(`/identity/api/v1/admin/identity-providers/${providerId}/certificates/${certId}/rotate`, data);
}

/** 停用身份提供商 */
export function postAdminIdentityProvidersDeactivateByIdentityProviders(client: ApiClient, providerId: string): Promise<IDPResponse> {
  return client.post(`/identity/api/v1/admin/identity-providers/${providerId}/deactivate`);
}

/** 获取JIT配置 */
export function getAdminIdentityProvidersJitConfigByIdentityProviders(client: ApiClient, providerId: string): Promise<SimpleResponse> {
  return client.get(`/identity/api/v1/admin/identity-providers/${providerId}/jit-config`);
}

/** 更新JIT配置 */
export function putAdminIdentityProvidersJitConfigByIdentityProviders(client: ApiClient, providerId: string, data: UpdateJITConfigRequest): Promise<SimpleResponse> {
  return client.put(`/identity/api/v1/admin/identity-providers/${providerId}/jit-config`, data);
}

/** 获取提供商统计 */
export function getAdminIdentityProvidersStatsByIdentityProviders(client: ApiClient, providerId: string): Promise<SimpleResponse> {
  return client.get(`/identity/api/v1/admin/identity-providers/${providerId}/stats`);
}

/** 测试身份提供商连接 */
export function postAdminIdentityProvidersTestByIdentityProviders(client: ApiClient, providerId: string): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/admin/identity-providers/${providerId}/test`);
}

/** 获取提供商关联用户 */
export function getAdminIdentityProvidersUsersByIdentityProviders(client: ApiClient, providerId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<SimpleResponse> {
  return client.get(`/identity/api/v1/admin/identity-providers/${providerId}/users`, { params });
}

/** 管理员模拟用户登录 */
export function postAdminImpersonate(client: ApiClient, data: AdminImpersonateRequest): Promise<AdminImpersonateResponse> {
  return client.post(`/identity/api/v1/admin/impersonate`, data);
}

/** List Devices */
export function getAdminIots(client: ApiClient, params?: {
  status?: string;  // 状态过滤
  workload_subtype?: string;  // 工作负载子类型
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<DeviceInfo>> {
  return client.get(`/identity/api/v1/admin/iots`, { params });
}

/** Create Device */
export function postAdminIots(client: ApiClient, data: CreateDeviceRequest): Promise<DeviceInfo> {
  return client.post(`/identity/api/v1/admin/iots`, data);
}

/** Revoke Device */
export function deleteAdminIotsByIots(client: ApiClient, iotId: string): Promise<SimpleResponse> {
  return client.delete(`/identity/api/v1/admin/iots/${iotId}`);
}

/** Get Device */
export function getAdminIotsByIots(client: ApiClient, iotId: string): Promise<DeviceInfo> {
  return client.get(`/identity/api/v1/admin/iots/${iotId}`);
}

/** LDAP directory health check */
export function getAdminLdapHealth(client: ApiClient): Promise<LdapHealthResponse[]> {
  return client.get(`/identity/api/v1/admin/ldap/health`);
}

/** Test LDAP directory connection */
export function postAdminLdapTestConnection(client: ApiClient, data: LdapTestConnectionRequest): Promise<LdapTestConnectionResponse> {
  return client.post(`/identity/api/v1/admin/ldap/test-connection`, data);
}

/** Get LDAP group-role mapping */
export function getAdminLdapGroupRoleMappingByLdap(client: ApiClient, name: string): Promise<LdapGroupRoleMappingResponse> {
  return client.get(`/identity/api/v1/admin/ldap/${name}/group-role-mapping`);
}

/** Update LDAP group-role mapping */
export function putAdminLdapGroupRoleMappingByLdap(client: ApiClient, name: string, data: LdapGroupRoleMappingRequest): Promise<LdapGroupRoleMappingResponse> {
  return client.put(`/identity/api/v1/admin/ldap/${name}/group-role-mapping`, data);
}

/** 列出双人复核记录 */
export function getAdminMakerChecker(client: ApiClient, params?: {
  status?: "recorded" | "approved" | "rejected" | "expired";  // 状态过滤
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<MakerCheckerRecordResponse>> {
  return client.get(`/identity/api/v1/admin/maker-checker`, { params });
}

/** 删除双人复核记录 */
export function deleteAdminMakerCheckerByMakerChecker(client: ApiClient, recordId: string): Promise<void> {
  return client.delete(`/identity/api/v1/admin/maker-checker/${recordId}`);
}

/** 获取NHI策略 */
export function getAdminPoliciesNhi(client: ApiClient): Promise<NHIPolicyResponse> {
  return client.get(`/identity/api/v1/admin/policies/nhi`);
}

/** 更新NHI策略 */
export function putAdminPoliciesNhi(client: ApiClient, data: NHIPolicyRequest): Promise<NHIPolicyResponse> {
  return client.put(`/identity/api/v1/admin/policies/nhi`, data);
}

/** List Robots */
export function getAdminRobots(client: ApiClient, params?: {
  status?: string;  // Status filter
  workload_subtype?: string;  // Workload subtype filter
  page?: number;  // Page number
  page_size?: number;  // Page size
}): Promise<ApiListResult<RobotInfo>> {
  return client.get(`/identity/api/v1/admin/robots`, { params });
}

/** Create Robot */
export function postAdminRobots(client: ApiClient, data: CreateRobotRequest): Promise<RobotInfo> {
  return client.post(`/identity/api/v1/admin/robots`, data);
}

/** Delete Robot */
export function deleteAdminRobotsByRobots(client: ApiClient, robotId: string): Promise<SimpleResponse> {
  return client.delete(`/identity/api/v1/admin/robots/${robotId}`);
}

/** Get Robot */
export function getAdminRobotsByRobots(client: ApiClient, robotId: string): Promise<RobotInfo> {
  return client.get(`/identity/api/v1/admin/robots/${robotId}`);
}

/** Update Robot */
export function putAdminRobotsByRobots(client: ApiClient, robotId: string, data: UpdateRobotRequest): Promise<RobotInfo> {
  return client.put(`/identity/api/v1/admin/robots/${robotId}`, data);
}

/** Commission Robot */
export function postAdminRobotsCommissionByRobots(client: ApiClient, robotId: string): Promise<RobotInfo> {
  return client.post(`/identity/api/v1/admin/robots/${robotId}/commission`);
}

/** Decommission Robot */
export function postAdminRobotsDecommissionByRobots(client: ApiClient, robotId: string): Promise<RobotInfo> {
  return client.post(`/identity/api/v1/admin/robots/${robotId}/decommission`);
}

/** Issue Intent Token */
export function postAdminRobotsIntentByRobots(client: ApiClient, robotId: string, data: IssueIntentTokenRequest): Promise<IssueIntentTokenResponse> {
  return client.post(`/identity/api/v1/admin/robots/${robotId}/intent`, data);
}

/** Revoke Intent Token */
export function postAdminRobotsIntentRevokeByRobots(client: ApiClient, robotId: string, data: RevokeIntentTokenRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/admin/robots/${robotId}/intent/revoke`, data);
}

/** 查询角色激活记录 */
export function getAdminRoleActivations(client: ApiClient, params?: {
  status?: string;  // 激活状态过滤
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<ActivationResponse>> {
  return client.get(`/identity/api/v1/admin/role-activations`, { params });
}

/** 撤销角色激活 */
export function postAdminRoleActivationsRevokeByRoleActivations(client: ApiClient, roleActivationId: string, data: RevokeActivationRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/admin/role-activations/${roleActivationId}/revoke`, data);
}

/** 获取认证配置 */
export function getAdminSecurityAuthConfig(client: ApiClient): Promise<Record<string, unknown>> {
  return client.get(`/identity/api/v1/admin/security/auth-config`);
}

/** 更新认证配置 */
export function putAdminSecurityAuthConfig(client: ApiClient, data: UpdateAuthConfigRequest): Promise<SimpleResponse> {
  return client.put(`/identity/api/v1/admin/security/auth-config`, data);
}

/** 获取密码策略 */
export function getAdminSecurityPasswordPolicy(client: ApiClient): Promise<void> {
  return client.get(`/identity/api/v1/admin/security/password-policy`);
}

/** 更新密码策略 */
export function putAdminSecurityPasswordPolicy(client: ApiClient, data: UpdatePasswordPolicyRequest): Promise<SimpleResponse> {
  return client.put(`/identity/api/v1/admin/security/password-policy`, data);
}

/** 获取密码统计 */
export function getAdminSecurityPasswordStats(client: ApiClient): Promise<void> {
  return client.get(`/identity/api/v1/admin/security/password-stats`);
}

/** 获取风险配置 */
export function getAdminSecurityRiskConfig(client: ApiClient): Promise<RiskConfigResponse> {
  return client.get(`/identity/api/v1/admin/security/risk-config`);
}

/** 更新风险配置 */
export function putAdminSecurityRiskConfig(client: ApiClient, data: RiskConfigRequest): Promise<RiskConfigResponse> {
  return client.put(`/identity/api/v1/admin/security/risk-config`, data);
}

/** 重置风险配置 */
export function postAdminSecurityRiskConfigReset(client: ApiClient): Promise<RiskConfigResponse> {
  return client.post(`/identity/api/v1/admin/security/risk-config/reset`);
}

/** 风险仪表盘 */
export function getAdminSecurityRiskDashboard(client: ApiClient): Promise<RiskDashboardResponse> {
  return client.get(`/identity/api/v1/admin/security/risk-dashboard`);
}

/** 风险事件列表 */
export function getAdminSecurityRiskEvents(client: ApiClient, params?: {
  event_type?: string;  // 事件类型
  user_id?: string;  // 用户ID
  min_score?: number;  // 最低风险分数
  start_date?: string;  // 开始日期 (RFC3339)
  end_date?: string;  // 结束日期 (RFC3339)
}): Promise<ApiListResult<RiskEventResponse>> {
  return client.get(`/identity/api/v1/admin/security/risk-events`, { params });
}

/** 风险事件聚合 */
export function getAdminSecurityRiskEventsAggregation(client: ApiClient, params?: {
  start_date?: string;  // 开始日期 (RFC3339)
  end_date?: string;  // 结束日期 (RFC3339)
}): Promise<Record<string, unknown>> {
  return client.get(`/identity/api/v1/admin/security/risk-events/aggregation`, { params });
}

/** 查询用户列表 */
export function getAdminUsers(client: ApiClient, params?: {
  status?: string;  // 用户状态
  search?: string;  // 搜索关键字
  page?: number;  // 页码
  limit?: number;  // 每页数量
}): Promise<ApiListResult<AuthUserResponse>> {
  return client.get(`/identity/api/v1/admin/users`, { params });
}

/** 创建用户 */
export function postAdminUsers(client: ApiClient, data: HTTPUserCreateRequest): Promise<UserWithIdentitiesResponse> {
  return client.post(`/identity/api/v1/admin/users`, data);
}

/** 批量创建用户 */
export function postAdminUsersBatch(client: ApiClient, data: BatchCreateUserRequest): Promise<void> {
  return client.post(`/identity/api/v1/admin/users/batch`, data);
}

/** 批量更新用户状态 */
export function postAdminUsersBatchStatus(client: ApiClient, data: BatchUpdateUserStatusRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/admin/users/batch/status`, data);
}

/** 合并用户 */
export function postAdminUsersMerge(client: ApiClient, data: MergeUsersRequest): Promise<void> {
  return client.post(`/identity/api/v1/admin/users/merge`, data);
}

/** 删除用户 */
export function deleteAdminUsersByUsers(client: ApiClient, userId: string, params?: {
  permanent?: boolean;  // 是否永久删除
}): Promise<void> {
  return client.delete(`/identity/api/v1/admin/users/${userId}`, params);
}

/** 获取用户详情 */
export function getAdminUsersByUsers(client: ApiClient, userId: string): Promise<UserWithIdentitiesResponse> {
  return client.get(`/identity/api/v1/admin/users/${userId}`);
}

/** 更新用户信息 */
export function putAdminUsersByUsers(client: ApiClient, userId: string, data: UserUpdateRequest): Promise<AuthUserResponse> {
  return client.put(`/identity/api/v1/admin/users/${userId}`, data);
}

/** 解锁账户 */
export function postAdminUsersAccountUnlocksByUsers(client: ApiClient, userId: string, data: UnlockAccountRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/admin/users/${userId}/account-unlocks`, data);
}

/** 拒绝儿童同意 */
export function postAdminUsersChildrenConsentDenyByUsers(client: ApiClient, userId: string): Promise<ChildrenConsentResponse> {
  return client.post(`/identity/api/v1/admin/users/${userId}/children-consent/deny`);
}

/** 验证儿童同意 */
export function postAdminUsersChildrenConsentVerifyByUsers(client: ApiClient, userId: string): Promise<ChildrenConsentResponse> {
  return client.post(`/identity/api/v1/admin/users/${userId}/children-consent/verify`);
}

/** 管理员查询用户设备列表 */
export function getAdminUsersDevicesByUsers(client: ApiClient, userId: string): Promise<ApiListResult<DeviceResponse>> {
  return client.get(`/identity/api/v1/admin/users/${userId}/devices`);
}

/** 获取用户身份列表 */
export function getAdminUsersIdentitiesByUsers(client: ApiClient, userId: string): Promise<IdentityListData> {
  return client.get(`/identity/api/v1/admin/users/${userId}/identities`);
}

/** 添加用户身份 */
export function postAdminUsersIdentitiesByUsers(client: ApiClient, userId: string, data: AddIdentityRequest): Promise<IdentityResponse> {
  return client.post(`/identity/api/v1/admin/users/${userId}/identities`, data);
}

/** 移除用户身份 */
export function deleteAdminUsersIdentitiesByUsersByIdentities(client: ApiClient, userId: string, identityId: string): Promise<void> {
  return client.delete(`/identity/api/v1/admin/users/${userId}/identities/${identityId}`);
}

/** 设置主身份 */
export function putAdminUsersIdentitiesSetPrimaryByUsersByIdentities(client: ApiClient, userId: string, identityId: string): Promise<SimpleResponse> {
  return client.put(`/identity/api/v1/admin/users/${userId}/identities/${identityId}/set-primary`);
}

/** 验证用户身份 */
export function postAdminUsersIdentitiesVerificationsByUsersByIdentities(client: ApiClient, userId: string, identityId: string): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/admin/users/${userId}/identities/${identityId}/verifications`);
}

/** 管理员模拟用户 */
export function postAdminUsersImpersonateByUsers(client: ApiClient, userId: string, data: ImpersonateRequest): Promise<ImpersonateResponse> {
  return client.post(`/identity/api/v1/admin/users/${userId}/impersonate`, data);
}

/** 获取登录历史 */
export function getAdminUsersLoginHistoriesByUsers(client: ApiClient, userId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<LoginHistoryResponse>> {
  return client.get(`/identity/api/v1/admin/users/${userId}/login-histories`, { params });
}

/** 管理员查看用户OAuth连接 */
export function getAdminUsersOauthConnectionsByUsers(client: ApiClient, userId: string): Promise<ApiListResult<unknown>> {
  return client.get(`/identity/api/v1/admin/users/${userId}/oauth-connections`);
}

/** 管理员查询用户Passkey凭证 */
export function getAdminUsersPasskeysByUsers(client: ApiClient, userId: string): Promise<ApiListResult<WebAuthnCredentialResponse>> {
  return client.get(`/identity/api/v1/admin/users/${userId}/passkeys`);
}

/** 管理员撤销用户Passkey凭证 */
export function deleteAdminUsersPasskeysByUsersByPasskeys(client: ApiClient, userId: string, credentialId: string): Promise<SimpleResponse> {
  return client.delete(`/identity/api/v1/admin/users/${userId}/passkeys/${credentialId}`);
}

/** 修改密码 */
export function putAdminUsersPasswordByUsers(client: ApiClient, userId: string, data: HTTPChangePasswordRequest): Promise<SimpleResponse> {
  return client.put(`/identity/api/v1/admin/users/${userId}/password`, data);
}

/** 重置密码 */
export function postAdminUsersPasswordResetsByUsers(client: ApiClient, userId: string, data: HTTPResetPasswordRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/admin/users/${userId}/password-resets`, data);
}

/** 获取用户密码状态 */
export function getAdminUsersPasswordStatusByUsers(client: ApiClient, userId: string): Promise<PasswordStatusResponse> {
  return client.get(`/identity/api/v1/admin/users/${userId}/password-status`);
}

/** 获取安全状态 */
export function getAdminUsersSecurityStatusByUsers(client: ApiClient, userId: string): Promise<SecurityStatusResponse> {
  return client.get(`/identity/api/v1/admin/users/${userId}/security-status`);
}

/** 更新用户状态 */
export function putAdminUsersStatusByUsers(client: ApiClient, userId: string, data: UpdateUserStatusRequest): Promise<void> {
  return client.put(`/identity/api/v1/admin/users/${userId}/status`, data);
}

/** 匿名认证 */
export function postAuthAnonymous(client: ApiClient, data: AnonymousSigninRequest): Promise<LoginByCodeResponse> {
  return client.post(`/identity/api/v1/auth/anonymous`, data);
}

/** 查询 API Key 列表 */
export function getAuthApiKeys(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
  status?: string;  // 状态筛选: active/inactive/revoked
  environment?: string;  // 环境筛选: live/test
  search?: string;  // 搜索名称或前缀
}): Promise<ApiListResult<ApiKeyResponse>> {
  return client.get(`/identity/api/v1/auth/api-keys`, { params });
}

/** 创建 API Key */
export function postAuthApiKeys(client: ApiClient, data: CreateApiKeyRequest): Promise<unknown & Record<string, unknown>> {
  return client.post(`/identity/api/v1/auth/api-keys`, data);
}

/** 吊销 API Key */
export function deleteAuthApiKeysByApiKeys(client: ApiClient, apiKeyId: string): Promise<void> {
  return client.delete(`/identity/api/v1/auth/api-keys/${apiKeyId}`);
}

/** 获取 API Key 详情 */
export function getAuthApiKeysByApiKeys(client: ApiClient, apiKeyId: string): Promise<unknown & Record<string, unknown>> {
  return client.get(`/identity/api/v1/auth/api-keys/${apiKeyId}`);
}

/** 获取 API Key 审计日志 */
export function getAuthApiKeysAuditLogsByApiKeys(client: ApiClient, apiKeyId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<ApiKeyAuditLogResponse>> {
  return client.get(`/identity/api/v1/auth/api-keys/${apiKeyId}/audit-logs`, { params });
}

/** 添加 IP 限制 */
export function postAuthApiKeysIpRestrictionsByApiKeys(client: ApiClient, apiKeyId: string, data: AddIPRestrictionRequest): Promise<unknown & Record<string, unknown>> {
  return client.post(`/identity/api/v1/auth/api-keys/${apiKeyId}/ip-restrictions`, data);
}

/** 删除 IP 限制 */
export function deleteAuthApiKeysIpRestrictionsByApiKeysByIpRestrictions(client: ApiClient, apiKeyId: string, restrictionId: string): Promise<unknown & Record<string, unknown>> {
  return client.delete(`/identity/api/v1/auth/api-keys/${apiKeyId}/ip-restrictions/${restrictionId}`);
}

/** 轮换 API Key */
export function postAuthApiKeysRotateByApiKeys(client: ApiClient, apiKeyId: string): Promise<unknown & Record<string, unknown>> {
  return client.post(`/identity/api/v1/auth/api-keys/${apiKeyId}/rotate`);
}

/** 更新 API Key 权限范围 */
export function putAuthApiKeysScopesByApiKeys(client: ApiClient, apiKeyId: string, data: UpdateApiKeyScopesRequest): Promise<unknown & Record<string, unknown>> {
  return client.put(`/identity/api/v1/auth/api-keys/${apiKeyId}/scopes`, data);
}

/** 启用/禁用 API Key */
export function putAuthApiKeysStatusByApiKeys(client: ApiClient, apiKeyId: string, data: UpdateApiKeyStatusRequest): Promise<unknown & Record<string, unknown>> {
  return client.put(`/identity/api/v1/auth/api-keys/${apiKeyId}/status`, data);
}

/** 获取 API Key 使用统计 */
export function getAuthApiKeysUsageByApiKeys(client: ApiClient, apiKeyId: string): Promise<unknown & Record<string, unknown>> {
  return client.get(`/identity/api/v1/auth/api-keys/${apiKeyId}/usage`);
}

/** 获取 API Key 使用统计 */
export function getAuthApiKeysUsageStatsByApiKeys(client: ApiClient, apiKeyId: string): Promise<void> {
  return client.get(`/identity/api/v1/auth/api-keys/${apiKeyId}/usage-stats`);
}

/** 获取CAPTCHA挑战 */
export function getAuthCaptchaChallenge(client: ApiClient, params?: {
  provider?: "pow" | "turnstile" | "captcha3d";  // CAPTCHA提供商
}): Promise<void> {
  return client.get(`/identity/api/v1/auth/captcha/challenge`, { params });
}

/** 检查用户权限 */
export function postAuthCheckPermission(client: ApiClient, data: CheckPermissionRequest): Promise<PermissionCheckResponse> {
  return client.post(`/identity/api/v1/auth/check-permission`, data);
}

/** 检查用户角色 */
export function postAuthCheckRole(client: ApiClient, data: CheckRoleRequest): Promise<RoleCheckResponse> {
  return client.post(`/identity/api/v1/auth/check-role`, data);
}

/** 忘记密码 */
export function postAuthForgotPassword(client: ApiClient, data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  return client.post(`/identity/api/v1/auth/forgot-password`, data);
}

/** 生成一次性票据 */
export function postAuthGenerateTicket(client: ApiClient, data: GenerateTicketInput): Promise<GenerateTicketResponse> {
  return client.post(`/identity/api/v1/auth/generate-ticket`, data);
}

/** ID Token登录（未启用） */
export function postAuthIdTokenSignin(client: ApiClient, data: Record<string, unknown>): Promise<void> {
  return client.post(`/identity/api/v1/auth/id-token/signin`, data);
}

/** LDAP directory authentication */
export function postAuthLdapLogin(client: ApiClient, data: LdapLoginRequest): Promise<LdapLoginResponse> {
  return client.post(`/identity/api/v1/auth/ldap/login`, data);
}

/** 用户登录 */
export function postAuthLogin(client: ApiClient, data: LoginRequest): Promise<LoginResponse> {
  return client.post(`/identity/api/v1/auth/login`, data);
}

/** 邮箱验证码登录 */
export function postAuthLoginEmailCode(client: ApiClient, data: LoginByEmailCodeRequest): Promise<LoginByCodeResponse> {
  return client.post(`/identity/api/v1/auth/login/email-code`, data);
}

/** 手机验证码登录 */
export function postAuthLoginPhoneCode(client: ApiClient, data: LoginByPhoneCodeRequest): Promise<LoginByCodeResponse> {
  return client.post(`/identity/api/v1/auth/login/phone-code`, data);
}

/** 退出登录 */
export function postAuthLogout(client: ApiClient): Promise<void> {
  return client.post(`/identity/api/v1/auth/logout`);
}

/** 魔法链接回调 (GET→POST 双步跳转) */
export function getAuthMagicLinkCallback(client: ApiClient, params?: {
  token?: string;  // 魔法链接令牌 (GET)
}): Promise<void> {
  return client.get(`/identity/api/v1/auth/magic-link/callback`, { params });
}

/** 魔法链接回调 (GET→POST 双步跳转) */
export function postAuthMagicLinkCallback(client: ApiClient, params?: {
  token?: string;  // 魔法链接令牌 (GET)
}): Promise<void> {
  return client.post(appendQuery(`/identity/api/v1/auth/magic-link/callback`, params));
}

/** 请求发送魔法链接 */
export function postAuthMagicLinkRequest(client: ApiClient, data: RequestMagicLinkRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/magic-link/request`, data);
}

/** 停用当前账户 */
export function deleteAuthMe(client: ApiClient, data: DeactivateAccountRequest): Promise<DeactivateAccountResponse> {
  return client.delete(`/identity/api/v1/auth/me`);
}

/** 获取当前登录用户信息 */
export function getAuthMe(client: ApiClient): Promise<UserInfo> {
  return client.get(`/identity/api/v1/auth/me`);
}

/** 更新当前用户信息 */
export function putAuthMe(client: ApiClient, data: UpdateUserAuthRequest): Promise<UpdateCurrentUserAuthResponse> {
  return client.put(`/identity/api/v1/auth/me`, data);
}

/** 获取我的审计日志 */
export function getAuthMeAuditLogs(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  start_date?: string;  // 开始日期
  end_date?: string;  // 结束日期
  action?: string;  // 操作类型
  keyword?: string;  // 关键词（IP/设备/详情）
  status_class?: string;  // 状态语义筛选 success/failure
}): Promise<ApiListResult<AuditLogResponse>> {
  return client.get(`/identity/api/v1/auth/me/audit-logs`, { params });
}

export function getAuthMeAuthenticatorBackup(client: ApiClient): Promise<AuthenticatorBackupResponse> {
  return client.get(`/identity/api/v1/auth/me/authenticator/backup`);
}

export function postAuthMeAuthenticatorBackup(client: ApiClient, data: AuthenticatorBackupUploadRequest): Promise<AuthenticatorBackupResponse> {
  return client.post(`/identity/api/v1/auth/me/authenticator/backup`, data);
}

export function deleteAuthMeAuthenticatorBackupByBackup(client: ApiClient, backupId: string): Promise<SimpleResponse> {
  return client.delete(`/identity/api/v1/auth/me/authenticator/backup/${backupId}`);
}

export function getAuthMeAuthenticatorDevices(client: ApiClient): Promise<ApiListResult<AuthenticatorDeviceItem>> {
  return client.get(`/identity/api/v1/auth/me/authenticator/devices`);
}

/** 移除认证器设备 */
export function deleteAuthMeAuthenticatorDevicesByDevices(client: ApiClient, deviceId: string): Promise<SimpleResponse> {
  return client.delete(`/identity/api/v1/auth/me/authenticator/devices/${deviceId}`);
}

/** 获取儿童隐私同意状态 */
export function getAuthMeChildrenConsent(client: ApiClient): Promise<void> {
  return client.get(`/identity/api/v1/auth/me/children-consent`);
}

/** 撤销用户同意 */
export function deleteAuthMeConsent(client: ApiClient, params?: {
  scope?: string;  // request body
}): Promise<RevokeConsentResponse> {
  return client.delete(`/identity/api/v1/auth/me/consent`, params);
}

/** 记录用户同意 */
export function postAuthMeConsent(client: ApiClient, data: ConsentRequest): Promise<void> {
  return client.post(`/identity/api/v1/auth/me/consent`, data);
}

/** 获取同意历史记录 */
export function getAuthMeConsentHistory(client: ApiClient): Promise<ConsentHistoryResponse> {
  return client.get(`/identity/api/v1/auth/me/consent-history`);
}

/** 永久删除账户 (GDPR 被遗忘权/账户删除) */
export function postAuthMeDeleteAccount(client: ApiClient, data: DeleteAccountRequest): Promise<DeleteAccountResponse> {
  return client.post(`/identity/api/v1/auth/me/delete-account`, data);
}

/** 获取我的设备列表 */
export function getAuthMeDevices(client: ApiClient): Promise<ApiListResult<DeviceResponse>> {
  return client.get(`/identity/api/v1/auth/me/devices`);
}

/** 移除设备 */
export function deleteAuthMeDevicesByDevices(client: ApiClient, deviceId: string): Promise<SimpleResponse> {
  return client.delete(`/identity/api/v1/auth/me/devices/${deviceId}`);
}

/** 信任/取消信任设备 */
export function putAuthMeDevicesTrustByDevices(client: ApiClient, deviceId: string, data: SelfTrustDeviceRequest): Promise<SimpleResponse> {
  return client.put(`/identity/api/v1/auth/me/devices/${deviceId}/trust`, data);
}

/** 检查邮箱验证状态 */
export function getAuthMeEmailVerificationStatus(client: ApiClient): Promise<EmailStatusResponse> {
  return client.get(`/identity/api/v1/auth/me/email-verification-status`);
}

/** 变更邮箱地址 */
export function postAuthMeEmailChange(client: ApiClient, data: ChangeEmailRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/me/email/change`, data);
}

/** 取消邮箱变更 */
export function postAuthMeEmailChangeCancel(client: ApiClient): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/me/email/change/cancel`);
}

/** 验证邮箱变更 */
export function postAuthMeEmailVerify(client: ApiClient, data: VerifyChangeRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/me/email/verify`, data);
}

/** 导出我的数据 (GDPR DSAR) */
export function postAuthMeExportData(client: ApiClient): Promise<ExportMyDataResponse> {
  return client.post(`/identity/api/v1/auth/me/export-data`);
}

/** 获取我的租户成员状态 */
export function getAuthMeMemberships(client: ApiClient): Promise<ApiListResult<MembershipInfo>> {
  return client.get(`/identity/api/v1/auth/me/memberships`);
}

/** 修改当前用户密码 */
export function putAuthMePassword(client: ApiClient, data: HTTPChangePasswordRequest): Promise<ChangePasswordResponse> {
  return client.put(`/identity/api/v1/auth/me/password`, data);
}

/** 检查密码强度 */
export function postAuthMePasswordStrength(client: ApiClient, data: SelfServicePasswordStrengthRequest): Promise<PasswordStrengthResponse> {
  return client.post(`/identity/api/v1/auth/me/password-strength`, data);
}

/** 获取当前用户权限 */
export function getAuthMePermissions(client: ApiClient): Promise<MyPermissionsResponse> {
  return client.get(`/identity/api/v1/auth/me/permissions`);
}

/** 检查手机号验证状态 */
export function getAuthMePhoneVerificationStatus(client: ApiClient): Promise<PhoneStatusResponse> {
  return client.get(`/identity/api/v1/auth/me/phone-verification-status`);
}

/** 变更手机号 */
export function postAuthMePhoneChange(client: ApiClient, data: ChangePhoneRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/me/phone/change`, data);
}

/** 取消手机号变更 */
export function postAuthMePhoneChangeCancel(client: ApiClient): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/me/phone/change/cancel`);
}

/** 验证手机号变更 */
export function postAuthMePhoneVerify(client: ApiClient, data: VerifyChangeRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/me/phone/verify`, data);
}

/** 重新认证（step-up） */
export function postAuthMeReauthenticate(client: ApiClient, data: ReAuthenticateRequest): Promise<ReAuthenticateResponse> {
  return client.post(`/identity/api/v1/auth/me/reauthenticate`, data);
}

/** 获取恢复联系人列表 */
export function getAuthMeRecoveryContacts(client: ApiClient): Promise<ApiListResult<RecoveryContactResponse>> {
  return client.get(`/identity/api/v1/auth/me/recovery-contacts`);
}

/** 添加恢复联系人 */
export function postAuthMeRecoveryContacts(client: ApiClient, data: AddRecoveryContactRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/me/recovery-contacts`, data);
}

/** 移除恢复联系人 */
export function deleteAuthMeRecoveryContactsByRecoveryContacts(client: ApiClient, contactId: string): Promise<SimpleResponse> {
  return client.delete(`/identity/api/v1/auth/me/recovery-contacts/${contactId}`);
}

/** 验证恢复联系人 */
export function postAuthMeRecoveryContactsVerifyByRecoveryContacts(client: ApiClient, contactId: string, data: VerifyRecoveryContactRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/me/recovery-contacts/${contactId}/verify`, data);
}

/** 查询我的角色激活 */
export function getAuthMeRoleActivations(client: ApiClient): Promise<ActivationResponse[]> {
  return client.get(`/identity/api/v1/auth/me/role-activations`);
}

/** 请求角色激活 */
export function postAuthMeRoleActivations(client: ApiClient, data: RequestActivationRequest): Promise<ActivationResponse> {
  return client.post(`/identity/api/v1/auth/me/role-activations`, data);
}

/** 查询可申请的角色 */
export function getAuthMeRoleActivationsAvailableRoles(client: ApiClient): Promise<AvailableRoleResponse[]> {
  return client.get(`/identity/api/v1/auth/me/role-activations/available-roles`);
}

/** 获取SAML关联账户列表 */
export function getAuthMeSamlLinks(client: ApiClient): Promise<ApiListResult<SamlLinkedAccountInfo>> {
  return client.get(`/identity/api/v1/auth/me/saml-links`);
}

/** 解绑SAML关联账户 */
export function deleteAuthMeSamlLinksBySamlLinks(client: ApiClient, linkId: string): Promise<SimpleResponse> {
  return client.delete(`/identity/api/v1/auth/me/saml-links/${linkId}`);
}

/** 获取安全事件列表 */
export function getAuthMeSecurityEvents(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<SecurityEventResponse>> {
  return client.get(`/identity/api/v1/auth/me/security-events`, { params });
}

/** 关闭安全事件提醒 */
export function postAuthMeSecurityEventsDismissBySecurityEvents(client: ApiClient, eventId: string, data: SecurityEventDismissRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/me/security-events/${eventId}/dismiss`, data);
}

/** 登出所有会话 */
export function deleteAuthMeSessions(client: ApiClient): Promise<LogoutAllSessionsResponse> {
  return client.delete(`/identity/api/v1/auth/me/sessions`);
}

/** 获取我的会话列表 */
export function getAuthMeSessions(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<void> {
  return client.get(`/identity/api/v1/auth/me/sessions`, { params });
}

/** 登出指定会话 */
export function deleteAuthMeSessionsBySessions(client: ApiClient, sessionId: string): Promise<LogoutSessionResponse> {
  return client.delete(`/identity/api/v1/auth/me/sessions/${sessionId}`);
}

/** 结束模拟会话 */
export function postAuthMeStopImpersonation(client: ApiClient): Promise<StopImpersonationResponse> {
  return client.post(`/identity/api/v1/auth/me/stop-impersonation`);
}

/** 切换当前租户 */
export function postAuthMeSwitchTenant(client: ApiClient, data: SwitchTenantRequest): Promise<SwitchTenantResponse> {
  return client.post(`/identity/api/v1/auth/me/switch-tenant`, data);
}

/** 获取当前用户租户 */
export function getAuthMeTenants(client: ApiClient): Promise<MyTenantsResponse> {
  return client.get(`/identity/api/v1/auth/me/tenants`);
}

/** 查询验证跟踪状态 */
export function getAuthMeVerificationByVerification(client: ApiClient, trackingId: string): Promise<VerificationTrackingQueryResponse> {
  return client.get(`/identity/api/v1/auth/me/verification/${trackingId}`);
}

/** 获取已注册的Passkey列表 */
export function getAuthMeWebauthnCredentials(client: ApiClient): Promise<SimpleResponse> {
  return client.get(`/identity/api/v1/auth/me/webauthn-credentials`);
}

/** 删除Passkey */
export function deleteAuthMeWebauthnCredentialsByWebauthnCredentials(client: ApiClient, credentialId: string): Promise<SimpleResponse> {
  return client.delete(`/identity/api/v1/auth/me/webauthn-credentials/${credentialId}`);
}

/** 发送MFA挑战验证码 */
export function postAuthMfaSendCode(client: ApiClient, data: SendMFAChallengeCodeRequest): Promise<MFAChallengeCodeSentResponse> {
  return client.post(`/identity/api/v1/auth/mfa/send-code`, data);
}

/** 验证MFA挑战 */
export function postAuthMfaVerifyChallenge(client: ApiClient, data: VerifyMFAChallengeRequest): Promise<LoginResponse> {
  return client.post(`/identity/api/v1/auth/mfa/verify-challenge`, data);
}

/** 获取用户OAuth账号列表 */
export function getAuthOauthAccounts(client: ApiClient): Promise<void> {
  return client.get(`/identity/api/v1/auth/oauth/accounts`);
}

/** 绑定OAuth账号 */
export function postAuthOauthBind(client: ApiClient, data: BindOAuthRequest): Promise<void> {
  return client.post(`/identity/api/v1/auth/oauth/bind`, data);
}

/** 获取OAuth提供商列表 */
export function getAuthOauthProviders(client: ApiClient): Promise<void> {
  return client.get(`/identity/api/v1/auth/oauth/providers`);
}

/** 获取OAuth提供者健康状态 */
export function getAuthOauthProvidersHealth(client: ApiClient): Promise<OAuthProviderHealthResponse> {
  return client.get(`/identity/api/v1/auth/oauth/providers/health`);
}

/** 解绑OAuth账号 */
export function postAuthOauthUnbind(client: ApiClient, data: UnbindOAuthRequest): Promise<void> {
  return client.post(`/identity/api/v1/auth/oauth/unbind`, data);
}

/** 发起OAuth登录 */
export function getAuthOauthByOauth(client: ApiClient, provider: string): Promise<void> {
  return client.get(`/identity/api/v1/auth/oauth/${provider}`);
}

/** OAuth回调 */
export function getAuthOauthCallbackByOauth(client: ApiClient, provider: string, params?: {
  code: string;  // 鎺堟潈鐮?
  state: string;  // 状态参数
}): Promise<OAuthCallbackResponse> {
  return client.get(`/identity/api/v1/auth/oauth/${provider}/callback`, { params });
}

/** OIDC后通道登出 */
export function postAuthOidcBackchannelLogout(client: ApiClient, data: BackchannelLogoutRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/oidc/backchannel-logout`, data);
}

/** RP发起登出 */
export function postAuthOidcLogout(client: ApiClient, params?: {
  id_token_hint?: string;  // ID Token提示
  post_logout_redirect_uri?: string;  // 登出后重定向URI
  state?: string;  // 状态参数
}): Promise<SimpleResponse> {
  return client.post(appendQuery(`/identity/api/v1/auth/oidc/logout`, params));
}

/** OIDC会话状态iframe */
export function getAuthOidcSessionIframe(client: ApiClient): Promise<string> {
  return client.get(`/identity/api/v1/auth/oidc/session-iframe`);
}

/** 取消二维码登录 */
export function postAuthQrLoginCancel(client: ApiClient, data: QrLoginCancelRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/qr-login/cancel`, data);
}

/** 确认二维码登录 */
export function postAuthQrLoginConfirm(client: ApiClient, data: QrLoginConfirmRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/qr-login/confirm`, data);
}

/** 发起二维码登录 */
export function postAuthQrLoginInitiate(client: ApiClient, data: QrLoginInitiateRequest): Promise<QrLoginInitiateResponse> {
  return client.post(`/identity/api/v1/auth/qr-login/initiate`, data);
}

/** 扫描二维码登录 */
export function postAuthQrLoginScan(client: ApiClient, data: QrLoginScanRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/qr-login/scan`, data);
}

/** 查询二维码登录状态 */
export function getAuthQrLoginStatus(client: ApiClient, params?: {
  token: string;  // 会话令牌
}): Promise<QrLoginStatusResponse> {
  return client.get(`/identity/api/v1/auth/qr-login/status`, { params });
}

/** 重新认证（step-up） */
export function postAuthReAuthenticate(client: ApiClient, data: ReAuthenticateRequest): Promise<ReAuthenticateResponse> {
  return client.post(`/identity/api/v1/auth/re-authenticate`, data);
}

/** 通过恢复联系人初始化账户恢复 */
export function postAuthRecoverAccount(client: ApiClient, data: RecoverAccountRequest): Promise<RecoverAccountResponse> {
  return client.post(`/identity/api/v1/auth/recover-account`, data);
}

/** 通过恢复码重置密码 */
export function postAuthRecoverAccountReset(client: ApiClient, data: RecoverAccountResetRequest): Promise<RecoverAccountResetResponse> {
  return client.post(`/identity/api/v1/auth/recover-account/reset`, data);
}

/** 完成账户恢复 */
export function postAuthRecoveryComplete(client: ApiClient, data: CompleteAccountRecoveryRequest): Promise<CompleteAccountRecoveryResponse> {
  return client.post(`/identity/api/v1/auth/recovery/complete`, data);
}

/** 发起账户恢复 */
export function postAuthRecoveryRequest(client: ApiClient, data: RequestAccountRecoveryRequest): Promise<RequestAccountRecoveryResponseWrapper> {
  return client.post(`/identity/api/v1/auth/recovery/request`, data);
}

/** 验证账户恢复码 */
export function postAuthRecoveryVerify(client: ApiClient, data: VerifyAccountRecoveryRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/recovery/verify`, data);
}

/** 刷新访问令牌 */
export function postAuthRefresh(client: ApiClient, data: RefreshTokenRequest): Promise<LoginResponse> {
  return client.post(`/identity/api/v1/auth/refresh`, data);
}

/** 用户注册 */
export function postAuthRegister(client: ApiClient, data: RegisterRequest): Promise<RegisterResponse> {
  return client.post(`/identity/api/v1/auth/register`, data);
}

/** 检查邮箱是否可用 */
export function getAuthRegisterCheckEmail(client: ApiClient, data: CheckEmailRequest, params?: {
  email?: string;  // 邮箱地址（GET方式）
}): Promise<CheckEmailResponse> {
  return client.get(`/identity/api/v1/auth/register/check-email`, { params });
}

/** 检查邮箱是否可用 */
export function postAuthRegisterCheckEmail(client: ApiClient, data: CheckEmailRequest, params?: {
  email?: string;  // 邮箱地址（GET方式）
}): Promise<CheckEmailResponse> {
  return client.post(appendQuery(`/identity/api/v1/auth/register/check-email`, params), data);
}

/** 检查用户名是否可用 */
export function getAuthRegisterCheckUsername(client: ApiClient, data: CheckUsernameRequest, params?: {
  username?: string;  // 用户名（GET方式）
  tenant_id?: string;  // 目标租户（地址栏租户优先）
}): Promise<CheckUsernameResponse> {
  return client.get(`/identity/api/v1/auth/register/check-username`, { params });
}

/** 检查用户名是否可用 */
export function postAuthRegisterCheckUsername(client: ApiClient, data: CheckUsernameRequest, params?: {
  username?: string;  // 用户名（GET方式）
  tenant_id?: string;  // 目标租户（地址栏租户优先）
}): Promise<CheckUsernameResponse> {
  return client.post(appendQuery(`/identity/api/v1/auth/register/check-username`, params), data);
}

/** 邮箱验证码注册 */
export function postAuthRegisterEmailCode(client: ApiClient, data: RegisterByEmailCodeRequest): Promise<LoginByCodeResponse> {
  return client.post(`/identity/api/v1/auth/register/email-code`, data);
}

/** 邀请注册 */
export function postAuthRegisterInvitation(client: ApiClient, data: RegisterByInvitationRequest): Promise<LoginResponse> {
  return client.post(`/identity/api/v1/auth/register/invitation`, data);
}

/** OAuth补充注册 */
export function postAuthRegisterOauth(client: ApiClient, data: RegisterByOAuthRequest): Promise<LoginByCodeResponse> {
  return client.post(`/identity/api/v1/auth/register/oauth`, data);
}

/** 手机验证码注册 */
export function postAuthRegisterPhoneCode(client: ApiClient, data: RegisterByPhoneCodeRequest): Promise<LoginByCodeResponse> {
  return client.post(`/identity/api/v1/auth/register/phone-code`, data);
}

/** 重新申请注册 */
export function postAuthRegisterReapply(client: ApiClient, data: ReapplyRegistrationRequest): Promise<ReapplyRegistrationResponse> {
  return client.post(`/identity/api/v1/auth/register/reapply`, data);
}

/** 重新发送短信验证码 */
export function postAuthResendSmsCode(client: ApiClient, data: ResendSMSCodeRequest): Promise<PhoneVerificationResponse> {
  return client.post(`/identity/api/v1/auth/resend-sms-code`, data);
}

/** 重新发送邮箱验证邮件 */
export function postAuthResendVerificationEmail(client: ApiClient, data: ResendVerificationEmailRequest): Promise<EmailVerificationResponse> {
  return client.post(`/identity/api/v1/auth/resend-verification-email`, data);
}

/** 重置密码 */
export function postAuthResetPassword(client: ApiClient, data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  return client.post(`/identity/api/v1/auth/reset-password`, data);
}

/** 发送短信验证码 */
export function postAuthSendSmsCode(client: ApiClient, data: SendSMSCodeRequest): Promise<PhoneVerificationResponse> {
  return client.post(`/identity/api/v1/auth/send-sms-code`, data);
}

/** 发送邮箱验证邮件 */
export function postAuthSendVerificationEmail(client: ApiClient, data: SendVerificationEmailRequest): Promise<EmailVerificationResponse> {
  return client.post(`/identity/api/v1/auth/send-verification-email`, data);
}

/** 票据签名登录 */
export function postAuthTicketSignin(client: ApiClient, data: TicketSigninRequest): Promise<LoginResponse> {
  return client.post(`/identity/api/v1/auth/ticket/signin`, data);
}

/** 验证邮箱地址 */
export function postAuthVerifyEmail(client: ApiClient, data: VerifyEmailRequest): Promise<EmailVerifiedResponse> {
  return client.post(`/identity/api/v1/auth/verify-email`, data);
}

/** 验证手机号 */
export function postAuthVerifyPhone(client: ApiClient, data: VerifyPhoneRequest): Promise<PhoneVerifiedResponse> {
  return client.post(`/identity/api/v1/auth/verify-phone`, data);
}

/** 验证重置验证码 */
export function postAuthVerifyResetCode(client: ApiClient, data: VerifyResetCodeRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/verify-reset-code`, data);
}

/** 验证Web3钱包签名 */
export function postAuthWeb3Verify(client: ApiClient, data: Web3VerifyRequest): Promise<Web3VerifyResponse> {
  return client.post(`/identity/api/v1/auth/web3/verify`, data);
}

/** 开始Passkey公开认证 */
export function postAuthWebauthnAuthenticateBegin(client: ApiClient, data: PasskeyAuthBeginRequest): Promise<WebAuthnLoginResponse> {
  return client.post(`/identity/api/v1/auth/webauthn/authenticate/begin`, data);
}

/** 完成Passkey公开认证 */
export function postAuthWebauthnAuthenticateComplete(client: ApiClient, data: PasskeyAuthenticateCompleteRequest): Promise<void> {
  return client.post(`/identity/api/v1/auth/webauthn/authenticate/complete`, data);
}

/** 开始Passkey登录 */
export function postAuthWebauthnLoginBegin(client: ApiClient, data: BeginLoginRequest): Promise<WebAuthnLoginResponse> {
  return client.post(`/identity/api/v1/auth/webauthn/login/begin`, data);
}

/** 完成Passkey登录 */
export function postAuthWebauthnLoginComplete(client: ApiClient, data: CompleteLoginRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/webauthn/login/complete`, data);
}

/** 开始Passkey注册 */
export function postAuthWebauthnRegisterBegin(client: ApiClient, data: BeginRegistrationRequest): Promise<WebAuthnRegistrationResponse> {
  return client.post(`/identity/api/v1/auth/webauthn/register/begin`, data);
}

/** 完成Passkey注册 */
export function postAuthWebauthnRegisterComplete(client: ApiClient, data: CompleteRegistrationRequest): Promise<SimpleResponse> {
  return client.post(`/identity/api/v1/auth/webauthn/register/complete`, data);
}

/** 移除所有设备 */
export function deleteDevices(client: ApiClient, params?: {
  except_current?: boolean;  // 是否排除当前设备
}): Promise<void> {
  return client.delete(`/identity/api/v1/devices`, params);
}

/** 获取用户设备列表 */
export function getDevices(client: ApiClient): Promise<ApiListResult<DeviceResponse>> {
  return client.get(`/identity/api/v1/devices`);
}

/** 移除设备 */
export function deleteDevicesByDevices(client: ApiClient, deviceId: string): Promise<void> {
  return client.delete(`/identity/api/v1/devices/${deviceId}`);
}

/** 信任/取消信任设备 */
export function putDevicesTrustByDevices(client: ApiClient, deviceId: string, data: TrustDeviceRequest): Promise<SimpleResponse> {
  return client.put(`/identity/api/v1/devices/${deviceId}/trust`, data);
}

/** List User Devices */
export function getIots(client: ApiClient, params?: {
  status?: string;  // 状态过滤
  workload_subtype?: string;  // 工作负载子类型
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<DeviceInfo>> {
  return client.get(`/identity/api/v1/iots`, { params });
}

/** Pair Device */
export function postIotsPair(client: ApiClient, data: PairDeviceRequest): Promise<DeviceInfo> {
  return client.post(`/identity/api/v1/iots/pair`, data);
}

/** Unpair Device */
export function deleteIotsByIots(client: ApiClient, iotId: string): Promise<SimpleResponse> {
  return client.delete(`/identity/api/v1/iots/${iotId}`);
}

/** List Family Members */
export function getIotsFamilyAccessByIots(client: ApiClient, iotId: string): Promise<ApiListResult<FamilyMemberInfo>> {
  return client.get(`/identity/api/v1/iots/${iotId}/family-access`);
}

/** Add Family Member */
export function postIotsFamilyAccessByIots(client: ApiClient, iotId: string, data: AddFamilyMemberRequest): Promise<FamilyMemberInfo> {
  return client.post(`/identity/api/v1/iots/${iotId}/family-access`, data);
}

/** Remove Family Member */
export function deleteIotsFamilyAccessByIotsByFamilyAccess(client: ApiClient, iotId: string, memberId: string): Promise<SimpleResponse> {
  return client.delete(`/identity/api/v1/iots/${iotId}/family-access/${memberId}`);
}

/** Transfer Device */
export function postIotsTransferByIots(client: ApiClient, iotId: string, data: TransferDeviceRequest): Promise<DeviceInfo> {
  return client.post(`/identity/api/v1/iots/${iotId}/transfer`, data);
}

/** 根据域名获取租户认证配置（公开） */
export function getPublicAuthConfigByDomainByByDomain(client: ApiClient, domain: string): Promise<PublicAuthConfigResponse> {
  return client.get(`/identity/api/v1/public/auth-config/by-domain/${domain}`);
}

/** 根据租户标识获取认证配置（公开） */
export function getPublicAuthConfigBySlugByBySlug(client: ApiClient, slug: string): Promise<PublicAuthConfigResponse> {
  return client.get(`/identity/api/v1/public/auth-config/by-slug/${slug}`);
}

/** 获取租户认证配置（公开） */
export function getPublicAuthConfigByAuthConfig(client: ApiClient, tenantId: string): Promise<PublicAuthConfigResponse> {
  return client.get(`/identity/api/v1/public/auth-config/${tenantId}`);
}

/** ECDH 密钥交换 */
export function getPublicKeyExchange(client: ApiClient): Promise<KeyExchangeResponse> {
  return client.get(`/identity/api/v1/public/key-exchange`);
}

/** 检查密码强度（公开） */
export function postPublicPasswordStrength(client: ApiClient, data: CheckPublicPasswordStrengthRequest): Promise<PasswordStrengthResponse> {
  return client.post(`/identity/api/v1/public/password-strength`, data);
}

/** 发现公开可加入的租户 */
export function getPublicTenantsDiscover(client: ApiClient): Promise<DiscoverTenantInfo[]> {
  return client.get(`/identity/api/v1/public/tenants/discover`);
}

