import React, { useState, useEffect } from 'react';
import { SignatureData } from '../../types';
import { Checkbox } from '../../../../components/common';
import { ImageUploader } from '../../../../components/common/ImageUploader';
import { NAME_REGEX, EMAIL_REGEX, PHONE_REGEX } from '../../../../utils/validators';

interface PersonalInfoSectionProps {
  signatureData: SignatureData;
  updateSignatureData: <K extends keyof SignatureData>(field: K, value: SignatureData[K]) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  signatureData,
  updateSignatureData,
}) => {
  // État local pour la prévisualisation de la photo de profil
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    signatureData.profilePhotoBase64 || signatureData.profilePhotoUrl || null
  );
  
  // États pour gérer les erreurs de validation
  const [errors, setErrors] = useState({
    name: '',
    fullName: '',
    email: '',
    phone: '',
    mobilePhone: ''
  });
  
  // Mettre à jour la prévisualisation lorsque les données de signature changent
  useEffect(() => {
    // Utiliser un logger personnalisé plutôt que console.log pour le débogage
    // logger.debug('Photo URL:', signatureData.profilePhotoUrl);
    // logger.debug('Photo Base64:', signatureData.profilePhotoBase64 ? 'Présent' : 'Absent');
    
    setProfilePhotoPreview(signatureData.profilePhotoBase64 || signatureData.profilePhotoUrl || null);
  }, [signatureData.profilePhotoBase64, signatureData.profilePhotoUrl]);
  
  // Fonctions de validation
  const validateName = (value: string) => {
    if (!value.trim()) return "Le nom de la signature est requis";
    return "";
  };
  
  const validateFullName = (value: string) => {
    if (!value.trim()) return "Le nom complet est requis";
    if (!NAME_REGEX.test(value)) return "Le nom ne doit contenir que des lettres, espaces, tirets ou apostrophes";
    return "";
  };
  
  const validateEmail = (value: string) => {
    if (!value.trim()) return "L'email est requis";
    if (!EMAIL_REGEX.test(value)) return "Format d'email invalide";
    return "";
  };
  
  const validatePhone = (value: string) => {
    if (value.trim() && !PHONE_REGEX.test(value)) return "Format de téléphone invalide";
    return "";
  };

  return (
    <>
      <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-8">Informations générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la signature
                </label>
                <input 
                  type="text" 
                  className={`w-full h-10 px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm`}
                  placeholder="Ex: Signature professionnelle"
                  value={signatureData.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateSignatureData('name', value);
                    const error = validateName(value);
                    setErrors(prev => ({ ...prev, name: error }));
                  }}
                  onBlur={(e) => {
                    const error = validateName(e.target.value);
                    setErrors(prev => ({ ...prev, name: error }));
                  }}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
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
                  imageUrl={signatureData.profilePhotoUrl || ''} // Utiliser l'URL de la photo de profil si disponible
                  apiBaseUrl="" // URL de base vide car l'URL est déjà complète dans convertSignatureToFormData
                  previewImage={profilePhotoPreview} // Utiliser l'état local pour la prévisualisation
                  isLoading={false}
                  roundedStyle="full"
                  imageSize={80} /* Taille fixe pour l'aperçu dans le composant d'upload */
                  objectFit="cover"
                  onFileSelect={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Convertir l'image en base64 pour la prévisualisation
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const base64 = event.target?.result as string;
                        // Mettre à jour l'état local ET les données de signature avec l'image en base64
                        setProfilePhotoPreview(base64);
                        updateSignatureData('profilePhotoBase64' as any, base64);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  onDelete={() => {
                    // Réinitialiser l'aperçu local
                    setProfilePhotoPreview(null);
                    
                    // Effacer les données de l'image
                    updateSignatureData('profilePhotoBase64' as any, null);
                    updateSignatureData('profilePhotoUrl' as any, null);
                    
                    // Réinitialiser la taille de la photo à la valeur par défaut
                    updateSignatureData('profilePhotoSize', 80);
                    
                    // Marquer comme supprimé
                    updateSignatureData('profilePhotoToDelete' as any, true);
                    
                    console.log('[DEBUG] Photo supprimée, profilePhotoSize réinitialisé et profilePhotoToDelete mis à true');
                  }}
                />
                
                {/* Slider pour la taille de la photo de profil - n'afficher que si une photo est présente et non marquée comme supprimée */}
                {(signatureData.profilePhotoUrl || signatureData.profilePhotoBase64) && !signatureData.profilePhotoToDelete && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Taille de la photo ({signatureData.profilePhotoSize || 80}px)
                    </h4>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="40"
                        max="120"
                        step="5"
                        value={signatureData.profilePhotoSize || 80}
                        onChange={(e) => {
                          const newSize = parseInt(e.target.value);
                          console.log('[DEBUG] PersonalInfoSection - Nouvelle taille de photo:', newSize);
                          // Mettre à jour directement la taille de l'image
                          updateSignatureData('profilePhotoSize', newSize);
                          
                          // Forcer un rendu en mettant à jour une autre propriété qui n'affecte pas l'apparence
                          // mais qui force React à recalculer le rendu
                          setTimeout(() => {
                            // Utiliser un setTimeout pour s'assurer que la mise à jour précédente est terminée
                            updateSignatureData('profilePhotoSize', newSize);
                          }, 0);
                        }}
                        className="w-2/5 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5b50ff]"
                      />
                      <div className="flex items-center justify-center w-10 h-8 bg-white border border-gray-300 rounded-lg text-sm">
                        {signatureData.profilePhotoSize || 80}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Nom complet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input 
                  type="text" 
                  className={`w-full h-10 px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm`}
                  placeholder="Ex: Jean Dupont"
                  value={signatureData.fullName}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateSignatureData('fullName', value);
                    const error = validateFullName(value);
                    setErrors(prev => ({ ...prev, fullName: error }));
                  }}
                  onBlur={(e) => {
                    const error = validateFullName(e.target.value);
                    setErrors(prev => ({ ...prev, fullName: error }));
                  }}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
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
                  className={`w-full h-10 px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm`}
                  placeholder="jean.dupont@exemple.com"
                  value={signatureData.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateSignatureData('email', value);
                    const error = validateEmail(value);
                    setErrors(prev => ({ ...prev, email: error }));
                  }}
                  onBlur={(e) => {
                    const error = validateEmail(e.target.value);
                    setErrors(prev => ({ ...prev, email: error }));
                  }}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input 
                  type="tel" 
                  className={`w-full h-10 px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm`}
                  placeholder="01 23 45 67 89"
                  value={signatureData.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateSignatureData('phone', value);
                    const error = validatePhone(value);
                    setErrors(prev => ({ ...prev, phone: error }));
                  }}
                  onBlur={(e) => {
                    const error = validatePhone(e.target.value);
                    setErrors(prev => ({ ...prev, phone: error }));
                  }}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
              
              {/* Téléphone mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone mobile
                </label>
                <input 
                  type="tel" 
                  className={`w-full h-10 px-3 py-2 border ${errors.mobilePhone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm`}
                  placeholder="06 12 34 56 78"
                  value={signatureData.mobilePhone || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateSignatureData('mobilePhone', value);
                    const error = validatePhone(value);
                    setErrors(prev => ({ ...prev, mobilePhone: error }));
                  }}
                  onBlur={(e) => {
                    const error = validatePhone(e.target.value);
                    setErrors(prev => ({ ...prev, mobilePhone: error }));
                  }}
                />
                {errors.mobilePhone && (
                  <p className="mt-1 text-sm text-red-500">{errors.mobilePhone}</p>
                )}
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
                        checked={signatureData.showEmailIcon !== false}
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
                        checked={signatureData.showPhoneIcon !== false}
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
                        checked={signatureData.showAddressIcon !== false}
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
                        checked={signatureData.showWebsiteIcon !== false}
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
