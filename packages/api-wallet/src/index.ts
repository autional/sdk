// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-wallet — auto-generated */
import type { ApiClient } from '@authms/core';

export function adminWallets(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets`, { params });
}

export function adminWalletsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/admin/wallets`, data);
}

export function adminWalletsBatchFreezePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/admin/wallets/batch-freeze`, data);
}

export function adminWalletsBatchUnfreezePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/admin/wallets/batch-unfreeze`, data);
}

export function adminWalletsCoupons(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets/coupons`);
}

export function adminWalletsCouponsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/admin/wallets/coupons`, data);
}

export function adminWalletsCouponsByCouponsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/wallet/api/v1/admin/wallets/coupons/${couponId}`);
}

export function adminWalletsCouponsByCouponsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/wallet/api/v1/admin/wallets/coupons/${couponId}`, data);
}

export function adminWalletsCouponsUsagesByCoupons(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets/coupons/${id}/usages`, { params });
}

export function adminWalletsFraudRules(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets/fraud-rules`);
}

export function adminWalletsFraudRulesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/admin/wallets/fraud-rules`, data);
}

export function adminWalletsFraudRulesByFraudRulesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/wallet/api/v1/admin/wallets/fraud-rules/${walletId}`);
}

export function adminWalletsFreezeRecordsByFreezeRecordsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/wallet/api/v1/admin/wallets/freeze-records/${walletId}`);
}

export function adminWalletsReconciliation(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets/reconciliation`, { params });
}

export function adminWalletsSnapshots(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets/snapshots`, { params });
}

export function adminWalletsTenantsAppsPolicyByTenantsByAppsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/apps/${appId}/policy`);
}

export function adminWalletsTenantsAppsPolicyByTenantsByApps(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/apps/${appId}/policy`);
}

export function adminWalletsTenantsAppsPolicyByTenantsByAppsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/apps/${appId}/policy`, data);
}

export function adminWalletsTenantsAppsSummaryByTenantsByApps(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/apps/${appId}/summary`);
}

export function adminWalletsTenantsDisputesByTenants(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/disputes`, { params });
}

export function adminWalletsTenantsDisputesResolveByTenantsByDisputesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/disputes/${disputeId}/resolve`, data);
}

export function adminWalletsTenantsStatsByTenants(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/stats`, { params });
}

export function adminWalletsTenantsSummaryByTenants(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/summary`);
}

export function adminWalletsTenantsTransactionsByTenants(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets/tenants/${tenantId}/transactions`, { params });
}

export function adminWalletsWebhookPayloads(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets/webhook-payloads`, { params });
}

export function adminWalletsWebhookPayloadsByWebhookPayloads(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets/webhook-payloads/${walletId}`);
}

export function adminWalletsWithdrawals(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets/withdrawals`, { params });
}

export function adminWalletsWithdrawalsApproveByWithdrawalsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/admin/wallets/withdrawals/${walletId}/approve`, data);
}

export function adminWalletsWithdrawalsRejectByWithdrawalsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/admin/wallets/withdrawals/${walletId}/reject`, data);
}

export function adminWalletsAdjustByWalletsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/admin/wallets/${userId}/adjust`, data);
}

export function adminWalletsByWalletsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/wallet/api/v1/admin/wallets/${walletId}`);
}

export function adminWalletsByWalletsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/wallet/api/v1/admin/wallets/${walletId}`, data);
}

export function adminWalletsIntegrityByWallets(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/admin/wallets/${walletId}/integrity`);
}

export function exchangeRates(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/exchange-rates`, { params });
}

export function exchangeRatesConvertPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/exchange-rates/convert`, data);
}

export function wallets(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/wallets`, { params });
}

export function walletsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/wallets`, data);
}

export function walletsCoupons(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/wallets/coupons`);
}

export function walletsCouponsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/wallets/coupons`, data);
}

export function walletsSnapshot(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/wallets/snapshot`, { params });
}

export function walletsSnapshotPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/wallets/snapshot`, data);
}

export function walletsTransactionsCancelByTransactionsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/wallets/transactions/${walletId}/cancel`, data);
}

export function walletsTransactionsDisputeByTransactionsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/wallets/transactions/${walletId}/dispute`, data);
}

export function walletsTransferPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/wallets/transfer`, data);
}

export function walletsByWallets(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/wallets/${userId}`);
}

export function walletsBalanceByWallets(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/wallets/${userId}/balance`);
}

export function walletsBalanceHistoryByWallets(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/wallets/${userId}/balance-history`, { params });
}

export function walletsCouponsByWallets(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/wallets/${userId}/coupons`);
}

export function walletsCouponsRedeemByWalletsByCouponsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/wallets/${userId}/coupons/${code}/redeem`, undefined, { params });
}

export function walletsDepositByWalletsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/wallets/${userId}/deposit`, data);
}

export function walletsDisputesByWallets(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/wallets/${userId}/disputes`, { params });
}

export function walletsFreezeByWalletsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/wallets/${userId}/freeze`, data);
}

export function walletsFreezesByWallets(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/wallets/${userId}/freezes`, { params });
}

export function walletsRefundByWalletsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/wallets/${userId}/refund`, data);
}

export function walletsStatsByWallets(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/wallets/${userId}/stats`, { params });
}

export function walletsTransactionsByWallets(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/wallets/${userId}/transactions`, { params });
}

export function walletsUnfreezeByWalletsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/wallets/${userId}/unfreeze`, data);
}

export function walletsWithdrawByWalletsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/wallets/${userId}/withdraw`, data);
}

export function walletsWithdrawRequestByWalletsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/wallet/api/v1/wallets/${userId}/withdraw/request`, data);
}

export function walletsWithdrawalsByWallets(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/wallet/api/v1/wallets/${userId}/withdrawals`, { params });
}

