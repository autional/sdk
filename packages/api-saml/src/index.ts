/**
 * @autional/api-saml — Auto-generated from saml-service internal/docs/docs.go
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

export interface EraseUserSamlLinksRequest {
  tenantId: string;
  userId: string;
}

export interface SAMLSLOResponse {
  logoutCount?: number;
  message?: string;
  nameId?: string;
  status?: string;
}

export interface SAMLTokenResponse {
  accessToken?: string;
  expiresIn?: number;
  relayState?: string;
  tokenType?: string;
}

export interface SamlLinkedAccountItem {
  email?: string;
  id?: string;
  linkedAt?: string;
  nameId?: string;
  providerId?: string;
  providerName?: string;
}

export interface SamlLinkedAccountsResponse {
  items?: SamlLinkedAccountItem[];
}

export interface SamlProviderItem {
  allowIdpInitiated?: boolean;
  certificateExpiry?: string;
  createdAt?: string;
  defaultRedirectUri?: string;
  enabled?: boolean;
  entityId?: string;
  forceAuthn?: boolean;
  hasBackupCert?: boolean;
  id?: string;
  name?: string;
  nameIdFormat?: string;
  sloUrl?: string;
  ssoUrl?: string;
  tenantId?: string;
  updatedAt?: string;
  wantAuthnSigned?: boolean;
}

export interface SamlProviderListData {
  providers?: SamlProviderItem[];
}

export interface SamlProviderRequest {
  allowIdpInitiated?: boolean;
  certificate: string;
  certificateBackup?: string;
  defaultRedirectUri?: string;
  enabled?: boolean;
  entityId: string;
  forceAuthn?: boolean;
  name: string;
  nameIdFormat?: string;
  shouldClearBackup?: boolean;
  sloUrl?: string;
  ssoUrl: string;
  wantAuthnSigned?: boolean;
}

export interface SamlSessionItem {
  createdAt?: string;
  expiresAt?: string;
  id?: string;
  nameId?: string;
  providerId?: string;
  sessionIndex?: string;
  tenantId?: string;
  userId?: string;
}

export interface SamlUserLinkItem {
  createdAt?: string;
  email?: string;
  id?: string;
  nameId?: string;
  providerId?: string;
  tenantId?: string;
  updatedAt?: string;
  userId?: string;
}

export interface UpdateAttributeMappingRequest {
  mappings: Record<string, string>;
}


// ====== API Functions (tree-shakeable: independent exports) ======

/** 列出SAML IdP */
export function getAdminSamlProviders(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<SamlProviderListData> {
  return client.get(`/saml/api/v1/admin/saml/providers`, { params });
}

/** 注册SAML IdP */
export function postAdminSamlProviders(client: ApiClient, data: SamlProviderRequest): Promise<SamlProviderItem> {
  return client.post(`/saml/api/v1/admin/saml/providers`, data);
}

/** 删除SAML IdP */
export function deleteAdminSamlProvidersByProviders(client: ApiClient, providerId: string): Promise<SimpleResponse> {
  return client.delete(`/saml/api/v1/admin/saml/providers/${providerId}`);
}

/** 获取SAML IdP详情 */
export function getAdminSamlProvidersByProviders(client: ApiClient, providerId: string): Promise<SamlProviderItem> {
  return client.get(`/saml/api/v1/admin/saml/providers/${providerId}`);
}

/** 更新SAML IdP */
export function putAdminSamlProvidersByProviders(client: ApiClient, providerId: string, data: SamlProviderRequest): Promise<SamlProviderItem> {
  return client.put(`/saml/api/v1/admin/saml/providers/${providerId}`, data);
}

/** 更新属性映射 */
export function putAdminSamlProvidersAttributeMappingByProviders(client: ApiClient, providerId: string, data: UpdateAttributeMappingRequest): Promise<SimpleResponse> {
  return client.put(`/saml/api/v1/admin/saml/providers/${providerId}/attribute-mapping`, data);
}

/** 查询SAML会话列表（管理端） */
export function getAdminSamlSessions(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
  sort_by?: string;  // 排序字段
  sort_order?: string;  // 排序方向 (asc/desc)
}): Promise<ApiListResult<SamlSessionItem>> {
  return client.get(`/saml/api/v1/admin/saml/sessions`, { params });
}

/** 查询用户SAML绑定列表（管理端） */
export function getAdminSamlUserLinks(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页数量
  sort_by?: string;  // 排序字段
  sort_order?: string;  // 排序方向 (asc/desc)
}): Promise<ApiListResult<SamlUserLinkItem>> {
  return client.get(`/saml/api/v1/admin/saml/user-links`, { params });
}

/** 删除用户SAML绑定（管理端） */
export function deleteAdminSamlUserLinksByUserLinks(client: ApiClient, userLinkId: string): Promise<SimpleResponse> {
  return client.delete(`/saml/api/v1/admin/saml/user-links/${userLinkId}`);
}

/** SP-initiated SSO */
export function getSamlLoginBySaml(client: ApiClient, providerId: string): Promise<void> {
  return client.get(`/saml/api/v1/saml/${providerId}/login`);
}

/** 获取SP元数据 */
export function getSamlMetadataBySaml(client: ApiClient, providerId: string): Promise<string> {
  return client.get(`/saml/api/v1/saml/${providerId}/metadata`);
}

/** 单点登出 */
export function getSamlSloBySaml(client: ApiClient, providerId: string): Promise<SAMLSLOResponse> {
  return client.get(`/saml/api/v1/saml/${providerId}/slo`);
}

/** SP发起的SAML单点登出 */
export function getSamlSloSpBySaml(client: ApiClient, providerId: string, params?: {
  user_id: string;  // User ID
  session_index?: string;  // Session Index
}): Promise<void> {
  return client.get(`/saml/api/v1/saml/${providerId}/slo/sp`, { params });
}

