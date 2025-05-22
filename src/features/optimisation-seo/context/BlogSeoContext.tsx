import React, { useState, ReactNode } from 'react';
import { 
  BlogSeoContextType, 
  BlogSeoState, 
  ContentStats, 
  KeywordData, 
  MetaTagsData
} from '../types/seo';

// Import des fonctions utilitaires depuis le module utils
import { 
  analyzeContent, 
  calculateContentStats, 
  calculateOverallScore, 
  exportContent as exportContentUtil,
  getInitialState 
} from '../utils';

// Import du contexte
import { BlogSeoContext } from './BlogSeoContextDefinition';

// État initial
const initialContentStats: ContentStats = {
  length: {
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    paragraphs: 0,
    sentences: 0,
    readingTime: 0
  },
  readability: {
    fleschScore: 0,
    avgSentenceLength: 0,
    avgWordLength: 0,
    complexWords: 0,
    complexWordPercentage: 0
  },
  keywordDensity: {
    main: 0,
    secondary: {},
    longTail: {}
  },
  structure: {
    headings: {
      h1: 0,
      h2: 0,
      h3: 0,
      h4: 0
    },
    links: {
      internal: 0,
      external: 0
    },
    images: {
      total: 0,
      withAlt: 0,
      withKeywordInAlt: 0
    }
  }
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
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
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
  // Ajout d'un paramètre optionnel pour permettre de passer directement le contenu à analyser
  const analyzeContentHandler = (contentToAnalyze?: string) => {
    setIsAnalyzing(true);
    
    // Utiliser le contenu passé en paramètre s'il existe, sinon utiliser le contenu du state
    const currentContent = contentToAnalyze !== undefined ? contentToAnalyze : state.content;
    
    // Si le contenu a été passé en paramètre, mettre à jour le state avec ce contenu
    if (contentToAnalyze !== undefined && contentToAnalyze !== state.content) {
      setState(prevState => ({
        ...prevState,
        content: contentToAnalyze
      }));
    }
    
    // Vérifier si le contenu est vide ou contient seulement le contenu par défaut
    const isContentEmpty = !currentContent || currentContent === '';
    
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
      setIsAnalyzing(false);
      return;
    }
    
    // Calcul des statistiques du contenu avec le contenu actuel
    const contentStats = calculateContentStats(currentContent, state.keywords);
    
    // Analyse du contenu
    const analysisResults = analyzeContent(
      currentContent, 
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
    
    // Une fois l'analyse terminée, mettre isAnalyzing à false
    setIsAnalyzing(false);
  };
  
  // Fonction pour exporter le contenu
  const exportContentHandler = (format: 'html' | 'markdown' | 'text'): string => {
    return exportContentUtil(state.content, format);
  };
  
  // Fonction pour réinitialiser l'état
  const resetState = () => {
    setState(initialState);
  };
  
  const contextValue: BlogSeoContextType = {
    state,
    isAnalyzing,
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
