import React from 'react';
import { Helmet } from 'react-helmet';
import { SchemaMarkup } from './SchemaMarkup';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  schemaType?: 'WebApplication' | 'Article' | 'Organization' | 'Product' | 'Service' | string;
  schemaName?: string;
  schemaPrice?: string | number;
  isPremium?: boolean;
  additionalSchemaData?: Record<string, unknown>;
  noindex?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = '',
  canonicalUrl,
  ogImage = '/images/images/PNG/Logo_Texte_Purple.png', // Image par défaut pour Open Graph
  schemaType,
  schemaName,
  schemaPrice,
  isPremium = false,
  additionalSchemaData = {},
  noindex = false
}) => {
  // Utiliser l'URL actuelle si aucune URL canonique n'est fournie
  const pageUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Utiliser le titre de la page comme nom du schéma si non spécifié
  const schemaNameToUse = schemaName || title;

  return (
    <>
      <Helmet>
        {/* Balises meta de base */}
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        
        {/* Balises canoniques et robots */}
        <link rel="canonical" href={pageUrl} />
        {noindex && <meta name="robots" content="noindex, nofollow" />}
        
        {/* Open Graph pour Facebook, LinkedIn, etc. */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        
        {/* Métadonnées supplémentaires pour les appareils mobiles */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#5b50ff" /> {/* Couleur primaire de Newbi */}
      </Helmet>
      
      {/* Données structurées Schema.org */}
      {schemaType && (
        <SchemaMarkup
          type={schemaType}
          name={schemaNameToUse}
          description={description}
          price={schemaPrice}
          isPremium={isPremium}
          url={pageUrl}
          additionalData={additionalSchemaData}
        />
      )}
    </>
  );
};
