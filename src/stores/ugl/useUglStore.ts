import { create } from 'zustand'

interface UglStoreState {
  selectedUglIds: Set<number>
  toggleUgl: (id: number) => void
  toggleAllUgls: (ids: number[], forceState?: boolean) => void
  clearUgls: () => void
}

export const useUglStore = create<UglStoreState>((set) => ({
  selectedUglIds: new Set<number>(),

  toggleUgl: (id) => set((state) => {
    const next = new Set(state.selectedUglIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return { selectedUglIds: next }
  }),

  toggleAllUgls: (ids, forceState) => set((state) => {
    const next = new Set(state.selectedUglIds)
    
    if (forceState === true) {
      ids.forEach(id => next.add(id))
    } else if (forceState === false) {
      ids.forEach(id => next.delete(id))
    } else {
      const allSelected = ids.every(id => next.has(id))
      ids.forEach(id => {
        if (allSelected) next.delete(id)
        else next.add(id)
      })
    }
    
    return { selectedUglIds: next }
  }),

  clearUgls: () => set({ selectedUglIds: new Set() }),
}))
