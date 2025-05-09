import React, { useRef, useState } from 'react';
import { EmailSignature } from '../../types';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../../components/ui';

interface EmailSignaturePreviewProps {
  signature: Partial<EmailSignature>;
}

export const EmailSignaturePreview: React.FC<EmailSignaturePreviewProps> = ({ signature }) => {
  // État pour afficher un message de confirmation après la copie
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Référence au conteneur de la signature
  const signatureRef = useRef<HTMLDivElement>(null);
  // URL de base de l'API pour les images
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
  // Déstructuration des propriétés de la signature
  const {
    fullName,
    jobTitle,
    email,
    phone,
    mobilePhone,
    website,
    address,
    companyName,
    primaryColor,
    secondaryColor,
    logoUrl,
    showLogo,
    socialLinks,
    profilePhotoUrl,
    profilePhotoBase64,
    profilePhotoSize,
    layout,
    horizontalSpacing,
    verticalSpacing,
    verticalAlignment,
    imagesLayout,
    fontFamily,
    fontSize,
    socialLinksDisplayMode,
    socialLinksPosition,
    socialLinksIconStyle
  } = signature;

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

  // Fonction pour générer les styles CSS pour les réseaux sociaux
  const getSocialIconStyle = () => {
    const baseStyle = {
      display: 'inline-block',
      margin: '0 5px',
      textDecoration: 'none'
    };

    switch (socialLinksIconStyle) {
      case 'rounded':
        return {
          ...baseStyle,
          padding: '5px',
          borderRadius: '5px',
          backgroundColor: primaryColor,
          color: '#ffffff'
        };
      case 'circle':
        return {
          ...baseStyle,
          padding: '5px',
          borderRadius: '50%',
          backgroundColor: primaryColor,
          color: '#ffffff',
          width: '24px',
          height: '24px',
          textAlign: 'center' as const
        };
      default:
        return {
          ...baseStyle,
          color: primaryColor
        };
    }
  };

  // Définir explicitement showLogo avec une valeur par défaut à true
  const displayLogo = showLogo !== false; // Si showLogo est undefined ou null, on affiche le logo
  
  // Définir la taille de la photo de profil avec une valeur par défaut
  const photoSize = profilePhotoSize || 80; // Taille par défaut: 80px
  
  // Définir la police de caractères avec une valeur par défaut
  const signatureFontFamily = fontFamily || 'Arial, sans-serif'; // Police par défaut: Arial
  
  // Définir la taille de police avec une valeur par défaut
  const signatureFontSize = fontSize || 14; // Taille par défaut: 14px
  
  // Style de base pour la signature
  const baseStyle = {
    fontFamily: signatureFontFamily,
    fontSize: `${signatureFontSize}px`,
    color: '#333'
  };
  
  // Définir le mode d'affichage des réseaux sociaux avec une valeur par défaut
  // Le mode d'affichage des réseaux sociaux (texte ou icônes)
  const displayMode = socialLinksDisplayMode || 'text'; // Mode par défaut: texte
  // Utiliser cette variable dans le rendu des liens sociaux
  
  // Définir la position des réseaux sociaux avec une valeur par défaut
  const socialPosition = socialLinksPosition || 'bottom'; // Position par défaut: en bas
  
  // Définir l'alignement du texte en mode vertical avec une valeur par défaut
  const textAlignment = verticalAlignment || 'left'; // Alignement par défaut: gauche
  
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
    maxWidth: '600px'
  };

  // Styles pour le conteneur principal
  const containerStyle = {
    display: 'flex',
    flexDirection: signatureLayout === 'horizontal' ? 'row' as const : 'column' as const,
    alignItems: signatureLayout === 'horizontal' ? 'center' : 
                textAlignment === 'center' ? 'center' : 
                textAlignment === 'right' ? 'flex-end' : 'flex-start',
    gap: signatureLayout === 'horizontal' ? `${effectiveHorizontalSpacing}px` : `${effectiveVerticalSpacing}px`
  };

  // Styles pour les informations principales
  const infoStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: signatureLayout === 'horizontal' ? 'flex-start' : 
                textAlignment === 'center' ? 'center' : 
                textAlignment === 'right' ? 'flex-end' : 'flex-start',
    gap: '5px'
  };

  // Styles pour le nom complet
  const nameStyle = {
    color: primaryColor,
    fontWeight: 'bold',
    margin: '0',
    fontSize: `${(fontSize || 12) + 2}px`
  };

  // Styles pour le titre du poste
  const jobTitleStyle = {
    color: '#666666',
    margin: '0',
    fontStyle: 'italic'
  };

  // Styles pour les informations de contact
  const contactStyle = {
    margin: '5px 0',
    color: '#666666'
  };

  // Styles pour les liens
  const linkStyle = {
    color: primaryColor,
    textDecoration: 'none'
  };

  // Styles pour le séparateur
  const separatorStyle = {
    width: signatureLayout === 'horizontal' ? '1px' : '100%',
    height: signatureLayout === 'horizontal' ? '100%' : '1px',
    backgroundColor: secondaryColor || '#f5f5f5',
    margin: signatureLayout === 'horizontal' ? `0 ${effectiveHorizontalSpacing / 2}px` : `${effectiveVerticalSpacing / 2}px 0`
  };

  // Styles pour les images (logo et photo de profil)
  const imagesContainerStyle = {
    display: 'flex',
    flexDirection: imageLayout === 'horizontal' ? 'row' as const : 'column' as const,
    alignItems: 'center',
    gap: '10px'
  };

  // Styles pour les réseaux sociaux
  const socialLinksContainerStyle = {
    display: 'flex',
    flexDirection: socialPosition === 'bottom' ? 'row' as const : 'column' as const,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  const profilePhotoSource = profilePhotoBase64 || profilePhotoUrl;

  // Rendu des réseaux sociaux
  const renderSocialLinks = () => {
    if (!hasSocialLinks) return null;

    return (
      <div style={socialLinksContainerStyle}>
        {socialLinks?.linkedin && (
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={getSocialIconStyle()}>
            {displayMode === 'icons' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            ) : 'LinkedIn'}
          </a>
        )}
        {socialLinks?.twitter && (
          <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={getSocialIconStyle()}>
            {displayMode === 'icons' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            ) : 'Twitter'}
          </a>
        )}
        {socialLinks?.facebook && (
          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" style={getSocialIconStyle()}>
            {displayMode === 'icons' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            ) : 'Facebook'}
          </a>
        )}
        {socialLinks?.instagram && (
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={getSocialIconStyle()}>
            {displayMode === 'icons' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            ) : 'Instagram'}
          </a>
        )}
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
    <div className="email-signature-preview">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Prévisualisation de la signature</h2>
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Aperçu de la signature</h3>
            <Button 
              onClick={copySignatureToClipboard} 
              size="sm" 
              variant="primary"
              className="flex items-center gap-1"
            >
              <ClipboardDocumentIcon className="h-4 w-4" />
              {copySuccess ? 'Copié !' : 'Copier la signature'}
            </Button>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <div className="mb-6">
              <p className="mb-2">Exemple d'email</p>
              <div className="text-gray-700 mb-4">
                <p>Bonjour,</p>
                <p className="my-2">Je vous remercie pour votre message. Nous avons bien pris en compte votre demande et nous reviendrons vers vous dans les plus brefs délais.</p>
                <p>Cordialement,</p>
              </div>
            </div>
            
            <div ref={signatureRef} style={signatureStyle} className="border-t pt-4">
              <div style={containerStyle as React.CSSProperties}>
                {(logoUrl || profilePhotoSource) && (
                  <div style={imagesContainerStyle as React.CSSProperties}>
                    {logoUrl && displayLogo && (
                      <img 
                        src={getFullLogoUrl(logoUrl)} 
                        alt="Logo" 
                        style={{ maxWidth: '120px', maxHeight: '60px' }} 
                      />
                    )}
                    {profilePhotoSource && (
                      <img 
                        src={getFullProfilePhotoUrl(profilePhotoSource)} 
                        alt="Profile" 
                        style={{ 
                          width: `${photoSize}px`, 
                          height: `${photoSize}px`, 
                          borderRadius: '50%', 
                          objectFit: 'cover' as const
                        }} 
                      />
                    )}
                  </div>
                )}
                
                {signatureLayout === 'horizontal' && <div style={separatorStyle}></div>}
                
                <div style={infoStyle as React.CSSProperties}>
                  {fullName && <h3 style={nameStyle}>{fullName || 'Votre Nom'}</h3>}
                  {jobTitle && <p style={jobTitleStyle}>{jobTitle || 'Votre Poste'}</p>}
                  
                  <div style={contactStyle}>
                    {email && (
                      <div>
                        <a href={`mailto:${email}`} style={linkStyle}>{email}</a>
                      </div>
                    )}
                    {phone && (
                      <div>
                        <a href={`tel:${phone}`} style={linkStyle}>{phone}</a>
                      </div>
                    )}
                    {mobilePhone && (
                      <div>
                        <a href={`tel:${mobilePhone}`} style={linkStyle}>{mobilePhone}</a>
                      </div>
                    )}
                    {website && (
                      <div>
                        <a href={website} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                          {website.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </div>
                    )}
                    {address && (
                      <div style={{ whiteSpace: 'pre-line' }}>
                        {address}
                      </div>
                    )}
                    {companyName && (
                      <div>
                        <strong>{companyName}</strong>
                      </div>
                    )}
                  </div>
                  
                  {socialPosition === 'bottom' && renderSocialLinks()}
                </div>
                
                {socialPosition === 'right' && renderSocialLinks()}
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Cet aperçu montre comment votre signature apparaîtra dans vos emails.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
