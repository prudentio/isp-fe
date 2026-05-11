import type { PermissionResponse } from "../permission/model"

export interface CreateRoleRequest {
  name: string
  permissionIds: string[]
}

export interface UpdateRolePermissionsRequest {
  permissionIds: string[]
}

export interface RoleResponse {
  id: string
  name: string
  permissions: PermissionResponse[]
}
