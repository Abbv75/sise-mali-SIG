import { useState, useMemo } from 'react'
import type { Localite } from '@/types/localite'

export function useLocalitesTabs(
  localitesRaw: Localite[], 
  selectedLocaliteIds: Set<number>, 
  toggleLocalite: (id: number) => void
) {
  const localiteGroups = useMemo(() => {
    const groups: Record<string, Localite[]> = {}
    localitesRaw.forEach((loc) => {
      let levelName = 'Autre'
      if (loc.niveau_loca && typeof loc.niveau_loca === 'object' && 'libelle_nlc' in loc.niveau_loca) {
        levelName = loc.niveau_loca.libelle_nlc
      } else if (typeof loc.niveau_loca === 'string' || typeof loc.niveau_loca === 'number') {
        levelName = `Niveau ${loc.niveau_loca}`
      }
      
      if (!groups[levelName]) {
        groups[levelName] = []
      }
      groups[levelName].push(loc)
    })
    return groups
  }, [localitesRaw])

  const availableTabs = Object.keys(localiteGroups).sort()
  const [activeLocaliteTab, setActiveLocaliteTab] = useState<string>(availableTabs[0] || '')

  if (!activeLocaliteTab && availableTabs.length > 0) {
    setActiveLocaliteTab(availableTabs[0])
  }

  const tabLocalites = localiteGroups[activeLocaliteTab] || []
  const allTabSelected = tabLocalites.length > 0 && tabLocalites.every(l => selectedLocaliteIds.has(l.id_loca))
  
  const toggleCurrentTab = () => {
    const newState = !allTabSelected
    tabLocalites.forEach(l => {
      if (newState && !selectedLocaliteIds.has(l.id_loca)) toggleLocalite(l.id_loca)
      else if (!newState && selectedLocaliteIds.has(l.id_loca)) toggleLocalite(l.id_loca)
    })
  }

  return {
    availableTabs,
    activeLocaliteTab,
    setActiveLocaliteTab,
    tabLocalites,
    allTabSelected,
    toggleCurrentTab
  }
}
