import { ICON_OPTIONS } from '@/components/CustomMapIcon'
import { ColorPickerGroup } from './ColorPickerGroup'

interface PointEditorProps {
  editingId: string
  style: any
  setElementStyle: (id: string, style: any) => void
}

export function PointEditor({ editingId, style, setElementStyle }: PointEditorProps) {
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-[11px] text-white/70 uppercase font-bold">Taille ({style.size}px)</div>
        </div>
        <input 
          type="range" 
          min="16" max="64" step="2"
          value={style.size}
          onChange={(e) => setElementStyle(editingId, { size: Number(e.target.value) })}
          className="w-full h-1.5 bg-black/20 rounded-lg appearance-none cursor-pointer accent-white"
        />
      </div>

      <div>
        <div className="text-[11px] text-white/70 uppercase font-bold mb-2">Icône</div>
        <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto carto-panel-scroll p-1">
          {Object.entries(ICON_OPTIONS).map(([name, Icon]) => (
            <button
              key={name}
              onClick={() => setElementStyle(editingId, { iconName: name })}
              className={`aspect-square rounded-md flex items-center justify-center transition-colors ${
                style.iconName === name ? 'bg-white/20 ring-1 ring-white/50 shadow-inner' : 'bg-black/10 hover:bg-black/20'
              }`}
            >
              <Icon className="w-5 h-5 text-white" />
            </button>
          ))}
        </div>
      </div>

      <ColorPickerGroup
        title="Couleur de fond"
        activeColor={style.bgColor}
        onColorSelect={(color) => setElementStyle(editingId, { bgColor: color })}
      />

      <ColorPickerGroup
        title="Couleur du motif"
        activeColor={style.color}
        onColorSelect={(color) => setElementStyle(editingId, { color: color })}
      />
    </>
  )
}
