# Fonctionnalité de Signature Email

Cette fonctionnalité permet aux utilisateurs de créer, modifier et gérer leurs signatures email personnalisées.

## Structure du code

La fonctionnalité est organisée selon une architecture modulaire qui sépare clairement les préoccupations :

```
email-signatures/
├── components/               # Composants UI
│   ├── EmailSignatureForm/   # Formulaire de création/édition
│   ├── EmailSignaturePreview/# Prévisualisation de la signature
│   └── EmailSignatureEditor/ # Combinaison du formulaire et de la prévisualisation
├── hooks/                    # Logique métier
│   └── useEmailSignatureForm.ts # Hook pour la gestion du formulaire
├── types/                    # Définitions de types
│   └── index.ts              # Types pour les signatures email
└── index.ts                  # Point d'entrée qui exporte tous les éléments publics
```

## Utilisation

### Importer les composants

```tsx
import { EmailSignatureEditor, EmailSignatureForm, EmailSignaturePreview } from 'src/features/email-signatures';
```

### Exemple d'utilisation du composant principal

```tsx
import React from 'react';
import { EmailSignatureEditor } from 'src/features/email-signatures';

const EmailSignaturePage: React.FC = () => {
  const handleSubmit = (data) => {
    // Logique pour sauvegarder les données
    console.log('Signature soumise:', data);
  };

  const handleCancel = () => {
    // Logique pour annuler l'édition
    console.log('Édition annulée');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Créer une signature email</h1>
      <EmailSignatureEditor
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EmailSignaturePage;
```

### Utilisation des composants individuels

Si vous avez besoin d'un contrôle plus fin, vous pouvez utiliser les composants individuels :

```tsx
import React, { useState } from 'react';
import { EmailSignatureForm, EmailSignaturePreview } from 'src/features/email-signatures';
import type { EmailSignature } from 'src/features/email-signatures';

const CustomEmailSignatureEditor: React.FC = () => {
  const [signatureData, setSignatureData] = useState<Partial<EmailSignature>>({});

  const handleSubmit = (data) => {
    // Logique pour sauvegarder les données
    console.log('Signature soumise:', data);
  };

  const handleCancel = () => {
    // Logique pour annuler l'édition
    console.log('Édition annulée');
  };

  const handleChange = (data) => {
    setSignatureData(data);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <EmailSignatureForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onChange={handleChange}
        />
      </div>
      <div>
        <EmailSignaturePreview signature={signatureData} />
      </div>
    </div>
  );
};
```

## Personnalisation

### Styles

Les composants utilisent Tailwind CSS pour le styling. Vous pouvez personnaliser l'apparence en modifiant les classes CSS ou en ajoutant des styles personnalisés.

### Validation

La validation des formulaires est gérée dans le hook `useEmailSignatureForm`. Vous pouvez personnaliser les règles de validation en modifiant ce hook.

## Fonctionnalités

- Création et édition de signatures email
- Prévisualisation en temps réel
- Personnalisation des couleurs, polices et mise en page
- Gestion des photos de profil et logos
- Intégration des réseaux sociaux
- Option pour définir une signature par défaut
