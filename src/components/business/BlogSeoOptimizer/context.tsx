import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  BlogSeoContextType, 
  BlogSeoState, 
  // ContentAnalysisResult, // Import inutilisé
  ContentStats, 
  KeywordData, 
  MetaTagsData, 
  // SeoScore // Import inutilisé
} from './types';
import { 
  analyzeContent, 
  calculateContentStats, 
  calculateOverallScore, 
  exportContent as exportContentUtil, 
  getInitialState 
} from './utils';

// Création du contexte
const BlogSeoContext = createContext<BlogSeoContextType | undefined>(undefined);

// État initial
const initialContentStats: ContentStats = {
  wordCount: 0,
  paragraphCount: 0,
  sentenceCount: 0,
  avgSentenceLength: 0,
  readingTime: 0,
  fleschScore: 0,
  keywordDensity: {
    main: 0,
    secondary: {},
    longTail: {}
  },
  headingCount: {
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0
  },
  linksCount: {
    internal: 0,
    external: 0
  },
  imagesCount: 0,
  imagesWithAlt: 0,
  imagesWithKeywordInAlt: 0
};

const initialState: BlogSeoState = {
  content: getInitialState().content,
  keywords: getInitialState().keywords,
  metaTags: getInitialState().metaTags,
  contentStats: initialContentStats,
  analysisResults: [],
  overallScore: { value: 0, label: 'Non évalué', color: 'red' },
  history: []
};

// Provider du contexte
interface BlogSeoProviderProps {
  children: ReactNode;
}

export const BlogSeoProvider: React.FC<BlogSeoProviderProps> = ({ children }) => {
  const [state, setState] = useState<BlogSeoState>(initialState);
  
  // Fonction pour mettre à jour le contenu
  const setContent = (content: string) => {
    setState(prevState => ({
      ...prevState,
      content
    }));
  };
  
  // Fonction pour mettre à jour les mots-clés
  const setKeywords = (keywords: KeywordData) => {
    setState(prevState => ({
      ...prevState,
      keywords
    }));
  };
  
  // Fonction pour mettre à jour les méta-tags
  const setMetaTags = (metaTags: MetaTagsData) => {
    setState(prevState => ({
      ...prevState,
      metaTags
    }));
  };
  
  // Fonction pour analyser le contenu
  const analyzeContentHandler = () => {
    // Vérifier si le contenu est vide ou contient seulement le contenu par défaut
    const defaultContent = '<h1>Titre de votre article</h1><p>Commencez à rédiger votre contenu ici...</p>';
    const isContentEmpty = !state.content || state.content === '' || state.content === defaultContent;
    
    // Vérifier si les métadonnées sont vides
    const isMetaTagsEmpty = !state.metaTags.title && !state.metaTags.description;
    
    // Si le contenu est vide ou par défaut ET que les métadonnées sont vides,
    // définir directement le score à 0, même si des mots-clés sont présents
    if (isContentEmpty && isMetaTagsEmpty) {
      setState(prevState => ({
        ...prevState,
        contentStats: initialContentStats,
        analysisResults: [],
        overallScore: { value: 0, label: 'Non évalué', color: 'red' },
        history: [...prevState.history, { timestamp: Date.now(), score: 0 }]
      }));
      return;
    }
    
    // Calcul des statistiques du contenu
    const contentStats = calculateContentStats(state.content, state.keywords);
    
    // Analyse du contenu
    const analysisResults = analyzeContent(
      state.content, 
      state.keywords, 
      state.metaTags, 
      contentStats
    );
    
    // Calcul du score global
    const overallScore = calculateOverallScore(analysisResults);
    
    // Mise à jour de l'historique
    const newHistoryEntry = {
      timestamp: Date.now(),
      score: overallScore.value
    };
    
    setState(prevState => ({
      ...prevState,
      contentStats,
      analysisResults,
      overallScore,
      history: [...prevState.history, newHistoryEntry]
    }));
  };
  
  // Fonction pour exporter le contenu
  const exportContentHandler = (format: 'html' | 'markdown' | 'text'): string => {
    return exportContentUtil(state.content, format);
  };
  
  // Fonction pour réinitialiser l'état
  const resetState = () => {
    setState(initialState);
  };
  
  // Analyse automatique désactivée - remplacée par un bouton d'analyse manuel
  // L'analyse sera déclenchée via le bouton "Analyser mon article"
  // useEffect(() => {
  //   const debounceTimeout = setTimeout(() => {
  //     if (state.content.trim() && (state.keywords.main || state.metaTags.title)) {
  //       analyzeContentHandler();
  //     }
  //   }, 1000);
  //   
  //   return () => clearTimeout(debounceTimeout);
  // }, [state.content, state.keywords, state.metaTags]);
  
  const contextValue: BlogSeoContextType = {
    state,
    setContent,
    setKeywords,
    setMetaTags,
    analyzeContent: analyzeContentHandler,
    exportContent: exportContentHandler,
    resetState
  };
  
  return (
    <BlogSeoContext.Provider value={contextValue}>
      {children}
    </BlogSeoContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useBlogSeo = (): BlogSeoContextType => {
  const context = useContext(BlogSeoContext);
  
  if (context === undefined) {
    throw new Error('useBlogSeo doit être utilisé à l\'intérieur d\'un BlogSeoProvider');
  }
  
  return context;
};
