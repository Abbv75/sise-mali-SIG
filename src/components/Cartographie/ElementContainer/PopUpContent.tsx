import type { PopUpDataItem } from '@/types'

interface PopUpContentProps {
  popUpData: PopUpDataItem[]
  selectedFields?: string[]
}

/**
 * Contenu de la popup Leaflet — style SISE-Mali (tailwind)
 */
export function PopUpContent({ popUpData, selectedFields }: PopUpContentProps) {
  const items = selectedFields
    ? popUpData.filter((item) => selectedFields.includes(item.label))
    : popUpData

  return (
    <div className="min-w-[160px] max-w-[240px] text-sm font-sans">
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex flex-col py-1 ${index < items.length - 1 ? 'border-b border-gray-100' : ''}`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {item.label}
          </span>
          <span className="text-xs font-medium text-gray-800 mt-0.5">
            {item.value != null ? String(item.value) : '—'}
          </span>
        </div>
      ))}
    </div>
  )
}
