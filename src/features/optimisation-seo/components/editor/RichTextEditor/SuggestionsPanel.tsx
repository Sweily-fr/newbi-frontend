import React, { useMemo, useEffect, useRef, FC } from 'react';
import { useBlogSeo } from '../../../hooks/useBlogSeo';
import { groupResultsByCategory, getCategoryTitle } from './utils';

type Status = 'good' | 'improvement' | 'problem';
type Priority = 'high' | 'medium' | 'low';
type Category = 'keywords' | 'structure' | 'readability' | 'meta' | 'links' | 'images';

interface ContentAnalysisResult {
  id: string;
  title: string;
  description: string;
  status: Status;
  score: number;
  priority: Priority;
  category: Category;
  suggestions?: string[];
}

interface SuggestionsPanelProps {
  analysisResults: ContentAnalysisResult[];
  expandedCategories: Record<string, boolean>;
  setExpandedCategories: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const SuggestionsPanel: FC<SuggestionsPanelProps> = ({ 
  analysisResults, 
  expandedCategories, 
  setExpandedCategories 
}) => {
  const isInitialMount = useRef(true);
  const { state } = useBlogSeo();
  
  const groupedResults = useMemo(
    () => groupResultsByCategory(analysisResults), 
    [analysisResults]
  );
  
  const hasSuggestions = useMemo(
    () => analysisResults.some(result => result.suggestions && result.suggestions.length > 0),
    [analysisResults]
  );

  // Gestion de l'ouverture initiale de la catégorie 'keywords'
  useEffect(() => {
    if (isInitialMount.current && analysisResults.length > 0) {
      isInitialMount.current = false;
      
      const hasOpenCategory = Object.values(expandedCategories).some(isOpen => isOpen);
      
      if (!hasOpenCategory) {
        setExpandedCategories(prev => ({
          ...prev,
          keywords: true
        }));
      }
    }
  }, [analysisResults, expandedCategories, setExpandedCategories]);

  // Fonction pour calculer le score de longueur (0-100) basé sur le nombre de mots
  const getLengthScore = () => {
    const words = state.contentStats?.length?.words || 0;
    if (words < 300) return Math.round((words / 300) * 50); // 0-50 pour 0-300 mots
    if (words < 800) return 50 + Math.round(((words - 300) / 500) * 30); // 50-80 pour 300-800 mots
    if (words < 1500) return 80 + Math.round(((words - 800) / 700) * 20); // 80-100 pour 800-1500 mots
    return Math.max(0, 100 - Math.round(((words - 1500) / 1000) * 20)); // Décroît doucement après 1500 mots
  };

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

  const renderReadabilityContent = () => {
    const readabilityScore = Math.min(Math.max(Math.round(state.contentStats?.readability?.fleschScore || 0), 0), 100);
    const lengthScore = getLengthScore();
    const words = state.contentStats?.length?.words || 0;

    return (
      <div className="w-full p-4 bg-white space-y-4">
        {/* Première ligne : Lisibilité */}
        <div className="w-full bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Lisibilité</h3>
            {getReadabilityIcon(readabilityScore)}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{readabilityScore}</p>
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
              Score Flesch-Kincaid: {readabilityScore}/100
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Longueur moyenne des phrases</span>
              <span className="font-medium">{state.contentStats?.readability?.avgSentenceLength?.toFixed(1) || 'N/A'} mots</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
              <span>Mots complexes</span>
              <span className="font-medium">
                {state.contentStats?.readability?.complexWords || 0} 
                ({state.contentStats?.readability?.complexWordPercentage?.toFixed(1) || 0}%)
              </span>
            </div>
          </div>
        </div>
        
        {/* Deuxième ligne : Longueur du texte */}
        <div className="w-full bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Longueur du texte</h3>
            {getLengthIcon(words)}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{words}</p>
              <p className="text-xs text-gray-500">mots</p>
            </div>
            <p className="text-sm text-gray-600">{getLengthLabel(words)}</p>
          </div>
          <div className="mt-3">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${Math.min(100, lengthScore)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getLengthDescription(words)}
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Caractères</span>
              <span className="font-medium">{state.contentStats?.length?.characters || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
              <span>Temps de lecture</span>
              <span className="font-medium">{state.contentStats?.length?.readingTime || 0} min</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryContent = (results: ContentAnalysisResult[]) => (
    <div className="space-y-2 mt-2">
      {results.length > 0 ? (
        results
          .sort((a, b) => {
            const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
            const statusOrder: Record<Status, number> = { problem: 0, improvement: 1, good: 2 };
            
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            
            return statusOrder[a.status] - statusOrder[b.status];
          })
          .map(result => (
            <div key={result.id} className="bg-[#f9f8ff] p-3 rounded-lg flex items-start">
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
                          {result.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-xs text-gray-600">
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
      ) : (
        <div className="p-3 text-center text-gray-500 text-sm">
          Aucune suggestion disponible pour cette catégorie.
        </div>
      )}
    </div>
  );

  const renderCategoryHeader = (
    category: string, 
    results: ContentAnalysisResult[], 
    isExpanded: boolean
  ) => {
    const hasProblem = results.some(r => r.status === 'problem');
    const hasImprovement = results.some(r => r.status === 'improvement');
    
    return (
      <button 
        className={`w-full flex items-center justify-between p-2 bg-white border-l-4 hover:bg-[#f9f8ff] 
          transition-all duration-200 shadow-sm rounded-t-lg
          ${isExpanded ? 'rounded-b-none' : 'rounded-lg'}
          ${hasProblem ? 'border-red-500' : hasImprovement ? 'border-yellow-500' : 'border-[#5b50ff]'}`}
        onClick={() => setExpandedCategories(prev => ({
          ...prev,
          [category]: !prev[category]
        }))}
      >
        <div className="flex items-center">
          <span className="mr-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <h3 className="text-base font-medium text-[#5b50ff]">{getCategoryTitle(category)}</h3>
          <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-[#f0eeff] text-[#5b50ff]">
            {results.length}
          </span>
        </div>
        <svg 
          className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    );
  };

  const renderCategories = () => {
    return Object.entries(groupedResults).map(([category, results]) => {
      const isExpanded = !!expandedCategories[category];
      
      return (
        <div key={category} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
          {renderCategoryHeader(category, results, isExpanded)}
          {isExpanded && (
            category === 'readability' 
              ? renderReadabilityContent() 
              : renderCategoryContent(results)
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-full bg-white rounded overflow-hidden">
      <div className="pt-3 pb-4">
        <h2 className="text-base font-semibold mb-4 text-[#5b50ff]">Suggestions</h2>
        
        {renderCategories()}

        {!hasSuggestions && analysisResults.length > 0 && (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="mt-2 text-gray-700">
              Félicitations ! Votre contenu semble bien optimisé.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Continuez votre excellent travail !
            </p>
          </div>
        )}
        
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
