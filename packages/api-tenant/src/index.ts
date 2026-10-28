/**
 * @autional/api-tenant — Auto-generated from tenant-service swagger.json
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

export interface OrgChartNode {
  id?: string;
  name?: string;
  parentId?: string;
}

export interface TenantStats {
  active?: number;
  byPlan?: Record<string, number>;
  inactive?: number;
  pending?: number;
  suspended?: number;
  total?: number;
}

export interface TenantStatsResult {
  stats?: TenantStats;
}

export type WebhookBackoffStrategy = "linear" | "exponential";

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

/** 接受租户邀请 */
export interface AcceptInvitationRequest {
  tenantId?: string;  // TenantID 可选：非空时校验与邀请租户一致（AUTH-11/A7）
  userId: string;
}

/** 接受邀请后的租户信息 */
export interface AcceptInvitationResponse {
  acceptedAt?: string;
  memberId?: string;
  role?: string;
  tenantId?: string;
  tenantName?: string;
}

/** 添加租户自定义域名请求参数 */
export interface AddDomainRequest {
  domain: string;  // 域名
  isPrimary?: boolean;  // 是否主域名
}

/** 添加租户成员请求参数 */
export interface AddMemberRequest {
  departmentId?: string;  // 部门ID
  role?: string;  // 角色
  userId: string;  // 用户ID
}

export interface ApiKeyResponse {
  createdAt?: string;
  expiresAt?: string;
  id?: string;
  keyPrefix?: string;
  lastUsedAt?: string;
  name?: string;
  scope?: string;
  status?: string;
}

/** 应用默认角色详情 */
export interface AppDefaultRoleResponse {
  applicationId?: string;
  createdAt?: string;
  description?: string;
  id?: string;
  isSystem?: boolean;
  order?: number;
  permissions?: string[];
  role?: string;
  tenantId?: string;
  updatedAt?: string;
}

export interface AppQuotaResultResponse {
  allowed?: boolean;
  appId?: string;
  current?: number;
  limit?: number;
  message?: string;
  remaining?: number;
  requested?: number;
}

export interface AppSecuritySettings {
  appId?: string;
  maxConcurrentSessions?: number;
  requireMfa?: boolean;
  sessionTimeout?: number;
}

/** 应用详情 */
export interface ApplicationResponse {
  adminUrl?: string;
  category?: string;
  code?: string;
  createdAt?: string;
  description?: string;
  entryUrl?: string;
  iconUrl?: string;
  id?: string;
  isDefault?: boolean;
  isPlatform?: boolean;
  logoUrl?: string;
  maxConcurrentSessions?: number;
  maxUsers?: number;
  name?: string;
  order?: number;
  requireMfa?: boolean;
  sessionTimeout?: number;
  status?: string;
  tenantId?: string;
  Type?: string;
  updatedAt?: string;
  version?: string;
}

export interface ApplicationTypeResponse {
  code?: string;
  createdAt?: string;
  description?: string;
  id?: string;
  name?: string;
  tenantId?: string;
  updatedAt?: string;
}

export interface ApproveMemberRequest {
  message?: string;
  role?: string;
}

/** 为用户在应用中分配角色 */
export interface AssignUserAppRoleRequest {
  expiresAt?: string;
  permissions?: string[];
  role: string;
  userId: string;
}

export interface AuthPolicyResponse {
  captchaEnabled?: boolean;
  changeCooldownMinutes?: number;
  checkBreachedPasswords?: boolean;
  crossTenantSwitchEnabled?: boolean;
  deviceFingerprintEnabled?: boolean;
  deviceTrustDurationHours?: number;
  expiryDays?: number;
  forceChangeOnFirstLogin?: boolean;
  gracePeriodDays?: number;
  historyCount?: number;
  lockoutAttempts?: number;
  lockoutDurationMinutes?: number;
  loginMethods?: string;
  magicLinkEnabled?: boolean;
  maxConcurrentSessions?: number;
  maxDevicesPerUser?: number;
  maxLength?: number;
  mfaEnabled?: boolean;
  mfaEnforceForAll?: boolean;
  mfaEnforceForHighRisk?: boolean;
  mfaEnforceForNewDevice?: boolean;
  mfaMethods?: string;
  mfaPreferredMethods?: string;
  mfaRequiredUserRole?: string;
  minLength?: number;
  oauthProviders?: string;
  otpCodeLength?: number;
  otpEmailTtlMinutes?: number;
  otpMaxAttempts?: number;
  otpSmsTtlMinutes?: number;
  passkeyEnabled?: boolean;
  passkeyMaxCredentials?: number;
  passkeyUserVerification?: string;
  passwordTransmission?: string;
  pepperEnabled?: boolean;
  refreshTokenRotation?: boolean;
  rememberMeDays?: number;
  requireDigits?: boolean;
  requireLowercase?: boolean;
  requireSpecialChars?: boolean;
  requireUppercase?: boolean;
  sessionBindToDevice?: boolean;
  sessionIdleTimeout?: string;
  sessionTimeout?: string;
  silentChallengeEnabled?: boolean;
  ssoProviders?: string;
  tenantId?: string;
  web3Enabled?: boolean;
}

export interface BatchApproveRequest {
  memberIds: string[];
  role?: string;
}

export interface BatchApproveResultResponse {
  failed?: number;
  succeeded?: number;
}

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

/** 租户品牌定制配置 */
export interface BrandingResponse {
  companyName?: string;  // 公司名称
  createdAt?: string;  // 创建时间
  customCss?: string;  // 自定义CSS
  emailSenderAddress?: string;  // 邮件发送者地址
  emailSenderName?: string;  // 邮件发送者名称
  faviconUrl?: string;  // Favicon URL
  loginPageDescription?: string;  // 登录页描述
  loginPageTitle?: string;  // 登录页标题
  logoUrl?: string;  // Logo URL
  primaryColor?: string;  // 主题色
  privacyPolicyUrl?: string;  // 隐私政策URL
  secondaryColor?: string;  // 辅助色
  tenantId?: string;  // 租户ID
  termsOfServiceUrl?: string;  // 服务条款URL
  updatedAt?: string;  // 更新时间
}

/** 批量导入成员单项 */
export interface BulkImportMemberItem {
  email: string;  // 邮箱
  role?: string;  // 角色
}

/** 批量导入租户成员请求参数 */
export interface BulkImportMembersRequest {
  members: BulkImportMemberItem[];  // 成员列表
}

/** 配额检查结果 */
export interface CheckQuotaResponse {
  allowed?: boolean;  // 是否允许
  currentUsage?: number;  // 当前使用量
  limit?: number;  // 上限
  message?: string;  // 消息
}

export interface CreateApiKeyRequest {
  name: string;
  scope?: string;
}

export interface CreateApiKeyResponse {
  apiKey?: string;
  createdAt?: string;
  id?: string;
  keyPrefix?: string;
  message?: string;
  name?: string;
  scope?: string;
}

/** 创建应用默认角色模板 */
export interface CreateAppDefaultRoleRequest {
  description?: string;
  isSystem?: boolean;
  order?: number;
  permissions?: string[];
  role: string;
}

/** 创建新应用请求参数 */
export interface CreateApplicationRequest {
  adminUrl?: string;
  category?: string;
  code?: string;
  description?: string;
  entryUrl?: string;
  iconUrl?: string;
  isDefault?: boolean;
  logoUrl?: string;
  maxConcurrentSessions?: number;
  maxUsers?: number;
  name: string;
  order?: number;
  requireMfa?: boolean;
  sessionTimeout?: number;
  Type?: string;
  version?: string;
}

/** 创建租户部门的请求参数 */
export interface CreateDepartmentRequest {
  code?: string;  // 部门编码
  managerId?: string;  // 负责人ID
  name: string;  // 部门名称
  parentId?: string;  // 父部门ID
}

/** 创建新租户请求参数 */
export interface CreateTenantRequest {
  displayName: string;  // 显示名称
  domain?: string;  // 域名
  name: string;  // 租户名称
  ownerId: string;  // 所有者ID
  plan?: string;  // 订阅计划
}

export interface CreateWebhookRequest {
  backoffStrategy?: WebhookBackoffStrategy;
  events?: string[];
  headers?: Record<string, string>;
  maxRetries?: number;
  secret?: string;
  timeoutSecs?: number;
  url?: string;
}

/** 数据分类项 */
export interface DataClassification {
  color?: string;  // 颜色
  description?: string;  // 描述
  label?: string;  // 标签
  level?: string;  // 级别
}

/** 租户数据分类分级配置 */
export interface DataClassificationResponse {
  classifications?: DataClassification[];  // 分类列表
  tenantId?: string;  // 租户ID
  updatedAt?: string;  // 更新时间
}

/** 租户部门信息 */
export interface DepartmentResponse {
  code?: string;  // 部门编码
  createdAt?: string;  // 创建时间
  departmentId?: string;  // 部门ID
  managerId?: string;  // 负责人ID
  membersCount?: number;  // 成员数量
  name?: string;  // 部门名称
  parentId?: string;  // 父部门ID
  tenantId?: string;  // 租户ID
}

/** 租户自定义域名信息 */
export interface DomainResponse {
  createdAt?: string;  // 创建时间
  domain?: string;  // 域名
  isPrimary?: boolean;  // 是否主域名
  status?: string;  // 状态枚举（pending/verified/failed）
  tenantId?: string;  // 租户ID
  verified?: boolean;  // 是否验证（兼容布尔投影）
}

export interface EraseUserRequest {
  userId?: string;
}

export interface EventSchemaResponse {
  action?: string;
  description?: string;
  domain?: string;
  eventType?: string;
  example?: unknown;
}

export interface EventTypeListResponse {
  items?: EventTypeResponse[];
}

export interface EventTypeResponse {
  action?: string;
  domain?: string;
  eventType?: string;
}

export interface InternalValidateApiKeyRequest {
  apiKey: string;
}

export interface InternalValidateApiKeyResponse {
  name?: string;
  scope?: string;
  tenantId?: string;
  valid?: boolean;
}

export interface InvitationCodeResponse {
  code?: string;
  createdAt?: string;
  createdBy?: string;
  expiresAt?: string;
  id?: string;
  maxUses?: number;
  status?: string;
  tenantId?: string;
  usedCount?: number;
}

export interface InvitationConfigResponse {
  defaultInviteRole?: string;
  inviteExpiryDays?: number;
  tenantId?: string;
}

/** 租户邀请信息 */
export interface InvitationResponse {
  createdAt?: string;
  email?: string;
  expiresAt?: string;
  invitationId?: string;
  inviterId?: string;
  role?: string;
  status?: string;
  tenantId?: string;
  updatedAt?: string;
}

/** 邀请成员加入租户请求参数 */
export interface InviteMemberRequest {
  departmentId?: string;  // 部门ID
  email: string;  // 邮箱
  role?: string;  // 角色
  sendEmail?: boolean;  // 发送邮件
}

/** 租户成员信息 */
export interface MemberResponse {
  departmentId?: string;  // 部门ID
  joinedAt?: string;  // 加入时间
  role?: string;  // 角色
  status?: string;  // 状态
  tenantId?: string;  // 租户ID
  userId?: string;  // 用户ID
}

/** 检查用户是否为租户成员的结果 */
export interface MembershipCheckResponse {
  isMember?: boolean;
  role?: string;
  status?: string;
}

export interface MinorsProtectionConfigResponse {
  childDefaultMaxPrivacy?: boolean;
  contentFilterEnabled?: boolean;
  dailyUsageLimitMin?: number;
  digitalConsentAge?: number;
  liveStreamBlockedUnder16?: boolean;
  minorDataRetentionDays?: number;
  minorsAgeThreshold?: number;
  monthlySpendLimit?: number;
  nightModeEnabled?: boolean;
  nightModeEnd?: string;
  nightModeStart?: string;
  tenantId?: string;
}

export interface MintInvitationCodesRequest {
  count: number;
  expiresAt?: string;  // 缺省/null = 永不过期
  maxUses?: number;
}

export interface MintInvitationCodesResponse {
  codes?: InvitationCodeResponse[];
  count?: number;
  message?: string;
}

export interface OAuthClientWriteRequest {
  force?: boolean;
  oauthClientId: string;
}

export interface OAuthClientWriteResponse {
  oauthClientId?: string;
  tenantId?: string;
  unchanged?: boolean;
}

/** 密码策略详细配置 */
export interface PasswordPolicyConfig {
  maxLength?: number;  // 最大长度
  minLength?: number;  // 最小长度
  requireDigit?: boolean;  // 要求数字
  requireLowercase?: boolean;  // 要求小写字母
  requireSpecial?: boolean;  // 要求特殊字符
  requireUppercase?: boolean;  // 要求大写字母
}

export interface PendingMemberResponse {
  daysRemaining?: number;
  expiresAt?: string;
  memberId?: string;
  reason?: string;
  requestedAt?: string;
  requestedRole?: string;
  userId?: string;
}

export interface PublicAuthPolicy {
  breachCheckEnabled?: boolean;
  captchaEnabled?: boolean;
  crossTenantSwitchEnabled?: boolean;
  loginMethods?: string[];
  magicLinkEnabled?: boolean;
  maxConcurrentSessions?: number;
  mfaEnforceForAll?: boolean;
  mfaMethods?: string[];
  oauthProviders?: string[];
  passkeyEnabled?: boolean;
  ssoProviders?: string[];
}

export interface PublicSecurityPolicy {
  lockoutAttempts?: number;
  maxLength?: number;
  minLength?: number;
  passwordTransmission?: string;
  requireDigit?: boolean;
  requireLower?: boolean;
  requireSpecial?: boolean;
  requireUpper?: boolean;
  unicodeAllowed?: boolean;
}

export interface PublicTenantBranding {
  companyName?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  slug?: string;
}

export interface PublicTenantDetailResponse {
  authPolicy?: PublicAuthPolicy;
  branding?: BrandingInfo;
  securityPolicy?: PublicSecurityPolicy;
  tenant?: PublicTenantInfo;
}

export interface PublicTenantInfo {
  displayName?: string;
  domain?: string;
  featured?: boolean;  // Featured 运营精选标记（品牌选择页默认展示位）。additive：无 omitempty， 避免字段是否存在随值变化（auth 消费者忽略未知字段，零影响）。
  featuredSort?: number;
  id?: string;
  membershipApproval?: string;
  name?: string;
}

export interface PublicTenantResponse {
  displayName?: string;
  id?: string;
  name?: string;
}

export interface RegisterTrialTenantRequest {
  adminEmail: string;
  adminPassword: string;
  agreementAccepted?: boolean;
  agreementVersion?: string;
  displayName?: string;
  invitationCode?: string;
  name: string;
}

export interface RejectMemberRequest {
  reason: string;
}

/** 租户资源配额信息 */
export interface ResourceQuotaResponse {
  activeUsers?: number;  // 活跃用户数
  apiCallsPerMonth?: number;  // API调用上限
  storageGb?: number;  // 存储上限
  tenantId?: string;  // 租户ID
  usedApiCalls?: number;  // 已用API调用
  usedStorageGb?: number;  // 已用存储
  usersLimit?: number;  // 用户上限
}

export interface RotateApiKeyResponse {
  apiKey?: string;
  createdAt?: string;
  id?: string;
  keyPrefix?: string;
  message?: string;
}

export interface RotateSecretResponse {
  secret?: string;
}

/** 租户安全策略配置（与 UpdateSecurityPolicyRequest 字段对称：PUT 可写字段 GET 全量回读） */
export interface SecurityPolicyResponse {
  allowedIpRanges?: string[];  // 允许的IP范围
  blockedCountries?: string[];  // 屏蔽的国家
  lockDuration?: string;  // 锁定时长（duration 字符串）
  maxAttemptsPerUser?: number;  // 最大尝试次数
  mfaRequired?: boolean;  // 强制MFA
  passwordPolicy?: PasswordPolicyConfig;  // 密码策略
  sessionPolicy?: SessionPolicyConfig;  // 会话策略
  tenantId?: string;  // 租户ID
}

/** 会话策略详细配置 */
export interface SessionPolicyConfig {
  maxConcurrentSessions?: number;  // 最大并发会话数
  timeoutSeconds?: number;  // 会话超时（秒）
}

/** 暂停应用参数 */
export interface SuspendApplicationRequest {
  reason?: string;
}

export interface TenantFeaturedResponse {
  featured?: boolean;
  featuredSort?: number;
  tenantId?: string;
}

export interface TenantInfo {
  brandCustomCss?: string;
  brandFaviconUrl?: string;
  brandLogoUrl?: string;
  brandPrimaryColor?: string;
  displayName?: string;  // 显示名称
  id?: string;  // 租户ID
  membershipApproval?: string;  // 成员加入方式: open/approval_required/invitation_only
  name?: string;  // 租户名称
  status?: string;  // 租户状态: active/inactive/suspended/pending
}

/** 租户概览统计信息（成员数、应用数等） */
export interface TenantOverviewResponse {
  activeAppCount?: number;
  appCount?: number;
  maxUsers?: number;
  memberCount?: number;
  tenantId?: string;
}

/** 租户详细信息 */
export interface TenantResponse {
  brandCustomCss?: string;
  brandFaviconUrl?: string;
  brandLogoUrl?: string;
  brandPrimaryColor?: string;
  createdAt?: string;  // 创建时间
  displayName?: string;  // 显示名称
  domain?: string;  // 域名
  id?: string;  // 租户ID
  maxApiRequests?: number;  // API请求上限
  maxBandwidth?: number;  // 带宽上限(bytes/month)
  maxStorage?: number;  // 存储上限(bytes)
  maxUsers?: number;  // 用户上限
  memberCount?: number;  // 成员数（仅列表端点回填；disabled 不计，口径同成员列表）
  name?: string;  // 租户名称（用作 URL slug）
  ownerId?: string;  // 所有者ID
  plan?: string;  // 订阅计划
  status?: string;  // 状态
  trial?: boolean;  // 是否试用租户
  trialExpiresAt?: string;  // 试用到期时间（RFC3339；非试用省略）
  updatedAt?: string;  // 更新时间
}

/** 更新应用默认角色模板 */
export interface UpdateAppDefaultRoleRequest {
  description?: string;
  isSystem?: boolean;
  order?: number;
  permissions?: string[];
  role?: string;
}

/** 更新应用参数 */
export interface UpdateApplicationRequest {
  adminUrl?: string;
  category?: string;
  description?: string;
  entryUrl?: string;
  iconUrl?: string;
  isDefault?: boolean;
  logoUrl?: string;
  maxConcurrentSessions?: number;
  maxUsers?: number;
  name?: string;
  order?: number;
  requireMfa?: boolean;
  sessionTimeout?: number;
  Type?: string;
  version?: string;
}

export interface UpdateAuthPolicyRequest {
  captchaEnabled?: boolean;
  changeCooldownMinutes?: number;
  checkBreachedPasswords?: boolean;
  crossTenantSwitchEnabled?: boolean;
  deviceFingerprintEnabled?: boolean;
  deviceTrustDurationHours?: number;
  expiryDays?: number;
  forceChangeOnFirstLogin?: boolean;
  gracePeriodDays?: number;
  historyCount?: number;
  lockoutAttempts?: number;
  lockoutDurationMinutes?: number;
  loginMethods?: string;
  magicLinkEnabled?: boolean;
  maxConcurrentSessions?: number;
  maxDevicesPerUser?: number;
  maxLength?: number;
  mfaEnabled?: boolean;
  mfaEnforceForAll?: boolean;
  mfaEnforceForHighRisk?: boolean;
  mfaEnforceForNewDevice?: boolean;
  mfaMethods?: string;
  mfaPreferredMethods?: string;
  mfaRequiredUserRole?: string;
  minLength?: number;
  oauthProviders?: string;
  otpCodeLength?: number;
  otpEmailTtlMinutes?: number;
  otpMaxAttempts?: number;
  otpSmsTtlMinutes?: number;
  passkeyEnabled?: boolean;
  passkeyMaxCredentials?: number;
  passkeyUserVerification?: string;
  passwordTransmission?: string;
  pepperEnabled?: boolean;
  refreshTokenRotation?: boolean;
  rememberMeDays?: number;
  requireDigits?: boolean;
  requireLowercase?: boolean;
  requireSpecialChars?: boolean;
  requireUppercase?: boolean;
  sessionBindToDevice?: boolean;
  sessionIdleTimeout?: string;
  sessionTimeout?: string;
  silentChallengeEnabled?: boolean;
  ssoProviders?: string;
  web3Enabled?: boolean;
}

/** 更新租户品牌定制请求参数 */
export interface UpdateBrandingRequest {
  companyName?: string;  // 公司名称
  customCss?: string;  // 自定义CSS
  emailSenderAddress?: string;  // 邮件发送者地址
  emailSenderName?: string;  // 邮件发送者名称
  faviconUrl?: string;  // Favicon URL
  loginPageDescription?: string;  // 登录页描述
  loginPageTitle?: string;  // 登录页标题
  logoUrl?: string;  // Logo URL
  primaryColor?: string;  // 主题色
  privacyPolicyUrl?: string;  // 隐私政策URL
  secondaryColor?: string;  // 辅助色
  termsOfServiceUrl?: string;  // 服务条款URL
}

/** 更新租户数据分类分级请求参数 */
export interface UpdateDataClassificationRequest {
  classifications: DataClassification[];  // 分类列表
}

/** 更新租户部门的请求参数 */
export interface UpdateDepartmentRequest {
  code?: string;  // 部门编码
  managerId?: string;  // 负责人ID
  name?: string;  // 部门名称
  parentId?: string;  // 父部门ID
}

export interface UpdateInvitationConfigRequest {
  defaultInviteRole?: string;
  inviteExpiryDays?: number;
}

/** 更新租户成员请求参数 */
export interface UpdateMemberRequest {
  departmentId?: string;  // 部门ID
  role?: string;  // 角色
  status?: string;  // 状态
}

export interface UpdateMinorsProtectionConfigRequest {
  childDefaultMaxPrivacy?: boolean;
  contentFilterEnabled?: boolean;
  dailyUsageLimitMin?: number;
  digitalConsentAge?: number;
  liveStreamBlockedUnder16?: boolean;
  minorDataRetentionDays?: number;
  minorsAgeThreshold?: number;
  monthlySpendLimit?: number;
  nightModeEnabled?: boolean;
  nightModeEnd?: string;
  nightModeStart?: string;
}

export interface UpdateOrgChartRequest {
  nodes?: OrgChartNode[];
}

/** 更新租户资源配额请求参数 */
export interface UpdateResourceQuotaRequest {
  maxApiRequests?: number;
  maxBandwidth?: number;
  maxStorage?: number;
  maxUsers?: number;
}

/** 更新租户安全策略请求参数 */
export interface UpdateSecurityPolicyRequest {
  allowedIpRanges?: string[];
  blockedCountries?: string[];
  lockDuration?: string;
  maxAttemptsPerUser?: number;
  maxConcurrentSessions?: number;
  mfaRequired?: boolean;
  passwordMaxLength?: number;
  passwordMinLength?: number;
  requireDigit?: boolean;
  requireLowercase?: boolean;
  requireSpecial?: boolean;
  requireUppercase?: boolean;
  sessionTimeout?: string;
}

export interface UpdateTenantFeaturedRequest {
  featured: boolean;
  featuredSort?: number;
}

/** 更新租户信息请求参数 */
export interface UpdateTenantRequest {
  displayName?: string;  // 显示名称
  domain?: string;  // 域名
  membershipApproval?: string;  // 成员加入方式: open/approval_required/invitation_only
  metadata?: Record<string, string>;  // 元数据
  plan?: string;  // 订阅计划
}

/** 更新用户应用角色 */
export interface UpdateUserAppRoleRequest {
  expiresAt?: string;
  isActive?: boolean;
  permissions?: string[];
  role?: string;
}

export interface UpdateWebhookRequest {
  backoffStrategy?: WebhookBackoffStrategy;
  events?: string[];
  headers?: Record<string, string>;
  isActive?: boolean;
  maxRetries?: number;
  secret?: string;
  timeoutSecs?: number;
  url?: string;
}

/** 用户应用角色详情 */
export interface UserAppRoleResponse {
  applicationId?: string;
  assignedBy?: string;
  createdAt?: string;
  expiresAt?: string;
  id?: string;
  isActive?: boolean;
  permissions?: string[];
  role?: string;
  tenantId?: string;
  updatedAt?: string;
  userId?: string;
}

/** 用户可访问的应用概要信息 */
export interface UserApplicationResponse {
  appCode?: string;
  appId?: string;
  appName?: string;
  isActive?: boolean;
  role?: string;
  tenantId?: string;
  tenantName?: string;
}

/** 用户在应用中的权限信息 */
export interface UserPermissionResponse {
  appCode?: string;
  appId?: string;
  hasAccess?: boolean;
  permissions?: string[];
  role?: string;
}

/** 用户所属租户的概要信息 */
export interface UserTenantResponse {
  displayName?: string;
  joinedAt?: string;
  role?: string;
  status?: string;
  tenantId?: string;
  tenantName?: string;
}

/** 验证邀请码后返回的邀请信息 */
export interface ValidateInvitationResponse {
  email?: string;
  invitedBy?: string;
  role?: string;
  status?: string;
  tenantId?: string;
}

export interface WebhookDeliveryLogResponse {
  attempt?: number;
  createdAt?: string;
  durationMs?: number;
  error?: string;
  eventType?: string;
  id?: string;
  payload?: string;
  requestId?: string;
  response?: string;
  status?: string;
  statusCode?: number;
  tenantId?: string;
  url?: string;
  webhookId?: string;
}

export interface WebhookDeliveryStatsResponse {
  avgDurationMs?: number;
  failCount?: number;
  pendingCount?: number;
  successCount?: number;
  successRate?: number;
  totalCount?: number;
}

export interface WebhookResponse {
  backoffStrategy?: string;
  createdAt?: string;
  events?: string[];
  headers?: string;
  id?: string;
  isActive?: boolean;
  maxRetries?: number;
  tenantId?: string;
  timeoutSecs?: number;
  updatedAt?: string;
  url?: string;
}

export interface CreateAppTypeRequest {
  code: string;
  description?: string;
  name: string;
}

export interface UpdateAppTypeRequest {
  description?: string;
  name?: string;
}


// ====== API Functions (tree-shakeable: independent exports) ======

/** 查询租户列表 */
export function getAdminTenants(client: ApiClient, params?: {
  status?: string;  // 状态筛选
  plan?: string;  // 计划筛选
  search?: string;  // 关键词搜索
  sort_by?: string;  // 排序字段: name/created_at
  sort_order?: string;  // 排序方向: asc/desc
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<TenantResponse>> {
  return client.get(`/tenant/api/v1/admin/tenants`, { params });
}

/** 创建租户 */
export function postAdminTenants(client: ApiClient, data: CreateTenantRequest): Promise<TenantResponse> {
  return client.post(`/tenant/api/v1/admin/tenants`, data);
}

/** 获取全部租户统计 */
export function getAdminTenantsStats(client: ApiClient): Promise<TenantStatsResult> {
  return client.get(`/tenant/api/v1/admin/tenants/stats`);
}

/** 删除租户 */
export function deleteAdminTenantsByTenants(client: ApiClient, tenantId: string): Promise<void> {
  return client.delete(`/tenant/api/v1/admin/tenants/${tenantId}`);
}

/** 获取租户详情 */
export function getAdminTenantsByTenants(client: ApiClient, tenantId: string): Promise<TenantResponse> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}`);
}

/** 更新租户信息 */
export function putAdminTenantsByTenants(client: ApiClient, tenantId: string, data: UpdateTenantRequest): Promise<TenantResponse> {
  return client.put(`/tenant/api/v1/admin/tenants/${tenantId}`, data);
}

/** 激活租户 */
export function postAdminTenantsActivateByTenants(client: ApiClient, tenantId: string): Promise<TenantResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/activate`);
}

/** 列出租户 API Keys */
export function getAdminTenantsApiKeysByTenants(client: ApiClient, tenantId: string): Promise<ApiListResult<ApiKeyResponse>> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/api-keys`);
}

/** 创建租户 API Key */
export function postAdminTenantsApiKeysByTenants(client: ApiClient, tenantId: string, data: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/api-keys`, data);
}

/** 吊销租户 API Key */
export function deleteAdminTenantsApiKeysByTenantsByApiKeys(client: ApiClient, tenantId: string, keyId: string): Promise<void> {
  return client.delete(`/tenant/api/v1/admin/tenants/${tenantId}/api-keys/${keyId}`);
}

/** 轮换租户 API Key */
export function postAdminTenantsApiKeysRotateByTenantsByApiKeys(client: ApiClient, tenantId: string, keyId: string): Promise<RotateApiKeyResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/api-keys/${keyId}/rotate`);
}

/** 列出应用类型 */
export function getAdminTenantsAppTypesByTenants(client: ApiClient, tenantId: string): Promise<ApiListResult<ApplicationTypeResponse>> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/app-types`);
}

/** 创建自定义应用类型 */
export function postAdminTenantsAppTypesByTenants(client: ApiClient, tenantId: string, data: CreateAppTypeRequest): Promise<ApplicationTypeResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/app-types`, data);
}

/** 删除应用类型 */
export function deleteAdminTenantsAppTypesByTenantsByAppTypes(client: ApiClient, tenantId: string, typeId: string): Promise<SimpleResponse> {
  return client.delete(`/tenant/api/v1/admin/tenants/${tenantId}/app-types/${typeId}`);
}

/** 更新应用类型 */
export function putAdminTenantsAppTypesByTenantsByAppTypes(client: ApiClient, tenantId: string, typeId: string, data: UpdateAppTypeRequest): Promise<ApplicationTypeResponse> {
  return client.put(`/tenant/api/v1/admin/tenants/${tenantId}/app-types/${typeId}`, data);
}

/** 列出应用 */
export function getAdminTenantsApplicationsByTenants(client: ApiClient, tenantId: string, params?: {
  type?: string;  // 应用类型
  status?: string;  // 状态
  search?: string;  // 搜索关键词
  is_platform?: boolean;  // 是否平台应用
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<ApplicationResponse>> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/applications`, { params });
}

/** 创建应用 */
export function postAdminTenantsApplicationsByTenants(client: ApiClient, tenantId: string, data: CreateApplicationRequest): Promise<ApplicationResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/applications`, data);
}

/** 删除应用 */
export function deleteAdminTenantsApplicationsByTenantsByApplications(client: ApiClient, tenantId: string, appId: string, params?: {
  permanent?: boolean;  // 是否永久删除
}): Promise<SimpleResponse> {
  return client.delete(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}`, params);
}

/** 获取应用详情 */
export function getAdminTenantsApplicationsByTenantsByApplications(client: ApiClient, tenantId: string, appId: string): Promise<ApplicationResponse> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}`);
}

/** 更新应用 */
export function putAdminTenantsApplicationsByTenantsByApplications(client: ApiClient, tenantId: string, appId: string, data: UpdateApplicationRequest): Promise<ApplicationResponse> {
  return client.put(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}`, data);
}

/** 激活应用 */
export function postAdminTenantsApplicationsActivateByTenantsByApplications(client: ApiClient, tenantId: string, appId: string): Promise<ApplicationResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/activate`);
}

/** 列出应用成员 */
export function getAdminTenantsApplicationsMembersByTenantsByApplications(client: ApiClient, tenantId: string, appId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<UserAppRoleResponse>> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/members`, { params });
}

/** 分配用户应用角色 */
export function postAdminTenantsApplicationsMembersByTenantsByApplications(client: ApiClient, tenantId: string, appId: string, data: AssignUserAppRoleRequest): Promise<UserAppRoleResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/members`, data);
}

/** 撤销用户应用角色 */
export function deleteAdminTenantsApplicationsMembersByTenantsByApplicationsByMembers(client: ApiClient, tenantId: string, appId: string, userId: string): Promise<SimpleResponse> {
  return client.delete(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/members/${userId}`);
}

/** 更新用户应用角色 */
export function putAdminTenantsApplicationsMembersByTenantsByApplicationsByMembers(client: ApiClient, tenantId: string, appId: string, userId: string, data: UpdateUserAppRoleRequest): Promise<UserAppRoleResponse> {
  return client.put(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/members/${userId}`, data);
}

/** 列出应用默认角色 */
export function getAdminTenantsApplicationsRolesByTenantsByApplications(client: ApiClient, tenantId: string, appId: string): Promise<ApiListResult<AppDefaultRoleResponse>> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/roles`);
}

/** 创建应用默认角色 */
export function postAdminTenantsApplicationsRolesByTenantsByApplications(client: ApiClient, tenantId: string, appId: string, data: CreateAppDefaultRoleRequest): Promise<AppDefaultRoleResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/roles`, data);
}

/** 删除应用默认角色 */
export function deleteAdminTenantsApplicationsRolesByTenantsByApplicationsByRoles(client: ApiClient, tenantId: string, appId: string, roleId: string): Promise<SimpleResponse> {
  return client.delete(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/roles/${roleId}`);
}

/** 获取应用默认角色 */
export function getAdminTenantsApplicationsRolesByTenantsByApplicationsByRoles(client: ApiClient, tenantId: string, appId: string, roleId: string): Promise<AppDefaultRoleResponse> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/roles/${roleId}`);
}

/** 更新应用默认角色 */
export function putAdminTenantsApplicationsRolesByTenantsByApplicationsByRoles(client: ApiClient, tenantId: string, appId: string, roleId: string, data: UpdateAppDefaultRoleRequest): Promise<AppDefaultRoleResponse> {
  return client.put(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/roles/${roleId}`, data);
}

/** 暂停应用 */
export function postAdminTenantsApplicationsSuspendByTenantsByApplications(client: ApiClient, tenantId: string, appId: string, data: SuspendApplicationRequest): Promise<ApplicationResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/applications/${appId}/suspend`, data);
}

/** 获取认证策略 */
export function getAdminTenantsAuthPolicyByTenants(client: ApiClient, tenantId: string): Promise<AuthPolicyResponse> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/auth-policy`);
}

/** 更新认证策略 */
export function putAdminTenantsAuthPolicyByTenants(client: ApiClient, tenantId: string, data: UpdateAuthPolicyRequest): Promise<AuthPolicyResponse> {
  return client.put(`/tenant/api/v1/admin/tenants/${tenantId}/auth-policy`, data);
}

/** 获取品牌配置 */
export function getAdminTenantsBrandingByTenants(client: ApiClient, tenantId: string): Promise<BrandingResponse> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/branding`);
}

/** 更新品牌配置 */
export function putAdminTenantsBrandingByTenants(client: ApiClient, tenantId: string, data: UpdateBrandingRequest): Promise<BrandingResponse> {
  return client.put(`/tenant/api/v1/admin/tenants/${tenantId}/branding`, data);
}

/** 查询租户数据分类分级 */
export function getAdminTenantsDataClassificationByTenants(client: ApiClient, tenantId: string): Promise<DataClassificationResponse> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/data-classification`);
}

/** 更新租户数据分类分级 */
export function postAdminTenantsDataClassificationByTenants(client: ApiClient, tenantId: string, data: UpdateDataClassificationRequest): Promise<DataClassificationResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/data-classification`, data);
}

/** 获取部门列表 */
export function getAdminTenantsDepartmentsByTenants(client: ApiClient, tenantId: string): Promise<DepartmentResponse[]> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/departments`);
}

/** 创建部门 */
export function postAdminTenantsDepartmentsByTenants(client: ApiClient, tenantId: string, data: CreateDepartmentRequest): Promise<DepartmentResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/departments`, data);
}

/** 删除部门 */
export function deleteAdminTenantsDepartmentsByTenantsByDepartments(client: ApiClient, tenantId: string, deptId: string): Promise<DataClassificationResponse> {
  return client.delete(`/tenant/api/v1/admin/tenants/${tenantId}/departments/${deptId}`);
}

/** 更新部门 */
export function putAdminTenantsDepartmentsByTenantsByDepartments(client: ApiClient, tenantId: string, deptId: string, data: UpdateDepartmentRequest): Promise<DepartmentResponse> {
  return client.put(`/tenant/api/v1/admin/tenants/${tenantId}/departments/${deptId}`, data);
}

/** 获取域名列表 */
export function getAdminTenantsDomainsByTenants(client: ApiClient, tenantId: string): Promise<ApiListResult<DomainResponse>> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/domains`);
}

/** 添加域名 */
export function postAdminTenantsDomainsByTenants(client: ApiClient, tenantId: string, data: AddDomainRequest): Promise<DomainResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/domains`, data);
}

/** 删除域名 */
export function deleteAdminTenantsDomainsByTenantsByDomains(client: ApiClient, tenantId: string, domain: string): Promise<SimpleResponse> {
  return client.delete(`/tenant/api/v1/admin/tenants/${tenantId}/domains/${domain}`);
}

/** 设置租户精选 */
export function putAdminTenantsFeaturedByTenants(client: ApiClient, tenantId: string, data: UpdateTenantFeaturedRequest): Promise<TenantFeaturedResponse> {
  return client.put(`/tenant/api/v1/admin/tenants/${tenantId}/featured`, data);
}

/** 列出租户邀请码 */
export function getAdminTenantsInvitationCodesByTenants(client: ApiClient, tenantId: string, params?: {
  status?: string;  // 状态过滤（active/expired/exhausted/revoked，缺省=全部）
  page?: number;  // 页码（默认 1）
  page_size?: number;  // 每页数量（默认 20，最大 100）
}): Promise<ApiListResult<InvitationCodeResponse>> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/invitation-codes`, { params });
}

/** 批量铸造邀请码 */
export function postAdminTenantsInvitationCodesByTenants(client: ApiClient, tenantId: string, data: MintInvitationCodesRequest): Promise<MintInvitationCodesResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/invitation-codes`, data);
}

/** 撤销邀请码 */
export function postAdminTenantsInvitationCodesRevokeByTenantsByInvitationCodes(client: ApiClient, tenantId: string, codeId: string): Promise<void> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/invitation-codes/${codeId}/revoke`);
}

/** 获取邀请配置 */
export function getAdminTenantsInvitationConfigByTenants(client: ApiClient, tenantId: string): Promise<InvitationConfigResponse> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/invitation-config`);
}

/** 更新邀请配置 */
export function putAdminTenantsInvitationConfigByTenants(client: ApiClient, tenantId: string, data: UpdateInvitationConfigRequest): Promise<InvitationConfigResponse> {
  return client.put(`/tenant/api/v1/admin/tenants/${tenantId}/invitation-config`, data);
}

/** 获取邀请列表 */
export function getAdminTenantsInvitationsByTenants(client: ApiClient, tenantId: string, params?: {
  status?: string;  // 状态筛选: pending/accepted/revoked/expired
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<InvitationResponse>> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/invitations`, { params });
}

/** 删除邀请 */
export function deleteAdminTenantsInvitationsByTenantsByInvitations(client: ApiClient, tenantId: string, inviteId: string): Promise<SimpleResponse> {
  return client.delete(`/tenant/api/v1/admin/tenants/${tenantId}/invitations/${inviteId}`);
}

/** 重新发送邀请 */
export function postAdminTenantsInvitationsResendByTenantsByInvitations(client: ApiClient, tenantId: string, inviteId: string): Promise<SimpleResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/invitations/${inviteId}/resend`);
}

/** 撤销邀请 */
export function postAdminTenantsInvitationsRevokeByTenantsByInvitations(client: ApiClient, tenantId: string, inviteId: string): Promise<SimpleResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/invitations/${inviteId}/revoke`);
}

/** 获取成员列表 */
export function getAdminTenantsMembersByTenants(client: ApiClient, tenantId: string): Promise<ApiListResult<MemberResponse>> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/members`);
}

/** 添加成员 */
export function postAdminTenantsMembersByTenants(client: ApiClient, tenantId: string, data: AddMemberRequest): Promise<MemberResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/members`, data);
}

/** 批量审批成员 */
export function postAdminTenantsMembersBatchApproveByTenants(client: ApiClient, tenantId: string, data: BatchApproveRequest): Promise<BatchApproveResultResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/members/batch-approve`, data);
}

/** 批量导入成员 */
export function postAdminTenantsMembersBulkImportByTenants(client: ApiClient, tenantId: string, data: BulkImportMembersRequest): Promise<MemberResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/members/bulk-import`, data);
}

/** 邀请成员 */
export function postAdminTenantsMembersInviteByTenants(client: ApiClient, tenantId: string, data: InviteMemberRequest): Promise<MemberResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/members/invite`, data);
}

/** 列出待审批成员 */
export function getAdminTenantsMembersPendingByTenants(client: ApiClient, tenantId: string): Promise<ApiListResult<PendingMemberResponse>> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/members/pending`);
}

/** 移除成员 */
export function deleteAdminTenantsMembersByTenantsByMembers(client: ApiClient, tenantId: string, memberId: string): Promise<SimpleResponse> {
  return client.delete(`/tenant/api/v1/admin/tenants/${tenantId}/members/${memberId}`);
}

/** 更新成员信息 */
export function putAdminTenantsMembersByTenantsByMembers(client: ApiClient, tenantId: string, memberId: string, data: UpdateMemberRequest): Promise<MemberResponse> {
  return client.put(`/tenant/api/v1/admin/tenants/${tenantId}/members/${memberId}`, data);
}

/** 通过成员审批 */
export function postAdminTenantsMembersApproveByTenantsByMembers(client: ApiClient, tenantId: string, memberId: string, data: ApproveMemberRequest): Promise<SimpleResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/members/${memberId}/approve`, data);
}

/** 拒绝成员审批 */
export function postAdminTenantsMembersRejectByTenantsByMembers(client: ApiClient, tenantId: string, memberId: string, data: RejectMemberRequest): Promise<SimpleResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/members/${memberId}/reject`, data);
}

/** 获取未成年人保护配置 */
export function getAdminTenantsMinorsProtectionByTenants(client: ApiClient, tenantId: string): Promise<MinorsProtectionConfigResponse> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/minors-protection`);
}

/** 更新未成年人保护配置 */
export function putAdminTenantsMinorsProtectionByTenants(client: ApiClient, tenantId: string, data: UpdateMinorsProtectionConfigRequest): Promise<MinorsProtectionConfigResponse> {
  return client.put(`/tenant/api/v1/admin/tenants/${tenantId}/minors-protection`, data);
}

/** 获取组织架构图 */
export function getAdminTenantsOrgChartByTenants(client: ApiClient, tenantId: string): Promise<DataClassificationResponse> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/org-chart`);
}

/** 更新组织架构图 */
export function postAdminTenantsOrgChartByTenants(client: ApiClient, tenantId: string, data: UpdateOrgChartRequest): Promise<DataClassificationResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/org-chart`, data);
}

/** 获取资源配额 */
export function getAdminTenantsQuotaByTenants(client: ApiClient, tenantId: string): Promise<ResourceQuotaResponse> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/quota`);
}

/** 更新资源配额 */
export function putAdminTenantsQuotaByTenants(client: ApiClient, tenantId: string, data: UpdateResourceQuotaRequest): Promise<TenantResponse> {
  return client.put(`/tenant/api/v1/admin/tenants/${tenantId}/quota`, data);
}

/** 获取安全策略 */
export function getAdminTenantsSecurityPolicyByTenants(client: ApiClient, tenantId: string): Promise<SecurityPolicyResponse> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/security-policy`);
}

/** 更新安全策略 */
export function putAdminTenantsSecurityPolicyByTenants(client: ApiClient, tenantId: string, data: UpdateSecurityPolicyRequest): Promise<SecurityPolicyResponse> {
  return client.put(`/tenant/api/v1/admin/tenants/${tenantId}/security-policy`, data);
}

/** 获取租户统计概览 */
export function getAdminTenantsStatisticsByTenants(client: ApiClient, tenantId: string): Promise<TenantOverviewResponse> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/statistics`);
}

/** 暂停租户 */
export function postAdminTenantsSuspendByTenants(client: ApiClient, tenantId: string): Promise<TenantResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/suspend`);
}

/** 列出 Webhook */
export function getAdminTenantsWebhooksByTenants(client: ApiClient, tenantId: string): Promise<ApiListResult<WebhookResponse>> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks`);
}

/** 创建 Webhook */
export function postAdminTenantsWebhooksByTenants(client: ApiClient, tenantId: string, data: CreateWebhookRequest): Promise<WebhookResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks`, data);
}

/** 删除 Webhook */
export function deleteAdminTenantsWebhooksByTenantsByWebhooks(client: ApiClient, tenantId: string, hookId: string): Promise<SimpleResponse> {
  return client.delete(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}`);
}

/** 获取 Webhook 详情 */
export function getAdminTenantsWebhooksByTenantsByWebhooks(client: ApiClient, tenantId: string, hookId: string): Promise<WebhookResponse> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}`);
}

/** 更新 Webhook */
export function putAdminTenantsWebhooksByTenantsByWebhooks(client: ApiClient, tenantId: string, hookId: string, data: UpdateWebhookRequest): Promise<WebhookResponse> {
  return client.put(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}`, data);
}

/** 列出 Webhook 投递记录 */
export function getAdminTenantsWebhooksDeliveriesByTenantsByWebhooks(client: ApiClient, tenantId: string, hookId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  status?: string;  // 状态筛选
}): Promise<ApiListResult<WebhookDeliveryLogResponse>> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}/deliveries`, { params });
}

/** 获取投递详情 */
export function getAdminTenantsWebhooksDeliveriesByTenantsByWebhooksByDeliveries(client: ApiClient, tenantId: string, hookId: string, deliveryId: string): Promise<WebhookDeliveryLogResponse> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}/deliveries/${deliveryId}`);
}

/** 重试投递 */
export function postAdminTenantsWebhooksDeliveriesRetryByTenantsByWebhooksByDeliveries(client: ApiClient, tenantId: string, hookId: string, deliveryId: string): Promise<WebhookDeliveryLogResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}/deliveries/${deliveryId}/retry`);
}

/** 轮换签名密钥 */
export function postAdminTenantsWebhooksRotateSecretByTenantsByWebhooks(client: ApiClient, tenantId: string, hookId: string): Promise<RotateSecretResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}/rotate-secret`);
}

/** 获取 Webhook 投递统计 */
export function getAdminTenantsWebhooksStatsByTenantsByWebhooks(client: ApiClient, tenantId: string, hookId: string): Promise<WebhookDeliveryStatsResponse> {
  return client.get(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}/stats`);
}

/** 测试 Webhook */
export function postAdminTenantsWebhooksTestByTenantsByWebhooks(client: ApiClient, tenantId: string, hookId: string): Promise<WebhookDeliveryLogResponse> {
  return client.post(`/tenant/api/v1/admin/tenants/${tenantId}/webhooks/${hookId}/test`);
}

/** 列出可用事件类型 */
export function getAdminWebhooksEventTypes(client: ApiClient): Promise<EventTypeListResponse> {
  return client.get(`/tenant/api/v1/admin/webhooks/event-types`);
}

/** 获取事件 Schema */
export function getAdminWebhooksEventTypesSchemaByEventTypes(client: ApiClient, event: string): Promise<EventSchemaResponse> {
  return client.get(`/tenant/api/v1/admin/webhooks/event-types/${event}/schema`);
}

/** 接受邀请 */
export function postInvitationsAcceptByInvitations(client: ApiClient, token: string, data: AcceptInvitationRequest): Promise<AcceptInvitationResponse> {
  return client.post(`/tenant/api/v1/invitations/${token}/accept`, data);
}

/** 公开租户列表 */
export function getTenantPublicTenants(client: ApiClient, params?: {
  keyword?: string;  // 关键词（name/display_name/domain 模糊匹配，非空即搜索模式）
  featured?: string;  // 精选模式（=true 时返回运营精选租户）
  page?: number;  // 页码（搜索模式，默认 1）
  page_size?: number;  // 每页条数（搜索模式，默认 20，上限 50）
}): Promise<ApiListResult<PublicTenantResponse>> {
  return client.get(`/tenant/api/v1/tenant/public/tenants`, { params });
}

/** 公开注册试用租户 */
export function postTenantPublicTenants(client: ApiClient, data: RegisterTrialTenantRequest): Promise<TenantResponse> {
  return client.post(`/tenant/api/v1/tenant/public/tenants`, data);
}

/** 公开租户品牌批量查询 */
export function getTenantPublicTenantsBranding(client: ApiClient, params?: {
  featured?: string;  // 精选模式（=true 时并入运营精选租户）
  slugs?: string;  // 租户 slug 列表（逗号分隔，去重后上限 50）
}): Promise<ApiListResult<PublicTenantBranding>> {
  return client.get(`/tenant/api/v1/tenant/public/tenants/branding`, { params });
}

/** 删除试用租户 */
export function deleteTenantPublicTenantsByTenants(client: ApiClient, slug: string): Promise<void> {
  return client.delete(`/tenant/api/v1/tenant/public/tenants/${slug}`);
}

/** 公开租户详情 */
export function getTenantPublicTenantsByTenants(client: ApiClient, slug: string): Promise<PublicTenantDetailResponse> {
  return client.get(`/tenant/api/v1/tenant/public/tenants/${slug}`);
}

/** 列出本租户应用 */
export function getTenantsApplicationsByTenants(client: ApiClient, tenantId: string, params?: {
  type?: string;  // 应用类型
  status?: string;  // 状态
  search?: string;  // 搜索关键词
  is_platform?: boolean;  // 是否平台应用
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<ApplicationResponse>> {
  return client.get(`/tenant/api/v1/tenants/${tenantId}/applications`, { params });
}

/** 获取用户可访问的应用列表 */
export function getUsersApplicationsByUsers(client: ApiClient, userId: string): Promise<ApiListResult<UserApplicationResponse>> {
  return client.get(`/tenant/api/v1/users/${userId}/applications`);
}

/** 获取用户所属租户列表 */
export function getUsersTenantsByUsers(client: ApiClient, userId: string): Promise<ApiListResult<UserTenantResponse>> {
  return client.get(`/tenant/api/v1/users/${userId}/tenants`);
}

