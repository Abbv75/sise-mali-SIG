import { useState } from 'react'
import { X, GripHorizontal, Pencil } from 'lucide-react'
import { useExportStore } from '@/stores/export/useExportStore'

interface LayerOrderWidgetProps {
  onClose: () => void
}

/**
 * Menu latéral (Calques) collé à la barre d'outils.
 * Affiche la liste des annotations (textes, dessins) et permet de modifier leur Z-index et de les renommer.
 */
export function LayerOrderWidget({ onClose }: LayerOrderWidgetProps) {
  // Les objets sont stockés dans l'ordre de leur Z-index Fabric (0 = fond, N = premier plan)
  const exportObjects = useExportStore((s) => s.exportObjects)
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  // On affiche la liste à l'envers : le premier élément affiché (en haut de la liste) est celui au premier plan (index max)
  const displayObjects = [...exportObjects].reverse()

  const startEdit = (id: string, currentText: string | undefined) => {
    setEditingId(id)
    setEditValue(currentText || '')
  }

  const finishEdit = (id: string) => {
    if (editingId === id) {
      if (editValue.trim() !== '') {
        window.dispatchEvent(
          new CustomEvent('export:renameObject', {
            detail: { id, name: editValue.trim() }
          })
        )
      }
      setEditingId(null)
    }
  }

  return (
    <div
      className="flex flex-col border-r border-white/10 shrink-0 bg-[#162032]"
      style={{ width: 220 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 text-white/60" />
          <span className="text-white text-xs font-bold uppercase tracking-wider">
            Calques
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {displayObjects.length === 0 ? (
          <p className="text-xs text-white/40 italic p-2 text-center">Aucune annotation</p>
        ) : (
          displayObjects.map((item) => {
            const isEditing = editingId === item.id
            
            return (
              <div
                key={item.id}
                draggable={!isEditing}
                onDragStart={(e) => {
                  if (isEditing) return
                  e.stopPropagation()
                  e.dataTransfer.effectAllowed = 'move'
                  e.dataTransfer.setData('text/plain', item.id)
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'move'
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const draggedId = e.dataTransfer.getData('text/plain')
                  const targetId = item.id
                  if (!draggedId || draggedId === targetId) return
                  
                  const draggedActualIdx = exportObjects.findIndex(o => o.id === draggedId)
                  const targetActualIdx = exportObjects.findIndex(o => o.id === targetId)
                  
                  if (draggedActualIdx === -1 || targetActualIdx === -1) return
                  
                  window.dispatchEvent(
                    new CustomEvent('export:reorderObject', {
                      detail: { id: draggedId, newIndex: targetActualIdx }
                    })
                  )
                }}
                className={`group flex items-center gap-2 py-1.5 px-2 rounded transition-colors text-white ${isEditing ? 'bg-white/10' : 'hover:bg-white/5 cursor-pointer'}`}
                title={isEditing ? '' : "Glisser-déposer pour réorganiser, Double-clic pour renommer"}
                onDoubleClick={() => {
                  if (!isEditing) startEdit(item.id, item.text)
                }}
              >
                <GripHorizontal className={`w-3 h-3 shrink-0 ${isEditing ? 'text-white/10' : 'text-white/30'}`} />
                
                {isEditing ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => finishEdit(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') finishEdit(item.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    className="flex-1 text-[11px] bg-white/20 text-white px-1 py-0.5 outline-none rounded border border-white/30 min-w-0"
                  />
                ) : (
                  <>
                    <span className="text-[11px] text-white/80 truncate font-medium flex-1 select-none">
                      {item.text}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        startEdit(item.id, item.text)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded text-white/50 hover:text-white transition-all"
                      title="Renommer"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
