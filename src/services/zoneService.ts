import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constant/axiosInstance'
import type { ZoneCollecteTable } from '@/types/zoneCollecte'

export const useGetZonesCollecte = () => {
  return useQuery({
    queryKey: ['zones-collectes'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ZoneCollecteTable[]>('/zones-collectes/')
      return data
    },
  })
}

export const useGetZonesAgroEcologiques = useGetZonesCollecte
