import { createContext } from 'react';
import { BlogSeoContextType } from '../types/seo';

// Création du contexte
export const BlogSeoContext = createContext<BlogSeoContextType | undefined>(undefined);
