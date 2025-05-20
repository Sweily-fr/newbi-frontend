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
  groupResultsByCategory, 
  getCategoryTitle
} from './utils';

interface SuggestionsPanelProps {
  analysisResults: ContentAnalysisResult[];
  expandedCategories: Record<string, boolean>;
  setExpandedCategories: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ 
  analysisResults, 
  expandedCategories, 
  setExpandedCategories 
}) => {
  const groupedResults = groupResultsByCategory(analysisResults);

  return (
    <div className="w-full bg-white rounded overflow-hidden">
      <div className="px-4 py-4">
        <h2 className="text-base font-semibold mb-3 text-[#5b50ff]">Suggestions</h2>
        
        {Object.entries(groupedResults).map(([category, results]) => (
          results.length > 0 && (
            <div key={category} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              {/* En-tête de la catégorie (toujours visible) */}
              <button 
                className={`w-full flex items-center justify-between p-2 bg-white border-l-4 border-[#5b50ff] hover:bg-[#f9f8ff] transition-all duration-200 shadow-sm rounded-t-lg ${expandedCategories[category] ? 'rounded-b-none' : 'rounded-lg'}`}
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
                  <h3 className="text-base font-medium text-[#5b50ff]">{getCategoryTitle(category)}</h3>
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-[#f0eeff] text-[#5b50ff]">
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
                <div className="p-3 space-y-2">
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
                        className="bg-[#f9f8ff] p-3 rounded-lg flex items-start"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            {result.status === 'good' ? (
                              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : result.status === 'improvement' ? (
                              <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">{result.title}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">{result.description}</p>
                              
                              {result.suggestions && result.suggestions.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-[#f0eeff]">
                                  <p className="text-xs font-medium text-gray-500 mb-1">Suggestions :</p>
                                  <ul className="space-y-1.5">
                                    {result.suggestions.map((suggestion, index) => {
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
                                        <li key={index} className="flex items-start text-xs text-gray-600 bg-white p-2 rounded border border-[#f0eeff]">
                                          <div className="flex items-start">
                                            {/* Afficher un indicateur visuel pour les liens internes */}
                                            {isInternalLinkSuggestion && (
                                              <span className="inline-flex items-center justify-center mr-2 text-[#5b50ff] mt-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                                </svg>
                                              </span>
                                            )}
                                            
                                            {/* Afficher un indicateur visuel pour les liens externes */}
                                            {isExternalLinkSuggestion && (
                                              <span className="inline-flex items-center justify-center mr-2 text-[#8a82ff] mt-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                                </svg>
                                              </span>
                                            )}
                                            
                                            <span className={`${isInternalLinkSuggestion ? 'text-[#5b50ff]' : isExternalLinkSuggestion ? 'text-[#8a82ff]' : ''}`}>
                                              {suggestion}
                                            </span>
                                          </div>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              )}
                            </div>
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
              Commencez à rédiger votre contenu et ajoutez un mot-clé principal pour obtenir des suggestions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionsPanel;
