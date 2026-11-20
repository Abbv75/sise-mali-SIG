import { useState, useMemo } from 'react'
import { useLocaliteStore } from '@/stores/localite/useLocaliteStore'
import { useGetLocalites, useGetNiveauxLocaliteConfig } from '@/services/localiteService'
import type { Localite } from '@/types/localite'
import type { NiveauLocalite } from '@/types/niveauLocalite'

export interface LocaliteLevelGroup {
  groupName: string
  levelRank: number
  config?: NiveauLocalite
  locs: Localite[]
}

export function useLocaliteSection() {
  const { data: localitesRaw = [], isLoading: localitesLoading } = useGetLocalites()
  const { data: niveauxConfig = [], isLoading: niveauxLoading } = useGetNiveauxLocaliteConfig()
  const selectedLocaliteIds = useLocaliteStore((state) => state.selectedLocaliteIds)
  const toggleLocalite = useLocaliteStore((state) => state.toggleLocalite)
  const toggleAllLocalites = useLocaliteStore((state) => state.toggleAllLocalites)

  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  // Indexation des niveaux de configuration pour résolution rapide
  const { configById, configByNumber } = useMemo(() => {
    const byId = new Map<number, NiveauLocalite>()
    const byNumber = new Map<number, NiveauLocalite>()

    niveauxConfig.forEach((cfg) => {
      if (cfg.id_nlc != null) byId.set(cfg.id_nlc, cfg)
      if (cfg.nombre_nlc != null) byNumber.set(Number(cfg.nombre_nlc), cfg)
      if (cfg.Code_number_nlc != null) byNumber.set(Number(cfg.Code_number_nlc), cfg)
    })

    return { configById: byId, configByNumber: byNumber }
  }, [niveauxConfig])

  // Grouper dynamiquement par niveau configuré
  const groups = useMemo((): LocaliteLevelGroup[] => {
    const groupsMap = new Map<string, LocaliteLevelGroup>()

    // 1. Initialiser les groupes à partir de la configuration officielle
    niveauxConfig.forEach((cfg) => {
      groupsMap.set(cfg.libelle_nlc, {
        groupName: cfg.libelle_nlc,
        levelRank: Number(cfg.nombre_nlc || cfg.Code_number_nlc || 0),
        config: cfg,
        locs: [],
      })
    })

    // 2. Filtrer les localités selon la recherche
    let filteredLocs = localitesRaw
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase()
      filteredLocs = localitesRaw.filter((l) => {
        const matchName = l.intitule_loca?.toLowerCase().includes(lower)
        const matchCode = l.code_loca?.toLowerCase().includes(lower)
        const parentName =
          typeof l.parent_loca === 'object' && l.parent_loca?.intitule_loca
            ? l.parent_loca.intitule_loca.toLowerCase()
            : ''
        return matchName || matchCode || parentName.includes(lower)
      })
    }

    // 3. Associer chaque localité à son niveau correspondant
    filteredLocs.forEach((loc) => {
      let levelConfig: NiveauLocalite | undefined

      if (loc.niveau_loca && typeof loc.niveau_loca === 'object') {
        const id = loc.niveau_loca.id_nlc
        levelConfig = id != null ? configById.get(id) : undefined
        if (!levelConfig) levelConfig = loc.niveau_loca as NiveauLocalite
      } else if (typeof loc.niveau_loca === 'number') {
        levelConfig = configById.get(loc.niveau_loca) || configByNumber.get(loc.niveau_loca)
      }

      const groupName =
        levelConfig?.libelle_nlc ||
        (typeof loc.niveau_loca === 'number' ? `Niveau ${loc.niveau_loca}` : 'Autre')

      const rank = Number(levelConfig?.nombre_nlc || levelConfig?.Code_number_nlc || 999)

      if (!groupsMap.has(groupName)) {
        groupsMap.set(groupName, {
          groupName,
          levelRank: rank,
          config: levelConfig,
          locs: [],
        })
      }

      groupsMap.get(groupName)!.locs.push(loc)
    })

    // 4. Si recherche en cours, n'afficher que les groupes non vides.
    // Sinon afficher les groupes configurés ordonnés selon la hiérarchie.
    return Array.from(groupsMap.values())
      .filter((g) => (searchTerm.trim() ? g.locs.length > 0 : true))
      .sort((a, b) => a.levelRank - b.levelRank || a.groupName.localeCompare(b.groupName))
  }, [localitesRaw, niveauxConfig, configById, configByNumber, searchTerm])

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const toggleGroupSelection = (e: React.MouseEvent, locs: Localite[]) => {
    e.stopPropagation()
    const validLocs = locs.filter(
      (l) =>
        (l.latitude_loca != null && l.longitude_loca != null) ||
        (l.shape_file != null && l.shape_file !== 'null' && String(l.shape_file).trim() !== '')
    )
    if (validLocs.length === 0) return

    const allSelected = validLocs.every((l) => selectedLocaliteIds.has(l.id_loca))
    validLocs.forEach((l) => {
      const selected = selectedLocaliteIds.has(l.id_loca)
      if (allSelected && selected) toggleLocalite(l.id_loca)
      else if (!allSelected && !selected) toggleLocalite(l.id_loca)
    })
  }

  // Localités valides (selon la recherche active) pour le toggle global de l'accordéon
  const filteredValidLocs = useMemo(() => {
    let locs = localitesRaw
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase()
      locs = localitesRaw.filter((l) => {
        const matchName = l.intitule_loca?.toLowerCase().includes(lower)
        const matchCode = l.code_loca?.toLowerCase().includes(lower)
        const parentName =
          typeof l.parent_loca === 'object' && l.parent_loca?.intitule_loca
            ? l.parent_loca.intitule_loca.toLowerCase()
            : ''
        return matchName || matchCode || parentName.includes(lower)
      })
    }
    return locs.filter(
      (l) =>
        (l.latitude_loca != null && l.longitude_loca != null) ||
        (l.shape_file != null && l.shape_file !== 'null' && String(l.shape_file).trim() !== '')
    )
  }, [localitesRaw, searchTerm])

  const allLocalitesSelected =
    filteredValidLocs.length > 0 &&
    filteredValidLocs.every((l) => selectedLocaliteIds.has(l.id_loca))

  const hasValidLocalites = filteredValidLocs.length > 0

  const handleToggleAll = () => {
    const ids = filteredValidLocs.map((l) => l.id_loca)
    toggleAllLocalites(ids, !allLocalitesSelected)
  }

  return {
    localitesRaw,
    localitesLoading: localitesLoading || niveauxLoading,
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
  }
}
