/**
 * @autional/api-wallet — Auto-generated from wallet-service swagger.json
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

export interface WalletIntegrityResult {
  brokenAt?: number;
  lastHash?: string;
  total?: number;
  valid?: boolean;
  walletId?: string;
}

export interface WalletPolicy {
  applicationId?: string;
  autoApproveLimit?: number;
  createdAt?: string;
  dailyWithdrawLimit?: number;
  defaultListPageSize?: number;
  exportPageSize?: number;
  id?: string;
  idempotencyTtl?: number;
  internalClientTimeout?: number;
  maxBalance?: number;  // 0 = 无限制
  minWithdrawAmount?: number;
  monthlyWithdrawLimit?: number;
  quoteCacheTtl?: number;
  rateLimitPerHour?: number;
  rateLimitPerMin?: number;
  supportedCurrencies?: string;  // comma-separated
  tenantId?: string;
  timezone?: string;  // 租户时区，用于日限额计算
  transferEnabled?: boolean;
  updatedAt?: string;
  withdrawalRequireReview?: boolean;
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

export interface ApproveWithdrawalRequest {
  approvedBy?: string;
  remark?: string;
}

export interface BalanceHistoryEntry {
  amount?: string;
  balanceAfter?: string;
  balanceBefore?: string;
  date?: string;
  description?: string;
  transactionId?: string;
  Type?: string;
}

/** 钱包余额信息 */
export interface BalanceResponse {
  availableBalance?: string;  // 可用
  balance?: string;  // 余额
  frozenBalance?: string;  // 冻结
  walletId?: string;  // 钱包ID
}

export interface BatchFreezeRequest {
  amount: string;
  reason?: string;
  userIds: string[];
}

export interface BatchFreezeResult {
  frozenCount?: number;
}

export interface BatchUnfreezeRequest {
  freezeIds: string[];
  reason?: string;
}

export interface BatchUnfreezeResult {
  errors?: string[];
  failed?: number;
  succeeded?: number;
  total?: number;
}

/** 取消交易请求参数 */
export interface CancelTransactionRequest {
  reason?: string;  // 原因
}

export interface CancelTransactionResult {
  cancelled?: boolean;  // 是否取消成功
  refundAmount?: string;  // 退款金额
}

export interface CouponCreateResult {
  code?: string;  // 优惠券码
  couponId?: string;  // 优惠券ID
  currency?: string;  // 货币
  expiresAt?: string;  // 过期时间
  status?: string;  // 状态
  Type?: string;  // 类型
  value?: string;  // 价值
}

/** 优惠券信息 */
export interface CouponResponse {
  code?: string;  // 码
  createdAt?: string;  // 创建
  id?: string;  // ID
  minAmount?: string;  // 最低消费
  name?: string;  // 名称
  status?: string;  // 状态
  Type?: string;  // 类型
  usedAt?: string;  // 使用时间
  usedOrderId?: string;  // 订单ID
  validFrom?: string;  // 生效
  validUntil?: string;  // 失效
  value?: string;  // 价值
}

export interface CouponUsageResponse {
  createdAt?: string;
  id?: string;
  userId?: string;
  walletId?: string;
}

/** 创建优惠券请求参数 */
export interface CreateCouponRequest {
  code: string;
  currency?: string;
  expiresAt?: string;
  minSpend?: string;
  name?: string;
  Type: string;
  value: string;
}

/** 创建新钱包请求参数 */
export interface CreateWalletRequest {
  currency?: string;  // 货币
  userId: string;  // 用户ID
}

/** 钱包充值请求参数 */
export interface DepositRequest {
  amount: string;  // 金额
  description?: string;  // 描述
  referenceId?: string;  // 外部参考
}

export interface DepositResult {
  transaction?: TransactionResponse;  // 交易记录
  wallet?: WalletResponse;  // 钱包信息
}

export interface DisputeListItem {
  createdAt?: string;
  id?: string;
  reason?: string;
  status?: string;
  transactionId?: string;
  userId?: string;
}

export interface DisputeSubmitResult {
  disputeId?: string;  // 争议ID
  status?: string;  // 状态
}

export interface ExchangeConvertRequest {
  amount: string;
  quoteId: string;
  remark?: string;
}

export interface ExchangeConvertResponse {
  fromAmount?: string;
  fromCurrency?: string;
  message?: string;
  quoteId?: string;
  rate?: number;
  toAmount?: string;
  toCurrency?: string;
  transactionId?: string;
}

export interface ExchangeRateResponse {
  expiresAt?: string;
  fromCurrency?: string;
  quoteId?: string;
  rate?: number;
  toCurrency?: string;
}

export interface ExportUserDataResponse {
  transactionCount?: number;
  transactions?: TransactionResponse[];
  wallet?: WalletResponse;
}

/** 单条反欺诈规则配置 */
export interface FraudRuleItem {
  enabled?: boolean;  // 是否启用
  name?: string;  // 名称
  ruleId?: string;  // 规则ID
  threshold?: string;  // 阈值
}

/** 反欺诈规则配置 */
export interface FraudRuleResponse {
  action?: string;  // 动作
  condition?: string;  // 条件
  id?: string;  // 规则ID
  name?: string;  // 名称
  priority?: number;  // 优先级
  status?: string;  // 状态
  Type?: string;  // 类型
  updatedAt?: string;  // 更新时间
}

/** 资金冻结记录 */
export interface FreezeRecordResponse {
  amount?: string;  // 金额
  createdAt?: string;  // 创建
  id?: string;  // 记录ID
  reason?: string;  // 原因
  releasedAt?: string;  // 解冻
  status?: string;  // 状态
  walletId?: string;  // 钱包ID
}

/** 冻结资金请求参数 */
export interface FreezeRequest {
  amount: string;  // 金额
  reason?: string;  // 原因
}

export interface FreezeResult {
  freeze?: FreezeRecordResponse;  // 冻结记录
  wallet?: WalletResponse;  // 钱包信息
}

export interface ManualAdjustResult {
  transaction?: TransactionResponse;
  wallet?: WalletResponse;
}

export interface ReconciliationDetail {
  date?: string;  // 对账日期
  records?: ReconciliationRecord[];  // 各钱包对账记录
  tenantId?: string;  // 租户ID
  walletCount?: number;  // 钱包数量
}

/** 单个钱包的对账记录 */
export interface ReconciliationRecord {
  closingBalance?: string;  // 期末余额
  openingBalance?: string;  // 期初余额
  totalDeposit?: string;  // 累计充值
  totalRefund?: string;  // 累计退款
  totalTransferIn?: string;  // 累计转入
  totalTransferOut?: string;  // 累计转出
  totalWithdraw?: string;  // 累计提现
  transactionCount?: number;  // 交易笔数
  userId?: string;  // 用户ID
  walletId?: string;  // 钱包ID
}

/** 退款请求参数 */
export interface RefundRequest {
  amount?: string;  // 金额
  reason?: string;  // 原因
  referenceId?: string;  // 参考
  transactionId: string;  // 原交易
}

export interface RefundResult {
  transaction?: TransactionResponse;  // 退款交易记录
  wallet?: WalletResponse;  // 钱包信息
}

export interface RejectWithdrawalRequest {
  remark?: string;
}

export interface ResolveDisputeResult {
  disputeId?: string;
  status?: string;
}

export interface SnapshotCreateResult {
  snapshotCount?: number;  // 快照记录数
  snapshotDate?: string;  // 快照日期
  tenantId?: string;  // 租户ID
  walletsTotal?: number;  // 钱包总数
}

/** 生成钱包余额快照的请求参数 */
export interface SnapshotRequest {
  snapshotDate: string;  // 快照日期
}

export interface TenantBalanceSummaryResponse {
  activeWalletCount?: number;
  totalBalance?: string;
  totalFrozenBalance?: string;
  walletCount?: number;
}

/** 对钱包交易发起争议申诉的请求参数 */
export interface TransactionDisputeRequest {
  contact?: string;  // 联系方式
  evidence?: string[];  // 证据
  reason: string;  // 原因
}

/** 交易记录信息 */
export interface TransactionResponse {
  amount?: string;  // 金额
  balanceAfter?: string;  // 后余额
  balanceBefore?: string;  // 前余额
  counterpartyId?: string;  // 对方
  createdAt?: string;  // 创建时间
  currency?: string;  // 货币
  description?: string;  // 描述
  id?: string;  // 交易ID
  referenceId?: string;  // 参考
  status?: string;  // 状态
  Type?: string;  // 类型
  walletId?: string;  // 钱包ID
}

/** 转账请求参数 */
export interface TransferRequest {
  amount: string;  // 金额
  description?: string;  // 描述
  fromUserId: string;  // 转出用户
  toUserId: string;  // 转入用户
}

export interface TransferResult {
  fromTransaction?: TransactionResponse;  // 转出交易记录
  fromWallet?: WalletResponse;  // 转出方钱包
  toTransaction?: TransactionResponse;  // 转入交易记录
  toWallet?: WalletResponse;  // 转入方钱包
}

/** 解冻资金请求参数 */
export interface UnfreezeRequest {
  freezeId: string;  // 冻结记录ID
}

export interface UnfreezeResult {
  freeze?: FreezeRecordResponse;  // 冻结记录
  wallet?: WalletResponse;  // 钱包信息
}

export interface UpdateCouponRequest {
  code?: string;
  expiresAt?: string;
  minSpend?: string;
  name?: string;
  Type?: string;
  value?: string;
}

/** 批量更新反欺诈规则配置的请求参数 */
export interface UpdateFraudRulesRequest {
  rules: FraudRuleItem[];  // 规则列表
}

export interface UpdateWalletRequest {
  status: string;
}

export interface WalletPolicyResponse {
  applicationId?: string;
  autoApproveLimit?: string;
  dailyWithdrawLimit?: string;
  maxBalance?: string;
  minWithdrawAmount?: string;
  monthlyWithdrawLimit?: string;
  supportedCurrencies?: string;
  tenantId?: string;
  timezone?: string;
  transferEnabled?: boolean;
  withdrawalRequireReview?: boolean;
}

/** 用户钱包信息 */
export interface WalletResponse {
  applicationId?: string;  // 应用ID
  balance?: string;  // 余额
  createdAt?: string;  // 创建时间
  currency?: string;  // 货币
  frozenBalance?: string;  // 冻结
  status?: string;  // 状态
  tenantId?: string;  // 租户ID
  updatedAt?: string;  // 更新时间
  userId?: string;  // 用户ID
  walletId?: string;  // 钱包ID
}

export interface WalletSnapshotResponse {
  balance?: string;
  snapshotAt?: string;
  userId?: string;
  walletId?: string;
}

export interface WalletStatsDetail {
  averageTransaction?: string;  // 平均交易金额
  endDate?: string;  // 结束日期
  largestTransaction?: string;  // 最大单笔交易
  period?: string;  // 统计周期
  startDate?: string;  // 开始日期
  totalDeposits?: string;  // 总充值
  totalTransfersIn?: string;  // 总转入
  totalTransfersOut?: string;  // 总转出
  totalWithdrawals?: string;  // 总提现
  transactionCount?: number;  // 交易笔数
}

/** webhook回调记录 */
export interface WebhookPayloadResponse {
  createdAt?: string;  // 创建
  eventType?: string;  // 事件类型
  gateway?: string;  // 支付网关
  id?: string;  // 记录ID
  status?: string;  // 状态
}

/** 钱包提现请求参数 */
export interface WithdrawRequest {
  amount: string;  // 金额
  description?: string;  // 描述
  referenceId?: string;  // 参考
}

export interface WithdrawResult {
  transaction?: TransactionResponse;  // 交易记录
  wallet?: WalletResponse;  // 钱包信息
}

export interface WithdrawalRequest {
  amount: string;
  remark?: string;
}

export interface WithdrawalRequestResponse {
  amount?: string;
  id?: string;
  status?: string;
  userId?: string;
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

/** 钱包列表 */
export function getAdminWallets(client: ApiClient, params?: {
  status?: "active" | "frozen" | "closed";  // 状态筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<WalletResponse>> {
  return client.get(`/wallet/api/v1/admin/wallets`, { params });
}

/** 创建钱包 */
export function postAdminWallets(client: ApiClient, data: CreateWalletRequest): Promise<WalletResponse> {
  return client.post(`/wallet/api/v1/admin/wallets`, data);
}

/** 批量冻结 */
export function postAdminWalletsBatchFreeze(client: ApiClient, data: BatchFreezeRequest): Promise<BatchFreezeResult> {
  return client.post(`/wallet/api/v1/admin/wallets/batch-freeze`, data);
}

/** 批量解冻 */
export function postAdminWalletsBatchUnfreeze(client: ApiClient, data: BatchUnfreezeRequest): Promise<BatchUnfreezeResult> {
  return client.post(`/wallet/api/v1/admin/wallets/batch-unfreeze`, data);
}

/** 优惠券列表 */
export function getAdminWalletsCoupons(client: ApiClient): Promise<ApiListResult<CouponResponse>> {
  return client.get(`/wallet/api/v1/admin/wallets/coupons`);
}

/** 创建优惠券 */
export function postAdminWalletsCoupons(client: ApiClient, data: CreateCouponRequest): Promise<CouponCreateResult> {
  return client.post(`/wallet/api/v1/admin/wallets/coupons`, data);
}

/** 删除优惠券 */
export function deleteAdminWalletsCouponsByCoupons(client: ApiClient, couponId: string): Promise<SimpleResponse> {
  return client.delete(`/wallet/api/v1/admin/wallets/coupons/${couponId}`);
}

/** 更新优惠券 */
export function putAdminWalletsCouponsByCoupons(client: ApiClient, couponId: string, data: UpdateCouponRequest): Promise<CouponCreateResult> {
  return client.put(`/wallet/api/v1/admin/wallets/coupons/${couponId}`, data);
}

/** 优惠券使用记录 */
export function getAdminWalletsCouponsUsagesByCoupons(client: ApiClient, couponId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<CouponUsageResponse>> {
  return client.get(`/wallet/api/v1/admin/wallets/coupons/${couponId}/usages`, { params });
}

/** 反欺诈规则 */
export function getAdminWalletsFraudRules(client: ApiClient): Promise<ApiListResult<FraudRuleResponse>> {
  return client.get(`/wallet/api/v1/admin/wallets/fraud-rules`);
}

/** 更新反欺诈规则 */
export function postAdminWalletsFraudRules(client: ApiClient, data: UpdateFraudRulesRequest): Promise<SimpleResponse> {
  return client.post(`/wallet/api/v1/admin/wallets/fraud-rules`, data);
}

/** 删除反欺诈规则 */
export function deleteAdminWalletsFraudRulesByFraudRules(client: ApiClient, fraudRuleId: string): Promise<SimpleResponse> {
  return client.delete(`/wallet/api/v1/admin/wallets/fraud-rules/${fraudRuleId}`);
}

/** 删除冻结记录 */
export function deleteAdminWalletsFreezeRecordsByFreezeRecords(client: ApiClient, freezeRecordId: string): Promise<SimpleResponse> {
  return client.delete(`/wallet/api/v1/admin/wallets/freeze-records/${freezeRecordId}`);
}

/** 对账 */
export function getAdminWalletsReconciliation(client: ApiClient, params?: {
  date?: string;  // 对账日期
}): Promise<ReconciliationDetail> {
  return client.get(`/wallet/api/v1/admin/wallets/reconciliation`, { params });
}

/** 钱包快照列表 */
export function getAdminWalletsSnapshots(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<WalletSnapshotResponse>> {
  return client.get(`/wallet/api/v1/admin/wallets/snapshots`, { params });
}

/** 删除钱包策略 */
export function deleteAdminWalletsTenantsAppsPolicyByTenantsByApps(client: ApiClient, tenantId: string, appId: string): Promise<SimpleResponse> {
  return client.delete(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/apps/${appId}/policy`);
}

/** 查询钱包策略 */
export function getAdminWalletsTenantsAppsPolicyByTenantsByApps(client: ApiClient, tenantId: string, appId: string): Promise<WalletPolicyResponse> {
  return client.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/apps/${appId}/policy`);
}

/** 更新钱包策略 */
export function putAdminWalletsTenantsAppsPolicyByTenantsByApps(client: ApiClient, tenantId: string, appId: string, data: WalletPolicy): Promise<SimpleResponse> {
  return client.put(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/apps/${appId}/policy`, data);
}

/** 应用钱包总览 */
export function getAdminWalletsTenantsAppsSummaryByTenantsByApps(client: ApiClient, tenantId: string, appId: string): Promise<TenantBalanceSummaryResponse> {
  return client.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/apps/${appId}/summary`);
}

/** 争议列表 */
export function getAdminWalletsTenantsDisputesByTenants(client: ApiClient, tenantId: string, params?: {
  status?: string;  // 状态
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<DisputeListItem>> {
  return client.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/disputes`, { params });
}

/** 争议处理 */
export function postAdminWalletsTenantsDisputesResolveByTenantsByDisputes(client: ApiClient, tenantId: string, disputeId: string, data: Record<string, unknown>): Promise<ResolveDisputeResult> {
  return client.post(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/disputes/${disputeId}/resolve`, data);
}

/** 租户级统计 */
export function getAdminWalletsTenantsStatsByTenants(client: ApiClient, tenantId: string, params?: {
  period?: string;  // 统计周期
  start_date?: string;  // 开始日期
  end_date?: string;  // 结束日期
}): Promise<WalletStatsDetail> {
  return client.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/stats`, { params });
}

/** 租户钱包总览 */
export function getAdminWalletsTenantsSummaryByTenants(client: ApiClient, tenantId: string): Promise<TenantBalanceSummaryResponse> {
  return client.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/summary`);
}

/** 租户级交易流水 */
export function getAdminWalletsTenantsTransactionsByTenants(client: ApiClient, tenantId: string, params?: {
  type?: string;  // 交易类型
  status?: string;  // 状态
  start_date?: string;  // 开始日期
  end_date?: string;  // 结束日期
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<TransactionResponse>> {
  return client.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/transactions`, { params });
}

/** 手动调账 */
export function postAdminWalletsUsersAdjustByUsers(client: ApiClient, userId: string, data: Record<string, unknown>): Promise<ManualAdjustResult> {
  return client.post(`/wallet/api/v1/admin/wallets/users/${userId}/adjust`, data);
}

/** webhook回调记录列表 */
export function getAdminWalletsWebhookPayloads(client: ApiClient, params?: {
  gateway?: string;  // 支付网关筛选
  status?: string;  // 状态筛选 (pending/processed/failed)
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<WebhookPayloadResponse>> {
  return client.get(`/wallet/api/v1/admin/wallets/webhook-payloads`, { params });
}

/** webhook回调记录详情 */
export function getAdminWalletsWebhookPayloadsByWebhookPayloads(client: ApiClient, webhookPayloadId: string): Promise<WebhookPayloadResponse> {
  return client.get(`/wallet/api/v1/admin/wallets/webhook-payloads/${webhookPayloadId}`);
}

/** 提现申请列表 */
export function getAdminWalletsWithdrawals(client: ApiClient, params?: {
  status?: string;  // 状态筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<WithdrawalRequestResponse>> {
  return client.get(`/wallet/api/v1/admin/wallets/withdrawals`, { params });
}

/** 审批提现 */
export function postAdminWalletsWithdrawalsApproveByWithdrawals(client: ApiClient, withdrawalId: string, data: ApproveWithdrawalRequest): Promise<WithdrawalRequestResponse> {
  return client.post(`/wallet/api/v1/admin/wallets/withdrawals/${withdrawalId}/approve`, data);
}

/** 拒绝提现 */
export function postAdminWalletsWithdrawalsRejectByWithdrawals(client: ApiClient, withdrawalId: string, data: RejectWithdrawalRequest): Promise<WithdrawalRequestResponse> {
  return client.post(`/wallet/api/v1/admin/wallets/withdrawals/${withdrawalId}/reject`, data);
}

/** 删除钱包 */
export function deleteAdminWalletsByWallets(client: ApiClient, walletId: string): Promise<SimpleResponse> {
  return client.delete(`/wallet/api/v1/admin/wallets/${walletId}`);
}

/** 更新钱包 */
export function putAdminWalletsByWallets(client: ApiClient, walletId: string, data: UpdateWalletRequest): Promise<WalletResponse> {
  return client.put(`/wallet/api/v1/admin/wallets/${walletId}`, data);
}

/** 验证钱包完整性 */
export function getAdminWalletsIntegrityByWallets(client: ApiClient, walletId: string): Promise<WalletIntegrityResult> {
  return client.get(`/wallet/api/v1/admin/wallets/${walletId}/integrity`);
}

/** 查询兑换率 */
export function getExchangeRates(client: ApiClient, params?: {
  from: string;  // 源币种
  to: string;  // 目标币种
}): Promise<ExchangeRateResponse> {
  return client.get(`/wallet/api/v1/exchange-rates`, { params });
}

/** 执行兑换 */
export function postExchangeRatesConvert(client: ApiClient, data: ExchangeConvertRequest): Promise<ExchangeConvertResponse> {
  return client.post(`/wallet/api/v1/exchange-rates/convert`, data);
}

/** 钱包列表 */
export function getWallets(client: ApiClient, params?: {
  status?: "active" | "frozen" | "closed";  // 状态筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<WalletResponse>> {
  return client.get(`/wallet/api/v1/wallets`, { params });
}

/** 创建钱包 */
export function postWallets(client: ApiClient, data: CreateWalletRequest): Promise<WalletResponse> {
  return client.post(`/wallet/api/v1/wallets`, data);
}

/** 优惠券列表 */
export function getWalletsCoupons(client: ApiClient): Promise<ApiListResult<CouponResponse>> {
  return client.get(`/wallet/api/v1/wallets/coupons`);
}

/** 创建优惠券 */
export function postWalletsCoupons(client: ApiClient, data: CreateCouponRequest): Promise<CouponCreateResult> {
  return client.post(`/wallet/api/v1/wallets/coupons`, data);
}

/** 钱包快照 */
export function getWalletsSnapshot(client: ApiClient, params?: {
  date: string;  // 快照日期（YYYY-MM-DD）
}): Promise<ApiListResult<WalletSnapshotResponse>> {
  return client.get(`/wallet/api/v1/wallets/snapshot`, { params });
}

/** 余额快照 */
export function postWalletsSnapshot(client: ApiClient, data: SnapshotRequest): Promise<SnapshotCreateResult> {
  return client.post(`/wallet/api/v1/wallets/snapshot`, data);
}

/** 取消交易 */
export function postWalletsTransactionsCancelByTransactions(client: ApiClient, transactionId: string, data: CancelTransactionRequest): Promise<CancelTransactionResult> {
  return client.post(`/wallet/api/v1/wallets/transactions/${transactionId}/cancel`, data);
}

/** 交易争议 */
export function postWalletsTransactionsDisputeByTransactions(client: ApiClient, transactionId: string, data: TransactionDisputeRequest): Promise<DisputeSubmitResult> {
  return client.post(`/wallet/api/v1/wallets/transactions/${transactionId}/dispute`, data);
}

/** 钱包转账 */
export function postWalletsTransfer(client: ApiClient, data: TransferRequest): Promise<TransferResult> {
  return client.post(`/wallet/api/v1/wallets/transfer`, data);
}

/** 获取钱包详情 */
export function getWalletsByWallets(client: ApiClient, userId: string): Promise<WalletResponse> {
  return client.get(`/wallet/api/v1/wallets/${userId}`);
}

/** 查询余额 */
export function getWalletsBalanceByWallets(client: ApiClient, userId: string): Promise<BalanceResponse> {
  return client.get(`/wallet/api/v1/wallets/${userId}/balance`);
}

/** 余额变动历史 */
export function getWalletsBalanceHistoryByWallets(client: ApiClient, userId: string, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<BalanceHistoryEntry>> {
  return client.get(`/wallet/api/v1/wallets/${userId}/balance-history`, { params });
}

/** 用户优惠券 */
export function getWalletsCouponsByWallets(client: ApiClient, userId: string): Promise<ApiListResult<CouponResponse>> {
  return client.get(`/wallet/api/v1/wallets/${userId}/coupons`);
}

/** 兑换优惠券 */
export function postWalletsCouponsRedeemByWalletsByCoupons(client: ApiClient, userId: string, code: string, params?: {
  wallet_id?: string;  // 钱包ID
}): Promise<CouponResponse> {
  return client.post(appendQuery(`/wallet/api/v1/wallets/${userId}/coupons/${code}/redeem`, params));
}

/** 钱包充值 */
export function postWalletsDepositByWallets(client: ApiClient, userId: string, data: DepositRequest): Promise<DepositResult> {
  return client.post(`/wallet/api/v1/wallets/${userId}/deposit`, data);
}

/** 争议列表 */
export function getWalletsDisputesByWallets(client: ApiClient, userId: string, params?: {
  status?: string;  // 状态筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<DisputeListItem>> {
  return client.get(`/wallet/api/v1/wallets/${userId}/disputes`, { params });
}

/** 冻结资金 */
export function postWalletsFreezeByWallets(client: ApiClient, userId: string, data: FreezeRequest): Promise<FreezeResult> {
  return client.post(`/wallet/api/v1/wallets/${userId}/freeze`, data);
}

/** 冻结记录 */
export function getWalletsFreezesByWallets(client: ApiClient, userId: string, params?: {
  status?: string;  // 状态
}): Promise<ApiListResult<FreezeRecordResponse>> {
  return client.get(`/wallet/api/v1/wallets/${userId}/freezes`, { params });
}

/** 钱包退款 */
export function postWalletsRefundByWallets(client: ApiClient, userId: string, data: RefundRequest): Promise<RefundResult> {
  return client.post(`/wallet/api/v1/wallets/${userId}/refund`, data);
}

/** 钱包统计 */
export function getWalletsStatsByWallets(client: ApiClient, userId: string, params?: {
  period?: string;  // 统计周期
  start_date?: string;  // 开始日期
  end_date?: string;  // 结束日期
}): Promise<WalletStatsDetail> {
  return client.get(`/wallet/api/v1/wallets/${userId}/stats`, { params });
}

/** 交易记录 */
export function getWalletsTransactionsByWallets(client: ApiClient, userId: string, params?: {
  type?: string;  // 交易类型
  status?: string;  // 状态
  start_date?: string;  // 开始日期
  end_date?: string;  // 结束日期
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<TransactionResponse>> {
  return client.get(`/wallet/api/v1/wallets/${userId}/transactions`, { params });
}

/** 解冻资金 */
export function postWalletsUnfreezeByWallets(client: ApiClient, userId: string, data: UnfreezeRequest): Promise<UnfreezeResult> {
  return client.post(`/wallet/api/v1/wallets/${userId}/unfreeze`, data);
}

/** 钱包提现 */
export function postWalletsWithdrawByWallets(client: ApiClient, userId: string, data: WithdrawRequest): Promise<WithdrawResult> {
  return client.post(`/wallet/api/v1/wallets/${userId}/withdraw`, data);
}

/** 申请提现 */
export function postWalletsWithdrawRequestByWallets(client: ApiClient, userId: string, data: WithdrawalRequest): Promise<WithdrawalRequestResponse> {
  return client.post(`/wallet/api/v1/wallets/${userId}/withdraw/request`, data);
}

/** 提现申请列表 */
export function getWalletsWithdrawalsByWallets(client: ApiClient, userId: string, params?: {
  status?: string;  // 状态筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<WithdrawalRequestResponse>> {
  return client.get(`/wallet/api/v1/wallets/${userId}/withdrawals`, { params });
}

