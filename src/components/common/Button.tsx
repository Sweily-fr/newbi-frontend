import React from 'react';
import { ButtonProps } from '../../types/ui';

interface NewbiButtonProps extends ButtonProps {
  iconBg?: boolean; // Pour activer le cercle semi-transparent autour de l'icône
  withArrow?: boolean; // Pour ajouter une flèche à droite du texte
  icon?: React.ReactNode; // Icône à afficher
}

/**
 * Composant Button réutilisable avec le design Newbi
 */
export const Button: React.FC<NewbiButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loaderPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  type = 'button',
  iconBg = false,
  withArrow = false,
  icon,
  ...props
}) => {
  // Classes de base pour tous les boutons
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-light focus:outline-none transition-all duration-300 shadow-md transform hover:translate-y-[-2px]';
  
  // Classes spécifiques à la variante
  const variantClasses = {
    primary: 'bg-[#5b50ff] text-white hover:bg-[#4a41e0]',
    secondary: 'bg-[#f0eeff] text-[#5b50ff] hover:bg-[#e6e1ff]',
    outline: 'border border-[#5b50ff] border-opacity-30 bg-white text-[#5b50ff] hover:bg-[#f0eeff] hover:border-opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  
  // Classes spécifiques à la taille
  const sizeClasses = {
    sm: 'py-2 px-4 text-xs',
    md: 'py-3 px-8 text-[14px]',
    lg: 'py-4 px-10 text-[14px]',
  };
  
  // Classes pour la largeur
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Classes pour l'état désactivé ou chargement
  const stateClasses = (disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : '';
  
  // Combinaison de toutes les classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${stateClasses} ${className}`;
  
  // Composant loader
  const Loader = () => (
    <svg className={`animate-spin h-4 w-4 text-current ${loaderPosition === 'left' ? 'mr-2' : 'ml-2'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // Composant flèche pour les boutons d'action principale
  const Arrow = () => (
    <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && loaderPosition === 'left' && <Loader />}
      
      {/* Icône avec cercle semi-transparent si iconBg est true */}
      {icon && iconBg ? (
        <div className="bg-white bg-opacity-20 rounded-full p-1 mr-3">
          {icon}
        </div>
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      
      {children}
      
      {/* Flèche pour les boutons d'action principale */}
      {withArrow && !isLoading && <Arrow />}
      
      {isLoading && loaderPosition === 'right' && <Loader />}
    </button>
  );
};

export default Button;
