/**
 * @autional/api-secret — Auto-generated from secret-service internal/docs/docs.go
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

export interface PageInfo {
  hasNext?: boolean;  // HasNext indicates whether there is a next page
  hasPrev?: boolean;  // HasPrev indicates whether there is a previous page
  page?: number;  // Page is the current page number (1-based)
  pageSize?: number;  // PageSize is the number of items per page
  total?: number;  // Total is the total number of items across all pages
  totalPages?: number;  // TotalPages is the total number of pages
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

export interface SimpleResponse {
  code?: number;
  message?: string;
  timestamp?: string;
}

export interface BatchGetRequest {
  keys: string[];
}

export interface BatchGetResponse {
  errors?: SecretErrorResponse[];
  values?: SecretValueResponse[];
}

export interface BatchKeyError {
  error?: string;
  key?: string;
}

export interface BatchResult {
  errors?: BatchKeyError[];
  succeeded?: string[];
}

export interface BatchRevokeRequest {
  keys: string[];
}

export interface EncryptionKeyInfo {
  algorithm?: string;
  keyId?: string;
  secretsCount?: number;
  servicesUsing?: string[];
  status?: string;
}

export interface EncryptionKeysDetailResponse {
  keys?: EncryptionKeyInfo[];
}

export interface JWTKeyInfo {
  algorithm?: string;
  createdAt?: string;
  fingerprint?: string;
  hasPrivateKey?: boolean;
  hasPublicKey?: boolean;
  keyId?: string;
  keySize?: number;
  keyType?: string;
  status?: string;
  updatedAt?: string;
  version?: number;
}

export type JWTKeyResponse = Record<string, unknown>;

export interface JWTKeysListResponse {
  keys?: JWTKeyInfo[];
}

export interface JWTPublicKeyResponse {
  publicKey?: string;
}

export interface RotateSecretRequest {
  value: string;
}

export interface SecretDetailResponse {
  appId?: string;
  createdAt?: string;
  description?: string;
  expiresAt?: string;
  id?: string;
  key?: string;
  metadata?: Record<string, unknown>;
  notifyBefore?: number;
  status?: string;
  updatedAt?: string;
  version?: number;
  versions?: SecretVersionResponse[];
}

export interface SecretErrorResponse {
  error?: string;
  key?: string;
}

export interface SecretPolicyRequest {
  autoRotateDays?: number;
  defaultTtl?: Duration;
  maxTtl?: Duration;
  maxVersions?: number;
  notificationDaysBefore?: number;
  requireRotationForFallbackKeys?: boolean;
}

export interface SecretPolicyResponse {
  autoRotateDays?: number;
  defaultTtl?: Duration;
  maxTtl?: Duration;
  maxVersions?: number;
  notificationDaysBefore?: number;
  requireRotationForFallbackKeys?: boolean;
  tenantId?: string;
  updatedAt?: string;
}

export interface SecretResponse {
  appId?: string;
  createdAt?: string;
  description?: string;
  expiresAt?: string;
  id?: string;
  key?: string;
  metadata?: Record<string, unknown>;
  notifyBefore?: number;
  status?: string;
  updatedAt?: string;
  version?: number;
}

export interface SecretValueResponse {
  encoding?: string;
  key?: string;
  status?: string;
  value?: string;
  version?: number;
}

export interface SecretVersionQuery {
  version: number;
}

export interface SecretVersionResponse {
  createdAt?: string;
  createdBy?: string;
  version?: number;
}

export interface StoreSecretRequest {
  description?: string;
  expiresAt?: string;
  key: string;
  metadata?: Record<string, unknown>;
  notifyBefore?: number;
  value: string;
}

export interface TransmissionDecryptRequest {
  ciphertext: string;  // base64(RSA-OAEP encrypted password)
  keyId?: string;  // 公钥 ID (预留多密钥支持)
}

export interface TransmissionDecryptResponse {
  plaintext?: string;
}

export interface UpdateSecretRequest {
  description?: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
  notifyBefore?: number;
  value?: string;
}

export type Duration = "-9223372036854775808" | "9223372036854775807" | "1" | "1000" | "1000000" | "1000000000" | "60000000000" | "3600000000000";


// ====== API Functions (tree-shakeable: independent exports) ======

// ApiClient 的 post/put 不收 query 参数，这里统一拼接到 URL
function appendQuery(url: string, params?: Record<string, unknown>): string {
  if (!params) return url;
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) query.append(k, String(v));
  }
  const qs = query.toString();
  return qs ? `${url}?${qs}` : url;
}

/** 列出密钥 */
export function getAdminSecrets(client: ApiClient, params?: {
  prefix?: string;  // 前缀过滤
  status?: string;  // 状态过滤
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<SecretResponse>> {
  return client.get(`/secret/api/v1/admin/secrets`, { params });
}

/** 创建密钥 */
export function postAdminSecrets(client: ApiClient, data: StoreSecretRequest): Promise<SecretResponse> {
  return client.post(`/secret/api/v1/admin/secrets`, data);
}

/** 批量删除密钥 */
export function postAdminSecretsBatchDelete(client: ApiClient, data: BatchRevokeRequest): Promise<BatchResult> {
  return client.post(`/secret/api/v1/admin/secrets/batch-delete`, data);
}

/** 批量吊销密钥 */
export function postAdminSecretsBatchRevoke(client: ApiClient, data: BatchRevokeRequest): Promise<BatchResult> {
  return client.post(`/secret/api/v1/admin/secrets/batch-revoke`, data);
}

/** 获取密钥详情 */
export function getAdminSecretsDetail(client: ApiClient, params?: {
  key: string;  // 密钥路径
}): Promise<SecretDetailResponse> {
  return client.get(`/secret/api/v1/admin/secrets/detail`, { params });
}

/** 获取加密密钥列表 */
export function getAdminSecretsEncryptionKeys(client: ApiClient): Promise<EncryptionKeysDetailResponse> {
  return client.get(`/secret/api/v1/admin/secrets/encryption-keys`);
}

/** 删除密钥 */
export function deleteAdminSecretsItemKeyByKey(client: ApiClient, key: string): Promise<string> {
  return client.delete(`/secret/api/v1/admin/secrets/item/key/${key}`);
}

/** 列出 JWT 密钥 */
export function getAdminSecretsJwtKeys(client: ApiClient): Promise<JWTKeysListResponse> {
  return client.get(`/secret/api/v1/admin/secrets/jwt/keys`);
}

/** 删除密钥策略 */
export function deleteAdminSecretsPolicy(client: ApiClient): Promise<SimpleResponse> {
  return client.delete(`/secret/api/v1/admin/secrets/policy`);
}

/** 获取密钥策略 */
export function getAdminSecretsPolicy(client: ApiClient): Promise<SecretPolicyResponse> {
  return client.get(`/secret/api/v1/admin/secrets/policy`);
}

/** 更新密钥策略 */
export function putAdminSecretsPolicy(client: ApiClient, data: SecretPolicyRequest): Promise<SecretPolicyResponse> {
  return client.put(`/secret/api/v1/admin/secrets/policy`, data);
}

/** 吊销密钥 */
export function postAdminSecretsRevoke(client: ApiClient, params?: {
  key: string;  // 密钥路径
}): Promise<string> {
  return client.post(appendQuery(`/secret/api/v1/admin/secrets/revoke`, params));
}

/** 轮换密钥 */
export function postAdminSecretsRotate(client: ApiClient, data: RotateSecretRequest, params?: {
  key: string;  // 密钥路径
}): Promise<SecretResponse> {
  return client.post(appendQuery(`/secret/api/v1/admin/secrets/rotate`, params), data);
}

/** 更新密钥元数据 */
export function postAdminSecretsUpdate(client: ApiClient, data: UpdateSecretRequest, params?: {
  key: string;  // 密钥路径
}): Promise<SecretResponse> {
  return client.post(appendQuery(`/secret/api/v1/admin/secrets/update`, params), data);
}

/** 列出密钥版本 */
export function getAdminSecretsVersions(client: ApiClient, params?: {
  key: string;  // 密钥路径
}): Promise<SecretVersionResponse[]> {
  return client.get(`/secret/api/v1/admin/secrets/versions`, { params });
}

/** 获取版本密钥值 */
export function postAdminSecretsVersionsValue(client: ApiClient, data: SecretVersionQuery, params?: {
  key: string;  // 密钥路径
}): Promise<SecretValueResponse> {
  return client.post(appendQuery(`/secret/api/v1/admin/secrets/versions/value`, params), data);
}

/** 获取 JWT 验证公钥 */
export function getSecretPublicJwtPublicKey(client: ApiClient): Promise<JWTPublicKeyResponse> {
  return client.get(`/secret/api/v1/secret/public/jwt/public-key`);
}

/** 获取密码传输公钥 */
export function getSecretPublicTransmissionPublicKey(client: ApiClient): Promise<JWTPublicKeyResponse> {
  return client.get(`/secret/api/v1/secret/public/transmission/public-key`);
}

