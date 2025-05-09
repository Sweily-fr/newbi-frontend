/**
 * Utilitaire pour suivre l'activité de l'utilisateur et gérer la déconnexion automatique
 * après une période d'inactivité.
 */

import { Notification } from '../components/feedback/Notification';

// Durée d'inactivité avant déconnexion (30 minutes en millisecondes)
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

// Événements à surveiller pour réinitialiser le timer d'inactivité
const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click',
  'keydown'
];

/**
 * Classe pour gérer le suivi de l'activité utilisateur
 */
class ActivityTracker {
  private timer: number | null = null;
  private logoutCallback: (() => void) | null = null;
  private warningShown = false;
  private warningTimer: number | null = null;

  /**
   * Initialise le tracker d'activité
   * @param logoutCallback Fonction à appeler pour déconnecter l'utilisateur
   */
  init(logoutCallback: () => void): void {
    this.logoutCallback = logoutCallback;
    this.resetTimer();
    
    // Ajouter les écouteurs d'événements pour détecter l'activité
    ACTIVITY_EVENTS.forEach(eventType => {
      window.addEventListener(eventType, this.handleUserActivity);
    });
    
  }

  /**
   * Nettoie les ressources utilisées par le tracker
   */
  cleanup(): void {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    
    if (this.warningTimer) {
      window.clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
    
    ACTIVITY_EVENTS.forEach(eventType => {
      window.removeEventListener(eventType, this.handleUserActivity);
    });
    
    this.logoutCallback = null;
  }

  /**
   * Gère les événements d'activité utilisateur
   */
  private handleUserActivity = (): void => {
    // Réinitialiser le timer à chaque activité
    this.resetTimer();
    
    // Si un avertissement était affiché, le masquer
    if (this.warningShown) {
      this.warningShown = false;
      // Ici, on pourrait masquer une notification d'avertissement si nécessaire
    }
  };

  /**
   * Réinitialise le timer d'inactivité
   */
  private resetTimer(): void {
    // Effacer le timer existant
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    
    if (this.warningTimer) {
      window.clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
    
    // Définir un avertissement 1 minute avant la déconnexion
    this.warningTimer = window.setTimeout(() => {
      this.showWarning();
    }, INACTIVITY_TIMEOUT - 60000); // 1 minute avant la déconnexion
    
    // Définir un nouveau timer
    this.timer = window.setTimeout(() => {
      this.handleInactivityTimeout();
    }, INACTIVITY_TIMEOUT);
  }

  /**
   * Affiche un avertissement avant la déconnexion
   */
  private showWarning(): void {
    if (!this.warningShown) {
      this.warningShown = true;
      Notification.warning('Vous serez déconnecté dans 1 minute pour inactivité. Cliquez n\'importe où pour rester connecté.', {
        duration: 10000,
        position: 'bottom-left'
      });
    }
  }

  /**
   * Gère la déconnexion après le délai d'inactivité
   */
  private handleInactivityTimeout(): void {
    if (this.logoutCallback) {
      Notification.info('Vous avez été déconnecté pour inactivité.', {
        duration: 5000,
        position: 'bottom-left'
      });
      
      this.logoutCallback();
    }
  }
}

// Exporter une instance unique
export const activityTracker = new ActivityTracker();
