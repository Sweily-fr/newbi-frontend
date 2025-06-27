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
  children?: React.ReactNode;
}

// Interface pour les props du composant interne
interface EmailSignaturePreviewContentProps {
  onCopy?: () => void;
  onError?: (message: string) => void;
  children?: React.ReactNode;
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
  onError,
  children
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
      <EmailSignaturePreviewContent onCopy={onCopy} onError={onError}>
        {children}
      </EmailSignaturePreviewContent>
    </EmailSignatureProvider>
  );
};

// Composant interne qui consomme le contexte
interface EmailSignaturePreviewContentProps {
  onCopy?: () => void;
  onError?: (error: string) => void;
}

const EmailSignaturePreviewContent: React.FC<EmailSignaturePreviewContentProps> = ({ onCopy, onError, children }) => {
  const { signatureData } = useEmailSignature();
  const [copied, setCopied] = useState(false);
  const signatureRef = useRef<HTMLDivElement>(null);

  // Extraire les données du contexte pour l'affichage
  const { email, firstName, lastName } = signatureData;
  const displayName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || '';
  
  // Fonction pour s'assurer que toutes les images ont des URL absolues et que les styles sont préservés
  const prepareSignatureForCopy = (element: HTMLElement): HTMLElement => {
    // Cloner l'élément pour ne pas modifier l'original
    const clone = element.cloneNode(true) as HTMLElement;
    
    // S'assurer que toutes les images ont des URL absolues et sont correctement affichées
    const images = clone.querySelectorAll('img');
    images.forEach(img => {
      // Conserver l'attribut src original
      const originalSrc = img.getAttribute('src');
      
      // S'assurer que l'URL est absolue
      if (originalSrc && !originalSrc.startsWith('http') && !originalSrc.startsWith('data:')) {
        img.src = new URL(originalSrc, window.location.origin).href;
      }
      
      // Ajouter des attributs pour meilleure compatibilité email
      if (img.style.width) img.setAttribute('width', img.style.width.replace('px', ''));
      if (img.style.height) img.setAttribute('height', img.style.height.replace('px', ''));
      if (img.style.borderRadius) {
        // Essayer de préserver la forme ronde pour les photos de profil
        if (img.style.borderRadius === '50%') {
          img.style.borderRadius = '1000px';
        }
      }
      
      // Forcer l'affichage des images
      img.style.display = 'block';
      img.style.maxWidth = 'none';
    });
    
    // Convertir les styles inline en attributs pour meilleure compatibilité email
    const elementsWithStyle = clone.querySelectorAll('*[style]');
    elementsWithStyle.forEach(el => {
      const element = el as HTMLElement;
      // Conserver les styles importants comme attributs HTML pour meilleure compatibilité
      if (element.style.color) element.setAttribute('color', element.style.color);
      if (element.style.backgroundColor) element.setAttribute('bgcolor', element.style.backgroundColor);
      if (element.style.width) element.setAttribute('width', element.style.width.replace('px', ''));
      if (element.style.height) element.setAttribute('height', element.style.height.replace('px', ''));
      if (element.style.fontFamily) element.setAttribute('face', element.style.fontFamily);
      if (element.style.fontSize) element.setAttribute('size', element.style.fontSize.replace('px', ''));
      if (element.style.textAlign) element.setAttribute('align', element.style.textAlign);
      if (element.style.verticalAlign) element.setAttribute('valign', element.style.verticalAlign);
    });
    
    return clone;
  };

  // Fonction pour copier la signature dans le presse-papiers
  const copySignature = async () => {
    if (!signatureRef.current) return;
    
    try {
      // Préparer le contenu de la signature pour la copie
      const signatureContent = prepareSignatureForCopy(signatureRef.current);
      
      // Créer un blob avec le contenu HTML complet pour conserver le formatage
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              table { border-collapse: collapse !important; }
              td { padding: 0 !important; }
              img { display: block !important; max-width: none !important; }
              body { margin: 0 !important; padding: 0 !important; }
              .profile-photo { border-radius: 50% !important; }
            </style>
          </head>
          <body>
            ${signatureContent.outerHTML}
          </body>
        </html>
      `;
      
      // Créer un objet ClipboardItem avec le type HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // Créer également une version texte simple pour les clients qui ne supportent pas le HTML
      const textContent = signatureRef.current.textContent || '';
      const textBlob = new Blob([textContent], { type: 'text/plain' });
      
      // Essayer d'utiliser l'API Clipboard moderne avec ClipboardItem
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': blob,
            'text/plain': textBlob
          })
        ]);
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
      // Préparer le contenu de la signature pour la copie
      const signatureContent = prepareSignatureForCopy(signatureRef.current);
      
      // Créer un iframe temporaire pour conserver le formatage
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '0';
      document.body.appendChild(iframe);
      
      // Accéder au document de l'iframe et y insérer le contenu HTML formaté
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Impossible d\'accéder au document de l\'iframe');
      }
      
      // Écrire le contenu HTML complet avec les styles
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Email Signature</title>
            <style>
              table { border-collapse: collapse !important; }
              td { padding: 0 !important; }
              img { display: block !important; max-width: none !important; }
              body { margin: 0 !important; padding: 0 !important; }
              .profile-photo { border-radius: 50% !important; }
            </style>
          </head>
          <body>
            ${signatureContent.outerHTML}
          </body>
        </html>
      `);
      iframeDoc.close();
      
      // Sélectionner tout le contenu du body de l'iframe
      const range = iframeDoc.createRange();
      range.selectNodeContents(iframeDoc.body);
      
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
      
      // Nettoyer l'iframe temporaire
      document.body.removeChild(iframe);
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
              {children || <TableSignatureLayout />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
