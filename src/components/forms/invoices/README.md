# Refactorisation du Formulaire de Facture

Ce dossier contient les composants refactorisés du formulaire de facture, qui a été divisé en plusieurs composants plus petits et plus maintenables, avec une migration progressive vers React Hook Form.

## Structure des Composants

### Composants Principaux
- `InvoiceFormModal.tsx` - Composant principal utilisant l'approche originale
- `InvoiceFormModalWithHookForm.tsx` - Version refactorisée utilisant React Hook Form (en cours de développement)

### Sous-composants
Tous les sous-composants sont maintenant compatibles avec React Hook Form tout en restant rétrocompatibles avec l'approche originale :

- `ClientSelection.tsx` - Gestion de la sélection et création de client
- `InvoiceGeneralInfo.tsx` - Informations générales de la facture
- `InvoiceItems.tsx` - Gestion des articles de la facture
- `InvoiceDiscountAndTotals.tsx` - Gestion des remises et calcul des totaux
- `InvoiceFooterNotes.tsx` - Notes de bas de page
- `InvoiceTermsAndConditions.tsx` - Conditions générales
- `InvoiceCustomFields.tsx` - Champs personnalisés
- `InvoiceCompanyInfo.tsx` - Informations de l'entreprise
- `InvoiceBankDetails.tsx` - Coordonnées bancaires
- `InvoiceStatus.tsx` - Statut de la facture
- `InvoiceActionButtons.tsx` - Boutons d'action du formulaire

### Bibliothèque de Composants UI
Tous les composants de formulaire utilisent désormais la bibliothèque UI personnalisée située dans `/src/components/ui/` :

- `TextField.tsx` - Champ de texte standard avec support pour React Hook Form
- `TextArea.tsx` - Zone de texte multiligne avec support pour React Hook Form
- `Select.tsx` - Liste déroulante avec support pour React Hook Form
- `Checkbox.tsx` - Case à cocher avec support pour React Hook Form
- `Button.tsx` - Bouton avec différentes variantes et tailles
- `Form.tsx` - Conteneur de formulaire avec gestion de l'espacement

### Fichiers Utilitaires
- `/src/constants/formValidations.ts` - Constantes pour les validations et règles de validation réutilisables
- `invoiceFormTypes.ts` - Types TypeScript pour les données du formulaire

## Hooks Personnalisés
- `useInvoiceForm.ts` - Hook original pour la gestion du formulaire
- `useInvoiceFormWithHookForm.ts` - Hook refactorisé utilisant React Hook Form (en cours de développement)

## Stratégie de Migration vers React Hook Form

La migration vers React Hook Form suit une approche progressive en plusieurs étapes :

1. **Étape 1 : Refactorisation des composants UI** 
   - Création de composants UI réutilisables avec support pour React Hook Form
   - Maintien de la rétrocompatibilité avec l'approche originale

2. **Étape 2 : Adaptation des sous-composants** 
   - Remplacement des éléments HTML natifs par les composants UI
   - Ajout des props `register` et `error` pour React Hook Form
   - Maintien de la compatibilité avec les props existantes (value, onChange)

3. **Étape 3 : Création du hook React Hook Form** 
   - Développement de `useInvoiceFormWithHookForm.ts`
   - Définition des types et schémas de validation
   - Implémentation de `useFieldArray` pour les tableaux

4. **Étape 4 : Création du formulaire complet** 
   - Développement de `InvoiceFormModalWithHookForm.tsx`
   - Intégration avec le nouveau hook

## Avantages de la Refactorisation

### Avantages de la Modularisation
1. **Meilleure Organisation du Code** - Chaque composant a une responsabilité unique
2. **Facilité de Maintenance** - Les modifications peuvent être apportées à des composants spécifiques sans affecter l'ensemble
3. **Réutilisabilité** - Les composants peuvent être réutilisés dans d'autres parties de l'application
4. **Lisibilité Améliorée** - Le code est plus facile à comprendre et à naviguer
5. **Tests Simplifiés** - Les composants plus petits sont plus faciles à tester

### Avantages de React Hook Form
1. **Réduction du Code Boilerplate** - Moins de code pour gérer l'état du formulaire
2. **Validation Simplifiée** - Validation déclarative avec des règles prédéfinies
3. **Meilleures Performances** - Moins de re-rendus grâce à l'optimisation interne
4. **Gestion Simplifiée des Tableaux** - Utilisation de `useFieldArray` pour les champs répétitifs
5. **Meilleure Expérience Développeur** - API intuitive et hooks spécialisés

## Comment Utiliser

Pour utiliser la version originale :
```jsx
import { InvoiceFormModal } from './components/forms/invoices/InvoiceFormModal';

// Dans votre composant
<InvoiceFormModal 
  invoice={invoiceData} 
  onClose={handleClose} 
  onSubmit={handleSubmit} 
/>
```

Pour utiliser la version avec React Hook Form (une fois terminée) :
```jsx
import { InvoiceFormModalWithHookForm } from './components/forms/invoices/InvoiceFormModalWithHookForm';

// Dans votre composant
<InvoiceFormModalWithHookForm 
  invoice={invoiceData} 
  onClose={handleClose} 
  onSubmit={handleSubmit} 
/>
```

## Validation des Formulaires

La validation des formulaires est gérée à travers les constantes et fonctions définies dans `/src/constants/formValidations.ts` :

- Patterns de validation (EMAIL_PATTERN, SIRET_PATTERN, VAT_PATTERN)
- Messages d'erreur standardisés
- Fonctions utilitaires pour générer les règles de validation
  - `getEmailValidationRules()`
  - `getSiretValidationRules()`
  - `getVatValidationRules()`
  - `getClientValidationRules()`
  - `getInvoiceValidationRules()`

## Prochaines Étapes
1. Finaliser le hook `useInvoiceFormWithHookForm.ts`
2. Développer le composant `InvoiceFormModalWithHookForm.tsx`
3. Ajouter des tests unitaires pour chaque composant
4. Améliorer la documentation des composants
5. Optimiser les performances
6. Ajouter des fonctionnalités d'accessibilité
7. Créer des exemples d'utilisation
