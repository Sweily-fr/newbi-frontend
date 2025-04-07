import React, { useRef } from 'react';

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
}) => {
  // Utiliser la référence externe ou créer une référence locale
  const internalFileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = externalFileInputRef || internalFileInputRef;

  
  // Déterminer l'URL complète de l'image
  const fullImageUrl = imageUrl ? `${apiBaseUrl}${imageUrl}` : '';
  
  // Déterminer si une image est disponible pour affichage
  const hasImage = Boolean(previewImage || fullImageUrl);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-6">
        {hasImage && (
          <div className="relative">
            <img
              src={previewImage || fullImageUrl}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-contain bg-white border border-gray-200 shadow-sm"
            />
          </div>
        )}
        {!hasImage && (
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shadow-sm">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-blue-600 font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors text-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-blue-600"
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
              "Upload"
            )}
          </button>
          
          {hasImage && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-500 font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 transition-colors text-sm"
              disabled={isLoading}
            >
              Remove
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
        <p className="text-sm text-gray-500 mt-1">{helpText}</p>
      )}
    </div>
  );
};
