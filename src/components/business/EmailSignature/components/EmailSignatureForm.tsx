import React, { useState, useEffect } from 'react';
import { Button, TextField, TextArea } from '../../../ui';
import Collapse from '../../../ui/Collapse';
import { EmailSignature } from './EmailSignaturesTable';
import { EMAIL_PATTERN } from '../../../../constants/formValidations';
import { useCompany } from '../../../../hooks/useCompany';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

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
  const [template, setTemplate] = useState(initialData?.template || 'simple');
  const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || '#0066cc');
  const [secondaryColor, setSecondaryColor] = useState(initialData?.secondaryColor || '#f5f5f5');
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || '');
  const [showLogo, setShowLogo] = useState(initialData?.showLogo !== undefined ? initialData.showLogo : true);
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);
  
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
      
      // Effacer les erreurs potentielles après le remplissage
      setErrors(prev => ({
        ...prev,
        companyName: '',
        address: '',
        logoUrl: ''
      }));
    }
  };

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
      logoUrl: logoUrl ? getFullLogoUrl(logoUrl) : undefined,
      showLogo,
      isDefault
    };

    console.log('Soumission du formulaire avec les données:', signatureData);
    
    // Appel de la fonction de soumission passée en props
    onSubmit(signatureData as EmailSignature);
  };

  // Fonction de validation du formulaire
  const validateForm = (): Record<string, string> => {
    const validationErrors: Record<string, string> = {};
    
    // Validation des champs obligatoires
    if (!name) validationErrors.name = 'Le nom de la signature est requis';
    if (!fullName) validationErrors.fullName = 'Le nom complet est requis';
    if (!jobTitle) validationErrors.jobTitle = 'Le titre du poste est requis';
    
    // Validation de l'email
    if (!email) {
      validationErrors.email = 'L\'email est requis';
    } else if (!EMAIL_PATTERN.test(email)) {
      validationErrors.email = 'Format d\'email invalide';
    }
    
    return validationErrors;
  };

  // Mettre à jour la prévisualisation en temps réel
  useEffect(() => {
    // Création d'un objet avec toutes les valeurs du formulaire
    const formData: Partial<EmailSignature> = {
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
      isDefault
    };
    
    // Mise à jour des données pour la prévisualisation
    if (onChange) onChange(formData);
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

              {/* Affichage du logo de l'entreprise - uniquement si les informations de l'entreprise ont été récupérées */}
              {companyName && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo de l'entreprise</label>
                  <div className="flex items-center space-x-4">
                    {company?.logo ? (
                      <>
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-50">
                          <img 
                            src={getFullLogoUrl(company.logo)} 
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
                            value={getFullLogoUrl(company.logo) || ''}
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
              )}
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
                label="Twitter"
                placeholder="Ex: https://twitter.com/jeandupont"
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
            </div>
          </Collapse>

          <Collapse title="Apparence" defaultOpen={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    className={`border rounded-md p-3 cursor-pointer ${template === 'simple' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                    onClick={() => setTemplate('simple')}
                  >
                    <div className="text-sm font-medium">Simple</div>
                    <div className="text-xs text-gray-500">Design épuré et minimaliste</div>
                  </div>
                  <div 
                    className={`border rounded-md p-3 cursor-pointer ${template === 'professional' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                    onClick={() => setTemplate('professional')}
                  >
                    <div className="text-sm font-medium">Professionnel</div>
                    <div className="text-xs text-gray-500">Mise en page structurée</div>
                  </div>
                  <div 
                    className={`border rounded-md p-3 cursor-pointer ${template === 'modern' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                    onClick={() => setTemplate('modern')}
                  >
                    <div className="text-sm font-medium">Moderne</div>
                    <div className="text-xs text-gray-500">Design contemporain</div>
                  </div>
                  <div 
                    className={`border rounded-md p-3 cursor-pointer ${template === 'creative' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                    onClick={() => setTemplate('creative')}
                  >
                    <div className="text-sm font-medium">Créatif</div>
                    <div className="text-xs text-gray-500">Design audacieux</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
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
              </div>
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
