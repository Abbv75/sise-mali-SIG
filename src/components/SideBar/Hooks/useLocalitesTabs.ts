import { useState, useMemo } from 'react'
import type { Localite } from '@/types/localite'
import type { NiveauLocalite } from '@/types/niveauLocalite'

export function useLocalitesTabs(
  localitesRaw: Localite[], 
  selectedLocaliteIds: Set<number>, 
  toggleLocalite: (id: number) => void,
  niveauxConfig: NiveauLocalite[] = []
) {
  const localiteGroups = useMemo(() => {
    const groups: Record<string, Localite[]> = {}
    localitesRaw.forEach((loc) => {
      let levelName = 'Autre'
      if (loc.niveau_loca && typeof loc.niveau_loca === 'object' && 'libelle_nlc' in loc.niveau_loca) {
        levelName = loc.niveau_loca.libelle_nlc
      } else if (typeof loc.niveau_loca === 'string' || typeof loc.niveau_loca === 'number') {
        const found = niveauxConfig.find(c => c.id_nlc === loc.niveau_loca || c.nombre_nlc === loc.niveau_loca)
        levelName = found ? found.libelle_nlc : `Niveau ${loc.niveau_loca}`
      }
      
      if (!groups[levelName]) {
        groups[levelName] = []
      }
      groups[levelName].push(loc)
    })
    return groups
  }, [localitesRaw, niveauxConfig])

  const availableTabs = useMemo(() => {
    const orderMap = new Map<string, number>()
    niveauxConfig.forEach(c => orderMap.set(c.libelle_nlc, Number(c.nombre_nlc || 0)))

    return Object.keys(localiteGroups).sort((a, b) => {
      const orderA = orderMap.get(a) ?? 999
      const orderB = orderMap.get(b) ?? 999
      return orderA - orderB || a.localeCompare(b)
    })
  }, [localiteGroups, niveauxConfig])

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
