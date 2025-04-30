import React from 'react';
import { Helmet } from 'react-helmet';

interface SchemaMarkupProps {
  type: 'WebApplication' | 'Article' | 'Organization' | 'Product' | 'Service' | string;
  name: string;
  description: string;
  price?: string | number;
  isPremium?: boolean;
  url?: string;
  additionalData?: Record<string, unknown>;
}

export const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ 
  type, 
  name, 
  description, 
  price, 
  url,
  additionalData 
}) => {
  // Construire l'URL complète si elle n'est pas fournie
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Construire les données de base du schéma
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': type,
    'name': name,
    'description': description,
    'url': pageUrl,
    ...(price && {
      'offers': {
        '@type': 'Offer',
        'price': price,
        'priceCurrency': 'EUR',
        'availability': 'https://schema.org/InStock'
      }
    }),
    ...(type === 'WebApplication' && {
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'Web',
    }),
    ...(type === 'Organization' && {
      'logo': 'https://newbi.io/logo.png', // Remplacer par le chemin réel du logo
    }),
    ...additionalData
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

// Composant pour les breadcrumbs
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>
    </Helmet>
  );
};

// Composant pour les FAQs
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ items }) => {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': items.map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqData)}
      </script>
    </Helmet>
  );
};
