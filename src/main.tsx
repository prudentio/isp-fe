import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "@arcgis/map-components/components/arcgis-map"
import "@arcgis/map-components/components/arcgis-zoom"
import "@arcgis/map-components/components/arcgis-layer-list"
import "@esri/calcite-components/components/calcite-navigation";
import "@esri/calcite-components/components/calcite-navigation-logo";
import "@esri/calcite-components/components/calcite-shell";
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/Router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
