import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonProps } from '../../types/ui';

interface ButtonLinkProps extends Omit<ButtonProps, 'type'> {
  to: string;
  icon?: React.ReactNode;
}

/**
 * Composant ButtonLink qui combine le style du Button avec la fonctionnalité du Link de React Router
 */
export const ButtonLink: React.FC<ButtonLinkProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  to,
  icon,
  ...props
}) => {
  // Classes de base pour tous les boutons
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium focus:outline-none transition-all duration-200';
  
  // Classes spécifiques à la variante
  const variantClasses = {
    primary: 'border border-transparent bg-blue-500 text-white hover:bg-blue-600 shadow-md transform hover:translate-y-[-2px]',
    secondary: 'border border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-sm transform hover:translate-y-[-2px]',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 shadow-sm transform hover:translate-y-[-2px]',
    danger: 'border border-transparent bg-red-600 text-white hover:bg-red-700 shadow-md transform hover:translate-y-[-2px]',
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
  
  if (disabled || isLoading) {
    return (
      <span className={buttonClasses}>
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    );
  }
  
  return (
    <Link
      to={to}
      className={buttonClasses}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  );
};
