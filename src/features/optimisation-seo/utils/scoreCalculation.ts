import { ContentAnalysisResult, SeoScore } from '../types';

/**
 * Calcule le score SEO global basé sur les résultats d'analyse
 * avec une pondération améliorée pour les nouvelles recommandations
 */
export const calculateOverallScore = (results: ContentAnalysisResult[]): SeoScore => {
  // Si aucun résultat, score de 0
  if (results.length === 0) {
    return { value: 0, label: 'Non évalué', color: 'red' };
  }
  
  // Calcul du score total pondéré par priorité
  let totalScore = 0;
  let totalWeight = 0;
  
  // Poids par priorité
  const weights = {
    high: 3,
    medium: 2,
    low: 1
  };
  
  // Calcul du score pondéré
  results.forEach(result => {
    const weight = weights[result.priority];
    totalScore += result.score * weight;
    totalWeight += weight * 10; // Multiplié par 10 car chaque score est sur 10
  });
  
  // Score global en pourcentage
  const overallScore = Math.round((totalScore / totalWeight) * 100);
  
  // Détermination du label et de la couleur en fonction du score
  let label: string;
  let color: 'red' | 'orange' | 'yellow' | 'green';
  
  if (overallScore >= 90) {
    label = 'Excellent';
    color = 'green';
  } else if (overallScore >= 80) {
    label = 'Très bon';
    color = 'green';
  } else if (overallScore >= 70) {
    label = 'Bon';
    color = 'green';
  } else if (overallScore >= 60) {
    label = 'Correct';
    color = 'yellow';
  } else if (overallScore >= 50) {
    label = 'Moyen';
    color = 'yellow';
  } else if (overallScore >= 40) {
    label = 'Faible';
    color = 'orange';
  } else if (overallScore >= 30) {
    label = 'Insuffisant';
    color = 'orange';
  } else if (overallScore >= 20) {
    label = 'Mauvais';
    color = 'red';
  } else if (overallScore >= 10) {
    label = 'Très mauvais';
    color = 'red';
  } else {
    label = 'Critique';
    color = 'red';
  }
  
  return { value: overallScore, label, color };
};
