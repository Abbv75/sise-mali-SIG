import { useIframeStore } from '@/stores/iframe/useIframeStore'

export function Footer() {
  const showFooter = useIframeStore((state) => state.showFooter)

  if (!showFooter) {
    return null
  }

  return (
    <footer 
      className="h-8 shrink-0 flex items-center justify-between px-4 z-20 relative text-[10px] font-bold tracking-wider uppercase bg-gold-grain text-slate-950 border-t border-amber-600/20"
    >
      <div className="relative z-10 opacity-90 drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
        &copy; {new Date().getFullYear()} Projet SISE-Mali - Tous droits réservés.
      </div>
      <div className="flex items-center gap-3 relative z-10 opacity-80 drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
        <span>Développé par BAMASOFT</span>
        <span>•</span>
        <span>Version 1.0.0</span>
      </div>
    </footer>
  )
}
