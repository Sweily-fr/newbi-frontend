import React, { useState, useCallback, useRef } from 'react';
import { useBlogSeo } from '../../hooks/useBlogSeo';
import { KeywordSuggestions } from './KeywordSuggestions';
import Tooltip from '../../../../components/common/Tooltip';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import './KeywordsMetaForm.css';

const KeywordsMetaForm: React.FC = () => {
  const { state, setKeywords, setMetaTags } = useBlogSeo();
  const [secondaryKeyword, setSecondaryKeyword] = useState('');
  const [longTailKeyword, setLongTailKeyword] = useState('');
  
  // Styles communs
  const inputStyle = "px-3 py-1.5 text-sm border border-[#5b50ff] border-opacity-30 rounded-2xl focus:outline-none focus:ring-[#5b50ff] focus:border-[#5b50ff] hover:border-opacity-50 transition-colors duration-200 text-gray-900";
  const buttonStyle = "px-4 py-1.5 text-sm text-[#5b50ff] border border-[#5b50ff] border-opacity-30 bg-white rounded-2xl hover:border-opacity-50 focus:outline-none transform hover:translate-y-[-1px] disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed font-light transition-colors duration-200";

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
  const handleAddSecondaryKeyword = (keyword?: string) => {
    const keywordToAdd = keyword || secondaryKeyword;
    if (keywordToAdd.trim() && 
        !state.keywords.secondary.includes(keywordToAdd.trim()) && 
        state.keywords.secondary.length < 5) {
      setKeywords({
        ...state.keywords,
        secondary: [...state.keywords.secondary, keywordToAdd.trim()]
      });
      if (!keyword) {
        setSecondaryKeyword('');
      }
    }
  };

  const handleAddButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleAddSecondaryKeyword();
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
    <div className="bg-white h-full flex flex-col px-1.5">
      <div className="pt-3 pb-1 flex-shrink-0">
        <h2 className="text-base font-semibold mb-2 text-[#5b50ff]">Mots-clés</h2>
        
        {/* Mot-clé principal */}
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <label htmlFor="main-keyword" className="block text-sm font-medium text-gray-700">
              Mot-clé principal <span className="text-[10px] text-gray-500">(1 maximum)</span>
            </label>
            <div className="flex items-center h-full">
              <Tooltip content="Ce mot-clé sera utilisé pour l'analyse principale de votre contenu." position="top">
                <button type="button" className="p-1 -mr-1 text-[#5b50ff] hover:text-[#4a41e0] focus:outline-none cursor-pointer">
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                </button>
              </Tooltip>
            </div>
          </div>
          <input
            type="text"
            id="main-keyword"
            value={state.keywords.main}
            onChange={handleMainKeywordChange}
            className={`w-full ${inputStyle}`}
            placeholder="Entrez votre mot-clé principal"
            style={{ color: 'black' }}
          />
        </div>
        
        {/* Mots-clés secondaires */}
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <label htmlFor="secondary-keyword" className="block text-sm font-medium text-gray-700">
              Mots-clés secondaires <span className="text-xs text-gray-500">(5 maximum)</span>
            </label>
            <div className="flex items-center h-full">
              <Tooltip content="Ajoutez jusqu'à 5 mots-clés secondaires pour affiner votre analyse SEO." position="top">
                <button type="button" className="p-1 -mr-1 text-[#5b50ff] hover:text-[#4a41e0] focus:outline-none cursor-pointer">
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              id="secondary-keyword"
              value={secondaryKeyword}
              onChange={(e) => setSecondaryKeyword(e.target.value)}
              className={`flex-1 ${inputStyle}`}
              placeholder="Ajouter un mot-clé secondaire"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSecondaryKeyword();
                }
              }}
              disabled={state.keywords.secondary.length >= 5}
            />
            <button
              type="button"
              onClick={handleAddButtonClick}
              className={buttonStyle}
              disabled={!secondaryKeyword.trim() || state.keywords.secondary.length >= 5}
            >
              Ajouter
            </button>
          </div>
          
          {/* Liste des mots-clés secondaires */}
          {state.keywords.secondary.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {state.keywords.secondary.map((keyword, index) => (
                <div 
                  key={`${keyword}-${index}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f0eeff] text-[#5b50ff]"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveSecondaryKeyword(keyword)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#e6e1ff] text-[#5b50ff] hover:bg-[#d6d1ff] focus:outline-none transition-colors duration-200"
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
          
          {/* Suggestions de mots-clés secondaires */}
          {state.keywords.main && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
              <KeywordSuggestions 
                mainKeyword={state.keywords.main} 
                onSelectSuggestion={handleAddSecondaryKeyword}
                selectedKeywords={state.keywords.secondary}
              />
            </div>
          )}
        </div>
        
        {/* Mots-clés de longue traîne */}
        <div>
          <div className="flex items-center mb-1">
            <label htmlFor="long-tail-keyword" className="block text-sm font-medium text-gray-700">
              Mots-clés de longue traîne <span className="text-[10px] text-gray-500">(5 maximum)</span>
            </label>
            <div className="flex items-center h-full">
              <Tooltip content="Les mots-clés de longue traîne sont des expressions plus spécifiques qui ciblent des intentions de recherche précises." position="top">
                <button type="button" className="p-1 -mr-1 text-[#5b50ff] hover:text-[#4a41e0] focus:outline-none cursor-pointer">
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              id="long-tail-keyword"
              value={longTailKeyword}
              onChange={(e) => setLongTailKeyword(e.target.value)}
              className={`flex-1 ${inputStyle}`}
              placeholder="Ajouter un mot-clé de longue traîne"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddLongTailKeyword();
                }
              }}
              disabled={state.keywords.longTail.length >= 5}
            />
            <button
              type="button"
              onClick={handleAddLongTailKeyword}
              className={buttonStyle}
              disabled={!longTailKeyword.trim() || state.keywords.longTail.length >= 5}
            >
              Ajouter
            </button>
          </div>
          
          {/* Liste des mots-clés de longue traîne */}
          {state.keywords.longTail.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {state.keywords.longTail.map((keyword, index) => (
                <div 
                  key={`${keyword}-${index}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f0eeff] text-[#5b50ff]"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveLongTailKeyword(keyword)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#e6e1ff] text-[#5b50ff] hover:bg-[#d6d1ff] focus:outline-none transition-colors duration-200"
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
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pt-3">
        <h2 className="text-base font-semibold mb-2 text-[#5b50ff] sticky top-0 bg-white pb-1 z-10">Méta-données</h2>
        
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
            className={`w-full ${inputStyle}`}
            placeholder="Titre de votre page"
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="meta-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (balise meta description)
          </label>
          <textarea
            id="meta-description"
            name="description"
            value={state.metaTags.description}
            onChange={handleMetaTagChange}
            rows={4}
            className={`w-full ${inputStyle} min-h-[120px]`}
            placeholder="Description de votre page"
          />
        </div>
      </div>
    </div>
  );
};

export default KeywordsMetaForm;
