import { useMemo } from 'react';
import { SignatureData } from '../types';

/**
 * Hook personnalisé pour calculer la progression de la signature email
 * @param signatureData Données de la signature
 * @returns Pourcentage de complétion (0-100)
 */
export const useSignatureProgress = (signatureData: SignatureData | null): number => {
  return useMemo(() => {
    // Vérifier si signatureData est null ou undefined
    if (!signatureData) {
      return 0;
    }
    // Initialiser les variables de score et poids total
    let score = 0;
    let totalWeight = 0;
    
    // Définir les champs requis et leur poids dans le calcul de la progression
    const requiredFields: { field: keyof SignatureData; weight: number }[] = [
      // Informations personnelles (40%)
      { field: 'fullName', weight: 10 },
      { field: 'jobTitle', weight: 10 },
      { field: 'email', weight: 10 },
      { field: 'phone', weight: 10 },
      
      // Informations entreprise (30%)
      { field: 'companyName', weight: 10 },
      { field: 'companyWebsite', weight: 10 },
      { field: 'companyAddress', weight: 10 },
      
      // Réseaux sociaux (10%)
      // Au moins un réseau social rempli
    ];
    
    // Vérifier si un modèle est sélectionné (10%)
    const templateWeight = 10;
    totalWeight += templateWeight;
    
    // Vérifier si la propriété templateId existe et est valide
    if ('templateId' in signatureData && typeof signatureData.templateId === 'number' && signatureData.templateId > 0) {
      score += templateWeight;
    }
    
    // Vérifier chaque champ requis
    requiredFields.forEach(({ field, weight }) => {
      totalWeight += weight;
      
      // Vérifier si le champ est rempli
      if (signatureData[field] && String(signatureData[field]).trim() !== '') {
        score += weight;
      }
    });
    
    // Vérifier si au moins un réseau social est rempli (10%)
    const socialWeight = 10;
    totalWeight += socialWeight;
    
    // Vérifier si socialLinks existe avant d'appeler Object.values
    const hasSocialLinks = signatureData.socialLinks ? Object.values(signatureData.socialLinks).some(
      link => link && link.trim() !== ''
    ) : false;
    
    if (hasSocialLinks) {
      score += socialWeight;
    }
    
    // Calculer le pourcentage final
    return Math.round((score / totalWeight) * 100);
  }, [signatureData]);
};
