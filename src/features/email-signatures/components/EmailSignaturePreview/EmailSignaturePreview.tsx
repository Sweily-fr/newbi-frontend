import React, { useRef, useState } from 'react';
import { EmailSignature } from '../../types';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../../components/ui';
import { SignatureLayout } from './SignatureLayout';
import { getFullImageUrl, getFullProfilePhotoUrl } from './utils';
import { SocialLinksComponent } from './SocialLinks';

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
  
  // Référence au conteneur de la signature
  const signatureRef = useRef<HTMLDivElement>(null);
  // URL de base de l'API pour les images
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
  
  // Extraction des données de la signature avec valeurs par défaut
  const {
    fullName,
    jobTitle,
    email,
    phone,
    website,
    address,
    companyName,
    primaryColor = '#5b50ff',
    secondaryColor,
    logoUrl,
    socialLinks,
    mobilePhone,
    showLogo,
    profilePhotoUrl,
    profilePhotoBase64,
    profilePhotoSize = 80,
    layout = 'horizontal',
    horizontalSpacing = 20,
    verticalSpacing = 10,
    verticalAlignment = 'left',
    imagesLayout = 'vertical',
    fontFamily = 'Arial, sans-serif',
    fontSize = 14,
    style = 'normal', // Style de texte par défaut: normal
    socialLinksDisplayMode = 'icons',
    socialLinksPosition = 'bottom',
    socialLinksIconStyle = 'plain'
  } = signature;
  
  // Remarque: les propriétés d'affichage des icônes sont maintenant passées directement comme props
  
  // Fonction pour préfixer l'URL du logo ou de la photo de profil avec l'URL de l'API si nécessaire
  const getFullImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) {
      return '';
    }
    
    // Vérifier si l'URL est déjà complète
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Si le chemin commence par "/images/", c'est une ressource statique du dossier public
    if (imagePath.startsWith('/images/')) {
      return imagePath; // Retourner le chemin tel quel pour les ressources statiques
    }
    
    // Vérifier si l'URL contient déjà l'URL de l'API (pour éviter les doubles préfixes)
    if (imagePath.includes(apiUrl)) {
      return imagePath;
    }
    
    // Pour les autres chemins relatifs, ajouter le préfixe de l'API
    const fullUrl = `${apiUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    return fullUrl;
  };
  
  // Fonction spécifique pour l'URL du logo
  const getFullLogoUrl = (logoPath: string | undefined) => {
    return getFullImageUrl(logoPath);
  };
  
  // Fonction spécifique pour l'URL de la photo de profil
  const getFullProfilePhotoUrl = (photoPath: string | undefined) => {
    // Si c'est une image en base64 (prévisualisation), la retourner directement
    if (photoPath && photoPath.startsWith('data:image')) {
      return photoPath;
    }
    // Sinon, utiliser la fonction standard pour les URLs
    return getFullImageUrl(photoPath);
  };

  // Nous utilisons maintenant le composant SocialLinksComponent qui gère ses propres styles

  // Définir explicitement showLogo avec une valeur par défaut à true
  const displayLogo = showLogo !== false; // Si showLogo est undefined ou null, on affiche le logo
  
  // Définir la taille de la photo de profil avec une valeur par défaut
  const photoSize = profilePhotoSize || 80; // Taille par défaut: 80px
  
  // Définir la police de caractères avec une valeur par défaut
  const signatureFontFamily = fontFamily || 'Arial, sans-serif'; // Police par défaut: Arial
  
  // Définir la taille de police avec une valeur par défaut
  const signatureFontSize = fontSize || 14; // Taille par défaut: 14px
  
  // Style de base pour la signature - utiliser une couleur fixe pour le texte
  const baseStyle = {
    fontFamily: signatureFontFamily,
    fontSize: `${signatureFontSize}px`,
    color: '#333333' // Couleur fixe pour le texte, indépendante de la couleur secondaire
  };
  
  // Le mode d'affichage des réseaux sociaux (texte ou icônes) est géré par le composant SocialLinksComponent
  
  // Définir la position des réseaux sociaux avec une valeur par défaut
  const socialPosition = socialLinksPosition || 'bottom'; // Position par défaut: en bas
  
  // Définir l'alignement du texte en mode vertical avec une valeur par défaut
  const effectiveAlignment = verticalAlignment || 'left'; // Alignement par défaut: gauche
  
  // Convertir l'alignement en valeur valide pour textAlign (seulement 'left', 'center', 'right')
  const effectiveTextAlign = (
    effectiveAlignment === 'left' || 
    effectiveAlignment === 'center' || 
    effectiveAlignment === 'right'
  ) ? effectiveAlignment : 'left'; // Valeur par défaut si non valide
  
  // Définir la disposition des images en mode vertical avec une valeur par défaut
  const imageLayout = imagesLayout || 'vertical'; // Disposition par défaut: verticale
  
  // Définir la disposition de la signature avec une valeur par défaut
  const signatureLayout = layout || 'vertical'; // Disposition par défaut: verticale
  
  // Calcul des espacements effectifs
  const effectiveHorizontalSpacing = horizontalSpacing || 20; // Espacement horizontal par défaut: 20px
  const effectiveVerticalSpacing = verticalSpacing || 10; // Espacement vertical par défaut: 10px
  
  // Définir le style des icônes des réseaux sociaux avec une valeur par défaut
  // Cette variable est utilisée indirectement via socialLinksIconStyle dans getSocialIconStyle
  
  // Styles pour la signature
  const signatureStyle = {
    ...baseStyle,
    lineHeight: '1.5',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: signatureLayout === 'vertical' ? (
      effectiveAlignment === 'center' ? 'center' : 
      effectiveAlignment === 'right' ? 'flex-end' : 'flex-start'
    ) : 'flex-start',
    width: '100%',
    gap: `${effectiveVerticalSpacing/2}px`
  };

  // Styles pour le conteneur principal
  const containerStyle = {
    display: 'flex',
    flexDirection: signatureLayout === 'horizontal' ? 'row' as const : 'column' as const,
    alignItems: signatureLayout === 'horizontal' ? 'flex-start' : 
                effectiveTextAlignment === 'center' ? 'center' : 
                effectiveTextAlignment === 'right' ? 'flex-end' : 'flex-start',
    gap: signatureLayout === 'horizontal' ? `${effectiveHorizontalSpacing}px` : `${effectiveVerticalSpacing}px`
  };

  // Styles pour les informations principales
  const infoStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: signatureLayout === 'horizontal' ? 'flex-start' : 
                effectiveTextAlignment === 'center' ? 'center' : 
                effectiveTextAlignment === 'right' ? 'flex-end' : 'flex-start',
    gap: '5px',
    // En mode horizontal, nous voulons que le contenu principal occupe l'espace disponible
    flex: signatureLayout === 'horizontal' ? '1' : 'initial'
  };

  // Fonction pour appliquer le style de texte sélectionné
  const getTextDecorationStyle = (textStyle: string) => {
    switch (textStyle) {
      case 'underline':
        return { textDecoration: 'underline' };
      case 'overline':
        return { textDecoration: 'overline' };
      case 'strikethrough':
        return { textDecoration: 'line-through' };
      default:
        return {};
    }
  };

  // Style de décoration de texte basé sur le style sélectionné
  const textDecorationStyle = getTextDecorationStyle(style);

  // Styles pour le nom complet
  const nameStyle = {
    color: primaryColor,
    fontWeight: 'bold',
    margin: '0',
    fontSize: `${(fontSize || 12) + 2}px`,
    textAlign: effectiveTextAlign,
    width: '100%',
    marginBottom: `${effectiveVerticalSpacing/2}px`,
    ...textDecorationStyle
  };

  // Styles pour le titre du poste - utiliser une couleur fixe pour le texte
  const jobTitleStyle = {
    color: '#666666', // Couleur fixe pour le texte, indépendante de la couleur secondaire
    margin: '0',
    fontStyle: 'italic',
    textAlign: effectiveTextAlign,
    width: '100%',
    marginBottom: `${effectiveVerticalSpacing}px`,
    ...textDecorationStyle
  };

  // Styles pour les informations de contact - utiliser une couleur fixe pour le texte
  const contactStyle = {
    margin: '0',
    color: '#666666', // Couleur fixe pour le texte, indépendante de la couleur secondaire
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: effectiveAlignment === 'center' ? 'center' : 
               effectiveAlignment === 'right' ? 'flex-end' : 'flex-start',
    width: '100%',
    gap: `${Math.max(5, effectiveVerticalSpacing/2)}px`,
    ...textDecorationStyle
  };

  // Styles pour les liens - utiliser la couleur primaire uniquement
  const linkStyle = {
    color: primaryColor || '#5b50ff', // Utiliser uniquement la couleur primaire pour les liens, pas la couleur secondaire
    textDecoration: 'none'
  };

  // Style commun pour les éléments de contact individuels
  const contactItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    justifyContent: effectiveAlignment === 'center' ? 'center' : 
                  effectiveAlignment === 'right' ? 'flex-end' : 'flex-start',
    width: '100%',
    ...textDecorationStyle
  };

  // Styles pour le séparateur - utiliser une couleur neutre pour ne pas être affecté par la couleur secondaire
  const separatorStyle = {
    width: signatureLayout === 'horizontal' ? '1px' : '100%',
    height: signatureLayout === 'horizontal' ? '100%' : '1px',
    backgroundColor: '#f5f5f5', // Couleur neutre fixe pour le séparateur
    margin: signatureLayout === 'horizontal' ? `0 ${effectiveHorizontalSpacing / 2}px` : `${effectiveVerticalSpacing / 2}px 0`
  };

  // Styles pour les images (logo et photo de profil)
  const imagesContainerStyle = {
    display: 'flex',
    flexDirection: imageLayout === 'horizontal' ? 'row' as const : 'column' as const,
    alignItems: effectiveAlignment === 'center' ? 'center' : 
               effectiveAlignment === 'right' ? 'flex-end' : 'flex-start',
    gap: '10px',
    marginBottom: signatureLayout === 'horizontal' ? '0' : '10px'
  };

  // Styles pour les réseaux sociaux
  const socialLinksContainerStyle = {
    display: 'flex',
    flexDirection: socialPosition === 'bottom' ? 'row' as const : 'column' as const,
    alignItems: effectiveAlignment === 'center' ? 'center' : 
               effectiveAlignment === 'right' ? 'flex-end' : 'flex-start',
    justifyContent: effectiveTextAlign === 'center' ? 'center' : 
                   effectiveTextAlign === 'right' ? 'flex-end' : 'flex-start',
    flexWrap: 'wrap' as const,
    marginTop: '10px'
  };

  // Vérifier s'il y a des réseaux sociaux à afficher
  const hasSocialLinks = socialLinks && (
    socialLinks.linkedin || 
    socialLinks.twitter || 
    socialLinks.facebook || 
    socialLinks.instagram
  );
  
  // Utiliser profilePhotoBase64 s'il est disponible, sinon utiliser profilePhotoUrl
  // S'assurer que l'image par défaut n'est pas utilisée si une photo a été téléchargée
  const profilePhotoSource = profilePhotoBase64 || (profilePhotoUrl && profilePhotoUrl !== '/images/logo_newbi/SVG/Logo_Texte_Purple.svg' ? profilePhotoUrl : null);
  

  // Rendu des réseaux sociaux
  const renderSocialLinks = () => {
    if (!hasSocialLinks) return null;

    // Créer une couleur dédiée pour les icônes des réseaux sociaux
    // Cette couleur est indépendante de la couleur secondaire pour éviter d'affecter les textes
    const socialIconColor = secondaryColor || primaryColor;
    
    return (
      <div style={socialLinksContainerStyle}>
        <SocialLinksComponent
          socialLinks={socialLinks}
          displayMode={socialLinksDisplayMode}
          socialLinksIconStyle={socialLinksIconStyle}
          primaryColor={primaryColor}
          iconColor={socialIconColor} // Couleur pour le SVG (l'icône elle-même) en mode "plain" ou pour le texte
          backgroundColor={primaryColor} // Couleur de fond pour les styles "carré arrondi" et "cercle"
        />
      </div>
    );
  };

  // Fonction pour copier la signature dans le presse-papier
  const copySignatureToClipboard = () => {
    if (signatureRef.current) {
      // Créer une sélection temporaire
      const range = document.createRange();
      range.selectNode(signatureRef.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      
      try {
        // Exécuter la commande de copie
        document.execCommand('copy');
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
  };

  return (
    <div className="email-signature-preview w-full max-w-2xl mx-auto">
      {/* Fenêtre style Mac */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Barre de titre style Mac avec boutons de contrôle */}
        <div className="bg-[#222] px-4 py-2 flex items-center border-b border-gray-200">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          {/* Titre de la fenêtre */}
          <div className="flex-1 text-center text-sm text-white font-medium">
            Nouveau message
          </div>
          
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
              {/* Disposition de la signature */}
              {signatureLayout === 'horizontal' && (
                <div style={{ display: 'flex', width: '100%', gap: `${effectiveHorizontalSpacing}px` }}>
                  {/* Partie gauche - Photo de profil */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '10px'
                  }}>
                    {profilePhotoSource ? (
                      <div style={{ 
                        width: `${photoSize}px`, 
                        height: `${photoSize}px`, 
                        borderRadius: '50%',
                        overflow: 'hidden',
                        backgroundColor: '#f0eeff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img 
                          src={getFullProfilePhotoUrl(profilePhotoSource)} 
                          alt="Profile" 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }} 
                        />
                      </div>
                    ) : logoUrl && displayLogo && (
                      <img 
                        src={getFullLogoUrl(logoUrl)} 
                        alt="Logo" 
                        style={{ maxWidth: '120px', maxHeight: '60px' }} 
                      />
                    )}
                  </div>
                  
                  {/* Partie centrale - Informations personnelles */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 20px 0 0'
                  }}>
                    {fullName && <h3 style={{...nameStyle, margin: '0 0 5px 0'}}>{fullName}</h3>}
                    {jobTitle && <p style={{...jobTitleStyle, margin: '0 0 5px 0'}}>{jobTitle}</p>}
                    {companyName && <p style={{margin: '0 0 5px 0', color: primaryColor}}>{companyName}</p>}
                  </div>
                  
                  {/* Séparateur vertical */}
                  <div style={{
                    width: '1px',
                    backgroundColor: '#e0e0e0', // Même couleur que le séparateur horizontal
                    alignSelf: 'stretch',
                    margin: '0'
                  }}></div>
                  
                  {/* Partie droite - Informations de contact */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 0 0 20px',
                    gap: `${effectiveVerticalSpacing}px`
                  }}>
                    {phone && (
                      <div style={{...contactItemStyle, margin: '0'}}>
                        <span style={{ color: '#5b50ff' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span style={{marginLeft: '5px'}}>{phone} {mobilePhone && `| ${mobilePhone}`}</span>
                      </div>
                    )}
                    {email && (
                      <div style={{...contactItemStyle, margin: '0'}}>
                        <span style={{ color: '#5b50ff' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                          </svg>
                        </span>
                        <a href={`mailto:${email}`} style={{...linkStyle, marginLeft: '5px'}}>{email}</a>
                      </div>
                    )}
                    {website && (
                      <div style={{...contactItemStyle, margin: '0'}}>
                        <span style={{ color: '#5b50ff' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12l-1.64-1.64a6 6 0 01-1.676-3.257l-.172-1.03z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" style={{...linkStyle, marginLeft: '5px'}}>
                          {website.replace(/^https?:\/\//i, '')}
                        </a>
                      </div>
                    )}
                    {address && (
                      <div style={{...contactItemStyle, margin: '0'}}>
                        <span style={{ color: '#5b50ff' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span style={{marginLeft: '5px'}}>{address}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Disposition verticale - code existant */}
              {signatureLayout !== 'horizontal' && (
                <div style={containerStyle as React.CSSProperties}>
                  {/* Conteneur d'images - n'afficher que si nécessaire */}
                  <div style={imagesContainerStyle as React.CSSProperties}>
                    {/* N'afficher le logo que s'il est défini et qu'il ne s'agit pas du logo Newbi par défaut 
                        lorsqu'une photo de profil est présente */}
                    {logoUrl && displayLogo && 
                     !(profilePhotoSource && logoUrl === '/images/logo_newbi/SVG/Logo_Texte_Purple.svg') && (
                      <img 
                        src={getFullLogoUrl(logoUrl)} 
                        alt="Logo" 
                        style={{ maxWidth: '120px', maxHeight: '60px' }} 
                      />
                    )}
                    {/* Conteneur de la photo de profil - uniquement affiché si une photo est téléchargée */}
                    {profilePhotoSource && (
                      <div style={{ 
                        width: `${photoSize}px`, 
                        height: `${photoSize}px`, 
                        borderRadius: '50%',
                        overflow: 'hidden',
                        backgroundColor: '#f0eeff', // Couleur de fond légère Newbi
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img 
                          src={getFullProfilePhotoUrl(profilePhotoSource)} 
                          alt="Profile" 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }} 
                        />
                      </div>
                    )}
                  </div> {/* Fermeture du conteneur d'images */}
                  
                  {/* En mode horizontal, afficher le nom et le titre dans le conteneur d'images */}
                  {signatureLayout === 'horizontal' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {fullName && <h3 style={nameStyle}>{fullName || 'Votre Nom'}</h3>}
                      {jobTitle && <p style={jobTitleStyle}>{jobTitle || 'Votre Poste'}</p>}
                    </div>
                  )}
                  {/* En mode vertical, afficher le nom et le titre après les images */}
                  {signatureLayout === 'vertical' && fullName && <h3 style={nameStyle}>{fullName || 'Votre Nom'}</h3>}
                  {signatureLayout === 'vertical' && jobTitle && <p style={jobTitleStyle}>{jobTitle || 'Votre Poste'}</p>}
                  
                  {/* Trait séparateur supérieur - uniquement en mode vertical */}
                  <div style={{
                    height: '1px',
                    backgroundColor: '#e0e0e0',
                    margin: `${effectiveVerticalSpacing/2}px 0`,
                    alignSelf: effectiveAlignment === 'center' ? 'center' : 
                              effectiveAlignment === 'right' ? 'flex-end' : 'flex-start',
                    width: effectiveAlignment === 'center' ? '80%' : '100%'
                  }}></div>
                  
                  <div style={contactStyle}>
                    {email && (
                      <div style={contactItemStyle}>
                        {showEmailIcon && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={primaryColor || '#5b50ff'}>
                            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                          </svg>
                        )}
                        <a href={`mailto:${email}`} style={linkStyle}>{email}</a>
                      </div>
                    )}
                    {phone && (
                      <div style={contactItemStyle}>
                        {showPhoneIcon && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={primaryColor || '#5b50ff'}>
                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                          </svg>
                        )}
                        <a href={`tel:${phone}`} style={linkStyle}>{phone}</a>
                      </div>
                    )}
                    {mobilePhone && (
                      <div style={contactItemStyle}>
                        {showPhoneIcon && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={primaryColor || '#5b50ff'}>
                            <path d="M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
                            <path fillRule="evenodd" d="M8.625.75A3.375 3.375 0 005.25 4.125v15.75a3.375 3.375 0 003.375 3.375h6.75a3.375 3.375 0 003.375-3.375V4.125A3.375 3.375 0 0015.375.75h-6.75zM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 017.5 19.875V4.125z" clipRule="evenodd" />
                          </svg>
                        )}
                        <a href={`tel:${mobilePhone}`} style={linkStyle}>{mobilePhone}</a>
                      </div>
                    )}
                    {website && (
                      <div style={contactItemStyle}>
                        {showWebsiteIcon && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={primaryColor || '#5b50ff'}>
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12l-1.64-1.64a6 6 0 01-1.676-3.257l-.172-1.03z" clipRule="evenodd" />
                          </svg>
                        )}
                        <a href={website} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                          {website.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </div>
                    )}
                    {address && (
                      <div style={{...contactItemStyle, alignItems: 'flex-start'}}>
                        {showAddressIcon && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={primaryColor || '#5b50ff'} style={{ marginTop: '3px' }}>
                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span style={{ whiteSpace: 'pre-line' }}>
                          {address}
                        </span>
                      </div>
                    )}
                    {companyName && (
                      <div style={contactItemStyle}>
                        <strong>{companyName}</strong>
                      </div>
                    )}
                  </div>
                  
                  {/* Trait séparateur inférieur */}
                  <div style={{
                    height: '1px',
                    backgroundColor: '#e0e0e0',
                    margin: `${effectiveVerticalSpacing/2}px 0 ${effectiveVerticalSpacing/2}px 0`,
                    alignSelf: effectiveAlignment === 'center' ? 'center' : 
                              effectiveAlignment === 'right' ? 'flex-end' : 'flex-start',
                    width: effectiveAlignment === 'center' ? '80%' : '100%'
                  }}></div>
                  
                  {socialPosition === 'bottom' && renderSocialLinks()}
                  
                  {/* Afficher les liens sociaux à droite si nécessaire */}
                  {socialPosition === 'right' && renderSocialLinks()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};