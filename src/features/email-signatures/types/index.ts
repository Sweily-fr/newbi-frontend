export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface EmailSignature {
  id: string;
  name: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  website?: string;
  address?: string;
  companyName?: string;
  template: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  showLogo?: boolean;
  isDefault: boolean;
  socialLinks?: SocialLinks;
  profilePhotoUrl?: string;
  profilePhotoBase64?: string | null;
  profilePhotoToDelete?: boolean;
  profilePhotoSize?: number;
  layout?: 'horizontal' | 'vertical';
  horizontalSpacing?: number;
  verticalSpacing?: number;
  verticalAlignment?: 'left' | 'center' | 'right';
  imagesLayout?: 'horizontal' | 'vertical';
  fontFamily?: string;
  fontSize?: number;
  socialLinksDisplayMode?: 'icons' | 'text';
  socialLinksPosition?: 'bottom' | 'right';
  socialLinksIconStyle?: 'plain' | 'rounded' | 'circle';
  socialLinksIconBgColor?: string;
  socialLinksIconColor?: string;
  socialLinksIconSize?: number;
  // Options d'affichage des icônes pour les coordonnées
  showEmailIcon?: boolean;
  showPhoneIcon?: boolean;
  showAddressIcon?: boolean;
  showWebsiteIcon?: boolean;
  createdAt: string;
  updatedAt?: string;
  // Propriétés supplémentaires pour la compatibilité
  displayMode?: 'icons' | 'text';
  iconStyle?: 'plain' | 'rounded' | 'circle';
  hasLogo?: boolean;
  style?: string;
}

export interface SignatureData {
  name: string;
  isDefault: boolean;
  primaryColor: string;
  secondaryColor: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  mobilePhone?: string;
  companyName: string;
  companyWebsite: string;
  companyAddress: string;
  socialLinks: SocialLinks;
  socialLinksDisplayMode: 'icons' | 'text';
  socialLinksIconStyle: 'plain' | 'rounded' | 'circle';
  useNewbiLogo: boolean;
  customLogoUrl: string;
  fontFamily: string;
  fontSize: number;
  textStyle: string;
  templateId: number;
  // Options d'affichage des icônes pour les coordonnées
  showEmailIcon: boolean;
  showPhoneIcon: boolean;
  showAddressIcon: boolean;
  showWebsiteIcon: boolean;
  // Propriétés optionnelles pour la rétrocompatibilité
  socialLinksPosition?: 'bottom' | 'right';
  layout?: 'horizontal' | 'vertical';
  textAlignment?: string;
  verticalSpacing?: number;
  horizontalSpacing?: number;
  profilePhotoUrl?: string;
  profilePhotoBase64?: string | null;
  profilePhotoSize?: number;
  profilePhotoToDelete?: boolean;
}

// Type d'assertion pour les propriétés d'affichage des icônes
export interface IconDisplayOptions {
  showEmailIcon: boolean;
  showPhoneIcon: boolean;
  showAddressIcon: boolean;
  showWebsiteIcon: boolean;
}

export interface EmailSignatureFormErrors {
  name?: string;
  fullName?: string;
  email?: string;
  companyName?: string;
  logoUrl?: string;
  address?: string;
  submit?: string;
}