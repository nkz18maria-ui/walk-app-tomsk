import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['dev.routegen.ru', 'routegen.ru', 'localhost'],
    hmr: {
      host: 'dev.routegen.ru',
      protocol: 'wss',
      clientPort: 443,
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
