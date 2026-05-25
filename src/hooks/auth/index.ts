import { create } from "zustand"
import { persist } from "zustand/middleware"
import { jwtDecode } from "jwt-decode"
import { AuthService } from "../../service/auth/index"
import { ArcgisService } from "../../service/arcgis" 

type AuthState = {
  token?: string
  userId?: string

  username: string

  role: {
    id: string
    name: string
    permissions: {
      id: string
      code: string
    }[]
  } | null
  arcgisAccessToken?: string 

  login: (username: string, password: string) => Promise<void>
  logout: () => void
  getUserInfo: () => Promise<void>
  getArcgisAccessToken: () => Promise<void>

  isValid: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: undefined,
      userId: undefined,

      username: "",
      name: "",

      role: null,
      arcgisAccessToken: undefined, 

      login: async (username, password) => {
        const res = await AuthService.login(username, password)
        const token = res.data.accessToken

        const claims = jwtDecode<{ sub: string }>(token)

        set({
          token,
          userId: claims.sub,
        })
        await get().getArcgisAccessToken()
        await get().getUserInfo()
      },

      
      getArcgisAccessToken: async () => {
        const res = await ArcgisService.accessToken()

        set({
          arcgisAccessToken: res.accessToken,
        })
      },

      getUserInfo: async () => {
      const userinfo = await AuthService.getUserInfo()
      set({
        userId: userinfo.id,
        username: userinfo.username,
        role: userinfo.role,
      })
      },

      logout: () => {
        set({
          token: undefined,
          userId: undefined,
          username: "",
          role: null,
          arcgisAccessToken: undefined,
        })
      },

      isValid: () => {
        return !!get().token
      },
    }),
    {
      name: "auth-storage",
    }
  )
)