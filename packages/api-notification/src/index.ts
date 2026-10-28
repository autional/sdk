/**
 * @autional/api-notification — Auto-generated from notification-service swagger.json
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

/** 公告信息响应 */
export interface AnnouncementResponse {
  content?: string;
  createdAt?: string;
  dismissals?: number;
  expireAt?: string;
  id?: string;
  publishAt?: string;
  status?: string;
  targetRoles?: string[];
  tenantId?: string;
  title?: string;
  updatedAt?: string;
  views?: number;
}

/** 公告阅读统计 */
export interface AnnouncementStatsResponse {
  dismissals?: number;
  views?: number;
}

export interface AvailableTemplateResponse {
  channel?: string;
  code?: string;
  isCustomized?: boolean;
  locale?: string;
  name?: string;
  source?: string;  // platform | tenant
  status?: string;
  title?: string;
  variables?: string[];
}

/** 批量发送通知请求参数 */
export interface BatchSendNotificationRequest {
  content: string;  // 内容
  priority?: string;  // 优先级
  title: string;  // 标题
  Type?: string;  // 类型
  userIds: string[];  // 用户ID列表
}

/** 批量发送通知结果 */
export interface BatchSendNotificationResponse {
  notificationIds?: string[];  // 通知ID列表
  sentCount?: number;  // 发送数量
}

/** 全租户广播通知的请求参数 */
export interface BroadcastNotificationRequest {
  content: string;  // 内容
  title: string;  // 标题
  Type?: string;  // 类型
}

/** 广播通知的响应结果 */
export interface BroadcastNotificationResponse {
  broadcastId?: string;  // 广播ID
  content?: string;  // 内容
  recipients?: number;  // 接收人数
  title?: string;  // 标题
  Type?: string;  // 类型
}

/** 单个通知渠道的偏好 */
export interface ChannelPref {
  enabled?: boolean;  // Enabled 指针：区分「未传」与「显式 false」——客户端只发 types 不带 enabled 时不得误关渠道（UP-75）。
  quietHoursEnd?: string;  // 免打扰结束
  quietHoursStart?: string;  // 免打扰开始
  types?: string[];  // 类型
}

/** 渠道偏好响应 */
export interface ChannelPrefResponse {
  enabled?: boolean;  // 启用
  quietHoursEnd?: string;  // 免打扰结束
  quietHoursStart?: string;  // 免打扰开始
  types?: string[];  // 类型
}

export interface CloneTemplateToLocaleRequest {
  content?: string;
  targetLocale: string;
  title?: string;
}

/** 创建公告的请求参数 */
export interface CreateAnnouncementRequest {
  content: string;
  expireAt?: string;
  publishAt?: string;
  targetRoles?: string[];
  title: string;
}

export interface CreateEventMappingRequest {
  channel?: string;
  eventType: string;
  priority?: string;
  templateCode: string;
}

export interface CreateGlobalVariableRequest {
  key: string;
  value: string;
}

/** 创建通知模板请求参数 */
export interface CreateTemplateRequest {
  code: string;
  content: string;
  format?: string;
  name: string;
  subject: string;
  Type: string;
  variables?: string[];
}

/** 删除通知请求参数 */
export interface DeleteNotificationRequest {
  notificationId: string;  // 通知ID
  userId: string;  // 用户ID
}

/** 删除通知结果 */
export interface DeleteNotificationResponse {
  deleted?: boolean;  // 删除成功
  notificationId?: string;  // 通知ID
}

export interface EraseUserNotificationsRequest {
  userId: string;
}

export interface EventMappingResponse {
  appId?: string;
  channel?: string;
  eventType?: string;
  id?: string;
  isEnabled?: boolean;
  priority?: string;
  templateCode?: string;
  tenantId?: string;
}

export interface ExportUserDataRequest {
  userId: string;
}

export interface ExportUserDataResponse {
  notifications?: NotificationResponse[];
  preferences?: NotificationPreferencesResponse;
}

export interface GlobalVariableResponse {
  appId?: string;
  id?: string;
  key?: string;
  tenantId?: string;
  value?: string;
}

export interface InternalCreateTemplateRequest {
  code?: string;
  content?: string;
  format?: string;
  locale?: string;
  name?: string;
  priority?: string;
  title?: string;
  Type?: string;
  variables?: string[];
}

export interface InternalPushSendRequest {
  body: string;
  data?: Record<string, unknown>;
  title: string;
  userId?: string;
}

export interface InternalSendExternalRequest {
  channel: string;
  locale?: string;
  recipient: string;
  templateCode: string;
  variables?: Record<string, string>;
}

export interface InternalUpsertEventMappingRequest {
  channel?: string;  // 空 → in_app
  eventType: string;
  isEnabled?: boolean;  // 空 → true
  priority?: string;  // 空 → medium
  templateCode: string;
}

/** 标记已读结果 */
export interface MarkReadResponse {
  markedCount?: number;  // 标记数量
  success?: boolean;  // 成功
}

/** 更新通知偏好设置请求参数 */
export interface NotificationPreferencesRequest {
  channels?: Record<string, ChannelPref>;  // 渠道设置
  emailEnabled?: boolean;  // 邮件启用
  pushEnabled?: boolean;  // 推送启用
  smsEnabled?: boolean;  // 短信启用
  userId: string;  // 用户ID
}

/** 用户通知偏好设置 */
export interface NotificationPreferencesResponse {
  channels?: Record<string, ChannelPrefResponse>;  // 渠道设置
  emailEnabled?: boolean;  // 邮件启用
  pushEnabled?: boolean;  // 推送启用
  quietHours?: Record<string, ChannelPrefResponse>;  // 免打扰时段
  smsEnabled?: boolean;  // 短信启用
  typePrefs?: Record<string, ChannelPrefResponse>;  // 通知类型偏好
  updatedAt?: string;  // 更新时间
  userId?: string;  // 用户ID
}

/** 通知信息响应 */
export interface NotificationResponse {
  actionUrl?: string;  // 操作链接
  content?: string;  // 内容
  createdAt?: string;  // 创建时间
  eventType?: string;
  id?: string;  // 通知ID
  isRead?: boolean;  // 是否已读
  metadata?: string;  // 元数据JSON
  priority?: string;  // 优先级
  readAt?: string;  // 阅读时间
  tenantId?: string;  // 租户ID
  title?: string;  // 标题
  Type?: string;  // 类型
  userId?: string;  // 用户ID
}

/** 通知发送与阅读统计（notification 层不追踪投递状态，仅追踪已读/未读） */
export interface NotificationStatsResponse {
  byType?: Record<string, number>;  // 按类型
  readRate?: number;  // 阅读率
  totalRead?: number;  // 总阅读
  totalSent?: number;  // 总发送
}

export interface PushSendResponse {
  failed?: number;
  sent?: number;
  total?: number;
}

export interface PushSubscriptionKeys {
  auth: string;
  p256dh: string;
}

export interface PushSubscriptionRequest {
  deviceName?: string;
  deviceType?: string;
  endpoint: string;
  keys: PushSubscriptionKeys;
  userAgent?: string;
}

export interface PushSubscriptionResponse {
  createdAt?: string;
  deviceName?: string;
  deviceType?: string;
  endpoint?: string;
  id?: string;
}

/** 通知已读/未读统计报告 */
export interface ReadReportResponse {
  readCount?: number;  // 已读
  readRate?: number;  // 阅读率
  tenantId?: string;  // 租户ID
  totalSent?: number;  // 总发送
  unreadCount?: number;  // 未读
}

export interface SecurityAdvisoryBroadcastRequest {
  content: string;
  title: string;
}

export interface SecurityAdvisoryBroadcastResponse {
  failed?: number;
  recipients?: number;
}

export interface SecuritySubscribeRequest {
  captchaProvider?: string;
  captchaToken?: string;
  company?: string;
  email: string;
  topics?: string[];
}

export interface SecuritySubscribeResponse {
  message?: string;
  status?: string;
}

export interface SecurityUnsubscribeRequest {
  email: string;
  token?: string;
}

export interface SecurityUnsubscribeResponse {
  message?: string;
  status?: string;
}

/** 使用模板发送通知请求参数 */
export interface SendFromTemplateRequest {
  templateId: string;  // 模板ID
  userId: string;  // 用户ID
  variables: Record<string, unknown>;  // 变量
}

/** 发送通知的响应结果（兼容端点） */
export interface SendNotificationCompatResponse {
  id?: string;  // 通知ID
  status?: string;  // 状态
}

/** 发送通知的请求参数 */
export interface SendNotificationRequest {
  aggregationKey?: string;  // 聚合键（同key通知聚合为一条）
  content: string;  // 内容
  metadata?: Record<string, unknown>;  // 元数据
  priority?: string;  // 优先级
  title: string;  // 标题
  Type?: string;  // 类型
  userId: string;  // 用户ID
}

/** 一次性 SSE 票据：60s 内有效、消费一次即失效；以 ?ticket= 建立 EventSource 流 */
export interface StreamTicketResponse {
  expiresIn?: number;  // 有效期（秒）
  ticket?: string;  // 一次性票据
}

/** 通知模板信息 */
export interface TemplateResponse {
  content?: string;  // 内容
  createdAt?: string;  // 创建时间
  name?: string;  // 模板名称
  subject?: string;  // 主题
  templateId?: string;  // 模板ID
  Type?: string;  // 类型
  variables?: string[];  // 变量
}

/** 发送测试通知的请求参数 */
export interface TestNotificationRequest {
  channel: string;  // 渠道
  target: string;  // 目标
}

/** 测试通知发送结果 */
export interface TestNotificationResponse {
  channel?: string;  // 渠道
  status?: string;  // 状态
  target?: string;  // 目标
  testId?: string;  // 测试ID
}

export interface TrendPoint {
  date?: string;
  read?: number;
  sent?: number;
}

/** 用户未读通知数量 */
export interface UnreadCountResponse {
  lastNotificationAt?: string;  // 最后通知
  unreadCount?: number;  // 未读数
  userId?: string;  // 用户ID
}

/** 更新公告的请求参数（仅在draft状态可编辑） */
export interface UpdateAnnouncementRequest {
  content?: string;
  expireAt?: string;
  publishAt?: string;
  targetRoles?: string[];
  title?: string;
}

export interface UpdateEventMappingRequest {
  channel?: string;
  isEnabled?: boolean;
  priority?: string;
  templateCode?: string;
}

export interface UpdateGlobalVariableRequest {
  value: string;
}

/** 更新通知模板的请求参数（所有字段可选） */
export interface UpdateTemplateRequest {
  content?: string;
  name?: string;
  status?: string;
  subject?: string;
  Type?: string;
  variables?: string[];
}

/** Web Push VAPID 公钥，前端注册 Push 订阅时使用 */
export interface VapidPublicKeyResponse {
  publicKey?: string;  // VAPID 公钥
}

export interface HealthErrorResponse {
  error?: string;
}

export type Map_string_string = Record<string, string>;


// ====== API Functions (tree-shakeable: independent exports) ======

/** 管理端列出公告 */
export function getAdminAnnouncements(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  status?: string;  // 状态过滤: draft/scheduled/published/expired
  search?: string;  // 搜索关键词
}): Promise<ApiListResult<AnnouncementResponse>> {
  return client.get(`/notification/api/v1/admin/announcements`, { params });
}

/** 创建公告 */
export function postAdminAnnouncements(client: ApiClient, data: CreateAnnouncementRequest): Promise<AnnouncementResponse> {
  return client.post(`/notification/api/v1/admin/announcements`, data);
}

/** 删除公告 */
export function deleteAdminAnnouncementsByAnnouncements(client: ApiClient, announcementId: string): Promise<SimpleResponse> {
  return client.delete(`/notification/api/v1/admin/announcements/${announcementId}`);
}

/** 更新公告 */
export function putAdminAnnouncementsByAnnouncements(client: ApiClient, announcementId: string, data: UpdateAnnouncementRequest): Promise<AnnouncementResponse> {
  return client.put(`/notification/api/v1/admin/announcements/${announcementId}`, data);
}

/** 发布公告 */
export function postAdminAnnouncementsPublishByAnnouncements(client: ApiClient, announcementId: string): Promise<AnnouncementResponse> {
  return client.post(`/notification/api/v1/admin/announcements/${announcementId}/publish`);
}

/** 撤回公告 */
export function postAdminAnnouncementsUnpublishByAnnouncements(client: ApiClient, announcementId: string): Promise<AnnouncementResponse> {
  return client.post(`/notification/api/v1/admin/announcements/${announcementId}/unpublish`);
}

/** 管理员查看指定用户通知列表 */
export function getAdminNotifications(client: ApiClient, params?: {
  user_id: string;  // 用户ID
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  type?: string;  // 通知类型
  is_read?: boolean;  // 是否已读
  start_date?: string;  // 开始日期
  end_date?: string;  // 结束日期
}): Promise<ApiListResult<NotificationResponse>> {
  return client.get(`/notification/api/v1/admin/notifications`, { params });
}

/** 广播通知 */
export function postAdminNotificationsBroadcast(client: ApiClient, data: BroadcastNotificationRequest): Promise<BroadcastNotificationResponse> {
  return client.post(`/notification/api/v1/admin/notifications/broadcast`, data);
}

/** 列出事件映射（管理端） */
export function getAdminNotificationsEventMappings(client: ApiClient): Promise<ApiListResult<EventMappingResponse>> {
  return client.get(`/notification/api/v1/admin/notifications/event-mappings`);
}

/** 创建事件映射 */
export function postAdminNotificationsEventMappings(client: ApiClient, data: CreateEventMappingRequest): Promise<EventMappingResponse> {
  return client.post(`/notification/api/v1/admin/notifications/event-mappings`, data);
}

/** 删除事件映射 */
export function deleteAdminNotificationsEventMappingsByEventMappings(client: ApiClient, announcementId: string): Promise<SimpleResponse> {
  return client.delete(`/notification/api/v1/admin/notifications/event-mappings/${announcementId}`);
}

/** 获取事件映射详情（管理端） */
export function getAdminNotificationsEventMappingsByEventMappings(client: ApiClient, announcementId: string): Promise<EventMappingResponse> {
  return client.get(`/notification/api/v1/admin/notifications/event-mappings/${announcementId}`);
}

/** 更新事件映射 */
export function putAdminNotificationsEventMappingsByEventMappings(client: ApiClient, announcementId: string, data: UpdateEventMappingRequest): Promise<EventMappingResponse> {
  return client.put(`/notification/api/v1/admin/notifications/event-mappings/${announcementId}`, data);
}

/** 列出全局变量（管理端） */
export function getAdminNotificationsGlobalVariables(client: ApiClient): Promise<ApiListResult<GlobalVariableResponse>> {
  return client.get(`/notification/api/v1/admin/notifications/global-variables`);
}

/** 创建全局变量 */
export function postAdminNotificationsGlobalVariables(client: ApiClient, data: CreateGlobalVariableRequest): Promise<GlobalVariableResponse> {
  return client.post(`/notification/api/v1/admin/notifications/global-variables`, data);
}

/** 删除全局变量 */
export function deleteAdminNotificationsGlobalVariablesByGlobalVariables(client: ApiClient, announcementId: string): Promise<SimpleResponse> {
  return client.delete(`/notification/api/v1/admin/notifications/global-variables/${announcementId}`);
}

/** 获取全局变量（管理端） */
export function getAdminNotificationsGlobalVariablesByGlobalVariables(client: ApiClient, announcementId: string): Promise<GlobalVariableResponse> {
  return client.get(`/notification/api/v1/admin/notifications/global-variables/${announcementId}`);
}

/** 更新全局变量 */
export function putAdminNotificationsGlobalVariablesByGlobalVariables(client: ApiClient, announcementId: string, data: UpdateGlobalVariableRequest): Promise<GlobalVariableResponse> {
  return client.put(`/notification/api/v1/admin/notifications/global-variables/${announcementId}`, data);
}

/** 获取平台级通知统计 */
export function getAdminNotificationsPlatformStats(client: ApiClient): Promise<NotificationStatsResponse> {
  return client.get(`/notification/api/v1/admin/notifications/platform-stats`);
}

/** 管理员覆盖用户通知偏好 */
export function putAdminNotificationsPreferencesByPreferences(client: ApiClient, userId: string, data: NotificationPreferencesRequest): Promise<NotificationPreferencesResponse> {
  return client.put(`/notification/api/v1/admin/notifications/preferences/${userId}`, data);
}

/** 获取通知已读报告（管理端） */
export function getAdminNotificationsReadReport(client: ApiClient): Promise<ReadReportResponse> {
  return client.get(`/notification/api/v1/admin/notifications/read-report`);
}

/** 广播安全公告（平台级） */
export function postAdminNotificationsSecurityAdvisoryBroadcast(client: ApiClient, data: SecurityAdvisoryBroadcastRequest): Promise<SecurityAdvisoryBroadcastResponse> {
  return client.post(`/notification/api/v1/admin/notifications/security-advisory-broadcast`, data);
}

/** 获取通知统计（管理端） */
export function getAdminNotificationsStats(client: ApiClient): Promise<NotificationStatsResponse> {
  return client.get(`/notification/api/v1/admin/notifications/stats`);
}

/** 列出通知模板（管理端） */
export function getAdminNotificationsTemplates(client: ApiClient, params?: {
  include_inactive?: boolean;  // 包含已停用模板
  type?: string;  // 通知类型过滤
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<TemplateResponse>> {
  return client.get(`/notification/api/v1/admin/notifications/templates`, { params });
}

/** 创建通知模板 */
export function postAdminNotificationsTemplates(client: ApiClient, data: CreateTemplateRequest): Promise<TemplateResponse> {
  return client.post(`/notification/api/v1/admin/notifications/templates`, data);
}

/** 列出可用通知模板（管理端） */
export function getAdminNotificationsTemplatesAvailable(client: ApiClient): Promise<ApiListResult<AvailableTemplateResponse>> {
  return client.get(`/notification/api/v1/admin/notifications/templates/available`);
}

/** 删除通知模板 */
export function deleteAdminNotificationsTemplatesByTemplates(client: ApiClient, announcementId: string): Promise<SimpleResponse> {
  return client.delete(`/notification/api/v1/admin/notifications/templates/${announcementId}`);
}

/** 获取通知模板详情（管理端） */
export function getAdminNotificationsTemplatesByTemplates(client: ApiClient, announcementId: string): Promise<TemplateResponse> {
  return client.get(`/notification/api/v1/admin/notifications/templates/${announcementId}`);
}

/** 更新通知模板 */
export function putAdminNotificationsTemplatesByTemplates(client: ApiClient, announcementId: string, data: UpdateTemplateRequest): Promise<TemplateResponse> {
  return client.put(`/notification/api/v1/admin/notifications/templates/${announcementId}`, data);
}

/** 跨 locale 复制模板 */
export function postAdminNotificationsTemplatesCloneToLocaleByTemplates(client: ApiClient, announcementId: string, data: CloneTemplateToLocaleRequest): Promise<TemplateResponse> {
  return client.post(`/notification/api/v1/admin/notifications/templates/${announcementId}/clone-to-locale`, data);
}

/** 发送测试通知（管理端） */
export function postAdminNotificationsTest(client: ApiClient, data: TestNotificationRequest): Promise<TestNotificationResponse> {
  return client.post(`/notification/api/v1/admin/notifications/test`, data);
}

/** 获取通知趋势（管理端） */
export function getAdminNotificationsTrend(client: ApiClient, params?: {
  days?: number;  // 天数（默认30）
}): Promise<ApiListResult<TrendPoint>> {
  return client.get(`/notification/api/v1/admin/notifications/trend`, { params });
}

/** 列出公告 */
export function getAnnouncements(client: ApiClient, params?: {
  page?: number;  // 页码
  page_size?: number;  // 每页条数
  status?: string;  // 状态过滤: draft/scheduled/published/expired
  search?: string;  // 搜索关键词
}): Promise<ApiListResult<AnnouncementResponse>> {
  return client.get(`/notification/api/v1/announcements`, { params });
}

/** 获取公告详情 */
export function getAnnouncementsByAnnouncements(client: ApiClient, announcementId: string): Promise<AnnouncementResponse> {
  return client.get(`/notification/api/v1/announcements/${announcementId}`);
}

/** 获取公告统计 */
export function getAnnouncementsStatsByAnnouncements(client: ApiClient, announcementId: string): Promise<AnnouncementStatsResponse> {
  return client.get(`/notification/api/v1/announcements/${announcementId}/stats`);
}

/** 获取通知列表 */
export function getNotifications(client: ApiClient, params?: {
  unread_only?: boolean;  // 仅查询未读通知
  page?: number;  // 页码
  page_size?: number;  // 每页条数
}): Promise<ApiListResult<NotificationResponse>> {
  return client.get(`/notification/api/v1/notifications`, { params });
}

/** 发送通知 */
export function postNotifications(client: ApiClient, data: SendNotificationRequest): Promise<NotificationResponse> {
  return client.post(`/notification/api/v1/notifications`, data);
}

/** 列出事件映射 */
export function getNotificationsEventMappings(client: ApiClient): Promise<ApiListResult<EventMappingResponse>> {
  return client.get(`/notification/api/v1/notifications/event-mappings`);
}

/** 获取事件映射 */
export function getNotificationsEventMappingsByEventMappings(client: ApiClient, announcementId: string): Promise<EventMappingResponse> {
  return client.get(`/notification/api/v1/notifications/event-mappings/${announcementId}`);
}

/** 列出全局变量 */
export function getNotificationsGlobalVariables(client: ApiClient): Promise<ApiListResult<GlobalVariableResponse>> {
  return client.get(`/notification/api/v1/notifications/global-variables`);
}

/** 获取全局变量 */
export function getNotificationsGlobalVariablesByGlobalVariables(client: ApiClient, announcementId: string): Promise<GlobalVariableResponse> {
  return client.get(`/notification/api/v1/notifications/global-variables/${announcementId}`);
}

/** 获取通知偏好设置 */
export function getNotificationsPreferencesByPreferences(client: ApiClient, userId: string): Promise<NotificationPreferencesResponse> {
  return client.get(`/notification/api/v1/notifications/preferences/${userId}`);
}

/** 更新通知偏好设置 */
export function putNotificationsPreferencesByPreferences(client: ApiClient, userId: string, data: NotificationPreferencesRequest): Promise<NotificationPreferencesResponse> {
  return client.put(`/notification/api/v1/notifications/preferences/${userId}`, data);
}

/** 确认安全公告订阅 */
export function getNotificationsPublicSecurityConfirm(client: ApiClient, params?: {
  email: string;  // 订阅邮箱
  token: string;  // 确认令牌
}): Promise<SimpleResponse> {
  return client.get(`/notification/api/v1/notifications/public/security-confirm`, { params });
}

/** 订阅安全公告 */
export function postNotificationsPublicSecuritySubscribe(client: ApiClient, data: SecuritySubscribeRequest): Promise<SecuritySubscribeResponse> {
  return client.post(`/notification/api/v1/notifications/public/security-subscribe`, data);
}

/** 退订安全公告 */
export function postNotificationsPublicSecurityUnsubscribe(client: ApiClient, data: SecurityUnsubscribeRequest): Promise<SecurityUnsubscribeResponse> {
  return client.post(`/notification/api/v1/notifications/public/security-unsubscribe`, data);
}

/** 标记全部通知已读 */
export function putNotificationsReadAll(client: ApiClient): Promise<SimpleResponse> {
  return client.put(`/notification/api/v1/notifications/read-all`);
}

/** 获取通知已读/未读报告 */
export function getNotificationsReadReport(client: ApiClient): Promise<ReadReportResponse> {
  return client.get(`/notification/api/v1/notifications/read-report`);
}

/** 发送通知（兼容端点） */
export function postNotificationsSend(client: ApiClient, data: SendNotificationRequest): Promise<SendNotificationCompatResponse> {
  return client.post(`/notification/api/v1/notifications/send`, data);
}

/** 批量发送通知 */
export function postNotificationsSendBatch(client: ApiClient, data: BatchSendNotificationRequest): Promise<BatchSendNotificationResponse> {
  return client.post(`/notification/api/v1/notifications/send-batch`, data);
}

/** 使用模板发送通知 */
export function postNotificationsSendFromTemplate(client: ApiClient, data: SendFromTemplateRequest): Promise<NotificationResponse> {
  return client.post(`/notification/api/v1/notifications/send-from-template`, data);
}

/** 获取通知统计 */
export function getNotificationsStats(client: ApiClient): Promise<NotificationStatsResponse> {
  return client.get(`/notification/api/v1/notifications/stats`);
}

/** SSE实时通知流 */
export function getNotificationsStream(client: ApiClient, params?: {
  ticket?: string;  // 一次性短期票据（P5-4 主路径，60s 内一次性消费）
  user_id?: string;  // 用户ID（已弃用回退：仅在认证上下文无用户时使用）
}): Promise<void> {
  return client.get(`/notification/api/v1/notifications/stream`, { params });
}

/** 签发 SSE 短期票据 */
export function postNotificationsStreamTicket(client: ApiClient): Promise<StreamTicketResponse> {
  return client.post(`/notification/api/v1/notifications/stream-ticket`);
}

/** 列出通知模板 */
export function getNotificationsTemplates(client: ApiClient, params?: {
  include_inactive?: boolean;  // 包含已停用模板
  type?: string;  // 通知类型过滤
  page?: number;  // 页码（默认1）
  page_size?: number;  // 每页条数（默认20）
}): Promise<ApiListResult<TemplateResponse>> {
  return client.get(`/notification/api/v1/notifications/templates`, { params });
}

/** 列出可用模板 */
export function getNotificationsTemplatesAvailable(client: ApiClient): Promise<ApiListResult<AvailableTemplateResponse>> {
  return client.get(`/notification/api/v1/notifications/templates/available`);
}

/** 获取通知模板 */
export function getNotificationsTemplatesByTemplates(client: ApiClient, announcementId: string): Promise<TemplateResponse> {
  return client.get(`/notification/api/v1/notifications/templates/${announcementId}`);
}

/** 发送测试通知 */
export function postNotificationsTest(client: ApiClient, data: TestNotificationRequest): Promise<TestNotificationResponse> {
  return client.post(`/notification/api/v1/notifications/test`, data);
}

/** 获取通知趋势 */
export function getNotificationsTrend(client: ApiClient, params?: {
  days?: number;  // 天数（默认30）
}): Promise<ApiListResult<TrendPoint>> {
  return client.get(`/notification/api/v1/notifications/trend`, { params });
}

/** 获取未读通知列表 */
export function getNotificationsUnread(client: ApiClient): Promise<ApiListResult<NotificationResponse>> {
  return client.get(`/notification/api/v1/notifications/unread`);
}

/** 获取未读通知数量 */
export function getNotificationsUnreadCount(client: ApiClient): Promise<UnreadCountResponse> {
  return client.get(`/notification/api/v1/notifications/unread-count`);
}

/** 删除通知 */
export function deleteNotificationsByNotifications(client: ApiClient, notificationId: string, data: DeleteNotificationRequest): Promise<DeleteNotificationResponse> {
  return client.delete(`/notification/api/v1/notifications/${notificationId}`);
}

/** 获取通知详情 */
export function getNotificationsByNotifications(client: ApiClient, notificationId: string): Promise<NotificationResponse> {
  return client.get(`/notification/api/v1/notifications/${notificationId}`);
}

/** 标记通知已读 */
export function putNotificationsReadByNotifications(client: ApiClient, notificationId: string): Promise<MarkReadResponse> {
  return client.put(`/notification/api/v1/notifications/${notificationId}/read`);
}

/** 标记通知未读 */
export function putNotificationsUnreadByNotifications(client: ApiClient, notificationId: string): Promise<SimpleResponse> {
  return client.put(`/notification/api/v1/notifications/${notificationId}/unread`);
}

/** 删除推送订阅 */
export function deletePushSubscriptions(client: ApiClient, params?: {
  endpoint: string;  // 订阅端点URL
}): Promise<SimpleResponse> {
  return client.delete(`/notification/api/v1/push/subscriptions`, params);
}

/** 列出推送订阅 */
export function getPushSubscriptions(client: ApiClient): Promise<ApiListResult<PushSubscriptionResponse>> {
  return client.get(`/notification/api/v1/push/subscriptions`);
}

/** 注册 Web Push 推送订阅 */
export function postPushSubscriptions(client: ApiClient, data: PushSubscriptionRequest): Promise<PushSubscriptionResponse> {
  return client.post(`/notification/api/v1/push/subscriptions`, data);
}

/** 获取推送订阅详情 */
export function getPushSubscriptionsBySubscriptions(client: ApiClient, subscriptionId: string): Promise<PushSubscriptionResponse> {
  return client.get(`/notification/api/v1/push/subscriptions/${subscriptionId}`);
}

/** 获取 VAPID 公钥 */
export function getPushVapidPublicKey(client: ApiClient): Promise<VapidPublicKeyResponse> {
  return client.get(`/notification/api/v1/push/vapid-public-key`);
}

