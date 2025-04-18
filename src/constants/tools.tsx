import React from 'react';

// Définition du type pour un outil
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  href: string;
  premium?: boolean;
  comingSoon?: boolean;
}

// Liste des outils disponibles dans l'application
export const TOOLS: Tool[] = [
  {
    id: 'blog-seo-optimizer',
    name: 'Optimisation Blog SEO',
    description: 'Analysez et améliorez le référencement de vos articles de blog',
    category: 'Marketing',
    premium: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    href: '/blog-seo-optimizer'
  },
  {
    id: 'email-signature',
    name: 'Créateur de Signature Email',
    description: 'Créez des signatures email professionnelles personnalisées',
    category: 'Communication',
    premium: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="indigo">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    href: '/signatures-email'
  },
  {
    id: 'invoices',
    name: 'Gestion des factures',
    description: 'Créez et gérez vos factures professionnelles en quelques clics',
    category: 'Factures',
    premium: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="purple">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    href: '/factures'
  },
  {
    id: 'quotes',
    name: 'Gestion des devis',
    description: 'Créez et suivez vos devis clients avec des modèles professionnels',
    category: 'Devis',
    premium: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="orange">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    href: '/devis'
  },
  {
    id: 'confidentiality-policies',
    name: 'Générer des politiques de confidentialité',
    description: 'Créez des politiques de confidentialité professionnelles',
    category: 'Site internet',
    premium: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="orange">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    href: '/generator-politique-confidentialite'
  },
  {
    id: 'mentions-legales',
    name: 'Générer des mentions légales',
    description: 'Créez des mentions légales professionnelles',
    category: 'Site internet',
    premium: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="orange">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    href: '/generator-mentions-legales'
  }
];

// Outils pour la page d'accueil (format moderne avec le nouveau design)
export const HOME_TOOLS = [
  {
    id: 'invoices',
    name: 'Gestion des factures',
    description: 'Créez et gérez vos factures en quelques clics',
    category: 'Factures',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="purple">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    href: '/factures'
  },
  {
    id: 'quotes',
    name: 'Gestion des devis',
    description: 'Créez et suivez vos devis clients',
    category: 'Devis',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="orange">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    href: '/devis'
  }
];

// Fonction utilitaire pour trouver un outil par son ID
export const getToolById = (id: string): Tool | undefined => {
  return TOOLS.find(tool => tool.id === id);
};
