import React, { useEffect, useState } from 'react';
import { Import } from 'iconsax-react';
import { SignatureData } from '../../types';
import { useCompany } from '../../../profile/hooks';
import { Notification } from '../../../../components/';
import { ImageUploader } from '../../../../components/common/ImageUploader';

interface CompanyInfoSectionProps {
  signatureData: SignatureData;
  updateSignatureData: <K extends keyof SignatureData>(field: K, value: SignatureData[K]) => void;
}

/**
 * Section du formulaire pour les informations de l'entreprise
 */
export const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({
  signatureData,
  updateSignatureData,
}) => {
  // Récupérer les informations de l'entreprise de l'utilisateur
  const { company, loading } = useCompany();
  
  // État pour la prévisualisation du logo
  const [logoPreview, setLogoPreview] = useState<string | null>(signatureData.customLogoUrl || null);
  
  // Fonction simplifiée pour importer les informations de l'entreprise
  const importCompanyInfo = () => {
    if (!company) {
      Notification.warning('Aucune information d\'entreprise disponible');
      return;
    }
    
    console.log('Données d\'entreprise disponibles:', company);
    console.log('Données de signature avant mise à jour:', signatureData);
    
    // Créer un objet avec toutes les mises à jour
    const updates = {
      companyName: company.name || signatureData.companyName,
      companyWebsite: company.website || signatureData.companyWebsite,
      companyAddress: company.address ? 
        `${company.address.street || ''}, ${company.address.postalCode || ''} ${company.address.city || ''}, ${company.address.country || ''}` : 
        signatureData.companyAddress
    };
    
    // Appliquer chaque mise à jour individuellement
    Object.entries(updates).forEach(([key, value]) => {
      console.log(`Mise à jour de ${key}:`, value);
      updateSignatureData(key as keyof SignatureData, value);
    });
    
    // Afficher une notification de succès
    Notification.success('Informations de l\'entreprise importées avec succès', {
      duration: 3000,
      position: 'bottom-left'
    });
  };
  
  // Gérer le changement de logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Vérifier le type de fichier (uniquement images)
    if (!file.type.match('image.*')) {
      Notification.error('Veuillez sélectionner une image valide');
      return;
    }
    
    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      Notification.error('L\'image ne doit pas dépasser 2MB');
      return;
    }
    
    // Convertir l'image en Base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setLogoPreview(base64);
      updateSignatureData('customLogoUrl', base64);
    };
    reader.readAsDataURL(file);
  };
  
  // Gérer la suppression du logo
  const handleRemoveLogo = () => {
    setLogoPreview(null);
    updateSignatureData('customLogoUrl', undefined);
  };
  
  // Surveiller les changements dans les données de l'entreprise
  useEffect(() => {
    if (company) {
      console.log('Données d\'entreprise chargées:', company);
    }
  }, [company]);
  
  // Mettre à jour la prévisualisation du logo lorsque les données de signature changent
  useEffect(() => {
    setLogoPreview(signatureData.customLogoUrl || null);
  }, [signatureData.customLogoUrl]);

  return (
    <>
      <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Informations de l'entreprise</h3>
              <div className="flex space-x-2">
                <button 
                  type="button"
                  className="text-sm text-[#5b50ff] hover:text-[#4a41e0] font-medium flex items-center"
                  onClick={importCompanyInfo}
                  disabled={loading}
                >
                  <Import size="16" color="#5b50ff" variant="Bold" className="mr-1" />
                  {loading ? 'Chargement...' : 'Importer info entreprise'}
                </button>
              </div>
            </div>
            
            {/* Section Logo d'entreprise */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo d'entreprise
              </label>
              <ImageUploader
                imageUrl=""
                previewImage={logoPreview}
                isLoading={false}
                roundedStyle="square"
                imageSize={80}
                objectFit="contain"
                onFileSelect={handleLogoChange}
                onDelete={handleRemoveLogo}
                helpText="Format recommandé: PNG ou SVG, max 2MB"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Nom de l'entreprise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise
                </label>
                <input 
                  type="text" 
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm"
                  placeholder="Newbi"
                  value={signatureData.companyName}
                  onChange={(e) => updateSignatureData('companyName', e.target.value)}
                />
              </div>
              
              {/* Site web */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site web
                </label>
                <input 
                  type="url" 
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm"
                  placeholder="https://www.exemple.com"
                  value={signatureData.companyWebsite}
                  onChange={(e) => updateSignatureData('companyWebsite', e.target.value)}
                />
              </div>
              
              {/* Adresse */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm"
                  placeholder="Ex: 123 Rue Exemple, 75000 Paris, France"
                  value={signatureData.companyAddress}
                  onChange={(e) => updateSignatureData('companyAddress', e.target.value)}
                  rows={2}
                ></textarea>
              </div>
            </div>
          </div>
    </>
  );
};
