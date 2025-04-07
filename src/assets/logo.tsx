import React from 'react';

type LogoVariant = 'default' | 'white' | 'black' | 'square-white' | 'square-black' | 'png-white' | 'png-black';

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
        return withText ? '/images/logo_gb/PNG/Logo+texte_White.png' : '/images/logo_gb/PNG/Logo_white.png';
      case 'black':
        return withText ? '/images/logo_gb/PNG/Logo+texte_black.png' : '/images/logo_gb/PNG/Logo_Black.png';
      case 'square-white':
        return '/images/logo_gb/PNG/Logo_square_white.png';
      case 'square-black':
        return '/images/logo_gb/PNG/Logo_square_black.png';
      case 'png-white':
        return '/images/logo_gb/PNG/Logo_white.png';
      case 'png-black':
        return '/images/logo_gb/PNG/Logo_black.png';
      default:
        // Par défaut, utiliser le logo noir avec texte
        return withText ? '/images/logo_gb/PNG/Logo+texte_black.png' : '/images/logo_gb/PNG/Logo_Black.png';
    }
  };

  // Déterminer la hauteur en fonction du mode (avec ou sans texte)
  const height = withText ? 'h-10' : 'h-12';
  
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={getLogoPath()} 
        alt="Generation Business" 
        className={`${height} w-auto object-contain`} 
      />
    </div>
  );
};
