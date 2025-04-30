import React from 'react';

type LogoVariant = 'default' | 'white' | 'black' | 'purple' | 'square-white' | 'square-black' | 'square-purple';

interface LogoProps {
  className?: string;
  variant?: LogoVariant;
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  variant = 'default', 
  withText = true 
}) => {
  // Fonction pour obtenir le chemin de l'image SVG en fonction de la variante et du mode texte
  const getLogoPath = (): string => {
    switch (variant) {
      case 'white':
        return withText ? '/images/logo_newbi/SVG/Logo_Texte_White.svg' : '/images/logo_newbi/SVG/Logo_NI_White.svg';
      case 'black':
        return withText ? '/images/logo_newbi/SVG/Logo_Texte_Black.svg' : '/images/logo_newbi/SVG/Logo_NI_Black.svg';
      case 'purple':
        return withText ? '/images/logo_newbi/SVG/Logo_Texte_Purple.svg' : '/images/logo_newbi/SVG/Logo_NI_Purple.svg';
      case 'square-white':
        return '/images/logo_newbi/SVG/Logo_square_WB.svg';
      case 'square-black':
        return '/images/logo_newbi/SVG/Logo_square_BW.svg';
      case 'square-purple':
        return '/images/logo_newbi/SVG/Logo_square_PB.svg';
      default:
        // Par défaut, utiliser le logo noir avec texte
        return withText ? '/images/logo_newbi/SVG/Logo_Texte_Black.svg' : '/images/logo_newbi/SVG/Logo_NI_Black.svg';
    }
  };

  // Déterminer la hauteur en fonction du mode (avec ou sans texte)
  const height = withText ? 'h-10' : 'h-12';
  
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={getLogoPath()} 
        alt="Newbi" 
        className={`${height} w-auto object-contain`} 
      />
    </div>
  );
};
