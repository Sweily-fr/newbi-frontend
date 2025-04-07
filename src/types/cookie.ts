export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';

export interface CookieConsent {
  necessary: boolean; // Toujours true, non modifiable
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  lastUpdated: number; // Timestamp
}

export interface CookieInfo {
  name: string;
  provider: string;
  purpose: string;
  expiry: string;
  type: string;
  category: CookieCategory;
}

export interface CookieCategoryInfo {
  id: CookieCategory;
  title: string;
  description: string;
  required: boolean;
  cookies: CookieInfo[];
}

export const DEFAULT_COOKIE_CONSENT: CookieConsent = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  lastUpdated: 0,
};

export const COOKIE_CATEGORIES: CookieCategoryInfo[] = [
  {
    id: 'necessary',
    title: 'Cookies nécessaires',
    description: 'Ces cookies sont essentiels au fonctionnement du site et ne peuvent pas être désactivés. Ils permettent d\'assurer la sécurité du site et de mémoriser vos préférences de base.',
    required: true,
    cookies: [
      {
        name: 'auth_token',
        provider: 'Génération Business',
        purpose: 'Authentification et sécurité',
        expiry: 'Session',
        type: 'HTTP',
        category: 'necessary'
      },
      {
        name: 'cookie_consent',
        provider: 'Génération Business',
        purpose: 'Stockage des préférences de cookies',
        expiry: '1 an',
        type: 'HTTP',
        category: 'necessary'
      }
    ]
  },
  {
    id: 'functional',
    title: 'Cookies fonctionnels',
    description: 'Ces cookies permettent d\'améliorer les fonctionnalités et la personnalisation de votre expérience sur notre site.',
    required: false,
    cookies: [
      {
        name: 'user_preferences',
        provider: 'Génération Business',
        purpose: 'Mémorisation des préférences utilisateur',
        expiry: '6 mois',
        type: 'HTTP',
        category: 'functional'
      },
      {
        name: 'recently_viewed',
        provider: 'Génération Business',
        purpose: 'Suivi des derniers éléments consultés',
        expiry: '30 jours',
        type: 'HTTP',
        category: 'functional'
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Cookies analytiques',
    description: 'Ces cookies nous permettent de mesurer l\'audience et d\'analyser le trafic sur notre site afin d\'améliorer nos services.',
    required: false,
    cookies: [
      {
        name: '_ga',
        provider: 'Google Analytics',
        purpose: 'Mesure d\'audience',
        expiry: '2 ans',
        type: 'HTTP',
        category: 'analytics'
      },
      {
        name: '_gid',
        provider: 'Google Analytics',
        purpose: 'Distinction des utilisateurs',
        expiry: '24 heures',
        type: 'HTTP',
        category: 'analytics'
      }
    ]
  },
  {
    id: 'marketing',
    title: 'Cookies marketing',
    description: 'Ces cookies sont utilisés pour suivre les visiteurs sur les sites web. L\'intention est d\'afficher des publicités pertinentes et engageantes pour l\'utilisateur.',
    required: false,
    cookies: [
      {
        name: '_fbp',
        provider: 'Facebook',
        purpose: 'Publicité ciblée',
        expiry: '3 mois',
        type: 'HTTP',
        category: 'marketing'
      },
      {
        name: 'ads_prefs',
        provider: 'Génération Business',
        purpose: 'Personnalisation des publicités',
        expiry: '6 mois',
        type: 'HTTP',
        category: 'marketing'
      }
    ]
  }
];
