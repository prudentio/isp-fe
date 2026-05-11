export interface PermissionResponse {
  id: string
  code: string
}

export interface CreatePermissionRequest {
  code: string
}

export interface UpdatePermissionRequest {
  code?: string
}