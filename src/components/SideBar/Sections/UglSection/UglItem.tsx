import { Eye, Settings2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Ugl } from '@/types'
import { useIconStore } from '@/stores/iconMap/useIconMapStore'
import { ICON_OPTIONS } from '@/components/CustomMapIcon'

interface UglItemProps {
  ugl: Ugl
  isSelected: boolean
  toggleUgl: (id: number) => void
}

export function UglItem({ ugl, isSelected, toggleUgl }: UglItemProps) {
  const elementId = `ugl-${ugl.id_ugl}`
  useIconStore((state) => state.layerStyles.ugls)
  useIconStore((state) => state.elementStyles[elementId])
  const resolveStyle = useIconStore((state) => state.resolveStyle)
  const setEditingId = useIconStore((state) => state.setEditingId)
  
  const style = resolveStyle('ugls', elementId)
  
  const PreviewIcon = ICON_OPTIONS[style.iconName as keyof typeof ICON_OPTIONS] || ICON_OPTIONS['building']

  // Ensure default colors are synced if they were empty
  const displayColor = style.bgColor || ugl.couleur_ugl || '#25a80b'

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(elementId)
  }

  return (
    <div className="flex items-center justify-between p-1 hover:bg-white/5 rounded group transition-colors">
      <div 
        className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
        onClick={() => toggleUgl(ugl.id_ugl)}
      >
        <button
          className={cn(
            "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
            isSelected ? "border-[#009460] bg-[#009460]" : "border-white/40 hover:border-white/60"
          )}
        >
          {isSelected && <Eye className="w-3 h-3 text-white" />}
        </button>

        <div className="flex items-center justify-center shrink-0 w-5 h-5 rounded" style={{ backgroundColor: displayColor }}>
          <PreviewIcon className="w-3.5 h-3.5" style={{ color: style.color || '#ffffff' }} />
        </div>

        <div className="flex flex-col min-w-0">
          <span className={cn(
            "text-[11px] truncate transition-colors",
            isSelected ? "text-white font-medium" : "text-white/70"
          )} title={ugl.nom_ugl}>
            {ugl.abrege_ugl || ugl.nom_ugl}
          </span>
          <span className="text-[9px] text-white/40 truncate">
            {ugl.chef_lieu_ugl?.intitule_loca || 'Sans chef-lieu'} • {ugl.region_concerne_ugl?.length || 0} région(s)
          </span>
        </div>
      </div>

      <button
        onClick={handleEditClick}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded shrink-0 transition-all"
        title="Personnaliser"
      >
        <Settings2 className="w-3.5 h-3.5 text-white/60 hover:text-white" />
      </button>
    </div>
  )
}
