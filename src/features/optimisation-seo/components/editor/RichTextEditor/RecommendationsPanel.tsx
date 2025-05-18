import React from 'react';
// Définir le type ContentAnalysisResult localement pour éviter les problèmes d'importation
interface ContentAnalysisResult {
  id: string;
  title: string;
  description: string;
  status: 'good' | 'improvement' | 'problem';
  score: number;
  priority: 'high' | 'medium' | 'low';
  category: 'keywords' | 'structure' | 'readability' | 'meta' | 'links' | 'images';
  suggestions?: string[];
}

import { 
  getStatusBorderColor, 
  groupResultsByCategory, 
  getCategoryTitle
  // Nous n'importons plus getStatusIconName ni getCategoryIcon car nous utilisons des SVG directement
} from './utils';

interface RecommendationsPanelProps {
  analysisResults: ContentAnalysisResult[];
  expandedCategories: Record<string, boolean>;
  setExpandedCategories: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ 
  analysisResults, 
  expandedCategories, 
  setExpandedCategories 
}) => {
  const groupedResults = groupResultsByCategory(analysisResults);

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-[#f0eeff]">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#5b50ff]">Recommandations</h2>
        
        {Object.entries(groupedResults).map(([category, results]) => (
          results.length > 0 && (
            <div key={category} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              {/* En-tête de la catégorie (toujours visible) */}
              <button 
                className="w-full flex items-center justify-between p-3 bg-[#f9f8ff] hover:bg-[#f0eeff] transition-colors duration-200"
                onClick={() => setExpandedCategories(prev => ({
                  ...prev,
                  [category]: !prev[category]
                }))}
              >
                <div className="flex items-center">
                  <span className="mr-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {/* Utiliser un path générique basé sur le nom de l'icône */}
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-medium">{getCategoryTitle(category)}</h3>
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 text-gray-800">
                    {results.length}
                  </span>
                </div>
                <svg 
                  className={`h-5 w-5 transform transition-transform ${expandedCategories[category] ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Contenu de la catégorie (visible uniquement si déplié) */}
              {expandedCategories[category] && (
                <div className="p-3 space-y-3 border-t border-gray-200">
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
                        className={`p-3 bg-white rounded-lg border shadow-sm hover:shadow transition-all duration-200 ${getStatusBorderColor(result.status)}`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {/* Utiliser un path générique pour l'icône de statut */}
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h4 className="text-base font-medium">{result.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                            
                            {result.suggestions && result.suggestions.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">Suggestions :</p>
                                <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                                  {result.suggestions.map((suggestion, index) => {
                                    // Vérifier si la suggestion concerne un lien interne ou externe
                                    // Utiliser une approche plus robuste avec des expressions régulières pour détecter les différentes formulations
                                    const suggestionLower = suggestion.toLowerCase();
                                    
                                    // Détection des liens internes avec différentes formulations possibles
                                    const internalLinkPatterns = [
                                      /lien\s+interne/,
                                      /liens\s+internes/,
                                      /lien\s+vers\s+(une\s+|)autre\s+page\s+(du\s+|de\s+votre\s+|de\s+ce\s+|du\s+même\s+)site/
                                    ];
                                    const isInternalLinkSuggestion = internalLinkPatterns.some(pattern => pattern.test(suggestionLower));
                                    
                                    // Détection des liens externes avec différentes formulations possibles
                                    const externalLinkPatterns = [
                                      /lien\s+externe/,
                                      /liens\s+externes/,
                                      /lien\s+internet/,
                                      /liens\s+internet/,
                                      /lien\s+vers\s+(un\s+|)autre\s+site/,
                                      /lien\s+vers\s+(un\s+|)site\s+externe/
                                    ];
                                    const isExternalLinkSuggestion = externalLinkPatterns.some(pattern => pattern.test(suggestionLower));
                                    
                                    return (
                                      <li key={index} className="flex items-start">
                                        {/* Afficher un indicateur visuel pour les liens internes */}
                                        {isInternalLinkSuggestion && (
                                          <span className="inline-flex items-center justify-center mr-1 text-[#5b50ff]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                            </svg>
                                          </span>
                                        )}
                                        
                                        {/* Afficher un indicateur visuel pour les liens externes */}
                                        {isExternalLinkSuggestion && (
                                          <span className="inline-flex items-center justify-center mr-1 text-[#8a82ff]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                            </svg>
                                          </span>
                                        )}
                                        
                                        {/* Texte de la suggestion */}
                                        <span className={`${isInternalLinkSuggestion ? 'text-[#5b50ff]' : isExternalLinkSuggestion ? 'text-[#8a82ff]' : ''}`}>
                                          {suggestion}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
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

export default RecommendationsPanel;
