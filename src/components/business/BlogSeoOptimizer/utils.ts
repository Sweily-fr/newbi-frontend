import { ContentAnalysisResult, ContentStats, KeywordData, MetaTagsData, SeoScore } from './types';

/**
 * Calcule les statistiques du contenu
 */
export const calculateContentStats = (content: string, keywords: KeywordData): ContentStats => {
  // Nettoyage du contenu HTML pour l'analyse textuelle
  const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Comptage des mots
  const words = textContent.split(' ').filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Comptage des paragraphes (basé sur les balises <p> ou les sauts de ligne doubles)
  const paragraphCount = (content.match(/<p[^>]*>/g) || []).length || 
                         (content.split('\n\n').length);
  
  // Comptage des phrases (approximatif)
  const sentences = textContent.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  const sentenceCount = sentences.length;
  
  // Longueur moyenne des phrases
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  
  // Temps de lecture estimé (en minutes, basé sur 200 mots par minute)
  const readingTime = wordCount / 200;
  
  // Calcul du score de lisibilité Flesch-Kincaid (simplifié)
  // 206.835 - 1.015 * (mots / phrases) - 84.6 * (syllabes / mots)
  // Estimation simplifiée des syllabes
  const syllableCount = words.reduce((count, word) => {
    return count + estimateSyllables(word);
  }, 0);
  
  const fleschScore = sentenceCount > 0 && wordCount > 0
    ? 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount)
    : 0;
  
  // Calcul de la densité des mots-clés
  const mainKeywordRegex = new RegExp(`\\b${keywords.main}\\b`, 'gi');
  const mainKeywordCount = (textContent.match(mainKeywordRegex) || []).length;
  const mainKeywordDensity = wordCount > 0 ? (mainKeywordCount / wordCount) * 100 : 0;
  
  const secondaryKeywordDensity: Record<string, number> = {};
  keywords.secondary.forEach(keyword => {
    const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const keywordCount = (textContent.match(keywordRegex) || []).length;
    secondaryKeywordDensity[keyword] = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
  });
  
  // Calcul de la densité des mots-clés de longue traîne
  const longTailKeywordDensity: Record<string, number> = {};
  if (keywords.longTail && keywords.longTail.length > 0) {
    keywords.longTail.forEach(keyword => {
      // Pour les expressions de longue traîne, utiliser une recherche plus souple
      // car elles peuvent contenir plusieurs mots
      const escapedKeyword = keyword.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
      const keywordRegex = new RegExp(escapedKeyword, 'gi');
      const keywordCount = (textContent.match(keywordRegex) || []).length;
      longTailKeywordDensity[keyword] = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
    });
  }
  
  // Comptage des titres
  const headingCount = {
    h1: (content.match(/<h1[^>]*>/g) || []).length,
    h2: (content.match(/<h2[^>]*>/g) || []).length,
    h3: (content.match(/<h3[^>]*>/g) || []).length,
    h4: (content.match(/<h4[^>]*>/g) || []).length,
  };
  
  // Comptage des liens
  // Récupérer tous les liens
  const allLinks = content.match(/<a[^>]*href=["'][^"']*["'][^>]*>/g) || [];
  
  // Compter les liens internes et externes en utilisant l'attribut data-link-type
  const internalLinkCount = allLinks.filter(link => 
    link.includes('data-link-type="internal"') || 
    (!link.includes('http') && !link.includes('data-link-type="external"'))
  ).length;
  
  const externalLinkCount = allLinks.filter(link => 
    link.includes('data-link-type="external"') || 
    (link.includes('http') && !link.includes('data-link-type="internal"'))
  ).length;
  
  // Comptage des images et analyse des attributs alt
  const allImages = content.match(/<img[^>]*>/g) || [];
  const imagesCount = allImages.length;
  
  // Extraire les attributs alt des images
  const imagesWithAlt = allImages.filter(img => img.match(/alt=["'][^"']+["']/)).length;
  
  // Extraire tous les attributs alt pour l'analyse des mots-clés
  const altTexts: string[] = [];
  allImages.forEach(img => {
    const altMatch = img.match(/alt=["']([^"']*)["']/);
    if (altMatch && altMatch[1] && altMatch[1].trim().length > 0) {
      altTexts.push(altMatch[1].trim().toLowerCase());
    }
  });
  
  // Compter les images dont l'attribut alt contient un mot-clé
  let imagesWithKeywordInAlt = 0;
  if (keywords.main) {
    const mainKeywordLower = keywords.main.toLowerCase();
    imagesWithKeywordInAlt = altTexts.filter(alt => alt.includes(mainKeywordLower)).length;
  }
  
  return {
    wordCount,
    paragraphCount,
    sentenceCount,
    avgSentenceLength,
    readingTime,
    fleschScore,
    keywordDensity: {
      main: mainKeywordDensity,
      secondary: secondaryKeywordDensity,
      longTail: longTailKeywordDensity
    },
    headingCount,
    linksCount: {
      internal: internalLinkCount,
      external: externalLinkCount
    },
    imagesCount,
    imagesWithAlt,
    imagesWithKeywordInAlt
  };
};

/**
 * Estimation simplifiée du nombre de syllabes dans un mot
 */
const estimateSyllables = (word: string): number => {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  // Comptage basique des voyelles, en ignorant les e muets à la fin
  const vowels = word.match(/[aeiouy]+/g);
  let count = vowels ? vowels.length : 0;
  
  // Ajustements pour les règles françaises
  if (word.endsWith('e')) count -= 1;
  if (word.endsWith('es')) count -= 1;
  if (word.endsWith('ent')) count -= 1;
  
  // Correction pour les diphtongues
  const diphthongs = (word.match(/[aeiouy]{2,}/g) || []).length;
  count -= diphthongs;
  
  return Math.max(1, count);
};

/**
 * Liste des mots impactants qui améliorent la lisibilité lorsqu'ils sont présents dans le titre H1
 */
const impactfulWords = [
  'absolument', 'stupéfaction', 'authentique',
  'beau', 'bien-être', 'brillant',
  'captivant', 'charismatique', 'chocolat',
  'clair', 'complètement', 'confidentiel',
  'confiance', 'conséquent', 'créatif',
  'définitivement', 'délicieux', 'démonstration',
  'dépêchez-vous', 'déterminer', 'digne',
  'dynamique', 'éblouissant', 'éclatant',
  'économique', 'efficacité', 'élégant',
  'émotionnel', 'énergétique', 'énorme',
  'époustouflant', 'essentiel', 'étonnant',
  'exclusif', 'expérience', 'fabuleux',
  'fantastique', 'redoutable', 'fort',
  'garanti', 'géant', 'l\'éducation',
  'grandiose', 'gratuit', 'habile',
  'harmonieux', 'historique', 'hors paire',
  'important', 'incroyable', 'indispensable',
  'inoubliable', 'inspirant', 'innovant',
  'intense', 'invention', 'irrésistible',
  'légendaire', 'lumineux', 'luxe',
  'magique', 'magnifique', 'majestueux',
  'marquant', 'merveilleux', 'miraculeux',
  'motivation', 's\'effondrer', 'nouvelle',
  'officiel', 'parfait', 'passionné',
  'persuasif', 'phénoménal', 'plaisir',
  'populaire', 'pouvoir', 'prestigieux',
  'prodigieux', 'profond', 'prospère',
  'puissant', 'qualité', 'radieux',
  'rapide', 'réussi', 'révolutionnaire',
  'satisfait', 'sécurité', 'sensationnel',
  'serein', 'somptueux', 'splendide',
  'sublime', 'surprenant', 'talentueux',
  'terrifiant', 'unique', 'valeur',
  'vibrant', 'victorieux', 'vif',
  'vraiment', 'zélé'
];

/**
 * Analyse le contenu et génère des résultats d'analyse
 */
export const analyzeContent = (
  content: string, 
  keywords: KeywordData, 
  metaTags: MetaTagsData, 
  stats: ContentStats
): ContentAnalysisResult[] => {
  // Vérifier si le contenu est vide ou contient seulement le contenu par défaut
  const defaultContent = '<h1>Titre de votre article</h1><p>Commencez à rédiger votre contenu ici...</p>';
  const isContentEmpty = !content || content === '' || content === defaultContent;
  
  // Vérifier si les métadonnées sont vides
  const isMetaTagsEmpty = !metaTags.title && !metaTags.description;
  
  // Si le contenu est vide ou par défaut ET que les métadonnées sont vides,
  // retourner un tableau vide pour obtenir un score de 0
  if (isContentEmpty && isMetaTagsEmpty && keywords.main) {
    return [];
  }
  
  const results: ContentAnalysisResult[] = [];
  
  // Vérification des mots-clés secondaires
  if (keywords.secondary.length === 0) {
    results.push({
      id: 'secondary-keywords-missing',
      title: 'Mots-clés secondaires manquants',
      description: 'Aucun mot-clé secondaire n\'a été défini pour votre contenu.',
      status: 'problem',
      score: 0,
      priority: 'high',
      category: 'keywords',
      suggestions: ['Ajoutez des mots-clés secondaires pour enrichir votre contenu et améliorer votre référencement.']
    });
  } else {
    // Vérification de la densité des mots-clés secondaires
    const secondaryKeywordsWithLowDensity = [];
    
    for (const keyword of keywords.secondary) {
      const density = stats.keywordDensity.secondary[keyword] || 0;
      if (density < 0.3) {
        secondaryKeywordsWithLowDensity.push(keyword);
      }
    }
    
    if (secondaryKeywordsWithLowDensity.length > 0) {
      results.push({
        id: 'secondary-keywords-density',
        title: 'Densité des mots-clés secondaires',
        description: `${secondaryKeywordsWithLowDensity.length} mot(s)-clé(s) secondaire(s) ont une densité trop faible.`,
        status: 'improvement',
        score: 5,
        priority: 'medium',
        category: 'keywords',
        suggestions: [
          `Les mots-clés secondaires suivants ont une densité inférieure à 0.3% : ${secondaryKeywordsWithLowDensity.join(', ')}.`,
          'Essayez d\'inclure ces mots-clés plus fréquemment dans votre contenu pour améliorer leur visibilité.'
        ]
      });
    }
  }
  
  // Analyse du mot-clé principal
  if (keywords.main) {
    // Vérification de la présence du mot-clé principal dans le titre
    const titleContainsKeyword = metaTags.title.toLowerCase().includes(keywords.main.toLowerCase());
    results.push({
      id: 'keyword-in-title',
      title: 'Mot-clé principal dans le titre',
      description: titleContainsKeyword 
        ? 'Votre mot-clé principal est présent dans le titre.' 
        : 'Votre mot-clé principal n\'est pas présent dans le titre.',
      status: titleContainsKeyword ? 'good' : 'problem',
      score: titleContainsKeyword ? 10 : 0,
      priority: 'high',
      category: 'keywords',
      suggestions: titleContainsKeyword ? [] : [`Ajoutez le mot-clé "${keywords.main}" dans votre titre.`]
    });
    
    // Vérification de la présence du mot-clé principal dans la méta description
    const descContainsKeyword = metaTags.description.toLowerCase().includes(keywords.main.toLowerCase());
    results.push({
      id: 'keyword-in-meta',
      title: 'Mot-clé principal dans la méta description',
      description: descContainsKeyword 
        ? 'Votre mot-clé principal est présent dans la méta description.' 
        : 'Votre mot-clé principal n\'est pas présent dans la méta description.',
      status: descContainsKeyword ? 'good' : 'problem',
      score: descContainsKeyword ? 8 : 0,
      priority: 'high',
      category: 'meta',
      suggestions: descContainsKeyword ? [] : [`Ajoutez le mot-clé "${keywords.main}" dans votre méta description.`]
    });
    
    // Analyse de la densité du mot-clé principal
    const mainKeywordDensity = stats.keywordDensity.main;
    let keywordDensityStatus: 'good' | 'improvement' | 'problem' = 'good';
    let keywordDensityScore = 10;
    let keywordDensitySuggestions: string[] = [];
    
    if (mainKeywordDensity < 0.5) {
      keywordDensityStatus = 'problem';
      keywordDensityScore = 3;
      keywordDensitySuggestions.push(`La densité du mot-clé principal (${mainKeywordDensity.toFixed(2)}%) est trop faible. Visez entre 0.5% et 2.5%.`);
    } else if (mainKeywordDensity > 2.5) {
      keywordDensityStatus = 'improvement';
      keywordDensityScore = 5;
      keywordDensitySuggestions.push(`La densité du mot-clé principal (${mainKeywordDensity.toFixed(2)}%) est trop élevée. Visez entre 0.5% et 2.5%.`);
    }
    
    results.push({
      id: 'keyword-density',
      title: 'Densité du mot-clé principal',
      description: `La densité du mot-clé principal est de ${mainKeywordDensity.toFixed(2)}%.`,
      status: keywordDensityStatus,
      score: keywordDensityScore,
      priority: 'medium',
      category: 'keywords',
      suggestions: keywordDensitySuggestions
    });
    
    // Vérification de la présence du mot-clé dans le premier paragraphe
    const firstParagraph = content.match(/<p[^>]*>(.*?)<\/p>/i)?.[1] || '';
    const keywordInFirstParagraph = firstParagraph.toLowerCase().includes(keywords.main.toLowerCase());
    
    results.push({
      id: 'keyword-in-first-paragraph',
      title: 'Mot-clé dans le premier paragraphe',
      description: keywordInFirstParagraph 
        ? 'Votre mot-clé principal est présent dans le premier paragraphe.' 
        : 'Votre mot-clé principal n\'est pas présent dans le premier paragraphe.',
      status: keywordInFirstParagraph ? 'good' : 'improvement',
      score: keywordInFirstParagraph ? 7 : 3,
      priority: 'medium',
      category: 'keywords',
      suggestions: keywordInFirstParagraph ? [] : [`Ajoutez le mot-clé "${keywords.main}" dans le premier paragraphe.`]
    });
  }
  
  // Analyse de la structure du contenu
  
  // Vérification de la présence d'un H1
  const hasH1 = stats.headingCount.h1 > 0;
  const tooManyH1 = stats.headingCount.h1 > 1;
  
  let h1Status: 'good' | 'improvement' | 'problem' = 'good';
  let h1Score = 10;
  let h1Suggestions: string[] = [];
  
  if (!hasH1) {
    h1Status = 'problem';
    h1Score = 0;
    h1Suggestions.push('Ajoutez un titre H1 à votre contenu.');
  } else if (tooManyH1) {
    h1Status = 'improvement';
    h1Score = 5;
    h1Suggestions.push('Votre contenu contient plusieurs titres H1. Il est recommandé de n\'en avoir qu\'un seul.');
  }
  
  results.push({
    id: 'h1-presence',
    title: 'Titre H1',
    description: hasH1 
      ? tooManyH1 
        ? `Votre contenu contient ${stats.headingCount.h1} titres H1.` 
        : 'Votre contenu contient un titre H1.' 
      : 'Votre contenu ne contient pas de titre H1.',
    status: h1Status,
    score: h1Score,
    priority: 'high',
    category: 'structure',
    suggestions: h1Suggestions
  });
  
  // Vérification de la présence du mot-clé principal dans le titre H1
  let h1Content = '';
  if (hasH1) {
    // Extraire le contenu du H1
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    h1Content = h1Match ? h1Match[1].replace(/<[^>]*>/g, '') : '';
    
    if (keywords.main) {
      const keywordInH1 = h1Content.toLowerCase().includes(keywords.main.toLowerCase());
      
      results.push({
        id: 'keyword-in-h1',
        title: 'Mot-clé principal dans le titre H1',
        description: keywordInH1 
          ? `Votre mot-clé principal "${keywords.main}" est présent dans le titre H1.` 
          : `Votre mot-clé principal "${keywords.main}" n'est pas présent dans le titre H1.`,
        status: keywordInH1 ? 'good' : 'problem',
        score: keywordInH1 ? 10 : 3,
        priority: 'high',
        category: 'keywords',
        suggestions: keywordInH1 ? [] : [`Ajoutez le mot-clé "${keywords.main}" dans votre titre H1 pour améliorer le référencement.`]
      });
    }
    
    // Vérification de la présence de mots impactants dans le titre H1
    const h1Words = h1Content.toLowerCase().split(/\s+/);
    const impactfulWordsInH1 = h1Words.filter(word => 
      impactfulWords.includes(word.replace(/[.,!?;:'"-]/g, ''))
    );
    
    if (impactfulWordsInH1.length > 0) {
      results.push({
        id: 'impactful-words-in-h1',
        title: 'Mots impactants dans le titre H1',
        description: `Votre titre H1 contient ${impactfulWordsInH1.length} mot(s) impactant(s): ${impactfulWordsInH1.join(', ')}.`,
        status: 'good',
        score: 10,
        priority: 'medium',
        category: 'readability',
        suggestions: []
      });
    } else {
      results.push({
        id: 'no-impactful-words-in-h1',
        title: 'Absence de mots impactants dans le titre H1',
        description: 'Votre titre H1 ne contient pas de mots impactants qui pourraient améliorer la lisibilité.',
        status: 'improvement',
        score: 5,
        priority: 'low',
        category: 'readability',
        suggestions: [
          'Essayez d\'ajouter des mots impactants dans votre titre H1 pour le rendre plus attractif.',
          'Des mots comme "incroyable", "essentiel", "révolutionnaire" ou "unique" attirent l\'attention du lecteur.'
        ]
      });
    }
  }
  
  // Analyse de la lisibilité
  let readabilityStatus: 'good' | 'improvement' | 'problem' = 'good';
  let readabilityScore = 10;
  let readabilitySuggestions: string[] = [];
  
  // Vérifier si des mots impactants sont présents dans le titre H1 pour ajuster le score de lisibilité
  let impactfulWordsBonus = 0;
  if (hasH1 && h1Content) {
    const h1Words = h1Content.toLowerCase().split(/\s+/);
    const impactfulWordsInH1 = h1Words.filter(word => 
      impactfulWords.includes(word.replace(/[.,!?;:'"-]/g, ''))
    );
    
    // Ajouter un bonus au score de lisibilité en fonction du nombre de mots impactants
    if (impactfulWordsInH1.length > 0) {
      impactfulWordsBonus = Math.min(impactfulWordsInH1.length * 2, 10); // Maximum 10 points de bonus
    }
  }
  
  // Calculer le score de lisibilité ajusté avec le bonus des mots impactants
  const adjustedFleschScore = Math.min(stats.fleschScore + impactfulWordsBonus, 100); // Maximum 100
  
  if (adjustedFleschScore < 30) {
    readabilityStatus = 'problem';
    readabilityScore = 3;
    readabilitySuggestions.push('Votre contenu est très difficile à lire. Simplifiez votre langage et utilisez des phrases plus courtes.');
  } else if (adjustedFleschScore < 50) {
    readabilityStatus = 'problem';
    readabilityScore = 4;
    readabilitySuggestions.push('Votre contenu est difficile à lire. Essayez de simplifier votre langage et d\'utiliser des phrases plus courtes.');
  } else if (adjustedFleschScore < 60) {
    readabilityStatus = 'improvement';
    readabilityScore = 6;
    readabilitySuggestions.push('Votre contenu est assez difficile à lire. Envisagez de simplifier certaines phrases.');
  } else if (adjustedFleschScore < 70) {
    readabilityStatus = 'improvement';
    readabilityScore = 7;
    readabilitySuggestions.push('Votre contenu est moyennement lisible. Il pourrait être amélioré pour un public plus large.');
  } else {
    readabilityStatus = 'good';
    readabilityScore = 9;
    readabilitySuggestions.push('Votre contenu est très facile à lire. C\'est parfait pour un large public.');
  }
  
  // Ajouter une suggestion spécifique si des mots impactants sont présents
  if (impactfulWordsBonus > 0) {
    readabilitySuggestions.push(`L'utilisation de mots impactants dans votre titre H1 améliore la lisibilité de votre contenu (+${impactfulWordsBonus} points).`);
  }
  
  results.push({
    id: 'readability',
    title: 'Lisibilité',
    description: `Score de lisibilité Flesch : ${stats.fleschScore.toFixed(1)}${impactfulWordsBonus > 0 ? ` (ajusté à ${adjustedFleschScore.toFixed(1)} avec les mots impactants)` : ''}`,
    status: readabilityStatus,
    score: readabilityScore,
    priority: 'medium',
    category: 'readability',
    suggestions: readabilitySuggestions
  });
  
  // Analyse de la longueur des paragraphes
  const avgWordsPerParagraph = stats.paragraphCount > 0 
    ? stats.wordCount / stats.paragraphCount 
    : 0;
  
  let paragraphLengthStatus: 'good' | 'improvement' | 'problem' = 'good';
  let paragraphLengthScore = 10;
  let paragraphLengthSuggestions: string[] = [];
  
  if (avgWordsPerParagraph > 100) {
    paragraphLengthStatus = 'problem';
    paragraphLengthScore = 3;
    paragraphLengthSuggestions.push(`Vos paragraphes sont trop longs (moyenne de ${avgWordsPerParagraph.toFixed(0)} mots). Visez 40-60 mots par paragraphe.`);
  } else if (avgWordsPerParagraph > 80) {
    paragraphLengthStatus = 'improvement';
    paragraphLengthScore = 6;
    paragraphLengthSuggestions.push(`Vos paragraphes sont un peu longs (moyenne de ${avgWordsPerParagraph.toFixed(0)} mots). Essayez de les raccourcir.`);
  }
  
  results.push({
    id: 'paragraph-length',
    title: 'Longueur des paragraphes',
    description: `Moyenne de ${avgWordsPerParagraph.toFixed(0)} mots par paragraphe.`,
    status: paragraphLengthStatus,
    score: paragraphLengthScore,
    priority: 'low',
    category: 'readability',
    suggestions: paragraphLengthSuggestions
  });
  
  // Analyse des méta-données
  
  // Vérification de la longueur du titre
  const titleLength = metaTags.title.length;
  let titleLengthStatus: 'good' | 'improvement' | 'problem' = 'good';
  let titleLengthScore = 10;
  let titleLengthSuggestions: string[] = [];
  
  if (titleLength < 30) {
    titleLengthStatus = 'improvement';
    titleLengthScore = 5;
    titleLengthSuggestions.push(`Votre titre est trop court (${titleLength} caractères). Visez entre 50 et 60 caractères.`);
  } else if (titleLength > 60) {
    titleLengthStatus = 'improvement';
    titleLengthScore = 6;
    titleLengthSuggestions.push(`Votre titre est trop long (${titleLength} caractères). Visez entre 50 et 60 caractères.`);
  }
  
  results.push({
    id: 'title-length',
    title: 'Longueur du titre',
    description: `Votre titre contient ${titleLength} caractères.`,
    status: titleLengthStatus,
    score: titleLengthScore,
    priority: 'high',
    category: 'meta',
    suggestions: titleLengthSuggestions
  });
  
  // Vérification de la longueur de la méta description
  const descriptionLength = metaTags.description.length;
  let descriptionLengthStatus: 'good' | 'improvement' | 'problem' = 'good';
  let descriptionLengthScore = 10;
  let descriptionLengthSuggestions: string[] = [];
  
  if (descriptionLength < 120) {
    descriptionLengthStatus = 'improvement';
    descriptionLengthScore = 5;
    descriptionLengthSuggestions.push(`Votre méta description est trop courte (${descriptionLength} caractères). Visez entre 120 et 155 caractères.`);
  } else if (descriptionLength > 155) {
    descriptionLengthStatus = 'improvement';
    descriptionLengthScore = 6;
    descriptionLengthSuggestions.push(`Votre méta description est trop longue (${descriptionLength} caractères). Visez entre 120 et 155 caractères.`);
  }
  
  results.push({
    id: 'description-length',
    title: 'Longueur de la méta description',
    description: `Votre méta description contient ${descriptionLength} caractères.`,
    status: descriptionLengthStatus,
    score: descriptionLengthScore,
    priority: 'high',
    category: 'meta',
    suggestions: descriptionLengthSuggestions
  });
  
  // Analyse des liens
  const hasLinks = stats.linksCount.internal > 0 || stats.linksCount.external > 0;
  
  results.push({
    id: 'links-presence',
    title: 'Présence de liens',
    description: hasLinks 
      ? `Votre contenu contient ${stats.linksCount.internal} liens internes et ${stats.linksCount.external} liens externes.` 
      : 'Votre contenu ne contient pas de liens.',
    status: hasLinks ? 'good' : 'improvement',
    score: hasLinks ? 8 : 4,
    priority: 'medium',
    category: 'links',
    suggestions: hasLinks ? [] : ['Ajoutez des liens internes et externes pour améliorer votre référencement.']
  });
  
  // Vérification des liens répétés dans les paragraphes
  if (hasLinks) {
    // Extraire tous les paragraphes
    const paragraphs = content.match(/<p[^>]*>(.*?)<\/p>/gi) || [];
    const paragraphsWithTooManyRepeatedLinks: string[] = [];
    
    // Analyser chaque paragraphe pour trouver les liens répétés
    for (const paragraph of paragraphs) {
      // Extraire tous les liens du paragraphe
      const links = paragraph.match(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi) || [];
      
      // Compter les occurrences de chaque URL
      const urlCounts: Record<string, number> = {};
      
      for (const link of links) {
        const urlMatch = link.match(/href=["']([^"']*)["']/i);
        if (urlMatch && urlMatch[1]) {
          const url = urlMatch[1];
          urlCounts[url] = (urlCounts[url] || 0) + 1;
        }
      }
      
      // Vérifier s'il y a des URLs répétées plus de 2 fois
      const repeatedUrls = Object.entries(urlCounts)
        .filter(([, count]) => count > 2)
        .map(([url, count]) => ({ url, count }));
      
      if (repeatedUrls.length > 0) {
        // Extraire le texte du paragraphe pour l'identifier
        const paragraphText = paragraph.replace(/<[^>]*>/g, '').substring(0, 50) + '...';
        paragraphsWithTooManyRepeatedLinks.push(paragraphText);
      }
    }
    
    if (paragraphsWithTooManyRepeatedLinks.length > 0) {
      results.push({
        id: 'repeated-links-in-paragraph',
        title: 'Liens répétés dans les paragraphes',
        description: `${paragraphsWithTooManyRepeatedLinks.length} paragraphe(s) contiennent des liens répétés plus de 2 fois.`,
        status: 'problem',
        score: 3,
        priority: 'medium',
        category: 'links',
        suggestions: [
          'Évitez d\'avoir plus de 2 fois le même lien dans un même paragraphe.',
          'Les liens répétés peuvent être considérés comme du spam par les moteurs de recherche.',
          'Répartissez vos liens dans différents paragraphes pour une meilleure structure.'
        ]
      });
    }
  }
  
  // Analyse des images
  const hasImages = stats.imagesCount > 0;
  const allImagesHaveAlt = hasImages && stats.imagesWithAlt === stats.imagesCount;
  const allImagesHaveKeywordInAlt = hasImages && stats.imagesWithKeywordInAlt === stats.imagesCount;
  
  let imagesStatus: 'good' | 'improvement' | 'problem' = 'good';
  let imagesScore = 10;
  let imagesSuggestions: string[] = [];
  
  if (!hasImages) {
    imagesStatus = 'improvement';
    imagesScore = 4;
    imagesSuggestions.push('Ajoutez des images à votre contenu pour le rendre plus attrayant et améliorer le SEO.');
  } else {
    if (!allImagesHaveAlt) {
      imagesStatus = 'problem';
      imagesScore = 3; // Score réduit car c'est un problème important
      imagesSuggestions.push(`${stats.imagesCount - stats.imagesWithAlt} image(s) n'ont pas d'attribut alt. Ajoutez des descriptions alt à toutes vos images.`);
    }
    
    if (allImagesHaveAlt && !allImagesHaveKeywordInAlt && keywords.main) {
      const missingKeywordCount = stats.imagesCount - stats.imagesWithKeywordInAlt;
      if (imagesStatus === 'good') { // Ne pas écraser le statut 'problem' s'il est déjà défini
        imagesStatus = 'improvement';
        imagesScore = 6;
      }
      imagesSuggestions.push(`${missingKeywordCount} image(s) ont un attribut alt qui ne contient pas votre mot-clé principal "${keywords.main}".`);
      imagesSuggestions.push('Incluez votre mot-clé principal dans les attributs alt de vos images pour améliorer le référencement.');
    }
  }
  
  results.push({
    id: 'images-alt',
    title: 'Images et attributs alt',
    description: hasImages 
      ? `Votre contenu contient ${stats.imagesCount} image(s), dont ${stats.imagesWithAlt} avec attribut alt${keywords.main ? ` et ${stats.imagesWithKeywordInAlt} avec le mot-clé principal` : ''}.` 
      : 'Votre contenu ne contient pas d\'images.',
    status: imagesStatus,
    score: imagesScore,
    priority: 'medium',
    category: 'images',
    suggestions: imagesSuggestions
  });
  
  return results;
};

/**
 * Calcule le score SEO global basé sur les résultats d'analyse
 */
/**
 * Calcule le score SEO global basé sur les résultats d'analyse
 * avec une pondération améliorée pour les nouvelles recommandations
 */
export const calculateOverallScore = (results: ContentAnalysisResult[]): SeoScore => {
  if (results.length === 0) {
    return { value: 0, label: 'Non évalué', color: 'red' };
  }
  
  // Vérifier si seuls les mots-clés sont présents, sans métadonnées ni texte significatif
  const hasKeywords = results.some(result => result.category === 'keywords');
  const hasMetaTags = results.some(result => 
    (result.id === 'title-length' && result.description.includes('caractères') && !result.description.includes('0 caractères')) || 
    (result.id === 'description-length' && result.description.includes('caractères') && !result.description.includes('0 caractères'))
  );
  const hasContent = results.some(result => 
    (result.id === 'content-length' && result.score > 0) || 
    (result.id === 'paragraph-length' && result.score > 0) ||
    (result.id === 'h1-presence' && result.status !== 'problem')
  );
  
  if (hasKeywords && !hasMetaTags && !hasContent) {
    return { value: 0, label: 'Non évalué', color: 'red' };
  }
  
  // Poids des priorités - Augmenté pour donner plus d'importance aux problèmes critiques
  const priorityWeights = {
    high: 4,    // Augmenté de 3 à 4
    medium: 2,
    low: 1
  };
  
  // Poids des catégories - Pour donner plus d'importance aux mots-clés et à la structure
  const categoryWeights = {
    keywords: 1.6,    // Les mots-clés sont les plus importants pour le SEO (augmenté pour les mots-clés de longue traîne)
    structure: 1.3,   // La structure du contenu est également cruciale
    readability: 1.0, // Lisibilité standard
    meta: 1.2,        // Méta-données importantes
    links: 1.0,       // Liens augmentés en importance (pour la nouvelle recommandation sur les liens répétés)
    images: 1.0       // Images augmentées en importance (pour l'analyse des attributs alt avec mots-clés)
  };
  
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  // Facteurs d'ajustement pour les recommandations spécifiques
  const specificRecommendationAdjustments: Record<string, number> = {
    'content-length': 1.2,                    // Longueur du contenu est importante
    'secondary-keywords-in-h2': 1.3,          // Mots-clés secondaires dans H2 est crucial
    'some-secondary-keywords-missing-in-h2': 1.1,
    'longtail-keywords-in-h2': 1.5,           // Mots-clés de longue traîne dans H2 (nouvelle recommandation)
    'some-longtail-keywords-missing-in-h2': 1.3,
    'longtail-keywords-in-h2-good': 1.2,
    'longtail-keywords-density': 1.4,         // Densité des mots-clés de longue traîne (nouvelle recommandation)
    'longtail-keywords-density-good': 1.2,    // Bonne densité des mots-clés de longue traîne
    'repeated-links-in-paragraph': 1.2,       // Liens répétés dans les paragraphes (nouvelle recommandation)
    'keyword-in-title': 1.4,                  // Mot-clé dans le titre est très important
    'keyword-in-first-paragraph': 1.2,        // Mot-clé dans le premier paragraphe
    'keyword-density': 1.3,                   // Densité de mots-clés optimale
    'images-alt': 1.3                         // Attributs alt des images avec mots-clés (nouvelle recommandation)
  };
  
  results.forEach(result => {
    // Calcul du poids combiné (priorité × catégorie × ajustement spécifique)
    const priorityWeight = priorityWeights[result.priority];
    const categoryWeight = categoryWeights[result.category] || 1.0;
    const specificAdjustment = specificRecommendationAdjustments[result.id] || 1.0;
    
    const combinedWeight = priorityWeight * categoryWeight * specificAdjustment;
    
    // Calcul du score pondéré
    totalWeightedScore += result.score * combinedWeight;
    totalWeight += combinedWeight * 10; // 10 est le score maximum
  });
  
  const overallScore = Math.round((totalWeightedScore / totalWeight) * 100);
  
  // Détermination du label et de la couleur en fonction du score - Seuils ajustés
  let label: string;
  let color: 'red' | 'orange' | 'yellow' | 'green';
  
  if (overallScore < 40) {
    label = 'Insuffisant';
    color = 'red';
  } else if (overallScore < 60) {
    label = 'À améliorer';
    color = 'orange';
  } else if (overallScore < 75) {
    label = 'Moyen';
    color = 'yellow';
  } else if (overallScore < 90) {
    label = 'Bon';
    color = 'green';
  } else {
    label = 'Excellent';
    color = 'green';
  }
  
  return { value: overallScore, label, color };
};

/**
 * Exporte le contenu dans différents formats
 */
export const exportContent = (content: string, format: 'html' | 'markdown' | 'text'): string => {
  switch (format) {
    case 'html':
      return content;
    case 'markdown':
      // Conversion HTML vers Markdown (simplifiée)
      let markdown = content
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
        .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
        .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
        .replace(/<a[^>]*href=["'](.*?)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
        .replace(/<img[^>]*src=["'](.*?)["'][^>]*alt=["'](.*?)["'][^>]*>/gi, '![$2]($1)')
        .replace(/<ul[^>]*>(.*?)<\/ul>/gis, '$1')
        .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>/g, '');
      
      return markdown;
    case 'text':
      // Conversion HTML vers texte brut
      return content
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    default:
      return content;
  }
};

/**
 * Initialise l'état par défaut
 */
export const getInitialState = (): {
  content: string;
  keywords: KeywordData;
  metaTags: MetaTagsData;
} => {
  return {
    content: '<h1>Titre de votre article</h1><p>Commencez à rédiger votre contenu ici...</p>',
    keywords: {
      main: '',
      secondary: [],
      longTail: []
    },
    metaTags: {
      title: '',
      description: ''
    }
  };
};
