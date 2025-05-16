import React, { useState, useEffect, useRef } from 'react';
import { RowHorizontal, RowVertical, InfoCircle } from 'iconsax-react';
import { SignatureData } from '../../types';

interface AppearanceSectionProps {
  signatureData: SignatureData;
  updateSignatureData: <K extends keyof SignatureData>(field: K, value: SignatureData[K]) => void;
}

/**
 * Section du formulaire pour les paramètres d'apparence
 */
export const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  signatureData,
  updateSignatureData
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
        <h3 className="text-lg font-semibold text-gray-900 mb-8">Apparence</h3>
        
        {/* Barre d'outils moderne */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between p-2 bg-white rounded-2xl border border-[#E3E2E5] shadow-sm">
            <div className="flex items-center">
            {/* Sélecteur de police */}
            <div className="relative mr-2">
              <select
                className="h-9 px-3 py-2 border border-[#E3E2E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-sm appearance-none bg-white"
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
            <div className="h-7 w-px bg-[#E3E2E5] mx-2"></div>
            
            {/* Taille de police */}
            <div className="flex bg-white border border-[#E3E2E5] rounded-xl h-9 items-center px-1 space-x-1 mr-2">
              {fontSizeOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs transition-all ${
                    signatureData.fontSize === option.value 
                      ? 'border border-[#5b50ff] bg-[#f0eeff] text-[#5b50ff]' 
                      : 'text-[#838796]'
                  }`}
                  onClick={() => updateSignatureData('fontSize', option.value)}
                >
                  {option.label.replace('px', '')}
                </button>
              ))}
            </div>

            {/* Séparateur vertical */}
            <div className="h-7 w-px bg-[#E3E2E5] mx-2"></div>
            
            {/* Menu déroulant pour le style de texte */}
            <div className="relative flex bg-white border border-[#E3E2E5] rounded-xl h-9 items-center px-1">
              <button 
                type="button" 
                className="flex items-center justify-center h-7 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b50ff] text-xs text-[#838796]"
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
            
            {/* Séparateur vertical */}
            <div className="h-7 w-px bg-[#E3E2E5] mx-2"></div>
            
            {/* Contrôles de disposition */}
            <div className="flex items-center relative">
              <div className="absolute -top-1 -right-1 group z-10">
                <InfoCircle size="16" color="#5b50ff" variant="Bold" />
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap z-10">
                  Choisissez l'orientation de votre signature : verticale ou horizontale
                  <div className="absolute top-full right-2 transform border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
              <div className="flex bg-white border border-[#E3E2E5] rounded-xl h-9 items-center px-1 relative group">
                <button
                  type="button"
                  className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all ${signatureData.layout === 'vertical' ? 'border border-[#5b50ff] bg-[#f0eeff]' : 'text-[#838796]'}`}
                  onClick={() => updateSignatureData('layout', 'vertical')}
                  aria-label="Disposition verticale"
                >
                  <RowVertical size="16" color={signatureData.layout === 'vertical' ? '#5b50ff' : '#838796'} />
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all ${signatureData.layout === 'horizontal' ? 'border border-[#5b50ff] bg-[#f0eeff]' : 'text-[#838796]'}`}
                  onClick={() => updateSignatureData('layout', 'horizontal')}
                  aria-label="Disposition horizontale"
                >
                  <RowHorizontal size="16" color={signatureData.layout === 'horizontal' ? '#5b50ff' : '#838796'} />
                </button>
              </div>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap z-10">
                *Choisissez comment organiser les éléments de votre signature
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
              </div>
            </div>
            
            </div>
            
            {/* Contrôles d'alignement du texte - masqués en mode horizontal - positionnés à droite */}
            {signatureData.layout !== 'horizontal' && (
              <div className="flex items-center ml-auto self-end relative">
                <div className="absolute -top-1 -right-1 group">
                  <InfoCircle size="16" color="#5b50ff" variant="Bold" />
                  <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap z-10">
                    Choisissez l'alignement du texte de votre signature
                    <div className="absolute top-full right-2 transform border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
                <div className="flex bg-white border border-[#E3E2E5] rounded-xl h-9 items-center px-1">
                  <button
                    type="button"
                    className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all ${signatureData.textAlignment === 'left' ? 'border border-[#5b50ff] bg-[#f0eeff]' : 'text-[#838796]'}`}
                    onClick={() => updateSignatureData('textAlignment', 'left')}
                    aria-label="Aligner à gauche"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 4.5H21" stroke={signatureData.textAlignment === 'left' ? '#5b50ff' : '#838796'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 9.5H12.5" stroke={signatureData.textAlignment === 'left' ? '#5b50ff' : '#838796'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 14.5H21" stroke={signatureData.textAlignment === 'left' ? '#5b50ff' : '#838796'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 19.5H12.5" stroke={signatureData.textAlignment === 'left' ? '#5b50ff' : '#838796'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all ${signatureData.textAlignment === 'center' ? 'border border-[#5b50ff] bg-[#f0eeff]' : 'text-[#838796]'}`}
                    onClick={() => updateSignatureData('textAlignment', 'center')}
                    aria-label="Centrer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 4.5H21" stroke={signatureData.textAlignment === 'center' ? '#5b50ff' : '#838796'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7.26001 9.5H16.74" stroke={signatureData.textAlignment === 'center' ? '#5b50ff' : '#838796'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 14.5H21" stroke={signatureData.textAlignment === 'center' ? '#5b50ff' : '#838796'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7.26001 19.5H16.74" stroke={signatureData.textAlignment === 'center' ? '#5b50ff' : '#838796'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all ${signatureData.textAlignment === 'right' ? 'border border-[#5b50ff] bg-[#f0eeff]' : 'text-[#838796]'}`}
                    onClick={() => updateSignatureData('textAlignment', 'right')}
                    aria-label="Aligner à droite"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 4.5H21" stroke={signatureData.textAlignment === 'right' ? '#5b50ff' : '#838796'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11.5 9.5H21" stroke={signatureData.textAlignment === 'right' ? '#5b50ff' : '#838796'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 14.5H21" stroke={signatureData.textAlignment === 'right' ? '#5b50ff' : '#838796'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11.5 19.5H21" stroke={signatureData.textAlignment === 'right' ? '#5b50ff' : '#838796'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Espacements - affichés en fonction du mode sélectionné */}
        <div className="mb-6">
          {/* Espacement entre icônes et texte - commun aux deux modes */}
          <div className="mt-6 mb-5">
            <h4 className="text-base font-medium text-gray-800 mb-3">
              Espacement entre icônes et texte ({signatureData.iconTextSpacing || 5}px)
              <span className="ml-2 inline-flex items-center group relative">
                <InfoCircle size="16" color="#5b50ff" variant="Bold" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap z-10">
                  Ajustez l'espace entre les icônes et leur texte associé
                  <div className="absolute top-full left-2 transform border-4 border-transparent border-t-gray-800"></div>
                </div>
              </span>
            </h4>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="2"
                max="15"
                step="1"
                value={signatureData.iconTextSpacing || 5}
                onChange={(e) => updateSignatureData('iconTextSpacing', parseInt(e.target.value))}
                className="w-2/5 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5b50ff]"
              />
              <div className="flex items-center justify-center w-10 h-8 bg-white border border-gray-300 rounded-lg text-sm">
                {signatureData.iconTextSpacing || 5}
              </div>
            </div>
          </div>
          
          {signatureData.layout === 'vertical' ? (
            <div className="mt-6">
              <h4 className="text-base font-medium text-gray-800 mb-3">Espacement vertical ({signatureData.verticalSpacing}px)</h4>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="1"
                  value={signatureData.verticalSpacing}
                  onChange={(e) => updateSignatureData('verticalSpacing', parseInt(e.target.value))}
                  className="w-2/5 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5b50ff]"
                />
                <div className="flex items-center justify-center w-10 h-8 bg-white border border-gray-300 rounded-lg text-sm">
                  {signatureData.verticalSpacing}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {/* Espacement entre colonnes - mode horizontal */}
              <div>
                <h4 className="text-base font-medium text-gray-800 mb-3">Espacement entre les colonnes ({signatureData.horizontalSpacing}px)</h4>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="1"
                    value={signatureData.horizontalSpacing}
                    onChange={(e) => updateSignatureData('horizontalSpacing', parseInt(e.target.value))}
                    className="w-2/5 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5b50ff]"
                  />
                  <div className="flex items-center justify-center w-10 h-8 bg-white border border-gray-300 rounded-lg text-sm">
                    {signatureData.horizontalSpacing}
                  </div>
                </div>
              </div>
              
              {/* Espacement vertical - mode horizontal */}
              <div>
                <h4 className="text-base font-medium text-gray-800 mb-3">Espacement vertical ({signatureData.verticalSpacing}px)</h4>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="1"
                    value={signatureData.verticalSpacing}
                    onChange={(e) => updateSignatureData('verticalSpacing', parseInt(e.target.value))}
                    className="w-2/5 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5b50ff]"
                  />
                  <div className="flex items-center justify-center w-10 h-8 bg-white border border-gray-300 rounded-lg text-sm">
                    {signatureData.verticalSpacing}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
          
        {/* Couleurs */}
        <div className="space-y-4">
          <h4 className="text-base font-medium text-gray-800">Couleurs</h4>
          
          {/* Couleur du texte - déplacée depuis SocialLinksSection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur du texte
              <span className="ml-1 inline-flex items-center group relative">
                <InfoCircle size="16" color="#5b50ff" variant="Bold" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap z-10">
                  Couleur du texte des liens sociaux en mode texte
                  <div className="absolute top-full left-2 transform border-4 border-transparent border-t-gray-800"></div>
                </div>
              </span>
            </label>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {/* Palette de couleurs pour le texte */}
                {['#333333', '#5b50ff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`rounded-lg border border-transparent transition-all duration-200 ease-in-out ${signatureData.secondaryColor === color ? 'w-7 h-7 shadow-md transform scale-110 z-10' : 'w-6 h-6'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateSignatureData('secondaryColor', color)}
                    aria-label={`Couleur ${color}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};