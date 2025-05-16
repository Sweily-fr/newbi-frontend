import React from 'react';
import { getFullProfilePhotoUrl } from './utils';
import { DEFAULT_PROFILE_PHOTO_SIZE } from '../../constants/images';
import { Profile } from 'iconsax-react'; // Import de l'icône Profile

interface ImageContainerProps {
  profilePhotoSource?: string | null;
  photoSize?: number;
  imagesLayout: 'stacked' | 'side-by-side';
  profilePhotoToDelete?: boolean; // Ajouter cette propriété pour détecter explicitement la suppression
}

export const ImageContainer: React.FC<ImageContainerProps> = ({
  profilePhotoSource,
  photoSize,
  imagesLayout,
  profilePhotoToDelete
}) => {
  // Styles pour le conteneur d'image
  const imagesContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: imagesLayout === 'stacked' ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  };

  // Calculer la taille effective à utiliser pour l'affichage
  // Utiliser une vérification explicite pour éviter les problèmes avec l'opérateur ||
  const effectiveSize = photoSize !== undefined && photoSize !== null ? photoSize : DEFAULT_PROFILE_PHOTO_SIZE;
  const iconSize = effectiveSize * 0.6; // Taille de l'icône à 60% du conteneur
  
  // Log pour déboguer la taille de l'image
  console.log('[DEBUG] ImageContainer - Taille de l\'image:', photoSize);

  // Nous affichons l'icône Profile par défaut si aucune image n'est fournie
  
  // Afficher l'icône Profile par défaut
  const renderProfileIcon = () => (
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
        <Profile 
          size={iconSize}
          color="#5b50ff"
          variant="Bold"
          style={{ opacity: 0.9 }}
        />
      </div>
    </div>
  );

  // Logique simplifiée pour déterminer si on doit afficher l'icône de profil par défaut
  // 1. Si profilePhotoToDelete est true, toujours afficher l'icône par défaut
  // 2. Si profilePhotoSource est null/undefined/vide, afficher l'icône par défaut
  if (profilePhotoToDelete === true || !profilePhotoSource || profilePhotoSource === '') {
    return renderProfileIcon();
  }

  // Si nous arrivons ici, c'est que profilePhotoSource est défini et non vide
  // Nous essayons d'afficher l'image de profil
  try {
    return (
      <div style={imagesContainerStyle}>
        {/* Conteneur de la photo de profil */}
        <div style={{ 
          width: `${photoSize}px`, 
          height: `${photoSize}px`, 
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#f0eeff', // Couleur de fond légère Newbi (conforme à la charte graphique)
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Essayer d'afficher l'image si profilePhotoSource est valide */}
          <img 
            src={getFullProfilePhotoUrl(profilePhotoSource)} 
            alt="Profile" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover'
            }} 
            onError={(e) => {
              console.log('Erreur de chargement de l\'image, affichage de l\'icône par défaut');
              // En cas d'erreur de chargement de l'image, on remplace par l'icône par défaut
              e.currentTarget.style.display = 'none';
              // Nous ne pouvons pas rendre directement l'icône ici, mais nous pouvons masquer l'image
            }}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erreur lors de l\'affichage de l\'image:', error);
    // En cas d'erreur, afficher l'icône par défaut
    return renderProfileIcon();
  }
};
