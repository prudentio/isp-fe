import axios from "axios"
import { mainServiceFetch, type JSendBase } from "../base"
import type { LoginResponse } from "./model"
import type { UserResponse } from "../user/model"

async function login(username: string, password: string) {
  const res = await axios.post<JSendBase<LoginResponse>>(`${window.location.origin}/api/auth/auth/access-token`,{
      username,
      password,
    }
  )

  return res.data
}

async function getUserInfo() {
  const res = await mainServiceFetch<UserResponse>(`/auth/auth/userinfo`, {
    method: "GET",
  })

  return res.data
}

export const AuthService = { login, getUserInfo }
