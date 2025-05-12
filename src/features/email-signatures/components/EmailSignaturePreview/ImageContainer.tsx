import React from 'react';
import { getFullProfilePhotoUrl } from './utils';

interface ImageContainerProps {
  profilePhotoSource?: string | null;
  photoSize: number;
  imagesLayout: 'stacked' | 'side-by-side';
}

export const ImageContainer: React.FC<ImageContainerProps> = ({
  profilePhotoSource,
  photoSize,
  imagesLayout
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

  // Si aucune photo de profil n'est fournie et qu'il n'y a pas de logo, on affiche quand même le conteneur
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
      </div>
    );
  }

  return (
    <div style={imagesContainerStyle}>
      {/* On n'affiche plus le logo séparé */}
      
      {/* Conteneur de la photo de profil - affiché avec une image par défaut si aucune photo n'est téléchargée */}
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
    </div>
  );
};
