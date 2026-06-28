// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-profile — auto-generated */
import type { ApiClient } from '@authms/core';

export function adminProfiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/admin/profiles`, { params });
}

export function adminProfilesApprovalRequests(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/admin/profiles/approval-requests`);
}

export function adminProfilesApprovalRequestsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/profile/api/v1/admin/profiles/approval-requests`, data);
}

export function adminProfilesApprovalRequestsByApprovalRequestsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/profile/api/v1/admin/profiles/approval-requests/${requestId}`);
}

export function adminProfilesApprovalRequestsApproveByApprovalRequestsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/profile/api/v1/admin/profiles/approval-requests/${requestId}/approve`);
}

export function adminProfilesApprovalRequestsRejectByApprovalRequestsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/profile/api/v1/admin/profiles/approval-requests/${requestId}/reject`, data);
}

export function adminProfilesBatchArchivePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/profile/api/v1/admin/profiles/batch-archive`, data);
}

export function adminProfilesBatchDeletePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/profile/api/v1/admin/profiles/batch-delete`, data);
}

export function adminProfilesBatchExportPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/profile/api/v1/admin/profiles/batch-export`, data);
}

export function adminProfilesFieldSchemas(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/admin/profiles/field-schemas`);
}

export function adminProfilesFieldSchemasPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/profile/api/v1/admin/profiles/field-schemas`, data);
}

export function adminProfilesFieldSchemasByFieldSchemasDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/profile/api/v1/admin/profiles/field-schemas/${fieldKey}`);
}

export function adminProfilesFieldSchemasByFieldSchemasPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/profile/api/v1/admin/profiles/field-schemas/${fieldKey}`, data);
}

export function adminProfilesPolicyDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/profile/api/v1/admin/profiles/policy`);
}

export function adminProfilesPolicy(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/admin/profiles/policy`);
}

export function adminProfilesPolicyPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/profile/api/v1/admin/profiles/policy`, data);
}

export function adminProfilesPolicyPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/profile/api/v1/admin/profiles/policy`, data);
}

export function adminProfilesStats(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/admin/profiles/stats`);
}

export function adminProfilesVersionsByVersionsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/profile/api/v1/admin/profiles/versions/${requestId}`);
}

export function adminProfilesWebhookDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/profile/api/v1/admin/profiles/webhook`);
}

export function adminProfilesWebhook(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/admin/profiles/webhook`);
}

export function adminProfilesWebhookPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/profile/api/v1/admin/profiles/webhook`, data);
}

export function adminProfilesWebhookPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/profile/api/v1/admin/profiles/webhook`, data);
}

export function adminProfilesArchiveByProfilesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/profile/api/v1/admin/profiles/${userId}/archive`, data);
}

export function adminProfilesExportByProfiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/admin/profiles/${userId}/export`, { params });
}

export function adminProfilesVersionsByProfiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/admin/profiles/${userId}/versions`);
}

export function profileAvatar(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/profile/avatar`);
}

export function profiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/profiles`, { params });
}

export function profilesByProfilesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/profile/api/v1/profiles/${userId}`);
}

export function profilesByProfiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/profiles/${userId}`);
}

export function profilesByProfilesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/profile/api/v1/profiles/${userId}`, data);
}

export function profilesAvatarByProfilesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/profile/api/v1/profiles/${userId}/avatar`, data);
}

export function profilesAvatarUploadByProfilesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/profile/api/v1/profiles/${userId}/avatar/upload`);
}

export function profilesCompletenessByProfiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/profiles/${userId}/completeness`);
}

export function profilesConsentsByProfiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/profiles/${userId}/consents`);
}

export function profilesConsentsByProfilesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/profile/api/v1/profiles/${userId}/consents`, data);
}

export function profilesConsentsByProfilesByConsentsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/profile/api/v1/profiles/${userId}/consents/${fieldKey}`);
}

export function profilesExportByProfiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/profiles/${userId}/export`, { params });
}

export function profilesFieldsByProfiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/profiles/${userId}/fields`);
}

export function profilesFieldsByProfilesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/profile/api/v1/profiles/${userId}/fields`, data);
}

export function profilesPreferencesByProfiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/profiles/${userId}/preferences`);
}

export function profilesPreferencesByProfilesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/profile/api/v1/profiles/${userId}/preferences`, data);
}

export function profilesPrivacyByProfiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/profiles/${userId}/privacy`);
}

export function profilesPrivacyByProfilesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/profile/api/v1/profiles/${userId}/privacy`, data);
}

export function profilesPrivacyImpactByProfiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/profiles/${userId}/privacy-impact`);
}

export function profilesPublicByProfiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/profile/api/v1/profiles/${userId}/public`);
}

export function profilesTagsByProfilesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/profile/api/v1/profiles/${userId}/tags`);
}

export function profilesTagsByProfilesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/profile/api/v1/profiles/${userId}/tags`, data);
}

export function profilesVersionsByProfilesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/profile/api/v1/profiles/${userId}/versions`);
}

