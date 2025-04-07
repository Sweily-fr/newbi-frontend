import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant qui fait défiler la page vers le haut lors d'un changement de route
 * À utiliser comme enfant direct du Router
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Faire défiler la page vers le haut lors d'un changement de route
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Ce composant ne rend rien
};
