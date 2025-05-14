import React, { useState, useEffect } from 'react';
import { fetchKeywordSuggestions } from '../../services/keywordService';

// Composant Skeleton de remplacement
const SkeletonChip = () => (
  <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
);

// Composant pour afficher un groupe de suggestions
const SuggestionGroup = ({ 
  title, 
  suggestions, 
  metadata, 
  onSelectSuggestion, 
  selectedKeywords = [] 
}: { 
  title: string; 
  suggestions: string[]; 
  metadata: { count: number; source: string; timestamp: string; error?: string } | null; 
  onSelectSuggestion: (keyword: string) => void; 
  selectedKeywords: string[];
}) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {suggestions.length > 0 ? (
        suggestions.map((suggestion, index) => (
          <button
            key={`${title}-${index}`}
            onClick={() => onSelectSuggestion(suggestion)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedKeywords.includes(suggestion)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {suggestion}
          </button>
        ))
      ) : (
        <p className="text-gray-500">Aucune suggestion disponible</p>
      )}
    </div>
    {metadata && (
      <p className="text-xs text-gray-500 mt-2">
        {metadata.count} suggestion(s) - Source: {metadata.source} - {new Date(metadata.timestamp).toLocaleTimeString()}
        {metadata.error && ` - Erreur: ${metadata.error}`}
      </p>
    )}
  </div>
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
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const [semanticSuggestions, setSemanticSuggestions] = useState<string[]>([]);
  const [autocompleteMetadata, setAutocompleteMetadata] = useState<{ count: number; source: string; timestamp: string; error?: string } | null>(null);
  const [semanticMetadata, setSemanticMetadata] = useState<{ count: number; source: string; timestamp: string; error?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSuggestions = async () => {
      if (!mainKeyword.trim()) {
        setAutocompleteSuggestions([]);
        setSemanticSuggestions([]);
        setAutocompleteMetadata(null);
        setSemanticMetadata(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const { autocomplete, semantic } = await fetchKeywordSuggestions(mainKeyword);
        
        // Mettre à jour les suggestions d'autocomplétion
        setAutocompleteSuggestions(autocomplete.suggestions);
        setAutocompleteMetadata({
          count: autocomplete.metadata.count,
          source: autocomplete.source,
          timestamp: autocomplete.metadata.timestamp,
          error: autocomplete.metadata.error
        });
        
        // Mettre à jour les suggestions sémantiques
        setSemanticSuggestions(semantic.suggestions);
        setSemanticMetadata({
          count: semantic.metadata.count,
          source: semantic.source,
          timestamp: semantic.metadata.timestamp,
          error: semantic.metadata.error
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue';
        setError(`Impossible de charger les suggestions de mots-clés: ${errorMessage}`);
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

  // Afficher l'état de chargement
  if (isLoading) {
    return (
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Recherche de mots-clés...</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Suggestions d'autocomplétion</h3>
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <SkeletonChip key={`autocomplete-${i}`} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Mots-clés sémantiques</h3>
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <SkeletonChip key={`semantic-${i}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Afficher les erreurs
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!mainKeyword) return null;

  // Afficher les résultats
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Suggestions de mots-clés pour "{mainKeyword}"</h2>
      
      <div className="space-y-8">
        {/* Suggestions d'autocomplétion */}
        {autocompleteSuggestions.length > 0 && (
          <SuggestionGroup 
            title="Suggestions d'autocomplétion"
            suggestions={autocompleteSuggestions}
            metadata={autocompleteMetadata}
            onSelectSuggestion={onSelectSuggestion}
            selectedKeywords={selectedKeywords}
          />
        )}
        
        {/* Suggestions sémantiques */}
        {semanticSuggestions.length > 0 && (
          <SuggestionGroup 
            title="Mots-clés sémantiques"
            suggestions={semanticSuggestions}
            metadata={semanticMetadata}
            onSelectSuggestion={onSelectSuggestion}
            selectedKeywords={selectedKeywords}
          />
        )}
        
        {/* Aucune suggestion */}
        {autocompleteSuggestions.length === 0 && semanticSuggestions.length === 0 && (
          <p className="text-gray-500">
            Aucune suggestion disponible pour ce mot-clé. Essayez avec un autre terme.
          </p>
        )}
      </div>
    </div>
  );
};
