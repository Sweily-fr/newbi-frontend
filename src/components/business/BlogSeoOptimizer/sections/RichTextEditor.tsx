import React, { useEffect, useRef } from 'react';
import { useBlogSeo } from '../context';
import { ContentAnalysisResult } from '../types';

// Importation de l'éditeur CKEditor (à installer via npm)
// npm install @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic
// Note: Dans un environnement réel, vous devriez importer CKEditor comme ceci:
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Pour cette démonstration, nous utiliserons un éditeur simplifié
interface RichTextEditorProps {
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ placeholder = 'Commencez à rédiger votre contenu ici...' }) => {
  const { state, setContent } = useBlogSeo();
  const editorRef = useRef<HTMLDivElement>(null);
  const { analysisResults } = state;
  
  // État pour suivre quelles catégories sont dépliées
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({});

  // Initialisation de l'éditeur
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = state.content;
      editorRef.current.setAttribute('contenteditable', 'true');
      
      // Gestion des événements d'édition
      const handleInput = () => {
        if (editorRef.current) {
          setContent(editorRef.current.innerHTML);
        }
      };
      
      editorRef.current.addEventListener('input', handleInput);
      
      return () => {
        editorRef.current?.removeEventListener('input', handleInput);
      };
    }
  }, [setContent]);

  // Barre d'outils simplifiée
  const handleFormatAction = (action: string) => {
    document.execCommand(action, false);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Fonction pour obtenir la couleur de la bordure en fonction du statut
  const getStatusBorderColor = (status: 'good' | 'improvement' | 'problem') => {
    switch (status) {
      case 'good':
        return 'border-l-4 border-green-500';
      case 'improvement':
        return 'border-l-4 border-orange-500';
      case 'problem':
        return 'border-l-4 border-red-500';
      default:
        return 'border-l-4 border-gray-300';
    }
  };

  // Fonction pour obtenir l'icône en fonction du statut
  const getStatusIcon = (status: 'good' | 'improvement' | 'problem') => {
    switch (status) {
      case 'good':
        return (
          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'improvement':
        return (
          <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'problem':
        return (
          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Fonction pour grouper les résultats par catégorie
  const groupResultsByCategory = (results: ContentAnalysisResult[]) => {
    const grouped: Record<string, ContentAnalysisResult[]> = {
      keywords: [],
      structure: [],
      readability: [],
      meta: [],
      links: [],
      images: []
    };

    results.forEach(result => {
      if (grouped[result.category]) {
        grouped[result.category].push(result);
      }
    });

    return grouped;
  };

  // Fonction pour obtenir le titre de la catégorie
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'keywords':
        return 'Mots-clés';
      case 'structure':
        return 'Structure du contenu';
      case 'readability':
        return 'Lisibilité';
      case 'meta':
        return 'Méta-données';
      case 'links':
        return 'Liens';
      case 'images':
        return 'Images';
      default:
        return category;
    }
  };

  // Fonction pour obtenir l'icône de la catégorie
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'keywords':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        );
      case 'structure':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        );
      case 'readability':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        );
      case 'meta':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'links':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'images':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const groupedResults = groupResultsByCategory(analysisResults);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-2/3 border border-gray-300 rounded-md overflow-hidden">
        <div className="bg-gray-100 border-b border-gray-300 p-2 flex flex-wrap gap-2">
        <button 
          onClick={() => handleFormatAction('bold')}
          className="p-1 rounded hover:bg-gray-200"
          title="Gras"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.5 10a2.5 2.5 0 01-2.5 2.5H6.5a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h4.5a2.5 2.5 0 012.5 2.5v5z" />
            <path d="M14.5 15a2.5 2.5 0 01-2.5 2.5H6.5a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h5.5a2.5 2.5 0 012.5 2.5v5z" />
          </svg>
        </button>
        <button 
          onClick={() => handleFormatAction('italic')}
          className="p-1 rounded hover:bg-gray-200"
          title="Italique"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1.639l-2.959 6H13.5a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-5a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h1.639l2.959-6H6.5a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h3.5z" />
          </svg>
        </button>
        <button 
          onClick={() => handleFormatAction('underline')}
          className="p-1 rounded hover:bg-gray-200"
          title="Souligné"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 011 1v8a3 3 0 006 0V4a1 1 0 112 0v8a5 5 0 01-10 0V4a1 1 0 011-1z" />
            <path fillRule="evenodd" d="M5 15a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="border-r border-gray-300 mx-1 h-6"></div>
        <button 
          onClick={() => handleFormatAction('formatBlock')}
          className="p-1 rounded hover:bg-gray-200"
          title="Titre H1"
          onMouseDown={(e) => {
            e.preventDefault();
            document.execCommand('formatBlock', false, '<h1>');
            if (editorRef.current) {
              setContent(editorRef.current.innerHTML);
            }
          }}
        >
          <span className="font-bold">H1</span>
        </button>
        <button 
          onClick={() => handleFormatAction('formatBlock')}
          className="p-1 rounded hover:bg-gray-200"
          title="Titre H2"
          onMouseDown={(e) => {
            e.preventDefault();
            document.execCommand('formatBlock', false, '<h2>');
            if (editorRef.current) {
              setContent(editorRef.current.innerHTML);
            }
          }}
        >
          <span className="font-bold">H2</span>
        </button>
        <button 
          onClick={() => handleFormatAction('formatBlock')}
          className="p-1 rounded hover:bg-gray-200"
          title="Titre H3"
          onMouseDown={(e) => {
            e.preventDefault();
            document.execCommand('formatBlock', false, '<h3>');
            if (editorRef.current) {
              setContent(editorRef.current.innerHTML);
            }
          }}
        >
          <span className="font-bold">H3</span>
        </button>
        <button 
          onClick={() => handleFormatAction('formatBlock')}
          className="p-1 rounded hover:bg-gray-200"
          title="Paragraphe"
          onMouseDown={(e) => {
            e.preventDefault();
            document.execCommand('formatBlock', false, '<p>');
            if (editorRef.current) {
              setContent(editorRef.current.innerHTML);
            }
          }}
        >
          <span>P</span>
        </button>
        <div className="border-r border-gray-300 mx-1 h-6"></div>
        <button 
          onClick={() => {
            const url = prompt('Entrez l\'URL du lien:');
            if (url) {
              document.execCommand('createLink', false, url);
              if (editorRef.current) {
                setContent(editorRef.current.innerHTML);
              }
            }
          }}
          className="p-1 rounded hover:bg-gray-200"
          title="Insérer un lien"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          onClick={() => {
            const url = prompt('Entrez l\'URL de l\'image:');
            if (url) {
              document.execCommand('insertImage', false, url);
              
              // Ajouter un attribut alt à l'image
              setTimeout(() => {
                if (editorRef.current) {
                  const images = editorRef.current.querySelectorAll('img[src="' + url + '"]');
                  images.forEach(img => {
                    const alt = prompt('Entrez une description alternative pour l\'image:');
                    if (alt) {
                      img.setAttribute('alt', alt);
                    }
                  });
                  
                  setContent(editorRef.current.innerHTML);
                }
              }, 100);
            }
          }}
          className="p-1 rounded hover:bg-gray-200"
          title="Insérer une image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          onClick={() => handleFormatAction('insertUnorderedList')}
          className="p-1 rounded hover:bg-gray-200"
          title="Liste à puces"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 3a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          onClick={() => handleFormatAction('insertOrderedList')}
          className="p-1 rounded hover:bg-gray-200"
          title="Liste numérotée"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            <path d="M3 5a1 1 0 011-1h.01a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h.01a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h.01a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </button>
      </div>
        <div
          ref={editorRef}
          className="p-4 min-h-[300px] focus:outline-none"
          placeholder={placeholder}
        />
      </div>
      
      {/* Recommandations */}
      <div className="lg:w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recommandations</h2>
          
          {Object.entries(groupedResults).map(([category, results]) => (
            results.length > 0 && (
              <div key={category} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                {/* En-tête de la catégorie (toujours visible) */}
                <button 
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => setExpandedCategories(prev => ({
                    ...prev,
                    [category]: !prev[category]
                  }))}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{getCategoryIcon(category)}</span>
                    <h3 className="text-lg font-medium">{getCategoryTitle(category)}</h3>
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 text-gray-800">
                      {results.length}
                    </span>
                  </div>
                  <svg 
                    className={`h-5 w-5 transform transition-transform ${expandedCategories[category] ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Contenu de la catégorie (visible uniquement si déplié) */}
                {expandedCategories[category] && (
                  <div className="p-3 space-y-3 border-t border-gray-200">
                    {results
                      .sort((a, b) => {
                        // Trier par priorité puis par statut
                        const priorityOrder = { high: 0, medium: 1, low: 2 };
                        const statusOrder = { problem: 0, improvement: 1, good: 2 };
                        
                        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                          return priorityOrder[a.priority] - priorityOrder[b.priority];
                        }
                        
                        return statusOrder[a.status] - statusOrder[b.status];
                      })
                      .map(result => (
                        <div 
                          key={result.id} 
                          className={`p-3 bg-white rounded-lg border ${getStatusBorderColor(result.status)}`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-0.5">
                              {getStatusIcon(result.status)}
                            </div>
                            <div className="ml-3">
                              <h4 className="text-base font-medium">{result.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                              
                              {result.suggestions && result.suggestions.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700">Suggestions :</p>
                                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                                    {result.suggestions.map((suggestion, index) => (
                                      <li key={index}>{suggestion}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )
          ))}
          
          {analysisResults.length === 0 && (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="mt-2 text-gray-500">
                Commencez à rédiger votre contenu et ajoutez un mot-clé principal pour obtenir des recommandations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
