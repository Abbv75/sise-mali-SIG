import { useMemo, useEffect } from 'react'
import { useMapStore } from '@/stores/map/useMapStore'
import { useLocaliteStore } from '@/stores/localite/useLocaliteStore'
import { useUglStore } from '@/stores/ugl/useUglStore'
import { useGetLocalites } from '@/services/localiteService'
import { useGetUgl } from '@/services/uglService'

export interface MapElementData {
  id: string
  label: string
  type: string
}

export function useActiveMapElements() {
  const elementOrder = useMapStore(state => state.elementOrder)
  const setElementOrder = useMapStore(state => state.setElementOrder)

  const { data: localitesRaw = [] } = useGetLocalites()
  const selectedLocaliteIds = useLocaliteStore(state => state.selectedLocaliteIds)

  const { data: uglsRaw = [] } = useGetUgl()
  const selectedUglIds = useUglStore(state => state.selectedUglIds)

  const activeItems = useMemo(() => {
    const items: MapElementData[] = []
    
    localitesRaw.forEach(l => {
      if (selectedLocaliteIds.has(l.id_loca)) {
        items.push({ id: `localites-${l.id_loca}`, label: l.intitule_loca, type: 'Localité' })
      }
    })

    uglsRaw.forEach(u => {
      if (selectedUglIds.has(u.id_ugl)) {
        items.push({ id: `ugl-${u.id_ugl}`, label: u.abrege_ugl || u.nom_ugl, type: 'UGL' })
      }
    })
    
    return items
  }, [localitesRaw, selectedLocaliteIds, uglsRaw, selectedUglIds])

  // Synchronisation globale de l'ordre
  useEffect(() => {
    const newElements = activeItems.filter(item => !elementOrder.includes(item.id))
    if (newElements.length > 0) {
      setElementOrder([...newElements.map(e => e.id), ...elementOrder])
    }
  }, [activeItems, elementOrder, setElementOrder])

  // Trier les items selon elementOrder
  const sortedItems = useMemo(() => {
    return [...activeItems].sort((a, b) => {
      let idxA = elementOrder.indexOf(a.id)
      let idxB = elementOrder.indexOf(b.id)
      if (idxA === -1) idxA = 999
      if (idxB === -1) idxB = 999
      return idxA - idxB
    })
  }, [activeItems, elementOrder])

  return { activeItems, sortedItems }
}
