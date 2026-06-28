// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-saml — auto-generated */
import type { ApiClient } from '@authms/core';

export function adminSamlProviders(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/saml/api/v1/admin/saml/providers`, { params });
}

export function adminSamlProvidersPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/saml/api/v1/admin/saml/providers`, data);
}

export function adminSamlProvidersByProvidersDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/saml/api/v1/admin/saml/providers/${id}`);
}

export function adminSamlProvidersByProviders(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/saml/api/v1/admin/saml/providers/${id}`);
}

export function adminSamlProvidersByProvidersPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/saml/api/v1/admin/saml/providers/${id}`, data);
}

export function adminSamlProvidersAttributeMappingByProvidersPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/saml/api/v1/admin/saml/providers/${id}/attribute-mapping`, data);
}

export function samlAcsBySamlPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/saml/api/v1/saml/${providerId}/acs`);
}

export function samlLoginBySaml(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/saml/api/v1/saml/${providerId}/login`);
}

export function samlMetadataBySaml(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/saml/api/v1/saml/${providerId}/metadata`);
}

export function samlSloBySaml(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/saml/api/v1/saml/${providerId}/slo`);
}

export function samlSloSpBySaml(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/saml/api/v1/saml/${providerId}/slo/sp`, { params });
}

