import { create } from 'zustand'
import type { MapElementStyle } from '@/types'

export const DEFAULT_STYLE: MapElementStyle = {
  iconName: 'map-pin',
  color: '#ffffff',
  bgColor: '#CE1126',
  size: 28,
  displayMode: 'point',
  fillColor: '#FCD116',
  fillOpacity: 0.25,
  borderColor: '#D4AC0D',
  borderWeight: 2,
}

export const DEFAULT_ZONE_STYLE: MapElementStyle = {
  iconName: 'layers',
  color: '#000000',
  bgColor: '#FCD116',
  size: 28,
  displayMode: 'shape',
  fillColor: '#FCD116',
  fillOpacity: 0.25,
  borderColor: '#D4AC0D',
  borderWeight: 2,
}

export const DEFAULT_UGL_STYLE: MapElementStyle = {
  iconName: 'building',
  color: '#ffffff',
  bgColor: '#25a80b',
  size: 28,
  displayMode: 'point',
}

// Styles par couche (s'applique à tous les éléments de la couche si pas d'override individuel)
type LayerKey = 'localites' | 'zones' | 'ugls'

interface IconStoreState {
  set: {
    (partial: IconStoreState | Partial<IconStoreState> | ((state: IconStoreState) => IconStoreState | Partial<IconStoreState>), replace?: false): void;
    (state: IconStoreState | ((state: IconStoreState) => IconStoreState), replace: true): void;
  }

  // Style par couche (global)
  layerStyles: Record<LayerKey, MapElementStyle>

  // Style override par élément individuel (ex: "localites-101")
  elementStyles: Record<string, MapElementStyle>

  // Actions couche
  setLayerStyle: (layer: LayerKey, style: Partial<MapElementStyle>) => void
  resetLayerStyle: (layer: LayerKey) => void

  // Actions élément individuel
  setElementStyle: (elementId: string, style: Partial<MapElementStyle>) => void
  resetElementStyle: (elementId: string) => void

  // Élément en cours d'édition
  editingId: string | null
  setEditingId: (id: string | null) => void

  // Résolution finale : élément > couche > default
  resolveStyle: (layer: LayerKey, elementId: string) => MapElementStyle
}

export const useIconStore = create<IconStoreState>((set, get) => ({
  set,

  layerStyles: {
    localites: DEFAULT_STYLE,
    zones: DEFAULT_ZONE_STYLE,
    ugls: DEFAULT_UGL_STYLE,
  },

  elementStyles: {},

  editingId: null,
  setEditingId: (id) => set({ editingId: id }),

  setLayerStyle: (layer, style) => {
    set((state) => ({
      layerStyles: {
        ...state.layerStyles,
        [layer]: { ...state.layerStyles[layer], ...style },
      },
    }))
  },

  resetLayerStyle: (layer) => {
    set((state) => ({
      layerStyles: {
        ...state.layerStyles,
        [layer]:
          layer === 'zones'
            ? DEFAULT_ZONE_STYLE
            : layer === 'ugls'
              ? DEFAULT_UGL_STYLE
              : DEFAULT_STYLE,
      },
    }))
  },

  setElementStyle: (elementId, style) => {
    set((state) => {
      const layer: LayerKey = elementId.startsWith('zone-')
        ? 'zones'
        : elementId.startsWith('ugl-')
          ? 'ugls'
          : 'localites'
      const base = state.elementStyles[elementId] || state.layerStyles[layer]
      return {
        elementStyles: {
          ...state.elementStyles,
          [elementId]: { ...base, ...style },
        },
      }
    })
  },

  resetElementStyle: (elementId) => {
    set((state) => {
      const { [elementId]: _removed, ...rest } = state.elementStyles
      return { elementStyles: rest }
    })
  },

  resolveStyle: (layer, elementId) => {
    const { elementStyles, layerStyles } = get()
    return elementStyles[elementId] ?? layerStyles[layer] ?? DEFAULT_STYLE
  },
}))
