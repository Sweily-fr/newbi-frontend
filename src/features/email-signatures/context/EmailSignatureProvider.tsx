import React, { ReactNode, useState } from 'react';
import { EmailSignatureContext, SignatureData } from './EmailSignatureContext';
import { EmailSignature } from '../types';

// Props pour le provider
export interface EmailSignatureProviderProps {
  children: ReactNode;
  initialSignature?: Partial<EmailSignature>;
  initialFullName?: string;
  initialFirstName?: string;
  initialLastName?: string;
  initialJobTitle?: string;
  initialCompanyName?: string;
  initialPhone?: string;
  initialMobilePhone?: string;
  initialEmail?: string;
  initialWebsite?: string;
  initialAddress?: string;
  initialCompanyLogo?: string;
  initialProfilePhoto?: string;
  initialProfilePhotoUrl?: string;
  initialProfilePhotoBase64?: string;
  initialProfilePhotoSize?: number;
  initialProfilePhotoToDelete?: boolean;
  initialSocialLinks?: Record<string, string>;
  initialCompanyWebsite?: string;
  initialCompanyAddress?: string;
  initialLogoUrl?: string;
  initialLogoSize?: number;
  initialIconTextSpacing?: number;
  initialSocialLinksIconColor?: string;
  initialShowLogo?: boolean;
  initialShowPhoneIcon?: boolean;
  initialShowMobilePhoneIcon?: boolean;
  initialShowEmailIcon?: boolean;
  initialShowAddressIcon?: boolean;
  initialShowWebsiteIcon?: boolean;
  initialHorizontalSpacing?: number;
  initialVerticalSpacing?: number;
  initialPrimaryColor?: string;
  initialSecondaryColor?: string;
  initialTextAlignment?: 'left' | 'center' | 'right';
  initialSocialLinksDisplayMode?: 'icons' | 'text';
  initialSocialLinksIconStyle?: string;
  initialFontSize?: number;
  initialTextStyle?: 'normal' | 'overline' | 'underline' | 'strikethrough';
  initialFontFamily?: string;
}

// Provider du contexte
export const EmailSignatureProvider: React.FC<EmailSignatureProviderProps> = ({
  children,
  initialSignature,
  initialFullName,
  initialFirstName,
  initialLastName,
  initialJobTitle,
  initialCompanyName,
  initialPhone,
  initialMobilePhone,
  initialEmail,
  initialWebsite,
  initialAddress,
  initialCompanyLogo,
  initialProfilePhoto,
  initialProfilePhotoUrl,
  initialProfilePhotoBase64,
  initialProfilePhotoSize,
  initialProfilePhotoToDelete,
  initialSocialLinks,
  initialCompanyWebsite,
  initialCompanyAddress,
  initialLogoUrl,
  initialLogoSize,
  initialIconTextSpacing,
  initialSocialLinksIconColor,
  initialShowLogo,
  initialShowPhoneIcon = true,
  initialShowMobilePhoneIcon = true,
  initialShowEmailIcon = true,
  initialShowAddressIcon = true,
  initialShowWebsiteIcon = true,
  initialHorizontalSpacing,
  initialVerticalSpacing,
  initialPrimaryColor,
  initialSecondaryColor,
  initialTextAlignment,
  initialSocialLinksDisplayMode,
  initialSocialLinksIconStyle,
  initialFontSize,
  initialTextStyle,
  initialFontFamily
}) => {
  // Déterminer le prénom et le nom à partir du nom complet si fourni
  let firstName = initialFirstName || '';
  let lastName = initialLastName || '';
  
  if (initialFullName) {
    const nameParts = initialFullName.split(' ');
    firstName = firstName || nameParts[0] || '';
    lastName = lastName || nameParts.slice(1).join(' ') || '';
  } else if (initialSignature?.fullName) {
    const nameParts = initialSignature.fullName.split(' ');
    firstName = firstName || nameParts[0] || '';
    lastName = lastName || nameParts.slice(1).join(' ') || '';
  }

  // Initialiser les données de signature
  const [signatureData, setSignatureData] = useState<SignatureData>({
    firstName,
    lastName,
    jobTitle: initialSignature?.jobTitle || initialJobTitle || '',
    companyName: initialSignature?.companyName || initialCompanyName || '',
    phone: initialSignature?.phone || initialPhone || '',
    mobilePhone: initialSignature?.mobilePhone || initialMobilePhone || '',
    email: initialSignature?.email || initialEmail || '',
    website: initialSignature?.website || initialWebsite || '',
    address: initialSignature?.address || initialAddress || '',
    companyLogo: initialSignature?.logoUrl || initialLogoUrl || initialCompanyLogo || '',
    profilePhoto: initialSignature?.profilePhotoUrl || initialSignature?.profilePhotoBase64 || initialProfilePhotoUrl || initialProfilePhotoBase64 || initialProfilePhoto || '',
    socialLinks: initialSignature?.socialLinks || initialSocialLinks || {},
    companyWebsite: initialSignature?.website || initialCompanyWebsite || initialWebsite || '',
    companyAddress: initialSignature?.address || initialCompanyAddress || initialAddress || '',
    profilePhotoToDelete: initialProfilePhotoToDelete || false,
    logoSize: initialLogoSize || 100,
    iconTextSpacing: initialIconTextSpacing || 5,
    socialLinksIconColor: initialSocialLinksIconColor || '#5b50ff'
  });

  // Options d'affichage
  const [showCompanyName, setShowCompanyName] = useState<boolean>(true);
  const [showSocialLinks, setShowSocialLinks] = useState<boolean>(true);
  const [showJobTitle, setShowJobTitle] = useState<boolean>(true);
  const [showLogo, setShowLogo] = useState<boolean>(initialSignature?.showLogo !== undefined ? initialSignature.showLogo : (initialShowLogo !== undefined ? initialShowLogo : true));
  const [showProfilePhoto, setShowProfilePhoto] = useState<boolean>(!initialProfilePhotoToDelete);
  const [showEmailIcon, setShowEmailIcon] = useState<boolean>(initialSignature?.showEmailIcon !== undefined ? initialSignature.showEmailIcon : initialShowEmailIcon);
  const [showPhoneIcon, setShowPhoneIcon] = useState<boolean>(initialSignature?.showPhoneIcon !== undefined ? initialSignature.showPhoneIcon : initialShowPhoneIcon);
  const [showMobilePhoneIcon, setShowMobilePhoneIcon] = useState<boolean>(initialShowMobilePhoneIcon || true);
  const [showAddressIcon, setShowAddressIcon] = useState<boolean>(initialSignature?.showAddressIcon !== undefined ? initialSignature.showAddressIcon : initialShowAddressIcon);
  const [showWebsiteIcon, setShowWebsiteIcon] = useState<boolean>(initialSignature?.showWebsiteIcon !== undefined ? initialSignature.showWebsiteIcon : initialShowWebsiteIcon);

  // Styles et mise en page
  const [logoSize, setLogoSize] = useState<number>(initialLogoSize || 100);
  const [profilePhotoSize, setProfilePhotoSize] = useState<number>(initialSignature?.profilePhotoSize || initialProfilePhotoSize || 80);
  const [primaryColor, setPrimaryColor] = useState<string>(initialSignature?.primaryColor || initialPrimaryColor || '#5b50ff');
  const [secondaryColor, setSecondaryColor] = useState<string>(initialSignature?.secondaryColor || initialSecondaryColor || '#333333');
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right'>(
    (initialSignature?.textAlignment as 'left' | 'center' | 'right') || initialTextAlignment || 'left'
  );
  const [verticalSpacing, setVerticalSpacing] = useState<number>(initialSignature?.verticalSpacing || initialVerticalSpacing || 10);
  const [horizontalSpacing, setHorizontalSpacing] = useState<number>(initialSignature?.horizontalSpacing || initialHorizontalSpacing || 15);
  // Utilisation directe de initialIconTextSpacing pour éviter les erreurs TypeScript
  const [iconTextSpacing, setIconTextSpacing] = useState<number>(initialIconTextSpacing || 5);
  const [fontSize, setFontSize] = useState<number>(initialSignature?.fontSize || initialFontSize || 14);
  const [textStyle, setTextStyle] = useState<'normal' | 'overline' | 'underline' | 'strikethrough'>(
    (initialSignature?.textStyle as 'normal' | 'overline' | 'underline' | 'strikethrough') || initialTextStyle || 'normal'
  );
  const [fontFamily, setFontFamily] = useState<string>(initialSignature?.fontFamily || initialFontFamily || 'Arial, sans-serif');
  
  // Options spécifiques aux réseaux sociaux
  const [socialLinksDisplayMode, setSocialLinksDisplayMode] = useState<'icons' | 'text'>(
    (initialSignature?.socialLinksDisplayMode as 'icons' | 'text') || initialSocialLinksDisplayMode || 'icons'
  );
  const [socialLinksIconStyle, setSocialLinksIconStyle] = useState<string>(initialSignature?.socialLinksIconStyle || initialSocialLinksIconStyle || 'plain');
  // Utilisation directe de initialSocialLinksIconColor pour éviter les erreurs TypeScript
  const [socialLinksIconColor, setSocialLinksIconColor] = useState<string>(initialSocialLinksIconColor || '#5b50ff');

  // Méthode pour mettre à jour le contexte à partir d'un objet signature
  const updateFromSignature = (signature: Partial<EmailSignature>) => {
    if (!signature) return;

    // Mise à jour des données de signature
    setSignatureData(prev => ({
      ...prev,
      firstName: signature.fullName?.split(' ')[0] || prev.firstName,
      lastName: signature.fullName?.split(' ').slice(1).join(' ') || prev.lastName,
      jobTitle: signature.jobTitle || prev.jobTitle,
      companyName: signature.companyName || prev.companyName,
      phone: signature.phone || prev.phone,
      mobilePhone: signature.mobilePhone || prev.mobilePhone,
      email: signature.email || prev.email,
      website: signature?.website || prev.website,
      address: signature?.address || prev.address,
      companyLogo: signature.logoUrl || prev.companyLogo,
      profilePhoto: signature?.profilePhotoBase64 || signature?.profilePhotoUrl || prev.profilePhoto,
      socialLinks: signature.socialLinks || prev.socialLinks
    }));

    // Mise à jour des options d'affichage et de style
    if (signature.showLogo !== undefined) setShowLogo(signature.showLogo);
  
    if (signature.profilePhotoSize !== undefined) setProfilePhotoSize(signature.profilePhotoSize);
    if (signature.primaryColor !== undefined) setPrimaryColor(signature.primaryColor);
    if (signature.secondaryColor !== undefined) setSecondaryColor(signature.secondaryColor);
    if (signature.textAlignment !== undefined) setTextAlignment(signature.textAlignment as 'left' | 'center' | 'right');
    if (signature.verticalSpacing !== undefined) setVerticalSpacing(signature.verticalSpacing);
    if (signature.horizontalSpacing !== undefined) setHorizontalSpacing(signature.horizontalSpacing);
  
    if (signature.fontSize !== undefined) setFontSize(signature.fontSize);
    if (signature.textStyle !== undefined) setTextStyle(signature.textStyle as 'normal' | 'overline' | 'underline' | 'strikethrough');
    if (signature.fontFamily !== undefined) setFontFamily(signature.fontFamily);
    if (signature.socialLinksDisplayMode !== undefined) setSocialLinksDisplayMode(signature.socialLinksDisplayMode as 'icons' | 'text');
    if (signature.socialLinksIconStyle !== undefined) setSocialLinksIconStyle(signature.socialLinksIconStyle);
  };

  // Méthode pour obtenir le nom complet
  const getFullName = () => {
    const { firstName, lastName } = signatureData;
    return firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || '';
  };

  // Valeur du contexte à fournir
  const value = {
    signatureData,
    setSignatureData,
    showCompanyName,
    setShowCompanyName,
    showSocialLinks,
    setShowSocialLinks,
    showJobTitle,
    setShowJobTitle,
    showLogo,
    setShowLogo,
    showProfilePhoto,
    setShowProfilePhoto,
    showEmailIcon,
    setShowEmailIcon,
    showPhoneIcon,
    setShowPhoneIcon,
    showMobilePhoneIcon,
    setShowMobilePhoneIcon,
    showAddressIcon,
    setShowAddressIcon,
    showWebsiteIcon,
    setShowWebsiteIcon,
    logoSize,
    setLogoSize,
    profilePhotoSize,
    setProfilePhotoSize,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    textAlignment,
    setTextAlignment,
    verticalSpacing,
    setVerticalSpacing,
    horizontalSpacing,
    setHorizontalSpacing,
    iconTextSpacing,
    setIconTextSpacing,
    fontSize,
    setFontSize,
    textStyle,
    setTextStyle,
    fontFamily,
    setFontFamily,
    socialLinksDisplayMode,
    setSocialLinksDisplayMode,
    socialLinksIconStyle,
    setSocialLinksIconStyle,
    socialLinksIconColor,
    setSocialLinksIconColor,
    updateFromSignature,
    getFullName
  };

  return (
    <EmailSignatureContext.Provider value={value}>
      {children}
    </EmailSignatureContext.Provider>
  );
};
