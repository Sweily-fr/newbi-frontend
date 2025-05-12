import React from "react";
import { Button } from "../../../";

interface InvoiceActionButtonsProps {
  onValidateForm: (asDraft: boolean) => void;
  isSubmitting: boolean;
  isEditMode: boolean;
  onClose: () => void;
}

export const InvoiceActionButtons: React.FC<InvoiceActionButtonsProps> = ({
  onValidateForm,
  isSubmitting,
  isEditMode,
  onClose,
}) => {
  return (
    <div className="flex justify-end space-x-4 mt-2">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
      >
        Annuler
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => onValidateForm(true)}
        disabled={isSubmitting}
      >
        Brouillon
      </Button>
      <Button
        type="button"
        variant="primary"
        onClick={() => onValidateForm(false)}
        disabled={isSubmitting}
      >
        {isEditMode ? 'Mettre à jour' : 'Créer'} la facture
      </Button>
    </div>
  );
};
