/**
 * Utilitaires pour la manipulation des dates
 */

/**
 * Formate une date en format long (ex: 28 février 2025)
 * @param timestamp - Timestamp ou chaîne de caractères représentant une date
 * @returns Date formatée ou 'Date invalide' en cas d'erreur
 */
export const formatDate = (timestamp: string | number): string => {
  try {
    // Convertir string en nombre si nécessaire
    const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    
    // Créer une date à partir du timestamp
    const date = new Date(timestampNum);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    // Formater la date en locale française (format long)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return 'Date invalide';
  }
};

/**
 * Formate une date en format court (ex: 28/02/2025)
 * @param timestamp - Timestamp ou chaîne de caractères représentant une date
 * @returns Date formatée ou 'Date invalide' en cas d'erreur
 */
export const formatDateShort = (timestamp: string | number): string => {
  try {
    // Convertir string en nombre si nécessaire
    const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    
    // Créer une date à partir du timestamp
    const date = new Date(timestampNum);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    // Formater la date en locale française (format court)
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return 'Date invalide';
  }
};
