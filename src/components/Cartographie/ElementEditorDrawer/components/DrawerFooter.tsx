interface DrawerFooterProps {
  applyToLayer: () => void
}

export function DrawerFooter({ applyToLayer }: DrawerFooterProps) {
  return (
    <div className="p-4 border-t border-white/10 bg-black/10">
      <button 
        onClick={applyToLayer}
        className="w-full py-2 bg-white text-[#008d5b] hover:bg-gray-100 text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors shadow-sm"
      >
        Appliquer à toute la couche
      </button>
    </div>
  )
}
