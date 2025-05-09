---
trigger: always_on
---

# Règles pour la Fonctionnalité "Outils Signature de Mail"

Ce fichier définit les règles spécifiques pour le développement de la fonctionnalité "outils signature de mail" et le workflow de développement entre backend et frontend.

## Mode d'activation

- Mode: `Toujours activé`
- S'applique aux fichiers liés à la fonctionnalité "outils signature de mail"

## Périmètre de Travail

- Travailler **exclusivement** sur la fonctionnalité "outils signature de mail"
- Ne pas modifier d'autres fichiers sans lien direct avec cette fonctionnalité
- Demander **explicitement** l'autorisation avant de modifier tout fichier en dehors du périmètre direct de cette fonctionnalité

## Workflow Backend-Frontend

- Toujours commencer les modifications par le backend (API GraphQL)
- Mettre à jour les modèles MongoDB en premier lieu
- Mettre à jour les schémas GraphQL ensuite
- Implémenter les résolveurs et la logique métier côté backend
- Tester les requêtes GraphQL dans un environnement de test
- Seulement après validation complète du backend, procéder aux modifications frontend

## Développement GraphQL

- Documenter clairement tous les nouveaux types, queries et mutations
- Maintenir la cohérence des noms entre le backend et le frontend
- Utiliser des fragments côté frontend pour les parties réutilisables des requêtes
- Vérifier la compatibilité des types entre backend et frontend

## Gestion des Modifications

- Documenter les changements de schéma GraphQL dans les messages de commit

## Coordination

- Maintenir une documentation à jour des endpoints GraphQL modifiés

---

Ces règles visent à assurer un développement ordonné de la fonctionnalité "outils signature de mail" en évitant les impacts non intentionnels sur d'autres parties de l'application.
