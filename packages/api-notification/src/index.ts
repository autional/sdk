// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-notification — auto-generated */
import type { ApiClient } from '@authms/core';

export function adminAnnouncementsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/admin/announcements`, data);
}

export function adminAnnouncementsByAnnouncementsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/notification/api/v1/admin/announcements/${announcementId}`);
}

export function adminAnnouncementsByAnnouncementsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/notification/api/v1/admin/announcements/${announcementId}`, data);
}

export function adminAnnouncementsPublishByAnnouncementsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/admin/announcements/${announcementId}/publish`);
}

export function adminAnnouncementsUnpublishByAnnouncementsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/admin/announcements/${announcementId}/unpublish`);
}

export function adminNotifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/admin/notifications`, { params });
}

export function adminNotificationsBroadcastPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/admin/notifications/broadcast`, data);
}

export function adminNotificationsEventMappingsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/admin/notifications/event-mappings`, data);
}

export function adminNotificationsEventMappingsByEventMappingsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/notification/api/v1/admin/notifications/event-mappings/${announcementId}`);
}

export function adminNotificationsEventMappingsByEventMappingsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/notification/api/v1/admin/notifications/event-mappings/${announcementId}`, data);
}

export function adminNotificationsGlobalVariablesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/admin/notifications/global-variables`, data);
}

export function adminNotificationsGlobalVariablesByGlobalVariablesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/notification/api/v1/admin/notifications/global-variables/${announcementId}`);
}

export function adminNotificationsGlobalVariablesByGlobalVariablesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/notification/api/v1/admin/notifications/global-variables/${announcementId}`, data);
}

export function adminNotificationsPlatformStats(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/admin/notifications/platform-stats`);
}

export function adminNotificationsPreferencesByPreferencesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/notification/api/v1/admin/notifications/preferences/${userId}`, data);
}

export function adminNotificationsTemplatesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/admin/notifications/templates`, data);
}

export function adminNotificationsTemplatesByTemplatesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/notification/api/v1/admin/notifications/templates/${announcementId}`);
}

export function adminNotificationsTemplatesByTemplatesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/notification/api/v1/admin/notifications/templates/${announcementId}`, data);
}

export function adminNotificationsTemplatesCloneToLocaleByTemplatesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/admin/notifications/templates/${announcementId}/clone-to-locale`, data);
}

export function announcements(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/announcements`, { params });
}

export function announcementsByAnnouncements(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/announcements/${announcementId}`);
}

export function announcementsStatsByAnnouncements(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/announcements/${announcementId}/stats`);
}

export function notifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications`, { params });
}

export function notificationsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/notifications`, data);
}

export function notificationsEventMappings(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/event-mappings`);
}

export function notificationsEventMappingsByEventMappings(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/event-mappings/${announcementId}`);
}

export function notificationsGlobalVariables(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/global-variables`);
}

export function notificationsGlobalVariablesByGlobalVariables(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/global-variables/${announcementId}`);
}

export function notificationsPreferencesByPreferences(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/preferences/${userId}`);
}

export function notificationsPreferencesByPreferencesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/notification/api/v1/notifications/preferences/${userId}`, data);
}

export function notificationsPublicSecurityConfirm(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/public/security-confirm`, { params });
}

export function notificationsPublicSecuritySubscribePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/notifications/public/security-subscribe`, data);
}

export function notificationsPublicSecurityUnsubscribePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/notifications/public/security-unsubscribe`, data);
}

export function notificationsReadAllPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/notification/api/v1/notifications/read-all`);
}

export function notificationsReadReport(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/read-report`);
}

export function notificationsSendPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/notifications/send`, data);
}

export function notificationsSendBatchPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/notifications/send-batch`, data);
}

export function notificationsSendFromTemplatePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/notifications/send-from-template`, data);
}

export function notificationsStats(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/stats`);
}

export function notificationsStream(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/stream`, { params });
}

export function notificationsTemplates(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/templates`, { params });
}

export function notificationsTemplatesAvailable(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/templates/available`);
}

export function notificationsTemplatesByTemplates(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/templates/${announcementId}`);
}

export function notificationsTestPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/notifications/test`, data);
}

export function notificationsTrend(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/trend`, { params });
}

export function notificationsUnread(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/unread`);
}

export function notificationsUnreadCount(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/unread-count`);
}

export function notificationsByNotificationsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/notification/api/v1/notifications/${notificationId}`, { data });
}

export function notificationsByNotifications(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/notifications/${notificationId}`);
}

export function notificationsReadByNotificationsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/notification/api/v1/notifications/${notificationId}/read`);
}

export function notificationsUnreadByNotificationsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/notification/api/v1/notifications/${notificationId}/unread`);
}

export function pushSubscriptionsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/notification/api/v1/push/subscriptions`, { params });
}

export function pushSubscriptions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/push/subscriptions`);
}

export function pushSubscriptionsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/notification/api/v1/push/subscriptions`, data);
}

export function pushSubscriptionsBySubscriptions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/push/subscriptions/${id}`);
}

export function pushVapidPublicKey(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/notification/api/v1/push/vapid-public-key`);
}

