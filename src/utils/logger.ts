/**
 * Utilitaire de logging personnalisé pour Newbi
 * 
 * Désactive automatiquement les logs en production tout en les conservant en développement.
 * Les logs d'avertissement et d'erreur sont conservés même en production.
 */

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
