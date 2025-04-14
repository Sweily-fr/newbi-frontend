/**
 * Formate un nombre en prix avec le symbole € et 2 décimales
 * @param price - Le prix à formater
 * @returns Le prix formaté (ex: 10,50 €)
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Formate un pourcentage avec le symbole %
 * @param value - La valeur à formater
 * @returns La valeur formatée avec le symbole % (ex: 20%)
 */
export const formatPercent = (value: number): string => {
  return `${value}%`;
};

/**
 * Formate une date au format français (JJ/MM/AAAA)
 * @param dateString - La date à formater (chaîne ISO)
 * @returns La date formatée (ex: 01/01/2023) ou '-' si la date est invalide
 */
export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    return new Intl.DateTimeFormat('fr-FR').format(date);
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return '-';
  }
};
