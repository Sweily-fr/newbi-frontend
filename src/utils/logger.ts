/**
 * Utilitaire de logging personnalisé pour Newbi
 * 
 * Désactive automatiquement les logs en production tout en les conservant en développement.
 * Les logs d'avertissement et d'erreur sont conservés même en production.
 */

<<<<<<< HEAD
// Déterminer si nous sommes en environnement de production
const isProduction = import.meta.env.PROD;

/**
 * Logger personnalisé avec désactivation automatique en production
 */
export const logger = {
  /**
   * Log d'information (désactivé en production)
   */
  info: (...args: any[]): void => {
    if (!isProduction) {
      console.info('%c[INFO]', 'color: #5b50ff; font-weight: bold;', ...args);
    }
  },
  
  /**
   * Log de débogage (désactivé en production)
   */
  debug: (...args: any[]): void => {
    if (!isProduction) {
      console.debug('%c[DEBUG]', 'color: #4a41e0; font-weight: bold;', ...args);
    }
  },
  
  /**
   * Log standard (désactivé en production)
   */
  log: (...args: any[]): void => {
    if (!isProduction) {
      console.log('%c[LOG]', 'color: #5b50ff; font-weight: bold;', ...args);
    }
  },
  
  /**
   * Log d'avertissement (toujours actif)
   */
  warn: (...args: any[]): void => {
    console.warn('%c[WARN]', 'color: #ff9800; font-weight: bold;', ...args);
  },
  
  /**
   * Log d'erreur (toujours actif)
   */
  error: (...args: any[]): void => {
    console.error('%c[ERROR]', 'color: #f44336; font-weight: bold;', ...args);
  },
  
  /**
   * Démarre un timer (désactivé en production)
   */
  time: (label: string): void => {
    if (!isProduction) {
      console.time(label);
    }
  },
  
  /**
   * Termine un timer et affiche le temps écoulé (désactivé en production)
   */
  timeEnd: (label: string): void => {
    if (!isProduction) {
      console.timeEnd(label);
    }
  }
};
=======
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
>>>>>>> main
