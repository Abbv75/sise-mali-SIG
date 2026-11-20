import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constant/axiosInstance'
import type { Localite } from '@/types'

export const useGetLocalites = () => {
  return useQuery({
    queryKey: ['localites'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Localite[]>('/localites/')
      return data
    },
  })
}
