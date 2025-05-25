# Composants SEO pour Newbi

Ce dossier contient les composants réutilisables pour optimiser le référencement (SEO) de Newbi.

## Composants disponibles

### 1. SEOHead

Composant principal qui gère toutes les balises meta et les données structurées pour une page.

```tsx
<SEOHead
  title="Titre de la page | Newbi"
  description="Description détaillée de la page"
  keywords="mots-clés, pertinents"
  canonicalUrl="https://www.newbi.fr/page"
  ogImage="https://www.newbi.fr/images/logo.png"
  schemaType="WebApplication"
  schemaPrice="0"
  isPremium={false}
  additionalSchemaData={{}}
  noindex={false}
/>
```

### 2. PageSEO

Composant utilitaire qui utilise la configuration centralisée (`seoConfig.ts`) pour simplifier l'implémentation du SEO sur chaque page.

```tsx
// Utilisation simple
<PageSEO pageKey="home" />

// Avec surcharge de propriétés
<PageSEO 
  pageKey="invoices" 
  overrideProps={{
    title: "Titre personnalisé",
    description: "Description personnalisée"
  }}
/>
```

### 3. SchemaMarkup

Composant pour ajouter uniquement des données structurées Schema.org à une page.

```tsx
<SchemaMarkup
  type="WebApplication"
  name="Nom de l'application"
  description="Description de l'application"
  price="0"
  url="https://www.newbi.fr/page"
  additionalData={{}}
/>
```

### 4. BreadcrumbSchema

Composant pour ajouter des données structurées de fil d'Ariane (breadcrumb).

```tsx
<BreadcrumbSchema
  items={[
    { name: "Accueil", url: "https://www.newbi.fr" },
    { name: "Outils", url: "https://www.newbi.fr/outils" },
    { name: "Factures", url: "https://www.newbi.fr/factures" }
  ]}
/>
```

### 5. FAQSchema

Composant pour ajouter des données structurées de FAQ.

```tsx
<FAQSchema
  items={[
    { 
      question: "Comment créer une facture ?", 
      answer: "Cliquez sur le bouton 'Créer une facture' et remplissez le formulaire." 
    },
    { 
      question: "Comment exporter une facture en PDF ?", 
      answer: "Ouvrez la facture et cliquez sur le bouton 'Exporter en PDF'." 
    }
  ]}
/>
```

## Configuration SEO centralisée

Toutes les meta descriptions et autres informations SEO sont centralisées dans le fichier :
```
/src/config/seoConfig.ts
```

Pour plus d'informations sur l'implémentation du SEO dans Newbi, consultez le guide complet :
```
/src/docs/seo-guide.md
```

## Charte graphique Newbi

- Couleur primaire: `#5b50ff` (violet Newbi)
- Couleur de fond légère: `#f0eeff`
- Couleur hover (plus foncée): `#4a41e0`
- Couleur hover (plus claire): `#e6e1ff`

## Rappel important

Toutes les pages de Newbi sont désormais entièrement gratuites. Assurez-vous que les meta descriptions et les données structurées reflètent cette information en utilisant `schemaPrice="0"` et `isPremium={false}`.
