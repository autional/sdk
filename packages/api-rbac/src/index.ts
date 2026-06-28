// @ts-nocheck — auto-generated from swagger.json
/** @authms/api-rbac — auto-generated */
import type { ApiClient } from '@authms/core';

export function adminApprovalRequests(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/approval-requests`, { params });
}

export function adminApprovalRequestsApproveByApprovalRequestsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/approval-requests/${requestId}/approve`, data);
}

export function adminApprovalRequestsRejectByApprovalRequestsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/approval-requests/${requestId}/reject`, data);
}

export function adminPermissions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/permissions`, { params });
}

export function adminPermissionsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/permissions`, data);
}

export function adminPermissionsSimulatePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/permissions/simulate`, data);
}

export function adminPermissionsByPermissionsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/rbac/api/v1/admin/permissions/${permissionId}`);
}

export function adminPermissionsByPermissions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/permissions/${permissionId}`);
}

export function adminPermissionsByPermissionsPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/rbac/api/v1/admin/permissions/${permissionId}`, data);
}

export function adminPermissionsRolesByPermissions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/permissions/${permissionId}/roles`);
}

export function adminPermissionsUsersByPermissions(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/permissions/${permissionId}/users`);
}

export function adminRoles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/roles`, { params });
}

export function adminRolesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/roles`, data);
}

export function adminRolesBatchPermissionsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/rbac/api/v1/admin/roles/batch/permissions`, { data });
}

export function adminRolesBatchPermissionsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/roles/batch/permissions`, data);
}

export function adminRolesConflictPairs(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/roles/conflict-pairs`);
}

export function adminRolesConflictPairsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/roles/conflict-pairs`, data);
}

export function adminRolesConflictPairsByConflictPairsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/rbac/api/v1/admin/roles/conflict-pairs/${pairId}`);
}

export function adminRolesDefaults(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/roles/defaults`);
}

export function adminRolesDefaultsPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/roles/defaults`, data);
}

export function adminRolesDefaultsByDefaultsDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/rbac/api/v1/admin/roles/defaults/${roleId}`);
}

export function adminRolesByRolesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/rbac/api/v1/admin/roles/${roleId}`);
}

export function adminRolesByRoles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/roles/${roleId}`);
}

export function adminRolesByRolesPut(client: ApiClient, data?: Record<string, unknown>) {
  return client.put(`/rbac/api/v1/admin/roles/${roleId}`, data);
}

export function adminRolesApprovalRequestsByRolesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/roles/${roleId}/approval-requests`, data);
}

export function adminRolesChildrenByRoles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/roles/${roleId}/children`);
}

export function adminRolesChildrenByRolesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/roles/${roleId}/children`, data);
}

export function adminRolesChildrenByRolesByChildrenDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/rbac/api/v1/admin/roles/${roleId}/children/${childId}`);
}

export function adminRolesCloneByRolesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/roles/${roleId}/clone`, data);
}

export function adminRolesEffectivePermissionsByRoles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/roles/${roleId}/effective-permissions`);
}

export function adminRolesParentsByRoles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/roles/${roleId}/parents`);
}

export function adminRolesPermissionsByRolesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/rbac/api/v1/admin/roles/${roleId}/permissions`, { data });
}

export function adminRolesPermissionsByRoles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/roles/${roleId}/permissions`);
}

export function adminRolesPermissionsByRolesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/roles/${roleId}/permissions`, data);
}

export function adminRolesUsersByRoles(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/roles/${roleId}/users`);
}

export function adminUsersBatchRolesDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/rbac/api/v1/admin/users/batch/roles`, { data });
}

export function adminUsersBatchRolesPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/users/batch/roles`, data);
}

export function adminUsersPermissionsByUsersDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/rbac/api/v1/admin/users/${userId}/permissions`, { data });
}

export function adminUsersPermissionsByUsers(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/users/${userId}/permissions`);
}

export function adminUsersPermissionsByUsersPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/users/${userId}/permissions`, data);
}

export function adminUsersRolesByUsersDelete(client: ApiClient, data?: Record<string, unknown>) {
  return client.delete(`/rbac/api/v1/admin/users/${userId}/roles`, { data });
}

export function adminUsersRolesByUsers(client: ApiClient, data?: Record<string, unknown>) {
  return client.get(`/rbac/api/v1/admin/users/${userId}/roles`);
}

export function adminUsersRolesByUsersPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/users/${userId}/roles`, data);
}

export function adminUsersRolesValidateByUsersPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/admin/users/${userId}/roles/validate`);
}

export function authCheckPermissionPost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/auth/check-permission`, data);
}

export function authCheckRolePost(client: ApiClient, data?: Record<string, unknown>) {
  return client.post(`/rbac/api/v1/auth/check-role`, data);
}

