import type Geometry from "@arcgis/core/geometry/Geometry"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import { useEffect, useState } from "react"

type Props = {
  packageType: string
  geometry?: Geometry | null
}

export default function TotalActiveCustomer({ packageType, geometry }: Props) {
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

      layer.queryFeatureCount({
        where,
        geometry: geometry ?? undefined,
      }).then((count) => {
        setTotal(count)
      })
    })
  }, [packageType, geometry])

  return (
    <div style={{ padding: 20, fontSize: 24 }}>
      Total Active Customers: <b>{total}</b>
    </div>
  )
}