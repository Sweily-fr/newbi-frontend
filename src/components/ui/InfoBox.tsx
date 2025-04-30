import React, { ReactNode } from "react";

export type InfoBoxVariant = "default" | "info" | "warning" | "success" | "error";

interface InfoBoxProps {
  /** Contenu textuel de la note d'information */
  children: ReactNode;
  /** Lien optionnel à afficher sous le texte */
  actionLink?: {
    /** URL du lien */
    href: string;
    /** Texte du lien */
    label: string;
    /** Fonction de callback pour le clic sur le lien */
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  };
  /** Variante de style (couleur) */
  variant?: InfoBoxVariant;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant InfoBox pour afficher des notes d'information avec différentes variantes de style
 */
const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  actionLink,
  variant = "default",
  className = "",
}) => {
  // Configuration des styles selon la variante
  const variantStyles = {
    default: {
      container: "bg-gray-50 border border-gray-200",
      icon: "text-gray-500",
      text: "text-gray-700",
    },
    info: {
      container: "bg-[#f9f8ff] border-l-4 border-[#5b50ff]",
      icon: "text-[#5b50ff]",
      text: "text-[#5b50ff]",
    },
    warning: {
      container: "bg-yellow-50 border-l-4 border-yellow-400",
      icon: "text-yellow-400",
      text: "text-yellow-700",
    },
    success: {
      container: "bg-green-50 border-l-4 border-green-400",
      icon: "text-green-400",
      text: "text-green-700",
    },
    error: {
      container: "bg-red-50 border-l-4 border-red-400",
      icon: "text-red-400",
      text: "text-red-700",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div 
      className={`${styles.container} rounded-md p-4 mb-4 ${className}`}
      style={{ boxShadow: variant === 'info' ? '0 4px 20px rgba(91, 80, 255, 0.1)' : 'none' }}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className={`h-5 w-5 ${styles.icon}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className={`text-sm ${styles.text}`}>{children}</p>
          {actionLink && (
            <a
              href={actionLink.href}
              className="text-sm text-[#5b50ff] hover:underline mt-2 inline-block"
              onClick={actionLink.onClick}
            >
              {actionLink.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
