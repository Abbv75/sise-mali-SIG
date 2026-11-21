import { X, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProgrammeProjetSelector } from './useProgrammeProjetSelector'
import { SelectorTrigger } from './SelectorTrigger'
import { ProgrammeColumn } from './ProgrammeColumn'
import { ProjetColumn } from './ProjetColumn'

export function ProgrammeProjetSelector() {
  const {
    isOpen,
    setIsOpen,
    toggleOpen,
    containerRef,
    programmesLoading,
    filteredProgrammes,
    programmeSearch,
    setProgrammeSearch,
    projetsLoading,
    filteredProjets,
    projetSearch,
    setProjetSearch,
    selectedProgramme,
    selectedProjet,
    viewedProgramme,
    effectiveProgrammeId,
    setViewedProgrammeId,
    hasSplitPane,
    handleSelectProjet,
  } = useProgrammeProjetSelector()

  return (
    <div ref={containerRef} className="relative z-50">
      <SelectorTrigger
        isOpen={isOpen}
        toggleOpen={toggleOpen}
        selectedProgramme={selectedProgramme}
        selectedProjet={selectedProjet}
      />

      {isOpen && (
        <div
          className={cn(
            'absolute top-full right-0 mt-2 bg-slate-950/95 text-white rounded-2xl shadow-2xl border border-white/15',
            'backdrop-blur-xl overflow-hidden flex flex-col z-[100] animate-in fade-in-0 zoom-in-95 duration-150',
            hasSplitPane ? 'w-[820px] max-w-[96vw]' : 'w-[420px] max-w-[96vw]'
          )}
          style={{ height: '460px' }}
        >
          {/* Liseré supérieur tricolore du Mali */}
          <div className="h-1 w-full bg-gradient-to-r from-[#009460] via-[#FCD116] to-[#CE1126] shrink-0" />

          {/* En-tête du volet déroulant */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#009460]/30 border border-[#009460]/50 flex items-center justify-center">
                <Layers className="w-3 h-3 text-[#FCD116]" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-200">
                Portefeuille SISE-Mali
              </span>
            </div>

            <div className="flex items-center gap-2">
              {selectedProjet && (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="truncate max-w-[280px]">
                    Actif : {selectedProgramme?.sigle_programme || 'Prog'} &gt; {selectedProjet.sigle_projet || selectedProjet.intitule_projet}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Volets scindés (Programmes à gauche, Projets à droite) */}
          <div className="flex flex-1 min-h-0 divide-x divide-white/10 overflow-hidden">
            <ProgrammeColumn
              programmes={filteredProgrammes}
              isLoading={programmesLoading}
              search={programmeSearch}
              setSearch={setProgrammeSearch}
              viewedProgrammeId={effectiveProgrammeId}
              selectedProgrammeId={selectedProgramme?.id_programme}
              onViewProgramme={(id) => setViewedProgrammeId(id)}
              isSplit={hasSplitPane}
            />

            {hasSplitPane && (
              <ProjetColumn
                viewedProgramme={viewedProgramme}
                projets={filteredProjets}
                isLoading={projetsLoading}
                search={projetSearch}
                setSearch={setProjetSearch}
                selectedProjetId={selectedProjet?.id_projet}
                onSelectProjet={handleSelectProjet}
              />
            )}
          </div>

          {/* Pied de volet informatif */}
          <div className="px-4 py-1.5 bg-slate-900/80 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 shrink-0">
            <span>Sélectionnez un projet pour basculer la vue SIG</span>
            <span className="font-mono text-white/30">SISE-Mali v2.0</span>
          </div>
        </div>
      )}
    </div>
  )
}
