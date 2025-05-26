import { useState } from 'react';
import { SignatureData } from '../types';
import { EmailSignature } from '../components/EmailSignaturesTable';
import {
  EMAIL_PATTERN,
  EMAIL_ERROR_MESSAGE,
  NAME_REGEX,
  REQUIRED_FIELD_MESSAGE
} from '../../../constants/formValidations';

/**
 * Type pour les erreurs de validation de signature
 */
export interface SignatureValidationErrors {
  name?: string;
  fullName?: string;
  email?: string;
  jobTitle?: string;
  companyName?: string;
  phone?: string;
  mobilePhone?: string;
  companyWebsite?: string;
  general?: string;
}

/**
 * Hook pour valider les données d'une signature de mail
 */
export const useSignatureValidation = () => {
  const [errors, setErrors] = useState<SignatureValidationErrors>({});
  
  // Fonction pour vérifier si un nom de signature existe déjà
  const checkSignatureNameExists = (name: string, existingSignatures: EmailSignature[] = [], currentSignatureId?: string): boolean => {
    if (!existingSignatures || existingSignatures.length === 0) return false;
    
    return existingSignatures.some(signature => 
      signature.name.toLowerCase() === name.toLowerCase() && 
      signature.id !== currentSignatureId
    );
  };

  /**
   * Valide les données d'une signature de mail
   * @param data Les données à valider
   * @param existingSignatures Liste des signatures existantes pour vérifier les doublons
   * @param currentSignatureId ID de la signature en cours d'édition (pour éviter de la comparer avec elle-même)
   * @returns true si les données sont valides, false sinon
   */
  const validateSignature = (data: SignatureData, existingSignatures: EmailSignature[] = [], currentSignatureId?: string): boolean => {
    const newErrors: SignatureValidationErrors = {};
    let isValid = true;

    // Validation du nom de la signature
    if (!data.name || data.name.trim() === '') {
      newErrors.name = REQUIRED_FIELD_MESSAGE;
      isValid = false;
    } else if (!NAME_REGEX.test(data.name)) {
      newErrors.name = 'Le nom de la signature contient des caractères non autorisés';
      isValid = false;
    } else if (data.name.length > 50) {
      newErrors.name = 'Le nom de la signature ne doit pas dépasser 50 caractères';
      isValid = false;
    } else if (checkSignatureNameExists(data.name, existingSignatures, currentSignatureId)) {
      newErrors.name = 'Ce nom de signature existe déjà';
      isValid = false;
    }

    // Validation du nom complet
    if (!data.fullName || data.fullName.trim() === '') {
      newErrors.fullName = REQUIRED_FIELD_MESSAGE;
      isValid = false;
    } else if (!NAME_REGEX.test(data.fullName)) {
      newErrors.fullName = 'Le nom complet contient des caractères non autorisés';
      isValid = false;
    } else if (data.fullName.length > 50) {
      newErrors.fullName = 'Le nom complet ne doit pas dépasser 50 caractères';
      isValid = false;
    }

    // Validation de l'email
    if (!data.email || data.email.trim() === '') {
      newErrors.email = REQUIRED_FIELD_MESSAGE;
      isValid = false;
    } else if (!EMAIL_PATTERN.test(data.email)) {
      newErrors.email = EMAIL_ERROR_MESSAGE;
      isValid = false;
    }
    
    // Validation du poste/fonction
    if (!data.jobTitle || data.jobTitle.trim() === '') {
      newErrors.jobTitle = REQUIRED_FIELD_MESSAGE;
      isValid = false;
    } else if (!NAME_REGEX.test(data.jobTitle)) {
      newErrors.jobTitle = 'Le poste ou la fonction contient des caractères non autorisés';
      isValid = false;
    } else if (data.jobTitle.length > 50) {
      newErrors.jobTitle = 'Le poste ou la fonction ne doit pas dépasser 50 caractères';
      isValid = false;
    }

    // Validation du nom de l'entreprise
    if (!data.companyName || data.companyName.trim() === '') {
      newErrors.companyName = REQUIRED_FIELD_MESSAGE;
      isValid = false;
    } else if (!NAME_REGEX.test(data.companyName)) {
      newErrors.companyName = 'Le nom de l\'entreprise contient des caractères non autorisés';
      isValid = false;
    } else if (data.companyName.length > 50) {
      newErrors.companyName = 'Le nom de l\'entreprise ne doit pas dépasser 50 caractères';
      isValid = false;
    }
    
    // Validation du numéro de téléphone (si renseigné)
    if (data.phone && data.phone.trim() !== '') {
      const phonePattern = /^(\+33|0)[1-9](\d{2}){4}$/;
      if (!phonePattern.test(data.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Le numéro de téléphone n\'est pas valide';
        isValid = false;
      }
    }
    
    // Validation du numéro de mobile (si renseigné)
    if (data.mobilePhone && data.mobilePhone.trim() !== '') {
      const mobilePattern = /^(\+33|0)[67](\d{2}){4}$/;
      if (!mobilePattern.test(data.mobilePhone.replace(/\s/g, ''))) {
        newErrors.mobilePhone = 'Le numéro de mobile n\'est pas valide';
        isValid = false;
      }
    }
    
    // Validation du site web de l'entreprise (si renseigné)
    if (data.companyWebsite && data.companyWebsite.trim() !== '') {
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
      if (!urlPattern.test(data.companyWebsite)) {
        newErrors.companyWebsite = 'L\'URL du site web n\'est pas valide';
        isValid = false;
      }
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
