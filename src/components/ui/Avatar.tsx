import React, { useState, useEffect } from 'react';
import { AvatarProps } from '../../types/ui';

/**
 * Composant Avatar pour afficher une image de profil ou des initiales
 * 
 * @param src - URL de l'image de l'avatar
 * @param alt - Texte alternatif pour l'accessibilité
 * @param size - Taille de l'avatar (xs, sm, md, lg, xl)
 * @param name - Nom d'utilisateur pour générer un avatar basé sur les initiales si aucune image n'est fournie
 * @param bgColor - Couleur de fond pour l'avatar généré
 * @param textColor - Couleur du texte pour l'avatar généré
 * @param hasRing - Si l'avatar doit avoir un anneau autour
 * @param ringColor - Couleur de l'anneau
 * @param className - Classes CSS supplémentaires
 * @param onClick - Fonction appelée lors du clic sur l'avatar
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  name,
  bgColor = '3B82F6', // bg-blue-500 en hexadécimal
  textColor = 'ffffff',
  hasRing = false,
  ringColor = 'white',
  className = '',
  onClick,
}) => {
  // État pour suivre si l'image a été chargée avec succès
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  // Réinitialiser les états quand src change
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [src]);

  // Déterminer la taille en fonction de la prop size
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };
  
  // Taille de police adaptée à la taille de l'avatar
  const fontSizeClasses = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };
  
  // Fonction pour rendre l'icône utilisateur par défaut
  const renderUserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full p-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
  
  // Générer les initiales à partir du nom
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };
  
  // Classes pour l'anneau
  const ringClasses = hasRing ? `ring-2 ring-${ringColor}` : '';
  
  // Classes pour le bouton si onClick est fourni
  const buttonClasses = onClick ? 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' : '';
  
  // Rendu conditionnel en fonction de si onClick est fourni ou non
  const renderAvatarContent = () => {
    // Afficher l'image seulement si src est défini et qu'il n'y a pas eu d'erreur de chargement
    if (src && !imageError) {
      // Cas 1: Photo de profil disponible
      return (
        <>
          <img
            className={`${sizeClasses[size]} rounded-full ${ringClasses} object-cover ${!imageLoaded ? 'hidden' : ''}`}
            src={src}
            alt={alt}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {!imageLoaded && name && (
            <div className={`${sizeClasses[size]} rounded-full ${ringClasses} bg-blue-500 text-white flex items-center justify-center overflow-hidden`}>
              <span className={`${fontSizeClasses[size]} font-medium`}>{getInitials(name)}</span>
            </div>
          )}
          {!imageLoaded && !name && (
            <div className={`${sizeClasses[size]} rounded-full ${ringClasses} bg-blue-500 text-white flex items-center justify-center overflow-hidden`}>
              {renderUserIcon()}
            </div>
          )}
        </>
      );
    } else if (name) {
      // Cas 2: Nom disponible pour générer des initiales
      const initials = getInitials(name);
      return (
        <div className={`${sizeClasses[size]} rounded-full ${ringClasses} bg-blue-500 text-white flex items-center justify-center overflow-hidden`}>
          <span className={`${fontSizeClasses[size]} font-medium`}>{initials}</span>
        </div>
      );
    } else {
      // Cas 3: Aucune photo ni nom disponible, afficher l'icône par défaut
      return (
        <div className={`${sizeClasses[size]} rounded-full ${ringClasses} bg-blue-500 text-white flex items-center justify-center overflow-hidden`}>
          {renderUserIcon()}
        </div>
      );
    }
  };

  if (onClick) {
    return (
      <button 
        className={`flex items-center rounded-full ${buttonClasses} ${className}`}
        onClick={onClick}
      >
        {renderAvatarContent()}
      </button>
    );
  }
  
  return renderAvatarContent();
};
