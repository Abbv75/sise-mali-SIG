import { ColorPickerGroup } from './ColorPickerGroup'

interface ShapeEditorProps {
  editingId: string
  style: any
  setElementStyle: (id: string, style: any) => void
}

export function ShapeEditor({ editingId, style, setElementStyle }: ShapeEditorProps) {
  return (
    <>
      <ColorPickerGroup
        title="Couleur de remplissage"
        activeColor={style.fillColor}
        onColorSelect={(color) => setElementStyle(editingId, { fillColor: color })}
      />

      <ColorPickerGroup
        title="Couleur de bordure"
        activeColor={style.borderColor}
        onColorSelect={(color) => setElementStyle(editingId, { borderColor: color })}
      />

      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-[11px] text-white/70 uppercase font-bold">
            Opacité ({(style.fillOpacity ?? 0.2) * 100}%)
          </div>
        </div>
        <input 
          type="range" 
          min="0" max="1" step="0.1"
          value={style.fillOpacity ?? 0.2}
          onChange={(e) => setElementStyle(editingId, { fillOpacity: Number(e.target.value) })}
          className="w-full h-1.5 bg-black/20 rounded-lg appearance-none cursor-pointer accent-white"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-[11px] text-white/70 uppercase font-bold">
            Épaisseur bordure ({style.borderWeight ?? 2}px)
          </div>
        </div>
        <input 
          type="range" 
          min="0" max="10" step="1"
          value={style.borderWeight ?? 2}
          onChange={(e) => setElementStyle(editingId, { borderWeight: Number(e.target.value) })}
          className="w-full h-1.5 bg-black/20 rounded-lg appearance-none cursor-pointer accent-white"
        />
      </div>
    </>
  )
}
