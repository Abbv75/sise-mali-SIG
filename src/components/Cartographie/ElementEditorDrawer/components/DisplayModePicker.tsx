interface DisplayModePickerProps {
  isShapeMode: boolean
  hasShapefile: boolean
  editingId: string
  setElementStyle: (id: string, style: any) => void
}

export function DisplayModePicker({ isShapeMode, hasShapefile, editingId, setElementStyle }: DisplayModePickerProps) {
  return (
    <div>
      <div className="text-[11px] text-white/70 uppercase font-bold mb-2 flex justify-between">
        <span>Mode d'affichage</span>
        {!hasShapefile && <span className="text-white/40 italic normal-case">Shapefile indisponible</span>}
      </div>
      <div className="flex bg-black/20 p-1 rounded-md">
        <button
          onClick={() => setElementStyle(editingId, { displayMode: 'point' })}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
            !isShapeMode ? 'bg-white/20 text-white shadow' : 'text-white/60 hover:text-white'
          }`}
        >
          Point
        </button>
        <button
          disabled={!hasShapefile}
          onClick={() => setElementStyle(editingId, { displayMode: 'shape' })}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
            isShapeMode ? 'bg-white/20 text-white shadow' : 'text-white/60 hover:text-white disabled:hover:text-white/40'
          } ${!hasShapefile ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          Forme (Shapefile)
        </button>
      </div>
    </div>
  )
}
