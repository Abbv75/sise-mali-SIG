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
    return zonesRaw.filter(
      (z) =>
        z.nom_zone?.toLowerCase().includes(lower) ||
        z.code_zone?.toLowerCase().includes(lower) ||
        String(z.type_zone)?.toLowerCase().includes(lower)
    )
  }, [zonesRaw, searchTerm])

  const filteredValidZones = useMemo(() => {
    return filteredZones.filter((z) => {
      const hasShapefile = Boolean(
        z.shape_file && z.shape_file !== 'null' && String(z.shape_file).trim() !== ''
      )
      const hasCoords =
        z.latitude_zone != null &&
        z.longitude_zone != null &&
        String(z.latitude_zone).trim() !== '' &&
        String(z.longitude_zone).trim() !== '' &&
        z.latitude_zone !== 'null' &&
        z.longitude_zone !== 'null' &&
        !isNaN(Number(z.latitude_zone)) &&
        !isNaN(Number(z.longitude_zone))

      return hasShapefile || hasCoords
    })
  }, [filteredZones])

  const allZonesSelected =
    filteredValidZones.length > 0 &&
    filteredValidZones.every((z) => selectedZoneIds.has(z.id_zone_collecte))

  const handleToggleAll = () => {
    const zoneIds = filteredValidZones.map((z) => z.id_zone_collecte)
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
    hasValidZones: filteredValidZones.length > 0,
  }
}
