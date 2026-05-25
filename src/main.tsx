import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import esriConfig from "@arcgis/core/config"
import { useAuthStore } from './hooks/auth/index.ts'

esriConfig.request.interceptors.push({
  before: (params) => {
    const token = useAuthStore.getState().arcgisAccessToken

    if (token) {
      params.requestOptions.query = {
        ...params.requestOptions.query,
        token,
      }
    }
  },

  error: async (error) => { 
    const details = error?.details as | { httpStatus?: number } | undefined
    const status = details?.httpStatus

    if (status === 498 || status === 499) {
      const res = await ArcgisService.accessToken()

      useAuthStore.setState({
        arcgisAccessToken: res.accessToken,
      })
    }

    throw error
  },
})

import "@arcgis/map-components/components/arcgis-map"
import "@arcgis/map-components/components/arcgis-zoom"
import "@arcgis/map-components/components/arcgis-layer-list"
import "@esri/calcite-components/components/calcite-navigation";
import "@esri/calcite-components/components/calcite-navigation-logo";
import "@esri/calcite-components/components/calcite-shell";
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/Router.tsx'
import { ArcgisService } from './service/arcgis/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
