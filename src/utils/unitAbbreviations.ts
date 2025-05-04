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
  
  // Log pour débogage
  console.log('getUnitAbbreviation appelé avec:', unit);
  
  // Vérifier si une abréviation existe pour cette unité (correspondance exacte)
  if (unitAbbreviations[unit]) {
    console.log('Abréviation trouvée (correspondance exacte):', unitAbbreviations[unit]);
    return unitAbbreviations[unit];
  }
  
  // Recherche insensible à la casse
  const unitLowerCase = unit.toLowerCase();
  for (const [key, value] of Object.entries(unitAbbreviations)) {
    if (key.toLowerCase() === unitLowerCase) {
      console.log('Abréviation trouvée (insensible à la casse):', value);
      return value;
    }
  }
  
  // Recherche par inclusion partielle (pour les cas où l'unité contient des espaces ou caractères supplémentaires)
  for (const [key, value] of Object.entries(unitAbbreviations)) {
    if (unit.includes(key) || key.includes(unit)) {
      console.log('Abréviation trouvée (correspondance partielle):', value);
      return value;
    }
  }
  
  // Aucune correspondance trouvée
  console.log('Aucune abréviation trouvée pour:', unit);
  return unit;
};
