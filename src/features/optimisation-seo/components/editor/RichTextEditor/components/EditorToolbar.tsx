import React from 'react';
import { EditorToolbarProps } from './types';

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  activeFormats,
  isLinkSelected,
  isAnalyzing,
  handleFormatAction,
  handleRemoveLink,
  handleLinkButtonClick,
  handleImageButtonClick,
  handleAnalyzeContent
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between p-2 bg-white border-b border-[#E3E2E5] shadow-sm mb-4">
      <div className="flex flex-wrap items-center">
        {/* Groupe 1: Formatage de texte de base */}
        <div className="flex items-center">
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              document.execCommand('bold', false);
              setTimeout(() => {
                handleFormatAction('checkFormat');
              }, 10);
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-2xl transition-colors duration-200 ${
              activeFormats.bold 
                ? 'bg-[#5b50ff] text-white' 
                : 'text-[#5b50ff] hover:bg-[#f0eeff]'
            }`}
            title="Gras"
            disabled={isAnalyzing}
          >
            <span className="font-bold text-sm">B</span>
          </button>
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              document.execCommand('italic', false);
              setTimeout(() => {
                handleFormatAction('checkFormat');
              }, 10);
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-2xl transition-colors duration-200 ${
              activeFormats.italic 
                ? 'bg-[#5b50ff] text-white' 
                : 'text-[#5b50ff] hover:bg-[#f0eeff]'
            }`}
            title="Italique"
            disabled={isAnalyzing}
          >
            <span className="italic text-sm">I</span>
          </button>
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              document.execCommand('underline', false);
              setTimeout(() => {
                handleFormatAction('checkFormat');
              }, 10);
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-2xl transition-colors duration-200 ${
              activeFormats.underline 
                ? 'bg-[#5b50ff] text-white' 
                : 'text-[#5b50ff] hover:bg-[#f0eeff]'
            }`}
            title="Souligné"
            disabled={isAnalyzing}
          >
            <span className="underline text-sm">U</span>
          </button>
        </div>
        
        <div className="h-7 w-px bg-[#E3E2E5] mx-2"></div>
        
        {/* Groupe 2: Titres et paragraphes */}
        <div className="flex items-center">
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              if (activeFormats.h1) {
                document.execCommand('formatBlock', false, '<p>');
              } else {
                document.execCommand('formatBlock', false, '<h1>');
              }
              setTimeout(() => {
                handleFormatAction('checkFormat');
              }, 10);
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-2xl transition-colors duration-200 ${
              activeFormats.h1 
                ? 'bg-[#5b50ff] text-white' 
                : 'text-[#5b50ff] hover:bg-[#f0eeff]'
            }`}
            title="Titre H1"
          >
            <span className="font-bold text-xs">H1</span>
          </button>
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              if (activeFormats.h2) {
                document.execCommand('formatBlock', false, '<p>');
              } else {
                document.execCommand('formatBlock', false, '<h2>');
              }
              setTimeout(() => {
                handleFormatAction('checkFormat');
              }, 10);
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-2xl transition-colors duration-200 ${
              activeFormats.h2 
                ? 'bg-[#5b50ff] text-white' 
                : 'text-[#5b50ff] hover:bg-[#f0eeff]'
            }`}
            title="Titre H2"
          >
            <span className="font-bold text-xs">H2</span>
          </button>
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              if (activeFormats.h3) {
                document.execCommand('formatBlock', false, '<p>');
              } else {
                document.execCommand('formatBlock', false, '<h3>');
              }
              setTimeout(() => {
                handleFormatAction('checkFormat');
              }, 10);
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-2xl transition-colors duration-200 ${
              activeFormats.h3 
                ? 'bg-[#5b50ff] text-white' 
                : 'text-[#5b50ff] hover:bg-[#f0eeff]'
            }`}
            title="Titre H3"
          >
            <span className="font-bold text-xs">H3</span>
          </button>
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              document.execCommand('formatBlock', false, '<p>');
              setTimeout(() => {
                handleFormatAction('checkFormat');
              }, 10);
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-2xl transition-colors duration-200 ${
              activeFormats.p 
                ? 'bg-[#5b50ff] text-white' 
                : 'text-[#5b50ff] hover:bg-[#f0eeff]'
            }`}
            title="Paragraphe"
          >
            <span className="text-xs">P</span>
          </button>
        </div>
        
        <div className="h-7 w-px bg-[#E3E2E5] mx-2"></div>
        
        {/* Groupe 3: Liens et images */}
        <div className="flex items-center">
          <button 
            onClick={handleLinkButtonClick}
            className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[#f0eeff] transition-all" 
            style={{ color: isLinkSelected ? '#5b50ff' : '#838796' }} 
            title="Insérer un lien"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          </button>
          {isLinkSelected && (
            <button
              onClick={handleRemoveLink}
              className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[#f0eeff] transition-all text-[#dc2626]" 
              title="Supprimer le lien"
              disabled={isAnalyzing}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <button 
            onClick={handleImageButtonClick}
            className={`flex items-center justify-center w-8 h-8 rounded-2xl transition-colors duration-200 text-[#5b50ff] hover:bg-[#f0eeff]`}
            title="Insérer une image"
            disabled={isAnalyzing}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="h-7 w-px bg-[#E3E2E5] mx-2"></div>
        
        {/* Groupe 4: Listes */}
        <div className="flex items-center">
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              if (activeFormats.ul) {
                document.execCommand('formatBlock', false, '<p>');
              } else {
                document.execCommand('insertUnorderedList', false);
              }
              setTimeout(() => {
                handleFormatAction('checkFormat');
              }, 10);
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-2xl transition-colors duration-200 ${
              activeFormats.ul 
                ? 'bg-[#5b50ff] text-white' 
                : 'text-[#5b50ff] hover:bg-[#f0eeff]'
            }`}
            title="Liste à puces"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 100-2 1 1 0 000 2zm0 7a1 1 0 100-2 1 1 0 000 2zm0 7a1 1 0 100-2 1 1 0 000 2zm12-14a1 1 0 10-2 0v12a1 1 0 102 0V4z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              if (activeFormats.ol) {
                document.execCommand('formatBlock', false, '<p>');
              } else {
                document.execCommand('insertOrderedList', false);
              }
              setTimeout(() => {
                handleFormatAction('checkFormat');
              }, 10);
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-2xl transition-colors duration-200 ${
              activeFormats.ol 
                ? 'bg-[#5b50ff] text-white' 
                : 'text-[#5b50ff] hover:bg-[#f0eeff]'
            }`}
            title="Liste numérotée"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a1 1 0 011-1h12a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex items-center">
        <button
          onClick={handleAnalyzeContent}
          disabled={isAnalyzing}
          className={`px-6 py-2 text-sm font-light rounded-2xl focus:outline-none shadow-sm transform hover:translate-y-[-2px] transition-colors duration-200 ${
            isAnalyzing 
              ? 'text-gray-400 border border-gray-400 cursor-not-allowed' 
              : 'text-[#5b50ff] border border-[#5b50ff] border-opacity-30 bg-white hover:bg-[#f0eeff] hover:border-opacity-50'
          }`}
        >
          {isAnalyzing ? (
            <div className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyse en cours...</span>
            </div>
          ) : 'Analyser le contenu'}
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
