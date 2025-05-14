import { useState } from 'react';
import { SignatureData } from '../types';
import { EMAIL_PATTERN } from '../../../constants/formValidations';

/**
 * Type pour les erreurs de validation de signature
 */
export interface SignatureValidationErrors {
  name?: string;
  fullName?: string;
  email?: string;
  companyName?: string;
  general?: string;
}

/**
 * Hook pour valider les données d'une signature de mail
 */
export const useSignatureValidation = () => {
  const [errors, setErrors] = useState<SignatureValidationErrors>({});

  /**
   * Valide les données d'une signature de mail
   * @param data Les données à valider
   * @returns true si les données sont valides, false sinon
   */
  const validateSignature = (data: SignatureData): boolean => {
    const newErrors: SignatureValidationErrors = {};
    let isValid = true;

    // Validation du nom de la signature
    if (!data.name || data.name.trim() === '') {
      newErrors.name = 'Le nom de la signature est requis';
      isValid = false;
    } else if (data.name.length > 50) {
      newErrors.name = 'Le nom de la signature ne doit pas dépasser 50 caractères';
      isValid = false;
    }

    // Validation du nom complet
    if (!data.fullName || data.fullName.trim() === '') {
      newErrors.fullName = 'Le nom complet est requis';
      isValid = false;
    } else if (data.fullName.length > 100) {
      newErrors.fullName = 'Le nom complet ne doit pas dépasser 100 caractères';
      isValid = false;
    }

    // Validation de l'email
    if (!data.email || data.email.trim() === '') {
      newErrors.email = 'L\'adresse email est requise';
      isValid = false;
    } else if (!EMAIL_PATTERN.test(data.email)) {
      newErrors.email = 'L\'adresse email n\'est pas valide';
      isValid = false;
    }

    // Validation du nom de l'entreprise
    if (!data.companyName || data.companyName.trim() === '') {
      newErrors.companyName = 'Le nom de l\'entreprise est requis';
      isValid = false;
    } else if (data.companyName.length > 100) {
      newErrors.companyName = 'Le nom de l\'entreprise ne doit pas dépasser 100 caractères';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Réinitialise les erreurs de validation
   */
  const resetErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateSignature,
    resetErrors
  };
};
