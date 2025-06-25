import React, { useRef, useState } from 'react';
import { EmailSignature } from '../../types';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../../components/';
import { SignatureLayout } from './SignatureLayout';
import { getFullProfilePhotoUrl } from './utils';
import { DEFAULT_PROFILE_PHOTO_SIZE } from '../../constants/images';

interface EmailSignaturePreviewProps {
  // Accepte soit un objet signature complet, soit des propriétés individuelles
  signature?: Partial<EmailSignature>;
  // Propriétés individuelles au lieu d'un objet signature
  fullName?: string;
  jobTitle?: string;
  companyName?: string;
  phone?: string;
  mobilePhone?: string;
  email?: string;
  website?: string;
  address?: string;
  logoUrl?: string;
  profilePhotoUrl?: string;
  profilePhotoBase64?: string | null;
  profilePhotoSize?: number;
  profilePhotoToDelete?: boolean; // Indique si la photo de profil doit être supprimée
  layout?: string;
  horizontalSpacing?: number;
  verticalSpacing?: number;
  verticalAlignment?: string;
  imagesLayout?: string;
  textColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  showLogo?: boolean;
  textAlignment?: string;
  fontFamily?: string;
  fontSize?: number;
  socialLinksDisplayMode?: string;
  socialLinksIconStyle?: string;
  socialLinksIconColor?: string;
  socialLinks?: any;
  textStyle?: 'normal' | 'overline' | 'underline' | 'strikethrough';
  iconTextSpacing?: number;
  // Props spécifiques à l'affichage
  showEmailIcon?: boolean;
  showPhoneIcon?: boolean;
  showAddressIcon?: boolean;
  showWebsiteIcon?: boolean;
}

export const EmailSignaturePreview: React.FC<EmailSignaturePreviewProps> = ({ 
  signature,
  // Propriétés individuelles avec valeurs par défaut
  fullName: propFullName,
  jobTitle: propJobTitle,
  companyName: propCompanyName,
  phone: propPhone,
  mobilePhone: propMobilePhone,
  email: propEmail,
  website: propWebsite,
  address: propAddress,
  logoUrl: propLogoUrl,
  profilePhotoUrl: propProfilePhotoUrl,
  profilePhotoBase64: propProfilePhotoBase64,
  profilePhotoSize: propProfilePhotoSize,
  profilePhotoToDelete: propProfilePhotoToDelete,
  layout: propLayout,
  horizontalSpacing: propHorizontalSpacing,
  verticalSpacing: propVerticalSpacing,
  textColor: propTextColor,
  primaryColor: propPrimaryColor,
  secondaryColor: propSecondaryColor,
  textAlignment: propTextAlignment,
  socialLinks: propSocialLinks,
  socialLinksDisplayMode: propSocialLinksDisplayMode,
  socialLinksIconStyle: propSocialLinksIconStyle,
  socialLinksIconColor: propSocialLinksIconColor,
  showLogo: propShowLogo,
  fontSize: propFontSize,
  textStyle: propTextStyle,
  fontFamily: propFontFamily,
  iconTextSpacing: propIconTextSpacing,
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

  // Utiliser les propriétés de l'objet signature si disponible, sinon utiliser les propriétés individuelles
  const fullName = signature?.fullName || propFullName;
  const jobTitle = signature?.jobTitle || propJobTitle;
  const companyName = signature?.companyName || propCompanyName;
  const phone = signature?.phone || propPhone;
  const mobilePhone = signature?.mobilePhone || propMobilePhone;
  const email = signature?.email || propEmail;
  
  // Pour le site web et l'adresse, utiliser les propriétés du bon type
  // Vérifier si nous avons un objet de type SignatureData (qui utilise companyWebsite/companyAddress)
  // ou EmailSignature (qui utilise website/address)
  // Utiliser une approche sécurisée pour éviter les erreurs TypeScript
  
  // Définir une fonction d'aide pour vérifier si une propriété existe dans un objet
  const hasProperty = <T extends object, K extends string>(obj: T | undefined, prop: K): obj is T & Record<K, unknown> => {
    return obj !== undefined && prop in obj;
  };
  
  // Utiliser la fonction pour vérifier si les propriétés spécifiques existent
  const website = signature?.website || 
    (hasProperty(signature, 'companyWebsite') ? signature.companyWebsite as string : undefined) || 
    propWebsite;
    
  const address = signature?.address || 
    (hasProperty(signature, 'companyAddress') ? signature.companyAddress as string : undefined) || 
    propAddress;
  const logoUrl = signature?.logoUrl || propLogoUrl;
  const profilePhotoUrl = signature?.profilePhotoUrl || propProfilePhotoUrl;
  const profilePhotoBase64 = signature?.profilePhotoBase64 || propProfilePhotoBase64;
  const profilePhotoSize = signature?.profilePhotoSize || propProfilePhotoSize || DEFAULT_PROFILE_PHOTO_SIZE;
  const layout = signature?.layout || propLayout || 'vertical';
  const horizontalSpacing = signature?.horizontalSpacing || propHorizontalSpacing || 20;
  const verticalSpacing = signature?.verticalSpacing || propVerticalSpacing || 10;
  // verticalAlignment n'est pas utilisé dans ce composant, mais pourrait être utilisé dans le futur
  // const verticalAlignment = signature?.verticalAlignment || 'left';
  const imagesLayout = signature?.imagesLayout || 'stacked';
  const textColor = signature?.textColor || propTextColor || '#333333';
  const primaryColor = signature?.primaryColor || propPrimaryColor || '#5b50ff';
  const secondaryColor = signature?.secondaryColor || propSecondaryColor || '#333333';
  const socialLinksIconColor = signature?.socialLinksIconColor || propSocialLinksIconColor || '#ffffff';
  const textAlignment = signature?.textAlignment || propTextAlignment || 'left';
  const socialLinks = signature?.socialLinks || propSocialLinks;
  const socialLinksDisplayMode = signature?.socialLinksDisplayMode || propSocialLinksDisplayMode || 'icons';
  const socialLinksPosition = signature?.socialLinksPosition || 'bottom';
  const socialLinksIconStyle = signature?.socialLinksIconStyle || propSocialLinksIconStyle || 'simple';
  // Modification de la logique pour s'assurer que false est correctement pris en compte
  // Si signature?.showLogo est explicitement défini (même à false), on l'utilise
  // Sinon, on utilise propShowLogo si défini, sinon true par défaut
  const showLogo = signature?.showLogo !== undefined ? signature.showLogo : (propShowLogo !== undefined ? propShowLogo : true);
  // Déterminer si le logo doit être affiché
  const fontSize = signature?.fontSize || propFontSize || 14;
  const textStyle: 'normal' | 'overline' | 'underline' | 'strikethrough' = 
    (signature?.textStyle as 'normal' | 'overline' | 'underline' | 'strikethrough') || 
    (propTextStyle as 'normal' | 'overline' | 'underline' | 'strikethrough') || 
    'normal';
  const fontFamily = signature?.fontFamily || propFontFamily || 'Arial, sans-serif';
  const iconTextSpacing = signature?.iconTextSpacing || propIconTextSpacing || 5;

  // Définir la taille de la photo de profil avec une valeur par défaut
  // Convertir explicitement en nombre pour éviter les problèmes de type
  const photoSize = Number(profilePhotoSize || DEFAULT_PROFILE_PHOTO_SIZE);

  // Définir l'alignement effectif en fonction de la disposition
  const effectiveTextAlignment = textAlignment as 'left' | 'center' | 'right';
  
  // Définir l'espacement effectif
  const effectiveHorizontalSpacing = horizontalSpacing || 20;
  const effectiveVerticalSpacing = verticalSpacing || 10;

  // Définir le type de disposition de la signature
  const signatureLayout = layout as 'horizontal' | 'vertical';

  
  // Déterminer la source de la photo de profil
  // Si aucune image n'est fournie, profilePhotoSource sera null pour que ImageContainer affiche l'icône Profile par défaut
  // Traitement des données de l'image de profil
  
  let profilePhotoSource = null;
  
  // Déterminer si la photo est marquée comme supprimée
  // Forcer la conversion en booléen pour éviter les problèmes de type
  const photoDeleted = propProfilePhotoToDelete === true || signature?.profilePhotoToDelete === true;
  
  // IMPORTANT: Forcer profilePhotoSource à null si l'image a été supprimée
  if (photoDeleted) {
    profilePhotoSource = null;
  } else {
    // Vérifier d'abord s'il y a une image en base64 dans l'objet signature
    if (signature?.profilePhotoBase64) {
      profilePhotoSource = signature.profilePhotoBase64;
    }
    // Sinon, vérifier s'il y a une image en base64 dans les props
    else if (profilePhotoBase64) {
      profilePhotoSource = profilePhotoBase64;
    } 
    // Sinon, vérifier s'il y a une URL valide
    else if (profilePhotoUrl && profilePhotoUrl !== '' && profilePhotoUrl !== '/images/logo_newbi/SVG/Logo_Texte_Purple.svg') {
      profilePhotoSource = profilePhotoUrl;
    }
    else if (signature?.profilePhotoUrl && signature.profilePhotoUrl !== '' && signature.profilePhotoUrl !== '/images/logo_newbi/SVG/Logo_Texte_Purple.svg') {
      profilePhotoSource = signature.profilePhotoUrl;
    }
  }
  
  // Si l'image a été supprimée ou si aucune des conditions n'est remplie, profilePhotoSource reste null
  
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

  // Fonction pour convertir les divs en tables HTML pour une meilleure compatibilité avec les clients email
  const convertDivsToTables = (element: HTMLElement): string => {
    // Détecter si la signature est en mode horizontal ou vertical
    const detectSignatureLayout = (): 'horizontal' | 'vertical' => {
      // Rechercher le conteneur principal de la signature (celui avec le style display: flex)
      const mainContainer = element.querySelector('[style*="display: flex"]') as HTMLElement;
      if (!mainContainer) return 'vertical'; // Par défaut
      
      const style = window.getComputedStyle(mainContainer);
      return style.flexDirection === 'row' ? 'horizontal' : 'vertical';
    };
    
    // Fonction pour extraire les styles CSS inline
    const getInlineStyles = (el: HTMLElement): string => {
      const style = window.getComputedStyle(el);
      let inlineStyles = '';
      
      // Styles de base
      if (style.fontFamily) inlineStyles += `font-family: ${style.fontFamily}; `;
      if (style.fontSize) inlineStyles += `font-size: ${style.fontSize}; `;
      if (style.color) inlineStyles += `color: ${style.color}; `;
      if (style.fontWeight) inlineStyles += `font-weight: ${style.fontWeight}; `;
      if (style.textAlign) inlineStyles += `text-align: ${style.textAlign}; `;
      if (style.textDecoration) inlineStyles += `text-decoration: ${style.textDecoration}; `;
      if (style.margin) inlineStyles += `margin: ${style.margin}; `;
      if (style.padding) inlineStyles += `padding: ${style.padding}; `;
      if (style.backgroundColor !== 'rgba(0, 0, 0, 0)') inlineStyles += `background-color: ${style.backgroundColor}; `;
      
      return inlineStyles;
    };
    
    // Fonction pour convertir les images en conservant leurs attributs
    const convertImage = (imgElement: HTMLImageElement): string => {
      const src = imgElement.getAttribute('src') || '';
      const alt = imgElement.getAttribute('alt') || '';
      const style = window.getComputedStyle(imgElement);
      
      let imgStyles = '';
      if (style.maxWidth) imgStyles += `max-width: ${style.maxWidth}; `;
      if (style.maxHeight) imgStyles += `max-height: ${style.maxHeight}; `;
      if (style.objectFit) imgStyles += `object-fit: ${style.objectFit}; `;
      
      return `<img src="${src}" alt="${alt}" style="${imgStyles}" />`;
    };
    
    // Fonction pour convertir un élément texte
    const convertTextElement = (textElement: HTMLElement): string => {
      const styles = getInlineStyles(textElement);
      return `<span style="${styles}">${textElement.innerHTML}</span>`;
    };
    
    // Fonction pour gérer la partie gauche (photo de profil) en mode horizontal
    const convertLeftSection = (leftSection: HTMLElement): string => {
      // Trouver l'image de profil
      const profileImage = leftSection.querySelector('img');
      let profileImageHtml = '';
      
      if (profileImage) {
        profileImageHtml = convertImage(profileImage as HTMLImageElement);
      }
      
      // Trouver les informations personnelles (nom, titre, entreprise)
      const personalInfo = leftSection.querySelectorAll('h3, p');
      let personalInfoHtml = '';
      
      personalInfo.forEach(info => {
        personalInfoHtml += `<div style="margin: 3px 0;">${convertTextElement(info as HTMLElement)}</div>`;
      });
      
      return `<td valign="top" style="padding-right: 15px;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-bottom: 10px;">${profileImageHtml}</td>
          </tr>
          <tr>
            <td>${personalInfoHtml}</td>
          </tr>
        </table>
      </td>`;
    };
    
    // Fonction pour gérer la partie droite (informations de contact) en mode horizontal
    const convertRightSection = (rightSection: HTMLElement): string => {
      // Extraire le contenu
      return `<td valign="top" style="padding-left: 15px; border-left: 1px solid #e0e0e0;">
        ${rightSection.innerHTML}
      </td>`;
    };
    
    // Fonction pour convertir la signature horizontale
    const convertHorizontalSignature = (): string => {
      // Dans le mode horizontal, nous avons généralement 3 sections:
      // 1. La partie gauche avec la photo de profil et les infos personnelles
      // 2. Un séparateur vertical
      // 3. La partie droite avec les infos de contact
      
      const sections = element.querySelectorAll('[style*="display: flex"] > div');
      if (sections.length < 2) {
        return `<table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>${element.innerHTML}</td>
          </tr>
        </table>`;
      }
      
      const leftSection = sections[0] as HTMLElement;
      const rightSection = sections.length > 2 ? sections[2] as HTMLElement : sections[1] as HTMLElement;
      
      return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${textColor}; line-height: 1.5;">
        <tr>
          ${convertLeftSection(leftSection)}
          ${convertRightSection(rightSection)}
        </tr>
      </table>`;
    };
    
    // Fonction pour convertir la signature verticale
    const convertVerticalSignature = (): string => {
      // Dans le mode vertical, nous avons plusieurs sections empilées
      const sections = element.querySelectorAll('[style*="display: flex"] > div');
      let rows = '';
      
      // Parcourir les sections et les convertir en lignes de table
      sections.forEach((section) => {
        const sectionEl = section as HTMLElement;
        
        // Vérifier si c'est un séparateur horizontal
        if (sectionEl.style.height === '1px' && sectionEl.style.backgroundColor === '#e0e0e0') {
          rows += `<tr><td style="height: 1px; background-color: #e0e0e0; padding: 5px 0;"></td></tr>`;
          return;
        }
        
        // Vérifier si c'est une image
        const img = sectionEl.querySelector('img');
        if (img) {
          rows += `<tr><td style="text-align: center; padding: 10px 0;">${convertImage(img as HTMLImageElement)}</td></tr>`;
          return;
        }
        
        // Pour les autres sections
        rows += `<tr><td style="padding: 5px 0;">${sectionEl.innerHTML}</td></tr>`;
      });
      
      return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${textColor}; line-height: 1.5;">
        ${rows}
      </table>`;
    };
    
    // Détecter le layout et appliquer la conversion appropriée
    const layout = detectSignatureLayout();
    
    if (layout === 'horizontal') {
      return convertHorizontalSignature();
    } else {
      return convertVerticalSignature();
    }
  };

  // Fonction pour copier la signature dans le presse-papier avec préservation des images
  const copySignatureToClipboard = () => {
    if (signatureRef.current) {
      try {
        // Créer une copie du contenu pour préserver les images
        const signatureContent = signatureRef.current.cloneNode(true) as HTMLElement;
        
        // S'assurer que toutes les images ont des URL absolues
        const images = signatureContent.querySelectorAll('img');
        images.forEach(img => {
          // Convertir les URL relatives en URL absolues
          if (img.src && !img.src.startsWith('http') && !img.src.startsWith('data:')) {
            img.src = new URL(img.src, window.location.origin).href;
          }
        });
        
        // Convertir les divs en tables pour une meilleure compatibilité avec les clients email
        const tableHtml = convertDivsToTables(signatureContent);
        
        // Créer un blob avec le type MIME HTML
        const blob = new Blob([tableHtml], { type: 'text/html' });
        
        // Créer un ClipboardItem avec le blob
        const data = new ClipboardItem({
          'text/html': blob
        });
        
        // Utiliser l'API Clipboard moderne pour copier
        navigator.clipboard.write([data])
          .then(() => {
            // Afficher un message de succès
            setCopySuccess(true);
            
            // Réinitialiser le message après 3 secondes
            setTimeout(() => {
              setCopySuccess(false);
            }, 3000);
          })
          .catch(err => {
            console.error('Erreur lors de la copie avec API moderne:', err);
            // Fallback à la méthode traditionnelle en cas d'échec
            fallbackCopyMethod();
          });
      } catch (err) {
        console.error('Erreur lors de la préparation de la copie:', err);
        // Utiliser la méthode de secours en cas d'erreur
        fallbackCopyMethod();
      }
    }
  };
  
  // Méthode de secours utilisant l'ancienne API
  const fallbackCopyMethod = () => {
    if (signatureRef.current) {
      try {
        // Créer une copie du contenu et convertir en tables
        const signatureContent = signatureRef.current.cloneNode(true) as HTMLElement;
        
        // Créer un élément temporaire pour contenir la version HTML table
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        
        // Convertir les divs en tables et insérer dans le conteneur temporaire
        tempContainer.innerHTML = convertDivsToTables(signatureContent);
        
        // Ajouter le conteneur temporaire au document
        document.body.appendChild(tempContainer);
        
        // Sélectionner le contenu du conteneur temporaire
        const range = document.createRange();
        range.selectNodeContents(tempContainer);
        
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
          
          try {
            document.execCommand('copy');
            setCopySuccess(true);
            setTimeout(() => {
              setCopySuccess(false);
            }, 3000);
          } catch (err) {
            console.error('Erreur lors de la copie avec méthode de secours:', err);
          }
          
          window.getSelection()?.removeAllRanges();
        }
        
        // Supprimer le conteneur temporaire
        document.body.removeChild(tempContainer);
      } catch (err) {
        console.error('Erreur lors de la méthode de secours:', err);
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
            {copySuccess ? 'Copié !' : 'Copier la signature'}
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
          <div className="px-6 pb-5">
            <div className="text-gray-800 mb-8 text-sm">
              {/* Espace réservé pour le contenu de l'email */}
            </div>
            
            {/* Signature */}
            <div ref={signatureRef} style={signatureStyle} className="pt-1">
              <SignatureLayout
                key={`signature-layout-${photoDeleted ? 'deleted' : ''}-${photoSize}-${profilePhotoSource ? 'has-image' : 'no-image'}-${Date.now()}`}
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
                profilePhotoSource={profilePhotoSource ? (profilePhotoSource.startsWith('data:') ? profilePhotoSource : getFullProfilePhotoUrl(profilePhotoSource)) : null}
                profilePhotoSize={photoSize}
                imagesLayout={imagesLayout as 'stacked' | 'side-by-side'}
                profilePhotoToDelete={photoDeleted}
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
                secondaryColor={secondaryColor}
                socialLinksIconColor={socialLinksIconColor}
                effectiveTextAlignment={effectiveTextAlignment}
                effectiveHorizontalSpacing={effectiveHorizontalSpacing}
                effectiveVerticalSpacing={effectiveVerticalSpacing}
                iconTextSpacing={iconTextSpacing}
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
