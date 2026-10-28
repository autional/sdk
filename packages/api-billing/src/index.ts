/**
 * @autional/api-billing — Auto-generated from billing-service internal/docs/docs.go
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

export interface FeatureGate {
  description?: string;  // 功能描述
  enabled?: boolean;  // 当前租户是否启用
  key?: string;  // "nhi", "mfa", "sso", "audit_export"
  name?: string;  // "Non-Human Identities" (展示名)
}

export interface TenantFeatureGateOverride {
  createdAt?: string;
  enabled?: boolean;
  gateKey?: string;
  id?: string;
  tenantId?: string;
  updatedAt?: string;
  updatedBy?: string;  // 审计列（AC 回归）：26→128 只扩不缩；API 已暴露故 json tag 不动
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

export interface AppBillingEventRequest {
  action: string;  // suspend/resume/delete
}

export interface AppResourcePricingInputDTO {
  includedUnits?: number;
  overageUnitPrice?: number;
  resourceType: string;
  unitLabel?: string;
  unitPrice?: number;
}

export interface AppResourcePricingResponse {
  id?: string;
  includedUnits?: number;
  overageUnitPrice?: number;
  resourceType?: string;
  subscriptionAppId?: string;
  unitLabel?: string;
  unitPrice?: number;
}

export interface BalanceResponse {
  balance?: number;
  currency?: string;
  frozenAmount?: number;
  userId?: string;
}

export interface BillingRecordResponse {
  amount?: number;
  appId?: string;
  billingCycle?: string;
  createdAt?: string;
  currency?: string;
  description?: string;
  invoiceNumber?: string;
  lineItems?: InvoiceLineItemResponse[];
  plan?: string;
  recordId?: string;
  status?: string;
  tenantId?: string;
  Type?: string;
}

export interface ConfigureAppPricingRequest {
  pricings: AppResourcePricingInputDTO[];
}

export interface CreateBillingRecordInternalRequest {
  amount: number;
  appId?: string;
  currency?: string;
  description?: string;
  invoiceNumber?: string;
  paymentMethod?: string;
  periodEnd: string;
  periodStart: string;
  status: string;
  subscriptionId: string;
}

export interface CreatePaymentGatewayRequest {
  code: string;
  config: string;
  name: string;
}

export interface CreatePlanRequest {
  auditLogDays?: number;
  currency?: string;
  description?: string;
  maxApiRequests?: number;
  maxBandwidthGb?: number;
  maxStorageGb?: number;
  maxUsers?: number;
  mfaEnabled?: boolean;
  monthlyPrice: number;
  name: string;
  plan: string;
  ssoEnabled?: boolean;
  supportLevel?: string;
  yearlyPrice: number;
}

export interface CreateUsageAlertRequest {
  appId?: string;
  name: string;
  notificationChannels: string;
  resourceType: string;
  thresholdPercent: number;
}

export interface CreditBalanceResponse {
  balance?: number;
  currency?: string;
  tenantId?: string;
  updatedAt?: string;
}

export interface CreditNoteRequest {
  amount: number;
  invoiceNumber: string;
  reason: string;
}

export interface CreditNoteResponse {
  amount?: number;
  appliedAt?: string;
  creditNoteNumber?: string;
  invoiceNumber?: string;
  issuedAt?: string;
  reason?: string;
  status?: string;
  tenantId?: string;
}

export interface CreditTransactionResponse {
  amount?: number;
  balance?: number;
  createdAt?: string;
  id?: string;
  remark?: string;
  source?: string;
  sourceId?: string;
  tenantId?: string;
  Type?: string;
}

export interface CurrentUsageResponse {
  apiCallsToday?: number;
  storageGb?: number;
  users?: number;
}

export interface DunningSettingsRequest {
  autoCancelDays?: number;
  emailTemplates?: string;
  gracePeriodDays?: number;
  retrySchedule?: string;
}

export interface DunningSettingsResponse {
  autoCancelDays?: number;
  createdAt?: string;
  emailTemplates?: string;
  gracePeriodDays?: number;
  retrySchedule?: string;
  status?: string;
  tenantId?: string;
  updatedAt?: string;
}

export interface EndpointStatsImportRecord {
  appId?: string;
  avgLatencyMs?: number;
  date: string;
  endpoint: string;
  errorCount?: number;
  requestCount?: number;
}

export interface EndpointStatsImportRequest {
  records: EndpointStatsImportRecord[];
}

export interface EndpointUsageItem {
  avgLatencyMs?: number;
  endpoint?: string;
  errorCount?: number;
  requestCount?: number;
}

export interface EndpointUsageListResponse {
  appId?: string;
  days?: number;
  endpoints?: EndpointUsageItem[];
  tenantId?: string;
}

export interface ExecuteRefundRequest {
  userId: string;
}

export interface ExecuteRefundResponse {
  amount?: number;
  refundId?: string;
  status?: string;
  walletTransactionId?: string;
}

export interface ExportUserDataRequest {
  userId: string;
}

export interface ExportUserDataResult {
  billingRecords?: BillingRecordResponse[];
  creditBalance?: CreditBalanceResponse;
  creditTransactions?: CreditTransactionResponse[];
  exportedAt?: string;
  meteredBillingRecords?: MeteredBillingExportItem[];
  note?: string;
  subscription?: SubscriptionResponse;
  tenantId?: string;
  usageAlerts?: UsageAlertResponse[];
  usageStats?: UsageStatsExportItem[];
  userId?: string;
}

export interface ExtendTrialRequest {
  extendDays: number;
}

export interface InvoiceLineItemResponse {
  amount?: number;
  description?: string;
  quantity?: number;
  resourceType?: string;
  taxAmount?: number;
  taxRate?: number;
  unitPrice?: number;
}

export interface InvoiceResponse {
  amount?: number;
  appId?: string;
  billingCycle?: string;
  currency?: string;
  dueDate?: string;
  invoiceNumber?: string;
  issuedAt?: string;
  lineItems?: InvoiceLineItemResponse[];
  paidAt?: string;
  plan?: string;
  status?: string;
  tenantId?: string;
}

export interface MeteredBillingExportItem {
  includedUnits?: number;
  overageAmount?: string;
  overageUnits?: number;
  periodEnd?: string;
  periodStart?: string;
  resourceType?: string;
  status?: string;
  totalUsage?: number;
}

export interface MeteredBillingResponse {
  appId?: string;
  id?: string;
  overageAmount?: string;
  overageUnits?: number;
  periodEnd?: string;
  periodStart?: string;
  resourceType?: string;
  status?: string;
  tenantId?: string;
  totalUsage?: number;
}

export interface MeteringReportRequest {
  amount: number;
  appId?: string;
  resourceType: string;
}

export interface PaymentGatewayResponse {
  code?: string;
  config?: string;
  createdAt?: string;
  id?: string;
  name?: string;
  status?: string;
  updatedAt?: string;
}

export interface PlanChangeRequest {
  billingCycle?: string;
  newPlan: string;
}

export type PlanPricingDetailResponse = Record<string, unknown>;

export type PlanPricingModelDetailResponse = Record<string, unknown>;

export interface PlanQuotasResponse {
  maxApiRequests?: number;
  maxBandwidthBytes?: number;
  maxEmailDaily?: number;
  maxSmsDaily?: number;
  maxStorageBytes?: number;
  maxUsers?: number;
  name?: string;
  plan?: string;
}

export interface ProrationCalculateRequest {
  billingCycle?: string;
  newPlan: string;
}

export interface ProrationCalculateResponse {
  currency?: string;
  currentBillingEnd?: string;
  currentPlan?: string;
  message?: string;
  prorationAmount?: number;
  remainingDays?: number;
  targetPlan?: string;
  tenantId?: string;
}

export type PublicPlansDetailResponse = Record<string, unknown>;

export interface QuotaCheckInternalRequest {
  appId?: string;
  requestedAmount: number;
  resourceType: string;
}

export interface QuotaCheckResponse {
  allowed?: boolean;
  current?: number;
  limit?: number;
  message?: string;
  remaining?: number;
  resourceType?: string;
}

export interface RefundApprovalRequest {
  amount: number;
  invoiceNumber: string;
  reason: string;
  reviewerComments?: string;
  transactionId: string;
}

export interface RefundApprovalResponse {
  amount?: number;
  approvedAt?: string;
  approvedBy?: string;
  invoiceNumber?: string;
  refundId?: string;
  status?: string;
  transactionId?: string;
}

export interface RevenueAmortizationItem {
  amount?: number;
  period?: string;
  status?: string;
}

export interface RevenueAmortizationResponse {
  amortizedAmount?: number;
  endDate?: string;
  items?: RevenueAmortizationItem[];
  pendingAmount?: number;
  startDate?: string;
  subscriptionId?: string;
  totalAmount?: number;
}

export interface SubscribeRequestDTO {
  autoRenew?: boolean;
  billingCycle: string;
  plan: string;
  trialDays?: number;
}

export interface SubscriptionAppResponse {
  appId?: string;
  createdAt?: string;
  id?: string;
  pricings?: AppResourcePricingResponse[];
  status?: string;
  subscriptionId?: string;
  tenantId?: string;
}

export interface SubscriptionResponse {
  adminUserId?: string;
  amount?: number;
  autoRenew?: boolean;
  billingCycle?: string;
  cancelAtPeriodEnd?: boolean;
  currency?: string;
  currentPeriodEnd?: string;
  currentPeriodStart?: string;
  gracePeriodDays?: number;
  planId?: string;
  status?: string;
  tenantId?: string;
  trialEndDate?: string;
}

export interface TaxExportResponse {
  downloadUrl?: string;
  expiresAt?: string;
  format?: string;
  period?: string;
  taxReportId?: string;
}

export interface TenantStatisticsResponse {
  activeUsers?: number;
  appId?: string;
  mrr?: number;
  retentionRate?: number;
  tenantId?: string;
  totalSpend?: number;  // UP-53：「未实现」与「真实 0」在契约上必须可区分——指针 + omitempty， 服务层未提供时字段整体省略（消费方渲染「暂不可用」），杜绝假 0 序列化。
}

export interface TrialActionResult {
  message?: string;
  plan?: string;
  status?: string;
  tenantId?: string;
  trialEndDate?: string;
}

export interface UpdatePaymentGatewayRequest {
  config?: string;
  name?: string;
  status?: string;
}

export interface UpdatePlanRequest {
  auditLogDays?: number;
  description?: string;
  maxApiRequests?: number;
  maxBandwidthGb?: number;
  maxStorageGb?: number;
  maxUsers?: number;
  mfaEnabled?: boolean;
  monthlyPrice?: number;
  name?: string;
  ssoEnabled?: boolean;
  status?: string;
  supportLevel?: string;
  yearlyPrice?: number;
}

export interface UpdateSubscriptionRequestDTO {
  autoRenew?: boolean;
  billingCycle?: string;
  plan?: string;
}

export interface UpdateUsageAlertRequest {
  name?: string;
  notificationChannels?: string;
  resourceType?: string;
  status?: string;
  thresholdPercent?: number;
}

export interface UsageAlertResponse {
  appId?: string;
  createdAt?: string;
  id?: string;
  lastTriggeredAt?: string;
  name?: string;
  notificationChannels?: string;
  resourceType?: string;
  status?: string;
  tenantId?: string;
  thresholdPercent?: number;
  updatedAt?: string;
}

export interface UsageStatItem {
  limit?: number;
  unit?: string;
  used?: number;
}

export interface UsageStatsExportItem {
  apiRequests?: number;
  bandwidthUsed?: number;
  date?: string;
  failedLogins?: number;
  loginAttempts?: number;
  mfaVerifications?: number;
  storageUsed?: number;
  userCount?: number;
}

export interface UsageStatsResponse {
  apiCalls?: UsageStatItem;
  appId?: string;
  periodEnd?: string;
  periodStart?: string;
  storage?: UsageStatItem;
  tenantId?: string;
  users?: UsageStatItem;
}

export interface UsageTimelinePoint {
  apiRequests?: number;
  bandwidthGb?: number;
  date?: string;
  storageGb?: number;
  users?: number;
}

export interface UsageTimelineResponse {
  appId?: string;
  days?: number;
  tenantId?: string;
  timeline?: UsageTimelinePoint[];
}

export interface PageInfo {
  hasNext?: boolean;  // HasNext indicates whether there is a next page
  hasPrev?: boolean;  // HasPrev indicates whether there is a previous page
  page?: number;  // Page is the current page number (1-based)
  pageSize?: number;  // PageSize is the number of items per page
  total?: number;  // Total is the total number of items across all pages
  totalPages?: number;  // TotalPages is the total number of pages
}

export interface FeatureGateCheckRequest {
  gateKey?: string;
}

export interface FeatureGateCheckResult {
  effective?: boolean;
  gateKey?: string;
  planEntitled?: boolean;
  tenantOverride?: boolean;
}

export interface FeatureGateResponse {
  featureGates?: FeatureGate[];
}

export interface OverrideRequest {
  enabled?: boolean;
  gateKey: string;
}

export interface OverrideResponse {
  overrides?: TenantFeatureGateOverride[];
}


// ====== API Functions (tree-shakeable: independent exports) ======

/** 列出用量告警（管理端） */
export function getAdminBillingAlerts(client: ApiClient, params?: {
  app_id?: string;  // 应用ID（可选）
  resource_type?: string;  // 资源类型（可选）
  status?: string;  // 告警状态（active/silenced/triggered）
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<UsageAlertResponse>> {
  return client.get(`/billing/api/v1/admin/billing/alerts`, { params });
}

/** 创建用量告警（管理端） */
export function postAdminBillingAlerts(client: ApiClient, data: CreateUsageAlertRequest): Promise<UsageAlertResponse> {
  return client.post(`/billing/api/v1/admin/billing/alerts`, data);
}

/** 删除用量告警（管理端） */
export function deleteAdminBillingAlertsByAlerts(client: ApiClient, alertId: string): Promise<void> {
  return client.delete(`/billing/api/v1/admin/billing/alerts/${alertId}`);
}

/** 更新用量告警（管理端） */
export function putAdminBillingAlertsByAlerts(client: ApiClient, alertId: string, data: UpdateUsageAlertRequest): Promise<UsageAlertResponse> {
  return client.put(`/billing/api/v1/admin/billing/alerts/${alertId}`, data);
}

/** 查询租户信用余额（管理端） */
export function getAdminBillingCreditBalanceByCreditBalance(client: ApiClient, tenantId: string): Promise<CreditBalanceResponse> {
  return client.get(`/billing/api/v1/admin/billing/credit-balance/${tenantId}`);
}

/** 删除红字发票 */
export function deleteAdminBillingCreditNoteByCreditNote(client: ApiClient, number: string): Promise<SimpleResponse> {
  return client.delete(`/billing/api/v1/admin/billing/credit-note/${number}`);
}

/** 获取红字发票详情 */
export function getAdminBillingCreditNoteByCreditNote(client: ApiClient, number: string): Promise<CreditNoteResponse> {
  return client.get(`/billing/api/v1/admin/billing/credit-note/${number}`);
}

/** 作废红字发票 */
export function putAdminBillingCreditNoteByCreditNote(client: ApiClient, number: string): Promise<SimpleResponse> {
  return client.put(`/billing/api/v1/admin/billing/credit-note/${number}`);
}

/** 信用票据列表 */
export function getAdminBillingCreditNotes(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<CreditNoteResponse>> {
  return client.get(`/billing/api/v1/admin/billing/credit-notes`, { params });
}

/** 查询信用交易记录（管理端） */
export function getAdminBillingCreditTransactionsByCreditTransactions(client: ApiClient, tenantId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  source?: string;  // 交易来源 (proration/refund/promo/manual_adjust)
}): Promise<ApiListResult<CreditTransactionResponse>> {
  return client.get(`/billing/api/v1/admin/billing/credit-transactions/${tenantId}`, { params });
}

/** 删除催缴配置 */
export function deleteAdminBillingDunningSettingsByDunningSettings(client: ApiClient, tenantId: string): Promise<Record<string, unknown>> {
  return client.delete(`/billing/api/v1/admin/billing/dunning-settings/${tenantId}`);
}

/** 获取催缴配置 */
export function getAdminBillingDunningSettingsByDunningSettings(client: ApiClient, tenantId: string): Promise<DunningSettingsResponse> {
  return client.get(`/billing/api/v1/admin/billing/dunning-settings/${tenantId}`);
}

/** 配置催缴策略 */
export function putAdminBillingDunningSettingsByDunningSettings(client: ApiClient, tenantId: string, data: DunningSettingsRequest): Promise<DunningSettingsResponse> {
  return client.put(`/billing/api/v1/admin/billing/dunning-settings/${tenantId}`, data);
}

/** 获取功能开关列表 */
export function getAdminBillingFeatureGates(client: ApiClient): Promise<FeatureGateResponse> {
  return client.get(`/billing/api/v1/admin/billing/feature-gates`);
}

/** 查询租户功能开关覆盖 */
export function getAdminBillingFeatureGatesOverrides(client: ApiClient): Promise<OverrideResponse> {
  return client.get(`/billing/api/v1/admin/billing/feature-gates/overrides`);
}

/** 创建或更新功能开关覆盖 */
export function putAdminBillingFeatureGatesOverrides(client: ApiClient, data: OverrideRequest): Promise<OverrideResponse> {
  return client.put(`/billing/api/v1/admin/billing/feature-gates/overrides`, data);
}

/** 清除功能开关覆盖 */
export function deleteAdminBillingFeatureGatesOverridesByOverrides(client: ApiClient, gateKey: string): Promise<OverrideResponse> {
  return client.delete(`/billing/api/v1/admin/billing/feature-gates/overrides/${gateKey}`);
}

/** 验证计费事件账本完整性 */
export function getAdminBillingIntegrityByIntegrity(client: ApiClient, subscriptionId: string): Promise<void> {
  return client.get(`/billing/api/v1/admin/billing/integrity/${subscriptionId}`);
}

/** 创建红字发票 */
export function postAdminBillingInvoiceCreditNoteByInvoice(client: ApiClient, invoiceNumber: string, data: CreditNoteRequest): Promise<CreditNoteResponse> {
  return client.post(`/billing/api/v1/admin/billing/invoice/${invoiceNumber}/credit-note`, data);
}

/** 计量计费记录 */
export function getAdminBillingMeteredUsageByMeteredUsage(client: ApiClient, tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
  start?: string;  // 开始日期 (YYYY-MM-DD)
  end?: string;  // 结束日期 (YYYY-MM-DD)
}): Promise<MeteredBillingResponse[]> {
  return client.get(`/billing/api/v1/admin/billing/metered-usage/${tenantId}`, { params });
}

/** 支付网关列表 */
export function getAdminBillingPaymentGateways(client: ApiClient, params?: {
  name_or_code?: string;  // 名称或代码模糊搜索
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PaymentGatewayResponse>> {
  return client.get(`/billing/api/v1/admin/billing/payment-gateways`, { params });
}

/** 创建支付网关 */
export function postAdminBillingPaymentGateways(client: ApiClient, data: CreatePaymentGatewayRequest): Promise<PaymentGatewayResponse> {
  return client.post(`/billing/api/v1/admin/billing/payment-gateways`, data);
}

/** 删除支付网关 */
export function deleteAdminBillingPaymentGatewaysByPaymentGateways(client: ApiClient, gatewayId: string): Promise<Record<string, unknown>> {
  return client.delete(`/billing/api/v1/admin/billing/payment-gateways/${gatewayId}`);
}

/** 获取支付网关详情 */
export function getAdminBillingPaymentGatewaysByPaymentGateways(client: ApiClient, gatewayId: string): Promise<PaymentGatewayResponse> {
  return client.get(`/billing/api/v1/admin/billing/payment-gateways/${gatewayId}`);
}

/** 更新支付网关 */
export function putAdminBillingPaymentGatewaysByPaymentGateways(client: ApiClient, gatewayId: string, data: UpdatePaymentGatewayRequest): Promise<PaymentGatewayResponse> {
  return client.put(`/billing/api/v1/admin/billing/payment-gateways/${gatewayId}`, data);
}

/** 获取套餐定价列表 */
export function getAdminBillingPlans(client: ApiClient): Promise<PlanPricingDetailResponse> {
  return client.get(`/billing/api/v1/admin/billing/plans`);
}

/** 创建套餐定价 */
export function postAdminBillingPlans(client: ApiClient, data: CreatePlanRequest): Promise<PlanPricingDetailResponse> {
  return client.post(`/billing/api/v1/admin/billing/plans`, data);
}

/** 删除套餐定价 */
export function deleteAdminBillingPlansByPlans(client: ApiClient, planId: string): Promise<Record<string, unknown>> {
  return client.delete(`/billing/api/v1/admin/billing/plans/${planId}`);
}

/** 更新套餐定价 */
export function putAdminBillingPlansByPlans(client: ApiClient, planId: string, data: UpdatePlanRequest): Promise<PlanPricingModelDetailResponse> {
  return client.put(`/billing/api/v1/admin/billing/plans/${planId}`, data);
}

/** 更新套餐功能开关 */
export function patchAdminBillingPlansFeatureGatesByPlans(client: ApiClient, planId: string, data: Record<string, unknown>): Promise<PlanPricingModelDetailResponse> {
  return client.patch(`/billing/api/v1/admin/billing/plans/${planId}/feature-gates`, data);
}

/** 作废计费记录 */
export function deleteAdminBillingRecordsByRecords(client: ApiClient, recordId: string): Promise<Record<string, unknown>> {
  return client.delete(`/billing/api/v1/admin/billing/records/${recordId}`);
}

/** 获取计费记录（管理端） */
export function getAdminBillingRecordsByRecords(client: ApiClient, tenantId: string, params?: {
  app_id?: string;  // 应用ID
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<BillingRecordResponse>> {
  return client.get(`/billing/api/v1/admin/billing/records/${tenantId}`, { params });
}

/** 提交退款审批 */
export function postAdminBillingRefundApproval(client: ApiClient, data: RefundApprovalRequest): Promise<RefundApprovalResponse> {
  return client.post(`/billing/api/v1/admin/billing/refund-approval`, data);
}

/** 删除退款审批 */
export function deleteAdminBillingRefundApprovalByRefundApproval(client: ApiClient, approvalId: string): Promise<SimpleResponse> {
  return client.delete(`/billing/api/v1/admin/billing/refund-approval/${approvalId}`);
}

/** 获取退款审批状态 */
export function getAdminBillingRefundApprovalByRefundApproval(client: ApiClient, approvalId: string): Promise<RefundApprovalResponse> {
  return client.get(`/billing/api/v1/admin/billing/refund-approval/${approvalId}`);
}

/** 审批通过退款 */
export function postAdminBillingRefundApprovalApproveByRefundApproval(client: ApiClient, approvalId: string): Promise<SimpleResponse> {
  return client.post(`/billing/api/v1/admin/billing/refund-approval/${approvalId}/approve`);
}

/** 执行退款审批 */
export function postAdminBillingRefundApprovalExecuteByRefundApproval(client: ApiClient, approvalId: string, data: ExecuteRefundRequest): Promise<ExecuteRefundResponse> {
  return client.post(`/billing/api/v1/admin/billing/refund-approval/${approvalId}/execute`, data);
}

/** 拒绝退款审批 */
export function postAdminBillingRefundApprovalRejectByRefundApproval(client: ApiClient, approvalId: string): Promise<SimpleResponse> {
  return client.post(`/billing/api/v1/admin/billing/refund-approval/${approvalId}/reject`);
}

/** 查询退款审批列表 */
export function getAdminBillingRefundApprovals(client: ApiClient, params?: {
  status?: string;  // 审批状态 (pending/approved/rejected/executed/completed)
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<RefundApprovalResponse>> {
  return client.get(`/billing/api/v1/admin/billing/refund-approvals`, { params });
}

/** 收入递延报表 */
export function getAdminBillingRevenueAmortization(client: ApiClient, params?: {
  start_date?: string;  // 开始日期 (YYYY-MM-DD)
  end_date?: string;  // 结束日期 (YYYY-MM-DD)
}): Promise<RevenueAmortizationResponse> {
  return client.get(`/billing/api/v1/admin/billing/revenue-amortization`, { params });
}

/** 获取租户统计（管理端） */
export function getAdminBillingStatisticsByStatistics(client: ApiClient, tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
}): Promise<TenantStatisticsResponse> {
  return client.get(`/billing/api/v1/admin/billing/statistics/${tenantId}`, { params });
}

/** 取消订阅 */
export function deleteAdminBillingSubscriptionBySubscription(client: ApiClient, tenantId: string): Promise<Record<string, unknown>> {
  return client.delete(`/billing/api/v1/admin/billing/subscription/${tenantId}`);
}

/** 获取订阅信息（管理端） */
export function getAdminBillingSubscriptionBySubscription(client: ApiClient, tenantId: string): Promise<SubscriptionResponse> {
  return client.get(`/billing/api/v1/admin/billing/subscription/${tenantId}`);
}

/** 更新订阅配置 */
export function putAdminBillingSubscriptionBySubscription(client: ApiClient, tenantId: string, data: UpdateSubscriptionRequestDTO): Promise<SubscriptionResponse> {
  return client.put(`/billing/api/v1/admin/billing/subscription/${tenantId}`, data);
}

/** 列出应用定价列表 */
export function getAdminBillingSubscriptionAppsBySubscription(client: ApiClient, tenantId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<Record<string, unknown>> {
  return client.get(`/billing/api/v1/admin/billing/subscription/${tenantId}/apps`, { params });
}

/** 删除应用定价 */
export function deleteAdminBillingSubscriptionAppsPricingBySubscriptionByApps(client: ApiClient, tenantId: string, appId: string): Promise<Record<string, unknown>> {
  return client.delete(`/billing/api/v1/admin/billing/subscription/${tenantId}/apps/${appId}/pricing`);
}

/** 获取应用定价 */
export function getAdminBillingSubscriptionAppsPricingBySubscriptionByApps(client: ApiClient, tenantId: string, appId: string): Promise<SubscriptionAppResponse> {
  return client.get(`/billing/api/v1/admin/billing/subscription/${tenantId}/apps/${appId}/pricing`);
}

/** 配置应用定价 */
export function postAdminBillingSubscriptionAppsPricingBySubscriptionByApps(client: ApiClient, tenantId: string, appId: string, data: ConfigureAppPricingRequest): Promise<SubscriptionAppResponse> {
  return client.post(`/billing/api/v1/admin/billing/subscription/${tenantId}/apps/${appId}/pricing`, data);
}

/** 取消试用期 */
export function postAdminBillingSubscriptionCancelTrialBySubscription(client: ApiClient, tenantId: string): Promise<TrialActionResult> {
  return client.post(`/billing/api/v1/admin/billing/subscription/${tenantId}/cancel-trial`);
}

/** 变更套餐 */
export function postAdminBillingSubscriptionChangePlanBySubscription(client: ApiClient, tenantId: string, data: PlanChangeRequest): Promise<Record<string, unknown>> {
  return client.post(`/billing/api/v1/admin/billing/subscription/${tenantId}/change-plan`, data);
}

/** 延长试用期 */
export function postAdminBillingSubscriptionExtendTrialBySubscription(client: ApiClient, tenantId: string, data: ExtendTrialRequest): Promise<TrialActionResult> {
  return client.post(`/billing/api/v1/admin/billing/subscription/${tenantId}/extend-trial`, data);
}

/** 回滚套餐 */
export function postAdminBillingSubscriptionRollbackPlanBySubscription(client: ApiClient, tenantId: string): Promise<SubscriptionResponse> {
  return client.post(`/billing/api/v1/admin/billing/subscription/${tenantId}/rollback-plan`);
}

/** 订阅列表 */
export function getAdminBillingSubscriptions(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<SubscriptionResponse>> {
  return client.get(`/billing/api/v1/admin/billing/subscriptions`, { params });
}

/** 税务导出 */
export function getAdminBillingTaxExport(client: ApiClient, params?: {
  tax_period?: string;  // 税务周期
  start_date?: string;  // 开始日期 (YYYY-MM-DD)
  end_date?: string;  // 结束日期 (YYYY-MM-DD)
  format?: string;  // 导出格式 (csv/json)
}): Promise<TaxExportResponse> {
  return client.get(`/billing/api/v1/admin/billing/tax-export`, { params });
}

/** 税务导出列表 */
export function getAdminBillingTaxExports(client: ApiClient, params?: {
  period?: string;  // 税务周期
}): Promise<ApiListResult<TaxExportResponse>> {
  return client.get(`/billing/api/v1/admin/billing/tax-exports`, { params });
}

/** 更新使用统计 */
export function putAdminBillingUsageStatsByUsageStatsByUsageId(client: ApiClient, tenantId: string, usageId: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
  return client.put(`/billing/api/v1/admin/billing/usage-stats/${tenantId}/${usageId}`, data);
}

/** 获取当前使用量（管理端） */
export function getAdminBillingUsageCurrentByUsage(client: ApiClient, tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
}): Promise<CurrentUsageResponse> {
  return client.get(`/billing/api/v1/admin/billing/usage/${tenantId}/current`, { params });
}

/** 获取端点用量TopN排行（管理端） */
export function getAdminBillingUsageEndpointsByUsage(client: ApiClient, tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
  limit?: number;  // 返回条数
  days?: number;  // 统计天数
}): Promise<EndpointUsageListResponse> {
  return client.get(`/billing/api/v1/admin/billing/usage/${tenantId}/endpoints`, { params });
}

/** 获取用量时间序列（管理端） */
export function getAdminBillingUsageTimelineByUsage(client: ApiClient, tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
  days?: number;  // 统计天数
}): Promise<UsageTimelineResponse> {
  return client.get(`/billing/api/v1/admin/billing/usage/${tenantId}/timeline`, { params });
}

/** 列出用量告警 */
export function getBillingAlerts(client: ApiClient, params?: {
  app_id?: string;  // 应用ID（可选）
  resource_type?: string;  // 资源类型（可选）
  status?: string;  // 告警状态（active/silenced/triggered）
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<UsageAlertResponse>> {
  return client.get(`/billing/api/v1/billing/alerts`, { params });
}

/** 创建用量告警 */
export function postBillingAlerts(client: ApiClient, data: CreateUsageAlertRequest): Promise<UsageAlertResponse> {
  return client.post(`/billing/api/v1/billing/alerts`, data);
}

/** 删除用量告警 */
export function deleteBillingAlertsByAlerts(client: ApiClient, alertId: string): Promise<void> {
  return client.delete(`/billing/api/v1/billing/alerts/${alertId}`);
}

/** 获取用量告警详情 */
export function getBillingAlertsByAlerts(client: ApiClient, alertId: string): Promise<UsageAlertResponse> {
  return client.get(`/billing/api/v1/billing/alerts/${alertId}`);
}

/** 更新用量告警 */
export function putBillingAlertsByAlerts(client: ApiClient, alertId: string, data: UpdateUsageAlertRequest): Promise<UsageAlertResponse> {
  return client.put(`/billing/api/v1/billing/alerts/${alertId}`, data);
}

/** 查询钱包余额 */
export function getBillingBalance(client: ApiClient): Promise<BalanceResponse> {
  return client.get(`/billing/api/v1/billing/balance`);
}

/** 查询租户信用余额 */
export function getBillingCreditBalanceByCreditBalance(client: ApiClient, tenantId: string): Promise<CreditBalanceResponse> {
  return client.get(`/billing/api/v1/billing/credit-balance/${tenantId}`);
}

/** 查询信用交易记录 */
export function getBillingCreditTransactionsByCreditTransactions(client: ApiClient, tenantId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  source?: string;  // 交易来源 (proration/refund/promo/manual_adjust)
}): Promise<ApiListResult<CreditTransactionResponse>> {
  return client.get(`/billing/api/v1/billing/credit-transactions/${tenantId}`, { params });
}

/** 获取当前租户功能开关 */
export function getBillingFeatureGates(client: ApiClient): Promise<FeatureGateResponse> {
  return client.get(`/billing/api/v1/billing/feature-gates`);
}

/** 获取发票详情 */
export function getBillingInvoiceByInvoice(client: ApiClient, invoiceNumber: string): Promise<InvoiceResponse> {
  return client.get(`/billing/api/v1/billing/invoice/${invoiceNumber}`);
}

/** 导出发票 */
export function getBillingInvoiceExportByInvoice(client: ApiClient, invoiceNumber: string, params?: {
  format?: string;  // 导出格式 (json/csv)
}): Promise<InvoiceResponse> {
  return client.get(`/billing/api/v1/billing/invoice/${invoiceNumber}/export`, { params });
}

/** 下载发票PDF */
export function getBillingInvoicePdfByInvoice(client: ApiClient, invoiceNumber: string): Promise<void> {
  return client.get(`/billing/api/v1/billing/invoice/${invoiceNumber}/pdf`);
}

/** 获取公开套餐列表 */
export function getBillingPlans(client: ApiClient): Promise<PublicPlansDetailResponse> {
  return client.get(`/billing/api/v1/billing/plans`);
}

/** 预览套餐变更按比例费用 */
export function postBillingProrationsCalculateByCalculate(client: ApiClient, tenantId: string, data: ProrationCalculateRequest): Promise<ProrationCalculateResponse> {
  return client.post(`/billing/api/v1/billing/prorations/calculate/${tenantId}`, data);
}

/** 获取计费记录 */
export function getBillingRecordsByRecords(client: ApiClient, tenantId: string, params?: {
  app_id?: string;  // 应用ID
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<BillingRecordResponse>> {
  return client.get(`/billing/api/v1/billing/records/${tenantId}`, { params });
}

/** 按应用获取计费记录 */
export function getBillingRecordsAppsByRecordsByApps(client: ApiClient, tenantId: string, appId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<BillingRecordResponse>> {
  return client.get(`/billing/api/v1/billing/records/${tenantId}/apps/${appId}`, { params });
}

/** 高级搜索计费记录 */
export function getBillingRecordsSearchByRecords(client: ApiClient, tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
  status?: string;  // 计费状态 (paid/failed/refunded/pending)
  date_from?: string;  // 开始日期 (YYYY-MM-DD)
  date_to?: string;  // 结束日期 (YYYY-MM-DD)
  min_amount?: number;  // 最低金额
  max_amount?: number;  // 最高金额
  search?: string;  // 关键词搜索
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<BillingRecordResponse>> {
  return client.get(`/billing/api/v1/billing/records/${tenantId}/search`, { params });
}

/** 获取租户统计 */
export function getBillingStatisticsByStatistics(client: ApiClient, tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
}): Promise<TenantStatisticsResponse> {
  return client.get(`/billing/api/v1/billing/statistics/${tenantId}`, { params });
}

/** 按应用获取租户统计 */
export function getBillingStatisticsAppsByStatisticsByApps(client: ApiClient, tenantId: string, appId: string): Promise<TenantStatisticsResponse> {
  return client.get(`/billing/api/v1/billing/statistics/${tenantId}/apps/${appId}`);
}

/** 订阅服务 */
export function postBillingSubscribe(client: ApiClient, data: SubscribeRequestDTO): Promise<SubscriptionResponse> {
  return client.post(`/billing/api/v1/billing/subscribe`, data);
}

/** 获取订阅信息 */
export function getBillingSubscriptionBySubscription(client: ApiClient, tenantId: string): Promise<SubscriptionResponse> {
  return client.get(`/billing/api/v1/billing/subscription/${tenantId}`);
}

/** 获取使用统计 */
export function getBillingUsageByUsage(client: ApiClient, tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
  start_date?: string;  // 开始日期 (YYYY-MM-DD)
  end_date?: string;  // 结束日期 (YYYY-MM-DD)
}): Promise<UsageStatsResponse> {
  return client.get(`/billing/api/v1/billing/usage/${tenantId}`, { params });
}

/** 按应用获取使用统计 */
export function getBillingUsageAppsByUsageByApps(client: ApiClient, tenantId: string, appId: string, params?: {
  start_date?: string;  // 开始日期 (YYYY-MM-DD)
  end_date?: string;  // 结束日期 (YYYY-MM-DD)
}): Promise<UsageStatsResponse> {
  return client.get(`/billing/api/v1/billing/usage/${tenantId}/apps/${appId}`, { params });
}

/** 按应用获取当前使用量 */
export function getBillingUsageAppsCurrentByUsageByApps(client: ApiClient, tenantId: string, appId: string): Promise<CurrentUsageResponse> {
  return client.get(`/billing/api/v1/billing/usage/${tenantId}/apps/${appId}/current`);
}

/** 获取当前使用量 */
export function getBillingUsageCurrentByUsage(client: ApiClient, tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
}): Promise<CurrentUsageResponse> {
  return client.get(`/billing/api/v1/billing/usage/${tenantId}/current`, { params });
}

/** 获取端点用量TopN排行 */
export function getBillingUsageEndpointsByUsage(client: ApiClient, tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
  limit?: number;  // 返回条数
  days?: number;  // 统计天数
}): Promise<EndpointUsageListResponse> {
  return client.get(`/billing/api/v1/billing/usage/${tenantId}/endpoints`, { params });
}

/** 获取用量时间序列 */
export function getBillingUsageTimelineByUsage(client: ApiClient, tenantId: string, params?: {
  app_id?: string;  // 应用ID（可选）
  days?: number;  // 统计天数
}): Promise<UsageTimelineResponse> {
  return client.get(`/billing/api/v1/billing/usage/${tenantId}/timeline`, { params });
}

