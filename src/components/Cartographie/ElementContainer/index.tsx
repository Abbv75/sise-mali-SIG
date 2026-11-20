import { useCallback, useEffect, useRef, useState } from 'react'
import { Marker, Popup, Tooltip } from 'react-leaflet'
import type { MapElementStyle, FieldKey, ProcessedPoint } from '@/types'
import { createCustomMapIcon } from '@/components/CustomMapIcon'
import { PopUpContent } from './PopUpContent'

interface ElementContainerProps {
  data: any[]
  fieldKeyListe: FieldKey[] | '*'
  show?: boolean
  // Style de la couche (défaut pour tous les points)
  layerStyle: MapElementStyle
  // Overrides par élément individuel (clé = "localites-101", etc.)
  elementStylesMap?: Record<string, MapElementStyle>
  // Ordre d'affichage
  elementOrder?: string[]
  // Identifiant unique dans la donnée (ex: 'id_loca')
  idField?: string
  // Clé de la couche pour construire l'elementId (ex: 'localites')
  layerKey?: string
  // Champ affiché dans le tooltip au survol
  tooltipField?: string
  // Champs à afficher dans la popup (si non défini, affiche tout)
  selectedFields?: string[]
}

/**
 * Composant générique de rendu de points sur la carte.
 * Pattern inspiré de PDC2V/ElementContainer :
 * - Worker géré proprement avec mountedRef, loadPointRef, cleanWorker
 * - Reset avant chaque run
 * - Envoi par chunks pour affichage progressif
 */
export function ElementContainer({
  data,
  fieldKeyListe,
  show = true,
  layerStyle,
  elementStylesMap = {},
  elementOrder = [],
  idField = 'id',
  layerKey = 'element',
  tooltipField,
  selectedFields,
}: ElementContainerProps) {
  const [processedPoints, setProcessedPoints] = useState<ProcessedPoint[]>([])
  const workerRef = useRef<Worker | null>(null)
  const mountedRef = useRef(true)
  const loadPointRef = useRef<(() => void) | null>(null)

  // ── Cleanup propre du worker
  const cleanWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
    }
  }, [])

  // ── Lancement du worker
  const loadPoint = useCallback(() => {
    if (!mountedRef.current) return

    cleanWorker()

    try {
      const worker = new Worker(
        new URL('@/workers/ElementContainerWorker.ts', import.meta.url),
        { type: 'module' }
      )
      workerRef.current = worker

      worker.postMessage({
        data,
        fieldKeyListe,
        layerStyle,
        elementStyles: elementStylesMap,
        idField,
        layerKey,
        chunkSize: 50,
      })

      worker.onmessage = (event: MessageEvent<ProcessedPoint[]>) => {
        if (!mountedRef.current) return
        setProcessedPoints((prev) => [...prev, ...event.data])
      }

      worker.onerror = (err) => {
        console.error('ElementContainer Worker error:', err)
      }
    } catch (err) {
      console.error('ElementContainer: impossible de créer le worker', err)
    }
  }, [data, fieldKeyListe, layerStyle, elementStylesMap, idField, layerKey, cleanWorker])

  // Garder la ref à jour sans recréer les effets
  useEffect(() => {
    loadPointRef.current = loadPoint
  }, [loadPoint])

  // Cleanup au unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      cleanWorker()
    }
  }, [cleanWorker])

  // Relancer le worker quand les données ou le style changent
  useEffect(() => {
    if (show) {
      setProcessedPoints([])
      loadPointRef.current?.()
    } else {
      setProcessedPoints([])
      cleanWorker()
    }
  }, [show, data, layerStyle, elementStylesMap, cleanWorker])

  if (!show) return null

  return (
    <>
      {processedPoints.map((point) => {
        const elementId = `${layerKey}-${point.id}`
        let orderIndex = elementOrder.indexOf(elementId)
        if (orderIndex === -1) orderIndex = 99
        // index 0 is visually at the top, so highest zIndexOffset
        const zIndexOffset = 1000 - orderIndex * 10

        return (
          <Marker
            key={elementId}
            position={point.coor}
            zIndexOffset={zIndexOffset}
            icon={createCustomMapIcon(
              point.style.iconName,
              point.style.color,
              point.style.bgColor,
              point.style.size
            )}
          >
            {/* Tooltip au survol */}
            {tooltipField && (
              <Tooltip direction="top" offset={[0, -point.style.size]} opacity={1}>
                <span className="font-semibold text-sm">
                  {point.data[tooltipField] ?? ''}
                </span>
              </Tooltip>
            )}

            {/* Popup au clic */}
            <Popup>
              <PopUpContent popUpData={point.popUpData} selectedFields={selectedFields} />
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}
