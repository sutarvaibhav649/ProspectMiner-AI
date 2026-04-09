import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

<<<<<<< HEAD
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
=======
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
>>>>>>> de2f8be84931582659547cbf54840b72b5811262
