// Liste des mots courants en français pour le calcul de la complexité
const COMMON_FRENCH_WORDS = new Set([
  // Articles et déterminants
  'le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'au', 'aux', 'ce', 'cet', 'cette', 'ces',
  
  // Pronoms
  'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'me', 'te', 'se', 'nous', 'vous', 
  'le', 'la', 'les', 'lui', 'leur', 'eux', 'moi', 'toi', 'soi', 'en', 'y', 'ceci', 'cela', 'ça',
  
  // Prépositions et conjonctions
  'à', 'dans', 'par', 'pour', 'sur', 'avec', 'sans', 'sous', 'chez', 'vers', 'depuis', 'pendant',
  'et', 'ou', 'mais', 'donc', 'or', 'ni', 'car', 'que', 'qui', 'quoi', 'quand', 'comme', 'si',
  
  // Verbes courants
  'être', 'avoir', 'faire', 'dire', 'aller', 'voir', 'savoir', 'pouvoir', 'falloir', 'vouloir',
  'devoir', 'venir', 'suivre', 'parler', 'prendre', 'croire', 'aimer', 'trouver', 'donner',
  'regarder', 'appeler', 'arriver', 'attendre', 'chercher', 'commencer', 'comprendre', 'connaître',
  'continuer', 'devenir', 'entendre', 'expliquer', 'jouer', 'laisser', 'manger', 'marcher',
  'mettre', 'monter', 'montrer', 'oublier', 'partir', 'passer', 'penser', 'perdre', 'porter',
  'poser', 'pouvoir', 'prendre', 'quitter', 'raconter', 'reconnaître', 'rester', 'sembler',
  'sentir', 'sortir', 'tenir', 'terminer', 'tomber', 'tourner', 'travailler', 'traverser',
  'utiliser', 'valoir', 'vivre', 'voir',
  
  // Adjectifs courants
  'autre', 'beau', 'bon', 'grand', 'gros', 'haut', 'jeune', 'joli', 'large', 'long', 'mauvais',
  'meilleur', 'même', 'petit', 'premier', 'propre', 'seul', 'tout', 'triste', 'vieux', 'vite',
  
  // Noms courants
  'temps', 'monde', 'jour', 'homme', 'chose', 'femme', 'fois', 'vie', 'main', 'part', 'enfant',
  'monsieur', 'moment', 'personne', 'côté', 'tête', 'père', 'mère', 'soir', 'année', 'pays',
  'maison', 'oeil', 'travail', 'question', 'raison', 'droit', 'gauche', 'ville', 'rue', 'place',
  'couleur', 'document', 'livre', 'page', 'table', 'chaise', 'fenêtre', 'porte', 'voiture',
  'arbre', 'fleur', 'soleil', 'lune', 'étoile', 'ciel', 'terre', 'mer', 'montagne', 'rivière',
  'chemin', 'route', 'pont', 'bâtiment', 'école', 'magasin', 'marché', 'pain', 'lait', 'fromage',
  'fruit', 'légume', 'viande', 'poisson', 'oeuf', 'riz', 'pomme', 'poire', 'banane', 'orange',
  'fraise', 'tomate', 'carotte', 'pomme de terre', 'salade', 'chou', 'oignon', 'ail', 'pain',
  'beurre', 'confiture', 'miel', 'sel', 'poivre', 'sucre', 'café', 'thé', 'lait', 'eau', 'vin',
  'bière', 'fromage', 'yaourt', 'glace', 'gâteau', 'bonbon', 'chocolat', 'confiserie', 'vêtement',
  'pantalon', 'jupe', 'robe', 'chemise', 'pull', 'manteau', 'chapeau', 'chaussure', 'chaussette',
  'sous-vêtement', 'pyjama', 'mouchoir', 'serviette', 'savon', 'shampoing', 'dentifrice', 'brosse',
  'peigne', 'miroir', 'lit', 'matelas', 'oreiller', 'couverture', 'draps', 'couverture', 'armoire',
  'commode', 'table de nuit', 'lampe', 'téléphone', 'télévision', 'radio', 'ordinateur', 'clavier',
  'souris', 'écran', 'imprimante', 'scanner', 'appareil photo', 'téléphone portable', 'réveil',
  'horloge', 'montre', 'calendrier', 'agenda', 'carnet', 'stylo', 'crayon', 'gomme', 'règle',
  'ciseaux', 'colle', 'agrafeuse', 'trombone', 'élastique', 'punaises', 'ruban adhésif', 'enveloppe',
  'timbre', 'carte postale', 'colis', 'paquet', 'sac', 'valise', 'portefeuille', 'pièce d\'identité',
  'passeport', 'permis de conduire', 'carte de crédit', 'argent', 'monnaie', 'billet', 'pièce',
  'compte en banque', 'chèque', 'cadeau', 'jouet', 'poupée', 'voiture miniature', 'ballon', 'jeu',
  'carte à jouer', 'puzzle', 'livre de coloriage', 'crayon de couleur', 'feutre', 'peinture',
  'pinceau', 'argile', 'pâte à modeler', 'instrument de musique', 'guitare', 'piano', 'violon',
  'flûte', 'tambour', 'trompette', 'saxophone', 'batterie', 'microphone', 'haut-parleur', 'casque audio',
  'écouteurs', 'radio', 'télécommande', 'pile', 'chargeur', 'prise électrique', 'interrupteur',
  'ampoule', 'lampe de poche', 'bougie', 'allumette', 'briquet', 'cendrier', 'poubelle', 'sac poubelle',
  'balai', 'serpillière', 'aspirateur', 'chiffon', 'éponge', 'produit d\'entretien', 'lessive',
  'adoucissant', 'détergent', 'liquide vaisselle', 'savon à vaisselle', 'éponge', 'torchon', 'essuie-tout',
  'film alimentaire', 'papier aluminium', 'sac de congélation', 'boîte de conservation', 'tupperware',
  'bocal', 'bouteille', 'verre', 'tasse', 'mug', 'bol', 'assiette', 'couvercle', 'couvercle à vis',
  'bouchon', 'bouchon à vis', 'bouchon à pression', 'bouchon à vis', 'bouchon à visser', 'bouchon à dévisser',
  'couvercle à visser', 'couvercle à dévisser', 'couvercle à pression', 'couvercle à clipser',
  'couvercle à emboîter', 'couvercle à emboîter', 'couvercle à visser', 'couvercle à dévisser',
  'couvercle à pression', 'couvercle à clipser', 'couvercle à emboîter', 'couvercle à emboîter'
]);

// Cache pour le dictionnaire français
let frenchDictionary: Set<string> | null = null;
let dictionaryLoadPromise: Promise<Set<string>> | null = null;

// Liste de mots français courants comme solution de secours
const FRENCH_WORDS_FALLBACK = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles',
  'de', 'du', 'des', 'à', 'au', 'aux', 'en', 'par', 'pour', 'dans', 'sur', 'sous', 'avec', 'sans',
  'et', 'ou', 'mais', 'donc', 'or', 'ni', 'car', 'que', 'qui', 'quoi', 'où', 'quand', 'comment', 'pourquoi'
]);

// Charger le dictionnaire français avec gestion de cache et d'erreurs
const loadFrenchDictionary = async (): Promise<Set<string>> => {
  // Si le dictionnaire est déjà chargé, le retourner
  if (frenchDictionary) {
    return frenchDictionary;
  }
  
  // Si un chargement est déjà en cours, attendre qu'il se termine
  if (dictionaryLoadPromise) {
    await dictionaryLoadPromise;
    return frenchDictionary || FRENCH_WORDS_FALLBACK;
  }
  
  // Créer une promesse de chargement
  dictionaryLoadPromise = (async (): Promise<Set<string>> => {
    try {
      // Charger une liste de mots français courants
      const response = await fetch('https://raw.githubusercontent.com/words/franc/main/packages/franc-min/dictionaries/fra.json');
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      frenchDictionary = new Set(data);
      return frenchDictionary;
    } catch (error) {
      console.error('Erreur lors du chargement du dictionnaire français:', error);
      // Utiliser la liste de secours en cas d'erreur
      frenchDictionary = FRENCH_WORDS_FALLBACK;
      return frenchDictionary;
    }
  })();
  
  return dictionaryLoadPromise;
};

// Charger le dictionnaire au démarrage
loadFrenchDictionary().catch(console.error);

// Liste des suffixes considérés comme complexes
const COMPLEX_SUFFIXES = [
  // Suffixes techniques/scientifiques
  'logie', 'logique', 'graphie', 'graphique', 'phobie', 'phile', 'phobe', 'scopie', 'nomie', 'nomique',
  'thérapie', 'thérapeute', 'thérapeutique', 'métrie', 'métrique', 'phage', 'phagie',
  'manie', 'mane',
  
  // Suffixes abstraits
  'ité', 'té', 'esse', 'tion', 'sion', 'ence', 'ance', 'isme', 'iste', 'itude', 'eur', 'euse',
  'erie',
  
  // Préfixes
  'macro', 'micro', 'hyper', 'super', 'ultra', 'infra', 'inter', 'intra', 'extra', 'contre', 'anti', 'pré',
  'post', 'pro', 'rétro', 'trans', 'vice', 'co', 'bi', 'tri', 'multi', 'poly', 'mono',
  
  // Terminaisons de mots techniques
  'ectomie', 'otomie', 'plastie', 'scopie', 'stomie', 'tomie', 'urie', 'urie', 'zoonose',
  'zoose', 'zygote', 'zymase', 'zymogène', 'zymologie', 'zymotechnie', 'zymotique', 'zythum'
];

// Mots de 10 lettres ou plus qui sont courants et accessibles aux adolescents
const COMMON_LONG_WORDS = new Set([
  // Nombres
  'beaucoup', 'plusieurs', 'beaucoup', 'quelques', 'quelquefois',
  
  // Adjectifs
  'intéressant', 'différent', 'principal', 'important', 'difficile', 'facilement',
  'généralement', 'naturellement', 'souvent', 'tellement', 'tellement',
  'vraiment', 'exactement', 'certainement', 'probablement', 'suffisamment',
  'rapidement', 'lentement', 'seulement', 'simplement', 'tellement',
  
  // Noms communs
  'personne', 'beaucoup', 'beaucoup', 'quelquefois', 'quelquefois',
  'quelquefois', 'quelquefois', 'quelquefois', 'quelquefois',
  'quelquefois', 'quelquefois', 'quelquefois', 'quelquefois',
  
  // Mots liés à l'école
  'professeur', 'directeur', 'établissement', 'département', 'enseignement',
  'éducation', 'élémentaire', 'secondaire', 'université', 'formation',
  
  // Mots du quotidien
  'téléphone', 'ordinateur', 'télévision', 'internet', 'télécommande',
  'réfrigérateur', 'congélateur', 'lave-linge', 'lave-vaisselle', 'aspirateur',
  
  // Mots de relation
  'ensemble', 'ensemble', 'ensemble', 'ensemble', 'ensemble', 'ensemble',
  'ensemble', 'ensemble', 'ensemble', 'ensemble', 'ensemble', 'ensemble'
]);

// Mots qui se terminent par ces suffixes mais qui sont courants
const COMMON_WORDS_WITH_COMPLEX_SUFFIXES = new Set([
  'couleur', 'couleurs', 'document', 'documents', 'moment', 'moments', 'beaucoup',
  'beaux', 'belle', 'belles', 'nouveau', 'nouveaux', 'nouvelle', 'nouvelles',
  'vieux', 'vieille', 'vieux', 'vieilles', 'meilleur', 'meilleurs', 'meilleure',
  'meilleures', 'premier', 'premiers', 'première', 'premières', 'dernier', 'derniers',
  'dernière', 'dernières', 'petit', 'petits', 'petite', 'petites', 'grand', 'grands',
  'grande', 'grandes', 'gros', 'grosse', 'grosses', 'long', 'longs', 'longue', 'longues',
  'court', 'courte', 'courts', 'courtes', 'large', 'larges', 'étroit', 'étroite',
  'étroits', 'étroites', 'haut', 'haute', 'hauts', 'hautes', 'bas', 'basse', 'basses',
  'jeune', 'jeunes', 'vieux', 'vieille', 'vieux', 'vieilles', 'nouveau', 'nouveaux',
  'nouvelle', 'nouvelles', 'ancien', 'anciens', 'ancienne', 'anciennes', 'moderne',
  'modernes', 'moderne', 'modernes', 'moderne', 'modernes', 'moderne', 'modernes'
]);

/**
 * Vérifie si un mot est dans le dictionnaire français
 * @param word Le mot à vérifier
 * @returns Une promesse qui se résout à true si le mot est dans le dictionnaire
 */
const isInFrenchDictionary = async (word: string): Promise<boolean> => {
  const dict = await loadFrenchDictionary();
  return dict.has(word.toLowerCase());
};

/**
 * Vérifie si un mot est complexe selon des critères avancés
 * @param word Le mot à analyser
 * @returns Une promesse qui se résout à true si le mot est considéré comme complexe
 */
export const isComplexWord = async (word: string): Promise<boolean> => {
  // Ignorer les années (4 chiffres consécutifs)
  if (/^\d{4}$/.test(word)) {
    return false;
  }
  
  // Nettoyer le mot (enlever la ponctuation, mettre en minuscule)
  const cleanWord = word.replace(/[.,;:!?()[\]{}]/g, '').toLowerCase();
  
  // Vérifier si c'est un mot long mais courant
  if (cleanWord.length >= 10 && COMMON_LONG_WORDS.has(cleanWord)) {
    return false;
  }
  
  // Ignorer les mots vides ou trop courts
  if (cleanWord.length <= 3) {
    return false;
  }
  
  // Vérifier si c'est un mot courant
  if (COMMON_FRENCH_WORDS.has(cleanWord) || COMMON_WORDS_WITH_COMPLEX_SUFFIXES.has(cleanWord)) {
    return false;
  }
  
  // Vérifier la présence de chiffres
  if (/\d/.test(cleanWord)) {
    return true;
  }
  
  // Pour les mots de plus de 10 lettres, vérifier s'ils sont dans le dictionnaire
  if (cleanWord.length >= 10) {
    const isFrenchWord = await isInFrenchDictionary(cleanWord);
    if (!isFrenchWord) {
      return true; // Mot long qui n'est pas dans le dictionnaire
    }
  } else {
    // Pour les mots courts, on suppose qu'ils sont français pour éviter les faux positifs
    return false;
  }
  
  // Vérifier les suffixes complexes (sauf pour les mots courants)
  const hasComplexSuffix = COMPLEX_SUFFIXES.some(suffix => 
    cleanWord.endsWith(suffix) && cleanWord.length > suffix.length + 2
  );
  
  if (hasComplexSuffix) {
    // Vérifier si c'est un faux positif courant
    if (cleanWord.endsWith('ment') && cleanWord.length <= 8) {
      return false;
    }
    
    // Vérifier les exceptions courantes
    const exceptions = ['beaucoup', 'beaux', 'nouveau', 'nouveaux', 'vieux', 'vieux', 'vieux', 'vieux'];
    if (exceptions.includes(cleanWord)) {
      return false;
    }
    
    return true;
  }
  
  // Vérifier le nombre de syllabes (mots avec 4 syllabes ou plus sont considérés complexes)
  const syllableCount = countSyllables(cleanWord);
  if (syllableCount >= 4) {
    // Vérifier les faux positifs courants
    const commonPolysyllabicWords = ['beaucoup', 'aujourd\'hui', 'peut-être', 'quelqu\'un', 'quelques', 'plusieurs'];
    if (commonPolysyllabicWords.includes(cleanWord)) {
      return false;
    }
    
    return true;
  }
  
  // Vérifier les mots avec plusieurs voyelles consécutives ou groupes de consonnes
  const hasComplexConsonantClusters = /([bcdfghjklmnpqrstvwxz])\1{2,}|[bcdfghjklmnpqrstvwxz]{3,}/i.test(cleanWord);
  const hasComplexVowelClusters = /[aeiouyéèêëàâùûôîïöüÿæœ]{3,}/i.test(cleanWord);
  
  if (hasComplexConsonantClusters || hasComplexVowelClusters) {
    return true;
  }
  
  return false;
};

// Liste des balises à conserver (mise en forme, titres, listes, etc.)
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 's', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote'];

/**
 * Normalise le contenu HTML en structurant le texte en paragraphes
 * et en ne conservant que les balises de mise en forme essentielles
 * @param content Le contenu HTML à normaliser
 * @returns Le contenu HTML normalisé avec des paragraphes
 */
export const normalizeContent = (content: string): string => {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // 1. Créer un élément DOM temporaire pour parser le HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  // 2. Fonction récursive pour traverser et nettoyer les nœuds
  const processNode = (node: Node): string => {
    // Si c'est un nœud texte, retourner son contenu
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    // Si ce n'est pas un élément, ignorer
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();
    
    // 3. Si c'est une balise autorisée, la conserver
    if (ALLOWED_TAGS.includes(tagName)) {
      // Traiter les enfants récursivement
      const children = Array.from(element.childNodes).map(processNode).join('');
      return `<${tagName}${element.id ? ` id="${element.id}"` : ''}${element.className ? ` class="${element.className}"` : ''}>${children}</${tagName}>`;
    }
    
    // 4. Si c'est un div ou p, traiter les enfants sans ajouter de balise supplémentaire
    if (tagName === 'div' || tagName === 'p') {
      return Array.from(element.childNodes).map(processNode).join('');
    }
    
    // 5. Pour les autres balises non autorisées, ne conserver que le contenu
    return Array.from(element.childNodes).map(processNode).join('');
  };

  // 6. Traiter chaque nœud enfant de l'élément racine
  const processedContent = Array.from(tempDiv.childNodes)
    .map(processNode)
    .join('')
    .trim();

  // 7. Si le contenu est vide, retourner une chaîne vide
  if (!processedContent) {
    return '';
  }

  // 8. Diviser le contenu en paragraphes basés sur les sauts de ligne
  const paragraphs = processedContent
    .split(/\n{2,}/) // Diviser sur deux sauts de ligne ou plus
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // 9. Si pas de paragraphes, retourner une chaîne vide
  if (paragraphs.length === 0) {
    return '';
  }

  // 10. Si un seul paragraphe, le retourner directement
  if (paragraphs.length === 1) {
    return paragraphs[0];
  }

  // 11. Sinon, envelopper chaque paragraphe dans des balises <p>
  return paragraphs.map(p => `<p>${p}</p>`).join('');
};

/**
 * Compte le nombre de syllabes dans un mot français
 * @param word Le mot à analyser
 * @returns Le nombre de syllabes
 */
const countSyllables = (word: string): number => {
  if (!word) return 0;
  
  // Convertir en minuscules et supprimer les caractères non alphabétiques
  const cleanWord = word.toLowerCase().replace(/[^a-zéèêëàâùûôîïöüÿæœ]/g, '');
  if (cleanWord.length <= 3) return 1;
  
  // Règles spécifiques pour le français
  // 1. Compter les groupes de voyelles (diphtongues, triphtongues)
  let syllableCount = 0;
  let prevCharIsVowel = false;
  
  for (let i = 0; i < cleanWord.length; i++) {
    const char = cleanWord[i];
    const isVowel = /[aeiouyéèêëàâùûôîïöüÿæœ]/.test(char);
    
    // Si c'est une voyelle et que la précédente n'en était pas une, on compte une syllabe
    if (isVowel && !prevCharIsVowel) {
      syllableCount++;
    }
    
    prevCharIsVowel = isVowel;
  }
  
  // Ajustements pour les cas particuliers
  // - Les 'e' muets en fin de mot ne comptent pas
  if (cleanWord.endsWith('e') && syllableCount > 1) {
    syllableCount--;
  }
  
  // - Les diphtongues 'ai', 'ei', 'oi', 'ui', 'ou' comptent pour une seule syllabe
  const diphthongs = ['ai', 'ei', 'oi', 'ui', 'ou', 'au', 'eau', 'eu', 'oeu'];
  diphthongs.forEach(diphthong => {
    if (cleanWord.includes(diphthong)) {
      // Compter chaque diphtongue comme une seule syllabe
      const matches = cleanWord.match(new RegExp(diphthong, 'g')) || [];
      syllableCount -= (matches.length > 0) ? matches.length - 1 : 0;
    }
  });
  
  // - Les groupes de voyelles comme 'ien', 'ion', 'oin' comptent pour une syllabe
  const specialGroups = ['ien', 'ion', 'oin', 'ian', 'iau', 'oix'];
  specialGroups.forEach(group => {
    if (cleanWord.includes(group)) {
      const matches = cleanWord.match(new RegExp(group, 'g')) || [];
      syllableCount -= (matches.length > 0) ? matches.length : 0;
      syllableCount += matches.length;
    }
  });
  
  // Au moins une syllabe par mot
  return Math.max(1, syllableCount);
};

/**
 * Analyse le texte et marque les mots complexes
 * @param editorElement L'élément éditeur contenant le texte
 */
export const markComplexWords = async (editorElement: HTMLElement): Promise<void> => {
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
  const walker = async (node: Node) => {
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
    
    // Utiliser une boucle for...of pour gérer correctement l'asynchrone
    for (const word of words) {
      // Si le mot n'est pas vide
      if (word.trim()) {
        // Vérifier si le mot est complexe (de manière asynchrone)
        const isComplex = await isComplexWord(word);
        if (isComplex) {
          const span = document.createElement('span');
          span.className = 'complex-word';
          span.textContent = word;
          fragment.appendChild(span);
        } else {
          // Ajouter le mot tel quel s'il n'est pas complexe
          fragment.appendChild(document.createTextNode(word));
        }
      } else {
        // Ajouter l'espace tel quel
        fragment.appendChild(document.createTextNode(word));
      }
    }
    
    // Remplacer le nœud de texte par le fragment
    if (node.parentNode) {
      node.parentNode.replaceChild(fragment, node);
    }
  };
  
  // Créer un TreeWalker pour parcourir tous les nœuds de texte
  const acceptNode = (node: Node) => {
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
  };
  
  // Créer le TreeWalker avec une fonction de filtrage
  const treeWalker = document.createTreeWalker(
    editorElement,
    NodeFilter.SHOW_TEXT,
    { acceptNode } as NodeFilter
  );
  
  // Parcourir et traiter les nœuds de manière asynchrone
  const nodesToProcess: Node[] = [];
  while (treeWalker.nextNode()) {
    nodesToProcess.push(treeWalker.currentNode);
  }
  
  // Traiter les nœuds dans l'ordre inverse pour éviter les problèmes d'indexation
  for (let i = nodesToProcess.length - 1; i >= 0; i--) {
    await walker(nodesToProcess[i]);
  }
};
