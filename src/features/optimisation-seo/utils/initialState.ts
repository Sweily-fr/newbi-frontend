import { KeywordData, MetaTagsData } from '../types';

/**
 * Initialise l'état par défaut
 */
export const getInitialState = (): {
  content: string;
  keywords: KeywordData;
  metaTags: MetaTagsData;
} => {
  return {
    content: '',
    keywords: {
      main: '',
      secondary: [],
      longTail: []
    },
    metaTags: {
      title: '',
      description: ''
    }
  };
};
