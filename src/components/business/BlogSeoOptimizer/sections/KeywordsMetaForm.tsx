import React, { useState } from 'react';
import { useBlogSeo } from '../context';

const KeywordsMetaForm: React.FC = () => {
  const { state, setKeywords, setMetaTags } = useBlogSeo();
  const [secondaryKeyword, setSecondaryKeyword] = useState('');

  // Gestion du mot-clé principal
  const handleMainKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords({
      ...state.keywords,
      main: e.target.value
    });
  };

  // Gestion des mots-clés secondaires
  const handleAddSecondaryKeyword = () => {
    if (secondaryKeyword.trim() && !state.keywords.secondary.includes(secondaryKeyword.trim())) {
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

  // Gestion des méta-tags
  const handleMetaTagChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetaTags({
      ...state.metaTags,
      [name]: value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Mots-clés</h2>
        
        {/* Mot-clé principal */}
        <div className="mb-4">
          <label htmlFor="main-keyword" className="block text-sm font-medium text-gray-700 mb-1">
            Mot-clé principal
          </label>
          <input
            type="text"
            id="main-keyword"
            value={state.keywords.main}
            onChange={handleMainKeywordChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez votre mot-clé principal"
          />
          <p className="mt-1 text-sm text-gray-500">
            Ce mot-clé sera utilisé pour l'analyse principale de votre contenu.
          </p>
        </div>
        
        {/* Mots-clés secondaires */}
        <div>
          <label htmlFor="secondary-keyword" className="block text-sm font-medium text-gray-700 mb-1">
            Mots-clés secondaires
          </label>
          <div className="flex">
            <input
              type="text"
              id="secondary-keyword"
              value={secondaryKeyword}
              onChange={(e) => setSecondaryKeyword(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ajouter un mot-clé secondaire"
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
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ajouter
            </button>
          </div>
          
          {/* Liste des mots-clés secondaires */}
          {state.keywords.secondary.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {state.keywords.secondary.map((keyword, index) => (
                <div key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveSecondaryKeyword(keyword)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-500 hover:bg-blue-300 focus:outline-none"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
