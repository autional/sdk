/**
 * @autional/api-status — Auto-generated from status-service swagger.json
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

export type IncidentSeverity = "critical" | "major" | "minor" | "maintenance";

export type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved" | "draft";

export type MaintenanceStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

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

export interface AddIncidentUpdateRequest {
  message: string;
  status: IncidentStatus;
}

export interface CreateIncidentRequest {
  affectedServices?: string[];
  description?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
}

export interface CreateMaintenanceRequest {
  affectedServices?: string[];
  description?: string;
  scheduledEndAt: string;
  scheduledStartAt: string;
  title: string;
}

export interface DigestItemResponse {
  body?: string;
  email?: string;
  subject?: string;
  unsubscribeUrl?: string;
}

export interface DigestRequest {
  frequency: string;
}

export interface DigestResponse {
  count?: number;
  frequency?: string;
  items?: DigestItemResponse[];
}

export interface IncidentResponse {
  affectedServices?: string[];
  createdAt?: string;
  description?: string;
  id?: string;
  isDemo?: boolean;  // IsDemo 演示/测试夹具标记（U497）：公开面永不返回 true（夹具在服务端已被过滤）； 管理面列表可见 true，便于区分夹具与真实事件。
  resolvedAt?: string;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  title?: string;
  updatedAt?: string;
  updates?: IncidentUpdateResponse[];
}

export interface IncidentUpdateResponse {
  createdAt?: string;
  id?: string;
  message?: string;
  status?: IncidentStatus;
}

export interface JSONStatusResponse {
  activeIncidents?: number;
  lastUpdated?: string;
  overallStatus?: string;
  services?: ServiceStatusItem[];
  uptime?: string;
}

export interface LatencyMetricsResponse {
  available?: boolean;  // Available 标记 Prometheus 数据源是否可用（查询失败或未部署时为 false）
  points?: MetricsDataPoint[];
  range?: string;
  service?: string;
}

export interface MaintenanceResponse {
  affectedServices?: string[];
  createdAt?: string;
  description?: string;
  id?: string;
  isDemo?: boolean;  // IsDemo 演示/测试夹具标记（U497）—— 语义同 IncidentResponse.IsDemo。
  scheduledEndAt?: string;
  scheduledStartAt?: string;
  status?: MaintenanceStatus;
  title?: string;
  updatedAt?: string;
}

export interface MessageResponse {
  code?: number;
  message?: string;
}

export interface MetricsDataPoint {
  timestamp?: string;
  value?: number;
}

export interface OverviewResponse {
  activeIncidents?: number;
  lastUpdated?: string;
  overallStatus?: string;
  servicesHealthy?: number;
  servicesTotal?: number;
}

export interface ServiceCatalogItem {
  category?: string;
  description?: string;
  id?: string;
  name?: string;
  port?: number;
}

export interface ServiceCatalogResponse {
  allServices?: ServiceCatalogItem[];
  groups?: ServiceGroupItem[];
  lastUpdated?: string;
  totalCount?: number;
}

export interface ServiceGroupItem {
  description?: string;
  id?: string;
  name?: string;
  services?: ServiceCatalogItem[];
}

export interface ServiceStatusItem {
  id?: string;
  latency?: string;
  name?: string;
  status?: string;
  uptime7d?: string;
}

export interface SubscribeRequest {
  company?: string;
  email: string;
  message?: string;
  name?: string;
  phone?: string;
}

export interface SubscribeResponse {
  email?: string;
  id?: string;
  message?: string;
}

export interface SubscriptionListItem {
  categories?: string[];
  createdAt?: string;
  digestFrequency?: string;
  email?: string;
  id?: string;
  isVerified?: boolean;
  notifyIncidents?: boolean;
  notifyMaintenance?: boolean;
  notifyRecovery?: boolean;
}

export interface SubscriptionPreferencesRequest {
  categories?: string[];
  digestFrequency?: string;  // immediate, daily, weekly
  notifyIncidents?: boolean;
  notifyMaintenance?: boolean;
  notifyRecovery?: boolean;
  token: string;
}

export interface SubscriptionPreferencesResponse {
  categories?: string[];
  createdAt?: string;
  digestFrequency?: string;
  email?: string;
  notifyIncidents?: boolean;
  notifyMaintenance?: boolean;
  notifyRecovery?: boolean;
  updatedAt?: string;
  verified?: boolean;
}

export interface UnsubscribeRequest {
  token: string;
}

export interface UpdateIncidentRequest {
  affectedServices?: string[];
  description?: string;
  resolvedAt?: string;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  title?: string;
}

export interface UpdateMaintenanceRequest {
  affectedServices?: string[];
  description?: string;
  scheduledEndAt?: string;
  scheduledStartAt?: string;
  status?: MaintenanceStatus;
  title?: string;
}

export interface UptimeMetricsResponse {
  available?: boolean;  // Available 标记 Prometheus 数据源是否可用（查询失败或未部署时为 false）
  points?: MetricsDataPoint[];
  range?: string;
  service?: string;
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

/** 查询事件列表（管理面，含 demo 夹具） */
export function getStatusAdminIncidents(client: ApiClient, params?: {
  severity?: string;  // 严重级别
  status?: string;  // 事件状态
  service?: string;  // 影响的服务ID
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<IncidentResponse>> {
  return client.get(`/status/api/v1/status/admin/incidents`, { params });
}

/** 查询计划维护列表（管理面，含 demo 夹具） */
export function getStatusAdminMaintenances(client: ApiClient, params?: {
  status?: string;  // 维护状态
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<MaintenanceResponse>> {
  return client.get(`/status/api/v1/status/admin/maintenances`, { params });
}

/** SVG服务状态徽章 */
export function getStatusBadgeByBadge(client: ApiClient, service: string): Promise<string> {
  return client.get(`/status/api/v1/status/badge/${service}`);
}

/** 查询事件列表 */
export function getStatusIncidents(client: ApiClient, params?: {
  severity?: string;  // 严重级别: critical/major/minor/maintenance
  status?: string;  // 事件状态: investigating/identified/monitoring/resolved
  service?: string;  // 影响的服务ID
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<IncidentResponse>> {
  return client.get(`/status/api/v1/status/incidents`, { params });
}

/** 创建事件 */
export function postStatusIncidents(client: ApiClient, data: CreateIncidentRequest): Promise<IncidentResponse> {
  return client.post(`/status/api/v1/status/incidents`, data);
}

/** 删除事件 */
export function deleteStatusIncidentsByIncidents(client: ApiClient, incidentId: string): Promise<MessageResponse> {
  return client.delete(`/status/api/v1/status/incidents/${incidentId}`);
}

/** 查询事件详情 */
export function getStatusIncidentsByIncidents(client: ApiClient, incidentId: string): Promise<IncidentResponse> {
  return client.get(`/status/api/v1/status/incidents/${incidentId}`);
}

/** 更新事件 */
export function putStatusIncidentsByIncidents(client: ApiClient, incidentId: string, data: UpdateIncidentRequest): Promise<IncidentResponse> {
  return client.put(`/status/api/v1/status/incidents/${incidentId}`, data);
}

/** 添加事件进展更新 */
export function postStatusIncidentsUpdatesByIncidents(client: ApiClient, incidentId: string, data: AddIncidentUpdateRequest): Promise<IncidentUpdateResponse> {
  return client.post(`/status/api/v1/status/incidents/${incidentId}/updates`, data);
}

/** 机器可读系统状态 */
export function getStatusJson(client: ApiClient): Promise<JSONStatusResponse> {
  return client.get(`/status/api/v1/status/json`);
}

/** 查询计划维护列表 */
export function getStatusMaintenances(client: ApiClient, params?: {
  status?: string;  // 维护状态: scheduled/in_progress/completed/cancelled
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<MaintenanceResponse>> {
  return client.get(`/status/api/v1/status/maintenances`, { params });
}

/** 创建维护预告 */
export function postStatusMaintenances(client: ApiClient, data: CreateMaintenanceRequest): Promise<MaintenanceResponse> {
  return client.post(`/status/api/v1/status/maintenances`, data);
}

/** 删除维护预告 */
export function deleteStatusMaintenancesByMaintenances(client: ApiClient, maintenanceId: string): Promise<MessageResponse> {
  return client.delete(`/status/api/v1/status/maintenances/${maintenanceId}`);
}

/** 查询维护详情 */
export function getStatusMaintenancesByMaintenances(client: ApiClient, maintenanceId: string): Promise<MaintenanceResponse> {
  return client.get(`/status/api/v1/status/maintenances/${maintenanceId}`);
}

/** 更新维护预告 */
export function putStatusMaintenancesByMaintenances(client: ApiClient, maintenanceId: string, data: UpdateMaintenanceRequest): Promise<MaintenanceResponse> {
  return client.put(`/status/api/v1/status/maintenances/${maintenanceId}`, data);
}

/** 查询服务延迟趋势 */
export function getStatusMetricsLatency(client: ApiClient, params?: {
  service: string;  // 服务ID
  range?: string;  // 时间范围: 1h/24h/7d/30d
}): Promise<LatencyMetricsResponse> {
  return client.get(`/status/api/v1/status/metrics/latency`, { params });
}

/** 查询服务可用率趋势 */
export function getStatusMetricsUptime(client: ApiClient, params?: {
  service: string;  // 服务ID
  range?: string;  // 时间范围: 1h/24h/7d/30d
}): Promise<UptimeMetricsResponse> {
  return client.get(`/status/api/v1/status/metrics/uptime`, { params });
}

/** 系统状态概览 */
export function getStatusOverview(client: ApiClient): Promise<OverviewResponse> {
  return client.get(`/status/api/v1/status/overview`);
}

/** RSS事件与维护订阅源 */
export function getStatusRss(client: ApiClient): Promise<string> {
  return client.get(`/status/api/v1/status/rss`);
}

/** 获取服务目录 */
export function getStatusServices(client: ApiClient): Promise<ServiceCatalogResponse> {
  return client.get(`/status/api/v1/status/services`);
}

/** 取消订阅 */
export function deleteStatusSubscriptions(client: ApiClient, data: UnsubscribeRequest): Promise<MessageResponse> {
  return client.delete(`/status/api/v1/status/subscriptions`);
}

/** 查询订阅者列表 */
export function getStatusSubscriptions(client: ApiClient, params?: {
  verified?: boolean;  // 是否已验证
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<SubscriptionListItem>> {
  return client.get(`/status/api/v1/status/subscriptions`, { params });
}

/** 订阅状态通知 */
export function postStatusSubscriptions(client: ApiClient, data: SubscribeRequest): Promise<SubscribeResponse> {
  return client.post(`/status/api/v1/status/subscriptions`, data);
}

/** 查询订阅通知偏好 */
export function getStatusSubscriptionsPreferences(client: ApiClient, params?: {
  token: string;  // 订阅管理令牌（邮件内 manage 链接携带）
}): Promise<SubscriptionPreferencesResponse> {
  return client.get(`/status/api/v1/status/subscriptions/preferences`, { params });
}

/** 更新订阅通知偏好 */
export function putStatusSubscriptionsPreferences(client: ApiClient, data: SubscriptionPreferencesRequest): Promise<SubscriptionPreferencesResponse> {
  return client.put(`/status/api/v1/status/subscriptions/preferences`, data);
}

/** 验证订阅邮箱 */
export function postStatusSubscriptionsVerify(client: ApiClient, params?: {
  token: string;  // 邮件中的验证令牌
}): Promise<MessageResponse> {
  return client.post(appendQuery(`/status/api/v1/status/subscriptions/verify`, params));
}

