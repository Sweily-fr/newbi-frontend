import React, { useState, useRef } from 'react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { EmailSignatureProvider } from '../../context/EmailSignatureProvider';
import { useEmailSignature } from '../../context/useEmailSignature';
import { EmailSignature } from '../../types';
import { TableSignatureLayout } from './TableSignatureLayout';

// Interface pour les props du composant principal
interface EmailSignaturePreviewProps {
  // Objet signature complet (optionnel)
  signature?: Partial<EmailSignature>;
  // Props individuelles (optionnelles)
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  companyName?: string;
  phone?: string;
  mobilePhone?: string;
  email?: string;
  website?: string;
  address?: string;
  companyLogo?: string;
  profilePhoto?: string;
  socialLinks?: Record<string, string>;
  companyWebsite?: string;
  companyAddress?: string;
  logoSize?: number;
  iconTextSpacing?: number;
  socialLinksIconColor?: string;
  showPhoneIcon?: boolean;
  showMobilePhoneIcon?: boolean;
  showEmailIcon?: boolean;
  showAddressIcon?: boolean;
  showWebsiteIcon?: boolean;
  onCopy?: () => void;
  onError?: (message: string) => void;
}

// Interface pour les props du composant interne
interface EmailSignaturePreviewContentProps {
  onCopy?: () => void;
  onError?: (message: string) => void;
}

// Composant principal qui initialise le contexte et affiche la signature
export const EmailSignaturePreview: React.FC<EmailSignaturePreviewProps> = ({
  signature,
  firstName,
  lastName,
  jobTitle,
  companyName,
  phone,
  mobilePhone,
  email,
  website,
  address,
  companyLogo,
  profilePhoto,
  socialLinks,
  companyWebsite,
  companyAddress,
  logoSize,
  iconTextSpacing,
  socialLinksIconColor,
  showPhoneIcon = true,
  showMobilePhoneIcon = true,
  showEmailIcon = true,
  showAddressIcon = true,
  showWebsiteIcon = true,
  onCopy,
  onError
}) => {
  return (
    <EmailSignatureProvider 
      initialSignature={signature}
      initialFirstName={firstName}
      initialLastName={lastName}
      initialJobTitle={jobTitle}
      initialCompanyName={companyName}
      initialPhone={phone}
      initialMobilePhone={mobilePhone}
      initialEmail={email}
      initialWebsite={website}
      initialAddress={address}
      initialCompanyLogo={companyLogo}
      initialProfilePhoto={profilePhoto}
      initialSocialLinks={socialLinks}
      initialCompanyWebsite={companyWebsite}
      initialCompanyAddress={companyAddress}
      initialLogoSize={logoSize}
      initialIconTextSpacing={iconTextSpacing}
      initialSocialLinksIconColor={socialLinksIconColor}
      initialShowPhoneIcon={showPhoneIcon}
      initialShowMobilePhoneIcon={showMobilePhoneIcon}
      initialShowEmailIcon={showEmailIcon}
      initialShowAddressIcon={showAddressIcon}
      initialShowWebsiteIcon={showWebsiteIcon}
    >
      <EmailSignaturePreviewContent onCopy={onCopy} onError={onError} />
    </EmailSignatureProvider>
  );
};

// Composant interne qui consomme le contexte
interface EmailSignaturePreviewContentProps {
  onCopy?: () => void;
  onError?: (error: string) => void;
}

const EmailSignaturePreviewContent: React.FC<EmailSignaturePreviewContentProps> = ({ onCopy, onError }) => {
  const { signatureData } = useEmailSignature();
  const [copied, setCopied] = useState(false);
  const signatureRef = useRef<HTMLDivElement>(null);

  // Extraire les données du contexte pour l'affichage
  const { email, firstName, lastName } = signatureData;
  const displayName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || '';
  
  // Fonction pour s'assurer que toutes les images ont des URL absolues
  const ensureAbsoluteImageUrls = (element: HTMLElement): void => {
    const images = element.querySelectorAll('img');
    images.forEach(img => {
      if (img.src && !img.src.startsWith('http') && !img.src.startsWith('data:')) {
        img.src = new URL(img.src, window.location.origin).href;
      }
    });
  };

  // Fonction pour copier la signature dans le presse-papiers
  const copySignature = async () => {
    if (!signatureRef.current) return;
    
    try {
      // Cloner le nœud pour pouvoir modifier les URLs des images sans affecter le DOM
      const signatureContent = signatureRef.current.cloneNode(true) as HTMLElement;
      ensureAbsoluteImageUrls(signatureContent);
      
      // Essayer d'utiliser l'API Clipboard moderne
      try {
        // Pour le texte brut, on peut utiliser l'API Clipboard
        await navigator.clipboard.writeText(signatureContent.innerHTML);
        setCopied(true);
        if (onCopy) onCopy();
      } catch (clipboardError) {
        console.error('Erreur lors de la copie avec API Clipboard:', clipboardError);
        // Utiliser la méthode de secours
        fallbackCopyMethod();
      }
    } catch (error) {
      console.error('Erreur lors de la préparation de la signature:', error);
      if (onError) onError('Impossible de copier la signature');
    } finally {
      // Réinitialiser l'état après un délai
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // Méthode de secours pour les navigateurs qui ne supportent pas l'API Clipboard
  const fallbackCopyMethod = () => {
    if (!signatureRef.current) return;
    
    try {
      const signatureContent = signatureRef.current.cloneNode(true) as HTMLElement;
      ensureAbsoluteImageUrls(signatureContent);
      
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.innerHTML = signatureContent.innerHTML;
      
      document.body.appendChild(tempContainer);
      
      const range = document.createRange();
      range.selectNodeContents(tempContainer);
      
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        
        try {
          const success = document.execCommand('copy');
          if (success) {
            setCopied(true);
            if (onCopy) onCopy();
          } else if (onError) {
            onError('La commande de copie a échoué');
          }
        } catch (err) {
          console.error('Erreur lors de la copie avec méthode de secours:', err);
          if (onError) onError('Impossible de copier la signature');
        } finally {
          selection.removeAllRanges();
        }
      }
      
      document.body.removeChild(tempContainer);
    } catch (err) {
      console.error('Erreur lors de la méthode de secours:', err);
      if (onError) onError('Impossible de copier la signature');
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
            onClick={copySignature} 
            size="sm" 
            variant="secondary"
            className="flex items-center gap-1 text-xs"
          >
            <ClipboardDocumentIcon className="h-3 w-3" />
            {copied ? 'Copié !' : 'Copier la signature'}
          </Button>
        </div>
        
        {/* Contenu de l'email avec disposition professionnelle */}
        <div className="bg-white">
          {/* En-tête de l'email */}
          <div className="border-b border-gray-200 px-6 py-3">
            <div className="grid grid-cols-12 gap-2 items-center text-xs mb-1">
              <div className="col-span-1 text-gray-500 font-medium">De :</div>
              <div className="col-span-11 text-gray-800">{displayName || 'Votre Nom'} &lt;{email || 'email@exemple.com'}&gt;</div>
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
          <div className="px-6 pb-5">
            <div className="text-gray-800 mb-8 text-sm">
              {/* Espace réservé pour le contenu de l'email */}
            </div>
            
            {/* Signature */}
            <div ref={signatureRef} className="pt-1">
              <TableSignatureLayout />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
