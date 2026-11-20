import { Settings2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useIconStore } from '@/stores/iconMap/useIconMapStore'
import type { Localite } from '@/types/localite'

interface LocaliteItemProps {
  loc: Localite
  isSelected: boolean
  toggleLocalite: (id: number) => void
}

export function LocaliteItem({ loc, isSelected, toggleLocalite }: LocaliteItemProps) {
  const elementId = `localites-${loc.id_loca}`
  const hasCoords = loc.latitude_loca != null && loc.longitude_loca != null
  const hasShape =
    loc.shape_file != null && loc.shape_file !== 'null' && String(loc.shape_file).trim() !== ''
  const isValid = hasCoords || hasShape

  const editingId = useIconStore((state) => state.editingId)
  const setEditingId = useIconStore((state) => state.setEditingId)

  // Parent name resolution
  const parentName =
    typeof loc.parent_loca === 'object' && loc.parent_loca
      ? loc.parent_loca.intitule_loca
      : null

  return (
    <div className="flex flex-col">
      <div
        onClick={() => isValid && toggleLocalite(loc.id_loca)}
        className={cn(
          'flex items-center justify-between gap-3 rounded-md px-3 py-2 transition-all group',
          isValid ? 'cursor-pointer hover:bg-white/5' : 'cursor-not-allowed opacity-55',
          isSelected && isValid ? 'bg-white/10 ring-1 ring-white/10' : ''
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 pointer-events-none">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: isSelected ? '#FCD116' : 'rgba(255,255,255,0.2)' }}
          />
          <div className="flex-1 min-w-0 text-xs font-medium text-white/95">
            <div className="truncate font-medium">{loc.intitule_loca}</div>
            {parentName && (
              <div className="text-[10px] text-white/50 truncate font-normal leading-tight mt-0.5">
                Rattaché à : {parentName}
              </div>
            )}
          </div>
          {!isValid && (
            <span
              className="text-[9px] text-amber-300/80 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 shrink-0 font-normal"
              title="Coordonnées géographiques non encore renseignées"
            >
              Non géolocalisé
            </span>
          )}
        </div>

        <div className="flex-shrink-0 flex items-center gap-2">
          {isValid && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setEditingId(editingId === elementId ? null : elementId)
              }}
              className="p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-white/20 transition-all"
              title="Personnaliser l'icône"
            >
              <Settings2 className="w-3.5 h-3.5 text-white/70" />
            </button>
          )}
          <div className="pointer-events-none">
            <Switch
              checked={isSelected}
              disabled={!isValid}
              onCheckedChange={() => {}}
              className={isSelected ? '!bg-[#FCD116]' : ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
