import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    // En production, remplace console.log par une fonction vide
    ...(process.env.NODE_ENV === 'production' ? {
      'console.log': '(() => {})',
      'console.debug': '(() => {})',
      'console.info': '(() => {})',
    } : {})
  },
})
