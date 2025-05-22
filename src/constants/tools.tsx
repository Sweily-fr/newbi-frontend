import { DocumentText1, Google, Send2, Trello, ArrangeHorizontalSquare, Designtools } from "iconsax-react";
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
}

// Liste des outils disponibles dans l'application
export const TOOLS: Tool[] = [
  {
    id: "blog-seo-optimizer",
    name: "Articles SEO",
    description:
      "Analysez et améliorez le référencement de vos articles de blog",
    category: "Marketing",
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
    category: "Communication",
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
    category: "Facturation",
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
    category: "Facturation",
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
    category: "À venir",
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
    category: "À venir",
    comingSoon: true,
    premium: true,
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#f0eeff" }}>
        <Trello size="28" variant="Bold" color="#5b50ff" />
      </div>
    ),
    href: "/gestion-taches",
  },
];

// Outils pour la page d'accueil (format moderne avec le nouveau design)
export const HOME_TOOLS = [
  {
    id: "invoices",
    name: "Factures",
    description: "Créez et gérez vos factures en quelques clics",
    category: "Facturation",
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#f0eeff" }}>
        <svg
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#5b50ff"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
    ),
    href: "/factures",
  },
  {
    id: "quotes",
    name: "Devis",
    description: "Créez et suivez vos devis clients",
    category: "Facturation",
    icon: (
      <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#f0eeff" }}>
        <svg
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#5b50ff"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      </div>
    ),
    href: "/devis",
  },
];

// Fonction utilitaire pour trouver un outil par son ID
export const getToolById = (id: string): Tool | undefined => {
  return TOOLS.find((tool) => tool.id === id);
};
