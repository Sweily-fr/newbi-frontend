import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../../../../../components/common/Modal';
import { ImagePopupProps } from './types';

const ImagePopup: React.FC<ImagePopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [preview, setPreview] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Réinitialiser les états quand la modal s'ouvre ou se ferme
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setAlt('');
      setPreview('');
      setWidth('');
      setHeight('');
      setOriginalDimensions(null);
    }
  }, [isOpen]);
  
  // Gérer le changement de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        
        // Réinitialiser les dimensions
        setWidth('');
        setHeight('');
        setOriginalDimensions(null);
        
        // Charger l'image pour obtenir ses dimensions originales
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  // Gérer le changement de largeur avec maintien du ratio
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value;
    setWidth(newWidth);
    
    if (maintainAspectRatio && originalDimensions && newWidth) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      const newHeight = Math.round(parseInt(newWidth) * aspectRatio);
      setHeight(newHeight.toString());
    }
  };
  
  // Gérer le changement de hauteur avec maintien du ratio
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value;
    setHeight(newHeight);
    
    if (maintainAspectRatio && originalDimensions && newHeight) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const newWidth = Math.round(parseInt(newHeight) * aspectRatio);
      setWidth(newWidth.toString());
    }
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Insérer une image"
      size="md"
    >
      <div>
        <div className="mb-4">
          <label htmlFor="image-file" className="block text-sm font-medium text-gray-700 mb-1">Sélectionner une image</label>
          <input 
            type="file" 
            id="image-file" 
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {preview && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Aperçu</p>
            <div className="border border-gray-300 rounded-md p-2 flex justify-center">
              <img 
                src={preview} 
                alt="Aperçu" 
                className="object-contain" 
                style={{
                  maxHeight: '200px',
                  width: width ? `${width}px` : 'auto',
                  height: height ? `${height}px` : 'auto'
                }}
              />
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="alt-text" className="block text-sm font-medium text-gray-700 mb-1">Description alternative (alt)</label>
          <input 
            type="text" 
            id="alt-text" 
            value={alt} 
            onChange={(e) => setAlt(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description de l'image pour l'accessibilité"
          />
        </div>
        
        <div className="mb-6">
          <p className="block text-sm font-medium text-gray-700 mb-1">Dimensions de l'image</p>
          
          <div className="flex items-center space-x-2 mb-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={maintainAspectRatio} 
                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Conserver les proportions</span>
            </label>
            
            {originalDimensions && (
              <span className="text-xs text-gray-500">
                Dimensions originales: {originalDimensions.width} × {originalDimensions.height}px
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="image-width" className="block text-sm font-medium text-gray-700 mb-1">Largeur (px)</label>
              <input 
                type="number" 
                id="image-width" 
                value={width} 
                onChange={handleWidthChange}
                placeholder={originalDimensions ? originalDimensions.width.toString() : "Auto"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="image-height" className="block text-sm font-medium text-gray-700 mb-1">Hauteur (px)</label>
              <input 
                type="number" 
                id="image-height" 
                value={height} 
                onChange={handleHeightChange}
                placeholder={originalDimensions ? originalDimensions.height.toString() : "Auto"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Annuler
          </button>
          <button 
            onClick={() => {
              if (file) {
                onSubmit(file, alt, width, height);
              }
            }} 
            disabled={!file}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] transition-all duration-200 ${file ? 'bg-[#5b50ff] hover:bg-[#4a41e0]' : 'bg-[#c4c0ff] cursor-not-allowed'}`}
          >
            Insérer l'image
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImagePopup;
