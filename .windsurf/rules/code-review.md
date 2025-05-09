---
trigger: always_on
---

# Règles de revue de code pour le projet Newbi

## 1. Nettoyage du code

- Supprimer tous les `console.log` de débogage avant de soumettre le code pour revue
- Éliminer tout code mort ou commenté qui n'est plus utilisé
- Retirer les imports inutilisés
- Vérifier qu'il n'y a pas de données sensibles exposées dans le code

## 2. Structure et organisation des composants

- Limiter la taille des fichiers à maximum 500 lignes
- Diviser les composants complexes en sous-composants plus petits et réutilisables
- Extraire la logique métier dans des hooks personnalisés (`useXxx`)
- Séparer les composants de présentation des composants de logique (pattern Container/Presentational)
- Organiser les imports par ordre: bibliothèques externes, composants internes, hooks, styles

## 3. Bonnes pratiques React

- Utiliser les composants fonctionnels et les hooks plutôt que les classes
- Éviter les rendus inutiles avec `useMemo`, `useCallback` et `React.memo` lorsque pertinent
- Utiliser correctement les dépendances dans les hooks (`useEffect`, `useMemo`, etc.)
- Préférer les props destructurées pour une meilleure lisibilité
- Utiliser des noms de composants explicites (PascalCase) et de variables/fonctions clairs (camelCase)
- Implémenter une gestion d'erreurs appropriée (Error Boundaries)
- Éviter les inline styles, préférer les classes ou styled-components

## 4. Performance et optimisation

- Éviter les calculs coûteux dans le corps du composant
- Optimiser les listes avec des clés uniques et stables
- Utiliser la lazy loading pour les composants volumineux
- Éviter les re-rendus inutiles (vérifier avec React DevTools)
- Minimiser les appels réseau redondants

## 5. Tests

- Vérifier la compatibilité avec le thème de couleur violet de Newbi (#5b50ff)

## 6. Accessibilité et UX

- Vérifier que tous les éléments interactifs sont accessibles au clavier
- S'assurer que les contrastes de couleur sont suffisants (surtout avec la palette #5b50ff)
- Utiliser des attributs ARIA appropriés lorsque nécessaire

## 7. Cohérence avec l'identité Newbi

- Respecter la charte graphique avec la couleur primaire #5b50ff
- Utiliser les variantes de couleur appropriées (#f0eeff pour les fonds légers, #4a41e0 pour les états hover)
- Maintenir une esthétique moderne et épurée avec des bordures et ombres subtiles

## Processus de revue

1. Auto-revue avant soumission (vérifier tous les points ci-dessus)
