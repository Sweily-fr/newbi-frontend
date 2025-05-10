import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { EmailSignaturePreview } from '../components/EmailSignaturePreview';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { SignatureData, EmailSignature } from '../types';
import { CompanyInfoSection } from './sections/CompanyInfoSection';
import { SocialLinksSection } from './sections/SocialLinksSection';
import { AppearanceSection } from './sections/AppearanceSection';

/**
 * Composant avec une disposition sur deux colonnes pour l'éditeur de signature email
 * Ce composant utilise une approche simplifiée sans dépendre des composants UI externes
 */
// Fonction pour formater le code couleur (enlever le #)
const formatColorCode = (color: string) => color.replace('#', '');

interface EmailSignatureFormLayoutProps {
  defaultNewbiLogoUrl: string;
}

export const EmailSignatureFormLayout: React.FC<EmailSignatureFormLayoutProps> = ({
  defaultNewbiLogoUrl
}) => {

  // États pour contrôler l'affichage des sélecteurs de couleur
  const [showPrimaryColorPicker, setShowPrimaryColorPicker] = useState(false);
  const [showSecondaryColorPicker, setShowSecondaryColorPicker] = useState(false);
  
  // Références pour les sélecteurs de couleur
  const primaryColorPickerRef = useRef<HTMLDivElement>(null);
  const secondaryColorPickerRef = useRef<HTMLDivElement>(null);
  
  // Fermer les sélecteurs de couleur lors d'un clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Fermer le sélecteur de couleur primaire
      if (
        primaryColorPickerRef.current &&
        !primaryColorPickerRef.current.contains(event.target as Node) &&
        showPrimaryColorPicker
      ) {
        setShowPrimaryColorPicker(false);
      }
      
      // Fermer le sélecteur de couleur secondaire
      if (
        secondaryColorPickerRef.current &&
        !secondaryColorPickerRef.current.contains(event.target as Node) &&
        showSecondaryColorPicker
      ) {
        setShowSecondaryColorPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPrimaryColorPicker, showSecondaryColorPicker]);
  
  // État pour stocker les données de la signature
  const [signatureData, setSignatureData] = useState<SignatureData>({
    // Propriétés générales
    name: 'Ma signature professionnelle',
    isDefault: true,
    
    // Informations personnelles
    fullName: 'Jean Dupont',
    jobTitle: 'Directeur Commercial',
    email: 'jean.dupont@newbi.fr',
    phone: '+33 1 23 45 67 89',
    mobilePhone: '+33 6 12 34 56 78',
    profilePhotoUrl: '',
    primaryColor: '#5b50ff',
    secondaryColor: '#f0eeff',
    
    // Informations entreprise
    companyName: 'Newbi',
    companyWebsite: 'https://newbi.fr',
    companyAddress: '123 Avenue des Entrepreneurs, 75000 Paris, France',
    
    // Réseaux sociaux
    socialLinks: {
      linkedin: 'https://www.linkedin.com/company/newbi',
      twitter: 'https://twitter.com/newbi',
      facebook: 'https://www.facebook.com/newbi',
      instagram: 'https://www.instagram.com/newbi'
    },
    socialLinksDisplayMode: 'icons',
    socialLinksIconStyle: 'circle',
    
    // Apparence
    useNewbiLogo: true,
    customLogoUrl: defaultNewbiLogoUrl,
    fontFamily: 'Arial',
    fontSize: 14,
    textStyle: 'normal'
  });

  // Fonction pour mettre à jour les données de la signature
  const updateSignatureData = <K extends keyof SignatureData>(field: K, value: SignatureData[K]) => {
    setSignatureData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Convertit les données de SignatureData vers EmailSignature
   * @param data Les données de signature au format SignatureData
   * @returns Les données au format EmailSignature
   */
  const convertSignatureDataToEmailSignature = (data: SignatureData): Partial<EmailSignature> => {
    return {
      name: data.name,
      isDefault: data.isDefault,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      fullName: data.fullName,
      jobTitle: data.jobTitle,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
      website: data.companyWebsite,
      address: data.companyAddress,
      socialLinks: data.socialLinks,
      displayMode: data.socialLinksDisplayMode,
      iconStyle: data.socialLinksIconStyle,
      hasLogo: data.useNewbiLogo,
      logoUrl: data.customLogoUrl,
      fontFamily: data.fontFamily,
      fontSize: data.fontSize,
      style: data.textStyle
    };
  };

  return (
    <div className="w-full">      
      {/* Disposition en deux colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x">
        {/* Colonne gauche: formulaire */}
        <div className="space-y-8 pr-8">
          {/* Section Informations générales */}
          <PersonalInfoSection signatureData={signatureData} updateSignatureData={updateSignatureData} />
          <div className="border-t border-gray-200 my-6"></div>
    
          {/* Section Informations de l'entreprise */}
         <CompanyInfoSection signatureData={signatureData} updateSignatureData={updateSignatureData} />

          <div className="border-t border-gray-200 my-6"></div>
          
          {/* Section Réseaux sociaux */}
          <div>
            <SocialLinksSection signatureData={signatureData} updateSignatureData={updateSignatureData} />
          </div>

          <div className="border-t border-gray-200 my-6"></div>
          
          {/* Section Apparence */}
          <div>
            <AppearanceSection 
              signatureData={signatureData} 
              updateSignatureData={updateSignatureData}
              showPrimaryColorPicker={showPrimaryColorPicker}
              setShowPrimaryColorPicker={setShowPrimaryColorPicker}
              primaryColorPickerRef={primaryColorPickerRef}
              showSecondaryColorPicker={showSecondaryColorPicker}
              setShowSecondaryColorPicker={setShowSecondaryColorPicker}
              secondaryColorPickerRef={secondaryColorPickerRef}
              formatColorCode={formatColorCode}
            />
          </div>
            
          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 pt-4 mt-8">
            <button 
              type="button" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]"
            >
              Enregistrer
            </button>
          </div>
        </div>
        
        {/* Colonne droite: prévisualisation */}
        <div className="pl-8 h-fit sticky top-28">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu</h3>
          <div className="flex items-center justify-center">
            <EmailSignaturePreview signature={convertSignatureDataToEmailSignature(signatureData)} />
          </div>
        </div>
      </div>
    </div>
  );
};