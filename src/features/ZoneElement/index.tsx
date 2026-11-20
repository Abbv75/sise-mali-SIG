import { useMemo } from 'react'
import { Tooltip, Pane, Marker } from 'react-leaflet'
import { AsyncShapefileLayer } from '@/components/Cartographie/AsyncShapefileLayer'
import { useZoneStore } from '@/stores/zone/useZoneStore'
import { useMapStore } from '@/stores/map/useMapStore'
import { useIconStore } from '@/stores/iconMap/useIconMapStore'
import { useGetZonesCollecte } from '@/services/zoneService'
import { createCustomMapIcon } from '@/components/CustomMapIcon'

/**
 * Feature autonome — Affichage des zones de collecte sur la carte.
 * Lit les données via React Query et le store Zustand, aucun prop nécessaire.
 * Prend en charge les shapefiles au format .zip et les marqueurs points.
 */
export function ZoneElement() {
  const { data: zonesRaw = [] } = useGetZonesCollecte()
  const selectedZoneIds = useZoneStore((state) => state.selectedZoneIds)
  const elementOrder = useMapStore((state) => state.elementOrder)
  useIconStore((state) => state.layerStyles.zones)
  useIconStore((state) => state.elementStyles)
  const resolveStyle = useIconStore((state) => state.resolveStyle)

  const activeZones = useMemo(
    () => zonesRaw.filter((z) => selectedZoneIds.has(z.id_zone_collecte)),
    [zonesRaw, selectedZoneIds]
  )

  if (activeZones.length === 0) return null

  return (
    <>
      {activeZones.map((zone) => {
        const elementId = `zone-${zone.id_zone_collecte}`

        let orderIndex = elementOrder.indexOf(elementId)
        if (orderIndex === -1) orderIndex = 99
        // index 0 is visually at the top, so highest zIndex
        const zIndex = 1000 - orderIndex * 10

        const hasShapefile =
          zone.shape_file != null &&
          zone.shape_file !== 'null' &&
          String(zone.shape_file).trim() !== ''
        const style = resolveStyle('zones', elementId)
        const isShapeMode = style.displayMode === 'shape' && hasShapefile

        const shapeStyle = {
          fillColor: style.fillColor || '#FCD116',
          fillOpacity: style.fillOpacity ?? 0.25,
          color: style.borderColor || '#D4AC0D',
          weight: style.borderWeight ?? 2,
        }

        return (
          <Pane key={elementId} name={elementId} style={{ zIndex }}>
            {isShapeMode ? (
              <AsyncShapefileLayer
                shapeFile={zone.shape_file as string}
                style={shapeStyle}
              >
                <Tooltip>
                  <div className="font-semibold text-sm">{zone.nom_zone}</div>
                  <div className="text-xs text-gray-500">{zone.type_zone}</div>
                </Tooltip>
              </AsyncShapefileLayer>
            ) : zone.latitude_zone != null && zone.longitude_zone != null ? (
              <Marker
                position={[zone.latitude_zone, zone.longitude_zone]}
                icon={createCustomMapIcon(
                  style.iconName,
                  style.color,
                  style.bgColor,
                  style.size
                )}
              >
                <Tooltip>
                  <div className="font-semibold text-sm">{zone.nom_zone}</div>
                  <div className="text-xs text-gray-500">{zone.type_zone}</div>
                </Tooltip>
              </Marker>
            ) : hasShapefile ? (
              <AsyncShapefileLayer
                shapeFile={zone.shape_file as string}
                style={shapeStyle}
              >
                <Tooltip>
                  <div className="font-semibold text-sm">{zone.nom_zone}</div>
                  <div className="text-xs text-gray-500">{zone.type_zone}</div>
                </Tooltip>
              </AsyncShapefileLayer>
            ) : null}
          </Pane>
        )
      })}
    </>
  )
}
