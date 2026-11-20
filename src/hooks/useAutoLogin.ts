import { useState, useEffect } from 'react'
import { useLogin } from '@/services/authService'

/**
 * Hook d'authentification automatique au démarrage de l'application.
 * Déclenche le login via l'API et retourne l'état d'authentification.
 */
export const useAutoLogin = () => {
  const [isAuth, setIsAuth] = useState(false)
  const { mutateAsync: login } = useLogin()

  useEffect(() => {
    login()
      .then(() => setIsAuth(true))
      .catch((err) => {
        console.error("Erreur d'authentification:", err)
        // On continue quand même pour ne pas bloquer l'app
        setIsAuth(true)
      })
  }, [login])

  return { isAuth }
}
