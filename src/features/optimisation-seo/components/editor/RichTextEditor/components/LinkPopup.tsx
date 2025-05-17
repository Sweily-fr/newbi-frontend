import React, { useState, useRef, useEffect } from 'react';
import { Modal } from "@/components/common/Modal";
import { LinkPopupProps } from './types';

const LinkPopup: React.FC<LinkPopupProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialSelection, 
  noSelection = false 
}) => {
  const [url, setUrl] = useState('');
  const [linkText, setLinkText] = useState(initialSelection);
  const [isInternal, setIsInternal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      // Réinitialiser les valeurs à chaque ouverture
      setLinkText(initialSelection);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isOpen, initialSelection]);
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Ajouter un lien"
      size="md"
    >
      <div>
        {noSelection ? (
          <div className="mb-4">
            <label htmlFor="linkText" className="block text-sm font-medium text-gray-700 mb-1">Texte du lien</label>
            <input 
              type="text" 
              id="linkText" 
              value={linkText} 
              onChange={(e) => setLinkText(e.target.value)} 
              className="w-full px-3 py-2 border border-[#e6e1ff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] bg-[#f9f8ff]"
              placeholder="Texte du lien"
            />
            <p className="text-xs text-[#8a82ff] mt-1">Entrez le texte qui sera affiché pour ce lien</p>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-4 p-2 bg-[#f0eeff] rounded-md border border-[#e6e1ff]">
            Texte sélectionné: <strong>{initialSelection}</strong>
          </p>
        )}
        
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">URL du lien</label>
          <input 
            type="text" 
            id="url" 
            ref={inputRef}
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            className="w-full px-3 py-2 border border-[#e6e1ff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] bg-[#f9f8ff]"
            placeholder="https://exemple.com"
          />
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={isInternal} 
              onChange={(e) => setIsInternal(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Lien interne (vers une autre page du site)</span>
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
              if (url.trim() && (!noSelection || (noSelection && linkText.trim()))) {
                onSubmit(url, isInternal, noSelection ? linkText : undefined);
                setUrl('');
                setLinkText('');
                setIsInternal(false);
              }
            }} 
            disabled={!url.trim() || (noSelection && !linkText.trim())}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] transition-all duration-200 ${url.trim() && (!noSelection || (noSelection && linkText.trim())) ? 'bg-[#5b50ff] hover:bg-[#4a41e0]' : 'bg-[#c4c0ff] cursor-not-allowed'}`}
          >
            Ajouter le lien
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LinkPopup;
