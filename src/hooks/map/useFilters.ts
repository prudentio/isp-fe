import type Geometry from "@arcgis/core/geometry/Geometry"
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import { useEffect, useState } from "react"

type LayerRefs = {
  fiberLayerRef: React.RefObject<FeatureLayer | null>
  customerLayerRef: React.RefObject<FeatureLayer | null>
  coverageAreaRef: React.RefObject<FeatureLayer | null>
  onAreaGeometryChange?: (g: Geometry | null) => void
}

export function useFilters({fiberLayerRef,customerLayerRef,coverageAreaRef, onAreaGeometryChange}: LayerRefs) {
  const [fiberOperator, setFiberOperator] = useState("all")
  const [packageType, setPackageType] = useState("all")
  const [area, setArea] = useState("all")

  async function getAreaGeometry(area: string) {
    const layer = coverageAreaRef.current
    if (!layer || area === "all") return null

    const query = layer.createQuery()
    query.where = `area = '${area}'`
    query.returnGeometry = true
    query.outFields = ["*"]

    const res = await layer.queryFeatures(query)

    return res.features?.[0]?.geometry ?? null
  }

  function applyFilters() {
    const fiberLayer = fiberLayerRef.current
    const customerLayer = customerLayerRef.current
    const coverageLayer = coverageAreaRef.current

    if (fiberLayer) {
      fiberLayer.definitionExpression =
        fiberOperator === "all"
          ? "1=1"
          : `operator = '${fiberOperator}'`
    }

    if (customerLayer) {
      customerLayer.definitionExpression =
        packageType === "all"
          ? "1=1"
          : `package = '${packageType}'`
    }

    if (coverageLayer) {
      coverageLayer.definitionExpression =
        area === "all"
          ? "1=1"
          : `area = '${area}'`
    }
  }

  useEffect(() => {
    applyFilters()
    getAreaGeometry(area).then((geom) => {
      onAreaGeometryChange?.(geom)
    })
  }, [fiberOperator, packageType, area])

  return {
    fiberOperator,
    setFiberOperator,
    packageType,
    setPackageType,
    area,
    setArea,
  }
}