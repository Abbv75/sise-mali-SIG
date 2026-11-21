import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Programme, Projet } from '@/types/programmeProjet'

interface SelectorTriggerProps {
  isOpen: boolean
  toggleOpen: () => void
  selectedProgramme: Programme | null
  selectedProjet: Projet | null
}

export function SelectorTrigger({
  isOpen,
  toggleOpen,
  selectedProgramme,
  selectedProjet,
}: SelectorTriggerProps) {
  const programmeText = selectedProgramme
    ? selectedProgramme.sigle_programme || selectedProgramme.nom_programme
    : 'Tous'

  const projetText = selectedProjet
    ? selectedProjet.sigle_projet || selectedProjet.intitule_projet
    : null

  return (
    <button
      type="button"
      onClick={toggleOpen}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      title={`${programmeText} > ${projetText || 'Sélectionner un projet'}`}
      className={cn(
        'group relative flex items-center justify-between gap-2.5 px-3.5 py-1.5 rounded-xl text-left transition-all duration-200 select-none',
        'w-auto min-w-[310px] sm:min-w-[360px] md:min-w-[390px] max-w-[460px]',
        'bg-slate-950/90 hover:bg-slate-950 text-white shadow-lg backdrop-blur-md',
        'border border-slate-800/80 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-[#FCD116]/80',
        isOpen && 'ring-2 ring-[#FCD116] border-[#FCD116]/60 bg-slate-950 shadow-amber-500/10'
      )}
    >
      {/* ── Bloc Hiérarchique : Programme > Projet ─────────────────────────── */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Colonne Programme */}
        <div className="flex flex-col min-w-0 shrink-0 max-w-[110px] sm:max-w-[130px]">
          <span className="text-[9px] font-extrabold tracking-wider uppercase text-[#FCD116] leading-none">
            Programme
          </span>
          <span className="text-xs font-bold text-white/95 truncate leading-tight mt-1">
            {programmeText}
          </span>
        </div>

        {/* Flèche de liaison hiérarchique > */}
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 border border-white/10 text-amber-300 shrink-0 group-hover:bg-amber-400/20 group-hover:border-amber-400/40 group-hover:scale-105 transition-all">
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>

        {/* Colonne Projet */}
        <div className="flex flex-col min-w-0 flex-1 max-w-[190px] sm:max-w-[250px]">
          <span className="text-[9px] font-extrabold tracking-wider uppercase text-[#FCD116] leading-none">
            Projet
          </span>
          <span className="text-xs font-semibold text-white/90 truncate leading-tight mt-1">
            {projetText ? (
              projetText
            ) : (
              <span className="text-white/40 italic font-normal text-[11px]">
                Sélectionner un projet...
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Indicateur de bascule Chevron */}
      <div className="ml-1 pl-2 border-l border-white/15 flex items-center shrink-0">
        <ChevronDown
          className={cn(
            'w-4 h-4 text-white/60 transition-transform duration-200 group-hover:text-amber-300',
            isOpen && 'rotate-180 text-[#FCD116]'
          )}
        />
      </div>
    </button>
  )
}
