import { mainServiceFetch,  } from "../base"
import type { LoginResponse } from "../auth/model"

async function accessToken() {
  const res = await mainServiceFetch<Omit<LoginResponse, 'tokenType'>>(`${window.location.origin}/api/auth/arcgis/access-token`)

  return res.data
}

export const ArcgisService = { accessToken }
