import React, { ReactNode } from 'react';
import { Button } from '..';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Composant pour afficher un état vide avec une icône, un titre, une description et une action optionnelle
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl shadow-sm">
      {icon && (
        <div className="flex items-center justify-center w-16 h-16 mb-4 text-violet-500 bg-violet-50 rounded-full">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mb-6 text-sm text-gray-500 max-w-md">{description}</p>
      
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
