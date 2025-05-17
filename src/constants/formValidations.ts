import { RegisterOptions } from 'react-hook-form';

// Patterns de validation
export const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const SIRET_PATTERN = /^[0-9]{14}$/;
export const VAT_PATTERN = /^FR[0-9]{11}$/;
// Regex pour la validation des noms et prénoms (lettres, chiffres, espaces, tirets, apostrophes)
// Exclut explicitement les caractères < et > pour prévenir les risques d'injection XSS
export const NAME_REGEX = /^(?!.*[<>])[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-'.(),&]{2,50}$/;
export const STREET_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s,'\-\.]{3,100}$/;
export const CITY_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-\.]{2,50}$/;
export const POSTAL_CODE_PATTERN = /^(0[1-9]|[1-8]\d|9[0-8])\d{3}$/;
export const COUNTRY_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-\.]{2,50}$/;
export const CUSTOM_FIELD_NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{2,50}$/;
export const CUSTOM_FIELD_VALUE_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\.,;:!?@#$%&*()\[\]\-_+='"/\\€£¥₽¢₩₴₦₱₸₺₼₾₿]{1,500}$/;;

export const ITEM_DESCRIPTION_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\.,;:!?@#$%&*()\[\]\-_+='"/\\]{1,200}$/;
export const UNIT_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\.\/\-²³]{1,20}$/;
// Messages d'erreur
export const EMAIL_ERROR_MESSAGE = 'Adresse email invalide';
export const SIRET_ERROR_MESSAGE = 'Le SIRET doit contenir 14 chiffres';
export const VAT_ERROR_MESSAGE = 'Le numéro de TVA doit être au format FR suivi de 11 chiffres';
export const STREET_ERROR_MESSAGE = 'L\'adresse doit contenir entre 3 et 100 caractères';
export const CITY_ERROR_MESSAGE = 'La ville doit contenir entre 2 et 50 caractères';
export const POSTAL_CODE_ERROR_MESSAGE = 'Le code postal doit être un code postal français valide (5 chiffres)';
export const COUNTRY_ERROR_MESSAGE = 'Le pays doit contenir entre 2 et 50 caractères';
export const REQUIRED_FIELD_MESSAGE = 'Ce champ est requis';
export const CUSTOM_FIELD_NAME_ERROR_MESSAGE = 'Le nom du champ doit contenir entre 2 et 50 caractères (lettres, espaces, tirets ou apostrophes)';
export const CUSTOM_FIELD_VALUE_ERROR_MESSAGE = 'La valeur contient des caractères non autorisés ou dépasse 500 caractères';
export const DISCOUNT_PERCENTAGE_ERROR_MESSAGE = 'Le pourcentage de remise doit être compris entre 0 et 100';
export const DISCOUNT_FIXED_ERROR_MESSAGE = 'Le montant de la remise doit être un nombre positif ou nul';
export const INVOICE_PREFIX_ERROR_MESSAGE = 'Le préfixe de facture doit contenir entre 1 et 10 caractères (lettres, chiffres, tirets ou underscores)';
export const INVOICE_NUMBER_ERROR_MESSAGE = 'Le numéro de facture doit contenir entre 1 et 20 caractères (lettres, chiffres, tirets ou underscores)';
export const PURCHASE_ORDER_ERROR_MESSAGE = 'Le numéro de commande ne doit pas dépasser 50 caractères (lettres, chiffres, tirets ou underscores)';
export const HEADER_NOTES_ERROR_MESSAGE = 'Les notes d\'entête ne doivent pas dépasser 1000 caractères et contenir uniquement des caractères valides';
export const FOOTER_NOTES_ERROR_MESSAGE = 'Les notes de pied ne doivent pas dépasser 2000 caractères et contenir uniquement des caractères valides';
export const ITEM_DESCRIPTION_ERROR_MESSAGE = 'La description de l\'article doit contenir entre 1 et 200 caractères';
export const ITEM_QUANTITY_ERROR_MESSAGE = 'La quantité doit être un nombre positif ou nul';
export const ITEM_UNIT_PRICE_ERROR_MESSAGE = 'Le prix unitaire doit être un nombre strictement positif';
export const ITEM_VAT_RATE_ERROR_MESSAGE = 'Le taux de TVA doit être un pourcentage valide (entre 0 et 100)';
export const ITEM_VAT_EXEMPTION_REQUIRED_ERROR_MESSAGE = 'Une mention d\'exemption de TVA est requise lorsque le taux de TVA est à 0%';
export const ITEM_UNIT_ERROR_MESSAGE = 'L\'unité doit contenir entre 1 et 20 caractères';
export const ITEM_DISCOUNT_ERROR_MESSAGE = 'La remise doit être un nombre positif ou nul';

// Messages d'erreur pour les dates
export const ISSUE_DATE_REQUIRED_ERROR_MESSAGE = 'La date d\'émission est requise';
export const DUE_DATE_REQUIRED_ERROR_MESSAGE = 'La date d\'échéance est requise';
export const DUE_DATE_AFTER_ISSUE_DATE_ERROR_MESSAGE = 'La date d\'échéance doit être postérieure ou égale à la date d\'émission';
export const EXECUTION_DATE_AFTER_ISSUE_DATE_ERROR_MESSAGE = 'La date d\'exécution doit être postérieure ou égale à la date d\'émission';

// Fonctions utilitaires pour générer les règles de validation
export const getEmailValidationRules = (required = true): RegisterOptions => ({
  required: required ? REQUIRED_FIELD_MESSAGE : false,
  pattern: {
    value: EMAIL_PATTERN,
    message: EMAIL_ERROR_MESSAGE
  }
});

export const getSiretValidationRules = (required = false): RegisterOptions => ({
  required: required ? REQUIRED_FIELD_MESSAGE : false,
  pattern: {
    value: SIRET_PATTERN,
    message: SIRET_ERROR_MESSAGE
  }
});

export const getVatValidationRules = (required = false): RegisterOptions => ({
  required: required ? REQUIRED_FIELD_MESSAGE : false,
  pattern: {
    value: VAT_PATTERN,
    message: VAT_ERROR_MESSAGE
  }
});

export const getClientValidationRules = (isNewClient: boolean) => ({
  name: {
    required: isNewClient ? REQUIRED_FIELD_MESSAGE : false,
    pattern: {
      value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{2,50}$/,
      message: 'Le nom doit contenir entre 2 et 50 caractères'
    }
  },
  email: getEmailValidationRules(isNewClient),
  address: {
    street: {
      required: isNewClient ? REQUIRED_FIELD_MESSAGE : false,
      pattern: {
        value: STREET_PATTERN,
        message: STREET_ERROR_MESSAGE
      }
    },
    city: {
      required: isNewClient ? REQUIRED_FIELD_MESSAGE : false,
      pattern: {
        value: CITY_PATTERN,
        message: CITY_ERROR_MESSAGE
      }
    },
    postalCode: {
      required: isNewClient ? REQUIRED_FIELD_MESSAGE : false,
      pattern: {
        value: POSTAL_CODE_PATTERN,
        message: POSTAL_CODE_ERROR_MESSAGE
      }
    },
    country: {
      required: isNewClient ? REQUIRED_FIELD_MESSAGE : false,
      pattern: {
        value: COUNTRY_PATTERN,
        message: COUNTRY_ERROR_MESSAGE
      }
    }
  },
  siret: getSiretValidationRules(false),
  vatNumber: getVatValidationRules(false)
});

// Règles de validation pour les champs de facture
export const getInvoiceValidationRules = () => ({
  invoiceNumber: {
    required: REQUIRED_FIELD_MESSAGE
  },
  issueDate: {
    required: REQUIRED_FIELD_MESSAGE
  },
  dueDate: {
    required: REQUIRED_FIELD_MESSAGE
  },
  items: {
    description: {
      required: REQUIRED_FIELD_MESSAGE
    },
    quantity: {
      required: REQUIRED_FIELD_MESSAGE,
      min: {
        value: 0.01,
        message: 'La quantité doit être supérieure à 0'
      }
    },
    unitPrice: {
      required: REQUIRED_FIELD_MESSAGE,
      min: {
        value: 0,
        message: 'Le prix unitaire doit être positif ou nul'
      }
    },
    vatRate: {
      required: REQUIRED_FIELD_MESSAGE,
      min: {
        value: 0,
        message: 'Le taux de TVA doit être positif ou nul'
      },
      max: {
        value: 100,
        message: 'Le taux de TVA ne peut pas dépasser 100%'
      }
    }
  }
});

// Règles de validation pour les champs personnalisés
export const getCustomFieldValidationRules = (): { key: RegisterOptions, value: RegisterOptions } => ({
  key: {
    pattern: {
      value: CUSTOM_FIELD_NAME_PATTERN,
      message: CUSTOM_FIELD_NAME_ERROR_MESSAGE
    }
  },
  value: {
    pattern: {
      value: CUSTOM_FIELD_VALUE_PATTERN,
      message: CUSTOM_FIELD_VALUE_ERROR_MESSAGE
    }
  }
});

// Règles de validation pour les remises
export const getDiscountValidationRules = (discountType: 'PERCENTAGE' | 'FIXED'): RegisterOptions => ({
  required: false,
  min: {
    value: 0,
    message: discountType === 'PERCENTAGE' ? DISCOUNT_PERCENTAGE_ERROR_MESSAGE : DISCOUNT_FIXED_ERROR_MESSAGE
  },
  ...(discountType === 'PERCENTAGE' ? {
    max: {
      value: 100,
      message: DISCOUNT_PERCENTAGE_ERROR_MESSAGE
    }
  } : {})
});

// Patterns pour les champs de facture
export const INVOICE_PREFIX_PATTERN = /^[A-Za-z0-9\-_]{1,10}$/;
export const INVOICE_NUMBER_PATTERN = /^[A-Za-z0-9\-_]{1,20}$/;
export const PURCHASE_ORDER_PATTERN = /^[A-Za-z0-9\-_]{0,50}$/;

// Pattern pour les notes
export const NOTES_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\.,;:!?@#$%&*()\[\]\-_+='"\\]{0,1000}$/;
export const FOOTER_NOTES_PATTERN = /^[\p{L}\p{N}\p{P}\p{S}\p{Z}\t]{0,2000}$/u;

// Règles de validation pour les préfixes de facture
export const getInvoicePrefixValidationRules = (required = true): RegisterOptions => ({
  required: required ? REQUIRED_FIELD_MESSAGE : false,
  pattern: {
    value: INVOICE_PREFIX_PATTERN,
    message: INVOICE_PREFIX_ERROR_MESSAGE
  },
  maxLength: {
    value: 10,
    message: INVOICE_PREFIX_ERROR_MESSAGE
  }
});

// Règles de validation pour les numéros de facture
export const getInvoiceNumberValidationRules = (required = true): RegisterOptions => ({
  required: required ? REQUIRED_FIELD_MESSAGE : false,
  pattern: {
    value: INVOICE_NUMBER_PATTERN,
    message: INVOICE_NUMBER_ERROR_MESSAGE
  },
  maxLength: {
    value: 20,
    message: INVOICE_NUMBER_ERROR_MESSAGE
  }
});

// Règles de validation pour les numéros de commande
export const getPurchaseOrderValidationRules = (required = false): RegisterOptions => ({
  required: required ? REQUIRED_FIELD_MESSAGE : false,
  pattern: {
    value: PURCHASE_ORDER_PATTERN,
    message: PURCHASE_ORDER_ERROR_MESSAGE
  },
  maxLength: {
    value: 50,
    message: PURCHASE_ORDER_ERROR_MESSAGE
  }
});

// Règles de validation pour les notes d'entête
export const getHeaderNotesValidationRules = (required = false): RegisterOptions => ({
  required: required ? REQUIRED_FIELD_MESSAGE : false,
  pattern: {
    value: NOTES_PATTERN,
    message: HEADER_NOTES_ERROR_MESSAGE
  },
  maxLength: {
    value: 1000,
    message: HEADER_NOTES_ERROR_MESSAGE
  }
});

// Règles de validation pour les notes de pied
export const getFooterNotesValidationRules = (required = false): RegisterOptions => ({
  required: required ? REQUIRED_FIELD_MESSAGE : false,
  pattern: {
    value: FOOTER_NOTES_PATTERN,
    message: FOOTER_NOTES_ERROR_MESSAGE
  },
  maxLength: {
    value: 2000,
    message: FOOTER_NOTES_ERROR_MESSAGE
  }
});

// Fonction utilitaire pour valider les dates de facture
export const validateInvoiceDates = (
  issueDate: string,
  dueDate: string,
  executionDate?: string
): { isValid: boolean; issueError?: string; dueError?: string; executionError?: string } => {
  const result = { isValid: true, issueError: undefined, dueError: undefined, executionError: undefined };
  
  // Convertir les dates en objets Date pour comparaison
  const issueDateObj = issueDate ? new Date(issueDate) : null;
  const dueDateObj = dueDate ? new Date(dueDate) : null;
  const executionDateObj = executionDate ? new Date(executionDate) : null;
  
  // Vérifier que la date d'émission est présente
  if (!issueDate || !issueDateObj) {
    result.isValid = false;
    result.issueError = ISSUE_DATE_REQUIRED_ERROR_MESSAGE;
  }
  
  // Vérifier que la date d'échéance est présente
  if (!dueDate || !dueDateObj) {
    result.isValid = false;
    result.dueError = DUE_DATE_REQUIRED_ERROR_MESSAGE;
  }
  
  // Vérifier que la date d'échéance est postérieure ou égale à la date d'émission
  if (issueDateObj && dueDateObj && dueDateObj < issueDateObj) {
    result.isValid = false;
    result.dueError = DUE_DATE_AFTER_ISSUE_DATE_ERROR_MESSAGE;
  }
  
  // Vérifier que la date d'exécution est postérieure ou égale à la date d'émission
  if (issueDateObj && executionDateObj && executionDateObj < issueDateObj) {
    result.isValid = false;
    result.executionError = EXECUTION_DATE_AFTER_ISSUE_DATE_ERROR_MESSAGE;
  }
  
  return result;
};

export const validateInvoiceItem = (
  description: string,
  quantity: number,
  unitPrice: number,
  vatRate: number,
  unit: string,
  discount?: number,
  discountType?: 'PERCENTAGE' | 'FIXED',
  vatExemptionText?: string
): { 
  isValid: boolean; 
  descriptionError?: string; 
  quantityError?: string; 
  unitPriceError?: string;
  vatRateError?: string;
  unitError?: string;
  discountError?: string;
  vatExemptionTextError?: string;
} => {
  let isValid = true;
  let descriptionError: string | undefined;
  let quantityError: string | undefined;
  let unitPriceError: string | undefined;
  let vatRateError: string | undefined;
  let vatExemptionTextError: string | undefined;
  let unitError: string | undefined;
  let discountError: string | undefined;

  // Vérifier la description
  if (!description) {
    descriptionError = REQUIRED_FIELD_MESSAGE;
    isValid = false;
  } else if (!ITEM_DESCRIPTION_PATTERN.test(description)) {
    descriptionError = ITEM_DESCRIPTION_ERROR_MESSAGE;
    isValid = false;
  }

  // Vérifier la quantité
  if (quantity === undefined || quantity === null) {
    quantityError = REQUIRED_FIELD_MESSAGE;
    isValid = false;
  } else if (quantity <= 0 || isNaN(quantity)) {
    quantityError = ITEM_QUANTITY_ERROR_MESSAGE;
    isValid = false;
  }

  // Vérifier le prix unitaire
  if (unitPrice === undefined || unitPrice === null) {
    unitPriceError = REQUIRED_FIELD_MESSAGE;
    isValid = false;
  } else if (unitPrice <= 0 || isNaN(unitPrice)) {
    unitPriceError = ITEM_UNIT_PRICE_ERROR_MESSAGE;
    isValid = false;
  }

  // Vérifier le taux de TVA
  if (vatRate === undefined || vatRate === null || isNaN(vatRate) || vatRate < 0 || vatRate > 100) {
    vatRateError = ITEM_VAT_RATE_ERROR_MESSAGE;
    isValid = false;
  }
  
  // Vérifier que si le taux de TVA est à 0, une mention d'exemption est fournie
  if (vatRate === 0 && (!vatExemptionText || vatExemptionText.trim() === '')) {
    vatExemptionTextError = ITEM_VAT_EXEMPTION_REQUIRED_ERROR_MESSAGE;
    isValid = false;
  } else if (vatRate < 0 || vatRate > 100 || isNaN(vatRate)) {
    vatRateError = ITEM_VAT_RATE_ERROR_MESSAGE;
    isValid = false;
  }

  // Vérifier l'unité (obligatoire)
  if (!unit) {
    unitError = REQUIRED_FIELD_MESSAGE;
    isValid = false;
  } else if (!UNIT_PATTERN.test(unit)) {
    unitError = ITEM_UNIT_ERROR_MESSAGE;
    isValid = false;
  }

  // Vérifier la remise si elle est fournie
  if (discount !== undefined && discount !== null) {
    if (discount < 0 || isNaN(discount)) {
      discountError = ITEM_DISCOUNT_ERROR_MESSAGE;
      isValid = false;
    } else if (discountType === 'PERCENTAGE' && discount > 100) {
      discountError = DISCOUNT_PERCENTAGE_ERROR_MESSAGE;
      isValid = false;
    }
  }

  return { 
    isValid, 
    descriptionError, 
    quantityError, 
    unitPriceError,
    vatRateError,
    unitError,
    discountError,
    vatExemptionTextError
  };
};

// URL Pattern pour la validation des liens
export const URL_PATTERN = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;

// Pattern pour le titre du lien des conditions de vente
export const TERMS_AND_CONDITIONS_LINK_TITLE_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\.,;:!?@#$%&*()\[\]\-_+='"]{1,100}$/;

// Messages d'erreur pour les conditions de vente
export const TERMS_AND_CONDITIONS_ERROR_MESSAGE = 'Les conditions générales ne doivent pas dépasser 2000 caractères';
export const TERMS_AND_CONDITIONS_LINK_TITLE_ERROR_MESSAGE = 'Le titre du lien doit contenir entre 1 et 100 caractères et ne peut contenir que des lettres, chiffres, espaces et certains caractères spéciaux';
export const TERMS_AND_CONDITIONS_LINK_ERROR_MESSAGE = 'Veuillez fournir une URL valide pour le lien des conditions générales';

// Fonction pour obtenir les règles de validation pour les conditions de vente
export const getTermsAndConditionsValidationRules = (required = false): RegisterOptions => {
  return {
    required: required ? REQUIRED_FIELD_MESSAGE : false,
    maxLength: {
      value: 2000,
      message: TERMS_AND_CONDITIONS_ERROR_MESSAGE
    }
  };
};

// Fonction pour obtenir les règles de validation pour le titre du lien des conditions de vente
export const getTermsAndConditionsLinkTitleValidationRules = (required = false): RegisterOptions => {
  return {
    required: required ? REQUIRED_FIELD_MESSAGE : false,
    pattern: {
      value: TERMS_AND_CONDITIONS_LINK_TITLE_PATTERN,
      message: TERMS_AND_CONDITIONS_LINK_TITLE_ERROR_MESSAGE
    },
    maxLength: {
      value: 100,
      message: TERMS_AND_CONDITIONS_LINK_TITLE_ERROR_MESSAGE
    }
  };
};

// Fonction pour obtenir les règles de validation pour le lien des conditions de vente
export const getTermsAndConditionsLinkValidationRules = (required = false): RegisterOptions => {
  return {
    required: required ? REQUIRED_FIELD_MESSAGE : false,
    pattern: {
      value: URL_PATTERN,
      message: TERMS_AND_CONDITIONS_LINK_ERROR_MESSAGE
    }
  };
};

// Fonction utilitaire pour valider les conditions de vente
export const validateTermsAndConditions = (
  termsAndConditions?: string,
  termsAndConditionsLinkTitle?: string,
  termsAndConditionsLink?: string
): { 
  isValid: boolean; 
  termsAndConditionsError?: string; 
  termsAndConditionsLinkTitleError?: string; 
  termsAndConditionsLinkError?: string;
} => {
  let isValid = true;
  let termsAndConditionsError: string | undefined;
  let termsAndConditionsLinkTitleError: string | undefined;
  let termsAndConditionsLinkError: string | undefined;

  // Vérifier les conditions de vente
  if (termsAndConditions && termsAndConditions.length > 2000) {
    termsAndConditionsError = TERMS_AND_CONDITIONS_ERROR_MESSAGE;
    isValid = false;
  }

  // Vérifier le titre du lien des conditions de vente
  if (termsAndConditionsLinkTitle) {
    if (termsAndConditionsLinkTitle.length > 100 || !TERMS_AND_CONDITIONS_LINK_TITLE_PATTERN.test(termsAndConditionsLinkTitle)) {
      termsAndConditionsLinkTitleError = TERMS_AND_CONDITIONS_LINK_TITLE_ERROR_MESSAGE;
      isValid = false;
    }
  }

  // Vérifier le lien des conditions de vente
  if (termsAndConditionsLink && !URL_PATTERN.test(termsAndConditionsLink)) {
    termsAndConditionsLinkError = TERMS_AND_CONDITIONS_LINK_ERROR_MESSAGE;
    isValid = false;
  }

  return { 
    isValid, 
    termsAndConditionsError, 
    termsAndConditionsLinkTitleError, 
    termsAndConditionsLinkError 
  };
};