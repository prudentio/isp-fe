import { mainServiceFetch } from "../base"
import type { CreatePermissionRequest, PermissionResponse, UpdatePermissionRequest } from "./model"


async function getPermissions() {
  const res = await mainServiceFetch<PermissionResponse[]>(
    "/auth/permission",
    { method: "GET" }
  )

  return res.data
}

async function createPermission(payload: CreatePermissionRequest) {
  const res = await mainServiceFetch<PermissionResponse>(
    "/auth/permission",
    {
      method: "POST",
      data: payload,
    }
  )

  return res.data
}

async function updatePermission(
  id: string,
  payload: UpdatePermissionRequest
) {
  const res = await mainServiceFetch<PermissionResponse>(
    `/auth/permission/${id}`,
    {
      method: "PATCH",
      data: payload,
    }
  )

  return res.data
}

async function deletePermission(id: string) {
  const res = await mainServiceFetch<{ deleted_id: string }>(
    `/auth/permission/${id}`,
    {
      method: "DELETE",
    }
  )

  return res.data
}

export const PermissionService = {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
}