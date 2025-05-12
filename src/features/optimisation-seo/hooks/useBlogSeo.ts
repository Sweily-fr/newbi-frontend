import { useContext } from 'react';
import { BlogSeoContext } from '../context/BlogSeoContextDefinition';
import { BlogSeoContextType } from '../types';

/**
 * Hook personnalisé pour utiliser le contexte BlogSeo
 * @returns {BlogSeoContextType} Le contexte BlogSeo
 */
export const useBlogSeo = (): BlogSeoContextType => {
  const context = useContext(BlogSeoContext);
  
  if (context === undefined) {
    throw new Error('useBlogSeo doit être utilisé à l\'intérieur d\'un BlogSeoProvider');
  }
  
  return context;
};
