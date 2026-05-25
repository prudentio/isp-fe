import { useEffect, useRef, useState } from "react"
import "@arcgis/map-components/components/arcgis-map"
import "@arcgis/map-components/components/arcgis-zoom"
import "@arcgis/map-components/components/arcgis-expand"
import "@arcgis/map-components/components/arcgis-area-measurement-2d"
import "@arcgis/map-components/components/arcgis-distance-measurement-2d"
import "@arcgis/map-components/components/arcgis-basemap-gallery"
import "@arcgis/map-components/components/arcgis-layer-list"
import "@arcgis/core/assets/esri/themes/light/main.css"
import "@arcgis/map-components/components/arcgis-editor"
import type Geometry from "@arcgis/core/geometry/Geometry"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import TotalActiveCustomerPerPackage from "../component/chart/TotalCustomer/PerPackage"
import TotalActiveCustomer from "../component/chart/TotalCustomer/Index"
import TotalRevenue from "../component/chart/TotalRevenue"
import PercentageCoverage from "../component/chart/PercentageCoverage"
import RemainingCapacity from "../component/chart/RemainingCapacity"
import FiberOperatorFilter from "../component/filter/FiberOperator"
import PackageTypeFilter from "../component/filter/PackageType"
import AreaCoverageFilter from "../component/filter/CoverageArea"
import { useAuthStore } from "../hooks/auth"
import { PermissionEnum } from "../constant/menuItems"
import { useMapInit } from "../hooks/map/useMapInit"
import { useMeasurement } from "../hooks/map/useMeasurement"
import { useLegend } from "../hooks/map/useLegend"
import { useFilters } from "../hooks/map/useFilters"


export default function MapPage() {
  const { role } = useAuthStore()
  const userPermissions = role?.permissions?.map((p) => p.code) || []

  const mapRef = useRef<HTMLArcgisMapElement | null>(null)
  const layerListRef = useRef<HTMLArcgisLayerListElement | null>(null)
  const fiberLayerRef = useRef<FeatureLayer | null>(null)
  const coverageAreaRef = useRef<FeatureLayer | null>(null)
  const customerLayerRef = useRef<FeatureLayer | null>(null)
  const [areaGeometry, setAreaGeometry] = useState<Geometry | null>(null)

  const {
    setFiberOperator,
    packageType,
    setPackageType,
    area,
    setArea,
  } = useFilters({
    fiberLayerRef,
    customerLayerRef,
    coverageAreaRef,
    onAreaGeometryChange: setAreaGeometry,
  })

  const { createLegend } = useLegend()
  const { createMeasurement } = useMeasurement()

  const { initMap } = useMapInit({
    mapRef,
    layerListRef,
    fiberLayerRef,
    customerLayerRef,
    coverageAreaRef,
    createLegend,
    createMeasurement,
  })

  useEffect(() => {
    initMap()
  }, [])

return (
  <div className="w-full h-full flex gap-x-3">
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <TotalActiveCustomer packageType={packageType} geometry={areaGeometry}/>
      </div>

      <div className="flex-1">
        <TotalRevenue packageType={packageType} geometry={areaGeometry} />
      </div>

      <div className="flex-1">
        <PercentageCoverage area={area} />
      </div>

      <div className="flex-1">
        <RemainingCapacity area={area} />
      </div>

      <div className="flex-1">
        <TotalActiveCustomerPerPackage packageType={packageType} geometry={areaGeometry}/>
      </div>
    </div>

    <arcgis-map
      ref={mapRef}
      zoom={10}
      center="106.63, -6.17"
      basemap="streets-vector"
    >
      <arcgis-basemap-gallery className="h-120" slot="top-left" />

      <div slot="top-right" className="flex gap-x-5">
        <FiberOperatorFilter onChange={setFiberOperator} />
        <PackageTypeFilter onChange={setPackageType} />
        <AreaCoverageFilter onChange={setArea} />
        {userPermissions.includes(PermissionEnum.MAPEDITOR) && (
          <arcgis-editor slot="top-right" />
        )}
      </div>

      <arcgis-layer-list
        ref={layerListRef}
        slot="bottom-left"
        show-collapse-button
        show-heading
        show-filter
        filter-placeholder="Filter layers"
      />

     
      <div
        slot="bottom-right"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "flex-end",
        }}
      >

         <arcgis-zoom slot="bottom-right" />

        <arcgis-expand id="area-expand" expand-tooltip="Area Measurement">
          <arcgis-area-measurement-2d />
        </arcgis-expand>

        <arcgis-expand id="distance-expand" expand-tooltip="Distance Measurement">
          <arcgis-distance-measurement-2d />
        </arcgis-expand>
      </div>
    </arcgis-map>
  </div>
)
}