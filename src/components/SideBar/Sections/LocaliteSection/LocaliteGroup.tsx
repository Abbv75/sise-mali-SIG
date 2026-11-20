import React, { useState, useMemo } from 'react'
import { ChevronDown, CheckSquare, Square, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LocaliteItem } from './LocaliteItem'
import type { Localite } from '@/types/localite'

interface LocaliteGroupProps {
  groupName: string
  levelRank?: number
  locs: Localite[]
  isOpen: boolean
  selectedLocaliteIds: Set<number>
  toggleGroup: (name: string) => void
  toggleGroupSelection: (e: React.MouseEvent, locs: Localite[]) => void
  toggleLocalite: (id: number) => void
}

export function LocaliteGroup({
  groupName,
  levelRank,
  locs,
  isOpen,
  selectedLocaliteIds,
  toggleGroup,
  toggleGroupSelection,
  toggleLocalite,
}: LocaliteGroupProps) {
  const [localSearch, setLocalSearch] = useState('')

  const filteredLocs = useMemo(() => {
    if (!localSearch.trim()) return locs
    const lower = localSearch.toLowerCase()
    return locs.filter(
      (l) =>
        l.intitule_loca?.toLowerCase().includes(lower) ||
        l.code_loca?.toLowerCase().includes(lower) ||
        (typeof l.parent_loca === 'object' &&
          l.parent_loca?.intitule_loca?.toLowerCase().includes(lower))
    )
  }, [locs, localSearch])

  const validLocs = filteredLocs.filter(
    (l) =>
      (l.latitude_loca != null && l.longitude_loca != null) ||
      (l.shape_file != null && l.shape_file !== 'null' && String(l.shape_file).trim() !== '')
  )
  const selectedCount = locs.filter((l) => selectedLocaliteIds.has(l.id_loca)).length
  const allSelected = validLocs.length > 0 && validLocs.every((l) => selectedLocaliteIds.has(l.id_loca))

  const handleGroupSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleGroupSelection(e, filteredLocs)
  }

  return (
    <div className="rounded-lg overflow-hidden border border-white/10 bg-white/[0.02]">
      {/* Header collapsible */}
      <div
        onClick={() => toggleGroup(groupName)}
        className="w-full flex items-center justify-between px-3 py-2 bg-black/25 hover:bg-black/35 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          <ChevronDown
            className={cn(
              'w-3.5 h-3.5 text-white/50 shrink-0 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
          <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider truncate">
            {groupName}
          </span>
          {levelRank != null && levelRank < 900 && (
            <span className="text-[9px] font-semibold text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded border border-amber-400/30 shrink-0">
              Niv. {levelRank}
            </span>
          )}
          <span className="text-[10px] text-white/40 shrink-0">
            {selectedCount}/{locs.length}
          </span>
        </div>

        {/* Bouton tout sélectionner/désélectionner */}
        <button
          onClick={handleGroupSelection}
          disabled={validLocs.length === 0}
          className="shrink-0 ml-2 p-1 rounded hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          title={allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
        >
          {allSelected ? (
            <CheckSquare className="w-3.5 h-3.5 text-[#FCD116]" />
          ) : (
            <Square className="w-3.5 h-3.5 text-white/40" />
          )}
        </button>
      </div>

      {/* Contenu collapsible */}
      {isOpen && (
        <div className="space-y-1 p-1.5 bg-black/10">
          {locs.length > 5 && (
            <div className="relative mb-1 mx-1 mt-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40" />
              <input
                type="text"
                placeholder={`Rechercher dans ${groupName.toLowerCase()}...`}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-white/5 border border-white/10 rounded pl-7 pr-2 py-1 text-[11px] text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#FCD116] transition-shadow"
              />
            </div>
          )}

          {locs.length === 0 ? (
            <div className="text-[10px] text-white/40 italic px-3 py-2 text-center">
              Aucune localité configurée dans ce niveau
            </div>
          ) : filteredLocs.length === 0 ? (
            <div className="text-[10px] text-white/40 italic px-2 py-1">Aucune correspondance</div>
          ) : (
            <div className="space-y-0.5">
              {filteredLocs.map((loc) => (
                <LocaliteItem
                  key={loc.id_loca}
                  loc={loc}
                  isSelected={selectedLocaliteIds.has(loc.id_loca)}
                  toggleLocalite={toggleLocalite}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
