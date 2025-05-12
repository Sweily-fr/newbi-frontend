import React, { useEffect } from 'react';
import { Import } from 'iconsax-react';
import { SignatureData } from '../../types';
import { useCompany } from '../../../profile/hooks';
import { Notification } from '../../../../components/feedback';

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
  
  // Surveiller les changements dans les données de l'entreprise
  useEffect(() => {
    if (company) {
      console.log('Données d\'entreprise chargées:', company);
    }
  }, [company]);

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
