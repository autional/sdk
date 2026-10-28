/**
 * @autional/api-compliance — Auto-generated from compliance-service swagger.json
 * Generated: 2026-10-28
 * DO NOT EDIT — run `python sdk/scripts/generate-api-packages.py` to regenerate
 */

import type { ApiClient } from '@autional/core';

// ====== Types ======

/** 列表端点分页信息（ApiClient 解包后字段已转 camelCase）。 */
export interface ApiPaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** 列表端点的运行时返回值：ApiClient 已解包为 { items, total, pagination }。 */
export interface ApiListResult<T> {
  items: T[];
  total?: number;
  pagination?: ApiPaginationInfo;
}

export interface Evidence {
  appId?: string;
  collectedAt?: string;
  collectorId?: string;
  controlId?: string;
  controlType?: string;
  createdAt?: string;
  deletedAt?: DeletedAt;  // DeletedAt 不带 `index` tag：单列 deleted_at 属低选择性列（DB-DESIGN-GUIDELINES §1.5）。 移除后 AutoMigrate 不再派生 `idx_<table>_deleted_a...
  description?: string;
  fileUrl?: string;
  id?: string;
  tenantId?: string;
  title?: string;
  updatedAt?: string;
}

export interface AIDecisionRequest {
  decisionId: string;
  input?: string;
  model: string;
  output?: string;
}

export interface AIDecisionResponse {
  createdAt?: string;
  decisionId?: string;
  id?: string;
  input?: string;
  model?: string;
  output?: string;
  reviewed?: boolean;
  reviewer?: string;
}

export interface AssessmentCoverageItem {
  assessed?: number;
  percent?: number;
  total?: number;
}

export interface AssessmentCoveragePublic {
  assessed?: number;
  percent?: number;
  total?: number;
}

export interface AuditFindingItem {
  assigneeId?: string;
  controlId?: string;
  controlType?: string;
  createdAt?: string;
  description?: string;
  dueDate?: string;
  id?: string;
  remediationPlan?: string;
  severity?: string;
  status?: string;
  title?: string;
}

export interface BreachNotificationRequest {
  affectedUsers?: number;
  description: string;
  severity: string;
  title: string;
}

export interface BreachNotificationResponse {
  affectedUsers?: number;
  createdAt?: string;
  description?: string;
  id?: string;
  reportedAt?: string;
  reportedToDpa?: boolean;
  severity?: string;
  status?: string;
  title?: string;
}

export interface CertificationItem {
  auditor?: string;
  certificateUrl?: string;
  createdAt?: string;
  criteriaScopes?: string;
  framework?: string;
  id?: string;
  lastAuditedDate?: string;
  nextAuditDate?: string;
  status?: string;
}

export interface CleanupRecordResponse {
  createdAt?: string;
  dateRange?: string;
  id?: string;
  operatorId?: string;
  reason?: string;
  recordsCount?: number;
}

export interface ComplianceProfileResponse {
  aiReviewRequired?: boolean;
  autoDeleteEnabled?: boolean;
  breachReportThreshold?: number;
  consentTtlYears?: number;
  dataProtectionOfficer?: string;
  defaultRetentionDays?: number;
  enabledFrameworks?: string[];
  maxConcurrentErasures?: number;
  penTestScheduleDays?: number;
  scoreWeights?: string;
  selectedStandards?: string[];
  sodAutoInitEnabled?: boolean;
  tenantId?: string;
}

export interface ComplianceScoreResponse {
  assessmentCoverage?: AssessmentCoverageItem;
  assessmentVersion?: string;
  grade?: string;
  overallScore?: number;
  scoreAvailable?: boolean;  // P2（2026-10-27）：无任何框架完成评估时 score_available=false，overall_score 无意义。
  tenantId?: string;
}

/** 整体合规状态 */
export interface ComplianceStatusResponse {
  assessmentCoverage?: AssessmentCoverageItem;  // 覆盖度
  assessmentVersion?: string;
  evaluationError?: string;  // 评估错误
  frameworkAssessments?: FrameworkAssessmentItem[];  // P2（2026-10-27）：四态评估视图。状态词表 compliant/non_compliant/not_assessed/evaluation_error。
  gateDisabledAssessments?: FrameworkAssessmentItem[];  // 选中但门禁未启用
  gdprCompliant?: boolean;  // GDPR
  invalidOverrides?: InvalidOverrideItem[];  // 被忽略的覆盖
  iso27001Compliant?: boolean;  // ISO27001
  lastAuditDate?: string;  // 上次审计
  nextAuditDate?: string;  // 下次审计
  openBreaches?: number;  // 开放泄露
  openIssues?: number;  // 未解决问题
  overallStatus?: string;  // 总体状态
  pendingDsar?: number;  // 待处理DSAR
  pendingPias?: number;  // 待处理PIA
  sodRulesEnabled?: number;  // 启用SoD
  soxCompliant?: boolean;  // SOX
  standaloneAssessments?: FrameworkAssessmentItem[];  // 已选独立标准
  unknownStandards?: string[];  // 未知标准ID
}

export interface ConflictItem {
  detail?: string;
  parameter?: string;
  standards?: string[];
}

/** 用户同意记录 */
export interface ConsentItem {
  consentMethod?: string;  // 同意方式
  expiredAt?: string;  // 过期时间
  granted?: boolean;  // 是否同意
  grantedAt?: string;  // 同意时间
  id?: string;  // 同意记录ID
  purpose?: string;  // 处理目的
  service?: string;  // 服务名称
  userId?: string;  // 用户ID
}

export interface ControlAssessmentItem {
  controlId?: string;
  current?: unknown;
  name?: string;
  operator?: string;
  overrideApplied?: boolean;
  parameter?: string;
  reason?: string;
  required?: unknown;
  requirement?: string;
  severity?: string;
  source?: string;
  state?: string;
}

export interface ControlItemResponse {
  description?: string;
  id?: string;
  name?: string;
  operator?: string;
  parameter?: string;
  requirement?: string;
  severity?: string;
  tags?: string[];
  value?: unknown;
}

export interface CreateAuditFindingRequest {
  assigneeId: string;
  controlId: string;
  controlType: string;
  description: string;
  dueDate: string;
  remediationPlan?: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
}

export interface CreateCertificationRequest {
  auditor?: string;
  certificateUrl?: string;
  criteriaScopes?: string;
  framework: string;
  lastAuditedDate?: string;
  nextAuditDate?: string;
}

export interface CreateCleanupRecordRequest {
  dateRange: string;
  operatorId: string;
  reason: string;
  recordsCount: number;
}

/** 用户同意请求参数 */
export interface CreateConsentRequest {
  consentMethod?: string;  // 同意方式
  granted: boolean;  // 是否同意
  purpose: string;  // 目的
  service: string;  // 服务
  userId: string;  // 用户ID
}

export interface CreateCrossBorderTransferRequest {
  dataCategory: string;
  legalBasis: string;
  originRegion: string;
  targetRegion: string;
}

/** 创建GDPR数据主体访问请求参数 */
export interface CreateDSARRequest {
  additionalInfo?: string;  // 补充信息
  address?: string;  // 地址
  email?: string;  // 邮箱
  phone?: string;  // 电话
  Type: "access" | "delete" | "portability";  // 请求类型
  userId: string;  // 用户ID
}

export interface CreateDengbaoControlRequest {
  category?: string;
  code: string;
  description?: string;
  evidenceUrl?: string;
  level: string;
  name: string;
  status?: string;
}

/** 用户请求删除其数据请求参数 */
export interface CreateErasureRequest {
  confirmationCode?: string;  // 确认码
  dataCategories: string[];  // 数据类别
  reason?: string;  // 删除原因
  userId: string;  // 用户ID
}

export interface CreateEvidenceRequest {
  collectedAt: string;
  collectorId: string;
  controlId: string;
  controlType: string;
  description?: string;
  fileUrl: string;
  title: string;
}

export interface CreateHIPAAControlRequest {
  category?: string;
  code: string;
  description?: string;
  evidenceUrl?: string;
  name: string;
  status?: string;
}

export interface CreateISO27001ControlRequest {
  category?: string;
  code: string;
  description?: string;
  evidenceUrl?: string;
  name: string;
  status?: string;
}

export interface CreateLegalDocumentRequest {
  content: string;
  docType: string;
  effectiveAt?: string;
  lang: string;
  tenantId?: string;
  title: string;
  version: string;
}

/** 用户自助提交数据主体访问请求（user_id 从 JWT 提取） */
export interface CreateMyDSARRequest {
  email?: string;  // 邮箱
  Type: "access" | "delete" | "portability";  // 请求类型
}

export interface CreatePCIDSSControlRequest {
  category?: string;
  code: string;
  description?: string;
  evidenceUrl?: string;
  name: string;
  status?: string;
}

export interface CreatePIPLControlRequest {
  category?: string;
  code: string;
  description?: string;
  evidenceUrl?: string;
  name: string;
  status?: string;
}

export interface CreatePSD2ControlRequest {
  category?: string;
  code: string;
  description?: string;
  evidenceUrl?: string;
  name: string;
  status?: string;
}

export interface CreatePenTestReportRequest {
  conductedAt: string;
  findings?: number;
  nextTestDate: string;
  severity: string;
  summary: string;
  title: string;
}

export interface CreateRegulatoryWatchItemRequest {
  category: string;
  effectiveDate: string;
  region: string;
  regulation: string;
  summary: string;
  title: string;
}

/** 创建数据保留策略请求参数 */
export interface CreateRetentionPolicyRequest {
  autoDelete?: boolean;  // 自动删除
  dataType: string;  // 数据类型
  legalBasis: string;  // 法律依据
  name: string;  // 策略名称
  purpose: string;  // 目的
  retentionPeriodDays: number;  // 保留天数
}

export interface CreateSOXITGCControlRequest {
  controlId: string;
  controlType: string;
  description?: string;
  name: string;
}

export interface CreateSoDRuleRequest {
  description: string;
  enabled?: boolean;
  name: string;
  rolesA: string;
  rolesB: string;
}

export interface CreateSubProcessorRequest {
  applicableServices: string;
  category?: string;
  complianceLinks?: string;
  entityName: string;
  locations?: string;
  purpose?: string;
  subjectMatter?: string;
  transferMechanism?: string;
}

export interface CrossBorderTransferResponse {
  createdAt?: string;
  dataCategory?: string;
  id?: string;
  legalBasis?: string;
  originRegion?: string;
  status?: string;
  targetRegion?: string;
}

export interface CurrentConfigRequest {
  parameters?: Record<string, unknown>;
}

/** GDPR数据主体访问请求记录 */
export interface DSARItem {
  completedAt?: string;  // 完成时间
  createdAt?: string;  // 创建时间
  id?: string;  // DSAR ID
  status?: string;  // 状态
  Type?: string;  // 请求类型
  userId?: string;  // 用户ID
}

/** DSAR 状态跟踪响应 */
export interface DSARStatusResponse {
  completedAt?: string;  // 完成时间
  createdAt?: string;  // 创建时间
  id?: string;  // DSAR ID
  status?: string;  // 状态
  Type?: string;  // 请求类型
}

export interface DataClassificationRequest {
  classification: string;
  dataCategory: string;
  description?: string;
  retentionRequired?: boolean;
}

export interface DataClassificationResponse {
  classification?: string;
  createdAt?: string;
  dataCategory?: string;
  description?: string;
  id?: string;
  retentionRequired?: boolean;
}

export interface DengbaoControlItem {
  category?: string;
  controlId?: string;
  controlName?: string;
  evidenceUrl?: string;
  id?: string;
  lastReviewed?: string;
  status?: string;
}

/** 数据删除请求记录 */
export interface ErasureItem {
  completedAt?: string;  // 完成时间
  createdAt?: string;  // 创建时间
  dataCategories?: string[];  // 数据类别
  id?: string;  // 删除请求ID
  reason?: string;  // 删除原因
  status?: string;  // 状态
  userId?: string;  // 用户ID
}

export interface ErrorResponse {
  code?: number;
  message?: string;
}

export interface EvidenceItem {
  collectedAt?: string;
  collectorId?: string;
  controlId?: string;
  controlType?: string;
  createdAt?: string;
  description?: string;
  fileUrl?: string;
  id?: string;
  title?: string;
}

export interface FrameworkAssessmentItem {
  controlsAssessed?: number;
  controlsFailed?: number;
  controlsPassed?: number;
  controlsTotal?: number;
  controlsUnknown?: number;
  displayName?: string;
  evaluationError?: string;
  framework?: string;  // 门禁键；独立标准为空
  gateDisabled?: boolean;  // 选中但门禁未启用，不参与评估
  standardId?: string;
  standards?: StandardAssessmentItem[];
  status?: string;  // compliant/non_compliant/not_assessed/evaluation_error
}

export interface FrameworkAssessmentPublic {
  controlsAssessed?: number;
  controlsTotal?: number;
  controlsUnknown?: number;
  displayName?: string;
  framework?: string;
  standardId?: string;
  status?: string;
}

export interface GapReportResponse {
  assessed?: number;  // P2（四态）：缺口计数只统计已测且失败；未评估单列 unknown，不算失败。
  conflicts?: ConflictItem[];
  criticalGaps?: number;
  errors?: number;
  evaluationError?: string;
  highGaps?: number;
  lowGaps?: number;
  mediumGaps?: number;
  overallScore?: number;
  parameters?: ParameterGapItem[];
  scoreAvailable?: boolean;
  standards?: string[];
  unknown?: number;
}

export interface HIPAAControlItem {
  category?: string;
  controlId?: string;
  controlName?: string;
  evidenceUrl?: string;
  id?: string;
  lastReviewed?: string;
  status?: string;
}

/** ISO 27001安全控制项 */
export interface ISO27001ControlItem {
  category?: string;  // 类别
  controlId?: string;  // 控制ID
  controlName?: string;  // 控制名称
  evidenceUrl?: string;  // 证据
  id?: string;  // 主键ID
  lastReviewed?: string;  // 审查时间
  status?: string;  // 状态
}

export interface InvalidOverrideItem {
  parameter?: string;
  reason?: string;
}

export interface LegalDocumentItem {
  content?: string;
  docType?: string;
  effectiveAt?: string;
  id?: string;
  lang?: string;
  status?: string;
  tenantId?: string;
  title?: string;
  version?: string;
}

export interface OverrideItem {
  createdAt?: string;
  createdBy?: string;
  parameter?: string;
  reason?: string;
  value?: unknown;
}

export interface OverrideListResponse {
  overrides?: OverrideItem[];
}

export interface OverrideRequest {
  parameter: string;
  reason?: string;
  value: unknown;
}

export interface PCIDSSControlItem {
  category?: string;
  controlId?: string;
  controlName?: string;
  evidenceUrl?: string;
  id?: string;
  lastReviewed?: string;
  status?: string;
}

export interface PIARequest {
  data?: string;
  description: string;
  title: string;
}

export interface PIAResponse {
  createdAt?: string;
  description?: string;
  id?: string;
  status?: string;
  title?: string;
}

export interface PIPLControlItem {
  category?: string;
  controlId?: string;
  controlName?: string;
  evidenceUrl?: string;
  id?: string;
  lastReviewed?: string;
  status?: string;
}

export interface PSD2ControlItem {
  category?: string;
  controlId?: string;
  controlName?: string;
  evidenceUrl?: string;
  id?: string;
  lastReviewed?: string;
  status?: string;
}

export interface ParameterGapItem {
  compliant?: boolean;
  controlRef?: string;
  current?: unknown;
  description?: string;
  operator?: string;
  parameter?: string;
  reason?: string;
  required?: unknown;
  severity?: string;
  standard?: string;
  state?: string;  // P2（四态）：状态词表 compliant / non_compliant / not_assessed / evaluation_error。 compliant=false 不再等于失败：not_assessed / evalua...
}

/** 安全渗透测试报告 */
export interface PenTestReportItem {
  findings?: number;  // 发现问题数
  nextTestDate?: string;  // 下次测试
  reportId?: string;  // 报告ID
  severity?: string;  // 严重级别
  testedAt?: string;  // 测试时间
  title?: string;  // 标题
}

/** 隐私政策版本信息（公开） */
export interface PrivacyPolicyResponse {
  content?: string;  // 政策内容
  effectiveAt?: string;  // 生效时间
  publishedAt?: string;  // 发布时间
  summary?: string;  // 摘要
  version?: string;  // 版本号
}

/** 隐私政策版本历史记录（公开） */
export interface PrivacyPolicyVersionItem {
  effectiveAt?: string;  // 生效时间
  publishedAt?: string;  // 发布时间
  summary?: string;  // 摘要
  version?: string;  // 版本号
}

export interface PublicAuditFinding {
  category?: string;
  controlType?: string;
  createdAt?: string;
  severity?: string;
  status?: string;
  title?: string;
}

export interface PublicBreachNotification {
  affectedUsersRange?: string;
  description?: string;
  disclosedAt?: string;
  reportedToDpa?: boolean;
  severity?: string;
  title?: string;
}

export interface PublicCertification {
  auditor?: string;
  certificateUrl?: string;
  criteriaScopes?: string;
  framework?: string;
  lastAuditedDate?: string;
  nextAuditDate?: string;
}

export interface PublicComplianceStatusResponse {
  assessmentCoverage?: AssessmentCoveragePublic;
  assessmentVersion?: string;
  evaluationError?: boolean;  // EvaluationError 只暴露"是否发生评估异常"，不公开内部错误串。
  frameworkAssessments?: FrameworkAssessmentPublic[];  // P2（2026-10-27）：显式四态 + 覆盖度。legacy 布尔保留（additive）。
  frameworksEnabled?: string[];
  gdprCompliant?: boolean;
  iso27001Compliant?: boolean;
  lastAuditDate?: string;
  nextAuditDate?: string;
  openIssuesRange?: string;
  overallStatus?: string;
  soxCompliant?: boolean;
}

export interface PublicCrossBorderTransfer {
  dataCategory?: string;
  legalBasis?: string;
  originRegion?: string;
  targetRegion?: string;
}

export interface PublicDataClassification {
  classification?: string;
  dataCategory?: string;
  description?: string;
  retentionRequired?: boolean;
}

export interface PublicDengbaoControl {
  category?: string;
  controlId?: string;
  controlName?: string;
  status?: string;
}

export interface PublicHIPAAControl {
  category?: string;
  controlId?: string;
  controlName?: string;
  status?: string;
}

export interface PublicISO27001Control {
  category?: string;
  controlId?: string;
  controlName?: string;
  status?: string;
}

export interface PublicLegalDocument {
  content?: string;
  docType?: string;
  effectiveAt?: string;
  id?: string;
  lang?: string;
  status?: string;
  title?: string;
  updatedAt?: string;
  version?: string;
}

export interface PublicPCIDSSControl {
  category?: string;
  controlId?: string;
  controlName?: string;
  status?: string;
}

export interface PublicPIA {
  createdAt?: string;
  description?: string;
  status?: string;
  title?: string;
}

export interface PublicPIPLControl {
  category?: string;
  controlId?: string;
  controlName?: string;
  status?: string;
}

export interface PublicPSD2Control {
  category?: string;
  controlId?: string;
  controlName?: string;
  status?: string;
}

export interface PublicPenTestReport {
  findings?: number;
  nextTestAt?: string;
  severity?: string;
  summary?: string;
  testedAt?: string;
  title?: string;
}

export interface PublicSubProcessor {
  applicableServices?: string;
  category?: string;
  complianceLinks?: string;
  entityName?: string;
  locations?: string;
  purpose?: string;
  subjectMatter?: string;
  transferMechanism?: string;
}

export interface ReadinessReportResponse {
  assessedControls?: number;
  complianceRate?: number;
  controls?: ControlAssessmentItem[];
  errorControls?: number;
  failedControls?: ParameterGapItem[];
  passedControls?: number;
  readyForAudit?: boolean;
  recommendations?: string[];
  standardId?: string;
  standardName?: string;
  state?: string;  // P2（四态）：缺证据的控制单列 unknown（含来源错误），不算失败； 合规率按已评估控制计算；只有全部控制已测且通过 ready_for_audit 才为 true。
  totalControls?: number;
  unknownControls?: number;
}

/** 法规动态更新 */
export interface RegulatoryUpdateItem {
  affectedServices?: string[];  // 受影响服务
  effectiveDate?: string;  // 生效日期
  impactLevel?: string;  // 影响级别
  jurisdiction?: string;  // 管辖
  regulation?: string;  // 法规名称
  summary?: string;  // 摘要
  updateId?: string;  // 更新ID
}

export interface ResolvedParamItem {
  mergeRule?: string;
  overridden?: boolean;
  overrideValue?: unknown;
  severity?: string;
  source?: string[];
  value?: unknown;
}

export interface ResolvedPolicyResponse {
  parameters?: Record<string, ResolvedParamItem>;
  resolvedAt?: string;
  standards?: string[];
  tenantId?: string;
  version?: string;
}

/** 数据保留策略 */
export interface RetentionPolicyItem {
  dataType?: string;  // 数据类型
  legalBasis?: string;  // 法律依据
  policyId?: string;  // 策略ID
  purpose?: string;  // 保留目的
  retentionPeriodDays?: number;  // 保留天数
  status?: string;  // 状态
}

/** 数据保留策略公示信息（公开） */
export interface RetentionPolicyPublicResponse {
  dataCategory?: string;  // 数据类别
  description?: string;  // 说明
  legalBasis?: string;  // 法律依据
  retentionDays?: number;  // 保留天数
}

export interface ReviewAIDecisionRequest {
  reviewed: boolean;
  reviewer: string;
}

/** 撤回用户同意请求参数 */
export interface RevokeConsentRequest {
  purpose: string;  // 处理目的
  reason?: string;  // 撤回原因
  userId: string;  // 用户ID
}

/** SOX法案IT一般控制项 */
export interface SOXITGCItem {
  controlId?: string;  // 控制ID
  controlType?: string;  // 控制类型
  description?: string;  // 描述
  id?: string;  // 主键ID
  lastTestDate?: string;  // 测试日期
  status?: string;  // 状态
  testResult?: string;  // 测试结果
}

export interface ScoreSnapshotItem {
  appId?: string;
  id?: string;
  openBreaches?: number;
  openIssues?: number;
  overallStatus?: string;
  pendingDsar?: number;
  pendingPias?: number;
  score?: number;
  snapshotDate?: string;
  tenantId?: string;
}

export interface SecurityScore {
  assessmentCoverage?: AssessmentCoveragePublic;
  calculatedAt?: string;
  dimensions?: SecurityScoreDim[];
  grade?: string;
  maxScore?: number;
  methodologyVersion?: string;
  overallScore?: number;
  scoreAvailable?: boolean;  // P2（2026-10-27）：ScoreAvailable=false 表示无任何框架完成评估，overall_score 无意义。
}

export interface SecurityScoreDim {
  name?: string;
  score?: number;
  weight?: number;
}

export interface SimpleResponse {
  code?: number;
  message?: string;
  timestamp?: string;
}

export interface SoDCheckResponse {
  checkedAt?: string;
  isCompliant?: boolean;
  rules?: SoDRuleResult[];
  tenantId?: string;
  totalRules?: number;
  violations?: number;
}

export interface SoDRuleResponse {
  description?: string;
  enabled?: boolean;
  id?: string;
  name?: string;
  rolesA?: string;
  rolesB?: string;
}

export interface SoDRuleResult {
  affectedUsers?: string[];
  description?: string;
  isViolated?: boolean;
  ruleId?: string;
  ruleName?: string;
}

export interface StandardAssessmentItem {
  controlsAssessed?: number;
  controlsTotal?: number;
  controlsUnknown?: number;
  standardId?: string;
  standardName?: string;
  status?: string;
}

export interface StandardDetailResponse {
  category?: string;
  controls?: ControlItemResponse[];
  description?: string;
  id?: string;
  name?: string;
  version?: string;
}

export interface StandardItemResponse {
  category?: string;
  description?: string;
  id?: string;
  name?: string;
  version?: string;
}

export interface StandardsUpdatedResponse {
  parameterCount?: number;
  resolvedAt?: string;
  standards?: string[];
}

export interface SubProcessorItem {
  applicableServices?: string;
  category?: string;
  complianceLinks?: string;
  createdAt?: string;
  entityName?: string;
  id?: string;
  locations?: string;
  purpose?: string;
  status?: string;
  subjectMatter?: string;
  transferMechanism?: string;
}

export interface TenantStandardsRequest {
  standards: string[];
}

export interface UpdateAIDecisionRequest {
  decisionId?: string;
  input?: string;
  model?: string;
  output?: string;
}

export interface UpdateAuditFindingRequest {
  assigneeId?: string;
  description?: string;
  dueDate?: string;
  remediationPlan?: string;
  severity?: string;
  status?: string;
  title?: string;
}

export interface UpdateBreachNotificationRequest {
  affectedUsers?: number;
  description?: string;
  reportedToDpa?: boolean;
  severity?: string;
  status?: string;
  title?: string;
}

export interface UpdateComplianceCertificationRequest {
  auditor?: string;
  certificateUrl?: string;
  criteriaScopes?: string;
  framework?: string;
  lastAuditedDate?: string;
  nextAuditDate?: string;
  status?: string;
}

export interface UpdateCrossBorderTransferRequest {
  dataCategory?: string;
  legalBasis?: string;
  originRegion?: string;
  status?: string;
  targetRegion?: string;
}

/** 更新DSAR状态请求参数 */
export interface UpdateDSARRequest {
  rejectionReason?: string;  // 拒绝原因
  responseData?: Record<string, unknown>;  // 响应数据
  status: "processing" | "completed" | "rejected";  // 新状态
}

export interface UpdateDataClassificationRequest {
  classification?: string;
  dataCategory?: string;
  description?: string;
  retentionRequired?: boolean;
}

export interface UpdateDengbaoControlRequest {
  category?: string;
  description?: string;
  evidenceUrl?: string;
  level?: string;
  name?: string;
  status?: string;
}

/** 更新删除权请求状态 */
export interface UpdateErasureRequest {
  status: "pending" | "processing" | "completed" | "rejected";  // 新状态
}

export interface UpdateEvidenceRequest {
  collectedAt?: string;
  collectorId?: string;
  description?: string;
  fileUrl?: string;
  title?: string;
}

export interface UpdateHIPAAControlRequest {
  category?: string;
  description?: string;
  evidenceUrl?: string;
  name?: string;
  status?: string;
}

export interface UpdateISO27001ControlRequest {
  category?: string;
  description?: string;
  evidenceUrl?: string;
  name?: string;
  status?: string;
}

export interface UpdateLegalDocumentRequest {
  content?: string;
  effectiveAt?: string;
  lang?: string;
  title?: string;
}

export interface UpdatePCIDSSControlRequest {
  category?: string;
  description?: string;
  evidenceUrl?: string;
  name?: string;
  status?: string;
}

export interface UpdatePIARequest {
  data?: string;
  description?: string;
  status?: string;
  title?: string;
}

export interface UpdatePIPLControlRequest {
  category?: string;
  description?: string;
  evidenceUrl?: string;
  name?: string;
  status?: string;
}

export interface UpdatePSD2ControlRequest {
  category?: string;
  description?: string;
  evidenceUrl?: string;
  name?: string;
  status?: string;
}

export interface UpdatePenTestReportRequest {
  conductedAt?: string;
  findings?: number;
  nextTestDate?: string;
  severity?: string;
  summary?: string;
  title?: string;
}

export interface UpdateRegulatoryWatchItemRequest {
  category?: string;
  effectiveDate?: string;
  region?: string;
  regulation?: string;
  summary?: string;
  title?: string;
}

export interface UpdateRetentionPolicyRequest {
  autoDelete?: boolean;
  dataType?: string;
  legalBasis?: string;
  name?: string;
  purpose?: string;
  retentionPeriodDays?: number;
}

export interface UpdateSOXITGCControlRequest {
  controlType?: string;
  description?: string;
  lastTestDate?: string;
  name?: string;
  status?: string;
  testResult?: string;
}

export interface UpdateSoDRuleRequest {
  description?: string;
  enabled?: boolean;
  name?: string;
  rolesA?: string;
  rolesB?: string;
}

export interface UpdateSubProcessorRequest {
  applicableServices?: string;
  category?: string;
  complianceLinks?: string;
  entityName?: string;
  locations?: string;
  purpose?: string;
  status?: string;
  subjectMatter?: string;
  transferMechanism?: string;
}

export interface UpdateVendorRiskAssessmentRequest {
  remarks?: string;
  riskLevel?: string;
  score?: number;
}

export interface UpsertComplianceProfileRequest {
  aiReviewRequired?: boolean;
  autoDeleteEnabled?: boolean;
  breachReportThreshold?: number;
  consentTtlYears?: number;
  dataProtectionOfficer?: string;
  defaultRetentionDays?: number;
  enabledFrameworks?: string[];
  maxConcurrentErasures?: number;
  penTestScheduleDays?: number;
  scoreWeights?: string;
  selectedStandards?: string[];
  sodAutoInitEnabled?: boolean;
}

/** 管理隐私政策版本 */
export interface UpsertPrivacyPolicyRequest {
  content: string;  // 政策内容
  effectiveAt: string;  // 生效时间
  status?: string;  // 状态
  summary?: string;  // 摘要
  version: string;  // 版本号
}

/** 供应商安全风险评估请求参数 */
export interface VendorRiskAssessmentRequest {
  remarks: string;  // 评估备注
  riskLevel: string;  // 风险等级
  score: number;  // 风险评分
  vendorName: string;  // 供应商名称
}

/** 供应商风险评估结果 */
export interface VendorRiskAssessmentResponse {
  assessmentDate?: string;  // 评估日期
  complianceCertifications?: string[];  // 合规认证
  riskFactors?: string[];  // 风险因素
  riskLevel?: string;  // 风险等级
  riskScore?: number;  // 风险评分
  validUntil?: string;  // 有效期
  vendorId?: string;  // 供应商ID
}

export interface PageInfo {
  hasNext?: boolean;  // HasNext indicates whether there is a next page
  hasPrev?: boolean;  // HasPrev indicates whether there is a previous page
  page?: number;  // Page is the current page number (1-based)
  pageSize?: number;  // PageSize is the number of items per page
  total?: number;  // Total is the total number of items across all pages
  totalPages?: number;  // TotalPages is the total number of pages
}

export interface DeletedAt {
  time?: string;
  valid?: boolean;  // Valid is true if Time is not NULL
}


// ====== API Functions (tree-shakeable: independent exports) ======

/** 查询AI决策记录列表 */
export function getAdminComplianceAiDecisions(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}): Promise<ApiListResult<AIDecisionResponse>> {
  return client.get(`/compliance/api/v1/admin/compliance/ai-decisions`, { params });
}

/** 记录AI自动决策 */
export function postAdminComplianceAiDecisions(client: ApiClient, data: AIDecisionRequest): Promise<AIDecisionResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/ai-decisions`, data);
}

/** 删除AI决策记录 */
export function deleteAdminComplianceAiDecisionsByAiDecisions(client: ApiClient, decisionId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/ai-decisions/${decisionId}`);
}

/** 获取AI决策详情 */
export function getAdminComplianceAiDecisionsByAiDecisions(client: ApiClient, decisionId: string): Promise<AIDecisionResponse> {
  return client.get(`/compliance/api/v1/admin/compliance/ai-decisions/${decisionId}`);
}

/** 更新AI决策记录 */
export function putAdminComplianceAiDecisionsByAiDecisions(client: ApiClient, decisionId: string, data: UpdateAIDecisionRequest): Promise<AIDecisionResponse> {
  return client.put(`/compliance/api/v1/admin/compliance/ai-decisions/${decisionId}`, data);
}

/** 人工审核AI决策 */
export function postAdminComplianceAiDecisionsReviewByAiDecisions(client: ApiClient, decisionId: string, data: ReviewAIDecisionRequest): Promise<AIDecisionResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/ai-decisions/${decisionId}/review`, data);
}

/** 查询审计发现问题列表 */
export function getAdminComplianceAuditFindings(client: ApiClient, params?: {
  severity?: string;  // severity filter
  status?: string;  // status filter
  control_type?: string;  // control type filter
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<AuditFindingItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/audit-findings`, { params });
}

/** 创建审计发现记录 */
export function postAdminComplianceAuditFindings(client: ApiClient, data: CreateAuditFindingRequest): Promise<AuditFindingItem> {
  return client.post(`/compliance/api/v1/admin/compliance/audit-findings`, data);
}

/** 删除审计发现记录 */
export function deleteAdminComplianceAuditFindingsByAuditFindings(client: ApiClient, auditFindingId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/audit-findings/${auditFindingId}`);
}

/** 获取审计发现详情 */
export function getAdminComplianceAuditFindingsByAuditFindings(client: ApiClient, auditFindingId: string): Promise<AuditFindingItem> {
  return client.get(`/compliance/api/v1/admin/compliance/audit-findings/${auditFindingId}`);
}

/** 更新审计发现状态 */
export function putAdminComplianceAuditFindingsByAuditFindings(client: ApiClient, auditFindingId: string, data: UpdateAuditFindingRequest): Promise<AuditFindingItem> {
  return client.put(`/compliance/api/v1/admin/compliance/audit-findings/${auditFindingId}`, data);
}

/** 查询数据泄露通知列表 */
export function getAdminComplianceBreachNotifications(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}): Promise<ApiListResult<BreachNotificationResponse>> {
  return client.get(`/compliance/api/v1/admin/compliance/breach-notifications`, { params });
}

/** 创建数据泄露通知 */
export function postAdminComplianceBreachNotifications(client: ApiClient, data: BreachNotificationRequest): Promise<BreachNotificationResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/breach-notifications`, data);
}

/** 删除数据泄露通知 */
export function deleteAdminComplianceBreachNotificationsByBreachNotifications(client: ApiClient, breachNotificationId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/breach-notifications/${breachNotificationId}`);
}

/** 获取数据泄露通知详情 */
export function getAdminComplianceBreachNotificationsByBreachNotifications(client: ApiClient, breachNotificationId: string): Promise<BreachNotificationResponse> {
  return client.get(`/compliance/api/v1/admin/compliance/breach-notifications/${breachNotificationId}`);
}

/** 更新数据泄露通知 */
export function putAdminComplianceBreachNotificationsByBreachNotifications(client: ApiClient, breachNotificationId: string, data: UpdateBreachNotificationRequest): Promise<BreachNotificationResponse> {
  return client.put(`/compliance/api/v1/admin/compliance/breach-notifications/${breachNotificationId}`, data);
}

/** 查询合规认证列表 */
export function getAdminComplianceCertifications(client: ApiClient, params?: {
  framework?: string;  // 认证框架筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<CertificationItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/certifications`, { params });
}

/** 创建合规认证记录 */
export function postAdminComplianceCertifications(client: ApiClient, data: CreateCertificationRequest): Promise<CertificationItem> {
  return client.post(`/compliance/api/v1/admin/compliance/certifications`, data);
}

/** 删除合规认证记录 */
export function deleteAdminComplianceCertificationsByCertifications(client: ApiClient, certificationId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/certifications/${certificationId}`);
}

/** 获取合规认证详情 */
export function getAdminComplianceCertificationsByCertifications(client: ApiClient, certificationId: string): Promise<CertificationItem> {
  return client.get(`/compliance/api/v1/admin/compliance/certifications/${certificationId}`);
}

/** 更新合规认证信息 */
export function putAdminComplianceCertificationsByCertifications(client: ApiClient, certificationId: string, data: UpdateComplianceCertificationRequest): Promise<CertificationItem> {
  return client.put(`/compliance/api/v1/admin/compliance/certifications/${certificationId}`, data);
}

/** 查询数据清理历史记录 */
export function getAdminComplianceCleanupRecords(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}): Promise<ApiListResult<CleanupRecordResponse>> {
  return client.get(`/compliance/api/v1/admin/compliance/cleanup-records`, { params });
}

/** 创建数据清理记录 */
export function postAdminComplianceCleanupRecords(client: ApiClient, data: CreateCleanupRecordRequest): Promise<CleanupRecordResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/cleanup-records`, data);
}

/** 查询跨境数据传输列表 */
export function getAdminComplianceCrossBorderTransfers(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}): Promise<ApiListResult<CrossBorderTransferResponse>> {
  return client.get(`/compliance/api/v1/admin/compliance/cross-border-transfers`, { params });
}

/** 创建跨境数据传输记录 */
export function postAdminComplianceCrossBorderTransfers(client: ApiClient, data: CreateCrossBorderTransferRequest): Promise<CrossBorderTransferResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/cross-border-transfers`, data);
}

/** 删除跨境数据传输记录 */
export function deleteAdminComplianceCrossBorderTransfersByCrossBorderTransfers(client: ApiClient, crossBorderTransferId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/cross-border-transfers/${crossBorderTransferId}`);
}

/** 获取跨境数据传输详情 */
export function getAdminComplianceCrossBorderTransfersByCrossBorderTransfers(client: ApiClient, crossBorderTransferId: string): Promise<CrossBorderTransferResponse> {
  return client.get(`/compliance/api/v1/admin/compliance/cross-border-transfers/${crossBorderTransferId}`);
}

/** 更新跨境数据传输记录 */
export function putAdminComplianceCrossBorderTransfersByCrossBorderTransfers(client: ApiClient, crossBorderTransferId: string, data: UpdateCrossBorderTransferRequest): Promise<CrossBorderTransferResponse> {
  return client.put(`/compliance/api/v1/admin/compliance/cross-border-transfers/${crossBorderTransferId}`, data);
}

/** 查询数据分类列表 */
export function getAdminComplianceDataClassifications(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}): Promise<ApiListResult<DataClassificationResponse>> {
  return client.get(`/compliance/api/v1/admin/compliance/data-classifications`, { params });
}

/** 创建数据分类规则 */
export function postAdminComplianceDataClassifications(client: ApiClient, data: DataClassificationRequest): Promise<DataClassificationResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/data-classifications`, data);
}

/** 删除数据分类规则 */
export function deleteAdminComplianceDataClassificationsByDataClassifications(client: ApiClient, dataClassificationId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/data-classifications/${dataClassificationId}`);
}

/** 获取数据分类分级详情 */
export function getAdminComplianceDataClassificationsByDataClassifications(client: ApiClient, dataClassificationId: string): Promise<DataClassificationResponse> {
  return client.get(`/compliance/api/v1/admin/compliance/data-classifications/${dataClassificationId}`);
}

/** 更新数据分类规则 */
export function putAdminComplianceDataClassificationsByDataClassifications(client: ApiClient, dataClassificationId: string, data: UpdateDataClassificationRequest): Promise<DataClassificationResponse> {
  return client.put(`/compliance/api/v1/admin/compliance/data-classifications/${dataClassificationId}`, data);
}

/** 查询等级保护控制项列表 */
export function getAdminComplianceDengbaoControls(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<DengbaoControlItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/dengbao/controls`, { params });
}

/** 创建等级保护控制项 */
export function postAdminComplianceDengbaoControls(client: ApiClient, data: CreateDengbaoControlRequest): Promise<DengbaoControlItem> {
  return client.post(`/compliance/api/v1/admin/compliance/dengbao/controls`, data);
}

/** 删除等级保护控制项 */
export function deleteAdminComplianceDengbaoControlsByControls(client: ApiClient, controlId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/dengbao/controls/${controlId}`);
}

/** 更新等级保护控制项 */
export function putAdminComplianceDengbaoControlsByControls(client: ApiClient, controlId: string, data: UpdateDengbaoControlRequest): Promise<DengbaoControlItem> {
  return client.put(`/compliance/api/v1/admin/compliance/dengbao/controls/${controlId}`, data);
}

/** 获取删除权请求详情 */
export function getAdminComplianceErasureRequestsByErasureRequests(client: ApiClient, erasureId: string): Promise<ErasureItem> {
  return client.get(`/compliance/api/v1/admin/compliance/erasure-requests/${erasureId}`);
}

/** 查询合规证据列表 */
export function getAdminComplianceEvidence(client: ApiClient, params?: {
  control_type?: string;  // control type
  control_id?: string;  // control ID
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<EvidenceItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/evidence`, { params });
}

/** 上传合规证据 */
export function postAdminComplianceEvidence(client: ApiClient, data: CreateEvidenceRequest): Promise<EvidenceItem> {
  return client.post(`/compliance/api/v1/admin/compliance/evidence`, data);
}

/** 删除合规证据 */
export function deleteAdminComplianceEvidenceByEvidence(client: ApiClient, evidenceId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/evidence/${evidenceId}`);
}

/** 获取合规证据详情 */
export function getAdminComplianceEvidenceByEvidence(client: ApiClient, evidenceId: string): Promise<EvidenceItem> {
  return client.get(`/compliance/api/v1/admin/compliance/evidence/${evidenceId}`);
}

/** 更新合规证据 */
export function putAdminComplianceEvidenceByEvidence(client: ApiClient, evidenceId: string, data: UpdateEvidenceRequest): Promise<SimpleResponse> {
  return client.put(`/compliance/api/v1/admin/compliance/evidence/${evidenceId}`, data);
}

/** 撤销数据处理同意 */
export function deleteAdminComplianceGdprConsent(client: ApiClient, data: RevokeConsentRequest): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/gdpr/consent`);
}

/** 查询同意记录列表 */
export function getAdminComplianceGdprConsent(client: ApiClient, params?: {
  user_id?: string;  // user ID
  service?: string;  // service filter
  purpose?: string;  // purpose filter
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}): Promise<ApiListResult<ConsentItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/gdpr/consent`, { params });
}

/** 创建同意记录 */
export function postAdminComplianceGdprConsent(client: ApiClient, data: CreateConsentRequest): Promise<ConsentItem> {
  return client.post(`/compliance/api/v1/admin/compliance/gdpr/consent`, data);
}

/** 获取同意记录详情 */
export function getAdminComplianceGdprConsentByConsent(client: ApiClient, consentId: string): Promise<ConsentItem> {
  return client.get(`/compliance/api/v1/admin/compliance/gdpr/consent/${consentId}`);
}

/** 查询DSAR列表 */
export function getAdminComplianceGdprDsar(client: ApiClient, params?: {
  status?: string;  // status filter
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}): Promise<ApiListResult<DSARItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/gdpr/dsar`, { params });
}

/** 创建DSAR */
export function postAdminComplianceGdprDsar(client: ApiClient, data: CreateDSARRequest): Promise<DSARItem> {
  return client.post(`/compliance/api/v1/admin/compliance/gdpr/dsar`, data);
}

/** 删除DSAR */
export function deleteAdminComplianceGdprDsarByDsar(client: ApiClient, dsarId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/gdpr/dsar/${dsarId}`);
}

/** 获取DSAR详情 */
export function getAdminComplianceGdprDsarByDsar(client: ApiClient, dsarId: string): Promise<DSARItem> {
  return client.get(`/compliance/api/v1/admin/compliance/gdpr/dsar/${dsarId}`);
}

/** 更新DSAR */
export function putAdminComplianceGdprDsarByDsar(client: ApiClient, dsarId: string, data: UpdateDSARRequest): Promise<DSARItem> {
  return client.put(`/compliance/api/v1/admin/compliance/gdpr/dsar/${dsarId}`, data);
}

/** 查询删除权请求列表 */
export function getAdminComplianceGdprRightToErasure(client: ApiClient, params?: {
  status?: string;  // status filter
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}): Promise<ApiListResult<ErasureItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/gdpr/right-to-erasure`, { params });
}

/** 创建数据删除权请求 */
export function postAdminComplianceGdprRightToErasure(client: ApiClient, data: CreateErasureRequest): Promise<ErasureItem> {
  return client.post(`/compliance/api/v1/admin/compliance/gdpr/right-to-erasure`, data);
}

/** 获取删除权请求详情 */
export function getAdminComplianceGdprRightToErasureByRightToErasure(client: ApiClient, erasureId: string): Promise<ErasureItem> {
  return client.get(`/compliance/api/v1/admin/compliance/gdpr/right-to-erasure/${erasureId}`);
}

/** 更新删除权请求状态 */
export function putAdminComplianceGdprRightToErasureByRightToErasure(client: ApiClient, erasureId: string, data: UpdateErasureRequest): Promise<ErasureItem> {
  return client.put(`/compliance/api/v1/admin/compliance/gdpr/right-to-erasure/${erasureId}`, data);
}

/** 执行数据擦除 */
export function postAdminComplianceGdprRightToErasureExecuteByRightToErasure(client: ApiClient, erasureId: string): Promise<SimpleResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/gdpr/right-to-erasure/${erasureId}/execute`);
}

/** 查询HIPAA控制项列表 */
export function getAdminComplianceHipaaControls(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<HIPAAControlItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/hipaa/controls`, { params });
}

/** 创建HIPAA控制项 */
export function postAdminComplianceHipaaControls(client: ApiClient, data: CreateHIPAAControlRequest): Promise<HIPAAControlItem> {
  return client.post(`/compliance/api/v1/admin/compliance/hipaa/controls`, data);
}

/** 删除HIPAA控制项 */
export function deleteAdminComplianceHipaaControlsByControls(client: ApiClient, controlId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/hipaa/controls/${controlId}`);
}

/** 更新HIPAA控制项 */
export function putAdminComplianceHipaaControlsByControls(client: ApiClient, controlId: string, data: UpdateHIPAAControlRequest): Promise<HIPAAControlItem> {
  return client.put(`/compliance/api/v1/admin/compliance/hipaa/controls/${controlId}`, data);
}

/** 查询ISO27001控制项列表 */
export function getAdminComplianceIso27001Controls(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<ISO27001ControlItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/iso27001/controls`, { params });
}

/** 创建ISO27001控制项 */
export function postAdminComplianceIso27001Controls(client: ApiClient, data: CreateISO27001ControlRequest): Promise<ISO27001ControlItem> {
  return client.post(`/compliance/api/v1/admin/compliance/iso27001/controls`, data);
}

/** 删除ISO27001控制项 */
export function deleteAdminComplianceIso27001ControlsByControls(client: ApiClient, controlId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/iso27001/controls/${controlId}`);
}

/** 获取ISO27001控制项详情 */
export function getAdminComplianceIso27001ControlsByControls(client: ApiClient, controlId: string): Promise<ISO27001ControlItem> {
  return client.get(`/compliance/api/v1/admin/compliance/iso27001/controls/${controlId}`);
}

/** 更新ISO27001控制项 */
export function putAdminComplianceIso27001ControlsByControls(client: ApiClient, controlId: string, data: UpdateISO27001ControlRequest): Promise<ISO27001ControlItem> {
  return client.put(`/compliance/api/v1/admin/compliance/iso27001/controls/${controlId}`, data);
}

/** 查询协议文档列表 */
export function getAdminComplianceLegalDocuments(client: ApiClient, params?: {
  doc_type?: string;  // doc type filter (terms/privacy)
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<LegalDocumentItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/legal-documents`, { params });
}

/** 创建协议文档 */
export function postAdminComplianceLegalDocuments(client: ApiClient, data: CreateLegalDocumentRequest): Promise<LegalDocumentItem> {
  return client.post(`/compliance/api/v1/admin/compliance/legal-documents`, data);
}

/** 获取协议文档详情 */
export function getAdminComplianceLegalDocumentsByLegalDocuments(client: ApiClient, legalDocumentId: string): Promise<LegalDocumentItem> {
  return client.get(`/compliance/api/v1/admin/compliance/legal-documents/${legalDocumentId}`);
}

/** 更新协议文档 */
export function putAdminComplianceLegalDocumentsByLegalDocuments(client: ApiClient, legalDocumentId: string, data: UpdateLegalDocumentRequest): Promise<LegalDocumentItem> {
  return client.put(`/compliance/api/v1/admin/compliance/legal-documents/${legalDocumentId}`, data);
}

/** 归档协议文档 */
export function postAdminComplianceLegalDocumentsArchiveByLegalDocuments(client: ApiClient, legalDocumentId: string): Promise<LegalDocumentItem> {
  return client.post(`/compliance/api/v1/admin/compliance/legal-documents/${legalDocumentId}/archive`);
}

/** 发布协议文档 */
export function postAdminComplianceLegalDocumentsPublishByLegalDocuments(client: ApiClient, legalDocumentId: string): Promise<LegalDocumentItem> {
  return client.post(`/compliance/api/v1/admin/compliance/legal-documents/${legalDocumentId}/publish`);
}

/** 查询PCI DSS控制项列表 */
export function getAdminCompliancePcidssControls(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<PCIDSSControlItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/pcidss/controls`, { params });
}

/** 创建PCI DSS控制项 */
export function postAdminCompliancePcidssControls(client: ApiClient, data: CreatePCIDSSControlRequest): Promise<PCIDSSControlItem> {
  return client.post(`/compliance/api/v1/admin/compliance/pcidss/controls`, data);
}

/** 删除PCI DSS控制项 */
export function deleteAdminCompliancePcidssControlsByControls(client: ApiClient, controlId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/pcidss/controls/${controlId}`);
}

/** 更新PCI DSS控制项 */
export function putAdminCompliancePcidssControlsByControls(client: ApiClient, controlId: string, data: UpdatePCIDSSControlRequest): Promise<PCIDSSControlItem> {
  return client.put(`/compliance/api/v1/admin/compliance/pcidss/controls/${controlId}`, data);
}

/** 查询渗透测试报告列表 */
export function getAdminCompliancePenetrationTestReports(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<PenTestReportItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/penetration-test-reports`, { params });
}

/** 创建渗透测试报告 */
export function postAdminCompliancePenetrationTestReports(client: ApiClient, data: CreatePenTestReportRequest): Promise<PenTestReportItem> {
  return client.post(`/compliance/api/v1/admin/compliance/penetration-test-reports`, data);
}

/** 删除渗透测试报告 */
export function deleteAdminCompliancePenetrationTestReportsByPenetrationTestReports(client: ApiClient, penetrationTestReportId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/penetration-test-reports/${penetrationTestReportId}`);
}

/** 更新渗透测试报告 */
export function putAdminCompliancePenetrationTestReportsByPenetrationTestReports(client: ApiClient, penetrationTestReportId: string, data: UpdatePenTestReportRequest): Promise<PenTestReportItem> {
  return client.put(`/compliance/api/v1/admin/compliance/penetration-test-reports/${penetrationTestReportId}`, data);
}

/** 查询PIPL控制项列表 */
export function getAdminCompliancePiplControls(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<PIPLControlItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/pipl/controls`, { params });
}

/** 创建PIPL控制项 */
export function postAdminCompliancePiplControls(client: ApiClient, data: CreatePIPLControlRequest): Promise<PIPLControlItem> {
  return client.post(`/compliance/api/v1/admin/compliance/pipl/controls`, data);
}

/** 删除PIPL控制项 */
export function deleteAdminCompliancePiplControlsByControls(client: ApiClient, controlId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/pipl/controls/${controlId}`);
}

/** 更新PIPL控制项 */
export function putAdminCompliancePiplControlsByControls(client: ApiClient, controlId: string, data: UpdatePIPLControlRequest): Promise<PIPLControlItem> {
  return client.put(`/compliance/api/v1/admin/compliance/pipl/controls/${controlId}`, data);
}

/** 查询隐私影响评估列表 */
export function getAdminCompliancePrivacyImpact(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}): Promise<ApiListResult<PIAResponse>> {
  return client.get(`/compliance/api/v1/admin/compliance/privacy-impact`, { params });
}

/** 创建隐私影响评估 */
export function postAdminCompliancePrivacyImpact(client: ApiClient, data: PIARequest): Promise<PIAResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/privacy-impact`, data);
}

/** 删除隐私影响评估 */
export function deleteAdminCompliancePrivacyImpactByPrivacyImpact(client: ApiClient, privacyImpactId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/privacy-impact/${privacyImpactId}`);
}

/** 获取隐私影响评估详情 */
export function getAdminCompliancePrivacyImpactByPrivacyImpact(client: ApiClient, privacyImpactId: string): Promise<PIAResponse> {
  return client.get(`/compliance/api/v1/admin/compliance/privacy-impact/${privacyImpactId}`);
}

/** 更新隐私影响评估 */
export function putAdminCompliancePrivacyImpactByPrivacyImpact(client: ApiClient, privacyImpactId: string, data: UpdatePIARequest): Promise<PIAResponse> {
  return client.put(`/compliance/api/v1/admin/compliance/privacy-impact/${privacyImpactId}`, data);
}

/** 创建/更新隐私政策 */
export function postAdminCompliancePrivacyPolicies(client: ApiClient, data: UpsertPrivacyPolicyRequest): Promise<SimpleResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/privacy-policies`, data);
}

/** 创建或更新合规配置 */
export function putAdminComplianceProfile(client: ApiClient, data: UpsertComplianceProfileRequest): Promise<ComplianceProfileResponse> {
  return client.put(`/compliance/api/v1/admin/compliance/profile`, data);
}

/** 创建或更新合规配置档 */
export function postAdminComplianceProfiles(client: ApiClient, data: UpsertComplianceProfileRequest): Promise<ComplianceProfileResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/profiles`, data);
}

/** 查询PSD2控制项列表 */
export function getAdminCompliancePsd2Controls(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<PSD2ControlItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/psd2/controls`, { params });
}

/** 创建PSD2控制项 */
export function postAdminCompliancePsd2Controls(client: ApiClient, data: CreatePSD2ControlRequest): Promise<PSD2ControlItem> {
  return client.post(`/compliance/api/v1/admin/compliance/psd2/controls`, data);
}

/** 删除PSD2控制项 */
export function deleteAdminCompliancePsd2ControlsByControls(client: ApiClient, controlId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/psd2/controls/${controlId}`);
}

/** 更新PSD2控制项 */
export function putAdminCompliancePsd2ControlsByControls(client: ApiClient, controlId: string, data: UpdatePSD2ControlRequest): Promise<PSD2ControlItem> {
  return client.put(`/compliance/api/v1/admin/compliance/psd2/controls/${controlId}`, data);
}

/** 查询法规动态监控列表 */
export function getAdminComplianceRegulatoryWatch(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<RegulatoryUpdateItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/regulatory-watch`, { params });
}

/** 创建法规动态监控项 */
export function postAdminComplianceRegulatoryWatch(client: ApiClient, data: CreateRegulatoryWatchItemRequest): Promise<RegulatoryUpdateItem> {
  return client.post(`/compliance/api/v1/admin/compliance/regulatory-watch`, data);
}

/** 删除法规动态监控项 */
export function deleteAdminComplianceRegulatoryWatchByRegulatoryWatch(client: ApiClient, regulatoryWatchId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/regulatory-watch/${regulatoryWatchId}`);
}

/** 更新法规动态监控项 */
export function putAdminComplianceRegulatoryWatchByRegulatoryWatch(client: ApiClient, regulatoryWatchId: string, data: UpdateRegulatoryWatchItemRequest): Promise<RegulatoryUpdateItem> {
  return client.put(`/compliance/api/v1/admin/compliance/regulatory-watch/${regulatoryWatchId}`, data);
}

/** 查询保留策略列表 */
export function getAdminComplianceRetentionPolicies(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<RetentionPolicyItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/retention-policies`, { params });
}

/** 创建数据保留策略 */
export function postAdminComplianceRetentionPolicies(client: ApiClient, data: CreateRetentionPolicyRequest): Promise<RetentionPolicyItem> {
  return client.post(`/compliance/api/v1/admin/compliance/retention-policies`, data);
}

/** 删除数据保留策略 */
export function deleteAdminComplianceRetentionPoliciesByRetentionPolicies(client: ApiClient, retentionPolicyId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/retention-policies/${retentionPolicyId}`);
}

/** 更新数据保留策略 */
export function putAdminComplianceRetentionPoliciesByRetentionPolicies(client: ApiClient, retentionPolicyId: string, data: UpdateRetentionPolicyRequest): Promise<RetentionPolicyItem> {
  return client.put(`/compliance/api/v1/admin/compliance/retention-policies/${retentionPolicyId}`, data);
}

/** 查询合规评分历史 */
export function getAdminComplianceScoreHistory(client: ApiClient): Promise<ScoreSnapshotItem[]> {
  return client.get(`/compliance/api/v1/admin/compliance/score-history`);
}

/** 执行职责分离检查 */
export function getAdminComplianceSodChecks(client: ApiClient): Promise<SoDCheckResponse> {
  return client.get(`/compliance/api/v1/admin/compliance/sod-checks`);
}

/** 查询职责分离规则列表 */
export function getAdminComplianceSodRules(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<SoDRuleResponse>> {
  return client.get(`/compliance/api/v1/admin/compliance/sod-rules`, { params });
}

/** 创建职责分离规则 */
export function postAdminComplianceSodRules(client: ApiClient, data: CreateSoDRuleRequest): Promise<SoDRuleResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/sod-rules`, data);
}

/** 删除职责分离规则 */
export function deleteAdminComplianceSodRulesBySodRules(client: ApiClient, sodRuleId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/sod-rules/${sodRuleId}`);
}

/** 更新职责分离规则 */
export function putAdminComplianceSodRulesBySodRules(client: ApiClient, sodRuleId: string, data: UpdateSoDRuleRequest): Promise<SoDRuleResponse> {
  return client.put(`/compliance/api/v1/admin/compliance/sod-rules/${sodRuleId}`, data);
}

/** 查询SOX ITGC控制项列表 */
export function getAdminComplianceSoxItgc(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<SOXITGCItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/sox/itgc`, { params });
}

/** 创建SOX ITGC控制项 */
export function postAdminComplianceSoxItgc(client: ApiClient, data: CreateSOXITGCControlRequest): Promise<SOXITGCItem> {
  return client.post(`/compliance/api/v1/admin/compliance/sox/itgc`, data);
}

/** 删除SOX ITGC控制项 */
export function deleteAdminComplianceSoxItgcByItgc(client: ApiClient, itgcId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/sox/itgc/${itgcId}`);
}

/** 获取SOX ITGC控制项详情 */
export function getAdminComplianceSoxItgcByItgc(client: ApiClient, itgcId: string): Promise<SOXITGCItem> {
  return client.get(`/compliance/api/v1/admin/compliance/sox/itgc/${itgcId}`);
}

/** 更新SOX ITGC控制项 */
export function putAdminComplianceSoxItgcByItgc(client: ApiClient, itgcId: string, data: UpdateSOXITGCControlRequest): Promise<SOXITGCItem> {
  return client.put(`/compliance/api/v1/admin/compliance/sox/itgc/${itgcId}`, data);
}

/** 列出所有合规标准 */
export function getAdminComplianceStandards(client: ApiClient): Promise<StandardItemResponse[]> {
  return client.get(`/compliance/api/v1/admin/compliance/standards`);
}

/** 重载合规标准文件 */
export function postAdminComplianceStandardsReload(client: ApiClient): Promise<string> {
  return client.post(`/compliance/api/v1/admin/compliance/standards/reload`);
}

/** 获取合规标准详情 */
export function getAdminComplianceStandardsByStandards(client: ApiClient, standardId: string): Promise<StandardDetailResponse> {
  return client.get(`/compliance/api/v1/admin/compliance/standards/${standardId}`);
}

/** 列出合规标准控制项 */
export function getAdminComplianceStandardsControlsByStandards(client: ApiClient, standardId: string): Promise<ControlItemResponse[]> {
  return client.get(`/compliance/api/v1/admin/compliance/standards/${standardId}/controls`);
}

/** 查询子处理商列表 */
export function getAdminComplianceSubprocessors(client: ApiClient, params?: {
  category?: string;  // category filter
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<SubProcessorItem>> {
  return client.get(`/compliance/api/v1/admin/compliance/subprocessors`, { params });
}

/** 创建子处理商记录 */
export function postAdminComplianceSubprocessors(client: ApiClient, data: CreateSubProcessorRequest): Promise<SubProcessorItem> {
  return client.post(`/compliance/api/v1/admin/compliance/subprocessors`, data);
}

/** 删除子处理商记录 */
export function deleteAdminComplianceSubprocessorsBySubprocessors(client: ApiClient, subprocessorId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/subprocessors/${subprocessorId}`);
}

/** 获取子处理商详情 */
export function getAdminComplianceSubprocessorsBySubprocessors(client: ApiClient, subprocessorId: string): Promise<SubProcessorItem> {
  return client.get(`/compliance/api/v1/admin/compliance/subprocessors/${subprocessorId}`);
}

/** 更新子处理商信息 */
export function putAdminComplianceSubprocessorsBySubprocessors(client: ApiClient, subprocessorId: string, data: UpdateSubProcessorRequest): Promise<SubProcessorItem> {
  return client.put(`/compliance/api/v1/admin/compliance/subprocessors/${subprocessorId}`, data);
}

/** Run gap analysis for current tenant */
export function postAdminComplianceTenantsSelfGapAnalysis(client: ApiClient): Promise<GapReportResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/tenants/self/gap-analysis`);
}

/** 查询合规参数覆盖列表 */
export function getAdminComplianceTenantsSelfOverrides(client: ApiClient): Promise<OverrideListResponse> {
  return client.get(`/compliance/api/v1/admin/compliance/tenants/self/overrides`);
}

/** 创建合规参数覆盖 */
export function postAdminComplianceTenantsSelfOverrides(client: ApiClient, data: OverrideRequest): Promise<string> {
  return client.post(`/compliance/api/v1/admin/compliance/tenants/self/overrides`, data);
}

/** 删除合规参数覆盖 */
export function deleteAdminComplianceTenantsSelfOverridesByOverrides(client: ApiClient, param: string): Promise<string> {
  return client.delete(`/compliance/api/v1/admin/compliance/tenants/self/overrides/${param}`);
}

/** Get resolved policy for current tenant */
export function getAdminComplianceTenantsSelfPolicy(client: ApiClient): Promise<ResolvedPolicyResponse> {
  return client.get(`/compliance/api/v1/admin/compliance/tenants/self/policy`);
}

/** Get readiness report for current tenant */
export function postAdminComplianceTenantsSelfReadinessByReadiness(client: ApiClient, readinessId: string, data: CurrentConfigRequest): Promise<ReadinessReportResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/tenants/self/readiness/${readinessId}`, data);
}

/** Get compliance score for current tenant */
export function getAdminComplianceTenantsSelfScore(client: ApiClient): Promise<ComplianceScoreResponse> {
  return client.get(`/compliance/api/v1/admin/compliance/tenants/self/score`);
}

/** Update compliance standards for current tenant */
export function putAdminComplianceTenantsSelfStandards(client: ApiClient, data: TenantStandardsRequest): Promise<StandardsUpdatedResponse> {
  return client.put(`/compliance/api/v1/admin/compliance/tenants/self/standards`, data);
}

/** 运行合规差距分析 */
export function postAdminComplianceTenantsGapAnalysisByTenants(client: ApiClient, tid: string, data: CurrentConfigRequest): Promise<GapReportResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/tenants/${tid}/gap-analysis`, data);
}

/** 获取解析后的合规策略 */
export function getAdminComplianceTenantsPolicyByTenants(client: ApiClient, tid: string): Promise<ResolvedPolicyResponse> {
  return client.get(`/compliance/api/v1/admin/compliance/tenants/${tid}/policy`);
}

/** 获取认证就绪报告 */
export function postAdminComplianceTenantsReadinessByTenantsByReadiness(client: ApiClient, tid: string, readinessId: string, data: CurrentConfigRequest): Promise<ReadinessReportResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/tenants/${tid}/readiness/${readinessId}`, data);
}

/** 获取合规评分 */
export function getAdminComplianceTenantsScoreByTenants(client: ApiClient, tid: string): Promise<ComplianceScoreResponse> {
  return client.get(`/compliance/api/v1/admin/compliance/tenants/${tid}/score`);
}

/** 更新租户选中的合规标准 */
export function putAdminComplianceTenantsStandardsByTenants(client: ApiClient, tid: string, data: TenantStandardsRequest): Promise<string> {
  return client.put(`/compliance/api/v1/admin/compliance/tenants/${tid}/standards`, data);
}

/** 查询供应商风险评估列表 */
export function getAdminComplianceVendorRiskAssessment(client: ApiClient, params?: {
  vendor_name?: string;  // vendor name filter
  page?: number;  // page number
  page_size?: number;  // page size
  sort_by?: string;  // sort field
  sort_order?: string;  // sort order
}): Promise<ApiListResult<VendorRiskAssessmentResponse>> {
  return client.get(`/compliance/api/v1/admin/compliance/vendor-risk-assessment`, { params });
}

/** 创建供应商风险评估 */
export function postAdminComplianceVendorRiskAssessment(client: ApiClient, data: VendorRiskAssessmentRequest): Promise<VendorRiskAssessmentResponse> {
  return client.post(`/compliance/api/v1/admin/compliance/vendor-risk-assessment`, data);
}

/** 删除供应商风险评估 */
export function deleteAdminComplianceVendorRiskAssessmentByVendorRiskAssessment(client: ApiClient, vendorRiskAssessmentId: string): Promise<SimpleResponse> {
  return client.delete(`/compliance/api/v1/admin/compliance/vendor-risk-assessment/${vendorRiskAssessmentId}`);
}

/** 更新供应商风险评估 */
export function putAdminComplianceVendorRiskAssessmentByVendorRiskAssessment(client: ApiClient, vendorRiskAssessmentId: string, data: UpdateVendorRiskAssessmentRequest): Promise<VendorRiskAssessmentResponse> {
  return client.put(`/compliance/api/v1/admin/compliance/vendor-risk-assessment/${vendorRiskAssessmentId}`, data);
}

/** 查询我的DSAR列表 */
export function getComplianceGdprDsarMe(client: ApiClient, params?: {
  page?: number;  // page number
  page_size?: number;  // page size
}): Promise<ApiListResult<DSARItem>> {
  return client.get(`/compliance/api/v1/compliance/gdpr/dsar/me`, { params });
}

/** 提交我的DSAR */
export function postComplianceGdprDsarMe(client: ApiClient, data: CreateMyDSARRequest): Promise<DSARItem> {
  return client.post(`/compliance/api/v1/compliance/gdpr/dsar/me`, data);
}

/** 获取DSAR状态 */
export function getComplianceGdprDsarStatusByDsar(client: ApiClient, dsarId: string): Promise<DSARStatusResponse> {
  return client.get(`/compliance/api/v1/compliance/gdpr/dsar/${dsarId}/status`);
}

/** 获取当前隐私政策 */
export function getCompliancePrivacyPolicy(client: ApiClient): Promise<PrivacyPolicyResponse> {
  return client.get(`/compliance/api/v1/compliance/privacy/policy`);
}

/** 获取隐私政策版本历史 */
export function getCompliancePrivacyPolicyVersions(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PrivacyPolicyVersionItem>> {
  return client.get(`/compliance/api/v1/compliance/privacy/policy/versions`, { params });
}

/** 获取数据保留策略公示 */
export function getCompliancePrivacyRetention(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<RetentionPolicyPublicResponse>> {
  return client.get(`/compliance/api/v1/compliance/privacy/retention`, { params });
}

/** 获取合规配置信息 */
export function getComplianceProfile(client: ApiClient): Promise<ComplianceProfileResponse> {
  return client.get(`/compliance/api/v1/compliance/profile`);
}

/** 获取公开审计发现 */
export function getCompliancePublicAuditFindings(client: ApiClient, params?: {
  severity?: string;  // 严重级别筛选
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PublicAuditFinding>> {
  return client.get(`/compliance/api/v1/compliance/public/audit-findings`, { params });
}

/** 获取公开泄露通知 */
export function getCompliancePublicBreachNotifications(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PublicBreachNotification>> {
  return client.get(`/compliance/api/v1/compliance/public/breach-notifications`, { params });
}

/** 获取公开合规认证列表 */
export function getCompliancePublicCertifications(client: ApiClient, params?: {
  framework?: string;  // 认证框架筛选 (SOC2 Type II, ISO 27001)
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PublicCertification>> {
  return client.get(`/compliance/api/v1/compliance/public/certifications`, { params });
}

/** 获取公开跨境数据传输 */
export function getCompliancePublicCrossBorderTransfers(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PublicCrossBorderTransfer>> {
  return client.get(`/compliance/api/v1/compliance/public/cross-border-transfers`, { params });
}

/** 获取公开数据分类 */
export function getCompliancePublicDataClassifications(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PublicDataClassification>> {
  return client.get(`/compliance/api/v1/compliance/public/data-classifications`, { params });
}

/** 获取公开等级保护控制项 */
export function getCompliancePublicDengbaoControls(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PublicDengbaoControl>> {
  return client.get(`/compliance/api/v1/compliance/public/dengbao/controls`, { params });
}

/** 公开查询合规证据 */
export function getCompliancePublicEvidence(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
  sort_by?: string;  // 排序字段
  sort_order?: string;  // 排序方向 (asc/desc)
}): Promise<ApiListResult<Evidence>> {
  return client.get(`/compliance/api/v1/compliance/public/evidence`, { params });
}

/** 获取公开HIPAA控制项 */
export function getCompliancePublicHipaaControls(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PublicHIPAAControl>> {
  return client.get(`/compliance/api/v1/compliance/public/hipaa/controls`, { params });
}

/** 获取公开ISO27001控制项 */
export function getCompliancePublicIso27001Controls(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PublicISO27001Control>> {
  return client.get(`/compliance/api/v1/compliance/public/iso27001/controls`, { params });
}

/** 获取公开协议文档（terms/privacy） */
export function getCompliancePublicLegalDocuments(client: ApiClient, params?: {
  doc_type: string;  // 文档类型: terms | privacy
  lang: string;  // 语言: zh-CN | en-US
  version?: string;  // 精确版本（如 v1）；缺省返回最新 published
}): Promise<PublicLegalDocument> {
  return client.get(`/compliance/api/v1/compliance/public/legal-documents`, { params });
}

/** 获取公开PCI DSS控制项 */
export function getCompliancePublicPcidssControls(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PublicPCIDSSControl>> {
  return client.get(`/compliance/api/v1/compliance/public/pcidss/controls`, { params });
}

/** 获取公开渗透测试报告 */
export function getCompliancePublicPenetrationTestReports(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PublicPenTestReport>> {
  return client.get(`/compliance/api/v1/compliance/public/penetration-test-reports`, { params });
}

/** 获取公开PIPL控制项 */
export function getCompliancePublicPiplControls(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PublicPIPLControl>> {
  return client.get(`/compliance/api/v1/compliance/public/pipl/controls`, { params });
}

/** 获取公开隐私影响评估 */
export function getCompliancePublicPrivacyImpact(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PublicPIA>> {
  return client.get(`/compliance/api/v1/compliance/public/privacy-impact`, { params });
}

/** 获取公开PSD2控制项 */
export function getCompliancePublicPsd2Controls(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PublicPSD2Control>> {
  return client.get(`/compliance/api/v1/compliance/public/psd2/controls`, { params });
}

/** 获取公开监管监控 */
export function getCompliancePublicRegulatoryWatch(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<RegulatoryUpdateItem>> {
  return client.get(`/compliance/api/v1/compliance/public/regulatory-watch`, { params });
}

/** 获取公开安全评分 */
export function getCompliancePublicSecurityScore(client: ApiClient): Promise<SecurityScore> {
  return client.get(`/compliance/api/v1/compliance/public/security-score`);
}

/** 获取公开合规状态 */
export function getCompliancePublicStatus(client: ApiClient): Promise<PublicComplianceStatusResponse> {
  return client.get(`/compliance/api/v1/compliance/public/status`);
}

/** 获取公开子处理商清单 */
export function getCompliancePublicSubprocessors(client: ApiClient, params?: {
  category?: string;  // 类别筛选: infrastructure/service_provider/third_party
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<PublicSubProcessor>> {
  return client.get(`/compliance/api/v1/compliance/public/subprocessors`, { params });
}

/** 获取合规状态概览 */
export function getComplianceStatus(client: ApiClient): Promise<ComplianceStatusResponse> {
  return client.get(`/compliance/api/v1/compliance/status`);
}

