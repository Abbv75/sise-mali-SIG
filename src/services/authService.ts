import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/constant/axiosInstance'

export const useLogin = () => {
  return useMutation({
    mutationFn: async () => {
      const payload = {
        id_personnel_perso: import.meta.env.VITE_LOGIN_ID_PERSONNEL,
        password: import.meta.env.VITE_LOGIN_PASSWORD,
      }

      const { data } = await axiosInstance.post('/auth/login/', payload)
      return data
    },
  })
}
