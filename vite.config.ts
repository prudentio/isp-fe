import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api/auth": {
        target: "http://localhost:8001",
        changeOrigin: true,
        secure: false,
      },
      "/api/notification":{
        target: "http://localhost:8002",
        changeOrigin: true,
        secure: false,
      },
      "/api/audit-log":{
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      }
    },
  },
})
