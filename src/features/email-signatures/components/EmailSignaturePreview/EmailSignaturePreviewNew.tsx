import React, { useRef, useState } from 'react';
import { EmailSignature } from '../../types';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../../components/ui';
import { SignatureLayout } from './SignatureLayout';
import { getFullProfilePhotoUrl } from './utils';

interface EmailSignaturePreviewProps {
  signature: Partial<EmailSignature>;
  showEmailIcon?: boolean;
  showPhoneIcon?: boolean;
  showAddressIcon?: boolean;
  showWebsiteIcon?: boolean;
}

export const EmailSignaturePreview: React.FC<EmailSignaturePreviewProps> = ({ 
  signature, 
  showEmailIcon = false,
  showPhoneIcon = false,
  showAddressIcon = false,
  showWebsiteIcon = false
}) => {
  // État pour afficher un message de confirmation après la copie
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Référence à l'élément de signature pour la copie
  const signatureRef = useRef<HTMLDivElement>(null);
  
  // URL de base de l'API pour les images
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // Extraire toutes les propriétés de la signature
  const {
    fullName,
    jobTitle,
    companyName,
    phone,
    mobilePhone,
    email,
    website,
    address,
    logoUrl,
    profilePhotoUrl,
    profilePhotoBase64,
    profilePhotoSize = 80,
    layout = 'vertical',
    horizontalSpacing = 20,
    verticalSpacing = 10,
    verticalAlignment = 'left',
    imagesLayout = 'stacked',
    textColor = '#333333',
    primaryColor = '#5b50ff',
    textAlignment = 'left',
    socialLinks,
    socialLinksDisplayMode = 'icons',
    socialLinksPosition = 'bottom',
    socialLinksIconStyle = 'simple',
    showLogo = true,
    fontSize = 14,
    textStyle = 'normal',
    fontFamily = 'Arial, sans-serif'
  } = signature;

  // Définir la taille de la photo de profil avec une valeur par défaut
  const photoSize = profilePhotoSize || 80; // Taille par défaut: 80px

  // Définir l'alignement effectif en fonction de la disposition
  const effectiveTextAlignment = textAlignment as 'left' | 'center' | 'right';
  
  // Définir l'espacement effectif
  const effectiveHorizontalSpacing = horizontalSpacing || 20;
  const effectiveVerticalSpacing = verticalSpacing || 10;

  // Définir le type de disposition de la signature
  const signatureLayout = layout as 'horizontal' | 'vertical';

  // Utiliser profilePhotoBase64 s'il est disponible, sinon utiliser profilePhotoUrl
  // S'assurer que l'image par défaut n'est pas utilisée si une photo a été téléchargée
  const profilePhotoSource = profilePhotoBase64 || (profilePhotoUrl && profilePhotoUrl !== '/images/logo_newbi/SVG/Logo_Texte_Purple.svg' ? profilePhotoUrl : null);
  
  // Définir le logo Newbi par défaut si aucun logo n'est fourni
  const defaultLogoUrl = '/images/logo_newbi/SVG/Logo_Texte_Purple.svg';
  const effectiveLogoUrl = logoUrl || defaultLogoUrl;

  // Styles pour la signature
  const signatureStyle: React.CSSProperties = {
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    lineHeight: '1.5',
    color: textColor || '#333333',
    maxWidth: '600px',
    width: '100%'
  };

  // Fonction pour copier la signature dans le presse-papier
  const copySignatureToClipboard = () => {
    if (signatureRef.current) {
      // Sélectionner le contenu de la signature
      const range = document.createRange();
      range.selectNode(signatureRef.current);
      
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        
        try {
          // Copier le contenu sélectionné
          document.execCommand('copy');
          
          // Afficher un message de succès
          setCopySuccess(true);
          
          // Réinitialiser le message après 3 secondes
          setTimeout(() => {
            setCopySuccess(false);
          }, 3000);
        } catch (err) {
          console.error('Erreur lors de la copie:', err);
        }
        
        // Nettoyer la sélection
        window.getSelection()?.removeAllRanges();
      }
    }
  };

  return (
    <div className="email-signature-preview w-full max-w-2xl mx-auto">
      {/* Fenêtre style Mac */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Barre de titre style Mac avec boutons de contrôle */}
        <div className="bg-[#222] px-4 py-2 flex items-center justify-between border-b border-gray-200">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 text-center text-white text-xs">Nouveau message</div>
          
          {/* Bouton de copie */}
          <Button 
            onClick={copySignatureToClipboard} 
            size="sm" 
            variant="primary"
            className="flex items-center gap-1 text-xs"
          >
            <ClipboardDocumentIcon className="h-3 w-3" />
            {copySuccess ? 'Copié !' : 'Copier'}
          </Button>
        </div>
        
        {/* Contenu de l'email avec disposition professionnelle */}
        <div className="bg-white">
          {/* En-tête de l'email */}
          <div className="border-b border-gray-200 px-6 py-3">
            <div className="grid grid-cols-12 gap-2 items-center text-xs mb-1">
              <div className="col-span-1 text-gray-500 font-medium">De :</div>
              <div className="col-span-11 text-gray-800">{fullName || 'Votre Nom'} &lt;{email || 'email@exemple.com'}&gt;</div>
            </div>
            <div className="grid grid-cols-12 gap-2 items-center text-xs mb-1">
              <div className="col-span-1 text-gray-500 font-medium">À :</div>
              <div className="col-span-11 text-gray-800">destinataire@exemple.com</div>
            </div>
            <div className="grid grid-cols-12 gap-2 items-center text-xs mb-1">
              <div className="col-span-1 text-gray-500 font-medium">Obj :</div>
              <div className="col-span-11 text-gray-800 truncate">Votre demande de renseignements</div>
            </div>
          </div>
          
          {/* Corps de l'email */}
          <div className="px-6 py-5">
            <div className="text-gray-800 mb-8 text-sm">
              <p className="mb-2">Bonjour,</p>
              <p className="mb-2">Je vous remercie pour votre message et l'intérêt que vous portez à nos services.</p>
              <p className="mb-2">Je reste à votre disposition pour toute information complémentaire.</p>
              <p className="mb-4">Cordialement,</p>
            </div>
            
            {/* Signature */}
            <div ref={signatureRef} style={signatureStyle} className="border-t pt-4">
              <SignatureLayout
                signatureLayout={signatureLayout}
                fullName={fullName}
                jobTitle={jobTitle}
                companyName={companyName}
                phone={phone}
                mobilePhone={mobilePhone}
                email={email}
                website={website}
                address={address}
                logoUrl={effectiveLogoUrl}
                profilePhotoSource={profilePhotoSource ? getFullProfilePhotoUrl(profilePhotoSource) : null}
                photoSize={photoSize}
                imagesLayout={imagesLayout as 'stacked' | 'side-by-side'}
                showLogo={showLogo}
                showEmailIcon={showEmailIcon}
                showPhoneIcon={showPhoneIcon}
                showAddressIcon={showAddressIcon}
                showWebsiteIcon={showWebsiteIcon}
                socialLinks={socialLinks}
                socialPosition={socialLinksPosition as 'bottom' | 'right'}
                socialLinksDisplayMode={socialLinksDisplayMode as 'icons' | 'text'}
                socialLinksIconStyle={socialLinksIconStyle}
                primaryColor={primaryColor}
                effectiveTextAlignment={effectiveTextAlignment}
                effectiveHorizontalSpacing={effectiveHorizontalSpacing}
                effectiveVerticalSpacing={effectiveVerticalSpacing}
                fontSize={fontSize}
                textStyle={textStyle}
                fontFamily={fontFamily}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
