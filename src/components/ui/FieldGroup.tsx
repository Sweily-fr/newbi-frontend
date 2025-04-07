import React from 'react';
import { FieldGroupProps } from '../../types/ui';

/**
 * Composant pour regrouper des champs connexes dans un formulaire
 */
export const FieldGroup: React.FC<FieldGroupProps> = ({
  title,
  children,
  className = '',
  spacing = 'normal',
}) => {
  const spacingClasses = {
    tight: 'space-y-3',
    normal: 'space-y-4',
    loose: 'space-y-6',
  };

  return (
    <div className={`${className}`}>
      {title && (
        <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      )}
      <div className={spacingClasses[spacing]}>
        {children}
      </div>
    </div>
  );
};
