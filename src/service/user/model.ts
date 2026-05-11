import type { RoleResponse } from "../role/model"

export interface UserResponse {
  id: string
  username: string
  role: RoleResponse
}

export interface CreateUserRequest {
  username: string
  password: string
  roleId: string
}

export interface UpdateUserRequest {
  username?: string | null
  password?: string | null
  roleId?: string | null
}