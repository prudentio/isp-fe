import { mainServiceFetch } from "../base"
import type { CreateRoleRequest, RoleResponse, UpdateRolePermissionsRequest } from "./model"

async function getRoles() {
  const res = await mainServiceFetch<RoleResponse[]>(
    "/auth/role",
    { method: "GET" }
  )

  return res.data
}


async function createRole(payload: CreateRoleRequest) {
  const res = await mainServiceFetch<RoleResponse>(
    "/auth/role",
    {
      method: "POST",
      data: payload,
    }
  )

  return res.data
}

async function updateRolePermissions(
  id: string,
  payload: UpdateRolePermissionsRequest
) {
  const res = await mainServiceFetch<RoleResponse>(
    `/auth/role/${id}/permissions`,
    {
      method: "PATCH",
      data: payload,
    }
  )

  return res.data
}

async function deleteRole(id: string) {
  const res = await mainServiceFetch<{ deleted_id: string }>(
    `/auth/role/${id}`,
    {
      method: "DELETE",
    }
  )

  return res.data
}

export const RoleService = {
  getRoles,
  createRole,
  updateRolePermissions,
  deleteRole,
}