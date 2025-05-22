// Types pour l'outil d'optimisation SEO de blog

export interface SeoScore {
  value: number;
  label: string;
  color: 'red' | 'orange' | 'yellow' | 'green';
}

export interface KeywordData {
  main: string;
  secondary: string[];
  longTail: string[];
}

export interface MetaTagsData {
  title: string;
  description: string;
}

export interface ContentAnalysisResult {
  id: string;
  title: string;
  description: string;
  status: 'good' | 'improvement' | 'problem';
  score: number;
  priority: 'high' | 'medium' | 'low';
  category: 'keywords' | 'structure' | 'readability' | 'meta' | 'links' | 'images';
  suggestions?: string[];
}

export interface ContentStats {
  // Statistiques de longueur
  length: {
    words: number;           // Nombre total de mots
    characters: number;       // Nombre total de caractères (espaces inclus)
    charactersNoSpaces: number; // Nombre de caractères (espaces exclus)
    paragraphs: number;       // Nombre de paragraphes
    sentences: number;         // Nombre de phrases
    readingTime: number;       // Temps de lecture estimé en minutes
  };
  
  // Statistiques de lisibilité
  readability: {
    fleschScore: number;      // Score de lisibilité Flesch-Kincaid (0-100)
    avgSentenceLength: number; // Longueur moyenne des phrases en mots
    avgWordLength: number;     // Longueur moyenne des mots en caractères
    complexWords: number;      // Nombre de mots complexes (8+ lettres)
    complexWordPercentage: number; // Pourcentage de mots complexes
  };
  
  // Densité des mots-clés
  keywordDensity: {
    main: number;             // Densité du mot-clé principal (%)
    secondary: Record<string, number>; // Densité des mots-clés secondaires
    longTail: Record<string, number>;  // Densité des mots-clés de longue traîne
  };
  
  // Structure du contenu
  structure: {
    // En-têtes
    headings: {
      h1: number;
      h2: number;
      h3: number;
      h4: number;
    };
    // Liens
    links: {
      internal: number;       // Nombre de liens internes
      external: number;       // Nombre de liens externes
    };
    // Images
    images: {
      total: number;          // Nombre total d'images
      withAlt: number;         // Nombre d'images avec attribut alt
      withKeywordInAlt: number; // Nombre d'images avec mot-clé dans l'alt
    };
  };
}

export interface BlogSeoState {
  content: string;
  keywords: KeywordData;
  metaTags: MetaTagsData;
  contentStats: ContentStats;
  analysisResults: ContentAnalysisResult[];
  overallScore: SeoScore;
  history: {
    timestamp: number;
    score: number;
  }[];
}

export interface BlogSeoContextType {
  state: BlogSeoState;
  isAnalyzing: boolean;
  setContent: (content: string) => void;
  setKeywords: (keywords: KeywordData) => void;
  setMetaTags: (metaTags: MetaTagsData) => void;
  analyzeContent: (contentToAnalyze?: string) => void;
  exportContent: (format: 'html' | 'markdown' | 'text') => string;
  resetState: () => void;
}
