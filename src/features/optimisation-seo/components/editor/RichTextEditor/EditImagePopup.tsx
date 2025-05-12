import React, { useState, useEffect } from 'react';
import { Modal } from '../../../../../components/common/Modal';
import { EditImagePopupProps } from './types';

const EditImagePopup: React.FC<EditImagePopupProps> = ({ 
  isOpen, 
  onClose, 
  imageElement, 
  onSubmit 
}) => {
  const [alt, setAlt] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null);
  
  // Initialiser les valeurs à partir de l'image sélectionnée
  useEffect(() => {
    if (isOpen && imageElement) {
      // Récupérer l'attribut alt
      setAlt(imageElement.alt || '');
      
      // Récupérer les dimensions
      const currentWidth = imageElement.width || parseInt(imageElement.style.width) || 0;
      const currentHeight = imageElement.height || parseInt(imageElement.style.height) || 0;
      
      setWidth(currentWidth ? currentWidth.toString() : '');
      setHeight(currentHeight ? currentHeight.toString() : '');
      
      // Stocker les dimensions originales pour le calcul du ratio
      if (currentWidth && currentHeight) {
        setOriginalDimensions({ width: currentWidth, height: currentHeight });
      } else {
        // Si les dimensions ne sont pas disponibles, charger l'image pour obtenir ses dimensions
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          if (!width) setWidth(img.width.toString());
          if (!height) setHeight(img.height.toString());
        };
        img.src = imageElement.src;
      }
    }
  }, [isOpen, imageElement, width, height]);
  
  // Gérer le changement de largeur avec maintien du ratio
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value;
    setWidth(newWidth);
    
    // Mettre à jour la hauteur si le ratio est maintenu et que les dimensions originales sont connues
    if (maintainAspectRatio && originalDimensions && newWidth) {
      const ratio = originalDimensions.height / originalDimensions.width;
      const newHeight = Math.round(parseInt(newWidth) * ratio);
      setHeight(newHeight.toString());
    }
  };
  
  // Gérer le changement de hauteur avec maintien du ratio
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value;
    setHeight(newHeight);
    
    // Mettre à jour la largeur si le ratio est maintenu et que les dimensions originales sont connues
    if (maintainAspectRatio && originalDimensions && newHeight) {
      const ratio = originalDimensions.width / originalDimensions.height;
      const newWidth = Math.round(parseInt(newHeight) * ratio);
      setWidth(newWidth.toString());
    }
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Modifier l'image"
      size="md"
    >
      <div>
        <div className="mb-4">
          <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-1">Texte alternatif (alt)</label>
          <input 
            type="text" 
            id="alt" 
            value={alt} 
            onChange={(e) => setAlt(e.target.value)} 
            className="w-full px-3 py-2 border border-[#e6e1ff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] bg-[#f9f8ff]"
            placeholder="Description de l'image"
          />
          <p className="text-xs text-[#8a82ff] mt-1">Important pour l'accessibilité et le SEO</p>
        </div>
        
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-1/2 px-2">
            <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">Largeur (px)</label>
            <input 
              type="number" 
              id="width" 
              value={width} 
              onChange={handleWidthChange} 
              className="w-full px-3 py-2 border border-[#e6e1ff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] bg-[#f9f8ff]"
              placeholder="Auto"
            />
          </div>
          <div className="w-1/2 px-2">
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">Hauteur (px)</label>
            <input 
              type="number" 
              id="height" 
              value={height} 
              onChange={handleHeightChange} 
              className="w-full px-3 py-2 border border-[#e6e1ff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] bg-[#f9f8ff]"
              placeholder="Auto"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={maintainAspectRatio} 
              onChange={(e) => setMaintainAspectRatio(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Conserver les proportions</span>
          </label>
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
              onSubmit(alt, width, height);
            }} 
            className="px-4 py-2 text-sm font-medium text-white bg-[#5b50ff] rounded-md hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-[#5b50ff]"
          >
            Appliquer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditImagePopup;
