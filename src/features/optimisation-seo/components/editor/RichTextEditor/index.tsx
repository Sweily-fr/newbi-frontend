import React, { useRef, useEffect } from 'react';
import { RichTextEditorProps } from './types';
import LinkPopup from './LinkPopup';
import ImagePopup from './ImagePopup';
import EditImagePopup from './EditImagePopup';
import EditorToolbar from './EditorToolbar';
import EditorStyles from './EditorStyles';
import { useEditorHandlers } from './useEditorHandlers';
import { getWordCountRating, calculateWordCount } from './utils';
// Le hook useBlogSeo sera réintégré après la refactorisation complète
import { Notification } from '../../../../../components/common/Notification';

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  placeholder = 'Commencez à rédiger votre contenu ici...' 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  
  const {
    setIsLinkPopupOpen,
    isImagePopupOpen,
    setIsImagePopupOpen,
    isEditImagePopupOpen,
    setIsEditImagePopupOpen,
    selectedText,
    setSelectedText,
    savedRange,
    setSavedRange,
    isLinkSelected,
    setIsLinkSelected,
    selectedImage,
    setSelectedImage,
    activeFormats,
    setActiveFormats,
    currentWordCount,
    setCurrentWordCount,
    objectUrlsRef,
    checkActiveFormats,
    checkForSelectedLink,
    handleRemoveLink,
    handleFormatAction,
    handleLinkButtonClick,
    handleImageButtonClick,
    handleAnalyzeContent,
    analysisResults,
    state,
    setContent
  } = useEditorHandlers(editorRef);

  // Variables temporaires pour éviter les erreurs de rendu
  const isAnalyzing = false;
  const isLinkPopupOpen = false;

  // Initialisation de l'éditeur
  useEffect(() => {
    if (editorRef.current && state.content) {
      // Mise à jour du contenu de l'éditeur
      editorRef.current.innerHTML = state.content;
      
      // Calcul du nombre de mots
      const wordCount = calculateWordCount(editorRef.current.innerText);
      setCurrentWordCount(wordCount);
    }
    
    // Nettoyage des URL d'objets lors du démontage du composant
    return () => {
      if (objectUrlsRef.current.length > 0) {
        objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
        objectUrlsRef.current = [];
      }
    };
  }, [state.content, objectUrlsRef, setCurrentWordCount]);

  useEffect(() => {
    if (editorRef.current) {
      // Rendre l'éditeur éditable
      editorRef.current.contentEditable = 'true';
      
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
      
      // Observer les changements dans l'éditeur
      const handleInput = () => {
        updateEmptyClass();
        checkActiveFormats();
        checkForSelectedLink();
        
        // Mettre à jour le contenu dans le contexte
        if (editorRef.current) {
          // Utiliser la fonction setContent du contexte BlogSeo via le hook useEditorHandlers
          if (typeof setContent === 'function') {
            setContent(editorRef.current.innerHTML);
          }
          setCurrentWordCount(calculateWordCount(editorRef.current.innerHTML));
        }
      };
      
      // Gérer le collage de contenu pour préserver la structure des titres tout en nettoyant le formatage inutile
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
          
          // Préserver les titres (h1, h2, h3, etc.)
          const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
          headings.forEach(heading => {
            // S'assurer que le contenu des titres est préservé sans formatage superflu
            const headingLevel = heading.tagName.toLowerCase();
            const headingText = heading.textContent || '';
            // Conserver la structure du titre mais nettoyer les attributs
            heading.outerHTML = `<${headingLevel}>${headingText}</${headingLevel}>`;
          });
          
          // Extraire les images du HTML
          const images = tempDiv.querySelectorAll('img');
          const imageHtml: string[] = [];
          
          // Conserver les images avec leurs attributs essentiels
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
            // Remplacer l'image originale par un marqueur pour la réinsérer plus tard
            img.outerHTML = '{{IMG_PLACEHOLDER}}';
          });
          
          // Nettoyer les éléments indésirables et conserver uniquement la structure essentielle
          // Supprimer tous les attributs de style, class, id, etc.
          const allElements = tempDiv.querySelectorAll('*');
          allElements.forEach(el => {
            // Ne pas traiter les images qui ont déjà été traitées
            if (el.tagName !== 'IMG') {
              // Supprimer tous les attributs sauf le href pour les liens
              const attrs = Array.from(el.attributes);
              attrs.forEach(attr => {
                if (el.tagName === 'A' && attr.name === 'href') {
                  // Conserver l'attribut href pour les liens
                  return;
                }
                el.removeAttribute(attr.name);
              });
            }
          });
          
          // Obtenir le HTML nettoyé avec la structure préservée
          let cleanedHtml = tempDiv.innerHTML;
          
          // Réinsérer les images
          let imageIndex = 0;
          cleanedHtml = cleanedHtml.replace(/\{\{IMG_PLACEHOLDER\}\}/g, () => {
            if (imageIndex < imageHtml.length) {
              return imageHtml[imageIndex++];
            }
            return '';
          });
          
          // Utiliser le HTML nettoyé comme contenu final
          finalContent = cleanedHtml;
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
        
        // Insérer le contenu nettoyé à la position du curseur
        document.execCommand('insertHTML', false, finalContent);
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
      
      // Ajouter un écouteur de sélection pour détecter les liens
      const handleSelectionChange = () => {
        checkForSelectedLink();
        checkActiveFormats();
      };
      
      document.addEventListener('selectionchange', handleSelectionChange);
      
      // Capturer la valeur actuelle des URL d'objets pour le nettoyage
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
  }, [setContent, checkActiveFormats, checkForSelectedLink, setIsEditImagePopupOpen, setSelectedImage]);

  // Appliquer la mise en évidence des mots-clés lorsque le contenu ou les mots-clés changent
  useEffect(() => {
    // Fonction pour mettre en évidence les mots-clés dans les titres définie à l'intérieur du hook
    const highlightKeywordsInHeadings = () => {
      // Cette fonction remplace la fonction highlightHeadingsWithKeywords qui n'existe pas
      // Implémentation simplifiée pour l'instant
      if (editorRef.current && state.keywords && state.keywords.main) {
        // Logique de mise en évidence des mots-clés dans les titres
        console.log('Highlighting keywords in headings');
      }
    };
    
    // Appeler la fonction
    highlightKeywordsInHeadings();
  }, [state.content, state.keywords, editorRef]);

  return (
    <div className="flex flex-col">
      <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
        {/* Compteur de mots avec évaluation */}
        <div className="absolute bottom-2 right-2 z-10 bg-white bg-opacity-90 rounded-md px-2 py-1 shadow-sm border border-[#e6e1ff] flex items-center space-x-2">
          <span className="text-xs text-gray-500">Mots:</span>
          <span className="text-sm font-medium">{currentWordCount}</span>
          <span className={`text-xs font-medium ${getWordCountRating(currentWordCount).color} ml-1 px-1.5 py-0.5 rounded-full text-xs bg-opacity-20 ${getWordCountRating(currentWordCount).color.replace('text-', 'bg-')}`}>({getWordCountRating(currentWordCount).label})</span>
        </div>
        
        {/* Barre d'outils */}
        <EditorToolbar 
          activeFormats={activeFormats}
          isLinkSelected={isLinkSelected}
          isAnalyzing={isAnalyzing}
          handleFormatAction={handleFormatAction}
          handleRemoveLink={handleRemoveLink}
          handleLinkButtonClick={handleLinkButtonClick}
          handleImageButtonClick={handleImageButtonClick}
          handleAnalyzeContent={handleAnalyzeContent}
        />
        
        {/* Styles CSS pour l'éditeur */}
        <EditorStyles />
        
        {/* Zone d'édition */}
        <div
          ref={editorRef}
          className="p-6 min-h-[400px] max-h-[800px] overflow-y-auto focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:italic"
          data-placeholder={placeholder}
          contentEditable="true"
          style={{ minHeight: '400px', maxHeight: '800px' }}
          onClick={() => {
            // Mettre le focus uniquement lors du clic dans l'éditeur
            if (editorRef.current) {
              editorRef.current.focus();
            }
          }}
          onFocus={() => {
            // Appliquer la mise en évidence des mots-clés dans les titres si du contenu existe
            if (editorRef.current && editorRef.current.innerHTML.trim() !== '') {
              // Utiliser la fonction définie dans le hook useEffect
              const highlightKeywordsInHeadings = () => {
                if (editorRef.current && state.keywords && state.keywords.main) {
                  console.log('Highlighting keywords in headings');
                }
              };
              highlightKeywordsInHeadings();
            }
          }}
        />
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
            handleAnalyzeContent();
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
