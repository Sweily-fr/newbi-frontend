import React, { useState, useRef, useEffect } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './animations.css';
import { HexColorPicker } from 'react-colorful';
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
  // États pour contrôler l'affichage des sélecteurs de couleur
  const [showPrimaryColorPicker, setShowPrimaryColorPicker] = useState(false);
  const [showSecondaryColorPicker, setShowSecondaryColorPicker] = useState(false);
  
  // Références pour les sélecteurs de couleur
  const primaryColorPickerRef = useRef<HTMLDivElement>(null);
  const secondaryColorPickerRef = useRef<HTMLDivElement>(null);
  
  // Référence pour la transition CSS
  const nodeRef = useRef(null);
  
  // État pour gérer l'affichage de la modale de confirmation d'annulation
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  
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
  const [signatureData, setSignatureData] = useState<SignatureData & { lastUpdated?: number }>(initialData || {
    // Propriétés générales
    name: 'Ma signature professionnelle',
    isDefault: true,
    lastUpdated: Date.now(),
    
    // Informations personnelles
    fullName: 'Jean Dupont',
    jobTitle: 'Fondateur & CEO',
    email: 'jean.dupont@exemple.fr',
    phone: '+33 7 34 64 06 18',
    mobilePhone: '+33 6 12 34 56 78',
    
    // Informations de l'entreprise
    companyName: 'Newbi',
    companyWebsite: 'https://www.newbi.fr',
    companyAddress: '123 Avenue des Champs-Élysées, 75008 Paris, France',
    
    // Réseaux sociaux
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    
    // Apparence
    useNewbiLogo: true,
    customLogoUrl: defaultNewbiLogoUrl,
    fontFamily: 'Arial',
    fontSize: 14,
    textStyle: 'normal',
    textAlignment: 'left',
    layout: 'vertical',
    verticalSpacing: 10,
    horizontalSpacing: 20,
    iconTextSpacing: 5,
    
    // Options d'affichage des icônes pour les coordonnées
    showEmailIcon: true,
    showPhoneIcon: true,
    showAddressIcon: true,
    showWebsiteIcon: true,
    
    // Modèle
    templateId: '1',
    
    // Couleurs
    primaryColor: '#5b50ff',
    secondaryColor: '#f0eeff',
    
    // Options d'affichage
    showLogo: true,
    
    // Style des icônes des réseaux sociaux
    socialLinksIconStyle: 'circle',
    socialLinksDisplayMode: 'icons',
    socialLinksPosition: 'bottom'
  });
  
  // Notifier le composant parent des données initiales uniquement au montage initial
  useEffect(() => {
    if (onSignatureDataChange) {
      onSignatureDataChange(signatureData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fonction pour mettre à jour les données de signature
  const updateSignatureData = <K extends keyof SignatureData>(field: K, value: SignatureData[K]) => {
    // Mettre à jour les données de signature
    setSignatureData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Forcer la mise à jour pour les champs liés à l'apparence ou à l'image de profil
      if (['primaryColor', 'secondaryColor', 'layout', 'textAlignment', 'fontSize', 'fontFamily', 'textStyle', 'profilePhotoUrl', 'profilePhotoBase64', 'profilePhotoSize', 'profilePhotoToDelete'].includes(field as string)) {
        newData.lastUpdated = Date.now();
      }
      
      // Propager les données mises à jour au parent si nécessaire
      if (onSignatureDataChange) {
        onSignatureDataChange(newData);
      }
      
      return newData;
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
    return {
      name: data.name,
      isDefault: data.isDefault,
      fullName: data.fullName,
      jobTitle: data.jobTitle,
      email: data.email,
      phone: data.phone,
      mobilePhone: data.mobilePhone,
      companyName: data.companyName,
      companyWebsite: data.companyWebsite,
      companyAddress: data.companyAddress,
      socialLinks: data.socialLinks,
      displayMode: data.socialLinksDisplayMode,
      socialLinksIconStyle: data.socialLinksIconStyle,
      iconStyle: data.socialLinksIconStyle,
      hasLogo: data.useNewbiLogo,
      logoUrl: data.customLogoUrl,
      fontFamily: data.fontFamily,
      fontSize: data.fontSize,
      textStyle: data.textStyle,
      textAlignment: data.textAlignment,
      layout: data.layout,
      verticalSpacing: data.verticalSpacing,
      horizontalSpacing: data.horizontalSpacing,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      socialLinksPosition: data.socialLinksPosition as any,
      showLogo: data.showLogo,
      profilePhotoUrl: data.profilePhotoUrl,
      profilePhotoBase64: data.profilePhotoBase64, // Ajouter la propriété profilePhotoBase64
      profilePhotoToDelete: data.profilePhotoToDelete, // Ajouter la propriété profilePhotoToDelete
      profilePhotoSize: data.profilePhotoSize
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
