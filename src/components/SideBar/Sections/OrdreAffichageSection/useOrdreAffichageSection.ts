import { useMapStore } from '@/stores/map/useMapStore'
import { useMemo, useState } from 'react'
import { useActiveMapElements, type MapElementData } from '@/hooks/useActiveMapElements'

export type OrdreAffichageItemData = MapElementData

export function useOrdreAffichageSection() {
  const setElementOrder = useMapStore(state => state.setElementOrder)
  const { activeItems, sortedItems: globallySortedItems } = useActiveMapElements()

  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // 3. Filtrer les éléments actifs pour l'affichage selon la recherche
  const sortedItems = useMemo(() => {
    let items = [...globallySortedItems]
    
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase()
      items = items.filter(item => item.label?.toLowerCase().includes(lower))
    }
    
    return items
  }, [globallySortedItems, searchTerm])

  // Actions de déplacement par boutons
  const moveUp = (index: number) => {
    if (index === 0) return
    const newOrder = [...sortedItems.map(item => item.id)]
    const temp = newOrder[index - 1]
    newOrder[index - 1] = newOrder[index]
    newOrder[index] = temp
    setElementOrder(newOrder)
  }

  const moveDown = (index: number) => {
    if (index === sortedItems.length - 1) return
    const newOrder = [...sortedItems.map(item => item.id)]
    const temp = newOrder[index + 1]
    newOrder[index + 1] = newOrder[index]
    newOrder[index] = temp
    setElementOrder(newOrder)
  }

  // --- Drag and Drop Logic ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) return
    
    const newOrder = [...sortedItems.map(item => item.id)]
    const draggedIdx = newOrder.indexOf(draggedId)
    const targetIdx = newOrder.indexOf(targetId)
    
    const [removed] = newOrder.splice(draggedIdx, 1)
    newOrder.splice(targetIdx, 0, removed)
    
    setElementOrder(newOrder)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnd = () => {
    setDraggedId(null)
  }

  return {
    sortedItems,
    hasActiveItems: activeItems.length > 0,
    draggedId,
    moveUp,
    moveDown,
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDragEnd,
    searchTerm,
    setSearchTerm,
  }
}
