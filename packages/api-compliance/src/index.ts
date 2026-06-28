// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-compliance — auto-generated */
import type { ApiClient } from '@authms/core';

export function adminComplianceAiDecisions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/ai-decisions`, { params });
}

export function adminComplianceAiDecisionsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/ai-decisions`, data);
}

export function adminComplianceAiDecisionsByAiDecisionsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/ai-decisions/${decisionId}`);
}

export function adminComplianceAiDecisionsByAiDecisionsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/ai-decisions/${decisionId}`, data);
}

export function adminComplianceAiDecisionsReviewByAiDecisionsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/ai-decisions/${decisionId}/review`, data);
}

export function adminComplianceAiDecisionsByAiDecisions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/ai-decisions/${id}`);
}

export function adminComplianceAuditFindings(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/audit-findings`, { params });
}

export function adminComplianceAuditFindingsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/audit-findings`, data);
}

export function adminComplianceAuditFindingsByAuditFindingsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/audit-findings/${decisionId}`);
}

export function adminComplianceAuditFindingsByAuditFindings(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/audit-findings/${decisionId}`);
}

export function adminComplianceAuditFindingsByAuditFindingsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/audit-findings/${decisionId}`, data);
}

export function adminComplianceBreachNotifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/breach-notifications`, { params });
}

export function adminComplianceBreachNotificationsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/breach-notifications`, data);
}

export function adminComplianceBreachNotificationsByBreachNotificationsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/breach-notifications/${decisionId}`);
}

export function adminComplianceBreachNotificationsByBreachNotificationsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/breach-notifications/${decisionId}`, data);
}

export function adminComplianceBreachNotificationsByBreachNotifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/breach-notifications/${id}`);
}

export function adminComplianceCertifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/certifications`, { params });
}

export function adminComplianceCertificationsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/certifications`, data);
}

export function adminComplianceCertificationsByCertificationsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/certifications/${decisionId}`);
}

export function adminComplianceCertificationsByCertifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/certifications/${decisionId}`);
}

export function adminComplianceCertificationsByCertificationsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/certifications/${decisionId}`, data);
}

export function adminComplianceCleanupRecordsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/cleanup-records`, data);
}

export function adminComplianceCrossBorderTransfers(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/cross-border-transfers`, { params });
}

export function adminComplianceCrossBorderTransfersPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/cross-border-transfers`, data);
}

export function adminComplianceCrossBorderTransfersByCrossBorderTransfersDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/cross-border-transfers/${decisionId}`);
}

export function adminComplianceCrossBorderTransfersByCrossBorderTransfersPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/cross-border-transfers/${decisionId}`, data);
}

export function adminComplianceCrossBorderTransfersByCrossBorderTransfers(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/cross-border-transfers/${id}`);
}

export function adminComplianceDataClassifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/data-classifications`, { params });
}

export function adminComplianceDataClassificationsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/data-classifications`, data);
}

export function adminComplianceDataClassificationsByDataClassificationsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/data-classifications/${decisionId}`);
}

export function adminComplianceDataClassificationsByDataClassificationsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/data-classifications/${decisionId}`, data);
}

export function adminComplianceDataClassificationsByDataClassifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/data-classifications/${id}`);
}

export function adminComplianceDengbaoControls(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/dengbao/controls`, { params });
}

export function adminComplianceDengbaoControlsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/dengbao/controls`, data);
}

export function adminComplianceDengbaoControlsByControlsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/dengbao/controls/${decisionId}`);
}

export function adminComplianceDengbaoControlsByControlsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/dengbao/controls/${decisionId}`, data);
}

export function adminComplianceEvidence(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/evidence`, { params });
}

export function adminComplianceEvidencePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/evidence`, data);
}

export function adminComplianceEvidenceByEvidenceDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/evidence/${decisionId}`);
}

export function adminComplianceEvidenceByEvidence(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/evidence/${decisionId}`);
}

export function adminComplianceEvidenceByEvidencePut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/evidence/${id}`, data);
}

export function adminComplianceGdprConsentDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/gdpr/consent`, { data });
}

export function adminComplianceGdprConsent(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/gdpr/consent`, { params });
}

export function adminComplianceGdprConsentPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/gdpr/consent`, data);
}

export function adminComplianceGdprConsentByConsent(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/gdpr/consent/${decisionId}`);
}

export function adminComplianceGdprDsar(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/gdpr/dsar`, { params });
}

export function adminComplianceGdprDsarPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/gdpr/dsar`, data);
}

export function adminComplianceGdprDsarByDsarDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/gdpr/dsar/${decisionId}`);
}

export function adminComplianceGdprDsarByDsar(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/gdpr/dsar/${decisionId}`);
}

export function adminComplianceGdprDsarByDsarPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/gdpr/dsar/${decisionId}`, data);
}

export function adminComplianceGdprRightToErasure(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/gdpr/right-to-erasure`, { params });
}

export function adminComplianceGdprRightToErasurePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/gdpr/right-to-erasure`, data);
}

export function adminComplianceGdprRightToErasureByRightToErasure(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/gdpr/right-to-erasure/${decisionId}`);
}

export function adminComplianceGdprRightToErasureByRightToErasurePut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/gdpr/right-to-erasure/${decisionId}`, data);
}

export function adminComplianceGdprRightToErasureExecuteByRightToErasurePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/gdpr/right-to-erasure/${decisionId}/execute`);
}

export function adminComplianceHipaaControls(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/hipaa/controls`, { params });
}

export function adminComplianceHipaaControlsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/hipaa/controls`, data);
}

export function adminComplianceHipaaControlsByControlsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/hipaa/controls/${decisionId}`);
}

export function adminComplianceHipaaControlsByControlsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/hipaa/controls/${decisionId}`, data);
}

export function adminComplianceIso27001Controls(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/iso27001/controls`, { params });
}

export function adminComplianceIso27001ControlsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/iso27001/controls`, data);
}

export function adminComplianceIso27001ControlsByControlsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/iso27001/controls/${decisionId}`);
}

export function adminComplianceIso27001ControlsByControlsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/iso27001/controls/${decisionId}`, data);
}

export function adminComplianceIso27001ControlsByControls(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/iso27001/controls/${id}`);
}

export function adminCompliancePcidssControls(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/pcidss/controls`, { params });
}

export function adminCompliancePcidssControlsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/pcidss/controls`, data);
}

export function adminCompliancePcidssControlsByControlsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/pcidss/controls/${decisionId}`);
}

export function adminCompliancePcidssControlsByControlsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/pcidss/controls/${decisionId}`, data);
}

export function adminCompliancePenetrationTestReports(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/penetration-test-reports`, { params });
}

export function adminCompliancePenetrationTestReportsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/penetration-test-reports`, data);
}

export function adminCompliancePenetrationTestReportsByPenetrationTestReportsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/penetration-test-reports/${decisionId}`);
}

export function adminCompliancePenetrationTestReportsByPenetrationTestReportsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/penetration-test-reports/${decisionId}`, data);
}

export function adminCompliancePiplControls(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/pipl/controls`, { params });
}

export function adminCompliancePiplControlsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/pipl/controls`, data);
}

export function adminCompliancePiplControlsByControlsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/pipl/controls/${decisionId}`);
}

export function adminCompliancePiplControlsByControlsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/pipl/controls/${decisionId}`, data);
}

export function adminCompliancePrivacyImpact(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/privacy-impact`, { params });
}

export function adminCompliancePrivacyImpactPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/privacy-impact`, data);
}

export function adminCompliancePrivacyImpactByPrivacyImpactDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/privacy-impact/${decisionId}`);
}

export function adminCompliancePrivacyImpactByPrivacyImpactPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/privacy-impact/${decisionId}`, data);
}

export function adminCompliancePrivacyImpactByPrivacyImpact(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/privacy-impact/${id}`);
}

export function adminCompliancePrivacyPoliciesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/privacy-policies`, data);
}

export function adminComplianceProfilePut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/profile`, data);
}

export function adminCompliancePsd2Controls(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/psd2/controls`, { params });
}

export function adminCompliancePsd2ControlsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/psd2/controls`, data);
}

export function adminCompliancePsd2ControlsByControlsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/psd2/controls/${decisionId}`);
}

export function adminCompliancePsd2ControlsByControlsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/psd2/controls/${decisionId}`, data);
}

export function adminComplianceRegulatoryWatch(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/regulatory-watch`, { params });
}

export function adminComplianceRegulatoryWatchPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/regulatory-watch`, data);
}

export function adminComplianceRegulatoryWatchByRegulatoryWatchDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/regulatory-watch/${decisionId}`);
}

export function adminComplianceRegulatoryWatchByRegulatoryWatchPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/regulatory-watch/${decisionId}`, data);
}

export function adminComplianceRetentionPolicies(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/retention-policies`, { params });
}

export function adminComplianceRetentionPoliciesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/retention-policies`, data);
}

export function adminComplianceRetentionPoliciesByRetentionPoliciesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/retention-policies/${decisionId}`);
}

export function adminComplianceRetentionPoliciesByRetentionPoliciesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/retention-policies/${decisionId}`, data);
}

export function adminComplianceSodChecks(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/sod-checks`);
}

export function adminComplianceSodRules(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/sod-rules`, { params });
}

export function adminComplianceSodRulesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/sod-rules`, data);
}

export function adminComplianceSodRulesBySodRulesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/sod-rules/${decisionId}`);
}

export function adminComplianceSodRulesBySodRulesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/sod-rules/${decisionId}`, data);
}

export function adminComplianceSoxItgc(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/sox/itgc`, { params });
}

export function adminComplianceSoxItgcPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/sox/itgc`, data);
}

export function adminComplianceSoxItgcByItgcDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/sox/itgc/${decisionId}`);
}

export function adminComplianceSoxItgcByItgcPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/sox/itgc/${decisionId}`, data);
}

export function adminComplianceSoxItgcByItgc(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/sox/itgc/${id}`);
}

export function adminComplianceStandards(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/standards`);
}

export function adminComplianceStandardsReloadPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/standards/reload`);
}

export function adminComplianceStandardsByStandards(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/standards/${decisionId}`);
}

export function adminComplianceStandardsControlsByStandards(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/standards/${decisionId}/controls`);
}

export function adminComplianceSubprocessors(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/subprocessors`, { params });
}

export function adminComplianceSubprocessorsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/subprocessors`, data);
}

export function adminComplianceSubprocessorsBySubprocessorsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/subprocessors/${decisionId}`);
}

export function adminComplianceSubprocessorsBySubprocessors(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/subprocessors/${decisionId}`);
}

export function adminComplianceSubprocessorsBySubprocessorsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/subprocessors/${decisionId}`, data);
}

export function adminComplianceTenantsSelfGapAnalysisPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/tenants/self/gap-analysis`);
}

export function adminComplianceTenantsSelfOverrides(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/tenants/self/overrides`);
}

export function adminComplianceTenantsSelfOverridesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/tenants/self/overrides`, data);
}

export function adminComplianceTenantsSelfOverridesByOverridesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/tenants/self/overrides/${param}`);
}

export function adminComplianceTenantsSelfPolicy(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/tenants/self/policy`);
}

export function adminComplianceTenantsSelfReadinessByReadinessPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/tenants/self/readiness/${decisionId}`, data);
}

export function adminComplianceTenantsSelfScore(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/tenants/self/score`);
}

export function adminComplianceTenantsSelfStandardsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/tenants/self/standards`, data);
}

export function adminComplianceTenantsGapAnalysisByTenantsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/tenants/${tid}/gap-analysis`, data);
}

export function adminComplianceTenantsPolicyByTenants(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/tenants/${tid}/policy`);
}

export function adminComplianceTenantsReadinessByTenantsByReadinessPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/tenants/${tid}/readiness/${decisionId}`, data);
}

export function adminComplianceTenantsScoreByTenants(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/tenants/${tid}/score`);
}

export function adminComplianceTenantsStandardsByTenantsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/tenants/${tid}/standards`, data);
}

export function adminComplianceVendorRiskAssessment(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/admin/compliance/vendor-risk-assessment`, { params });
}

export function adminComplianceVendorRiskAssessmentPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/admin/compliance/vendor-risk-assessment`, data);
}

export function adminComplianceVendorRiskAssessmentByVendorRiskAssessmentDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/compliance/api/v1/admin/compliance/vendor-risk-assessment/${decisionId}`);
}

export function adminComplianceVendorRiskAssessmentByVendorRiskAssessmentPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/compliance/api/v1/admin/compliance/vendor-risk-assessment/${decisionId}`, data);
}

export function complianceCleanupRecords(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/cleanup-records`, { params });
}

export function complianceGdprDsarMe(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/gdpr/dsar/me`, { params });
}

export function complianceGdprDsarMePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/compliance/api/v1/compliance/gdpr/dsar/me`, data);
}

export function complianceGdprDsarStatusByDsar(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/gdpr/dsar/${decisionId}/status`);
}

export function compliancePrivacyPolicy(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/privacy/policy`);
}

export function compliancePrivacyPolicyVersions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/privacy/policy/versions`, { params });
}

export function compliancePrivacyRetention(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/privacy/retention`, { params });
}

export function complianceProfile(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/profile`);
}

export function compliancePublicAuditFindings(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/audit-findings`, { params });
}

export function compliancePublicBreachNotifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/breach-notifications`, { params });
}

export function compliancePublicCertifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/certifications`, { params });
}

export function compliancePublicCrossBorderTransfers(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/cross-border-transfers`, { params });
}

export function compliancePublicDataClassifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/data-classifications`, { params });
}

export function compliancePublicDengbaoControls(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/dengbao/controls`, { params });
}

export function compliancePublicEvidence(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/evidence`, { params });
}

export function compliancePublicHipaaControls(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/hipaa/controls`, { params });
}

export function compliancePublicIso27001Controls(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/iso27001/controls`, { params });
}

export function compliancePublicPcidssControls(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/pcidss/controls`, { params });
}

export function compliancePublicPenetrationTestReports(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/penetration-test-reports`, { params });
}

export function compliancePublicPiplControls(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/pipl/controls`, { params });
}

export function compliancePublicPrivacyImpact(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/privacy-impact`, { params });
}

export function compliancePublicPsd2Controls(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/psd2/controls`, { params });
}

export function compliancePublicRegulatoryWatch(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/regulatory-watch`, { params });
}

export function compliancePublicSecurityScore(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/security-score`);
}

export function compliancePublicStatus(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/status`);
}

export function compliancePublicSubprocessors(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/public/subprocessors`, { params });
}

export function complianceStatus(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/compliance/api/v1/compliance/status`);
}

