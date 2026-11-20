import { create } from 'zustand'
import type { TileLayerKey } from '@/constant'
import { MALI_DEFAULT_ZOOM } from '@/constant'
import type { ZUSTAND_T } from '@/types'

interface MapStoreState {
  set: ZUSTAND_T<MapStoreState>
  currentTileLayer: TileLayerKey
  zoomLevel: number
  elementOrder: string[]
  
  setTileLayer: (key: TileLayerKey) => void
  setZoomLevel: (zoom: number) => void
  setElementOrder: (order: string[]) => void
}

export const useMapStore = create<MapStoreState>((set) => ({
  set,
  currentTileLayer: 'osm',
  zoomLevel: MALI_DEFAULT_ZOOM,
  elementOrder: [],
  
  setTileLayer: (key) => set({ currentTileLayer: key }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  setElementOrder: (order) => set({ elementOrder: order }),
}))
