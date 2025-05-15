import React from 'react';
import { getFullProfilePhotoUrl } from './utils';
import { DEFAULT_PROFILE_PHOTO_SIZE } from '../../constants/images';
import { Profile } from 'iconsax-react'; // Import de l'icône Profile

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
  // Styles pour le conteneur d'image
  const imagesContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: imagesLayout === 'stacked' ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  };

  // Si aucune photo de profil n'est fournie, on affiche quand même le conteneur
  // pour l'image par défaut
  if (!profilePhotoSource) {
    return (
      <div style={imagesContainerStyle}>
        <div style={{ 
          width: `${DEFAULT_PROFILE_PHOTO_SIZE}px`, 
          height: `${DEFAULT_PROFILE_PHOTO_SIZE}px`, 
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#f0eeff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Profile 
            size={DEFAULT_PROFILE_PHOTO_SIZE * 0.6}
            color="#5b50ff"
            variant="Bold"
            style={{ 
              opacity: 0.9
            }}
          />
        </div>
        {/* Logo d'entreprise supprimé */}
      </div>
    );
  }

  console.log(photoSize, 'photoSize');

  return (
    <div style={imagesContainerStyle}>
      {/* Conteneur de la photo de profil */}
      <div style={{ 
        width: `${Math.min(photoSize, 60)}px`, 
        height: `${Math.min(photoSize, 60)}px`, 
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
          <Profile 
            size={Math.min(photoSize, 60) * 0.8}
            color="#5b50ff"
            variant="Bold"
            style={{ 
              opacity: 0.9
            }}
          />
        )}
      </div>
    </div>
  );
};
