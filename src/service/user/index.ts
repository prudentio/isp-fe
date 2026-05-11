import { mainServiceFetch } from "../base"
import type {
    CreateUserRequest,
    UpdateUserRequest,
  UserResponse,

} from "./model"

async function getUsers() {
  const res = await mainServiceFetch<UserResponse[]>(
    "/auth/user",
    { method: "GET" }
  )

  return res.data
}


async function getUserById(id: string) {
  const res = await mainServiceFetch<UserResponse>(
    `/auth/user/${id}`,
    { method: "GET" }
  )

  return res.data
}

async function createUser(payload: CreateUserRequest) {
  const res = await mainServiceFetch<UserResponse>(
    "/auth/user",
    {
      method: "POST",
      data: payload,
    }
  )

  return res.data
}


async function updateUser(id: string, payload: UpdateUserRequest) {
  const res = await mainServiceFetch<UserResponse>(
    `/auth/user/${id}`,
    {
      method: "PATCH",
      data: payload,
    }
  )

  return res.data
}


async function deleteUser(id: string) {
  const res = await mainServiceFetch<{ deleted_id: string }>(
    `/auth/user/${id}`,
    {
      method: "DELETE",
    }
  )

  return res.data
}

export const UserService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}