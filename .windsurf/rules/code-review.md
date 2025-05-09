# Règles de Revue de Code

Ce fichier définit les règles et bonnes pratiques pour les revues de code dans le projet Newbi.

## Mode d'activation

- Mode: `Décision modèle`
- Contexte: Lors des revues de pull requests

## Processus de Revue

- Chaque pull request doit être revue par au moins un autre développeur
- Les commentaires doivent être constructifs et respectueux
- Utiliser des questions plutôt que des affirmations quand c'est approprié
- Répondre aux commentaires de revue dans un délai raisonnable (24h max)

## Checklist de Revue

### Qualité du Code
- Le code est-il lisible et bien formaté?
- Les noms de variables et fonctions sont-ils descriptifs?
- Y a-t-il du code dupliqué qui pourrait être refactorisé?
- Les fonctions sont-elles de taille raisonnable et à responsabilité unique?

### Fonctionnalité
- Le code implémente-il correctement les exigences?
- Les cas limites sont-ils gérés?
- L'interface utilisateur est-elle intuitive et accessible?
- Les performances sont-elles acceptables?

### Tests
- Y a-t-il des tests pour les nouvelles fonctionnalités?
- Les tests existants ont-ils été mis à jour si nécessaire?
- Les tests couvrent-ils les cas d'erreur et les cas limites?

### Sécurité
- Les entrées utilisateur sont-elles validées?
- Les données sensibles sont-elles correctement protégées?
- Les vulnérabilités courantes ont-elles été évitées?

### Documentation
- Les changements sont-ils documentés si nécessaire?
- Les commentaires de code sont-ils à jour et pertinents?
- La description de la PR est-elle claire et complète?

## Bonnes Pratiques

- Faire des revues régulières et de petite taille plutôt que des revues massives
- Utiliser des outils automatisés (linters, tests) avant la revue humaine
- Concentrer la revue sur les aspects que les outils automatisés ne peuvent pas vérifier
- Partager les connaissances et expliquer les suggestions

## Résolution des Désaccords

- Discuter des points de désaccord de manière constructive
- Si nécessaire, organiser une courte réunion pour résoudre les problèmes complexes
- En cas de blocage, faire appel à un troisième développeur pour arbitrage

---

Ces règles visent à améliorer la qualité du code et à faciliter le partage de connaissances au sein de l'équipe.
