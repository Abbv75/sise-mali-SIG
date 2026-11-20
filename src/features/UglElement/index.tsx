import { memo, useMemo } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { useUglStore } from '@/stores/ugl/useUglStore'
import { useGetUgl } from '@/services/uglService'
import { useGetLocalites } from '@/services/localiteService'
import { useIconStore } from '@/stores/iconMap/useIconMapStore'
import { useMapStore } from '@/stores/map/useMapStore'
import { createCustomMapIcon } from '@/components/CustomMapIcon'

function UglElementComponent() {
  const selectedUglIds = useUglStore(state => state.selectedUglIds)
  const { data: uglsRaw = [] } = useGetUgl()
  const { data: localitesRaw = [] } = useGetLocalites()
  
  useIconStore(state => state.layerStyles.ugls)
  useIconStore(state => state.elementStyles)
  const resolveStyle = useIconStore(state => state.resolveStyle)

  // Memoize the mapping of id_loca to localite for quick lookup
  const localiteMap = useMemo(() => {
    const map = new Map()
    localitesRaw.forEach(loc => map.set(loc.id_loca, loc))
    return map
  }, [localitesRaw])

  const elementOrder = useMapStore(state => state.elementOrder)

  const selectedUgls = useMemo(() => {
    if (selectedUglIds.size === 0) return []
    const ugls = uglsRaw.filter(ugl => selectedUglIds.has(ugl.id_ugl))
    
    // Trier selon l'ordre global (du bas vers le haut)
    return ugls.sort((a, b) => {
      let idxA = elementOrder.indexOf(`ugl-${a.id_ugl}`)
      let idxB = elementOrder.indexOf(`ugl-${b.id_ugl}`)
      // S'ils ne sont pas dans le tableau, on les met à la fin
      if (idxA === -1) idxA = 9999
      if (idxB === -1) idxB = 9999
      // Ordre décroissant pour que le premier soit affiché au-dessus
      return idxB - idxA
    })
  }, [selectedUglIds, uglsRaw, elementOrder])

  return (
    <>
      {selectedUgls.map(ugl => {
        const elementId = `ugl-${ugl.id_ugl}`
        const style = resolveStyle('ugls', elementId)
        
        // Ensure color fallback
        const bgColor = style.bgColor || ugl.couleur_ugl || '#25a80b'
        
        const customIcon = createCustomMapIcon(
          style.iconName || 'building',
          style.color || '#ffffff',
          bgColor,
          style.size || 28
        )

        // On affiche toutes les régions de cette UGL qui ont des coordonnées (soit direct, soit via localitesRaw)
        const regionsToRender = ugl.region_concerne_ugl.map(region => {
          let lat = region.latitude_loca
          let lng = region.longitude_loca

          // Si null, on cherche dans le store complet des localités
          if (lat == null || lng == null) {
            const matchedLoc = localiteMap.get(region.id_loca)
            if (matchedLoc) {
              lat = matchedLoc.latitude_loca
              lng = matchedLoc.longitude_loca
            }
          }
          
          return { ...region, lat, lng }
        }).filter(r => r.lat != null && r.lng != null)

        return (
          <div key={`ugl-group-${ugl.id_ugl}`}>
            {regionsToRender.map(region => (
              <Marker
                key={`ugl-${ugl.id_ugl}-region-${region.id_loca}`}
                position={[region.lat!, region.lng!]}
                icon={customIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <strong className="block mb-1">{ugl.nom_ugl} ({ugl.abrege_ugl})</strong>
                    <div>Région: {region.intitule_loca}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </div>
        )
      })}
    </>
  )
}

export const UglElement = memo(UglElementComponent)
