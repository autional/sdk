/**
 * @autional/api-oauth — Auto-generated from oauth-service internal/docs/docs.go
 * Generated: 2026-10-31
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

export interface DeviceAuthorization {
  clientId?: string;
  createdAt?: string;
  delegatorPrincipalId?: string;  // DelegatorPrincipalID device 委托的**人类委托人**主体 id — F-32 / DEV-15 / ADR-013 D13-7 值域（冻结）：人类主体 = `auth_users.id`（`identity...
  deviceCode?: string;
  expiresAt?: string;
  id?: string;
  interval?: number;
  lastPolledAt?: string;
  pollCount?: number;
  scope?: string;
  status?: DeviceAuthorizationStatus;
  tenantId?: string;
  updatedAt?: string;
  userCode?: string;
  userId?: string;
}

export type DeviceAuthorizationStatus = "pending" | "authorized" | "denied" | "expired";

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

export interface AdminCreateProviderRequest {
  authUrl?: string;
  clientId: string;
  clientSecret: string;
  displayName?: string;
  enabled?: boolean;
  name: string;
  redirectUrl?: string;
  scopes?: string;
  tokenUrl?: string;
  userInfoUrl?: string;
}

export interface AdminToggleProviderRequest {
  enabled?: boolean;
}

export interface AdminUpdateProviderRequest {
  authUrl?: string;
  clientId?: string;
  clientSecret?: string;
  displayName?: string;
  redirectUrl?: string;
  scopes?: string;
  tokenUrl?: string;
  userInfoUrl?: string;
}

export interface AuthorizationDetailDTO {
  actions?: string[];  // 操作
  constraints?: Record<string, unknown>;  // 扩展约束
  dataTypes?: string[];  // 数据类型
  identifier?: string;  // 标识符
  locations?: string[];  // 位置
  Type?: string;  // 授权类型
}

/** OAuth授权URL响应 */
export interface AuthorizeURLResponse {
  authUrl?: string;  // 授权URL
  state?: string;  // 状态
}

export interface BatchRevokeUserTokensResponse {
  revokedAccessTokens?: number;
  revokedRefreshTokens?: number;
}

export interface BindInitiateRequest {
  provider: string;
  returnTo: string;
}

export interface BindInitiateResponse {
  authUrl?: string;  // 授权跳转URL
  state?: string;  // 签名后的 state
}

/** OAuth 2.0 Dynamic Client Registration request (RFC 7591 §2) */
export interface ClientRegistrationRequest {
  applicationType?: string;  // 应用类型
  clientName?: string;  // 客户端名称
  clientUri?: string;  // 客户端主页URL
  contacts?: string[];  // 联系人
  grantTypes?: string[];  // 授权类型
  jwks?: string;  // JWKS文档
  jwksUri?: string;  // JWKS URI
  logoUri?: string;  // Logo URL
  policyUri?: string;  // 隐私政策URL
  redirectUris: string[];  // 回调URI列表
  scope?: string;  // 权限范围
  softwareId?: string;  // 软件ID
  softwareVersion?: string;  // 软件版本
  tokenEndpointAuthMethod?: string;  // Token端点认证方法
  tosUri?: string;  // 服务条款URL
}

/** OAuth 2.0 Dynamic Client Registration response (RFC 7591 §2.1) */
export interface ClientRegistrationResponse {
  applicationType?: string;  // 应用类型
  clientId?: string;  // 客户端ID
  clientIdIssuedAt?: number;  // 客户端ID签发时间
  clientName?: string;  // 客户端名称
  clientSecret?: string;  // 客户端密钥
  clientSecretExpiresAt?: number;  // 客户端密钥过期时间(0=永不过期)
  clientUri?: string;  // 客户端主页URL
  contacts?: string[];  // 联系人
  grantTypes?: string[];  // 授权类型
  logoUri?: string;  // Logo URL
  policyUri?: string;  // 隐私政策URL
  redirectUris?: string[];  // 回调URI列表
  registrationAccessToken?: string;  // 注册管理Token
  registrationClientUri?: string;  // 注册管理URI
  scope?: string;  // 权限范围
  tokenEndpointAuthMethod?: string;  // 认证方法
  tosUri?: string;  // 服务条款URL
}

/** OAuth 2.0 Dynamic Client Registration update request (RFC 7591 §2.2) */
export interface ClientRegistrationUpdateRequest {
  applicationType?: string;
  clientName?: string;
  clientUri?: string;
  contacts?: string[];
  grantTypes?: string[];
  jwks?: string;
  jwksUri?: string;
  logoUri?: string;
  policyUri?: string;
  redirectUris?: string[];
  scope?: string;
  softwareId?: string;
  softwareVersion?: string;
  tokenEndpointAuthMethod?: string;
  tosUri?: string;
}

/** OAuth客户端令牌统计信息 */
export interface ClientStatsResponse {
  activeRefreshTokens?: number;
  activeTokens?: number;
  clientId?: string;
  lastRequestAt?: string;
}

/** 克隆客户端的结果，包含新客户端的 secret（仅返回一次） */
export interface CloneClientResponse {
  clientAuthMethods?: string;
  clientId?: string;
  clientSecret?: string;
  corsOrigins?: string[];
  fapiProfile?: string;
  grantTypes?: string[];
  id?: string;
  jwksUri?: string;
  name?: string;
  redirectUris?: string[];
  scopes?: string[];
  status?: string;
}

export interface ConsentCheckResult {
  hasConsent?: boolean;
}

export interface ConsentResponse {
  clientId?: string;
  clientName?: string;
  grantedAt?: string;
  id?: string;
  logoUri?: string;
  scopes?: string;
  website?: string;
}

export interface CreateClientRequest {
  clientAuthMethods?: string[];
  corsOrigins?: string[];
  fapiProfile?: string;
  grantTypes?: string[];
  isConfidential?: boolean;
  jwks?: string;
  jwksUri?: string;
  logoUrl?: string;
  name: string;
  postLogoutRedirectUris?: string[];
  privacyPolicy?: string;
  redirectUris: string[];
  scopes?: string[];
  termsUrl?: string;
  website?: string;
}

/** OAuth客户端创建结果 */
export interface CreateClientResponse {
  clientAuthMethods?: string;
  clientId?: string;
  clientSecret?: string;
  corsOrigins?: string[];
  fapiProfile?: string;
  grantTypes?: string[];
  id?: string;
  isConfidential?: boolean;
  jwks?: string;
  jwksUri?: string;
  logoUrl?: string;
  name?: string;
  postLogoutRedirectUris?: string[];  // PostLogoutRedirectURIs 登出回跳白名单（OIDC RP-Initiated Logout 1.0 独立注册面，ADR-1）
  privacyPolicy?: string;
  redirectUris?: string[];
  scopes?: string[];
  status?: string;
  termsUrl?: string;
  website?: string;
}

/** OAuth客户端密钥创建结果，secret_value 仅在此响应中返回一次 */
export interface CreateClientSecretResponse {
  createdAt?: string;
  secretId?: string;
  secretValue?: string;
  status?: string;
}

export interface DeviceAuthorizationListItem {
  clientId?: string;
  createdAt?: string;
  deviceCode?: string;
  expiresAt?: string;
  interval?: number;
  pollCount?: number;
  scope?: string;
  status?: string;
  updatedAt?: string;
  userCode?: string;
  userId?: string;
}

/** 设备码授权请求（RFC 8628 §3.1） */
export interface DeviceAuthorizationRequest {
  clientId: string;
  scope?: string;
}

/** 设备码授权响应（RFC 8628 §3.2） */
export interface DeviceAuthorizationResponse {
  deviceCode?: string;
  expiresIn?: number;
  interval?: number;
  userCode?: string;
  verificationUri?: string;
}

/** 用户在浏览器中授权设备（RFC 8628 §3.3） */
export interface DeviceAuthorizationVerifyRequest {
  approve?: boolean;
  userCode: string;
}

/** 在 InternalDeviceAuthorizeRequest 基础上追加可选 delegator_principal_id（人类委托人 principal id；省略 = 不记录） */
export interface InternalDeviceAuthorizeDelegatorRequest {
  delegatorPrincipalId?: string;
  operatorId?: string;
  userCode: string;
  userId?: string;
}

export interface InternalIntrospectResponse {
  active?: boolean;
  clientId?: string;
  exp?: number;
  scope?: string;
  userId?: string;
}

export interface LogoutResult {
  location?: string;
  loggedOut?: boolean;
}

export interface OAuthAuditLogItem {
  action?: string;
  id?: string;
  ip?: string;
  level?: string;
  message?: string;
  module?: string;
  operatorId?: string;
  operatorType?: string;
  status?: number;
  targetId?: string;
  targetType?: string;
  tenantId?: string;
  timestamp?: number;
}

/** OAuth授权回调结果 */
export interface OAuthCallbackResponse {
  provider?: string;  // 提供商
  state?: string;  // 状态
  token?: string;  // 令牌(已脱敏)
  userInfo?: Record<string, string>;  // 用户信息
}

export interface OAuthClientItem {
  clientAuthMethods?: string;
  clientId?: string;
  corsOrigins?: string[];
  createdAt?: string;
  deletedAt?: string;
  fapiProfile?: string;
  grantTypes?: string[];
  id?: string;
  isConfidential?: boolean;
  jwksUri?: string;
  logoUrl?: string;
  name?: string;
  postLogoutRedirectUris?: string[];  // PostLogoutRedirectURIs 登出回跳白名单（OIDC RP-Initiated Logout 1.0 独立注册面，ADR-1）
  privacyPolicy?: string;
  redirectUris?: string[];
  scopes?: string[];
  secretLastFour?: string;
  status?: string;
  tenantId?: string;
  termsUrl?: string;
  updatedAt?: string;
  website?: string;
}

/** OAuth客户端密钥列表 */
export interface OAuthClientSecretListData {
  secrets?: OAuthClientSecretResponse[];
}

/** OAuth客户端密钥信息，不含实际密钥值 */
export interface OAuthClientSecretResponse {
  createdAt?: string;
  description?: string;
  expiresAt?: string;
  lastUsedAt?: string;
  secretId?: string;
  status?: string;
  updatedAt?: string;
}

export interface OAuthConnectionItem {
  createdAt?: string;
  id?: string;
  profileData?: Record<string, unknown>;
  providerId?: string;
  providerUserId?: string;
  tenantId?: string;
  tokenExpiry?: string;
  updatedAt?: string;
  userId?: string;
}

export interface OAuthConnectionListData {
  connections?: OAuthConnectionItem[];
}

/** OAuth标准错误响应 */
export interface OAuthErrorResponse {
  error?: string;  // 错误码
  errorDescription?: string;  // 错误描述
  errorUri?: string;  // 错误URI
  state?: string;  // 状态
}

export interface OAuthProviderItem {
  authUrl?: string;
  clientId?: string;
  createdAt?: string;
  displayName?: string;
  enabled?: boolean;
  id?: string;
  name?: string;
  redirectUrl?: string;
  scopes?: string[];
  tenantId?: string;
  tokenUrl?: string;
  updatedAt?: string;
  userInfoUrl?: string;
}

export interface OAuthProviderListData {
  providers?: OAuthProviderItem[];
}

/** OAuth令牌信息，不包含令牌原文 */
export interface OAuthTokenItem {
  createdAt?: string;
  expiresAt?: string;
  scope?: string;
  tokenType?: string;
  userId?: string;
}

/** OAuth令牌响应 */
export interface OAuthTokenResponse {
  accessToken?: string;  // 访问令牌
  authorizationDetails?: AuthorizationDetailDTO[];  // RAR授权详情
  dpopAccessTokenBound?: boolean;  // 访问令牌DPoP绑定确认(RFC 9449)
  dpopSigningAlg?: string;  // DPoP签名算法(RFC 9449)
  expiresIn?: number;  // 过期秒数
  idToken?: string;  // OIDC ID令牌
  refreshToken?: string;  // 刷新令牌
  scope?: string;  // 范围
  tokenType?: string;  // 令牌类型
}

export interface OIDCUserInfoResponse {
  ageGroup?: string;
  birthdate?: string;
  clientId?: string;  // Internal
  familyName?: string;
  gender?: string;
  givenName?: string;
  isMinor?: boolean;  // Verification (age/minor status)
  locale?: string;
  name?: string;  // OIDC Standard Claims（可选，scope=profile 时填充）
  nickname?: string;
  picture?: string;
  preferredUsername?: string;
  scope?: string;
  sub?: string;  // 用户ID（必填）
  updatedAt?: number;
  website?: string;
  zoneinfo?: string;
}

export interface PublicClientInfo {
  clientName?: string;
  kind?: string;  // Kind 客户端用途分类（portal/idp；空 = 普通应用）。只用于同意页与接入工具 区分「租户门户客户端」与「应用客户端」，不暴露 redirect_uris / metadata 其它键。
  logoUri?: string;
  scopes?: string[];
  tenantId?: string;
}

/** PAR请求参数 */
export interface PushedAuthorizationRequest {
  authorizationDetails?: AuthorizationDetailDTO[];  // RAR授权详情
  clientId: string;  // 客户端ID
  clientSecret?: string;  // 客户端密钥
  codeChallenge?: string;  // 代码挑战
  codeChallengeMethod?: string;  // 挑战方法
  nonce?: string;  // 随机数
  redirectUri: string;  // 回调URI
  resources?: string[];  // 资源
  responseType: string;  // 响应类型
  scope: string;  // 范围
  state?: string;  // 状态
}

/** PAR响应 */
export interface PushedAuthorizationResponse {
  expiresIn?: number;  // 过期秒数
  requestUri?: string;  // 请求URI
}

/** 撤销客户端所有令牌的结果 */
export interface RevokeClientTokensResponse {
  gracePeriod?: number;
  revokedAccessTokens?: number;
  revokedRefreshTokens?: number;
}

/** OAuth风险评估结果 */
export interface RiskAssessmentResponse {
  assessmentId?: string;  // 评估ID
  recommendedActions?: string[];  // 建议操作
  requiresStepUp?: boolean;  // 需要增强
  riskIndicators?: string[];  // 风险指标
  riskLevel?: string;  // 风险等级
  riskScore?: number;  // 风险评分
}

export interface RotateSecretResponse {
  clientId?: string;
  newSecret?: string;
  rotatedAt?: string;
}

/** 令牌自检结果 */
export interface TokenIntrospectionResponse {
  active?: boolean;  // 是否有效
  aud?: string;  // 受众
  clientId?: string;  // 客户端ID
  exp?: number;  // 过期时间
  iat?: number;  // 签发时间
  scope?: string;  // 范围
  sub?: string;  // 用户ID
  tokenType?: string;  // 令牌类型
  username?: string;  // 用户名
}

export interface UpdateClientRequest {
  clientAuthMethods?: string[];
  corsOrigins?: string[];
  fapiProfile?: string;
  grantTypes?: string[];
  isConfidential?: boolean;
  jwks?: string;
  jwksUri?: string;
  logoUrl?: string;
  name?: string;
  postLogoutRedirectUris?: string[];
  privacyPolicy?: string;
  redirectUris?: string[];
  scopes?: string[];
  status?: string;
  termsUrl?: string;
  website?: string;
}

export interface UserOAuthExportResponse {
  connections?: OAuthConnectionItem[];
  consents?: ConsentResponse[];
}

export interface AuthorizeCodeResponse {
  code?: string;
  state?: string;
}

export interface AuthorizeRedirectResponse {
  redirectTo?: string;
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

/** 列出 OAuth 客户端 */
export function getAdminOauthClients(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
  name?: string;  // 按名称搜索
  status?: string;  // 按状态筛选（active/suspended）
}): Promise<ApiListResult<OAuthClientItem>> {
  return client.get(`/oauth/api/v1/admin/oauth/clients`, { params });
}

/** 创建 OAuth 客户端 */
export function postAdminOauthClients(client: ApiClient, data: CreateClientRequest): Promise<CreateClientResponse> {
  return client.post(`/oauth/api/v1/admin/oauth/clients`, data);
}

/** 按 Application 查询 OAuth 客户端 */
export function getAdminOauthClientsByApplicationByByApplication(client: ApiClient, appId: string): Promise<OAuthClientItem[]> {
  return client.get(`/oauth/api/v1/admin/oauth/clients/by-application/${appId}`);
}

/** Portal 访问统计 */
export function getAdminOauthClientsPortalStats(client: ApiClient): Promise<void> {
  return client.get(`/oauth/api/v1/admin/oauth/clients/portal-stats`);
}

/** 删除 OAuth 客户端 */
export function deleteAdminOauthClientsByClients(client: ApiClient, clientId: string): Promise<string> {
  return client.delete(`/oauth/api/v1/admin/oauth/clients/${clientId}`);
}

/** 获取 OAuth 客户端详情 */
export function getAdminOauthClientsByClients(client: ApiClient, clientId: string): Promise<OAuthClientItem> {
  return client.get(`/oauth/api/v1/admin/oauth/clients/${clientId}`);
}

/** 更新 OAuth 客户端配置 */
export function putAdminOauthClientsByClients(client: ApiClient, clientId: string, data: UpdateClientRequest): Promise<OAuthClientItem> {
  return client.put(`/oauth/api/v1/admin/oauth/clients/${clientId}`, data);
}

/** 获取 OAuth 客户端审计日志 */
export function getAdminOauthClientsAuditLogsByClients(client: ApiClient, clientId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<OAuthAuditLogItem>> {
  return client.get(`/oauth/api/v1/admin/oauth/clients/${clientId}/audit-logs`, { params });
}

/** 克隆 OAuth 客户端 */
export function postAdminOauthClientsCloneByClients(client: ApiClient, clientId: string): Promise<CloneClientResponse> {
  return client.post(`/oauth/api/v1/admin/oauth/clients/${clientId}/clone`);
}

/** 轮换 OAuth 客户端密钥 */
export function postAdminOauthClientsRotateSecretByClients(client: ApiClient, clientId: string): Promise<RotateSecretResponse> {
  return client.post(`/oauth/api/v1/admin/oauth/clients/${clientId}/rotate-secret`);
}

/** 列出 OAuth 客户端所有密钥 */
export function getAdminOauthClientsSecretsByClients(client: ApiClient, clientId: string): Promise<OAuthClientSecretListData> {
  return client.get(`/oauth/api/v1/admin/oauth/clients/${clientId}/secrets`);
}

/** 创建 OAuth 客户端密钥 */
export function postAdminOauthClientsSecretsByClients(client: ApiClient, clientId: string): Promise<CreateClientSecretResponse> {
  return client.post(`/oauth/api/v1/admin/oauth/clients/${clientId}/secrets`);
}

/** 删除 OAuth 客户端密钥 */
export function deleteAdminOauthClientsSecretsByClientsBySecrets(client: ApiClient, clientId: string, secretId: string): Promise<string> {
  return client.delete(`/oauth/api/v1/admin/oauth/clients/${clientId}/secrets/${secretId}`);
}

/** 停用 OAuth 客户端密钥 */
export function putAdminOauthClientsSecretsDeactivateByClientsBySecrets(client: ApiClient, clientId: string, secretId: string): Promise<OAuthClientSecretResponse> {
  return client.put(`/oauth/api/v1/admin/oauth/clients/${clientId}/secrets/${secretId}/deactivate`);
}

/** 获取 OAuth 客户端统计数据 */
export function getAdminOauthClientsStatsByClients(client: ApiClient, clientId: string): Promise<ClientStatsResponse> {
  return client.get(`/oauth/api/v1/admin/oauth/clients/${clientId}/stats`);
}

/** 撤销 OAuth 客户端所有令牌 */
export function deleteAdminOauthClientsTokensByClients(client: ApiClient, clientId: string, params?: {
  grace_period?: number;  // 宽限期（秒）
}): Promise<RevokeClientTokensResponse> {
  return client.delete(`/oauth/api/v1/admin/oauth/clients/${clientId}/tokens`, params);
}

/** 列出 OAuth 客户端活跃令牌 */
export function getAdminOauthClientsTokensByClients(client: ApiClient, clientId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<OAuthTokenItem>> {
  return client.get(`/oauth/api/v1/admin/oauth/clients/${clientId}/tokens`, { params });
}

/** 列出设备授权会话 */
export function getAdminOauthDevices(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
  status?: string;  // 状态过滤（pending/authorized/denied/expired）
  client_id?: string;  // 客户端ID过滤
}): Promise<ApiListResult<DeviceAuthorizationListItem>> {
  return client.get(`/oauth/api/v1/admin/oauth/devices`, { params });
}

/** 撤销设备授权 */
export function deleteAdminOauthDevicesByDevices(client: ApiClient, deviceCode: string): Promise<SimpleResponse> {
  return client.delete(`/oauth/api/v1/admin/oauth/devices/${deviceCode}`);
}

/** 列出OAuth提供商 */
export function getAdminOauthProviders(client: ApiClient): Promise<OAuthProviderListData> {
  return client.get(`/oauth/api/v1/admin/oauth/providers`);
}

/** 创建OAuth提供商 */
export function postAdminOauthProviders(client: ApiClient, data: AdminCreateProviderRequest): Promise<OAuthProviderItem> {
  return client.post(`/oauth/api/v1/admin/oauth/providers`, data);
}

/** 删除OAuth提供商 */
export function deleteAdminOauthProvidersByProviders(client: ApiClient, name: string): Promise<SimpleResponse> {
  return client.delete(`/oauth/api/v1/admin/oauth/providers/${name}`);
}

/** 更新OAuth提供商 */
export function putAdminOauthProvidersByProviders(client: ApiClient, name: string, data: AdminUpdateProviderRequest): Promise<OAuthProviderItem> {
  return client.put(`/oauth/api/v1/admin/oauth/providers/${name}`, data);
}

/** 启停OAuth提供商 */
export function putAdminOauthProvidersToggleByProviders(client: ApiClient, name: string, data: AdminToggleProviderRequest): Promise<SimpleResponse> {
  return client.put(`/oauth/api/v1/admin/oauth/providers/${name}/toggle`, data);
}

/** 批量撤销用户令牌 */
export function deleteAdminOauthTokensUserByUser(client: ApiClient, userId: string): Promise<BatchRevokeUserTokensResponse> {
  return client.delete(`/oauth/api/v1/admin/oauth/tokens/user/${userId}`);
}

/** OAuth 2.0 授权端点 */
export function getOauthAuthorize(client: ApiClient, params?: {
  response_type: string;  // 响应类型（仅支持 code）
  client_id: string;  // 客户端ID
  redirect_uri?: string;  // 重定向URI
  scope?: string;  // 请求的权限范围
  state?: string;  // 防CSRF状态参数
  iss?: string;  // Issuer URL（OAuth 2.1）
  nonce?: string;  // OIDC nonce 参数
  code_challenge?: string;  // PKCE Code Challenge（RFC 7636）
  code_challenge_method?: string;  // PKCE 方法（S256）
  authorization_details?: string;  // Authorization Details（RFC 9396）
  request_uri?: string;  // PAR Request URI（RFC 9126）
}): Promise<AuthorizeCodeResponse> {
  return client.get(`/oauth/api/v1/oauth/authorize`, { params });
}

/** OAuth 2.0 授权端点（POST） */
export function postOauthAuthorize(client: ApiClient, data: Record<string, unknown>): Promise<AuthorizeRedirectResponse> {
  return client.post(`/oauth/api/v1/oauth/authorize`, data);
}

/** 发起 OAuth 账号绑定 */
export function postOauthBindInitiate(client: ApiClient, data: BindInitiateRequest): Promise<BindInitiateResponse> {
  return client.post(`/oauth/api/v1/oauth/bind/initiate`, data);
}

/** 获取客户端公开信息 */
export function getOauthClientByClient(client: ApiClient, clientId: string): Promise<PublicClientInfo> {
  return client.get(`/oauth/api/v1/oauth/client/${clientId}`);
}

/** 获取 OAuth 连接列表 */
export function getOauthConnectionsByConnections(client: ApiClient, userId: string): Promise<OAuthConnectionListData> {
  return client.get(`/oauth/api/v1/oauth/connections/${userId}`);
}

/** 检查用户授权状态 */
export function getOauthConsentCheck(client: ApiClient, params?: {
  client_id: string;  // OAuth 客户端 ID
}): Promise<ConsentCheckResult> {
  return client.get(`/oauth/api/v1/oauth/consent/check`, { params });
}

/** 获取授权同意列表 */
export function getOauthConsents(client: ApiClient): Promise<ConsentResponse[]> {
  return client.get(`/oauth/api/v1/oauth/consents`);
}

/** 撤销授权同意 */
export function deleteOauthConsentsByConsents(client: ApiClient, id: string): Promise<SimpleResponse> {
  return client.delete(`/oauth/api/v1/oauth/consents/${id}`);
}

/** 设备授权请求 */
export function postOauthDeviceAuthorize(client: ApiClient, data: DeviceAuthorizationRequest): Promise<DeviceAuthorizationResponse> {
  return client.post(`/oauth/api/v1/oauth/device/authorize`, data);
}

/** 设备授权验证（用户侧） */
export function postOauthDeviceVerify(client: ApiClient, data: DeviceAuthorizationVerifyRequest): Promise<SimpleResponse> {
  return client.post(`/oauth/api/v1/oauth/device/verify`, data);
}

/** 获取 DPoP Nonce */
export function getOauthDpopNonce(client: ApiClient): Promise<string> {
  return client.get(`/oauth/api/v1/oauth/dpop/nonce`);
}

/** RP-Initiated Logout */
export function getOauthLogout(client: ApiClient, params?: {
  id_token_hint?: string;  // ID Token 提示（须为本服务签发且未过期，验签 + iss 校验）
  post_logout_redirect_uri?: string;  // 登出后重定向地址（精确匹配客户端注册 URI 白名单，否则忽略）
  state?: string;  // 状态参数，随重定向/location 原样返回（URL 转义）
  client_id?: string;  // 无 id_token_hint 时的客户端标识（白名单校验；确认页透传）
}): Promise<LogoutResult> {
  return client.get(`/oauth/api/v1/oauth/logout`, { params });
}

/** RP-Initiated Logout */
export function postOauthLogout(client: ApiClient, params?: {
  id_token_hint?: string;  // ID Token 提示（须为本服务签发且未过期，验签 + iss 校验）
  post_logout_redirect_uri?: string;  // 登出后重定向地址（精确匹配客户端注册 URI 白名单，否则忽略）
  state?: string;  // 状态参数，随重定向/location 原样返回（URL 转义）
  client_id?: string;  // 无 id_token_hint 时的客户端标识（白名单校验；确认页透传）
}): Promise<LogoutResult> {
  return client.post(appendQuery(`/oauth/api/v1/oauth/logout`, params));
}

/** 获取 OAuth 提供商列表 */
export function getOauthProviders(client: ApiClient): Promise<OAuthProviderListData> {
  return client.get(`/oauth/api/v1/oauth/providers`);
}

/** 推送授权请求（PAR） */
export function postOauthPushedAuthorization(client: ApiClient, data: PushedAuthorizationRequest): Promise<PushedAuthorizationResponse> {
  return client.post(`/oauth/api/v1/oauth/pushed-authorization`, data);
}

/** 动态客户端注册 */
export function postOauthRegister(client: ApiClient, data: ClientRegistrationRequest): Promise<ClientRegistrationResponse> {
  return client.post(`/oauth/api/v1/oauth/register`, data);
}

/** 删除客户端注册 */
export function deleteOauthRegisterByRegister(client: ApiClient, clientId: string): Promise<string> {
  return client.delete(`/oauth/api/v1/oauth/register/${clientId}`);
}

/** 读取客户端注册 */
export function getOauthRegisterByRegister(client: ApiClient, clientId: string): Promise<ClientRegistrationResponse> {
  return client.get(`/oauth/api/v1/oauth/register/${clientId}`);
}

/** 更新客户端注册 */
export function putOauthRegisterByRegister(client: ApiClient, clientId: string, data: ClientRegistrationUpdateRequest): Promise<ClientRegistrationResponse> {
  return client.put(`/oauth/api/v1/oauth/register/${clientId}`, data);
}

/** 获取OAuth客户端风险评估 */
export function getOauthRiskAssessment(client: ApiClient, params?: {
  client_id: string;  // OAuth客户端ID
}): Promise<RiskAssessmentResponse> {
  return client.get(`/oauth/api/v1/oauth/risk-assessment`, { params });
}

/** 解绑 OAuth 账号 */
export function deleteOauthUnbindByUnbind(client: ApiClient, connectionId: string): Promise<SimpleResponse> {
  return client.delete(`/oauth/api/v1/oauth/unbind/${connectionId}`);
}

/** 获取用户信息 */
export function getOauthUserinfo(client: ApiClient): Promise<OIDCUserInfoResponse> {
  return client.get(`/oauth/api/v1/oauth/userinfo`);
}

/** 获取 OAuth 授权 URL */
export function getOauthAuthorizeByOauth(client: ApiClient, provider: string, params?: {
  state?: string;  // OAuth state 参数
}): Promise<AuthorizeURLResponse> {
  return client.get(`/oauth/api/v1/oauth/${provider}/authorize`, { params });
}

/** OAuth 账号绑定回调 */
export function getOauthBindCallbackByOauth(client: ApiClient, provider: string, params?: {
  code?: string;  // 第三方返回的授权码
  state: string;  // 签名后的 state 参数
  error?: string;  // 第三方返回的错误码（用户拒绝授权）
}): Promise<void> {
  return client.get(`/oauth/api/v1/oauth/${provider}/bind/callback`, { params });
}

/** OAuth 授权回调 */
export function getOauthCallbackByOauth(client: ApiClient, provider: string, params?: {
  code: string;  // 第三方返回的授权码
  state: string;  // 签名后的 state 参数
}): Promise<OAuthCallbackResponse> {
  return client.get(`/oauth/api/v1/oauth/${provider}/callback`, { params });
}

