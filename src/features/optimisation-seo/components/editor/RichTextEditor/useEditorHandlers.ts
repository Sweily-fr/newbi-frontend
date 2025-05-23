import { useState, useRef, useCallback, useEffect } from 'react';
import { useBlogSeo } from '../../../hooks/useBlogSeo';
import { markComplexWords } from './utils/textComplexity';
import { normalizeContent } from './utils/textComplexity';
// Importer les utilitaires depuis le bon chemin si nécessaire
// import { calculateWordCount, cleanupExcessiveSpaces } from '../../utils';

export const useEditorHandlers = (editorRef: React.RefObject<HTMLDivElement>) => {
  const { state, setContent, analyzeContent } = useBlogSeo();
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
  const checkActiveFormats = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) {
      // Si pas de sélection ou pas d'éditeur, on désactive tous les formats
      setActiveFormats({
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
      setIsLinkSelected(false);
      return;
    }
    
    // Vérifier si la sélection est à l'intérieur de l'éditeur
    const range = selection.getRangeAt(0);
    const isSelectionInEditor = editorRef.current.contains(range.commonAncestorContainer);
    
    if (!isSelectionInEditor) {
      // Si la sélection est en dehors de l'éditeur, on désactive tous les formats
      setActiveFormats({
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
      setIsLinkSelected(false);
      return;
    }
    
    // Vérifier les formats actifs uniquement si la sélection est dans l'éditeur
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
  }, [editorRef]);

  // Nous ne mettons plus de classe visuelle spéciale aux titres contenant le mot-clé
  // Les titres auront uniquement leur style de base (taille et gras)
  const highlightHeadingsWithKeywords = useCallback(() => {
    // Cette fonction est conservée pour maintenir la compatibilité avec le reste du code
    // mais elle ne fait plus rien de spécial aux titres
    return;
  }, []);
  
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
    // Cas spécial pour vérifier les formats sans appliquer de formatage
    if (action === 'checkFormat') {
      checkActiveFormats();
      return;
    }
    
    // S'assurer que l'éditeur a le focus avant d'appliquer le formatage
    if (!editorRef.current) return;
    if (document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    
    // Sauvegarder la sélection actuelle
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    // Créer une copie profonde de la sélection actuelle
    const originalRange = selection.getRangeAt(0).cloneRange();
    
    // Cas spécial pour les titres (h1, h2, h3) - si on clique sur un titre déjà actif,
    // on le transforme en paragraphe au lieu de simplement le désactiver
    if (action === 'formatBlock' && value && ['<h1>', '<h2>', '<h3>'].includes(value)) {
      // Vérifier si le format est déjà actif en vérifiant directement le noeud parent
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const parentNode = selection.anchorNode?.parentElement;
        if (parentNode) {
          const tagName = value.replace(/[<>]/g, '').toLowerCase();
          const isActive = !!parentNode.closest(tagName);
          
          if (isActive) {
            // Si le format est déjà actif, appliquer le format paragraphe à la place
            document.execCommand('formatBlock', false, '<p>');
            // Mettre à jour les formats actifs après un court délai
            setTimeout(() => {
              checkActiveFormats();
            }, 10);
            return;
          }
        }
      }
    }
    
    // Pour les commandes de formatage simple (bold, italic, underline), utiliser une approche différente
    // pour préserver la position du curseur
    if (['bold', 'italic', 'underline'].includes(action)) {
      // Créer un marqueur pour la position actuelle
      const markerStart = document.createElement('span');
      markerStart.id = 'format-marker-start';
      const markerEnd = document.createElement('span');
      markerEnd.id = 'format-marker-end';
      
      try {
        // Insérer les marqueurs au début et à la fin de la sélection
        const rangeClone = originalRange.cloneRange();
        rangeClone.collapse(true); // Collapse au début
        rangeClone.insertNode(markerStart);
        
        // Insérer le marqueur de fin à la fin de la sélection
        originalRange.collapse(false); // Collapse à la fin
        originalRange.insertNode(markerEnd);
        
        // Appliquer la commande de formatage
        document.execCommand(action, false);
        
        // Trouver les marqueurs après le formatage
        const startMarker = document.getElementById('format-marker-start');
        const endMarker = document.getElementById('format-marker-end');
        
        // Restaurer la sélection à la fin du texte formaté
        if (endMarker && endMarker.parentNode) {
          // Placer le curseur après le marqueur de fin
          const newRange = document.createRange();
          newRange.setStartAfter(endMarker);
          newRange.collapse(true);
          
          // Appliquer la nouvelle sélection
          selection.removeAllRanges();
          selection.addRange(newRange);
          
          // Supprimer les marqueurs
          if (startMarker && startMarker.parentNode) {
            startMarker.parentNode.removeChild(startMarker);
          }
          endMarker.parentNode.removeChild(endMarker);
        }
      } catch (e) {
        console.error('Erreur lors du formatage avec marqueurs:', e);
        // En cas d'erreur, revenir à la méthode standard
        document.execCommand(action, false);
      }
    } else if (action === 'formatBlock' && value) {
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
          if (originalRange && originalRange.startContainer) {
            // Trouver l'élément actuel à la position de la sélection
            let node = originalRange.startContainer as Node;
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
        let currentContent = editorRef.current.innerHTML;
        
        // Normaliser le contenu pour remplacer les &nbsp; par des espaces normaux
        // et s'assurer que le texte est dans des balises <p>
        currentContent = normalizeContent(currentContent);
        
        // Mettre à jour l'affichage avec le contenu normalisé
        editorRef.current.innerHTML = currentContent;
        
        // Vérifier si le contenu a vraiment changé pour éviter les mises à jour inutiles
        if (currentContent !== state.content) {
          setContent(currentContent);
        }
        
        // Appliquer la mise en évidence des mots-clés dans les titres
        highlightHeadingsWithKeywords();
        
        // Restaurer le focus sur l'éditeur
        editorRef.current.focus();
      }
    }, 10);
  };

  // Gestionnaire pour le bouton de lien
  const handleLinkButtonClick = (e: React.MouseEvent) => {
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
  };

  // Gestionnaire pour le bouton d'image
  const handleImageButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // S'assurer que l'éditeur a le focus avant de vérifier la sélection
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    
    // Vérifier si une image est sélectionnée
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      
      // Trouver l'image sélectionnée
      let imageElement: HTMLImageElement | null = null;
      
      // Vérifier si le conteneur est une image
      if (container.nodeType === Node.ELEMENT_NODE) {
        const element = container as Element;
        if (element.tagName === 'IMG') {
          imageElement = element as HTMLImageElement;
        } else {
          // Rechercher l'image dans le conteneur
          imageElement = (container as HTMLElement).querySelector('img');
        }
      } else if (container.nodeType === Node.TEXT_NODE) {
        // Rechercher l'image dans le parent
        const parent = container.parentElement;
        if (parent) {
          imageElement = parent.querySelector('img');
        }
      }
      
      if (imageElement) {
        // Si une image est sélectionnée, ouvrir la popup de modification
        setSelectedImage(imageElement);
        setIsEditImagePopupOpen(true);
        return;
      }
      
      // Sauvegarder la sélection pour l'insertion d'image
      setSavedRange(range.cloneRange());
    } else if (editorRef.current) {
      // Si aucune sélection n'est active, créer une sélection à la fin du contenu
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false); // Collapse à la fin
      
      // Appliquer la sélection
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      // Sauvegarder cette sélection
      setSavedRange(range.cloneRange());
    }
    
    // Ouvrir la popup d'image
    setIsImagePopupOpen(true);
  };

  // Fonction pour marquer les mots complexes dans l'éditeur
  const markComplexWordsInEditor = useCallback(async () => {
    if (editorRef.current) {
      try {
        await markComplexWords(editorRef.current);
      } catch (error) {
        console.error('Erreur lors du marquage des mots complexes:', error);
      }
    }
  }, [editorRef]);
  
  // Effet pour marquer les mots complexes lorsque l'analyse est terminée
  useEffect(() => {
    if (!isAnalyzing && analysisResults) {
      // Attendre que le DOM soit mis à jour après l'analyse
      const timer = setTimeout(() => {
        markComplexWordsInEditor().catch(console.error);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing, analysisResults, markComplexWordsInEditor]);

  // Gestionnaire pour le bouton d'analyse
  const handleAnalyzeContent = () => {
    setIsAnalyzing(true);
    
    // Sauvegarder le contenu actuel de l'éditeur
    if (editorRef.current) {
      // D'abord, supprimer les marquages de mots complexes existants
      const markedWords = editorRef.current.querySelectorAll('.complex-word');
      markedWords.forEach(span => {
        const parent = span.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(span.textContent || ''), span);
          parent.normalize();
        }
      });
      
      const currentContent = editorRef.current.innerHTML;
      
      // Stocker le contenu actuel pour pouvoir le restaurer après l'analyse
      const savedContent = currentContent;
      
      // Passer directement le contenu actuel à la fonction analyzeContent du contexte
      analyzeContent(currentContent);
      
      // S'assurer que le contenu est préservé après l'analyse
      setTimeout(() => {
        if (editorRef.current && editorRef.current.innerHTML !== savedContent) {
          // Restaurer le contenu si nécessaire
          editorRef.current.innerHTML = savedContent;
          
          // Mettre à jour le contenu dans le contexte
          if (typeof setContent === 'function') {
            setContent(savedContent);
          }
        }
        
        // Marquer les mots complexes après la restauration du contenu
        markComplexWordsInEditor();
      }, 500); // Délai pour s'assurer que l'analyse est terminée
    } else {
      // Si editorRef.current n'existe pas, appeler quand même analyzeContent
      // avec le contenu actuel du state
      analyzeContent();
    }
    
    // Note: setIsAnalyzing(false) est géré par la fonction analyzeContent du contexte
  };

  return {
    state,
    isAnalyzing,
    expandedCategories,
    setExpandedCategories,
    isLinkPopupOpen,
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
    currentWordCount,
    setCurrentWordCount,
    objectUrlsRef,
    checkActiveFormats,
    highlightHeadingsWithKeywords,
    checkForSelectedLink,
    handleRemoveLink,
    handleFormatAction,
    handleLinkButtonClick,
    handleImageButtonClick,
    handleAnalyzeContent,
    analysisResults
  };
};
