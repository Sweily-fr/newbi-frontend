export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  CHANGE_PASSWORD: '/change-password',
  PROFILE: '/profile',
  TOOLS: '/outils',
  INVOICES: '/factures',
  QUOTES: '/devis',
  EMAIL_SIGNATURES: '/signatures-email',
  VERIFY_EMAIL: '/verify-email/:token',
  RESEND_VERIFICATION: '/resend-verification',
  CLIENTS: '/clients',
  NEW_CLIENT: '/clients/new',
  LEGAL_NOTICE: '/mentions-legales',
  LEGAL_NOTICE_GENERATOR: '/generator-mentions-legales',
  PRIVACY_POLICY: '/politique-de-confidentialite',
  PRIVACY_POLICY_GENERATOR: '/generator-politique-confidentialite',
  BLOG_SEO_OPTIMIZER: '/blog-seo-optimizer',
  TERMS: '/conditions-generales-de-vente',
  CONTACT: '/contact',
  COOKIE_PREFERENCES: '/preferences-cookies',
  MOBILE: '/mobile',
  NOT_FOUND: '/404',
} as const;
