export function useMeasurement() {
  function createMeasurement(el: HTMLArcgisMapElement) {
    const areaExpand =
      el.querySelector("#area-expand") as HTMLArcgisExpandElement | null

    const distanceExpand =
      el.querySelector("#distance-expand") as HTMLArcgisExpandElement | null

    const areaMeasurement =
      el.querySelector("arcgis-area-measurement-2d") as HTMLArcgisAreaMeasurement2dElement | null

    const distanceMeasurement =
      el.querySelector("arcgis-distance-measurement-2d") as HTMLArcgisAreaMeasurement2dElement | null

    areaExpand?.addEventListener("arcgisPropertyChange", (e: Event) => {
      const event = e as CustomEvent<{ name: string }>

      if (event.detail.name !== "expanded") {
        return
      }

      if (areaExpand.expanded) {
        areaMeasurement?.start()
        return
      } 
      
      areaMeasurement?.clear()
    })

    distanceExpand?.addEventListener("arcgisPropertyChange", (e: Event) => {
      const event = e as CustomEvent<{ name: string }>

      if (event.detail.name !== "expanded") {
        return
      }

      if (distanceExpand.expanded) {
        distanceMeasurement?.start()
        return
      }

      distanceMeasurement?.clear()
    })
  }

  return { createMeasurement }
}