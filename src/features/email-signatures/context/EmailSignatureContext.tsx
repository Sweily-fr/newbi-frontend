import React, { createContext } from 'react';
import { EmailSignature } from '../types';

// Interface pour les données de signature
export interface SignatureData {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  companyName?: string;
  phone?: string;
  mobilePhone?: string;
  email?: string;
  website?: string;
  address?: string;
  companyLogo?: string;
  profilePhoto?: string;
  socialLinks?: Record<string, string>;
  companyWebsite?: string;
  companyAddress?: string;
  profilePhotoToDelete?: boolean;
  logoSize?: number;
  iconTextSpacing?: number;
  socialLinksIconColor?: string;
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
  socialLinksDisplayMode: 'icons' | 'text';
  setSocialLinksDisplayMode: React.Dispatch<React.SetStateAction<'icons' | 'text'>>;
  
  socialLinksIconStyle: string;
  setSocialLinksIconStyle: React.Dispatch<React.SetStateAction<string>>;
  
  socialLinksIconColor: string;
  setSocialLinksIconColor: React.Dispatch<React.SetStateAction<string>>;
  
  // Méthodes utilitaires
  updateFromSignature: (signature: Partial<EmailSignature>) => void;
  getFullName: () => string;
}

// Création du contexte avec une valeur undefined par défaut
export const EmailSignatureContext = createContext<EmailSignatureContextType | undefined>(undefined);
