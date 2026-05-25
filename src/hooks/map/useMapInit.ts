
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import ArcGisMap from "@arcgis/core/Map"
import { layerMetadata } from "../../constant/layerMetadata"
import { useNotificationStore } from "../notification"
import { EditEnum, NotificationEntityEnum } from "../../service/notification/model"
import { NotificationService } from "../../service/notification"
import Graphic from "@arcgis/core/Graphic"
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine"
import PopupTemplate from "@arcgis/core/PopupTemplate"
import ArcadeExpressionInfo from "@arcgis/core/popup/ExpressionInfo"
import type { FeatureEditResult } from "@arcgis/core/editing/types"

type MapInitParams = LayerRefs & {
  mapRef: React.RefObject<HTMLArcgisMapElement | null>
  layerListRef: React.RefObject<HTMLArcgisLayerListElement | null>

  createLegend: (layerList: HTMLArcgisLayerListElement) => void
  createMeasurement: (el: HTMLArcgisMapElement) => void
}

type LayerRefs = {
  fiberLayerRef: React.RefObject<FeatureLayer | null>
  customerLayerRef: React.RefObject<FeatureLayer | null>
  coverageAreaRef: React.RefObject<FeatureLayer | null>
}

type CreateFeatureLayersParams = LayerRefs & {
  featureLayers: FeatureLayer[]
}

export function useMapInit({
  mapRef,
  layerListRef,
  fiberLayerRef,
  customerLayerRef,
  coverageAreaRef,
  createLegend,
  createMeasurement,
}: MapInitParams) {
    function initMap(){
          const el = mapRef.current
  if (!el) return

  const featureLayers: FeatureLayer[] = []

  createFeatureLayers({
    featureLayers,
    fiberLayerRef,
    customerLayerRef,
    coverageAreaRef,
  })

  const map = new ArcGisMap({
    basemap: "streets-vector",
    layers: featureLayers,
  })

  el.viewOnReady().then(() => {
    el.map = map

    createMeasurement(el)
    
    if (!layerListRef.current) {
      return
    }

    createLegend(layerListRef.current)
  })
    }
    return { initMap }
}

function createFeatureLayers({
  featureLayers,
  fiberLayerRef,
  customerLayerRef,
  coverageAreaRef,
}: CreateFeatureLayersParams) {
  for (const layer of layerMetadata) {
    const isFiber = layer.name.toLowerCase().includes("fiber")
    const isCustomer = layer.name.toLowerCase().includes("customer")
    const isCoverage = layer.name.toLowerCase().includes("coverage")

    const featureLayer = new FeatureLayer({
      url: layer.link,
      title: layer.name,
      editingEnabled: true,
      popupEnabled: isCoverage,
    })

    featureLayers.push(featureLayer)

    if (isFiber) fiberLayerRef.current = featureLayer
    if (isCustomer) customerLayerRef.current = featureLayer
    if (isCoverage) {
      coverageAreaRef.current = featureLayer
      featureLayer.popupTemplate = createCoveragePopup()
    }

    featureLayer.on("edits", async (event) => {
        const { addedFeatures, updatedFeatures } = event

        const coverageLayer = coverageAreaRef.current
        const customerLayer = featureLayer
        if (!coverageLayer) return

        await handleUpdated(updatedFeatures)

        const addedIds = addedFeatures.map((f) => f.objectId).filter(Boolean)
        if (!addedIds.length) return

        const { customers, coverage } = await fetchData(
            customerLayer,
            coverageLayer,
            addedIds as number[]
        )

        const { toDelete, coverageUpdates } = await process(customers, coverage, customerLayer)

        if (await rollbackIfNeeded(toDelete, customerLayer)) return

        await updateCoverage(coverageLayer, coverageUpdates)
    })
  }
}

async function rollbackIfNeeded(toDelete: number[], customerLayer: FeatureLayer) {
  if (!toDelete.length) return false

  await customerLayer.applyEdits({
    deleteFeatures: toDelete.map((id) => ({ objectId: id })),
  })

  await Promise.allSettled(
    toDelete.map((id) =>
      NotificationService.sendNotification({
        id: String(id),
        entity: NotificationEntityEnum.POINT,
        action: EditEnum.DELETED,
      })
    )
  )

  useNotificationStore.getState().bumpVersion()

  return true
}

async function updateCoverage(
  coverageLayer: FeatureLayer,
  updates: Map<number, number>
) {
  const features: Graphic[] = Array.from(updates.entries()).map(
    ([id, value]) =>
      new Graphic({
        attributes: {
          ObjectId: id,
          current_customer: value,
        },
      })
  )

  if (!features.length) return

  await coverageLayer.applyEdits({
    updateFeatures: features,
  })

  useNotificationStore.getState().bumpVersion()
}

async function handleUpdated(updatedFeatures: FeatureEditResult[]) {
  if (!updatedFeatures.length) return

  await Promise.allSettled(
    updatedFeatures.map((f) =>
      NotificationService.sendNotification({
        id: String(f.objectId),
        entity: NotificationEntityEnum.POINT,
        action: EditEnum.UPDATED,
      })
    )
  )

  useNotificationStore.getState().bumpVersion()
}

async function fetchData(
  customerLayer: FeatureLayer,
  coverageLayer: FeatureLayer,
  ids: number[]
) {
  const customerQuery = customerLayer.createQuery()
  customerQuery.objectIds = ids
  customerQuery.returnGeometry = true
  customerQuery.outFields = ["*"]

  const customerResult = await customerLayer.queryFeatures(customerQuery)

  const coverageQuery = coverageLayer.createQuery()
  coverageQuery.returnGeometry = true
  coverageQuery.outFields = ["*"]

  const coverageResult = await coverageLayer.queryFeatures(coverageQuery)

  return {
    customers: customerResult.features,
    coverage: coverageResult.features,
  }
}

async function process(customers: Graphic[], coverage: Graphic[], customerLayer: FeatureLayer) {
  const toDelete: number[] = []
  const coverageUpdates = new Map<number, number>()

  for (const c of customers) {
    const geom = c.geometry
    if (!geom) continue

    const id = c.attributes.ObjectId

    try {
      await NotificationService.sendNotification({
        id: String(id),
        entity: NotificationEntityEnum.POINT,
        action: EditEnum.CREATED,
      })
    } catch {
        console.error("failed to send notification")
    }

    for (const cov of coverage) {
      if(!cov.geometry) continue
      if (!geometryEngine.intersects(cov.geometry, geom)) continue

      const count = await customerLayer.queryFeatures({
        geometry: cov.geometry,
        spatialRelationship: "intersects",
        returnGeometry: false,
        where: "1=1",
      })

      const current = count.features.length ?? []
      const max = cov.attributes.max_customer

      if (current > max) {
        toDelete.push(id)
      } else{
        coverageUpdates.set(cov.attributes.ObjectId, current)
      }     
    }
  }

  return { toDelete, coverageUpdates }
}

function createCoveragePopup() {
  return new PopupTemplate({
    title: "Coverage Area",
    expressionInfos: [
      new ArcadeExpressionInfo({
        name: "statusExpr",
        title: "Status",
        expression: `
          IIF(
            $feature.current_customer > $feature.max_customer,
            "OVER CAPACITY",
            IIF(
              $feature.current_customer == $feature.max_customer,
              "FULL CAPACITY",
              "OK"
            )
          )
        `,
      }),
    ],
    content: [
      {
        type: "fields",
        fieldInfos: [
          { fieldName: "current_customer" },
          { fieldName: "max_customer" },
        ],
      },
      {
        type: "text",
        text: "Status: {expression/statusExpr}",
      },
    ],
  })
}
