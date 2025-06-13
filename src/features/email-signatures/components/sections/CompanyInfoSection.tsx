import React, { useEffect, useState, useRef } from 'react';
import { Import, InfoCircle } from 'iconsax-react';
import { SignatureData, EmailSignature } from '../../types';
import { useCompany } from '../../../profile/hooks';
import { Notification } from '../../../../components/';
import { Checkbox } from '../../../../components/common/Checkbox';
import { NAME_REGEX, URL_REGEX } from '../../../../utils/validators';

interface CompanyInfoSectionProps {
  signatureData: SignatureData;
  updateSignatureData: <K extends keyof SignatureData>(field: K, value: SignatureData[K]) => void;
  selectedSignature?: EmailSignature; // Pour savoir si on est en mode édition
  validationErrors?: {
    companyName?: string;
  };
}

/**
 * Section du formulaire pour les informations de l'entreprise
 */
export const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({
  signatureData,
  updateSignatureData,
  selectedSignature,
  validationErrors: externalErrors
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
  const [localErrors, setLocalErrors] = useState({
    companyName: '',
    companyWebsite: '',
    companyAddress: ''
  });
  
  // Combiner les erreurs locales et externes
  const errors = {
    companyName: externalErrors?.companyName || localErrors.companyName,
    companyWebsite: localErrors.companyWebsite,
    companyAddress: localErrors.companyAddress
  };
  
  // Fonctions de validation
  const validateCompanyName = (value: string) => {
    if (!value.trim()) {
      return "Le nom de l'entreprise est requis";
    }
    if (!NAME_REGEX.test(value)) {
      return "Le nom de l'entreprise ne doit contenir que des lettres, espaces, tirets ou apostrophes";
    }
    if (value.length > 50) {
      return "Le nom de l'entreprise ne doit pas dépasser 50 caractères";
    }
    return "";
  };
  
  const validateWebsite = (value: string) => {
    if (value.trim() && !URL_REGEX.test(value)) {
      return "Format d'URL invalide";
    }
    return "";
  };
  
  // Initialisation des données au montage du composant
  useEffect(() => {
    // Définir explicitement la valeur de showLogo dans les données de signature uniquement au chargement initial
    if (updateSignatureData) {
      updateSignatureData('showLogo', showLogo);
    }
    
    // Initialiser customLogoUrl à partir de selectedSignature si disponible
    if (selectedSignature && selectedSignature.logoUrl && updateSignatureData) {
      updateSignatureData('customLogoUrl', selectedSignature.logoUrl);
      // Forcer la mise à jour directe de signatureData pour garantir l'affichage du logo
      signatureData.customLogoUrl = selectedSignature.logoUrl;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Dépendances vides intentionnellement pour n'exécuter qu'au montage
  
  // Synchroniser les états locaux avec les données de signature
  // Utilisation d'une référence pour éviter les mises à jour inutiles
  const prevValuesRef = useRef({ localCompanyName, localCompanyWebsite, localCompanyAddress });
  
  useEffect(() => {
    const prevValues = prevValuesRef.current;
    
    // Ne mettre à jour que si les valeurs ont changé
    if (prevValues.localCompanyName !== localCompanyName) {
      updateSignatureData('companyName', localCompanyName);
    }
    
    if (prevValues.localCompanyWebsite !== localCompanyWebsite) {
      updateSignatureData('companyWebsite', localCompanyWebsite);
    }
    
    if (prevValues.localCompanyAddress !== localCompanyAddress) {
      updateSignatureData('companyAddress', localCompanyAddress);
    }
    
    // Mettre à jour la référence avec les valeurs actuelles
    prevValuesRef.current = { localCompanyName, localCompanyWebsite, localCompanyAddress };
    
  }, [localCompanyName, localCompanyWebsite, localCompanyAddress, updateSignatureData]);
  
  // État pour suivre si les informations de l'entreprise ont été explicitement importées via le bouton
  // Note: Nous gardons cette variable pour la logique interne, même si elle n'est plus utilisée pour l'affichage du logo
  const [, setCompanyInfoImported] = useState(false);
  
  // Récupérer l'URL de l'API depuis les variables d'environnement
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
  
  /**
   * Importe les informations de l'entreprise depuis les données de l'API
   * et force une mise à jour complète de la prévisualisation en une seule opération
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
      // 1. Mettre à jour les états locaux pour l'affichage dans le formulaire
      setLocalCompanyName(companyName);
      setLocalCompanyWebsite(companyWebsite);
      setLocalCompanyAddress(companyAddress);
      
      // 2. Créer une copie complète des données actuelles
      const updatedSignatureData = { ...signatureData };
      
      // 3. Appliquer toutes les modifications en une seule fois
      updatedSignatureData.companyName = companyName;
      updatedSignatureData.companyWebsite = companyWebsite;
      updatedSignatureData.companyAddress = companyAddress;
      
      // 4. Ajouter les informations de logo si disponibles
      if (logoUrl) {
        updatedSignatureData.customLogoUrl = logoUrl;
        updatedSignatureData.useNewbiLogo = false;
        updatedSignatureData.showLogo = true;
      }
      
      // 5. SOLUTION: Utiliser une technique spéciale pour forcer une mise à jour complète
      // Créer un élément temporaire pour stocker les données
      const tempData = { ...updatedSignatureData };
      
      // Mettre à jour toutes les propriétés en une seule fois
      // en utilisant une approche qui contourne les limitations de React
      Object.keys(tempData).forEach(key => {
        const typedKey = key as keyof SignatureData;
        if (typedKey !== 'companyName') { // Ne pas mettre à jour companyName maintenant
          signatureData[typedKey] = tempData[typedKey] as any;
        }
      });
      
      // Déclencher un seul rendu en mettant à jour companyName en dernier
      // Cela garantit que toutes les autres propriétés sont déjà mises à jour
      // lorsque le rendu se produit
      updateSignatureData('companyName', companyName);
      
      // 5. Marquer que les informations de l'entreprise ont été importées
      setCompanyInfoImported(true);
      
      // 6. Afficher une notification de succès
      Notification.success('Informations de l\'entreprise importées avec succès', {
        duration: 3000,
        position: 'bottom-left'
      });
      
    } catch {
      // Afficher une notification d'erreur en cas de problème
      Notification.error('Erreur lors de l\'importation des données');
    }
  };
  
  // Les fonctions de gestion du logo ont été supprimées car le logo est uniquement géré via l'importation des informations d'entreprise
  
  // Surveiller les changements dans les données de l'entreprise
  useEffect(() => {
    if (company) {
      console.log('Données d\'entreprise chargées:', company);
    }
  }, [company]);
  
  // S'assurer que les données d'entreprise sont disponibles dans signatureData lors de la soumission du formulaire
  useEffect(() => {
    // Cette fonction sera appelée juste avant la soumission du formulaire
    const handleBeforeSubmit = () => {
      
      // Forcer la mise à jour des données de signature
      updateSignatureData('companyName', localCompanyName);
      updateSignatureData('companyWebsite', localCompanyWebsite);
      updateSignatureData('companyAddress', localCompanyAddress);
    };
    
    // Ajouter un écouteur d'événement pour la soumission du formulaire
    window.addEventListener('beforesubmit', handleBeforeSubmit);
    
    // Nettoyer l'écouteur d'événement lors du démontage du composant
    return () => {
      window.removeEventListener('beforesubmit', handleBeforeSubmit);
    };
  }, [localCompanyName, localCompanyWebsite, localCompanyAddress, updateSignatureData]);
  
  // Nous supprimons l'effet qui définit automatiquement companyInfoImported à true
  // pour que seul le clic sur le bouton d'importation puisse activer l'affichage du logo

  return (
    <>
      <div>
            {/* Trait de séparation */}
            <div className="border-t border-gray-200 pt-6 mt-2 mb-6"></div>
            
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
            
            {/* Affichage du logo d'entreprise lors de la mise à jour ou après importation */}
            {(signatureData.customLogoUrl || (selectedSignature && selectedSignature.logoUrl)) && (
              <div className="mb-6">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo d'entreprise
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="relative w-20 h-20 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden bg-gray-50">
                    {signatureData.customLogoUrl || (selectedSignature && selectedSignature.logoUrl) ? (
                      <>
                        {/* Utiliser une image avec source absolue */}
                        <img 
                          src={signatureData.customLogoUrl || (selectedSignature && selectedSignature.logoUrl) || ''} 
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
                          onLoad={() => {/* Image chargée avec succès */}}
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
                  Nom de l'entreprise <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  className={`w-full h-10 px-3 py-2 border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-base placeholder:text-sm`}
                  placeholder="Nom de votre entreprise"
                  value={localCompanyName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalCompanyName(value);
                    const error = validateCompanyName(value);
                    setLocalErrors(prev => ({ ...prev, companyName: error }));
                  }}
                  onBlur={(e) => {
                    const error = validateCompanyName(e.target.value);
                    setLocalErrors(prev => ({ ...prev, companyName: error }));
                  }}
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-500" role="alert" aria-live="polite">{errors.companyName}</p>
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
                    setLocalErrors(prev => ({ ...prev, companyWebsite: error }));
                  }}
                  onBlur={(e) => {
                    const error = validateWebsite(e.target.value);
                    setLocalErrors(prev => ({ ...prev, companyWebsite: error }));
                  }}
                />
                {errors.companyWebsite && (
                  <p className="mt-1 text-sm text-red-500" role="alert" aria-live="polite">{errors.companyWebsite}</p>
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
