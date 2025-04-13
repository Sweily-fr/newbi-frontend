import React from 'react';
import { useBlogSeo } from '../context';
import { ContentAnalysisResult } from '../types';

const SeoScorePanel: React.FC = () => {
  const { state } = useBlogSeo();
  const { overallScore, analysisResults } = state;

  // Fonction pour obtenir la couleur de fond en fonction du score
  const getScoreBackgroundColor = (color: 'red' | 'orange' | 'green') => {
    switch (color) {
      case 'red':
        return 'bg-red-100 text-red-800';
      case 'orange':
        return 'bg-orange-100 text-orange-800';
      case 'green':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour obtenir la couleur de la bordure en fonction du statut
  const getStatusBorderColor = (status: 'good' | 'improvement' | 'problem') => {
    switch (status) {
      case 'good':
        return 'border-l-4 border-green-500';
      case 'improvement':
        return 'border-l-4 border-orange-500';
      case 'problem':
        return 'border-l-4 border-red-500';
      default:
        return 'border-l-4 border-gray-300';
    }
  };

  // Fonction pour obtenir l'icône en fonction du statut
  const getStatusIcon = (status: 'good' | 'improvement' | 'problem') => {
    switch (status) {
      case 'good':
        return (
          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'improvement':
        return (
          <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'problem':
        return (
          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Fonction pour grouper les résultats par catégorie
  const groupResultsByCategory = (results: ContentAnalysisResult[]) => {
    const grouped: Record<string, ContentAnalysisResult[]> = {
      keywords: [],
      structure: [],
      readability: [],
      meta: [],
      links: [],
      images: []
    };

    results.forEach(result => {
      if (grouped[result.category]) {
        grouped[result.category].push(result);
      }
    });

    return grouped;
  };

  // Fonction pour obtenir le titre de la catégorie
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'keywords':
        return 'Mots-clés';
      case 'structure':
        return 'Structure du contenu';
      case 'readability':
        return 'Lisibilité';
      case 'meta':
        return 'Méta-données';
      case 'links':
        return 'Liens';
      case 'images':
        return 'Images';
      default:
        return category;
    }
  };

  // Fonction pour obtenir l'icône de la catégorie
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'keywords':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        );
      case 'structure':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        );
      case 'readability':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case 'meta':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'links':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'images':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const groupedResults = groupResultsByCategory(analysisResults);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Score global */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Score SEO global</h2>
        <div className="flex items-center">
          <div className={`text-4xl font-bold rounded-full w-20 h-20 flex items-center justify-center ${getScoreBackgroundColor(overallScore.color)}`}>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Nombre de mots</p>
            <p className="text-xl font-semibold">{state.contentStats.wordCount}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Temps de lecture</p>
            <p className="text-xl font-semibold">{Math.ceil(state.contentStats.readingTime)} min</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Score de lisibilité</p>
            <p className="text-xl font-semibold">{state.contentStats.fleschScore.toFixed(1)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Densité du mot-clé</p>
            <p className="text-xl font-semibold">{state.contentStats.keywordDensity.main.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      {/* Recommandations */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recommandations</h2>
        
        {Object.entries(groupedResults).map(([category, results]) => (
          results.length > 0 && (
            <div key={category} className="mb-6">
              <div className="flex items-center mb-2">
                <span className="mr-2">{getCategoryIcon(category)}</span>
                <h3 className="text-lg font-medium">{getCategoryTitle(category)}</h3>
              </div>
              
              <div className="space-y-4">
                {results
                  .sort((a, b) => {
                    // Trier par priorité puis par statut
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    const statusOrder = { problem: 0, improvement: 1, good: 2 };
                    
                    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                      return priorityOrder[a.priority] - priorityOrder[b.priority];
                    }
                    
                    return statusOrder[a.status] - statusOrder[b.status];
                  })
                  .map(result => (
                    <div 
                      key={result.id} 
                      className={`p-4 bg-white rounded-lg border ${getStatusBorderColor(result.status)}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          {getStatusIcon(result.status)}
                        </div>
                        <div className="ml-3">
                          <h4 className="text-base font-medium">{result.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                          
                          {result.suggestions && result.suggestions.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700">Suggestions :</p>
                              <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                                {result.suggestions.map((suggestion, index) => (
                                  <li key={index}>{suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )
        ))}
        
        {analysisResults.length === 0 && (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="mt-2 text-gray-500">
              Commencez à rédiger votre contenu et ajoutez un mot-clé principal pour obtenir des recommandations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeoScorePanel;
