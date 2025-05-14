import React, { useState, useEffect } from 'react';
import { fetchKeywordSuggestions } from '../../services/keywordService';

// Composant Skeleton de remplacement
const SkeletonChip = () => (
  <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
);

interface KeywordSuggestionsProps {
  mainKeyword: string;
  onSelectSuggestion: (keyword: string) => void;
  selectedKeywords?: string[];
}

export const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({
  mainKeyword,
  onSelectSuggestion,
  selectedKeywords = [],
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSuggestions = async () => {
      if (!mainKeyword.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchKeywordSuggestions(mainKeyword);
        setSuggestions(data);
      } catch (err) {
        setError('Impossible de charger les suggestions de mots-clés');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      getSuggestions();
    }, 500); // Délai pour éviter des appels trop fréquents

    return () => clearTimeout(timer);
  }, [mainKeyword]);

  if (!mainKeyword) return null;

  return (
    <div className="mt-3 p-4 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-medium mb-3">
        Suggestion de mots-clés liés à votre mot-clé principal
      </h3>
      
      {isLoading ? (
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, index) => (
            <SkeletonChip key={index} />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      ) : suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => {
            const isSelected = selectedKeywords.includes(suggestion);
            return (
              <button
                key={suggestion}
                onClick={() => onSelectSuggestion(suggestion)}
                className={`px-3 py-1.5 text-sm border rounded-full transition-colors ${isSelected 
                  ? 'border-gray-200 text-gray-400' 
                  : 'border-gray-300 hover:bg-gray-50'}`}
                disabled={isSelected}
              >
                <span className={isSelected ? 'line-through' : ''}>
                  {suggestion}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          Aucune suggestion trouvée pour "{mainKeyword}"
        </p>
      )}
    </div>
  );
};
