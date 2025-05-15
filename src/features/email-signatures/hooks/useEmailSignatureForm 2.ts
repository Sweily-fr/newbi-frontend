import { useState, useEffect, useCallback } from 'react';
import { useCompany } from '../../../hooks/useCompany';
import { EMAIL_PATTERN, NAME_REGEX } from '../../../constants/formValidations';
import { Notification } from '../../../components/feedback/Notification';

// Nous importerons les types depuis le dossier types une fois qu'ils seront créés
interface SocialLinks {
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
}

interface EmailSignature {
  id?: string;
  name: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  mobilePhone: string;
  website: string;
  address: string;
  companyName: string;
  template: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  showLogo: boolean;
  isDefault: boolean;
  socialLinks: SocialLinks;
  profilePhotoUrl: string;
  profilePhotoBase64?: string | null;
  profilePhotoToDelete?: boolean;
  profilePhotoSize: number;
  layout: 'horizontal' | 'vertical';
  horizontalSpacing: number;
  verticalSpacing: number;
  verticalAlignment: 'left' | 'center' | 'right';
  imagesLayout: 'horizontal' | 'vertical';
  fontFamily: string;
  fontSize: number;
  socialLinksDisplayMode: 'icons' | 'text';
  socialLinksPosition: 'bottom' | 'right';
  socialLinksIconStyle: 'plain' | 'rounded' | 'circle';
  createdAt?: string;
  updatedAt?: string;
}

interface EmailSignatureFormErrors {
  name?: string;
  fullName?: string;
  email?: string;
  companyName?: string;
  logoUrl?: string;
  address?: string;
  submit?: string;
}

interface UseEmailSignatureFormProps {
  initialData?: Partial<EmailSignature>;
  onSubmit: (data: Partial<EmailSignature>) => void;
  onChange?: (data: Partial<EmailSignature>) => void;
}

interface UseEmailSignatureFormReturn {
  // États du formulaire
  id?: string;
  name: string;
  setName: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
  jobTitle: string;
  setJobTitle: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  mobilePhone: string;
  setMobilePhone: (value: string) => void;
  website: string;
  setWebsite: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  companyName: string;
  setCompanyName: (value: string) => void;
  socialLinks: SocialLinks;
  setSocialLinks: (value: SocialLinks) => void;
  updateSocialLink: (network: keyof SocialLinks, value: string) => void;
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
  previewProfilePhoto: string | null;
  setPreviewProfilePhoto: (value: string | null) => void;
  profilePhotoToDelete: boolean;
  setProfilePhotoToDelete: (value: boolean) => void;
  profilePhotoSize: number;
  setProfilePhotoSize: (value: number) => void;
  
  // Disposition et style
  layout: 'horizontal' | 'vertical';
  setLayout: (value: 'horizontal' | 'vertical') => void;
  horizontalSpacing: number;
  setHorizontalSpacing: (value: number) => void;
  verticalSpacing: number;
  setVerticalSpacing: (value: number) => void;
  verticalAlignment: 'left' | 'center' | 'right';
  setVerticalAlignment: (value: 'left' | 'center' | 'right') => void;
  imagesLayout: 'horizontal' | 'vertical';
  setImagesLayout: (value: 'horizontal' | 'vertical') => void;
  fontFamily: string;
  setFontFamily: (value: string) => void;
  fontSize: number;
  setFontSize: (value: number) => void;
  socialLinksDisplayMode: 'icons' | 'text';
  setSocialLinksDisplayMode: (value: 'icons' | 'text') => void;
  socialLinksPosition: 'bottom' | 'right';
  setSocialLinksPosition: (value: 'bottom' | 'right') => void;
  socialLinksIconStyle: 'plain' | 'rounded' | 'circle';
  setSocialLinksIconStyle: (value: 'plain' | 'rounded' | 'circle') => void;
  
  // Gestion des erreurs et de la soumission
  errors: EmailSignatureFormErrors;
  setErrors: (value: EmailSignatureFormErrors) => void;
  submitError: string | null;
  isSubmitting: boolean;
  
  // Méthodes
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  handleProfilePhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfilePhotoDelete: () => void;
  importCompanyInfo: () => void;
  getFullLogoUrl: (relativePath: string | undefined) => string;
  validateForm: () => EmailSignatureFormErrors;
}

export function useEmailSignatureForm({
  initialData,
  onSubmit,
  onChange
}: UseEmailSignatureFormProps): UseEmailSignatureFormReturn {
  // Récupérer les informations de l'entreprise
  const { company } = useCompany();
  
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
  const [socialLinks, setSocialLinks] = useState(initialData?.socialLinks || {
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
  const [companyInfoImported, setCompanyInfoImported] = useState(false);
  
  // États pour la gestion de la photo de profil
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(initialData?.profilePhotoUrl || '');
  const [profilePhotoBase64, setProfilePhotoBase64] = useState<string | null>(null);
  const [previewProfilePhoto, setPreviewProfilePhoto] = useState<string | null>(null);
  const [profilePhotoToDelete, setProfilePhotoToDelete] = useState(false);
  const [profilePhotoSize, setProfilePhotoSize] = useState(initialData?.profilePhotoSize || 80);
  
  // Disposition de la signature (horizontale ou verticale)
  const [layout, setLayout] = useState(initialData?.layout || 'vertical');
  
  // Espacement entre les parties gauche et droite en disposition horizontale (en pixels)
  const [horizontalSpacing, setHorizontalSpacing] = useState(initialData?.horizontalSpacing || 20);
  
  // Espacement vertical en disposition horizontale (en pixels)
  const [verticalSpacing, setVerticalSpacing] = useState(initialData?.verticalSpacing || 10);
  
  // Alignement du texte en disposition verticale (gauche, centre, droite)
  const [verticalAlignment, setVerticalAlignment] = useState(initialData?.verticalAlignment || 'left');
  
  // Disposition des images (photo de profil et logo) en mode vertical (horizontale ou verticale)
  const [imagesLayout, setImagesLayout] = useState(initialData?.imagesLayout || 'vertical');
  
  // Police de caractères pour la signature
  const [fontFamily, setFontFamily] = useState(
    initialData?.fontFamily && [
      'Arial, sans-serif',
      'Helvetica, sans-serif',
      'Georgia, serif',
      'Times New Roman, serif',
      'Courier New, monospace',
      'Verdana, sans-serif'
    ].includes(initialData.fontFamily)
      ? initialData.fontFamily
      : 'Arial, sans-serif'
  );
  
  // Taille de police pour la signature
  const [fontSize, setFontSize] = useState(initialData?.fontSize || 14);
  
  // Mode d'affichage des réseaux sociaux (icons ou text)
  const [socialLinksDisplayMode, setSocialLinksDisplayMode] = useState(initialData?.socialLinksDisplayMode || 'text');
  
  // Position des réseaux sociaux (bottom ou right)
  const [socialLinksPosition, setSocialLinksPosition] = useState(initialData?.socialLinksPosition || 'bottom');
  
  // Style des icônes des réseaux sociaux (plain, rounded ou circle)
  const [socialLinksIconStyle, setSocialLinksIconStyle] = useState(initialData?.socialLinksIconStyle || 'plain');
  
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
    setProfilePhotoBase64(null);
    setPreviewProfilePhoto(null);
    setProfilePhotoToDelete(true);
  }, []);
  
  // Validation du formulaire
  const validateForm = useCallback((): EmailSignatureFormErrors => {
    const newErrors: EmailSignatureFormErrors = {};
    
    // Validation du nom de la signature
    if (!name.trim()) {
      newErrors.name = 'Le nom de la signature est requis';
    } else if (name.length > 50) {
      newErrors.name = 'Le nom de la signature ne doit pas dépasser 50 caractères';
    }
    
    // Validation du nom complet
    if (!fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    } else if (!NAME_REGEX.test(fullName)) {
      newErrors.fullName = 'Le nom complet ne doit contenir que des lettres, des espaces et des tirets';
    } else if (fullName.length > 100) {
      newErrors.fullName = 'Le nom complet ne doit pas dépasser 100 caractères';
    }
    
    // Validation de l'email
    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!EMAIL_PATTERN.test(email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    } else if (email.length > 100) {
      newErrors.email = 'L\'email ne doit pas dépasser 100 caractères';
    }
    
    // Validation du nom de l'entreprise
    if (!companyName.trim()) {
      newErrors.companyName = 'Le nom de l\'entreprise est requis';
    } else if (companyName.length > 100) {
      newErrors.companyName = 'Le nom de l\'entreprise ne doit pas dépasser 100 caractères';
    }
    
    return newErrors;
  }, [name, fullName, email, companyName]);
  
  // Gestion de la soumission du formulaire
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Réinitialiser les erreurs précédentes
    setSubmitError(null);
    
    // Validation du formulaire
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Afficher une notification d'erreur
      Notification.error('Veuillez corriger les erreurs dans le formulaire', {
        duration: 5000,
        position: 'bottom-left'
      });
      
      return;
    }
    
    // Indiquer que la soumission est en cours
    setIsSubmitting(true);
    
    try {
      // Préparation des données à envoyer
      const signatureData: Partial<EmailSignature> = {
        id: id || undefined,
        name,
        fullName,
        jobTitle,
        email,
        phone,
        mobilePhone,
        website,
        companyName,
        address,
        template,
        primaryColor,
        secondaryColor,
        socialLinks,
        logoUrl,
        showLogo,
        isDefault,
        profilePhotoUrl,
        profilePhotoBase64,
        profilePhotoToDelete,
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
      
      // Appeler la fonction de soumission fournie par le parent
      onSubmit(signatureData);
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
    // Appeler la fonction d'annulation fournie par le parent
    onSubmit = () => {};
  }, []);
  
  return {
    // États du formulaire
    id,
    name,
    setName,
    fullName,
    setFullName,
    jobTitle,
    setJobTitle,
    email,
    setEmail,
    phone,
    setPhone,
    mobilePhone,
    setMobilePhone,
    website,
    setWebsite,
    address,
    setAddress,
    companyName,
    setCompanyName,
    socialLinks,
    setSocialLinks,
    updateSocialLink,
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
    companyInfoImported,
    
    // États pour la photo de profil
    profilePhotoUrl,
    setProfilePhotoUrl,
    profilePhotoBase64,
    setProfilePhotoBase64,
    previewProfilePhoto,
    setPreviewProfilePhoto,
    profilePhotoToDelete,
    setProfilePhotoToDelete,
    profilePhotoSize,
    setProfilePhotoSize,
    
    // Disposition et style
    layout,
    setLayout,
    horizontalSpacing,
    setHorizontalSpacing,
    verticalSpacing,
    setVerticalSpacing,
    verticalAlignment,
    setVerticalAlignment,
    imagesLayout,
    setImagesLayout,
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    socialLinksDisplayMode,
    setSocialLinksDisplayMode,
    socialLinksPosition,
    setSocialLinksPosition,
    socialLinksIconStyle,
    setSocialLinksIconStyle,
    
    // Gestion des erreurs et de la soumission
    errors,
    setErrors,
    submitError,
    isSubmitting,
    
    // Méthodes
    handleSubmit,
    handleCancel,
    handleProfilePhotoSelect,
    handleProfilePhotoDelete,
    importCompanyInfo,
    getFullLogoUrl,
    validateForm
  };
}
