// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-oauth — auto-generated */
import type { ApiClient } from '@authms/core';

export function adminOauthClients(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/admin/oauth/clients`, { params });
}

export function adminOauthClientsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/admin/oauth/clients`, data);
}

export function adminOauthClientsByClientsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/oauth/api/v1/admin/oauth/clients/${clientId}`);
}

export function adminOauthClientsByClients(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/admin/oauth/clients/${clientId}`);
}

export function adminOauthClientsByClientsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/oauth/api/v1/admin/oauth/clients/${clientId}`, data);
}

export function adminOauthClientsAuditLogsByClients(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/admin/oauth/clients/${clientId}/audit-logs`, { params });
}

export function adminOauthClientsCloneByClientsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/admin/oauth/clients/${clientId}/clone`);
}

export function adminOauthClientsRotateSecretByClientsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/admin/oauth/clients/${clientId}/rotate-secret`);
}

export function adminOauthClientsSecretsByClients(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/admin/oauth/clients/${clientId}/secrets`);
}

export function adminOauthClientsSecretsByClientsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/admin/oauth/clients/${clientId}/secrets`);
}

export function adminOauthClientsSecretsByClientsBySecretsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/oauth/api/v1/admin/oauth/clients/${clientId}/secrets/${secretId}`);
}

export function adminOauthClientsSecretsDeactivateByClientsBySecretsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/oauth/api/v1/admin/oauth/clients/${clientId}/secrets/${secretId}/deactivate`);
}

export function adminOauthClientsStatsByClients(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/admin/oauth/clients/${clientId}/stats`);
}

export function adminOauthClientsTokensByClientsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/oauth/api/v1/admin/oauth/clients/${clientId}/tokens`, { params });
}

export function adminOauthClientsTokensByClients(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/admin/oauth/clients/${clientId}/tokens`, { params });
}

export function adminOauthDevices(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/admin/oauth/devices`, { params });
}

export function adminOauthDevicesByDevicesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/oauth/api/v1/admin/oauth/devices/${deviceCode}`);
}

export function adminOauthProviders(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/admin/oauth/providers`);
}

export function adminOauthProvidersPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/admin/oauth/providers`, data);
}

export function adminOauthProvidersByProvidersDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/oauth/api/v1/admin/oauth/providers/${name}`);
}

export function adminOauthProvidersByProvidersPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/oauth/api/v1/admin/oauth/providers/${name}`, data);
}

export function adminOauthProvidersToggleByProvidersPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/oauth/api/v1/admin/oauth/providers/${name}/toggle`, data);
}

export function adminOauthTokensUserByUserDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/oauth/api/v1/admin/oauth/tokens/user/${userId}`);
}

export function oauthAuthorize(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/oauth/authorize`, { params });
}

export function oauthAuthorizePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/oauth/authorize`, data);
}

export function oauthBindPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/oauth/bind`, data);
}

export function oauthClientByClient(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/oauth/client/${clientId}`);
}

export function oauthConnectionsByConnections(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/oauth/connections/${userId}`);
}

export function oauthConsents(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/oauth/consents`);
}

export function oauthConsentsByConsentsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/oauth/api/v1/oauth/consents/${id}`);
}

export function oauthDeviceAuthorizePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/oauth/device/authorize`, data);
}

export function oauthDeviceVerifyPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/oauth/device/verify`, data);
}

export function oauthDpopNonce(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/oauth/dpop/nonce`);
}

export function oauthIntrospectPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/oauth/introspect`);
}

export function oauthProviders(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/oauth/providers`);
}

export function oauthPushedAuthorizationPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/oauth/pushed-authorization`, data);
}

export function oauthRefreshPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/oauth/refresh`, data);
}

export function oauthRegisterPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/oauth/register`, data);
}

export function oauthRegisterByRegisterDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/oauth/api/v1/oauth/register/${clientId}`);
}

export function oauthRegisterByRegister(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/oauth/register/${clientId}`);
}

export function oauthRegisterByRegisterPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/oauth/api/v1/oauth/register/${clientId}`, data);
}

export function oauthRevokePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/oauth/revoke`, data);
}

export function oauthRiskAssessment(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/oauth/risk-assessment`, { params });
}

export function oauthTokenPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/oauth/token`);
}

export function oauthTokenExchangePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/oauth/api/v1/oauth/token-exchange`);
}

export function oauthUnbindByUnbindDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/oauth/api/v1/oauth/unbind/${connectionId}`);
}

export function oauthUserinfo(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/oauth/userinfo`);
}

export function oauthAuthorizeByOauth(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/oauth/${provider}/authorize`, { params });
}

export function oauthCallbackByOauth(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/oauth/api/v1/oauth/${provider}/callback`, { params });
}

