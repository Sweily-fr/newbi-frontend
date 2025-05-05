/**
 * Fichier centralisant toutes les validations et regex utilisées dans l'application frontend
 */

// Regex pour la validation du numéro de téléphone (format international ou français)
export const PHONE_REGEX = /^(\+\d{1,3}\s?\d{9,}|0[67]\d{8})$/;

// Regex pour la validation des noms et prénoms (lettres, espaces, tirets, apostrophes)
export const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{2,50}$/;

// Regex pour la validation d'email
export const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

// Regex pour la validation de SIRET (14 chiffres)
export const SIRET_REGEX = /^\d{14}$/;

// Regex pour la validation de numéro de TVA (format FR)
export const VAT_FR_REGEX = /^FR\d{2}\d{9}$/;

// Regex pour la validation d'URL
export const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

// Format français: FR + 2 chiffres + 23 caractères (5 banque + 5 guichet + 11 compte + 2 clé RIB)
export const IBAN_REGEX = /^FR[0-9]{2}[0-9]{5}[0-9]{5}[A-Z0-9]{11}[0-9]{2}$/;

// Regex pour la validation de BIC/SWIFT (8 ou 11 caractères)
export const BIC_REGEX = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

// Regex pour la validation du capital social (montant avec ou sans décimales)
export const CAPITAL_SOCIAL_REGEX = /^\d{1,20}(\.\d{1,2})?$/;

// Regex pour la validation du RCS (Registre du Commerce et des Sociétés)
// Format: Accepte les formats courants comme "981 576 549 R.C.S. Paris" ou "Paris B 123 456 789"
export const RCS_REGEX = /^(\d{3}\s?\d{3}\s?\d{3}\s?R\.?C\.?S\.?\s[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,30}|[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,30}\s[A-Z]?\s?\d{3}\s?\d{3}\s?\d{3})$/;

// Regex pour la validation des codes postaux français (5 chiffres)
export const POSTAL_CODE_FR_REGEX = /^(0[1-9]|[1-8]\d|9[0-8])\d{3}$/;

/**
 * Règles de validation pour les champs de type nom/prénom
 */
export const getNameValidationRules = (fieldName: string = 'Ce champ') => ({
  pattern: {
    value: NAME_REGEX,
    message: `${fieldName} ne doit contenir que des lettres, espaces, tirets ou apostrophes (2-50 caractères)`
  }
});

/**
 * Règles de validation pour les champs de type téléphone
 */
export const getPhoneValidationRules = (fieldName: string = 'Le numéro de téléphone') => ({
  pattern: {
    value: PHONE_REGEX,
    message: `${fieldName} doit être au format international (+33612345678) ou français (0612345678)`
  }
});

/**
 * Règles de validation pour les champs de type email
 */
export const getEmailValidationRules = (fieldName: string = 'L\'email') => ({
  pattern: {
    value: EMAIL_REGEX,
    message: `${fieldName} doit être une adresse email valide`
  }
});

/**
 * Règles de validation pour les champs de type SIRET
 */
export const getSiretValidationRules = (fieldName: string = 'Le numéro SIRET') => ({
  pattern: {
    value: SIRET_REGEX,
    message: `${fieldName} doit contenir exactement 14 chiffres`
  }
});

/**
 * Règles de validation pour les champs de type TVA
 */
export const getVatValidationRules = (fieldName: string = 'Le numéro de TVA') => ({
  pattern: {
    value: VAT_FR_REGEX,
    message: `${fieldName} doit être au format FR suivi de 11 chiffres`
  }
});

/**
 * Règles de validation pour les champs de type URL
 */
export const getUrlValidationRules = (fieldName: string = 'L\'URL') => ({
  pattern: {
    value: URL_REGEX,
    message: `${fieldName} doit être une URL valide`
  }
});

/**
 * Règles de validation pour les champs de type IBAN
 */
export const getIbanValidationRules = (fieldName: string = 'L\'IBAN') => ({
  pattern: {
    value: IBAN_REGEX,
    message: `${fieldName} doit être au format international valide (ex: FR76...)`
  }
});

/**
 * Règles de validation pour les champs de type BIC/SWIFT
 */
export const getBicValidationRules = (fieldName: string = 'Le BIC/SWIFT') => ({
  pattern: {
    value: BIC_REGEX,
    message: `${fieldName} doit être au format valide (8 ou 11 caractères)`
  }
});

/**
 * Règles de validation pour le capital social
 */
export const getCapitalSocialValidationRules = (fieldName: string = 'Le capital social') => ({
  pattern: {
    value: CAPITAL_SOCIAL_REGEX,
    message: `${fieldName} doit être un montant valide (ex: 10000 ou 10000.50)`
  }
});

/**
 * Règles de validation pour le RCS
 */
export const getRCSValidationRules = (fieldName: string = 'Le RCS') => ({
  pattern: {
    value: RCS_REGEX,
    message: `${fieldName} doit être au format "Ville B 123 456 789"`
  }
});

/**
 * Règles de validation pour les codes postaux français
 */
export const getPostalCodeFRValidationRules = (fieldName: string = 'Le code postal') => ({
  pattern: {
    value: POSTAL_CODE_FR_REGEX,
    message: `${fieldName} doit être un code postal français valide (5 chiffres)`
  }
});

/**
 * Vérifie si un code postal français est valide
 */
export const isValidPostalCodeFR = (postalCode: string): boolean => {
  return POSTAL_CODE_FR_REGEX.test(postalCode);
};
