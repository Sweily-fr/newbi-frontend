/**
 * Utilitaire de logging personnalisé pour Newbi
 * 
 * Désactive automatiquement les logs en production tout en les conservant en développement.
 * Les logs d'avertissement et d'erreur sont conservés même en production.
 */

// Détection de l'environnement de production via Vite
const isProduction = import.meta.env.PROD;

// Interface pour le logger
interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  time: (label: string) => void;
  timeEnd: (label: string) => void;
}

// Implémentation du logger
export const logger: Logger = {
  // Les logs de debug et d'info sont désactivés en production
  debug: (...args: unknown[]) => {
    if (!isProduction) {
      console.debug('[DEBUG]', ...args);
    }
  },
  
  info: (...args: unknown[]) => {
    if (!isProduction) {
      console.info('[INFO]', ...args);
    }
  },
  
  log: (...args: unknown[]) => {
    if (!isProduction) {
      console.log('[LOG]', ...args);
    }
  },
  
  // Les logs d'avertissement et d'erreur sont conservés même en production
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args);
  },
  
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },
  
  // Fonctions de chronométrage
  time: (label: string) => {
    if (!isProduction) {
      console.time(`[TIME] ${label}`);
    }
  },
  
  timeEnd: (label: string) => {
    if (!isProduction) {
      console.timeEnd(`[TIME] ${label}`);
    }
  }
};

// Export par défaut
export default logger;
