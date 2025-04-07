import React from 'react';

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  recommended?: boolean;
  features: string[];
  ctaText: string;
  ctaLink: string;
  bgColor?: string;
  textColor?: string;
  buttonStyle?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '0€',
    period: '/mois',
    description: 'Parfait pour débuter et tester les fonctionnalités essentielles.',
    recommended: false,
    features: [
      'Jusqu\'à 10 factures par mois',
      'Jusqu\'à 5 devis par mois',
      'Accès aux outils de base',
      'Support par email',
    ],
    ctaText: 'Commencer gratuitement',
    ctaLink: '/auth',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    buttonStyle: 'bg-blue-50 border border-blue-500 text-blue-700 hover:bg-blue-100 focus:ring-blue-500'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '29€',
    period: '/mois',
    description: 'Idéal pour les professionnels et petites entreprises avec des besoins avancés.',
    recommended: true,
    features: [
      'Factures illimitées',
      'Devis illimités',
      'Accès à tous les outils premium',
      'Support prioritaire 7j/7',
      'Personnalisation avancée',
    ],
    ctaText: 'Essai gratuit de 14 jours',
    ctaLink: '/auth?plan=pro',
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    buttonStyle: 'bg-white text-blue-700 hover:bg-blue-50 focus:ring-white'
  },
  {
    id: 'business',
    name: 'Business',
    price: '49€',
    period: '/mois',
    description: 'Solution complète pour les entreprises en croissance avec des besoins avancés.',
    recommended: false,
    features: [
      'Tout ce qui est inclus dans Pro',
      'Gestion multi-utilisateurs',
      'Rapports avancés',
      'API pour intégrations',
      'Gestionnaire de compte dédié',
      'Formations personnalisées',
    ],
    ctaText: 'Contacter notre équipe',
    ctaLink: '/contact?plan=business',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    buttonStyle: 'bg-blue-50 border border-blue-500 text-blue-700 hover:bg-blue-100 focus:ring-blue-500'
  }
];
