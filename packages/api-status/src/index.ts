// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-status — auto-generated */
import type { ApiClient } from '@authms/core';

export function statusBadgeByBadge(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/status/api/v1/status/badge/${service}`);
}

export function statusIncidents(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/status/api/v1/status/incidents`, { params });
}

export function statusIncidentsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/status/api/v1/status/incidents`, data);
}

export function statusIncidentsByIncidentsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/status/api/v1/status/incidents/${incidentId}`);
}

export function statusIncidentsByIncidents(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/status/api/v1/status/incidents/${incidentId}`);
}

export function statusIncidentsByIncidentsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/status/api/v1/status/incidents/${incidentId}`, data);
}

export function statusIncidentsUpdatesByIncidentsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/status/api/v1/status/incidents/${incidentId}/updates`, data);
}

export function statusJson(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/status/api/v1/status/json`);
}

export function statusMaintenances(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/status/api/v1/status/maintenances`, { params });
}

export function statusMaintenancesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/status/api/v1/status/maintenances`, data);
}

export function statusMaintenancesByMaintenancesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/status/api/v1/status/maintenances/${id}`);
}

export function statusMaintenancesByMaintenances(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/status/api/v1/status/maintenances/${id}`);
}

export function statusMaintenancesByMaintenancesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/status/api/v1/status/maintenances/${id}`, data);
}

export function statusMetricsLatency(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/status/api/v1/status/metrics/latency`, { params });
}

export function statusMetricsUptime(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/status/api/v1/status/metrics/uptime`, { params });
}

export function statusOverview(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/status/api/v1/status/overview`);
}

export function statusRss(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/status/api/v1/status/rss`);
}

export function statusServices(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/status/api/v1/status/services`);
}

export function statusSubscriptionsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/status/api/v1/status/subscriptions`, { data });
}

export function statusSubscriptions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/status/api/v1/status/subscriptions`, { params });
}

export function statusSubscriptionsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/status/api/v1/status/subscriptions`, data);
}

export function statusSubscriptionsPreferences(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/status/api/v1/status/subscriptions/preferences`, { params });
}

export function statusSubscriptionsPreferencesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/status/api/v1/status/subscriptions/preferences`, data);
}

export function statusSubscriptionsVerifyPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/status/api/v1/status/subscriptions/verify`, undefined, { params });
}

