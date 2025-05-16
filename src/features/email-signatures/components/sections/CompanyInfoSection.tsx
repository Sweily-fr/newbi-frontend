import React, { useEffect, useState } from 'react';
import { Import, InfoCircle } from 'iconsax-react';
import { SignatureData } from '../../types';
import { useCompany } from '../../../profile/hooks';
import { Notification } from '../../../../components/';
import { Checkbox } from '../../../../components/common/Checkbox';
import { NAME_REGEX, URL_REGEX } from '../../../../utils/validators';

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
  
  // États locaux pour les champs d'entreprise
  const [localCompanyName, setLocalCompanyName] = useState(signatureData.companyName);
  const [localCompanyWebsite, setLocalCompanyWebsite] = useState(signatureData.companyWebsite);
  const [localCompanyAddress, setLocalCompanyAddress] = useState(signatureData.companyAddress);
  
  // État pour gérer l'affichage du logo dans la prévisualisation
  const [showLogo, setShowLogo] = useState(signatureData.showLogo !== false);
  
  // États pour gérer les erreurs de validation
  const [errors, setErrors] = useState({
    companyName: '',
    companyWebsite: '',
    companyAddress: ''
  });
  
  // Fonctions de validation
  const validateCompanyName = (value: string) => {
    if (value.trim() && !NAME_REGEX.test(value)) {
      return "Le nom de l'entreprise ne doit contenir que des lettres, espaces, tirets ou apostrophes";
    }
    return "";
  };
  
  const validateWebsite = (value: string) => {
    if (value.trim() && !URL_REGEX.test(value)) {
      return "Format d'URL invalide";
    }
    return "";
  };
  
  // S'assurer que la valeur initiale de showLogo est correctement définie dans les données de signature
  useEffect(() => {
    // Définir explicitement la valeur de showLogo dans les données de signature au chargement
    updateSignatureData('showLogo', showLogo);
  }, []);
  
  // Synchroniser les états locaux avec les données de signature
  useEffect(() => {
    updateSignatureData('companyName', localCompanyName);
    updateSignatureData('companyWebsite', localCompanyWebsite);
    updateSignatureData('companyAddress', localCompanyAddress);

  }, [localCompanyName, localCompanyWebsite, localCompanyAddress]);
  
  // État pour suivre si les informations de l'entreprise ont été explicitement importées via le bouton
  const [companyInfoImported, setCompanyInfoImported] = useState(false);
  
  // Récupérer l'URL de l'API depuis les variables d'environnement
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
  
  /**
   * Importe les informations de l'entreprise depuis les données de l'API
   * Cette fonction utilise des états locaux pour éviter les conflits d'état
   */
  const importCompanyInfo = () => {
    if (!company) {
      Notification.warning('Aucune information d\'entreprise disponible');
      return;
    }
    
    
    // Formater l'URL du logo si elle existe
    let logoUrl = '';
    if (company.logo) {
      logoUrl = company.logo;
      
      // Assurer que l'URL est complète
      if (logoUrl.startsWith('/uploads/')) {
        logoUrl = `${apiUrl}${logoUrl}`;
      } else if (logoUrl.startsWith('uploads/')) {
        logoUrl = `${apiUrl}/${logoUrl}`;
      } else if (!logoUrl.startsWith('http')) {
        logoUrl = `http://${logoUrl}`;
      }
      
      // Vérifier si l'URL contient déjà le domaine de l'API
      if (logoUrl.includes('company-logos') && !logoUrl.includes(apiUrl)) {
        const logoPath = logoUrl.includes('/uploads/') 
          ? logoUrl.substring(logoUrl.indexOf('/uploads/')) 
          : `/uploads/company-logos/${logoUrl.split('/').pop()}`;
        logoUrl = `${apiUrl}${logoPath}`;
      }
    }
    
    // Préparer les données formatées
    const companyName = company.name || '';
    const companyWebsite = company.website 
      ? (company.website.startsWith('http') ? company.website : `https://${company.website}`)
      : '';
    const companyAddress = company.address 
      ? `${company.address.street || ''}, ${company.address.postalCode || ''} ${company.address.city || ''}, ${company.address.country || ''}`
      : '';
    
    try {
      // Mettre à jour les états locaux au lieu de mettre à jour directement signatureData
      // Cela déclenchera les effets qui mettront à jour signatureData
      
      setLocalCompanyName(companyName);
      setLocalCompanyWebsite(companyWebsite);
      setLocalCompanyAddress(companyAddress);
      
      // Mettre à jour le logo directement car il n'a pas d'état local
      if (logoUrl) {
        updateSignatureData('customLogoUrl', logoUrl);
      }
      
      // Marquer que les informations de l'entreprise ont été importées
      setCompanyInfoImported(true);
      
      // Afficher une notification de succès
      Notification.success('Informations de l\'entreprise importées avec succès', {
        duration: 3000,
        position: 'bottom-left'
      });
      
    } catch (error) {
      Notification.error('Erreur lors de l\'importation des données');
    }
  };
  
  // Les fonctions de gestion du logo ont été supprimées car le logo est uniquement géré via l'importation des informations d'entreprise
  
  // Surveiller les changements dans les données de l'entreprise
  useEffect(() => {
    if (company) {
      console.log('Données d\'entreprise chargées:');
    }
  }, [company]);
  
  // Nous supprimons l'effet qui définit automatiquement companyInfoImported à true
  // pour que seul le clic sur le bouton d'importation puisse activer l'affichage du logo

  return (
    <>
      <div>
            <div className="flex items-center justify-between mb-8">
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
            
            {/* Affichage du logo d'entreprise uniquement après importation explicite */}
            {companyInfoImported && signatureData.customLogoUrl && (
              <div className="mb-6">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo d'entreprise
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="relative w-20 h-20 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden bg-gray-50">
                    {signatureData.customLogoUrl ? (
                      <>
                        {/* Utiliser une image avec source absolue */}
                        <img 
                          src={signatureData.customLogoUrl} 
                          alt="Logo entreprise" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Afficher un message d'erreur à la place de l'image
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            // Ajouter un message d'erreur dans le parent
                            const parent = target.parentElement;
                            if (parent) {
                              const errorMsg = document.createElement('div');
                              errorMsg.className = 'text-red-500 text-xs text-center';
                              errorMsg.innerText = 'Erreur de chargement';
                              parent.appendChild(errorMsg);
                            }
                          }}
                          onLoad={() => console.log('Image chargée avec succès:', signatureData.customLogoUrl)}
                        />
                        {/* Aucun lien visuel sur l'image */}
                      </>
                    ) : (
                      <div className="text-gray-400 text-sm">Logo non disponible</div>
                    )}
                    </div>
                    
                    {/* Icône d'information positionnée en haut à droite du cercle */}
                    <div className="absolute -top-[-1px] -right-[-1px] group">
                      <InfoCircle size="16" color="#5b50ff" variant="Bold" className="cursor-help" />
                      <div className="absolute right-0 -top-2 transform -translate-y-full hidden group-hover:block w-64 bg-white border border-gray-200 rounded-md shadow-md p-3 z-10 origin-top-right">
                        <p className="text-sm text-gray-700 mb-1">Le logo de votre entreprise sera utilisé dans votre signature email.</p>
                        <p className="text-xs text-gray-500">Pour modifier ce logo, rendez-vous dans les paramètres de votre entreprise.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <Checkbox
                        id="show-logo-checkbox"
                        name="showLogo"
                        label="Afficher le logo"
                        checked={showLogo}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setShowLogo(isChecked);
                          // Mettre à jour les données de signature avec la nouvelle valeur
                          updateSignatureData('showLogo', isChecked);
                        }}
                      />
                    </div>
                    {/* Le bouton "Tester l'URL" a été supprimé */}
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Nom de l'entreprise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise
                </label>
                <input 
                  type="text" 
                  className={`w-full h-10 px-3 py-2 border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm`}
                  placeholder="Newbi"
                  value={localCompanyName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalCompanyName(value);
                    const error = validateCompanyName(value);
                    setErrors(prev => ({ ...prev, companyName: error }));
                  }}
                  onBlur={(e) => {
                    const error = validateCompanyName(e.target.value);
                    setErrors(prev => ({ ...prev, companyName: error }));
                  }}
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
                )}
              </div>
              
              {/* Site web */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site web
                </label>
                <input 
                  type="url" 
                  className={`w-full h-10 px-3 py-2 border ${errors.companyWebsite ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm`}
                  placeholder="https://www.exemple.com"
                  value={localCompanyWebsite}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalCompanyWebsite(value);
                    const error = validateWebsite(value);
                    setErrors(prev => ({ ...prev, companyWebsite: error }));
                  }}
                  onBlur={(e) => {
                    const error = validateWebsite(e.target.value);
                    setErrors(prev => ({ ...prev, companyWebsite: error }));
                  }}
                />
                {errors.companyWebsite && (
                  <p className="mt-1 text-sm text-red-500">{errors.companyWebsite}</p>
                )}
              </div>
              
              {/* Adresse */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm"
                  placeholder="Ex: 123 Rue Exemple, 75000 Paris, France"
                  value={localCompanyAddress}
                  onChange={(e) => {
                    setLocalCompanyAddress(e.target.value);
                  }}
                  rows={2}
                ></textarea>
              </div>
            </div>
          </div>
    </>
  );
};
