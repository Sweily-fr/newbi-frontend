import React, { useState, useRef } from 'react';
import { SignatureData } from '../../types';
import { Checkbox } from '../../../../components/common';
import { ImageUploader } from '../../../../components/ui/ImageUploader';

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
                <Checkbox 
                  id="isDefault"
                  name="isDefault"
                  label="Définir comme signature par défaut"
                  checked={signatureData.isDefault}
                  onChange={(e) => updateSignatureData('isDefault', e.target.checked)}
                />
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
                <ImageUploader
                  imageUrl={signatureData.profilePhotoUrl || ''}
                  previewImage={signatureData.profilePhotoBase64 || null}
                  isLoading={false}
                  roundedStyle="full"
                  imageSize={80}
                  objectFit="cover"
                  onFileSelect={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Convertir l'image en base64 pour la prévisualisation
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const base64 = event.target?.result as string;
                        // Mettre à jour les données de signature avec l'image en base64
                        updateSignatureData('profilePhotoBase64' as any, base64);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  onDelete={() => {
                    // Supprimer la photo de profil
                    updateSignatureData('profilePhotoBase64' as any, null);
                    updateSignatureData('profilePhotoUrl' as any, '');
                    updateSignatureData('profilePhotoToDelete' as any, true);
                  }}
                />
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
              
              {/* Section pour les options d'affichage des icônes */}
              <div className="col-span-2 mt-4">
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Options d'affichage des icônes</h4>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Checkbox 
                        id="showEmailIcon"
                        name="showEmailIcon"
                        label="Afficher l'icône pour l'email"
                        checked={Boolean(signatureData.showEmailIcon)}
                        onChange={(e) => {
                          const field = 'showEmailIcon';
                          updateSignatureData(field as any, e.target.checked);
                        }}
                      />
                    </div>
                    <div>
                      <Checkbox 
                        id="showPhoneIcon"
                        name="showPhoneIcon"
                        label="Afficher l'icône pour le téléphone"
                        checked={Boolean(signatureData.showPhoneIcon)}
                        onChange={(e) => {
                          const field = 'showPhoneIcon';
                          updateSignatureData(field as any, e.target.checked);
                        }}
                      />
                    </div>
                    <div>
                      <Checkbox 
                        id="showAddressIcon"
                        name="showAddressIcon"
                        label="Afficher l'icône pour l'adresse"
                        checked={Boolean(signatureData.showAddressIcon)}
                        onChange={(e) => {
                          const field = 'showAddressIcon';
                          updateSignatureData(field as any, e.target.checked);
                        }}
                      />
                    </div>
                    <div>
                      <Checkbox 
                        id="showWebsiteIcon"
                        name="showWebsiteIcon"
                        label="Afficher l'icône pour le site web"
                        checked={Boolean(signatureData.showWebsiteIcon)}
                        onChange={(e) => {
                          const field = 'showWebsiteIcon';
                          updateSignatureData(field as any, e.target.checked);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </>
  );
};
