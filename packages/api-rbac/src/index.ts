/**
 * @autional/api-rbac — Auto-generated from rbac-service swagger.json
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

export interface SimulatePermissionCheck {
  action?: string;
  resource?: string;
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

export interface AddDefaultRoleRequest {
  roleId: string;  // 角色ID
}

export interface AddRoleChildRequest {
  childId: string;  // 子角色ID
}

export interface ApprovalRequestResponse {
  action?: string;
  createdAt?: string;
  id?: string;
  payload?: string;
  reason?: string;
  requesterId?: string;
  reviewerId?: string;
  roleId?: string;
  status?: string;
  targetId?: string;
  tenantId?: string;
}

export interface ApproveRejectRequest {
  reason?: string;  // 原因
}

export interface AssignDirectPermissionsRequest {
  permissionIds: string[];
}

export interface AssignPermissionsRequest {
  permissionIds: string[];  // Permission IDs
}

export interface AssignRolesRequest {
  departmentId?: string;  // Department ID
  expireAt?: string;  // Expiration time
  grantType?: string;  // Grant type
  roleIds: string[];  // Role IDs
}

export interface BatchAssignPermissionsRequest {
  permissionIds: string[];  // 权限ID列表
  roleIds: string[];  // 角色ID列表
}

export interface BatchAssignRolesRequest {
  roleIds: string[];  // 角色ID列表
  userIds: string[];  // 用户ID列表
}

export interface BatchRemoveRolesRequest {
  roleIds: string[];
  userIds: string[];
}

export interface BatchRevokePermissionsRequest {
  permissionIds: string[];
  roleIds: string[];
}

export interface BootstrapAdminRequest {
  roleCode?: string;
  userId: string;
}

export interface BootstrapAdminResponse {
  message?: string;
  roleId?: string;
}

export interface CheckPermissionInternalRequest {
  action: string;  // Action
  resource: string;  // Resource
  userId: string;  // User ID
}

export interface CheckPermissionRequest {
  action: string;  // Action
  resource: string;  // Resource
}

export interface CheckRoleRequest {
  roleCode: string;  // Role code
}

export interface CloneRoleRequest {
  code: string;  // 新角色编码
  name: string;  // 新角色名称
}

export interface ConflictPairResponse {
  createdAt?: string;  // 创建时间
  description?: string;  // 描述
  id?: string;  // 冲突对ID
  roleIdA?: string;  // 角色A ID
  roleIdB?: string;  // 角色B ID
}

export interface CreateConflictPairRequest {
  description?: string;  // 描述
  roleIdA: string;  // 角色A的ID
  roleIdB: string;  // 角色B的ID
}

export interface CreatePermissionRequest {
  action: string;  // Action
  category?: string;  // Category
  code: string;  // Permission code
  description?: string;  // Description
  effect?: Effect;  // Effect
  name: string;  // Permission name
  resource: string;  // Resource
  tags?: string;  // Tags
}

export interface CreateRoleRequest {
  code: string;  // Role code
  dataScope?: string;  // Data scope
  description?: string;  // Description
  name: string;  // Role name
  parentId?: string;  // Parent role ID
}

export interface DefaultRoleResponse {
  createdAt?: string;
  id?: string;
  priority?: number;
  roleId?: string;
  tenantId?: string;
}

export interface PermissionCheckDetailResponse {
  action?: string;
  allowed?: boolean;
  resource?: string;
  userId?: string;
}

export interface PermissionCheckResponse {
  allowed?: boolean;
}

export interface PermissionResponse {
  action?: string;  // 操作类型
  category?: string;  // 分类
  code?: string;  // 权限编码
  createdAt?: string;  // 创建时间
  description?: string;  // 描述
  effect?: Effect;  // 效果
  id?: string;  // 权限ID
  name?: string;  // 权限名称
  resource?: string;  // 资源类型
  tags?: string;  // 标签
  tenantId?: string;  // 租户ID
  updatedAt?: string;  // 更新时间
}

export interface RebacAddRequest {
  objectId: string;  // 对象ID（设备ID）
  objectType: string;  // 对象类型（白名单: device）
  relation: string;  // 关系（角色，枚举/长度校验）
  subjectId: string;  // 主体ID（用户ID）
  subjectType: string;  // 主体类型（白名单: user）
}

export interface RebacDeleteResult {
  deleted?: number;  // 受影响行数
}

export interface RebacRelationshipDTO {
  createdAt?: string;  // 创建时间（RFC3339）
  objectId?: string;  // 对象ID（设备ID）
  objectType?: string;  // 对象类型（白名单: device）
  relation?: string;  // 关系（角色）
  subjectId?: string;  // 主体ID（用户ID）
  subjectType?: string;  // 主体类型（白名单: user）
  tenantId?: string;  // 租户ID
}

export interface RebacRemoveRequest {
  objectId: string;  // 对象ID（设备ID）
  objectType: string;  // 对象类型（白名单: device）
  subjectId: string;  // 主体ID（用户ID）
  subjectType: string;  // 主体类型（白名单: user）
}

export interface RemoveRolesRequest {
  roleIds?: string[];  // Role IDs
}

export interface RequestApprovalRequest {
  action: string;  // 操作
  expireAt?: string;  // 过期时间
  payload?: string;  // 附加数据
  targetId: string;  // 目标ID
}

export interface RevokeDirectPermissionsRequest {
  permissionIds: string[];
}

export interface RevokePermissionsRequest {
  permissionIds: string[];  // Permission IDs
}

export interface RoleCheckResponse {
  hasRole?: boolean;
}

export interface RoleResponse {
  code?: string;  // 角色编码
  createdAt?: string;  // 创建时间
  dataScope?: string;  // 数据范围
  description?: string;  // 描述
  id?: string;  // 角色ID
  isSystem?: boolean;  // 是否系统角色
  name?: string;  // 角色名称
  parentId?: string;  // 父角色ID
  permissionCount?: number;  // 关联权限数量
  tenantId?: string;  // 租户ID
  updatedAt?: string;  // 更新时间
}

export interface SimulatePermissionRequest {
  checks: SimulatePermissionCheck[];
  userId: string;
}

export interface UpdatePermissionRequest {
  category?: string;  // Category
  description?: string;  // Description
  name?: string;  // Permission name
  tags?: string;  // Tags
}

export interface UpdateRoleRequest {
  dataScope?: string;  // Data scope
  description?: string;  // Description
  name?: string;  // Role name
  parentId?: string;  // Parent role ID
}

export interface UserIDsResponse {
  userIds?: string[];
}

export interface ValidateUserRolesResponse {
  conflicts?: ConflictPairResponse[];
  hasConflict?: boolean;
}

export type Effect = "allow" | "deny";


// ====== API Functions (tree-shakeable: independent exports) ======

/** 列出审批请求 */
export function getAdminApprovalRequests(client: ApiClient, params?: {
  status?: string;  // 审批状态（pending/approved/rejected/cancelled）
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<ApprovalRequestResponse>> {
  return client.get(`/rbac/api/v1/admin/approval-requests`, { params });
}

/** 批准审批请求 */
export function postAdminApprovalRequestsApproveByApprovalRequests(client: ApiClient, requestId: string, data: ApproveRejectRequest): Promise<SimpleResponse> {
  return client.post(`/rbac/api/v1/admin/approval-requests/${requestId}/approve`, data);
}

/** 拒绝审批请求 */
export function postAdminApprovalRequestsRejectByApprovalRequests(client: ApiClient, requestId: string, data: ApproveRejectRequest): Promise<SimpleResponse> {
  return client.post(`/rbac/api/v1/admin/approval-requests/${requestId}/reject`, data);
}

/** 查询权限列表 */
export function getAdminPermissions(client: ApiClient, params?: {
  resource?: string;  // 资源类型（模糊匹配）
  action?: string;  // 操作类型（模糊匹配）
  category?: string;  // 分类（模糊匹配）
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<PermissionResponse>> {
  return client.get(`/rbac/api/v1/admin/permissions`, { params });
}

/** 创建权限 */
export function postAdminPermissions(client: ApiClient, data: CreatePermissionRequest): Promise<PermissionResponse> {
  return client.post(`/rbac/api/v1/admin/permissions`, data);
}

/** 权限模拟/试算 */
export function postAdminPermissionsSimulate(client: ApiClient, data: SimulatePermissionRequest): Promise<SimpleResponse> {
  return client.post(`/rbac/api/v1/admin/permissions/simulate`, data);
}

/** 删除权限 */
export function deleteAdminPermissionsByPermissions(client: ApiClient, permissionId: string): Promise<void> {
  return client.delete(`/rbac/api/v1/admin/permissions/${permissionId}`);
}

/** 获取权限详情 */
export function getAdminPermissionsByPermissions(client: ApiClient, permissionId: string): Promise<PermissionResponse> {
  return client.get(`/rbac/api/v1/admin/permissions/${permissionId}`);
}

/** 更新权限信息 */
export function putAdminPermissionsByPermissions(client: ApiClient, permissionId: string, data: UpdatePermissionRequest): Promise<PermissionResponse> {
  return client.put(`/rbac/api/v1/admin/permissions/${permissionId}`, data);
}

/** 获取权限的角色列表 */
export function getAdminPermissionsRolesByPermissions(client: ApiClient, permissionId: string): Promise<RoleResponse[]> {
  return client.get(`/rbac/api/v1/admin/permissions/${permissionId}/roles`);
}

/** 获取权限的用户列表 */
export function getAdminPermissionsUsersByPermissions(client: ApiClient, permissionId: string): Promise<UserIDsResponse> {
  return client.get(`/rbac/api/v1/admin/permissions/${permissionId}/users`);
}

/** 查询角色列表 */
export function getAdminRoles(client: ApiClient, params?: {
  code?: string;  // 角色编码（模糊匹配）
  name?: string;  // 角色名称（模糊匹配）
  page?: number;  // 页码
  page_size?: number;  // 每页数量
}): Promise<ApiListResult<RoleResponse>> {
  return client.get(`/rbac/api/v1/admin/roles`, { params });
}

/** 创建角色 */
export function postAdminRoles(client: ApiClient, data: CreateRoleRequest): Promise<RoleResponse> {
  return client.post(`/rbac/api/v1/admin/roles`, data);
}

/** 批量撤销权限 */
export function deleteAdminRolesBatchPermissions(client: ApiClient, data: BatchRevokePermissionsRequest): Promise<SimpleResponse> {
  return client.delete(`/rbac/api/v1/admin/roles/batch/permissions`);
}

/** 批量分配权限 */
export function postAdminRolesBatchPermissions(client: ApiClient, data: BatchAssignPermissionsRequest): Promise<SimpleResponse> {
  return client.post(`/rbac/api/v1/admin/roles/batch/permissions`, data);
}

/** 列出职责分离冲突对 */
export function getAdminRolesConflictPairs(client: ApiClient): Promise<ConflictPairResponse[]> {
  return client.get(`/rbac/api/v1/admin/roles/conflict-pairs`);
}

/** 创建职责分离（SoD）冲突对 */
export function postAdminRolesConflictPairs(client: ApiClient, data: CreateConflictPairRequest): Promise<ConflictPairResponse> {
  return client.post(`/rbac/api/v1/admin/roles/conflict-pairs`, data);
}

/** 删除职责分离冲突对 */
export function deleteAdminRolesConflictPairsByConflictPairs(client: ApiClient, pairId: string): Promise<SimpleResponse> {
  return client.delete(`/rbac/api/v1/admin/roles/conflict-pairs/${pairId}`);
}

/** 列出默认角色 */
export function getAdminRolesDefaults(client: ApiClient): Promise<DefaultRoleResponse[]> {
  return client.get(`/rbac/api/v1/admin/roles/defaults`);
}

/** 添加租户默认角色 */
export function postAdminRolesDefaults(client: ApiClient, data: AddDefaultRoleRequest): Promise<SimpleResponse> {
  return client.post(`/rbac/api/v1/admin/roles/defaults`, data);
}

/** 移除默认角色 */
export function deleteAdminRolesDefaultsByDefaults(client: ApiClient, roleId: string): Promise<SimpleResponse> {
  return client.delete(`/rbac/api/v1/admin/roles/defaults/${roleId}`);
}

/** 删除角色 */
export function deleteAdminRolesByRoles(client: ApiClient, roleId: string): Promise<void> {
  return client.delete(`/rbac/api/v1/admin/roles/${roleId}`);
}

/** 获取角色详情 */
export function getAdminRolesByRoles(client: ApiClient, roleId: string): Promise<RoleResponse> {
  return client.get(`/rbac/api/v1/admin/roles/${roleId}`);
}

/** 更新角色信息 */
export function putAdminRolesByRoles(client: ApiClient, roleId: string, data: UpdateRoleRequest): Promise<RoleResponse> {
  return client.put(`/rbac/api/v1/admin/roles/${roleId}`, data);
}

/** 请求角色变更审批 */
export function postAdminRolesApprovalRequestsByRoles(client: ApiClient, roleId: string, data: RequestApprovalRequest): Promise<ApprovalRequestResponse> {
  return client.post(`/rbac/api/v1/admin/roles/${roleId}/approval-requests`, data);
}

/** 获取子角色列表 */
export function getAdminRolesChildrenByRoles(client: ApiClient, roleId: string): Promise<RoleResponse[]> {
  return client.get(`/rbac/api/v1/admin/roles/${roleId}/children`);
}

/** 添加子角色 */
export function postAdminRolesChildrenByRoles(client: ApiClient, roleId: string, data: AddRoleChildRequest): Promise<SimpleResponse> {
  return client.post(`/rbac/api/v1/admin/roles/${roleId}/children`, data);
}

/** 移除子角色 */
export function deleteAdminRolesChildrenByRolesByChildren(client: ApiClient, roleId: string, childId: string): Promise<SimpleResponse> {
  return client.delete(`/rbac/api/v1/admin/roles/${roleId}/children/${childId}`);
}

/** 克隆角色 */
export function postAdminRolesCloneByRoles(client: ApiClient, roleId: string, data: CloneRoleRequest): Promise<RoleResponse> {
  return client.post(`/rbac/api/v1/admin/roles/${roleId}/clone`, data);
}

/** 获取角色有效权限 */
export function getAdminRolesEffectivePermissionsByRoles(client: ApiClient, roleId: string): Promise<PermissionResponse[]> {
  return client.get(`/rbac/api/v1/admin/roles/${roleId}/effective-permissions`);
}

/** 获取祖先角色链 */
export function getAdminRolesParentsByRoles(client: ApiClient, roleId: string): Promise<RoleResponse[]> {
  return client.get(`/rbac/api/v1/admin/roles/${roleId}/parents`);
}

/** 撤销角色权限 */
export function deleteAdminRolesPermissionsByRoles(client: ApiClient, roleId: string, data: RevokePermissionsRequest): Promise<SimpleResponse> {
  return client.delete(`/rbac/api/v1/admin/roles/${roleId}/permissions`);
}

/** 获取角色直接分配的权限 */
export function getAdminRolesPermissionsByRoles(client: ApiClient, roleId: string): Promise<PermissionResponse[]> {
  return client.get(`/rbac/api/v1/admin/roles/${roleId}/permissions`);
}

/** 为角色分配权限 */
export function postAdminRolesPermissionsByRoles(client: ApiClient, roleId: string, data: AssignPermissionsRequest): Promise<SimpleResponse> {
  return client.post(`/rbac/api/v1/admin/roles/${roleId}/permissions`, data);
}

/** 获取角色的用户列表 */
export function getAdminRolesUsersByRoles(client: ApiClient, roleId: string): Promise<UserIDsResponse> {
  return client.get(`/rbac/api/v1/admin/roles/${roleId}/users`);
}

/** 批量移除角色 */
export function deleteAdminUsersBatchRoles(client: ApiClient, data: BatchRemoveRolesRequest): Promise<SimpleResponse> {
  return client.delete(`/rbac/api/v1/admin/users/batch/roles`);
}

/** 批量分配角色 */
export function postAdminUsersBatchRoles(client: ApiClient, data: BatchAssignRolesRequest): Promise<SimpleResponse> {
  return client.post(`/rbac/api/v1/admin/users/batch/roles`, data);
}

/** 撤销用户直赋权限 */
export function deleteAdminUsersPermissionsByUsers(client: ApiClient, userId: string, data: RevokeDirectPermissionsRequest): Promise<SimpleResponse> {
  return client.delete(`/rbac/api/v1/admin/users/${userId}/permissions`);
}

/** 获取用户有效权限列表 */
export function getAdminUsersPermissionsByUsers(client: ApiClient, userId: string): Promise<PermissionResponse[]> {
  return client.get(`/rbac/api/v1/admin/users/${userId}/permissions`);
}

/** 为用户直赋权限 */
export function postAdminUsersPermissionsByUsers(client: ApiClient, userId: string, data: AssignDirectPermissionsRequest): Promise<SimpleResponse> {
  return client.post(`/rbac/api/v1/admin/users/${userId}/permissions`, data);
}

/** 移除用户角色 */
export function deleteAdminUsersRolesByUsers(client: ApiClient, userId: string, data: RemoveRolesRequest): Promise<SimpleResponse> {
  return client.delete(`/rbac/api/v1/admin/users/${userId}/roles`);
}

/** 获取用户角色列表 */
export function getAdminUsersRolesByUsers(client: ApiClient, userId: string): Promise<RoleResponse[]> {
  return client.get(`/rbac/api/v1/admin/users/${userId}/roles`);
}

/** 为用户分配角色 */
export function postAdminUsersRolesByUsers(client: ApiClient, userId: string, data: AssignRolesRequest): Promise<SimpleResponse> {
  return client.post(`/rbac/api/v1/admin/users/${userId}/roles`, data);
}

/** 验证用户角色冲突 */
export function postAdminUsersRolesValidateByUsers(client: ApiClient, userId: string): Promise<ValidateUserRolesResponse> {
  return client.post(`/rbac/api/v1/admin/users/${userId}/roles/validate`);
}

/** 检查用户权限（用户侧） */
export function postAuthCheckPermission(client: ApiClient, data: CheckPermissionRequest): Promise<PermissionCheckResponse> {
  return client.post(`/rbac/api/v1/auth/check-permission`, data);
}

/** 检查用户角色（用户侧） */
export function postAuthCheckRole(client: ApiClient, data: CheckRoleRequest): Promise<RoleCheckResponse> {
  return client.post(`/rbac/api/v1/auth/check-role`, data);
}

