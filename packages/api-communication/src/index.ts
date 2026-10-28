/**
 * @autional/api-communication — Auto-generated from communication-service swagger.json
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

export interface ChannelRateLimitData {
  maxPerHour?: number;
  maxPerMin?: number;
  provider?: string;
  tenantId?: string;
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

export interface AvailableTemplateResponse {
  channel?: string;
  code?: string;
  isActive?: boolean;
  isCustomized?: boolean;
  locale?: string;
  name?: string;
  source?: string;  // platform | tenant
  subject?: string;
  variables?: string[];
}

/** 批量发送消息的请求参数 */
export interface BulkSendRequest {
  channel: "sms" | "email";
  content: string;
  purpose?: string;
  recipients: string[];
  subject?: string;
  template?: string;
  userId?: string;
  variables?: Record<string, string>;
}

/** 提供商回调结果 */
export interface CallbackResultResponse {
  provider?: string;
  received?: boolean;
}

/** 渠道连通性检查结果 */
export interface ChannelHealthResponse {
  channel?: string;
  message?: string;
  provider?: string;
  status?: string;
}

export interface CloneTemplateToLocaleRequest {
  content?: string;
  subject?: string;
  targetLocale: string;
}

/** 通信服务各渠道投递统计数据 */
export interface CommunicationDashboardResponse {
  byChannel?: Record<string, number>;
  byStatus?: Record<string, number>;
  delivered?: number;
  deliveryRate?: number;
  failed?: number;
  totalSent?: number;
}

/** 消息发送日志记录 */
export interface CommunicationLogResponse {
  channel?: string;
  content?: string;
  createdAt?: string;
  error?: string;
  id?: string;
  provider?: string;
  recipient?: string;
  response?: string;
  sentAt?: string;
  status?: string;
  templateId?: string;
  tenantId?: string;
  updatedAt?: string;
  userId?: string;
}

export interface CreateProviderConfigRequest {
  channel: "sms" | "email" | "push";
  config: string;
  priority?: number;
  provider: string;
}

/** 注册设备推送令牌的请求参数 */
export interface CreatePushTokenRequest {
  deviceId?: string;
  platform: "ios" | "android" | "web" | "desktop";
  token: string;
  userId: string;
}

/** 创建消息模板的请求参数 */
export interface CreateTemplateRequest {
  channel: "sms" | "email" | "push";
  code: string;
  content: string;
  contentType?: string;
  description?: string;
  format?: string;
  name: string;
  subject?: string;
  textContent?: string;
  variables?: string[];
}

/** 发送邮件请求参数 */
export interface EmailRequest {
  bcc?: string[];  // 密送
  cc?: string[];  // 抄送
  content?: string;  // 内容
  isHtml?: boolean;  // HTML格式
  listUnsubscribe?: boolean;  // ListUnsubscribe 退订头开关（WS-D D5）。缺省(nil) = 按 email.subscription_template_codes 配置判定； true = 显式加 List-Unsubscribe；false ...
  sendAt?: string;
  subject: string;  // 主题
  template?: string;  // 模板
  to: string[];  // 收件人
  userId?: string;  // 用户ID
  variables?: Record<string, string>;  // 变量
}

export interface EmailSuppressionResponse {
  bounceCount?: number;
  createdAt?: string;
  emailMasked?: string;
  expiresAt?: string;  // ExpiresAt 保留期到期时间（U3）。空 = 不过期（保留期配置为 0，或本列引入前的历史行）。 运维需要它来回答「这条抑制为什么会被自动解除」与「历史行何时被回收」。
  isActive?: boolean;
  lastBouncedAt?: string;
  provider?: string;
  reason?: string;  // hard_bounce | soft_bounce | complaint
}

export interface EraseUserDataRequest {
  userId: string;
}

export interface ExportUserDataRequest {
  userId: string;
}

export interface ExportUserDataResponse {
  logs?: unknown;
  subscriptions?: unknown;  // FIX-10：Web Push 订阅随职责迁入本服务，GDPR 导出同域覆盖（新增字段，可累加）
  tokens?: unknown;
}

export interface InternalPushSendRequest {
  body: string;
  data?: Record<string, unknown>;
  title: string;
  userId?: string;
}

export interface InternalRegisterPushSubscriptionRequest {
  appId?: string;
  deviceName?: string;
  deviceType?: string;
  endpoint: string;
  keys: PushSubscriptionKeys;
  userAgent?: string;
  userId: string;
}

/** 内部服务间统一发送消息的请求参数 */
export interface InternalSendRequest {
  channel: string;
  content?: string;
  metadata?: Record<string, string>;
  subject?: string;
  template?: string;
  to: string;
  userId?: string;
  variables?: Record<string, string>;
}

/** 内部统一发送接口的响应信息 */
export interface InternalSendResponse {
  channel?: string;
  messageId?: string;
  status?: string;
  to?: string;
}

/** 消息模板数据 */
export interface MessageTemplateResponse {
  channel?: string;
  code?: string;
  content?: string;
  contentType?: string;
  createdAt?: string;
  description?: string;
  id?: string;
  isActive?: boolean;
  name?: string;
  subject?: string;
  tenantId?: string;
  updatedAt?: string;
  variables?: string[];
  version?: number;
}

export interface OKResponse {
  code?: number;
  message?: string;
}

/** 模板预览渲染结果，包含渠道、主题、正文、纯文本版的渲染效果 */
export interface PreviewTemplateResponse {
  channel?: string;
  code?: string;
  content?: RenderedContent;
  contentType?: string;
  name?: string;
  subject?: RenderedContent;
  textContent?: RenderedContent;
}

export interface ProviderConfigResponse {
  appId?: string;
  channel?: string;
  config?: string;
  createdAt?: string;
  id?: string;
  isActive?: boolean;
  priority?: number;
  provider?: string;
  tenantId?: string;
  updatedAt?: string;
}

/** 发送推送通知请求参数 */
export interface PushRequest {
  body: string;  // 内容
  channel?: string;  // 渠道
  data?: Record<string, unknown>;  // 数据
  deviceToken?: string;  // 设备Token
  platform?: "all" | "ios" | "android" | "web" | "desktop";  // 平台
  title: string;  // 标题
  userId: string;  // 用户ID
}

/** 推送发送结果 */
export interface PushResultResponse {
  sent?: boolean;
  tokensFailed?: number;
  tokensSent?: number;
}

export interface PushSendResponse {
  failed?: number;
  sent?: number;
  total?: number;
}

export interface PushSubscriptionKeys {
  auth: string;
  p256dh: string;
}

/** Web Push 订阅信息 */
export interface PushSubscriptionResponse {
  createdAt?: string;
  deviceName?: string;
  deviceType?: string;
  endpoint?: string;
  id?: string;
}

/** 推送令牌信息 */
export interface PushTokenResponse {
  createdAt?: string;
  deviceId?: string;
  id?: string;
  isActive?: boolean;
  platform?: string;
  userId?: string;
}

/** 通信服务各发送渠道的速率限制配置 */
export interface RateLimitsResponse {
  email?: ChannelRateLimitData;
  push?: ChannelRateLimitData;
  sms?: ChannelRateLimitData;
}

export interface ReleaseEmailSuppressionResponse {
  released?: boolean;
}

export interface RenderedContent {
  error?: string;
  rendered?: string;
}

/** 发送短信请求参数 */
export interface SMSRequest {
  content?: string;  // 内容
  phone: string;  // 手机号
  purpose?: string;  // Purpose 业务场景（审计/路由/脱敏；可选，向后兼容）。
  sendAt?: string;
  template?: string;  // 模板
  userId?: string;  // 用户ID
  variables?: Record<string, string>;  // 变量
}

/** 模板详情数据（包含渲染示例） */
export interface TemplateDetailResponse {
  channel?: string;
  code?: string;
  content?: string;
  contentType?: string;
  createdAt?: string;
  description?: string;
  id?: string;
  isActive?: boolean;
  name?: string;
  renderExample?: string;
  subject?: string;
  tenantId?: string;
  updatedAt?: string;
  variables?: string[];
  version?: number;
}

/** 模板数据 */
export interface TemplateResponse {
  channel?: string;
  code?: string;
  content?: string;
  contentType?: string;
  createdAt?: string;
  description?: string;
  id?: string;
  isActive?: boolean;
  name?: string;
  subject?: string;
  tenantId?: string;
  updatedAt?: string;
  variables?: string[];
  version?: number;
}

export interface TemplateStatsResponse {
  channel?: string;
  delivered?: number;
  failed?: number;
  templateCode?: string;
  totalSent?: number;
}

export interface TemplateVersionResponse {
  changedBy?: string;
  channel?: string;
  code?: string;
  content?: string;
  contentType?: string;
  createdAt?: string;
  id?: string;
  name?: string;
  subject?: string;
  templateId?: string;
  textContent?: string;
  variables?: string;
  version?: number;
}

export interface UpdateProviderConfigRequest {
  config?: string;
  isActive?: boolean;
  priority?: number;
}

export interface UpdatePushTokenRequest {
  isActive?: boolean;
  userId: string;
}

/** 更新消息模板的请求参数 */
export interface UpdateTemplateRequest {
  content?: string;
  contentType?: string;
  description?: string;
  format?: string;
  isActive?: boolean;
  name?: string;
  subject?: string;
  textContent?: string;
  variables?: string[];
}

/** Web Push VAPID 公钥，前端注册 Push 订阅时使用 */
export interface VapidPublicKeyResponse {
  publicKey?: string;
}


// ====== API Functions (tree-shakeable: independent exports) ======

/** 获取通信仪表盘（管理端） */
export function getAdminCommunicationDashboard(client: ApiClient, params?: {
  days?: number;  // 统计天数范围（默认30天）
}): Promise<CommunicationDashboardResponse> {
  return client.get(`/communication/api/v1/admin/communication/dashboard`, { params });
}

/** 渠道连通性检查（管理端） */
export function getAdminCommunicationHealthByHealth(client: ApiClient, channel: string): Promise<ChannelHealthResponse> {
  return client.get(`/communication/api/v1/admin/communication/health/${channel}`);
}

/** 管理员查询任意用户的通信日志 */
export function getAdminCommunicationLogs(client: ApiClient, params?: {
  user_id?: string;  // 目标用户ID（不传返回全部用户的日志）
  channel?: string;  // 发送渠道筛选：sms/email/push
  status?: string;  // 发送状态筛选：pending/sent/failed/delivered
  page?: number;  // 页码，从1开始（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<CommunicationLogResponse>> {
  return client.get(`/communication/api/v1/admin/communication/logs`, { params });
}

/** 获取平台级通信仪表盘（跨租户） */
export function getAdminCommunicationPlatformStats(client: ApiClient): Promise<CommunicationDashboardResponse> {
  return client.get(`/communication/api/v1/admin/communication/platform-stats`);
}

/** 获取服务商配置列表（管理端） */
export function getAdminCommunicationProviders(client: ApiClient, params?: {
  channel?: string;  // 渠道筛选：sms/email/push
  is_active?: boolean;  // 激活状态筛选：true/false
  page?: number;  // 页码，从1开始（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<ProviderConfigResponse>> {
  return client.get(`/communication/api/v1/admin/communication/providers`, { params });
}

/** 创建服务商配置 */
export function postAdminCommunicationProviders(client: ApiClient, data: CreateProviderConfigRequest): Promise<ProviderConfigResponse> {
  return client.post(`/communication/api/v1/admin/communication/providers`, data);
}

/** 删除服务商配置 */
export function deleteAdminCommunicationProvidersByProviders(client: ApiClient, providerId: string): Promise<OKResponse> {
  return client.delete(`/communication/api/v1/admin/communication/providers/${providerId}`);
}

/** 更新服务商配置 */
export function putAdminCommunicationProvidersByProviders(client: ApiClient, providerId: string, data: UpdateProviderConfigRequest): Promise<ProviderConfigResponse> {
  return client.put(`/communication/api/v1/admin/communication/providers/${providerId}`, data);
}

/** 管理员查看限流配置 */
export function getAdminCommunicationRateLimits(client: ApiClient, params?: {
  channel?: string;  // 渠道筛选：sms/email/push（不传返回全部）
}): Promise<RateLimitsResponse> {
  return client.get(`/communication/api/v1/admin/communication/rate-limits`, { params });
}

/** 重发失败消息 */
export function postAdminCommunicationResendByResend(client: ApiClient, messageId: string): Promise<OKResponse> {
  return client.post(`/communication/api/v1/admin/communication/resend/${messageId}`);
}

/** 获取模板使用统计（近30天，管理端） */
export function getAdminCommunicationTemplateStats(client: ApiClient, params?: {
  channel?: string;  // 渠道筛选：sms/email/push
}): Promise<ApiListResult<TemplateStatsResponse>> {
  return client.get(`/communication/api/v1/admin/communication/template-stats`, { params });
}

/** 获取模板列表（管理端） */
export function getAdminCommunicationTemplates(client: ApiClient, params?: {
  channel?: string;  // 渠道筛选：sms/email/push
  is_active?: boolean;  // 是否激活筛选：true/false
  keyword?: string;  // 关键词搜索（匹配模板名称或编码）
  page?: number;  // 页码，从1开始（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<TemplateResponse>> {
  return client.get(`/communication/api/v1/admin/communication/templates`, { params });
}

/** 创建消息模板 */
export function postAdminCommunicationTemplates(client: ApiClient, data: CreateTemplateRequest): Promise<MessageTemplateResponse> {
  return client.post(`/communication/api/v1/admin/communication/templates`, data);
}

/** 删除（停用）模板 */
export function deleteAdminCommunicationTemplatesByTemplates(client: ApiClient, templateId: string): Promise<OKResponse> {
  return client.delete(`/communication/api/v1/admin/communication/templates/${templateId}`);
}

/** 更新消息模板 */
export function putAdminCommunicationTemplatesByTemplates(client: ApiClient, templateId: string, data: UpdateTemplateRequest): Promise<MessageTemplateResponse> {
  return client.put(`/communication/api/v1/admin/communication/templates/${templateId}`, data);
}

/** 将模板复制到其他语言环境 */
export function postAdminCommunicationTemplatesCloneToLocaleByTemplates(client: ApiClient, templateId: string, data: CloneTemplateToLocaleRequest): Promise<MessageTemplateResponse> {
  return client.post(`/communication/api/v1/admin/communication/templates/${templateId}/clone-to-locale`, data);
}

/** 预览模板渲染效果 */
export function postAdminCommunicationTemplatesPreviewByTemplates(client: ApiClient, templateId: string, data: Record<string, unknown>): Promise<PreviewTemplateResponse> {
  return client.post(`/communication/api/v1/admin/communication/templates/${templateId}/preview`, data);
}

/** 查询模板版本历史 */
export function getAdminCommunicationTemplatesVersionsByTemplates(client: ApiClient, templateId: string): Promise<ApiListResult<TemplateVersionResponse>> {
  return client.get(`/communication/api/v1/admin/communication/templates/${templateId}/versions`);
}

/** 批量发送消息 */
export function postCommunicationBulk(client: ApiClient, data: BulkSendRequest): Promise<ApiListResult<CommunicationLogResponse>> {
  return client.post(`/communication/api/v1/communication/bulk`, data);
}

/** 处理短信/邮件/推送服务商回调 */
export function postCommunicationCallbackByCallback(client: ApiClient, provider: string, data: Record<string, unknown>): Promise<CallbackResultResponse> {
  return client.post(`/communication/api/v1/communication/callback/${provider}`, data);
}

/** 获取通信投递仪表盘 */
export function getCommunicationDashboard(client: ApiClient, params?: {
  days?: number;  // 统计天数范围（默认30天）
}): Promise<CommunicationDashboardResponse> {
  return client.get(`/communication/api/v1/communication/dashboard`, { params });
}

/** 发送邮件 */
export function postCommunicationEmail(client: ApiClient, data: EmailRequest): Promise<CommunicationLogResponse> {
  return client.post(`/communication/api/v1/communication/email`, data);
}

/** 渠道连通性检查 */
export function getCommunicationHealthByHealth(client: ApiClient, channel: string): Promise<ChannelHealthResponse> {
  return client.get(`/communication/api/v1/communication/health/${channel}`);
}

/** 分页查询发送日志 */
export function getCommunicationLogs(client: ApiClient, params?: {
  user_id?: string;  // 用户ID（按当前登录用户自动过滤）
  channel?: string;  // 发送渠道筛选：sms/email/push
  status?: string;  // 发送状态筛选：pending/sent/failed/delivered
  page?: number;  // 页码，从1开始（默认1）
  page_size?: number;  // 每页条数（默认20，最大100）
}): Promise<ApiListResult<CommunicationLogResponse>> {
  return client.get(`/communication/api/v1/communication/logs`, { params });
}

/** 查询服务商配置列表 */
export function getCommunicationProviders(client: ApiClient, params?: {
  channel?: string;  // 渠道筛选：sms/email/push
  is_active?: boolean;  // 激活状态筛选：true/false
  page?: number;  // 页码，从1开始（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<ProviderConfigResponse>> {
  return client.get(`/communication/api/v1/communication/providers`, { params });
}

/** 获取服务商配置详情 */
export function getCommunicationProvidersByProviders(client: ApiClient, providerId: string): Promise<ProviderConfigResponse> {
  return client.get(`/communication/api/v1/communication/providers/${providerId}`);
}

/** 发送推送通知 */
export function postCommunicationPush(client: ApiClient, data: PushRequest): Promise<PushResultResponse> {
  return client.post(`/communication/api/v1/communication/push`, data);
}

/** 查询推送令牌列表 */
export function getCommunicationPushTokens(client: ApiClient, params?: {
  user_id?: string;  // 用户ID（自动从JWT获取当前用户）
  platform?: string;  // 平台筛选：ios/android/web/desktop
  page?: number;  // 页码，从1开始（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<PushTokenResponse>> {
  return client.get(`/communication/api/v1/communication/push-tokens`, { params });
}

/** 注册设备推送令牌 */
export function postCommunicationPushTokens(client: ApiClient, data: CreatePushTokenRequest): Promise<PushTokenResponse> {
  return client.post(`/communication/api/v1/communication/push-tokens`, data);
}

/** 注销推送令牌 */
export function deleteCommunicationPushTokensByPushTokens(client: ApiClient, pushTokenId: string): Promise<OKResponse> {
  return client.delete(`/communication/api/v1/communication/push-tokens/${pushTokenId}`);
}

/** 更新推送令牌激活状态 */
export function putCommunicationPushTokensByPushTokens(client: ApiClient, pushTokenId: string, data: UpdatePushTokenRequest): Promise<OKResponse> {
  return client.put(`/communication/api/v1/communication/push-tokens/${pushTokenId}`, data);
}

/** 查询各渠道速率限制 */
export function getCommunicationRateLimits(client: ApiClient, params?: {
  channel?: string;  // 渠道筛选：sms/email/push（不传返回全部）
}): Promise<RateLimitsResponse> {
  return client.get(`/communication/api/v1/communication/rate-limits`, { params });
}

/** 取消定时发送消息 */
export function deleteCommunicationScheduledByScheduled(client: ApiClient, messageId: string): Promise<OKResponse> {
  return client.delete(`/communication/api/v1/communication/scheduled/${messageId}`);
}

/** 发送短信 */
export function postCommunicationSms(client: ApiClient, data: SMSRequest): Promise<CommunicationLogResponse> {
  return client.post(`/communication/api/v1/communication/sms`, data);
}

/** 获取模板使用统计（近30天） */
export function getCommunicationTemplateStats(client: ApiClient, params?: {
  channel?: string;  // 渠道筛选：sms/email/push
}): Promise<ApiListResult<TemplateStatsResponse>> {
  return client.get(`/communication/api/v1/communication/template-stats`, { params });
}

/** 获取模板列表 */
export function getCommunicationTemplates(client: ApiClient, params?: {
  channel?: string;  // 渠道筛选：sms/email/push
  is_active?: boolean;  // 是否激活筛选：true/false
  keyword?: string;  // 关键词搜索（匹配模板名称或编码）
  page?: number;  // 页码，从1开始（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<TemplateResponse>> {
  return client.get(`/communication/api/v1/communication/templates`, { params });
}

/** 获取可用模板列表（含平台默认模板） */
export function getCommunicationTemplatesAvailable(client: ApiClient, params?: {
  locale?: string;  // 语言区域：zh-CN/en-US（默认zh-CN）
}): Promise<ApiListResult<AvailableTemplateResponse>> {
  return client.get(`/communication/api/v1/communication/templates/available`, { params });
}

/** 获取模板详情 */
export function getCommunicationTemplatesByTemplates(client: ApiClient, templateId: string): Promise<TemplateDetailResponse> {
  return client.get(`/communication/api/v1/communication/templates/${templateId}`);
}

