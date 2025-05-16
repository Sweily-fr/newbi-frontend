export interface SignatureData {
  // Propriétés générales
  name: string;
  isDefault: boolean;
  templateId?: string;
  
  // Informations personnelles
  primaryColor: string;
  secondaryColor: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  mobilePhone?: string;
  profilePhotoUrl?: string;
  profilePhotoBase64?: string;
  profilePhotoSize?: number;
  profilePhotoToDelete?: boolean; // Indique si la photo de profil doit être supprimée  
  // Informations entreprise
  companyName: string;
  companyWebsite: string;
  companyAddress: string;
  
  // Options d'affichage des icônes
  showEmailIcon?: boolean;
  showPhoneIcon?: boolean;
  showAddressIcon?: boolean;
  showWebsiteIcon?: boolean;
  
  // Réseaux sociaux
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  socialLinksDisplayMode: 'icons' | 'text';
  socialLinksIconStyle: 'plain' | 'rounded' | 'filled' | 'circle';
  socialLinksPosition: 'bottom' | 'right' | 'left' | 'below-personal';
  socialLinksIconColor?: string;
  
  // Apparence
  useNewbiLogo: boolean;
  customLogoUrl?: string;
  showLogo?: boolean;
  fontFamily: string;
  fontSize: number;
  textStyle: 'normal' | 'overline' | 'underline' | 'strikethrough';
  layout: 'vertical' | 'horizontal';
  textAlignment: 'left' | 'center' | 'right';
  verticalSpacing: number; // Espacement vertical entre les sections en px
  horizontalSpacing: number; // Espacement entre les colonnes en mode horizontal en px
  verticalAlignment?: 'top' | 'center' | 'bottom' | 'left' | 'right';
  imagesLayout?: 'stacked' | 'sideBySide' | 'vertical' | 'horizontal';
  iconTextSpacing?: number; // Espacement entre icônes et texte
}

export interface EmailSignature {
  id: string;
  name: string;
  templateId?: string;
  
  // Informations personnelles
  primaryColor: string;
  secondaryColor: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  mobilePhone?: string;
  profilePhotoUrl?: string;
  profilePhotoBase64?: string;
  profilePhotoSize?: number;
  
  // Informations entreprise
  companyName: string;
  website: string; // Équivalent à companyWebsite dans SignatureData
  address: string; // Équivalent à companyAddress dans SignatureData
  
  // Options d'affichage des icônes
  showEmailIcon?: boolean;
  showPhoneIcon?: boolean;
  showAddressIcon?: boolean;
  showWebsiteIcon?: boolean;
  
  // Réseaux sociaux
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  socialLinksDisplayMode?: 'icons' | 'text'; // Équivalent à displayMode
  displayMode?: 'icons' | 'text'; // Pour compatibilité
  socialLinksIconStyle?: 'plain' | 'rounded' | 'filled' | 'circle'; // Équivalent à iconStyle
  iconStyle?: 'plain' | 'rounded' | 'filled' | 'circle'; // Pour compatibilité
  socialLinksPosition?: 'bottom' | 'right' | 'left';
  
  // Apparence
  useNewbiLogo?: boolean;
  hasLogo?: boolean; // Pour compatibilité
  showLogo?: boolean;
  customLogoUrl?: string;
  logoUrl?: string; // Pour compatibilité
  fontFamily: string;
  fontSize: number;
  textStyle?: 'normal' | 'overline' | 'underline' | 'strikethrough'; // Équivalent à style
  style?: 'normal' | 'overline' | 'underline' | 'strikethrough'; // Pour compatibilité
  layout?: 'vertical' | 'horizontal';
  textAlignment?: 'left' | 'center' | 'right';
  verticalSpacing?: number;
  horizontalSpacing?: number;
  verticalAlignment?: 'top' | 'center' | 'bottom' | 'left' | 'right';
  imagesLayout?: 'stacked' | 'sideBySide' | 'vertical' | 'horizontal';
  textColor?: string; // Ajout pour EmailSignaturePreviewNew.tsx
  
  // Métadonnées
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
