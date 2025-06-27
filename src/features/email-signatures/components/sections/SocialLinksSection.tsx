import React, { useState, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { InfoCircle } from 'iconsax-react';
import { SignatureData } from '../../types';
import { Radio } from '../../../../components/common';

interface SocialLinksSectionProps {
  signatureData: SignatureData;
  updateSignatureData: <K extends keyof SignatureData>(field: K, value: SignatureData[K]) => void;
}

/**
 * Section du formulaire pour les réseaux sociaux
 */
export const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({
  signatureData,
  updateSignatureData,
}) => {
  // États pour contrôler l'affichage des sélecteurs de couleur
  const [showPrimaryColorPicker, setShowPrimaryColorPicker] = useState(false);
  const [showSecondaryColorPicker, setShowSecondaryColorPicker] = useState(false);
  
  // Composant réutilisable pour l'icône d'information
  const InfoIcon = ({ tooltip }: { tooltip: string }) => (
    <div className="relative ml-1 group">
      <InfoCircle size="16" color="#5b50ff" variant="Bold" />
      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap z-10">
        {tooltip}
        <div className="absolute top-full left-2 transform border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
  
  // Références pour les sélecteurs de couleur
  const primaryColorPickerRef = useRef<HTMLDivElement>(null);
  const secondaryColorPickerRef = useRef<HTMLDivElement>(null);

  // Fonction pour formater le code couleur (enlever le #)
  const formatColorCode = (color: string) => color.replace('#', '');

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 mb-8">Réseaux sociaux</h3>
                 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* LinkedIn */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <span>LinkedIn</span>
            <InfoIcon tooltip="Format attendu : https://www.linkedin.com/in/username" />
          </label>
          <input 
            type="text" 
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-sm placeholder:text-xs"
            placeholder="https://www.linkedin.com/in/votre-profil"
            value={signatureData.socialLinks?.linkedin || ''}
            onChange={(e) => {
              const currentSocialLinks = signatureData.socialLinks || {};
              updateSignatureData('socialLinks', {
                ...currentSocialLinks,
                linkedin: e.target.value
              });
            }}
          />
        </div>
        
        {/* Twitter / X */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <span>Twitter / X</span>
            <InfoIcon tooltip="Format attendu : https://x.com/username" />
          </label>
          <input 
            type="text" 
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-sm placeholder:text-xs"
            placeholder="https://twitter.com/votre-compte"
            value={signatureData.socialLinks?.twitter || ''}
            onChange={(e) => {
              const currentSocialLinks = signatureData.socialLinks || {};
              updateSignatureData('socialLinks', {
                ...currentSocialLinks,
                twitter: e.target.value
              });
            }}
          />
        </div>
        
        {/* Facebook */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <span>Facebook</span>
            <InfoIcon tooltip="Format attendu : https://www.facebook.com/username" />
          </label>
          <input 
            type="text" 
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-sm placeholder:text-xs"
            placeholder="https://www.facebook.com/votre-page"
            value={signatureData.socialLinks?.facebook || ''}
            onChange={(e) => {
              const currentSocialLinks = signatureData.socialLinks || {};
              updateSignatureData('socialLinks', {
                ...currentSocialLinks,
                facebook: e.target.value
              });
            }}
          />
        </div>
        
        {/* Instagram */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <span>Instagram</span>
            <InfoIcon tooltip="Format attendu : https://www.instagram.com/username" />
          </label>
          <input 
            type="text" 
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent text-sm placeholder:text-xs"
            placeholder="https://www.instagram.com/votre-compte"
            value={signatureData.socialLinks?.instagram || ''}
            onChange={(e) => {
              const currentSocialLinks = signatureData.socialLinks || {};
              updateSignatureData('socialLinks', {
                ...currentSocialLinks,
                instagram: e.target.value
              });
            }}
          />
        </div>
      </div>
      
      {/* Mode d'affichage des réseaux sociaux */}
      <div className="mt-6">
        <h4 className="text-base font-medium text-gray-800 mb-3">Mode d'affichage des réseaux sociaux</h4>
        
        <div className="flex space-x-6">
          <Radio
            id="socialLinksDisplayMode-text"
            name="socialLinksDisplayMode"
            value="text"
            label="Noms (LinkedIn, X, etc.)"
            checked={signatureData.socialLinksDisplayMode === 'text'}
            onChange={() => updateSignatureData('socialLinksDisplayMode', 'text')}
          />
          
          <Radio
            id="socialLinksDisplayMode-icons"
            name="socialLinksDisplayMode"
            value="icons"
            label="Icônes"
            checked={signatureData.socialLinksDisplayMode === 'icons'}
            onChange={() => updateSignatureData('socialLinksDisplayMode', 'icons')}
          />
        </div>
      </div>
      
      {/* Style des icônes - affiché uniquement lorsque le mode d'affichage "Icônes" est sélectionné */}
      {signatureData.socialLinksDisplayMode === 'icons' && (
        <div className="mt-6">
          <h4 className="text-base font-medium text-gray-800 mb-3">Style des icônes</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <label className={`flex flex-col items-center justify-center p-4 rounded-xl border ${signatureData.socialLinksIconStyle === 'plain' ? 'border-[#5b50ff] bg-[#f0eeff]' : 'border-gray-200 hover:border-gray-300'} cursor-pointer transition-all`}>
            <input
              type="radio"
              className="sr-only"
              name="socialLinksIconStyle"
              value="plain"
              checked={signatureData.socialLinksIconStyle === 'plain'}
              onChange={() => updateSignatureData('socialLinksIconStyle', 'plain')}
            />
            <div className="flex space-x-3 text-[#5b50ff] mb-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </div>
            <span className="text-sm text-gray-700">Sans fond</span>
          </label>
          
          <label className={`flex flex-col items-center justify-center p-4 rounded-xl border ${signatureData.socialLinksIconStyle === 'rounded' ? 'border-[#5b50ff] bg-[#f0eeff]' : 'border-gray-200 hover:border-gray-300'} cursor-pointer transition-all`}>
            <input
              type="radio"
              className="sr-only"
              name="socialLinksIconStyle"
              value="rounded"
              checked={signatureData.socialLinksIconStyle === 'rounded'}
              onChange={() => updateSignatureData('socialLinksIconStyle', 'rounded')}
            />
            <div className="flex space-x-3 mb-3">
              <span className="w-6 h-6 flex items-center justify-center rounded-md" style={{ backgroundColor: signatureData.primaryColor || '#5b50ff' }}><svg className="w-3.5 h-3.5" style={{ fill: (signatureData as any).socialLinksIconColor || '#ffffff' }} viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></span>
              <span className="w-6 h-6 flex items-center justify-center rounded-md" style={{ backgroundColor: signatureData.primaryColor || '#5b50ff' }}><svg className="w-3.5 h-3.5" style={{ fill: (signatureData as any).socialLinksIconColor || '#ffffff' }} viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></span>
            </div>
            <span className="text-sm text-gray-700">Carré arrondi</span>
          </label>
          
          <label className={`flex flex-col items-center justify-center p-4 rounded-xl border ${signatureData.socialLinksIconStyle === 'circle' ? 'border-[#5b50ff] bg-[#f0eeff]' : 'border-gray-200 hover:border-gray-300'} cursor-pointer transition-all`}>
            <input
              type="radio"
              className="sr-only"
              name="socialLinksIconStyle"
              value="circle"
              checked={signatureData.socialLinksIconStyle === 'circle'}
              onChange={() => updateSignatureData('socialLinksIconStyle', 'circle')}
            />
            <div className="flex space-x-3 mb-3">
              <span className="w-6 h-6 flex items-center justify-center rounded-full" style={{ backgroundColor: signatureData.primaryColor || '#5b50ff' }}><svg className="w-3.5 h-3.5" style={{ fill: (signatureData as any).socialLinksIconColor || '#ffffff' }} viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></span>
              <span className="w-6 h-6 flex items-center justify-center rounded-full" style={{ backgroundColor: signatureData.primaryColor || '#5b50ff' }}><svg className="w-3.5 h-3.5" style={{ fill: (signatureData as any).socialLinksIconColor || '#ffffff' }} viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></span>
            </div>
            <span className="text-sm text-gray-700">Cercle</span>
          </label>
          
          <label className={`flex flex-col items-center justify-center p-4 rounded-xl border ${signatureData.socialLinksIconStyle === 'filled' ? 'border-[#5b50ff] bg-[#f0eeff]' : 'border-gray-200 hover:border-gray-300'} cursor-pointer transition-all`}>
            <input
              type="radio"
              className="sr-only"
              name="socialLinksIconStyle"
              value="filled"
              checked={signatureData.socialLinksIconStyle === 'filled'}
              onChange={() => updateSignatureData('socialLinksIconStyle', 'filled')}
            />
            <div className="flex space-x-3 mb-3">
              <span className="w-6 h-6 flex items-center justify-center" style={{ color: signatureData.primaryColor || '#5b50ff' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </span>
              <span className="w-6 h-6 flex items-center justify-center" style={{ color: signatureData.primaryColor || '#5b50ff' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </span>
            </div>
            <span className="text-sm text-gray-700">Plein</span>
          </label>
        </div>
      </div>
      )}
      
      {/* Palette de couleurs */}
      <div className="mt-6">
        <h4 className="text-base font-medium text-gray-800 mb-3">Couleurs des icônes</h4>
        
        <div className="space-y-6">
          {/* Couleur de fond - visible uniquement pour les styles avec fond et en mode Icônes */}
          {signatureData.socialLinksIconStyle !== 'plain' && signatureData.socialLinksDisplayMode === 'icons' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur de fond
              </label>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {['#5b50ff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`rounded-lg border border-transparent transition-all duration-200 ease-in-out ${signatureData.primaryColor === color ? 'w-7 h-7 shadow-md transform scale-110 z-10' : 'w-6 h-6'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => updateSignatureData('primaryColor', color)}
                      aria-label={`Couleur ${color}`}
                    ></button>
                  ))}
                </div>
                
                <div 
                  className="flex items-center border border-gray-300 rounded-xl overflow-hidden cursor-pointer" 
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
                    <div className="absolute z-10 mt-2 left-0" ref={primaryColorPickerRef}>
                      <div className="p-2 bg-white rounded-xl shadow-lg border border-gray-200">
                        <HexColorPicker
                          color={signatureData.primaryColor || '#5b50ff'}
                          onChange={(color) => updateSignatureData('primaryColor', color)}
                        />
                        <div className="flex justify-between mt-2">
                          <button
                            type="button"
                            className="px-2 py-1 text-xs bg-gray-100 rounded-xl hover:bg-gray-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPrimaryColorPicker(false);
                            }}
                          >
                            Fermer
                          </button>
                          <button
                            type="button"
                            className="px-2 py-1 text-xs bg-[#5b50ff] text-white rounded-xl hover:bg-[#4a41e0]"
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
          )}
          
          {/* Couleur des icônes SVG - nouvelle option */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur des icônes
              <span className="ml-1 inline-flex items-center group relative">
                <InfoCircle size="16" color="#5b50ff" variant="Bold" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap z-10">
                  Couleur des icônes SVG dans les réseaux sociaux
                  <div className="absolute top-full left-2 transform border-4 border-transparent border-t-gray-800"></div>
                </div>
              </span>
            </label>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {/* Palette de couleurs pour les icônes SVG */}
                {['#5b50ff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#000000', '#ffffff'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`rounded-lg border ${color === '#ffffff' ? 'border-gray-300' : 'border-transparent'} transition-all duration-200 ease-in-out ${signatureData.socialLinksIconColor === color ? 'w-7 h-7 shadow-md transform scale-110 z-10' : 'w-6 h-6'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateSignatureData('socialLinksIconColor', color)}
                    aria-label={`Couleur ${color}`}
                  ></button>
                ))}
              </div>
              
              <div 
                className="flex items-center border border-gray-300 rounded-xl overflow-hidden cursor-pointer" 
                onClick={() => setShowSecondaryColorPicker(!showSecondaryColorPicker)}
              >
                <div 
                  className="w-8 h-8" 
                  style={{ backgroundColor: signatureData.socialLinksIconColor || (signatureData.socialLinksIconStyle === 'plain' ? '#333333' : '#ffffff') }}
                ></div>
                <div className="px-3 py-1 text-sm font-medium">
                  {formatColorCode(signatureData.socialLinksIconColor || (signatureData.socialLinksIconStyle === 'plain' ? '#333333' : '#ffffff'))}
                </div>
                {showSecondaryColorPicker && (
                  <div className="absolute z-10 mt-2 left-0" ref={secondaryColorPickerRef}>
                    <div className="p-2 bg-white rounded-xl shadow-lg border border-gray-200">
                      <HexColorPicker
                        color={signatureData.socialLinksIconColor || (signatureData.socialLinksIconStyle === 'plain' ? '#333333' : '#ffffff')}
                        onChange={(color) => updateSignatureData('socialLinksIconColor', color)}
                      />
                      <div className="flex justify-between mt-2">
                        <button
                          type="button"
                          className="px-2 py-1 text-xs bg-gray-100 rounded-xl hover:bg-gray-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSecondaryColorPicker(false);
                          }}
                        >
                          Fermer
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 text-xs bg-[#5b50ff] text-white rounded-xl hover:bg-[#4a41e0]"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateSignatureData('socialLinksIconColor', signatureData.socialLinksIconStyle === 'plain' ? '#333333' : '#ffffff');
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
