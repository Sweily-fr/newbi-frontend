import React from 'react';
import { useBlogSeo } from '../../hooks/useBlogSeo';
import Progress from '../../../../components/ui/Progress'; // Notre composant Progress personnalisé

const SeoScorePanel: React.FC = () => {
  const { state } = useBlogSeo();
  const { overallScore } = state;

  // Fonction pour obtenir la couleur de fond en fonction du score
  const getScoreBackgroundColor = (color: 'red' | 'orange' | 'yellow' | 'green') => {
    switch (color) {
      case 'red':
        return 'bg-red-100 text-red-800';
      case 'orange':
        return 'bg-orange-100 text-orange-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      case 'green':
        return 'bg-[#f0eeff] text-[#5b50ff]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour obtenir le libellé de lisibilité
  const getReadabilityLabel = (score: number): string => {
    if (score >= 90) return 'Excellent - Très facile à lire';
    if (score >= 80) return 'Très bien - Facile à lire';
    if (score >= 70) return 'Bien - Assez facile à lire';
    if (score >= 60) return 'Moyen - Un peu difficile';
    if (score >= 50) return 'Assez difficile';
    if (score >= 30) return 'Difficile';
    return 'Très difficile - À améliorer';
  };

  // Fonction pour obtenir l'évaluation du nombre de mots
  const getWordCountRating = (wordCount: number): { label: string; color: string } => {
    if (wordCount > 2500) {
      return { label: 'Excellent', color: 'bg-[#f0eeff] text-[#5b50ff]' };
    } else if (wordCount >= 2000 && wordCount <= 2500) {
      return { label: 'Très bien', color: 'bg-[#f0eeff] text-[#5b50ff]' };
    } else if (wordCount >= 1500 && wordCount < 2000) {
      return { label: 'Bien', color: 'bg-[#f0eeff] text-[#5b50ff]' };
    } else if (wordCount >= 1000 && wordCount < 1500) {
      return { label: 'À améliorer', color: 'bg-[#f0eeff] text-[#5b50ff]' };
    } else if (wordCount >= 600 && wordCount < 1000) {
      return { label: 'Insuffisant', color: 'bg-[#f0eeff] text-[#5b50ff]' };
    } else {
      return { label: 'Médiocre', color: 'bg-[#f0eeff] text-[#5b50ff]' };
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Score global */}
      <div className="p-4">
        <h2 className="text-base font-semibold mb-3 text-[#5b50ff]">Score SEO global</h2>
        <div className="flex items-center">
          <div 
            className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold ${getScoreBackgroundColor(overallScore.color)}`}
          >
            {overallScore.value}
          </div>
          <div className="ml-4">
            <p className="text-base font-medium">{overallScore.label}</p>
            <p className="text-xs text-gray-500">
              {overallScore.value < 50 
                ? 'Votre contenu nécessite des améliorations importantes.' 
                : overallScore.value < 70 
                  ? 'Votre contenu est sur la bonne voie, mais peut être amélioré.' 
                  : 'Votre contenu est bien optimisé pour le SEO.'}
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques du contenu */}
      <div className="p-4">
        <h2 className="text-base font-semibold mb-3 text-[#5b50ff]">Statistiques du contenu</h2>
        <div className="space-y-2">
          <div className="bg-[#f9f8ff] p-3 rounded-lg flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500">Nombre de mots</p>
              <div className="flex items-center mt-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getWordCountRating(state.contentStats.length.words).color}`}>
                  {getWordCountRating(state.contentStats.length.words).label}
                </span>
              </div>
            </div>
            <p className="text-base font-semibold">{state.contentStats.length.words}</p>
          </div>
          <div className="bg-[#f9f8ff] p-3 rounded-lg flex justify-between items-center">
            <p className="text-xs text-gray-500">Temps de lecture</p>
            <p className="text-base font-semibold">{Math.ceil(state.contentStats.length.readingTime)} min</p>
          </div>
          <div className="bg-[#f9f8ff] p-3 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs text-gray-500">Score de lisibilité</p>
              <p className="text-sm font-semibold">{Math.round(state.contentStats.readability.fleschScore)}/100</p>
            </div>
            <Progress 
              value={state.contentStats.readability.fleschScore} 
              className="h-2 bg-gray-200"
              indicatorClassName="bg-[#5b50ff]"
            />
            <p className="text-xs text-gray-500 mt-1">
              {getReadabilityLabel(state.contentStats.readability.fleschScore)}
            </p>
          </div>
          <div className="bg-[#f9f8ff] p-3 rounded-lg flex justify-between items-center">
            <p className="text-xs text-gray-500">Densité du mot-clé</p>
            <p className="text-base font-semibold">{state.contentStats.keywordDensity.main.toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoScorePanel;
