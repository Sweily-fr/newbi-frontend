/**
 * Calcule le nombre de mots dans un texte
 * @param text Le texte à analyser
 * @returns Le nombre de mots
 */
export const calculateWordCount = (text: string): number => {
  if (!text) return 0;
  
  // Nettoyer le texte (supprimer les espaces multiples, etc.)
  const cleanText = text.trim().replace(/\s+/g, ' ');
  
  // Diviser le texte en mots et compter
  const words = cleanText.split(' ');
  return words.length;
};

/**
 * Type pour le résultat de l'évaluation du nombre de mots
 */
export interface WordCountRating {
  label: string;
  color: string;
}

/**
 * Évalue la qualité du contenu en fonction du nombre de mots
 * @param wordCount Le nombre de mots
 * @returns Un objet contenant le label et la couleur correspondant à l'évaluation
 */
export const getWordCountRating = (wordCount: number): WordCountRating => {
  if (wordCount >= 1000) {
    return { label: 'Excellent', color: 'text-green-600' };
  } else if (wordCount >= 700) {
    return { label: 'Bon', color: 'text-blue-600' };
  } else if (wordCount >= 400) {
    return { label: 'Moyen', color: 'text-yellow-600' };
  } else {
    return { label: 'Insuffisant', color: 'text-red-600' };
  }
};
