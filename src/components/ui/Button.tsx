import React from 'react';
import { ButtonProps } from '../../types/ui';

/**
 * Composant Button réutilisable
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loaderPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  // Classes de base pour tous les boutons
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium focus:outline-none';
  
  // Classes spécifiques à la variante
  const variantClasses = {
    primary: 'border border-transparent bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'border border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100',
    danger: 'border border-transparent bg-red-600 text-white hover:bg-red-700',
  };
  
  // Classes spécifiques à la taille
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-3 px-6 text-sm font-medium',
    lg: 'py-3 px-8 text-base',
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

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && loaderPosition === 'left' && <Loader />}
      {children}
      {isLoading && loaderPosition === 'right' && <Loader />}
    </button>
  );
};
