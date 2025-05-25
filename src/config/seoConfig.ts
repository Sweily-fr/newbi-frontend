/**
 * Configuration SEO centralisée pour Newbi
 * Ce fichier contient les meta descriptions, titres et autres informations SEO pour chaque page
 */

export const seoConfig = {
  // Page d'accueil
  home: {
    title: "Facturation, Devis & Outils Pros | Newbi",
    description: "Simplifiez votre gestion d'entreprise avec Newbi : facturation en ligne, devis, gestion de clients, outils pros, RGPD, sécurité, support français. Essai gratuit, sans engagement.",
    keywords: "facturation, devis, gestion clients, outils professionnels, RGPD, auto-entrepreneur, freelance, TPE, PME",
    canonicalUrl: "https://www.newbi.fr/",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png",
    schemaType: "Organization"
  },
  
  // Page des outils
  tools: {
    title: "Outils de Gestion d'Entreprise Gratuits | Newbi",
    description: "Découvrez tous les outils gratuits de Newbi pour gérer votre entreprise : facturation, devis, signatures email et plus encore. Simplifiez votre quotidien d'entrepreneur.",
    keywords: "outils entreprise, outils gratuits, facturation, devis, signature email, gestion entreprise",
    canonicalUrl: "https://www.newbi.fr/tools",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png",
    schemaType: "WebApplication"
  },
  
  // Page des factures
  invoices: {
    title: "Facturation en Ligne Gratuite | Newbi",
    description: "Créez et gérez vos factures gratuitement avec Newbi. Outil de facturation en ligne simple, conforme à la législation française et entièrement gratuit.",
    keywords: "facturation, facture en ligne, facture gratuite, logiciel facturation, auto-entrepreneur, freelance",
    canonicalUrl: "https://www.newbi.fr/invoices",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png",
    schemaType: "Service"
  },
  
  // Page des devis
  quotes: {
    title: "Création de Devis Gratuits en Ligne | Newbi",
    description: "Créez des devis professionnels gratuitement avec Newbi. Outil de devis en ligne simple, personnalisable et conforme aux normes françaises.",
    keywords: "devis, devis en ligne, devis gratuit, création devis, auto-entrepreneur, freelance",
    canonicalUrl: "https://www.newbi.fr/quotes",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png",
    schemaType: "Service"
  },
  
  // Page des signatures email
  emailSignatures: {
    title: "Créateur de Signatures Email Professionnelles | Newbi",
    description: "Créez gratuitement des signatures email professionnelles avec Newbi. Personnalisez votre signature avec votre logo, vos coordonnées et votre charte graphique.",
    keywords: "signature email, signature mail, signature professionnelle, créateur signature, email marketing",
    canonicalUrl: "https://www.newbi.fr/email-signatures",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png",
    schemaType: "Service"
  },
  
  // Page de contact
  contact: {
    title: "Contactez l'Équipe Newbi | Support et Assistance",
    description: "Besoin d'aide avec Newbi ? Contactez notre équipe de support français. Nous répondons à toutes vos questions sur nos outils de gestion d'entreprise gratuits.",
    keywords: "contact, support, aide, assistance, Newbi",
    canonicalUrl: "https://www.newbi.fr/contact",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png",
    schemaType: "ContactPage"
  },
  
  // Page de profil
  profile: {
    title: "Gérez Votre Profil Newbi | Paramètres et Préférences",
    description: "Accédez à votre espace personnel Newbi pour gérer votre profil, vos préférences et vos informations d'entreprise. Personnalisez votre expérience Newbi.",
    keywords: "profil, compte, paramètres, préférences, gestion compte",
    canonicalUrl: "https://www.newbi.fr/profile",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png",
    noindex: true // Page privée, ne pas indexer
  },
  
  // Page d'authentification
  auth: {
    title: "Connexion ou Inscription | Newbi",
    description: "Connectez-vous à votre compte Newbi ou créez un compte gratuit pour accéder à tous nos outils de gestion d'entreprise : facturation, devis, signatures email et plus.",
    keywords: "connexion, inscription, compte gratuit, création compte, Newbi",
    canonicalUrl: "https://www.newbi.fr/auth",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png"
  },
  
  // Page de réinitialisation de mot de passe
  resetPassword: {
    title: "Réinitialisation de Mot de Passe | Newbi",
    description: "Réinitialisez votre mot de passe Newbi en toute sécurité. Suivez les instructions pour créer un nouveau mot de passe et accéder à votre compte.",
    keywords: "réinitialisation mot de passe, mot de passe oublié, récupération compte",
    canonicalUrl: "https://www.newbi.fr/reset-password",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png",
    noindex: true // Page utilitaire, ne pas indexer
  },
  
  // Page de mentions légales
  legalNotice: {
    title: "Mentions Légales | Newbi",
    description: "Consultez les mentions légales de Newbi. Informations sur l'éditeur du site, l'hébergement, les conditions d'utilisation et les droits de propriété intellectuelle.",
    keywords: "mentions légales, informations légales, éditeur, hébergeur, propriété intellectuelle",
    canonicalUrl: "https://www.newbi.fr/legal-notice",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png"
  },
  
  // Page de politique de confidentialité
  privacyPolicy: {
    title: "Politique de Confidentialité | Newbi",
    description: "Découvrez comment Newbi protège vos données personnelles. Notre politique de confidentialité détaille la collecte, l'utilisation et la protection de vos informations.",
    keywords: "politique confidentialité, protection données, RGPD, vie privée, données personnelles",
    canonicalUrl: "https://www.newbi.fr/privacy-policy",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png"
  },
  
  // Page des conditions générales
  terms: {
    title: "Conditions Générales d'Utilisation | Newbi",
    description: "Consultez les conditions générales d'utilisation de Newbi. Informations sur l'utilisation du service, les responsabilités et les obligations des utilisateurs.",
    keywords: "conditions générales, CGU, conditions utilisation, termes service",
    canonicalUrl: "https://www.newbi.fr/terms",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png"
  },
  
  // Page du générateur de mentions légales
  legalNoticeGenerator: {
    title: "Générateur de Mentions Légales Gratuit | Newbi",
    description: "Créez gratuitement vos mentions légales avec Newbi. Outil simple et conforme à la législation française pour générer des mentions légales pour votre site web.",
    keywords: "générateur mentions légales, mentions légales gratuites, créer mentions légales, outil juridique",
    canonicalUrl: "https://www.newbi.fr/legal-notice-generator",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png",
    schemaType: "Service"
  },
  
  // Page du générateur de politique de confidentialité
  privacyPolicyGenerator: {
    title: "Générateur de Politique de Confidentialité Gratuit | Newbi",
    description: "Créez gratuitement votre politique de confidentialité avec Newbi. Outil simple et conforme au RGPD pour générer une politique de confidentialité pour votre site web.",
    keywords: "générateur politique confidentialité, RGPD, protection données, outil juridique",
    canonicalUrl: "https://www.newbi.fr/privacy-policy-generator",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png",
    schemaType: "Service"
  },
  
  // Page d'optimisation SEO de blog
  blogSeoOptimizer: {
    title: "Optimiseur SEO pour Articles de Blog Gratuit | Newbi",
    description: "Optimisez gratuitement vos articles de blog pour le référencement avec Newbi. Analysez et améliorez le SEO de vos contenus pour un meilleur classement sur Google.",
    keywords: "optimisation SEO, référencement blog, SEO article, analyse contenu, mots-clés",
    canonicalUrl: "https://www.newbi.fr/blog-seo-optimizer",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png",
    schemaType: "Service"
  },
  
  // Page 404
  notFound: {
    title: "Page Non Trouvée | Newbi",
    description: "La page que vous recherchez n'existe pas ou a été déplacée. Retournez à l'accueil de Newbi pour découvrir nos outils de gestion d'entreprise gratuits.",
    keywords: "page non trouvée, 404, erreur",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png",
    noindex: true // Page d'erreur, ne pas indexer
  }
};
