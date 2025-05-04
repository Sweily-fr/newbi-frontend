import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook personnalisé pour gérer la confirmation avant de quitter une page avec des modifications non enregistrées
 * @param enabled - Booléen pour activer/désactiver la confirmation
 * @param message - Message à afficher dans la popup de confirmation
 * @returns Un objet contenant les propriétés et méthodes pour gérer la confirmation
 */
export const useBeforeUnload = (enabled: boolean = true, message: string = 'Toute progression non enregistrée sera perdue. Êtes-vous sûr de vouloir continuer ?') => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pendingNavigation = useRef<string | null>(null);
  
  // Gérer l'API beforeunload du navigateur pour les fermetures d'onglet/fenêtre
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
      return event.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, message]);

  // Intercepter les clics sur les liens internes
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (e: MouseEvent) => {
      // Vérifier si c'est un clic sur un lien
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (!link) return;
      
      // Vérifier si c'est un lien interne (même origine)
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('#')) return;
      
      // Vérifier si c'est un lien vers une autre page de l'application
      if (href !== location.pathname) {
        e.preventDefault();
        pendingNavigation.current = href;
        setShowConfirmModal(true);
      }
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [enabled, location.pathname]);

  // Fonction pour confirmer la navigation
  const confirmNavigation = useCallback(() => {
    setShowConfirmModal(false);
    if (pendingNavigation.current) {
      navigate(pendingNavigation.current);
      pendingNavigation.current = null;
    }
  }, [navigate]);

  // Fonction pour annuler la navigation
  const cancelNavigation = useCallback(() => {
    setShowConfirmModal(false);
    pendingNavigation.current = null;
  }, []);

  return {
    showConfirmModal,
    confirmNavigation,
    cancelNavigation,
    message
  };
};
