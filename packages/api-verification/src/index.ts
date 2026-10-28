/**
 * @autional/api-verification — Auto-generated from verification-service internal/docs/docs.go
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

export interface FieldViolation {
  code?: string;  // Code 是错误代码（可选） 用于程序识别错误类型，如 "required", "format", "range"
  description?: string;  // Description 是人类可读的错误描述 应该说明违反了什么规则，如 "必须是一个有效的邮箱地址"
  field?: string;  // Field 是错误字段的路径 使用点号表示嵌套字段，如 "user.email" 或 "addresses[0].city"
  standard?: string;  // Standard 是指向权威规范文档的 URI 引用 用于告知 API 消费者具体违反哪个标准 示例："https://www.rfc-editor.org/info/rfc5322"
  value?: unknown;  // Value 是导致错误的值（可选，开发模式下使用） 生产环境可能不返回此字段以避免泄露敏感信息
}

export interface PageInfo {
  hasNext?: boolean;  // HasNext indicates whether there is a next page
  hasPrev?: boolean;  // HasPrev indicates whether there is a previous page
  page?: number;  // Page is the current page number (1-based)
  pageSize?: number;  // PageSize is the number of items per page
  total?: number;  // Total is the total number of items across all pages
  totalPages?: number;  // TotalPages is the total number of pages
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

export interface AdminVerificationDetail {
  ageGroup?: string;
  createdAt?: string;
  dateOfBirth?: string;
  expiresAt?: string;
  gender?: string;
  id?: string;
  idNumberHint?: string;
  livenessScore?: string;
  maskedName?: string;
  maxRetries?: number;
  method?: string;
  overrideBy?: string;
  overrideReason?: string;
  provider?: string;
  providerRespId?: string;
  rejectedAt?: string;
  rejectedReason?: string;
  retryCount?: number;
  status?: string;
  tenantId?: string;
  updatedAt?: string;
  userId?: string;
  verifiedAt?: string;
}

export interface BeginLivenessRequest {
  verificationId: string;
}

export interface BeginLivenessResponse {
  actionSequence?: string;
  expiresAt?: number;
  sessionToken?: string;
}

export interface CompleteLivenessRequest {
  sessionToken: string;
  videoData?: string;
}

export interface CreateGuardianRequest {
  guardianUserId: string;
  minorUserId: string;
  relationType: string;
}

export interface CreateProviderConfigRequest {
  channel: "ocr" | "verification" | "liveness";
  config: string;
  priority?: number;
  provider: string;
}

export interface EraseUserInternalRequest {
  tenantId: string;
  userId: string;
}

export interface GrantConsentRequest {
  consentItems: string[];
}

export interface GuardianConsentRequest {
  consentScope?: string;
}

export interface GuardianRelationshipResponse {
  consentAt?: string;
  consentGiven?: boolean;
  consentScope?: string;
  createdAt?: string;
  guardianUserId?: string;
  id?: string;
  minorUserId?: string;
  relationType?: string;
  verified?: boolean;
  verifiedAt?: string;
}

export interface LivenessResultResponse {
  passed?: boolean;
  score?: number;
}

export interface ManualReviewRequest {
  reason: string;
}

export interface MinorProfileResponse {
  ageGroup?: string;
  consentGranted?: boolean;
  dailyLimitMinutes?: number;
  guardianUserId?: string;
  isMinor?: boolean;
  nightModeEnd?: string;
  nightModeStart?: string;
  restrictions?: string[];
  userId?: string;
}

export interface OverrideRequest {
  reason: string;
  status: string;
}

export interface ProviderConfigResponse {
  appId?: string;
  channel?: string;
  createdAt?: string;
  id?: string;
  isActive?: boolean;
  priority?: number;
  provider?: string;
  tenantId?: string;
  updatedAt?: string;
}

export interface RemoveGuardianRequest {
  guardianUserId: string;
  minorUserId: string;
}

export interface ResolveReviewRequest {
  reason: string;
  resolution: "approved" | "rejected";
}

export interface SetMinorProtectionRequest {
  dailyLimitMinutes?: number;
  minorUserId: string;
  nightModeEnd?: string;
  nightModeStart?: string;
  restrictions?: string[];
}

export interface StatsResponse {
  expired?: number;
  minorCount?: number;
  pending?: number;
  rejected?: number;
  total?: number;
  unverified?: number;
  verified?: number;
}

export interface SubmitOCRRequest {
  backImage: string;
  frontImage: string;
}

export interface SubmitOCRResponse {
  ocrConfidence?: number;
  ocrIdNumber?: string;
  ocrName?: string;
  status?: string;
  verificationId?: string;
}

export interface SubmitVerificationRequest {
  confirmedIdNumber?: string;
  confirmedName?: string;
  method: VerificationMethod;
}

export interface UpdateGuardianRequest {
  consentScope?: string;
  relationType?: string;
}

export interface UpdateProviderConfigRequest {
  config?: string;
  isActive?: boolean;
  priority?: number;
}

export interface VerificationDetailResponse {
  ageGroup?: string;
  expiresAt?: string;
  livenessScore?: string;
  maxRetries?: number;
  method?: string;
  provider?: string;
  providerRespId?: string;
  rejectedReason?: string;
  retryCount?: number;
  status?: string;
  verificationId?: string;
  verifiedAt?: string;
}

export interface VerificationListItem {
  ageGroup?: string;
  createdAt?: string;
  expiresAt?: string;
  id?: string;
  livenessScore?: string;
  method?: string;
  provider?: string;
  rejectedReason?: string;
  retryCount?: number;
  status?: string;
  updatedAt?: string;
  userId?: string;
  verifiedAt?: string;
}

export interface VerificationStatusResponse {
  ageGroup?: string;
  expiresAt?: string;
  maxRetries?: number;
  method?: string;
  provider?: string;
  retryCount?: number;
  status?: string;
  verificationId?: string;
  verifiedAt?: string;
}

export type VerificationMethod = "ocr" | "two_element" | "three_element" | "four_element" | "manual";


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

/** 查询认证列表 */
export function getAdminVerifications(client: ApiClient, params?: {
  status?: string;  // 认证状态过滤：verified/pending/rejected/expired
  date_from?: string;  // 起始日期 (YYYY-MM-DD)
  date_to?: string;  // 截止日期 (YYYY-MM-DD)
  page?: number;  // 页码，默认1
  page_size?: number;  // 每页数量，默认20
}): Promise<ApiListResult<VerificationListItem>> {
  return client.get(`/verification/api/v1/admin/verifications`, { params });
}

/** 导出认证记录 */
export function getAdminVerificationsExport(client: ApiClient, params?: {
  status?: string;  // 认证状态过滤：verified/pending/rejected/expired
  date_from?: string;  // 起始日期 (YYYY-MM-DD)
  date_to?: string;  // 截止日期 (YYYY-MM-DD)
}): Promise<void> {
  return client.get(`/verification/api/v1/admin/verifications/export`, { params });
}

/** 管理员解除监护关系 */
export function deleteAdminVerificationsGuardians(client: ApiClient, data: RemoveGuardianRequest): Promise<SimpleResponse> {
  return client.delete(`/verification/api/v1/admin/verifications/guardians`);
}

/** 管理员查询监护关系 */
export function getAdminVerificationsGuardians(client: ApiClient, params?: {
  guardian_user_id?: string;  // 监护人用户ID
  minor_user_id?: string;  // 未成年用户ID
}): Promise<ApiListResult<GuardianRelationshipResponse>> {
  return client.get(`/verification/api/v1/admin/verifications/guardians`, { params });
}

/** 列出提供方配置 */
export function getAdminVerificationsProviders(client: ApiClient, params?: {
  channel?: string;  // 通道类型过滤：ocr/verify/liveness
  is_active?: boolean;  // 是否仅查询已启用的配置
  page?: number;  // 页码，默认1
  page_size?: number;  // 每页数量，默认20
}): Promise<ApiListResult<ProviderConfigResponse>> {
  return client.get(`/verification/api/v1/admin/verifications/providers`, { params });
}

/** 创建提供方配置 */
export function postAdminVerificationsProviders(client: ApiClient, data: CreateProviderConfigRequest): Promise<ProviderConfigResponse> {
  return client.post(`/verification/api/v1/admin/verifications/providers`, data);
}

/** 删除提供方配置 */
export function deleteAdminVerificationsProvidersByProviders(client: ApiClient, providerConfigId: string): Promise<SimpleResponse> {
  return client.delete(`/verification/api/v1/admin/verifications/providers/${providerConfigId}`);
}

/** 获取提供方配置详情 */
export function getAdminVerificationsProvidersByProviders(client: ApiClient, providerConfigId: string): Promise<ProviderConfigResponse> {
  return client.get(`/verification/api/v1/admin/verifications/providers/${providerConfigId}`);
}

/** 更新提供方配置 */
export function putAdminVerificationsProvidersByProviders(client: ApiClient, providerConfigId: string, data: UpdateProviderConfigRequest): Promise<ProviderConfigResponse> {
  return client.put(`/verification/api/v1/admin/verifications/providers/${providerConfigId}`, data);
}

/** 获取认证统计 */
export function getAdminVerificationsStats(client: ApiClient): Promise<StatsResponse> {
  return client.get(`/verification/api/v1/admin/verifications/stats`);
}

/** 获取认证详情 */
export function getAdminVerificationsByVerifications(client: ApiClient, verificationId: string): Promise<AdminVerificationDetail> {
  return client.get(`/verification/api/v1/admin/verifications/${verificationId}`);
}

/** 转入人工审核 */
export function postAdminVerificationsManualReviewByVerifications(client: ApiClient, verificationId: string, data: ManualReviewRequest): Promise<AdminVerificationDetail> {
  return client.post(`/verification/api/v1/admin/verifications/${verificationId}/manual-review`, data);
}

/** 人工覆盖认证状态 */
export function postAdminVerificationsOverrideByVerifications(client: ApiClient, verificationId: string, data: OverrideRequest): Promise<AdminVerificationDetail> {
  return client.post(`/verification/api/v1/admin/verifications/${verificationId}/override`, data);
}

/** 重置重试计数 */
export function postAdminVerificationsResetByVerifications(client: ApiClient, verificationId: string): Promise<VerificationStatusResponse> {
  return client.post(`/verification/api/v1/admin/verifications/${verificationId}/reset`);
}

/** 解决人工审核 */
export function postAdminVerificationsResolveReviewByVerifications(client: ApiClient, verificationId: string, data: ResolveReviewRequest): Promise<AdminVerificationDetail> {
  return client.post(`/verification/api/v1/admin/verifications/${verificationId}/resolve-review`, data);
}

/** 授权同意 */
export function postVerificationConsent(client: ApiClient, data: GrantConsentRequest, params?: {
  verification_id: string;  // 认证ID
}): Promise<SimpleResponse> {
  return client.post(appendQuery(`/verification/api/v1/verification/consent`, params), data);
}

/** 解除监护关系 */
export function deleteVerificationGuardians(client: ApiClient, data: RemoveGuardianRequest): Promise<SimpleResponse> {
  return client.delete(`/verification/api/v1/verification/guardians`);
}

/** 创建监护关系 */
export function postVerificationGuardians(client: ApiClient, data: CreateGuardianRequest): Promise<GuardianRelationshipResponse> {
  return client.post(`/verification/api/v1/verification/guardians`, data);
}

/** 获取我的被监护人列表 */
export function getVerificationGuardiansMinors(client: ApiClient): Promise<ApiListResult<MinorProfileResponse>> {
  return client.get(`/verification/api/v1/verification/guardians/minors`);
}

/** 更新监护关系 */
export function putVerificationGuardiansByGuardians(client: ApiClient, guardianId: string, data: UpdateGuardianRequest): Promise<GuardianRelationshipResponse> {
  return client.put(`/verification/api/v1/verification/guardians/${guardianId}`, data);
}

/** 监护人授权同意 */
export function postVerificationGuardiansConsentByGuardians(client: ApiClient, guardianId: string, data: GuardianConsentRequest): Promise<GuardianRelationshipResponse> {
  return client.post(`/verification/api/v1/verification/guardians/${guardianId}/consent`, data);
}

/** 监护人身份验证 */
export function postVerificationGuardiansVerifyByGuardians(client: ApiClient, guardianId: string): Promise<GuardianRelationshipResponse> {
  return client.post(`/verification/api/v1/verification/guardians/${guardianId}/verify`);
}

/** 开始活体检测 */
export function postVerificationLivenessBegin(client: ApiClient, data: BeginLivenessRequest): Promise<BeginLivenessResponse> {
  return client.post(`/verification/api/v1/verification/liveness/begin`, data);
}

/** 完成活体检测 */
export function postVerificationLivenessVerify(client: ApiClient, data: CompleteLivenessRequest): Promise<LivenessResultResponse> {
  return client.post(`/verification/api/v1/verification/liveness/verify`, data);
}

/** 获取我的认证状态 */
export function getVerificationMe(client: ApiClient): Promise<VerificationStatusResponse> {
  return client.get(`/verification/api/v1/verification/me`);
}

/** 获取我的认证详情 */
export function getVerificationMeDetail(client: ApiClient): Promise<VerificationDetailResponse> {
  return client.get(`/verification/api/v1/verification/me/detail`);
}

/** 获取未成年用户的监护人列表 */
export function getVerificationMinorsGuardians(client: ApiClient, params?: {
  minor_user_id: string;  // 未成年人用户ID
}): Promise<ApiListResult<GuardianRelationshipResponse>> {
  return client.get(`/verification/api/v1/verification/minors/guardians`, { params });
}

/** 设置未成年人保护配置 */
export function putVerificationMinorsProtection(client: ApiClient, data: SetMinorProtectionRequest): Promise<GuardianRelationshipResponse> {
  return client.put(`/verification/api/v1/verification/minors/protection`, data);
}

/** 提交OCR识别 */
export function postVerificationOcr(client: ApiClient, data: SubmitOCRRequest): Promise<SubmitOCRResponse> {
  return client.post(`/verification/api/v1/verification/ocr`, data);
}

/** 提交身份核验 */
export function postVerificationVerify(client: ApiClient, data: SubmitVerificationRequest, params?: {
  verification_id: string;  // 认证ID
}): Promise<VerificationStatusResponse> {
  return client.post(appendQuery(`/verification/api/v1/verification/verify`, params), data);
}

