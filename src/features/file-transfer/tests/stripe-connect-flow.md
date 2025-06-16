# Test du flux complet Stripe Connect pour le transfert de fichiers

Ce document décrit les étapes pour tester le flux complet d'intégration de Stripe Connect dans l'outil de transfert de fichiers volumineux de Newbi.

## 1. Côté expéditeur (demande de paiement)

### 1.1 Création d'un compte Stripe Connect

1. Accéder à la page de transfert de fichiers (`/file-transfer`)
2. Sélectionner un ou plusieurs fichiers à transférer
3. Cocher l'option "Demander un paiement pour accéder aux fichiers"
4. Vérifier que le modal d'onboarding Stripe Connect s'affiche
5. Cliquer sur "Créer un compte Stripe Connect"
6. Vérifier que le compte est créé avec succès (message de confirmation)

### 1.2 Onboarding Stripe Connect

1. Cliquer sur "Configurer mon compte Stripe Connect"
2. Vérifier la redirection vers le formulaire d'onboarding Stripe Connect Express
3. Remplir le formulaire d'onboarding avec les informations requises :
   - Informations personnelles/d'entreprise
   - Coordonnées bancaires (IBAN)
   - Documents d'identité si demandés
4. Soumettre le formulaire d'onboarding
5. Vérifier la redirection vers l'application Newbi (`/file-transfer`)
6. Vérifier que le statut du compte Stripe Connect est mis à jour (message "Compte Stripe Connect configuré")

### 1.3 Création d'un transfert avec paiement

1. Saisir un montant de paiement (ex: 10)
2. Sélectionner une devise (EUR par défaut)
3. Compléter les autres informations du transfert (durée d'expiration, etc.)
4. Cliquer sur "Transférer les fichiers"
5. Vérifier que le transfert est créé avec succès
6. Copier le lien de partage généré

## 2. Côté destinataire (paiement et téléchargement)

### 2.1 Accès au lien de transfert

1. Ouvrir le lien de partage dans un navigateur
2. Vérifier que la page de téléchargement s'affiche correctement
3. Vérifier que les informations du transfert sont correctes (nom du fichier, taille, expéditeur)
4. Vérifier que la demande de paiement est affichée avec le montant correct

### 2.2 Paiement via Stripe Checkout

1. Cliquer sur "Payer maintenant"
2. Vérifier la redirection vers la page Stripe Checkout
3. Saisir les informations de carte de test :
   - Numéro : 4242 4242 4242 4242
   - Date d'expiration : une date future (ex: 12/25)
   - CVC : 3 chiffres (ex: 123)
   - Nom et adresse : n'importe quelles valeurs
4. Cliquer sur "Payer"
5. Vérifier la redirection vers la page de téléchargement avec un message de succès du paiement

### 2.3 Téléchargement des fichiers

1. Vérifier que le bouton de téléchargement est désormais accessible
2. Cliquer sur "Télécharger"
3. Vérifier que le téléchargement démarre correctement
4. Vérifier que les fichiers téléchargés sont intacts et correspondent aux fichiers originaux

## 3. Vérifications côté expéditeur

1. Retourner à la liste des transferts de fichiers
2. Vérifier que le transfert apparaît avec le statut "Payé"
3. Vérifier que le montant du paiement est correctement affiché
4. Vérifier que le paiement apparaît dans le tableau de bord Stripe Connect de l'expéditeur

## Notes importantes

- Pour les tests en environnement de développement, utiliser les cartes de test Stripe :
  - Carte de paiement réussi : 4242 4242 4242 4242
  - Carte de paiement refusé : 4000 0000 0000 0002
- Les webhooks Stripe doivent être configurés pour mettre à jour le statut de paiement en temps réel
- La commission de la plateforme est configurée via `application_fee_amount` côté backend

## Résolution des problèmes courants

1. **Le modal d'onboarding ne s'affiche pas** : Vérifier que les mutations GraphQL sont correctement importées et que le composant StripeConnectOnboarding est bien intégré dans FileTransferForm.

2. **Erreur lors de la création du compte Stripe Connect** : Vérifier les logs côté backend et s'assurer que la clé API Stripe est correctement configurée.

3. **Redirection d'onboarding échouée** : Vérifier que l'URL de retour est correctement configurée dans la mutation `GENERATE_STRIPE_ONBOARDING_LINK`.

4. **Paiement échoué** : Vérifier les logs Stripe et s'assurer que le compte Connect est correctement configuré et que les paiements sont activés.

5. **Téléchargement impossible après paiement** : Vérifier que le statut de paiement est correctement mis à jour dans la base de données après le webhook Stripe.
