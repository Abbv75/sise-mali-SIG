import { create } from 'zustand'

interface ZoneStoreState {
  set: {
    (partial: ZoneStoreState | Partial<ZoneStoreState> | ((state: ZoneStoreState) => ZoneStoreState | Partial<ZoneStoreState>), replace?: false): void;
    (state: ZoneStoreState | ((state: ZoneStoreState) => ZoneStoreState), replace: true): void;
  }

  // Sélection
  selectedZoneIds: Set<number>

  // Actions
  toggleZone: (id: number) => void
  toggleAllZones: (zoneIds: number[], forceState?: boolean) => void
}

export const useZoneStore = create<ZoneStoreState>((set) => ({
  set,
  selectedZoneIds: new Set(),

  toggleZone: (id) => {
    set((state) => {
      const next = new Set(state.selectedZoneIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { selectedZoneIds: next }
    })
  },

  toggleAllZones: (zoneIds, forceState) => {
    set((state) => {
      const next = new Set(state.selectedZoneIds)

      if (forceState === true) {
        zoneIds.forEach((id) => next.add(id))
      } else if (forceState === false) {
        zoneIds.forEach((id) => next.delete(id))
      } else {
        const allSelected = zoneIds.length > 0 && zoneIds.every((id) => next.has(id))
        zoneIds.forEach((id) => {
          if (allSelected) next.delete(id)
          else next.add(id)
        })
      }

      return { selectedZoneIds: next }
    })
  }
}))
