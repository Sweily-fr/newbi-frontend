import React, { useState, useRef, useEffect } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './animations.css';
import { HexColorPicker } from 'react-colorful';
// Import uniquement du nouveau composant de prévisualisation
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
// Fonction pour formater le code couleur (enlever le #)
const formatColorCode = (color: string) => color.replace('#', '');

interface EmailSignatureFormLayoutProps {
  defaultNewbiLogoUrl: string;
  activeSection: 'info' | 'social' | 'appearance' | 'settings';
  onSignatureDataChange?: (data: SignatureData) => void;
  onSave?: (data: SignatureData) => void;
  onCancel?: () => void;
  initialData?: SignatureData;
  selectedSignature?: EmailSignature; // Ajout de la signature sélectionnée pour le mode édition
}

export const EmailSignatureFormLayout: React.FC<EmailSignatureFormLayoutProps> = ({
  defaultNewbiLogoUrl,
  activeSection,
  onSignatureDataChange,
  onSave,
  onCancel,
  initialData,
  selectedSignature
}) => {

  // La section active est maintenant fournie par le composant parent
  
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
  // État pour stocker les données de la signature
  const [signatureData, setSignatureData] = useState<SignatureData>(initialData || {
    // Propriétés générales
    name: 'Ma signature professionnelle',
    isDefault: true,
    
    // Informations personnelles
    fullName: 'Jean Dupont',
    jobTitle: 'Fondateur & CEO',
    email: 'jean.dupont@exemple.fr',
    phone: '+33 7 34 64 06 18',
    mobilePhone: '+33 6 12 34 56 78',
    primaryColor: '#5b50ff',
    secondaryColor: '#f0eeff',
    
    // Informations entreprise
    companyName: 'Mon Entreprise',
    companyWebsite: 'https://www.exemple.fr',
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
    socialLinksIconColor: '#ffffff', // Couleur spécifique pour les icônes SVG des réseaux sociaux
    socialLinksPosition: 'bottom', // Position des réseaux sociaux par défaut
    
    // Apparence
    useNewbiLogo: true,
    customLogoUrl: defaultNewbiLogoUrl,
    fontFamily: 'Arial',
    fontSize: 14,
    textStyle: 'normal',
    textAlignment: 'left', // Alignement par défaut: gauche
    layout: 'vertical', // Disposition par défaut: verticale
    verticalSpacing: 10, // Espacement vertical par défaut: 10px
    horizontalSpacing: 20, // Espacement horizontal par défaut: 20px
    iconTextSpacing: 5, // Espacement entre icônes et texte par défaut: 5px
    
    // Options d'affichage des icônes pour les coordonnées
    showEmailIcon: true,
    showPhoneIcon: true,
    showAddressIcon: true,
    showWebsiteIcon: true,
    
    // Modèle
    templateId: '1'
  });
  
  
  // Notifier le composant parent des données initiales uniquement au montage initial
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Notification initiale uniquement, pas à chaque changement
    if (onSignatureDataChange) {
      onSignatureDataChange(signatureData);
    }
  }, []);

  // Fonction pour mettre à jour les données de la signature
  // Utilisation d'une référence pour éviter les mises à jour en cascade
  const isUpdatingRef = useRef(false);
  
  const updateSignatureData = <K extends keyof SignatureData>(field: K, value: SignatureData[K]) => {
    // Éviter les mises à jour redondantes si la valeur n'a pas changé
    if (signatureData[field] === value) {
      return;
    }
    
    // Éviter les boucles infinies pendant les mises à jour
    if (isUpdatingRef.current) {
      return;
    }
    
    isUpdatingRef.current = true;
    
    const updatedData = {
      ...signatureData,
      [field]: value
    };
    
    // Si on change le layout en horizontal, forcer l'alignement à gauche
    if (field === 'layout' && value === 'horizontal') {
      updatedData.textAlignment = 'left';
    }
    
    // Si on change l'alignement du texte mais qu'on est en mode horizontal, ignorer
    if (field === 'textAlignment' && signatureData.layout === 'horizontal') {
      // Ne pas changer l'alignement en mode horizontal
      updatedData.textAlignment = 'left';
    }
    
    setSignatureData(updatedData);
    
    // Notifier le composant parent du changement avec un léger délai pour éviter les mises à jour en cascade
    if (onSignatureDataChange) {
      setTimeout(() => {
        onSignatureDataChange(updatedData);
        isUpdatingRef.current = false;
      }, 0);
    } else {
      isUpdatingRef.current = false;
    }
  };
  
  // Fonction pour sélectionner un modèle
  const handleSelectTemplate = (templateId: number) => {
    // Convertir le nombre en chaîne pour correspondre au type de SignatureData
    updateSignatureData('templateId', String(templateId));
  };

  /**
   * Convertit les données de SignatureData vers EmailSignature
   * @param data Les données de signature au format SignatureData
   * @returns Les données au format EmailSignature
   */
  const convertSignatureDataToEmailSignature = (data: SignatureData): Partial<EmailSignature> => {
    console.log('[DEBUG] EmailSignatureFormLayout - Données reçues pour conversion:', {
      profilePhotoBase64: !!data.profilePhotoBase64,
      profilePhotoUrl: data.profilePhotoUrl,
      profilePhotoSize: data.profilePhotoSize,
      profilePhotoSizeType: typeof data.profilePhotoSize,
      profilePhotoToDelete: data.profilePhotoToDelete
    });

    return {
      name: data.name,
      isDefault: data.isDefault,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      // Couleur pour les textes (utiliser la couleur secondaire)
      textColor: data.secondaryColor,
      fullName: data.fullName,
      jobTitle: data.jobTitle,
      email: data.email,
      phone: data.phone,
      mobilePhone: data.mobilePhone, // Ajout du numéro de téléphone mobile
      companyName: data.companyName,
      website: data.companyWebsite,
      address: data.companyAddress,
      socialLinks: data.socialLinks,
      // Utiliser les deux formats pour assurer la compatibilité
      socialLinksDisplayMode: data.socialLinksDisplayMode,
      displayMode: data.socialLinksDisplayMode,
      socialLinksIconStyle: data.socialLinksIconStyle,
      iconStyle: data.socialLinksIconStyle,
      // Ajouter la couleur des icônes SVG des réseaux sociaux
      socialLinksIconColor: data.socialLinksIconColor,
      hasLogo: data.useNewbiLogo,
      logoUrl: data.customLogoUrl,
      fontFamily: data.fontFamily,
      fontSize: data.fontSize,
      style: data.textStyle,
      textStyle: data.textStyle, // Ajout de la propriété textStyle pour assurer la compatibilité
      // Ajout des propriétés d'affichage des icônes
      showEmailIcon: data.showEmailIcon,
      showPhoneIcon: data.showPhoneIcon,
      showAddressIcon: data.showAddressIcon,
      showWebsiteIcon: data.showWebsiteIcon,
      // Ajout des propriétés liées à la photo de profil
      profilePhotoUrl: data.profilePhotoUrl,
      profilePhotoBase64: data.profilePhotoBase64,
      profilePhotoSize: data.profilePhotoSize,
      // Transmettre les propriétés de mise en page et d'espacement
      verticalAlignment: data.textAlignment,
      textAlignment: data.textAlignment,
      layout: data.layout,
      verticalSpacing: data.verticalSpacing,
      horizontalSpacing: data.horizontalSpacing,
      // Transmettre la position des réseaux sociaux (avec cast pour éviter les erreurs de type)
      socialLinksPosition: data.socialLinksPosition as any,
      // Transmettre l'espacement entre icônes et texte
      iconTextSpacing: data.iconTextSpacing,
      // Ajouter la propriété showLogo pour contrôler l'affichage du logo
      showLogo: data.showLogo,
      // Transmettre l'état de suppression de la photo de profil
      // Utiliser une expression booléenne explicite pour éviter les problèmes de type
      profilePhotoToDelete: data.profilePhotoToDelete === true ? true : false
    } as Partial<EmailSignature>; // Cast pour éviter les erreurs TypeScript dues aux conflits de fusion
  };

  // Fonction pour rendre le contenu en fonction de la section active
  const renderContent = () => {
    // Contenu pour chaque section
    switch (activeSection) {
      case 'info':
        return (
          <>
            {/* Section Informations générales */}
            <PersonalInfoSection signatureData={signatureData} updateSignatureData={updateSignatureData} />
            <div className="border-t border-gray-200 my-6"></div>
            
            {/* Section Informations de l'entreprise */}
            <CompanyInfoSection 
              signatureData={signatureData} 
              updateSignatureData={updateSignatureData} 
              selectedSignature={selectedSignature} 
            />
          </>
        );
      case 'social':
        return (
          <>
            {/* Section Réseaux sociaux */}
            <SocialLinksSection signatureData={signatureData} updateSignatureData={updateSignatureData} />
          </>
        );
      case 'appearance':
        return (
          <>
            {/* Section Apparence */}
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
            {/* Utiliser une clé unique basée sur profilePhotoSize pour forcer un nouveau rendu */}
            <EmailSignaturePreview 
              key={`preview-${signatureData?.profilePhotoSize || 'default'}-${Date.now()}`}
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