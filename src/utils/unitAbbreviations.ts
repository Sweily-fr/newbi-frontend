/**
 * Utilitaire pour gérer les abréviations des unités dans les factures et devis
 * Permet d'afficher des versions courtes des unités lorsqu'elles sont trop longues
 */

// Mapping des unités vers leurs abréviations
export const unitAbbreviations: Record<string, string> = {
  // Unités de temps
  "Heure": "h",
  "Heures": "h",
  "Jour": "j",
  "Jours": "j",
  "Semaine": "sem",
  "Semaines": "sem",
  "Mois": "mois",
  "Année": "an",
  "Années": "ans",
  
  // Unités d'énergie
  "Kilowattheure": "kWh",
  "Kilowattheures": "kWh",
  "Mégawattheure": "MWh",
  "Mégawattheures": "MWh",
  "Gigawattheure": "GWh",
  "Gigawattheures": "GWh",
  
  // Unités de distance
  "Kilomètre": "km",
  "Kilomètres": "km",
  "Mètre": "m",
  "Mètres": "m",
  
  // Unités de volume
  "Mètre cube": "m³",
  "Mètres cubes": "m³",
  "Litre": "L",
  "Litres": "L",
  
  // Unités de poids
  "Kilogramme": "kg",
  "Kilogrammes": "kg",
  "Tonne": "t",
  "Tonnes": "t",
  
  // Unités de surface
  "Mètre carré": "m²",
  "Mètres carrés": "m²",
  
  // Unités de quantité
  "Pièce": "pc",
  "Pièces": "pcs",
  "Unité": "u",
  "Unités": "u",
};

/**
 * Obtient l'abréviation d'une unité si elle existe
 * @param unit - L'unité à abréger
 * @returns L'abréviation de l'unité ou l'unité originale si aucune abréviation n'existe
 */
export const getUnitAbbreviation = (unit?: string): string => {
  if (!unit) return "";

  
  // Vérifier si une abréviation existe pour cette unité (correspondance exacte)
  if (unitAbbreviations[unit]) {
    return unitAbbreviations[unit];
  }
  
  // Recherche insensible à la casse
  const unitLowerCase = unit.toLowerCase().trim();
  for (const [key, value] of Object.entries(unitAbbreviations)) {
    if (key.toLowerCase().trim() === unitLowerCase) {
      return value;
    }
  }
  
  // Recherche par inclusion partielle - UNIQUEMENT si l'unité est un mot complet dans la clé
  // Cela évite les correspondances incorrectes comme "Heure" dans "Kilowattheure"
  for (const [key, value] of Object.entries(unitAbbreviations)) {
    const keyWords = key.toLowerCase().split(/\s+/);
    const unitWords = unitLowerCase.split(/\s+/);
    
    // Vérifier si tous les mots de l'unité sont présents dans la clé comme mots complets
    const allWordsMatch = unitWords.every(word => keyWords.includes(word));
    
    if (allWordsMatch) {
      return value;
    }
  }
  return unit;
};
