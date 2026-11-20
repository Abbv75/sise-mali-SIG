import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface PanelSectionProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  defaultOpen?: boolean
}

export function PanelSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: PanelSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-white/95 hover:bg-white/10 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Icon className="h-4 w-4 opacity-80" />
          {title}
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 opacity-70" />
        ) : (
          <ChevronRight className="h-4 w-4 opacity-70" />
        )}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}
