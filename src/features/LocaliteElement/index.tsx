import { useMemo } from 'react'
import { Pane, Tooltip } from 'react-leaflet'
import { ElementContainer } from '@/components/Cartographie/ElementContainer'
import { AsyncShapefileLayer } from '@/components/Cartographie/AsyncShapefileLayer'
import { useLocaliteStore } from '@/stores/localite/useLocaliteStore'
import { useIconStore } from '@/stores/iconMap/useIconMapStore'
import { useMapStore } from '@/stores/map/useMapStore'
import { LOCALITE_FIELD_KEYS } from '@/types'
import { useGetLocalites } from '@/services/localiteService'

/**
 * Feature autonome — Affichage des localités sur la carte.
 * Prend en charge à la fois les shapefiles ZIP (.zip) pour les polygones
 * et les coordonnées géographiques pour les marqueurs points.
 */
export function LocaliteElement() {
  const { data: localitesRaw = [] } = useGetLocalites()
  const selectedLocaliteIds = useLocaliteStore((state) => state.selectedLocaliteIds)
  const layerStyle = useIconStore((state) => state.layerStyles.localites)
  const elementStyles = useIconStore((state) => state.elementStyles)
  const resolveStyle = useIconStore((state) => state.resolveStyle)
  const elementOrder = useMapStore((state) => state.elementOrder)

  const activeLocalites = useMemo(
    () => localitesRaw.filter(({ id_loca }) => selectedLocaliteIds.has(id_loca)),
    [localitesRaw, selectedLocaliteIds]
  )

  // Séparer les localités affichées sous forme de polygone shapefile et celles en points
  const { shapeLocalites, pointLocalites } = useMemo(() => {
    const shapeList: typeof activeLocalites = []
    const pointList: typeof activeLocalites = []

    activeLocalites.forEach((loc) => {
      const elementId = `localites-${loc.id_loca}`
      const style = resolveStyle('localites', elementId)
      const hasShapefile = Boolean(
        loc.shape_file && loc.shape_file !== 'null' && String(loc.shape_file).trim() !== ''
      )
      const hasCoords = loc.latitude_loca != null && loc.longitude_loca != null

      if (hasShapefile && (style.displayMode === 'shape' || !hasCoords)) {
        shapeList.push(loc)
      } else if (hasCoords) {
        pointList.push(loc)
      } else if (hasShapefile) {
        shapeList.push(loc)
      }
    })

    return { shapeLocalites: shapeList, pointLocalites: pointList }
  }, [activeLocalites, resolveStyle])

  return (
    <>
      {/* 1. Rendu des localités avec Shapefiles .zip */}
      {shapeLocalites.map((loc) => {
        const elementId = `localites-${loc.id_loca}`
        let orderIndex = elementOrder.indexOf(elementId)
        if (orderIndex === -1) orderIndex = 99
        const zIndex = 950 - orderIndex * 10
        const style = resolveStyle('localites', elementId)

        const shapeStyle = {
          fillColor: style.fillColor || style.bgColor || '#FCD116',
          fillOpacity: style.fillOpacity ?? 0.3,
          color: style.borderColor || '#D4AC0D',
          weight: style.borderWeight ?? 2,
        }

        const levelLabel =
          typeof loc.niveau_loca === 'object' && loc.niveau_loca
            ? loc.niveau_loca.libelle_nlc
            : ''

        const parentName =
          typeof loc.parent_loca === 'object' && loc.parent_loca
            ? loc.parent_loca.intitule_loca
            : ''

        return (
          <Pane key={elementId} name={elementId} style={{ zIndex }}>
            <AsyncShapefileLayer
              shapeFile={loc.shape_file as string}
              style={shapeStyle}
            >
              <Tooltip>
                <div className="font-semibold text-sm">{loc.intitule_loca}</div>
                {levelLabel && (
                  <div className="text-xs text-amber-500 font-medium">{levelLabel}</div>
                )}
                {parentName && (
                  <div className="text-[11px] text-gray-500">Rattaché à : {parentName}</div>
                )}
              </Tooltip>
            </AsyncShapefileLayer>
          </Pane>
        )
      })}

      {/* 2. Rendu des localités ponctuelles (points) */}
      <ElementContainer
        data={pointLocalites}
        fieldKeyListe={LOCALITE_FIELD_KEYS}
        show={pointLocalites.length > 0}
        layerStyle={layerStyle}
        elementStylesMap={elementStyles}
        elementOrder={elementOrder}
        idField="id_loca"
        layerKey="localites"
        tooltipField="intitule_loca"
      />
    </>
  )
}
