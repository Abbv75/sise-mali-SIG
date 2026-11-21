import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constant/axiosInstance'
import type { Programme, Projet } from '@/types/programmeProjet'

export const useGetProgrammes = () => {
  return useQuery({
    queryKey: ['programmes'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Programme[]>('/programmes/')
      return data
    },
  })
}

export const useGetProjetsByProgramme = (programmeId?: number | null) => {
  return useQuery({
    queryKey: ['projets', programmeId],
    queryFn: async () => {
      if (!programmeId) return []
      const { data } = await axiosInstance.get<Projet[]>('/projets/', {
        params: { programme_projet: programmeId },
      })
      return data
    },
    enabled: Boolean(programmeId),
  })
}
