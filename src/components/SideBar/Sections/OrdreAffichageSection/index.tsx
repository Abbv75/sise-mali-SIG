import { Search } from 'lucide-react'
import { useOrdreAffichageSection } from './useOrdreAffichageSection'
import { OrdreAffichageItem } from './OrdreAffichageItem'

export function OrdreAffichageSection() {
  const {
    sortedItems,
    hasActiveItems,
    draggedId,
    moveUp,
    moveDown,
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDragEnd,
    searchTerm,
    setSearchTerm,
  } = useOrdreAffichageSection()

  if (!hasActiveItems) {
    return <div className="text-xs text-white/40 italic mt-2">Aucun élément sélectionné</div>
  }

  return (
    <div className="flex flex-col space-y-2 mt-1">
      <div className="text-[10px] text-white/50 mb-1 leading-tight">
        Modifiez l'ordre avec les flèches ou par glisser-déposer.
      </div>
      
      <div className="relative mb-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#009460] transition-shadow"
        />
      </div>
      
      {sortedItems.length === 0 ? (
        <div className="text-xs text-white/40 italic px-2 py-2">Aucun élément trouvé</div>
      ) : (
        <div className="space-y-1.5 max-h-64 overflow-y-auto carto-panel-scroll pr-1 pb-1">
          {sortedItems.map((item, idx) => (
            <OrdreAffichageItem
              key={item.id}
              item={item}
              idx={idx}
              isTop={idx === 0}
              isBottom={idx === sortedItems.length - 1}
              isDragging={draggedId === item.id}
              moveUp={moveUp}
              moveDown={moveDown}
              handleDragStart={handleDragStart}
              handleDragEnter={handleDragEnter}
              handleDragOver={handleDragOver}
              handleDragEnd={handleDragEnd}
            />
          ))}
        </div>
      )}
    </div>
  )
}
