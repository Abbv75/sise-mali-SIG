import { useIconStore } from '@/stores/iconMap/useIconMapStore'
import { useGetLocalites } from '@/services/localiteService'
import { useGetZonesCollecte } from '@/services/zoneService'

export function useElementEditorDrawer() {
  const editingId = useIconStore((state) => state.editingId)
  const setEditingId = useIconStore((state) => state.setEditingId)
  const setElementStyle = useIconStore((state) => state.setElementStyle)
  const setLayerStyle = useIconStore((state) => state.setLayerStyle)

  // Abonnements explicites pour garantir le re-rendu quand on bouge un slider
  useIconStore((state) => state.layerStyles)
  useIconStore((state) => state.elementStyles)
  const resolveStyle = useIconStore((state) => state.resolveStyle)

  const { data: localitesRaw = [] } = useGetLocalites()
  const { data: zonesRaw = [] } = useGetZonesCollecte()

  let layer: 'localites' | 'zones' | 'ugls' = 'localites'
  if (editingId?.startsWith('zone-')) layer = 'zones'
  else if (editingId?.startsWith('ugl-')) layer = 'ugls'

  const style = editingId ? resolveStyle(layer, editingId) : null

  let hasShapefile = false
  if (layer === 'localites' && editingId) {
    const id = parseInt(editingId.replace('localites-', ''), 10)
    const loc = localitesRaw.find((l) => l.id_loca === id)
    if (loc) {
      hasShapefile = Boolean(
        loc.shape_file && loc.shape_file !== 'null' && String(loc.shape_file).trim() !== ''
      )
    }
  } else if (layer === 'zones' && editingId) {
    const id = parseInt(editingId.replace('zone-', ''), 10)
    const z = zonesRaw.find((zone) => zone.id_zone_collecte === id)
    if (z) {
      hasShapefile = Boolean(
        z.shape_file && z.shape_file !== 'null' && String(z.shape_file).trim() !== ''
      )
    }
  }

  const isShapeMode = style?.displayMode === 'shape' && hasShapefile

  const applyToLayer = () => {
    if (style && layer) {
      setLayerStyle(layer, style)
      setEditingId(null)
    }
  }

  const onClose = () => setEditingId(null)

  return {
    editingId,
    style,
    layer,
    hasShapefile,
    isShapeMode,
    applyToLayer,
    onClose,
    setElementStyle,
  }
}
