# Règles Spécifiques au Frontend

Ce fichier définit les règles spécifiques pour le développement frontend du projet Newbi, adaptées à la stack technologique actuelle.

## Mode d'activation

- Mode: `Manuel`
- S'applique aux fichiers: `src/**/*.{js,jsx,ts,tsx,css,scss}`

## Architecture Frontend

- Utiliser une architecture basée sur les fonctionnalités (feature-based)
- Séparer clairement la logique métier de la logique UI
- Implémenter le pattern Container/Presentational quand approprié

## Composants UI

- Utiliser exclusivement des composants fonctionnels avec hooks (React 19)
- Extraire la logique complexe dans des hooks personnalisés
- Éviter les props drilling en utilisant le Context API quand nécessaire
- Limiter la profondeur des composants à 3 niveaux maximum

## GraphQL et Apollo

- Centraliser les requêtes GraphQL dans des fichiers dédiés
- Utiliser des fragments pour les parties réutilisables des requêtes
- Implémenter correctement le cache Apollo pour optimiser les performances
- Gérer les uploads de fichiers avec apollo-upload-client

## Styles et CSS

- Utiliser TailwindCSS pour les styles de base
- Créer des composants réutilisables pour les éléments UI communs
- Maintenir une palette de couleurs cohérente définie dans le thème Tailwind
- Utiliser postcss-nesting pour les styles complexes quand nécessaire

## Formulaires

- Utiliser React Hook Form pour la gestion des formulaires (déjà installé)
- Implémenter une validation côté client
- Créer des composants de formulaire réutilisables
- Gérer les uploads de fichiers avec react-dropzone (déjà installé)

## Routing

- Utiliser React Router v7 avec ses nouvelles fonctionnalités (déjà installé)
- Organiser les routes de manière logique et hiérarchique
- Implémenter la protection des routes pour les pages nécessitant une authentification
- Utiliser des routes imbriquées pour les interfaces complexes

## Génération de PDF

- Utiliser jspdf et html2canvas pour la génération de PDF (déjà installés)
- Créer des templates réutilisables avec handlebars (déjà installé)
- Optimiser les performances lors de la génération de documents volumineux

## Notifications et Feedback

- Utiliser react-hot-toast ou react-toastify pour les notifications (déjà installés)
- Implémenter un système cohérent de feedback utilisateur
- Standardiser les messages d'erreur et de succès

## TypeScript

- Utiliser des types stricts plutôt que `any`
- Créer des interfaces pour les props des composants
- Utiliser des types génériques pour les composants réutilisables
- Maintenir des fichiers de définition de types à jour

## Optimisation

- Utiliser le code splitting de Vite pour réduire la taille du bundle initial
- Optimiser les images et autres assets
- Utiliser la pagination ou l'infinite scrolling pour les listes longues

## Sécurité

- Utiliser crypto-js pour les opérations cryptographiques côté client si nécessaire (déjà installé)
- Ne jamais stocker d'informations sensibles dans le localStorage sans chiffrement
- Valider toutes les entrées utilisateur

## Bonnes Pratiques

- Suivre les règles ESLint configurées dans le projet
- Éviter les magic numbers et strings, utiliser des constantes nommées
- Gérer proprement les erreurs avec des fallbacks UI
- Utiliser React.Suspense pour améliorer l'UX pendant le chargement

---

Ces règles sont conçues pour être appliquées manuellement lors du développement frontend et sont spécifiquement adaptées à la stack technologique du projet Newbi.
