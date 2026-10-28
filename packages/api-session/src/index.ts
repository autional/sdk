/**
 * @autional/api-session — Auto-generated from session-service swagger.json
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

export interface AccessTokenResponse {
  accessToken?: string;
}

/** 当前活跃会话数量 */
export interface ActiveCountResponse {
  count?: number;  // 数量
  timestamp?: string;  // 时间
}

export interface ActiveSessionStatus {
  active?: boolean;
  sessionCount?: number;
}

/** 将令牌加入黑名单请求参数 */
export interface AddToBlacklistRequest {
  reason?: string;  // 原因
  token: string;  // 令牌
  tokenType: "access" | "refresh";  // 类型
  userId: string;  // 用户ID
}

export interface BatchRevokeResponse {
  failed?: string[];
  succeeded?: string[];
  total?: number;
}

/** 检查令牌是否在黑名单中 */
export interface BlacklistCheckResponse {
  blacklisted?: boolean;  // 是否黑名单
  reason?: string;  // 原因
  token?: string;  // 令牌
}

export interface BlacklistTokenRequest {
  appId?: string;  // 应用ID
  expiresAt?: number;  // 过期时间
  reason?: string;  // 原因
  token: string;  // 令牌
  tokenType: string;  // 类型
  userId: string;  // 用户ID
}

/** 黑名单令牌信息 */
export interface BlacklistedTokenResponse {
  createdAt?: string;
  expiresAt?: string;
  id?: string;
  reason?: string;
  tokenHash?: string;
  userId?: string;
}

export interface CreateSessionData {
  session?: SessionResponse;
  tokens?: TokenPairResponse;
}

/** 创建新会话请求参数 */
export interface CreateSessionRequest {
  amr?: string[];
  appId?: string;
  authUserId: string;
  browser?: string;
  deviceFingerprint?: string;
  deviceId?: string;
  deviceType?: string;
  ip?: string;
  os?: string;
  userAgent?: string;
}

export interface CreateTrustedDeviceRequest {
  browser?: string;
  deviceFingerprint: string;
  deviceType?: string;
  ip?: string;
  os?: string;
  userId: string;
}

/** 设备指纹信息 */
export interface DeviceFingerprintResponse {
  browser?: string;  // 浏览器
  deviceHash?: string;  // 哈希
  deviceType?: string;  // 类型
  fingerprintId?: string;  // 指纹ID
  firstSeenAt?: string;  // 首次
  ip?: string;  // IP
  isTrusted?: boolean;  // 是否信任
  lastSeenAt?: string;  // 最近
  location?: string;  // 位置
  os?: string;  // 系统
  screenRes?: string;  // 分辨率
}

export interface DeviceRiskResponse {
  activeSessions?: number;
  auditFailureCount?: number;
  deviceId?: string;
  evaluatedAt?: string;
  revokedSessions?: number;
  riskFactors?: string[];
  riskLevel?: string;
  riskScore?: number;
  totalSessions?: number;
}

export interface ExchangeTokenRequest {
  audience?: string;  // 目标受众
  grantType: string;  // 授权类型
  subjectToken: string;  // 主题令牌
}

export interface GenerateTokensRequest {
  appId?: string;  // 应用ID
  authUserId: string;  // 用户ID
  sessionId: string;  // 会话ID
  tenantId: string;  // 租户ID
}

export interface GetSessionData {
  session?: SessionResponse;
}

export interface IntrospectTokenRequest {
  token: string;  // 令牌
  Type?: string;  // access, refresh (optional hint)
}

/** 刷新访问令牌请求参数 */
export interface RefreshTokensRequest {
  refreshToken: string;  // 刷新令牌
}

export interface RevokeAllTokensRequest {
  reason?: string;  // 原因
  Type?: string;  // 为空则撤销所有类型
  userId?: string;  // 用户ID
}

/** 风险评估因素 */
export interface RiskFactor {
  description?: string;  // 描述
  score?: number;  // 评分
  Type?: string;  // 类型
  weight?: number;  // 权重
}

/** 会话风险评分结果 */
export interface RiskScoreResponse {
  evaluatedAt?: string;  // 评估时间
  factors?: RiskFactor[];  // 因素
  recommendedAction?: string;  // 建议
  riskLevel?: string;  // 等级
  riskScore?: number;  // 评分
  sessionId?: string;  // 会话ID
}

/** 用户会话信息 */
export interface SessionResponse {
  amr?: string;  // 认证方法引用
  authenticatedAt?: string;  // 认证时间
  createdAt?: string;  // 创建时间
  deviceId?: string;  // 设备ID
  deviceType?: string;  // 设备类型
  expiresAt?: string;  // 过期时间
  geoip?: string;  // GeoIP 地理位置
  id?: string;  // 会话ID
  idleExpiresAt?: string;  // 空闲过期时间
  ip?: string;  // IP
  lastActiveAt?: string;  // 最后活跃
  status?: string;  // 状态
  tenantId?: string;  // 租户ID
  userAgent?: string;  // UA
  userId?: string;  // 用户ID
}

/** 用户会话统计数据 */
export interface SessionStatsResponse {
  activeSessions?: number;  // 活跃
  deviceBreakdown?: Record<string, number>;  // 设备分布
  expiredSessions?: number;  // 过期
  revokedSessions?: number;  // 已撤销
  totalSessions?: number;  // 总会话数
  updatedAt?: string;  // 统计时间
  userId?: string;  // 用户ID
}

export interface TenantJWTConfigResponse {
  accessExpiry?: string;
  leeway?: string;
  refreshExpiry?: string;
  tenantId?: string;
}

export interface TokenExchangeResponse {
  accessToken?: string;
  audience?: string;
  expiresIn?: number;
  grantType?: string;
  refreshToken?: string;
  tokenType?: string;
}

/** 令牌详细信息 */
export interface TokenInfoResponse {
  createdAt?: string;  // 创建时间
  expiresAt?: string;  // 过期时间
  id?: string;  // 令牌ID
  ip?: string;  // IP
  status?: string;  // 状态
  tokenType?: string;  // 类型
  userAgent?: string;  // UA
  userId?: string;  // 用户ID
}

/** Token自省结果 */
export interface TokenIntrospectionResponse {
  active?: boolean;  // 是否有效
  clientId?: string;  // 客户端
  exp?: number;  // 过期
  iat?: number;  // 签发
  iss?: string;  // 签发者
  scope?: string;  // 范围
  sub?: string;  // 主题
  tokenType?: string;  // 类型
  username?: string;  // 用户名
}

/** 访问令牌和刷新令牌 */
export interface TokenPairResponse {
  accessToken?: string;  // 访问令牌
  expiresIn?: number;  // 过期秒数
  refreshToken?: string;  // 刷新令牌
  tokenType?: string;  // 类型
}

export interface TokenValidationResponse {
  claims?: unknown;
  error?: string;
  valid?: boolean;
}

export interface TrustDeviceRequest {
  deviceFingerprint: string;
  deviceName?: string;
}

export interface TrustedDeviceResponse {
  browser?: string;
  createdAt?: string;
  deviceFingerprint?: string;
  deviceName?: string;
  deviceType?: string;
  id?: string;
  ip?: string;
  os?: string;
  tenantId?: string;
  trustedUntil?: string;
  userId?: string;
}

export interface UpdateTenantJWTConfigRequest {
  accessExpiry: string;
  leeway?: string;
  refreshExpiry: string;
}

export interface UpgradeSessionMFAResponse {
  message?: string;
  mfaVerified?: boolean;
  sessionId?: string;
}

export interface UserSessionsExportResponse {
  sessions?: SessionResponse[];
  total?: number;
}

export interface ValidateAccessTokenRequest {
  accessToken: string;  // 访问令牌
  deviceFingerprint?: string;  // BindToDevice 检查
}


// ====== API Functions (tree-shakeable: independent exports) ======

/** 获取设备风险评分 */
export function getAdminDevicesRiskByDevices(client: ApiClient, deviceId: string): Promise<DeviceRiskResponse> {
  return client.get(`/session/api/v1/admin/devices/${deviceId}/risk`);
}

/** 管理员查询会话列表 */
export function getAdminSessions(client: ApiClient, params?: {
  user_id?: string;  // 用户ID（可选，用于筛选）
  status?: string;  // 会话状态（active/expired/revoked）
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<SessionResponse>> {
  return client.get(`/session/api/v1/admin/sessions`, { params });
}

/** 获取活跃会话数量 */
export function getAdminSessionsActiveCount(client: ApiClient): Promise<ActiveCountResponse> {
  return client.get(`/session/api/v1/admin/sessions/active-count`);
}

/** 批量撤销会话 */
export function deleteAdminSessionsBulk(client: ApiClient, data: Record<string, unknown>): Promise<BatchRevokeResponse> {
  return client.delete(`/session/api/v1/admin/sessions/bulk`);
}

/** 获取会话设备指纹 */
export function getAdminSessionsDeviceFingerprint(client: ApiClient, params?: {
  session_id?: string;  // 会话ID（可选）
}): Promise<DeviceFingerprintResponse> {
  return client.get(`/session/api/v1/admin/sessions/device-fingerprint`, { params });
}

/** 清理过期会话 */
export function deleteAdminSessionsExpired(client: ApiClient): Promise<SimpleResponse> {
  return client.delete(`/session/api/v1/admin/sessions/expired`);
}

/** 获取会话风险评分 */
export function getAdminSessionsRiskScore(client: ApiClient, params?: {
  session_id?: string;  // 会话ID（可选，不填则返回当前所有会话的汇总风险评分）
}): Promise<RiskScoreResponse> {
  return client.get(`/session/api/v1/admin/sessions/risk-score`, { params });
}

/** 获取会话统计 */
export function getAdminSessionsStats(client: ApiClient): Promise<SessionStatsResponse> {
  return client.get(`/session/api/v1/admin/sessions/stats`);
}

/** 撤销用户所有会话 */
export function deleteAdminSessionsUserByUser(client: ApiClient, userId: string, data: Record<string, unknown>): Promise<SimpleResponse> {
  return client.delete(`/session/api/v1/admin/sessions/user/${userId}`);
}

/** 查询令牌列表 */
export function getAdminTokens(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
  user_id?: string;  // 用户ID（可选，用于筛选）
  type?: string;  // 令牌类型（access/refresh）
  status?: string;  // 令牌状态（active/revoked/expired）
}): Promise<ApiListResult<TokenInfoResponse>> {
  return client.get(`/session/api/v1/admin/tokens`, { params });
}

/** 查询黑名单令牌列表 */
export function getAdminTokensBlacklist(client: ApiClient, params?: {
  user_id?: string;  // 用户ID（可选，用于筛选）
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<BlacklistedTokenResponse>> {
  return client.get(`/session/api/v1/admin/tokens/blacklist`, { params });
}

/** 删除黑名单令牌 */
export function deleteAdminTokensBlacklistByBlacklist(client: ApiClient, deviceId: string): Promise<SimpleResponse> {
  return client.delete(`/session/api/v1/admin/tokens/blacklist/${deviceId}`);
}

/** 重置租户级JWT配置 */
export function deleteAdminTokensConfig(client: ApiClient): Promise<SimpleResponse> {
  return client.delete(`/session/api/v1/admin/tokens/config`);
}

/** 获取租户级JWT配置 */
export function getAdminTokensConfig(client: ApiClient): Promise<TenantJWTConfigResponse> {
  return client.get(`/session/api/v1/admin/tokens/config`);
}

/** 更新租户级JWT配置 */
export function putAdminTokensConfig(client: ApiClient, data: UpdateTenantJWTConfigRequest): Promise<TenantJWTConfigResponse> {
  return client.put(`/session/api/v1/admin/tokens/config`, data);
}

/** 令牌交换 */
export function postAdminTokensExchange(client: ApiClient, data: ExchangeTokenRequest): Promise<TokenExchangeResponse> {
  return client.post(`/session/api/v1/admin/tokens/exchange`, data);
}

/** 令牌自省 */
export function postAdminTokensIntrospect(client: ApiClient, data: IntrospectTokenRequest): Promise<TokenIntrospectionResponse> {
  return client.post(`/session/api/v1/admin/tokens/introspect`, data);
}

/** 撤销所有令牌 */
export function postAdminTokensRevokeAll(client: ApiClient, data: RevokeAllTokensRequest): Promise<SimpleResponse> {
  return client.post(`/session/api/v1/admin/tokens/revoke-all`, data);
}

/** 获取令牌详情 */
export function getAdminTokensByTokens(client: ApiClient, deviceId: string): Promise<TokenInfoResponse> {
  return client.get(`/session/api/v1/admin/tokens/${deviceId}`);
}

/** Admin list trusted devices */
export function getAdminTrustedDevices(client: ApiClient, params?: {
  user_id: string;  // User ID
  page?: number;  // Page
  page_size?: number;  // Page size
}): Promise<ApiListResult<TrustedDeviceResponse>> {
  return client.get(`/session/api/v1/admin/trusted-devices`, { params });
}

/** Admin revoke trusted device */
export function deleteAdminTrustedDevicesByTrustedDevices(client: ApiClient, deviceId: string): Promise<SimpleResponse> {
  return client.delete(`/session/api/v1/admin/trusted-devices/${deviceId}`);
}

/** 查询用户会话列表 */
export function getSessions(client: ApiClient, params?: {
  auth_user_id: string;  // 认证用户ID
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<SessionResponse>> {
  return client.get(`/session/api/v1/sessions`, { params });
}

/** 创建会话 */
export function postSessions(client: ApiClient, data: CreateSessionRequest): Promise<CreateSessionData> {
  return client.post(`/session/api/v1/sessions`, data);
}

/** 刷新令牌 */
export function postSessionsRefresh(client: ApiClient, data: RefreshTokensRequest): Promise<TokenPairResponse> {
  return client.post(`/session/api/v1/sessions/refresh`, data);
}

/** 旋转访问令牌 */
export function postSessionsRotateAccess(client: ApiClient, data: RefreshTokensRequest): Promise<AccessTokenResponse> {
  return client.post(`/session/api/v1/sessions/rotate-access`, data);
}

/** 查询用户会话列表 */
export function getSessionsUserSessionsByUser(client: ApiClient, userId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<SessionResponse>> {
  return client.get(`/session/api/v1/sessions/user/${userId}/sessions`, { params });
}

/** 撤销会话 */
export function deleteSessionsBySessions(client: ApiClient, sessionId: string, data: Record<string, unknown>): Promise<void> {
  return client.delete(`/session/api/v1/sessions/${sessionId}`);
}

/** 获取会话详情 */
export function getSessionsBySessions(client: ApiClient, sessionId: string): Promise<GetSessionData> {
  return client.get(`/session/api/v1/sessions/${sessionId}`);
}

/** 更新会话活动时间 */
export function postSessionsActivityBySessions(client: ApiClient, sessionId: string): Promise<SimpleResponse> {
  return client.post(`/session/api/v1/sessions/${sessionId}/activity`);
}

/** 升级会话MFA验证状态 */
export function postSessionsUpgradeMfaBySessions(client: ApiClient, sessionId: string): Promise<UpgradeSessionMFAResponse> {
  return client.post(`/session/api/v1/sessions/${sessionId}/upgrade-mfa`);
}

/** 验证会话有效性 */
export function postSessionsValidateBySessions(client: ApiClient, sessionId: string): Promise<TokenValidationResponse> {
  return client.post(`/session/api/v1/sessions/${sessionId}/validate`);
}

/** 将令牌加入黑名单 */
export function postTokensBlacklist(client: ApiClient, data: AddToBlacklistRequest): Promise<SimpleResponse> {
  return client.post(`/session/api/v1/tokens/blacklist`, data);
}

/** 检查令牌黑名单状态 */
export function getTokensBlacklistCheck(client: ApiClient, params?: {
  token: string;  // 待检查的令牌
}): Promise<BlacklistCheckResponse> {
  return client.get(`/session/api/v1/tokens/blacklist/check`, { params });
}

/** List my trusted devices */
export function getTrustedDevices(client: ApiClient): Promise<ApiListResult<TrustedDeviceResponse>> {
  return client.get(`/session/api/v1/trusted-devices`);
}

/** Trust device */
export function postTrustedDevices(client: ApiClient, data: TrustDeviceRequest): Promise<SimpleResponse> {
  return client.post(`/session/api/v1/trusted-devices`, data);
}

/** Revoke my trusted device */
export function deleteTrustedDevicesByTrustedDevices(client: ApiClient, deviceId: string): Promise<SimpleResponse> {
  return client.delete(`/session/api/v1/trusted-devices/${deviceId}`);
}

// ====== Module Augmentation =====
// Installing this package auto-types useAutional().api.session

export interface SessionApi {
  getAdminDevicesRiskByDevices: typeof getAdminDevicesRiskByDevices;
  getAdminSessions: typeof getAdminSessions;
  getAdminSessionsActiveCount: typeof getAdminSessionsActiveCount;
  deleteAdminSessionsBulk: typeof deleteAdminSessionsBulk;
  getAdminSessionsDeviceFingerprint: typeof getAdminSessionsDeviceFingerprint;
  deleteAdminSessionsExpired: typeof deleteAdminSessionsExpired;
  getAdminSessionsRiskScore: typeof getAdminSessionsRiskScore;
  getAdminSessionsStats: typeof getAdminSessionsStats;
  deleteAdminSessionsUserByUser: typeof deleteAdminSessionsUserByUser;
  getAdminTokens: typeof getAdminTokens;
  getAdminTokensBlacklist: typeof getAdminTokensBlacklist;
  deleteAdminTokensBlacklistByBlacklist: typeof deleteAdminTokensBlacklistByBlacklist;
  deleteAdminTokensConfig: typeof deleteAdminTokensConfig;
  getAdminTokensConfig: typeof getAdminTokensConfig;
  putAdminTokensConfig: typeof putAdminTokensConfig;
  postAdminTokensExchange: typeof postAdminTokensExchange;
  postAdminTokensIntrospect: typeof postAdminTokensIntrospect;
  postAdminTokensRevokeAll: typeof postAdminTokensRevokeAll;
  getAdminTokensByTokens: typeof getAdminTokensByTokens;
  getAdminTrustedDevices: typeof getAdminTrustedDevices;
  deleteAdminTrustedDevicesByTrustedDevices: typeof deleteAdminTrustedDevicesByTrustedDevices;
  getSessions: typeof getSessions;
  postSessions: typeof postSessions;
  postSessionsRefresh: typeof postSessionsRefresh;
  postSessionsRotateAccess: typeof postSessionsRotateAccess;
  getSessionsUserSessionsByUser: typeof getSessionsUserSessionsByUser;
  deleteSessionsBySessions: typeof deleteSessionsBySessions;
  getSessionsBySessions: typeof getSessionsBySessions;
  postSessionsActivityBySessions: typeof postSessionsActivityBySessions;
  postSessionsUpgradeMfaBySessions: typeof postSessionsUpgradeMfaBySessions;
  postSessionsValidateBySessions: typeof postSessionsValidateBySessions;
  postTokensBlacklist: typeof postTokensBlacklist;
  getTokensBlacklistCheck: typeof getTokensBlacklistCheck;
  getTrustedDevices: typeof getTrustedDevices;
  postTrustedDevices: typeof postTrustedDevices;
  deleteTrustedDevicesByTrustedDevices: typeof deleteTrustedDevicesByTrustedDevices;
}

declare module '@autional/core' {
  interface RegisteredApis {
    session: SessionApi;
  }
}