// Liste des mots courants en français pour le calcul de la complexité
const COMMON_FRENCH_WORDS = new Set([
  'le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'est', 'à', 'a', 'dans', 'que', 'qui', 'pour', 'sur', 'par', 'au', 'avec', 'mais', 'ou', 'où', 'donc', 'or', 'ni', 'car', 'sont', 'c\'est', 'plus', 'moins', 'comme', 'si', 'mais', 'donc', 'or', 'ni', 'car'
]);

// Liste des suffixes et terminaisons complexes
const COMPLEX_SUFFIXES = [
  'tion', 'sion', 'ment', 'éité', 'té', 'ité', 'eux', 'euse', 'eure', 'eures', 
  'ance', 'ence', 'isme', 'iste', 'able', 'ible', 'iste', 'if', 'ive', 'eux', 'euse',
  'logie', 'logique', 'graphie', 'phobie', 'phile', 'phobe', 'scopie', 'nomie', 'nomique'
];

/**
 * Vérifie si un mot est complexe selon l'indice Flesch-Kincaid
 * @param word Le mot à analyser
 * @returns true si le mot est considéré comme complexe
 */
export const isComplexWord = (word: string): boolean => {
  // Nettoyer le mot (enlever la ponctuation, mettre en minuscule)
  const cleanWord = word.replace(/[.,;:!?()\[\]{}"]/g, '').toLowerCase();
  
  // Ignorer les mots vides ou trop courts
  if (cleanWord.length <= 3 || COMMON_FRENCH_WORDS.has(cleanWord)) {
    return false;
  }
  
  // Vérifier la longueur du mot
  if (cleanWord.length > 10) {
    return true;
  }
  
  // Vérifier les suffixes complexes
  if (COMPLEX_SUFFIXES.some(suffix => cleanWord.endsWith(suffix))) {
    return true;
  }
  
  // Compter les syllabes (approximation simple)
  const syllableCount = countSyllables(cleanWord);
  return syllableCount >= 4;
};

/**
 * Compte le nombre de syllabes dans un mot (approximation)
 * @param word Le mot à analyser
 * @returns Le nombre approximatif de syllabes
 */
const countSyllables = (word: string): number => {
  // Remplacer les groupes de voyelles par une seule voyelle
  const vowels = word.replace(/[^aeiouyéèêëàâùûôîïöüÿæœ]/gi, '');
  return Math.max(1, vowels.length);
};

/**
 * Analyse le texte et marque les mots complexes
 * @param editorElement L'élément éditeur contenant le texte
 */
export const markComplexWords = (editorElement: HTMLElement): void => {
  // D'abord, supprimer les marquages existants
  const existingMarked = editorElement.querySelectorAll('.complex-word');
  existingMarked.forEach(span => {
    const parent = span.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(span.textContent || ''), span);
      parent.normalize(); // Fusionner les nœuds texte adjacents
    }
  });

  // Fonction récursive pour parcourir les nœuds
  const walker = (node: Node) => {
    // Ignorer les nœuds qui ne sont pas du texte ou qui sont dans des liens/images
    if (node.nodeType !== Node.TEXT_NODE || 
        (node.parentElement && 
         (node.parentElement.tagName === 'A' || 
          node.parentElement.tagName === 'IMG' ||
          node.parentElement.classList.contains('complex-word')))) {
      return;
    }

    const textNode = node as Text;
    const text = textNode.nodeValue || '';
    const words = text.split(/(\s+)/);
    
    // Si pas de mots ou que des espaces, on ne fait rien
    if (words.length <= 1) return;
    
    const fragment = document.createDocumentFragment();
    
    words.forEach(word => {
      // Si le mot est complexe et pas seulement des espaces
      if (word.trim() && isComplexWord(word)) {
        const span = document.createElement('span');
        span.className = 'complex-word';
        span.textContent = word;
        fragment.appendChild(span);
      } else {
        // Ajouter l'espace ou le mot tel quel
        fragment.appendChild(document.createTextNode(word));
      }
    });
    
    // Remplacer le nœud de texte par le fragment
    if (node.parentNode) {
      node.parentNode.replaceChild(fragment, node);
    }
  };
  
  // Créer un TreeWalker pour parcourir tous les nœuds de texte
  const treeWalker = document.createTreeWalker(
    editorElement,
    NodeFilter.SHOW_TEXT,
    { 
      acceptNode: (node) => {
        // Ignorer les nœuds vides ou qui ne contiennent que des espaces
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        // Ignorer les nœuds dans des éléments qui ne doivent pas être modifiés
        let parent = node.parentNode as HTMLElement | null;
        while (parent && parent !== editorElement) {
          if (parent.tagName === 'A' || parent.tagName === 'IMG' || parent.classList.contains('complex-word')) {
            return NodeFilter.FILTER_REJECT;
          }
          parent = parent.parentNode as HTMLElement | null;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    },
    false
  );
  
  // Parcourir tous les nœuds acceptés
  const nodesToProcess: Node[] = [];
  while (treeWalker.nextNode()) {
    nodesToProcess.push(treeWalker.currentNode);
  }
  
  // Traiter les nœuds dans l'ordre inverse pour éviter les problèmes d'indexation
  for (let i = nodesToProcess.length - 1; i >= 0; i--) {
    walker(nodesToProcess[i]);
  }
};
