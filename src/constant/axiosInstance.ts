import axios from 'axios'

// Configure API URL with proxy support for development
const API_CONFIG = {
  simandou: {
    proxy: '/api-simandou',
    baseUrl: import.meta.env.VITE_SIMANDOU_API_URL || 'https://api.ruche-sectoriel.net',
  },
}

export const getApiUrl = (key: keyof typeof API_CONFIG, path: string) => {
  const config = API_CONFIG[key]
  const prefix = import.meta.env.DEV ? config.proxy : config.baseUrl
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${prefix}${cleanPath}`
}

export const axiosInstance = axios.create({
  baseURL: getApiUrl('simandou', '/api'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

