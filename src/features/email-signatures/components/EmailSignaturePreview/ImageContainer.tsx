import React from 'react';
import { getFullProfilePhotoUrl } from './utils';

interface ImageContainerProps {
  profilePhotoSource?: string | null;
  logoUrl?: string;
  photoSize: number;
  imagesLayout: 'stacked' | 'side-by-side';
  showLogo?: boolean;
  signatureLayout?: 'horizontal' | 'vertical';
}

export const ImageContainer: React.FC<ImageContainerProps> = ({
  profilePhotoSource,
  logoUrl,
  photoSize,
  imagesLayout,
  showLogo = true,
  signatureLayout = 'horizontal'
}) => {
  // Styles pour les images (logo et photo de profil)
  const imagesContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: imagesLayout === 'stacked' ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '10px'
  };

  // Styles pour le logo d'entreprise
  const logoContainerStyle: React.CSSProperties = {
    width: `${photoSize * 0.8}px`,
    height: `${photoSize * 0.5}px`,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px'
  };
  
  const logoImageStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  };

  // Rendu du logo (dans les deux modes si showLogo est vrai)
  const renderLogo = () => {
    if (showLogo && logoUrl) {
      return (
        <div style={{ 
          width: `${photoSize * 0.8}px`, 
          height: `${photoSize * 0.5}px`, 
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '10px',
          border: '1px solid #f0eeff',
          borderRadius: '4px',
          padding: '4px'
        }}>
          <img 
            src={logoUrl} 
            alt="Logo" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain'
            }} 
          />
        </div>
      );
    }
    return null;
  };

  // Si aucune photo de profil n'est fournie, on affiche quand même le conteneur
  // pour l'image par défaut
  if (!profilePhotoSource) {
    return (
      <div style={imagesContainerStyle}>
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
            src="/images/logo_newbi/SVG/Logo_Texte_Purple.svg" 
            alt="Newbi" 
            style={{ 
              width: '80%', 
              height: '80%', 
              objectFit: 'contain'
            }} 
          />
        </div>
        {renderLogo()}
      </div>
    );
  }

  return (
    <div style={imagesContainerStyle}>
      {/* Conteneur de la photo de profil */}
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
        {profilePhotoSource ? (
          <img 
            src={getFullProfilePhotoUrl(profilePhotoSource)} 
            alt="Profile" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover'
            }} 
          />
        ) : (
          <img 
            src="/images/logo_newbi/SVG/Logo_Texte_Purple.svg" 
            alt="Newbi" 
            style={{ 
              width: '80%', 
              height: '80%', 
              objectFit: 'contain'
            }} 
          />
        )}
      </div>
      
      {/* Rendu du logo */}
      {renderLogo()}
    </div>
  );
};
