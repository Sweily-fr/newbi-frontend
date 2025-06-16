/**
 * Utilitaires pour la gestion des fichiers dans le module de transfert de fichiers
 */

/**
 * Formate la taille d'un fichier en unités lisibles (Ko, Mo, Go, etc.)
 * @param bytes Taille en octets
 * @param decimals Nombre de décimales à afficher
 * @returns Chaîne formatée avec unité
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 octets';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['octets', 'Ko', 'Mo', 'Go', 'To', 'Po'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Obtient l'icône appropriée pour un type MIME donné
 * @param mimeType Type MIME du fichier
 * @returns Nom de l'icône à utiliser
 */
export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  } else if (mimeType.startsWith('audio/')) {
    return 'musicnote';
  } else if (mimeType === 'application/pdf') {
    return 'document';
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return 'document-text';
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'application/vnd.ms-excel'
  ) {
    return 'document-1';
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    mimeType === 'application/vnd.ms-powerpoint'
  ) {
    return 'document-code';
  } else if (
    mimeType === 'application/zip' ||
    mimeType === 'application/x-rar-compressed' ||
    mimeType === 'application/x-7z-compressed'
  ) {
    return 'archive';
  } else {
    return 'document-unknown';
  }
};

/**
 * Vérifie si un fichier est une image
 * @param mimeType Type MIME du fichier
 * @returns Booléen indiquant si le fichier est une image
 */
export const isImage = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};

/**
 * Génère une URL de prévisualisation pour un fichier
 * @param file Objet File du navigateur
 * @returns Promise résolvant l'URL de prévisualisation
 */
export const generatePreviewUrl = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Calcule le temps restant avant expiration
 * @param expiryDate Date d'expiration au format ISO
 * @returns Objet contenant les jours, heures et minutes restants
 */
export const calculateTimeRemaining = (expiryDate: string): { 
  days: number; 
  hours: number; 
  minutes: number; 
  expired: boolean;
} => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, expired: true };
  }
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return { 
    days: diffDays, 
    hours: diffHours, 
    minutes: diffMinutes,
    expired: false
  };
};

/**
 * Formate une date d'expiration en texte lisible
 * @param expiryDate Date d'expiration au format ISO
 * @returns Texte formaté indiquant le temps restant
 */
export const formatExpiryDate = (expiryDate: string): string => {
  const { days, hours, minutes, expired } = calculateTimeRemaining(expiryDate);
  
  if (expired) {
    return 'Expiré';
  }
  
  if (days > 0) {
    return `Expire dans ${days} jour${days > 1 ? 's' : ''}`;
  }
  
  if (hours > 0) {
    return `Expire dans ${hours} heure${hours > 1 ? 's' : ''}`;
  }
  
  return `Expire dans ${minutes} minute${minutes > 1 ? 's' : ''}`;
};
