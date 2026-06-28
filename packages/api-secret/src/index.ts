// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-secret — auto-generated */
import type { ApiClient } from '@authms/core';

export function adminSecrets(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/secret/api/v1/admin/secrets`, { params });
}

export function adminSecretsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/secret/api/v1/admin/secrets`, data);
}

export function adminSecretsBatchDeletePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/secret/api/v1/admin/secrets/batch-delete`, data);
}

export function adminSecretsBatchRevokePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/secret/api/v1/admin/secrets/batch-revoke`, data);
}

export function adminSecretsDetail(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/secret/api/v1/admin/secrets/detail`, { params });
}

export function adminSecretsEncryptionKeys(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/secret/api/v1/admin/secrets/encryption-keys`);
}

export function adminSecretsItemByItemDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/secret/api/v1/admin/secrets/item/${key}`);
}

export function adminSecretsJwtKeys(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/secret/api/v1/admin/secrets/jwt/keys`);
}

export function adminSecretsPolicyDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/secret/api/v1/admin/secrets/policy`);
}

export function adminSecretsPolicy(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/secret/api/v1/admin/secrets/policy`);
}

export function adminSecretsPolicyPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/secret/api/v1/admin/secrets/policy`, data);
}

export function adminSecretsRevokePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/secret/api/v1/admin/secrets/revoke`, undefined, { params });
}

export function adminSecretsRotatePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/secret/api/v1/admin/secrets/rotate`, data, { params });
}

export function adminSecretsUpdatePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/secret/api/v1/admin/secrets/update`, data, { params });
}

export function adminSecretsVersions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/secret/api/v1/admin/secrets/versions`, { params });
}

export function adminSecretsVersionsValuePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/secret/api/v1/admin/secrets/versions/value`, data, { params });
}

export function secretPublicJwtPublicKey(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/secret/api/v1/secret/public/jwt/public-key`);
}

export function secretPublicTransmissionPublicKey(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/secret/api/v1/secret/public/transmission/public-key`);
}

