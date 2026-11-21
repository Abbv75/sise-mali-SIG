import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
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
    <div ref={containerRef} className="relative">
      <SelectorTrigger
        isOpen={isOpen}
        toggleOpen={toggleOpen}
        selectedProgramme={selectedProgramme}
        selectedProjet={selectedProjet}
      />

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60"
            onClick={() => setIsOpen(false)}
          >
            {/* Boîte Modale style Chauffy / SISE-Mali */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'relative bg-[#008d5b] text-white rounded-lg shadow-2xl border border-white/20',
                'overflow-hidden flex flex-col w-full',
                hasSplitPane ? 'max-w-[800px] h-[500px]' : 'max-w-[420px] h-[460px]'
              )}
            >
              {/* En-tête */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/15 bg-[#007e52]">
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  Sélection du Programme & Projet
                </h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Corps scindé en 2 colonnes */}
              <div className="flex flex-1 min-h-0 divide-x divide-white/15 overflow-hidden">
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

              {/* Pied de modal */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/15 bg-[#007e52]">
                <div className="text-xs text-white/80 truncate max-w-[500px]">
                  {selectedProjet ? (
                    <span>
                      Actif : <strong className="text-[#FCD116]">{selectedProgramme?.sigle_programme || 'Prog'}</strong> &gt; {selectedProjet.sigle_projet || selectedProjet.intitule_projet}
                    </span>
                  ) : (
                    <span>Aucun projet sélectionné</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-1.5 bg-[#FCD116] text-slate-950 hover:bg-[#e0b80d] text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-sm"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
