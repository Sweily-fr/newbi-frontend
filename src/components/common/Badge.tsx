import React from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

// Fonction pour obtenir les classes Tailwind en fonction de la variante
const getVariantClasses = (variant: BadgeVariant): string => {
  switch (variant) {
    case 'primary':
      return 'bg-[#5b50ff] text-white';
    case 'secondary':
      return 'bg-[#f0eeff] text-[#5b50ff]';
    case 'success':
      return 'bg-emerald-500 text-white';
    case 'error':
      return 'bg-red-500 text-white';
    case 'warning':
      return 'bg-amber-500 text-white';
    case 'info':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'primary', 
  children, 
  className = '' 
}) => {
  const variantClasses = getVariantClasses(variant);
  
  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium leading-none rounded-md whitespace-nowrap ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
