/**
 * @autional/api-point — Auto-generated from point-service swagger.json
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

export interface PointIntegrityResult {
  accountId?: string;
  brokenAt?: number;
  lastHash?: string;
  total?: number;
  valid?: boolean;
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

export interface AdjustPointsRequest {
  amount: number;  // 正数增加，负数减少
  reason?: string;
}

export interface ApplyPointRuleRequest {
  eventType: string;
  metadata?: Record<string, unknown>;
  userId: string;
}

export interface BatchEarnItem {
  amount?: number;
  error?: string;
  newBalance?: number;
  success?: boolean;
  userId?: string;
}

export interface BatchEarnRequest {
  description?: string;
  source?: string;
  users: BatchEarnUser[];
}

export interface BatchEarnResult {
  failedCount?: number;
  results?: BatchEarnItem[];
  successCount?: number;
}

export interface BatchEarnUser {
  amount: number;
  userId: string;
}

export interface ConfirmDeductionRequest {
  amount: number;
  reason?: string;
}

export interface CreatePointAccountRequest {
  userId: string;
}

export interface CreatePointRuleRequest {
  dailyLimit?: number;
  eventType: string;
  multiplier?: number;
  name: string;
  points: number;
  totalLimit?: number;
}

export interface DeleteUserDataRequest {
  userId: string;
}

export interface EarnPointsRequest {
  amount: number;
  description?: string;
  expiresAt?: string;
  source?: string;
}

export interface ExchangePointsRequest {
  amount: number;
  description?: string;
  exchangeType?: string;
  source?: string;
}

export interface ExpirePointsRequest {
  amount: number;
  description?: string;
}

export interface ExpiringPointResponse {
  amount?: number;
  daysLeft?: number;
  expiresAt?: string;
  source?: string;
  transactionId?: string;
}

export interface ExpiringPointsResponse {
  daysThreshold?: number;
  expiringPoints?: ExpiringPointResponse[];
  totalExpiring?: number;
  userId?: string;
}

export interface ExportUserDataRequest {
  userId: string;
}

export interface ExportUserDataResponse {
  account?: PointAccountResponse;
  stats?: PointStatsResponse;
}

export interface FreezePointsRequest {
  amount: number;
  reason?: string;
}

export interface PointAccountResponse {
  balance?: number;
  createdAt?: string;
  exchangeRate?: number;
  expiredPoints?: number;
  frozenBalance?: number;
  id?: string;
  pointsType?: string;
  status?: string;
  tenantId?: string;
  totalEarned?: number;
  totalSpent?: number;
  updatedAt?: string;
  userId?: string;
  version?: number;
}

export interface PointOperationData {
  account?: PointAccountResponse;
  pointsEarned?: number;
  transaction?: PointTransactionResponse;
}

export interface PointRiskScoreResponse {
  factors?: string[];
  riskLevel?: string;
  riskScore?: number;
  userId?: string;
}

export interface PointRuleResponse {
  createdAt?: string;
  dailyLimit?: number;
  enabled?: boolean;
  eventType?: string;
  expiryDays?: number;
  id?: string;
  multiplier?: number;
  name?: string;
  points?: number;
  priority?: number;
  tenantId?: string;
  totalLimit?: number;
  updatedAt?: string;
}

export interface PointStatsResponse {
  currentBalance?: number;
  earnedThisMonth?: number;
  expiringSoon?: number;
  spentThisMonth?: number;
  totalEarned?: number;
  totalExpired?: number;
  totalSpent?: number;
  userId?: string;
}

export interface PointTransactionResponse {
  accountId?: string;
  amount?: number;
  balanceAfter?: number;
  balanceBefore?: number;
  createdAt?: string;
  description?: string;
  expiresAt?: string;
  id?: string;
  idempotencyKey?: string;
  reason?: string;
  relatedId?: string;
  source?: string;
  status?: string;
  Type?: string;
  updatedAt?: string;
  userId?: string;
}

export interface PointValueResult {
  balance?: number;
  cashValue?: string;
  exchangeRate?: number;
  pointsType?: string;
  userId?: string;
}

export interface RefundPointsRequest {
  amount: number;
  description?: string;
  relatedTxId?: string;
}

export interface RuleTestResult {
  dailyRemaining?: number;
  effectiveRate?: number;
  points?: number;
}

export interface SpendPointsRequest {
  amount: number;
  description?: string;
  source?: string;
}

export interface TenantConfigResponse {
  defaultExpiryDays?: number;
  earnEnabled?: boolean;
  exchangeEnabled?: boolean;
  exchangeRate?: number;
  expireEnabled?: boolean;
  expiryMode?: string;
  maxBalance?: number;
  minSpendPoints?: number;
  pointsType?: string;
  spendEnabled?: boolean;
  tenantId?: string;
  transferEnabled?: boolean;
}

export interface TenantPointStatsResponse {
  activeAccounts?: number;
  earnedThisMonth?: number;
  spentThisMonth?: number;
  tenantId?: string;
  totalAccounts?: number;
  totalBalance?: number;
  totalEarned?: number;
  totalExpired?: number;
  totalFrozen?: number;
  totalSpent?: number;
  totalTransactions?: number;
}

export interface TestRuleRequest {
  eventType: string;
}

export interface TransferPointsRequest {
  amount: number;
  description?: string;
  reason?: string;
  source?: string;
  toUserId: string;
}

export interface UnfreezePointsRequest {
  amount: number;
  reason?: string;
}

export interface UpdateAccountStatusRequest {
  status: string;
}

export interface UpdatePointRuleRequest {
  dailyLimit?: number;
  enabled?: boolean;
  eventType?: string;
  multiplier?: number;
  name?: string;
  points?: number;
  totalLimit?: number;
}

export interface UpdateTenantConfigRequest {
  defaultExpiryDays?: number;
  earnEnabled?: boolean;
  exchangeEnabled?: boolean;
  exchangeRate?: number;
  expireEnabled?: boolean;
  expiryMode?: string;
  maxBalance?: number;
  minSpendPoints?: number;
  pointsType?: string;
  spendEnabled?: boolean;
  transferEnabled?: boolean;
}


// ====== API Functions (tree-shakeable: independent exports) ======

/** 获取积分规则列表 */
export function getAdminPointRules(client: ApiClient, params?: {
  include_disabled?: boolean;  // 包含已禁用规则
}): Promise<PointRuleResponse[]> {
  return client.get(`/point/api/v1/admin/point-rules`, { params });
}

/** 创建积分规则 */
export function postAdminPointRules(client: ApiClient, data: CreatePointRuleRequest): Promise<PointRuleResponse> {
  return client.post(`/point/api/v1/admin/point-rules`, data);
}

/** 规则试算 */
export function postAdminPointRulesTest(client: ApiClient, data: TestRuleRequest): Promise<RuleTestResult> {
  return client.post(`/point/api/v1/admin/point-rules/test`, data);
}

/** 删除积分规则 */
export function deleteAdminPointRulesByPointRules(client: ApiClient, ruleId: string): Promise<SimpleResponse> {
  return client.delete(`/point/api/v1/admin/point-rules/${ruleId}`);
}

/** 获取单个积分规则详情 */
export function getAdminPointRulesByPointRules(client: ApiClient, ruleId: string): Promise<PointRuleResponse> {
  return client.get(`/point/api/v1/admin/point-rules/${ruleId}`);
}

/** 更新积分规则 */
export function putAdminPointRulesByPointRules(client: ApiClient, ruleId: string, data: UpdatePointRuleRequest): Promise<PointRuleResponse> {
  return client.put(`/point/api/v1/admin/point-rules/${ruleId}`, data);
}

/** 验证积分账户事件链完整性 */
export function getAdminPointIntegrityByIntegrity(client: ApiClient, accountId: string): Promise<PointIntegrityResult> {
  return client.get(`/point/api/v1/admin/point/integrity/${accountId}`);
}

/** 查询积分账户列表 */
export function getAdminPoints(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  status?: "active" | "suspended" | "closed";  // 状态筛选
}): Promise<ApiListResult<PointAccountResponse>> {
  return client.get(`/point/api/v1/admin/points`, { params });
}

/** 创建积分账户 */
export function postAdminPoints(client: ApiClient, data: CreatePointAccountRequest): Promise<PointAccountResponse> {
  return client.post(`/point/api/v1/admin/points`, data);
}

/** 应用积分规则 */
export function postAdminPointsApplyRule(client: ApiClient, data: ApplyPointRuleRequest): Promise<PointOperationData> {
  return client.post(`/point/api/v1/admin/points/apply-rule`, data);
}

/** 批量发放积分 */
export function postAdminPointsBatchEarn(client: ApiClient, data: BatchEarnRequest): Promise<BatchEarnResult> {
  return client.post(`/point/api/v1/admin/points/batch-earn`, data);
}

/** 删除租户积分配置 */
export function deleteAdminPointsConfig(client: ApiClient): Promise<SimpleResponse> {
  return client.delete(`/point/api/v1/admin/points/config`);
}

/** 获取租户积分配置 */
export function getAdminPointsConfig(client: ApiClient): Promise<TenantConfigResponse> {
  return client.get(`/point/api/v1/admin/points/config`);
}

/** 更新租户积分配置 */
export function putAdminPointsConfig(client: ApiClient, data: UpdateTenantConfigRequest): Promise<TenantConfigResponse> {
  return client.put(`/point/api/v1/admin/points/config`, data);
}

/** 管理员租户级积分统计 */
export function getAdminPointsStats(client: ApiClient): Promise<TenantPointStatsResponse> {
  return client.get(`/point/api/v1/admin/points/stats`);
}

/** 管理员查询交易记录 */
export function getAdminPointsTransactions(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  type?: "earn" | "spend" | "expire" | "freeze" | "unfreeze" | "refund" | "adjust";  // 交易类型
  user_id?: string;  // 用户ID筛选
}): Promise<ApiListResult<PointTransactionResponse>> {
  return client.get(`/point/api/v1/admin/points/transactions`, { params });
}

/** 删除积分账户 */
export function deleteAdminPointsByPoints(client: ApiClient, userId: string): Promise<SimpleResponse> {
  return client.delete(`/point/api/v1/admin/points/${userId}`);
}

/** 调整积分 */
export function postAdminPointsAdjustByPoints(client: ApiClient, userId: string, data: AdjustPointsRequest): Promise<PointOperationData> {
  return client.post(`/point/api/v1/admin/points/${userId}/adjust`, data);
}

/** 积分兑换（管理端） */
export function postAdminPointsExchangeByPoints(client: ApiClient, userId: string, data: ExchangePointsRequest): Promise<PointOperationData> {
  return client.post(`/point/api/v1/admin/points/${userId}/exchange`, data);
}

/** 处理积分过期 */
export function postAdminPointsExpireByPoints(client: ApiClient, userId: string, data: ExpirePointsRequest): Promise<PointOperationData> {
  return client.post(`/point/api/v1/admin/points/${userId}/expire`, data);
}

/** 冻结积分 */
export function postAdminPointsFreezeByPoints(client: ApiClient, userId: string, data: FreezePointsRequest): Promise<PointOperationData> {
  return client.post(`/point/api/v1/admin/points/${userId}/freeze`, data);
}

/** 获取用户积分风险评分（管理端） */
export function getAdminPointsRiskScoreByPoints(client: ApiClient, userId: string): Promise<PointRiskScoreResponse> {
  return client.get(`/point/api/v1/admin/points/${userId}/risk-score`);
}

/** 更新积分账户状态 */
export function putAdminPointsStatusByPoints(client: ApiClient, userId: string, data: UpdateAccountStatusRequest): Promise<SimpleResponse> {
  return client.put(`/point/api/v1/admin/points/${userId}/status`, data);
}

/** 积分转账（管理端） */
export function postAdminPointsTransferByPoints(client: ApiClient, userId: string, data: TransferPointsRequest): Promise<PointOperationData> {
  return client.post(`/point/api/v1/admin/points/${userId}/transfer`, data);
}

/** 解冻积分 */
export function postAdminPointsUnfreezeByPoints(client: ApiClient, userId: string, data: UnfreezePointsRequest): Promise<PointOperationData> {
  return client.post(`/point/api/v1/admin/points/${userId}/unfreeze`, data);
}

/** 获取积分账户详情 */
export function getPointsByPoints(client: ApiClient, userId: string): Promise<PointAccountResponse> {
  return client.get(`/point/api/v1/points/${userId}`);
}

/** 确认扣除冻结积分 */
export function postPointsConfirmDeductionByPoints(client: ApiClient, userId: string, data: ConfirmDeductionRequest): Promise<PointOperationData> {
  return client.post(`/point/api/v1/points/${userId}/confirm-deduction`, data);
}

/** 获得积分 */
export function postPointsEarnByPoints(client: ApiClient, userId: string, data: EarnPointsRequest): Promise<PointOperationData> {
  return client.post(`/point/api/v1/points/${userId}/earn`, data);
}

/** 积分兑换 */
export function postPointsExchangeByPoints(client: ApiClient, userId: string, data: ExchangePointsRequest): Promise<PointOperationData> {
  return client.post(`/point/api/v1/points/${userId}/exchange`, data);
}

/** 查询即将过期积分 */
export function getPointsExpiringByPoints(client: ApiClient, userId: string, params?: {
  days?: number;  // 查询天数范围
}): Promise<ExpiringPointsResponse> {
  return client.get(`/point/api/v1/points/${userId}/expiring`, { params });
}

/** 退回积分 */
export function postPointsRefundByPoints(client: ApiClient, userId: string, data: RefundPointsRequest): Promise<PointOperationData> {
  return client.post(`/point/api/v1/points/${userId}/refund`, data);
}

/** 积分账户风险评分 */
export function getPointsRiskScoreByPoints(client: ApiClient, userId: string): Promise<PointRiskScoreResponse> {
  return client.get(`/point/api/v1/points/${userId}/risk-score`);
}

/** 消费积分 */
export function postPointsSpendByPoints(client: ApiClient, userId: string, data: SpendPointsRequest): Promise<PointOperationData> {
  return client.post(`/point/api/v1/points/${userId}/spend`, data);
}

/** 积分统计 */
export function getPointsStatsByPoints(client: ApiClient, userId: string): Promise<PointStatsResponse> {
  return client.get(`/point/api/v1/points/${userId}/stats`);
}

/** 查询交易记录 */
export function getPointsTransactionsByPoints(client: ApiClient, userId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  type?: "earn" | "spend" | "expire" | "freeze" | "unfreeze" | "refund" | "adjust";  // 交易类型
}): Promise<ApiListResult<PointTransactionResponse>> {
  return client.get(`/point/api/v1/points/${userId}/transactions`, { params });
}

/** 获取单笔交易详情 */
export function getPointsTransactionsByPointsByTransactions(client: ApiClient, userId: string, txId: string): Promise<PointTransactionResponse> {
  return client.get(`/point/api/v1/points/${userId}/transactions/${txId}`);
}

/** 积分转账 */
export function postPointsTransferByPoints(client: ApiClient, userId: string, data: TransferPointsRequest): Promise<PointOperationData> {
  return client.post(`/point/api/v1/points/${userId}/transfer`, data);
}

/** 积分现金价值 */
export function getPointsValueByPoints(client: ApiClient, userId: string): Promise<PointValueResult> {
  return client.get(`/point/api/v1/points/${userId}/value`);
}

