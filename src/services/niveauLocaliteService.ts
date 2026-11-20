import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constant/axiosInstance'
import type { NiveauLocalite } from '@/types'

export const useGetNiveauxLocaliteConfig = () => {
  return useQuery({
    queryKey: ['niveaux-localite-config'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<NiveauLocalite[]>('/niveaux-localite-config/')
      return [...data].sort(
        (a, b) =>
          Number(a.nombre_nlc || a.Code_number_nlc || 0) -
          Number(b.nombre_nlc || b.Code_number_nlc || 0)
      )
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}
