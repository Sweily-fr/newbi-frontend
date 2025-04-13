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
  
  // Comptage des titres
  const headingCount = {
    h1: (content.match(/<h1[^>]*>/g) || []).length,
    h2: (content.match(/<h2[^>]*>/g) || []).length,
    h3: (content.match(/<h3[^>]*>/g) || []).length,
    h4: (content.match(/<h4[^>]*>/g) || []).length,
  };
  
  // Comptage des liens
  const internalLinkCount = (content.match(/<a[^>]*href=["'][^"']*["'][^>]*>/g) || [])
    .filter(link => !link.includes('http')).length;
  const externalLinkCount = (content.match(/<a[^>]*href=["']http[^"']*["'][^>]*>/g) || []).length;
  
  // Comptage des images
  const imagesCount = (content.match(/<img[^>]*>/g) || []).length;
  const imagesWithAlt = (content.match(/<img[^>]*alt=["'][^"']*["'][^>]*>/g) || []).length;
  
  return {
    wordCount,
    paragraphCount,
    sentenceCount,
    avgSentenceLength,
    readingTime,
    fleschScore,
    keywordDensity: {
      main: mainKeywordDensity,
      secondary: secondaryKeywordDensity
    },
    headingCount,
    linksCount: {
      internal: internalLinkCount,
      external: externalLinkCount
    },
    imagesCount,
    imagesWithAlt
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
 * Analyse le contenu et génère des résultats d'analyse
 */
export const analyzeContent = (
  content: string, 
  keywords: KeywordData, 
  metaTags: MetaTagsData, 
  stats: ContentStats
): ContentAnalysisResult[] => {
  const results: ContentAnalysisResult[] = [];
  
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
  
  // Vérification de la structure des sous-titres
  const hasSubheadings = stats.headingCount.h2 > 0 || stats.headingCount.h3 > 0;
  
  results.push({
    id: 'subheadings',
    title: 'Sous-titres',
    description: hasSubheadings 
      ? `Votre contenu contient ${stats.headingCount.h2} titres H2 et ${stats.headingCount.h3} titres H3.` 
      : 'Votre contenu ne contient pas de sous-titres (H2, H3).',
    status: hasSubheadings ? 'good' : 'problem',
    score: hasSubheadings ? 8 : 2,
    priority: 'high',
    category: 'structure',
    suggestions: hasSubheadings ? [] : ['Ajoutez des sous-titres (H2, H3) pour structurer votre contenu.']
  });
  
  // Analyse de la longueur du contenu
  let contentLengthStatus: 'good' | 'improvement' | 'problem' = 'good';
  let contentLengthScore = 10;
  let contentLengthSuggestions: string[] = [];
  
  if (stats.wordCount < 300) {
    contentLengthStatus = 'problem';
    contentLengthScore = 2;
    contentLengthSuggestions.push(`Votre contenu est trop court (${stats.wordCount} mots). Visez au moins 300 mots pour un contenu minimal.`);
  } else if (stats.wordCount < 600) {
    contentLengthStatus = 'improvement';
    contentLengthScore = 5;
    contentLengthSuggestions.push(`Votre contenu est un peu court (${stats.wordCount} mots). Visez au moins 600 mots pour un bon référencement.`);
  } else if (stats.wordCount > 2000) {
    contentLengthStatus = 'improvement';
    contentLengthScore = 7;
    contentLengthSuggestions.push(`Votre contenu est très long (${stats.wordCount} mots). Assurez-vous qu'il reste engageant pour le lecteur.`);
  }
  
  results.push({
    id: 'content-length',
    title: 'Longueur du contenu',
    description: `Votre contenu contient ${stats.wordCount} mots.`,
    status: contentLengthStatus,
    score: contentLengthScore,
    priority: 'medium',
    category: 'structure',
    suggestions: contentLengthSuggestions
  });
  
  // Analyse de la lisibilité
  let readabilityStatus: 'good' | 'improvement' | 'problem' = 'good';
  let readabilityScore = 10;
  let readabilitySuggestions: string[] = [];
  
  if (stats.fleschScore < 30) {
    readabilityStatus = 'problem';
    readabilityScore = 2;
    readabilitySuggestions.push('Votre contenu est très difficile à lire. Simplifiez vos phrases et utilisez des mots plus courants.');
  } else if (stats.fleschScore < 50) {
    readabilityStatus = 'improvement';
    readabilityScore = 5;
    readabilitySuggestions.push('Votre contenu est assez difficile à lire. Essayez de raccourcir vos phrases et d\'utiliser un vocabulaire plus simple.');
  } else if (stats.fleschScore > 80) {
    readabilityStatus = 'good';
    readabilityScore = 9;
    readabilitySuggestions.push('Votre contenu est très facile à lire. C\'est parfait pour un large public.');
  }
  
  results.push({
    id: 'readability',
    title: 'Lisibilité',
    description: `Score de lisibilité Flesch : ${stats.fleschScore.toFixed(1)}`,
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
  
  // Analyse des images
  const hasImages = stats.imagesCount > 0;
  const allImagesHaveAlt = hasImages && stats.imagesWithAlt === stats.imagesCount;
  
  let imagesStatus: 'good' | 'improvement' | 'problem' = 'good';
  let imagesScore = 10;
  let imagesSuggestions: string[] = [];
  
  if (!hasImages) {
    imagesStatus = 'improvement';
    imagesScore = 4;
    imagesSuggestions.push('Ajoutez des images à votre contenu pour le rendre plus attrayant et améliorer le SEO.');
  } else if (!allImagesHaveAlt) {
    imagesStatus = 'improvement';
    imagesScore = 6;
    imagesSuggestions.push(`${stats.imagesCount - stats.imagesWithAlt} image(s) n'ont pas d'attribut alt. Ajoutez des descriptions alt à toutes vos images.`);
  }
  
  results.push({
    id: 'images',
    title: 'Images et attributs alt',
    description: hasImages 
      ? `Votre contenu contient ${stats.imagesCount} image(s), dont ${stats.imagesWithAlt} avec attribut alt.` 
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
export const calculateOverallScore = (results: ContentAnalysisResult[]): SeoScore => {
  if (results.length === 0) {
    return { value: 0, label: 'Non évalué', color: 'red' };
  }
  
  // Calcul du score total pondéré par priorité
  const priorityWeights = {
    high: 3,
    medium: 2,
    low: 1
  };
  
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  results.forEach(result => {
    const weight = priorityWeights[result.priority];
    totalWeightedScore += result.score * weight;
    totalWeight += weight * 10; // 10 est le score maximum
  });
  
  const overallScore = Math.round((totalWeightedScore / totalWeight) * 100);
  
  // Détermination du label et de la couleur en fonction du score
  let label: string;
  let color: 'red' | 'orange' | 'green';
  
  if (overallScore < 50) {
    label = 'Nécessite des améliorations';
    color = 'red';
  } else if (overallScore < 70) {
    label = 'Moyen';
    color = 'orange';
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
      secondary: []
    },
    metaTags: {
      title: '',
      description: ''
    }
  };
};
