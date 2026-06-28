// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-verification — auto-generated */
import type { ApiClient } from '@authms/core';

export function adminVerifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/verification/api/v1/admin/verifications`, { params });
}

export function adminVerificationsExport(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/verification/api/v1/admin/verifications/export`, { params });
}

export function adminVerificationsGuardiansDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/verification/api/v1/admin/verifications/guardians`, { data });
}

export function adminVerificationsGuardians(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/verification/api/v1/admin/verifications/guardians`, { params });
}

export function adminVerificationsProviders(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/verification/api/v1/admin/verifications/providers`, { params });
}

export function adminVerificationsProvidersPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/verification/api/v1/admin/verifications/providers`, data);
}

export function adminVerificationsProvidersByProvidersDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/verification/api/v1/admin/verifications/providers/${verificationId}`);
}

export function adminVerificationsProvidersByProviders(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/verification/api/v1/admin/verifications/providers/${verificationId}`);
}

export function adminVerificationsProvidersByProvidersPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/verification/api/v1/admin/verifications/providers/${verificationId}`, data);
}

export function adminVerificationsStats(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/verification/api/v1/admin/verifications/stats`);
}

export function adminVerificationsByVerifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/verification/api/v1/admin/verifications/${verificationId}`);
}

export function adminVerificationsManualReviewByVerificationsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/verification/api/v1/admin/verifications/${verificationId}/manual-review`, data);
}

export function adminVerificationsOverrideByVerificationsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/verification/api/v1/admin/verifications/${verificationId}/override`, data);
}

export function adminVerificationsResetByVerificationsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/verification/api/v1/admin/verifications/${verificationId}/reset`);
}

export function adminVerificationsResolveReviewByVerificationsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/verification/api/v1/admin/verifications/${verificationId}/resolve-review`, data);
}

export function verificationConsentPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/verification/api/v1/verification/consent`, data, { params });
}

export function verificationGuardiansDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/verification/api/v1/verification/guardians`, { data });
}

export function verificationGuardiansPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/verification/api/v1/verification/guardians`, data);
}

export function verificationGuardiansIdPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/verification/api/v1/verification/guardians/:id`, data);
}

export function verificationGuardiansIdConsentPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/verification/api/v1/verification/guardians/:id/consent`, data);
}

export function verificationGuardiansIdVerifyPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/verification/api/v1/verification/guardians/:id/verify`);
}

export function verificationGuardiansMinors(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/verification/api/v1/verification/guardians/minors`);
}

export function verificationLivenessBeginPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/verification/api/v1/verification/liveness/begin`, data);
}

export function verificationLivenessVerifyPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/verification/api/v1/verification/liveness/verify`, data);
}

export function verificationMe(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/verification/api/v1/verification/me`);
}

export function verificationMeDetail(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/verification/api/v1/verification/me/detail`);
}

export function verificationMinorsGuardians(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/verification/api/v1/verification/minors/guardians`, { params });
}

export function verificationMinorsProtectionPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/verification/api/v1/verification/minors/protection`, data);
}

export function verificationOcrPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/verification/api/v1/verification/ocr`, data);
}

export function verificationVerifyPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/verification/api/v1/verification/verify`, data, { params });
}

