import { useMemo } from 'react'
import { Pane, Tooltip } from 'react-leaflet'
import { ElementContainer } from '@/components/Cartographie/ElementContainer'
import { AsyncShapefileLayer } from '@/components/Cartographie/AsyncShapefileLayer'
import { useZoneStore } from '@/stores/zone/useZoneStore'
import { useIconStore } from '@/stores/iconMap/useIconMapStore'
import { useMapStore } from '@/stores/map/useMapStore'
import { ZONE_FIELD_KEYS } from '@/types'
import { useGetZonesCollecte } from '@/services/zoneService'

/**
 * Feature autonome — Affichage des zones agro-écologiques sur la carte.
 * Prend en charge les shapefiles ZIP (.zip) pour les polygones
 * et les coordonnées géographiques pour les marqueurs points.
 */
export function ZoneElement() {
  const { data: zonesRaw = [] } = useGetZonesCollecte()
  const selectedZoneIds = useZoneStore((state) => state.selectedZoneIds)
  const layerStyle = useIconStore((state) => state.layerStyles.zones)
  const elementStyles = useIconStore((state) => state.elementStyles)
  const resolveStyle = useIconStore((state) => state.resolveStyle)
  const elementOrder = useMapStore((state) => state.elementOrder)

  const activeZones = useMemo(
    () => zonesRaw.filter(({ id_zone_collecte }) => selectedZoneIds.has(id_zone_collecte)),
    [zonesRaw, selectedZoneIds]
  )

  // Séparer les zones affichées sous forme de polygone shapefile et celles en points
  const { shapeZones, pointZones } = useMemo(() => {
    const shapeList: typeof activeZones = []
    const pointList: typeof activeZones = []

    activeZones.forEach((zone) => {
      const elementId = `zone-${zone.id_zone_collecte}`
      const style = resolveStyle('zones', elementId)
      const hasShapefile = Boolean(
        zone.shape_file && zone.shape_file !== 'null' && String(zone.shape_file).trim() !== ''
      )
      const hasCoords =
        zone.latitude_zone != null &&
        zone.longitude_zone != null &&
        String(zone.latitude_zone).trim() !== '' &&
        String(zone.longitude_zone).trim() !== '' &&
        zone.latitude_zone !== 'null' &&
        zone.longitude_zone !== 'null' &&
        !isNaN(Number(zone.latitude_zone)) &&
        !isNaN(Number(zone.longitude_zone))

      if (hasShapefile && (style.displayMode === 'shape' || !hasCoords)) {
        shapeList.push(zone)
      } else if (hasCoords) {
        pointList.push(zone)
      } else if (hasShapefile) {
        shapeList.push(zone)
      }
    })

    return { shapeZones: shapeList, pointZones: pointList }
  }, [activeZones, resolveStyle])

  return (
    <>
      {/* 1. Rendu des zones avec Shapefiles .zip */}
      {shapeZones.map((zone) => {
        const elementId = `zone-${zone.id_zone_collecte}`
        let orderIndex = elementOrder.indexOf(elementId)
        if (orderIndex === -1) orderIndex = 99
        const zIndex = 960 - orderIndex * 10
        const style = resolveStyle('zones', elementId)

        const shapeStyle = {
          fillColor: style.fillColor || '#FCD116',
          fillOpacity: style.fillOpacity ?? 0.35,
          color: style.borderColor || '#D4AC0D',
          weight: style.borderWeight ?? 2,
        }

        return (
          <Pane key={elementId} name={elementId} style={{ zIndex }}>
            <AsyncShapefileLayer
              shapeFile={zone.shape_file as string}
              style={shapeStyle}
            >
              <Tooltip>
                <div className="font-semibold text-sm">{zone.nom_zone}</div>
                <div className="text-xs text-amber-500 font-medium">Zone agro-écologique</div>
                {zone.code_zone && (
                  <div className="text-[11px] text-gray-500">Code : {zone.code_zone}</div>
                )}
                {zone.type_zone != null && (
                  <div className="text-[11px] text-gray-500">Type : {zone.type_zone}</div>
                )}
              </Tooltip>
            </AsyncShapefileLayer>
          </Pane>
        )
      })}

      {/* 2. Rendu des zones ponctuelles (points) */}
      <ElementContainer
        data={pointZones}
        fieldKeyListe={ZONE_FIELD_KEYS}
        show={pointZones.length > 0}
        layerStyle={layerStyle}
        elementStylesMap={elementStyles}
        elementOrder={elementOrder}
        idField="id_zone_collecte"
        layerKey="zone"
        tooltipField="nom_zone"
      />
    </>
  )
}
