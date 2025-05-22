// Fonctions utilitaires pour la manipulation de contenu
// (Anciennement utilisées pour la détection des mots complexes, maintenant désactivées)

/**
 * Fonction désactivée - Marque les mots complexes dans le contenu HTML
 * @param content Contenu HTML à analyser
 * @returns Le contenu inchangé
 */
export const markComplexWords = (content: string): string => {
  // Désactivé temporairement pour résoudre les problèmes d'éditeur
  return content || '';
};

/**
 * Nettoie les marqueurs de mots complexes du contenu HTML
 * @param content Contenu HTML à nettoyer
 * @returns Contenu HTML sans les marqueurs de mots complexes
 */
export const cleanComplexWordMarkers = (content: string): string => {
  if (!content) return content;
  
  try {
    // Utiliser une simple regex pour supprimer les spans de mise en évidence
    return content.replace(
      new RegExp(`<span class="[^>]*>(.*?)</span>`, 'gi'),
      '$1'
    );
  } catch (error) {
    console.error('Erreur lors du nettoyage des marqueurs :', error);
    return content;
  }
};
