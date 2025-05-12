import React from 'react';
import { Button } from '../../../../../components/';

interface QuoteActionButtonsProps {
  onSaveAsDraft: () => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

export const QuoteActionButtons: React.FC<QuoteActionButtonsProps> = ({
  onSaveAsDraft,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing,
}) => {
  return (
    <div className="flex justify-between my-2">
      {onCancel && (
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-gray-500 hover:text-gray-700"
        >
          Annuler
        </Button>
      )}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={onSaveAsDraft}
          disabled={isSubmitting}
        >
          Brouillon
        </Button>
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isEditing ? "Mettre à jour" : "Créer le devis"}
        </Button>
      </div>
    </div>
  );
};