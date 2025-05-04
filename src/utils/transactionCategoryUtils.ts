/**
 * Utilitaire pour la gestion des catégories de transaction
 */

/**
 * Traduit la valeur de l'énumération TransactionCategory en texte français
 * @param category La catégorie de transaction (GOODS, SERVICES, MIXED)
 * @returns Le texte français correspondant à la catégorie
 */
export const getTransactionCategoryText = (category?: string): string => {
  if (!category) return '';
  
  switch (category) {
    case 'GOODS':
      return 'Livraison de biens';
    case 'SERVICES':
      return 'Prestations de services';
    case 'MIXED':
      return 'Opérations mixtes';
    default:
      return '';
  }
};

/**
 * Génère le texte complet pour l'affichage de la catégorie de transaction
 * @param category La catégorie de transaction (GOODS, SERVICES, MIXED)
 * @returns Le texte complet à afficher
 */
export const getTransactionCategoryDisplayText = (category?: string): string => {
  const categoryText = getTransactionCategoryText(category);
  if (!categoryText) return '';
  
  return `Catégorie de transaction : ${categoryText}`;
};
