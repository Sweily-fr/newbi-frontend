import React, { useState, useEffect, useCallback } from 'react';
import { Button, TextField, TextArea, ImageUploader, Checkbox } from '../../../ui';
import Collapse from '../../../ui/Collapse';
import { EmailSignature } from './EmailSignaturesTable';
import { EMAIL_PATTERN, NAME_REGEX } from '../../../../constants/formValidations';
import { useCompany } from '../../../../hooks/useCompany';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { Notification } from '../../../feedback/Notification';

interface EmailSignatureFormProps {
  initialData?: Partial<EmailSignature>;
  onSubmit: (data: Partial<EmailSignature>) => void;
  onCancel: () => void;
  onChange?: (data: Partial<EmailSignature>) => void; // Callback pour les changements en temps réel
}

export const EmailSignatureForm: React.FC<EmailSignatureFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  onChange
}) => {
  // Nous n'utilisons plus l'état global formData pour éviter les boucles infinies
  
  // États pour les champs du formulaire
  // Utiliser directement initialData?.id sans état pour éviter l'avertissement "setId is never used"
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
  const [profilePhotoSize, setProfilePhotoSize] = useState(initialData?.profilePhotoSize || 80); // Taille par défaut: 80px
  
  // Disposition de la signature (horizontale ou verticale)
  const [layout, setLayout] = useState(initialData?.layout || 'vertical'); // Valeurs possibles: 'horizontal' ou 'vertical'
  
  // Espacement entre les parties gauche et droite en disposition horizontale (en pixels)
  const [horizontalSpacing, setHorizontalSpacing] = useState(initialData?.horizontalSpacing || 20); // Valeur par défaut: 20px
  
  // Espacement vertical en disposition horizontale (en pixels)
  const [verticalSpacing, setVerticalSpacing] = useState(initialData?.verticalSpacing || 10); // Valeur par défaut: 10px
  
  // Alignement du texte en disposition verticale (gauche, centre, droite)
  const [verticalAlignment, setVerticalAlignment] = useState(initialData?.verticalAlignment || 'left'); // Valeur par défaut: gauche
  
  // Disposition des images (photo de profil et logo) en mode vertical (horizontale ou verticale)
  const [imagesLayout, setImagesLayout] = useState(initialData?.imagesLayout || 'vertical'); // Valeur par défaut: verticale
  
  // Police de caractères pour la signature
  // Utiliser exactement l'une des valeurs acceptées par le backend
  const [fontFamily, setFontFamily] = useState(
    // Vérifier si initialData.fontFamily est l'une des valeurs autorisées
    initialData?.fontFamily && [
      'Arial, sans-serif',
      'Helvetica, sans-serif',
      'Georgia, serif',
      'Times New Roman, serif',
      'Courier New, monospace',
      'Verdana, sans-serif'
    ].includes(initialData.fontFamily)
      ? initialData.fontFamily
      : 'Arial, sans-serif' // Valeur par défaut: Arial
  );
  
  // Taille de police pour la signature
  const [fontSize, setFontSize] = useState(initialData?.fontSize || 14); // Valeur par défaut: 14px
  
  // Mode d'affichage des réseaux sociaux (icons ou text)
  const [socialLinksDisplayMode, setSocialLinksDisplayMode] = useState(initialData?.socialLinksDisplayMode || 'text'); // Valeurs possibles: 'icons' ou 'text'
  
  // Position des réseaux sociaux (bottom ou right)
  const [socialLinksPosition, setSocialLinksPosition] = useState(initialData?.socialLinksPosition || 'bottom'); // Valeurs possibles: 'bottom' ou 'right'
  
  // Style des icônes des réseaux sociaux (plain, rounded ou circle)
  const [socialLinksIconStyle, setSocialLinksIconStyle] = useState(initialData?.socialLinksIconStyle || 'plain'); // Valeurs possibles: 'plain', 'rounded' ou 'circle'
  
  // Couleur de fond des icônes des réseaux sociaux
  const [socialLinksIconBgColor, setSocialLinksIconBgColor] = useState(initialData?.socialLinksIconBgColor || primaryColor);
  
  // Couleur des icônes des réseaux sociaux
  const [socialLinksIconColor, setSocialLinksIconColor] = useState(initialData?.socialLinksIconColor || (socialLinksIconStyle === 'plain' ? primaryColor : '#FFFFFF'));
  
  // Taille des icônes des réseaux sociaux
  const [socialLinksIconSize, setSocialLinksIconSize] = useState(initialData?.socialLinksIconSize || 24); // Valeur par défaut: 24px
  
  // États pour les erreurs de validation et l'état de soumission
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Récupérer les informations de l'entreprise
  const { company, loading: companyLoading } = useCompany();
  
  // URL de base de l'API pour les images - essayer différentes façons d'accéder aux variables d'environnement
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // Fonction pour préfixer l'URL du logo avec l'URL de l'API si nécessaire
  const getFullLogoUrl = (logoPath: string) => {
    if (!logoPath) return '';
    if (logoPath.startsWith('http')) return logoPath; // Déjà une URL complète
    return `${apiUrl}${logoPath.startsWith('/') ? '' : '/'}${logoPath}`;
  };

  // Fonction pour remplir les champs avec les informations de l'entreprise
  const fillCompanyInfo = () => {
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
  };

  // Gestion de la sélection d'un fichier image pour la photo de profil
  const handleProfilePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewProfilePhoto(base64String);
      setProfilePhotoBase64(base64String);
      setProfilePhotoToDelete(false);
    };
    reader.readAsDataURL(file);
  };

  // Gestion de la suppression de la photo de profil
  const handleDeleteProfilePhoto = () => {
    setPreviewProfilePhoto(null);
    setProfilePhotoBase64(null);
    setProfilePhotoToDelete(true);
    setProfilePhotoUrl('');
    
    // Réinitialiser la valeur de l'input file pour permettre la sélection du même fichier
    // Sélectionner l'input file par son ID et réinitialiser sa valeur
    const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Fonction pour mettre à jour les données en direct
  // Accepte un objet de valeurs à jour en option pour contourner l'asynchronicité de setState
  const handleFormChange = useCallback((changes: Partial<EmailSignature>) => {
    if (onChange) {
      // Créer l'objet de base avec les valeurs actuelles
      const updatedFormData: Partial<EmailSignature> = {
        ...changes,
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
        logoUrl, // Envoyer uniquement le chemin relatif du logo, sans l'URL de base
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
        socialLinksIconStyle,
        socialLinksIconBgColor,
        socialLinksIconColor,
        socialLinksIconSize,
        socialLinksPosition,
      };
      
      // Ajouter les propriétés spécifiques à l'objet updatedFormData
      
      // Pour la prévisualisation de la photo de profil
      if (previewProfilePhoto) {
        updatedFormData.profilePhotoUrl = previewProfilePhoto;
      } else if (profilePhotoUrl) {
        updatedFormData.profilePhotoUrl = profilePhotoUrl;
      }

      onChange(updatedFormData);
    }
    
    // Validation en temps réel pour certains champs
    if (changes && typeof changes === 'object') {
      // Validation de l'email
      if ('email' in changes && changes.email !== undefined) {
        if (!changes.email) {
          setErrors(prev => ({ ...prev, email: 'L\'email est requis' }));
        } else if (!EMAIL_PATTERN.test(changes.email)) {
          setErrors(prev => ({ ...prev, email: 'Format d\'email invalide' }));
        } else {
          setErrors(prev => ({ ...prev, email: '' }));
        }
      }
      
      // Validation du site web
      if ('website' in changes && changes.website !== undefined) {
        const websitePattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (changes.website && !websitePattern.test(changes.website)) {
          setErrors(prev => ({ ...prev, website: 'Format d\'URL invalide' }));
        } else {
          setErrors(prev => ({ ...prev, website: '' }));
        }
      }
      
      // Validation du téléphone fixe
      if ('phone' in changes && changes.phone !== undefined) {
        const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
        if (changes.phone && !phonePattern.test(changes.phone)) {
          setErrors(prev => ({ ...prev, phone: 'Format de numéro de téléphone invalide' }));
        } else {
          setErrors(prev => ({ ...prev, phone: '' }));
        }
      }
      
      // Validation du téléphone mobile
      if ('mobilePhone' in changes && changes.mobilePhone !== undefined) {
        const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
        if (changes.mobilePhone && !phonePattern.test(changes.mobilePhone)) {
          setErrors(prev => ({ ...prev, mobilePhone: 'Format de numéro de mobile invalide' }));
        } else {
          setErrors(prev => ({ ...prev, mobilePhone: '' }));
        }
      }
    }
  }, [id, name, fullName, jobTitle, email, phone, mobilePhone, website, address, companyName, socialLinks, template, primaryColor, secondaryColor, logoUrl, showLogo, isDefault, previewProfilePhoto, profilePhotoUrl, profilePhotoSize, layout, horizontalSpacing, verticalSpacing, verticalAlignment, imagesLayout, socialLinksDisplayMode, socialLinksIconStyle, socialLinksIconBgColor, socialLinksIconColor, socialLinksIconSize, socialLinksPosition, onChange, fontFamily, fontSize, profilePhotoBase64, profilePhotoToDelete]);

  // Fonction de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Réinitialiser les erreurs précédentes
    setSubmitError(null);
    
    // Validation du formulaire
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Faire défiler jusqu'à la première erreur
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
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
        logoUrl, // Envoyer uniquement le chemin relatif du logo, sans l'URL de base
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
        socialLinksIconStyle,
        socialLinksIconBgColor,
        socialLinksIconColor,
        socialLinksIconSize,
        socialLinksPosition,
      };
      
      
      // Appel de la fonction de soumission passée en props
      await onSubmit(signatureData as EmailSignature);
      
      // Afficher une notification de succès seulement si aucune erreur n'est détectée
      // et si la soumission a réussi
      if (Object.keys(errors).length === 0) {
        Notification.success('Signature email enregistrée avec succès', {
          duration: 3000,
          position: 'bottom-left'
        });
      }
    } catch (error) {
      // Gérer les erreurs de soumission
      console.error('Erreur lors de la soumission du formulaire:', error);
      
      // Définir le type d'erreur GraphQL
      interface GraphQLError {
        message: string;
        extensions?: {
          code?: string;
          details?: Record<string, string>;
        };
      }
      
      interface ApolloError extends Error {
        graphQLErrors?: GraphQLError[];
      }
      
      // Vérifier si c'est une erreur GraphQL avec des erreurs de validation
      const apolloError = error as ApolloError;
      if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
        const graphQLError = apolloError.graphQLErrors[0];
        
        // Vérifier si c'est une erreur de validation avec des détails
        if (graphQLError.extensions?.code === 'VALIDATION_ERROR' && graphQLError.extensions?.details) {
          const validationErrors = graphQLError.extensions.details;
          
          // Mappage des noms de champs entre le backend et le frontend
          const mappedErrors: Record<string, string> = {};
          
          // Parcourir toutes les erreurs retournées par le backend
          Object.entries(validationErrors).forEach(([key, value]) => {
            // Mapper les noms de champs si nécessaire
            if (key === 'name') mappedErrors.name = value as string;
            else if (key === 'fullName') mappedErrors.fullName = value as string;
            else if (key === 'jobTitle') mappedErrors.jobTitle = value as string;
            else if (key === 'email') mappedErrors.email = value as string;
            else if (key === 'phone') mappedErrors.phone = value as string;
            else if (key === 'mobilePhone') mappedErrors.mobilePhone = value as string;
            else if (key === 'website') mappedErrors.website = value as string;
            else if (key.startsWith('socialLinks.')) mappedErrors[key] = value as string;
            else mappedErrors[key] = value as string; // Conserver les autres erreurs telles quelles
          });
          
          
          // Mettre à jour l'état des erreurs avec les erreurs de validation mappées
          setErrors(prev => ({
            ...prev,
            ...mappedErrors
          }));
          
          // Faire défiler jusqu'à la première erreur
          setTimeout(() => {
            const firstErrorField = document.querySelector('[aria-invalid="true"]');
            if (firstErrorField) {
              firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
          
          // Message d'erreur général
          setSubmitError('Veuillez corriger les erreurs dans le formulaire');
        } else {
          // Erreur GraphQL générale
          setSubmitError(graphQLError.message || 'Une erreur est survenue lors de l\'enregistrement de la signature');
        }
      } else {
        // Erreur non-GraphQL
        setSubmitError(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement de la signature');
      }
      
      // Afficher une notification d'erreur
      Notification.error('Échec de l\'enregistrement de la signature', {
        duration: 5000,
        position: 'bottom-left'
      });
    } finally {
      // Réinitialiser l'état de soumission
      setIsSubmitting(false);
    }
  };
  
  // Fonction de validation du formulaire
  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    // Validation des champs obligatoires
    if (!name) {
      newErrors.name = 'Le nom de la signature est requis';
    } else if (!NAME_REGEX.test(name)) {
      newErrors.name = 'Le nom contient des caractères non autorisés (<, > non autorisés)';
    }
    
    if (!fullName) {
      newErrors.fullName = 'Le nom complet est requis';
    } else if (!NAME_REGEX.test(fullName)) {
      newErrors.fullName = 'Le nom complet contient des caractères non autorisés (<, > non autorisés)';
    }
    
    if (jobTitle && !NAME_REGEX.test(jobTitle)) {
      newErrors.jobTitle = 'La fonction contient des caractères non autorisés (<, > non autorisés)';
    }
    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!EMAIL_PATTERN.test(email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Validation des URLs
    if (website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(website)) {
      newErrors.website = 'Format d\'URL invalide';
    }
    
    // Validation des URLs des réseaux sociaux
    const socialLinkPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    
    if (socialLinks.linkedin && !socialLinkPattern.test(socialLinks.linkedin)) {
      newErrors['socialLinks.linkedin'] = 'Format d\'URL LinkedIn invalide';
    }
    
    if (socialLinks.twitter && !socialLinkPattern.test(socialLinks.twitter)) {
      newErrors['socialLinks.twitter'] = 'Format d\'URL Twitter invalide';
    }
    
    if (socialLinks.facebook && !socialLinkPattern.test(socialLinks.facebook)) {
      newErrors['socialLinks.facebook'] = 'Format d\'URL Facebook invalide';
    }
    
    if (socialLinks.instagram && !socialLinkPattern.test(socialLinks.instagram)) {
      newErrors['socialLinks.instagram'] = 'Format d\'URL Instagram invalide';
    }
    
    // Validation des numéros de téléphone
    const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
    
    if (phone && !phonePattern.test(phone)) {
      newErrors.phone = 'Format de numéro de téléphone invalide';
    }
    
    if (mobilePhone && !phonePattern.test(mobilePhone)) {
      newErrors.mobilePhone = 'Format de numéro de mobile invalide';
    }
    
    return newErrors;
  };

  useEffect(() => {
    // Passer un objet vide car la fonction utilise déjà les états actuels
    handleFormChange({});
  }, [
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
    layout,
    horizontalSpacing,
    verticalSpacing,
    verticalAlignment,
    imagesLayout,
    profilePhotoUrl,
    previewProfilePhoto,
    profilePhotoSize,
    fontFamily,
    fontSize,
    socialLinksDisplayMode,
    socialLinksIconStyle,
    socialLinksIconBgColor,
    socialLinksIconColor,
    socialLinksIconSize,
    socialLinksPosition,
    handleFormChange,
    onChange
  ]);

  return (
    <div className="bg-white overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-medium">
          {initialData ? 'Modifier la signature' : 'Créer une signature'}
        </h2>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        <form id="signatureForm" onSubmit={handleSubmit} className="space-y-6">
          <Collapse title="Informations générales" defaultOpen={true}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              {/* Suppression de l'affichage de débogage qui n'est plus nécessaire */}
              <TextField
                id="name"
                name="name"
                label="Nom de la signature"
                placeholder="Ex: Signature professionnelle"
                value={name}
                onChange={(e) => {
                  const value = e.target.value;
                  setName(value);
                  handleFormChange({ name: value });
                  
                  // Validation en temps réel
                  if (!value) {
                    setErrors(prev => ({ ...prev, name: 'Le nom de la signature est requis' }));
                  } else if (!NAME_REGEX.test(value)) {
                    setErrors(prev => ({ ...prev, name: 'Le nom contient des caractères non autorisés (<, > non autorisés)' }));
                  } else {
                    setErrors(prev => ({ ...prev, name: '' }));
                  }
                }}
                error={errors.name}
                required
                helpText="Donnez un nom à votre signature pour la retrouver facilement"
              />

              <div className="mt-2">
                <Checkbox
                  id="isDefault"
                  name="isDefault"
                  label="Définir comme signature par défaut"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  variant="blue"
                />
              </div>
            </div>
          </Collapse>

          <Collapse title="Informations personnelles" defaultOpen={true}>
            <div className="w-full flex flex-col items-center mb-6">
              <div className="w-full max-w-md">
                <ImageUploader
                  imageUrl={profilePhotoUrl}
                  apiBaseUrl={apiUrl}
                  previewImage={previewProfilePhoto}
                  isLoading={false}
                  loadingMessage="Traitement de l'image en cours..."
                  onFileSelect={handleProfilePhotoSelect}
                  onDelete={handleDeleteProfilePhoto}
                  maxSizeMB={2}
                  acceptedFileTypes="image/*"
                  helpText="Format recommandé : PNG ou JPG, max 2MB. Cette photo apparaîtra dans votre signature email."
                  imageSize={profilePhotoSize}
                  roundedStyle="rounded"
                  className="flex flex-col items-center mx-auto"
                />
                
                {/* Contrôle pour la taille de la photo */}
                {(profilePhotoUrl || previewProfilePhoto) && (
                  <div className="mt-6 w-full max-w-xs mx-auto text-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <label htmlFor="profilePhotoSize" className="text-sm font-medium text-gray-700">
                        Taille de la photo
                      </label>
                      <span className="text-sm font-semibold text-[#5b50ff] bg-[#f5f3ff] px-2 py-1 rounded-lg">
                        {profilePhotoSize}px
                      </span>
                    </div>
                    
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full h-1 bg-gray-200 rounded"></div>
                      </div>
                      <input
                        type="range"
                        id="profilePhotoSize"
                        name="profilePhotoSize"
                        min="40"
                        max="120"
                        step="5"
                        value={profilePhotoSize}
                        onChange={(e) => setProfilePhotoSize(parseInt(e.target.value))}
                        className="relative w-full h-2 appearance-none cursor-pointer bg-transparent z-10"
                        style={{ WebkitAppearance: 'none' }}
                      />
                      <style dangerouslySetInnerHTML={{ __html: `
                        input[type=range]::-webkit-slider-thumb {
                          -webkit-appearance: none;
                          height: 16px;
                          width: 16px;
                          border-radius: 50%;
                          background: #5b50ff;
                          cursor: pointer;
                          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        }
                        input[type=range]::-moz-range-thumb {
                          height: 16px;
                          width: 16px;
                          border-radius: 50%;
                          background: #5b50ff;
                          cursor: pointer;
                          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        }
                      `}} />
                    </div>
                    
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-500">Petite</span>
                      <span className="text-[#5b50ff]">Moyenne</span>
                      <span className="text-gray-500">Grande</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <TextField
                id="fullName"
                name="fullName"
                label="Nom complet"
                placeholder="Ex: Jean Dupont"
                value={fullName}
                onChange={(e) => {
                  const value = e.target.value;
                  setFullName(value);
                  handleFormChange({ fullName: value });
                  
                  // Validation en temps réel
                  if (!value) {
                    setErrors(prev => ({ ...prev, fullName: 'Le nom complet est requis' }));
                  } else if (!NAME_REGEX.test(value)) {
                    setErrors(prev => ({ ...prev, fullName: 'Le nom complet contient des caractères non autorisés (<, > non autorisés)' }));
                  } else {
                    setErrors(prev => ({ ...prev, fullName: '' }));
                  }
                }}
                error={errors.fullName}
                required
                helpText="Votre nom et prénom tels qu'ils apparaîtront dans la signature"
              />

              <TextField
                id="jobTitle"
                name="jobTitle"
                label="Fonction"
                placeholder="Ex: Directeur Commercial"
                value={jobTitle}
                onChange={(e) => {
                  const value = e.target.value;
                  setJobTitle(value);
                  handleFormChange({ jobTitle: value });
                  
                  // Validation en temps réel
                  if (value && !NAME_REGEX.test(value)) {
                    setErrors(prev => ({ ...prev, jobTitle: 'La fonction contient des caractères non autorisés (<, > non autorisés)' }));
                  } else {
                    setErrors(prev => ({ ...prev, jobTitle: '' }));
                  }
                }}
                error={errors.jobTitle}
                required
              />

              <TextField
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="Ex: jean.dupont@example.com"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  handleFormChange({ email: value });
                  
                  // Validation en temps réel
                  if (!value) {
                    setErrors(prev => ({ ...prev, email: 'L\'email est requis' }));
                  } else if (!EMAIL_PATTERN.test(value)) {
                    setErrors(prev => ({ ...prev, email: 'Format d\'email invalide' }));
                  } else {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                error={errors.email}
                required
                helpText="Format attendu : exemple@domaine.com"
              />

              <TextField
                id="phone"
                name="phone"
                label="Téléphone fixe"
                placeholder="Ex: 01 23 45 67 89"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  setPhone(value);
                  handleFormChange({ phone: value });
                  
                  // Validation en temps réel - format plus permissif pour accepter différents formats internationaux
                  const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
                  if (value && !phonePattern.test(value)) {
                    setErrors(prev => ({ ...prev, phone: 'Format de numéro de téléphone invalide (accepte 01 XX XX XX XX ou +33 1 XX XX XX XX)' }));
                  } else {
                    setErrors(prev => ({ ...prev, phone: '' }));
                  }
                }}
                error={errors.phone}
                helpText="Ex: 01 23 45 67 89 ou +33 1 23 45 67 89"
              />

              <TextField
                id="mobilePhone"
                name="mobilePhone"
                label="Téléphone mobile"
                placeholder="Ex: 06 12 34 56 78"
                value={mobilePhone}
                onChange={(e) => {
                  const value = e.target.value;
                  setMobilePhone(value);
                  handleFormChange({ mobilePhone: value });
                  
                  // Validation en temps réel - format plus permissif pour accepter différents formats internationaux
                  const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
                  if (value && !phonePattern.test(value)) {
                    setErrors(prev => ({ ...prev, mobilePhone: 'Format de numéro de mobile invalide (chiffres, espaces et +)' }));
                  } else {
                    setErrors(prev => ({ ...prev, mobilePhone: '' }));
                  }
                }}
                error={errors.mobilePhone}
                helpText="Ex: 06 12 34 56 78 ou +33 6 12 34 56 78"
              />

              <TextField
                id="website"
                name="website"
                label="Site web"
                placeholder="Ex: www.example.com"
                value={website}
                onChange={(e) => {
                  const value = e.target.value;
                  setWebsite(value);
                  handleFormChange({ website: value });
                  
                  // Validation en temps réel
                  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
                  if (value && !urlPattern.test(value)) {
                    setErrors(prev => ({ ...prev, website: 'Format d\'URL invalide' }));
                  } else {
                    setErrors(prev => ({ ...prev, website: '' }));
                  }
                }}
                error={errors.website}
                helpText="Format attendu : https://www.exemple.com"
              />
            </div>
          </Collapse>

          <Collapse title="Informations de l'entreprise" defaultOpen={false}>
            <div className="flex justify-end mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fillCompanyInfo}
                disabled={companyLoading || !company}
                className="flex items-center space-x-1 text-sm"
              >
                <DocumentDuplicateIcon className="h-4 w-4" />
                <span>Récupérer mes informations entreprise</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <TextField
                id="companyName"
                name="companyName"
                label="Nom de l'entreprise"
                placeholder="Ex: Acme Inc."
                value={companyName}
                onChange={(e) => {
                  const value = e.target.value;
                  setCompanyName(value);
                  handleFormChange({ companyName: value });
                  
                  // Validation en temps réel
                  if (value && !NAME_REGEX.test(value)) {
                    setErrors(prev => ({ ...prev, companyName: 'Le nom de l\'entreprise contient des caractères non autorisés (<, > non autorisés)' }));
                  } else {
                    setErrors(prev => ({ ...prev, companyName: '' }));
                  }
                }}
                error={errors.companyName}
              />

              <TextArea
                id="address"
                name="address"
                label="Adresse"
                placeholder="Ex: 123 rue de Paris, 75001 Paris, France"
                value={address}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddress(value);
                  handleFormChange({ address: value });
                  
                  // Validation en temps réel
                  if (value && !NAME_REGEX.test(value)) {
                    setErrors(prev => ({ ...prev, address: 'L\'adresse contient des caractères non autorisés (<, > non autorisés)' }));
                  } else {
                    setErrors(prev => ({ ...prev, address: '' }));
                  }
                }}
                error={errors.address}
                rows={3}
              />

              {/* Affichage du logo de l'entreprise - si les informations de l'entreprise ont été importées via le bouton OU si un logoUrl est présent */}
              {(companyInfoImported && company?.logo) || logoUrl ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo de l'entreprise</label>
                  <div className="flex items-center space-x-4">
                    {company?.logo || logoUrl ? (
                      <>
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-50">
                          <img 
                            src={company?.logo ? getFullLogoUrl(company.logo) : getFullLogoUrl(logoUrl)} 
                            alt="Logo de l'entreprise" 
                            className="max-w-full max-h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            Le logo de votre entreprise sera utilisé dans votre signature email.
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Pour modifier ce logo, rendez-vous dans les paramètres de votre entreprise.
                          </p>
                          {/* Champ caché pour stocker l'URL du logo */}
                          <input 
                            type="hidden" 
                            value={company?.logo ? getFullLogoUrl(company.logo) : logoUrl || ''}
                            onChange={(e) => setLogoUrl(e.target.value)}
                          />
                          
                          {/* Option pour afficher ou masquer le logo */}
                          <div className="mt-3">
                            <div>
                              <Checkbox
                                id="showLogo"
                                name="showLogo"
                                label="Afficher le logo dans ma signature"
                                checked={showLogo}
                                onChange={(e) => setShowLogo(e.target.checked)}
                                variant="blue"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          Aucun logo d'entreprise n'est configuré. 
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Pour ajouter un logo, rendez-vous dans les <a href="/profile?tab=company" className="text-blue-600 hover:underline">paramètres de votre entreprise</a>.
                        </p>
                        <input 
                          type="hidden" 
                          value=""
                          onChange={(e) => setLogoUrl(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </Collapse>

          <Collapse title="Réseaux sociaux" defaultOpen={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <TextField
                id="linkedin"
                name="linkedin"
                label="LinkedIn"
                placeholder="Ex: https://linkedin.com/in/jeandupont"
                value={socialLinks.linkedin}
                onChange={(e) => {
                  const value = e.target.value;
                  const newSocialLinks = { ...socialLinks, linkedin: value };
                  setSocialLinks(newSocialLinks);
                  handleFormChange({ socialLinks: newSocialLinks });
                  
                  // Validation en temps réel
                  const socialLinkPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
                  if (value && !socialLinkPattern.test(value)) {
                    setErrors(prev => ({ ...prev, 'socialLinks.linkedin': 'Format d\'URL LinkedIn invalide' }));
                  } else {
                    setErrors(prev => ({ ...prev, 'socialLinks.linkedin': '' }));
                  }
                }}
                error={errors['socialLinks.linkedin']}
                helpText="Format attendu : https://www.linkedin.com/in/username"
              />

              <TextField
                id="twitter"
                name="twitter"
                label="X (anciennement Twitter)"
                placeholder="Ex: https://x.com/jeandupont"
                value={socialLinks.twitter}
                onChange={(e) => {
                  const value = e.target.value;
                  const newSocialLinks = { ...socialLinks, twitter: value };
                  setSocialLinks(newSocialLinks);
                  handleFormChange({ socialLinks: newSocialLinks });
                  
                  // Validation en temps réel
                  const socialLinkPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
                  if (value && !socialLinkPattern.test(value)) {
                    setErrors(prev => ({ ...prev, 'socialLinks.twitter': 'Format d\'URL Twitter invalide' }));
                  } else {
                    setErrors(prev => ({ ...prev, 'socialLinks.twitter': '' }));
                  }
                }}
                error={errors['socialLinks.twitter']}
                helpText="Format attendu : https://twitter.com/username ou https://x.com/username"
              />

              <TextField
                id="facebook"
                name="facebook"
                label="Facebook"
                placeholder="Ex: https://facebook.com/jeandupont"
                value={socialLinks.facebook}
                onChange={(e) => {
                  const value = e.target.value;
                  const newSocialLinks = { ...socialLinks, facebook: value };
                  setSocialLinks(newSocialLinks);
                  handleFormChange({ socialLinks: newSocialLinks });
                  
                  // Validation en temps réel
                  const socialLinkPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
                  if (value && !socialLinkPattern.test(value)) {
                    setErrors(prev => ({ ...prev, 'socialLinks.facebook': 'Format d\'URL Facebook invalide' }));
                  } else {
                    setErrors(prev => ({ ...prev, 'socialLinks.facebook': '' }));
                  }
                }}
                error={errors['socialLinks.facebook']}
                helpText="Format attendu : https://www.facebook.com/username"
              />

              <TextField
                id="instagram"
                name="instagram"
                label="Instagram"
                placeholder="Ex: https://instagram.com/jeandupont"
                value={socialLinks.instagram}
                onChange={(e) => {
                  const value = e.target.value;
                  const newSocialLinks = { ...socialLinks, instagram: value };
                  setSocialLinks(newSocialLinks);
                  handleFormChange({ socialLinks: newSocialLinks });
                  
                  // Validation en temps réel
                  const socialLinkPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
                  if (value && !socialLinkPattern.test(value)) {
                    setErrors(prev => ({ ...prev, 'socialLinks.instagram': 'Format d\'URL Instagram invalide' }));
                  } else {
                    setErrors(prev => ({ ...prev, 'socialLinks.instagram': '' }));
                  }
                }}
                error={errors['socialLinks.instagram']}
                helpText="Format attendu : https://www.instagram.com/username"
              />
              
              {/* Sélecteur pour le mode d'affichage des réseaux sociaux */}
              <div className="col-span-2 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mode d'affichage des réseaux sociaux
                </label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="socialLinksText"
                      name="socialLinksDisplayMode"
                      value="text"
                      checked={socialLinksDisplayMode === 'text'}
                      onChange={() => setSocialLinksDisplayMode('text')}
                      className="h-4 w-4 text-[#5b50ff] focus:ring-[#5b50ff] border-gray-300"
                    />
                    <label htmlFor="socialLinksText" className="ml-2 block text-sm text-gray-700">
                      Noms (LinkedIn, X, etc.)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="socialLinksIcons"
                      name="socialLinksDisplayMode"
                      value="icons"
                      checked={socialLinksDisplayMode === 'icons'}
                      onChange={() => setSocialLinksDisplayMode('icons')}
                      className="h-4 w-4 text-[#5b50ff] focus:ring-[#5b50ff] border-gray-300"
                    />
                    <label htmlFor="socialLinksIcons" className="ml-2 block text-sm text-gray-700">
                      Icônes
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Sélecteur pour le style des icônes (visible uniquement si le mode d'affichage est "icons") */}
              {socialLinksDisplayMode === 'icons' && (
                <div className="col-span-2 mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Style des icônes
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div 
                      className={`border rounded-md p-3 cursor-pointer flex flex-col items-center ${socialLinksIconStyle === 'plain' ? 'border-[#5b50ff] bg-[#f0eeff]' : 'border-gray-300'}`}
                      onClick={() => {
                        setSocialLinksIconStyle('plain');
                        setSocialLinksIconColor(primaryColor);
                      }}
                    >
                      <div className="flex space-x-2 mb-2">
                        <span className="text-sm font-medium w-6 h-6 flex items-center justify-center" style={{ color: socialLinksIconColor }}>
                          <svg viewBox="0 0 24 24" style={{ width: '60%', height: '60%', fill: 'currentColor' }}>
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.68 1.68 0 0 0-1.68 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                          </svg>
                        </span>
                        <span className="text-sm font-medium w-6 h-6 flex items-center justify-center" style={{ color: socialLinksIconColor }}>
                          <svg viewBox="0 0 24 24" style={{ width: '60%', height: '60%', fill: 'currentColor' }}>
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">Sans fond</div>
                    </div>
                    <div 
                      className={`border rounded-md p-3 cursor-pointer flex flex-col items-center ${socialLinksIconStyle === 'rounded' ? 'border-[#5b50ff] bg-[#f0eeff]' : 'border-gray-300'}`}
                      onClick={() => {
                        setSocialLinksIconStyle('rounded');
                        if (socialLinksIconColor === primaryColor) {
                          setSocialLinksIconColor('#FFFFFF');
                        }
                      }}
                    >
                      <div className="flex space-x-2 mb-2">
                        <span 
                          className="text-sm font-medium w-6 h-6 flex items-center justify-center rounded-md" 
                          style={{ 
                            backgroundColor: socialLinksIconBgColor
                          }}
                        >
                          <svg viewBox="0 0 24 24" style={{ width: '60%', height: '60%', fill: socialLinksIconColor }}>
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                          </svg>
                        </span>
                        <span 
                          className="text-sm font-medium w-6 h-6 flex items-center justify-center rounded-md" 
                          style={{ 
                            backgroundColor: socialLinksIconBgColor
                          }}
                        >
                          <svg viewBox="0 0 24 24" style={{ width: '60%', height: '60%', fill: socialLinksIconColor }}>
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">Carré arrondi</div>
                    </div>
                    <div 
                      className={`border rounded-md p-3 cursor-pointer flex flex-col items-center ${socialLinksIconStyle === 'circle' ? 'border-[#5b50ff] bg-[#f0eeff]' : 'border-gray-300'}`}
                      onClick={() => {
                        setSocialLinksIconStyle('circle');
                        if (socialLinksIconColor === primaryColor) {
                          setSocialLinksIconColor('#FFFFFF');
                        }
                      }}
                    >
                      <div className="flex space-x-2 mb-2">
                        <span 
                          className="text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full" 
                          style={{ 
                            backgroundColor: socialLinksIconBgColor
                          }}
                        >
                          <svg viewBox="0 0 24 24" style={{ width: '60%', height: '60%', fill: socialLinksIconColor }}>
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                          </svg>
                        </span>
                        <span 
                          className="text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full" 
                          style={{ 
                            backgroundColor: socialLinksIconBgColor
                          }}
                        >
                          <svg viewBox="0 0 24 24" style={{ width: '60%', height: '60%', fill: socialLinksIconColor }}>
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">Rond</div>
                    </div>
                  </div>
                  
                  {/* Options spécifiques au style sélectionné */}
                  {socialLinksIconStyle === 'plain' ? (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Options pour le mode "Sans fond"</h3>
                      
                      {/* Couleur des icônes */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Couleur des icônes
                        </label>
                        <div className="flex items-center">
                          <div className="relative h-8 w-8 rounded-md border border-gray-300 cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                            <input
                              type="color"
                              value={socialLinksIconColor}
                              onChange={(e) => setSocialLinksIconColor(e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              style={{ width: '100%', height: '100%' }}
                            />
                            <div 
                              className="absolute inset-0 pointer-events-none" 
                              style={{ backgroundColor: socialLinksIconColor }}
                            />
                          </div>
                          <div className="relative ml-2">
                            <input
                              type="text"
                              value={socialLinksIconColor}
                              onChange={(e) => setSocialLinksIconColor(e.target.value)}
                              className="w-28 px-3 py-1.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#5b50ff] focus:border-[#5b50ff] shadow-sm transition-all"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#5b50ff' }} onClick={() => setSocialLinksIconColor('#5b50ff')} title="Violet" />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSocialLinksIconColor('#5b50ff')}
                            className="ml-2 px-3 py-1.5 text-xs font-medium bg-[#f0eeff] text-[#5b50ff] border border-[#d6d1ff] hover:bg-[#e6e1ff] transition-colors"
                          >
                            Violet
                          </button>
                        </div>
                      </div>
                      
                      {/* Taille des icônes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Taille des icônes ({socialLinksIconSize}px)
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="range"
                            min="16"
                            max="48"
                            step="2"
                            value={socialLinksIconSize}
                            onChange={(e) => setSocialLinksIconSize(parseInt(e.target.value))}
                            className="w-full max-w-xs accent-[#5b50ff]"
                          />
                          <div className="flex space-x-2">
                            <button 
                              type="button" 
                              onClick={() => setSocialLinksIconSize(Math.max(16, socialLinksIconSize - 2))}
                              className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              -
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setSocialLinksIconSize(Math.min(48, socialLinksIconSize + 2))}
                              className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Options pour le mode "{socialLinksIconStyle === 'rounded' ? 'Carré arrondi' : 'Rond'}"</h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Couleur de fond
                          </label>
                          <div className="flex items-center">
                            <div className="relative h-8 w-8 rounded-md border border-gray-300 cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                              <input
                                type="color"
                                value={socialLinksIconBgColor}
                                onChange={(e) => setSocialLinksIconBgColor(e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                style={{ width: '100%', height: '100%' }}
                              />
                              <div 
                                className="absolute inset-0 pointer-events-none" 
                                style={{ backgroundColor: socialLinksIconBgColor }}
                              />
                            </div>
                            <div className="relative ml-2">
                              <input
                                type="text"
                                value={socialLinksIconBgColor}
                                onChange={(e) => setSocialLinksIconBgColor(e.target.value)}
                                className="w-28 px-3 py-1.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#5b50ff] focus:border-[#5b50ff] shadow-sm transition-all"
                              />
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#5b50ff' }} onClick={() => setSocialLinksIconBgColor('#5b50ff')} title="Violet" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Couleur du texte
                          </label>
                          <div className="flex items-center">
                            <div className="relative h-8 w-8 rounded-md border border-gray-300 cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                              <input
                                type="color"
                                value={socialLinksIconColor}
                                onChange={(e) => setSocialLinksIconColor(e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                style={{ width: '100%', height: '100%' }}
                              />
                              <div 
                                className="absolute inset-0 pointer-events-none" 
                                style={{ backgroundColor: socialLinksIconColor }}
                              />
                            </div>
                            <div className="relative ml-2">
                              <input
                                type="text"
                                value={socialLinksIconColor}
                                onChange={(e) => setSocialLinksIconColor(e.target.value)}
                                className="w-28 px-3 py-1.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#5b50ff] focus:border-[#5b50ff] shadow-sm transition-all"
                              />
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                                <div className="w-3 h-3 rounded-full bg-white border border-gray-300" onClick={() => setSocialLinksIconColor('#FFFFFF')} title="Blanc" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Taille des icônes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Taille des icônes ({socialLinksIconSize}px)
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="range"
                            min="16"
                            max="48"
                            step="2"
                            value={socialLinksIconSize}
                            onChange={(e) => setSocialLinksIconSize(parseInt(e.target.value))}
                            className="w-full max-w-xs accent-[#5b50ff]"
                          />
                          <div className="flex space-x-2">
                            <button 
                              type="button" 
                              onClick={() => setSocialLinksIconSize(Math.max(16, socialLinksIconSize - 2))}
                              className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              -
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setSocialLinksIconSize(Math.min(48, socialLinksIconSize + 2))}
                              className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Collapse>

          <Collapse title="Apparence" defaultOpen={false}>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Disposition de la signature</label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="layoutVertical"
                      name="layout"
                      value="vertical"
                      checked={layout === 'vertical'}
                      onChange={() => {
                        setLayout('vertical');
                        handleFormChange({ layout: 'vertical' });
                      }}
                      className="h-4 w-4 text-[#5b50ff] focus:ring-[#5b50ff] border-gray-300"
                    />
                    <label htmlFor="layoutVertical" className="ml-2 block text-sm text-gray-700">
                      Verticale
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="layoutHorizontal"
                      name="layout"
                      value="horizontal"
                      checked={layout === 'horizontal'}
                      onChange={() => {
                        setLayout('horizontal');
                        handleFormChange({ layout: 'horizontal' });
                      }}
                      className="h-4 w-4 text-[#5b50ff] focus:ring-[#5b50ff] border-gray-300"
                    />
                    <label htmlFor="layoutHorizontal" className="ml-2 block text-sm text-gray-700">
                      Horizontale
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Contrôle de l'espacement horizontal (visible uniquement si la disposition est horizontale) */}
              {layout === 'horizontal' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Espacement entre les colonnes ({horizontalSpacing}px)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="5"
                      value={horizontalSpacing}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setHorizontalSpacing(value);
                        handleFormChange({ horizontalSpacing: value });
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex space-x-2 items-center">
                      <button
                        type="button"
                        onClick={() => {
                          const newValue = Math.max(0, horizontalSpacing - 5);
                          setHorizontalSpacing(newValue);
                          handleFormChange({ horizontalSpacing: newValue });
                        }}
                        className="px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newValue = Math.min(60, horizontalSpacing + 5);
                          setHorizontalSpacing(newValue);
                          handleFormChange({ horizontalSpacing: newValue });
                        }}
                        className="px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Options spécifiques à la disposition verticale */}
              {layout === 'vertical' && (
                <>
                  {/* Alignement du texte */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alignement du texte
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="alignLeft"
                          name="verticalAlignment"
                          value="left"
                          checked={verticalAlignment === 'left'}
                          onChange={() => {
                            setVerticalAlignment('left');
                            handleFormChange({ verticalAlignment: 'left' });
                          }}
                          className="h-4 w-4 text-[#5b50ff] focus:ring-[#5b50ff] border-gray-300"
                        />
                        <label htmlFor="alignLeft" className="ml-2 block text-sm text-gray-700">
                          Gauche
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="alignCenter"
                          name="verticalAlignment"
                          value="center"
                          checked={verticalAlignment === 'center'}
                          onChange={() => {
                            setVerticalAlignment('center');
                            handleFormChange({ verticalAlignment: 'center' });
                          }}
                          className="h-4 w-4 text-[#5b50ff] focus:ring-[#5b50ff] border-gray-300"
                        />
                        <label htmlFor="alignCenter" className="ml-2 block text-sm text-gray-700">
                          Centre
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="alignRight"
                          name="verticalAlignment"
                          value="right"
                          checked={verticalAlignment === 'right'}
                          onChange={() => {
                            setVerticalAlignment('right');
                            handleFormChange({ verticalAlignment: 'right' });
                          }}
                          className="h-4 w-4 text-[#5b50ff] focus:ring-[#5b50ff] border-gray-300"
                        />
                        <label htmlFor="alignRight" className="ml-2 block text-sm text-gray-700">
                          Droite
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Disposition des images */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Disposition des images
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="imagesVertical"
                          name="imagesLayout"
                          value="vertical"
                          checked={imagesLayout === 'vertical'}
                          onChange={() => {
                            setImagesLayout('vertical');
                            handleFormChange({ imagesLayout: 'vertical' });
                          }}
                          className="h-4 w-4 text-[#5b50ff] focus:ring-[#5b50ff] border-gray-300"
                        />
                        <label htmlFor="imagesVertical" className="ml-2 block text-sm text-gray-700">
                          Verticale
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="imagesHorizontal"
                          name="imagesLayout"
                          value="horizontal"
                          checked={imagesLayout === 'horizontal'}
                          onChange={() => {
                            setImagesLayout('horizontal');
                            handleFormChange({ imagesLayout: 'horizontal' });
                          }}
                          className="h-4 w-4 text-[#5b50ff] focus:ring-[#5b50ff] border-gray-300"
                        />
                        <label htmlFor="imagesHorizontal" className="ml-2 block text-sm text-gray-700">
                          Horizontale
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Espacement vertical */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Espacement vertical ({verticalSpacing}px)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="40"
                        step="5"
                        value={verticalSpacing}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setVerticalSpacing(value);
                          handleFormChange({ verticalSpacing: value });
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex space-x-2 items-center">
                        <button
                          type="button"
                          onClick={() => {
                            const newValue = Math.max(0, verticalSpacing - 5);
                            setVerticalSpacing(newValue);
                            handleFormChange({ verticalSpacing: newValue });
                          }}
                          className="px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newValue = Math.min(40, verticalSpacing + 5);
                            setVerticalSpacing(newValue);
                            handleFormChange({ verticalSpacing: newValue });
                          }}
                          className="px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Contrôle de l'espacement horizontal (visible uniquement si la disposition est horizontale) */}
              {layout === 'horizontal' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Espacement vertical ({verticalSpacing}px)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="5"
                      value={verticalSpacing}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setVerticalSpacing(value);
                        handleFormChange({ verticalSpacing: value });
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex space-x-2 items-center">
                      <button
                        type="button"
                        onClick={() => {
                          const newValue = Math.max(0, verticalSpacing - 5);
                          setVerticalSpacing(newValue);
                          handleFormChange({ verticalSpacing: newValue });
                        }}
                        className="px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newValue = Math.min(40, verticalSpacing + 5);
                          setVerticalSpacing(newValue);
                          handleFormChange({ verticalSpacing: newValue });
                        }}
                        className="px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sélecteur de police */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Police de caractères</label>
                <select
                  value={fontFamily}
                  onChange={(e) => {
                    const newFontFamily = e.target.value;
                    setFontFamily(newFontFamily);
                    // Passer directement la nouvelle valeur pour contourner l'asynchronicité
                    // Ne pas mettre à jour formData ici pour éviter la boucle infinie
                    handleFormChange({ fontFamily: newFontFamily });
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Helvetica, sans-serif">Helvetica</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Times New Roman, serif">Times New Roman</option>
                  <option value="Courier New, monospace">Courier New</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Choisissez une police standard pour assurer la compatibilité avec tous les clients de messagerie.
                </p>
              </div>
              
              {/* Contrôle de la taille de police */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taille de police ({fontSize}px)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="10"
                    max="20"
                    step="1"
                    value={fontSize}
                    onChange={(e) => {
                      const newFontSize = parseInt(e.target.value);
                      setFontSize(newFontSize);
                      // Ne pas mettre à jour formData ici pour éviter la boucle infinie
                      handleFormChange({ fontSize: newFontSize });
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex space-x-2 items-center">
                    <button
                      type="button"
                      onClick={() => {
                        const newFontSize = Math.max(10, fontSize - 1);
                        setFontSize(newFontSize);
                        // Ne pas mettre à jour formData ici pour éviter la boucle infinie
                        handleFormChange({ fontSize: newFontSize });
                      }}
                      className="px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newFontSize = Math.min(20, fontSize + 1);
                        setFontSize(newFontSize);
                        // Ne pas mettre à jour formData ici pour éviter la boucle infinie
                        handleFormChange({ fontSize: newFontSize });
                      }}
                      className="px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur principale</label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'color';
                      input.value = primaryColor;
                      input.addEventListener('input', (e) => {
                        setPrimaryColor((e.target as HTMLInputElement).value);
                      });
                      input.click();
                    }}
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-28"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur secondaire</label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: secondaryColor }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'color';
                      input.value = secondaryColor;
                      input.addEventListener('input', (e) => {
                        setSecondaryColor((e.target as HTMLInputElement).value);
                      });
                      input.click();
                    }}
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-28"
                  />
                </div>
              </div>
              
              {/* Position des réseaux sociaux (visible uniquement si la disposition est horizontale) */}
              {layout === 'horizontal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position des réseaux sociaux</label>
                  <div className="flex items-center space-x-2">
                    <select
                      value={socialLinksPosition}
                      onChange={(e) => {
                        setSocialLinksPosition(e.target.value as 'bottom' | 'right');
                        handleFormChange({ socialLinksPosition: e.target.value as 'bottom' | 'right' });
                      }}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                    >
                      <option value="bottom">En bas de la signature</option>
                      <option value="right">À droite avec les informations de contact</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </Collapse>
        </form>
      </div>
      <div className="border-t border-gray-200 p-4 flex flex-col space-y-4">
        {/* Message d'erreur global */}
        {submitError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="signatureForm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{initialData ? 'Mise à jour...' : 'Création...'}</span>
              </div>
            ) : (
              <span>{initialData ? 'Mettre à jour' : 'Créer'}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
