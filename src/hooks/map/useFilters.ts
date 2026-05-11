import type FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import { useEffect, useState } from "react"

type LayerRefs = {
  fiberLayerRef: React.RefObject<FeatureLayer | null>
  customerLayerRef: React.RefObject<FeatureLayer | null>
  coverageAreaRef: React.RefObject<FeatureLayer | null>
}

export function useFilters({fiberLayerRef,customerLayerRef,coverageAreaRef}: LayerRefs) {
  const [fiberOperator, setFiberOperator] = useState("all")
  const [packageType, setPackageType] = useState("all")
  const [area, setArea] = useState("all")

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