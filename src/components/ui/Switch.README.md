# Switch Component

Un composant de switch (interrupteur) réutilisable pour les interfaces utilisateur.

## Fonctionnalités

- Support pour les labels à gauche et à droite
- État activé/désactivé
- Support pour les états désactivés (disabled)
- Personnalisation via className
- Accessibilité (ARIA)
- Entièrement stylisé avec Tailwind CSS et CSS personnalisé

## Propriétés (Props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | 'switch' | ID unique pour le switch |
| `name` | string | undefined | Nom du champ de formulaire |
| `checked` | boolean | required | État actuel du switch (activé/désactivé) |
| `onChange` | function | required | Fonction appelée lors du changement d'état |
| `leftLabel` | string | undefined | Texte affiché à gauche du switch |
| `rightLabel` | string | undefined | Texte affiché à droite du switch |
| `className` | string | '' | Classes CSS supplémentaires |
| `disabled` | boolean | false | Désactive le switch s'il est à true |

## Exemples d'utilisation

### Switch basique

```tsx
import { useState } from 'react';
import { Switch } from '../components/ui/Switch';

const Example = () => {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <Switch 
      checked={isActive} 
      onChange={setIsActive} 
    />
  );
};
```

### Switch avec labels

```tsx
<Switch 
  checked={isAnnual} 
  onChange={setIsAnnual}
  leftLabel="MONTHLY" 
  rightLabel="ANNUALLY" 
/>
```

### Switch désactivé

```tsx
<Switch 
  checked={isActive} 
  onChange={setIsActive}
  disabled={true}
/>
```

## Style personnalisé

Le composant utilise les styles définis dans `src/styles/form-switch.css`. Vous pouvez personnaliser l'apparence du switch en modifiant ce fichier CSS ou en ajoutant des classes via la prop `className`.

## Accessibilité

Le composant inclut des attributs ARIA pour garantir l'accessibilité, notamment un `sr-only` (screen reader only) span qui décrit la fonction du switch.
