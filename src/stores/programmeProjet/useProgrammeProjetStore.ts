import { create } from 'zustand'
import type { Programme, Projet } from '@/types/programmeProjet'

interface ProgrammeProjetStoreState {
  // Programme et projet actifs dans l'application
  selectedProgramme: Programme | null
  selectedProjet: Projet | null

  // Programme en cours d'exploration dans le volet gauche (permet d'afficher ses projets à droite)
  viewedProgrammeId: number | null

  // Actions
  setSelectedProgramme: (programme: Programme | null) => void
  setSelectedProjet: (projet: Projet | null) => void
  setViewedProgrammeId: (id: number | null) => void
  setProgrammeAndProjet: (programme: Programme | null, projet: Projet | null) => void
}

export const useProgrammeProjetStore = create<ProgrammeProjetStoreState>((set) => ({
  selectedProgramme: null,
  selectedProjet: null,
  viewedProgrammeId: null,

  setSelectedProgramme: (programme) =>
    set({
      selectedProgramme: programme,
      viewedProgrammeId: programme?.id_programme ?? null,
    }),

  setSelectedProjet: (projet) =>
    set({
      selectedProjet: projet,
    }),

  setViewedProgrammeId: (id) =>
    set({
      viewedProgrammeId: id,
    }),

  setProgrammeAndProjet: (programme, projet) =>
    set({
      selectedProgramme: programme,
      selectedProjet: projet,
      viewedProgrammeId: programme?.id_programme ?? null,
    }),
}))
