export interface SignatureData {
  // Propriétés générales
  name: string;
  isDefault: boolean;
  
  // Informations personnelles
  primaryColor: string;
  secondaryColor: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  mobilePhone?: string;
  profilePhotoUrl?: string;
  
  // Informations entreprise
  companyName: string;
  companyWebsite: string;
  companyAddress: string;
  
  // Réseaux sociaux
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  socialLinksDisplayMode: 'icons' | 'text';
  socialLinksIconStyle: 'plain' | 'rounded' | 'filled' | 'circle';
  
  // Apparence
  useNewbiLogo: boolean;
  customLogoUrl?: string;
  fontFamily: string;
  fontSize: number;
  textStyle: 'normal' | 'overline' | 'underline' | 'strikethrough';
}

export interface EmailSignature {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  companyName: string;
  website: string;
  address: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  displayMode: 'icons' | 'text';
  iconStyle: 'plain' | 'rounded' | 'filled' | 'circle';
  hasLogo: boolean;
  logoUrl?: string;
  fontFamily: string;
  fontSize: number;
  style: 'normal' | 'overline' | 'underline' | 'strikethrough';
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
