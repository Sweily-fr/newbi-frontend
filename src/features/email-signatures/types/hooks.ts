import { EmailSignature, EmailSignatureFormErrors, SocialLinks } from './index';

/**
 * Props pour le hook useEmailSignatureForm
 */
export interface UseEmailSignatureFormProps {
  /**
   * Données initiales pour le formulaire
   */
  initialData?: Partial<EmailSignature>;
  
  /**
   * Fonction appelée lors de la soumission du formulaire
   */
  onSubmit?: (data: EmailSignature) => Promise<void> | void;
  
  /**
   * Fonction appelée à chaque modification des données du formulaire
   */
  onChange?: (data: Partial<EmailSignature>) => void;
}

/**
 * Valeurs de retour du hook useEmailSignatureForm
 */
export interface UseEmailSignatureFormReturn {
  // Données de la signature
  id: string;
  signatureData: EmailSignature;
  errors: EmailSignatureFormErrors;
  submitError: string | null;
  isSubmitting: boolean;
  
  // Méthodes de mise à jour
  updateSignatureData: <K extends keyof EmailSignature>(
    key: K,
    value: EmailSignature[K]
  ) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  validateField: (field: keyof EmailSignature) => boolean;
  validateForm: () => boolean;
  
  // États pour les informations de l'entreprise
  companyName: string;
  setCompanyName: (value: string) => void;
  
  // États pour les réseaux sociaux
  socialLinks: SocialLinks;
  setSocialLinks: (value: SocialLinks) => void;
  updateSocialLink: (network: keyof SocialLinks, value: string) => void;
  
  // États pour l'apparence
  template: string;
  primaryColor: string;
  setPrimaryColor: (value: string) => void;
  secondaryColor: string;
  setSecondaryColor: (value: string) => void;
  logoUrl: string;
  setLogoUrl: (value: string) => void;
  showLogo: boolean;
  setShowLogo: (value: boolean) => void;
  isDefault: boolean;
  setIsDefault: (value: boolean) => void;
  companyInfoImported: boolean;
  
  // États pour la photo de profil
  profilePhotoUrl: string;
  setProfilePhotoUrl: (value: string) => void;
  profilePhotoBase64: string | null;
  setProfilePhotoBase64: (value: string | null) => void;
  profilePhotoToDelete: boolean;
  setProfilePhotoToDelete: (value: boolean) => void;
  handleProfilePhotoChange: (file: File | null) => void;
  handleRemoveProfilePhoto: () => void;
  
  // Options d'affichage des icônes
  showEmailIcon: boolean;
  setShowEmailIcon: (value: boolean) => void;
  showPhoneIcon: boolean;
  setShowPhoneIcon: (value: boolean) => void;
  showAddressIcon: boolean;
  setShowAddressIcon: (value: boolean) => void;
  showWebsiteIcon: boolean;
  setShowWebsiteIcon: (value: boolean) => void;
  
  // Options de mise en page
  layout: 'horizontal' | 'vertical' | 'stacked' | 'sideBySide';
  setLayout: (value: 'horizontal' | 'vertical' | 'stacked' | 'sideBySide') => void;
  textAlignment: 'left' | 'center' | 'right';
  setTextAlignment: (value: 'left' | 'center' | 'right') => void;
  verticalSpacing: number;
  setVerticalSpacing: (value: number) => void;
  horizontalSpacing: number;
  setHorizontalSpacing: (value: number) => void;
  verticalAlignment: 'top' | 'middle' | 'bottom' | 'left' | 'center' | 'right';
  setVerticalAlignment: (value: 'top' | 'middle' | 'bottom' | 'left' | 'center' | 'right') => void;
  imagesLayout: 'horizontal' | 'vertical' | 'stacked' | 'sideBySide';
  setImagesLayout: (value: 'horizontal' | 'vertical' | 'stacked' | 'sideBySide') => void;
  
  // Options des réseaux sociaux
  socialLinksDisplayMode: 'icons' | 'text' | 'both';
  setSocialLinksDisplayMode: (value: 'icons' | 'text' | 'both') => void;
  socialLinksIconStyle: 'plain' | 'rounded' | 'circle' | 'filled';
  setSocialLinksIconStyle: (value: 'plain' | 'rounded' | 'circle' | 'filled') => void;
  socialLinksPosition: 'bottom' | 'right' | 'left' | 'below-personal';
  setSocialLinksPosition: (value: 'bottom' | 'right' | 'left' | 'below-personal') => void;
  
  // Options de typographie
  fontFamily: string;
  setFontFamily: (value: string) => void;
  fontSize: number;
  setFontSize: (value: number) => void;
  iconTextSpacing: number;
  setIconTextSpacing: (value: number) => void;
}
