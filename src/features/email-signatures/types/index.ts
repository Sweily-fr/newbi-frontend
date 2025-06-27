/**
 * Réseaux sociaux disponibles pour la signature
 */
export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

/**
 * Interface principale pour une signature email
 */
export interface EmailSignature {
  // Identifiants et métadonnées
  id: string;
  name: string;
  isDefault: boolean;
  template?: string;
  templateId?: string | number; // Pour la rétrocompatibilité avec les anciennes versions
  createdAt?: string;
  updatedAt?: string;

  // Informations personnelles
  fullName: string;
  firstName?: string;
  lastName?: string;
  jobTitle: string;
  email: string;
  phone: string;
  mobilePhone?: string;
  website?: string;
  address?: string;
  
  // Informations de l'entreprise
  companyName?: string;
  companyWebsite?: string;
  companyAddress?: string;
  
  // Apparence et style
  primaryColor: string;
  secondaryColor: string;
  fontFamily?: string;
  fontSize?: number;
  textStyle?: 'normal' | 'overline' | 'underline' | 'strikethrough';
  style?: string | 'normal' | 'overline' | 'underline' | 'strikethrough';
  textColor?: string;
  
  // Logo et photo de profil
  logoUrl?: string;
  companyLogo?: string; // Alias pour logoUrl
  showLogo?: boolean;
  hasLogo?: boolean;
  customLogoUrl?: string;
  useNewbiLogo?: boolean;
  profilePhotoUrl?: string;
  profilePhoto?: string; // Alias pour profilePhotoUrl
  profilePhotoBase64?: string | null;
  profilePhotoToDelete?: boolean;
  profilePhotoSize?: number;
  
  // Mise en page
  layout?: 'horizontal' | 'vertical' | 'stacked' | 'sideBySide';
  imagesLayout?: 'horizontal' | 'vertical' | 'stacked' | 'sideBySide';
  horizontalSpacing?: number;
  verticalSpacing?: number;
  verticalAlignment?: 'top' | 'middle' | 'bottom' | 'left' | 'center' | 'right';
  textAlignment?: 'left' | 'center' | 'right' | string;
  
  // Réseaux sociaux
  socialLinks?: SocialLinks;
  socialLinksDisplayMode?: 'icons' | 'text' | 'both';
  socialLinksPosition?: 'bottom' | 'right' | 'left' | 'below-personal';
  socialLinksIconStyle?: 'plain' | 'rounded' | 'circle' | 'filled';
  socialLinksIconColor?: string;
  socialLinksIconSize?: number;
  socialLinksIconBgColor?: string;
  
  // Options d'affichage
  iconTextSpacing?: number;
  showEmailIcon?: boolean;
  showPhoneIcon?: boolean;
  showMobilePhoneIcon?: boolean;
  showAddressIcon?: boolean;
  showWebsiteIcon?: boolean;
  showProfilePhotoBorder?: boolean;
  showLogoBorder?: boolean;
}

/**
 * Données de signature utilisées dans le contexte
 */
export interface SignatureData {
  // Identifiants et métadonnées
  name: string;
  isDefault: boolean;
  templateId?: string | number;
  
  // Informations personnelles
  primaryColor: string;
  secondaryColor: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  mobilePhone?: string;
  website?: string;
  address?: string;
  profilePhotoUrl?: string;
  profilePhotoBase64?: string | null;
  profilePhotoSize?: number;
  profilePhotoToDelete?: boolean;
  
  // Informations de l'entreprise
  companyName: string;
  companyWebsite: string;
  companyAddress: string;
  
  // Apparence et style
  fontFamily: string;
  fontSize: number;
  textStyle: 'normal' | 'overline' | 'underline' | 'strikethrough';
  
  // Réseaux sociaux
  socialLinks: SocialLinks;
  socialLinksDisplayMode: 'icons' | 'text' | 'both';
  socialLinksIconStyle: 'plain' | 'rounded' | 'circle' | 'filled';
  socialLinksPosition?: 'bottom' | 'right' | 'left' | 'below-personal';
  socialLinksIconColor?: string;
  
  // Options d'affichage
  showEmailIcon: boolean;
  showPhoneIcon: boolean;
  showAddressIcon: boolean;
  showWebsiteIcon: boolean;
  iconTextSpacing?: number;
  
  // Mise en page
  layout?: 'horizontal' | 'vertical' | 'stacked' | 'sideBySide';
  textAlignment?: 'left' | 'center' | 'right' | string;
  verticalSpacing?: number;
  horizontalSpacing?: number;
  verticalAlignment?: 'top' | 'middle' | 'bottom' | 'left' | 'center' | 'right';
  imagesLayout?: 'stacked' | 'sideBySide';
  
  // Autres propriétés
  useNewbiLogo: boolean;
  customLogoUrl?: string;
  showLogo?: boolean;
}

/**
 * Options d'affichage des icônes
 */
export interface IconDisplayOptions {
  showEmailIcon: boolean;
  showPhoneIcon: boolean;
  showAddressIcon: boolean;
  showWebsiteIcon: boolean;
}

/**
 * Erreurs de validation du formulaire de signature
 */
export interface EmailSignatureFormErrors {
  name?: string;
  fullName?: string;
  email?: string;
  companyName?: string;
  logoUrl?: string;
  address?: string;
  submit?: string;
}

// Export des types spécifiques aux hooks
export * from './hooks';

// Export des types et utilitaires de validation
export * from './validation';