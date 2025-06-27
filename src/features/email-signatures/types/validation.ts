import { EmailSignature } from './index';

/**
 * Types d'erreurs de validation pour le formulaire de signature email
 */
export interface EmailSignatureValidationErrors {
  // Erreurs générales
  submit?: string;
  
  // Erreurs des champs de base
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  website?: string;
  address?: string;
  
  // Erreurs des informations de l'entreprise
  companyName?: string;
  companyWebsite?: string;
  companyAddress?: string;
  
  // Erreurs des médias
  logoUrl?: string;
  profilePhotoUrl?: string;
  
  // Erreurs des réseaux sociaux
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
  
  // Erreurs de style et de mise en page
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  fontSize?: string;
  textStyle?: string;
  layout?: string;
  textAlignment?: string;
  verticalSpacing?: string;
  horizontalSpacing?: string;
  iconTextSpacing?: string;
  
  // Autres erreurs
  [key: string]: any;
}

/**
 * Fonction utilitaire pour valider une adresse email
 */
export const validateEmail = (email: string): string | undefined => {
  if (!email) return 'L\'adresse email est requise';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Veuillez entrer une adresse email valide';
  return undefined;
};

/**
 * Fonction utilitaire pour valider une URL
 */
export const validateUrl = (url: string, fieldName: string = 'URL'): string | undefined => {
  if (!url) return undefined; // URL optionnelle si vide
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return undefined;
  } catch (e) {
    return `L'${fieldName} n'est pas une URL valide`;
  }
};

/**
 * Fonction utilitaire pour valider un numéro de téléphone
 */
export const validatePhoneNumber = (phone: string, isRequired: boolean = false): string | undefined => {
  if (!phone) {
    return isRequired ? 'Le numéro de téléphone est requis' : undefined;
  }
  
  // Supprime les espaces, les tirets et les points
  const cleaned = phone.replace(/[\s\-\.]/g, '');
  
  // Vérifie que le numéro contient uniquement des chiffres et des caractères autorisés
  if (!/^[0-9+\s\-\(\)\.]+$/.test(phone)) {
    return 'Le numéro de téléphone contient des caractères non autorisés';
  }
  
  // Vérifie la longueur minimale (au moins 8 chiffres pour un numéro valide)
  const digitCount = cleaned.replace(/\D/g, '').length;
  if (digitCount < 8) {
    return 'Le numéro de téléphone est trop court';
  }
  
  return undefined;
};

/**
 * Fonction utilitaire pour valider un champ requis
 */
export const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value || value.trim() === '') {
    return `${fieldName} est requis`;
  }
  return undefined;
};

/**
 * Fonction utilitaire pour valider une valeur numérique
 */
export const validateNumber = (value: string | number, fieldName: string, options: { min?: number; max?: number } = {}): string | undefined => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return `${fieldName} doit être un nombre valide`;
  }
  
  if (options.min !== undefined && numValue < options.min) {
    return `${fieldName} doit être supérieur ou égal à ${options.min}`;
  }
  
  if (options.max !== undefined && numValue > options.max) {
    return `${fieldName} doit être inférieur ou égal à ${options.max}`;
  }
  
  return undefined;
};

/**
 * Fonction utilitaire pour valider une couleur
 */
export const validateColor = (color: string): string | undefined => {
  if (!color) return 'La couleur est requise';
  
  // Vérifie les formats de couleur hexadécimaux (#RGB, #RRGGBB, #RRGGBBAA)
  const hexColorRegex = /^#([A-Fa-f0-9]{3,4}){1,2}$/;
  
  // Vérifie les formats de couleur RGB/RGBA
  const rgbColorRegex = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*[01]?\d?\.?\d*\s*)?\)$/;
  
  // Vérifie les noms de couleur CSS
  const style = new Option().style;
  style.color = color;
  
  if (style.color !== '' || hexColorRegex.test(color) || rgbColorRegex.test(color)) {
    return undefined;
  }
  
  return 'Veuillez entrer une couleur valide (nom, hexadécimal, RGB ou RGBA)';
};

/**
 * Fonction de validation complète d'une signature email
 */
export const validateEmailSignature = (signature: Partial<EmailSignature>): EmailSignatureValidationErrors => {
  const errors: EmailSignatureValidationErrors = {};
  
  // Validation des champs requis
  if (validateRequired(signature.name || '', 'Le nom de la signature')) {
    errors.name = validateRequired(signature.name || '', 'Le nom de la signature');
  }
  
  if (validateRequired(signature.fullName || '', 'Le nom complet')) {
    errors.fullName = validateRequired(signature.fullName || '', 'Le nom complet');
  }
  
  const emailError = validateEmail(signature.email || '');
  if (emailError) {
    errors.email = emailError;
  }
  
  // Validation des URLs
  if (signature.website) {
    const websiteError = validateUrl(signature.website, 'le site web');
    if (websiteError) {
      errors.website = websiteError;
    }
  }
  
  if (signature.companyWebsite) {
    const companyWebsiteError = validateUrl(signature.companyWebsite, 'le site web de l\'entreprise');
    if (companyWebsiteError) {
      errors.companyWebsite = companyWebsiteError;
    }
  }
  
  // Validation des numéros de téléphone
  if (signature.phone) {
    const phoneError = validatePhoneNumber(signature.phone);
    if (phoneError) {
      errors.phone = phoneError;
    }
  }
  
  if (signature.mobilePhone) {
    const mobilePhoneError = validatePhoneNumber(signature.mobilePhone);
    if (mobilePhoneError) {
      errors.mobilePhone = mobilePhoneError;
    }
  }
  
  // Validation des couleurs
  if (signature.primaryColor) {
    const primaryColorError = validateColor(signature.primaryColor);
    if (primaryColorError) {
      errors.primaryColor = primaryColorError;
    }
  }
  
  if (signature.secondaryColor) {
    const secondaryColorError = validateColor(signature.secondaryColor);
    if (secondaryColorError) {
      errors.secondaryColor = secondaryColorError;
    }
  }
  
  // Validation des tailles
  if (signature.fontSize) {
    const fontSizeError = validateNumber(signature.fontSize, 'La taille de police', { min: 8, max: 72 });
    if (fontSizeError) {
      errors.fontSize = fontSizeError;
    }
  }
  
  if (signature.verticalSpacing) {
    const spacingError = validateNumber(signature.verticalSpacing, 'L\'espacement vertical', { min: 0, max: 50 });
    if (spacingError) {
      errors.verticalSpacing = spacingError;
    }
  }
  
  if (signature.horizontalSpacing) {
    const spacingError = validateNumber(signature.horizontalSpacing, 'L\'espacement horizontal', { min: 0, max: 50 });
    if (spacingError) {
      errors.horizontalSpacing = spacingError;
    }
  }
  
  if (signature.iconTextSpacing) {
    const spacingError = validateNumber(signature.iconTextSpacing, 'L\'espacement entre les icônes et le texte', { min: 0, max: 50 });
    if (spacingError) {
      errors.iconTextSpacing = spacingError;
    }
  }
  
  return errors;
};

/**
 * Fonction utilitaire pour vérifier si un objet d'erreurs est vide
 */
export const hasValidationErrors = (errors: EmailSignatureValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * Fonction utilitaire pour obtenir le message d'erreur d'un champ spécifique
 */
export const getFieldError = (
  errors: EmailSignatureValidationErrors,
  fieldName: string,
  nestedField?: string
): string | undefined => {
  if (nestedField && errors[fieldName] && typeof errors[fieldName] === 'object') {
    return (errors[fieldName] as any)[nestedField];
  }
  return errors[fieldName] as string | undefined;
};
