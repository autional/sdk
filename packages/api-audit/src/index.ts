// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-audit — auto-generated */
import type { ApiClient } from '@authms/core';

export function adminAuditAlerts(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/alerts`, { params });
}

export function adminAuditAlertsByAlerts(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/alerts/${alertId}`);
}

export function adminAuditAlertsAssignByAlertsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/alerts/${alertId}/assign`, data);
}

export function adminAuditAlertsStatusByAlertsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/audit/api/v1/admin/audit/alerts/${alertId}/status`, data);
}

export function adminAuditAnomalies(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/anomalies`, { params });
}

export function adminAuditAnomaliesDetectPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/anomalies/detect`, data);
}

export function adminAuditAnomaliesByAnomalies(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/anomalies/${anomalyId}`);
}

export function adminAuditAnomaliesAssignByAnomaliesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/assign`, data);
}

export function adminAuditAnomaliesCommentByAnomaliesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/comment`, data);
}

export function adminAuditAnomaliesLinkByAnomaliesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/link`, data);
}

export function adminAuditAnomaliesRelatedByAnomalies(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/related`);
}

export function adminAuditAnomaliesStatusByAnomaliesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/status`, data);
}

export function adminAuditAnomaliesTimelineByAnomalies(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/anomalies/${anomalyId}/timeline`);
}

export function adminAuditArchivePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/archive`, data);
}

export function adminAuditArchiveStatus(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/archive/status`);
}

export function adminAuditBillingEvents(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/billing-events`, { params });
}

export function adminAuditComplianceAiDecisions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/compliance/ai-decisions`);
}

export function adminAuditComplianceAiDecisionsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/compliance/ai-decisions`, data);
}

export function adminAuditComplianceAiDecisionsByAiDecisions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/compliance/ai-decisions/${id}`);
}

export function adminAuditComplianceBreaches(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/compliance/breaches`);
}

export function adminAuditComplianceBreachesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/compliance/breaches`, data);
}

export function adminAuditComplianceBreachesByBreaches(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/compliance/breaches/${id}`);
}

export function adminAuditComplianceCleanupRecords(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/compliance/cleanup-records`);
}

export function adminAuditComplianceCleanupRecordsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/compliance/cleanup-records`, data);
}

export function adminAuditComplianceCleanupRecordsByCleanupRecords(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/compliance/cleanup-records/${connectorId}`);
}

export function adminAuditComplianceCrossBorder(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/compliance/cross-border`);
}

export function adminAuditComplianceCrossBorderPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/compliance/cross-border`, data);
}

export function adminAuditComplianceCrossBorderByCrossBorder(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/compliance/cross-border/${id}`);
}

export function adminAuditComplianceDataClassifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/compliance/data-classifications`);
}

export function adminAuditComplianceDataClassificationsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/compliance/data-classifications`, data);
}

export function adminAuditComplianceDataClassificationsByDataClassifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/compliance/data-classifications/${id}`);
}

export function adminAuditCompliancePias(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/compliance/pias`);
}

export function adminAuditCompliancePiasPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/compliance/pias`, data);
}

export function adminAuditCompliancePiasByPias(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/compliance/pias/${id}`);
}

export function adminAuditComplianceRoleActions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/compliance/role-actions`);
}

export function adminAuditComplianceSodRules(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/compliance/sod-rules`);
}

export function adminAuditExportPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/export`, data);
}

export function adminAuditExportJobs(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/export/jobs`, { params });
}

export function adminAuditExportDownloadByExport(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/export/${jobId}/download`);
}

export function adminAuditExportStatusByExport(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/export/${jobId}/status`);
}

export function adminAuditHashchainByHashchain(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/hashchain/${tenantId}`);
}

export function adminAuditHashchainVerifyByDateByHashchain(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/hashchain/${tenantId}/verify-by-date`, { params });
}

export function adminAuditIncidents(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/incidents`, { params });
}

export function adminAuditIncidentsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/incidents`, data);
}

export function adminAuditIncidentsByIncidents(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/incidents/${incidentId}`);
}

export function adminAuditIncidentsCommentByIncidentsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/incidents/${incidentId}/comment`, data);
}

export function adminAuditIncidentsStatusByIncidentsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/audit/api/v1/admin/audit/incidents/${incidentId}/status`, data);
}

export function adminAuditLogs(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/logs`, { params });
}

export function adminAuditLogsByLogs(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/logs/${alertId}`);
}

export function adminAuditMerkleProof(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/merkle-proof`, { params });
}

export function adminAuditMerkleProofsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/merkle-proofs`, data);
}

export function adminAuditMerkleRoot(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/merkle-root`, { params });
}

export function adminAuditPaymentEvents(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/payment-events`, { params });
}

export function adminAuditReportsCompliance(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/reports/compliance`, { params });
}

export function adminAuditReportsSecurity(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/reports/security`, { params });
}

export function adminAuditRetentionPolicy(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/retention-policy`, { params });
}

export function adminAuditRetentionPolicyPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/audit/api/v1/admin/audit/retention-policy`, data);
}

export function adminAuditServerLogs(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/server-logs`, { params });
}

export function adminAuditServerLogsServices(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/server-logs/services`);
}

export function adminAuditSiemConnectors(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/siem/connectors`, { params });
}

export function adminAuditSiemConnectorsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/siem/connectors`, data);
}

export function adminAuditSiemConnectorsByConnectorsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/audit/api/v1/admin/audit/siem/connectors/${anomalyId}`);
}

export function adminAuditSiemConnectorsByConnectorsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/audit/api/v1/admin/audit/siem/connectors/${anomalyId}`, data);
}

export function adminAuditSiemConnectorsTestByConnectorsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/siem/connectors/${anomalyId}/test`);
}

export function adminAuditStats(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/stats`);
}

export function adminAuditStream(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/stream`, { params });
}

export function adminAuditTenantConfig(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/tenant-config`);
}

export function adminAuditTenantConfigPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/audit/api/v1/admin/audit/tenant-config`, data);
}

export function adminAuditVerifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/verifications`);
}

export function adminAuditVerificationsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/audit/api/v1/admin/audit/verifications`, data);
}

export function adminAuditWalletEvents(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/admin/audit/wallet-events`, { params });
}

export function auditPublicHashchain(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/audit/public/hashchain`);
}

export function auditPublicLogsSummary(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/audit/public/logs-summary`);
}

export function auditPublicStats(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/audit/api/v1/audit/public/stats`);
}

