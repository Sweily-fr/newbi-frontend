// Compteur de requêtes API
const apiRequestCounters = {
  googleCustomSearch: {
    maxRequests: 100, // Nombre maximum de requêtes par jour pour Google Custom Search
    usedRequests: 0,
    lastReset: new Date().toISOString().split('T')[0] // Date du jour
  }
};

// Fonction pour vérifier et réinitialiser les compteurs si nécessaire
const checkAndResetCounters = () => {
  const today = new Date().toISOString().split('T')[0];
  
  if (apiRequestCounters.googleCustomSearch.lastReset !== today) {
    apiRequestCounters.googleCustomSearch.usedRequests = 0;
    apiRequestCounters.googleCustomSearch.lastReset = today;
  }
};

// Interface pour les résultats avec métadonnées
export interface SuggestionResult {
  suggestions: string[];
  source: 'google' | 'local' | 'datamuse' | 'wikipedia' | 'datamuse-fallback' | 'none';
  metadata: {
    count: number;
    timestamp: string;
    error?: string;
    fallback?: boolean;
  };
}

// Liste des mots vides à ignorer
const stopWords = new Set([
  'le', 'la', 'les', 'de', 'des', 'du', 'au', 'aux', 'à', 'a', 'et', 'ou', 'où', 'que', 'qui',
  'quoi', 'dans', 'dont', 'par', 'pour', 'sur', 'sous', 'avec', 'sans', 'mais', 'donc', 'or', 'ni',
  'car', 'the', 'and', 'in', 'on', 'at', 'to', 'for', 'with', 'as', 'is', 'are', 'was', 'were',
  'be', 'by', 'an', 'a', 'of', 'that', 'this', 'these', 'those', 'it', 'its', 'it\'s', 'there',
  'their', 'they', 'them', 'theirs', 'your', 'yours', 'our', 'ours', 'i', 'me', 'my', 'mine',
  'we', 'us', 'he', 'him', 'his', 'she', 'her', 'hers', 'its', 'theirs', 'themselves', 'what',
  'which', 'when', 'while', 'how', 'why', 'if', 'then', 'else', 'also', 'any', 'all', 'both',
  'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now'
]);

// Interface pour la réponse de l'API Wikipedia
interface WikipediaSearchResult {
  query?: {
    search?: Array<{
      title: string;
      snippet: string;
      wordcount: number;
    }>;
    searchinfo?: {
      suggestion?: string;
    };
  };
}

// Fonction pour obtenir des mots-clés sémantiquement liés avec Wikipedia
async function fetchSemanticKeywords(keyword: string): Promise<SuggestionResult> {
  try {
    // Utiliser le proxy Vite configuré pour l'API Wikipedia
    const response = await fetch(`/api/wikipedia?srsearch=${encodeURIComponent(keyword)}`);
    
    if (!response.ok) {
      throw new Error(`Wikipedia API error: ${response.statusText}`);
    }
    
    const data: WikipediaSearchResult = await response.json();
    const suggestions: string[] = [];
    
    // Ajouter les titres des articles
    if (data.query?.search) {
      data.query.search.forEach(item => {
        // Ajouter le titre de l'article
        suggestions.push(item.title);
        
        // Extraire les mots-clés du snippet (description)
        const words = item.snippet
          .replace(/<[^>]*>/g, '') // Supprimer le HTML
          .split(/[\s,;.()[\]{}!?]+/)
          .filter(word => 
            word.length >= 3 && 
            !/^[0-9]+$/.test(word) &&
            !stopWords.has(word.toLowerCase())
          )
          .slice(0, 5); // Prendre les 5 premiers mots significatifs
          
        suggestions.push(...words);
      });
    }
    
    // Ajouter la suggestion de recherche si elle existe
    if (data.query?.searchinfo?.suggestion) {
      suggestions.push(data.query.searchinfo.suggestion);
    }
    
    // Filtrer les doublons et les termes trop courts
    const uniqueSuggestions = Array.from(new Set(
      suggestions
        .filter(term => term.length >= 3) // Au moins 3 caractères
        .map(term => term.trim().toLowerCase())
        .filter(term => term.length > 0)
    )).slice(0, 10); // Limiter à 10 suggestions
    
    return {
      suggestions: uniqueSuggestions,
      source: 'wikipedia',
      metadata: {
        count: uniqueSuggestions.length,
        timestamp: new Date().toISOString(),
        fallback: false
      }
    };
  } catch (error) {
    console.error('Erreur avec l\'API Wikipedia:', error);
    
    // En cas d'échec, essayer avec Datamuse comme solution de secours
    try {
      const datamuseResponse = await fetch(
        `https://api.datamuse.com/words?ml=${encodeURIComponent(keyword)}&max=5`
      );
      
      if (datamuseResponse.ok) {
        const data = await datamuseResponse.json();
        const suggestions = data
          .map((item: { word: string }) => item.word)
          .slice(0, 5);
        
        return {
          suggestions,
          source: 'datamuse-fallback',
          metadata: {
            count: suggestions.length,
            timestamp: new Date().toISOString(),
            fallback: true
          }
        };
      }
    } catch (fallbackError) {
      console.error('Échec de la solution de secours Datamuse:', fallbackError);
    }
    
    return {
      suggestions: [],
      source: 'none',
      metadata: {
        count: 0,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: true
      }
    };
  }
}

// Fonction pour obtenir des suggestions de l'API Google Autocomplete
async function fetchGoogleAutocompleteSuggestions(keyword: string): Promise<SuggestionResult> {
  try {
    // Vérifier si on a dépassé la limite de requêtes
    checkAndResetCounters();
    
    console.log('Recherche de suggestions pour le mot-clé:', keyword);
    
    // Utiliser le proxy Vite pour contourner les restrictions CORS
    const proxyUrl = `/api/google-suggest?client=firefox&hl=fr&q=${encodeURIComponent(keyword)}`;
    
    console.log('URL de la requête via proxy:', proxyUrl);
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      console.error('Erreur de réponse de l\'API Google Autocomplete:', response.status, response.statusText);
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Réponse brute de l\'API:', data);
    
    // Incrémenter le compteur de requêtes
    apiRequestCounters.googleCustomSearch.usedRequests++;
    
    // Le format de réponse est : [requête, [suggestions], ...]
    const suggestions: string[] = Array.isArray(data) && data.length > 1 ? data[1] : [];
    
    console.log('Suggestions brutes:', suggestions);
    
    // Nettoyer et formater les suggestions
    const cleanedSuggestions = suggestions
      .map(suggestion => {
        if (typeof suggestion !== 'string') return '';
        
        // Supprimer la balise HTML de mise en évidence si présente
        const cleanSuggestion = suggestion
          .replace(/<\/?(b|strong)>/g, '') // Supprimer les balises <b> et </b>
          .replace(/\s+/g, ' ') // Remplacer les espaces multiples par un seul espace
          .trim();
        
        // Pour les recherches en français, on peut essayer de supprimer les articles courants au début
        const cleaned = cleanSuggestion
          .replace(/^(le |la |les |un |une |des |du |de |d'|l')/i, '')
          .trim();
        
        return cleaned || cleanSuggestion; // Retourner la version nettoyée ou l'originale si vide
      })
      .filter(suggestion => {
        // Filtrer les suggestions vides ou trop courtes
        const isValid = suggestion.length > 2 && 
                       suggestion.length < 50 && 
                       !suggestion.includes('...') &&
                       !suggestion.toLowerCase().startsWith('http') &&
                       !suggestion.includes('@');
        
        if (!isValid) {
          console.log('Suggestion filtrée:', suggestion);
        }
        
        return isValid;
      });
    
    console.log('Suggestions nettoyées:', cleanedSuggestions);
    
    // Limiter à 10 suggestions uniques
    const uniqueSuggestions = Array.from(new Set(cleanedSuggestions)).slice(0, 10);
    
    console.log('Suggestions finales:', uniqueSuggestions);
    
    return {
      suggestions: uniqueSuggestions,
      source: 'google',
      metadata: {
        count: uniqueSuggestions.length,
        timestamp: new Date().toISOString(),
        fallback: false
      }
    };
  } catch (error) {
    console.error('Erreur avec l\'API Google Autocomplete:', error);
    return {
      suggestions: [],
      source: 'google',
      metadata: {
        count: 0,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: true
      }
    };
  }
}

// Pas d'API Datamuse - On utilise uniquement l'API Google Custom Search

// Fonction principale pour obtenir des suggestions de mots-clés
export async function fetchKeywordSuggestions(keyword: string): Promise<{
  autocomplete: SuggestionResult;
  semantic: SuggestionResult;
}> {
  try {
    // Récupérer les suggestions d'autocomplétion
    const autocomplete = await fetchGoogleAutocompleteSuggestions(keyword);
    
    // Récupérer les mots-clés sémantiquement liés
    const semantic = await fetchSemanticKeywords(keyword);
    
    return {
      autocomplete,
      semantic
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions:', error);
    const errorResult = {
      suggestions: [],
      source: 'local' as const,
      metadata: {
        count: 0,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: true
      }
    };
    
    return {
      autocomplete: errorResult,
      semantic: errorResult
    };
  }
};
