import React from 'react';
import { SignatureData } from '../../types';

interface PersonalInfoSectionProps {
  signatureData: SignatureData;
  updateSignatureData: <K extends keyof SignatureData>(field: K, value: SignatureData[K]) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  signatureData,
  updateSignatureData,
}) => {

  return (
    <>
      <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la signature
                </label>
                <input 
                  type="text" 
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm"
                  placeholder="Ex: Signature professionnelle"
                  value={signatureData.name}
                  onChange={(e) => updateSignatureData('name', e.target.value)}
                />
              </div>
              
              <div className="col-span-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    checked={signatureData.isDefault}
                    onChange={(e) => updateSignatureData('isDefault', e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-700">Définir comme signature par défaut</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 my-6"></div>
          
          {/* Section Informations personnelles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Photo de profil */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo de profil
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border">
                    {signatureData.profilePhotoUrl ? (
                      <img 
                        src={signatureData.profilePhotoUrl} 
                        alt="Photo de profil" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">Photo</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <button 
                      type="button" 
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Télécharger
                    </button>
                    <div className="text-xs text-gray-500">
                      Format recommandé : PNG ou JPG, max 2MB
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Nom complet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input 
                  type="text" 
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm"
                  placeholder="Ex: Jean Dupont"
                  value={signatureData.fullName}
                  onChange={(e) => updateSignatureData('fullName', e.target.value)}
                />
              </div>
              
              {/* Fonction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fonction
                </label>
                <input 
                  type="text" 
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm"
                  placeholder="Développeur Web"
                  value={signatureData.jobTitle}
                  onChange={(e) => updateSignatureData('jobTitle', e.target.value)}
                />
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input 
                  type="email" 
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm"
                  placeholder="jean.dupont@exemple.com"
                  value={signatureData.email}
                  onChange={(e) => updateSignatureData('email', e.target.value)}
                />
              </div>
              
              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input 
                  type="tel" 
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm"
                  placeholder="01 23 45 67 89"
                  value={signatureData.phone}
                  onChange={(e) => updateSignatureData('phone', e.target.value)}
                />
              </div>
              
              {/* Téléphone mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone mobile
                </label>
                <input 
                  type="tel" 
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm"
                  placeholder="06 12 34 56 78"
                  value={signatureData.mobilePhone}
                  onChange={(e) => updateSignatureData('mobilePhone', e.target.value)}
                />
              </div>
            </div>
          </div>
    </>
  );
};
