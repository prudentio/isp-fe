import { useEffect, useRef } from "react"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import { createModel } from "@arcgis/charts-components"
import "@arcgis/charts-components/components/arcgis-chart"
import type Geometry from "@arcgis/core/geometry/Geometry"

type Props = {
  packageType: string
  geometry?: Geometry | null
}

export default function TotalActiveCustomerPerPackage({
  packageType,
  geometry,
}: Props) {
  const chartRef = useRef<HTMLArcgisChartElement>(null)

  useEffect(() => {
    const el = chartRef.current
    if (!el) return

    const run = async () => {
      const layer = new FeatureLayer({
        url: import.meta.env.VITE_CUSTOMER_LAYER_URL,
      })

      await layer.load()

      const model = await createModel({
        layer,
        chartType: "pieChart",
      })

      model.category = "package"
      model.titleText = "Total Active Customer by Package"

      el.model = model

      await model.setDataFilters({
        where:
          packageType !== "all"
            ? `package = '${packageType}'`
            : "1=1",

        geometry: geometry?.toJSON(),
        spatialRelationship: "intersects",
      })
    }

    run()
  }, [packageType, geometry])

  return (
    <arcgis-chart
      ref={chartRef}
      style={{ width: 400, height: 300 }}
    />
  )
}