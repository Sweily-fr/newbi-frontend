import React, { useRef, useState, useEffect } from 'react';

export interface ImageUploaderProps {
  /**
   * URL de l'image existante
   */
  imageUrl?: string;
  /**
   * URL de base de l'API pour les images
   */
  apiBaseUrl?: string;
  /**
   * Image en prévisualisation (base64)
   */
  previewImage?: string | null;
  /**
   * Indique si une opération est en cours (upload, suppression)
   */
  isLoading?: boolean;
  /**
   * Message à afficher pendant le chargement
   */
  loadingMessage?: string;
  /**
   * Fonction appelée lors de la sélection d'un fichier
   */
  onFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Fonction appelée lors de la suppression de l'image
   */
  onDelete?: () => void;
  /**
   * Référence vers l'input file
   */
  fileInputRef?: React.RefObject<HTMLInputElement>;
  /**
   * Taille maximale du fichier en MB
   */
  maxSizeMB?: number;
  /**
   * Types de fichiers acceptés
   */
  acceptedFileTypes?: string;
  /**
   * Classe CSS additionnelle
   */
  className?: string;
  /**
   * Texte d'aide
   */
  helpText?: string;
  /**
   * Style de bordure arrondie ('full' pour cercle complet, 'rounded' pour coins arrondis, 'square' pour coins carrés)
   */
  roundedStyle?: 'full' | 'rounded' | 'square';
  /**
   * Taille de l'image en pixels (largeur et hauteur)
   */
  imageSize?: number;
  /**
   * Mode d'ajustement de l'image:
   * - cover: remplit tout l'espace (peut recadrer l'image)
   * - contain: montre l'image entière (peut laisser des espaces vides)
   * - adaptive: s'adapte automatiquement selon les proportions de l'image
   * - fill: étire l'image pour remplir tout l'espace (peut déformer l'image)
   */
  objectFit?: 'cover' | 'contain' | 'adaptive' | 'fill';
}

/**
 * Composant réutilisable pour l'upload et la prévisualisation d'images
 */
export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl = '',
  apiBaseUrl = '',
  previewImage = null,
  isLoading = false,
  loadingMessage = "Traitement en cours...",
  onFileSelect,
  onDelete,
  fileInputRef: externalFileInputRef,
  maxSizeMB = 2,
  acceptedFileTypes = "image/*",
  className = '',
  helpText = `Format recommandé : PNG ou JPG, max ${maxSizeMB}MB`,
  roundedStyle = 'full',
  imageSize = 128,
  objectFit = 'adaptive',
}) => {
  // Utiliser la référence externe ou créer une référence locale
  const internalFileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = externalFileInputRef || internalFileInputRef;

  
  // Déterminer l'URL complète de l'image
  const fullImageUrl = imageUrl ? `${apiBaseUrl}${imageUrl}` : '';
  
  // Déterminer si une image est disponible pour affichage
  const hasImage = Boolean(previewImage || fullImageUrl);
  
  // Référence pour l'image
  const imageRef = useRef<HTMLImageElement>(null);
  
  // État pour stocker les dimensions de l'image
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  
  // Fonction pour déterminer le mode d'ajustement optimal
  const getOptimalObjectFit = () => {
    if (objectFit !== 'adaptive' || !imageDimensions) return objectFit;
    
    // Calculer le ratio d'aspect de l'image
    const imageRatio = imageDimensions.width / imageDimensions.height;
    
    // Si l'image est beaucoup plus large que haute (logo panoramique)
    if (imageRatio > 2) {
      return 'contain';
    }
    // Si l'image est beaucoup plus haute que large (logo vertical)
    else if (imageRatio < 0.5) {
      return 'contain';
    }
    // Pour les images avec des proportions plus équilibrées
    else {
      return 'cover';
    }
  };
  
  // Effet pour charger les dimensions de l'image
  useEffect(() => {
    if (hasImage && imageRef.current) {
      const img = imageRef.current;
      
      // Si l'image est déjà chargée
      if (img.complete) {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      } else {
        // Sinon, attendre que l'image soit chargée
        const handleLoad = () => {
          setImageDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        };
        
        img.addEventListener('load', handleLoad);
        return () => {
          img.removeEventListener('load', handleLoad);
        };
      }
    }
  }, [hasImage, previewImage, fullImageUrl]);
  
  // Déterminer le mode d'ajustement final
  const finalObjectFit = getOptimalObjectFit();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-6">
        {hasImage && (
          <div className="relative">
            <img
              src={previewImage || fullImageUrl}
              alt="Avatar"
              ref={imageRef}
              className={`${roundedStyle === 'full' ? 'rounded-full' : roundedStyle === 'rounded' ? 'rounded-lg' : 'rounded-none'} bg-white border border-gray-200 shadow-sm`}
              style={{ 
                width: `${imageSize}px`, 
                height: `${imageSize}px`,
                objectFit: finalObjectFit === 'fill' ? 'fill' : finalObjectFit === 'contain' ? 'contain' : 'cover'
              }}
            />
          </div>
        )}
        {!hasImage && (
          <div className="relative">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`${roundedStyle === 'full' ? 'rounded-full' : roundedStyle === 'rounded' ? 'rounded-lg' : 'rounded-none'} bg-[#f0eeff] flex items-center justify-center border border-[#e6e3ff] shadow-sm hover:bg-[#e6e3ff] transition-colors`}
              style={{ width: `${imageSize}px`, height: `${imageSize}px` }}
            >
              <svg className="w-10 h-10 text-[#5b50ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#5b50ff] font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#5b50ff] focus:ring-offset-1 transition-colors text-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-[#5b50ff]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {loadingMessage}
              </span>
            ) : (
              "Télécharger"
            )}
          </button>
          
          {hasImage && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-red-600 font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-600 focus:ring-offset-1 transition-colors text-sm"
              disabled={isLoading}
            >
              Supprimer
            </button>
          )}
          
          <input
            id="dropzone-file"
            type="file"
            accept={acceptedFileTypes}
            ref={fileInputRef}
            onChange={onFileSelect}
            className="hidden"
            disabled={isLoading}
          />
        </div>
      </div>
      {/* Affichage du texte d'aide */}
      {helpText && (
        <p className="text-xs text-gray-500 mt-1">{helpText}</p>
      )}
    </div>
  );
};

export default ImageUploader;
