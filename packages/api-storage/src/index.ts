/**
 * @autional/api-storage — Auto-generated from storage-service internal/docs/docs.go
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

/** 批量删除文件请求参数 */
export interface BatchDeleteRequest {
  fileIds: string[];  // 文件ID列表
  force?: boolean;  // 强制删除
}

export interface BatchDeleteResultResponse {
  deletedCount?: number;
  ids?: string[];
}

/** 批量下载文件请求参数 */
export interface BatchDownloadRequest {
  fileIds: string[];  // 文件ID列表
}

export interface BatchMoveResultResponse {
  ids?: string[];
  movedCount?: number;
  targetId?: string;
}

export interface BucketResponse {
  createdAt?: string;
  description?: string;
  id?: string;
  isDefault?: boolean;
  name?: string;
  physicalName?: string;
  visibility?: string;
}

export interface BulkUploadFileInfo {
  contentType: string;
  filename: string;
  size: number;
}

export interface BulkUploadPrepareRequest {
  files: BulkUploadFileInfo[];
}

export interface BulkUploadURLsResponse {
  count?: number;
  uploadUrls?: UploadURLInfo[];
}

export interface CopyFileTargetRequest {
  newName?: string;
  targetFolderId?: string;
}

export interface CreateBucketRequest {
  description?: string;
  name: string;
  visibility?: string;
}

export interface CreateFolderRequest {
  name: string;
  parentId?: string;
}

export interface CreateShareRequest {
  expiresIn?: string;
  maxAccess?: number;
  password?: string;
}

export interface CreateUploadURLRequest {
  contentType: string;
  expiresIn?: number;
  filename: string;
  parentId?: string;
  visibility?: string;
}

export interface CreateUploadURLResponse {
  expiresIn?: number;
  fields?: Record<string, string>;
  fileId?: string;
  key?: string;
  uploadUrl?: string;
}

/** 数据保留策略配置请求参数 */
export interface DataRetentionPolicyRequest {
  archiveBeforeDelete?: boolean;  // 删除前归档?
  autoDelete?: boolean;  // 自动删除
  retentionDays: number;  // 保留天数
}

/** 数据保留策略配置结果 */
export interface DataRetentionPolicyResponse {
  archiveBeforeDelete?: boolean;  // 删除前归档?
  autoDelete?: boolean;  // 自动删除
  effectiveAt?: string;  // 生效时间
  retentionDays?: number;  // 保留天数
  tenantId?: string;  // 租户ID
}

/** 存储服务加密配置与状态 */
export interface EncryptionStatusResponse {
  algorithm?: string;  // 算法
  encryptionAtRest?: boolean;  // 静态加密
  encryptionInTransit?: boolean;  // 传输加密
  keyRotationDate?: string;  // 轮换日期
  tenantId?: string;  // 租户ID
}

export interface ExportUserDataRequest {
  format?: string;
  userId: string;
}

export interface FileCopyResultResponse {
  copiedFile?: FileMetadataResponse;
  originalFile?: FileMetadataResponse;
}

/** 文件详细元数据信息，包含MinIO存储信息 */
export interface FileMetadataExtendedResponse {
  accessUrl?: string;
  bucket?: string;
  checksum?: string;
  contentType?: string;
  createdAt?: string;
  filename?: string;
  id?: string;
  isPublic?: boolean;
  key?: string;
  metadata?: string;
  minioInfo?: MinioInfoResponse;
  modifiedAt?: string;
  originalName?: string;
  ownerId?: string;
  path?: string;
  provider?: string;
  size?: number;
  tenantId?: string;
}

/** 文件元数据信息 */
export interface FileMetadataResponse {
  bucket?: string;  // 存储桶
  createdAt?: string;  // 创建时间
  etag?: string;  // ETag
  fileId?: string;  // 文件ID
  isDirectory?: boolean;  // 是否为文件夹
  isPublic?: boolean;  // 可见性?
  mimeType?: string;  // MIME类型
  name?: string;  // 文件名称
  objectName?: string;  // 对象名称?
  originalName?: string;  // 原始名称
  ownerId?: string;  // 所有ID
  parentId?: string;  // 父文件夹
  size?: number;  // 文件大小
  storageClass?: string;  // 存储类别
  tenantId?: string;  // 租户ID
  updatedAt?: string;  // 更新时间
}

export interface FilePreviewData {
  fileId?: string;
  mimeType?: string;
  name?: string;
  presignedUrl?: string;
  preview?: string;
  size?: number;
  suggestion?: string;
}

/** 文件分享链接信息 */
export interface FileShareResponse {
  expiresAt?: string;  // 过期时间
  shareUrl?: string;  // 分享URL
  token?: string;  // Token
}

/** 文件版本记录 */
export interface FileVersionItem {
  createdAt?: string;  // 创建时间
  createdBy?: string;  // 创建者
  etag?: string;  // ETag
  fileId?: string;  // 文件ID
  isCurrent?: boolean;  // 当前版本
  size?: number;  // 版本大小
  versionId?: string;  // 版本ID
}

/** 文件版本历史列表 */
export interface FileVersionResponse {
  currentVersion?: string;  // 当前版本
  fileId?: string;  // 文件ID
  versions?: FileVersionItem[];  // 版本列表
}

export interface FolderContentsResultResponse {
  contents?: FileMetadataResponse[];
  folder?: FolderMetadataResponse;
}

/** 文件夹元数据信息 */
export interface FolderMetadataResponse {
  createdAt?: string;  // 创建时间
  fileCount?: number;  // 文件数
  folderId?: string;  // 文件夹ID
  isPublic?: boolean;  // 是否公开
  name?: string;  // 文件夹名称?
  ownerId?: string;  // 所有ID
  parentId?: string;  // 父文件夹
  subfolderCount?: number;  // 子文件夹数?
  tenantId?: string;  // 租户ID
  updatedAt?: string;  // 更新时间
}

export interface InitMultipartUploadRequest {
  contentType: string;
  fileName: string;
  folderId?: string;
  partCount: number;
  totalSize: number;
  visibility?: string;
}

export interface InternalBatchDeleteRequest {
  ids: string[];
  userId: string;
}

export interface MimeTypeStat {
  count?: number;
  mimeType?: string;
  size?: number;
}

/** MinIO存储对象统计信息 */
export interface MinioInfoResponse {
  contentType?: string;
  etag?: string;
  lastModified?: string;
  size?: number;
}

/** 移动文件请求参数 */
export interface MoveFileRequest {
  targetFolderId: string;  // 目标文件夹?
  targetOwnerId?: string;  // 目标所有?
}

export interface MultipartInitData {
  expiresIn?: number;
  fileId?: string;
  parts?: MultipartPartInfo[];
  uploadId?: string;
}

export interface MultipartPartInfo {
  partNumber?: number;
  partPath?: string;
  partSize?: number;
  uploadUrl?: string;
}

/** 预签名URL信息 */
export interface PresignedURLResponse {
  expiresIn?: number;  // 有效期?
  url?: string;  // 访问URL
}

export interface PublicEncryptionStatus {
  algorithm?: string;
  encryptionAtRest?: boolean;
  encryptionInTransit?: boolean;
  keyManagement?: string;
}

export interface PublicReport {
  accessLevel?: string;
  contentType?: string;
  createdAt?: string;
  description?: string;
  filename?: string;
  id?: string;
  size?: number;
  title?: string;
}

/** 文件分享详细信息 */
export interface ShareDetailResponse {
  accessCount?: number;  // 访问次数
  createdAt?: string;  // 创建时间
  expiresAt?: string;  // 过期时间
  fileId?: string;  // 文件ID
  fileName?: string;  // 文件名称
  id?: string;  // 分享ID
  maxAccess?: number;  // 最大访问
  token?: string;  // Token
}

/** 分享列表项信息 */
export interface ShareResponse {
  createdAt?: string;  // 创建时间
  expiresAt?: string;  // 过期时间
  fileId?: string;  // 文件ID
  fileName?: string;  // 文件名称
  id?: string;  // 分享ID
}

/** 存储配额信息 */
export interface StorageQuotaResponse {
  availableBytes?: number;  // 可用
  bucketQuotas?: Record<string, number>;  // 桶配额?
  quotaBytes?: number;  // 配额
  tenantId?: string;  // 租户ID
  usagePercent?: number;  // 使用百分比
  usedBytes?: number;  // 已用
}

/** 存储使用统计 */
export interface StorageStatsResponse {
  mimeTypes?: MimeTypeStat[];  // 按类型统计?
  totalFiles?: number;  // 总文件数
  totalSize?: number;  // 总大小?
}

export interface StorageTrendItem {
  date?: string;
  usedBytes?: number;
}

export interface StorageTrendsResponse {
  data?: StorageTrendItem[];
  period?: string;
  updated?: string;
}

export interface TenantUsageResponse {
  fileCount?: number;
  tenantId?: string;
  usedBytes?: number;
}

export interface UpdateBucketRequest {
  description?: string;
  isDefault?: boolean;
  visibility?: string;
}

export interface UpdateFileNameRequest {
  metadata?: Record<string, unknown>;
  name?: string;
}

/** 更新文件可见性请求参数 */
export interface UpdateFileVisibilityRequest {
  visibility: "private" | "public";  // 可见性?
}

export interface UpdateFolderNameRequest {
  name: string;
}

/** 更新存储配额请求参数 */
export interface UpdateStorageQuotaRequest {
  quotaBytes: number;  // 新配额?
}

/** 文件上传结果 */
export interface UploadFileResponse {
  createdAt?: string;  // 上传时间
  fileId?: string;  // 文件ID
  fileName?: string;  // 文件数
  size?: number;  // 文件大小
  thumbnailUrl?: string;  // 缩略图?
  url?: string;  // 访问URL
}

export interface UploadURLInfo {
  fields?: Record<string, string>;
  fileId?: string;
  uploadUrl?: string;
}

export interface WatermarkRequest {
  fontSize?: number;
  opacity?: number;
  position?: string;
  text: string;
}


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

/** 管理员获取存储桶列表 */
export function getAdminStorageBuckets(client: ApiClient, params?: {
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<BucketResponse>> {
  return client.get(`/storage/api/v1/admin/storage/buckets`, { params });
}

/** 管理员创建存储桶 */
export function postAdminStorageBuckets(client: ApiClient, data: CreateBucketRequest): Promise<BucketResponse> {
  return client.post(`/storage/api/v1/admin/storage/buckets`, data);
}

/** 管理员删除存储桶 */
export function deleteAdminStorageBucketsByBuckets(client: ApiClient, name: string): Promise<void> {
  return client.delete(`/storage/api/v1/admin/storage/buckets/${name}`);
}

/** 管理员获取存储桶详情 */
export function getAdminStorageBucketsByBuckets(client: ApiClient, name: string): Promise<BucketResponse> {
  return client.get(`/storage/api/v1/admin/storage/buckets/${name}`);
}

/** 管理员更新存储桶 */
export function putAdminStorageBucketsByBuckets(client: ApiClient, name: string, data: UpdateBucketRequest): Promise<BucketResponse> {
  return client.put(`/storage/api/v1/admin/storage/buckets/${name}`, data);
}

/** 管理员清理过期pending上传 */
export function postAdminStorageCleanStaleUploads(client: ApiClient, params?: {
  older_than_hours?: number;  // 过期小时数（默认24小时，最小1小时）
}): Promise<SimpleResponse> {
  return client.post(appendQuery(`/storage/api/v1/admin/storage/clean-stale-uploads`, params));
}

/** 管理员获取数据保留策略 */
export function getAdminStorageDataRetentionPolicy(client: ApiClient): Promise<DataRetentionPolicyResponse> {
  return client.get(`/storage/api/v1/admin/storage/data-retention-policy`);
}

/** 管理员配置数据保留策略 */
export function postAdminStorageDataRetentionPolicy(client: ApiClient, data: DataRetentionPolicyRequest): Promise<DataRetentionPolicyResponse> {
  return client.post(`/storage/api/v1/admin/storage/data-retention-policy`, data);
}

/** 管理员查询存储加密状态 */
export function getAdminStorageEncryptionStatus(client: ApiClient): Promise<EncryptionStatusResponse> {
  return client.get(`/storage/api/v1/admin/storage/encryption-status`);
}

/** 获取文件列表（管理端） */
export function getAdminStorageFiles(client: ApiClient, params?: {
  parent_id?: string;  // 父文件夹ID，不填则查询根目录文件
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20，最大100）
  keyword?: string;  // 文件名关键词搜索
}): Promise<ApiListResult<FileMetadataResponse>> {
  return client.get(`/storage/api/v1/admin/storage/files`, { params });
}

/** 删除文件（管理端） */
export function deleteAdminStorageFilesByFiles(client: ApiClient, fileId: string): Promise<void> {
  return client.delete(`/storage/api/v1/admin/storage/files/${fileId}`);
}

/** 下载文件（管理端） */
export function getAdminStorageFilesDownloadByFiles(client: ApiClient, fileId: string): Promise<void> {
  return client.get(`/storage/api/v1/admin/storage/files/${fileId}/download`);
}

/** 创建文件夹（管理端） */
export function postAdminStorageFolders(client: ApiClient, data: CreateFolderRequest): Promise<FolderMetadataResponse> {
  return client.post(`/storage/api/v1/admin/storage/folders`, data);
}

/** 管理员获取存储配额 */
export function getAdminStorageQuota(client: ApiClient): Promise<StorageQuotaResponse> {
  return client.get(`/storage/api/v1/admin/storage/quota`);
}

/** 管理员更新存储配额 */
export function putAdminStorageQuota(client: ApiClient, data: UpdateStorageQuotaRequest): Promise<StorageQuotaResponse> {
  return client.put(`/storage/api/v1/admin/storage/quota`, data);
}

/** 管理员存储统计 */
export function getAdminStorageStats(client: ApiClient): Promise<StorageStatsResponse> {
  return client.get(`/storage/api/v1/admin/storage/stats`);
}

/** 获取回收站列表（管理端） */
export function getAdminStorageTrash(client: ApiClient, params?: {
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<FileMetadataResponse>> {
  return client.get(`/storage/api/v1/admin/storage/trash`, { params });
}

/** 从回收站永久删除（管理端） */
export function deleteAdminStorageTrashByTrash(client: ApiClient, trashId: string): Promise<void> {
  return client.delete(`/storage/api/v1/admin/storage/trash/${trashId}`);
}

/** 从回收站恢复文件（管理端） */
export function postAdminStorageTrashRestoreByTrash(client: ApiClient, trashId: string): Promise<SimpleResponse> {
  return client.post(`/storage/api/v1/admin/storage/trash/${trashId}/restore`);
}

/** 获取文件列表 */
export function getFiles(client: ApiClient, params?: {
  parent_id?: string;  // 父文件夹ID，不填则查询根目录文件
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20，最大100）
  keyword?: string;  // 文件名关键词搜索
  include_directories?: boolean;  // 是否包含子文件夹（默认false仅文件）
}): Promise<ApiListResult<FileMetadataResponse>> {
  return client.get(`/storage/api/v1/files`, { params });
}

/** 批量下载（ZIP打包） */
export function postFilesBatchDownload(client: ApiClient, data: BatchDownloadRequest): Promise<void> {
  return client.post(`/storage/api/v1/files/batch-download`, data);
}

/** 批量删除（旧版兼容） */
export function postFilesBulkDeletions(client: ApiClient, data: BatchDeleteRequest): Promise<BatchDeleteResultResponse> {
  return client.post(`/storage/api/v1/files/bulk-deletions`, data);
}

/** 批量上传准备 */
export function postFilesBulkUploads(client: ApiClient, data: BulkUploadPrepareRequest): Promise<BulkUploadURLsResponse> {
  return client.post(`/storage/api/v1/files/bulk-uploads`, data);
}

/** 初始化分片上传 */
export function postFilesMultipartInit(client: ApiClient, data: InitMultipartUploadRequest): Promise<MultipartInitData> {
  return client.post(`/storage/api/v1/files/multipart/init`, data);
}

/** 中止分片上传 */
export function deleteFilesMultipartByMultipart(client: ApiClient, fileId: string): Promise<void> {
  return client.delete(`/storage/api/v1/files/multipart/${fileId}`);
}

/** 完成分片上传 */
export function postFilesMultipartCompleteByMultipart(client: ApiClient, fileId: string): Promise<FileMetadataResponse> {
  return client.post(`/storage/api/v1/files/multipart/${fileId}/complete`);
}

/** 通过分享链接下载 */
export function getFilesSharedByShared(client: ApiClient, token: string): Promise<void> {
  return client.get(`/storage/api/v1/files/shared/${token}`);
}

/** 获取上传预签名URL */
export function postFilesUploadUrl(client: ApiClient, data: CreateUploadURLRequest): Promise<CreateUploadURLResponse> {
  return client.post(`/storage/api/v1/files/upload-url`, data);
}

/** 删除文件 */
export function deleteFilesByFiles(client: ApiClient, fileId: string): Promise<void> {
  return client.delete(`/storage/api/v1/files/${fileId}`);
}

/** 更新文件 */
export function patchFilesByFiles(client: ApiClient, fileId: string, data: UpdateFileNameRequest): Promise<FileMetadataResponse> {
  return client.patch(`/storage/api/v1/files/${fileId}`, data);
}

/** 复制文件 */
export function postFilesCopyByFiles(client: ApiClient, fileId: string, data: CopyFileTargetRequest): Promise<FileCopyResultResponse> {
  return client.post(`/storage/api/v1/files/${fileId}/copy`, data);
}

/** 下载文件 */
export function getFilesDownloadByFiles(client: ApiClient, fileId: string): Promise<void> {
  return client.get(`/storage/api/v1/files/${fileId}/download`);
}

/** 获取文件元数据 */
export function getFilesMetadataByFiles(client: ApiClient, fileId: string): Promise<FileMetadataExtendedResponse> {
  return client.get(`/storage/api/v1/files/${fileId}/metadata`);
}

/** 移动文件 */
export function postFilesMoveByFiles(client: ApiClient, fileId: string, data: MoveFileRequest): Promise<FileMetadataResponse> {
  return client.post(`/storage/api/v1/files/${fileId}/move`, data);
}

/** 生成预签名URL */
export function getFilesPresignedUrlByFiles(client: ApiClient, fileId: string, params?: {
  expires?: number;  // 过期秒数（默认300秒，最大900秒）
}): Promise<PresignedURLResponse> {
  return client.get(`/storage/api/v1/files/${fileId}/presigned-url`, { params });
}

/** 文件预览 */
export function getFilesPreviewByFiles(client: ApiClient, fileId: string, params?: {
  width?: number;  // 缩略图宽度（默认200，最大1200）
  height?: number;  // 缩略图高度（默认200，最大1200）
}): Promise<FilePreviewData> {
  return client.get(`/storage/api/v1/files/${fileId}/preview`, { params });
}

/** 取消分享链接 */
export function deleteFilesShareByFiles(client: ApiClient, fileId: string, params?: {
  token: string;  // 分享Token
}): Promise<void> {
  return client.delete(`/storage/api/v1/files/${fileId}/share`, params);
}

/** 查看分享详情 */
export function getFilesShareByFiles(client: ApiClient, fileId: string): Promise<ShareDetailResponse> {
  return client.get(`/storage/api/v1/files/${fileId}/share`);
}

/** 创建分享链接 */
export function postFilesShareByFiles(client: ApiClient, fileId: string, data: CreateShareRequest): Promise<FileShareResponse> {
  return client.post(`/storage/api/v1/files/${fileId}/share`, data);
}

/** 生成缩略图 */
export function getFilesThumbnailByFiles(client: ApiClient, fileId: string, params?: {
  width?: number;  // 缩略图宽度（默认200，单位像素）
  height?: number;  // 缩略图高度（默认200，单位像素）
  quality?: number;  // JPEG质量（默认80，范围1-100）
  format?: string;  // 输出格式：jpeg / png（默认jpeg）
}): Promise<void> {
  return client.get(`/storage/api/v1/files/${fileId}/thumbnail`, { params });
}

/** 上传完成确认 */
export function postFilesUploadCompleteByFiles(client: ApiClient, fileId: string): Promise<SimpleResponse> {
  return client.post(`/storage/api/v1/files/${fileId}/upload-complete`);
}

/** 获取文件版本列表 */
export function getFilesVersionsByFiles(client: ApiClient, fileId: string): Promise<FileVersionResponse> {
  return client.get(`/storage/api/v1/files/${fileId}/versions`);
}

/** 恢复文件版本 */
export function postFilesVersionsRestoreByFilesByVersions(client: ApiClient, fileId: string, versionId: string): Promise<FileMetadataResponse> {
  return client.post(`/storage/api/v1/files/${fileId}/versions/${versionId}/restore`);
}

/** 更新文件可见性 */
export function patchFilesVisibilityByFiles(client: ApiClient, fileId: string, data: UpdateFileVisibilityRequest): Promise<FileMetadataResponse> {
  return client.patch(`/storage/api/v1/files/${fileId}/visibility`, data);
}

/** 添加水印 */
export function postFilesWatermarkByFiles(client: ApiClient, fileId: string, data: WatermarkRequest): Promise<FileMetadataResponse> {
  return client.post(`/storage/api/v1/files/${fileId}/watermark`, data);
}

/** 创建文件夹 */
export function postFolders(client: ApiClient, data: CreateFolderRequest): Promise<FolderMetadataResponse> {
  return client.post(`/storage/api/v1/folders`, data);
}

/** 获取文件夹内容 */
export function getFoldersContentsByFolders(client: ApiClient, folderId: string): Promise<FileMetadataResponse[]> {
  return client.get(`/storage/api/v1/folders/${folderId}/contents`);
}

/** 列出分享 */
export function getShares(client: ApiClient, params?: {
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<ShareResponse>> {
  return client.get(`/storage/api/v1/shares`, { params });
}

/** 批量删除文件/文件夹 */
export function postStorageBatchDelete(client: ApiClient, data: BatchDeleteRequest): Promise<BatchDeleteResultResponse> {
  return client.post(`/storage/api/v1/storage/batch-delete`, data);
}

/** 批量移动文件/文件夹 */
export function postStorageBatchMove(client: ApiClient, data: Record<string, unknown>): Promise<BatchMoveResultResponse> {
  return client.post(`/storage/api/v1/storage/batch-move`, data);
}

/** Storage API 创建文件夹 */
export function postStorageFolders(client: ApiClient, data: CreateFolderRequest): Promise<FolderMetadataResponse> {
  return client.post(`/storage/api/v1/storage/folders`, data);
}

/** 删除文件夹 */
export function deleteStorageFoldersByFolders(client: ApiClient, folderId: string): Promise<SimpleResponse> {
  return client.delete(`/storage/api/v1/storage/folders/${folderId}`);
}

/** 获取文件夹内容 */
export function getStorageFoldersByFolders(client: ApiClient, folderId: string): Promise<FolderContentsResultResponse> {
  return client.get(`/storage/api/v1/storage/folders/${folderId}`);
}

/** 更新文件夹 */
export function patchStorageFoldersByFolders(client: ApiClient, folderId: string, data: UpdateFolderNameRequest): Promise<FolderMetadataResponse> {
  return client.patch(`/storage/api/v1/storage/folders/${folderId}`, data);
}

/** 公开：获取存储加密状态 */
export function getStoragePublicEncryptionStatus(client: ApiClient): Promise<PublicEncryptionStatus> {
  return client.get(`/storage/api/v1/storage/public/encryption-status`);
}

/** 公开：读取公开文件内容 */
export function getStoragePublicFilesContentByFiles(client: ApiClient, fileId: string): Promise<void> {
  return client.get(`/storage/api/v1/storage/public/files/${fileId}/content`);
}

/** 公开：获取合规报告列表 */
export function getStoragePublicReports(client: ApiClient, params?: {
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<PublicReport>> {
  return client.get(`/storage/api/v1/storage/public/reports`, { params });
}

/** 公开：下载合规报告 */
export function getStoragePublicReportsDownloadByReports(client: ApiClient, reportId: string): Promise<void> {
  return client.get(`/storage/api/v1/storage/public/reports/${reportId}/download`);
}

/** 获取存储配额 */
export function getStorageQuota(client: ApiClient): Promise<StorageQuotaResponse> {
  return client.get(`/storage/api/v1/storage/quota`);
}

/** 清空回收站 */
export function deleteStorageTrash(client: ApiClient): Promise<BatchDeleteResultResponse> {
  return client.delete(`/storage/api/v1/storage/trash`);
}

/** 获取回收站列表 */
export function getStorageTrash(client: ApiClient, params?: {
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<FileMetadataResponse>> {
  return client.get(`/storage/api/v1/storage/trash`, { params });
}

/** 从回收站永久删除 */
export function deleteStorageTrashByTrash(client: ApiClient, trashId: string): Promise<void> {
  return client.delete(`/storage/api/v1/storage/trash/${trashId}`);
}

/** 从回收站恢复文件 */
export function postStorageTrashRestoreByTrash(client: ApiClient, trashId: string): Promise<SimpleResponse> {
  return client.post(`/storage/api/v1/storage/trash/${trashId}/restore`);
}

/** 存储使用趋势 */
export function getStorageTrends(client: ApiClient, params?: {
  period?: string;  // 趋势周期：day(按日，默认)/week(按周)
}): Promise<StorageTrendsResponse> {
  return client.get(`/storage/api/v1/storage/trends`, { params });
}

