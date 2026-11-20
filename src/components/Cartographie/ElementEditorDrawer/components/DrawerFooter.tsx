interface DrawerFooterProps {
  applyToLayer: () => void
}

export function DrawerFooter({ applyToLayer }: DrawerFooterProps) {
  return (
    <div className="p-4 border-t border-white/15 bg-[#007e52]">
      <button 
        onClick={applyToLayer}
        className="w-full py-2 bg-[#FCD116] text-slate-950 hover:bg-[#e0b80d] text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors shadow-sm"
      >
        Appliquer à toute la couche
      </button>
    </div>
  )
}
