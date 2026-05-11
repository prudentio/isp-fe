import { useEffect, useRef } from "react"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import { createModel } from "@arcgis/charts-components"
import "@arcgis/charts-components/components/arcgis-chart"

type Props = {
  packageType: string
}

export default function TotalActiveCustomerPerPackage({ packageType }: Props) {
  const chartRef = useRef<HTMLArcgisChartElement>(null)

useEffect(() => {
  const el = chartRef.current
  if (!el) return

 const run = async () => {
    const layer = new FeatureLayer({
      url: "https://services5.arcgis.com/PFczHi0yHZ6hxc18/arcgis/rest/services/customer_points/FeatureServer/0",
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
    })
  }

  run()
}, [packageType])

  return (
    <arcgis-chart
      ref={chartRef}
      style={{ width: 400, height: 300 }}
    />
  )
}