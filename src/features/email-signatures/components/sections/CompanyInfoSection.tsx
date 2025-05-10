import React from 'react';
import { SignatureData } from '../../types';

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
  const handleInputChange = (field: keyof SignatureData, value: string) => {
    updateSignatureData(field, value);
  };

  return (
    <>
      <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Informations de l'entreprise</h3>
              <div className="flex space-x-2">
                <button 
                  type="button"
                  className="text-sm text-[#5b50ff] hover:text-[#4a41e0] font-medium flex items-center"
                  onClick={() => {
                    // Fonction pour remplir les champs avec des données de démo
                    updateSignatureData('companyName', 'Newbi');
                    updateSignatureData('companyWebsite', 'https://newbi.fr');
                    updateSignatureData('companyAddress', '123 Avenue des Entrepreneurs, 75000 Paris, France');
                  }}
                >
                  Démo
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
