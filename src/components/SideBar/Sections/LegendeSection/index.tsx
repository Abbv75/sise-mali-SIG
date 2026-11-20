import { Search } from 'lucide-react'
import { useLegendeSection } from './useLegendeSection'
import { LegendeItem } from './LegendeItem'

export function LegendeSection() {
  const { sortedItems, hasActiveItems, searchTerm, setSearchTerm } = useLegendeSection()

  if (!hasActiveItems) {
    return <div className="text-xs text-white/40 italic mt-2">Aucun élément sélectionné</div>
  }

  return (
    <div className="flex flex-col space-y-2 mt-1">
      <div className="relative mb-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
        <input
          type="text"
          placeholder="Rechercher dans la légende..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#FCD116] transition-shadow"
        />
      </div>

      {sortedItems.length === 0 ? (
        <div className="text-xs text-white/40 italic px-2 py-2">Aucun élément trouvé</div>
      ) : (
        <div className="space-y-1.5 max-h-64 overflow-y-auto carto-panel-scroll pr-1 pb-1">
          {sortedItems.map((item) => (
            <LegendeItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
