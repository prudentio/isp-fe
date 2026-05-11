import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../hooks/auth/index.ts"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuthStore()
  const location = useLocation()

  const isAuth = auth.isValid()

  if (!isAuth) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return <>{children}</>
}