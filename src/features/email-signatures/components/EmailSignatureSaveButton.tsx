import React from 'react';
import { useEmailSignatureSave } from '../hooks/useEmailSignatureSave';
import { EmailSignature } from '../types';

interface EmailSignatureSaveButtonProps {
  signature: Partial<EmailSignature>;
  onSuccess?: () => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Bouton pour enregistrer une signature de mail
 */
export const EmailSignatureSaveButton: React.FC<EmailSignatureSaveButtonProps> = ({
  signature,
  onSuccess,
  className = '',
  children
}) => {
  const { saveEmailSignature, isSubmitting } = useEmailSignatureSave();

  const handleSave = async () => {
    await saveEmailSignature(signature, onSuccess);
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSubmitting}
      className={`px-4 py-2 bg-[#5b50ff] hover:bg-[#4a41e0] text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isSubmitting ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Enregistrement...
        </div>
      ) : children || 'Enregistrer la signature'}
    </button>
  );
};
