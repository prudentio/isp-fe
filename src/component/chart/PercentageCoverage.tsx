import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import { useEffect, useState } from "react"

type Props = {
  area: string
}


export default function CoverageUtilization({ area }: Props) {
  const [percentage, setPercentage] = useState<number>(0)

  useEffect(() => {
    const layer = new FeatureLayer({
      url: "https://services5.arcgis.com/PFczHi0yHZ6hxc18/arcgis/rest/services/coverage_layer/FeatureServer/0",
    })

    layer.load().then(async () => {
      let where:string = "1=1"

      if (area !== "all") {
        where += ` AND area = '${area}'`
      }

      const result = await layer.queryFeatures({
        where,
        outStatistics: [
          {
            statisticType: "sum",
            onStatisticField: "current_customer",
            outStatisticFieldName: "current_total",
          },
          {
            statisticType: "sum",
            onStatisticField: "max_customer",
            outStatisticFieldName: "max_total",
          },
        ],
        returnGeometry: false,
      })

      const attrs = result.features[0]?.attributes

      const current = attrs?.current_total || 0
      const max = attrs?.max_total || 0

      const percent = max ? (current / max) * 100 : 0

      setPercentage(percent)
    })
  }, [area])

  return (
    <div style={{ padding: 20, fontSize: 24 }}>
      Coverage Utilization: <b>{percentage.toFixed(2)}%</b>
    </div>
  )
}