
import { Lock, LockOpen } from 'lucide-react'
import { useExportStore } from '@/stores/export/useExportStore'
import { useExportCanvas } from './hooks/useExportCanvas'
import { MapSnapshot } from './MapSnapshot'
import { AnnotationLayer } from './AnnotationLayer'
import { LegendWidget } from './LegendWidget'
import { Header } from '@/components/Header'
import DotField from '@/components/ui/dot-field'

interface ExportCanvasProps {
  pageRef: React.RefObject<HTMLDivElement | null>
  /** Ref de callback pour remonter clearAll vers ExportLayout */
  clearAllRef: React.MutableRefObject<() => void>
}

function ContextualToolbar() {
  const activeObjectProps = useExportStore((s) => s.activeObjectProps)
  const defaultColor = useExportStore((s) => s.defaultColor)
  const defaultFontSize = useExportStore((s) => s.defaultFontSize)
  const defaultBackgroundColor = useExportStore((s) => s.defaultBackgroundColor)

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-lg p-2 flex items-center gap-4 z-50 text-white text-sm">
      {activeObjectProps ? (
        // Édition de l'objet sélectionné
        <>
          <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">Édition</span>
          <div className="flex items-center gap-2">
            <label className="text-xs">Couleur</label>
            <input
              type="color"
              value={activeObjectProps.color || '#000000'}
              onChange={(e) => window.dispatchEvent(new CustomEvent('export:updateActiveObject', { detail: { color: e.target.value } }))}
              className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
          </div>
          {activeObjectProps.type === 'textbox' && (
            <>
              <div className="w-px h-6 bg-white/20 mx-1" />
              <div className="flex items-center gap-2">
                <label className="text-xs">Taille</label>
                <input
                  type="number"
                  value={activeObjectProps.fontSize || 24}
                  onChange={(e) => window.dispatchEvent(new CustomEvent('export:updateActiveObject', { detail: { fontSize: Number(e.target.value) } }))}
                  className="w-16 px-2 py-1 text-black text-xs rounded border-none outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs">Fond</label>
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={activeObjectProps.backgroundColor === 'transparent' ? '#ffffff' : (activeObjectProps.backgroundColor || '#ffffff')}
                    onChange={(e) => window.dispatchEvent(new CustomEvent('export:updateActiveObject', { detail: { backgroundColor: e.target.value } }))}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('export:updateActiveObject', { detail: { backgroundColor: 'transparent' } }))}
                    className={`text-[10px] px-1.5 py-0.5 rounded ${activeObjectProps.backgroundColor === 'transparent' ? 'bg-white/40 text-white' : 'bg-white/10 hover:bg-white/20 text-white/70'}`}
                    title="Aucun fond (transparent)"
                  >
                    Sans
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        // Options par défaut (crayon/nouveau texte)
        <>
          <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">Style par défaut</span>
          <div className="flex items-center gap-2">
            <label className="text-xs">Couleur</label>
            <input
              type="color"
              value={defaultColor}
              onChange={(e) => useExportStore.getState().setDefaultColor(e.target.value)}
              className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
          </div>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <div className="flex items-center gap-2">
            <label className="text-xs">Taille texte</label>
            <input
              type="number"
              value={defaultFontSize}
              onChange={(e) => useExportStore.getState().setDefaultFontSize(Number(e.target.value))}
              className="w-16 px-2 py-1 text-black text-xs rounded border-none outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs">Fond texte</label>
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={defaultBackgroundColor === 'transparent' ? '#ffffff' : defaultBackgroundColor}
                onChange={(e) => useExportStore.getState().setDefaultBackgroundColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <button
                onClick={() => useExportStore.getState().setDefaultBackgroundColor('transparent')}
                className={`text-[10px] px-1.5 py-0.5 rounded ${defaultBackgroundColor === 'transparent' ? 'bg-white/40 text-white' : 'bg-white/10 hover:bg-white/20 text-white/70'}`}
                title="Aucun fond (transparent)"
              >
                Sans
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function ExportCanvas({ pageRef, clearAllRef }: ExportCanvasProps) {
  const {
    activeTool,
    mapLocked,
    pageWidth,
    pageHeight,
    showPageHeader,
    showLegend,
    toggleLegend,
  } = useExportStore()

  const isPanTool = activeTool === 'pan'

  const { containerRef, offset, zoom, onMouseDown, onMouseMove, onMouseUp } =
    useExportCanvas(isPanTool, mapLocked)

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className="flex-1 min-h-0 overflow-hidden relative select-none"
      style={{
        backgroundColor: '#0f172a',
        cursor: isPanTool ? 'grab' : 'default',
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <DotField
          dotRadius={1.5}
          dotSpacing={16}
          cursorRadius={400}
          cursorForce={0.2}
          waveAmplitude={2}
          gradientFrom="#009460"
          gradientTo="#FCD116"
          glowColor="#ce112727"
        />
      </div>

      {/* Page blanche */}
      {/* Container de transformation (Pan & Zoom) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
          transformOrigin: 'center center',
          width: pageWidth,
          height: pageHeight,
          boxShadow: '0 8px 48px rgba(0,0,0,0.45)',
          borderRadius: 2,
        }}
      >
        {/* Page blanche cible de l'export (sans transform) */}
        <div
          ref={pageRef}
          style={{
            width: '100%',
            height: '100%',
            background: 'white',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {showPageHeader && (
          <div className="shrink-0 relative z-30" style={{ height: 70 }}>
            <Header forceShow />
          </div>
        )}

        <div className="flex-1 relative">
          {/* Couche 1 : Carte Leaflet */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <MapSnapshot width={pageWidth} height={showPageHeader ? pageHeight - 70 : pageHeight} />
          </div>

          {/* Couche 2 : Annotations Fabric */}
          <AnnotationLayer
            activeTool={activeTool}
            mapLocked={mapLocked}
            width={pageWidth}
            height={showPageHeader ? pageHeight - 70 : pageHeight}
            clearAllRef={clearAllRef}
          />

          {/* Couche 3 : Widgets draggables */}
          {showLegend && <LegendWidget onClose={toggleLegend} />}
        </div>
      </div>
      </div>

      {/* Barre de propriétés contextuelles (au-dessus du canvas) */}
      <ContextualToolbar />

      {/* Indicateur d'état */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-none">
        <div
          className={`text-[10px] font-semibold px-2 py-1 rounded flex items-center gap-1.5 ${
            mapLocked ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'
          }`}
        >
          {mapLocked ? <Lock className="w-3 h-3" /> : <LockOpen className="w-3 h-3" />}
          <span>{mapLocked ? 'Carte verrouillée' : 'Carte interactive'}</span>
        </div>
        <div className="text-xs text-white/50 bg-black/30 px-2 py-1 rounded">
          {Math.round(zoom * 100)} %
        </div>
      </div>
    </div>
  )
}
