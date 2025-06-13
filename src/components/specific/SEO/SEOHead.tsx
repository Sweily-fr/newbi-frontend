import React, { useEffect } from 'react';
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
  // Générer une URL canonique qui utilise toujours www.newbi.fr
  const pageUrl = canonicalUrl || (typeof window !== 'undefined' ? 
    `https://www.newbi.fr${window.location.pathname}${window.location.search}` : 
    '');
  
  // Utiliser le titre de la page comme nom du schéma si non spécifié
  const schemaNameToUse = schemaName || title;
  
  // Déterminer si nous sommes en production ou en développement
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname === 'newbi.fr' || window.location.hostname === 'www.newbi.fr');

  // Mettre à jour directement le titre du document pour s'assurer qu'il est visible
  useEffect(() => {
    // Mettre à jour le titre du document
    document.title = title;
    
    // Mettre à jour ou créer la balise meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
    
    // Mettre à jour ou créer la balise meta keywords si fournie
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Mettre à jour les balises Open Graph
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    // Utiliser toujours l'URL canonique avec www pour Open Graph
    const canonicalOgUrl = isProduction ? 
      `https://www.newbi.fr${window.location.pathname}${window.location.search}` : 
      pageUrl;
    updateMetaTag('og:url', canonicalOgUrl);
    if (ogImage) {
      // S'assurer que l'URL de l'image est absolue
      const ogImageUrl = ogImage.startsWith('http') ? 
        ogImage : 
        `https://www.newbi.fr${ogImage}`;
      updateMetaTag('og:image', ogImageUrl);
    }
    
    // Mettre à jour les balises Twitter Card
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    if (ogImage) {
      // S'assurer que l'URL de l'image est absolue pour Twitter aussi
      const twitterImageUrl = ogImage.startsWith('http') ? 
        ogImage : 
        `https://www.newbi.fr${ogImage}`;
      updateMetaTag('twitter:image', twitterImageUrl);
    }
    
    // Fonction utilitaire pour mettre à jour ou créer une balise meta
    function updateMetaTag(name: string, content: string) {
      let meta;
      if (name.startsWith('og:')) {
        meta = document.querySelector(`meta[property="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', name);
          document.head.appendChild(meta);
        }
      } else {
        meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          document.head.appendChild(meta);
        }
      }
      meta.setAttribute('content', content);
    }
    
    // Nettoyage lors du démontage du composant
    return () => {
      // Nous ne supprimons pas les balises meta pour éviter les flashs de contenu
    };
  }, [title, description, keywords, pageUrl, ogImage, isProduction]);

  return (
    <>
      <Helmet>
        {/* Balises meta de base */}
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        
        {/* Balises canoniques et robots */}
        <link rel="canonical" href={isProduction ? `https://www.newbi.fr${window.location.pathname}${window.location.search}` : pageUrl} />
        {noindex && <meta name="robots" content="noindex, nofollow" />}
        
        {/* Open Graph pour Facebook, LinkedIn, etc. */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={isProduction ? `https://www.newbi.fr${window.location.pathname}${window.location.search}` : pageUrl} />
        <meta property="og:type" content="website" />
        {ogImage && <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `https://www.newbi.fr${ogImage}`} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `https://www.newbi.fr${ogImage}`} />}
        
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
