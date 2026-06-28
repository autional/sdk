// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-pay — auto-generated */
import type { ApiClient } from '@authms/core';

export function adminPayIntegrityByIntegrity(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/pay/api/v1/admin/pay/integrity/${payId}`);
}

export function adminPaymentsChannels(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/pay/api/v1/admin/payments/channels`);
}

export function adminPaymentsChannelsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/pay/api/v1/admin/payments/channels`, data);
}

export function adminPaymentsChannelsByChannelsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/pay/api/v1/admin/payments/channels/${paymentId}`);
}

export function adminPaymentsChannelsByChannels(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/pay/api/v1/admin/payments/channels/${paymentId}`);
}

export function adminPaymentsChannelsByChannelsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/pay/api/v1/admin/payments/channels/${paymentId}`, data);
}

export function adminPaymentsReconciliationPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/pay/api/v1/admin/payments/reconciliation`, undefined, { params });
}

export function adminPaymentsReconciliationHistory(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/pay/api/v1/admin/payments/reconciliation/history`, { params });
}

export function adminPaymentsReconciliationByReconciliationDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/pay/api/v1/admin/payments/reconciliation/${paymentId}`);
}

export function adminPaymentsWebhooks(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/pay/api/v1/admin/payments/webhooks`, { params });
}

export function adminPaymentsWebhooksByWebhooksDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/pay/api/v1/admin/payments/webhooks/${paymentId}`);
}

export function payments(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/pay/api/v1/payments`, { params });
}

export function paymentsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/pay/api/v1/payments`, data);
}

export function paymentsRefundPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/pay/api/v1/payments/refund`, data);
}

export function paymentsReturnByReturn(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/pay/api/v1/payments/return/${channel}`, { params });
}

export function paymentsByPaymentsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/pay/api/v1/payments/${paymentId}`);
}

export function paymentsByPayments(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/pay/api/v1/payments/${paymentId}`);
}

export function paymentsInvoiceByPaymentsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/pay/api/v1/payments/${paymentId}/invoice`);
}

export function paymentsReceiptByPayments(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/pay/api/v1/payments/${paymentId}/receipt`);
}

export function paymentsRefundByPayments(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/pay/api/v1/payments/${paymentId}/refund`);
}

export function paymentsRefundsByPayments(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/pay/api/v1/payments/${paymentId}/refunds`);
}

export function refundsByRefunds(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/pay/api/v1/refunds/${refundId}`);
}

export function webhooksPaymentByPaymentPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/pay/api/v1/webhooks/payment/${channel}`);
}

