import { ContentStats, KeywordData } from '../types';

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
