// Types pour l'outil d'optimisation SEO de blog

export interface SeoScore {
  value: number;
  label: string;
  color: 'red' | 'orange' | 'green';
}

export interface KeywordData {
  main: string;
  secondary: string[];
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
  wordCount: number;
  paragraphCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  readingTime: number; // En minutes
  fleschScore: number; // Score de lisibilité Flesch-Kincaid
  keywordDensity: {
    main: number;
    secondary: Record<string, number>;
  };
  headingCount: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
  };
  linksCount: {
    internal: number;
    external: number;
  };
  imagesCount: number;
  imagesWithAlt: number;
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
  setContent: (content: string) => void;
  setKeywords: (keywords: KeywordData) => void;
  setMetaTags: (metaTags: MetaTagsData) => void;
  analyzeContent: () => void;
  exportContent: (format: 'html' | 'markdown' | 'text') => string;
  resetState: () => void;
}
