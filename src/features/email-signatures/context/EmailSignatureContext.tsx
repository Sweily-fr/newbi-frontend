import React, { createContext } from 'react';
import { EmailSignature } from '../types';

// Interface pour les données de signature avec des champs optionnels pour le contexte
export interface SignatureData extends Omit<EmailSignature, 
  'socialLinks' | 
  'socialLinksDisplayMode' | 
  'socialLinksIconStyle' | 
  'socialLinksPosition' |
  'profilePhotoBase64' | 
  'verticalAlignment' |
  'template' |
  'companyLogo' |
  'profilePhoto' |
  'displayMode' |
  'iconStyle' |
  'website' |
  'address' |
  'companyWebsite' |
  'companyAddress' |
  'fullName' |
  'isDefault' |
  'createdAt' |
  'updatedAt'
> {
  // Propriétés spécifiques au contexte
  id: string;
  createdAt: string;
  updatedAt?: string;
  
  // Propriétés de base
  fullName: string;
  isDefault: boolean;
  
  // Propriétés de compatibilité
  socialLinks?: Record<string, string>;
  verticalAlignment?: 'top' | 'middle' | 'bottom' | 'left' | 'center' | 'right';
  website?: string;
  address?: string;
  companyWebsite?: string;
  companyAddress?: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  companyLogoUrl?: string;
  
  // Propriétés d'affichage
  showLogo?: boolean;
  showProfilePhoto?: boolean;
  
  // Propriétés de style
  logoSize?: number;
  profilePhotoSize?: number;
  iconTextSpacing?: number;
  
  // Propriétés des réseaux sociaux
  socialLinksDisplayMode?: 'icons' | 'text' | 'both';
  socialLinksIconStyle?: 'plain' | 'rounded' | 'circle' | 'filled';
  socialLinksIconColor?: string;
  socialLinksIconSize?: number;
  socialLinksIconBgColor?: string;
  socialLinksPosition?: 'bottom' | 'right' | 'left';
  
  // Propriétés de mise en page
  layout?: 'horizontal' | 'vertical';
  verticalSpacing?: number;
  horizontalSpacing?: number;
  
  // Propriétés de compatibilité
  useNewbiLogo?: boolean;
  
  // Propriétés de gestion des fichiers
  profilePhotoToDelete?: boolean;
  profilePhotoUrl?: string;
  profilePhotoBase64?: string | null;
}

// Interface pour le contexte
export interface EmailSignatureContextType {
  // Données de signature
  signatureData: SignatureData;
  setSignatureData: React.Dispatch<React.SetStateAction<SignatureData>>;
  
  // Options d'affichage
  showCompanyName: boolean;
  setShowCompanyName: React.Dispatch<React.SetStateAction<boolean>>;
  
  showSocialLinks: boolean;
  setShowSocialLinks: React.Dispatch<React.SetStateAction<boolean>>;
  
  showJobTitle: boolean;
  setShowJobTitle: React.Dispatch<React.SetStateAction<boolean>>;
  
  showLogo: boolean;
  setShowLogo: React.Dispatch<React.SetStateAction<boolean>>;
  
  showProfilePhoto: boolean;
  setShowProfilePhoto: React.Dispatch<React.SetStateAction<boolean>>;
  
  showEmailIcon: boolean;
  setShowEmailIcon: React.Dispatch<React.SetStateAction<boolean>>;
  
  showPhoneIcon: boolean;
  setShowPhoneIcon: React.Dispatch<React.SetStateAction<boolean>>;
  
  showMobilePhoneIcon: boolean;
  setShowMobilePhoneIcon: React.Dispatch<React.SetStateAction<boolean>>;
  
  showAddressIcon: boolean;
  setShowAddressIcon: React.Dispatch<React.SetStateAction<boolean>>;
  
  showWebsiteIcon: boolean;
  setShowWebsiteIcon: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Styles et mise en page
  logoSize: number;
  setLogoSize: React.Dispatch<React.SetStateAction<number>>;
  
  profilePhotoSize: number;
  setProfilePhotoSize: React.Dispatch<React.SetStateAction<number>>;
  
  primaryColor: string;
  setPrimaryColor: React.Dispatch<React.SetStateAction<string>>;
  
  secondaryColor: string;
  setSecondaryColor: React.Dispatch<React.SetStateAction<string>>;
  
  textAlignment: 'left' | 'center' | 'right';
  setTextAlignment: React.Dispatch<React.SetStateAction<'left' | 'center' | 'right'>>;
  
  verticalSpacing: number;
  setVerticalSpacing: React.Dispatch<React.SetStateAction<number>>;
  
  horizontalSpacing: number;
  setHorizontalSpacing: React.Dispatch<React.SetStateAction<number>>;
  
  iconTextSpacing: number;
  setIconTextSpacing: React.Dispatch<React.SetStateAction<number>>;
  
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  
  textStyle: 'normal' | 'overline' | 'underline' | 'strikethrough';
  setTextStyle: React.Dispatch<React.SetStateAction<'normal' | 'overline' | 'underline' | 'strikethrough'>>;
  
  fontFamily: string;
  setFontFamily: React.Dispatch<React.SetStateAction<string>>;
  
  // Options spécifiques aux réseaux sociaux
  socialLinksDisplayMode: 'icons' | 'text' | 'both';
  setSocialLinksDisplayMode: React.Dispatch<React.SetStateAction<'icons' | 'text' | 'both'>>;
  
  socialLinksIconStyle: 'plain' | 'rounded' | 'circle' | 'filled';
  setSocialLinksIconStyle: React.Dispatch<React.SetStateAction<'plain' | 'rounded' | 'circle' | 'filled'>>;
  
  socialLinksIconColor: string;
  setSocialLinksIconColor: React.Dispatch<React.SetStateAction<string>>;
  
  // Méthodes utilitaires
  updateFromSignature: (signature: Partial<EmailSignature>) => void;
  getFullName: () => string;
}

// Création du contexte avec une valeur undefined par défaut
export const EmailSignatureContext = createContext<EmailSignatureContextType | undefined>(undefined);
