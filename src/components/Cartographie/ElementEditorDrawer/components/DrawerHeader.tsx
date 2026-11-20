import { X } from 'lucide-react'

interface DrawerHeaderProps {
  onClose: () => void
}

export function DrawerHeader({ onClose }: DrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/15 bg-[#007e52]">
      <h2 className="text-sm font-bold uppercase tracking-wider">Personnalisation</h2>
      <button 
        onClick={onClose}
        className="p-1.5 rounded hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
