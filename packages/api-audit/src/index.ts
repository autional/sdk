/**
 * @autional/api-audit — Auto-generated from audit-service internal/docs/docs.go
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

export interface AuditTenantConfig {
  bruteForceMinAttempts?: number;
  bruteForceSeverityCritical?: number;
  bruteForceSeverityHigh?: number;
  createdAt?: string;
  id?: string;
  offHoursEnd?: number;
  offHoursMinEvents?: number;
  offHoursStart?: number;
  tenantId?: string;
  updatedAt?: string;
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

/** 添加异常调查评论 */
export interface AddAnomalyCommentRequest {
  content: string;  // 评论内容
}

export interface AddIncidentCommentRequest {
  content: string;
}

export interface AlertResponse {
  acknowledgedAt?: string;
  assignee?: string;
  createdAt?: string;
  escalatedAt?: string;
  id?: string;
  message?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  severity?: string;
  source?: string;
  status?: string;
  tenantId?: string;
  title?: string;
  Type?: string;
  updatedAt?: string;
}

/** 异常调查评论 */
export interface AnomalyCommentResponse {
  authorId?: string;  // 评论者ID
  authorName?: string;  // 评论者名
  content?: string;  // 内容
  createdAt?: number;  // 时间戳
  id?: string;  // 评论ID
}

/** 审计异常记录 */
export interface AnomalyResponse {
  assignee?: string;  // 分析师
  comments?: AnomalyCommentResponse[];  // 评论
  createdAt?: number;  // 创建时间戳
  description?: string;  // 描述
  detectedAt?: number;  // 检测时间戳
  eventIds?: string[];  // 关联事件ID
  id?: string;  // 异常ID
  mitreTactic?: string;  // MITRE战术
  relatedCaseId?: string;  // 关联案件ID
  resolvedAt?: number;  // 解决时间戳
  resolvedBy?: string;  // 解决者
  severity?: string;  // 严重程度
  status?: string;  // 状态
  tenantId?: string;  // 租户ID
  Type?: string;  // 类型
  updatedAt?: number;  // 更新时间戳
  userId?: string;  // 用户ID
}

/** 异常关联的用户事件时间线，包含设备/会话上下文 */
export interface AnomalyTimelineResponse {
  anomaly?: AnomalyResponse;
  context?: ContextSummary;
  events?: AuditLogResponse[];
  loginSessions?: DeviceSummary[];
}

/** 审计日志归档操作结果统计 */
export interface ArchiveStatsResponse {
  archivedCount?: number;
  deletedCount?: number;
  tenantId?: string;
}

/** 审计日志归档状态 */
export interface ArchiveStatusResponse {
  bucket?: string;  // 存储桶
  days?: number;  // 保留天数
  enabled?: boolean;  // 启用
  lastArchive?: number;  // 上次归档时间戳
}

export interface AssignAlertRequest {
  assignee: string;
}

/** 分配异常给安全分析师 */
export interface AssignAnomalyRequest {
  assignee: string;  // 分析师ID
}

/** 审计日志记录信息 */
export interface AuditLogResponse {
  action?: string;  // 操作
  appId?: string;  // 应用ID
  duration?: number;  // 耗时(ms)
  id?: string;  // 日志ID
  ip?: string;  // IP
  level?: string;  // 级别
  message?: string;  // 消息
  metadata?: Record<string, unknown>;  // 元数据
  module?: string;  // 模块
  operatorId?: string;  // 操作者ID
  operatorType?: string;  // 操作者类型
  requestId?: string;  // 请求ID
  sequence?: number;  // 序列号
  status?: number;  // 状态
  targetId?: string;  // 目标ID
  targetType?: string;  // 目标类型
  tenantId?: string;  // 租户ID
  timestamp?: number;  // 时间戳
  traceId?: string;  // W3C 追踪ID
  userAgent?: string;  // UA
}

/** 审计日志统计信息 */
export interface AuditStatsResponse {
  avgResponseMs?: number;
  byAction?: Record<string, number>;  // 按操作
  byLevel?: Record<string, number>;  // 按级别
  byModule?: Record<string, number>;  // 按模块
  byStatus?: Record<string, number>;  // 按状态
  mttdMinutes?: number;
  mttrMinutes?: number;
  tenantId?: string;  // 租户ID
  todayEntries?: number;
  totalLogs?: number;  // 总数
  trend?: TimePointResp[];  // 趋势
}

export interface BatchCreateStatusResponse {
  count?: number;
  status?: string;
}

/** 单条合规检查项 */
export interface ComplianceCheckResp {
  description?: string;  // 描述
  issues?: string[];  // 问题
  item?: string;  // 检查项
  passed?: boolean;  // 是否通过
  severity?: string;  // 严重程度
  status?: string;  // 状态
}

/** 合规审计报告 */
export interface ComplianceReportResponse {
  checks?: ComplianceCheckResp[];  // 检查项
  complianceScore?: number;  // 合规得分
  generatedAt?: number;  // 生成时间戳
  overallStatus?: string;  // 状态
  period?: string;  // 周期
  recommendations?: string[];  // 建议
  standard?: string;  // 标准
}

/** 异常关联事件的高层统计信息 */
export interface ContextSummary {
  timeSpanSeconds?: number;
  totalEvents?: number;
  uniqueDevices?: number;
  uniqueIps?: number;
}

export interface CreateBreachNotificationRequest {
  affectedUsers?: number;
  description?: string;
  severity: string;
  title: string;
}

export interface CreateCleanupRecordRequest {
  count?: number;
  period?: string;
  recordType: string;
}

export interface CreateCrossBorderTransferRequest {
  dataType: string;
  fromCountry: string;
  purpose?: string;
  safeguard?: string;
  toCountry: string;
}

export interface CreateDataClassificationRequest {
  dataSetName: string;
  description?: string;
  tiers: string;
}

export interface CreateIDResponse {
  id?: string;
}

export interface CreateIncidentRequest {
  assignee?: string;
  description?: string;
  relatedEvidenceIds?: string[];
  severity: string;
  sourceAnomalyIds?: string[];
  title: string;
}

export interface CreatePIARequest {
  dataTypes?: string[];
  description?: string;
  name: string;
  purpose?: string;
  riskLevel?: string;
}

export interface CreateStatusResponse {
  status?: string;
}

export interface DeleteStatusResponse {
  status?: string;  // 状态
}

/** 异常时间线中某个设备指纹的摘要信息 */
export interface DeviceSummary {
  eventCount?: number;
  fingerprint?: string;
  firstSeen?: number;
  ip?: string;
  lastSeen?: number;
  userAgent?: string;
}

export interface ExportJobRequest {
  actions?: string[];  // 操作类型筛选
  endDate?: string;  // 结束日期(YYYY-MM-DD)
  format: string;  // 导出格式: json/csv
  modules?: string[];  // 模块筛选
  startDate?: string;  // 开始日期(YYYY-MM-DD)
}

/** 审计日志导出任务信息 */
export interface ExportJobResponse {
  contentType?: string;  // 内容类型
  filename?: string;  // 文件名
  generatedAt?: number;  // 生成时间戳
  jobId?: string;  // 任务ID
  recordCount?: number;  // 记录数
  status?: string;  // 状态
}

/** 审计日志导出任务状态 */
export interface ExportJobStatusResponse {
  jobId?: string;  // 任务ID
  status?: string;  // 状态
}

/** 哈希链详细信息 */
export interface HashChainResponse {
  chainId?: string;  // 链身份（A19 粒度：tenant_id + app_id）
  endHash?: string;  // 结束哈希
  isValid?: boolean;  // 有效
  logCount?: number;  // 日志数
  message?: string;  // 链损坏说明（BrokenMsg）
  startHash?: string;  // 起始哈希
  tenantId?: string;  // 租户ID
  verifiedAt?: number;  // 验证时间戳(毫秒)
}

export interface IncidentResponse {
  assignee?: string;
  createdAt?: string;
  description?: string;
  id?: string;
  relatedEvidenceIds?: string[];
  resolvedAt?: string;
  resolvedBy?: string;
  severity?: string;
  sourceAnomalyIds?: string[];
  status?: string;
  tenantId?: string;
  title?: string;
  updatedAt?: string;
}

export interface LinkAnomalyRequest {
  caseId: string;
}

/** 指定审计日志条目的 Merkle Proof，用于第三方验证日志未被篡改 */
export interface MerkleProofResponse {
  entryId?: string;  // 审计日志ID
  leafCount?: number;  // 总叶子数
  leafHash?: string;  // 叶节点哈希
  leafIndex?: number;  // 叶节点索引
  proof?: string[];  // Proof 路径
  rootHash?: string;  // Merkle Root
  tenantId?: string;  // 租户ID
}

/** 批量查询多个审计日志条目的 Merkle Proof */
export interface MerkleProofsRequest {
  entryIds: string[];  // 条目ID列表
}

export interface MerkleProofsResponse {
  found?: number;  // 成功找到的数量
  notFound?: string[];  // 未找到的条目ID
  proofs?: MerkleProofResponse[];  // Proof 列表
  total?: number;  // 总数
}

/** 指定租户审计日志的 Merkle Root 摘要 */
export interface MerkleRootResponse {
  generatedAt?: number;  // 生成时间
  leafCount?: number;  // 叶子节点数
  period?: string;  // 时间范围
  rootHash?: string;  // Merkle Root 哈希
  tenantId?: string;  // 租户ID
}

export interface MessageResponse {
  code?: number;
  message?: string;
}

export interface PublicAuditStats {
  byLevel?: Record<string, number>;
  byModule?: Record<string, number>;
  byStatus?: Record<string, number>;
  totalLogs?: number;
}

export interface PublicHashChain {
  endHash?: string;  // 前16位
  lastValidated?: string;
  logCount?: number;
  startHash?: string;  // 前16位
}

export interface PublicLogsSummary {
  activeSince?: string;
  lastActivity?: string;
  moduleCount?: number;
  totalLogs?: number;
}

/** 记录AI自动化决策参数 */
export interface RecordAIDecisionRequest {
  decisionId: string;  // 决策ID
  input?: Record<string, unknown>;  // 输入
  model: string;  // 模型
  output?: Record<string, unknown>;  // 输出
  reviewed?: boolean;  // 已复核
  reviewer?: string;  // 复核人
}

/** 租户审计日志保留策略配置 */
export interface RetentionPolicyRequest {
  archiveTo?: string;  // 归档目标
  bucket?: string;  // 归档桶名
  days?: number;  // 保留天数
  enabled?: boolean;  // 是否启用自动归档
}

export interface RetentionPolicyResponse {
  archiveTo?: string;  // 归档目标
  bucket?: string;  // 归档桶名
  createdAt?: number;  // 创建时间
  days?: number;  // 保留天数
  enabled?: boolean;  // 是否启用自动归档
  tenantId?: string;  // 租户ID
  updatedAt?: number;  // 更新时间
}

export interface SIEMConnectorRequest {
  apiKey?: string;  // API Key
  config?: Record<string, unknown>;  // 扩展配置
  enabled?: boolean;  // 是否启用
  endpoint: string;  // 端点
  index?: string;  // 索引
  name: string;  // 名称
  Type: "splunk" | "elk" | "cef";  // 类型
}

export interface SIEMConnectorResponse {
  config?: Record<string, unknown>;  // 扩展配置
  createdAt?: number;  // 创建时间
  enabled?: boolean;  // 是否启用
  endpoint?: string;  // 端点
  id?: string;  // ID
  index?: string;  // 索引
  lastTestedAt?: number;  // 最近测试时间
  name?: string;  // 名称
  tenantId?: string;  // 租户ID
  testStatus?: string;  // 测试状态
  Type?: string;  // 类型
  updatedAt?: number;  // 更新时间
}

export interface SIEMTestResultResponse {
  message?: string;  // 消息
  status?: string;  // 状态
  success?: boolean;  // 是否成功
}

/** 安全详情 */
export interface SecurityDetailsResp {
  failedLoginIps?: Record<string, number>;  // 失败登录IP
  suspiciousUsers?: string[];  // 可疑用户
  unusualAccessTimes?: TimeRangeResp[];  // 异常访问时间
}

/** 安全审计报告 */
export interface SecurityReportResponse {
  details?: SecurityDetailsResp;  // 详情
  generatedAt?: number;  // 生成时间戳
  period?: string;  // 周期
  recommendations?: string[];  // 建议
  summary?: SecuritySummaryResp;  // 摘要
  topRisks?: SecurityRiskResp[];  // 主要风险
}

/** 单条安全风险 */
export interface SecurityRiskResp {
  count?: number;  // 数量
  description?: string;  // 描述
  severity?: string;  // 严重程度
  Type?: string;  // 类型
}

/** 安全摘要统计 */
export interface SecuritySummaryResp {
  anomaliesDetected?: number;  // 异常
  blockedIps?: number;  // 被阻止IP
  failedLogins?: number;  // 失败登录
  suspiciousActivities?: number;  // 可疑活动
  totalEvents?: number;  // 总事件
}

export interface ServerLogResponse {
  level?: string;
  message?: string;
  service?: string;
  timestamp?: string;
  traceId?: string;
  userId?: string;
}

export interface ServerLogServicesResponse {
  services?: string[];
}

/** 时间点统计 */
export interface TimePointResp {
  count?: number;  // 数量
  timestamp?: number;  // 时间戳
}

/** 时间范围 */
export interface TimeRangeResp {
  end?: number;  // 结束时间戳
  start?: number;  // 开始时间戳
}

export interface UpdateAlertStatusRequest {
  status: string;
}

/** 更新异常调查状态 */
export interface UpdateAnomalyStatusRequest {
  assignee?: string;  // 分析师
  status: string;  // 状态
}

export interface UpdateIncidentStatusRequest {
  status: string;
}

/** 后台定时哈希链验证的单租户结果 */
export interface VerificationResultResponse {
  entriesChecked?: number;
  errorMessage?: string;
  lastHash?: string;
  lastSequence?: number;
  tenantId?: string;
  valid?: boolean;
  validatedAt?: number;
}

/** 哈希链验证结果 */
export interface VerifyChainResponse {
  brokenAt?: number;  // 断裂位置
  checkedCount?: number;  // 检查数
  firstHash?: string;  // 首哈希
  lastHash?: string;  // 末哈希
  message?: string;  // 信息
  valid?: boolean;  // 有效
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


// ====== API Functions (tree-shakeable: independent exports) ======

/** 获取告警列表 */
export function getAdminAuditAlerts(client: ApiClient, params?: {
  type?: string;  // 告警类型
  severity?: string;  // 严重程度: low/medium/high/critical
  status?: string;  // 状态: open/acknowledged/escalated/resolved/dismissed
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<AlertResponse>> {
  return client.get(`/audit/api/v1/admin/audit/alerts`, { params });
}

/** 获取告警详情 */
export function getAdminAuditAlertsByAlerts(client: ApiClient, alertId: string): Promise<AlertResponse> {
  return client.get(`/audit/api/v1/admin/audit/alerts/${alertId}`);
}

/** 分配告警处理人 */
export function postAdminAuditAlertsAssignByAlerts(client: ApiClient, alertId: string, data: AssignAlertRequest): Promise<AlertResponse> {
  return client.post(`/audit/api/v1/admin/audit/alerts/${alertId}/assign`, data);
}

/** 更新告警状态 */
export function putAdminAuditAlertsStatusByAlerts(client: ApiClient, alertId: string, data: UpdateAlertStatusRequest): Promise<AlertResponse> {
  return client.put(`/audit/api/v1/admin/audit/alerts/${alertId}/status`, data);
}

/** 获取审计异常列表 */
export function getAdminAuditAnomalies(client: ApiClient, params?: {
  type?: string;  // 异常类型
  severity?: string;  // 严重程度: low/medium/high/critical
  status?: string;  // 状态: open/investigating/resolved/false_positive
  tenant_id?: string;  // 租户ID
  user_id?: string;  // 用户ID筛选
  time_range?: string;  // 时间范围: 1h/24h/7d/30d
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<AnomalyResponse>> {
  return client.get(`/audit/api/v1/admin/audit/anomalies`, { params });
}

/** 触发异常检测 */
export function postAdminAuditAnomaliesDetect(client: ApiClient, data: Record<string, unknown>): Promise<AnomalyResponse[]> {
  return client.post(`/audit/api/v1/admin/audit/anomalies/detect`, data);
}

/** 获取异常详情 */
export function getAdminAuditAnomaliesByAnomalies(client: ApiClient, anomalyId: string): Promise<AnomalyResponse> {
  return client.get(`/audit/api/v1/admin/audit/anomalies/${anomalyId}`);
}

/** 分配异常分析师 */
export function postAdminAuditAnomaliesAssignByAnomalies(client: ApiClient, anomalyId: string, data: AssignAnomalyRequest): Promise<AnomalyResponse> {
  return client.post(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/assign`, data);
}

/** 添加异常调查评论 */
export function postAdminAuditAnomaliesCommentByAnomalies(client: ApiClient, anomalyId: string, data: AddAnomalyCommentRequest): Promise<AnomalyResponse> {
  return client.post(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/comment`, data);
}

/** 关联异常到案件 */
export function postAdminAuditAnomaliesLinkByAnomalies(client: ApiClient, anomalyId: string, data: LinkAnomalyRequest): Promise<MessageResponse> {
  return client.post(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/link`, data);
}

/** 获取关联异常 */
export function getAdminAuditAnomaliesRelatedByAnomalies(client: ApiClient, anomalyId: string): Promise<ApiListResult<AnomalyResponse>> {
  return client.get(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/related`);
}

/** 更新异常状态 */
export function putAdminAuditAnomaliesStatusByAnomalies(client: ApiClient, anomalyId: string, data: UpdateAnomalyStatusRequest): Promise<AnomalyResponse> {
  return client.put(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/status`, data);
}

/** 获取异常事件时间线 */
export function getAdminAuditAnomaliesTimelineByAnomalies(client: ApiClient, anomalyId: string): Promise<AnomalyTimelineResponse> {
  return client.get(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/timeline`);
}

/** 归档审计日志 */
export function postAdminAuditArchive(client: ApiClient, data: Record<string, unknown>): Promise<ArchiveStatsResponse> {
  return client.post(`/audit/api/v1/admin/audit/archive`, data);
}

/** 获取归档状态 */
export function getAdminAuditArchiveStatus(client: ApiClient): Promise<ArchiveStatusResponse> {
  return client.get(`/audit/api/v1/admin/audit/archive/status`);
}

/** 查询计费事件审计日志 */
export function getAdminAuditBillingEvents(client: ApiClient, params?: {
  tenant_id?: string;  // 租户ID
  event_type?: string;  // 事件类型，如 billing.subscription_created
  start_time?: number;  // 开始时间戳
  end_time?: number;  // 结束时间戳
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<AuditLogResponse>> {
  return client.get(`/audit/api/v1/admin/audit/billing-events`, { params });
}

/** 列表查询AI决策 */
export function getAdminAuditComplianceAiDecisions(client: ApiClient): Promise<Record<string, unknown>> {
  return client.get(`/audit/api/v1/admin/audit/compliance/ai-decisions`);
}

/** 记录AI决策 */
export function postAdminAuditComplianceAiDecisions(client: ApiClient, data: RecordAIDecisionRequest): Promise<CreateIDResponse> {
  return client.post(`/audit/api/v1/admin/audit/compliance/ai-decisions`, data);
}

/** 查询AI决策详情 */
export function getAdminAuditComplianceAiDecisionsByAiDecisions(client: ApiClient, aiDecisionId: string): Promise<Record<string, unknown>> {
  return client.get(`/audit/api/v1/admin/audit/compliance/ai-decisions/${aiDecisionId}`);
}

/** 列表查询违规通知 */
export function getAdminAuditComplianceBreaches(client: ApiClient): Promise<Record<string, unknown>> {
  return client.get(`/audit/api/v1/admin/audit/compliance/breaches`);
}

/** 创建违规通知 */
export function postAdminAuditComplianceBreaches(client: ApiClient, data: CreateBreachNotificationRequest): Promise<CreateIDResponse> {
  return client.post(`/audit/api/v1/admin/audit/compliance/breaches`, data);
}

/** 查询违规通知详情 */
export function getAdminAuditComplianceBreachesByBreaches(client: ApiClient, breachId: string): Promise<Record<string, unknown>> {
  return client.get(`/audit/api/v1/admin/audit/compliance/breaches/${breachId}`);
}

/** 列表查询清理记录 */
export function getAdminAuditComplianceCleanupRecords(client: ApiClient): Promise<Record<string, unknown>> {
  return client.get(`/audit/api/v1/admin/audit/compliance/cleanup-records`);
}

/** 创建清理记录 */
export function postAdminAuditComplianceCleanupRecords(client: ApiClient, data: CreateCleanupRecordRequest): Promise<CreateIDResponse> {
  return client.post(`/audit/api/v1/admin/audit/compliance/cleanup-records`, data);
}

/** 查询清理记录详情 */
export function getAdminAuditComplianceCleanupRecordsByCleanupRecords(client: ApiClient, cleanupRecordId: string): Promise<Record<string, unknown>> {
  return client.get(`/audit/api/v1/admin/audit/compliance/cleanup-records/${cleanupRecordId}`);
}

/** 列表查询跨境传输 */
export function getAdminAuditComplianceCrossBorder(client: ApiClient): Promise<Record<string, unknown>> {
  return client.get(`/audit/api/v1/admin/audit/compliance/cross-border`);
}

/** 创建跨境传输记录 */
export function postAdminAuditComplianceCrossBorder(client: ApiClient, data: CreateCrossBorderTransferRequest): Promise<CreateIDResponse> {
  return client.post(`/audit/api/v1/admin/audit/compliance/cross-border`, data);
}

/** 查询跨境传输详情 */
export function getAdminAuditComplianceCrossBorderByCrossBorder(client: ApiClient, crossBorderTransferId: string): Promise<Record<string, unknown>> {
  return client.get(`/audit/api/v1/admin/audit/compliance/cross-border/${crossBorderTransferId}`);
}

/** 列表查询数据分类 */
export function getAdminAuditComplianceDataClassifications(client: ApiClient): Promise<Record<string, unknown>> {
  return client.get(`/audit/api/v1/admin/audit/compliance/data-classifications`);
}

/** 创建数据分类 */
export function postAdminAuditComplianceDataClassifications(client: ApiClient, data: CreateDataClassificationRequest): Promise<CreateIDResponse> {
  return client.post(`/audit/api/v1/admin/audit/compliance/data-classifications`, data);
}

/** 查询数据分类详情 */
export function getAdminAuditComplianceDataClassificationsByDataClassifications(client: ApiClient, dataClassificationId: string): Promise<Record<string, unknown>> {
  return client.get(`/audit/api/v1/admin/audit/compliance/data-classifications/${dataClassificationId}`);
}

/** 列表查询 PIA */
export function getAdminAuditCompliancePias(client: ApiClient): Promise<Record<string, unknown>> {
  return client.get(`/audit/api/v1/admin/audit/compliance/pias`);
}

/** 创建 PIA */
export function postAdminAuditCompliancePias(client: ApiClient, data: CreatePIARequest): Promise<CreateIDResponse> {
  return client.post(`/audit/api/v1/admin/audit/compliance/pias`, data);
}

/** 查询 PIA 详情 */
export function getAdminAuditCompliancePiasByPias(client: ApiClient, piaId: string): Promise<Record<string, unknown>> {
  return client.get(`/audit/api/v1/admin/audit/compliance/pias/${piaId}`);
}

/** 查询角色操作映射 */
export function getAdminAuditComplianceRoleActions(client: ApiClient): Promise<Record<string, unknown>> {
  return client.get(`/audit/api/v1/admin/audit/compliance/role-actions`);
}

/** 查询SoD规则 */
export function getAdminAuditComplianceSodRules(client: ApiClient, params?: {
  page?: number;  // 页码（默认 1）
  page_size?: number;  // 每页条数（默认 20，上限 100）
}): Promise<Record<string, unknown>> {
  return client.get(`/audit/api/v1/admin/audit/compliance/sod-rules`, { params });
}

/** 导出审计日志 */
export function postAdminAuditExport(client: ApiClient, data: ExportJobRequest): Promise<ExportJobResponse> {
  return client.post(`/audit/api/v1/admin/audit/export`, data);
}

/** 列出导出任务 */
export function getAdminAuditExportJobs(client: ApiClient, params?: {
  tenant_id?: string;  // 租户ID
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<ExportJobResponse>> {
  return client.get(`/audit/api/v1/admin/audit/export/jobs`, { params });
}

/** 下载导出文件 */
export function getAdminAuditExportDownloadByExport(client: ApiClient, jobId: string): Promise<void> {
  return client.get(`/audit/api/v1/admin/audit/export/${jobId}/download`);
}

/** 获取导出任务状态 */
export function getAdminAuditExportStatusByExport(client: ApiClient, jobId: string): Promise<ExportJobStatusResponse> {
  return client.get(`/audit/api/v1/admin/audit/export/${jobId}/status`);
}

/** 获取哈希链信息 */
export function getAdminAuditHashchainByHashchain(client: ApiClient, tenantId: string): Promise<HashChainResponse> {
  return client.get(`/audit/api/v1/admin/audit/hashchain/${tenantId}`);
}

/** 按日期范围验证哈希链 */
export function getAdminAuditHashchainVerifyByDateByHashchain(client: ApiClient, tenantId: string, params?: {
  start_date?: string;  // 开始日期(YYYY-MM-DD)
  end_date?: string;  // 结束日期(YYYY-MM-DD)
}): Promise<VerifyChainResponse> {
  return client.get(`/audit/api/v1/admin/audit/hashchain/${tenantId}/verify-by-date`, { params });
}

/** 获取安全事件列表 */
export function getAdminAuditIncidents(client: ApiClient, params?: {
  status?: string;  // 状态筛选: open/investigating/contained/resolved/closed
  severity?: string;  // 严重程度: low/medium/high/critical
  search?: string;  // 关键词搜索
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<IncidentResponse>> {
  return client.get(`/audit/api/v1/admin/audit/incidents`, { params });
}

/** 创建安全事件 */
export function postAdminAuditIncidents(client: ApiClient, data: CreateIncidentRequest): Promise<IncidentResponse> {
  return client.post(`/audit/api/v1/admin/audit/incidents`, data);
}

/** 获取安全事件详情 */
export function getAdminAuditIncidentsByIncidents(client: ApiClient, incidentId: string): Promise<IncidentResponse> {
  return client.get(`/audit/api/v1/admin/audit/incidents/${incidentId}`);
}

/** 添加安全事件评论 */
export function postAdminAuditIncidentsCommentByIncidents(client: ApiClient, incidentId: string, data: AddIncidentCommentRequest): Promise<IncidentResponse> {
  return client.post(`/audit/api/v1/admin/audit/incidents/${incidentId}/comment`, data);
}

/** 更新安全事件状态 */
export function putAdminAuditIncidentsStatusByIncidents(client: ApiClient, incidentId: string, data: UpdateIncidentStatusRequest): Promise<IncidentResponse> {
  return client.put(`/audit/api/v1/admin/audit/incidents/${incidentId}/status`, data);
}

/** 查询审计日志 */
export function getAdminAuditLogs(client: ApiClient, params?: {
  tenant_id?: string;  // 租户ID
  user_id?: string;  // 用户ID
  action?: string[];  // 操作类型（可重复传递实现多值 OR 查询）
  resource_type?: string;  // 资源类型
  start_time?: number;  // 开始时间戳（start_date 串优先）
  end_time?: number;  // 结束时间戳（end_date 串优先）
  start_date?: string;  // 开始日期(YYYY-MM-DD，UTC+8；优先于 start_time)
  end_date?: string;  // 结束日期(YYYY-MM-DD，UTC+8，含当日全量；优先于 end_time)
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<AuditLogResponse>> {
  return client.get(`/audit/api/v1/admin/audit/logs`, { params });
}

/** 根据ID获取审计日志 */
export function getAdminAuditLogsByLogs(client: ApiClient, auditLogId: string): Promise<AuditLogResponse> {
  return client.get(`/audit/api/v1/admin/audit/logs/${auditLogId}`);
}

/** 获取指定审计日志条目的 Merkle Proof */
export function getAdminAuditMerkleProof(client: ApiClient, params?: {
  tenant_id: string;  // 租户ID
  entry_id: string;  // 审计日志条目ID
}): Promise<MerkleProofResponse> {
  return client.get(`/audit/api/v1/admin/audit/merkle-proof`, { params });
}

/** 批量获取多个审计日志条目的 Merkle Proof */
export function postAdminAuditMerkleProofs(client: ApiClient, data: MerkleProofsRequest): Promise<MerkleProofsResponse> {
  return client.post(`/audit/api/v1/admin/audit/merkle-proofs`, data);
}

/** 获取租户审计日志的 Merkle Root */
export function getAdminAuditMerkleRoot(client: ApiClient, params?: {
  tenant_id: string;  // 租户ID
  start?: string;  // 开始日期 (YYYY-MM-DD)
  end?: string;  // 结束日期 (YYYY-MM-DD)
}): Promise<MerkleRootResponse> {
  return client.get(`/audit/api/v1/admin/audit/merkle-root`, { params });
}

/** 查询支付事件审计日志 */
export function getAdminAuditPaymentEvents(client: ApiClient, params?: {
  tenant_id?: string;  // 租户ID
  event_type?: string;  // 事件类型，如 payment.succeeded
  start_time?: number;  // 开始时间戳
  end_time?: number;  // 结束时间戳
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<AuditLogResponse>> {
  return client.get(`/audit/api/v1/admin/audit/payment-events`, { params });
}

/** 获取合规审计报告 */
export function getAdminAuditReportsCompliance(client: ApiClient, params?: {
  standard?: string;  // 合规标准: GDPR/SOX/ISO27001
  period?: string;  // 报告周期: 7d/30d/90d
  tenant_id?: string;  // 租户ID
}): Promise<ComplianceReportResponse> {
  return client.get(`/audit/api/v1/admin/audit/reports/compliance`, { params });
}

/** 获取安全审计报告 */
export function getAdminAuditReportsSecurity(client: ApiClient, params?: {
  period?: string;  // 报告周期: 7d/30d/90d
  tenant_id?: string;  // 租户ID
}): Promise<SecurityReportResponse> {
  return client.get(`/audit/api/v1/admin/audit/reports/security`, { params });
}

/** 获取租户审计日志保留策略 */
export function getAdminAuditRetentionPolicy(client: ApiClient, params?: {
  tenant_id?: string;  // 租户ID（为空时尝试从JWT上下文获取）
}): Promise<RetentionPolicyResponse> {
  return client.get(`/audit/api/v1/admin/audit/retention-policy`, { params });
}

/** 保存或更新租户审计日志保留策略 */
export function putAdminAuditRetentionPolicy(client: ApiClient, data: RetentionPolicyRequest): Promise<RetentionPolicyResponse> {
  return client.put(`/audit/api/v1/admin/audit/retention-policy`, data);
}

/** 查询服务错误日志 */
export function getAdminAuditServerLogs(client: ApiClient, params?: {
  service?: string;  // 服务名筛选
  level?: string;  // 级别筛选: error/warn
  keyword?: string;  // 关键词搜索
  start_time?: number;  // 开始时间戳
  end_time?: number;  // 结束时间戳
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<ServerLogResponse>> {
  return client.get(`/audit/api/v1/admin/audit/server-logs`, { params });
}

/** 获取已记录日志的服务列表 */
export function getAdminAuditServerLogsServices(client: ApiClient): Promise<ServerLogServicesResponse> {
  return client.get(`/audit/api/v1/admin/audit/server-logs/services`);
}

/** 列出 SIEM 连接器 */
export function getAdminAuditSiemConnectors(client: ApiClient, params?: {
  tenant_id?: string;  // 租户ID
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<SIEMConnectorResponse>> {
  return client.get(`/audit/api/v1/admin/audit/siem/connectors`, { params });
}

/** 创建 SIEM 连接器 */
export function postAdminAuditSiemConnectors(client: ApiClient, data: SIEMConnectorRequest): Promise<SIEMConnectorResponse> {
  return client.post(`/audit/api/v1/admin/audit/siem/connectors`, data);
}

/** 删除 SIEM 连接器 */
export function deleteAdminAuditSiemConnectorsByConnectors(client: ApiClient, connectorId: string): Promise<DeleteStatusResponse> {
  return client.delete(`/audit/api/v1/admin/audit/siem/connectors/${connectorId}`);
}

/** 更新 SIEM 连接器 */
export function putAdminAuditSiemConnectorsByConnectors(client: ApiClient, connectorId: string, data: SIEMConnectorRequest): Promise<SIEMConnectorResponse> {
  return client.put(`/audit/api/v1/admin/audit/siem/connectors/${connectorId}`, data);
}

/** 测试 SIEM 连接器 */
export function postAdminAuditSiemConnectorsTestByConnectors(client: ApiClient, connectorId: string): Promise<SIEMTestResultResponse> {
  return client.post(`/audit/api/v1/admin/audit/siem/connectors/${connectorId}/test`);
}

/** 获取审计统计 */
export function getAdminAuditStats(client: ApiClient): Promise<AuditStatsResponse> {
  return client.get(`/audit/api/v1/admin/audit/stats`);
}

/** 获取租户异常检测配置 */
export function getAdminAuditTenantConfig(client: ApiClient): Promise<AuditTenantConfig> {
  return client.get(`/audit/api/v1/admin/audit/tenant-config`);
}

/** 更新租户异常检测配置 */
export function putAdminAuditTenantConfig(client: ApiClient, data: AuditTenantConfig): Promise<AuditTenantConfig> {
  return client.put(`/audit/api/v1/admin/audit/tenant-config`, data);
}

/** 查询最近一次自动哈希链验证结果 */
export function getAdminAuditVerifications(client: ApiClient): Promise<ApiListResult<VerificationResultResponse>> {
  return client.get(`/audit/api/v1/admin/audit/verifications`);
}

/** 验证哈希链完整性 */
export function postAdminAuditVerifications(client: ApiClient, data: Record<string, unknown>): Promise<VerifyChainResponse> {
  return client.post(`/audit/api/v1/admin/audit/verifications`, data);
}

/** 查询钱包事件审计日志 */
export function getAdminAuditWalletEvents(client: ApiClient, params?: {
  tenant_id?: string;  // 租户ID
  event_type?: string;  // 事件类型，如 wallet.deposited
  start_time?: number;  // 开始时间戳
  end_time?: number;  // 结束时间戳
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<AuditLogResponse>> {
  return client.get(`/audit/api/v1/admin/audit/wallet-events`, { params });
}

/** 获取公开哈希链 */
export function getAuditPublicHashchain(client: ApiClient): Promise<PublicHashChain> {
  return client.get(`/audit/api/v1/audit/public/hashchain`);
}

/** 获取公开日志摘要 */
export function getAuditPublicLogsSummary(client: ApiClient): Promise<PublicLogsSummary> {
  return client.get(`/audit/api/v1/audit/public/logs-summary`);
}

/** 获取公开审计统计 */
export function getAuditPublicStats(client: ApiClient): Promise<PublicAuditStats> {
  return client.get(`/audit/api/v1/audit/public/stats`);
}

