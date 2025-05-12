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
    content: '<h1>Titre de votre article</h1><p>Commencez à rédiger votre contenu ici...</p>',
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
