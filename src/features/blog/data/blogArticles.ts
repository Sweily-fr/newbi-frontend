import { BlogArticle } from '../../../types/blog';
import {
  invoiceArticle,
  excelQuoteArticle,
  businessManagementArticle,
  legalNoticeArticle,
  emailSignatureArticle,
  seoOptimizationArticle,
  invoiceTemplateArticle,
  quoteCreationArticle,
  businessToolsArticle,
  digitalInvoiceArticle,
  quoteVsOrderArticle
} from './articles';

export const blogArticles: BlogArticle[] = [
  quoteVsOrderArticle,
  invoiceArticle,
  excelQuoteArticle,
  businessManagementArticle,
  legalNoticeArticle,
  emailSignatureArticle,
  seoOptimizationArticle,
  invoiceTemplateArticle,
  quoteCreationArticle,
  businessToolsArticle,
  digitalInvoiceArticle
];

// Fonction utilitaire pour trouver un article par son slug
export const getArticleBySlug = (slug: string): BlogArticle | undefined => {
  return blogArticles.find(article => article.slug === slug);
};

// Fonction utilitaire pour obtenir les articles par catégorie
export const getArticlesByCategory = (category: string): BlogArticle[] => {
  return blogArticles.filter(article => article.categories.includes(category));
};

// Fonction utilitaire pour obtenir les articles par tag
export const getArticlesByTag = (tag: string): BlogArticle[] => {
  return blogArticles.filter(article => article.tags.includes(tag));
};

// Fonction utilitaire pour obtenir les articles les plus récents
export const getRecentArticles = (count: number = 3): BlogArticle[] => {
  return [...blogArticles]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, count);
};

// Fonction utilitaire pour obtenir les articles liés
export const getRelatedArticles = (currentArticle: BlogArticle, count: number = 3): BlogArticle[] => {
  // Exclure l'article actuel
  const otherArticles = blogArticles.filter(article => article.id !== currentArticle.id);
  
  // Trier les articles par nombre de tags en commun
  return otherArticles
    .map(article => {
      const commonTags = article.tags.filter(tag => currentArticle.tags.includes(tag));
      const commonCategories = article.categories.filter(category => 
        currentArticle.categories.includes(category)
      );
      
      return {
        article,
        relevanceScore: (commonTags.length * 2) + commonCategories.length
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .map(item => item.article)
    .slice(0, count);
};
