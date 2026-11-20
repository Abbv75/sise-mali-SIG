import { useIconStore } from '@/stores/iconMap/useIconMapStore'
import { ICON_OPTIONS } from '@/components/CustomMapIcon'
import type { LegendeItemData } from './useLegendeSection'

interface LegendeItemProps {
  item: LegendeItemData
}

export function LegendeItem({ item }: LegendeItemProps) {
  const resolveStyle = useIconStore(state => state.resolveStyle)
  const style = resolveStyle(item.type, item.id)
  const Icon = ICON_OPTIONS[style.iconName as keyof typeof ICON_OPTIONS] || ICON_OPTIONS['map-pin']
  
  return (
    <div className="flex items-center gap-3 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg">
      {style.displayMode === 'shape' ? (
        <div 
          className="rounded-sm shrink-0"
          style={{ 
            backgroundColor: style.fillColor || '#009460', 
            opacity: style.fillOpacity ?? 0.2,
            border: `${Math.max(1, (style.borderWeight ?? 2) / 2)}px solid ${style.borderColor || '#009460'}`,
            width: 24, 
            height: 24 
          }}
        />
      ) : (
        <div 
          className="flex items-center justify-center rounded-full shadow-sm shrink-0"
          style={{ 
            backgroundColor: style.bgColor, 
            width: 24, 
            height: 24 
          }}
        >
          <Icon 
            style={{ color: style.color, width: 14, height: 14 }} 
          />
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-semibold text-white/95 truncate">
          {item.label}
        </span>
        <span className="text-[9px] text-white/50 font-medium uppercase tracking-wider">
          {item.type === 'zones' ? 'Zone de collecte' : 'Localité'}
        </span>
      </div>
    </div>
  )
}
