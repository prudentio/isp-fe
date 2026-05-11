import axios from "axios"
import { useAuthStore } from "../hooks/auth/index"


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || window.location.origin + "/api",
})


api.interceptors.request.use((config) => {
  const auth = useAuthStore.getState()

  if (auth.token) {
    config.headers.set("Authorization", `Bearer ${auth.token}`)
  }

  return config
})


export interface JSendBase<T = unknown> {
  status: "success" | "error"
  data: T
  pagination?: {
    page: number
    perPage: number
    totalItems: number
  }
  message?: string
}


export async function mainServiceFetch<T>(
  path: string,
  opt?: {
    method?: "GET" | "POST" | "PATCH" | "DELETE"
    data?: unknown
  }
): Promise<JSendBase<T>> {
  const res = await api.request<JSendBase<T>>({
    url: path,
    method: opt?.method || "GET",
    data: opt?.data,
  })

  return res.data
}