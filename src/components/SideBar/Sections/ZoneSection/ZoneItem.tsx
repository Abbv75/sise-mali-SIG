import { Settings2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useIconStore } from '@/stores/iconMap/useIconMapStore'
import type { ZoneCollecteTable } from '@/types/zoneCollecte'

interface ZoneItemProps {
  zone: ZoneCollecteTable
  isSelected: boolean
  toggleZone: (id: number) => void
}

export function ZoneItem({ zone, isSelected, toggleZone }: ZoneItemProps) {
  const hasShapefile = Boolean(
    zone.shape_file != null &&
    zone.shape_file !== 'null' &&
    String(zone.shape_file).trim() !== ''
  )
  const hasCoords =
    zone.latitude_zone != null &&
    zone.longitude_zone != null &&
    String(zone.latitude_zone).trim() !== '' &&
    String(zone.longitude_zone).trim() !== '' &&
    zone.latitude_zone !== 'null' &&
    zone.longitude_zone !== 'null' &&
    !isNaN(Number(zone.latitude_zone)) &&
    !isNaN(Number(zone.longitude_zone))
  const isValid = hasShapefile || hasCoords
  const elementId = `zone-${zone.id_zone_collecte}`

  const editingId = useIconStore((state) => state.editingId)
  const setEditingId = useIconStore((state) => state.setEditingId)

  return (
    <div className="flex flex-col">
      <div
        onClick={() => {
          if (isValid) toggleZone(zone.id_zone_collecte)
        }}
        className={cn(
          'flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-all group',
          !isValid ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/5',
          isSelected && isValid ? 'bg-white/10 ring-1 ring-white/10 shadow-sm' : ''
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 pointer-events-none">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: isSelected ? '#FCD116' : 'rgba(255,255,255,0.2)' }}
          />
          <div className="flex-1 min-w-0 text-xs font-medium text-white/95 truncate">
            <div className="truncate font-medium">{zone.nom_zone}</div>
            <div className="text-[10px] text-white/50 truncate font-normal leading-tight mt-0.5">
              {zone.code_zone && <span>Code : {zone.code_zone}</span>}
              {zone.code_zone && zone.type_zone != null && <span> • </span>}
              {zone.type_zone != null && <span>Type : {zone.type_zone}</span>}
              {hasShapefile && hasCoords && (
                <span className="ml-1 text-emerald-300/80 font-medium">• Forme & Point</span>
              )}
              {hasShapefile && !hasCoords && (
                <span className="ml-1 text-sky-300/80 font-medium">• Forme</span>
              )}
              {!hasShapefile && hasCoords && (
                <span className="ml-1 text-amber-300/80 font-medium">• Point</span>
              )}
            </div>
          </div>
          {!isValid && (
            <span
              className="text-[9px] text-amber-300/80 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 shrink-0 font-normal"
              title="Données géométriques non encore renseignées"
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
              title="Personnaliser l'affichage"
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
