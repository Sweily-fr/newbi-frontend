import React, { MouseEvent } from 'react';
import { Button, TextField, TextArea, Checkbox } from '../../../../components/ui';
import Collapse from '../../../../components/ui/Collapse';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useEmailSignatureForm } from '../../hooks/useEmailSignatureForm';

// Utiliser any pour contourner les problèmes de compatibilité entre les types
interface EmailSignatureFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  onChange?: (data: any) => void;
  hideButtons?: boolean; // Option pour masquer les boutons d'action
}

export const EmailSignatureForm: React.FC<EmailSignatureFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  onChange,
  hideButtons = false // Par défaut, les boutons sont affichés
}) => {
  // Utiliser le hook personnalisé pour gérer la logique du formulaire
  const {
    // États du formulaire
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
    updateSocialLink,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    logoUrl,
    // setLogoUrl n'est pas utilisé car le logo est géré ailleurs
    showLogo,
    setShowLogo,
    isDefault,
    setIsDefault,
    
    // États pour la photo de profil
    profilePhotoUrl,
    // profilePhotoBase64 est utilisé indirectement via previewProfilePhoto
    previewProfilePhoto,
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
    submitError,
    isSubmitting,
    
    // Méthodes
    handleSubmit,
    // Nous n'utilisons pas handleCancel du hook car nous avons déjà onCancel dans les props
    handleProfilePhotoSelect,
    handleProfilePhotoDelete,
    importCompanyInfo,
    getFullLogoUrl
  } = useEmailSignatureForm({
    initialData,
    onSubmit,
    onChange
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section des informations générales */}
      <Collapse title="Informations générales" defaultOpen>
        <div className="space-y-4">
          {/* Nom de la signature */}
          <TextField
            id="signature-name"
            name="name"
            label="Nom de la signature"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Signature professionnelle"
            error={errors.name}
            required
          />
          
          <Checkbox
            id="is-default"
            name="isDefault"
            label="Définir comme signature par défaut"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
          />
        </div>
      </Collapse>
      
      {/* Section des informations personnelles */}
      <Collapse title="Informations personnelles" defaultOpen>
        <div className="space-y-4">
          {/* Photo de profil */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Photo de profil
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border">
                {previewProfilePhoto ? (
                  <img 
                    src={previewProfilePhoto} 
                    alt="Photo de profil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">Photo</span>
                )}
              </div>
              <div className="space-y-2">
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline"
                  onClick={(_: MouseEvent<HTMLButtonElement>) => {
                    // Utiliser le gestionnaire fourni par le hook
                    // Créer un input file temporaire pour sélectionner une image
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = handleProfilePhotoSelect as any;
                    input.click();
                  }}
                >
                  Télécharger
                </Button>
                {previewProfilePhoto && (
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={handleProfilePhotoDelete}
                  >
                    Supprimer
                  </Button>
                )}
                <div className="text-xs text-gray-500">
                  Format recommandé : PNG ou JPG, max 2MB. Cette photo apparaîtra dans votre signature email.
                </div>
              </div>
            </div>
          </div>
          
          {/* Nom complet */}
          <TextField
            id="full-name"
            name="fullName"
            label="Nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ex: Jean Dupont"
            error={errors.fullName}
            required
          />
          
          {/* Fonction */}
          <TextField
            id="job-title"
            name="jobTitle"
            label="Fonction"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Ex: Directeur commercial"
          />
          
          {/* Email */}
          <TextField
            id="email"
            name="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex: jean.dupont@example.com"
            error={errors.email}
            required
          />
          
          {/* Téléphone */}
          <TextField
            id="phone"
            name="phone"
            label="Téléphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ex: +33 1 23 45 67 89"
          />
          
          {/* Téléphone mobile */}
          <TextField
            id="mobile-phone"
            name="mobilePhone"
            label="Téléphone mobile"
            value={mobilePhone}
            onChange={(e) => setMobilePhone(e.target.value)}
            placeholder="Ex: +33 6 12 34 56 78"
          />
        </div>
      </Collapse>
      
      {/* Section des informations de l'entreprise */}
      <Collapse title="Informations de l'entreprise">
        <div className="space-y-4">
          {/* Nom de l'entreprise */}
          <TextField
            id="company-name"
            name="companyName"
            label="Nom de l'entreprise"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Ex: Entreprise XYZ"
          />
          
          {/* Site web */}
          <TextField
            id="website"
            name="website"
            label="Site web"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Ex: https://www.example.com"
          />
          
          {/* Adresse */}
          <TextArea
            id="address"
            name="address"
            label="Adresse"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ex: 123 Rue Exemple\n75000 Paris\nFrance"
            rows={3}
          />
          
          {/* Logo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="logo-url" className="block text-sm font-medium text-gray-700">
                URL du logo
              </label>
              <Button 
                type="button" 
                size="sm" 
                variant="outline"
                onClick={importCompanyInfo}
                className="flex items-center"
              >
                <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                Importer les infos de l'entreprise
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <TextField
                id="logo-url"
                name="logoUrl"
                value={logoUrl || ''}
                onChange={() => {}} // Géré par le hook
                placeholder="Ex: https://www.example.com/logo.png"
                className="flex-grow"
                disabled
              />
              <Button type="button" size="sm" variant="outline" onClick={() => console.log('Parcourir')}>Parcourir</Button>
            </div>
            {logoUrl && (
              <div className="mt-2">
                <img 
                  src={getFullLogoUrl(logoUrl)} 
                  alt="Logo de l'entreprise" 
                  className="max-h-16 max-w-xs"
                />
              </div>
            )}
            <Checkbox
              id="show-logo"
              name="showLogo"
              label="Afficher le logo dans la signature"
              checked={showLogo}
              onChange={(e) => setShowLogo(e.target.checked)}
            />
          </div>
        </div>
      </Collapse>
      
      {/* Section des réseaux sociaux */}
      <Collapse title="Réseaux sociaux">
        <div className="space-y-4">
          {/* LinkedIn */}
          <TextField
            id="linkedin"
            name="linkedin"
            label="LinkedIn"
            value={socialLinks?.linkedin || ''}
            onChange={(e) => updateSocialLink('linkedin', e.target.value)}
            placeholder="Ex: https://www.linkedin.com/in/username"
          />
          
          {/* Twitter */}
          <TextField
            id="twitter"
            name="twitter"
            label="Twitter"
            value={socialLinks?.twitter || ''}
            onChange={(e) => updateSocialLink('twitter', e.target.value)}
            placeholder="Ex: https://twitter.com/username"
          />
          
          {/* Facebook */}
          <TextField
            id="facebook"
            name="facebook"
            label="Facebook"
            value={socialLinks?.facebook || ''}
            onChange={(e) => updateSocialLink('facebook', e.target.value)}
            placeholder="Ex: https://www.facebook.com/username"
          />
          
          {/* Instagram */}
          <TextField
            id="instagram"
            name="instagram"
            label="Instagram"
            value={socialLinks?.instagram || ''}
            onChange={(e) => updateSocialLink('instagram', e.target.value)}
            placeholder="Ex: https://www.instagram.com/username"
          />
          
          {/* Mode d'affichage des réseaux sociaux */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Mode d'affichage des réseaux sociaux
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="socialLinksDisplayMode"
                  value="icons"
                  checked={socialLinksDisplayMode === 'icons'}
                  onChange={() => setSocialLinksDisplayMode('icons')}
                />
                <span className="ml-2">Icônes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="socialLinksDisplayMode"
                  value="text"
                  checked={socialLinksDisplayMode === 'text'}
                  onChange={() => setSocialLinksDisplayMode('text')}
                />
                <span className="ml-2">Texte</span>
              </label>
            </div>
          </div>
          
          {/* Position des réseaux sociaux */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Position des réseaux sociaux
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="socialLinksPosition"
                  value="bottom"
                  checked={socialLinksPosition === 'bottom'}
                  onChange={() => setSocialLinksPosition('bottom')}
                />
                <span className="ml-2">En bas</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="socialLinksPosition"
                  value="right"
                  checked={socialLinksPosition === 'right'}
                  onChange={() => setSocialLinksPosition('right')}
                />
                <span className="ml-2">À droite</span>
              </label>
            </div>
          </div>
          
          {/* Style des icônes des réseaux sociaux */}
          {socialLinksDisplayMode === 'icons' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Style des icônes
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="socialLinksIconStyle"
                    value="plain"
                    checked={socialLinksIconStyle === 'plain'}
                    onChange={() => setSocialLinksIconStyle('plain')}
                  />
                  <span className="ml-2">Simple</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="socialLinksIconStyle"
                    value="rounded"
                    checked={socialLinksIconStyle === 'rounded'}
                    onChange={() => setSocialLinksIconStyle('rounded')}
                  />
                  <span className="ml-2">Arrondi</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="socialLinksIconStyle"
                    value="circle"
                    checked={socialLinksIconStyle === 'circle'}
                    onChange={() => setSocialLinksIconStyle('circle')}
                  />
                  <span className="ml-2">Cercle</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </Collapse>
      
      {/* Section de la photo de profil */}
      <Collapse title="Photo de profil" defaultOpen={false}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Photo de profil</label>
            <div className="flex items-start gap-4">
              {(previewProfilePhoto || profilePhotoUrl) && (
                <div className="relative">
                  <img
                    src={previewProfilePhoto || profilePhotoUrl}
                    alt="Photo de profil"
                    className="h-16 w-16 object-cover rounded-full"
                  />
                  <button
                    type="button"
                    onClick={handleProfilePhotoDelete}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    aria-label="Supprimer la photo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
              <div className="flex-1">
                {/* Utiliser un input de type file standard puisque ImageUploader ne correspond pas à l'interface attendue */}
                <div className="flex flex-col space-y-1">
                  <label htmlFor="profile-photo" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                    Choisir une photo
                  </label>
                  <input
                    id="profile-photo"
                    name="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoSelect}
                    className="sr-only"
                  />
                  <p className="text-xs text-gray-500">Formats acceptés: JPG, PNG. Taille max: 2MB</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Taille de la photo de profil */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Taille de la photo (px)
            </label>
            <input
              type="range"
              min="40"
              max="120"
              step="5"
              value={profilePhotoSize}
              onChange={(e) => setProfilePhotoSize(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-500 text-center">{profilePhotoSize}px</div>
          </div>
        </div>
      </Collapse>
      
      {/* Section de mise en page */}
      <Collapse title="Mise en page" defaultOpen={false}>
        <div className="space-y-4">
          {/* Disposition de la signature */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Disposition de la signature
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="layout"
                  value="horizontal"
                  checked={layout === 'horizontal'}
                  onChange={() => setLayout('horizontal')}
                />
                <span className="ml-2">Horizontale</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="layout"
                  value="vertical"
                  checked={layout === 'vertical'}
                  onChange={() => setLayout('vertical')}
                />
                <span className="ml-2">Verticale</span>
              </label>
            </div>
          </div>
          
          {/* Options spécifiques à la disposition horizontale */}
          {layout === 'horizontal' && (
            <>
              {/* Espacement horizontal */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Espacement horizontal (px)
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={horizontalSpacing}
                  onChange={(e) => setHorizontalSpacing(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 text-center">{horizontalSpacing}px</div>
              </div>
              
              {/* Espacement vertical */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Espacement vertical (px)
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={verticalSpacing}
                  onChange={(e) => setVerticalSpacing(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 text-center">{verticalSpacing}px</div>
              </div>
            </>
          )}
          
          {/* Options spécifiques à la disposition verticale */}
          {layout === 'vertical' && (
            <>
              {/* Alignement du texte */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Alignement du texte
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="verticalAlignment"
                      value="left"
                      checked={verticalAlignment === 'left'}
                      onChange={() => setVerticalAlignment('left')}
                    />
                    <span className="ml-2">Gauche</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="verticalAlignment"
                      value="center"
                      checked={verticalAlignment === 'center'}
                      onChange={() => setVerticalAlignment('center')}
                    />
                    <span className="ml-2">Centre</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="verticalAlignment"
                      value="right"
                      checked={verticalAlignment === 'right'}
                      onChange={() => setVerticalAlignment('right')}
                    />
                    <span className="ml-2">Droite</span>
                  </label>
                </div>
              </div>
              
              {/* Disposition des images */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Disposition des images
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="imagesLayout"
                      value="horizontal"
                      checked={imagesLayout === 'horizontal'}
                      onChange={() => setImagesLayout('horizontal')}
                    />
                    <span className="ml-2">Horizontale</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="imagesLayout"
                      value="vertical"
                      checked={imagesLayout === 'vertical'}
                      onChange={() => setImagesLayout('vertical')}
                    />
                    <span className="ml-2">Verticale</span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      </Collapse>
      
      {/* Section de style */}
      <Collapse title="Style" defaultOpen={false}>
        <div className="space-y-4">
          {/* Couleur principale */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Couleur principale
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-8 w-8 rounded-full border-0"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          {/* Couleur secondaire */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Couleur secondaire
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-8 w-8 rounded-full border-0"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          {/* Police de caractères */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Police de caractères
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Courier New, monospace">Courier New</option>
              <option value="Verdana, sans-serif">Verdana</option>
            </select>
          </div>
          
          {/* Taille de police */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Taille de police (px)
            </label>
            <input
              type="range"
              min="10"
              max="18"
              step="1"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-500 text-center">{fontSize}px</div>
          </div>
        </div>
      </Collapse>
      
      {/* Section des options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Options</h3>
        
        {/* Signature par défaut */}
        <div className="flex items-center">
          <Checkbox
            id="isDefault"
            name="isDefault"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            label="Définir comme signature par défaut"
          />
        </div>
      </div>
      
      {/* Erreur de soumission */}
      {submitError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{submitError}</h3>
            </div>
          </div>
        </div>
      )}
      
      {/* Boutons d'action - affichés seulement si hideButtons est false */}
      {!hideButtons && (
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onCancel()}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {initialData?.id ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      )}
    </form>
  );
};
