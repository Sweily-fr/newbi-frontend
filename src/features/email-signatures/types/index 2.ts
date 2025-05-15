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
  createdAt: string;
  updatedAt?: string;
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