# Composants UI

Ce dossier contient les composants UI réutilisables de l'application. Ces composants ont été conçus pour être utilisables de deux façons :

1. **Avec React Hook Form** - Pour les formulaires utilisant la bibliothèque React Hook Form
2. **Sans React Hook Form** - Pour une utilisation standard avec des composants contrôlés

## Utilisation avec React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { TextField, Select, Checkbox } from '../components/ui';

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField 
        id="name"
        name="name"
        label="Nom"
        register={register}
        error={errors.name}
        required
      />
      
      <Select
        id="country"
        name="country"
        label="Pays"
        options={[
          { value: 'fr', label: 'France' },
          { value: 'be', label: 'Belgique' }
        ]}
        register={register}
        error={errors.country}
      />
      
      <Checkbox
        id="terms"
        name="terms"
        label="J'accepte les conditions"
        register={register}
        error={errors.terms}
      />
      
      <button type="submit">Envoyer</button>
    </form>
  );
};
```

## Utilisation standard (sans React Hook Form)

```tsx
import { useState } from 'react';
import { TextField, Select, Checkbox } from '../components/ui';

const MyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    terms: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <TextField 
        id="name"
        name="name"
        label="Nom"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <Select
        id="country"
        name="country"
        label="Pays"
        options={[
          { value: 'fr', label: 'France' },
          { value: 'be', label: 'Belgique' }
        ]}
        value={formData.country}
        onChange={handleChange}
      />
      
      <Checkbox
        id="terms"
        name="terms"
        label="J'accepte les conditions"
        checked={formData.terms}
        onChange={handleChange}
      />
      
      <button type="submit">Envoyer</button>
    </form>
  );
};
```

## Composants disponibles

- **TextField** - Champ de texte standard
- **TextArea** - Zone de texte multiligne
- **Select** - Liste déroulante
- **Checkbox** - Case à cocher
- **Button** - Bouton avec différentes variantes
- **Form** - Conteneur de formulaire avec espacement configurable
- **FormActions** - Actions de formulaire (boutons Annuler/Enregistrer)
- **FieldGroup** - Groupe de champs connexes
- **ImageUploader** - Composant pour l'upload et la prévisualisation d'images
- **SearchInput** - Champ de recherche avec icône
- **Dropdown** - Menu déroulant avec des options cliquables

## Dropdown

Le composant `Dropdown` permet d'afficher un menu déroulant avec des options cliquables.

```tsx
import { Dropdown } from '../components/ui';

// Définir les éléments du dropdown
const dropdownItems = [
  {
    label: 'Option 1',
    onClick: () => console.log('Option 1 clicked')
  },
  {
    label: 'Option 2',
    onClick: () => console.log('Option 2 clicked'),
    hasDivider: true // Ajoute une bordure au-dessus de cet élément
  }
];

// Définir l'élément déclencheur
const trigger = (
  <button className="flex items-center">
    <img
      className="h-8 w-8 rounded-full"
      src="https://ui-avatars.com/api/?name=User"
      alt="Avatar"
    />
  </button>
);

// Utiliser le composant
<Dropdown
  trigger={trigger}
  items={dropdownItems}
  position="right" // ou "left"
  width="w-48"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | ReactNode | - | Élément déclencheur du dropdown (obligatoire) |
| `items` | DropdownItem[] | - | Liste des éléments du dropdown (obligatoire) |
| `position` | 'left' \| 'right' | 'right' | Position du dropdown par rapport au déclencheur |
| `width` | string | 'w-48' | Largeur du dropdown (classe Tailwind) |
| `className` | string | '' | Classes CSS additionnelles |

### Interface DropdownItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | - | Texte à afficher (obligatoire) |
| `onClick` | () => void | - | Fonction à exécuter au clic (obligatoire) |
| `hasDivider` | boolean | false | Ajoute une bordure au-dessus de l'élément |
| `className` | string | '' | Classes CSS additionnelles |

## PDFGenerator

Le composant `PDFGenerator` permet de générer et télécharger des PDF à partir de contenu HTML.

### Propriétés

| Nom | Type | Par défaut | Description |
|-----|------|------------|-------------|
| `content` | ReactNode | - | Contenu HTML à convertir en PDF |
| `fileName` | string | 'document.pdf' | Nom du fichier PDF généré |
| `format` | 'a4' \| 'a3' \| 'letter' | 'a4' | Format du document PDF |
| `orientation` | 'portrait' \| 'landscape' | 'portrait' | Orientation du document PDF |
| `margin` | number | 10 | Marge en mm autour du contenu |
| `scale` | number | 1 | Échelle de rendu (entre 0 et 1) |
| `quality` | number | 2 | Qualité de rendu (1 = normal, 2 = haute) |
| `buttonText` | string | 'Télécharger en PDF' | Texte du bouton de téléchargement |
| `buttonProps` | ButtonProps | {} | Propriétés du bouton de téléchargement |
| `renderButton` | (onClick: () => void) => ReactNode | - | Fonction pour personnaliser le rendu du bouton |

### Exemple d'utilisation

```tsx
import { PDFGenerator } from '../components/ui';

const MyComponent = () => {
  const pdfContent = (
    <div className="bg-white p-8">
      <h1 className="text-2xl font-bold">Facture #123</h1>
      <p>Client: Entreprise ABC</p>
      <table className="w-full mt-4">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantité</th>
            <th>Prix</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Service de consultation</td>
            <td>10</td>
            <td>1000 €</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <h2>Aperçu de la facture</h2>
      <div className="border p-4 mb-4">
        {pdfContent}
      </div>
      <PDFGenerator
        content={pdfContent}
        fileName="facture-123.pdf"
        buttonText="Télécharger la facture"
        buttonProps={{ variant: "primary", size: "sm", children: null }}
      />
    </div>
  );
};
```

## Propriétés communes

Tous les composants de formulaire acceptent les propriétés suivantes :

- **id** - Identifiant unique du champ
- **name** - Nom du champ (utilisé pour les données du formulaire)
- **label** - Libellé du champ
- **required** - Indique si le champ est obligatoire
- **disabled** - Désactive le champ
- **className** - Classes CSS additionnelles
- **helpText** - Texte d'aide affiché sous le champ

### Propriétés spécifiques à React Hook Form

- **register** - Fonction register de React Hook Form
- **error** - Objet d'erreur de React Hook Form
- **validation** - Règles de validation pour React Hook Form

### Propriétés pour utilisation standard

- **value** / **checked** - Valeur actuelle du champ
- **onChange** - Fonction appelée lors du changement de valeur
