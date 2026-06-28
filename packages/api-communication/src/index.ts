// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-communication — auto-generated */
import type { ApiClient } from '@authms/core';

export function adminCommunicationLogs(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/communication/api/v1/admin/communication/logs`, { params });
}

export function adminCommunicationPlatformStats(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/communication/api/v1/admin/communication/platform-stats`);
}

export function adminCommunicationProvidersPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/communication/api/v1/admin/communication/providers`, data);
}

export function adminCommunicationProvidersByProvidersDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/communication/api/v1/admin/communication/providers/${templateId}`);
}

export function adminCommunicationProvidersByProvidersPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/communication/api/v1/admin/communication/providers/${templateId}`, data);
}

export function adminCommunicationRateLimits(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/communication/api/v1/admin/communication/rate-limits`, { params });
}

export function adminCommunicationResendByResendPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/communication/api/v1/admin/communication/resend/${templateId}`);
}

export function adminCommunicationTemplatesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/communication/api/v1/admin/communication/templates`, data);
}

export function adminCommunicationTemplatesByTemplatesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/communication/api/v1/admin/communication/templates/${templateId}`);
}

export function adminCommunicationTemplatesByTemplatesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/communication/api/v1/admin/communication/templates/${templateId}`, data);
}

export function adminCommunicationTemplatesCloneToLocaleByTemplatesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/communication/api/v1/admin/communication/templates/${templateId}/clone-to-locale`, data);
}

export function adminCommunicationTemplatesPreviewByTemplatesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/communication/api/v1/admin/communication/templates/${templateId}/preview`, data);
}

export function adminCommunicationTemplatesVersionsByTemplates(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/communication/api/v1/admin/communication/templates/${templateId}/versions`);
}

export function communicationBulkPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/communication/api/v1/communication/bulk`, data);
}

export function communicationCallbackByCallbackPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/communication/api/v1/communication/callback/${provider}`, data);
}

export function communicationDashboard(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/communication/api/v1/communication/dashboard`, { params });
}

export function communicationEmailPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/communication/api/v1/communication/email`, data);
}

export function communicationHealthByHealth(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/communication/api/v1/communication/health/${channel}`);
}

export function communicationLogs(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/communication/api/v1/communication/logs`, { params });
}

export function communicationProviders(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/communication/api/v1/communication/providers`, { params });
}

export function communicationProvidersByProviders(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/communication/api/v1/communication/providers/${templateId}`);
}

export function communicationPushPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/communication/api/v1/communication/push`, data);
}

export function communicationPushTokens(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/communication/api/v1/communication/push-tokens`, { params });
}

export function communicationPushTokensPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/communication/api/v1/communication/push-tokens`, data);
}

export function communicationPushTokensByPushTokensDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/communication/api/v1/communication/push-tokens/${templateId}`);
}

export function communicationPushTokensByPushTokensPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/communication/api/v1/communication/push-tokens/${templateId}`, data);
}

export function communicationRateLimits(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/communication/api/v1/communication/rate-limits`, { params });
}

export function communicationScheduledByScheduledDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/communication/api/v1/communication/scheduled/${templateId}`, { data });
}

export function communicationSmsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/communication/api/v1/communication/sms`, data);
}

export function communicationTemplateStats(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/communication/api/v1/communication/template-stats`, { params });
}

export function communicationTemplates(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/communication/api/v1/communication/templates`, { params });
}

export function communicationTemplatesAvailable(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/communication/api/v1/communication/templates/available`, { params });
}

export function communicationTemplatesByTemplates(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/communication/api/v1/communication/templates/${templateId}`);
}

