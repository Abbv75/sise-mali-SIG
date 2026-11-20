import { useMemo } from 'react'
import { ElementContainer } from '@/components/Cartographie/ElementContainer'
import { useLocaliteStore } from '@/stores/localite/useLocaliteStore'
import { useIconStore } from '@/stores/iconMap/useIconMapStore'
import { useMapStore } from '@/stores/map/useMapStore'
import { LOCALITE_FIELD_KEYS } from '@/types'
import { useGetLocalites } from '@/services/localiteService'

/**
 * Feature autonome — Affichage des localités sur la carte.
 * Lit directement les stores Zustand, aucun prop nécessaire.
 * Composé dans MapPanel comme une couche indépendante.
 */
export function LocaliteElement() {
  const { data: localitesRaw = [] } = useGetLocalites()
  const selectedLocaliteIds = useLocaliteStore((state) => state.selectedLocaliteIds)
  const layerStyle = useIconStore((state) => state.layerStyles.localites)
  const elementStyles = useIconStore((state) => state.elementStyles)
  const elementOrder = useMapStore((state) => state.elementOrder)

  const activeLocalites = useMemo(
    () => localitesRaw.filter(({id_loca}) => selectedLocaliteIds.has(id_loca)),
    [localitesRaw, selectedLocaliteIds]
  )

  return (
    <ElementContainer
      data={activeLocalites}
      fieldKeyListe={LOCALITE_FIELD_KEYS}
      show={activeLocalites.length > 0}
      layerStyle={layerStyle}
      elementStylesMap={elementStyles}
      elementOrder={elementOrder}
      idField="id_loca"
      layerKey="localites"
      tooltipField="intitule_loca"
    />
  )
}
