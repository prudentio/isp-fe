import { createBrowserRouter } from "react-router-dom"
import { ProtectedRoute } from "./ProtectedRoute"
import LoginPage from "../pages/Login"
import MapPage from "../pages/Map"
import ConfigPage from "../pages/Config"
import MainLayout from "../layout/Main"
import AuditLogPage from "../pages/AuditLog"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "map",
        element: <MapPage />,
      },
      {
        path: "config",
        element: <ConfigPage />,
      },
      {
        path: "audit-log",
        element: <AuditLogPage />
      }
    ],
  },
])