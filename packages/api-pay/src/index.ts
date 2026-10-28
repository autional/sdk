/**
 * @autional/api-pay — Auto-generated from pay-service internal/docs/docs.go
 * Generated: 2026-10-28
 * DO NOT EDIT — run `python sdk/scripts/generate-api-packages.py` to regenerate
 */

import type { ApiClient } from '@autional/core';

// ====== Types ======

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

export interface CreateChannelRequest {
  code: string;
  config: string;
  name: string;
  webhookSecret?: string;
}

export interface CreatePaymentRequest {
  amount: string;
  channelCode: string;
  currency?: string;
  idempotencyKey?: string;
  itemDescription?: string;
  targetId?: string;
  targetType?: string;
}

export interface EraseUserPaymentDataRequest {
  userId: string;
}

export interface ExportUserPaymentDataRequest {
  userId: string;
}

export interface RefundRequest {
  amount: string;
  idempotencyKey?: string;
  paymentId: string;
  reason?: string;
}

export interface UpdateChannelRequest {
  config?: string;
  name?: string;
  status?: string;
  webhookSecret?: string;
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

/** 验证支付事件账本完整性 */
export function getAdminPayIntegrityByIntegrity(client: ApiClient, payId: string): Promise<void> {
  return client.get(`/pay/api/v1/admin/pay/integrity/${payId}`);
}

/** 查询支付列表（管理端） */
export function getAdminPayments(client: ApiClient, params?: {
  app_id?: string;  // 应用ID
  status?: string;  // 支付状态
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<void> {
  return client.get(`/pay/api/v1/admin/payments`, { params });
}

/** 查询支付渠道列表 */
export function getAdminPaymentsChannels(client: ApiClient): Promise<void> {
  return client.get(`/pay/api/v1/admin/payments/channels`);
}

/** 创建支付渠道 */
export function postAdminPaymentsChannels(client: ApiClient, data: CreateChannelRequest): Promise<void> {
  return client.post(`/pay/api/v1/admin/payments/channels`, data);
}

/** 删除支付渠道 */
export function deleteAdminPaymentsChannelsByChannels(client: ApiClient, channelId: string): Promise<void> {
  return client.delete(`/pay/api/v1/admin/payments/channels/${channelId}`);
}

/** 查询支付渠道详情 */
export function getAdminPaymentsChannelsByChannels(client: ApiClient, channelId: string): Promise<void> {
  return client.get(`/pay/api/v1/admin/payments/channels/${channelId}`);
}

/** 更新支付渠道 */
export function putAdminPaymentsChannelsByChannels(client: ApiClient, channelId: string, data: UpdateChannelRequest): Promise<void> {
  return client.put(`/pay/api/v1/admin/payments/channels/${channelId}`, data);
}

/** 执行对账 */
export function postAdminPaymentsReconciliation(client: ApiClient, params?: {
  channel?: string;  // 支付渠道编码
  start_date?: string;  // 开始日期（YYYY-MM-DD）
  end_date?: string;  // 结束日期（YYYY-MM-DD）
}): Promise<void> {
  return client.post(appendQuery(`/pay/api/v1/admin/payments/reconciliation`, params));
}

/** 查询对账历史 */
export function getAdminPaymentsReconciliationHistory(client: ApiClient, params?: {
  channel?: string;  // 支付渠道编码
  start?: string;  // 开始日期（YYYY-MM-DD）
  end?: string;  // 结束日期（YYYY-MM-DD）
}): Promise<void> {
  return client.get(`/pay/api/v1/admin/payments/reconciliation/history`, { params });
}

/** 删除对账记录 */
export function deleteAdminPaymentsReconciliationByReconciliation(client: ApiClient, reconciliationId: string): Promise<void> {
  return client.delete(`/pay/api/v1/admin/payments/reconciliation/${reconciliationId}`);
}

/** 查询Webhook记录 */
export function getAdminPaymentsWebhooks(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<void> {
  return client.get(`/pay/api/v1/admin/payments/webhooks`, { params });
}

/** 删除Webhook记录 */
export function deleteAdminPaymentsWebhooksByWebhooks(client: ApiClient, webhookId: string): Promise<void> {
  return client.delete(`/pay/api/v1/admin/payments/webhooks/${webhookId}`);
}

/** 查询支付详情（管理端） */
export function getAdminPaymentsByPayments(client: ApiClient, paymentId: string): Promise<void> {
  return client.get(`/pay/api/v1/admin/payments/${paymentId}`);
}

/** 获取支付回执（管理端） */
export function getAdminPaymentsReceiptByPayments(client: ApiClient, paymentId: string): Promise<void> {
  return client.get(`/pay/api/v1/admin/payments/${paymentId}/receipt`);
}

/** 查询退款列表（管理端） */
export function getAdminRefunds(client: ApiClient, params?: {
  status?: string;  // 退款状态（pending/succeeded/failed）
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<void> {
  return client.get(`/pay/api/v1/admin/refunds`, { params });
}

/** 查询支付列表 */
export function getPayments(client: ApiClient, params?: {
  app_id?: string;  // 应用ID
  status?: string;  // 支付状态
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<void> {
  return client.get(`/pay/api/v1/payments`, { params });
}

/** 创建支付订单 */
export function postPayments(client: ApiClient, data: CreatePaymentRequest): Promise<void> {
  return client.post(`/pay/api/v1/payments`, data);
}

/** 创建退款 */
export function postPaymentsRefund(client: ApiClient, data: RefundRequest): Promise<void> {
  return client.post(`/pay/api/v1/payments/refund`, data);
}

/** 支付网关返回回调 */
export function getPaymentsReturnByReturn(client: ApiClient, channel: string, params?: {
  order_id: string;  // 支付订单ID
  status: string;  // 支付状态（success/fail/pending）
}): Promise<void> {
  return client.get(`/pay/api/v1/payments/return/${channel}`, { params });
}

/** 取消支付 */
export function deletePaymentsByPayments(client: ApiClient, paymentId: string): Promise<void> {
  return client.delete(`/pay/api/v1/payments/${paymentId}`);
}

/** 查询支付详情 */
export function getPaymentsByPayments(client: ApiClient, paymentId: string): Promise<void> {
  return client.get(`/pay/api/v1/payments/${paymentId}`);
}

/** 生成发票 */
export function postPaymentsInvoiceByPayments(client: ApiClient, paymentId: string): Promise<void> {
  return client.post(`/pay/api/v1/payments/${paymentId}/invoice`);
}

/** 获取支付回执 */
export function getPaymentsReceiptByPayments(client: ApiClient, paymentId: string): Promise<void> {
  return client.get(`/pay/api/v1/payments/${paymentId}/receipt`);
}

/** 查询退款详情 */
export function getPaymentsRefundByPayments(client: ApiClient, paymentId: string): Promise<void> {
  return client.get(`/pay/api/v1/payments/${paymentId}/refund`);
}

/** 查询支付退款列表 */
export function getPaymentsRefundsByPayments(client: ApiClient, paymentId: string): Promise<void> {
  return client.get(`/pay/api/v1/payments/${paymentId}/refunds`);
}

/** 查询退款详情 */
export function getRefundsByRefunds(client: ApiClient, refundId: string): Promise<void> {
  return client.get(`/pay/api/v1/refunds/${refundId}`);
}

/** 接收支付网关回调 */
export function postWebhooksPaymentByPayment(client: ApiClient, channel: string): Promise<void> {
  return client.post(`/pay/api/v1/webhooks/payment/${channel}`);
}

