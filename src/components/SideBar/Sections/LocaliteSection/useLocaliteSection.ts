import { useState, useMemo } from 'react'
import { useLocaliteStore } from '@/stores/localite/useLocaliteStore'
import { useGetLocalites } from '@/services/localiteService'
import type { Localite } from '@/types/localite'

export function useLocaliteSection() {
  const { data: localitesRaw = [], isLoading: localitesLoading } = useGetLocalites()
  const selectedLocaliteIds = useLocaliteStore(state => state.selectedLocaliteIds)
  const toggleLocalite = useLocaliteStore(state => state.toggleLocalite)


  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  // Grouper par niveau (avec filtrage par recherche)
  const groups = useMemo(() => {
    const map: Record<string, typeof localitesRaw> = {}
    
    let filteredLocs = localitesRaw
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase()
      filteredLocs = localitesRaw.filter(l => l.intitule_loca?.toLowerCase().includes(lower))
    }

    filteredLocs.forEach((loc) => {
      let levelName = 'Autre'
      if (loc.niveau_loca && typeof loc.niveau_loca === 'object' && 'libelle_nlc' in loc.niveau_loca) {
        levelName = loc.niveau_loca.libelle_nlc
      } else if (typeof loc.niveau_loca === 'number') {
        levelName = `Niveau ${loc.niveau_loca}`
      }
      if (!map[levelName]) map[levelName] = []
      map[levelName].push(loc)
    })
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  }, [localitesRaw, searchTerm])

  const toggleGroup = (name: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const toggleGroupSelection = (e: React.MouseEvent, locs: Localite[]) => {
    e.stopPropagation()
    const validLocs = locs.filter(l => l.latitude_loca != null && l.longitude_loca != null)
    if (validLocs.length === 0) return

    const allSelected = validLocs.every(l => selectedLocaliteIds.has(l.id_loca))
    validLocs.forEach(l => {
      const selected = selectedLocaliteIds.has(l.id_loca)
      if (allSelected && selected) toggleLocalite(l.id_loca)
      else if (!allSelected && !selected) toggleLocalite(l.id_loca)
    })
  }

  return {
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
  }
}
