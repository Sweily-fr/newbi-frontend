# Guide d'implémentation SEO pour Newbi

Ce guide explique comment implémenter et maintenir les meta descriptions spécifiques à chaque page pour optimiser le référencement (SEO) de Newbi.

## Configuration SEO centralisée

Toutes les meta descriptions et autres informations SEO sont centralisées dans le fichier :
```
/src/config/seoConfig.ts
```

Ce fichier contient des configurations spécifiques pour chaque page du site, avec les propriétés suivantes :
- `title` : Titre de la page (balise title)
- `description` : Meta description de la page
- `keywords` : Mots-clés pour la page (séparés par des virgules)
- `canonicalUrl` : URL canonique de la page
- `ogImage` : Image Open Graph pour les partages sur les réseaux sociaux
- `schemaType` : Type de données structurées Schema.org
- `noindex` : Booléen indiquant si la page doit être indexée ou non

## Composants SEO disponibles

### 1. SEOHead

Le composant de base qui gère toutes les balises meta et les données structurées :
```tsx
import { SEOHead } from '../components/specific/SEO/SEOHead';

<SEOHead
  title="Titre de la page"
  description="Description de la page"
  keywords="mot-clé1, mot-clé2"
  canonicalUrl="https://www.newbi.fr/page"
  ogImage="https://www.newbi.fr/images/image.png"
  schemaType="WebApplication"
  schemaPrice="0" // Prix (0 pour gratuit)
  isPremium={false} // Si la fonctionnalité est premium
  additionalSchemaData={{}} // Données structurées supplémentaires
  noindex={false} // Si la page doit être indexée
/>
```

### 2. PageSEO (Recommandé)

Un composant utilitaire qui utilise la configuration centralisée pour simplifier l'implémentation :
```tsx
import { PageSEO } from '../components/specific/SEO/PageSEO';

// Utilisation simple
<PageSEO pageKey="home" />

// Avec surcharge de certaines propriétés
<PageSEO 
  pageKey="invoices" 
  overrideProps={{
    title: "Titre personnalisé",
    description: "Description personnalisée"
  }}
/>
```

### 3. SchemaMarkup

Un composant pour ajouter uniquement des données structurées Schema.org :
```tsx
import { SchemaMarkup } from '../components/specific/SEO/SchemaMarkup';

<SchemaMarkup
  type="WebApplication"
  name="Nom de l'application"
  description="Description de l'application"
  price="0"
  url="https://www.newbi.fr/page"
  additionalData={{}}
/>
```

## Comment implémenter le SEO sur une nouvelle page

1. Ajoutez une configuration pour la page dans `seoConfig.ts` :
```typescript
// Dans seoConfig.ts
export const seoConfig = {
  // Configurations existantes...
  
  // Nouvelle page
  maNouvellePage: {
    title: "Titre de ma nouvelle page | Newbi",
    description: "Description détaillée de ma nouvelle page pour optimiser le référencement.",
    keywords: "mots-clés, pertinents, pour, ma, page",
    canonicalUrl: "https://www.newbi.fr/ma-nouvelle-page",
    ogImage: "https://www.newbi.fr/images/logo_newbi/PNG/Logo_Texte_Purple.png",
    schemaType: "WebPage" // Ou un autre type selon le contenu
  }
}
```

2. Utilisez le composant PageSEO dans votre page :
```tsx
import React from 'react';
import { PageSEO } from '../components/specific/SEO/PageSEO';

export const MaNouvellePage: React.FC = () => {
  return (
    <>
      <PageSEO pageKey="maNouvellePage" />
      
      {/* Contenu de la page */}
      <div>
        <h1>Ma nouvelle page</h1>
        {/* ... */}
      </div>
    </>
  );
};
```

## Bonnes pratiques SEO pour Newbi

1. **Meta descriptions** : Limitez-les à 150-160 caractères pour éviter qu'elles soient tronquées dans les résultats de recherche.

2. **Titres** : Limitez-les à 50-60 caractères et incluez toujours "Newbi" pour renforcer la marque.

3. **Mots-clés** : Incluez des mots-clés pertinents et spécifiques à la page, en évitant le bourrage de mots-clés.

4. **URL canoniques** : Utilisez toujours le domaine complet avec www (https://www.newbi.fr) pour éviter les problèmes de contenu dupliqué.

5. **Images Open Graph** : Utilisez des images de haute qualité aux dimensions recommandées (1200x630 pixels).

6. **Données structurées** : Utilisez le type Schema.org le plus approprié pour chaque page :
   - `WebApplication` pour les pages d'outils
   - `Organization` pour la page d'accueil
   - `Service` pour les pages de services spécifiques
   - `Article` pour les articles de blog

7. **Pages privées** : Utilisez `noindex={true}` pour les pages qui ne doivent pas apparaître dans les résultats de recherche (pages de profil, pages d'administration, etc.).

## Maintenance du SEO

- Mettez à jour régulièrement les meta descriptions pour refléter les changements de fonctionnalités ou de contenu.
- Vérifiez périodiquement que toutes les URL canoniques sont correctes.
- Testez vos pages avec des outils comme Google Search Console pour identifier les problèmes potentiels.

## Rappel important

Toutes les pages de Newbi sont désormais entièrement gratuites. Assurez-vous que les meta descriptions et les données structurées reflètent cette information en utilisant `schemaPrice="0"` et `isPremium={false}`.
