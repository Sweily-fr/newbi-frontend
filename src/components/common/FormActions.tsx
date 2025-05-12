import React from 'react';
import { Button } from './Button';
import { FormActionsProps } from '../../types/ui';

/**
 * Composant pour les actions de formulaire (boutons Annuler/Enregistrer)
 */
export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  cancelText = 'Annuler',
  submitText = 'Enregistrer',
  isSubmitting = false,
  className = '',
  align = 'right',
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`flex space-x-4 mt-4 ${alignmentClasses[align]} ${className}`}>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          {cancelText}
        </Button>
      )}
      <Button
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
      >
        {submitText}
      </Button>
    </div>
  );
};

export default FormActions;
