import { useColorStore, HEADER_COLORS } from '@/stores/color/useColorStore'
import { useIframeStore } from '@/stores/iframe/useIframeStore'

export function Footer() {
  const showFooter = useIframeStore((state) => state.showFooter)
  const headerColorKey = useColorStore((state) => state.headerColor)
  const headerBgColor = HEADER_COLORS[headerColorKey]?.bg || 'var(--header-bg)'
  const headerTextColor = HEADER_COLORS[headerColorKey]?.text || 'var(--header-text)'

  if (!showFooter) {
    return null
  }

  return (
    <footer 
      className="h-8 shrink-0 flex items-center justify-between px-4 z-20 relative text-[10px] font-semibold tracking-wider uppercase"
      style={{ 
        backgroundColor: headerBgColor,
        color: headerTextColor,
      }}
    >
      <div style={{ opacity: 0.9 }}>
        &copy; {new Date().getFullYear()} Projet SISE-Mali - Tous droits réservés.
      </div>
      <div className="flex items-center gap-3" style={{ opacity: 0.7 }}>
        <span>Développé par BAMASOFT</span>
        <span>•</span>
        <span>Version 1.0.0</span>
      </div>
    </footer>
  )
}
