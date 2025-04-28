import React from 'react';
import { toast, ToastOptions, Toast, Renderable } from 'react-hot-toast';

/**
 * Types de notifications disponibles
 */
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
  NEUTRAL = 'neutral',
  NEUTRAL_BLUE = 'neutral_blue'
}

/**
 * Interface pour les options de notification
 */
// Définition d'une interface personnalisée sans extension problématique
export interface NotificationOptions {
  /**
   * Durée d'affichage en millisecondes (défaut: 5000ms)
   */
  duration?: number;
  
  /**
   * Position de la notification (défaut: 'top-right')
   */
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  
  /**
   * Callback appelé lorsque la notification est fermée
   */
  onClose?: () => void;
  
  /**
   * Icône personnalisée à afficher
   */
  icon?: Renderable;
  
  /**
   * Utiliser le style personnalisé (défaut: true)
   */
  useCustomStyle?: boolean;
  
  /**
   * Propriétés supplémentaires pour la compatibilité avec ToastOptions
   */
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

interface NotificationToastProps {
  t: Toast;
  message: string;
  type: NotificationType;
  onClose?: () => void;
}

/**
 * Composant de notification personnalisé avec une interface visuelle avancée
 */
const NotificationToast: React.FC<NotificationToastProps> = ({ t, message, type, onClose }) => {
  // Définir les styles et icônes en fonction du type de notification
  const getTypeStyles = () => {
    switch (type) {
      case NotificationType.SUCCESS:
        return {
          icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>,
          bgColor: '#ECFDF5',
          textColor: '#065F46',
          borderColor: '#D1FAE5'
        };
      case NotificationType.ERROR:
        return {
          icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="2"/>
                <path d="M16 8L8 16M8 8L16 16" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>,
          bgColor: '#FEF2F2',
          textColor: '#B91C1C',
          borderColor: '#FEE2E2'
        };
      case NotificationType.WARNING:
        return {
          icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13M12 17H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>,
          bgColor: '#FFFBEB',
          textColor: '#92400E',
          borderColor: '#FEF3C7'
        };
      case NotificationType.NEUTRAL_BLUE:
        return {
          icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 17H9V15.5L12 11L15 15.5V17Z" fill="#3B82F6"/>
                <path d="M10 5C10 4.44772 10.4477 4 11 4H13C13.5523 4 14 4.44772 14 5V6C14 6.55228 13.5523 7 13 7H11C10.4477 7 10 6.55228 10 6V5Z" fill="#3B82F6"/>
                <path d="M19.0711 19.0711C15.1658 22.9763 8.83418 22.9763 4.92893 19.0711C1.02369 15.1658 1.02369 8.83418 4.92893 4.92893C8.83418 1.02369 15.1658 1.02369 19.0711 4.92893C22.9763 8.83418 22.9763 15.1658 19.0711 19.0711Z" stroke="#3B82F6" strokeWidth="2"/>
              </svg>,
          bgColor: '#EFF6FF',
          textColor: '#1E40AF',
          borderColor: '#DBEAFE'
        };
      case NotificationType.INFO:
        return {
          icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="2"/>
                <path d="M12 16V12M12 8H12.01" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
              </svg>,
          bgColor: '#F9FAFB',
          textColor: '#374151',
          borderColor: '#F3F4F6'
        };
      case NotificationType.NEUTRAL:
      default:
        return {
          icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="2"/>
                <path d="M12 16V12M12 8H12.01" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
              </svg>,
          bgColor: '#F9FAFB',
          textColor: '#374151',
          borderColor: '#F3F4F6'
        };
    }
  };

  const { icon, bgColor, textColor, borderColor } = getTypeStyles();

  return (
    <div
      className={`${t.visible ? 'animate-enter' : 'animate-leave'}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: bgColor,
        color: textColor,
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: `1px solid ${borderColor}`,
        maxWidth: '350px',
        width: '100%',
        position: 'relative',
        marginBottom: '8px'
      }}
    >
      <div style={{ marginRight: '12px', display: 'flex', alignItems: 'center' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>{message}</p>
      </div>
      <button
        onClick={() => {
          toast.dismiss(t.id);
          if (onClose) onClose();
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: textColor,
          opacity: 0.7,
          cursor: 'pointer',
          fontSize: '16px',
          marginLeft: '8px',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

/**
 * Nettoie les messages d'erreur complexes pour les rendre plus lisibles
 */
const cleanErrorMessage = (message: string): string => {
  let cleanedMessage = message;
  
  // Traitement des erreurs de validation
  if (cleanedMessage.includes('ValidationError')) {
    const lastColonIndex = cleanedMessage.lastIndexOf(':');
    if (lastColonIndex !== -1) {
      cleanedMessage = cleanedMessage.substring(lastColonIndex + 1).trim();
    }
  }
  
  return cleanedMessage;
};

/**
 * Fonction pour créer une notification personnalisée avec le composant NotificationToast
 */
const createCustomToast = (
  message: string,
  type: NotificationType,
  options?: ToastOptions & { onClose?: () => void }
): Renderable => {
  // Nettoyer le message d'erreur si c'est une notification d'erreur
  const cleanedMessage = type === NotificationType.ERROR 
    ? cleanErrorMessage(message) 
    : message;
    
  // Fonction de rendu pour la notification personnalisée
  const renderToast = (t: Toast) => (
    <NotificationToast
      t={t}
      message={cleanedMessage}
      type={type}
      onClose={options?.onClose as unknown as (() => void)}
    />
  );
  
  // Retourner la fonction de rendu comme Renderable
  return renderToast as unknown as Renderable;
};

/**
 * Service de notification réutilisable
 */
export const Notification = {
  /**
   * Affiche une notification de succès
   * @param message Message à afficher
   * @param options Options de configuration
   * @returns Référence à la notification (pour la fermer manuellement)
   */
  success: (message: string, options?: NotificationOptions): Toast => {
    const { useCustomStyle = true, ...restOptions } = options || {};
    
    if (useCustomStyle) {
      // Créer des options compatibles avec ToastOptions
      const toastOptions: Partial<ToastOptions> = {
        duration: 5000,
        position: restOptions.position,
        id: restOptions.id,
        className: restOptions.className,
        style: restOptions.style,
      };
      
      // Appel à toast.custom avec les options filtrées
      return toast.custom(
        createCustomToast(message, NotificationType.SUCCESS, restOptions),
        toastOptions
      ) as unknown as Toast;
    }
    
    return toast.success(message, {
      duration: 5000,
      position: restOptions.position,
    }) as unknown as Toast;
  },

  /**
   * Affiche une notification d'erreur
   * @param message Message à afficher
   * @param options Options de configuration
   * @returns Référence à la notification (pour la fermer manuellement)
   */
  error: (message: string, options?: NotificationOptions): Toast => {
    const { useCustomStyle = true, ...restOptions } = options || {};
    
    if (useCustomStyle) {
      // Créer des options compatibles avec ToastOptions
      const toastOptions: Partial<ToastOptions> = {
        duration: 5000,
        position: restOptions.position,
        id: restOptions.id,
        className: restOptions.className,
        style: restOptions.style,
      };
      
      return toast.custom(
        createCustomToast(message, NotificationType.ERROR, restOptions),
        toastOptions
      ) as Toast;
    }
    
    return toast.error(message, {
      duration: 5000,
      icon: '🔔',
      position: restOptions.position,
    }) as Toast;
  },

  /**
   * Affiche une notification d'information
   * @param message Message à afficher
   * @param options Options de configuration
   * @returns Référence à la notification (pour la fermer manuellement)
   */
  info: (message: string, options?: NotificationOptions): Toast => {
    const { useCustomStyle = true, ...restOptions } = options || {};
    
    if (useCustomStyle) {
      // Créer des options compatibles avec ToastOptions
      const toastOptions: Partial<ToastOptions> = {
        duration: 5000,
        position: restOptions.position,
        id: restOptions.id,
        className: restOptions.className,
        style: restOptions.style,
      };
      
      return toast.custom(
        createCustomToast(message, NotificationType.INFO, restOptions),
        toastOptions
      ) as Toast;
    }
    
    return toast(message, {
      duration: 5000,
      icon: '🔔',
      position: restOptions.position,
    }) as Toast;
  },

  /**
   * Affiche une notification d'avertissement
   * @param message Message à afficher
   * @param options Options de configuration
   * @returns Référence à la notification (pour la fermer manuellement)
   */
  warning: (message: string, options?: NotificationOptions): Toast => {
    const { useCustomStyle = true, ...restOptions } = options || {};
    
    if (useCustomStyle) {
      // Créer des options compatibles avec ToastOptions
      const toastOptions: Partial<ToastOptions> = {
        duration: 5000,
        position: restOptions.position,
        id: restOptions.id,
        className: restOptions.className,
        style: restOptions.style,
      };
      
      return toast.custom(
        createCustomToast(message, NotificationType.WARNING, restOptions),
        toastOptions
      ) as Toast;
    }
    
    return toast(message, {
      duration: 5000,
      style: { backgroundColor: '#f39c12', color: 'white' },
      icon: '⚠️',
      position: restOptions.position,
    }) as Toast;
  },

  /**
   * Affiche une notification neutre
   * @param message Message à afficher
   * @param options Options de configuration
   * @returns Référence à la notification (pour la fermer manuellement)
   */
  neutral: (message: string, options?: NotificationOptions): Toast => {
    const { useCustomStyle = true, ...restOptions } = options || {};
    
    if (useCustomStyle) {
      // Créer des options compatibles avec ToastOptions
      const toastOptions: Partial<ToastOptions> = {
        duration: 5000,
        position: restOptions.position,
        id: restOptions.id,
        className: restOptions.className,
        style: restOptions.style,
      };
      
      return toast.custom(
        createCustomToast(message, NotificationType.NEUTRAL, restOptions),
        toastOptions
      ) as Toast;
    }
    
    return toast(message, {
      duration: 5000,
      style: { backgroundColor: '#F9FAFB', color: '#374151' },
      icon: 'i',
      position: restOptions.position,
    }) as Toast;
  },

  /**
   * Affiche une notification neutre bleue
   * @param message Message à afficher
   * @param options Options de configuration
   * @returns Référence à la notification (pour la fermer manuellement)
   */
  neutralBlue: (message: string, options?: NotificationOptions): Toast => {
    const { useCustomStyle = true, ...restOptions } = options || {};
    
    if (useCustomStyle) {
      // Créer des options compatibles avec ToastOptions
      const toastOptions: Partial<ToastOptions> = {
        duration: 5000,
        position: restOptions.position,
        id: restOptions.id,
        className: restOptions.className,
        style: restOptions.style,
      };
      
      return toast.custom(
        createCustomToast(message, NotificationType.NEUTRAL_BLUE, restOptions),
        toastOptions
      ) as Toast;
    }
    
    return toast(message, {
      duration: 5000,
      style: { backgroundColor: '#EFF6FF', color: '#1E40AF' },
      icon: 'i',
      position: restOptions.position,
    }) as unknown as Toast;
  },

  /**
   * Affiche une notification personnalisée
   * @param message Message à afficher
   * @param type Type de notification
   * @param options Options de configuration
   * @returns Référence à la notification (pour la fermer manuellement)
   */
  show: (message: string, type: NotificationType, options?: NotificationOptions): Toast => {
    switch (type) {
      case NotificationType.SUCCESS:
        return Notification.success(message, options);
      case NotificationType.ERROR:
        return Notification.error(message, options);
      case NotificationType.INFO:
        return Notification.info(message, options);
      case NotificationType.WARNING:
        return Notification.warning(message, options);
      case NotificationType.NEUTRAL_BLUE:
        return Notification.neutralBlue(message, options);
      case NotificationType.NEUTRAL:
        return Notification.neutral(message, options);
      default:
        return toast(message, {
          duration: 5000,
          position: options?.position,
        }) as unknown as Toast;
    }
  },
  
  /**
   * Ferme une notification spécifique
   * @param toastId ID de la notification à fermer
   */
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  /**
   * Ferme toutes les notifications
   */
  dismissAll: () => {
    toast.dismiss();
  },
};
