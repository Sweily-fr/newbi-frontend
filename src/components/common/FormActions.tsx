import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
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
    <div className={cn('flex gap-4 mt-6', alignmentClasses[align], className)}>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="min-w-[120px]"
        >
          {cancelText}
        </Button>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="min-w-[200px] transition-colors"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {submitText}
          </>
        ) : (
          submitText
        )}
      </Button>
    </div>
  );
};

export default FormActions;
