import { useIconStore } from '@/stores/iconMap/useIconMapStore'
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
  
  const { data: zonesRaw = [] } = useGetZonesCollecte()

  let layer: 'zones' | 'localites' | 'ugls' = 'localites'
  if (editingId?.startsWith('zone-')) layer = 'zones'
  else if (editingId?.startsWith('ugl-')) layer = 'ugls'

  const style = editingId ? resolveStyle(layer, editingId) : null
  
  let hasShapefile = false
  if (layer === 'zones' && editingId) {
    const id = parseInt(editingId.replace('zone-', ''), 10)
    const zone = zonesRaw.find(z => z.id_zone_collecte === id)
    if (zone) {
      hasShapefile = zone.shape_file != null && zone.shape_file !== 'null' && (zone.shape_file as string).trim() !== ''
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
