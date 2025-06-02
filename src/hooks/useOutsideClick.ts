import { useEffect, RefObject } from 'react';

/**
 * Hook personnalisé qui détecte les clics en dehors d'un élément référencé
 * et exécute une fonction de rappel lorsque cela se produit.
 * 
 * @param ref - Référence à l'élément DOM à surveiller
 * @param callback - Fonction à exécuter lorsqu'un clic est détecté en dehors de l'élément
 */
export const useOutsideClick = (
  ref: RefObject<HTMLElement>,
  callback: () => void
): void => {
  useEffect(() => {
    /**
     * Fonction qui vérifie si le clic est en dehors de l'élément référencé
     */
    const handleClickOutside = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Ajouter l'écouteur d'événement
    document.addEventListener('mousedown', handleClickOutside);
    
    // Nettoyer l'écouteur d'événement
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]); // Re-exécuter l'effet si la référence ou le callback change
};

export default useOutsideClick;
