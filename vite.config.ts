import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api-sise-mali': {
        target: 'https://api.sise-mali.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-sise-mali/, ''),
      },
      '/api-simandou': {
        target: 'https://api.sise-mali.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-simandou/, ''),
      },
    },
  },
})
