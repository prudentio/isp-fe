import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import { useEffect, useState } from "react"

type Props = {
  packageType: string
}

export default function TotalActiveCustomer({ packageType }: Props) {
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    const layer = new FeatureLayer({
      url: "https://services5.arcgis.com/PFczHi0yHZ6hxc18/arcgis/rest/services/customer_points/FeatureServer/0",
    })

    layer.load().then(() => {
      let where = "1=1"

      if (packageType !== "all") {
        where += ` AND package = '${packageType}'`
      }

      layer.queryFeatureCount({
        where,
      }).then((count) => {
        setTotal(count)
      })
    })
  }, [packageType])

  return (
    <div style={{ padding: 20, fontSize: 24 }}>
      Total Active Customers: <b>{total}</b>
    </div>
  )
}