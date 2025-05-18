import React from 'react';
import { useBlogSeo } from '../../hooks/useBlogSeo';

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#f0eeff]">
      {/* Score global */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-[#5b50ff]">Score SEO global</h2>
        <div className="flex items-center">
          <div className={`text-4xl font-bold rounded-full w-20 h-20 flex items-center justify-center shadow-sm ${getScoreBackgroundColor(overallScore.color)}`}>
            {overallScore.value}
          </div>
          <div className="ml-4">
            <p className="text-lg font-medium">{overallScore.label}</p>
            <p className="text-sm text-gray-500">
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
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Statistiques du contenu</h2>
        <div className="space-y-3">
          <div className="bg-[#f9f8ff] p-3 rounded-lg flex justify-between items-center border border-[#f0eeff]">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">Nombre de mots</p>
              <div className="flex items-center mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${getWordCountRating(state.contentStats.wordCount).color}`}>
                  {getWordCountRating(state.contentStats.wordCount).label}
                </span>
              </div>
            </div>
            <p className="text-xl font-semibold">{state.contentStats.wordCount}</p>
          </div>
          <div className="bg-[#f9f8ff] p-3 rounded-lg flex justify-between items-center border border-[#f0eeff]">
            <p className="text-sm text-gray-500">Temps de lecture</p>
            <p className="text-xl font-semibold">{Math.ceil(state.contentStats.readingTime)} min</p>
          </div>
          <div className="bg-[#f9f8ff] p-3 rounded-lg flex justify-between items-center border border-[#f0eeff]">
            <p className="text-sm text-gray-500">Score de lisibilité</p>
            <p className="text-xl font-semibold">{state.contentStats.fleschScore.toFixed(1)}</p>
          </div>
          <div className="bg-[#f9f8ff] p-3 rounded-lg flex justify-between items-center border border-[#f0eeff]">
            <p className="text-sm text-gray-500">Densité du mot-clé</p>
            <p className="text-xl font-semibold">{state.contentStats.keywordDensity.main.toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoScorePanel;
