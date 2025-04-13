import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  BlogSeoContextType, 
  BlogSeoState, 
  ContentAnalysisResult, 
  ContentStats, 
  KeywordData, 
  MetaTagsData, 
  SeoScore 
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
    secondary: {}
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
  imagesWithAlt: 0
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
  
  // Analyse automatique du contenu lorsque celui-ci change
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (state.content.trim() && (state.keywords.main || state.metaTags.title)) {
        analyzeContentHandler();
      }
    }, 1000);
    
    return () => clearTimeout(debounceTimeout);
  }, [state.content, state.keywords, state.metaTags]);
  
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
