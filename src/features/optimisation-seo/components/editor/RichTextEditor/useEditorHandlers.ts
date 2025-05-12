import { useState, useRef, useCallback } from 'react';
import { useBlogSeo } from '../../../hooks/useBlogSeo';
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
  }, []);

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
    
    // Sauvegarder la sélection actuelle pour pouvoir insérer l'image au bon endroit
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0).cloneRange());
    }
    
    // Ouvrir la popup d'image
    setIsImagePopupOpen(true);
  };

  // Gestionnaire pour le bouton d'analyse
  const handleAnalyzeContent = () => {
    setIsAnalyzing(true);
    
    // Obtenir le contenu actuel de l'éditeur
    if (editorRef.current) {
      const currentContent = editorRef.current.innerHTML;
      
      // Passer directement le contenu actuel à la fonction analyzeContent du contexte
      // Cela évite le problème de timing avec les mises à jour d'état asynchrones
      analyzeContent(currentContent);
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
