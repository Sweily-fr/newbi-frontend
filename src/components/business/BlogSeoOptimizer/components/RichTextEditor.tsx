import React, { useEffect, useRef } from 'react';
import { useBlogSeo } from '../context';

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

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
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
  );
};

export default RichTextEditor;
