export interface SignatureData {
  // Propriétés générales
  name: string;
  isDefault: boolean;
<<<<<<< HEAD
  templateId?: string;
=======
>>>>>>> 4a6c54056b6da7245bde4cb262f478bfdca33bd3
  
  // Informations personnelles
  primaryColor: string;
  secondaryColor: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  mobilePhone?: string;
  profilePhotoUrl?: string;
<<<<<<< HEAD
  profilePhotoBase64?: string;
  profilePhotoSize?: number;
=======
>>>>>>> 4a6c54056b6da7245bde4cb262f478bfdca33bd3
  
  // Informations entreprise
  companyName: string;
  companyWebsite: string;
  companyAddress: string;
  
<<<<<<< HEAD
  // Options d'affichage des icônes
  showEmailIcon?: boolean;
  showPhoneIcon?: boolean;
  showAddressIcon?: boolean;
  showWebsiteIcon?: boolean;
  
=======
>>>>>>> 4a6c54056b6da7245bde4cb262f478bfdca33bd3
  // Réseaux sociaux
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  socialLinksDisplayMode: 'icons' | 'text';
  socialLinksIconStyle: 'plain' | 'rounded' | 'filled' | 'circle';
<<<<<<< HEAD
  socialLinksPosition: 'bottom' | 'right' | 'left';
=======
>>>>>>> 4a6c54056b6da7245bde4cb262f478bfdca33bd3
  
  // Apparence
  useNewbiLogo: boolean;
  customLogoUrl?: string;
<<<<<<< HEAD
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
=======
  fontFamily: string;
  fontSize: number;
  textStyle: 'normal' | 'overline' | 'underline' | 'strikethrough';
>>>>>>> 4a6c54056b6da7245bde4cb262f478bfdca33bd3
}

export interface EmailSignature {
  id: string;
  name: string;
<<<<<<< HEAD
  templateId?: string;
  
  // Informations personnelles
=======
>>>>>>> 4a6c54056b6da7245bde4cb262f478bfdca33bd3
  primaryColor: string;
  secondaryColor: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
<<<<<<< HEAD
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
=======
  companyName: string;
  website: string;
  address: string;
>>>>>>> 4a6c54056b6da7245bde4cb262f478bfdca33bd3
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
<<<<<<< HEAD
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
=======
  displayMode: 'icons' | 'text';
  iconStyle: 'plain' | 'rounded' | 'filled' | 'circle';
  hasLogo: boolean;
  logoUrl?: string;
  fontFamily: string;
  fontSize: number;
  style: 'normal' | 'overline' | 'underline' | 'strikethrough';
>>>>>>> 4a6c54056b6da7245bde4cb262f478bfdca33bd3
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
