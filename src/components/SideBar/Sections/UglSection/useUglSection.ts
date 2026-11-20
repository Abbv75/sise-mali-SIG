import { useState, useMemo } from 'react'
import { useGetUgl } from '@/services/uglService'
import { useUglStore } from '@/stores/ugl/useUglStore'

export function useUglSection() {
  const { data: uglsRaw = [], isLoading: uglsLoading } = useGetUgl()
  const selectedUglIds = useUglStore(state => state.selectedUglIds)
  const toggleUgl = useUglStore(state => state.toggleUgl)
  const toggleAllUgls = useUglStore(state => state.toggleAllUgls)

  const [searchTerm, setSearchTerm] = useState('')

  const filteredUgls = useMemo(() => {
    if (!searchTerm.trim()) return uglsRaw
    const lower = searchTerm.toLowerCase()
    return uglsRaw.filter(u => 
      u.nom_ugl?.toLowerCase().includes(lower) || 
      u.abrege_ugl?.toLowerCase().includes(lower)
    )
  }, [uglsRaw, searchTerm])

  const allUglsSelected = filteredUgls.length > 0 && filteredUgls.every(u => selectedUglIds.has(u.id_ugl))
  const hasValidUgls = filteredUgls.length > 0

  const handleToggleAll = () => {
    const ids = filteredUgls.map(u => u.id_ugl)
    toggleAllUgls(ids, !allUglsSelected)
  }

  return {
    uglsRaw,
    selectedUglIds,
    toggleUgl,
    uglsLoading,
    searchTerm,
    setSearchTerm,
    filteredUgls,
    allUglsSelected,
    handleToggleAll,
    hasValidUgls,
  }
}
