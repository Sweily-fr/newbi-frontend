import React, { useState, useEffect } from 'react';
import { fetchKeywordSuggestions } from '../../services/keywordService';
import { XMarkIcon } from '@heroicons/react/24/solid';

// Composant Skeleton de remplacement
const SkeletonChip = () => (
  <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
);

// Composant pour un élément de suggestion
const SuggestionItem = ({ 
  suggestion, 
  onClick,
  hasError = false
}: { 
  suggestion: string; 
  onClick: () => void;
  hasError?: boolean;
}) => {
  console.log(`SuggestionItem ${suggestion} - hasError:`, hasError);
  
  return (
    <div className="relative group">
      <div className="relative group">
        <button
          onClick={onClick}
          className={`
            px-3 py-1.5 rounded-full text-xs font-normal transition-all duration-200
            flex items-center gap-1.5 relative max-w-[180px]
            ${
              hasError
                ? 'bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 pr-7'
                : 'bg-white hover:bg-[#f9f8ff] text-gray-700 border border-gray-200 hover:border-[#dcd7ff] hover:text-[#5b50ff]'
            }
            shadow-sm hover:shadow overflow-hidden
          `}
          title={suggestion} // Affiche le texte complet au survol
        >
          <span className="truncate">{suggestion}</span>
          {hasError && (
            <XMarkIcon className="h-3 w-3 flex-shrink-0 text-red-400" />
          )}
        </button>
        
        {/* Tooltip pour les textes tronqués */}
        {suggestion.length > 20 && (
          <div className="absolute z-10 hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
            {suggestion}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour afficher un groupe de suggestions
const SuggestionGroup = ({ 
  title, 
  suggestions, 
  metadata, 
  onSelectSuggestion
}: { 
  title: string; 
  suggestions: string[]; 
  metadata: { count: number; source: string; timestamp: string; error?: string } | null; 
  onSelectSuggestion: (keyword: string) => void; 
}) => {
  console.log(`SuggestionGroup ${title} - metadata:`, metadata);
  
  // Déterminer s'il y a une erreur globale pour ce groupe
  const groupHasError = Boolean(metadata?.error);
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {groupHasError && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
            <XMarkIcon className="h-3 w-3 mr-1" />
            Erreur de chargement
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => {
            // Utiliser l'erreur du groupe pour chaque suggestion
            console.log(`Rendering suggestion ${suggestion} with hasError=${groupHasError}`, { 
              metadataError: metadata?.error,
              hasError: groupHasError,
              metadata
            });
            return (
              <SuggestionItem
                key={`${title}-${index}`}
                suggestion={suggestion}
                onClick={() => onSelectSuggestion(suggestion)}
                hasError={groupHasError}
              />
            );
          })
      ) : (
        <p className="text-gray-400 text-sm">Aucune suggestion disponible</p>
      )}
      </div>
      {metadata && (
        <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-600">
            {metadata.source}
          </span>
          {!groupHasError && (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f0eeff] text-[#5b50ff]">
              {metadata.count} suggestion{metadata.count > 1 ? 's' : ''}
            </span>
          )}
          {metadata.error && (
            <span className="text-red-500">
              Erreur: {metadata.error}
            </span>
          )}
        </p>
      )}
    </div>
  );
};

interface KeywordSuggestionsProps {
  mainKeyword: string;
  onSelectSuggestion: (keyword: string) => void;
}

export const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({
  mainKeyword,
  onSelectSuggestion
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
        
        console.log('Autocomplete response:', {
          suggestions: autocomplete.suggestions,
          metadata: autocomplete.metadata,
          source: autocomplete.source,
          hasError: !!autocomplete.metadata.error
        });
        
        console.log('Semantic response:', {
          suggestions: semantic.suggestions,
          metadata: semantic.metadata,
          source: semantic.source,
          hasError: !!semantic.metadata.error
        });
        
        // Mettre à jour les suggestions d'autocomplétion
        setAutocompleteSuggestions(autocomplete.suggestions);
        const autocompleteMeta = {
          count: autocomplete.metadata.count,
          source: autocomplete.source,
          timestamp: autocomplete.metadata.timestamp,
          error: autocomplete.metadata.error
        };
        console.log('Setting autocomplete metadata:', autocompleteMeta);
        setAutocompleteMetadata(autocompleteMeta);
        
        // Mettre à jour les suggestions sémantiques
        setSemanticSuggestions(semantic.suggestions);
        const semanticMeta = {
          count: semantic.metadata.count,
          source: semantic.source,
          timestamp: semantic.metadata.timestamp,
          error: semantic.metadata.error
        };
        console.log('Setting semantic metadata:', semanticMeta);
        setSemanticMetadata(semanticMeta);
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
      <div className="space-y-8">
        {/* Suggestions d'autocomplétion */}
        {autocompleteSuggestions.length > 0 && (
          <SuggestionGroup 
            title="Suggestions d'autocomplétion"
            suggestions={autocompleteSuggestions}
            metadata={autocompleteMetadata}
            onSelectSuggestion={onSelectSuggestion}
          />
        )}
        
        {/* Suggestions sémantiques */}
        {semanticSuggestions.length > 0 && (
          <SuggestionGroup 
            title="Mots-clés sémantiques"
            suggestions={semanticSuggestions}
            metadata={semanticMetadata}
            onSelectSuggestion={onSelectSuggestion}
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
