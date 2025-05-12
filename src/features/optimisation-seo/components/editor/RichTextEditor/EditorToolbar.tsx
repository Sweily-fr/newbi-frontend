import React from 'react';

interface EditorToolbarProps {
  activeFormats: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    h1: boolean;
    h2: boolean;
    h3: boolean;
    p: boolean;
    ul: boolean;
    ol: boolean;
  };
  isLinkSelected: boolean;
  isAnalyzing: boolean;
  handleFormatAction: (action: string, value?: string) => void;
  handleRemoveLink: () => void;
  handleLinkButtonClick: (e: React.MouseEvent) => void;
  handleImageButtonClick: (e: React.MouseEvent) => void;
  handleAnalyzeContent: () => void;
}

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
    <div className="flex h-[70px] justify-between items-center bg-[#f0eeff] border-b border-[#e6e1ff] p-2 f top-0">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Groupe 1: Formatage de texte de base */}
        <div className="flex items-center">
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormatAction('bold');
            }}
            className={`p-1.5 rounded hover:bg-[#f0eeff] transition-colors duration-200 ${activeFormats.bold ? 'bg-[#d8d3ff]' : ''}`}
            title="Gras"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="#5b50ff">
              <text x="6" y="14" fontSize="12" fontWeight="bold">B</text>
            </svg>
          </button>
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormatAction('italic');
            }}
            className={`p-1.5 rounded hover:bg-[#e6e1ff] transition-colors duration-200 ${activeFormats.italic ? 'bg-[#d8d3ff]' : ''}`}
            title="Italique"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <text x="8" y="14" fontSize="12" fontStyle="italic">I</text>
            </svg>
          </button>
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormatAction('underline');
            }}
            className={`p-1.5 rounded hover:bg-[#e6e1ff] transition-colors duration-200 ${activeFormats.underline ? 'bg-[#d8d3ff]' : ''}`}
            title="Souligné"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <text x="6" y="12" fontSize="12" textDecoration="underline">U</text>
              <line x1="5" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
        
        <div className="border-r border-gray-300 h-6"></div>
        
        {/* Groupe 2: Titres et paragraphes */}
        <div className="flex items-center">
          <button 
            className={`p-1.5 rounded hover:bg-[#e6e1ff] transition-colors duration-200 min-w-[28px] text-center ${activeFormats.h1 ? 'bg-[#d8d3ff]' : ''}`}
            title="Titre H1"
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormatAction('formatBlock', '<h1>');
            }}
          >
            <span className="font-bold text-sm">H1</span>
          </button>
          <button 
            className={`p-1.5 rounded hover:bg-[#e6e1ff] transition-colors duration-200 min-w-[28px] text-center ${activeFormats.h2 ? 'bg-[#d8d3ff]' : ''}`}
            title="Titre H2"
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormatAction('formatBlock', '<h2>');
            }}
          >
            <span className="font-bold text-sm">H2</span>
          </button>
          <button 
            className={`p-1.5 rounded hover:bg-[#e6e1ff] transition-colors duration-200 min-w-[28px] text-center ${activeFormats.h3 ? 'bg-[#d8d3ff]' : ''}`}
            title="Titre H3"
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormatAction('formatBlock', '<h3>');
            }}
          >
            <span className="font-bold text-sm">H3</span>
          </button>
          <button 
            className={`p-1.5 rounded hover:bg-[#e6e1ff] transition-colors duration-200 min-w-[28px] text-center ${activeFormats.p ? 'bg-[#d8d3ff]' : ''}`}
            title="Paragraphe"
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormatAction('formatBlock', '<p>');
            }}
          >
            <span className="text-sm">P</span>
          </button>
        </div>
        
        <div className="border-r border-gray-300 h-6"></div>
        
        {/* Groupe 3: Liens et images */}
        <div className="flex items-center">
          <button 
            onMouseDown={handleLinkButtonClick}
            className="p-1.5 rounded hover:bg-gray-200"
            title="Insérer un lien"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          </button>
          {/* Bouton pour supprimer un lien - visible uniquement lorsqu'un lien est sélectionné */}
          {isLinkSelected && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                handleRemoveLink();
              }}
              className="p-1.5 rounded hover:bg-[#e6e1ff] bg-red-50 transition-colors duration-200"
              title="Supprimer le lien"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <button 
            onMouseDown={handleImageButtonClick}
            className="p-1.5 rounded hover:bg-gray-200"
            title="Insérer une image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="border-r border-gray-300 h-6"></div>
        
        {/* Groupe 4: Listes */}
        <div className="flex items-center">
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormatAction('insertUnorderedList');
            }}
            className={`p-1.5 rounded hover:bg-[#e6e1ff] transition-colors duration-200 ${activeFormats.ul ? 'bg-[#d8d3ff]' : ''}`}
            title="Liste à puces"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="4" cy="4" r="1.5" />
              <rect x="7" y="3" width="10" height="2" rx="1" />
              <circle cx="4" cy="10" r="1.5" />
              <rect x="7" y="9" width="10" height="2" rx="1" />
              <circle cx="4" cy="16" r="1.5" />
              <rect x="7" y="15" width="10" height="2" rx="1" />
            </svg>
          </button>
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormatAction('insertOrderedList');
            }}
            className={`p-1.5 rounded hover:bg-[#e6e1ff] transition-colors duration-200 ${activeFormats.ol ? 'bg-[#d8d3ff]' : ''}`}
            title="Liste numérotée"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <text x="3" y="5" fontSize="5" fontWeight="bold">1</text>
              <rect x="7" y="3" width="10" height="2" rx="1" />
              <text x="3" y="11" fontSize="5" fontWeight="bold">2</text>
              <rect x="7" y="9" width="10" height="2" rx="1" />
              <text x="3" y="17" fontSize="5" fontWeight="bold">3</text>
              <rect x="7" y="15" width="10" height="2" rx="1" />
            </svg>
          </button>
        </div>
      </div>
      <button
        onClick={handleAnalyzeContent}
        disabled={isAnalyzing}
        className={`px-4 py-2 rounded-md text-white font-medium flex items-center transition-all duration-200 ${isAnalyzing ? 'bg-[#8a82ff] cursor-not-allowed' : 'bg-[#5b50ff] hover:bg-[#4a41e0] shadow-sm hover:shadow'}`}
      >
        {isAnalyzing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyse en cours...
          </>
        ) : (
          <>
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Analyser mon article
          </>
        )}
      </button>
    </div>
  );
};

export default EditorToolbar;
