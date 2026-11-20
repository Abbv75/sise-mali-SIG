import type { ZUSTAND_T } from '@/types'
import { create } from 'zustand'

interface LocaliteStoreState {
  set: ZUSTAND_T<LocaliteStoreState>

  // Sélection uniquement — les données viennent de useGetLocalites (TanStack Query)
  selectedLocaliteIds: Set<number>

  // Actions
  toggleLocalite: (id: number) => void
  toggleAllLocalites: (forceState: boolean | undefined, allIds: number[]) => void
}

export const useLocaliteStore = create<LocaliteStoreState>((set) => ({
  set,
  selectedLocaliteIds: new Set(),

  toggleLocalite: (id) => {
    set((state) => {
      const next = new Set(state.selectedLocaliteIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { selectedLocaliteIds: next }
    })
  },

  toggleAllLocalites: (forceState, allIds) => {
    set((state) => {
      if (forceState === true) {
        return { selectedLocaliteIds: new Set(allIds) }
      }
      if (forceState === false) {
        return { selectedLocaliteIds: new Set() }
      }
      const allSelected = state.selectedLocaliteIds.size === allIds.length
      return {
        selectedLocaliteIds: allSelected ? new Set() : new Set(allIds),
      }
    })
  },
}))

