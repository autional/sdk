/**
 * @autional/api-profile — Auto-generated from profile-service swagger.json
 * Generated: 2026-10-28
 * DO NOT EDIT — run `python sdk/scripts/generate-api-packages.py` to regenerate
 */

import type { ApiClient } from '@autional/core';

// ====== Types ======

export interface ProfileField {
  key: string;
  label?: string;
  value: string;
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

export interface SimpleResponse {
  code?: number;
  message?: string;
  timestamp?: string;
}

export interface ApprovalListResponse {
  items?: ApprovalResponse[];
}

export interface ApprovalRequest {
  action?: string;
  fieldChanges?: Record<string, unknown>;
  reason?: string;
  userIds?: string[];
}

export interface ApprovalResponse {
  action?: string;
  approvedAt?: string;
  id?: string;
  reason?: string;
  status?: string;
  userId?: string;
}

export interface ArchiveProfileRequest {
  reason?: string;
}

export interface ArchiveProfileResponse {
  archived?: boolean;
  archivedAt?: string;
  reason?: string;
  userId?: string;
}

export interface BatchItemError {
  error?: string;
  userId?: string;
}

export interface BatchRequest {
  reason?: string;
  userIds: string[];
}

export interface BatchResult {
  errors?: BatchItemError[];
  failed?: number;
  success?: number;
  total?: number;
}

export interface CompletenessData {
  completeness?: unknown;
}

export interface ConsentField {
  consented?: boolean;
  dataClassification?: string;
  displayName?: string;
  fieldKey?: string;
  requiresConsent?: boolean;
}

export interface ConsentListResponse {
  fields?: ConsentField[];
}

export interface DeletedData {
  deleted?: boolean;
}

export interface ExportProfileData {
  address?: string;
  avatarUrl?: string;
  bio?: string;
  birthDate?: string;
  city?: string;
  country?: string;
  createdAt?: string;
  customFields?: Record<string, unknown>;
  firstName?: string;
  gender?: string;
  lastName?: string;
  nickname?: string;
  preferences?: Record<string, unknown>;
  socialLinks?: Record<string, unknown>;
  tenantId?: string;
  updatedAt?: string;
  userId?: string;
  website?: string;
}

export interface ExportProfileInternalRequest {
  userId: string;
}

export interface FieldSchemaDTO {
  dataClassification?: string;
  displayName?: string;
  fieldKey?: string;
  fieldType?: string;
  helpText?: string;
  isRequired?: boolean;
  isSystem?: boolean;
  options?: string[];
  placeholder?: string;
  requiresConsent?: boolean;
  sortOrder?: number;
  validationRegex?: string;
}

export interface FieldSchemaListResponse {
  schemas?: FieldSchemaDTO[];
}

export interface FieldsData {
  fields?: unknown;
}

export interface GrantConsentRequest {
  fieldKeys: string[];
}

export interface InternalProfilesData {
  profiles?: UserProfileResponse[];
}

export interface MyAvatarResponse {
  avatarUrl?: string;
  updatedAt?: string;
  userId?: string;
}

export interface PreferencesResponse {
  preferences?: Record<string, unknown>;
}

export interface PrivacyData {
  privacy?: unknown;
}

export interface PrivacyImpactResponse {
  recommendations?: string[];
  riskFactors?: number;
  riskLevel?: string;
  riskScore?: number;
  userId?: string;
}

export interface PrivacySettingsDTO {
  profileVisibility?: string;
  showDepartment?: boolean;
  showEmail?: boolean;
  showLocation?: boolean;
  showPhone?: boolean;
}

export interface ProfileData {
  profile?: unknown;
}

export interface ProfileFieldsRequest {
  fields: ProfileField[];
}

export type ProfileListResponse = Record<string, unknown>;

export interface ProfilePolicyDTO {
  allowedAvatarTypes?: string[];
  autoArchiveAfterDays?: number;
  avatarUploadEnabled?: boolean;
  cacheTtlSeconds?: number;
  completenessEnabled?: boolean;
  completenessWeights?: Record<string, number>;
  customFieldsEnabled?: boolean;
  defaultProfileVisibility?: string;
  defaultShowEmail?: boolean;
  defaultShowLocation?: boolean;
  defaultShowPhone?: boolean;
  maxAvatarSizeBytes?: number;
  maxCustomFields?: number;
  maxSocialLinks?: number;
  maxTagsPerUser?: number;
  privacyImpactEnabled?: boolean;
  publicProfileEnabled?: boolean;
  requiredFields?: string[];
  retentionDaysAfterDelete?: number;
  socialLinksEnabled?: boolean;
  tagsEnabled?: boolean;
}

export interface ProfilePolicyResponse {
  allowedAvatarTypes?: string[];
  autoArchiveAfterDays?: number;
  avatarUploadEnabled?: boolean;
  cacheTtlSeconds?: number;
  completenessEnabled?: boolean;
  completenessWeights?: Record<string, number>;
  customFieldsEnabled?: boolean;
  defaultProfileVisibility?: string;
  defaultShowEmail?: boolean;
  defaultShowLocation?: boolean;
  defaultShowPhone?: boolean;
  maxAvatarSizeBytes?: number;
  maxCustomFields?: number;
  maxSocialLinks?: number;
  maxTagsPerUser?: number;
  privacyImpactEnabled?: boolean;
  publicProfileEnabled?: boolean;
  requiredFields?: string[];
  retentionDaysAfterDelete?: number;
  socialLinksEnabled?: boolean;
  tagsEnabled?: boolean;
  tenantId?: string;
  updatedAt?: string;
}

export interface ProfileStatsResponse {
  activeProfiles?: number;
  archivedProfiles?: number;
  avgCompleteness?: number;  // P3: implement avg profile completeness
  completenessDistribution?: Record<string, number>;
  deletedProfiles?: number;
  recentActivity24h?: number;
  totalProfiles?: number;
}

export interface RejectApprovalBody {
  reason?: string;
}

export interface RevokeConsentResponse {
  fieldKey?: string;
  revoked?: boolean;
}

export interface SetTagsRequest {
  tags: string[];
}

export interface SuccessData {
  success?: boolean;
}

export interface UpdateAvatarRequest {
  avatarUrl: string;
}

export interface UpdatePreferencesRequest {
  language?: string;
  notifications?: Record<string, unknown>;
  theme?: string;
  timezone?: string;
}

export interface UpdateProfileRequest {
  address?: string;
  avatarUrl?: string;
  bio?: string;
  birthdate?: string;
  city?: string;
  country?: string;
  customFields?: Record<string, unknown>;
  firstName?: string;
  gender?: string;
  language?: string;
  lastName?: string;
  nickname?: string;
  socialLinks?: Record<string, string>;
  timezone?: string;
  website?: string;
}

export interface UploadAvatarData {
  avatarUrl?: string;
  profile?: unknown;
}

export interface UpsertProfileNamesRequest {
  firstName?: string;
  lastName?: string;
  nickname?: string;
}

export type UserProfileResponse = Record<string, unknown>;

export interface VersionListResponse {
  versions?: VersionResponse[];
}

export interface VersionResponse {
  changeType?: string;
  changedAt?: string;
  changedBy?: string;
  id?: string;
  snapshot?: Record<string, unknown>;
  version?: number;
}

export interface WebhookConfigDTO {
  events?: string[];
  isEnabled?: boolean;
  secret?: string;
  url?: string;
}

export interface WebhookConfigResponse {
  events?: string[];
  isEnabled?: boolean;
  tenantId?: string;
  updatedAt?: string;
  url?: string;
}


// ====== API Functions (tree-shakeable: independent exports) ======

/** 搜索用户资料 */
export function getAdminProfiles(client: ApiClient, params?: {
  keyword?: string;  // 搜索关键词（匹配姓名、邮箱等）
  country?: string;  // 国家筛选
  city?: string;  // 城市筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ProfileListResponse> {
  return client.get(`/profile/api/v1/admin/profiles`, { params });
}

/** 查询待审批列表 */
export function getAdminProfilesApprovalRequests(client: ApiClient): Promise<ApprovalListResponse> {
  return client.get(`/profile/api/v1/admin/profiles/approval-requests`);
}

/** 创建审批请求 */
export function postAdminProfilesApprovalRequests(client: ApiClient, data: ApprovalRequest): Promise<ApprovalResponse> {
  return client.post(`/profile/api/v1/admin/profiles/approval-requests`, data);
}

/** 删除审批请求 */
export function deleteAdminProfilesApprovalRequestsByApprovalRequests(client: ApiClient, requestId: string): Promise<void> {
  return client.delete(`/profile/api/v1/admin/profiles/approval-requests/${requestId}`);
}

/** 批准审批请求 */
export function postAdminProfilesApprovalRequestsApproveByApprovalRequests(client: ApiClient, requestId: string): Promise<ApprovalResponse> {
  return client.post(`/profile/api/v1/admin/profiles/approval-requests/${requestId}/approve`);
}

/** 拒绝审批请求 */
export function postAdminProfilesApprovalRequestsRejectByApprovalRequests(client: ApiClient, requestId: string, data: RejectApprovalBody): Promise<ApprovalResponse> {
  return client.post(`/profile/api/v1/admin/profiles/approval-requests/${requestId}/reject`, data);
}

/** 批量归档用户资料 */
export function postAdminProfilesBatchArchive(client: ApiClient, data: BatchRequest): Promise<BatchResult> {
  return client.post(`/profile/api/v1/admin/profiles/batch-archive`, data);
}

/** 批量删除用户资料 */
export function postAdminProfilesBatchDelete(client: ApiClient, data: BatchRequest): Promise<void> {
  return client.post(`/profile/api/v1/admin/profiles/batch-delete`, data);
}

/** 批量导出用户资料 */
export function postAdminProfilesBatchExport(client: ApiClient, data: BatchRequest): Promise<void> {
  return client.post(`/profile/api/v1/admin/profiles/batch-export`, data);
}

/** 列出字段模板 */
export function getAdminProfilesFieldSchemas(client: ApiClient): Promise<FieldSchemaListResponse> {
  return client.get(`/profile/api/v1/admin/profiles/field-schemas`);
}

/** 创建字段模板 */
export function postAdminProfilesFieldSchemas(client: ApiClient, data: FieldSchemaDTO): Promise<FieldSchemaDTO> {
  return client.post(`/profile/api/v1/admin/profiles/field-schemas`, data);
}

/** 删除字段模板 */
export function deleteAdminProfilesFieldSchemasByFieldSchemas(client: ApiClient, fieldKey: string): Promise<void> {
  return client.delete(`/profile/api/v1/admin/profiles/field-schemas/${fieldKey}`);
}

/** 更新字段模板 */
export function putAdminProfilesFieldSchemasByFieldSchemas(client: ApiClient, fieldKey: string, data: FieldSchemaDTO): Promise<FieldSchemaDTO> {
  return client.put(`/profile/api/v1/admin/profiles/field-schemas/${fieldKey}`, data);
}

/** 删除租户资料策略 */
export function deleteAdminProfilesPolicy(client: ApiClient): Promise<ProfilePolicyResponse> {
  return client.delete(`/profile/api/v1/admin/profiles/policy`);
}

/** 获取租户资料策略 */
export function getAdminProfilesPolicy(client: ApiClient): Promise<ProfilePolicyResponse> {
  return client.get(`/profile/api/v1/admin/profiles/policy`);
}

/** 创建租户资料策略 */
export function postAdminProfilesPolicy(client: ApiClient, data: ProfilePolicyDTO): Promise<ProfilePolicyResponse> {
  return client.post(`/profile/api/v1/admin/profiles/policy`, data);
}

/** 更新租户资料策略 */
export function putAdminProfilesPolicy(client: ApiClient, data: ProfilePolicyDTO): Promise<ProfilePolicyResponse> {
  return client.put(`/profile/api/v1/admin/profiles/policy`, data);
}

/** 获取资料统计 */
export function getAdminProfilesStats(client: ApiClient): Promise<ProfileStatsResponse> {
  return client.get(`/profile/api/v1/admin/profiles/stats`);
}

/** 删除资料版本记录 */
export function deleteAdminProfilesVersionsByVersions(client: ApiClient, versionId: string): Promise<void> {
  return client.delete(`/profile/api/v1/admin/profiles/versions/${versionId}`);
}

/** 删除 Webhook 配置 */
export function deleteAdminProfilesWebhook(client: ApiClient): Promise<void> {
  return client.delete(`/profile/api/v1/admin/profiles/webhook`);
}

/** 获取 Webhook 配置 */
export function getAdminProfilesWebhook(client: ApiClient): Promise<WebhookConfigResponse> {
  return client.get(`/profile/api/v1/admin/profiles/webhook`);
}

/** 创建 Webhook 配置 */
export function postAdminProfilesWebhook(client: ApiClient, data: WebhookConfigDTO): Promise<WebhookConfigResponse> {
  return client.post(`/profile/api/v1/admin/profiles/webhook`, data);
}

/** 更新 Webhook 配置 */
export function putAdminProfilesWebhook(client: ApiClient, data: WebhookConfigDTO): Promise<WebhookConfigResponse> {
  return client.put(`/profile/api/v1/admin/profiles/webhook`, data);
}

/** 获取用户资料（管理端） */
export function getAdminProfilesByProfiles(client: ApiClient, userId: string): Promise<ProfileData> {
  return client.get(`/profile/api/v1/admin/profiles/${userId}`);
}

/** 归档用户资料 */
export function postAdminProfilesArchiveByProfiles(client: ApiClient, userId: string, data: ArchiveProfileRequest): Promise<ArchiveProfileResponse> {
  return client.post(`/profile/api/v1/admin/profiles/${userId}/archive`, data);
}

/** 更新指定用户头像（管理端） */
export function putAdminProfilesAvatarByProfiles(client: ApiClient, userId: string, data: UpdateAvatarRequest): Promise<ProfileData> {
  return client.put(`/profile/api/v1/admin/profiles/${userId}/avatar`, data);
}

/** 导出用户资料 */
export function getAdminProfilesExportByProfiles(client: ApiClient, userId: string, params?: {
  format?: string;  // 导出格式（json/csv）
}): Promise<ExportProfileData> {
  return client.get(`/profile/api/v1/admin/profiles/${userId}/export`, { params });
}

/** 获取资料版本历史 */
export function getAdminProfilesVersionsByProfiles(client: ApiClient, userId: string): Promise<VersionListResponse> {
  return client.get(`/profile/api/v1/admin/profiles/${userId}/versions`);
}

/** 快捷获取当前用户头像 */
export function getProfileAvatar(client: ApiClient): Promise<MyAvatarResponse> {
  return client.get(`/profile/api/v1/profile/avatar`);
}

/** 用户资料列表 */
export function getProfiles(client: ApiClient, params?: {
  keyword?: string;  // 搜索关键词
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ProfileListResponse> {
  return client.get(`/profile/api/v1/profiles`, { params });
}

/** 删除用户资料 */
export function deleteProfilesByProfiles(client: ApiClient, userId: string): Promise<void> {
  return client.delete(`/profile/api/v1/profiles/${userId}`);
}

/** 获取用户资料 */
export function getProfilesByProfiles(client: ApiClient, userId: string): Promise<ProfileData> {
  return client.get(`/profile/api/v1/profiles/${userId}`);
}

/** 创建或更新用户资料 */
export function putProfilesByProfiles(client: ApiClient, userId: string, data: UpdateProfileRequest): Promise<ProfileData> {
  return client.put(`/profile/api/v1/profiles/${userId}`, data);
}

/** 更新用户头像 */
export function putProfilesAvatarByProfiles(client: ApiClient, userId: string, data: UpdateAvatarRequest): Promise<ProfileData> {
  return client.put(`/profile/api/v1/profiles/${userId}/avatar`, data);
}

/** 获取资料完成度 */
export function getProfilesCompletenessByProfiles(client: ApiClient, userId: string): Promise<CompletenessData> {
  return client.get(`/profile/api/v1/profiles/${userId}/completeness`);
}

/** 查询用户同意记录 */
export function getProfilesConsentsByProfiles(client: ApiClient, userId: string): Promise<ConsentListResponse> {
  return client.get(`/profile/api/v1/profiles/${userId}/consents`);
}

/** 授予数据收集同意 */
export function postProfilesConsentsByProfiles(client: ApiClient, userId: string, data: GrantConsentRequest): Promise<ConsentListResponse> {
  return client.post(`/profile/api/v1/profiles/${userId}/consents`, data);
}

/** 撤销数据收集同意 */
export function deleteProfilesConsentsByProfilesByConsents(client: ApiClient, userId: string, fieldKey: string): Promise<RevokeConsentResponse> {
  return client.delete(`/profile/api/v1/profiles/${userId}/consents/${fieldKey}`);
}

/** 自助导出用户资料 */
export function getProfilesExportByProfiles(client: ApiClient, userId: string, params?: {
  format?: string;  // 导出格式（json/csv）
}): Promise<ExportProfileData> {
  return client.get(`/profile/api/v1/profiles/${userId}/export`, { params });
}

/** 获取自定义字段 */
export function getProfilesFieldsByProfiles(client: ApiClient, userId: string): Promise<FieldsData> {
  return client.get(`/profile/api/v1/profiles/${userId}/fields`);
}

/** 更新自定义字段 */
export function putProfilesFieldsByProfiles(client: ApiClient, userId: string, data: ProfileFieldsRequest): Promise<FieldsData> {
  return client.put(`/profile/api/v1/profiles/${userId}/fields`, data);
}

/** 获取用户偏好设置 */
export function getProfilesPreferencesByProfiles(client: ApiClient, userId: string): Promise<PreferencesResponse> {
  return client.get(`/profile/api/v1/profiles/${userId}/preferences`);
}

/** 更新用户偏好设置 */
export function putProfilesPreferencesByProfiles(client: ApiClient, userId: string, data: UpdatePreferencesRequest): Promise<PreferencesResponse> {
  return client.put(`/profile/api/v1/profiles/${userId}/preferences`, data);
}

/** 获取隐私设置 */
export function getProfilesPrivacyByProfiles(client: ApiClient, userId: string): Promise<PrivacyData> {
  return client.get(`/profile/api/v1/profiles/${userId}/privacy`);
}

/** 更新隐私设置 */
export function putProfilesPrivacyByProfiles(client: ApiClient, userId: string, data: PrivacySettingsDTO): Promise<PrivacyData> {
  return client.put(`/profile/api/v1/profiles/${userId}/privacy`, data);
}

/** 获取隐私影响评估 */
export function getProfilesPrivacyImpactByProfiles(client: ApiClient, userId: string): Promise<PrivacyImpactResponse> {
  return client.get(`/profile/api/v1/profiles/${userId}/privacy-impact`);
}

/** 获取公开资料 */
export function getProfilesPublicByProfiles(client: ApiClient, userId: string): Promise<ProfileData> {
  return client.get(`/profile/api/v1/profiles/${userId}/public`);
}

/** 删除用户标签 */
export function deleteProfilesTagsByProfiles(client: ApiClient, userId: string): Promise<SuccessData> {
  return client.delete(`/profile/api/v1/profiles/${userId}/tags`);
}

/** 设置用户标签 */
export function postProfilesTagsByProfiles(client: ApiClient, userId: string, data: SetTagsRequest): Promise<SuccessData> {
  return client.post(`/profile/api/v1/profiles/${userId}/tags`, data);
}

/** 创建资料版本快照 */
export function postProfilesVersionsByProfiles(client: ApiClient, userId: string): Promise<VersionResponse> {
  return client.post(`/profile/api/v1/profiles/${userId}/versions`);
}

// ====== Module Augmentation =====
// Installing this package auto-types useAutional().api.profile

export interface ProfileApi {
  getAdminProfiles: typeof getAdminProfiles;
  getAdminProfilesApprovalRequests: typeof getAdminProfilesApprovalRequests;
  postAdminProfilesApprovalRequests: typeof postAdminProfilesApprovalRequests;
  deleteAdminProfilesApprovalRequestsByApprovalRequests: typeof deleteAdminProfilesApprovalRequestsByApprovalRequests;
  postAdminProfilesApprovalRequestsApproveByApprovalRequests: typeof postAdminProfilesApprovalRequestsApproveByApprovalRequests;
  postAdminProfilesApprovalRequestsRejectByApprovalRequests: typeof postAdminProfilesApprovalRequestsRejectByApprovalRequests;
  postAdminProfilesBatchArchive: typeof postAdminProfilesBatchArchive;
  postAdminProfilesBatchDelete: typeof postAdminProfilesBatchDelete;
  postAdminProfilesBatchExport: typeof postAdminProfilesBatchExport;
  getAdminProfilesFieldSchemas: typeof getAdminProfilesFieldSchemas;
  postAdminProfilesFieldSchemas: typeof postAdminProfilesFieldSchemas;
  deleteAdminProfilesFieldSchemasByFieldSchemas: typeof deleteAdminProfilesFieldSchemasByFieldSchemas;
  putAdminProfilesFieldSchemasByFieldSchemas: typeof putAdminProfilesFieldSchemasByFieldSchemas;
  deleteAdminProfilesPolicy: typeof deleteAdminProfilesPolicy;
  getAdminProfilesPolicy: typeof getAdminProfilesPolicy;
  postAdminProfilesPolicy: typeof postAdminProfilesPolicy;
  putAdminProfilesPolicy: typeof putAdminProfilesPolicy;
  getAdminProfilesStats: typeof getAdminProfilesStats;
  deleteAdminProfilesVersionsByVersions: typeof deleteAdminProfilesVersionsByVersions;
  deleteAdminProfilesWebhook: typeof deleteAdminProfilesWebhook;
  getAdminProfilesWebhook: typeof getAdminProfilesWebhook;
  postAdminProfilesWebhook: typeof postAdminProfilesWebhook;
  putAdminProfilesWebhook: typeof putAdminProfilesWebhook;
  getAdminProfilesByProfiles: typeof getAdminProfilesByProfiles;
  postAdminProfilesArchiveByProfiles: typeof postAdminProfilesArchiveByProfiles;
  putAdminProfilesAvatarByProfiles: typeof putAdminProfilesAvatarByProfiles;
  getAdminProfilesExportByProfiles: typeof getAdminProfilesExportByProfiles;
  getAdminProfilesVersionsByProfiles: typeof getAdminProfilesVersionsByProfiles;
  getProfileAvatar: typeof getProfileAvatar;
  getProfiles: typeof getProfiles;
  deleteProfilesByProfiles: typeof deleteProfilesByProfiles;
  getProfilesByProfiles: typeof getProfilesByProfiles;
  putProfilesByProfiles: typeof putProfilesByProfiles;
  putProfilesAvatarByProfiles: typeof putProfilesAvatarByProfiles;
  getProfilesCompletenessByProfiles: typeof getProfilesCompletenessByProfiles;
  getProfilesConsentsByProfiles: typeof getProfilesConsentsByProfiles;
  postProfilesConsentsByProfiles: typeof postProfilesConsentsByProfiles;
  deleteProfilesConsentsByProfilesByConsents: typeof deleteProfilesConsentsByProfilesByConsents;
  getProfilesExportByProfiles: typeof getProfilesExportByProfiles;
  getProfilesFieldsByProfiles: typeof getProfilesFieldsByProfiles;
  putProfilesFieldsByProfiles: typeof putProfilesFieldsByProfiles;
  getProfilesPreferencesByProfiles: typeof getProfilesPreferencesByProfiles;
  putProfilesPreferencesByProfiles: typeof putProfilesPreferencesByProfiles;
  getProfilesPrivacyByProfiles: typeof getProfilesPrivacyByProfiles;
  putProfilesPrivacyByProfiles: typeof putProfilesPrivacyByProfiles;
  getProfilesPrivacyImpactByProfiles: typeof getProfilesPrivacyImpactByProfiles;
  getProfilesPublicByProfiles: typeof getProfilesPublicByProfiles;
  deleteProfilesTagsByProfiles: typeof deleteProfilesTagsByProfiles;
  postProfilesTagsByProfiles: typeof postProfilesTagsByProfiles;
  postProfilesVersionsByProfiles: typeof postProfilesVersionsByProfiles;
}

declare module '@autional/core' {
  interface RegisteredApis {
    profile: ProfileApi;
  }
}