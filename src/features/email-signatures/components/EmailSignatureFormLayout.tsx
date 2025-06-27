import React, { useState, useRef, useEffect } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './animations.css';
import { EmailSignaturePreview } from '../components/EmailSignaturePreview/EmailSignaturePreviewNew';
import { Button } from '../../../components/common/Button';
import { ConfirmationModal } from '../../../components/common/ConfirmationModal';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { SignatureData, EmailSignature } from '../types';
import { CompanyInfoSection } from './sections/CompanyInfoSection';
import { SocialLinksSection } from './sections/SocialLinksSection';
import { AppearanceSection } from './sections/AppearanceSection';
import { TemplatesSection } from './sections/TemplatesSection';

/**
 * Composant avec une disposition sur deux colonnes pour l'éditeur de signature email
 * Ce composant utilise une approche simplifiée sans dépendre des composants UI externes
 */
interface EmailSignatureFormLayoutProps {
  defaultNewbiLogoUrl: string;
  activeSection: 'info' | 'social' | 'appearance' | 'settings';
  onSignatureDataChange?: (data: SignatureData) => void;
  onSave?: (data: SignatureData) => void;
  onCancel?: () => void;
  initialData?: SignatureData;
  selectedSignature?: EmailSignature;
  validationErrors?: {
    name?: string;
    fullName?: string;
    email?: string;
    jobTitle?: string;
    companyName?: string;
    general?: string;
  };
}

export const EmailSignatureFormLayout: React.FC<EmailSignatureFormLayoutProps> = ({
  defaultNewbiLogoUrl,
  activeSection,
  onSignatureDataChange,
  onSave,
  onCancel,
  initialData,
  selectedSignature,
  validationErrors
}) => {
  // Référence pour la transition CSS
  const nodeRef = useRef(null);
  
  // État pour gérer l'affichage de la modale de confirmation d'annulation
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  
  // Extension du type SignatureData pour inclure lastUpdated
  type SignatureDataWithTimestamp = SignatureData & { lastUpdated: number };
  
  // Définir l'état initial
  const initialState: SignatureDataWithTimestamp = {
    // Valeurs par défaut
    name: 'Ma signature professionnelle',
    isDefault: true,
    lastUpdated: Date.now(),
    fullName: 'Jean Dupont',
    jobTitle: 'Fondateur & CEO',
    email: 'jean.dupont@exemple.fr',
    phone: '+33 7 34 64 06 18',
    mobilePhone: '+33 6 12 34 56 78',
    companyName: 'Newbi',
    companyWebsite: 'https://www.newbi.fr',
    companyAddress: '123 Avenue des Champs-Élysées, 75008 Paris, France',
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    useNewbiLogo: true,
    customLogoUrl: defaultNewbiLogoUrl,
    fontFamily: 'Arial',
    fontSize: 14,
    textStyle: 'normal' as const, // Utilisation de 'as const' pour le type littéral
    textAlignment: 'left' as const,
    layout: 'vertical' as const,
    verticalSpacing: 10,
    horizontalSpacing: 20,
    iconTextSpacing: 5,
    showEmailIcon: true,
    showPhoneIcon: true,
    showAddressIcon: true,
    showWebsiteIcon: true,
    templateId: '1',
    primaryColor: '#5b50ff',
    secondaryColor: '#f0eeff',
    showLogo: true,
    socialLinksIconStyle: 'circle' as const,
    socialLinksDisplayMode: 'icons' as const,
    socialLinksPosition: 'bottom' as const,
    // Surcharger avec les données initiales si elles existent
    ...(initialData || {})
  };
  
  // État pour stocker les données de la signature
  const [signatureData, setSignatureData] = useState<SignatureDataWithTimestamp>(initialState);

  // Effet pour déboguer les changements de signatureData
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && signatureData) {
      console.log('signatureData mis à jour:', {
        profilePhotoUrl: signatureData.profilePhotoUrl,
        profilePhotoBase64: signatureData.profilePhotoBase64 ? 'Base64 présent' : 'Pas de Base64',
        profilePhotoToDelete: signatureData.profilePhotoToDelete,
        customLogoUrl: signatureData.customLogoUrl,
        useNewbiLogo: signatureData.useNewbiLogo,
        lastUpdated: signatureData.lastUpdated
      });
    }
  }, [signatureData]);
  
  // Notifier le composant parent des données initiales uniquement au montage initial
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (onSignatureDataChange) {
      onSignatureDataChange(signatureData);
    }
  }, [signatureData, onSignatureDataChange]);

  // Fonction pour mettre à jour les données de signature
  const updateSignatureData = <K extends keyof SignatureData>(field: K, value: SignatureData[K]) => {
    // Mettre à jour les données de signature
    setSignatureData(prev => {
      const updates: Partial<SignatureDataWithTimestamp> = { 
        [field]: value,
        // Forcer la mise à jour du timestamp à chaque changement pour garantir le rafraîchissement
        lastUpdated: Date.now()
      };
      
      return { ...prev, ...updates } as SignatureDataWithTimestamp;
    });
  };

  
  // Fonction pour sélectionner un modèle
  const handleSelectTemplate = (templateId: number) => {
    updateSignatureData('templateId', templateId.toString());
  };
  

  // Fonction pour rendre le contenu en fonction de la section active
  const renderContent = () => {
    switch (activeSection) {
      case 'info':
        return (
          <>
            {/* Section Informations personnelles */}
            <PersonalInfoSection 
              signatureData={signatureData} 
              updateSignatureData={updateSignatureData} 
              validationErrors={{
                name: validationErrors?.name,
                fullName: validationErrors?.fullName,
                email: validationErrors?.email,
                jobTitle: validationErrors?.jobTitle
              }}
            />
            {/* Section Informations de l'entreprise */}
            <CompanyInfoSection 
              signatureData={signatureData} 
              updateSignatureData={updateSignatureData} 
              selectedSignature={selectedSignature} 
              validationErrors={{
                companyName: validationErrors?.companyName
              }}
            />
          </>
        );
      case 'social':
        return (
          <>
            {/* Section Réseaux sociaux */}
            <SocialLinksSection 
              signatureData={signatureData} 
              updateSignatureData={updateSignatureData} 
            />
          </>
        );
      case 'appearance':
        return (
          <>
            {/* Section Apparence */}
            <AppearanceSection 
              signatureData={signatureData} 
              updateSignatureData={updateSignatureData}
            />
          </>
        );
      case 'settings':
        return (
          <>
            {/* Section Modèles */}
            <TemplatesSection 
              signatureData={signatureData} 
              updateSignatureData={updateSignatureData}
              onSelectTemplate={handleSelectTemplate}
            />
          </>
        );
      default:
        return null;
    }
  };

  /**
   * Convertit les données de SignatureData vers EmailSignature
   * @param data Les données de signature au format SignatureData
   * @returns Les données au format EmailSignature
   */
  const convertSignatureDataToEmailSignature = (data: SignatureData): Partial<EmailSignature> => {
    console.log('Converting signature data:', {
      profilePhotoUrl: data.profilePhotoUrl,
      profilePhotoBase64: data.profilePhotoBase64 ? 'base64 data present' : 'no base64 data',
      customLogoUrl: data.customLogoUrl,
      useNewbiLogo: data.useNewbiLogo,
      defaultNewbiLogoUrl
    });

    // Déterminer l'URL de la photo de profil
    let profilePhoto = data.profilePhotoUrl;
    if (data.profilePhotoBase64) {
      profilePhoto = `data:image/jpeg;base64,${data.profilePhotoBase64}`;
    } else if (data.profilePhotoUrl) {
      profilePhoto = data.profilePhotoUrl;
    }

    // Déterminer l'URL du logo
    let logoUrl = data.customLogoUrl;
    if (data.useNewbiLogo) {
      logoUrl = defaultNewbiLogoUrl;
    }

    return {
      name: data.name,
      isDefault: data.isDefault,
      fullName: data.fullName || 'Prénom Nom',
      jobTitle: data.jobTitle || 'Votre poste',
      email: data.email || 'email@exemple.com',
      phone: data.phone || '01 23 45 67 89',
      mobilePhone: data.mobilePhone || '06 12 34 56 78',
      companyName: data.companyName || 'Votre entreprise',
      companyWebsite: data.companyWebsite || 'https://votresite.com',
      companyAddress: data.companyAddress || '123 Rue Exemple, 75000 Paris',
      socialLinks: data.socialLinks || {},
      socialLinksDisplayMode: data.socialLinksDisplayMode,
      socialLinksIconStyle: data.socialLinksIconStyle,
      socialLinksIconColor: data.socialLinksIconColor,
      hasLogo: data.useNewbiLogo,
      logoUrl: logoUrl,
      fontFamily: data.fontFamily || 'Arial, sans-serif',
      fontSize: data.fontSize || 12,
      textStyle: data.textStyle || 'normal',
      textAlignment: data.textAlignment || 'left',
      layout: data.layout || 'vertical',
      verticalSpacing: data.verticalSpacing || 10,
      horizontalSpacing: data.horizontalSpacing || 20,
      primaryColor: data.primaryColor || '#000000',
      secondaryColor: data.secondaryColor || '#666666',
      socialLinksPosition: data.socialLinksPosition as 'left' | 'right' | 'bottom' | 'below-personal' | undefined,
      showLogo: data.showLogo !== false,
      profilePhotoUrl: profilePhoto,
      profilePhotoBase64: data.profilePhotoBase64,
      profilePhotoToDelete: data.profilePhotoToDelete,
      profilePhotoSize: data.profilePhotoSize,
      // Assurez-vous que ces propriétés sont définies avec des valeurs par défaut
      showEmailIcon: data.showEmailIcon !== false,
      showPhoneIcon: data.showPhoneIcon !== false,
      showAddressIcon: data.showAddressIcon !== false,
      showWebsiteIcon: data.showWebsiteIcon !== false,
      // Ajouter d'autres propriétés nécessaires avec des valeurs par défaut
      website: data.website || data.companyWebsite || 'https://votresite.com',
      address: data.address || data.companyAddress || '123 Rue Exemple, 75000 Paris'
    };
  };

  return (
    <div className="w-full">
      {/* Modale de confirmation d'annulation */}
      <ConfirmationModal
        isOpen={showCancelConfirmation}
        onClose={() => setShowCancelConfirmation(false)}
        onConfirm={() => {
          setShowCancelConfirmation(false);
          if (onCancel) {
            onCancel();
          }
        }}
        title="Annuler les modifications"
        message="Êtes-vous sûr de vouloir annuler ? Toutes les modifications non enregistrées seront perdues."
        confirmButtonText="Oui, annuler"
        cancelButtonText="Non, continuer"
        confirmButtonVariant="danger"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x">
        {/* Colonne gauche: formulaire (10px plus large) */}
        <div className="space-y-8 pr-8" style={{ width: 'calc(100% + 15px)' }}>
          {/* Animation de transition entre les sections */}
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={activeSection}
              nodeRef={nodeRef}
              timeout={300}
              classNames="section"
              unmountOnExit
            >
              <div ref={nodeRef} className="py-8 transition-container">
                {renderContent()}
              </div>
            </CSSTransition>
          </SwitchTransition>
          
          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 pt-4 mt-8">
            <Button 
              variant="outline"
              size="md"
              onClick={() => setShowCancelConfirmation(true)}
            >
              Annuler
            </Button>
            <Button 
              variant="primary"
              size="md"
              onClick={() => {
                if (onSave) {
                  onSave(signatureData);
                }
              }}
            >
              Enregistrer
            </Button>
          </div>
        </div>
        
        {/* Colonne droite: prévisualisation */}
        <div className="py-8 pl-8 h-fit sticky top-28">
          <h3 className="text-lg font-semibold text-gray-900 mb-8">Aperçu</h3>
          <div className="flex items-center justify-center">
            {/* Utiliser une clé unique basée sur lastUpdated pour forcer un nouveau rendu */}
            <EmailSignaturePreview 
              key={`preview-${signatureData?.profilePhotoToDelete ? 'deleted' : ''}-${signatureData?.profilePhotoSize || 'default'}-${signatureData?.profilePhotoBase64 ? 'base64-' + Date.now() : ''}-${signatureData?.profilePhotoUrl || 'default'}-${signatureData?.lastUpdated || Date.now()}`}
              signature={convertSignatureDataToEmailSignature(signatureData)} 
              showEmailIcon={Boolean(signatureData?.showEmailIcon)}
              showPhoneIcon={Boolean(signatureData?.showPhoneIcon)}
              showAddressIcon={Boolean(signatureData?.showAddressIcon)}
              showWebsiteIcon={Boolean(signatureData?.showWebsiteIcon)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
