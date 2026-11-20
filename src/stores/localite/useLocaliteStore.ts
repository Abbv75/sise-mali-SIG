import type { ZUSTAND_T } from '@/types'
import { create } from 'zustand'

interface LocaliteStoreState {
  set: ZUSTAND_T<LocaliteStoreState>

  // Sélection uniquement — les données viennent de useGetLocalites (TanStack Query)
  selectedLocaliteIds: Set<number>

  // Actions
  toggleLocalite: (id: number) => void
  toggleAllLocalites: (ids: number[], forceState?: boolean) => void
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

  toggleAllLocalites: (ids, forceState) => {
    set((state) => {
      const next = new Set(state.selectedLocaliteIds)

      if (forceState === true) {
        ids.forEach((id) => next.add(id))
      } else if (forceState === false) {
        ids.forEach((id) => next.delete(id))
      } else {
        const allSelected = ids.length > 0 && ids.every((id) => next.has(id))
        ids.forEach((id) => {
          if (allSelected) next.delete(id)
          else next.add(id)
        })
      }

      return { selectedLocaliteIds: next }
    })
  },
}))

