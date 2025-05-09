---
trigger: manual
---

# Règles Globales pour le Projet Newbi

Ce fichier définit les règles globales pour le projet Newbi. Ces règles s'appliquent à l'ensemble du projet et sont conçues pour maintenir la cohérence et la qualité du code.

## Mode d'activation

- Mode: `Toujours activé`

## Standards de Code

- Suivre les conventions de nommage camelCase pour les variables et fonctions JavaScript/TypeScript
- Utiliser PascalCase pour les noms de composants React
- Indenter le code avec 2 espaces
- Utiliser des points-virgules à la fin des instructions JavaScript/TypeScript
- Limiter la longueur des lignes à 100 caractères
- Utiliser des guillemets simples pour les chaînes de caractères JavaScript/TypeScript

## Structure des Composants

- Chaque composant React doit être dans son propre fichier
- Les composants doivent être organisés par fonctionnalité dans des dossiers dédiés
- Les composants réutilisables doivent être placés dans un dossier `components/common`
- Utiliser des hooks personnalisés pour la logique réutilisable

## Gestion d'État

- Préférer les hooks React (useState, useReducer) pour la gestion d'état locale
- Utiliser des contextes React pour partager l'état entre composants proches
- Documenter clairement la structure de l'état global

## API et Requêtes

- Centraliser les appels API dans des services dédiés
- Gérer correctement les erreurs et les états de chargement
- Utiliser des fonctions asynchrones avec try/catch pour les appels API

## Tests

- Écrire des tests unitaires pour les fonctions utilitaires
- Écrire des tests de composants pour les composants critiques
- Maintenir une couverture de test d'au moins 70%

## Performance

- Optimiser les rendus avec React.memo, useMemo et useCallback quand nécessaire
- Éviter les re-rendus inutiles
- Utiliser la lazy loading pour les composants volumineux
- Éviter les fichier dépassant plus de 500 lignes

## Accessibilité

- Utiliser des attributs ARIA appropriés
- Assurer que l'application est navigable au clavier
- Maintenir un contraste de couleur suffisant

## Documentation

- Documenter les composants complexes avec des commentaires JSDoc
- Maintenir un README à jour avec les instructions d'installation et d'utilisation
- Documenter les décisions d'architecture importantes

---

Ces règles sont conçues pour être un point de départ et peuvent être modifiées selon les besoins spécifiques du projet et de l'équipe.
