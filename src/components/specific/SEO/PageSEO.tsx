import React from 'react';
import { SEOHead } from './SEOHead';
import { seoConfig } from '../../../config/seoConfig';

type PageKey = keyof typeof seoConfig;

// Définir un type pour s'assurer que toutes les propriétés sont correctement typées
type SEOConfigType = {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  schemaType?: string;
  noindex?: boolean;
};

interface PageSEOProps {
  pageKey: PageKey;
  overrideProps?: {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    ogImage?: string;
    schemaType?: string;
    schemaPrice?: string | number;
    isPremium?: boolean;
    additionalSchemaData?: Record<string, unknown>;
    noindex?: boolean;
  };
}

/**
 * Composant utilitaire pour ajouter facilement des meta descriptions spécifiques à chaque page
 * Utilise la configuration SEO centralisée et permet de surcharger certaines propriétés si nécessaire
 */
export const PageSEO: React.FC<PageSEOProps> = ({ pageKey, overrideProps = {} }) => {
  const pageConfig = seoConfig[pageKey] as SEOConfigType;
  
  if (!pageConfig) {
    console.error(`Configuration SEO non trouvée pour la page: ${pageKey}`);
    return null;
  }
  
  // Valeurs par défaut pour les propriétés optionnelles
  const canonicalUrl = overrideProps.canonicalUrl || pageConfig.canonicalUrl || `https://www.newbi.fr/${pageKey}`;
  const ogImage = overrideProps.ogImage || pageConfig.ogImage || "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png";
  const schemaType = overrideProps.schemaType || pageConfig.schemaType || "WebPage";
  const noindex = overrideProps.noindex || pageConfig.noindex || false;
  
  return (
    <SEOHead
      title={overrideProps.title || pageConfig.title}
      description={overrideProps.description || pageConfig.description}
      keywords={overrideProps.keywords || pageConfig.keywords || ''}
      canonicalUrl={canonicalUrl}
      ogImage={ogImage}
      schemaType={schemaType}
      schemaPrice={overrideProps.schemaPrice || "0"} // Par défaut gratuit
      isPremium={overrideProps.isPremium || false} // Par défaut non premium
      additionalSchemaData={overrideProps.additionalSchemaData || {}}
      noindex={noindex}
    />
  );
};
