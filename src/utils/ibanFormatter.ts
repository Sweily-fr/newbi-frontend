/**
 * Utilitaire pour formater les IBANs
 * 
 * Permet de formater un IBAN en ajoutant des espaces tous les 4 caractères
 * pour améliorer la lisibilité (ex: FR76 3000 6000 0112 3456 7890 189)
 */

/**
 * Formate un IBAN en ajoutant des espaces tous les 4 caractères
 * @param iban - L'IBAN à formater
 * @returns L'IBAN formaté avec des espaces tous les 4 caractères
 */
export const formatIban = (iban?: string): string => {
  if (!iban) return "";
  
  // Supprimer tous les espaces existants
  const cleanedIban = iban.replace(/\s+/g, "");
  
  // Ajouter un espace tous les 4 caractères
  return cleanedIban.replace(/(.{4})(?=.)/g, "$1 ");
};
