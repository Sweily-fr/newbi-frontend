import React, { useRef, useState } from 'react';
import { EmailSignature } from './EmailSignaturesTable';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../ui';

interface EmailSignaturePreviewProps {
  signature: Partial<EmailSignature>;
}

export const EmailSignaturePreview: React.FC<EmailSignaturePreviewProps> = ({ signature }) => {
  // État pour afficher un message de confirmation après la copie
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Référence au conteneur de la signature
  const signatureRef = useRef<HTMLDivElement>(null);
  // URL de base de l'API pour les images - essayer différentes façons d'accéder aux variables d'environnement
  const apiUrl = import.meta.env.VITE_API_URL + '/' || "http://localhost:4000";
  
  console.log('API URL from env:', apiUrl);
  console.log('All env variables:', import.meta.env);
  console.log('Logo URL original:', signature.logoUrl);

  // Fonction pour préfixer l'URL du logo ou de la photo de profil avec l'URL de l'API si nécessaire
  const getFullImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) {
      return '';
    }
    
    // Vérifier si l'URL est déjà complète
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Vérifier si l'URL contient déjà l'URL de l'API (pour éviter les doubles préfixes)
    if (imagePath.includes(apiUrl)) {
      return imagePath;
    }
    
    // Pour le débogage, utiliser une image de test en ligne si nous avons un chemin relatif
    // Cela nous permettra de vérifier si le problème vient des variables d'environnement
    if (!imagePath.startsWith('http')) {
      // Utiliser l'image réelle avec le préfixe de l'API
      const fullUrl = `${apiUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
      return fullUrl;
    }
    
    return imagePath;
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
  
  // Déstructuration avec valeurs par défaut
  const {
    fullName,
    jobTitle,
    email,
    phone,
    mobilePhone,
    website,
    address,
    companyName,
    socialLinks,
    template,
    primaryColor,
    secondaryColor,
    logoUrl,
    showLogo,
    profilePhotoUrl,
    profilePhotoSize,
    socialLinksDisplayMode,
    socialLinksIconStyle,
    socialLinksIconBgColor,
    socialLinksIconColor,
    socialLinksIconSize,
    socialLinksPosition,
    layout,
    fontFamily,
    fontSize,
    verticalAlignment,
    imagesLayout
  } = signature;
  
  // Définir explicitement showLogo avec une valeur par défaut à true
  const displayLogo = showLogo !== false; // Si showLogo est undefined ou null, on affiche le logo
  
  // Définir la taille de la photo de profil avec une valeur par défaut
  const photoSize = profilePhotoSize || 80; // Taille par défaut: 80px
  
  // Définir la taille des icônes de réseaux sociaux avec une valeur par défaut
  const iconSize = socialLinksIconSize || 20; // Taille par défaut: 20px
  
  // Définir la police de caractères avec une valeur par défaut
  const signatureFontFamily = fontFamily || 'Arial, sans-serif'; // Police par défaut: Arial
  
  // Définir la taille de police avec une valeur par défaut
  const signatureFontSize = fontSize || 14; // Taille par défaut: 14px
  
  // Log pour déboguer
  console.log('Police sélectionnée:', fontFamily);
  console.log('Police utilisée:', signatureFontFamily);
  console.log('Taille de police sélectionnée:', fontSize);
  console.log('Taille de police utilisée:', signatureFontSize);
  
  // Style de base pour la signature
  const baseStyle = {
    fontFamily: signatureFontFamily,
    fontSize: `${signatureFontSize}px`,
    color: '#333'
  };
  
  // Définir le mode d'affichage des réseaux sociaux avec une valeur par défaut
  const displayMode = socialLinksDisplayMode || 'text'; // Mode par défaut: texte
  
  // Définir la position des réseaux sociaux avec une valeur par défaut
  const socialPosition = socialLinksPosition || 'bottom'; // Position par défaut: en bas
  
  // Définir l'alignement du texte en mode vertical avec une valeur par défaut
  const textAlignment = verticalAlignment || 'left'; // Alignement par défaut: gauche
  
  // Définir la disposition des images en mode vertical avec une valeur par défaut
  const imageLayout = imagesLayout || 'vertical'; // Disposition par défaut: verticale
  
  // Définir la disposition de la signature avec une valeur par défaut
  const signatureLayout = layout || 'vertical'; // Disposition par défaut: verticale
  
  // Calcul des espacements effectifs
  const effectiveHorizontalSpacing = signature.horizontalSpacing || 20; // Espacement horizontal par défaut: 20px
  const effectiveVerticalSpacing = signature.verticalSpacing || 10; // Espacement vertical par défaut: 10px
  
  // Définir le style des icônes des réseaux sociaux avec une valeur par défaut
  const iconStyle = socialLinksIconStyle || 'plain'; // Style par défaut: sans fond
  
  // Définir les couleurs des icônes des réseaux sociaux avec des valeurs par défaut
  const iconBgColor = socialLinksIconBgColor || primaryColor; // Couleur de fond par défaut: couleur primaire
  const iconColor = socialLinksIconColor || (iconStyle === 'plain' ? primaryColor : '#FFFFFF'); // Couleur du texte par défaut
  
  console.log('showLogo value:', showLogo);
  console.log('displayLogo calculated:', displayLogo);

  // Fonction pour rendre le template de signature approprié
  const renderSignatureTemplate = () => {
    switch (template) {
      case 'PROFESSIONAL':
        return renderProfessionalTemplate();
      case 'MODERN':
        return renderModernTemplate();
      case 'CREATIVE':
        return renderCreativeTemplate();
      case 'SIMPLE':
      default:
        return renderSimpleTemplate();
    }
  };

  // Template Simple
  const renderSimpleTemplate = () => {
    // Si la disposition est verticale, on utilise la mise en page améliorée
    if (signatureLayout === 'vertical') {
      // Déterminer l'alignement du texte
      const textAlignStyle = textAlignment === 'center' ? 'center' : (textAlignment === 'right' ? 'right' : 'left');
      
      // Déterminer si nous avons des images à afficher (photo de profil et/ou logo)
      const hasProfilePhoto = !!profilePhotoUrl;
      const hasLogo = !!(logoUrl && displayLogo);
      const hasAnyImage = hasProfilePhoto || hasLogo;
      
      // Les conteneurs sont maintenant gérés directement dans le rendu principal pour utiliser des tableaux HTML
      
      // Créer le conteneur des réseaux sociaux (si en position bottom)
      const socialLinksContainer = socialLinks && Object.values(socialLinks).some(link => link) && socialPosition === 'bottom' ? (
        <div style={{
          textAlign: textAlignStyle as 'left' | 'center' | 'right',
          marginTop: `${effectiveVerticalSpacing}px`,
          paddingTop: `${effectiveVerticalSpacing}px`,
          borderTop: `1px solid ${secondaryColor || '#f5f5f5'}`
        }}>
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
              {displayMode === 'icons' ? (
                <span style={{
                  display: 'inline-block',
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  textAlign: 'center',
                  backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                  borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0'),
                  padding: iconStyle !== 'plain' ? '4px' : '0'
                }}>
                  <svg 
                    viewBox="0 0 24 24" 
                    style={{
                      width: '100%',
                      height: '100%',
                      fill: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc')
                    }}
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </span>
              ) : 'LinkedIn'}
            </a>
          )}
          {socialLinks.twitter && (
            <a href={socialLinks.twitter} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
              {displayMode === 'icons' ? (
                <span style={{
                  display: 'inline-block',
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  textAlign: 'center',
                  backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                  borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0'),
                  padding: iconStyle !== 'plain' ? '4px' : '0'
                }}>
                  <svg 
                    viewBox="0 0 24 24" 
                    style={{
                      width: '100%',
                      height: '100%',
                      fill: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc')
                    }}
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </span>
              ) : 'X'}
            </a>
          )}
          {socialLinks.facebook && (
            <a href={socialLinks.facebook} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
              {displayMode === 'icons' ? (
                <span style={{
                  display: 'inline-block',
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  textAlign: 'center',
                  backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                  borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0'),
                  padding: iconStyle !== 'plain' ? '4px' : '0'
                }}>
                  <svg 
                    viewBox="0 0 24 24" 
                    style={{
                      width: '100%',
                      height: '100%',
                      fill: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc')
                    }}
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </span>
              ) : 'Facebook'}
            </a>
          )}
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
              {displayMode === 'icons' ? (
                <span style={{
                  display: 'inline-block',
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  textAlign: 'center',
                  backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                  borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0'),
                  padding: iconStyle !== 'plain' ? '4px' : '0'
                }}>
                  <svg 
                    viewBox="0 0 24 24" 
                    style={{
                      width: '100%',
                      height: '100%',
                      fill: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc')
                    }}
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  
                </span>
              ) : 'Instagram'}
            </a>
          )}
        </div>
      ) : null;
      
      // Créer le conteneur des réseaux sociaux (si en position right)
      const socialLinksInlineContainer = socialLinks && Object.values(socialLinks).some(link => link) && socialPosition === 'right' ? (
        <div style={{
          textAlign: textAlignStyle as 'left' | 'center' | 'right',
          marginTop: `${effectiveVerticalSpacing}px`
        }}>
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
              {displayMode === 'icons' ? (
                <span style={{
                  display: 'inline-block',
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  textAlign: 'center',
                  backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                  borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0'),
                  padding: iconStyle !== 'plain' ? '4px' : '0'
                }}>
                  <svg 
                    viewBox="0 0 24 24" 
                    style={{
                      width: '100%',
                      height: '100%',
                      fill: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc')
                    }}
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </span>
              ) : 'LinkedIn'}
            </a>
          )}
          {socialLinks.twitter && (
            <a href={socialLinks.twitter} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
              {displayMode === 'icons' ? (
                <span style={{
                  display: 'inline-block',
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  textAlign: 'center',
                  backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                  borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0'),
                  padding: iconStyle !== 'plain' ? '4px' : '0'
                }}>
                  <svg 
                    viewBox="0 0 24 24" 
                    style={{
                      width: '100%',
                      height: '100%',
                      fill: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc')
                    }}
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </span>
              ) : 'X'}
            </a>
          )}
          {socialLinks.facebook && (
            <a href={socialLinks.facebook} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
              {displayMode === 'icons' ? (
                <span style={{
                  display: 'inline-block',
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  textAlign: 'center',
                  backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                  borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0'),
                  padding: iconStyle !== 'plain' ? '4px' : '0'
                }}>
                  <svg 
                    viewBox="0 0 24 24" 
                    style={{
                      width: '100%',
                      height: '100%',
                      fill: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc')
                    }}
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </span>
              ) : 'Facebook'}
            </a>
          )}
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
              {displayMode === 'icons' ? (
                <span style={{
                  display: 'inline-block',
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  textAlign: 'center',
                  backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                  borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0'),
                  padding: iconStyle !== 'plain' ? '4px' : '0'
                }}>
                  <svg 
                    viewBox="0 0 24 24" 
                    style={{
                      width: '100%',
                      height: '100%',
                      fill: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc')
                    }}
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </span>
              ) : 'Instagram'}
            </a>
          )}
        </div>
      ) : null;
      
      // Assembler la signature complète en utilisant des tableaux HTML pour la compatibilité avec Gmail
      return (
        <table cellPadding={0} cellSpacing={0} border={0} style={{ ...baseStyle, width: '100%', maxWidth: '500px' }}>
          <tbody>
            {/* Conteneur principal */}
            <tr>
              <td align={textAlignment} style={{ textAlign: textAlignment as 'left' | 'center' | 'right' }}>
                {/* Images (photo de profil et/ou logo) */}
                {hasAnyImage && (
                  <table cellPadding={0} cellSpacing={0} border={0} style={{ width: '100%', marginBottom: `${effectiveVerticalSpacing}px` }}>
                    <tbody>
                      <tr>
                        <td align={textAlignment} style={{ textAlign: textAlignment as 'left' | 'center' | 'right' }}>
                          {imageLayout === 'horizontal' ? (
                            // Disposition horizontale des images
                            <table cellPadding={0} cellSpacing={0} border={0} style={{ display: 'inline-table' }}>
                              <tbody>
                                <tr>
                                  {profilePhotoUrl && (
                                    <td style={{ paddingRight: '15px' }}>
                                      <img 
                                        src={getFullProfilePhotoUrl(profilePhotoUrl)} 
                                        alt="Photo de profil" 
                                        width={photoSize} 
                                        height={photoSize} 
                                        style={{ borderRadius: '10px', display: 'block' }} 
                                      />
                                    </td>
                                  )}
                                  {logoUrl && displayLogo && (
                                    <td>
                                      <img 
                                        src={getFullLogoUrl(logoUrl)} 
                                        alt="Logo" 
                                        style={{ maxWidth: '100px', display: 'block' }} 
                                      />
                                    </td>
                                  )}
                                </tr>
                              </tbody>
                            </table>
                          ) : (
                            // Disposition verticale des images
                            <table cellPadding={0} cellSpacing={0} border={0} style={{ display: 'inline-table' }}>
                              <tbody>
                                {profilePhotoUrl && (
                                  <tr>
                                    <td align={textAlignment} style={{ textAlign: textAlignment as 'left' | 'center' | 'right', paddingBottom: '15px' }}>
                                      <img 
                                        src={getFullProfilePhotoUrl(profilePhotoUrl)} 
                                        alt="Photo de profil" 
                                        width={photoSize} 
                                        height={photoSize} 
                                        style={{ borderRadius: '10px', display: 'block', margin: textAlignment === 'center' ? '0 auto' : (textAlignment === 'right' ? '0 0 0 auto' : '0 auto 0 0') }} 
                                      />
                                    </td>
                                  </tr>
                                )}
                                {logoUrl && displayLogo && (
                                  <tr>
                                    <td align={textAlignment} style={{ textAlign: textAlignment as 'left' | 'center' | 'right' }}>
                                      <img 
                                        src={getFullLogoUrl(logoUrl)} 
                                        alt="Logo" 
                                        style={{ maxWidth: '100px', display: 'block', margin: textAlignment === 'center' ? '0 auto' : (textAlignment === 'right' ? '0 0 0 auto' : '0 auto 0 0') }} 
                                      />
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
                
                {/* Informations personnelles */}
                <table cellPadding={0} cellSpacing={0} border={0} style={{ width: '100%', marginBottom: `${effectiveVerticalSpacing}px` }}>
                  <tbody>
                    <tr>
                      <td align={textAlignment} style={{ textAlign: textAlignment as 'left' | 'center' | 'right' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{fullName || 'Votre Nom'}</div>
                        <div style={{ color: primaryColor || '#0066cc' }}>{jobTitle || 'Votre Poste'}</div>
                        {companyName && <div>{companyName}</div>}
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                {/* Informations de contact */}
                <table cellPadding={0} cellSpacing={0} border={0} style={{ width: '100%', marginBottom: `${effectiveVerticalSpacing}px` }}>
                  <tbody>
                    <tr>
                      <td align={textAlignment} style={{ textAlign: textAlignment as 'left' | 'center' | 'right' }}>
                        {email && <div>Email: <a href={`mailto:${email}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }}>{email}</a></div>}
                        {phone && <div>Tél: {phone}</div>}
                        {mobilePhone && <div>Mobile: {mobilePhone}</div>}
                        {website && <div>Site web: <a href={website.startsWith('http') ? website : `https://${website}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{website}</a></div>}
                        {address && <div>Adresse: {address}</div>}
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                {/* Réseaux sociaux en ligne (si position = right) */}
                {socialLinksInlineContainer && (
                  <table cellPadding={0} cellSpacing={0} border={0} style={{ width: '100%', marginBottom: `${effectiveVerticalSpacing}px` }}>
                    <tbody>
                      <tr>
                        <td align={textAlignment} style={{ textAlign: textAlignment as 'left' | 'center' | 'right' }}>
                          {socialLinksInlineContainer}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
                
                {/* Réseaux sociaux en bas (si position = bottom) */}
                {socialLinksContainer && (
                  <table cellPadding={0} cellSpacing={0} border={0} style={{ width: '100%', paddingTop: `${effectiveVerticalSpacing}px` }}>
                    <tbody>
                      <tr>
                        <td align={textAlignment} style={{ textAlign: textAlignment as 'left' | 'center' | 'right' }}>
                          {socialLinksContainer}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      );  
    }
    
    // Si la disposition est horizontale, on utilise la nouvelle mise en page
    // Déterminer si nous avons des images à afficher (photo de profil et/ou logo)
    const hasProfilePhoto = !!profilePhotoUrl;
    const hasLogo = !!(logoUrl && displayLogo);
    const hasAnyImage = hasProfilePhoto || hasLogo;
    
    // Ajuster l'espacement en fonction de la présence d'images
    const effectiveSpacing = hasAnyImage ? effectiveHorizontalSpacing : Math.max(5, effectiveHorizontalSpacing / 2);
    
    return (
      <div style={baseStyle}>
        <table cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            <tr>
              {/* Colonne de gauche: photos et informations personnelles */}
              <td style={{ verticalAlign: 'top', width: 'auto', paddingRight: `${effectiveSpacing}px` }}>
                {/* Photos alignées horizontalement */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: hasAnyImage ? `${effectiveVerticalSpacing}px` : '0' }}>
                  {profilePhotoUrl && (
                    <div style={{ width: `${photoSize}px`, height: `${photoSize}px` }}>
                      <img 
                        src={getFullProfilePhotoUrl(profilePhotoUrl)} 
                        alt="Photo de profil" 
                        style={{ width: `100%`, height: `100%`, borderRadius: '50%', objectFit: 'cover' }} 
                        onError={(e) => {
                          console.error('Error loading profile photo:', e);
                        }}
                      />
                    </div>
                  )}
                  {logoUrl && displayLogo && (
                    <div>
                      <img 
                        src={getFullLogoUrl(logoUrl)} 
                        alt="Logo" 
                        style={{ maxWidth: '100px' }} 
                        onError={(e) => {
                          console.error('Error loading logo image:', e);
                        }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Nom, poste et entreprise en dessous des photos */}
                <div style={{ marginBottom: `${effectiveVerticalSpacing}px` }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{fullName || 'Votre Nom'}</div>
                  <div style={{ color: primaryColor || '#0066cc' }}>{jobTitle || 'Votre Poste'}</div>
                  {companyName && <div>{companyName}</div>}
                </div>
              </td>
              
              {/* Colonne de droite: informations de contact */}
              <td style={{ verticalAlign: 'top', width: 'auto', paddingLeft: `${effectiveSpacing}px`, borderLeft: `1px solid ${secondaryColor || '#f5f5f5'}` }}>
                {email && <div style={{ marginBottom: '5px' }}>Email: <a href={`mailto:${email}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }}>{email}</a></div>}
                {phone && <div style={{ marginBottom: '5px' }}>Tél: {phone}</div>}
                {mobilePhone && <div style={{ marginBottom: '5px' }}>Mobile: {mobilePhone}</div>}
                {website && <div style={{ marginBottom: '5px' }}>Site web: <a href={website.startsWith('http') ? website : `https://${website}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{website}</a></div>}
                {address && <div style={{ marginBottom: '5px' }}>Adresse: {address}</div>}
                
                {/* Réseaux sociaux à droite (uniquement si la position est 'right') */}
                {socialLinks && Object.values(socialLinks).some(link => link) && socialPosition === 'right' && (
                  <div style={{ 
                    marginTop: '10px',
                    paddingTop: '10px', 
                    borderTop: `1px solid ${secondaryColor || '#f5f5f5'}`,
                  }}>
                    {socialLinks.linkedin && (
                      <a href={socialLinks.linkedin} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
                        {displayMode === 'icons' ? (
                          <span style={{
                            fontWeight: 'bold',
                            display: 'inline-block',
                            width: '24px',
                            height: '24px',
                            textAlign: 'center',
                            lineHeight: '24px',
                            backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                            color: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc'),
                            borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0')
                          }}>in</span>
                        ) : 'LinkedIn'}
                      </a>
                    )}
                    {socialLinks.twitter && (
                      <a href={socialLinks.twitter} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
                        {displayMode === 'icons' ? (
                          <span style={{
                            fontWeight: 'bold',
                            display: 'inline-block',
                            width: '24px',
                            height: '24px',
                            textAlign: 'center',
                            lineHeight: '24px',
                            backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                            color: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc'),
                            borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0')
                          }}>X</span>
                        ) : 'X'}
                      </a>
                    )}
                    {socialLinks.facebook && (
                      <a href={socialLinks.facebook} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
                        {displayMode === 'icons' ? (
                          <span style={{
                            fontWeight: 'bold',
                            display: 'inline-block',
                            width: '24px',
                            height: '24px',
                            textAlign: 'center',
                            lineHeight: '24px',
                            backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                            color: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc'),
                            borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0')
                          }}>fb</span>
                        ) : 'Facebook'}
                      </a>
                    )}
                    {socialLinks.instagram && (
                      <a href={socialLinks.instagram} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
                        {displayMode === 'icons' ? (
                          <span style={{
                            fontWeight: 'bold',
                            display: 'inline-block',
                            width: '24px',
                            height: '24px',
                            textAlign: 'center',
                            lineHeight: '24px',
                            backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                            color: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc'),
                            borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0')
                          }}>ig</span>
                        ) : 'Instagram'}
                      </a>
                    )}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* Réseaux sociaux en bas (uniquement si la position est 'bottom') */}
        {socialLinks && Object.values(socialLinks).some(link => link) && socialPosition === 'bottom' && (
          <div style={{ 
            marginTop: '15px', 
            paddingTop: '10px', 
            borderTop: `1px solid ${secondaryColor || '#f5f5f5'}`,
            textAlign: 'left'
          }}>
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
                {displayMode === 'icons' ? (
                  <span style={{
                    fontWeight: 'bold',
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    textAlign: 'center',
                    lineHeight: '24px',
                    backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                    color: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc'),
                    borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0')
                  }}>in</span>
                ) : 'LinkedIn'}
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
                {displayMode === 'icons' ? (
                  <span style={{
                    fontWeight: 'bold',
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    textAlign: 'center',
                    lineHeight: '24px',
                    backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                    color: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc'),
                    borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0')
                  }}>X</span>
                ) : 'X'}
              </a>
            )}
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
                {displayMode === 'icons' ? (
                  <span style={{
                    fontWeight: 'bold',
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    textAlign: 'center',
                    lineHeight: '24px',
                    backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                    color: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc'),
                    borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0')
                  }}>fb</span>
                ) : 'Facebook'}
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} style={{ color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
                {displayMode === 'icons' ? (
                  <span style={{
                    fontWeight: 'bold',
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    textAlign: 'center',
                    lineHeight: '24px',
                    backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                    color: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc'),
                    borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0')
                  }}>ig</span>
                ) : 'Instagram'}
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  // Template Professionnel
  const renderProfessionalTemplate = () => {
    // Si la disposition est horizontale, on utilise une table avec une seule ligne et deux colonnes
    // Si la disposition est verticale, on utilise une table avec deux lignes et une colonne
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#333', borderLeft: `4px solid ${primaryColor || '#0066cc'}`, paddingLeft: '15px' }}>
        <table cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            {signatureLayout === 'horizontal' ? (
              <tr>
                <td style={{ verticalAlign: 'top', width: '150px', paddingRight: '20px' }}>
                {profilePhotoUrl && (
                  <div style={{ marginBottom: '15px' }}>
                    <img 
                      src={getFullProfilePhotoUrl(profilePhotoUrl)} 
                      alt="Photo de profil" 
                      style={{ width: `${photoSize}px`, height: `${photoSize}px`, borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} 
                      onError={(e) => {
                        console.error('Error loading profile photo:', e);
                      }}
                    />
                  </div>
                )}
                {logoUrl && displayLogo && (
                  <div style={{ marginBottom: '15px' }}>
                    <img 
                      src={getFullLogoUrl(logoUrl)} 
                      alt="Logo" 
                      style={{ maxWidth: '150px' }} 
                      onError={(e) => {
                        console.error('Error loading logo image (Professional):', e);
                        console.log('Failed URL:', e.currentTarget.src);
                      }}
                    />
                  </div>
                )}
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{fullName || 'Votre Nom'}</div>
                <div style={{ color: primaryColor || '#0066cc', marginBottom: '5px' }}>{jobTitle || 'Votre Poste'}</div>
                {companyName && <div style={{ marginBottom: '10px' }}>{companyName}</div>}
              </td>
              <td style={{ verticalAlign: 'top', borderLeft: `1px solid ${secondaryColor || '#f5f5f5'}`, paddingLeft: '20px' }}>
                {email && <div style={{ marginBottom: '5px' }}>Email: <a href={`mailto:${email}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }}>{email}</a></div>}
                {phone && <div style={{ marginBottom: '5px' }}>Tél: {phone}</div>}
                {mobilePhone && <div style={{ marginBottom: '5px' }}>Mobile: {mobilePhone}</div>}
                {website && <div style={{ marginBottom: '5px' }}>Site web: <a href={website.startsWith('http') ? website : `https://${website}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{website}</a></div>}
                {address && <div style={{ marginBottom: '5px' }}>Adresse: {address}</div>}
                
                {socialLinks && Object.values(socialLinks).some(link => link) && (
                  <div style={{ marginTop: '10px' }}>
                    {socialLinks.linkedin && (
                      <a href={socialLinks.linkedin} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    )}
                    {socialLinks.twitter && (
                      <a href={socialLinks.twitter} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">X</a>
                    )}
                    {socialLinks.facebook && (
                      <a href={socialLinks.facebook} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">Facebook</a>
                    )}
                    {socialLinks.instagram && (
                      <a href={socialLinks.instagram} style={{ color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">Instagram</a>
                    )}
                  </div>
                )}
              </td>
            </tr>
            ) : (
            <>
              <tr>
                <td style={{ verticalAlign: 'top', paddingBottom: '20px' }}>
                  {profilePhotoUrl && (
                    <div style={{ marginBottom: '15px' }}>
                      <img 
                        src={getFullProfilePhotoUrl(profilePhotoUrl)} 
                        alt="Photo de profil" 
                        style={{ width: `${photoSize}px`, height: `${photoSize}px`, borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} 
                        onError={(e) => {
                          console.error('Error loading profile photo:', e);
                        }}
                      />
                    </div>
                  )}
                  {logoUrl && displayLogo && (
                    <div style={{ marginBottom: '15px' }}>
                      <img 
                        src={getFullLogoUrl(logoUrl)} 
                        alt="Logo" 
                        style={{ maxWidth: '150px' }} 
                        onError={(e) => {
                          console.error('Error loading logo image (Professional):', e);
                          console.log('Failed URL:', e.currentTarget.src);
                        }}
                      />
                    </div>
                  )}
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{fullName || 'Votre Nom'}</div>
                  <div style={{ color: primaryColor || '#0066cc', marginBottom: '5px' }}>{jobTitle || 'Votre Poste'}</div>
                  {companyName && <div style={{ marginBottom: '10px' }}>{companyName}</div>}
                </td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', borderTop: `1px solid ${secondaryColor || '#f5f5f5'}`, paddingTop: '20px' }}>
                  {email && <div style={{ marginBottom: '5px' }}>Email: <a href={`mailto:${email}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }}>{email}</a></div>}
                  {phone && <div style={{ marginBottom: '5px' }}>Tél: {phone}</div>}
                  {mobilePhone && <div style={{ marginBottom: '5px' }}>Mobile: {mobilePhone}</div>}
                  {website && <div style={{ marginBottom: '5px' }}>Site web: <a href={website.startsWith('http') ? website : `https://${website}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{website}</a></div>}
                  {address && <div style={{ marginBottom: '5px' }}>Adresse: {address}</div>}
                  
                  {socialLinks && Object.values(socialLinks).some(link => link) && (
                    <div style={{ marginTop: '10px' }}>
                      {socialLinks.linkedin && (
                        <a href={socialLinks.linkedin} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                      )}
                      {socialLinks.twitter && (
                        <a href={socialLinks.twitter} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">X</a>
                      )}
                      {socialLinks.facebook && (
                        <a href={socialLinks.facebook} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">Facebook</a>
                      )}
                      {socialLinks.instagram && (
                        <a href={socialLinks.instagram} style={{ color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">Instagram</a>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            </>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Template Moderne
  const renderModernTemplate = () => {
    return (
      <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px', color: '#333', backgroundColor: secondaryColor || '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: signatureLayout === 'horizontal' ? 'row' : 'column', 
          alignItems: signatureLayout === 'horizontal' ? 'center' : 'flex-start', 
          marginBottom: '15px' 
        }}>
          {profilePhotoUrl && (
            <div style={{ marginRight: '15px' }}>
              <img 
                src={getFullProfilePhotoUrl(profilePhotoUrl)} 
                alt="Photo de profil" 
                style={{ width: `${photoSize}px`, height: `${photoSize}px`, borderRadius: '50%', objectFit: 'cover' }} 
                onError={(e) => {
                  console.error('Error loading profile photo:', e);
                }}
              />
            </div>
          )}
          {logoUrl && displayLogo && (
            <div style={{ marginRight: '15px' }}>
              <img 
                src={getFullLogoUrl(logoUrl)} 
                alt="Logo" 
                style={{ maxWidth: '80px' }} 
                onError={(e) => {
                  console.error('Error loading logo image (Modern):', e);
                  console.log('Failed URL:', e.currentTarget.src);
                }}
              />
            </div>
          )}
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '18px', color: primaryColor || '#0066cc' }}>{fullName || 'Votre Nom'}</div>
            <div style={{ fontSize: '15px' }}>{jobTitle || 'Votre Poste'}</div>
            {companyName && <div>{companyName}</div>}
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
          {email && (
            <div style={{ backgroundColor: 'white', padding: '8px 12px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <a href={`mailto:${email}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }}>{email}</a>
            </div>
          )}
          {phone && (
            <div style={{ backgroundColor: 'white', padding: '8px 12px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {phone}
            </div>
          )}
          {mobilePhone && (
            <div style={{ backgroundColor: 'white', padding: '8px 12px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {mobilePhone}
            </div>
          )}
          {website && (
            <div style={{ backgroundColor: 'white', padding: '8px 12px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <a href={website.startsWith('http') ? website : `https://${website}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{website}</a>
            </div>
          )}
        </div>
        
        {address && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Adresse:</div>
            <div>{address}</div>
          </div>
        )}
        
        {socialLinks && Object.values(socialLinks).some(link => link) && (
          <div style={{ display: 'flex', gap: '10px' }}>
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} style={{ color: primaryColor || '#0066cc', backgroundColor: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold' }} target="_blank" rel="noopener noreferrer">Li</a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} style={{ color: primaryColor || '#0066cc', backgroundColor: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold' }} target="_blank" rel="noopener noreferrer">X</a>
            )}
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} style={{ color: primaryColor || '#0066cc', backgroundColor: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold' }} target="_blank" rel="noopener noreferrer">Fb</a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} style={{ color: primaryColor || '#0066cc', backgroundColor: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold' }} target="_blank" rel="noopener noreferrer">Ig</a>
            )}
          </div>
        )}
      </div>
    );
  };

  // Template Créatif
  const renderCreativeTemplate = () => {
    return (
      <div style={{ fontFamily: 'Verdana, Geneva, sans-serif', fontSize: '14px', color: '#333', position: 'relative', padding: '30px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        {/* Fond avec dégradé */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: `linear-gradient(135deg, ${primaryColor || '#0066cc'} 0%, ${secondaryColor || '#f5f5f5'} 100%)` }}></div>
        
        {/* Contenu */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Photo de profil, Logo et nom */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
            {profilePhotoUrl && (
              <div style={{ marginRight: '15px', marginBottom: '10px' }}>
                <img 
                  src={getFullProfilePhotoUrl(profilePhotoUrl)} 
                  alt="Photo de profil" 
                  style={{ width: `${photoSize}px`, height: `${photoSize}px`, borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} 
                  onError={(e) => {
                    console.error('Error loading profile photo:', e);
                  }}
                />
              </div>
            )}
            {logoUrl && displayLogo && (
              <div style={{ marginRight: '15px', background: 'white', borderRadius: '8px', padding: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '10px' }}>
                <img 
                  src={getFullLogoUrl(logoUrl)} 
                  alt="Logo" 
                  style={{ maxWidth: '80px', maxHeight: '80px' }} 
                  onError={(e) => {
                    console.error('Error loading logo image (Creative):', e);
                  }}
                />
              </div>
            )}
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '20px', color: primaryColor || '#0066cc' }}>{fullName || 'Votre Nom'}</div>
              <div style={{ fontSize: '16px', marginBottom: '5px' }}>{jobTitle || 'Votre Poste'}</div>
              {companyName && <div style={{ fontStyle: 'italic' }}>{companyName}</div>}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
            {email && (
              <a href={`mailto:${email}`} style={{ color: 'white', backgroundColor: primaryColor || '#0066cc', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', display: 'inline-block', marginBottom: '5px' }}>{email}</a>
            )}
            {phone && (
              <div style={{ color: 'white', backgroundColor: primaryColor || '#0066cc', padding: '8px 15px', borderRadius: '5px', display: 'inline-block', marginBottom: '5px' }}>{phone}</div>
            )}
            {website && (
              <a href={website.startsWith('http') ? website : `https://${website}`} style={{ color: 'white', backgroundColor: primaryColor || '#0066cc', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', display: 'inline-block', marginBottom: '5px' }} target="_blank" rel="noopener noreferrer">{website}</a>
            )}
          </div>
          
          {address && (
            <div style={{ textAlign: 'center', marginBottom: '15px', padding: '10px', border: `1px dashed ${primaryColor || '#0066cc'}`, borderRadius: '5px' }}>
              {address}
            </div>
          )}
          
          {socialLinks && Object.values(socialLinks).some(link => link) && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} style={{ color: 'white', backgroundColor: primaryColor || '#0066cc', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', margin: '2px' }} target="_blank" rel="noopener noreferrer">Li</a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} style={{ color: 'white', backgroundColor: primaryColor || '#0066cc', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', margin: '2px' }} target="_blank" rel="noopener noreferrer">X</a>
              )}
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} style={{ color: 'white', backgroundColor: primaryColor || '#0066cc', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', margin: '2px' }} target="_blank" rel="noopener noreferrer">Fb</a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} style={{ color: 'white', backgroundColor: primaryColor || '#0066cc', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', margin: '2px' }} target="_blank" rel="noopener noreferrer">Ig</a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Fonction pour copier la signature dans le presse-papiers avec support responsive
  const copySignatureToClipboard = () => {
    if (signatureRef.current) {
      // Créer un élément temporaire pour contenir le HTML de la signature
      const tempElem = document.createElement('div');
      tempElem.innerHTML = signatureRef.current.innerHTML;
      
      // Nettoyer le HTML en supprimant les attributs de style React
      const elementsWithDataReactAttr = tempElem.querySelectorAll('[data-reactroot], [data-react-checksum]');
      elementsWithDataReactAttr.forEach(el => {
        el.removeAttribute('data-reactroot');
        el.removeAttribute('data-react-checksum');
      });
      
      // Ajouter des styles responsives
      const responsiveStyles = `
        <style type="text/css">
          @media screen and (max-width: 600px) {
            table, tr, td, div, p, a, span, img {
              max-width: 100% !important;
              width: auto !important;
              height: auto !important;
              min-width: 0 !important;
            }
            
            table {
              width: 100% !important;
            }
            
            div[style*="display: flex"] {
              display: block !important;
              text-align: center !important;
            }
            
            div[style*="display: flex"] > div,
            div[style*="display: flex"] > a {
              display: inline-block !important;
              margin: 5px !important;
            }
            
            img {
              max-width: 100% !important;
              height: auto !important;
            }
            
            div[style*="borderLeft"],
            td[style*="borderLeft"] {
              border-left: none !important;
              padding-left: 0 !important;
              margin-top: 10px !important;
            }
            
            div[style*="marginRight"],
            td[style*="paddingRight"] {
              margin-right: 0 !important;
              padding-right: 0 !important;
            }
          }
        </style>
      `;
      
      // Créer un blob avec le HTML nettoyé et les styles responsives
      const htmlContent = responsiveStyles + tempElem.innerHTML;
      
      // Utiliser l'API Clipboard pour copier le HTML
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([htmlContent], { type: 'text/html' }),
        'text/plain': new Blob([tempElem.innerText], { type: 'text/plain' })
      });
      
      navigator.clipboard.write([clipboardItem])
        .then(() => {
          // Afficher un message de confirmation
          setCopySuccess(true);
          // Masquer le message après 3 secondes
          setTimeout(() => setCopySuccess(false), 3000);
        })
        .catch(err => {
          console.error('Erreur lors de la copie de la signature :', err);
          alert('Impossible de copier la signature. Veuillez réessayer.');
        });
    }
  };
  
  return (
    <div className="bg-white overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-medium">Aperçu de la signature</h2>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={copySignatureToClipboard}
            variant="primary"
            size="sm"
            className="flex items-center gap-2 px-4 py-2"
            title="Copier la signature"
          >
            <ClipboardDocumentIcon className="h-4 w-4" />
            Copier la signature
          </Button>
          
          {/* Message de confirmation */}
          {copySuccess && (
            <span className="text-green-600 text-sm font-medium">
              Signature copiée !
            </span>
          )}
        </div>
      </div>
      <div className="flex-grow bg-gray-50 p-8 overflow-auto">
        <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-md">
          <div className="mb-6 pb-6 border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Exemple d'email</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="mb-4">Bonjour,</p>
              <p className="mb-4">Je vous remercie pour votre message. Nous avons bien pris en compte votre demande et nous reviendrons vers vous dans les plus brefs délais.</p>
              <p className="mb-4">Cordialement,</p>
              <div ref={signatureRef} className="mt-6 border-t pt-4 border-gray-200">
                {renderSignatureTemplate()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
