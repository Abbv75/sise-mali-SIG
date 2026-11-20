import { useRef, useEffect } from 'react'
import type { ExportTool } from '@/stores/export/useExportStore'
import { useFabricCanvas } from './hooks/useFabricCanvas'

interface AnnotationLayerProps {
  activeTool: ExportTool
  mapLocked: boolean
  width: number
  height: number
  clearAllRef: React.MutableRefObject<() => void>
}

export function AnnotationLayer({ activeTool, mapLocked, width, height, clearAllRef }: AnnotationLayerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasElRef = useRef<HTMLCanvasElement>(null)
  const { clearAll } = useFabricCanvas(canvasElRef, activeTool, width, height)

  // Exposer clearAll vers le parent (ExportLayout → ExportToolbar bouton Trash)
  useEffect(() => {
    clearAllRef.current = clearAll
  }, [clearAll, clearAllRef])

  // MutationObserver : dès que Fabric injecte .canvas-container, on le passe en absolute
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const fix = () => {
      // Fabric v6 utilise .canvas-container, Fabric v7 utilise [data-fabric="wrapper"]
      const container = wrapper.querySelector('.canvas-container, [data-fabric="wrapper"]') as HTMLElement | null
      if (container) {
        container.style.position = 'absolute'
        container.style.top = '0'
        container.style.left = '0'
        container.style.width = '100%'
        container.style.height = '100%'
        observer.disconnect()
      }
    }

    const observer = new MutationObserver(fix)
    observer.observe(wrapper, { childList: true, subtree: true })
    fix() // vérifier immédiatement au cas où déjà présent
    return () => observer.disconnect()
  }, [])

  const interactive = mapLocked && activeTool !== 'pan'

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        pointerEvents: interactive ? 'auto' : 'none',
        cursor: !interactive
          ? 'default'
          : activeTool === 'text'
          ? 'text'
          : activeTool === 'pencil'
          ? 'crosshair'
          : activeTool === 'eraser'
          ? 'not-allowed'
          : 'default',
      }}
    >
      <canvas ref={canvasElRef} style={{ display: 'block' }} />
    </div>
  )
}
