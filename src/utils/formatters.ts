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
 * Formate un nombre en devise avec le symbole approprié
 * @param amount - Le montant à formater
 * @param currency - Le code de la devise (ex: EUR, USD, GBP)
 * @returns Le montant formaté avec le symbole de devise approprié
 */
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  // Utiliser fr-FR pour la locale par défaut (format européen)
  const locale = currency === 'USD' ? 'en-US' : 'fr-FR';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    // En cas d'erreur (devise non supportée), utiliser EUR par défaut
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
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
    // Utiliser l'utilitaire de logging personnalisé au lieu de console.error
    if (typeof window !== 'undefined') {
      import('./logger').then(({ logger }) => {
        logger.error('Erreur lors du formatage de la date:', error);
      });
    }
    return '-';
  }
};
