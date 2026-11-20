import { ChevronRight } from 'lucide-react'

interface PanelToggleButtonProps {
  isOpen: boolean
  onTogglePanel: () => void
  headerBgDarker: string
}

export function PanelToggleButton({ isOpen, onTogglePanel, headerBgDarker }: PanelToggleButtonProps) {
  return (
    <button
      onClick={onTogglePanel}
      title={isOpen ? 'Masquer le panneau' : 'Afficher le panneau'}
      style={{
        position: 'absolute',
        left: isOpen ? 320 : 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 20,
        width: 24,
        height: 64,
        background: headerBgDarker,
        border: '1px solid rgba(255,255,255,0.2)',
        borderLeft: 'none',
        borderRadius: '0 8px 8px 0',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'left 0.3s cubic-bezier(.16,1,.3,1), background 0.3s ease',
        color: 'rgba(255,255,255,0.9)',
        boxShadow: '4px 0 12px rgba(0,0,0,0.1)',
      }}
    >
      <ChevronRight
        className="h-4 w-4"
        style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s ease',
        }}
      />
    </button>
  )
}
