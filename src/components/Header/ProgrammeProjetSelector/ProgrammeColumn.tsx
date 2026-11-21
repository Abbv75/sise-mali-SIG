import { Search, X, Loader2, ChevronRight, Layers } from 'lucide-react'
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
        'flex flex-col min-h-0 bg-slate-900/70 p-3.5 transition-all',
        isSplit ? 'w-full md:w-1/2' : 'w-full'
      )}
    >
      {/* En-tête de section */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#FCD116]" />
          <span className="text-[11px] font-bold tracking-wider text-slate-200 uppercase">
            Programmes
          </span>
        </div>
        <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono font-semibold text-amber-300">
          {programmes.length}
        </span>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-2.5">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
        <input
          type="text"
          placeholder="Rechercher un programme..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-950/80 border border-white/10 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#FCD116]/80 focus:ring-1 focus:ring-[#FCD116]/50 transition-all"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Liste déroulante des programmes */}
      <div className="flex-1 min-h-0 overflow-y-auto carto-panel-scroll space-y-1.5 pr-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-white/50 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-[#FCD116]" />
            <span className="text-[11px]">Chargement des programmes...</span>
          </div>
        ) : programmes.length === 0 ? (
          <div className="py-12 text-center text-white/40 text-xs italic px-4">
            {search
              ? 'Aucun programme ne correspond à cette recherche.'
              : 'Aucun programme disponible pour le moment.'}
          </div>
        ) : (
          programmes.map((prog) => {
            const isViewed = viewedProgrammeId === prog.id_programme
            const isSelected = selectedProgrammeId === prog.id_programme
            const years =
              prog.annee_debut_programme && prog.annee_fin_programme
                ? `${new Date(prog.annee_debut_programme).getFullYear()} - ${new Date(prog.annee_fin_programme).getFullYear()}`
                : null

            return (
              <div
                key={prog.id_programme}
                onClick={() => onViewProgramme(prog.id_programme)}
                className={cn(
                  'group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-150 border text-left',
                  isViewed
                    ? 'bg-white/10 border-[#FCD116]/50 shadow-md ring-1 ring-[#FCD116]/30'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 text-white/80 hover:text-white'
                )}
              >
                {/* Liseré gauche actif */}
                {isViewed && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#FCD116] rounded-r" />
                )}

                <div className="flex flex-col min-w-0 flex-1 pl-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs tracking-tight text-[#FCD116] truncate">
                      {prog.sigle_programme || prog.code_programme}
                    </span>

                    {isSelected && (
                      <span className="text-[9px] bg-emerald-500/25 text-emerald-300 px-1.5 py-0.2 rounded-full border border-emerald-500/40 font-semibold uppercase tracking-wider">
                        Sélectionné
                      </span>
                    )}

                    {years && (
                      <span className="text-[10px] text-white/40 ml-auto font-mono hidden sm:inline">
                        {years}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-white/90 line-clamp-1 mt-0.5 leading-snug">
                    {prog.nom_programme}
                  </span>

                  {prog.vision_programme && (
                    <span className="text-[10px] text-white/50 truncate italic mt-0.5">
                      {prog.vision_programme}
                    </span>
                  )}
                </div>

                <ChevronRight
                  className={cn(
                    'w-4 h-4 shrink-0 transition-transform text-white/30 group-hover:translate-x-0.5 group-hover:text-white',
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
