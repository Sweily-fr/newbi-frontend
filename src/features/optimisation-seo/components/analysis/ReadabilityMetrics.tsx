import React from 'react';
import { ContentStats } from '../../types';

interface ReadabilityMetricsProps {
  stats: ContentStats;
}

const ReadabilityMetrics: React.FC<ReadabilityMetricsProps> = ({ stats }) => {
  // Calcul du score de lisibilité sur 100
  const readabilityScore = Math.min(Math.max(Math.round(stats.readability.fleschScore), 0), 100);
  
  // Calcul du score de longueur (0-100) basé sur le nombre de mots
  const getLengthScore = () => {
    const { words } = stats.length;
    if (words < 300) return Math.round((words / 300) * 50); // 0-50 pour 0-300 mots
    if (words < 800) return 50 + Math.round(((words - 300) / 500) * 30); // 50-80 pour 300-800 mots
    if (words < 1500) return 80 + Math.round(((words - 800) / 700) * 20); // 80-100 pour 800-1500 mots
    return Math.max(0, 100 - Math.round(((words - 1500) / 1000) * 20)); // Décroît doucement après 1500 mots
  };
  
  const lengthScore = getLengthScore();
  
  // Libellés et descriptions
  const getReadabilityLabel = (score: number) => {
    if (score >= 70) return 'Très facile à lire';
    if (score >= 60) return 'Facile à lire';
    if (score >= 50) return 'Assez facile';
    if (score >= 30) return 'Un peu difficile';
    return 'Difficile à lire';
  };
  
  const getLengthLabel = (words: number) => {
    if (words < 300) return 'Trop court';
    if (words < 800) return 'Bonne longueur';
    if (words < 1500) return 'Très bon';
    return 'Un peu long';
  };
  
  const getLengthDescription = (words: number) => {
    if (words < 300) return 'Votre contenu est trop court. Essayez d\'atteindre au moins 300 mots.';
    if (words < 800) return 'Votre contenu est bien, mais pourrait être plus complet.';
    if (words < 1500) return 'Longueur idéale pour un contenu détaillé.';
    return 'Votre contenu est très complet, mais attention à ne pas être trop long pour les jeunes lecteurs.';
  };

  // Couleur et icône en fonction du score de lisibilité
  const getReadabilityIcon = (score: number) => {
    if (score >= 70) return (
      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
    if (score >= 50) return (
      <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
    return (
      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  // Icône pour la longueur du texte
  const getLengthIcon = (words: number) => {
    if (words >= 800 && words <= 1500) return (
      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
    if (words >= 300) return (
      <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
    return (
      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
        <svg className="h-4 w-4 mr-2 text-[#5b50ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Analyse du contenu
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Lisibilité</h4>
            {getReadabilityIcon(readabilityScore)}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(readabilityScore)}</p>
              <p className="text-xs text-gray-500">/ 100</p>
            </div>
            <p className="text-sm text-gray-600">{getReadabilityLabel(readabilityScore)}</p>
          </div>
          <div className="mt-3">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${readabilityScore}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Score Flesch-Kincaid: {Math.round(readabilityScore)}/100
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Longueur du texte</h4>
            {getLengthIcon(stats.length.words)}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.length.words}</p>
              <p className="text-xs text-gray-500">mots</p>
            </div>
            <p className="text-sm text-gray-600">{getLengthLabel(stats.length.words)}</p>
          </div>
          <div className="mt-3">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${lengthScore}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getLengthDescription(stats.length.words)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadabilityMetrics;
