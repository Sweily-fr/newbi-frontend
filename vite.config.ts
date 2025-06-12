import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement en fonction du mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    server: {
      proxy: {
        // Proxying API requests to Google Suggest
        '/api/google-suggest': {
          target: env.VITE_GOOGLE_SUGGEST_API_URL || 'https://suggestqueries.google.com/complete/search',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/google-suggest/, ''),
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (_, req) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        },
        // Proxying API requests to Wikipedia
        '/api/wikipedia': {
          target: env.VITE_WIKIPEDIA_API_URL || 'https://fr.wikipedia.org/w/api.php',
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
        // Proxying API requests to backend for file transfers
        '/api/file-transfer': {
          target: env.VITE_API_URL || 'http://localhost:4000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/file-transfer/, ''),
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.error('File transfer proxy error:', err);
            });
            proxy.on('proxyReq', (_, req) => {
              console.log('Sending File Request to API:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log('Received File Response from API:', proxyRes.statusCode, req.url, 'Content-Type:', proxyRes.headers['content-type']);
            });
          },
        },
        // Proxying API requests for expenses
        '/api/expenses': {
          target: env.VITE_API_URL || 'http://localhost:4000',
          changeOrigin: true,
          secure: false, // Désactive la vérification SSL pour le développement
          ws: true, // Important pour les WebSockets
          rewrite: (path) => path.replace(/^\/api\/expenses\/*/, '/api/expenses/'),
          configure: (proxy) => {
            // Gestion des erreurs
            const handleError = (err: Error, res: { headersSent: boolean; writeHead: (status: number, headers: Record<string, string>) => void; end: (data: string) => void }) => {
              // eslint-disable-next-line no-console
              console.error('Expenses API proxy error:', err);
              if (!res.headersSent) {
                res.writeHead(500, {
                  'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                  success: false,
                  message: 'Erreur de connexion au serveur',
                  details: err.message
                }));
              }
            };

            proxy.on('error', (err, _req, res) => handleError(err, res));
            
            // En mode développement uniquement, activer les logs détaillés
            if (process.env.NODE_ENV === 'development') {
              // Log des requêtes sortantes
              proxy.on('proxyReq', (proxyReq, req) => {
                const { method, url, headers } = req;
                // eslint-disable-next-line no-console
                console.log('Sending Expense Request to API:', {
                  method,
                  url,
                  headers: {
                    'content-type': headers['content-type'],
                    'content-length': headers['content-length'],
                    'authorization': headers['authorization'] ? '***' : undefined,
                  },
                });
                
                // Configuration des en-têtes de la requête
                proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');
                proxyReq.setHeader('Accept', 'application/json');
              });
              
              // Log des réponses entrantes
              proxy.on('proxyRes', (proxyRes, req) => {
                const { statusCode, statusMessage, headers } = proxyRes;
                // eslint-disable-next-line no-console
                console.log('Received Expense Response from API:', {
                  statusCode,
                  statusMessage,
                  url: req.url,
                  headers: {
                    'content-type': headers['content-type'],
                    'content-length': headers['content-length']
                  }
                });
              });
            }
          },
        },
      },
    },
  };
})