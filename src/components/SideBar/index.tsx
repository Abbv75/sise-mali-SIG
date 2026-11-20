import { Database, Layers, List, Printer } from 'lucide-react'
import { PanelSection } from './Components/PanelSection'
import { PanelToggleButton } from './Components/PanelToggleButton'
import { useExportStore } from '@/stores/export/useExportStore'

// Sections Content
import { UglSection } from './Sections/UglSection'
import { ZoneSection } from './Sections/ZoneSection'
import { LocaliteSection } from './Sections/LocaliteSection'
import { StatsSection } from './Sections/StatsSection'
import { OrdreAffichageSection } from './Sections/OrdreAffichageSection'
import { LegendeSection } from './Sections/LegendeSection'

interface SidePanelProps {
  isOpen: boolean
  onTogglePanel: () => void
}

export function SidePanel({
  isOpen,
  onTogglePanel
}: SidePanelProps) {
  const panelBg = '#008d5b'
  const headerBgDarker = '#007e52'
  const openExport = useExportStore((s) => s.open)

  return (
    <div
      className="relative h-full shrink-0 z-20"
      style={{
        width: isOpen ? 320 : 0,
        transition: 'width 0.3s cubic-bezier(.16,1,.3,1)',
        backgroundColor: panelBg,
      }}
    >
      {/* Conteneur absolu qui garantit la hauteur contrainte pour le scroll */}
      <div className="absolute inset-0 flex flex-col">
        <aside
          className="carto-panel-scroll pt-8  flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
          style={{
            width: isOpen ? 320 : 0,
            background: panelBg,
            borderRight: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
            transition: 'width 0.3s cubic-bezier(.16,1,.3,1)',
          }}
        >
          {isOpen && (
            <div className="pb-10">

              <PanelSection title="Source de données" icon={Database} defaultOpen={true}>
                <div className="pt-1 space-y-6">
                  <UglSection />
                  <ZoneSection />
                  <LocaliteSection />
                </div>
              </PanelSection>

              <PanelSection title="Ordre d'affichage" icon={Layers} defaultOpen={false}>
                <OrdreAffichageSection />
              </PanelSection>

              <PanelSection title="Légende" icon={List} defaultOpen={false}>
                <LegendeSection />
              </PanelSection>

              <StatsSection />

            </div>
          )}

          {/* Bouton Export — toujours visible en bas */}
          {isOpen && (
            <div
              className="sticky bottom-0 left-0 right-0 px-4 py-3"
              style={{ background: '#007e52', borderTop: '1px solid rgba(255,255,255,0.15)' }}
            >
              <button
                onClick={openExport}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                <Printer className="w-4 h-4" />
                Exporter la carte
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Bouton flottant toggle panneau */}
      <PanelToggleButton
        isOpen={isOpen}
        onTogglePanel={onTogglePanel}
        headerBgDarker={headerBgDarker}
      />
    </div>
  )
}
