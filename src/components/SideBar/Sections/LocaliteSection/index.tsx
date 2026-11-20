import { Loader2, Search } from 'lucide-react'
import { useLocaliteSection } from './useLocaliteSection'
import { LocaliteGroup } from './LocaliteGroup'

export function LocaliteSection() {
  const {
    localitesRaw,
    localitesLoading,
    selectedLocaliteIds,
    toggleLocalite,
    openGroups,
    groups,
    toggleGroup,
    toggleGroupSelection,
    searchTerm,
    setSearchTerm,
  } = useLocaliteSection()

  return (
    <div className="flex flex-col mt-4">
      <div className="text-[11px] font-bold text-white/70 uppercase flex items-center gap-2 mb-1">
        Localités ({selectedLocaliteIds.size}/{localitesRaw.length})
      </div>

      <div className="relative mt-2 mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
        <input
          type="text"
          placeholder="Rechercher une localité..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#CE1126] transition-shadow"
        />
      </div>

      {localitesLoading ? (
        <div className="flex items-center gap-2 px-2 py-3 text-white/50 text-xs mt-1">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Chargement...
        </div>
      ) : groups.length === 0 ? (
        <div className="px-2 py-3 text-white/40 text-xs italic mt-1">
          {searchTerm ? 'Aucune localité trouvée' : 'Aucune localité'}
        </div>
      ) : (
        <div className="space-y-1  overflow-y-auto carto-panel-scroll pr-1 pb-1">
          {groups.map(([groupName, locs]) => (
            <LocaliteGroup
              key={groupName}
              groupName={groupName}
              locs={locs}
              isOpen={openGroups.has(groupName) || searchTerm.trim().length > 0} // Ouvrir automatiquement si recherche en cours
              selectedLocaliteIds={selectedLocaliteIds}
              toggleGroup={toggleGroup}
              toggleGroupSelection={toggleGroupSelection}
              toggleLocalite={toggleLocalite}
            />
          ))}
        </div>
      )}
    </div>
  )
}

