// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-storage — auto-generated */
import type { ApiClient } from '@authms/core';

export function adminStorageBuckets(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/admin/storage/buckets`, { params });
}

export function adminStorageBucketsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/admin/storage/buckets`, data);
}

export function adminStorageBucketsByBucketsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/storage/api/v1/admin/storage/buckets/${name}`);
}

export function adminStorageBucketsByBuckets(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/admin/storage/buckets/${name}`);
}

export function adminStorageBucketsByBucketsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/storage/api/v1/admin/storage/buckets/${name}`, data);
}

export function adminStorageCleanStaleUploadsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/admin/storage/clean-stale-uploads`, undefined, { params });
}

export function adminStorageDataRetentionPolicy(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/admin/storage/data-retention-policy`);
}

export function adminStorageDataRetentionPolicyPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/admin/storage/data-retention-policy`, data);
}

export function adminStorageEncryptionStatus(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/admin/storage/encryption-status`);
}

export function adminStorageQuota(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/admin/storage/quota`);
}

export function adminStorageQuotaPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/storage/api/v1/admin/storage/quota`, data);
}

export function adminStorageStats(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/admin/storage/stats`);
}

export function files(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/files`, { params });
}

export function filesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/files`);
}

export function filesBatchDownloadPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/files/batch-download`, data);
}

export function filesBulkDeletionsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/files/bulk-deletions`, data);
}

export function filesBulkUploadsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/files/bulk-uploads`, data);
}

export function filesMultipartInitPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/files/multipart/init`, data);
}

export function filesMultipartByMultipartDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/storage/api/v1/files/multipart/${fileId}`);
}

export function filesMultipartCompleteByMultipartPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/files/multipart/${fileId}/complete`);
}

export function filesSharedByShared(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/files/shared/${token}`);
}

export function filesUploadUrlPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/files/upload-url`, data);
}

export function filesByFilesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/storage/api/v1/files/${fileId}`);
}

export function filesByFilesPatch(client: ApiClient, data?: Record<string, unknown>) {
  return client.patch(`/storage/api/v1/files/${fileId}`, data);
}

export function filesCopyByFilesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/files/${fileId}/copy`, data);
}

export function filesDownloadByFiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/files/${fileId}/download`);
}

export function filesMetadataByFiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/files/${fileId}/metadata`);
}

export function filesMoveByFilesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/files/${fileId}/move`, data);
}

export function filesPresignedUrlByFiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/files/${fileId}/presigned-url`, { params });
}

export function filesPreviewByFiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/files/${fileId}/preview`, { params });
}

export function filesShareByFilesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/storage/api/v1/files/${fileId}/share`, { params });
}

export function filesShareByFiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/files/${fileId}/share`);
}

export function filesShareByFilesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/files/${fileId}/share`, data);
}

export function filesThumbnailByFiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/files/${fileId}/thumbnail`, { params });
}

export function filesUploadCompleteByFilesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/files/${fileId}/upload-complete`);
}

export function filesVersionsByFiles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/files/${fileId}/versions`);
}

export function filesVersionsRestoreByFilesByVersionsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/files/${fileId}/versions/${versionId}/restore`);
}

export function filesVisibilityByFilesPatch(client: ApiClient, data?: Record<string, unknown>) {
  return client.patch(`/storage/api/v1/files/${fileId}/visibility`, data);
}

export function filesWatermarkByFilesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/files/${fileId}/watermark`, data);
}

export function foldersPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/folders`, data);
}

export function foldersContentsByFolders(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/folders/${folderId}/contents`);
}

export function shares(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/shares`, { params });
}

export function storageBatchDeletePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/storage/batch-delete`, data);
}

export function storageBatchMovePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/storage/batch-move`, data);
}

export function storageFoldersPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/storage/folders`, data);
}

export function storageFoldersByFoldersDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/storage/api/v1/storage/folders/${folderId}`);
}

export function storageFoldersByFolders(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/storage/folders/${folderId}`);
}

export function storageFoldersByFoldersPatch(client: ApiClient, data?: Record<string, unknown>) {
  return client.patch(`/storage/api/v1/storage/folders/${folderId}`, data);
}

export function storagePublicEncryptionStatus(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/storage/public/encryption-status`);
}

export function storagePublicReports(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/storage/public/reports`, { params });
}

export function storagePublicReportsDownloadByReports(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/storage/public/reports/${fileId}/download`);
}

export function storageQuota(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/storage/quota`);
}

export function storageTrashDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/storage/api/v1/storage/trash`);
}

export function storageTrash(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/storage/trash`, { params });
}

export function storageTrashByTrashDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/storage/api/v1/storage/trash/${trashId}`);
}

export function storageTrashRestoreByTrashPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/storage/api/v1/storage/trash/${trashId}/restore`);
}

export function storageTrends(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/storage/api/v1/storage/trends`, { params });
}

