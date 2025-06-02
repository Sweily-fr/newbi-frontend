import { DocumentText1, Google, Send2, Trello, ArrangeHorizontalSquare, Designtools, Document, MoneyChange, Receipt2 } from "iconsax-react";
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
      <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#f0eeff" }}>
        <Google size="28" variant="Bold" color="#5b50ff" />
      </div>
    ),
    href: "/blog-seo-optimizer",
  },
  {
    id: "email-signature",
    name: "Signature Email",
    description: "Créez des signatures email professionnelles personnalisées",
    category: "Marketing & Communication",
    // maintenance: true,
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#f0eeff" }}>
        <Designtools size="28" variant="Bold" color="#5b50ff" />
      </div>
    ),
    href: "/signatures-email",
  },
  {
    id: "invoices",
    name: "Factures",
    description:
      "Créez et gérez vos factures professionnelles en quelques clics",
    category: "Finances",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#f0eeff" }}>
        <DocumentText1 size="28" variant="Bold" color="#5b50ff" />
      </div>
    ),
    href: "/factures",
  },
  {
    id: "quotes",
    name: "Devis",
    description:
      "Créez et suivez vos devis clients avec des modèles professionnels",
    category: "Finances",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#f0eeff" }}>
        <DocumentText1 size="28" variant="Bold" color="#5b50ff" />
      </div>
    ),
    href: "/devis",
  },
  {
    id: "confidentiality-policies",
    name: "Politique de confidentialité",
    description: "Créez des politiques de confidentialité professionnelles",
    category: "Site internet",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#f0eeff" }}>
        <ArrangeHorizontalSquare size="28" variant="Bold" color="#5b50ff" />
      </div>
    ),
    href: "/generator-politique-confidentialite",
  },
  {
    id: "mentions-legales",
    name: "Mentions légales",
    description: "Créez des mentions légales professionnelles",
    category: "Site internet",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#f0eeff" }}>
        <ArrangeHorizontalSquare size="28" variant="Bold" color="#5b50ff" />
      </div>
    ),
    href: "/generator-mentions-legales",
  },
  {
    id: "transfert-fichiers-volumineux",
    name: "Transfert de fichiers volumineux",
    description:
      "Transférez des fichiers volumineux en toute sécurité jusqu'à 100Go sans limite de téléchargement",
    category: "Productivité",
    comingSoon: true,
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#f0eeff" }}>
        <Send2 size="28" variant="Bold" color="#5b50ff" />
      </div>
    ),
    href: "/transfert-fichiers-volumineux",
  },
  {
    id: "gestion-taches",
    name: "Gestion des tâches",
    description:
      "Gérez vos tâches et vos projets avec des outils simples et efficaces",
    category: "Productivité",
    comingSoon: true,
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#f0eeff" }}>
        <Trello size="28" variant="Bold" color="#5b50ff" />
      </div>
    ),
    href: "/gestion-taches",
  },
  {
    id: "depenses",
    name: "Dépenses",
    description: "Suivez et gérez vos dépenses professionnelles avec OCR",
    category: "Finances",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#f0eeff" }}>
        <Receipt2 size="28" variant="Bold" color="#5b50ff" />
      </div>
    ),
    href: "/depenses",
  },
  {
    id: "signature-electronique",
    name: "Signature électronique",
    description: "Signez et faites signer vos documents en ligne de manière sécurisée",
    category: "Finances",
    comingSoon: true,
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#f0eeff" }}>
        <Document size="28" variant="Bold" color="#5b50ff" />
      </div>
    ),
    href: "/signature-electronique",
  },
  {
    id: "bons-de-commande",
    name: "Bons de commande",
    description: "Créez et gérez vos bons de commande professionnels",
    category: "Finances",
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#f0eeff" }}>
        <Receipt2 size="28" variant="Bold" color="#5b50ff" />
      </div>
    ),
    href: "/bons-de-commande",
  },
  {
    id: "gestion-tresorerie",
    name: "Gestion de trésorerie",
    description: "Suivez et anticipez vos flux de trésorerie pour une meilleure gestion financière",
    category: "Finances",
    comingSoon: true,
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#f0eeff" }}>
        <MoneyChange size="28" variant="Bold" color="#5b50ff" />
      </div>
    ),
    href: "/gestion-tresorerie",
  },
];

// Fonction utilitaire pour trouver un outil par son ID
export const getToolById = (id: string): Tool | undefined => {
  return TOOLS.find((tool) => tool.id === id);
};
