import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useBlogSeo } from '../context';
import { Modal } from '../../../ui/Modal';
import { ContentAnalysisResult } from '../types';
import { Notification } from '../../../feedback/Notification';
// Importation de l'éditeur CKEditor (à installer via npm)
// npm install @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic
// Note: Dans un environnement réel, vous devriez importer CKEditor comme ceci:
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Types pour les popups
interface LinkPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, isInternal: boolean, linkText?: string) => void;
  initialSelection: string;
  noSelection?: boolean;
}

interface ImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File, alt: string, width?: string, height?: string) => void;
}

interface EditImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageElement: HTMLImageElement | null;
  onSubmit: (alt: string, width: string, height: string) => void;
}

// Composant de popup pour l'ajout de liens utilisant le composant Modal
const LinkPopup: React.FC<LinkPopupProps> = ({ isOpen, onClose, onSubmit, initialSelection, noSelection = false }) => {
  const [url, setUrl] = useState('');
  const [linkText, setLinkText] = useState(initialSelection);
  const [isInternal, setIsInternal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      // Réinitialiser les valeurs à chaque ouverture
      setLinkText(initialSelection);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isOpen, initialSelection]);
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Ajouter un lien"
      size="md"
    >
      <div>
        {noSelection ? (
          <div className="mb-4">
            <label htmlFor="linkText" className="block text-sm font-medium text-gray-700 mb-1">Texte du lien</label>
            <input 
              type="text" 
              id="linkText" 
              value={linkText} 
              onChange={(e) => setLinkText(e.target.value)} 
              className="w-full px-3 py-2 border border-[#e6e1ff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] bg-[#f9f8ff]"
              placeholder="Texte du lien"
            />
            <p className="text-xs text-[#8a82ff] mt-1">Entrez le texte qui sera affiché pour ce lien</p>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-4 p-2 bg-[#f0eeff] rounded-md border border-[#e6e1ff]">
            Texte sélectionné: <strong>{initialSelection}</strong>
          </p>
        )}
        
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">URL du lien</label>
          <input 
            type="text" 
            id="url" 
            ref={inputRef}
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            className="w-full px-3 py-2 border border-[#e6e1ff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] bg-[#f9f8ff]"
            placeholder="https://exemple.com"
          />
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={isInternal} 
              onChange={(e) => setIsInternal(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Lien interne (vers une autre page du site)</span>
          </label>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Annuler
          </button>
          <button 
            onClick={() => {
              if (url.trim() && (!noSelection || (noSelection && linkText.trim()))) {
                onSubmit(url, isInternal, noSelection ? linkText : undefined);
                setUrl('');
                setLinkText('');
                setIsInternal(false);
              }
            }} 
            disabled={!url.trim() || (noSelection && !linkText.trim())}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] transition-all duration-200 ${url.trim() && (!noSelection || (noSelection && linkText.trim())) ? 'bg-[#5b50ff] hover:bg-[#4a41e0]' : 'bg-[#c4c0ff] cursor-not-allowed'}`}
          >
            Ajouter le lien
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Composant de popup pour la modification d'images existantes
const EditImagePopup: React.FC<EditImagePopupProps> = ({ isOpen, onClose, imageElement, onSubmit }) => {
  const [alt, setAlt] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null);
  
  // Initialiser les valeurs à partir de l'image sélectionnée
  useEffect(() => {
    if (isOpen && imageElement) {
      // Récupérer l'attribut alt
      setAlt(imageElement.alt || '');
      
      // Récupérer les dimensions
      const currentWidth = imageElement.width || parseInt(imageElement.style.width) || 0;
      const currentHeight = imageElement.height || parseInt(imageElement.style.height) || 0;
      
      setWidth(currentWidth ? currentWidth.toString() : '');
      setHeight(currentHeight ? currentHeight.toString() : '');
      
      // Stocker les dimensions originales pour le calcul du ratio
      if (currentWidth && currentHeight) {
        setOriginalDimensions({ width: currentWidth, height: currentHeight });
      } else {
        // Si les dimensions ne sont pas disponibles, charger l'image pour obtenir ses dimensions
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          if (!width) setWidth(img.width.toString());
          if (!height) setHeight(img.height.toString());
        };
        img.src = imageElement.src;
      }
    }
  }, [isOpen, imageElement, width, height]);
  
  // Gérer le changement de largeur avec maintien du ratio
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value;
    setWidth(newWidth);
    
    // Mettre à jour la hauteur si le ratio est maintenu et que les dimensions originales sont connues
    if (maintainAspectRatio && originalDimensions && newWidth) {
      const ratio = originalDimensions.height / originalDimensions.width;
      const newHeight = Math.round(parseInt(newWidth) * ratio);
      setHeight(newHeight.toString());
    }
  };
  
  // Gérer le changement de hauteur avec maintien du ratio
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value;
    setHeight(newHeight);
    
    // Mettre à jour la largeur si le ratio est maintenu et que les dimensions originales sont connues
    if (maintainAspectRatio && originalDimensions && newHeight) {
      const ratio = originalDimensions.width / originalDimensions.height;
      const newWidth = Math.round(parseInt(newHeight) * ratio);
      setWidth(newWidth.toString());
    }
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Modifier l'image"
      size="md"
    >
      <div>
        
        <div className="mb-4">
          <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-1">Texte alternatif (alt)</label>
          <input 
            type="text" 
            id="alt" 
            value={alt} 
            onChange={(e) => setAlt(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description de l'image pour l'accessibilité et le SEO"
          />
          <p className="text-xs text-gray-500 mt-1">Un bon texte alt décrit l'image et contient idéalement votre mot-clé principal.</p>
        </div>
        
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">Largeur (px)</label>
            <input 
              type="number" 
              id="width" 
              value={width} 
              onChange={handleWidthChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Auto"
              min="1"
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">Hauteur (px)</label>
            <input 
              type="number" 
              id="height" 
              value={height} 
              onChange={handleHeightChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Auto"
              min="1"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={maintainAspectRatio} 
              onChange={(e) => setMaintainAspectRatio(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Conserver les proportions</span>
          </label>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Annuler
          </button>
          <button 
            onClick={() => {
              onSubmit(alt, width, height);
              onClose();
            }} 
            className="px-4 py-2 text-sm font-medium text-white bg-[#5b50ff] rounded-md hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-[#5b50ff] transition-all duration-200"
          >
            Appliquer les modifications
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Composant de popup pour l'ajout d'images
const ImagePopup: React.FC<ImagePopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [preview, setPreview] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Réinitialiser les états quand la modal s'ouvre ou se ferme
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setAlt('');
      setPreview('');
      setWidth('');
      setHeight('');
      setOriginalDimensions(null);
    }
  }, [isOpen]);
  
  // Gérer le changement de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        
        // Réinitialiser les dimensions
        setWidth('');
        setHeight('');
        setOriginalDimensions(null);
        
        // Charger l'image pour obtenir ses dimensions originales
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  // Gérer le changement de largeur avec maintien du ratio
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value;
    setWidth(newWidth);
    
    if (maintainAspectRatio && originalDimensions && newWidth) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      const newHeight = Math.round(parseInt(newWidth) * aspectRatio);
      setHeight(newHeight.toString());
    }
  };
  
  // Gérer le changement de hauteur avec maintien du ratio
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value;
    setHeight(newHeight);
    
    if (maintainAspectRatio && originalDimensions && newHeight) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const newWidth = Math.round(parseInt(newHeight) * aspectRatio);
      setWidth(newWidth.toString());
    }
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Insérer une image"
      size="md"
    >
      <div>
        <div className="mb-4">
          <label htmlFor="image-file" className="block text-sm font-medium text-gray-700 mb-1">Sélectionner une image</label>
          <input 
            type="file" 
            id="image-file" 
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {preview && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Aperçu</p>
            <div className="border border-gray-300 rounded-md p-2 flex justify-center">
              <img 
                src={preview} 
                alt="Aperçu" 
                className="object-contain" 
                style={{
                  maxHeight: '200px',
                  width: width ? `${width}px` : 'auto',
                  height: height ? `${height}px` : 'auto'
                }}
              />
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="alt-text" className="block text-sm font-medium text-gray-700 mb-1">Description alternative (alt)</label>
          <input 
            type="text" 
            id="alt-text" 
            value={alt} 
            onChange={(e) => setAlt(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description de l'image pour l'accessibilité"
          />
        </div>
        
        <div className="mb-6">
          <p className="block text-sm font-medium text-gray-700 mb-1">Dimensions de l'image</p>
          
          <div className="flex items-center space-x-2 mb-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={maintainAspectRatio} 
                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Conserver les proportions</span>
            </label>
            
            {originalDimensions && (
              <span className="text-xs text-gray-500">
                Dimensions originales: {originalDimensions.width} × {originalDimensions.height}px
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="image-width" className="block text-sm font-medium text-gray-700 mb-1">Largeur (px)</label>
              <input 
                type="number" 
                id="image-width" 
                value={width} 
                onChange={handleWidthChange}
                placeholder={originalDimensions ? originalDimensions.width.toString() : "Auto"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="image-height" className="block text-sm font-medium text-gray-700 mb-1">Hauteur (px)</label>
              <input 
                type="number" 
                id="image-height" 
                value={height} 
                onChange={handleHeightChange}
                placeholder={originalDimensions ? originalDimensions.height.toString() : "Auto"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Annuler
          </button>
          <button 
            onClick={() => {
              if (file) {
                onSubmit(file, alt, width, height);
              }
            }} 
            disabled={!file}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] transition-all duration-200 ${file ? 'bg-[#5b50ff] hover:bg-[#4a41e0]' : 'bg-[#c4c0ff] cursor-not-allowed'}`}
          >
            Insérer l'image
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Pour cette démonstration, nous utiliserons un éditeur simplifié
interface RichTextEditorProps {
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ placeholder = 'Commencez à rédiger votre contenu ici...' }) => {
  const { state, setContent, analyzeContent } = useBlogSeo();
  const editorRef = useRef<HTMLDivElement>(null);
  const { analysisResults } = state;
  
  // État pour suivre si l'analyse est en cours
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // État pour suivre quelles catégories sont dépliées
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // États pour les popups
  const [isLinkPopupOpen, setIsLinkPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isEditImagePopupOpen, setIsEditImagePopupOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [isLinkSelected, setIsLinkSelected] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  
  // États pour suivre les formats actifs
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    h1: false,
    h2: false,
    h3: false,
    p: false,
    ul: false,
    ol: false
  });
  
  // État pour suivre le nombre de mots et son évaluation
  const [currentWordCount, setCurrentWordCount] = useState(0);

  // Stocker les URLs d'objets créés pour les images
  const objectUrlsRef = useRef<string[]>([]);
  
  // Fonction pour vérifier les formats actifs
  const checkActiveFormats = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    // Vérifier les formats actifs
    const isBold = document.queryCommandState('bold');
    const isItalic = document.queryCommandState('italic');
    const isUnderline = document.queryCommandState('underline');
    
    // Vérifier les formats de bloc
    let isH1 = false, isH2 = false, isH3 = false, isP = false, isUl = false, isOl = false;
    
    // Trouver le noeud parent actuel
    const parentNode = selection.anchorNode?.parentElement;
    if (parentNode) {
      // Vérifier les titres et paragraphes
      isH1 = !!parentNode.closest('h1');
      isH2 = !!parentNode.closest('h2');
      isH3 = !!parentNode.closest('h3');
      isP = !!parentNode.closest('p') && !isH1 && !isH2 && !isH3;
      
      // Vérifier les listes
      isUl = !!parentNode.closest('ul');
      isOl = !!parentNode.closest('ol');
    }
    
    // Mettre à jour les états
    setActiveFormats({
      bold: isBold,
      italic: isItalic,
      underline: isUnderline,
      h1: isH1,
      h2: isH2,
      h3: isH3,
      p: isP,
      ul: isUl,
      ol: isOl
    });
    
    // Vérifier si un lien est sélectionné
    const linkElement = parentNode?.closest('a');
    setIsLinkSelected(!!linkElement);
  };
  
  // Initialisation de l'éditeur
  useEffect(() => {
    if (editorRef.current) {
      // Rendre l'éditeur éditable
      editorRef.current.contentEditable = 'true';
      // Ne pas prendre automatiquement le focus pour éviter d'interférer avec les autres champs
      // editorRef.current.focus(); -- Supprimé pour éviter la perte de focus dans les champs de métadonnées
      
      // Ajouter la classe 'empty' si l'éditeur est vide pour afficher le placeholder
      const updateEmptyClass = () => {
        if (editorRef.current) {
          if (editorRef.current.innerHTML.trim() === '') {
            editorRef.current.classList.add('empty');
          } else {
            editorRef.current.classList.remove('empty');
          }
        }
      };
      
      // Initialiser l'état empty
      updateEmptyClass();
      
      // Ajouter un écouteur d'événement pour détecter les changements
      const handleInput = () => {
        if (editorRef.current) {
          // Mettre à jour le contenu à chaque modification
          const newContent = editorRef.current.innerHTML;
          setContent(newContent);
          
          // Calculer et mettre à jour le nombre de mots
          const count = calculateWordCount(newContent);
          setCurrentWordCount(count);
          
          // Mettre à jour la classe empty
          updateEmptyClass();
          
          // Vérifier les formats actifs
          checkActiveFormats();
        }
      };
      
      // Gérer le collage de contenu pour nettoyer automatiquement les espaces et supprimer la mise en forme
      const handlePaste = (e: ClipboardEvent) => {
        // Empêcher le comportement par défaut du navigateur
        e.preventDefault();
        
        // Récupérer le contenu collé
        const clipboardData = e.clipboardData;
        if (!clipboardData) return; // Sécurité pour éviter les erreurs null
        
        let finalContent = '';
        
        // Vérifier si le contenu collé contient du HTML
        if (clipboardData.types && clipboardData.types.includes('text/html')) {
          const htmlContent = clipboardData.getData('text/html');
          
          // Créer un élément temporaire pour analyser le HTML
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = htmlContent;
          
          // Extraire les images du HTML
          const images = tempDiv.querySelectorAll('img');
          const imageHtml: string[] = [];
          
          // Conserver les images avec leurs attributs
          images.forEach(img => {
            // Créer une copie de l'image sans styles inline
            const cleanImg = document.createElement('img');
            // Conserver uniquement les attributs essentiels
            if (img.src) cleanImg.src = img.src;
            if (img.alt) cleanImg.alt = img.alt;
            if (img.width) cleanImg.width = img.width;
            if (img.height) cleanImg.height = img.height;
            
            // Ajouter l'image au contenu final
            imageHtml.push(cleanImg.outerHTML);
          });
          
          // Obtenir le texte brut
          const plainText = clipboardData.getData('text/plain');
          
          // Traiter le texte brut
          const paragraphs = plainText.split(/\n{2,}/);
          
          // Convertir chaque paragraphe en balise <p>
          let textContent = paragraphs
            .map(para => {
              if (!para.trim()) return '';
              return '<p>' + para.trim().replace(/\n/g, '<br>') + '</p>';
            })
            .filter(Boolean)
            .join('');
          
          // Si aucun paragraphe n'a été trouvé, créer un paragraphe simple
          if (!textContent) {
            textContent = '<p>' + plainText.trim() + '</p>';
          }
          
          // Réinsérer les images dans le contenu aux positions approximatives
          if (imageHtml.length > 0) {
            // Diviser le contenu en paragraphes
            const contentParts = textContent.split('</p>');
            
            // Répartir les images dans le contenu
            let imageIndex = 0;
            finalContent = contentParts.map((part, index) => {
              if (!part.trim()) return '';
              
              // Ajouter l'image après certains paragraphes
              let result = part + '</p>';
              
              // Ajouter une image après chaque 2-3 paragraphes environ
              if (imageIndex < imageHtml.length && (index + 1) % 3 === 0) {
                result += '<p>' + imageHtml[imageIndex] + '</p>';
                imageIndex++;
              }
              
              return result;
            }).join('');
            
            // Ajouter les images restantes à la fin
            while (imageIndex < imageHtml.length) {
              finalContent += '<p>' + imageHtml[imageIndex] + '</p>';
              imageIndex++;
            }
          } else {
            finalContent = textContent;
          }
        } else {
          // Si pas de HTML, utiliser simplement le texte brut
          const plainText = clipboardData.getData('text/plain');
          
          // Traitement du texte brut pour le formater correctement
          const paragraphs = plainText.split(/\n{2,}/);
          
          // Convertir chaque paragraphe en balise <p>
          finalContent = paragraphs
            .map(para => {
              if (!para.trim()) return '';
              return '<p>' + para.trim().replace(/\n/g, '<br>') + '</p>';
            })
            .filter(Boolean)
            .join('');
          
          // Si aucun paragraphe n'a été trouvé, créer un paragraphe simple
          if (!finalContent) {
            finalContent = '<p>' + plainText.trim() + '</p>';
          }
        }
        
        // Nettoyer les espaces superflus
        const cleanedContent = cleanupExcessiveSpaces(finalContent);
        
        // Insérer le contenu nettoyé à la position du curseur
        document.execCommand('insertHTML', false, cleanedContent);
      };
      
      // Ajouter un écouteur pour la sélection
      const handleSelectionChange = () => {
        checkActiveFormats();
      };
      
      // Gestionnaire d'événements pour les clics sur les images
      const handleImageClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        // Vérifier si l'élément cliqué est une image
        if (target.tagName === 'IMG') {
          e.preventDefault();
          
          // Sélectionner l'image
          const imageElement = target as HTMLImageElement;
          setSelectedImage(imageElement);
          
          // Ouvrir la popup de modification d'image
          setIsEditImagePopupOpen(true);
        }
      };
      
      // Stocker une référence à l'élément courant pour le nettoyage
      const currentEditorRef = editorRef.current;
      currentEditorRef.addEventListener('input', handleInput);
      currentEditorRef.addEventListener('paste', handlePaste);
      currentEditorRef.addEventListener('click', handleImageClick);
      document.addEventListener('selectionchange', handleSelectionChange);
      
      // Capturer la valeur actuelle des URL d'objets pour le nettoyage
      // Cela résout l'avertissement de lint concernant la référence qui pourrait changer
      const currentObjectUrls = [...objectUrlsRef.current];
      
      // Nettoyage à la désactivation du composant
      return () => {
        // Nettoyer les écouteurs d'événements
        if (currentEditorRef) {
          currentEditorRef.removeEventListener('input', handleInput);
          currentEditorRef.removeEventListener('paste', handlePaste);
          currentEditorRef.removeEventListener('click', handleImageClick);
        }
        document.removeEventListener('selectionchange', handleSelectionChange);
        
        // Libérer les URLs d'objets capturés au moment de la création de l'effet
        currentObjectUrls.forEach(url => {
          URL.revokeObjectURL(url);
        });
      };
    }
  }, [setContent]);

  // Nous ne mettons plus de classe visuelle spéciale aux titres contenant le mot-clé
  // Les titres auront uniquement leur style de base (taille et gras)
  const highlightHeadingsWithKeywords = useCallback(() => {
    // Cette fonction est conservée pour maintenir la compatibilité avec le reste du code
    // mais elle ne fait plus rien de spécial aux titres
    return;
  }, []);
  
  // Appliquer la mise en évidence des mots-clés lorsque le contenu ou les mots-clés changent
  useEffect(() => {
    highlightHeadingsWithKeywords();
  }, [state.content, highlightHeadingsWithKeywords]);
  
  // Vérifier si la sélection contient un lien
  const checkForSelectedLink = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setIsLinkSelected(false);
      return;
    }
    
    // Vérifier si la sélection contient un lien
    let node = selection.anchorNode;
    while (node && node.nodeType !== Node.ELEMENT_NODE) {
      node = node.parentNode;
    }
    
    // Vérifier si le noeud est un lien ou contient un lien
    if (node) {
      if (node.nodeName === 'A') {
        setIsLinkSelected(true);
        return;
      }
      
      // Vérifier si la sélection contient un lien
      const range = selection.getRangeAt(0);
      const fragment = range.cloneContents();
      const links = fragment.querySelectorAll('a');
      
      setIsLinkSelected(links.length > 0);
    } else {
      setIsLinkSelected(false);
    }
  }, []);
  
  // Ajouter un écouteur de sélection pour détecter les liens
  useEffect(() => {
    const handleSelectionChange = () => {
      checkForSelectedLink();
    };
    
    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [checkForSelectedLink]);
  
  // Fonction pour supprimer un lien
  const handleRemoveLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    // Focus sur l'éditeur
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    // Utiliser la commande unlink pour supprimer le lien
    document.execCommand('unlink', false);
    
    // Réinitialiser la couleur du texte à la normale
    document.execCommand('foreColor', false, '#374151'); // Couleur de texte normale (gris foncé)
    
    // Supprimer le soulignement du texte
    setTimeout(() => {
      // On utilise setTimeout pour s'assurer que le unlink a été appliqué complètement
      // Utiliser directement removeFormat qui supprime tous les formatages (y compris le soulignement)
      document.execCommand('removeFormat', false);
      
      // Mettre à jour le contenu
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    }, 0);
    
    // Réinitialiser l'état
    setIsLinkSelected(false);
  };
  
  // Barre d'outils simplifiée
  const handleFormatAction = (action: string, value?: string) => {
    // S'assurer que l'éditeur a le focus avant d'appliquer le formatage
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    
    // Sauvegarder la sélection actuelle
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    
    // Obtenir l'élément actuellement sélectionné avant de le modifier
    let currentNode = range?.commonAncestorContainer as Node | null;
    // Remonter jusqu'à trouver un élément HTML (pas un noeud de texte)
    while (currentNode && currentNode.nodeType === Node.TEXT_NODE) {
      currentNode = currentNode.parentNode as Node | null;
    }
    
    // Exécuter la commande de formatage
    if (action === 'formatBlock' && value) {
      // Appliquer le formatage de bloc (titres ou paragraphe)
      document.execCommand(action, false, value);
      
      // Appliquer des styles supplémentaires pour les titres ou paragraphes
      setTimeout(() => {
        if (editorRef.current) {
          // Sélectionner l'élément nouvellement créé
          const tagName = value.replace(/[<>]/g, '');
          
          // Trouver l'élément qui vient d'être formaté
          let formattedElement: HTMLElement | null = null;
          
          // Si nous avons l'élément précédent, essayons de trouver le nouvel élément qui l'a remplacé
          if (range && range.startContainer) {
            // Trouver l'élément actuel à la position de la sélection
            let node = range.startContainer as Node;
            while (node && node.nodeType !== Node.ELEMENT_NODE) {
              node = node.parentNode as Node;
            }
            
            // Vérifier si c'est l'élément que nous cherchons
            if (node && node.nodeName.toLowerCase() === tagName.toLowerCase()) {
              formattedElement = node as HTMLElement;
            }
          }
          
          // Si nous n'avons pas trouvé l'élément, essayons de le trouver par la sélection actuelle
          if (!formattedElement) {
            const elements = editorRef.current.querySelectorAll(tagName);
            if (elements.length > 0) {
              formattedElement = elements[elements.length - 1] as HTMLElement;
            }
          }
          
          // Appliquer les styles appropriés
          if (formattedElement) {
            // Réinitialiser d'abord tous les styles
            formattedElement.style.fontSize = '';
            formattedElement.style.fontWeight = '';
            formattedElement.style.marginTop = '';
            formattedElement.style.marginBottom = '';
            formattedElement.style.color = '';
            
            // Appliquer des styles spécifiques selon le type d'élément
            if (tagName === 'h1') {
              formattedElement.style.fontSize = '2rem';
              formattedElement.style.fontWeight = 'bold';
              formattedElement.style.marginTop = '1.5rem';
              formattedElement.style.marginBottom = '1rem';
              formattedElement.style.color = '#111827';
            } else if (tagName === 'h2') {
              formattedElement.style.fontSize = '1.5rem';
              formattedElement.style.fontWeight = 'bold';
              formattedElement.style.marginTop = '1.25rem';
              formattedElement.style.marginBottom = '0.75rem';
              formattedElement.style.color = '#1f2937';
            } else if (tagName === 'h3') {
              formattedElement.style.fontSize = '1.25rem';
              formattedElement.style.fontWeight = 'bold';
              formattedElement.style.marginTop = '1rem';
              formattedElement.style.marginBottom = '0.5rem';
              formattedElement.style.color = '#374151';
            } else if (tagName === 'p') {
              // Réinitialiser les styles pour les paragraphes
              formattedElement.style.fontSize = '1rem';
              formattedElement.style.fontWeight = 'normal';
              formattedElement.style.marginTop = '0.5rem';
              formattedElement.style.marginBottom = '0.5rem';
              formattedElement.style.color = '#4b5563';
            }
          }
        }
      }, 0);
    } else if (action === 'insertUnorderedList' || action === 'insertOrderedList') {
      // Gérer spécifiquement les listes
      document.execCommand(action, false);
      
      // Appliquer des styles aux listes créées
      setTimeout(() => {
        if (editorRef.current) {
          // Déterminer le type de liste à rechercher
          const listType = action === 'insertUnorderedList' ? 'ul' : 'ol';
          
          // Trouver la liste nouvellement créée
          const lists = editorRef.current.querySelectorAll(listType);
          if (lists.length > 0) {
            // Prendre la dernière liste créée
            const newList = lists[lists.length - 1] as HTMLElement;
            
            // Appliquer des styles à la liste
            if (listType === 'ul') {
              newList.style.listStyleType = 'disc';
              newList.style.paddingLeft = '2rem';
              newList.style.marginTop = '0.5rem';
              newList.style.marginBottom = '0.5rem';
            } else {
              newList.style.listStyleType = 'decimal';
              newList.style.paddingLeft = '2rem';
              newList.style.marginTop = '0.5rem';
              newList.style.marginBottom = '0.5rem';
            }
            
            // Appliquer des styles aux éléments de liste
            const listItems = newList.querySelectorAll('li');
            listItems.forEach(item => {
              const li = item as HTMLElement;
              li.style.marginBottom = '0.25rem';
              li.style.color = '#4b5563';
            });
          }
        }
      }, 0);
    } else if (value) {
      document.execCommand(action, false, value);
    } else {
      document.execCommand(action, false);
    }
    
    // Mettre à jour le contenu avec un léger délai pour s'assurer que le formatage est appliqué
    setTimeout(() => {
      if (editorRef.current) {
        // Mettre à jour le contenu
        const currentContent = editorRef.current.innerHTML;
        
        // Vérifier si le contenu a vraiment changé pour éviter les mises à jour inutiles
        if (currentContent !== state.content) {
          setContent(currentContent);
        }
        
        // Appliquer la mise en évidence des mots-clés dans les titres
        highlightHeadingsWithKeywords();
      }
    }, 10);
    
    // Restaurer le focus sur l'éditeur
    if (editorRef.current) {
      editorRef.current.focus();
      
      // Restaurer la sélection si possible
      if (range) {
        try {
          selection?.removeAllRanges();
          selection?.addRange(range);
        } catch {
          // Ignorer les erreurs de sélection
        }
      }
    }
  };

  // Fonction pour obtenir la couleur de la bordure en fonction du statut
  const getStatusBorderColor = (status: 'good' | 'improvement' | 'problem') => {
    switch (status) {
      case 'good':
        return 'border-l-4 border-green-500';
      case 'improvement':
        return 'border-l-4 border-[#5b50ff]';
      case 'problem':
        return 'border-l-4 border-red-500';
      default:
        return 'border-l-4 border-gray-300';
    }
  };
  
  // Fonction pour obtenir l'évaluation du nombre de mots
  const getWordCountRating = (count: number): { label: string; color: string } => {
    if (count > 2500) {
      return { label: 'Excellent', color: 'text-green-600' };
    } else if (count >= 2000 && count <= 2500) {
      return { label: 'Très bien', color: 'text-green-500' };
    } else if (count >= 1500 && count < 2000) {
      return { label: 'Bien', color: 'text-[#5b50ff]' };
    } else if (count >= 1000 && count < 1500) {
      return { label: 'À améliorer', color: 'text-[#8a82ff]' };
    } else if (count >= 600 && count < 1000) {
      return { label: 'Insuffisant', color: 'text-orange-500' };
    } else {
      return { label: 'Médiocre', color: 'text-red-500' };
    }
  };
  
  // Fonction pour calculer le nombre de mots (harmonisée avec la fonction des statistiques)
  const calculateWordCount = (text: string): number => {
    // Nettoyage du contenu HTML pour l'analyse textuelle (même approche que dans utils.ts)
    const textContent = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Comptage des mots (même approche que dans utils.ts)
    const words = textContent.split(' ').filter(word => word.length > 0);
    return words.length;
  };
  
  // Fonction pour nettoyer les espaces superflus dans le contenu HTML
  const cleanupExcessiveSpaces = (content: string): string => {
    if (!content) return content;
    
    // 1. Nettoyer les espaces multiples entre les mots (en préservant les balises HTML)
    let cleanContent = content.replace(/([^>])\s{3,}([^<])/g, '$1 $2'); // Permet 1-2 espaces
    
    // 2. Nettoyer les espaces avant les balises fermantes et après les balises ouvrantes
    // Mais préserver les espaces pour les titres et paragraphes
    cleanContent = cleanContent.replace(/\s{2,}<\/(span|strong|em|a|b|i|u|code|mark)/g, '</$1');
    cleanContent = cleanContent.replace(/>(span|strong|em|a|b|i|u|code|mark)\s{2,}/g, '>$1');
    
    // 3. Préserver les espaces entre les titres et paragraphes, mais nettoyer les espaces excessifs
    // Conserver un espace après les balises ouvrantes de titre et paragraphe
    cleanContent = cleanContent.replace(/<(h[1-6]|p)>\s{3,}/g, '<$1> ');
    // Conserver un espace avant les balises fermantes de titre et paragraphe
    cleanContent = cleanContent.replace(/\s{3,}<\/(h[1-6]|p)>/g, ' </$1>');
    
    // 4. Nettoyer les espaces multiples dans les attributs
    cleanContent = cleanContent.replace(/([a-zA-Z-]+)="\s+([^"]*?)\s+"/g, '$1="$2"');
    
    // 5. Remplacer les sauts de ligne multiples par un seul saut de ligne
    cleanContent = cleanContent.replace(/(<br\s*\/?>){3,}/g, '<br><br>'); // Permet jusqu'à 2 sauts de ligne
    
    // 6. Conserver un espace entre les paragraphes et titres
    cleanContent = cleanContent.replace(/<\/(h[1-6]|p)>\s*<(h[1-6]|p)>/g, '</$1>\n<$2>');
    
    // 7. Supprimer uniquement les paragraphes complètement vides
    cleanContent = cleanContent.replace(/<p>\s*<\/p>/g, '');
    
    return cleanContent;
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
          <svg className="h-5 w-5 text-[#5b50ff]" fill="currentColor" viewBox="0 0 20 20">
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
        return 'Liens (internes & externes)';
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
      <div className="lg:w-2/3 relative bg-white rounded-lg shadow-md overflow-hidden border border-[#f0eeff]">
      {/* Compteur de mots avec évaluation */}
      <div className="absolute bottom-2 right-2 z-10 bg-white bg-opacity-90 rounded-md px-2 py-1 shadow-sm border border-[#e6e1ff] flex items-center space-x-2">
        <span className="text-xs text-gray-500">Mots:</span>
        <span className="text-sm font-medium">{currentWordCount}</span>
        <span className={`text-xs font-medium ${getWordCountRating(currentWordCount).color} ml-1 px-1.5 py-0.5 rounded-full text-xs bg-opacity-20 ${getWordCountRating(currentWordCount).color.replace('text-', 'bg-')}`}>({getWordCountRating(currentWordCount).label})</span>
      </div>
      {/* Barre d'outils */}
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
                onMouseDown={(e) => {
                  e.preventDefault();
                  // Capturer le texte sélectionné
                  const selection = window.getSelection();
                  
                  if (selection && selection.toString().trim() && selection.rangeCount > 0) {
                    // Sauvegarder le texte sélectionné
                    setSelectedText(selection.toString());
                    
                    // Sauvegarder la sélection (Range)
                    const range = selection.getRangeAt(0);
                    setSavedRange(range.cloneRange());
                    
                    // Ouvrir la popup avec le texte sélectionné
                    setIsLinkPopupOpen(true);
                  } else {
                    // Aucun texte sélectionné, ouvrir la popup en mode "sans sélection"
                    setSelectedText('');
                    
                    // Sauvegarder la position du curseur
                    if (selection && selection.rangeCount > 0) {
                      setSavedRange(selection.getRangeAt(0).cloneRange());
                    }
                    
                    // Ouvrir la popup sans texte sélectionné
                    setIsLinkPopupOpen(true);
                  }
                }}
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
                onMouseDown={(e) => {
                  e.preventDefault();
                  
                  // Sauvegarder la sélection actuelle pour pouvoir insérer l'image au bon endroit
                  const selection = window.getSelection();
                  if (selection && selection.rangeCount > 0) {
                    setSavedRange(selection.getRangeAt(0).cloneRange());
                  }
                  
                  // Ouvrir la popup d'image
                  setIsImagePopupOpen(true);
                }}
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
            onClick={() => {
              setIsAnalyzing(true);
              
              // Mettre à jour le contenu avant de lancer l'analyse
              if (editorRef.current) {
                setContent(editorRef.current.innerHTML);
              }
              
              // Lancer l'analyse du contenu après un court délai pour s'assurer que le contenu est mis à jour
              setTimeout(() => {
                analyzeContent();
                setIsAnalyzing(false);
              }, 300);
            }}
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
        <style dangerouslySetInnerHTML={{
          __html: `
            /* La classe keyword-highlight est désactivée - les titres n'ont plus de bordure spéciale */
            .keyword-highlight {
              /* Styles supprimés */
            }
            
            /* Styles pour les liens */
            [contenteditable] a[data-link-type="internal"] {
              color: #5b50ff;
              text-decoration: underline;
              transition: color 0.2s ease;
            }
            
            [contenteditable] a[data-link-type="internal"]:hover {
              color: #4a41e0;
            }
            
            [contenteditable] a[data-link-type="external"] {
              color: #8a82ff;
              text-decoration: underline;
              transition: color 0.2s ease;
            }
            
            [contenteditable] a[data-link-type="external"]:hover {
              color: #7a71ff;
            }
            
            /* Styles pour les titres */
            [contenteditable] h1 {
              font-size: 2rem;
              font-weight: bold;
              margin-top: 1.5rem;
              margin-bottom: 1rem;
              color: #111827;
            }
            
            [contenteditable] h2 {
              font-size: 1.5rem;
              font-weight: bold;
              margin-top: 1.25rem;
              margin-bottom: 0.75rem;
              color: #1f2937;
            }
            
            [contenteditable] h3 {
              font-size: 1.25rem;
              font-weight: bold;
              margin-top: 1rem;
              margin-bottom: 0.5rem;
              color: #374151;
            }
            
            [contenteditable] p {
              font-size: 1rem;
              margin-top: 0.5rem;
              margin-bottom: 0.5rem;
              color: #4b5563;
            }
            
            /* Style pour le placeholder */
            [contenteditable].empty:before {
              content: attr(data-placeholder);
              color: #9ca3af;
              font-style: italic;
              pointer-events: none;
              display: block;
            }
          `
        }} />
        <div
          ref={editorRef}
          className="p-4 focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:italic"
          data-placeholder={placeholder}
          contentEditable="true"
          onClick={() => {
            // Mettre le focus uniquement lors du clic dans l'éditeur
            if (editorRef.current) {
              editorRef.current.focus();
            }
          }}
          onFocus={() => {
            // Appliquer la mise en évidence des mots-clés dans les titres si du contenu existe
            if (editorRef.current && editorRef.current.innerHTML.trim() !== '') {
              highlightHeadingsWithKeywords();
            }
          }}
        />
      </div>
      
      {/* Recommandations */}
      <div className="lg:w-1/3 bg-white rounded-lg shadow-md overflow-hidden border border-[#f0eeff]">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recommandations</h2>
          
          {Object.entries(groupedResults).map(([category, results]) => (
            results.length > 0 && (
              <div key={category} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                {/* En-tête de la catégorie (toujours visible) */}
                <button 
                  className="w-full flex items-center justify-between p-3 bg-[#f9f8ff] hover:bg-[#f0eeff] transition-colors duration-200"
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
                          className={`p-3 bg-white rounded-lg border shadow-sm hover:shadow transition-all duration-200 ${getStatusBorderColor(result.status)}`}
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
                                    {result.suggestions.map((suggestion, index) => {
                                      // Vérifier si la suggestion concerne un lien interne ou externe
                                      // Utiliser une approche plus robuste avec des expressions régulières pour détecter les différentes formulations
                                      const suggestionLower = suggestion.toLowerCase();
                                      
                                      // Détection des liens internes avec différentes formulations possibles
                                      const internalLinkPatterns = [
                                        /lien\s+interne/,
                                        /liens\s+internes/,
                                        /lien\s+vers\s+(une\s+|)autre\s+page\s+(du\s+|de\s+votre\s+|de\s+ce\s+|du\s+même\s+)site/
                                      ];
                                      const isInternalLinkSuggestion = internalLinkPatterns.some(pattern => pattern.test(suggestionLower));
                                      
                                      // Détection des liens externes avec différentes formulations possibles
                                      const externalLinkPatterns = [
                                        /lien\s+externe/,
                                        /liens\s+externes/,
                                        /lien\s+internet/,
                                        /liens\s+internet/,
                                        /lien\s+vers\s+(un\s+|)autre\s+site/,
                                        /lien\s+vers\s+(un\s+|)site\s+externe/
                                      ];
                                      const isExternalLinkSuggestion = externalLinkPatterns.some(pattern => pattern.test(suggestionLower));
                                      
                                      return (
                                        <li key={index} className="flex items-start">
                                          {/* Afficher un indicateur visuel pour les liens internes */}
                                          {isInternalLinkSuggestion && (
                                            <span className="inline-flex items-center justify-center mr-1 text-[#5b50ff]">
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                              </svg>
                                            </span>
                                          )}
                                          
                                          {/* Afficher un indicateur visuel pour les liens externes */}
                                          {isExternalLinkSuggestion && (
                                            <span className="inline-flex items-center justify-center mr-1 text-[#8a82ff]">
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                              </svg>
                                            </span>
                                          )}
                                          
                                          {/* Texte de la suggestion */}
                                          <span className={`${isInternalLinkSuggestion ? 'text-[#5b50ff]' : isExternalLinkSuggestion ? 'text-[#8a82ff]' : ''}`}>
                                            {suggestion}
                                          </span>
                                        </li>
                                      );
                                    })}
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
      
      {/* Popup pour l'ajout de lien */}
      <LinkPopup 
        isOpen={isLinkPopupOpen} 
        onClose={() => setIsLinkPopupOpen(false)} 
        initialSelection={selectedText}
        noSelection={!selectedText.trim()}
        onSubmit={(url, isInternal, linkText) => {
          // Ajouter le lien avec un attribut data-link-type pour distinguer les liens internes et externes
          if (url && savedRange) {
            // Focus sur l'éditeur
            if (editorRef.current) {
              editorRef.current.focus();
            }
            
            // Restaurer la sélection précédemment sauvegardée
            const selection = window.getSelection();
            if (selection) {
              selection.removeAllRanges();
              selection.addRange(savedRange);
              
              // Si un texte de lien est fourni (cas où aucun texte n'était sélectionné)
              if (linkText) {
                // Insérer d'abord le texte du lien à la position du curseur
                document.execCommand('insertText', false, linkText);
                
                // Puis sélectionner ce texte nouvellement inséré
                const newRange = selection.getRangeAt(0);
                newRange.setStart(newRange.startContainer, newRange.startOffset - linkText.length);
                newRange.setEnd(newRange.endContainer, newRange.endOffset);
                selection.removeAllRanges();
                selection.addRange(newRange);
              }
              
              // Appliquer le lien
              document.execCommand('createLink', false, url);
              
              // Appliquer directement les styles et attributs au lien nouvellement créé
              // pour s'assurer que la couleur est appliquée immédiatement
              setTimeout(() => {
                if (editorRef.current) {
                  // Trouver tous les liens qui viennent d'être créés avec cette URL
                  const newLinks = Array.from(editorRef.current.querySelectorAll(`a[href="${url}"]`));
                  
                  // Appliquer les attributs et styles à chaque lien
                  newLinks.forEach(link => {
                    // Vérifier si le lien n'a pas déjà un attribut data-link-type
                    if (!link.hasAttribute('data-link-type')) {
                      // Appliquer l'attribut data-link-type
                      link.setAttribute('data-link-type', isInternal ? 'internal' : 'external');
                      
                      // Appliquer directement les styles pour s'assurer que la couleur est visible immédiatement
                      if (link instanceof HTMLElement) {
                        if (isInternal) {
                          link.style.color = '#5b50ff'; // Violet principal Newbi
                          link.style.textDecoration = 'underline';
                        } else {
                          link.style.color = '#8a82ff'; // Violet secondaire Newbi
                          link.style.textDecoration = 'underline';
                          
                          // Ajouter target="_blank" et rel="noopener noreferrer" pour les liens externes
                          link.setAttribute('target', '_blank');
                          link.setAttribute('rel', 'noopener noreferrer');
                        }
                      }
                    }
                  });
                  
                  // Mettre à jour le contenu
                  setContent(editorRef.current.innerHTML);
                }
              }, 0);
            }
          }
          
          // Réinitialiser la sélection sauvegardée et fermer la popup
          setSavedRange(null);
          setIsLinkPopupOpen(false);
        }}
      />
      
      {/* Popup pour l'ajout d'image */}
      <ImagePopup 
        isOpen={isImagePopupOpen} 
        onClose={() => setIsImagePopupOpen(false)}
        onSubmit={(file, alt, width, height) => {
          // Créer un URL pour l'image
          const imageUrl = URL.createObjectURL(file);
          
          // Stocker l'URL d'objet pour pouvoir le libérer plus tard
          objectUrlsRef.current.push(imageUrl);
          
          // Restaurer le focus et la sélection
          if (editorRef.current && savedRange) {
            editorRef.current.focus();
            
            const selection = window.getSelection();
            if (selection) {
              selection.removeAllRanges();
              selection.addRange(savedRange);
              
              // Insérer l'image
              handleFormatAction('insertImage', imageUrl);
              
              // Ajouter les attributs à l'image
              setTimeout(() => {
                if (editorRef.current) {
                  // Sélectionner toutes les images avec cette URL
                  const images = editorRef.current.querySelectorAll(`img[src="${imageUrl}"]`);

                  images.forEach(img => {
                    // Ajouter l'attribut alt
                    img.setAttribute('alt', alt);
                    
                    // Ajouter des attributs supplémentaires pour référence
                    img.setAttribute('data-file-name', file.name);
                    img.setAttribute('data-file-size', file.size.toString());
                    img.setAttribute('data-file-type', file.type);
                    img.setAttribute('data-processed', 'true'); // Marquer l'image comme traitée
                    img.setAttribute('data-timestamp', Date.now().toString()); // Ajouter un timestamp unique
                    
                    // Ajouter des styles pour une meilleure présentation
                    if (img instanceof HTMLElement) {
                      // Appliquer les dimensions spécifiées
                      if (width) {
                        img.style.width = `${width}px`;
                        img.setAttribute('width', width);
                      } else {
                        img.style.maxWidth = '100%';
                      }
                      
                      if (height) {
                        img.style.height = `${height}px`;
                        img.setAttribute('height', height);
                      } else if (!height && !width) {
                        img.style.height = 'auto';
                      }
                      
                      img.classList.add('blog-image');
                    }
                  });
                  
                  // Mettre à jour le contenu
                  setContent(editorRef.current.innerHTML);
                }
              }, 100);
            }
          }
          
          // Réinitialiser et fermer la popup
          setSavedRange(null);
          setIsImagePopupOpen(false);
        }}
      />
      
      {/* Popup pour la modification d'image */}
      <EditImagePopup 
        isOpen={isEditImagePopupOpen} 
        onClose={() => setIsEditImagePopupOpen(false)}
        imageElement={selectedImage}
        onSubmit={(alt, width, height) => {
          if (selectedImage && editorRef.current) {
            // Appliquer les modifications à l'image
            selectedImage.setAttribute('alt', alt);
            
            if (width) {
              selectedImage.style.width = `${width}px`;
              selectedImage.setAttribute('width', width);
            }
            
            if (height) {
              selectedImage.style.height = `${height}px`;
              selectedImage.setAttribute('height', height);
            }
            
            // Mettre à jour le contenu
            const newContent = editorRef.current.innerHTML;
            setContent(newContent);
            
            // Analyser le contenu mis à jour
            analyzeContent();
          }
          
          // Afficher la notification de succès
          Notification.success('Image modifiée avec succès', {
            position: 'bottom-left',
            duration: 3000,
            style: {
              backgroundColor: '#f0eeff',
              borderLeft: '4px solid #5b50ff',
              color: '#5b50ff'
            }
          });
          
          // Réinitialiser et fermer la popup
          setSelectedImage(null);
          setIsEditImagePopupOpen(false);
        }}
      />

    </div>
  );
};

export default RichTextEditor;
