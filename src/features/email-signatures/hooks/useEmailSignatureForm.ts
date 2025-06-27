import { useState, useEffect, useCallback, useMemo } from 'react';
import { EMAIL_PATTERN } from '../../../constants/formValidations';
import { Notification } from '../../../components/common/Notification';
import { DEFAULT_PROFILE_PHOTO_SIZE } from '../constants/images';
import { 
  EmailSignature, 
  EmailSignatureFormErrors, 
  SocialLinks,
  UseEmailSignatureFormProps,
  UseEmailSignatureFormReturn
} from '../types/index';

export function useEmailSignatureForm({
  initialData,
  onSubmit,
  onChange
}: UseEmailSignatureFormProps): UseEmailSignatureFormReturn {
  // Récupérer les informations de l'entreprise
  const company = useMemo(() => ({
    name: '',
    logo: '',
    address: {
      street: '',
      postalCode: '',
      city: '',
      country: ''
    },
    website: '',
    phone: ''
  }), []);
  
  // Note: Dans une implémentation réelle, ces données pourraient être récupérées
  // depuis une API GraphQL ou un store global
  
  // États pour les champs du formulaire
  const id = initialData?.id;
  const [name, setName] = useState(initialData?.name || '');
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [mobilePhone, setMobilePhone] = useState(initialData?.mobilePhone || '');
  const [website, setWebsite] = useState(initialData?.website || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [companyName, setCompanyName] = useState(initialData?.companyName || '');
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(initialData?.socialLinks || {
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: ''
  });
  
  // Template est défini par défaut à 'simple' et n'est plus modifiable via l'interface
  const template = initialData?.template || 'simple';
  const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || '#5b50ff');
  const [secondaryColor, setSecondaryColor] = useState(initialData?.secondaryColor || '#f5f5f5');
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || '');
  const [showLogo, setShowLogo] = useState(initialData?.showLogo !== undefined ? initialData.showLogo : true);
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);
  
  // États pour la mise en page et le style
  const [layout, setLayout] = useState<'horizontal' | 'vertical' | 'stacked' | 'sideBySide'>(
    (initialData?.layout === 'horizontal' || 
     initialData?.layout === 'vertical' ||
     initialData?.layout === 'stacked' ||
     initialData?.layout === 'sideBySide')
      ? initialData.layout 
      : 'vertical'
  );
  const [horizontalSpacing, setHorizontalSpacing] = useState(initialData?.horizontalSpacing || 20);
  const [verticalSpacing, setVerticalSpacing] = useState(initialData?.verticalSpacing || 10);
  const [verticalAlignment, setVerticalAlignment] = useState(initialData?.verticalAlignment || 'left');
  const [imagesLayout, setImagesLayout] = useState<'horizontal' | 'vertical' | 'stacked' | 'sideBySide'>(
    (initialData?.imagesLayout === 'horizontal' || 
     initialData?.imagesLayout === 'vertical' ||
     initialData?.imagesLayout === 'stacked' ||
     initialData?.imagesLayout === 'sideBySide')
      ? initialData.imagesLayout 
      : 'vertical'
  );
  const [fontFamily, setFontFamily] = useState(initialData?.fontFamily || 'Arial, sans-serif');
  const [fontSize, setFontSize] = useState(initialData?.fontSize || 14);
  
  // États pour les réseaux sociaux
  const [socialLinksDisplayMode, setSocialLinksDisplayMode] = useState<'icons' | 'text' | 'both'>(
    (initialData?.socialLinksDisplayMode === 'icons' || 
     initialData?.socialLinksDisplayMode === 'text' || 
     initialData?.socialLinksDisplayMode === 'both')
      ? initialData.socialLinksDisplayMode 
      : 'text'
  );
  const [socialLinksPosition, setSocialLinksPosition] = useState<'bottom' | 'left' | 'right' | 'below-personal'>(
    (initialData?.socialLinksPosition === 'bottom' || 
     initialData?.socialLinksPosition === 'left' || 
     initialData?.socialLinksPosition === 'right' ||
     initialData?.socialLinksPosition === 'below-personal')
      ? initialData.socialLinksPosition 
      : 'bottom'
  );
  const [socialLinksIconStyle, setSocialLinksIconStyle] = useState<'plain' | 'rounded' | 'circle' | 'filled'>(
    (initialData?.socialLinksIconStyle === 'plain' || 
     initialData?.socialLinksIconStyle === 'rounded' || 
     initialData?.socialLinksIconStyle === 'circle' || 
     initialData?.socialLinksIconStyle === 'filled')
      ? initialData.socialLinksIconStyle 
      : 'plain'
  );
  
  // États pour la gestion de la photo de profil
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(initialData?.profilePhotoUrl || '');
  const [profilePhotoBase64, setProfilePhotoBase64] = useState<string | null>(null);
  const [previewProfilePhoto, setPreviewProfilePhoto] = useState<string | null>(null);
  const [profilePhotoToDelete, setProfilePhotoToDelete] = useState(false);
  const [profilePhotoSize, setProfilePhotoSize] = useState(initialData?.profilePhotoSize || DEFAULT_PROFILE_PHOTO_SIZE);
  
  // États pour la gestion des erreurs
  const [errors, setErrors] = useState<EmailSignatureFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mettre à jour les données en temps réel pour la prévisualisation
  useEffect(() => {
    if (onChange) {
      const currentData: Partial<EmailSignature> = {
        id,
        name,
        fullName,
        jobTitle,
        email,
        phone,
        mobilePhone,
        website,
        address,
        companyName,
        template,
        primaryColor,
        secondaryColor,
        logoUrl,
        showLogo,
        isDefault,
        socialLinks,
        profilePhotoUrl: previewProfilePhoto || profilePhotoUrl,
        profilePhotoSize,
        layout,
        horizontalSpacing,
        verticalSpacing,
        verticalAlignment,
        imagesLayout,
        fontFamily,
        fontSize,
        socialLinksDisplayMode,
        socialLinksPosition,
        socialLinksIconStyle
      };
      
      onChange(currentData);
    }
  }, [
    name, fullName, jobTitle, email, phone, mobilePhone, website, address, companyName,
    primaryColor, secondaryColor, logoUrl, showLogo, isDefault, socialLinks,
    previewProfilePhoto, profilePhotoUrl, profilePhotoSize,
    layout, horizontalSpacing, verticalSpacing, verticalAlignment, imagesLayout,
    fontFamily, fontSize, socialLinksDisplayMode, socialLinksPosition, socialLinksIconStyle,
    onChange, id, template
  ]);
  
  // Fonction pour obtenir l'URL complète du logo
  const getFullLogoUrl = useCallback((relativePath: string | undefined): string => {
    if (!relativePath) return '';
    
    // Si le chemin est déjà une URL complète, la retourner telle quelle
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }
    
    // Sinon, construire l'URL complète
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    return `${baseUrl}${relativePath}`;
  }, []);
  
  // Fonction pour mettre à jour un réseau social spécifique
  const updateSocialLink = useCallback((network: keyof SocialLinks, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [network]: value
    }));
  }, []);
  
  // Fonction pour importer les informations de l'entreprise
  const importCompanyInfo = useCallback(() => {
    if (company) {
      setCompanyName(company.name);
      
      // Formatage de l'adresse complète
      const addressParts = [];
      if (company.address?.street) addressParts.push(company.address.street);
      if (company.address?.postalCode) addressParts.push(company.address.postalCode);
      if (company.address?.city) addressParts.push(company.address.city);
      if (company.address?.country) addressParts.push(company.address.country);
      setAddress(addressParts.join(', '));
      
      setLogoUrl(getFullLogoUrl(company.logo));
      setShowLogo(true);
      
      // Marquer que les informations de l'entreprise ont été importées
      setCompanyInfoImported(true);
      
      // Effacer les erreurs potentielles après le remplissage
      setErrors(prev => ({
        ...prev,
        companyName: '',
        address: '',
        logoUrl: ''
      }));
    }
  }, [company, getFullLogoUrl]);
  
  // Gestion de la sélection d'un fichier image pour la photo de profil
  const handleProfilePhotoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      Notification.error('Le fichier est trop volumineux. Taille maximale: 2MB', {
        duration: 5000,
        position: 'bottom-left'
      });
      return;
    }
    
    // Créer un objet FileReader pour lire le fichier
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64String = event.target.result as string;
        setProfilePhotoBase64(base64String);
        setPreviewProfilePhoto(base64String);
        setProfilePhotoToDelete(false);
      }
    };
    
    reader.readAsDataURL(file);
  }, []);
  
  // Fonction pour supprimer la photo de profil
  const handleProfilePhotoDelete = useCallback(() => {
    // Réinitialiser toutes les valeurs liées à la photo de profil
    setProfilePhotoBase64(null);
    setPreviewProfilePhoto('');
    setProfilePhotoUrl('');
    setProfilePhotoToDelete(true);
    
    // Mettre à jour le formulaire si onChange est défini
    if (onChange) {
      onChange({
        profilePhotoBase64: null,
        profilePhotoUrl: '',
        profilePhotoToDelete: true
      });
    }
    
    // Forcer un re-rendu
    setTimeout(() => {
      setProfilePhotoToDelete(prev => !prev); // Inverser pour forcer un re-rendu
    }, 50);
  }, [onChange, setProfilePhotoUrl]);
  
  // Validation du formulaire
  const validateForm = useCallback((): boolean => {
    const newErrors: EmailSignatureFormErrors = {};
    
    if (!name.trim()) newErrors.name = 'Le nom est requis';
    if (!fullName.trim()) newErrors.fullName = 'Le nom complet est requis';
    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!EMAIL_PATTERN.test(email)) {
      newErrors.email = 'Veuillez entrer un email valide';
    }
    if (!companyName.trim()) newErrors.companyName = 'Le nom de l\'entreprise est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, fullName, email, companyName]);
  
  // Gestion de la soumission du formulaire
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Réinitialiser les erreurs précédentes
    setSubmitError(null);
    
    // Validation du formulaire
    const isValid = validateForm();
    
    if (!isValid) {
      // Les erreurs sont déjà définies dans validateForm
      return;
    }
    
    // Indiquer que la soumission est en cours
    setIsSubmitting(true);
    
    try {
      // Préparation des données à envoyer
      const signatureData: EmailSignature = {
        id: id || '',
        name: name || '',
        fullName: fullName || '',
        jobTitle: jobTitle || '',
        email: email || '',
        phone: phone || '',
        mobilePhone: mobilePhone || '',
        website: website || '',
        companyName: companyName || '',
        address: address || '',
        template: template || 'default',
        primaryColor: primaryColor || '#000000',
        secondaryColor: secondaryColor || '#666666',
        socialLinks: socialLinks || {},
        logoUrl: logoUrl || '',
        showLogo: showLogo ?? true,
        isDefault: isDefault ?? false,
        profilePhotoUrl: profilePhotoUrl || '',
        profilePhotoBase64: profilePhotoBase64 || null,
        profilePhotoToDelete: profilePhotoToDelete ?? false,
        profilePhotoSize,
        layout,
        horizontalSpacing,
        verticalSpacing,
        verticalAlignment,
        imagesLayout,
        fontFamily,
        fontSize,
        socialLinksDisplayMode,
        socialLinksPosition,
        socialLinksIconStyle
      };
      
      // Vérifier que onSubmit est une fonction avant de l'appeler
      if (onSubmit) {
        // TypeScript sait maintenant que onSubmit est une fonction car nous avons vérifié son existence
        await (onSubmit as (data: EmailSignature) => Promise<void> | void)(signatureData);
      } else {
        console.warn('Aucune fonction onSubmit fournie au hook useEmailSignatureForm');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      setSubmitError('Une erreur est survenue lors de la soumission du formulaire');
      setIsSubmitting(false);
    }
  }, [
    id, name, fullName, jobTitle, email, phone, mobilePhone, website, companyName, address,
    template, primaryColor, secondaryColor, socialLinks, logoUrl, showLogo, isDefault,
    profilePhotoUrl, profilePhotoBase64, profilePhotoToDelete, profilePhotoSize,
    layout, horizontalSpacing, verticalSpacing, verticalAlignment, imagesLayout,
    fontFamily, fontSize, socialLinksDisplayMode, socialLinksPosition, socialLinksIconStyle,
    onSubmit, validateForm
  ]);
  
  // Fonction pour annuler le formulaire
  const handleCancel = useCallback(() => {
    // Réinitialiser le formulaire avec les données initiales
    if (initialData) {
      setName(initialData.name || '');
      setFullName(initialData.fullName || '');
      setJobTitle(initialData.jobTitle || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setMobilePhone(initialData.mobilePhone || '');
      setWebsite(initialData.website || '');
      setAddress(initialData.address || '');
      setCompanyName(initialData.companyName || '');
      setPrimaryColor(initialData.primaryColor || '#000000');
      setSecondaryColor(initialData.secondaryColor || '#666666');
      setLogoUrl(initialData.logoUrl || '');
      setShowLogo(initialData.showLogo ?? true);
      setIsDefault(initialData.isDefault ?? false);
      setProfilePhotoUrl(initialData.profilePhotoUrl || '');
      setProfilePhotoBase64(initialData.profilePhotoBase64 || null);
      setProfilePhotoToDelete(initialData.profilePhotoToDelete ?? false);
      setProfilePhotoSize(initialData.profilePhotoSize || 0);
      
      // Gestion des valeurs de mise en page avec des valeurs par défaut sûres
      const safeLayout = initialData.layout === 'stacked' || initialData.layout === 'sideBySide' 
        ? initialData.layout 
        : 'stacked';
      setLayout(safeLayout);
      
      setHorizontalSpacing(initialData.horizontalSpacing || 20);
      setVerticalSpacing(initialData.verticalSpacing || 10);
      
      const safeVerticalAlignment = ['top', 'middle', 'bottom', 'left', 'center', 'right'].includes(initialData.verticalAlignment || '')
        ? initialData.verticalAlignment as 'top' | 'middle' | 'bottom' | 'left' | 'center' | 'right'
        : 'left';
      setVerticalAlignment(safeVerticalAlignment);
      
      const safeImagesLayout = initialData.imagesLayout === 'stacked' || initialData.imagesLayout === 'sideBySide'
        ? initialData.imagesLayout
        : 'vertical';
      setImagesLayout(safeImagesLayout);
      
      setFontFamily(initialData.fontFamily || 'Arial, sans-serif');
      setFontSize(initialData.fontSize || 14);
      
      const safeDisplayMode = ['icons', 'text', 'both'].includes(initialData.socialLinksDisplayMode || '')
        ? initialData.socialLinksDisplayMode as 'icons' | 'text' | 'both'
        : 'text';
      setSocialLinksDisplayMode(safeDisplayMode);
      
      const safePosition = ['bottom', 'left', 'right'].includes(initialData.socialLinksPosition || '')
        ? initialData.socialLinksPosition as 'bottom' | 'left' | 'right'
        : 'bottom';
      setSocialLinksPosition(safePosition);
      
      const safeIconStyle = ['plain', 'rounded', 'circle', 'filled'].includes(initialData.socialLinksIconStyle || '')
        ? initialData.socialLinksIconStyle as 'plain' | 'rounded' | 'circle' | 'filled'
        : 'plain';
      setSocialLinksIconStyle(safeIconStyle);
    }
    setErrors({});
    setSubmitError(null);
  }, [initialData]);
  
  // Fonction pour mettre à jour les données de la signature
  const updateSignatureData = useCallback(<K extends keyof EmailSignature>(
    key: K,
    value: EmailSignature[K]
  ) => {
    // Mise à jour de l'état local en fonction de la clé
    switch (key) {
      case 'name': setName(value as string); break;
      case 'fullName': setFullName(value as string); break;
      case 'jobTitle': setJobTitle(value as string); break;
      case 'email': setEmail(value as string); break;
      case 'phone': setPhone(value as string); break;
      case 'mobilePhone': setMobilePhone(value as string); break;
      case 'website': setWebsite(value as string); break;
      case 'address': setAddress(value as string); break;
      case 'companyName': setCompanyName(value as string); break;
      case 'primaryColor': setPrimaryColor(value as string); break;
      case 'secondaryColor': setSecondaryColor(value as string); break;
      case 'logoUrl': setLogoUrl(value as string); break;
      case 'showLogo': setShowLogo(!!value); break;
      case 'isDefault': setIsDefault(!!value); break;
      case 'profilePhotoUrl': setProfilePhotoUrl(value as string); break;
      case 'profilePhotoBase64': setProfilePhotoBase64(value as string | null); break;
      case 'profilePhotoToDelete': setProfilePhotoToDelete(!!value); break;
      case 'layout': {
        const layoutValue = value as string;
        if (['stacked', 'sideBySide'].includes(layoutValue)) {
          setLayout(layoutValue as 'stacked' | 'sideBySide');
        }
        break;
      }
      case 'horizontalSpacing': setHorizontalSpacing(Number(value) || 0); break;
      case 'verticalSpacing': setVerticalSpacing(Number(value) || 0); break;
      case 'verticalAlignment': {
        const alignmentValue = value as string;
        if (['top', 'middle', 'bottom', 'left', 'center', 'right'].includes(alignmentValue)) {
          setVerticalAlignment(alignmentValue as 'top' | 'middle' | 'bottom' | 'left' | 'center' | 'right');
        }
        break;
      }
      case 'imagesLayout': {
        const imagesLayoutValue = value as string;
        if (['stacked', 'sideBySide'].includes(imagesLayoutValue)) {
          setImagesLayout(imagesLayoutValue as 'stacked' | 'sideBySide');
        }
        break;
      }
      case 'fontFamily': setFontFamily(value as string); break;
      case 'fontSize': setFontSize(Number(value) || 14); break;
      case 'socialLinksDisplayMode': {
        const displayModeValue = value as string;
        if (['icons', 'text', 'both'].includes(displayModeValue)) {
          setSocialLinksDisplayMode(displayModeValue as 'icons' | 'text' | 'both');
        }
        break;
      }
      case 'socialLinksPosition': {
        const positionValue = value as string;
        if (['bottom', 'left', 'right'].includes(positionValue)) {
          setSocialLinksPosition(positionValue as 'bottom' | 'left' | 'right');
        }
        break;
      }
      case 'socialLinksIconStyle': {
        const iconStyleValue = value as string;
        if (['plain', 'rounded', 'circle', 'filled'].includes(iconStyleValue)) {
          setSocialLinksIconStyle(iconStyleValue as 'plain' | 'rounded' | 'circle' | 'filled');
        }
        break;
      }
      case 'socialLinks': 
        if (value && typeof value === 'object') {
          setSocialLinks(value as SocialLinks);
        }
        break;
      default: break;
    }
    
    // Appeler la fonction onChange si elle est définie
    if (onChange) {
      onChange({ [key]: value } as Partial<EmailSignature>);
    }
  }, [onChange]);
  
  // Préparer l'objet de données de signature
  const signatureData: EmailSignature = {
    id: id || '',
    name,
    fullName,
    jobTitle,
    email,
    phone,
    mobilePhone,
    website,
    address,
    companyName,
    socialLinks,
    primaryColor,
    secondaryColor,
    fontFamily,
    fontSize,
    textStyle: 'normal', // Valeur par défaut
    logoUrl,
    showLogo,
    profilePhotoUrl,
    profilePhotoBase64: profilePhotoBase64 || undefined,
    profilePhotoSize,
    layout,
    horizontalSpacing,
    verticalSpacing,
    verticalAlignment,
    imagesLayout,
    socialLinksDisplayMode,
    socialLinksIconStyle,
    socialLinksPosition,
    isDefault,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return {
    // Données de la signature
    id: id || '',
    signatureData,
    errors,
    submitError,
    isSubmitting,
    
    // Méthodes de mise à jour
    updateSignatureData,
    handleSubmit,
    validateField: (field: keyof EmailSignature) => {
      // Implémentation de base de validateField
      if (field === 'email' && email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }
      return true;
    },
    validateForm,
    
    // États pour les informations de l'entreprise
    companyName,
    setCompanyName,
    
    // États pour les réseaux sociaux
    socialLinks,
    setSocialLinks,
    updateSocialLink,
    
    // États pour l'apparence
    template,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    logoUrl,
    setLogoUrl,
    showLogo,
    setShowLogo,
    isDefault,
    setIsDefault,
    companyInfoImported: false, // Valeur par défaut
    
    // États pour la photo de profil
    profilePhotoUrl,
    setProfilePhotoUrl,
    profilePhotoBase64: profilePhotoBase64 || null,
    setProfilePhotoBase64,
    profilePhotoToDelete,
    setProfilePhotoToDelete,
    handleProfilePhotoChange: (file: File | null) => {
      if (file) {
        // Créer un événement factice pour correspondre au type attendu par handleProfilePhotoSelect
        const fakeEvent = {
          target: {
            files: [file]
          }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleProfilePhotoSelect(fakeEvent);
      }
    },
    handleRemoveProfilePhoto: handleProfilePhotoDelete,
    
    // Options d'affichage des icônes
    showEmailIcon: true, // Valeur par défaut
    setShowEmailIcon: () => {},
    showPhoneIcon: true, // Valeur par défaut
    setShowPhoneIcon: () => {},
    showAddressIcon: true, // Valeur par défaut
    setShowAddressIcon: () => {},
    showWebsiteIcon: true, // Valeur par défaut
    setShowWebsiteIcon: () => {},
    
    // Options de mise en page
    layout,
    setLayout,
    textAlignment: 'left', // Valeur par défaut
    setTextAlignment: () => {},
    verticalSpacing,
    setVerticalSpacing,
    horizontalSpacing,
    setHorizontalSpacing,
    verticalAlignment,
    setVerticalAlignment,
    imagesLayout,
    setImagesLayout,
    
    // Options des réseaux sociaux
    socialLinksDisplayMode,
    setSocialLinksDisplayMode,
    socialLinksIconStyle,
    setSocialLinksIconStyle,
    socialLinksPosition,
    setSocialLinksPosition,
    socialLinksIconColor: '#000000', // Valeur par défaut
    setSocialLinksIconColor: () => {},
    
    // Typographie
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    textStyle: 'normal', // Valeur par défaut
    setTextStyle: () => {},
    
    // Autres méthodes
    handleCancel,
    importCompanyInfo,
    getFullLogoUrl
  };
}
