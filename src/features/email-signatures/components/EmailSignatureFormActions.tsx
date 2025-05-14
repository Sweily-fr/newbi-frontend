import React from 'react';
import { EmailSignature } from '../types';
import { EmailSignatureSaveButton } from './EmailSignatureSaveButton';
import { useNavigate } from 'react-router-dom';

interface EmailSignatureFormActionsProps {
  signature: Partial<EmailSignature>;
  onCancel?: () => void;
  onSuccess?: () => void;
  showCancelButton?: boolean;
}

/**
 * Composant pour les actions du formulaire de signature (enregistrer, annuler)
 */
export const EmailSignatureFormActions: React.FC<EmailSignatureFormActionsProps> = ({
  signature,
  onCancel,
  onSuccess,
  showCancelButton = true
}) => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Rediriger vers la liste des signatures après l'enregistrement
    if (onSuccess) {
      onSuccess();
    } else {
      // Redirection par défaut vers la liste des signatures
      navigate('/email-signatures');
    }
  };

  return (
    <div className="flex justify-end space-x-3 mt-6">
      {showCancelButton && (
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          Annuler
        </button>
      )}
      
      <EmailSignatureSaveButton
        signature={signature}
        onSuccess={handleSuccess}
      >
        {signature.id ? 'Mettre à jour' : 'Enregistrer'}
      </EmailSignatureSaveButton>
    </div>
  );
};
