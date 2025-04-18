import React, { useState, useEffect, useCallback } from 'react';
import { Button, TextField, TextArea, ImageUploader } from '../../../ui';
import Collapse from '../../../ui/Collapse';
import { EmailSignature } from './EmailSignaturesTable';
import { EMAIL_PATTERN } from '../../../../constants/formValidations';
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
  const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || '#0066cc');
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
  const [fontFamily, setFontFamily] = useState(initialData?.fontFamily || 'Arial, sans-serif'); // Valeur par défaut: Arial
  
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
  
  // États pour les erreurs de validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Récupérer les informations de l'entreprise
  const { company, loading: companyLoading } = useCompany();
  
  // URL de base de l'API pour les images - essayer différentes façons d'accéder aux variables d'environnement
  const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || "http://localhost:4000";
  console.log('EmailSignatureForm - API URL from env:', apiUrl);
  console.log('EmailSignatureForm - All env variables:', import.meta.env);

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
  const handleFormChange = useCallback((changes: Partial<EmailSignature> = {}) => {
    if (onChange) {
      // Créer l'objet de base avec les valeurs actuelles
      const formData: Partial<EmailSignature> = {
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
        socialLinksIconStyle,
        socialLinksIconBgColor,
        socialLinksIconColor,
        socialLinksPosition
      };
      
      // Fusionner avec les valeurs mises à jour si elles sont fournies
      if (changes) {
        Object.assign(formData, changes);
      }

      // Pour la prévisualisation de la photo de profil
      if (previewProfilePhoto) {
        formData.profilePhotoUrl = previewProfilePhoto;
      } else if (profilePhotoUrl) {
        formData.profilePhotoUrl = profilePhotoUrl;
      }

      onChange(formData);
    }
  }, [name, fullName, jobTitle, email, phone, mobilePhone, website, companyName, address, template, primaryColor, secondaryColor, socialLinks, logoUrl, showLogo, isDefault, layout, horizontalSpacing, verticalSpacing, verticalAlignment, imagesLayout, profilePhotoUrl, previewProfilePhoto, profilePhotoSize, fontFamily, fontSize, socialLinksDisplayMode, socialLinksIconStyle, socialLinksIconBgColor, socialLinksIconColor, socialLinksPosition, onChange, id, profilePhotoBase64, profilePhotoToDelete]);

  // Fonction de soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation du formulaire
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
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
      socialLinksPosition,
    };
    
    console.log('Soumission du formulaire avec les données:', signatureData);
    
    // Appel de la fonction de soumission passée en props
    onSubmit(signatureData as EmailSignature);
  };
  
  // Fonction de validation du formulaire
  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    // Validation des champs obligatoires
    if (!name) newErrors.name = 'Le nom de la signature est requis';
    if (!fullName) newErrors.fullName = 'Le nom complet est requis';
    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!EMAIL_PATTERN.test(email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    return newErrors;
  };

  // Mise à jour des données pour la prévisualisation en temps réel
  useEffect(() => {
    // Pas besoin de passer des valeurs mises à jour ici car les états sont déjà à jour
    handleFormChange();
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
    // Ajouter les dépendances liées à la photo de profil
    profilePhotoUrl,
    previewProfilePhoto,
    profilePhotoSize,
    handleFormChange,
    // Ajouter les dépendances pour les réseaux sociaux
    socialLinksDisplayMode,
    socialLinksIconStyle,
    socialLinksIconBgColor,
    socialLinksIconColor,
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
              <TextField
                id="name"
                name="name"
                label="Nom de la signature"
                placeholder="Ex: Signature professionnelle"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                required
              />

              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                  Définir comme signature par défaut
                </label>
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
                  roundedStyle="full"
                  className="flex flex-col items-center mx-auto"
                />
                
                {/* Contrôle pour la taille de la photo */}
                {(profilePhotoUrl || previewProfilePhoto) && (
                  <div className="mt-4 w-full max-w-xs mx-auto text-center">
                    <label htmlFor="profilePhotoSize" className="block text-sm font-medium text-gray-700 mb-1">
                      Taille de la photo dans la signature: {profilePhotoSize}px
                    </label>
                    <input
                      type="range"
                      id="profilePhotoSize"
                      name="profilePhotoSize"
                      min="40"
                      max="120"
                      step="5"
                      value={profilePhotoSize}
                      onChange={(e) => setProfilePhotoSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Petite</span>
                      <span>Moyenne</span>
                      <span>Grande</span>
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
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                required
              />

              <TextField
                id="jobTitle"
                name="jobTitle"
                label="Titre du poste"
                placeholder="Ex: Directeur Marketing"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                error={errors.jobTitle}
                required
              />

              <TextField
                id="email"
                name="email"
                label="Email"
                placeholder="Ex: jean.dupont@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                required
              />

              <TextField
                id="phone"
                name="phone"
                label="Téléphone fixe"
                placeholder="Ex: 01 23 45 67 89"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
              />

              <TextField
                id="mobilePhone"
                name="mobilePhone"
                label="Téléphone mobile"
                placeholder="Ex: 06 12 34 56 78"
                value={mobilePhone}
                onChange={(e) => setMobilePhone(e.target.value)}
                error={errors.mobilePhone}
              />

              <TextField
                id="website"
                name="website"
                label="Site web"
                placeholder="Ex: www.example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                error={errors.website}
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
                placeholder="Ex: Entreprise SAS"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                error={errors.companyName}
              />

              <TextArea
                id="address"
                name="address"
                label="Adresse"
                placeholder="Ex: 123 rue de Paris, 75001 Paris, France"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="showLogo"
                                checked={showLogo}
                                onChange={(e) => setShowLogo(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="showLogo" className="ml-2 block text-sm text-gray-700">
                                Afficher le logo dans ma signature
                              </label>
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
                onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                error={errors.socialLinks?.linkedin}
              />

              <TextField
                id="twitter"
                name="twitter"
                label="X (anciennement Twitter)"
                placeholder="Ex: https://x.com/jeandupont"
                value={socialLinks.twitter}
                onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                error={errors.socialLinks?.twitter}
              />

              <TextField
                id="facebook"
                name="facebook"
                label="Facebook"
                placeholder="Ex: https://facebook.com/jeandupont"
                value={socialLinks.facebook}
                onChange={(e) => setSocialLinks({...socialLinks, facebook: e.target.value})}
                error={errors.socialLinks?.facebook}
              />

              <TextField
                id="instagram"
                name="instagram"
                label="Instagram"
                placeholder="Ex: https://instagram.com/jeandupont"
                value={socialLinks.instagram}
                onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})}
                error={errors.socialLinks?.instagram}
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
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
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
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
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
                      className={`border rounded-md p-3 cursor-pointer flex flex-col items-center ${socialLinksIconStyle === 'plain' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                      onClick={() => {
                        setSocialLinksIconStyle('plain');
                        setSocialLinksIconColor(primaryColor);
                      }}
                    >
                      <div className="flex space-x-2 mb-2">
                        <span className="text-sm font-medium w-6 h-6 flex items-center justify-center" style={{ color: socialLinksIconColor }}>in</span>
                        <span className="text-sm font-medium w-6 h-6 flex items-center justify-center" style={{ color: socialLinksIconColor }}>X</span>
                      </div>
                      <div className="text-xs text-gray-500">Sans fond</div>
                    </div>
                    <div 
                      className={`border rounded-md p-3 cursor-pointer flex flex-col items-center ${socialLinksIconStyle === 'rounded' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
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
                            backgroundColor: socialLinksIconBgColor,
                            color: socialLinksIconColor
                          }}
                        >in</span>
                        <span 
                          className="text-sm font-medium w-6 h-6 flex items-center justify-center rounded-md" 
                          style={{ 
                            backgroundColor: socialLinksIconBgColor,
                            color: socialLinksIconColor
                          }}
                        >X</span>
                      </div>
                      <div className="text-xs text-gray-500">Carré arrondi</div>
                    </div>
                    <div 
                      className={`border rounded-md p-3 cursor-pointer flex flex-col items-center ${socialLinksIconStyle === 'circle' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
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
                            backgroundColor: socialLinksIconBgColor,
                            color: socialLinksIconColor
                          }}
                        >in</span>
                        <span 
                          className="text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full" 
                          style={{ 
                            backgroundColor: socialLinksIconBgColor,
                            color: socialLinksIconColor
                          }}
                        >X</span>
                      </div>
                      <div className="text-xs text-gray-500">Rond</div>
                    </div>
                  </div>
                  
                  {/* Sélecteurs de couleur pour les icônes (visibles uniquement si le mode d'affichage est "icons") */}
                  {socialLinksIconStyle !== 'plain' && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Couleur de fond
                        </label>
                        <div className="flex items-center">
                          <input
                            type="color"
                            value={socialLinksIconBgColor}
                            onChange={(e) => setSocialLinksIconBgColor(e.target.value)}
                            className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={socialLinksIconBgColor}
                            onChange={(e) => setSocialLinksIconBgColor(e.target.value)}
                            className="ml-2 w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => setSocialLinksIconBgColor(primaryColor)}
                            className="ml-2 px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
                          >
                            Couleur primaire
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Couleur du texte
                        </label>
                        <div className="flex items-center">
                          <input
                            type="color"
                            value={socialLinksIconColor}
                            onChange={(e) => setSocialLinksIconColor(e.target.value)}
                            className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={socialLinksIconColor}
                            onChange={(e) => setSocialLinksIconColor(e.target.value)}
                            className="ml-2 w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => setSocialLinksIconColor('#FFFFFF')}
                            className="ml-2 px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
                          >
                            Blanc
                          </button>
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
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
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
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
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
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
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
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
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
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
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
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
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
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
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
                    handleFormChange({ fontFamily: newFontFamily });
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
                  <option value="'Calibri', sans-serif">Calibri</option>
                  <option value="'Verdana', sans-serif">Verdana</option>
                  <option value="'Georgia', serif">Georgia</option>
                  <option value="'Times New Roman', Times, serif">Times New Roman</option>
                  <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                  <option value="'Tahoma', sans-serif">Tahoma</option>
                  <option value="'Courier New', Courier, monospace">Courier New</option>
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
      <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="signatureForm"
        >
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </div>
  );
};
