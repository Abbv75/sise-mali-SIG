import { useState, useRef, useEffect, useMemo } from 'react'
import { useGetProgrammes, useGetProjetsByProgramme } from '@/services/programmeProjetService'
import { useProgrammeProjetStore } from '@/stores/programmeProjet/useProgrammeProjetStore'
import type { Projet } from '@/types/programmeProjet'

export function useProgrammeProjetSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [programmeSearch, setProgrammeSearch] = useState('')
  const [projetSearch, setProjetSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Données API
  const { data: programmes = [], isLoading: programmesLoading } = useGetProgrammes()

  // Store Zustand
  const selectedProgramme = useProgrammeProjetStore((s) => s.selectedProgramme)
  const selectedProjet = useProgrammeProjetStore((s) => s.selectedProjet)
  const viewedProgrammeId = useProgrammeProjetStore((s) => s.viewedProgrammeId)
  const setSelectedProgramme = useProgrammeProjetStore((s) => s.setSelectedProgramme)
  const setSelectedProjet = useProgrammeProjetStore((s) => s.setSelectedProjet)
  const setViewedProgrammeId = useProgrammeProjetStore((s) => s.setViewedProgrammeId)
  const setProgrammeAndProjet = useProgrammeProjetStore((s) => s.setProgrammeAndProjet)

  // ID du programme visualisé dans le volet droit
  const effectiveProgrammeId = viewedProgrammeId ?? selectedProgramme?.id_programme ?? null
  const { data: projets = [], isLoading: projetsLoading } = useGetProjetsByProgramme(effectiveProgrammeId)

  // ── Sélection automatique initiale du 1er programme & 1er projet ──────────
  useEffect(() => {
    if (!selectedProgramme && programmes.length > 0) {
      const firstProg = programmes[0]
      setSelectedProgramme(firstProg)
    }
  }, [programmes, selectedProgramme, setSelectedProgramme])

  useEffect(() => {
    if (selectedProgramme && !selectedProjet && projets.length > 0) {
      const firstProjet = projets[0]
      setSelectedProjet(firstProjet)
    }
  }, [selectedProgramme, selectedProjet, projets, setSelectedProjet])

  // ── Fermeture avec la touche Échap ─────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // ── Filtrage Programmes ───────────────────────────────────────────────────
  const filteredProgrammes = useMemo(() => {
    if (!programmeSearch.trim()) return programmes
    const query = programmeSearch.toLowerCase()
    return programmes.filter(
      (p) =>
        p.nom_programme?.toLowerCase().includes(query) ||
        p.sigle_programme?.toLowerCase().includes(query) ||
        p.code_programme?.toLowerCase().includes(query)
    )
  }, [programmes, programmeSearch])

  // ── Filtrage Projets ──────────────────────────────────────────────────────
  const filteredProjets = useMemo(() => {
    if (!projetSearch.trim()) return projets
    const query = projetSearch.toLowerCase()
    return projets.filter(
      (p) =>
        p.intitule_projet?.toLowerCase().includes(query) ||
        p.sigle_projet?.toLowerCase().includes(query) ||
        p.code_projet?.toLowerCase().includes(query)
    )
  }, [projets, projetSearch])

  const viewedProgramme = useMemo(() => {
    return programmes.find((p) => p.id_programme === effectiveProgrammeId) || selectedProgramme
  }, [programmes, effectiveProgrammeId, selectedProgramme])

  const hasSplitPane = Boolean(effectiveProgrammeId && programmes.length > 0)

  const handleSelectProjet = (projet: Projet) => {
    if (viewedProgramme) {
      setProgrammeAndProjet(viewedProgramme, projet)
    } else {
      setSelectedProjet(projet)
    }
    setIsOpen(false)
  }

  const toggleOpen = () => {
    if (!isOpen && selectedProgramme) {
      setViewedProgrammeId(selectedProgramme.id_programme)
    }
    setIsOpen((prev) => !prev)
  }

  return {
    isOpen,
    setIsOpen,
    toggleOpen,
    containerRef,
    programmes,
    programmesLoading,
    filteredProgrammes,
    programmeSearch,
    setProgrammeSearch,
    projets,
    projetsLoading,
    filteredProjets,
    projetSearch,
    setProjetSearch,
    selectedProgramme,
    selectedProjet,
    viewedProgramme,
    effectiveProgrammeId,
    setViewedProgrammeId,
    hasSplitPane,
    handleSelectProjet,
  }
}
