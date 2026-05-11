import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import { useEffect, useState } from "react"

type Props = {
  area: string
}


export default function RemainingCapacity({ area }: Props) {
  const [remaining, setRemaining] = useState<number>(0)

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
            onStatisticField: "max_customer",
            outStatisticFieldName: "max_total",
          },
          {
            statisticType: "sum",
            onStatisticField: "current_customer",
            outStatisticFieldName: "current_total",
          },
        ],
        returnGeometry: false,
      })

      const attrs = result.features[0]?.attributes

      const max = attrs?.max_total || 0
      const current = attrs?.current_total || 0

      setRemaining(max - current)
    })
  }, [area])

  return (
    <div style={{ padding: 20, fontSize: 24 }}>
      Remaining Capacity: <b>{remaining}</b>
    </div>
  )
}