import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxying API requests to Google Suggest
      '/api/google-suggest': {
        target: 'https://suggestqueries.google.com/complete/search',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/google-suggest/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      // Proxying API requests to Wikipedia
      '/api/wikipedia': {
        target: 'https://fr.wikipedia.org/w/api.php',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const params = new URLSearchParams(url.search);
          
          // Paramètres pour l'API Wikipedia
          params.set('action', 'query');
          params.set('list', 'search');
          params.set('format', 'json');
          params.set('origin', '*');
          params.set('srlimit', '5'); // Limiter à 5 résultats
          params.set('utf8', '');
          params.set('srinfo', 'suggestion');
          
          return `?${params.toString()}`;
        },
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('Wikipedia API proxy error:', err);
          });
        },
      },
    },
  },
})