// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-point — auto-generated */
import type { ApiClient } from '@authms/core';

export function adminPointRules(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/point/api/v1/admin/point-rules`, { params });
}

export function adminPointRulesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/point/api/v1/admin/point-rules`, data);
}

export function adminPointRulesTestPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/point/api/v1/admin/point-rules/test`, data);
}

export function adminPointRulesByPointRulesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/point/api/v1/admin/point-rules/${id}`);
}

export function adminPointRulesByPointRules(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/point/api/v1/admin/point-rules/${id}`);
}

export function adminPointRulesByPointRulesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/point/api/v1/admin/point-rules/${id}`, data);
}

export function adminPointIntegrityByIntegrity(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/point/api/v1/admin/point/integrity/${accountId}`);
}

export function adminPoints(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/point/api/v1/admin/points`, { params });
}

export function adminPointsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/point/api/v1/admin/points`, data);
}

export function adminPointsApplyRulePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/point/api/v1/admin/points/apply-rule`, data);
}

export function adminPointsBatchEarnPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/point/api/v1/admin/points/batch-earn`, data);
}

export function adminPointsConfigDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/point/api/v1/admin/points/config`);
}

export function adminPointsConfig(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/point/api/v1/admin/points/config`);
}

export function adminPointsConfigPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/point/api/v1/admin/points/config`, data);
}

export function adminPointsStats(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/point/api/v1/admin/points/stats`);
}

export function adminPointsTransactions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/point/api/v1/admin/points/transactions`, { params });
}

export function adminPointsByPointsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/point/api/v1/admin/points/${userId}`);
}

export function adminPointsAdjustByPointsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/point/api/v1/admin/points/${userId}/adjust`, data);
}

export function adminPointsExpireByPointsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/point/api/v1/admin/points/${userId}/expire`, data);
}

export function adminPointsFreezeByPointsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/point/api/v1/admin/points/${userId}/freeze`, data);
}

export function adminPointsStatusByPointsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/point/api/v1/admin/points/${userId}/status`, data);
}

export function adminPointsUnfreezeByPointsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/point/api/v1/admin/points/${userId}/unfreeze`, data);
}

export function pointsByPoints(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/point/api/v1/points/${userId}`);
}

export function pointsConfirmDeductionByPointsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/point/api/v1/points/${userId}/confirm-deduction`, data);
}

export function pointsEarnByPointsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/point/api/v1/points/${userId}/earn`, data);
}

export function pointsExchangeByPointsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/point/api/v1/points/${userId}/exchange`, data);
}

export function pointsExpiringByPoints(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/point/api/v1/points/${userId}/expiring`, { params });
}

export function pointsRefundByPointsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/point/api/v1/points/${userId}/refund`, data);
}

export function pointsRiskScoreByPoints(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/point/api/v1/points/${userId}/risk-score`);
}

export function pointsSpendByPointsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/point/api/v1/points/${userId}/spend`, data);
}

export function pointsStatsByPoints(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/point/api/v1/points/${userId}/stats`);
}

export function pointsTransactionsByPoints(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/point/api/v1/points/${userId}/transactions`, { params });
}

export function pointsTransactionsByPointsByTransactions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/point/api/v1/points/${userId}/transactions/${txId}`);
}

export function pointsTransferByPointsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/point/api/v1/points/${userId}/transfer`, data);
}

export function pointsValueByPoints(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/point/api/v1/points/${userId}/value`);
}

