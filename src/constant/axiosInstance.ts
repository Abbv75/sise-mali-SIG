import axios from 'axios'

// Configure API URL with proxy support for development
const API_CONFIG = {
  siseMali: {
    proxy: '/api-sise-mali',
    baseUrl:
      import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_SISE_MALI_API_URL ||
      import.meta.env.VITE_SIMANDOU_API_URL ||
      'https://api.sise-mali.net.net',
  },
  simandou: {
    proxy: '/api-sise-mali',
    baseUrl:
      import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_SISE_MALI_API_URL ||
      import.meta.env.VITE_SIMANDOU_API_URL ||
      'https://api.sise-mali.net.net',
  },
}

export const getApiUrl = (key: keyof typeof API_CONFIG, path: string) => {
  const config = API_CONFIG[key] || API_CONFIG.siseMali
  const prefix = import.meta.env.DEV ? config.proxy : config.baseUrl
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${prefix}${cleanPath}`
}

export const axiosInstance = axios.create({
  baseURL: getApiUrl('siseMali', '/api'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})
