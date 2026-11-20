import { COLORS } from '../constants'

interface ColorPickerGroupProps {
  title: string
  activeColor?: string
  onColorSelect: (color: string) => void
}

export function ColorPickerGroup({ title, activeColor, onColorSelect }: ColorPickerGroupProps) {
  return (
    <div>
      <div className="text-[11px] text-white/70 uppercase font-bold mb-2">{title}</div>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className={`w-6 h-6 rounded-full ring-offset-2 ring-offset-[#008d5b] transition-all ${
              activeColor === color ? 'ring-2 ring-white scale-110' : 'hover:scale-110'
            }`}
            style={{ backgroundColor: color, border: color === '#ffffff' ? '1px solid #ccc' : 'none' }}
          />
        ))}
      </div>
    </div>
  )
}
