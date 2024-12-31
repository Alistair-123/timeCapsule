import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Automatically uses your local IP address
    proxy: {
      '/api': {
        target: 'https://apps.emaillistverify.com', // External API base URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes '/api' from path
      },
    },
  },
})