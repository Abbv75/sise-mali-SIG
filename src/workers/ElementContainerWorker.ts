/* eslint-env worker */
// ─── MapElementsWorker — SISE-Mali-SIG ──────────────────────────────────────────
// Pattern inspiré de PDC2V/ElementContainerWorker.ts
// Traite les éléments de carte en chunks, construit popUpData, applique les styles

export interface MapElementStyle {
  iconName: string
  color: string
  bgColor: string
  size: number
}

export interface FieldKey {
  originaleName: string
  renamed?: string
}

export interface PopUpDataItem {
  label: string
  value: any
}

export interface ProcessedPoint {
  id: string | number
  coor: [number, number]
  data: Record<string, any>
  style: MapElementStyle
  popUpData: PopUpDataItem[]
}

interface WorkerInput {
  data: any[]
  fieldKeyListe: FieldKey[] | '*'
  layerStyle: MapElementStyle
  elementStyles: Record<string, MapElementStyle>
  idField: string       // ex: 'id_loca' ou 'id_zone_collecte'
  layerKey: string      // ex: 'localites' ou 'zones'
  chunkSize?: number
}

;(globalThis as any).onmessage = function (event: MessageEvent<WorkerInput>) {
  const {
    data,
    fieldKeyListe,
    layerStyle,
    elementStyles,
    idField,
    layerKey,
    chunkSize = 50,
  } = event.data

  if (!Array.isArray(data) || data.length === 0) {
    console.warn('Worker: aucune donnée à traiter.')
    return
  }

  const processedPoints: ProcessedPoint[] = []

  data.forEach((item: any, index: number) => {
    let lat = NaN
    let lng = NaN

    // ── Extraction des coordonnées (WKT, objet {lat,lng}, ou fallback Guinée)
    const coordField = item.coordonnee_loca ?? item.coordonnees ?? null

    if (coordField) {
      if (typeof coordField === 'string') {
        const match = coordField.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/)
        if (match) {
          lng = parseFloat(match[1])
          lat = parseFloat(match[2])
        }
      } else if (typeof coordField === 'object') {
        lat = parseFloat(coordField.lat)
        lng = parseFloat(coordField.lng)
      }
    } else if (item.latitude != null && item.longitude != null) {
      lat = parseFloat(String(item.latitude))
      lng = parseFloat(String(item.longitude))
    } else if (item.latitude_loca != null && item.longitude_loca != null) {
      lat = parseFloat(String(item.latitude_loca))
      lng = parseFloat(String(item.longitude_loca))
    } else if (item.latitude_zone != null && item.longitude_zone != null) {
      lat = parseFloat(String(item.latitude_zone))
      lng = parseFloat(String(item.longitude_zone))
    } else {
      // Pas de coordonnées disponibles, on ignore ce point.
      return
    }

    if (isNaN(lat) || isNaN(lng)) {
      console.warn('Worker: coordonnées invalides pour', item)
      return
    }

    // ── Construction du popUpData
    const popUpData: PopUpDataItem[] = []

    for (const key in item) {
      const field =
        fieldKeyListe === '*'
          ? { originaleName: key, renamed: key }
          : (fieldKeyListe as FieldKey[]).find((f) => f.originaleName === key)

      if (field) {
        popUpData.push({
          label: field.renamed || field.originaleName,
          value: item[key],
        })
      }
    }

    // ── Résolution du style : override individuel > style couche
    const elementId = `${layerKey}-${item[idField]}`
    const style = elementStyles[elementId] ?? layerStyle

    processedPoints.push({
      id: item[idField] ?? index,
      coor: [lat, lng],
      data: item,
      style,
      popUpData,
    })

    // ── Envoi par paquet
    if (
      processedPoints.length > 0 &&
      ((index + 1) % chunkSize === 0 || index + 1 === data.length)
    ) {
      ;(globalThis as any).postMessage(structuredClone(processedPoints))
      processedPoints.length = 0
    }
  })
}

export {}
