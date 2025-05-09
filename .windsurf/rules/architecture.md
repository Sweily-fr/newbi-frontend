---
trigger: always_on
---

# Architecture du Projet Frontend

Ce fichier définit l'architecture standard à suivre pour le projet Newbi Frontend. Cette structure est conçue pour organiser le code de manière claire, maintenable et évolutive.


## Structure des Dossiers

```
src/
│
├── assets/
│   ├── images/
│   ├── fonts/
│   ├── icons/              # Icônes spécifiques à l'application
│   └── styles/
│       ├── global.css      # Styles globaux
│       ├── variables.css   # Variables CSS (couleurs, espacements, etc.)
│       └── themes/         # Thèmes clair/sombre si applicable
│       └── tailwind.css/   # Tailwind 
│
├── components/
│   ├── common/             # Composants UI génériques
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Table/
│   │   └── ...
│   ├── layout/
│   │   ├── Header/
│   │   ├── Sidebar/        # Navigation principale
│   │   ├── Footer/
│   │   ├── Dashboard/      # Layout du tableau de bord
│   │   └── ...
│   ├── forms/              # Composants spécifiques aux formulaires
│   │   ├── FormField/
│   │   ├── FileUpload/
│   │   └── ...
│   └── specific/           # Composants pour fonctionnalités spéciales
│       ├── PdfPreview/
│       ├── SignatureCanvas/
│       └── ...
│
├── config/
│   ├── routes.ts           # Configuration des routes
│   ├── constants.ts        # Constantes globales
│   └── menu.ts             # Structure du menu de navigation
│
├── features/               # Organisation par fonctionnalité
│   ├── auth/               # Authentification
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   └── graphql/
│   │
│   ├── users/              # Gestion des utilisateurs
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── graphql/
│   │
│   ├── invoices/           # Module de factures
│   │   ├── components/
│   │   │   ├── InvoiceForm/
│   │   │   ├── InvoiceList/
│   │   │   └── InvoicePreview/
│   │   ├── hooks/
│   │   │   ├── useInvoiceForm.ts
│   │   │   └── useInvoiceCalculations.ts
│   │   ├── types/
│   │   ├── utils/
│   │   │   ├── invoiceFormatter.ts
│   │   │   └── pdfGenerator.ts
│   │   └── graphql/
│   │       ├── queries.ts
│   │       └── mutations.ts
│   │
│   ├── quotes/             # Module de devis
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   └── graphql/
│   │
│   ├── email-signatures/   # Module de signatures de mail
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   └── graphql/
│   │
│   ├── blog/               # Blog SEO
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   └── graphql/
│   │
│   ├── legal/              # Mentions légales et politique de confidentialité
│   │   ├── components/
│   │   └── content/         # Contenu statique des textes légaux
│   │
│   └── dashboard/          # Dashboard principal
│       ├── components/
│       ├── hooks/
│       └── graphql/
│
├── graphql/
│   ├── client.ts           # Configuration Apollo Client
│   ├── fragments/          # Fragments partagés
│   ├── types/              # Types générés globaux
│   └── cache.ts            # Configuration du cache Apollo
│
├── hooks/
│   ├── useAuth.ts          # Gestion de l'authentification
│   ├── useToast.ts         # Notifications
│   ├── usePermissions.ts   # Gestion des permissions
│   └── useAppSettings.ts   # Paramètres de l'application
│
├── pages/
│   ├── Dashboard.tsx       # Page d'accueil/tableau de bord
│   ├── Login.tsx           # Page de connexion
│   ├── Register.tsx        # Page d'inscription
│   ├── Profile.tsx         # Profil utilisateur
│   ├── InvoicesPage.tsx    # Page principale de gestion des factures
│   ├── InvoiceDetail.tsx   # Détails d'une facture
│   ├── QuotesPage.tsx      # Page principale de gestion des devis
│   ├── QuoteDetail.tsx     # Détails d'un devis
│   ├── EmailSignatures.tsx # Gestion des signatures mail
│   ├── BlogPage.tsx        # Blog
│   ├── BlogPost.tsx        # Article de blog individuel
│   ├── PrivacyPolicy.tsx   # Politique de confidentialité
│   └── LegalTerms.tsx      # Mentions légales
│
├── routes/
│   ├── AppRoutes.tsx       # Configuration principale des routes
│   ├── ProtectedRoute.tsx  # Route protégée pour les utilisateurs connectés
│   └── RouteGuard.tsx      # Contrôle d'accès basé sur les permissions
│
├── context/
│   ├── AuthContext.tsx     # Contexte d'authentification
│   ├── UIContext.tsx       # État de l'interface utilisateur (thème, sidebar, etc.)
│   └── SettingsContext.tsx # Paramètres utilisateur
│
├── services/
│   ├── api.ts              # Service API de base
│   ├── auth.ts             # Service d'authentification
│   ├── storage.ts          # Gestion du stockage local
│   └── analytics.ts        # Suivi analytique si nécessaire
│
├── types/
│   ├── user.ts             # Types liés aux utilisateurs
│   ├── common.ts           # Types partagés
│   └── entities.ts         # Types des entités principales
│
├── utils/
│   ├── formatting.ts       # Formatage (dates, monnaie, etc.)
│   ├── validation.ts       # Validation côté client
│   ├── permissions.ts      # Vérification des permissions
│   └── pdf.ts              # Génération de PDF
│
├── App.tsx                 # Composant racine
├── main.tsx                # Point d'entrée
└── vite-env.d.ts           # Types pour Vite
```