import { ArrowUp, ArrowDown, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OrdreAffichageItemData } from './useOrdreAffichageSection'

interface OrdreAffichageItemProps {
  item: OrdreAffichageItemData
  idx: number
  isTop: boolean
  isBottom: boolean
  isDragging: boolean
  moveUp: (index: number) => void
  moveDown: (index: number) => void
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>, id: string) => void
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragEnd: () => void
}

export function OrdreAffichageItem({
  item,
  idx,
  isTop,
  isBottom,
  isDragging,
  moveUp,
  moveDown,
  handleDragStart,
  handleDragEnter,
  handleDragOver,
  handleDragEnd,
}: OrdreAffichageItemProps) {
  return (
    <div 
      draggable
      onDragStart={(e) => handleDragStart(e, item.id)}
      onDragEnter={(e) => handleDragEnter(e, item.id)}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      className={cn(
        "flex items-center justify-between px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg group transition-colors cursor-grab active:cursor-grabbing",
        isDragging ? "opacity-30 border-dashed bg-black/20" : "hover:bg-white/10"
      )}
    >
      <div className="flex items-center min-w-0 flex-1">
        <GripVertical className="w-3.5 h-3.5 text-white/30 mr-2 shrink-0 group-hover:text-white/70 transition-colors" />
        <div className="flex flex-col min-w-0 pr-2 flex-1">
          <span className="text-xs font-semibold text-white/95 truncate">
            {item.label}
          </span>
          <span className="text-[9px] text-white/50 font-medium uppercase tracking-wider">
            {item.type}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => moveUp(idx)}
          disabled={isTop}
          className={cn(
            "p-1 rounded-md transition-colors",
            isTop ? "opacity-30 cursor-not-allowed" : "hover:bg-white/20 text-white"
          )}
          title="Déplacer vers le haut"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => moveDown(idx)}
          disabled={isBottom}
          className={cn(
            "p-1 rounded-md transition-colors",
            isBottom ? "opacity-30 cursor-not-allowed" : "hover:bg-white/20 text-white"
          )}
          title="Déplacer vers le bas"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
