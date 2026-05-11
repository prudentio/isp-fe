type ArcgisMapProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLArcgisMapElement>,
  HTMLArcgisMapElement
> & {
  zoom?: number | string
  center?: string
  basemap?: string
  itemId?: string
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "arcgis-map": ArcgisMapProps

      "arcgis-zoom": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >

       "arcgis-chart"


      "arcgis-expand": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >

      "arcgis-layer-list": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >

      "arcgis-area-measurement-2d": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >

      "arcgis-distance-measurement-2d": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
      "arcgis-editor": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
      "arcgis-popup": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
       "arcgis-basemap-gallery": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >

      "calcite-label": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >

       "calcite-combobox": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >

      "calcite-panel"

      "calcite-select"

      "calcite-option"
    }
  }
}

export {}