import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constant/axiosInstance'
import type { Ugl } from '@/types'

export const useGetUgl = () => {
  return useQuery({
    queryKey: ['ugls'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Ugl[]>('/ugl/')
      return data
    },
  })
}
