export function useLegend() {
  function createLegend(layerList?: HTMLArcgisLayerListElement) {
    if (!layerList) return

    layerList.listItemCreatedFunction = (event) => {
      const { item } = event
      
      if (!item.layer) return

      if (item.layer.type !== "group") {
        item.panel = {
          content: "legend",
          open: true,
        }
      }
    }
  }

  return { createLegend }
}