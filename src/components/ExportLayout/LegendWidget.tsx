import { useCallback, useRef, useState } from 'react'
import { GripHorizontal, X } from 'lucide-react'
import { useLegendeSection } from '@/components/SideBar/Sections/LegendeSection/useLegendeSection'

import { useExportStore } from '@/stores/export/useExportStore'

interface Position { x: number; y: number }
interface Size { w: number; h: number }

interface LegendWidgetProps {
  onClose: () => void
}

/**
 * Widget Légende draggable + resizable dans la page d'export.
 * Réutilise useLegendeSection pour afficher les items actifs.
 */
export function LegendWidget({ onClose }: LegendWidgetProps) {
  const { sortedItems, hasActiveItems } = useLegendeSection()
  const { pageHeight, showPageHeader } = useExportStore()

  const initialHeight = 180
  const containerHeight = showPageHeader ? pageHeight - 70 : pageHeight

  const [pos, setPos] = useState<Position>({ x: 16, y: containerHeight - initialHeight - 16 })
  const [size, setSize] = useState<Size>({ w: 200, h: initialHeight })

  // ── Drag de la fenêtre ────────────────────────────────────────────────────
  const dragging = useRef(false)
  const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number }>({
    mx: 0, my: 0, ox: 0, oy: 0,
  })

  const onDragStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    dragging.current = true
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y }

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return
      setPos({
        x: dragStart.current.ox + ev.clientX - dragStart.current.mx,
        y: dragStart.current.oy + ev.clientY - dragStart.current.my,
      })
    }
    const onUp = () => {
      dragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [pos])

  // ── Resize par la poignée bas-droite ──────────────────────────────────────
  const resizing = useRef(false)
  const resizeStart = useRef<{ mx: number; my: number; ow: number; oh: number }>({
    mx: 0, my: 0, ow: 0, oh: 0,
  })

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    resizing.current = true
    resizeStart.current = { mx: e.clientX, my: e.clientY, ow: size.w, oh: size.h }

    const onMove = (ev: MouseEvent) => {
      if (!resizing.current) return
      setSize({
        w: Math.max(140, resizeStart.current.ow + ev.clientX - resizeStart.current.mx),
        h: Math.max(80, resizeStart.current.oh + ev.clientY - resizeStart.current.my),
      })
    }
    const onUp = () => {
      resizing.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [size])

  // ── Couleurs par type ─────────────────────────────────────────────────────
  const COLOR_MAP: Record<string, string> = {
    zones: '#FCD116',
    localites: '#CE1126',
    ugls: '#25a80b',
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex: 20,
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 8,
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        border: '1px solid rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header drag */}
      <div
        onMouseDown={onDragStart}
        className="flex items-center justify-between px-2 py-1.5 cursor-grab active:cursor-grabbing select-none"
        style={{ background: '#FCD116' }}
      >
        <div className="flex items-center gap-1.5">
          <GripHorizontal className="w-3 h-3 text-slate-800" />
          <span className="text-slate-900 text-[10px] font-bold uppercase tracking-wider">Légende</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose() }}
          className="text-slate-800 hover:text-black transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-0">
        {!hasActiveItems ? (
          <p className="text-[10px] text-gray-400 italic">Aucun élément actif</p>
        ) : (
          sortedItems.map((item) => (
            <div key={item.id} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: COLOR_MAP[item.type] ?? '#64748b' }}
              />
              <span className="text-[10px] text-gray-700 truncate">{item.label}</span>
            </div>
          ))
        )}
      </div>

      {/* Poignée resize */}
      <div
        onMouseDown={onResizeStart}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        style={{
          background:
            'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.2) 50%)',
          borderBottomRightRadius: 8,
        }}
      />
    </div>
  )
}
