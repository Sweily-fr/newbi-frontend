import { EmailSignature } from '../types';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_IMAGE_DIMENSIONS } from '../constants';

/**
 * Vérifie si un fichier est d'un type autorisé
 */
export const isFileTypeAllowed = (file: File): boolean => {
  return ALLOWED_FILE_TYPES.includes(file.type);
};

/**
 * Vérifie si un fichier ne dépasse pas la taille maximale autorisée
 */
export const isFileSizeValid = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

/**
 * Vérifie si une image a des dimensions valides
 */
export const checkImageDimensions = (
  file: File
): Promise<{ isValid: boolean; width?: number; height?: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      const isValid = 
        img.width <= MAX_IMAGE_DIMENSIONS.width && 
        img.height <= MAX_IMAGE_DIMENSIONS.height;
      
      resolve({ 
        isValid, 
        width: img.width, 
        height: img.height 
      });
      
      URL.revokeObjectURL(objectUrl);
    };
    
    img.onerror = () => {
      resolve({ isValid: false });
      URL.revokeObjectURL(objectUrl);
    };
    
    img.src = objectUrl;
  });
};

/**
 * Convertit un fichier en chaîne base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Supprime le préfixe data:image/...;base64,
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Génère un identifiant unique
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Formate une date au format ISO en une chaîne lisible
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Nettoie les données de la signature pour l'envoi à l'API
 */
export const cleanSignatureData = (data: Partial<EmailSignature>): Partial<EmailSignature> => {
  // Crée une copie profonde de l'objet pour éviter de modifier l'original
  const cleanedData = { ...data };
  
  // Supprime les propriétés vides ou non définies
  Object.keys(cleanedData).forEach(key => {
    const value = cleanedData[key as keyof EmailSignature];
    
    if (value === undefined || value === null || value === '') {
      delete cleanedData[key as keyof EmailSignature];
    }
    
    // Nettoie les objets imbriqués
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const cleanedObject = cleanSignatureData(value as Partial<EmailSignature>);
      
      // Si l'objet nettoyé est vide, on le supprime
      if (Object.keys(cleanedObject).length === 0) {
        delete cleanedData[key as keyof EmailSignature];
      } else {
        // Sinon, on met à jour avec l'objet nettoyé
        cleanedData[key as keyof EmailSignature] = cleanedObject as any;
      }
    }
  });
  
  return cleanedData;
};

/**
 * Fusionne les données d'une signature avec les valeurs par défaut
 */
export const mergeWithDefaults = (
  data: Partial<EmailSignature>,
  defaults: Partial<EmailSignature>
): EmailSignature => {
  return {
    ...defaults,
    ...data,
    // Fusionne les liens sociaux
    socialLinks: {
      ...(defaults.socialLinks || {}),
      ...(data.socialLinks || {}),
    },
  } as EmailSignature;
};

/**
 * Tronque un texte à une longueur maximale
 */
export const truncateText = (text: string, maxLength: number, ellipsis: string = '...'): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + ellipsis;
};

/**
 * Formate un numéro de téléphone pour l'affichage
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Supprime tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '');
  
  // Formatage pour les numéros français (ex: 06 12 34 56 78)
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  // Formatage pour les numéros internationaux (ex: +33 6 12 34 56 78)
  if (cleaned.length > 10 && cleaned.startsWith('33')) {
    return `+${cleaned.substring(0, 2)} ${cleaned.substring(2, 3)} ${cleaned.substring(3, 5)} ${cleaned.substring(5, 7)} ${cleaned.substring(7, 9)} ${cleaned.substring(9, 11)}`.trim();
  }
  
  // Retourne le numéro original si le format n'est pas reconnu
  return phone;
};

/**
 * Vérifie si une URL est valide
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    // Ajoute le protocole si absent
    const urlWithProtocol = url.match(/^https?:\/\//) ? url : `https://${url}`;
    new URL(urlWithProtocol);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Extrait le domaine d'une URL
 */
export const extractDomain = (url: string): string => {
  if (!url) return '';
  
  try {
    const urlWithProtocol = url.match(/^https?:\/\//) ? url : `https://${url}`;
    const { hostname } = new URL(urlWithProtocol);
    return hostname.replace('www.', '');
  } catch (e) {
    return url;
  }
};

/**
 * Génère un aperçu de la signature au format texte
 */
export const generateTextPreview = (signature: Partial<EmailSignature>): string => {
  const parts: string[] = [];
  
  if (signature.fullName) parts.push(signature.fullName);
  if (signature.jobTitle) parts.push(signature.jobTitle);
  if (signature.companyName) parts.push(signature.companyName);
  
  const contactInfo: string[] = [];
  if (signature.email) contactInfo.push(`Email: ${signature.email}`);
  if (signature.phone) contactInfo.push(`Tél: ${formatPhoneNumber(signature.phone)}`);
  if (signature.mobilePhone) contactInfo.push(`Mobile: ${formatPhoneNumber(signature.mobilePhone)}`);
  if (signature.website) contactInfo.push(`Site: ${extractDomain(signature.website)}`);
  if (signature.address) contactInfo.push(`Adresse: ${signature.address}`);
  
  if (contactInfo.length > 0) {
    parts.push(contactInfo.join(' | '));
  }
  
  return parts.join('\n');
};

/**
 * Télécharge une chaîne de caractères en tant que fichier
 */
export const downloadStringAsFile = (content: string, filename: string, type: string = 'text/plain'): void => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Nettoyage
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};

/**
 * Copie du texte dans le presse-papiers
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Erreur lors de la copie dans le presse-papiers:', err);
    
    // Méthode de secours pour les navigateurs plus anciens
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      return success;
    } catch (e) {
      console.error('Échec de la méthode de secours pour la copie:', e);
      return false;
    }
  }
};
