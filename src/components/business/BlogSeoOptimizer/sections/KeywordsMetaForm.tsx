import React, { useState, useCallback, useRef } from 'react';
import { useBlogSeo } from '../context';

const KeywordsMetaForm: React.FC = () => {
  const { state, setKeywords, setMetaTags } = useBlogSeo();
  const [secondaryKeyword, setSecondaryKeyword] = useState('');
  const [longTailKeyword, setLongTailKeyword] = useState('');

  // Référence pour suivre si un champ est en cours de modification
  const isUpdatingRef = useRef(false);
  
  // Gestion du mot-clé principal avec debounce pour éviter la perte de focus
  const handleMainKeywordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Mettre à jour immédiatement pour l'interface utilisateur
    if (!isUpdatingRef.current) {
      isUpdatingRef.current = true;
      
      // Utiliser setTimeout pour retarder la mise à jour de l'état global
      setTimeout(() => {
        setKeywords({
          ...state.keywords,
          main: newValue
        });
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [state.keywords, setKeywords]);

  // Gestion des mots-clés secondaires
  const handleAddSecondaryKeyword = () => {
    if (secondaryKeyword.trim() && 
        !state.keywords.secondary.includes(secondaryKeyword.trim()) && 
        state.keywords.secondary.length < 5) {
      setKeywords({
        ...state.keywords,
        secondary: [...state.keywords.secondary, secondaryKeyword.trim()]
      });
      setSecondaryKeyword('');
    }
  };

  const handleRemoveSecondaryKeyword = (keyword: string) => {
    setKeywords({
      ...state.keywords,
      secondary: state.keywords.secondary.filter(k => k !== keyword)
    });
  };
  
  // Gestion des mots-clés de longue traîne
  const handleAddLongTailKeyword = () => {
    if (longTailKeyword.trim() && 
        !state.keywords.longTail.includes(longTailKeyword.trim()) && 
        state.keywords.longTail.length < 5) {
      setKeywords({
        ...state.keywords,
        longTail: [...state.keywords.longTail, longTailKeyword.trim()]
      });
      setLongTailKeyword('');
    }
  };

  const handleRemoveLongTailKeyword = (keyword: string) => {
    setKeywords({
      ...state.keywords,
      longTail: state.keywords.longTail.filter(k => k !== keyword)
    });
  };

  // Gestion des méta-tags avec debounce pour éviter la perte de focus
  const handleMetaTagChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Mettre à jour immédiatement pour l'interface utilisateur
    if (!isUpdatingRef.current) {
      isUpdatingRef.current = true;
      
      // Utiliser setTimeout pour retarder la mise à jour de l'état global
      setTimeout(() => {
        setMetaTags({
          ...state.metaTags,
          [name]: value
        });
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [state.metaTags, setMetaTags]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#f0eeff]">
      <div className="p-6 border-b border-[#f0eeff]">
        <h2 className="text-xl font-semibold mb-4">Mots-clés</h2>
        
        {/* Mot-clé principal */}
        <div className="mb-4">
          <label htmlFor="main-keyword" className="block text-sm font-medium text-gray-700 mb-1">
            Mot-clé principal <span className="text-xs text-gray-500">(1 maximum)</span>
          </label>
          <input
            type="text"
            id="main-keyword"
            value={state.keywords.main}
            onChange={handleMainKeywordChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5b50ff] focus:border-[#5b50ff]"
            placeholder="Entrez votre mot-clé principal"
          />
          <p className="mt-1 text-sm text-gray-500">
            Ce mot-clé sera utilisé pour l'analyse principale de votre contenu.
          </p>
        </div>
        
        {/* Mots-clés secondaires */}
        <div className="mb-4">
          <label htmlFor="secondary-keyword" className="block text-sm font-medium text-gray-700 mb-1">
            Mots-clés secondaires <span className="text-xs text-gray-500">(5 maximum)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="secondary-keyword"
              value={secondaryKeyword}
              onChange={(e) => setSecondaryKeyword(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[#5b50ff] focus:border-[#5b50ff]"
              placeholder="Ajouter un mot-clé secondaire"
              disabled={state.keywords.secondary.length >= 5}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSecondaryKeyword();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddSecondaryKeyword}
              className="px-4 py-2 bg-[#5b50ff] text-white rounded-md hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff] disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={state.keywords.secondary.length >= 5}
            >
              Ajouter
            </button>
          </div>
          
          {/* Liste des mots-clés secondaires */}
          {state.keywords.secondary.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {state.keywords.secondary.map((keyword, index) => (
                <div key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f0eeff] text-[#5b50ff]">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveSecondaryKeyword(keyword)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#e6e1ff] text-[#5b50ff] hover:bg-[#d6d1ff] focus:outline-none"
                  >
                    <span className="sr-only">Supprimer</span>
                    <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                      <path d="M6.5 1.5l-5 5M1.5 1.5l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <p className="mt-1 text-sm text-gray-500">
            Ces mots-clés complémentaires aideront à enrichir votre contenu.
          </p>
        </div>
        
        {/* Mots-clés de longue traîne */}
        <div>
          <label htmlFor="long-tail-keyword" className="block text-sm font-medium text-gray-700 mb-1">
            Mots-clés de longue traîne <span className="text-xs text-gray-500">(5 maximum)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="long-tail-keyword"
              value={longTailKeyword}
              onChange={(e) => setLongTailKeyword(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5b50ff] focus:border-[#5b50ff]"
              placeholder="Ajouter un mot-clé de longue traîne"
              disabled={state.keywords.longTail.length >= 5}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddLongTailKeyword();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddLongTailKeyword}
              className="px-4 py-2 bg-[#5b50ff] text-white rounded-md hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff] disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={state.keywords.longTail.length >= 5}
            >
              Ajouter
            </button>
          </div>
          
          {/* Liste des mots-clés de longue traîne */}
          {state.keywords.longTail.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {state.keywords.longTail.map((keyword, index) => (
                <div key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f0eeff] text-[#5b50ff]">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveLongTailKeyword(keyword)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#e6e1ff] text-[#5b50ff] hover:bg-[#d6d1ff] focus:outline-none"
                  >
                    <span className="sr-only">Supprimer</span>
                    <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                      <path d="M6.5 1.5l-5 5M1.5 1.5l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <p className="mt-1 text-sm text-gray-500">
            Ces expressions plus longues ciblent des requêtes spécifiques et peuvent attirer un trafic qualifié.
          </p>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Méta-données</h2>
        
        {/* Titre */}
        <div className="mb-4">
          <label htmlFor="meta-title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre (balise title)
          </label>
          <input
            type="text"
            id="meta-title"
            name="title"
            value={state.metaTags.title}
            onChange={handleMetaTagChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5b50ff] focus:border-[#5b50ff]"
            placeholder="Entrez le titre de votre page"
          />
          <div className="mt-1 flex justify-between">
            <p className="text-sm text-gray-500">
              Idéalement entre 50 et 60 caractères.
            </p>
            <p className={`text-sm ${state.metaTags.title.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
              {state.metaTags.title.length}/60
            </p>
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="meta-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (meta description)
          </label>
          <textarea
            id="meta-description"
            name="description"
            value={state.metaTags.description}
            onChange={handleMetaTagChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5b50ff] focus:border-[#5b50ff]"
            placeholder="Entrez la description de votre page"
          />
          <div className="mt-1 flex justify-between">
            <p className="text-sm text-gray-500">
              Idéalement entre 120 et 155 caractères.
            </p>
            <p className={`text-sm ${state.metaTags.description.length > 155 ? 'text-red-500' : 'text-gray-500'}`}>
              {state.metaTags.description.length}/155
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordsMetaForm;
