// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-session — auto-generated */
import type { ApiClient } from '@authms/core';

export function adminDevicesRiskByDevices(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/admin/devices/${deviceId}/risk`);
}

export function adminSessions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/admin/sessions`, { params });
}

export function adminSessionsActiveCount(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/admin/sessions/active-count`);
}

export function adminSessionsBulkDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/session/api/v1/admin/sessions/bulk`, { data });
}

export function adminSessionsDeviceFingerprint(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/admin/sessions/device-fingerprint`, { params });
}

export function adminSessionsExpiredDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/session/api/v1/admin/sessions/expired`);
}

export function adminSessionsRiskScore(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/admin/sessions/risk-score`, { params });
}

export function adminSessionsStats(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/admin/sessions/stats`);
}

export function adminSessionsUserByUserDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/session/api/v1/admin/sessions/user/${userId}`, { data });
}

export function adminTokens(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/admin/tokens`, { params });
}

export function adminTokensBlacklist(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/admin/tokens/blacklist`, { params });
}

export function adminTokensBlacklistByBlacklistDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/session/api/v1/admin/tokens/blacklist/${deviceId}`);
}

export function adminTokensConfigDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/session/api/v1/admin/tokens/config`);
}

export function adminTokensConfig(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/admin/tokens/config`);
}

export function adminTokensConfigPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/session/api/v1/admin/tokens/config`, data);
}

export function adminTokensExchangePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/session/api/v1/admin/tokens/exchange`, data);
}

export function adminTokensIntrospectPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/session/api/v1/admin/tokens/introspect`, data);
}

export function adminTokensRevokeAllPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/session/api/v1/admin/tokens/revoke-all`, data);
}

export function adminTokensByTokens(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/admin/tokens/${deviceId}`);
}

export function adminTrustedDevices(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/admin/trusted-devices`, { params });
}

export function adminTrustedDevicesByTrustedDevicesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/session/api/v1/admin/trusted-devices/${deviceId}`);
}

export function sessions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/sessions`, { params });
}

export function sessionsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/session/api/v1/sessions`, data);
}

export function sessionsRefreshPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/session/api/v1/sessions/refresh`, data);
}

export function sessionsRotateAccessPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/session/api/v1/sessions/rotate-access`, data);
}

export function sessionsUserSessionsByUser(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/sessions/user/${userId}/sessions`, { params });
}

export function sessionsBySessionsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/session/api/v1/sessions/${sessionId}`, { data });
}

export function sessionsBySessions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/sessions/${sessionId}`);
}

export function sessionsActivityBySessionsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/session/api/v1/sessions/${sessionId}/activity`);
}

export function sessionsUpgradeMfaBySessionsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/session/api/v1/sessions/${sessionId}/upgrade-mfa`);
}

export function sessionsValidateBySessionsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/session/api/v1/sessions/${sessionId}/validate`);
}

export function tokensBlacklistPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/session/api/v1/tokens/blacklist`, data);
}

export function tokensBlacklistCheck(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/tokens/blacklist/check`, { params });
}

export function trustedDevices(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/session/api/v1/trusted-devices`);
}

export function trustedDevicesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/session/api/v1/trusted-devices`, data);
}

export function trustedDevicesByTrustedDevicesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/session/api/v1/trusted-devices/${deviceId}`);
}

