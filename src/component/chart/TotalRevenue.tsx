import type Geometry from "@arcgis/core/geometry/Geometry"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import { useEffect, useState } from "react"

type Props = {
  packageType: string
  geometry?: Geometry | null
}

export default function TotalRevenue({ packageType, geometry}: Props) {
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    const layer = new FeatureLayer({
      url: import.meta.env.VITE_CUSTOMER_LAYER_URL,
    })

    layer.load().then(() => {
      let where = "1=1"

      if (packageType !== "all") {
        where += ` AND package = '${packageType}'`
      }

      layer.queryFeatures({
        where,
        geometry: geometry ?? undefined,
        spatialRelationship: "intersects",
        outStatistics: [
          {
            statisticType: "sum",
            onStatisticField: "price",
            outStatisticFieldName: "total_revenue",
          },
        ],
      }).then((result) => {
        const value = result.features[0]?.attributes?.total_revenue || 0
        setTotal(value)
      })
    })
  }, [packageType, geometry])

  return (
    <div style={{ padding: 20, fontSize: 24 }}>
      Total Revenue: <b>{total}</b>
    </div>
  )
}