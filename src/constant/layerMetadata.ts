interface LayerMetadata {
  name: string
  link: string
}

export const layerMetadata: LayerMetadata[] = [
  {
    name: "coverage",
    link: import.meta.env.VITE_COVERAGE_LAYER_URL,
  },
  {
    name: "fiber_optic",
    link: import.meta.env.VITE_FIBER_OPTIC_LAYER_URL,
  },
  {
    name: "customer",
    link: import.meta.env.VITE_CUSTOMER_LAYER_URL,
  },
]
