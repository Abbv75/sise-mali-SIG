import { useState, useMemo } from 'react'
import { useZoneStore } from '@/stores/zone/useZoneStore'
import { useGetZonesCollecte } from '@/services/zoneService'

export function useZoneSection() {
  const { data: zonesRaw = [], isLoading: zonesLoading } = useGetZonesCollecte()
  const selectedZoneIds = useZoneStore((state) => state.selectedZoneIds)
  const toggleZone = useZoneStore((state) => state.toggleZone)
  const toggleAllZones = useZoneStore((state) => state.toggleAllZones)

  const [searchTerm, setSearchTerm] = useState('')

  const filteredZones = useMemo(() => {
    if (!searchTerm.trim()) return zonesRaw
    const lower = searchTerm.toLowerCase()
    return zonesRaw.filter((z) => z.nom_zone?.toLowerCase().includes(lower))
  }, [zonesRaw, searchTerm])

  const validZones = zonesRaw.filter(
    (z) =>
      Boolean(z.shape_file && z.shape_file !== 'null' && String(z.shape_file).trim() !== '') ||
      (z.latitude_zone != null && z.longitude_zone != null)
  )
  const allZonesSelected =
    validZones.length > 0 && validZones.every((z) => selectedZoneIds.has(z.id_zone_collecte))

  const handleToggleAll = () => {
    const zoneIds = validZones.map((z) => z.id_zone_collecte)
    toggleAllZones(zoneIds, !allZonesSelected)
  }

  return {
    zonesRaw,
    selectedZoneIds,
    toggleZone,
    zonesLoading,
    searchTerm,
    setSearchTerm,
    filteredZones,
    allZonesSelected,
    handleToggleAll,
    hasValidZones: validZones.length > 0,
  }
}
