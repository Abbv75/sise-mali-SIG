import { create } from 'zustand'

export type ExportTool = 'select' | 'pan' | 'text' | 'pencil' | 'eraser'
export type ExportFormat = 'png'

export interface ExportObject {
  id: string
  type: string
  text?: string
}

interface ExportStoreState {
  // Visibilité du module
  isOpen: boolean
  open: () => void
  close: () => void

  // Outil actif dans la barre d'outils
  activeTool: ExportTool
  setActiveTool: (tool: ExportTool) => void

  // Carte verrouillée : true = carte figée (prête pour les annotations)
  //                     false = carte interactive (pan/zoom sur la carte possible)
  mapLocked: boolean
  toggleMapLocked: () => void

  // Widgets optionnels sur la page
  showPageHeader: boolean
  togglePageHeader: () => void
  showLegend: boolean
  toggleLegend: () => void
  showLayerOrder: boolean
  toggleLayerOrder: () => void

  // Objets d'annotations (pour le LayerOrderWidget)
  exportObjects: ExportObject[]
  setExportObjects: (objects: ExportObject[]) => void

  // Format d'export
  exportFormat: ExportFormat
  setExportFormat: (format: ExportFormat) => void

  // Dimensions libres de la page (en px)
  pageWidth: number
  pageHeight: number
  setPageSize: (width: number, height: number) => void

  // État de l'export en cours
  isExporting: boolean
  setIsExporting: (v: boolean) => void

  // Options par défaut pour les nouvelles annotations
  defaultColor: string
  setDefaultColor: (color: string) => void
  defaultFontSize: number
  setDefaultFontSize: (size: number) => void
  defaultBackgroundColor: string
  setDefaultBackgroundColor: (color: string) => void

  // Propriétés de l'objet actuellement sélectionné (null si aucun)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeObjectProps: Record<string, any> | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setActiveObjectProps: (props: Record<string, any> | null) => void
}

export const useExportStore = create<ExportStoreState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, activeTool: 'pan', mapLocked: true }),

  activeTool: 'pan',
  setActiveTool: (tool) => set({ activeTool: tool }),

  mapLocked: true,
  toggleMapLocked: () => set((s) => ({ mapLocked: !s.mapLocked })),

  showPageHeader: true,
  togglePageHeader: () => set((s) => ({ showPageHeader: !s.showPageHeader })),
  showLegend: true,
  toggleLegend: () => set((s) => ({ showLegend: !s.showLegend })),
  showLayerOrder: false,
  toggleLayerOrder: () => set((s) => ({ showLayerOrder: !s.showLayerOrder })),

  exportObjects: [],
  setExportObjects: (objects) => set({ exportObjects: objects }),

  exportFormat: 'png',
  setExportFormat: (format) => set({ exportFormat: format }),

  pageWidth: 1123,
  pageHeight: 794,
  setPageSize: (width, height) => set({ pageWidth: width, pageHeight: height }),

  isExporting: false,
  setIsExporting: (v) => set({ isExporting: v }),

  defaultColor: '#1e293b',
  setDefaultColor: (color) => set({ defaultColor: color }),
  defaultFontSize: 24,
  setDefaultFontSize: (size) => set({ defaultFontSize: size }),
  defaultBackgroundColor: 'transparent',
  setDefaultBackgroundColor: (color) => set({ defaultBackgroundColor: color }),

  activeObjectProps: null,
  setActiveObjectProps: (props) => set({ activeObjectProps: props }),
}))
