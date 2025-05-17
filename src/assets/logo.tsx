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
  // Fonction pour obtenir le chemin de l'image en fonction de la variante et du mode texte
  const getLogoPath = (): string => {
    switch (variant) {
      case 'white':
        return withText ? '/images/logo_newbi/PNG/Logo_Texte_White.png' : '/images/logo_newbi/PNG/Logo_NI_White.png';
      case 'black':
        return withText ? '/images/logo_newbi/PNG/Logo_Texte_Black.png' : '/images/logo_newbi/PNG/Logo_NI_Black.png';
      case 'purple':
        return withText ? '/images/logo_newbi/PNG/Logo_Texte_Purple.png' : '/images/logo_newbi/PNG/Logo_NI_Purple.png';
      case 'square-white':
        return '/images/logo_newbi/PNG/Logo_square_WB.png';
      case 'square-black':
        return '/images/logo_newbi/PNG/Logo_square_BW.png';
      case 'square-purple':
        return '/images/logo_newbi/PNG/Logo_square_PB.png';
      default:
        // Par défaut, utiliser le logo noir avec texte
        return withText ? '/images/logo_newbi/PNG/Logo_Texte_Black.png' : '/images/logo_newbi/PNG/Logo_NI_Black.png';
    }
  };

  // Déterminer la hauteur en fonction du mode (avec ou sans texte)
  const height = withText ? 'h-12' : 'h-14';
  
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={getLogoPath()} 
        alt="Newbi" 
        className={`${height} w-auto`}
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
};
