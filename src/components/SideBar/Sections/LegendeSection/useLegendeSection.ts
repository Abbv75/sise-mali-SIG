import { useMemo, useState } from 'react'
import { useZoneStore } from '@/stores/zone/useZoneStore'
import { useLocaliteStore } from '@/stores/localite/useLocaliteStore'
import { useUglStore } from '@/stores/ugl/useUglStore'
import { useMapStore } from '@/stores/map/useMapStore'
import { useGetZonesCollecte } from '@/services/zoneService'
import { useGetLocalites } from '@/services/localiteService'
import { useGetUgl } from '@/services/uglService'

export interface LegendeItemData {
  id: string
  label: string
  type: 'zones' | 'localites' | 'ugls'
  hasShape?: boolean
  hasCoords?: boolean
}

export function useLegendeSection() {
  const elementOrder = useMapStore(state => state.elementOrder)

  const { data: zonesRaw = [] } = useGetZonesCollecte()
  const selectedZoneIds = useZoneStore(state => state.selectedZoneIds)

  const { data: localitesRaw = [] } = useGetLocalites()
  const selectedLocaliteIds = useLocaliteStore(state => state.selectedLocaliteIds)

  const { data: uglsRaw = [] } = useGetUgl()
  const selectedUglIds = useUglStore(state => state.selectedUglIds)

  const activeItems = useMemo(() => {
    const items: LegendeItemData[] = []

    zonesRaw.forEach(z => {
      if (selectedZoneIds.has(z.id_zone_collecte)) {
        const hasShape = Boolean(
          z.shape_file && z.shape_file !== 'null' && String(z.shape_file).trim() !== ''
        )
        const hasCoords =
          z.latitude_zone != null &&
          z.longitude_zone != null &&
          String(z.latitude_zone).trim() !== '' &&
          String(z.longitude_zone).trim() !== '' &&
          z.latitude_zone !== 'null' &&
          z.longitude_zone !== 'null' &&
          !isNaN(Number(z.latitude_zone)) &&
          !isNaN(Number(z.longitude_zone))

        items.push({
          id: `zone-${z.id_zone_collecte}`,
          label: z.nom_zone,
          type: 'zones',
          hasShape,
          hasCoords,
        })
      }
    })
    
    localitesRaw.forEach(l => {
      if (selectedLocaliteIds.has(l.id_loca)) {
        const hasShape = Boolean(
          l.shape_file && l.shape_file !== 'null' && String(l.shape_file).trim() !== ''
        )
        const hasCoords = l.latitude_loca != null && l.longitude_loca != null
        items.push({
          id: `localites-${l.id_loca}`,
          label: l.intitule_loca,
          type: 'localites',
          hasShape,
          hasCoords,
        })
      }
    })

    uglsRaw.forEach(u => {
      if (selectedUglIds.has(u.id_ugl)) {
        items.push({ id: `ugl-${u.id_ugl}`, label: u.abrege_ugl || u.nom_ugl, type: 'ugls' })
      }
    })
    
    return items
  }, [zonesRaw, selectedZoneIds, localitesRaw, selectedLocaliteIds, uglsRaw, selectedUglIds])

  const [searchTerm, setSearchTerm] = useState('')

  // Trier pour correspondre à l'ordre d'affichage
  const sortedItems = useMemo(() => {
    let items = [...activeItems].sort((a, b) => {
      let idxA = elementOrder.indexOf(a.id)
      let idxB = elementOrder.indexOf(b.id)
      if (idxA === -1) idxA = 999
      if (idxB === -1) idxB = 999
      return idxA - idxB
    })

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase()
      items = items.filter(item => item.label?.toLowerCase().includes(lower))
    }

    return items
  }, [activeItems, elementOrder, searchTerm])

  return {
    sortedItems,
    hasActiveItems: activeItems.length > 0,
    searchTerm,
    setSearchTerm,
  }
}

