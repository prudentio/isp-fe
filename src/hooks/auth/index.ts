import { create } from "zustand"
import { persist } from "zustand/middleware"
import { jwtDecode } from "jwt-decode"
import { AuthService } from "../../service/auth/index"

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

  login: (username: string, password: string) => Promise<void>
  logout: () => void
  getUserInfo: () => Promise<void>

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

      login: async (username, password) => {
        const res = await AuthService.login(username, password)
        console.log("res", res)
        const token = res.data.accessToken

        const claims = jwtDecode<{ sub: string }>(token)

        set({
          token,
          userId: claims.sub,
        })

        await get().getUserInfo()
      },

      getUserInfo: async () => {
      const userinfo = await AuthService.getUserInfo()
      console.log("userinfo", userinfo)
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