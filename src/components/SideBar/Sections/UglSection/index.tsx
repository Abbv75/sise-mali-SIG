import { useState } from 'react'
import { Loader2, CheckSquare, Square, Search, Building2, ChevronDown } from 'lucide-react'
import { useUglSection } from './useUglSection'
import { UglItem } from './UglItem'
import { cn } from '@/lib/utils'

export function UglSection() {
  const {
    uglsRaw,
    selectedUglIds,
    toggleUgl,
    uglsLoading,
    searchTerm,
    setSearchTerm,
    filteredUgls,
    allUglsSelected,
    handleToggleAll,
    hasValidUgls,
  } = useUglSection()

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-black/20 hover:bg-black/30 transition-colors cursor-pointer rounded-lg border border-white/10"
      >
        <div className="flex items-center gap-2 min-w-0">
          <ChevronDown
            className={cn(
              'w-3.5 h-3.5 text-white/50 shrink-0 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
          <Building2 className="w-3.5 h-3.5 text-white/50" />
          <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider truncate">
            Unités de Gestion (UGL)
          </span>
          <span className="text-[10px] text-white/40 shrink-0">
            {selectedUglIds.size}/{uglsRaw.length}
          </span>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleToggleAll()
          }}
          disabled={!hasValidUgls}
          className="shrink-0 ml-2 p-1 rounded hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          title={allUglsSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
        >
          {allUglsSelected ? (
            <CheckSquare className="w-3.5 h-3.5 text-[#009460]" />
          ) : (
            <Square className="w-3.5 h-3.5 text-white/40" />
          )}
        </button>
      </div>
      
      {isOpen && (
        <div className="mt-2 space-y-1.5 border-l border-white/10 ml-3 pl-3">
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Rechercher une UGL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#009460] transition-shadow"
            />
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto carto-panel-scroll pr-1 pb-1">
            {uglsLoading ? (
              <div className="flex items-center gap-2 px-2 py-3 text-white/50 text-xs">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Chargement...
              </div>
            ) : filteredUgls.length === 0 ? (
              <div className="text-xs text-white/40 italic px-2 py-2">Aucune UGL trouvée</div>
            ) : (
              filteredUgls.map((ugl) => (
                <UglItem
                  key={ugl.id_ugl}
                  ugl={ugl}
                  isSelected={selectedUglIds.has(ugl.id_ugl)}
                  toggleUgl={toggleUgl}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
