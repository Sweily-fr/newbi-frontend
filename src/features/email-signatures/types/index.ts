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
  template: string;
  templateId?: number; // Pour la rétrocompatibilité
  createdAt: string;
  updatedAt?: string;

  // Informations personnelles
  fullName: string;
  firstName?: string;
  lastName?: string;
  jobTitle: string;
  email: string;
  phone?: string;
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
  style?: string;
  
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
  layout?: 'horizontal' | 'vertical';
  imagesLayout?: 'horizontal' | 'vertical';
  horizontalSpacing?: number;
  verticalSpacing?: number;
  verticalAlignment?: 'top' | 'middle' | 'bottom' | 'left' | 'center' | 'right';
  textAlignment?: 'left' | 'center' | 'right';
  
  // Réseaux sociaux
  socialLinks?: SocialLinks;
  socialLinksDisplayMode?: 'icons' | 'text' | 'both';
  socialLinksPosition?: 'bottom' | 'right' | 'left';
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
  
  // Propriétés de compatibilité (à déprécier)
  displayMode?: 'icons' | 'text' | 'both'; // Utiliser socialLinksDisplayMode à la place
  iconStyle?: 'plain' | 'rounded' | 'circle' | 'filled'; // Utiliser socialLinksIconStyle à la place
}

/**
 * Données de signature utilisées dans le contexte
 */
export interface SignatureData {
  // Identifiants et métadonnées
  name: string;
  isDefault: boolean;
  
  // Informations personnelles
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  mobilePhone?: string;
  
  // Informations de l'entreprise
  companyName: string;
  companyWebsite: string;
  companyAddress: string;
  
  // Apparence et style
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: number;
  textStyle: 'normal' | 'overline' | 'underline' | 'strikethrough';
  
  // Réseaux sociaux
  socialLinks: SocialLinks;
  socialLinksDisplayMode: 'icons' | 'text' | 'both';
  socialLinksIconStyle: 'plain' | 'rounded' | 'circle' | 'filled';
  socialLinksIconColor: string;
  
  // Options d'affichage
  showEmailIcon: boolean;
  showPhoneIcon: boolean;
  showAddressIcon: boolean;
  showWebsiteIcon: boolean;
  iconTextSpacing?: number;
  
  // Propriétés optionnelles
  socialLinksPosition?: 'bottom' | 'right';
  layout?: 'horizontal' | 'vertical';
  textAlignment?: string;
  verticalSpacing?: number;
  horizontalSpacing?: number;
  profilePhotoUrl?: string;
  profilePhotoBase64?: string | null;
  profilePhotoSize?: number;
  profilePhotoToDelete?: boolean;
  useNewbiLogo: boolean;
  customLogoUrl: string;
  templateId: number;
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