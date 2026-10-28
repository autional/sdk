/**
 * @autional/api-mfa — Auto-generated from mfa-service swagger.json
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

export interface FieldViolation {
  code?: string;  // Code 是错误代码（可选） 用于程序识别错误类型，如 "required", "format", "range"
  description?: string;  // Description 是人类可读的错误描述 应该说明违反了什么规则，如 "必须是一个有效的邮箱地址"
  field?: string;  // Field 是错误字段的路径 使用点号表示嵌套字段，如 "user.email" 或 "addresses[0].city"
  standard?: string;  // Standard 是指向权威规范文档的 URI 引用 用于告知 API 消费者具体违反哪个标准 示例："https://www.rfc-editor.org/info/rfc5322"
  value?: unknown;  // Value 是导致错误的值（可选，开发模式下使用） 生产环境可能不返回此字段以避免泄露敏感信息
}

export interface Problem {
  code?: number;  // Code 是业务错误码 用于程序处理特定错误场景 示例：30101001
  detail?: string;  // Detail 是针对此具体错误实例的人类可读解释 可以包含具体的错误细节，如"Field 'email' is required"
  errors?: FieldViolation[];  // Errors 是字段级验证错误列表（扩展字段） 遵循 Web API 标准实践，每个错误包含字段名和错误信息
  i18nArgs?: Record<string, unknown>;  // I18nArgs 是国际化参数 用于动态填充翻译模板
  i18nKey?: string;  // I18nKey 是国际化键 用于客户端本地化错误消息 示例："error.user_not_found"
  instance?: string;  // Instance 是发生问题的具体URI引用 通常是请求的URL，可能包含查询参数 示例："/api/v1/users?limit=invalid"
  requestId?: string;  // RequestID 是请求唯一标识 用于日志关联和问题追踪 示例："req_550e8400-e29b-41d4-a716-446655440000"
  retryAfter?: number;  // RetryAfter 用于 429 Too Many Requests 响应 指示客户端应在多少秒后重试请求（RFC 6585）
  service?: string;  // Service 是服务名 用于微服务架构中定位错误来源 示例："auth-service"
  spanId?: string;  // SpanID 是当前 span 标识 用于精确定位分布式链路中的当前节点
  status?: number;  // Status 是产生的HTTP状态码 用于客户端区分问题类型，不随Accept-Language变化 示例：400, 401, 403, 404, 500
  timestamp?: string;  // Timestamp 是错误发生时间 ISO 8601 格式 示例："2026-04-03T12:00:00Z"
  title?: string;  // Title 是简短、人类可读的问题类型摘要 相同的 Type 应该始终有相同的 Title（不随实例变化） 示例："Invalid Request Parameters"
  traceId?: string;  // TraceID 是分布式追踪标识 遵循 W3C Trace Context 标准 示例："00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01"
  Type?: string;  // Type 是标识问题类型的URI引用 当该URI被解引用时，应提供人类可读的文档 示例："https://api.example.com/errors/invalid-request"
}

export interface PageInfo {
  hasNext?: boolean;  // HasNext indicates whether there is a next page
  hasPrev?: boolean;  // HasPrev indicates whether there is a previous page
  page?: number;  // Page is the current page number (1-based)
  pageSize?: number;  // PageSize is the number of items per page
  total?: number;  // Total is the total number of items across all pages
  totalPages?: number;  // TotalPages is the total number of pages
}

export interface SimpleResponse {
  code?: number;
  message?: string;
  timestamp?: string;
}

export interface AdminBackupCodesListItem {
  count?: number;
  userId?: string;
}

export interface AdminPushChallengeItem {
  challengeId?: string;
  createdAt?: string;
  loginContext?: string;
  numberMatching?: string;
  resolvedAt?: string;
  status?: string;
  userId?: string;
}

export interface BackupCodeVerifyRequest {
  code: string;
}

export interface BackupCodeVerifyResponse {
  remainingCodes?: number;
  valid?: boolean;
}

export interface BackupCodesCountResponse {
  count?: number;
  maxCodes?: number;
  message?: string;
  shouldRegenerate?: boolean;
}

export interface BackupCodesResponse {
  codes?: string[];
  message?: string;
}

export interface CreateIPWhitelistRequest {
  cidr: string;
  label: string;
}

export interface DeviceSyncRequest {
  deviceFingerprint?: string;
  deviceName: string;
  scheme?: string;
  totpDevices?: string;  // TOTPDevices 仅接受 v2 端到端加密信封（`v2:<base64 salt>:<base64 iv>:<base64 ciphertext>`，≤64KiB）； 明文一律不落库（按 metadata_v1 处理）。
}

export interface DeviceSyncResponse {
  createdAt?: string;
  deviceFingerprint?: string;
  deviceName?: string;
  id?: string;
  lastSyncAt?: string;
  needsResync?: boolean;  // NeedsResync 历史行（服务端可解密形态）已停止回传，客户端需重新同步。
  payloadDropped?: boolean;  // PayloadDropped 旧客户端明文载荷已被丢弃（不落库）；仅同步响应返回。
  scheme?: string;
  totpDevices?: string;  // TOTPDevices 仅回传 e2ee_v1 密文；旧行一律为空（不回传、不解密）。
}

export interface DisabledResponse {
  disabled?: boolean;
}

export interface EmailDisableRequest {
  code: string;
}

export interface EmailEnrollRequest {
  email: string;
}

export interface EmailEnrollResponse {
  email?: string;
  enabled?: boolean;
  methodType?: string;
  status?: string;
  verified?: boolean;
}

export interface EmailSendData {
  expires?: string;
  sent?: boolean;
}

export interface EmailSendRequest {
  email: string;
  purpose?: string;
}

export interface EmailVerifyRequest {
  code: string;
  email?: string;  // 邮箱地址，用于创建 MFAConfig 记录
}

export interface EvaluateRiskPolicyRequest {
  deviceFingerprint?: string;
  ip?: string;
  userId: string;
}

export interface EvaluateRiskPolicyResponse {
  enabled?: boolean;  // Enabled 该等级是否存在启用策略；false = 管理员已禁用（或回退内置默认），不再额外要求 MFA（A17）
  isNewDevice?: boolean;
  level?: string;
  requiredMethods?: string[];
}

export type GenerateBackupCodesRequest = Record<string, unknown>;

export interface GetBackupCodesResponse {
  codes?: string[];
  count?: number;
  message?: string;
}

export interface IPWhitelistResponse {
  cidr?: string;
  createdAt?: string;
  enabled?: boolean;
  id?: string;
  label?: string;
  tenantId?: string;
}

export interface InternalEmailSendRequest {
  email: string;
  purpose?: string;
  userId: string;
}

export interface InternalEraseMFARequest {
  tenantId: string;
  userId: string;
}

export interface InternalMFAStatusResponse {
  email?: MFAMethodStatus;
  sms?: MFAMethodStatus;
  totp?: MFAMethodStatus;
}

export interface InternalSMSSendRequest {
  purpose?: string;
  userId: string;
}

export interface InternalTOTPDisableRequest {
  tenantId: string;
  userId: string;
}

export interface InternalTOTPValidateRequest {
  code: string;
  tenantId?: string;
  userId: string;
}

export interface MFAChallengeRequest {
  method: string;
}

export interface MFAChallengeResponse {
  challengeId?: string;
  createdAt?: string;
  expiresIn?: number;
  method?: string;
  tenantId?: string;
  userId?: string;
}

export interface MFAConfigAuditLogItem {
  action?: string;
  id?: string;
  message?: string;
  module?: string;
  operatorId?: string;
  targetId?: string;
  targetType?: string;
  tenantId?: string;
  timestamp?: string;
}

export interface MFADeletedResponse {
  deleted?: boolean;
  Type?: string;
}

export interface MFAMethodItem {
  createdAt?: string;
  detail?: string;
  enabled?: boolean;
  methodType?: string;
  primary?: boolean;
  verified?: boolean;
}

export interface MFAMethodStatus {
  email?: string;
  enabled?: boolean;
  phone?: string;
  verified?: boolean;
}

export interface MFAStatusResponse {
  emailAddress?: string;
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  smsPhone?: string;
  totpEnabled?: boolean;
}

export interface PushApproveRequest {
  challengeId: string;
  deviceKey?: string;
  numberMatching: string;
}

export interface PushChallengeRequest {
  deviceId?: string;
  loginContext?: string;
}

export interface PushChallengeResponse {
  challengeId?: string;
  createdAt?: string;
  expiresIn?: number;
  loginContext?: string;
  numberMatching?: string;
  status?: string;
  userId?: string;
}

export interface PushChallengeStatusResponse {
  challengeId?: string;
  loginContext?: string;
  numberMatching?: string;
  resolvedAt?: string;
  status?: string;
}

export interface PushDenyRequest {
  challengeId: string;
  deviceKey?: string;
  numberMatching: string;
}

export interface PushHistoryItem {
  challengeId?: string;
  createdAt?: string;
  loginContext?: string;
  resolvedAt?: string;
  status?: string;
}

export interface PushStatsResponse {
  approved?: number;
  denied?: number;
  expired?: number;
  pending?: number;
  total?: number;
}

export interface RiskPolicyItem {
  createdAt?: string;
  description?: string;
  enabled?: boolean;
  id?: string;
  level?: string;
  requiredMethods?: string[];
  updatedAt?: string;
}

export interface RiskPolicyLevel {
  requiredMethods?: string[];
}

export interface RiskPolicyResponse {
  highRisk?: RiskPolicyLevel;
  lowRisk?: RiskPolicyLevel;
  mediumRisk?: RiskPolicyLevel;
  tenantId?: string;
}

export interface SMSDisableRequest {
  code: string;
}

export interface SMSEnrollRequest {
  phone: string;
}

export interface SMSEnrollResponse {
  enabled?: boolean;
  methodType?: string;
  phone?: string;
  status?: string;
  verified?: boolean;
}

export interface SMSSendRequest {
  phone: string;
  purpose?: string;  // login, bind, reset
}

export interface SMSSendResponse {
  expires?: string;
  sent?: boolean;
}

export interface SMSVerifyRequest {
  code: string;
  phone?: string;  // 手机号，用于创建 MFAConfig 记录
}

export interface SMSVerifyResponse {
  valid?: boolean;
}

export interface SetPrimaryCredentialRequest {
  Type: string;
}

export interface SetPrimaryCredentialResponse {
  credentialId?: string;
  primary?: boolean;
  Type?: string;
}

export interface StepUpRequest {
  code: string;
  method: "totp" | "sms" | "email";
  userId: string;
}

export interface StepUpResponse {
  expiresIn?: number;
  message?: string;
  stepUpToken?: string;
  valid?: boolean;
}

export interface TOTPDeviceItem {
  createdAt?: string;
  deviceId?: string;
  deviceName?: string;
  enabled?: boolean;
  lastUsedAt?: string;
  verified?: boolean;
}

export interface TOTPDeviceRegisterRequest {
  account?: string;
  deviceFingerprint?: string;
  deviceName: string;
}

export interface TOTPDeviceRegisterResponse {
  deviceId?: string;
  deviceName?: string;
  qrCode?: string;
  qrCodeUrl?: string;
  secret?: string;
}

export interface TOTPDeviceRevokeRequest {
  code: string;
}

export interface TOTPDisableRequest {
  code: string;
}

export interface TOTPEnableRequest {
  account?: string;
  deviceName?: string;
}

export interface TOTPEnableResponse {
  backupCodes?: string[];
  qrCode?: string;
  qrCodeUrl?: string;
  secret?: string;
  setupUrl?: string;
}

export interface TOTPValidateRequest {
  code: string;
  userId: string;
}

export interface TOTPVerifyRequest {
  code: string;
}

export interface TrustDeviceRequest {
  deviceFingerprint: string;
  deviceName: string;
  userAgent?: string;
}

export interface TrustedDeviceCountResponse {
  count?: number;
}

export interface TrustedDeviceItem {
  createdAt?: string;
  deviceName?: string;
  id?: string;
  ipAddress?: string;
  trustedUntil?: string;
}

export interface UpdateIPWhitelistRequest {
  cidr?: string;
  enabled?: boolean;
  label?: string;
}

export interface UpdateRiskPolicyByLevelRequest {
  description?: string;
  enabled?: boolean;
  requiredMethods: string[];
}

export interface UpdateRiskPolicyRequest {
  highRisk: string[];
  lowRisk: string[];
  mediumRisk: string[];
}

export interface ValidResponse {
  valid?: boolean;
}


// ====== API Functions (tree-shakeable: independent exports) ======

/** 管理端列出所有备用码配置 */
export function getAdminMfaBackupCodes(client: ApiClient): Promise<ApiListResult<AdminBackupCodesListItem>> {
  return client.get(`/mfa/api/v1/admin/mfa/backup-codes`);
}

/** 管理端获取用户备用码数量 */
export function getAdminMfaBackupCodesByBackupCodes(client: ApiClient, userId: string): Promise<BackupCodesCountResponse> {
  return client.get(`/mfa/api/v1/admin/mfa/backup-codes/${userId}`);
}

/** 获取MFA配置审计日志 */
export function getAdminMfaConfigAuditLogs(client: ApiClient, params?: {
  action?: string;  // 操作类型过滤
  target_type?: string;  // 目标类型过滤
  operator_id?: string;  // 操作者ID过滤
  start_date?: string;  // 开始日期（YYYY-MM-DD）
  end_date?: string;  // 结束日期（YYYY-MM-DD）
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<MFAConfigAuditLogItem>> {
  return client.get(`/mfa/api/v1/admin/mfa/config-audit-logs`, { params });
}

/** 列出IP白名单 */
export function getAdminMfaIpWhitelist(client: ApiClient): Promise<ApiListResult<IPWhitelistResponse>> {
  return client.get(`/mfa/api/v1/admin/mfa/ip-whitelist`);
}

/** 创建IP白名单 */
export function postAdminMfaIpWhitelist(client: ApiClient, data: CreateIPWhitelistRequest): Promise<IPWhitelistResponse> {
  return client.post(`/mfa/api/v1/admin/mfa/ip-whitelist`, data);
}

/** 删除IP白名单 */
export function deleteAdminMfaIpWhitelistByIpWhitelist(client: ApiClient, ipWhitelistId: string): Promise<void> {
  return client.delete(`/mfa/api/v1/admin/mfa/ip-whitelist/${ipWhitelistId}`);
}

/** 获取IP白名单 */
export function getAdminMfaIpWhitelistByIpWhitelist(client: ApiClient, ipWhitelistId: string): Promise<IPWhitelistResponse> {
  return client.get(`/mfa/api/v1/admin/mfa/ip-whitelist/${ipWhitelistId}`);
}

/** 更新IP白名单 */
export function putAdminMfaIpWhitelistByIpWhitelist(client: ApiClient, ipWhitelistId: string, data: UpdateIPWhitelistRequest): Promise<IPWhitelistResponse> {
  return client.put(`/mfa/api/v1/admin/mfa/ip-whitelist/${ipWhitelistId}`, data);
}

/** 管理端查看推送挑战列表 */
export function getAdminMfaPushChallenges(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  status?: string;  // 状态过滤（pending/approved/denied/expired）
  user_id?: string;  // 用户ID过滤
}): Promise<ApiListResult<AdminPushChallengeItem>> {
  return client.get(`/mfa/api/v1/admin/mfa/push/challenges`, { params });
}

/** 获取Push MFA挑战统计 */
export function getAdminMfaPushStats(client: ApiClient): Promise<PushStatsResponse> {
  return client.get(`/mfa/api/v1/admin/mfa/push/stats`);
}

/** 管理员重置用户MFA */
export function deleteAdminMfaResetByReset(client: ApiClient, userId: string): Promise<SimpleResponse> {
  return client.delete(`/mfa/api/v1/admin/mfa/reset/${userId}`);
}

/** 列出所有风险策略 */
export function getAdminMfaRiskPolicies(client: ApiClient): Promise<ApiListResult<RiskPolicyItem>> {
  return client.get(`/mfa/api/v1/admin/mfa/risk-policies`);
}

/** 评估风险策略 */
export function postAdminMfaRiskPoliciesEvaluate(client: ApiClient, data: EvaluateRiskPolicyRequest): Promise<EvaluateRiskPolicyResponse> {
  return client.post(`/mfa/api/v1/admin/mfa/risk-policies/evaluate`, data);
}

/** 删除指定等级的风险策略 */
export function deleteAdminMfaRiskPoliciesByRiskPolicies(client: ApiClient, level: string): Promise<void> {
  return client.delete(`/mfa/api/v1/admin/mfa/risk-policies/${level}`);
}

/** 更新指定等级的风险策略 */
export function putAdminMfaRiskPoliciesByRiskPolicies(client: ApiClient, level: string, data: UpdateRiskPolicyByLevelRequest): Promise<RiskPolicyItem> {
  return client.put(`/mfa/api/v1/admin/mfa/risk-policies/${level}`, data);
}

/** 获取MFA风险策略 */
export function getAdminMfaRiskPolicy(client: ApiClient): Promise<RiskPolicyResponse> {
  return client.get(`/mfa/api/v1/admin/mfa/risk-policy`);
}

/** 更新MFA风险策略 */
export function putAdminMfaRiskPolicy(client: ApiClient, data: UpdateRiskPolicyRequest): Promise<RiskPolicyResponse> {
  return client.put(`/mfa/api/v1/admin/mfa/risk-policy`, data);
}

/** 管理端获取用户TOTP状态 */
export function getAdminMfaTotpByTotp(client: ApiClient, userId: string): Promise<ApiListResult<TOTPDeviceItem>> {
  return client.get(`/mfa/api/v1/admin/mfa/totp/${userId}`);
}

/** 查看备用码 */
export function getMfaBackupCodes(client: ApiClient): Promise<GetBackupCodesResponse> {
  return client.get(`/mfa/api/v1/mfa/backup-codes`);
}

/** 查看备用码数量 */
export function getMfaBackupCodesCount(client: ApiClient): Promise<BackupCodesCountResponse> {
  return client.get(`/mfa/api/v1/mfa/backup-codes/count`);
}

/** 生成备用恢复码 */
export function postMfaBackupCodesGenerate(client: ApiClient, data: GenerateBackupCodesRequest): Promise<BackupCodesResponse> {
  return client.post(`/mfa/api/v1/mfa/backup-codes/generate`, data);
}

/** 独立备用码验证 */
export function postMfaBackupCodesVerify(client: ApiClient, data: BackupCodeVerifyRequest): Promise<BackupCodeVerifyResponse> {
  return client.post(`/mfa/api/v1/mfa/backup-codes/verify`, data);
}

/** 创建通用MFA挑战 */
export function postMfaChallenge(client: ApiClient, data: MFAChallengeRequest): Promise<MFAChallengeResponse> {
  return client.post(`/mfa/api/v1/mfa/challenge`, data);
}

/** 设置主认证方式 */
export function postMfaCredentialsPrimaryByCredentials(client: ApiClient, credentialId: string, data: SetPrimaryCredentialRequest): Promise<SetPrimaryCredentialResponse> {
  return client.post(`/mfa/api/v1/mfa/credentials/${credentialId}/primary`, data);
}

/** 列出同步设备 */
export function getMfaDevicesSync(client: ApiClient): Promise<ApiListResult<DeviceSyncResponse>> {
  return client.get(`/mfa/api/v1/mfa/devices/sync`);
}

/** 同步设备数据 */
export function postMfaDevicesSync(client: ApiClient, data: DeviceSyncRequest): Promise<DeviceSyncResponse> {
  return client.post(`/mfa/api/v1/mfa/devices/sync`, data);
}

/** 解绑同步设备 */
export function deleteMfaDevicesSyncBySync(client: ApiClient, syncId: string): Promise<void> {
  return client.delete(`/mfa/api/v1/mfa/devices/sync/${syncId}`);
}

/** 禁用邮箱 MFA */
export function postMfaEmailDisable(client: ApiClient, data: EmailDisableRequest): Promise<DisabledResponse> {
  return client.post(`/mfa/api/v1/mfa/email/disable`, data);
}

/** Email MFA注册 */
export function putMfaEmailEnroll(client: ApiClient, data: EmailEnrollRequest): Promise<EmailEnrollResponse> {
  return client.put(`/mfa/api/v1/mfa/email/enroll`, data);
}

/** 发送邮箱验证码 */
export function postMfaEmailSend(client: ApiClient, data: EmailSendRequest): Promise<EmailSendData> {
  return client.post(`/mfa/api/v1/mfa/email/send`, data);
}

/** 验证邮箱验证 */
export function postMfaEmailVerify(client: ApiClient, data: EmailVerifyRequest): Promise<ValidResponse> {
  return client.post(`/mfa/api/v1/mfa/email/verify`, data);
}

/** 列出MFA方法 */
export function getMfaMethods(client: ApiClient, params?: {
  user_id: string;  // 用户ID
}): Promise<ApiListResult<MFAMethodItem>> {
  return client.get(`/mfa/api/v1/mfa/methods`, { params });
}

/** 删除MFA方法 */
export function deleteMfaMethodsByMethods(client: ApiClient, methodType: string, params?: {
  user_id: string;  // 用户ID
}): Promise<MFADeletedResponse> {
  return client.delete(`/mfa/api/v1/mfa/methods/${methodType}`, params);
}

/** 批准Push MFA挑战 */
export function postMfaPushApprove(client: ApiClient, data: PushApproveRequest): Promise<ValidResponse> {
  return client.post(`/mfa/api/v1/mfa/push/approve`, data);
}

/** 创建Push MFA挑战 */
export function postMfaPushChallenge(client: ApiClient, data: PushChallengeRequest): Promise<PushChallengeResponse> {
  return client.post(`/mfa/api/v1/mfa/push/challenge`, data);
}

/** 获取Push挑战状态 */
export function getMfaPushChallengeByChallenge(client: ApiClient, credentialId: string): Promise<PushChallengeStatusResponse> {
  return client.get(`/mfa/api/v1/mfa/push/challenge/${credentialId}`);
}

/** 拒绝Push MFA挑战 */
export function postMfaPushDeny(client: ApiClient, data: PushDenyRequest): Promise<ValidResponse> {
  return client.post(`/mfa/api/v1/mfa/push/deny`, data);
}

/** 获取Push MFA挑战历史 */
export function getMfaPushHistory(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  status?: string;  // 状态过滤（pending/approved/denied/expired）
}): Promise<ApiListResult<PushHistoryItem>> {
  return client.get(`/mfa/api/v1/mfa/push/history`, { params });
}

/** 禁用短信 MFA */
export function postMfaSmsDisable(client: ApiClient, data: SMSDisableRequest): Promise<DisabledResponse> {
  return client.post(`/mfa/api/v1/mfa/sms/disable`, data);
}

/** SMS MFA注册 */
export function putMfaSmsEnroll(client: ApiClient, data: SMSEnrollRequest): Promise<SMSEnrollResponse> {
  return client.put(`/mfa/api/v1/mfa/sms/enroll`, data);
}

/** 发送短信验证码 */
export function postMfaSmsSend(client: ApiClient, data: SMSSendRequest): Promise<SMSSendResponse> {
  return client.post(`/mfa/api/v1/mfa/sms/send`, data);
}

/** 验证短信验证 */
export function postMfaSmsVerify(client: ApiClient, data: SMSVerifyRequest): Promise<SMSVerifyResponse> {
  return client.post(`/mfa/api/v1/mfa/sms/verify`, data);
}

/** 获取用户MFA状态 */
export function getMfaStatusByStatus(client: ApiClient, userId: string): Promise<MFAStatusResponse> {
  return client.get(`/mfa/api/v1/mfa/status/${userId}`);
}

/** MFA步进认证 */
export function postMfaStepUp(client: ApiClient, data: StepUpRequest): Promise<StepUpResponse> {
  return client.post(`/mfa/api/v1/mfa/step-up`, data);
}

/** 列出TOTP设备 */
export function getMfaTotpDevices(client: ApiClient, params?: {
  user_id: string;  // 用户ID
}): Promise<ApiListResult<TOTPDeviceItem>> {
  return client.get(`/mfa/api/v1/mfa/totp/devices`, { params });
}

/** 注册TOTP设备 */
export function postMfaTotpDevices(client: ApiClient, data: TOTPDeviceRegisterRequest): Promise<TOTPDeviceRegisterResponse> {
  return client.post(`/mfa/api/v1/mfa/totp/devices`, data);
}

/** 撤销TOTP设备 */
export function deleteMfaTotpDevicesByDevices(client: ApiClient, deviceId: string, data: TOTPDeviceRevokeRequest): Promise<DisabledResponse> {
  return client.delete(`/mfa/api/v1/mfa/totp/devices/${deviceId}`);
}

/** 获取TOTP设备详情 */
export function getMfaTotpDevicesByDevices(client: ApiClient, deviceId: string): Promise<TOTPDeviceItem> {
  return client.get(`/mfa/api/v1/mfa/totp/devices/${deviceId}`);
}

/** 禁用TOTP设备 */
export function postMfaTotpDevicesDisableByDevices(client: ApiClient, deviceId: string): Promise<TOTPDeviceItem> {
  return client.post(`/mfa/api/v1/mfa/totp/devices/${deviceId}/disable`);
}

/** 启用TOTP设备 */
export function postMfaTotpDevicesEnableByDevices(client: ApiClient, deviceId: string): Promise<TOTPDeviceItem> {
  return client.post(`/mfa/api/v1/mfa/totp/devices/${deviceId}/enable`);
}

/** 禁用TOTP */
export function postMfaTotpDisable(client: ApiClient, data: TOTPDisableRequest): Promise<DisabledResponse> {
  return client.post(`/mfa/api/v1/mfa/totp/disable`, data);
}

/** 启用TOTP多因素认证 */
export function postMfaTotpEnable(client: ApiClient, data: TOTPEnableRequest): Promise<TOTPEnableResponse> {
  return client.post(`/mfa/api/v1/mfa/totp/enable`, data);
}

/** 启用TOTP多因素认证 */
export function postMfaTotpSetup(client: ApiClient, data: TOTPEnableRequest): Promise<TOTPEnableResponse> {
  return client.post(`/mfa/api/v1/mfa/totp/setup`, data);
}

/** 验证TOTP码（登录时） */
export function postMfaTotpValidate(client: ApiClient, data: TOTPValidateRequest): Promise<ValidResponse> {
  return client.post(`/mfa/api/v1/mfa/totp/validate`, data);
}

/** 验证并启用TOTP */
export function postMfaTotpVerify(client: ApiClient, data: TOTPVerifyRequest): Promise<ValidResponse> {
  return client.post(`/mfa/api/v1/mfa/totp/verify`, data);
}

/** 撤销所有受信设备 */
export function deleteMfaTrustedDevices(client: ApiClient): Promise<TrustedDeviceCountResponse> {
  return client.delete(`/mfa/api/v1/mfa/trusted-devices`);
}

/** 列出受信设备 */
export function getMfaTrustedDevices(client: ApiClient): Promise<ApiListResult<TrustedDeviceItem>> {
  return client.get(`/mfa/api/v1/mfa/trusted-devices`);
}

/** 记住受信设备 */
export function postMfaTrustedDevices(client: ApiClient, data: TrustDeviceRequest): Promise<TrustedDeviceItem> {
  return client.post(`/mfa/api/v1/mfa/trusted-devices`, data);
}

/** 检查设备是否受信 */
export function getMfaTrustedDevicesCheck(client: ApiClient, params?: {
  user_id: string;  // 用户ID
  fingerprint: string;  // 设备指纹
}): Promise<ValidResponse> {
  return client.get(`/mfa/api/v1/mfa/trusted-devices/check`, { params });
}

/** 清理过期受信设备 */
export function postMfaTrustedDevicesCleanup(client: ApiClient): Promise<SimpleResponse> {
  return client.post(`/mfa/api/v1/mfa/trusted-devices/cleanup`);
}

/** 撤销受信设备 */
export function deleteMfaTrustedDevicesByTrustedDevices(client: ApiClient, trustedDeviceId: string): Promise<void> {
  return client.delete(`/mfa/api/v1/mfa/trusted-devices/${trustedDeviceId}`);
}

/** 获取受信设备详情 */
export function getMfaTrustedDevicesByTrustedDevices(client: ApiClient, trustedDeviceId: string): Promise<TrustedDeviceItem> {
  return client.get(`/mfa/api/v1/mfa/trusted-devices/${trustedDeviceId}`);
}

