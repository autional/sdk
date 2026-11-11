/**
 * @autional/api-saml — Auto-generated from saml-service internal/docs/docs.go
 * Generated: 2026-11-11
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

export interface EraseUserSamlLinksRequest {
  tenantId: string;
  userId: string;
}

export interface SAMLSLOResponse {
  logoutCount?: number;
  message?: string;
  nameId?: string;
  status?: string;
}

export interface SAMLTokenResponse {
  accessToken?: string;
  expiresIn?: number;
  relayState?: string;
  tokenType?: string;
}

export interface SamlLinkedAccountItem {
  email?: string;
  id?: string;
  linkedAt?: string;
  nameId?: string;
  providerId?: string;
  providerName?: string;
}

export interface SamlLinkedAccountsResponse {
  items?: SamlLinkedAccountItem[];
}

export interface SamlProviderItem {
  allowIdpInitiated?: boolean;
  certificateExpiry?: string;
  createdAt?: string;
  defaultRedirectUri?: string;
  enabled?: boolean;
  entityId?: string;
  forceAuthn?: boolean;
  hasBackupCert?: boolean;
  id?: string;
  name?: string;
  nameIdFormat?: string;
  signAuthnEffective?: boolean;  // 生效值（合并全局默认 + provider 覆盖后），只读。
  signAuthnRequests?: boolean;
  signLogout?: boolean;
  signLogoutEffective?: boolean;
  sloUrl?: string;
  ssoUrl?: string;
  tenantId?: string;
  updatedAt?: string;
  wantAuthnSigned?: boolean;
}

export interface SamlProviderListData {
  providers?: SamlProviderItem[];
}

export interface SamlProviderRequest {
  allowIdpInitiated?: boolean;
  certificate: string;
  certificateBackup?: string;
  clearSigningOverrides?: boolean;
  defaultRedirectUri?: string;
  enabled?: boolean;
  entityId: string;
  forceAuthn?: boolean;
  name: string;
  nameIdFormat?: string;
  shouldClearBackup?: boolean;
  signAuthnRequests?: boolean;  // 三态：null/缺省 = 继承全局默认；true/false = 本 IdP 显式覆盖。
  signLogout?: boolean;
  sloUrl?: string;
  ssoUrl: string;
  wantAuthnSigned?: boolean;
}

export interface SamlSessionItem {
  createdAt?: string;
  expiresAt?: string;
  id?: string;
  nameId?: string;
  providerId?: string;
  sessionIndex?: string;
  tenantId?: string;
  userId?: string;
}

export interface SamlSigningPolicyRequest {
  clear?: boolean;
  clearSignAuthn?: boolean;
  clearSignLogout?: boolean;
  signAuthnRequests?: boolean;
  signLogout?: boolean;
}

export interface SamlUserLinkItem {
  createdAt?: string;
  email?: string;
  id?: string;
  nameId?: string;
  providerId?: string;
  tenantId?: string;
  updatedAt?: string;
  userId?: string;
}

export interface UpdateAttributeMappingRequest {
  mappings: Record<string, string>;
}


// ====== API Functions (tree-shakeable: independent exports) ======

/** 列出SAML IdP */
export function getAdminSamlProviders(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<SamlProviderListData> {
  return client.get(`/saml/api/v1/admin/saml/providers`, { params });
}

/** 注册SAML IdP */
export function postAdminSamlProviders(client: ApiClient, data: SamlProviderRequest): Promise<SamlProviderItem> {
  return client.post(`/saml/api/v1/admin/saml/providers`, data);
}

/** 删除SAML IdP */
export function deleteAdminSamlProvidersByProviders(client: ApiClient, providerId: string): Promise<SimpleResponse> {
  return client.delete(`/saml/api/v1/admin/saml/providers/${providerId}`);
}

/** 获取SAML IdP详情 */
export function getAdminSamlProvidersByProviders(client: ApiClient, providerId: string): Promise<SamlProviderItem> {
  return client.get(`/saml/api/v1/admin/saml/providers/${providerId}`);
}

/** 更新SAML IdP */
export function putAdminSamlProvidersByProviders(client: ApiClient, providerId: string, data: SamlProviderRequest): Promise<SamlProviderItem> {
  return client.put(`/saml/api/v1/admin/saml/providers/${providerId}`, data);
}

/** 更新属性映射 */
export function putAdminSamlProvidersAttributeMappingByProviders(client: ApiClient, providerId: string, data: UpdateAttributeMappingRequest): Promise<SimpleResponse> {
  return client.put(`/saml/api/v1/admin/saml/providers/${providerId}/attribute-mapping`, data);
}

/** 更新签名策略 */
export function putAdminSamlProvidersSigningByProviders(client: ApiClient, providerId: string, data: SamlSigningPolicyRequest): Promise<SimpleResponse> {
  return client.put(`/saml/api/v1/admin/saml/providers/${providerId}/signing`, data);
}

/** 查询SAML会话列表（管理端） */
export function getAdminSamlSessions(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
  sort_by?: string;  // 排序字段
  sort_order?: string;  // 排序方向 (asc/desc)
}): Promise<ApiListResult<SamlSessionItem>> {
  return client.get(`/saml/api/v1/admin/saml/sessions`, { params });
}

/** SP 签名状态 */
export function getAdminSamlSigningStatus(client: ApiClient): Promise<void> {
  return client.get(`/saml/api/v1/admin/saml/signing-status`);
}

/** 热加载 SAML 签名材料 */
export function postAdminSamlSigningReload(client: ApiClient): Promise<SimpleResponse> {
  return client.post(`/saml/api/v1/admin/saml/signing/reload`);
}

/** 查询用户SAML绑定列表（管理端） */
export function getAdminSamlUserLinks(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
  sort_by?: string;  // 排序字段
  sort_order?: string;  // 排序方向 (asc/desc)
}): Promise<ApiListResult<SamlUserLinkItem>> {
  return client.get(`/saml/api/v1/admin/saml/user-links`, { params });
}

/** 删除用户SAML绑定（管理端） */
export function deleteAdminSamlUserLinksByUserLinks(client: ApiClient, userLinkId: string): Promise<SimpleResponse> {
  return client.delete(`/saml/api/v1/admin/saml/user-links/${userLinkId}`);
}

/** SP-initiated SSO */
export function getSamlLoginBySaml(client: ApiClient, providerId: string): Promise<void> {
  return client.get(`/saml/api/v1/saml/${providerId}/login`);
}

/** 获取SP元数据 */
export function getSamlMetadataBySaml(client: ApiClient, providerId: string): Promise<string> {
  return client.get(`/saml/api/v1/saml/${providerId}/metadata`);
}

/** 单点登出 */
export function getSamlSloBySaml(client: ApiClient, providerId: string): Promise<SAMLSLOResponse> {
  return client.get(`/saml/api/v1/saml/${providerId}/slo`);
}

/** 单点登出 */
export function postSamlSloBySaml(client: ApiClient, providerId: string): Promise<SAMLSLOResponse> {
  return client.post(`/saml/api/v1/saml/${providerId}/slo`);
}

/** SP发起的SAML单点登出 */
export function getSamlSloSpBySaml(client: ApiClient, providerId: string, params?: {
  user_id: string;  // User ID
  session_index?: string;  // Session Index
}): Promise<void> {
  return client.get(`/saml/api/v1/saml/${providerId}/slo/sp`, { params });
}

