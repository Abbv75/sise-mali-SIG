import { Search, X, Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Programme, Projet } from '@/types/programmeProjet'

interface ProjetColumnProps {
  viewedProgramme: Programme | null
  projets: Projet[]
  isLoading: boolean
  search: string
  setSearch: (value: string) => void
  selectedProjetId?: number
  onSelectProjet: (projet: Projet) => void
}

export function ProjetColumn({
  viewedProgramme,
  projets,
  isLoading,
  search,
  setSearch,
  selectedProjetId,
  onSelectProjet,
}: ProjetColumnProps) {
  return (
    <div className="w-full md:w-1/2 flex flex-col min-h-0 p-4 border-t md:border-t-0 md:border-l border-white/15 bg-black/10">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 min-w-0 pr-2">
          <span className="text-xs font-bold uppercase tracking-wider text-white truncate">
            Projets
          </span>
          {viewedProgramme?.sigle_programme && (
            <span className="text-xs font-bold text-[#FCD116] truncate">
              ({viewedProgramme.sigle_programme})
            </span>
          )}
        </div>
        <span className="text-[11px] text-white/50 shrink-0">
          {projets.length} projet(s)
        </span>
      </div>

      {/* Recherche */}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
        <input
          type="text"
          placeholder="Rechercher un projet..."
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

      {/* Liste des projets */}
      <div className="flex-1 min-h-0 overflow-y-auto carto-panel-scroll space-y-1.5 pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-white/60 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-[#FCD116]" />
            <span>Chargement des projets...</span>
          </div>
        ) : projets.length === 0 ? (
          <div className="py-10 text-center text-white/40 text-xs italic">
            {search
              ? 'Aucun projet ne correspond à cette recherche.'
              : 'Aucun projet rattaché à ce programme.'}
          </div>
        ) : (
          projets.map((proj) => {
            const isSelected = selectedProjetId === proj.id_projet

            return (
              <div
                key={proj.id_projet}
                onClick={() => onSelectProjet(proj)}
                className={cn(
                  'flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors text-left border',
                  isSelected
                    ? 'bg-[#007e52] border-[#FCD116] text-white shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 border-transparent text-white/85'
                )}
              >
                <div className="flex flex-col min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-[#FCD116] truncate">
                      {proj.sigle_projet || proj.code_projet}
                    </span>
                    {proj.code_projet && proj.sigle_projet && (
                      <span className="text-[10px] text-white/40 font-mono">
                        ({proj.code_projet})
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/95 truncate mt-0.5">
                    {proj.intitule_projet}
                  </span>
                </div>

                <div className="shrink-0 flex items-center pl-2">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-[#FCD116] text-slate-950 flex items-center justify-center font-bold">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-white/20" />
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
