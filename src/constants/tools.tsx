import React from "react";

// Définition du type pour un outil
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  href: string;
  premium?: boolean;
  comingSoon?: boolean;
  maintenance?: boolean;
}

// Liste des outils disponibles dans l'application
export const TOOLS: Tool[] = [
  {
    id: "blog-seo-optimizer",
    name: "Articles SEO",
    description:
      "Analysez et améliorez le référencement de vos articles de blog",
    category: "Marketing & Communication",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full overflow-hidden">
        <img src="/images/tools_img/ArticlesSeo.svg" alt="Articles SEO" className="w-full h-full object-cover" />
      </div>
    ),
    href: "/blog-seo-optimizer",
  },
  {
    id: "email-signature",
    name: "Signature Email",
    description: "Créez des signatures email professionnelles personnalisées",
    category: "Marketing & Communication",
    maintenance: true,
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full overflow-hidden">
        <img src="/images/tools_img/SignatureEmail.svg" alt="Signature Email" className="w-full h-full object-cover" />
      </div>
    ),
    href: "/signatures-email",
  },
  {
    id: "invoices",
    name: "Factures",
    description:
      "Créez et gérez vos factures professionnelles en quelques clics",
    category: "Gestion Administrative & Financière",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full overflow-hidden">
        <img src="/images/tools_img/Facture.svg" alt="Factures" className="w-full h-full object-cover" />
      </div>
    ),
    href: "/factures",
  },
  {
    id: "quotes",
    name: "Devis",
    description:
      "Créez et suivez vos devis clients avec des modèles professionnels",
    category: "Gestion Administrative & Financière",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full overflow-hidden">
        <img src="/images/tools_img/Devis.svg" alt="Devis" className="w-full h-full object-cover" />
      </div>
    ),
    href: "/devis",
  },
  {
    id: "confidentiality-policies",
    name: "Politique de confidentialité",
    description: "Créez des politiques de confidentialité professionnelles",
    category: "Conformité Légale & Documents Officiels",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full overflow-hidden">
        <img src="/images/tools_img/Politiquedeconfidentialité.svg" alt="Politique de confidentialité" className="w-full h-full object-cover" />
      </div>
    ),
    href: "/generator-politique-confidentialite",
  },
  {
    id: "mentions-legales",
    name: "Mentions légales",
    description: "Créez des mentions légales professionnelles",
    category: "Conformité Légale & Documents Officiels",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full overflow-hidden">
        <img src="/images/tools_img/Mentionslegales.svg" alt="Mentions légales" className="w-full h-full object-cover" />
      </div>
    ),
    href: "/generator-mentions-legales",
  },
  {
    id: "transfert-fichiers-volumineux",
    name: "Transfert de fichiers volumineux",
    description:
      "Transférez des fichiers volumineux en toute sécurité jusqu'à 100Go sans limite de téléchargement",
    category: "Organisation & Productivité",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full overflow-hidden">
        <img src="/images/tools_img/Transfertdefichiers.svg" alt="Transfert de fichiers" className="w-full h-full object-cover" />
      </div>
    ),
    href: "/file-transfer",
  },
  {
    id: "gestion-taches",
    name: "Gestion des tâches Kanban",
    description:
      "Gérez vos tâches et vos projets avec un tableau Kanban intuitif et efficace",
    category: "Organisation & Productivité",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full overflow-hidden">
        <img src="/images/tools_img/Gestiondestaches.svg" alt="Gestion des tâches" className="w-full h-full object-cover" />
      </div>
    ),
    href: "/kanban",
  },
  {
    id: "depenses",
    name: "Dépenses",
    description: "Suivez et gérez vos dépenses professionnelles avec OCR",
    category: "Gestion Administrative & Financière",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full overflow-hidden">
        <img src="/images/tools_img/Depenses.svg" alt="Dépenses" className="w-full h-full object-cover" />
      </div>
    ),
    href: "/depenses",
  },
  {
    id: "clients",
    name: "Clients",
    description: "Gérez votre base de clients et leurs informations de facturation",
    category: "Gestion Commerciale & Catalogue",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full overflow-hidden">
        <img src="/images/tools_img/Clients.svg" alt="Gestion des clients" className="w-full h-full object-cover" />
      </div>
    ),
    href: "/clients",
  },
  {
    id: "catalog",
    name: "Catalogue",
    description: "Gérez vos produits et services pour vos factures et devis",
    category: "Gestion Commerciale & Catalogue",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full overflow-hidden">
        <img src="/images/tools_img/Catalog.svg" alt="Catalogue produits/services" className="w-full h-full object-cover" />
      </div>
    ),
    href: "/catalogue",
  },
];

// Fonction utilitaire pour trouver un outil par son ID
export const getToolById = (id: string): Tool | undefined => {
  return TOOLS.find((tool) => tool.id === id);
};
