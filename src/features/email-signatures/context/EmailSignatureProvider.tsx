import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { EmailSignature } from '../types';
import { EmailSignatureContext, type SignatureData, type EmailSignatureContextType } from './EmailSignatureContext';

// Props pour le provider
export interface EmailSignatureProviderProps {
  children: React.ReactNode;
  initialSignature?: Partial<EmailSignature>;
  // Propriétés de base
  initialFirstName?: string;
  initialLastName?: string;
  initialJobTitle?: string;
  initialCompanyName?: string;
  initialEmail?: string;
  initialPhone?: string;
  initialMobilePhone?: string;
  initialWebsite?: string;
  initialAddress?: string;
  initialCompanyLogo?: string;
  initialProfilePhoto?: string;
  initialSocialLinks?: Record<string, string>;
  initialCompanyWebsite?: string;
  initialCompanyAddress?: string;
  // Propriétés de style
  initialPrimaryColor?: string;
  initialSecondaryColor?: string;
  initialFontFamily?: string;
  initialFontSize?: number;
  initialLogoSize?: number;
  initialProfilePhotoSize?: number;
  initialIconTextSpacing?: number;
  initialSocialLinksIconColor?: string;
  // Propriétés d'affichage
  initialShowPhoneIcon?: boolean;
  initialShowMobilePhoneIcon?: boolean;
  initialShowEmailIcon?: boolean;
  initialShowAddressIcon?: boolean;
  initialShowWebsiteIcon?: boolean;
  // Propriétés de la photo de profil
  initialProfilePhotoToDelete?: boolean;
}

// Provider du contexte
export const EmailSignatureProvider: React.FC<EmailSignatureProviderProps> = (props) => {
  // Propriétés optionnelles avec des valeurs par défaut
  const { initialSignature = {} } = props;

  // Extraire le prénom et le nom du nom complet si fourni
  const getInitials = (fullName: string) => {
    const parts = fullName.split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || ''
    };
  };
  
  const initials = initialSignature?.fullName ? 
    getInitials(initialSignature.fullName) : 
    { firstName: '', lastName: '' };

  // Initialisation des données de signature avec des valeurs par défaut
  const initialSignatureData: SignatureData = {
    // Propriétés de base
    id: initialSignature?.id || '',
    name: initialSignature?.name || 'Nouvelle signature',
    isDefault: initialSignature?.isDefault || false,
    templateId: initialSignature?.templateId?.toString() || '0',
    createdAt: initialSignature?.createdAt || new Date().toISOString(),
    updatedAt: initialSignature?.updatedAt,
    
    // Informations personnelles
    fullName: initialSignature?.fullName || '',
    firstName: initials.firstName,
    lastName: initials.lastName,
    jobTitle: initialSignature?.jobTitle || '',
    email: initialSignature?.email || '',
    phone: initialSignature?.phone || '',
    mobilePhone: initialSignature?.mobilePhone || '',
    website: initialSignature?.website || '',
    address: initialSignature?.address || '',
    
    // Informations de l'entreprise
    companyName: initialSignature?.companyName || '',
    
    // Propriétés de style
    primaryColor: initialSignature?.primaryColor || '#5b50ff',
    secondaryColor: initialSignature?.secondaryColor || '#333333',
    fontFamily: initialSignature?.fontFamily || 'Arial, sans-serif',
    fontSize: initialSignature?.fontSize || 12,
    textStyle: initialSignature?.textStyle || 'normal',
    
    // Logo et photo de profil
    logoUrl: initialSignature?.logoUrl || '',
    showLogo: initialSignature?.showLogo !== undefined ? initialSignature.showLogo : true,
    profilePhotoUrl: initialSignature?.profilePhotoUrl || '',
    profilePhotoBase64: initialSignature?.profilePhotoBase64 || null,
    profilePhotoSize: initialSignature?.profilePhotoSize || 80,
    
    // Mise en page
    layout: (initialSignature?.layout === 'horizontal' || initialSignature?.layout === 'vertical') 
      ? initialSignature.layout 
      : 'horizontal',
    horizontalSpacing: initialSignature?.horizontalSpacing || 16,
    verticalSpacing: initialSignature?.verticalSpacing || 8,
    textAlignment: initialSignature?.textAlignment || 'left',
    
    // Réseaux sociaux
    socialLinks: initialSignature?.socialLinks || {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    socialLinksDisplayMode: (initialSignature?.socialLinksDisplayMode === 'icons' || 
      initialSignature?.socialLinksDisplayMode === 'text' || 
      initialSignature?.socialLinksDisplayMode === 'both')
      ? initialSignature.socialLinksDisplayMode 
      : 'icons',
    socialLinksPosition: (initialSignature?.socialLinksPosition === 'bottom' || 
      initialSignature?.socialLinksPosition === 'left' || 
      initialSignature?.socialLinksPosition === 'right' ||
      initialSignature?.socialLinksPosition === 'below-personal')
      ? initialSignature.socialLinksPosition 
      : 'bottom',
    socialLinksIconStyle: (initialSignature?.socialLinksIconStyle === 'plain' || 
      initialSignature?.socialLinksIconStyle === 'rounded' || 
      initialSignature?.socialLinksIconStyle === 'circle' || 
      initialSignature?.socialLinksIconStyle === 'filled')
      ? initialSignature.socialLinksIconStyle 
      : 'plain',
    
    // Options d'affichage
    showEmailIcon: initialSignature?.showEmailIcon !== false,
    showPhoneIcon: initialSignature?.showPhoneIcon !== false,
    showAddressIcon: initialSignature?.showAddressIcon !== false,
    showWebsiteIcon: initialSignature?.showWebsiteIcon !== false,
  };
  
  // États pour les options d'affichage
  const [showCompanyName, setShowCompanyName] = useState<boolean>(true);
  const [showSocialLinks, setShowSocialLinks] = useState<boolean>(true);
  const [showJobTitle, setShowJobTitle] = useState<boolean>(true);
  const [showLogo, setShowLogo] = useState<boolean>(initialSignature?.showLogo !== false);
  const [showProfilePhoto, setShowProfilePhoto] = useState<boolean>(true);
  const [showEmailIcon, setShowEmailIcon] = useState<boolean>(initialSignature?.showEmailIcon !== false);
  const [showPhoneIcon, setShowPhoneIcon] = useState<boolean>(initialSignature?.showPhoneIcon !== false);
  const [showMobilePhoneIcon, setShowMobilePhoneIcon] = useState<boolean>(false); // Désactivé par défaut car en doublon
  const [showAddressIcon, setShowAddressIcon] = useState<boolean>(initialSignature?.showAddressIcon !== false);
  const [showWebsiteIcon, setShowWebsiteIcon] = useState<boolean>(initialSignature?.showWebsiteIcon !== false);
  
  // États pour les styles et la mise en page
  const [logoSize, setLogoSize] = useState<number>(100); // Propriété personnalisée non incluse dans EmailSignature
  const [profilePhotoSize, setProfilePhotoSize] = useState<number>(initialSignature?.profilePhotoSize || 80);
  const [primaryColor, setPrimaryColor] = useState<string>(initialSignature?.primaryColor || '#5b50ff');
  const [secondaryColor, setSecondaryColor] = useState<string>(initialSignature?.secondaryColor || '#333333');
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right'>(
    (initialSignature?.textAlignment as 'left' | 'center' | 'right') || 'left'
  );
  const [fontFamily, setFontFamily] = useState<string>(initialSignature?.fontFamily || 'Arial, sans-serif');
  const [fontSize, setFontSize] = useState<number>(initialSignature?.fontSize || 12);
  const [textStyle, setTextStyle] = useState<'normal' | 'overline' | 'underline' | 'strikethrough'>(
    (initialSignature?.textStyle as 'normal' | 'overline' | 'underline' | 'strikethrough') || 'normal'
  );
  const [socialLinksIconStyle, setSocialLinksIconStyle] = useState<'plain' | 'rounded' | 'circle' | 'filled'>(
    (initialSignature?.socialLinksIconStyle as 'plain' | 'rounded' | 'circle' | 'filled') || 'plain'
  );
  
  // Forcer le type de setSocialLinksIconStyle pour inclure 'filled'
  const setSocialLinksIconStyleTyped = setSocialLinksIconStyle as React.Dispatch<React.SetStateAction<'plain' | 'rounded' | 'circle' | 'filled'>>;
  const [socialLinksIconColor, setSocialLinksIconColor] = useState<string>('#000000'); // Propriété personnalisée
  const [socialLinksIconSize, setSocialLinksIconSize] = useState<number>(16); // Propriété personnalisée
  const [socialLinksIconBgColor, setSocialLinksIconBgColor] = useState<string>('transparent'); // Propriété personnalisée
  const [socialLinksDisplayMode, setSocialLinksDisplayMode] = useState<'icons' | 'text' | 'both'>(
    (initialSignature?.socialLinksDisplayMode === 'icons' || 
     initialSignature?.socialLinksDisplayMode === 'text' || 
     initialSignature?.socialLinksDisplayMode === 'both')
      ? initialSignature.socialLinksDisplayMode 
      : 'icons'
  );
  
  const [socialLinksPosition, setSocialLinksPosition] = useState<'bottom' | 'right' | 'left' | 'below-personal'>(
    (initialSignature?.socialLinksPosition === 'bottom' || 
     initialSignature?.socialLinksPosition === 'left' || 
     initialSignature?.socialLinksPosition === 'right' ||
     initialSignature?.socialLinksPosition === 'below-personal')
      ? initialSignature.socialLinksPosition 
      : 'bottom'
  );
  
  const [iconTextSpacing, setIconTextSpacing] = useState<number>(8); // Propriété personnalisée
  
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>(
    (initialSignature?.layout === 'horizontal' || initialSignature?.layout === 'vertical')
      ? initialSignature.layout 
      : 'horizontal'
  );
  const [horizontalSpacing, setHorizontalSpacing] = useState<number>(initialSignature?.horizontalSpacing || 16);
  const [verticalSpacing, setVerticalSpacing] = useState<number>(initialSignature?.verticalSpacing || 8);
  const [verticalAlignment, setVerticalAlignment] = useState<'left' | 'center' | 'right'>(
    (initialSignature?.verticalAlignment as 'left' | 'center' | 'right') || 'left'
  );
  
  // État pour les données de signature
  const [signatureData, setSignatureData] = useState<SignatureData>(initialSignatureData);

  // Effet pour synchroniser les états locaux avec les changements de signatureData
  useEffect(() => {
    if (!signatureData) return;
    
    const updateStateIfChanged = <T,>(
      currentValue: T,
      newValue: T | undefined,
      setter: (value: T) => void
    ) => {
      if (newValue !== undefined && newValue !== currentValue) {
        setter(newValue);
      }
    };
    
    // Mise à jour des couleurs
    updateStateIfChanged(primaryColor, signatureData.primaryColor, setPrimaryColor);
    updateStateIfChanged(secondaryColor, signatureData.secondaryColor, setSecondaryColor);
    
    // Mise à jour de la typographie
    updateStateIfChanged(fontFamily, signatureData.fontFamily || 'Arial, sans-serif', setFontFamily);
    updateStateIfChanged(fontSize, signatureData.fontSize || 12, setFontSize);
    updateStateIfChanged(textStyle, signatureData.textStyle || 'normal', setTextStyle);
    
    // Mise à jour de l'alignement
    if (signatureData.textAlignment) {
      updateStateIfChanged(
        textAlignment, 
        signatureData.textAlignment as 'left' | 'center' | 'right', 
        setTextAlignment
      );
    }
    
    // Mise à jour des styles des icônes sociales
    if (signatureData.socialLinksIconStyle) {
      // Définir un type pour le style d'icône qui inclut 'filled'
      type SocialIconStyle = 'plain' | 'rounded' | 'circle' | 'filled';
      
      // Convertir 'filled' en 'plain' pour la compatibilité
      const validIconStyle = (signatureData.socialLinksIconStyle === 'filled' 
        ? 'plain' 
        : signatureData.socialLinksIconStyle) as SocialIconStyle;
        
      updateStateIfChanged<SocialIconStyle>(
        socialLinksIconStyle as SocialIconStyle, 
        validIconStyle,
        setSocialLinksIconStyle as (value: SocialIconStyle) => void
      );
    }
    
    // Mise à jour des options d'affichage
    updateStateIfChanged(showLogo, signatureData.showLogo, setShowLogo);
    
    // Mise à jour des modes d'affichage
    updateStateIfChanged(socialLinksDisplayMode, signatureData.socialLinksDisplayMode, setSocialLinksDisplayMode);
    updateStateIfChanged(socialLinksPosition, signatureData.socialLinksPosition, setSocialLinksPosition);
    
  }, [
    signatureData, 
    primaryColor, secondaryColor, fontFamily, fontSize, textStyle, 
    textAlignment, socialLinksIconStyle, showLogo, 
    socialLinksDisplayMode, socialLinksPosition
  ]);

  // Fonction pour mettre à jour les données de signature
  const updateFromSignature = useCallback((signature: Partial<EmailSignature>) => {
    setSignatureData(prev => {
      // Créer une copie des mises à jour en filtrant les propriétés non désirées
      const { socialLinksIconStyle, ...restSignature } = signature;
      const updates: Partial<SignatureData> = { ...restSignature };
      
      // Gérer spécifiquement les propriétés qui nécessitent un traitement spécial
      if (signature.templateId !== undefined) {
        updates.templateId = signature.templateId.toString();
      }
      
      // Mettre à jour les états locaux si nécessaire
      if (signature.primaryColor) setPrimaryColor(signature.primaryColor);
      if (signature.secondaryColor) setSecondaryColor(signature.secondaryColor);
      if (signature.fontFamily) setFontFamily(signature.fontFamily);
      if (signature.fontSize) setFontSize(signature.fontSize);
      if (signature.textAlignment) setTextAlignment(signature.textAlignment as 'left' | 'center' | 'right');
      
      // Gérer le style des icônes sociales
      if (socialLinksIconStyle) {
        // Convertir 'filled' en 'plain' pour la compatibilité
        const validIconStyle = socialLinksIconStyle === 'filled' 
          ? 'plain' 
          : socialLinksIconStyle as 'plain' | 'rounded' | 'circle' | 'filled';
        setSocialLinksIconStyle(validIconStyle);
      }
      
      if (signature.socialLinksDisplayMode) setSocialLinksDisplayMode(signature.socialLinksDisplayMode);
      if (signature.socialLinksPosition) setSocialLinksPosition(signature.socialLinksPosition);
      if (signature.showLogo !== undefined) setShowLogo(signature.showLogo);
      
      // Fusionner les liens sociaux existants avec les nouveaux
      if (signature.socialLinks) {
        updates.socialLinks = {
          ...prev.socialLinks,
          ...signature.socialLinks
        };
      }
      
      return {
        ...prev,
        ...updates
      };
    });
  }, []);

  // Valeur du contexte à fournir
  const contextValue: EmailSignatureContextType = useMemo(() => ({
    // Données de signature
    signatureData,
    setSignatureData,
    
    // Options d'affichage
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
    
    // Styles et mise en page
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
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    textStyle,
    setTextStyle,
    socialLinksIconStyle,
    setSocialLinksIconStyle: setSocialLinksIconStyleTyped,
    socialLinksIconColor,
    setSocialLinksIconColor,
    socialLinksIconSize,
    setSocialLinksIconSize,
    socialLinksIconBgColor,
    setSocialLinksIconBgColor,
    socialLinksDisplayMode,
    setSocialLinksDisplayMode,
    socialLinksPosition,
    setSocialLinksPosition,
    iconTextSpacing,
    setIconTextSpacing,
    layout,
    setLayout,
    horizontalSpacing,
    setHorizontalSpacing,
    verticalSpacing,
    setVerticalSpacing,
    verticalAlignment,
    setVerticalAlignment,
    
    // Méthodes utilitaires
    updateFromSignature,
    getFullName: () => `${signatureData.firstName || ''} ${signatureData.lastName || ''}`.trim()
  }), [
    // Dépendances
    signatureData,
    showCompanyName, showSocialLinks, showJobTitle, showLogo, showProfilePhoto,
    showEmailIcon, showPhoneIcon, showMobilePhoneIcon, showAddressIcon, showWebsiteIcon,
    logoSize, profilePhotoSize, primaryColor, secondaryColor, textAlignment,
    fontFamily, fontSize, textStyle, socialLinksIconStyle, setSocialLinksIconStyleTyped, socialLinksIconColor, 
    socialLinksIconSize, socialLinksIconBgColor, socialLinksDisplayMode, 
    socialLinksPosition, iconTextSpacing, layout, horizontalSpacing, 
    verticalSpacing, verticalAlignment, updateFromSignature
  ]);

  return (
    <EmailSignatureContext.Provider value={contextValue}>
      {props.children}
    </EmailSignatureContext.Provider>
  );
};
