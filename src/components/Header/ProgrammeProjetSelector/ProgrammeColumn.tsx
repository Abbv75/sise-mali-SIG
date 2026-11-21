import { Search, X, Loader2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Programme } from '@/types/programmeProjet'

interface ProgrammeColumnProps {
  programmes: Programme[]
  isLoading: boolean
  search: string
  setSearch: (value: string) => void
  viewedProgrammeId: number | null
  selectedProgrammeId?: number
  onViewProgramme: (id: number) => void
  isSplit: boolean
}

export function ProgrammeColumn({
  programmes,
  isLoading,
  search,
  setSearch,
  viewedProgrammeId,
  selectedProgrammeId,
  onViewProgramme,
  isSplit,
}: ProgrammeColumnProps) {
  return (
    <div
      className={cn(
        'flex flex-col min-h-0 p-4 transition-all',
        isSplit ? 'w-full md:w-1/2' : 'w-full'
      )}
    >
      {/* En-tête */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-white">
          Programmes
        </span>
        <span className="text-[11px] text-white/50">
          {programmes.length} programme(s)
        </span>
      </div>

      {/* Recherche */}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
        <input
          type="text"
          placeholder="Rechercher un programme..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black/20 border border-white/15 rounded-md pl-8 pr-7 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#FCD116]"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Liste des programmes */}
      <div className="flex-1 min-h-0 overflow-y-auto carto-panel-scroll space-y-1 pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-white/60 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-[#FCD116]" />
            <span>Chargement...</span>
          </div>
        ) : programmes.length === 0 ? (
          <div className="py-10 text-center text-white/40 text-xs italic">
            {search ? 'Aucun programme trouvé' : 'Aucun programme disponible'}
          </div>
        ) : (
          programmes.map((prog) => {
            const isViewed = viewedProgrammeId === prog.id_programme
            const isSelected = selectedProgrammeId === prog.id_programme

            return (
              <div
                key={prog.id_programme}
                onClick={() => onViewProgramme(prog.id_programme)}
                className={cn(
                  'flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors text-left border',
                  isViewed
                    ? 'bg-white/15 border-white/30 text-white shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 border-transparent text-white/85'
                )}
              >
                <div className="flex flex-col min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#FCD116] truncate">
                      {prog.sigle_programme || prog.code_programme}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] bg-[#FCD116] text-slate-950 font-bold px-1.5 py-0.2 rounded">
                        Actif
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/90 truncate mt-0.5">
                    {prog.nom_programme}
                  </span>
                </div>

                <ChevronRight
                  className={cn(
                    'w-4 h-4 shrink-0 transition-transform text-white/40',
                    isViewed && 'text-[#FCD116] translate-x-0.5'
                  )}
                />
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
