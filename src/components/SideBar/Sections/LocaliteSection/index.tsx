import { Loader2, Search, CheckSquare, Square } from 'lucide-react'
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
    allLocalitesSelected,
    hasValidLocalites,
    handleToggleAll,
  } = useLocaliteSection()

  return (
    <div className="flex flex-col space-y-2 pt-1">
      {/* Barre de recherche et commutateur global */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
          <input
            type="text"
            placeholder="Rechercher une localité, code, cercle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#FCD116] transition-shadow"
          />
        </div>

        <button
          onClick={handleToggleAll}
          disabled={!hasValidLocalites}
          className="shrink-0 p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          title={allLocalitesSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
        >
          {allLocalitesSelected ? (
            <CheckSquare className="w-4 h-4 text-[#FCD116]" />
          ) : (
            <Square className="w-4 h-4 text-white/40" />
          )}
        </button>
      </div>

      {/* Compteur global discret */}
      <div className="flex items-center justify-between text-[10px] text-white/40 px-1">
        <span>Niveaux administratifs</span>
        <span>{selectedLocaliteIds.size} / {localitesRaw.length} sélectionné(s)</span>
      </div>

      {/* Proposition directe des niveaux administratifs */}
      <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto carto-panel-scroll pr-1 pb-1">
        {localitesLoading ? (
          <div className="flex items-center gap-2 px-2 py-3 text-white/50 text-xs">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Chargement des niveaux...
          </div>
        ) : groups.length === 0 ? (
          <div className="text-xs text-white/40 italic px-2 py-2">
            {searchTerm ? 'Aucune localité trouvée' : 'Aucun niveau configuré'}
          </div>
        ) : (
          groups.map((group) => (
            <LocaliteGroup
              key={group.groupName}
              groupName={group.groupName}
              levelRank={group.levelRank}
              locs={group.locs}
              isOpen={openGroups.has(group.groupName) || searchTerm.trim().length > 0}
              selectedLocaliteIds={selectedLocaliteIds}
              toggleGroup={toggleGroup}
              toggleGroupSelection={toggleGroupSelection}
              toggleLocalite={toggleLocalite}
            />
          ))
        )}
      </div>
    </div>
  )
}
