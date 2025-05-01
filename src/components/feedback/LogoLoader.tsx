import React from 'react';

interface LogoLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Composant LogoLoader qui affiche le logo Newbi avec une animation de chargement
 */
export const LogoLoader: React.FC<LogoLoaderProps> = ({
  size = 'md',
  className = '',
}) => {
  // Déterminer la taille en fonction de la prop size
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img 
        src="/images/logo_newbi/SVG/Logo_NI_Purple.svg" 
        alt="Newbi Logo" 
        className={`${sizeClasses[size]} animate-pulse`}
      />
      <div className="mt-4 text-violet-600 font-medium">Chargement...</div>
    </div>
  );
};
