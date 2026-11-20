import { useRef } from 'react'
import { MousePointer, Hand, Type, Pencil, Eraser, List, Layers, Trash2, Lock, LockOpen, Map, Image as ImageIcon, LayoutTemplate } from 'lucide-react'
import { useExportStore, type ExportTool } from '@/stores/export/useExportStore'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ToolButtonProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  onClick: () => void
  danger?: boolean
}

function ToolButton({ icon: Icon, label, active, onClick, danger }: ToolButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            'flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-lg transition-all text-xs',
            active
              ? 'bg-[#FCD116] text-slate-900 font-bold shadow-lg'
              : danger
              ? 'text-red-400 hover:bg-red-500/20'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
          )}
        >
          <Icon className="w-4 h-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

interface ExportToolbarProps {
  onClearAll: () => void
}

export function ExportToolbar({ onClearAll }: ExportToolbarProps) {
  const { activeTool, setActiveTool, showLegend, toggleLegend, showLayerOrder, toggleLayerOrder, showPageHeader, togglePageHeader, mapLocked, toggleMapLocked } =
    useExportStore()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result
      if (typeof dataUrl === 'string') {
        window.dispatchEvent(
          new CustomEvent('export:addImage', { detail: dataUrl })
        )
      }
    }
    reader.readAsDataURL(file)
    // Réinitialiser l'input
    e.target.value = ''
  }

  const tools: { tool: ExportTool; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { tool: 'select', icon: MousePointer, label: 'Sélection' },
    { tool: 'pan', icon: Hand, label: 'Déplacer la page' },
    { tool: 'text', icon: Type, label: 'Ajouter du texte' },
    { tool: 'pencil', icon: Pencil, label: 'Crayon libre' },
    { tool: 'eraser', icon: Eraser, label: 'Gomme' },
  ]

  return (
    <TooltipProvider delayDuration={150}>
      <div
        className="flex flex-col items-center py-3 gap-1 shrink-0"
        style={{
          width: 56,
          background: '#0f172a',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Input caché pour l'import d'image */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Outils principaux */}
        {tools.map(({ tool, icon, label }) => (
          <ToolButton
            key={tool}
            icon={icon}
            label={label}
            active={activeTool === tool}
            onClick={() => setActiveTool(tool)}
          />
        ))}

        <ToolButton
          icon={ImageIcon}
          label="Importer une image"
          onClick={() => fileInputRef.current?.click()}
        />

        {/* Séparateur */}
        <div className="w-8 h-px bg-white/10 my-1" />

        {/* Toggle carte interactive / verrouillée */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleMapLocked}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-12 rounded-lg transition-all text-[9px] font-semibold py-1.5',
                mapLocked
                  ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                  : 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30'
              )}
            >
              {mapLocked ? <Lock className="w-4 h-4" /> : <LockOpen className="w-4 h-4" />}
              <Map className="w-3 h-3 opacity-60" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700 max-w-[200px] text-center">
            <p>{mapLocked ? 'Carte verrouillée — cliquer pour interagir avec la carte' : 'Carte interactive — cliquer pour verrouiller'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Séparateur */}
        <div className="w-8 h-px bg-white/10 my-1" />

        {/* Widgets */}
        <ToolButton
          icon={LayoutTemplate}
          label="En-tête"
          active={showPageHeader}
          onClick={togglePageHeader}
        />
        <ToolButton
          icon={List}
          label="Légende"
          active={showLegend}
          onClick={toggleLegend}
        />
        <ToolButton
          icon={Layers}
          label="Calques (Annotations)"
          active={showLayerOrder}
          onClick={toggleLayerOrder}
        />

        {/* Séparateur */}
        <div className="w-8 h-px bg-white/10 my-1" />

        {/* Danger */}
        <ToolButton
          icon={Trash2}
          label="Effacer toutes les annotations"
          onClick={onClearAll}
          danger
        />
      </div>
    </TooltipProvider>
  )
}
