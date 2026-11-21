import { Search, X, Loader2, Briefcase, MapPin, Calendar, Check } from 'lucide-react'
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
    <div className="w-full md:w-1/2 flex flex-col min-h-0 bg-slate-950/70 p-3.5 border-t md:border-t-0 md:border-l border-white/10">
      {/* En-tête de section Projets */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 min-w-0 pr-2">
          <Briefcase className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          {viewedProgramme?.sigle_programme && (
            <>
              <span className="px-1.5 py-0.2 rounded bg-amber-400/15 text-[#FCD116] text-[10px] font-bold border border-amber-400/30 truncate">
                {viewedProgramme.sigle_programme}
              </span>
              <span className="text-white/40 text-xs font-bold">&gt;</span>
            </>
          )}
          <span className="text-[11px] font-bold tracking-wider text-slate-200 uppercase truncate">
            Projets associés
          </span>
        </div>
        <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono font-semibold text-emerald-300 shrink-0">
          {projets.length}
        </span>
      </div>

      {/* Barre de recherche Projets */}
      <div className="relative mb-2.5">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
        <input
          type="text"
          placeholder="Rechercher un projet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900/90 border border-white/10 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-all"
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

      {/* Liste déroulante des projets */}
      <div className="flex-1 min-h-0 overflow-y-auto carto-panel-scroll space-y-2 pr-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-white/50 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            <span className="text-[11px]">Chargement des projets...</span>
          </div>
        ) : projets.length === 0 ? (
          <div className="py-12 text-center text-white/40 text-xs italic px-4">
            {search
              ? 'Aucun projet ne correspond à cette recherche.'
              : 'Aucun projet n’est rattaché à ce programme.'}
          </div>
        ) : (
          projets.map((proj) => {
            const isSelected = selectedProjetId === proj.id_projet
            const zoneCount = proj.zone_projet?.length ?? 0
            const startYear = proj.date_demarrage_projet
              ? new Date(proj.date_demarrage_projet).getFullYear()
              : null
            const partenaire =
              proj.partenaire_projet?.nom_acteur ||
              proj.partenaire_projet?.categorie_acteur?.nom_categorie

            return (
              <div
                key={proj.id_projet}
                onClick={() => onSelectProjet(proj)}
                className={cn(
                  'group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-150 border text-left',
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/70 text-white shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 text-white/80 hover:text-white'
                )}
              >
                <div className="flex flex-col min-w-0 flex-1 pr-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs truncate text-white group-hover:text-amber-300 transition-colors">
                      {proj.sigle_projet || proj.code_projet}
                    </span>
                    {proj.code_projet && proj.sigle_projet && (
                      <span className="text-[10px] text-white/40 font-mono">
                        ({proj.code_projet})
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-white/85 line-clamp-1 mt-0.5 leading-snug">
                    {proj.intitule_projet}
                  </span>

                  {/* Métadonnées : Partenaire, Zones, Année */}
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px]">
                    {zoneCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-emerald-300 font-medium bg-emerald-500/15 px-1.5 py-0.2 rounded border border-emerald-500/25">
                        <MapPin className="w-2.5 h-2.5" />
                        {zoneCount} {zoneCount > 1 ? 'zones' : 'zone'}
                      </span>
                    ) : (
                      <span className="text-white/35 italic">Sans zone</span>
                    )}

                    {startYear && (
                      <span className="inline-flex items-center gap-1 text-white/50 bg-white/5 px-1.5 py-0.2 rounded border border-white/10">
                        <Calendar className="w-2.5 h-2.5 text-white/40" />
                        {startYear}
                      </span>
                    )}

                    {partenaire && (
                      <span className="text-white/45 truncate max-w-[130px] hidden sm:inline">
                        {partenaire}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bouton de sélection Checkmark */}
                <div className="shrink-0 flex items-center">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#009460] to-[#007048] flex items-center justify-center text-white shadow-sm ring-1 ring-emerald-300/50">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-white/20 group-hover:border-amber-400/50 flex items-center justify-center transition-colors">
                      <span className="w-2 h-2 rounded-full bg-white/0 group-hover:bg-amber-400/40 transition-colors" />
                    </div>
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
