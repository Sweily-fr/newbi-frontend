import { useEffect } from 'react';

/**
 * Hook personnalisé pour verrouiller/déverrouiller le défilement du body
 * @param isLocked - État indiquant si le défilement doit être verrouillé
 */
export const useBodyScrollLock = (isLocked: boolean): void => {
  useEffect(() => {
    // Sauvegarder le style initial
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;
    
    if (isLocked) {
      // Calculer la largeur de la barre de défilement pour éviter le saut de contenu
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Appliquer les styles pour empêcher le défilement
      document.body.style.overflow = 'hidden';
      
      // Ajouter un padding-right équivalent à la largeur de la scrollbar pour éviter le saut
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }
    
    // Fonction de nettoyage pour restaurer les styles originaux
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]); // Réexécuter l'effet uniquement lorsque isLocked change
};
