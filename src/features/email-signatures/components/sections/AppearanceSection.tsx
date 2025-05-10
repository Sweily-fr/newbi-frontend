import React, { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { SignatureData } from '../../types';

interface AppearanceSectionProps {
  signatureData: SignatureData;
  updateSignatureData: <K extends keyof SignatureData>(field: K, value: SignatureData[K]) => void;
  showPrimaryColorPicker: boolean;
  setShowPrimaryColorPicker: (show: boolean) => void;
  primaryColorPickerRef: React.RefObject<HTMLDivElement | null>;
  showSecondaryColorPicker: boolean;
  setShowSecondaryColorPicker: (show: boolean) => void;
  secondaryColorPickerRef: React.RefObject<HTMLDivElement | null>;
  formatColorCode: (color: string) => string;
}

/**
 * Section du formulaire pour les paramètres d'apparence
 */
export const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  signatureData,
  updateSignatureData,
  showPrimaryColorPicker,
  setShowPrimaryColorPicker,
  primaryColorPickerRef,
  showSecondaryColorPicker,
  setShowSecondaryColorPicker,
  secondaryColorPickerRef,
  formatColorCode
}) => {
  const fontOptions = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Tahoma', label: 'Tahoma' }
  ];

  const fontSizeOptions = [
    { value: 12, label: '12px' },
    { value: 14, label: '14px' },
    { value: 16, label: '16px' },
    { value: 18, label: '18px' }
  ];

  const textStyleOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'overline', label: 'Surligné' },
    { value: 'underline', label: 'Souligné' },
    { value: 'strikethrough', label: 'Barré' }
  ];

  const predefinedColors = [
    '#5b50ff', // Couleur principale Newbi
    '#3b82f6', // Bleu
    '#10b981', // Vert
    '#f59e0b', // Orange
    '#ef4444', // Rouge
    '#8b5cf6'  // Violet
  ];

  const textColors = [
    '#ffffff', // Blanc
    '#f3f4f6', // Gris très clair
    '#e5e7eb', // Gris clair
    '#d1d5db', // Gris moyen
    '#9ca3af', // Gris
    '#6b7280'  // Gris foncé
  ];

  // État pour gérer l'affichage du menu déroulant de style de texte
  const [showTextStyleDropdown, setShowTextStyleDropdown] = useState(false);
  const textStyleDropdownRef = useRef<HTMLDivElement>(null);
  
  // Fermer le menu déroulant lors d'un clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (textStyleDropdownRef.current && !textStyleDropdownRef.current.contains(event.target as Node)) {
        setShowTextStyleDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Apparence</h3>
        
        {/* Barre d'outils moderne */}
        <div className="mb-6">
          <div className="flex items-center p-2 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            {/* Sélecteur de police */}
            <div className="relative mr-2">
              <select
                className="h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-sm appearance-none bg-white"
                value={signatureData.fontFamily}
                onChange={(e) => updateSignatureData('fontFamily', e.target.value)}
              >
                {fontOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            {/* Séparateur vertical */}
            <div className="h-8 w-px bg-gray-300 mx-2"></div>
            
            {/* Taille de police */}
            <div className="flex items-center space-x-1 mr-2">
              {fontSizeOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`flex items-center justify-center w-8 h-8 rounded-lg text-xs transition-all ${
                    signatureData.fontSize === option.value 
                      ? 'bg-[#5b50ff] text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => updateSignatureData('fontSize', option.value)}
                >
                  {option.label.replace('px', '')}
                </button>
              ))}
            </div>

            {/* Séparateur vertical */}
            <div className="h-8 w-px bg-gray-300 mx-2"></div>
            
            {/* Menu déroulant pour le style de texte */}
            <div className="relative">
              <button 
                type="button" 
                className="flex items-center justify-center h-8 px-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5b50ff] text-xs"
                onClick={() => setShowTextStyleDropdown(!showTextStyleDropdown)}
              >
                {signatureData.textStyle === 'normal' && 'T'}
                {signatureData.textStyle === 'overline' && <span className="overline">T</span>}
                {signatureData.textStyle === 'underline' && <span className="underline">T</span>}
                {signatureData.textStyle === 'strikethrough' && <span className="line-through">T</span>}
                <svg className="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {showTextStyleDropdown && (
                <div className="absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10" ref={textStyleDropdownRef}>
                  {textStyleOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${signatureData.textStyle === option.value ? 'bg-gray-50' : ''}`}
                      onClick={() => {
                        updateSignatureData('textStyle', option.value as 'normal' | 'overline' | 'underline' | 'strikethrough');
                        setShowTextStyleDropdown(false);
                      }}
                    >
                      {option.value === 'normal' && 'Normal'}
                      {option.value === 'overline' && <span className="overline">Surligné</span>}
                      {option.value === 'underline' && <span className="underline">Souligné</span>}
                      {option.value === 'strikethrough' && <span className="line-through">Barré</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
          
        {/* Couleurs */}
        <div className="space-y-4">
          <h4 className="text-base font-medium text-gray-800">Couleurs</h4>
          
          {/* Couleur principale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur principale
            </label>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full border ${signatureData.primaryColor === color ? 'border-gray-800' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateSignatureData('primaryColor', color)}
                    aria-label={`Couleur ${color}`}
                  ></button>
                ))}
              </div>
              
              <div 
                className="flex items-center border border-gray-300 rounded-md overflow-hidden cursor-pointer" 
                onClick={() => setShowPrimaryColorPicker(!showPrimaryColorPicker)}
              >
                <div 
                  className="w-8 h-8" 
                  style={{ backgroundColor: signatureData.primaryColor || '#5b50ff' }}
                ></div>
                <div className="px-3 py-1 text-sm font-medium">
                  {formatColorCode(signatureData.primaryColor || '#5b50ff')}
                </div>
                {showPrimaryColorPicker && (
                  <div className="absolute z-10 mt-2 right-0 top-12" ref={primaryColorPickerRef}>
                    <div className="p-2 bg-white rounded-md shadow-lg border border-gray-200">
                      <HexColorPicker
                        color={signatureData.primaryColor || '#5b50ff'}
                        onChange={(color) => updateSignatureData('primaryColor', color)}
                      />
                      <div className="flex justify-between mt-2">
                        <button
                          type="button"
                          className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowPrimaryColorPicker(false);
                          }}
                        >
                          Fermer
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 text-xs bg-[#5b50ff] text-white rounded hover:bg-[#4a41e0]"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateSignatureData('primaryColor', '#5b50ff');
                          }}
                        >
                          Réinitialiser
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Couleur secondaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur secondaire
            </label>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {textColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full border ${signatureData.secondaryColor === color ? 'border-gray-800' : 'border-gray-300'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateSignatureData('secondaryColor', color)}
                    aria-label={`Couleur ${color}`}
                  ></button>
                ))}
              </div>
              
              <div 
                className="flex items-center border border-gray-300 rounded-md overflow-hidden cursor-pointer" 
                onClick={() => setShowSecondaryColorPicker(!showSecondaryColorPicker)}
              >
                <div 
                  className="w-8 h-8" 
                  style={{ backgroundColor: signatureData.secondaryColor || '#ffffff' }}
                ></div>
                <div className="px-3 py-1 text-sm font-medium">
                  {formatColorCode(signatureData.secondaryColor || '#ffffff')}
                </div>
                {showSecondaryColorPicker && (
                  <div className="absolute z-10 mt-2 right-0 top-12" ref={secondaryColorPickerRef}>
                    <div className="p-2 bg-white rounded-md shadow-lg border border-gray-200">
                      <HexColorPicker
                        color={signatureData.secondaryColor || '#ffffff'}
                        onChange={(color) => updateSignatureData('secondaryColor', color)}
                      />
                      <div className="flex justify-between mt-2">
                        <button
                          type="button"
                          className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSecondaryColorPicker(false);
                          }}
                        >
                          Fermer
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 text-xs bg-[#5b50ff] text-white rounded hover:bg-[#4a41e0]"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateSignatureData('secondaryColor', '#ffffff');
                          }}
                        >
                          Réinitialiser
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};