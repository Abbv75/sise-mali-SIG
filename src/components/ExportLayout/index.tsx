import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useExportStore } from '@/stores/export/useExportStore'
import { ExportTopBar } from './ExportTopBar'
import { ExportToolbar } from './ExportToolbar'
import { ExportCanvas } from './ExportCanvas'
import { LayerOrderWidget } from './LayerOrderWidget'
import { useExportRenderer } from './hooks/useExportRenderer'

/**
 * Point d'entrée du module d'export.
 * Rendu via React Portal dans document.body (plein écran, z-[9999]).
 * Se ferme avec la touche Échap.
 */
export function ExportLayout() {
  const { isOpen, close, showLayerOrder, toggleLayerOrder } = useExportStore()

  // Ref de la page blanche (pour l'export html2canvas)
  const pageRef = useRef<HTMLDivElement>(null)

  // clearAll est remonté depuis ExportCanvas via ce ref de callback
  const clearAllRef = useRef<() => void>(() => {})
  const handleClearAll = useCallback(() => clearAllRef.current?.(), [])

  // Fermeture via Échap
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, close])

  const handleResetView = () => {
    window.dispatchEvent(new CustomEvent('export:resetView'))
  }

  const { exportPng, exportPdf, exportWord } = useExportRenderer(pageRef)

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 flex flex-col"
      style={{ zIndex: 9999, background: '#1e293b' }}
    >
      <ExportTopBar 
        onExportPng={exportPng} 
        onExportPdf={exportPdf} 
        onExportWord={exportWord} 
        onResetView={handleResetView} 
      />

      <div className="flex flex-1 min-h-0">
        <ExportToolbar onClearAll={handleClearAll} />
        {showLayerOrder && <LayerOrderWidget onClose={toggleLayerOrder} />}
        <ExportCanvas pageRef={pageRef} clearAllRef={clearAllRef} />
      </div>
    </div>,
    document.body
  )
}
