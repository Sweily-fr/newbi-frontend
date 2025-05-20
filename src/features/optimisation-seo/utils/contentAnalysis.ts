import { ContentAnalysisResult, ContentStats, KeywordData, MetaTagsData } from '../types';

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
  const isContentEmpty = !content || content === '';
  
  // Vérifier si les métadonnées sont vides
  const isMetaTagsEmpty = !metaTags.title && !metaTags.description;
  
  const results: ContentAnalysisResult[] = [];
  
  // Vérification du contenu vide
  if (isContentEmpty) {
    results.push({
      id: 'content-empty',
      title: 'Contenu vide',
      description: 'Votre contenu est vide. Ajoutez du contenu pour améliorer votre référencement.',
      status: 'problem',
      score: 0,
      priority: 'high',
      category: 'structure',
      suggestions: ['Commencez à rédiger votre contenu pour améliorer votre référencement.']
    });
  }
  
  // Vérification des métadonnées vides
  if (isMetaTagsEmpty) {
    results.push({
      id: 'meta-tags-missing',
      title: 'Métadonnées manquantes',
      description: 'Aucune métadonnée (titre ou description) n\'a été définie pour votre contenu.',
      status: 'problem',
      score: 0,
      priority: 'high',
      category: 'meta',
      suggestions: ['Ajoutez un titre et une description pour améliorer votre référencement.']
    });
  } else {
    // Vérification de la longueur du titre
    if (metaTags.title.length < 30 || metaTags.title.length > 60) {
      results.push({
        id: 'title-length',
        title: 'Longueur du titre',
        description: `Votre titre fait ${metaTags.title.length} caractères.`,
        status: 'improvement',
        score: 5,
        priority: 'high',
        category: 'meta',
        suggestions: ['Un bon titre SEO fait entre 30 et 60 caractères.']
      });
    }
    
    // Vérification de la longueur de la description
    if (metaTags.description.length < 70 || metaTags.description.length > 160) {
      results.push({
        id: 'description-length',
        title: 'Longueur de la description',
        description: `Votre description fait ${metaTags.description.length} caractères.`,
        status: 'improvement',
        score: 5,
        priority: 'medium',
        category: 'meta',
        suggestions: ['Une bonne description SEO fait entre 70 et 160 caractères.']
      });
    }
  }
  
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
    
    results.push({
      id: 'secondary-keywords-density',
      title: 'Densité des mots-clés secondaires',
      description: secondaryKeywordsWithLowDensity.length > 0
        ? `${secondaryKeywordsWithLowDensity.length} mot(s)-clé(s) secondaire(s) ont une densité trop faible.`
        : 'La densité de vos mots-clés secondaires est bonne.',
      status: secondaryKeywordsWithLowDensity.length > 0 ? 'improvement' : 'good',
      score: secondaryKeywordsWithLowDensity.length > 0 ? 5 : 10,
      priority: 'medium',
      category: 'keywords',
      suggestions: secondaryKeywordsWithLowDensity.length > 0
        ? [
            `Les mots-clés secondaires suivants ont une densité inférieure à 0.3% : ${secondaryKeywordsWithLowDensity.join(', ')}.`,
            'Essayez d\'inclure ces mots-clés plus fréquemment dans votre contenu pour améliorer leur visibilité.'
          ]
        : ['La densité de vos mots-clés secondaires est optimale.']
    });
  }
  
  // Analyse du mot-clé principal
  const hasMainKeyword = keywords.main && keywords.main.trim() !== '';
  
  // Vérification de la présence du mot-clé principal dans le titre
  const titleContainsKeyword = hasMainKeyword && metaTags.title.toLowerCase().includes(keywords.main.toLowerCase());
  results.push({
    id: 'keyword-in-title',
    title: 'Mot-clé principal dans le titre',
    description: !hasMainKeyword 
      ? 'Aucun mot-clé principal défini pour vérification.' 
      : titleContainsKeyword 
        ? 'Votre mot-clé principal est présent dans le titre.' 
        : 'Votre mot-clé principal n\'est pas présent dans le titre.',
    status: !hasMainKeyword ? 'improvement' : titleContainsKeyword ? 'good' : 'problem',
    score: !hasMainKeyword ? 5 : titleContainsKeyword ? 10 : 0,
    priority: 'high',
    category: 'keywords',
    suggestions: !hasMainKeyword 
      ? ['Définissez un mot-clé principal pour activer cette vérification.'] 
      : titleContainsKeyword 
        ? [] 
        : [`Ajoutez le mot-clé "${keywords.main}" dans votre titre.`]
  });
  
  // Vérification de la présence du mot-clé principal dans la méta description
  const descContainsKeyword = hasMainKeyword && metaTags.description.toLowerCase().includes(keywords.main.toLowerCase());
  results.push({
    id: 'keyword-in-meta',
    title: 'Mot-clé principal dans la méta description',
    description: !hasMainKeyword
      ? 'Aucun mot-clé principal défini pour vérification.'
      : descContainsKeyword 
        ? 'Votre mot-clé principal est présent dans la méta description.' 
        : 'Votre mot-clé principal n\'est pas présent dans la méta description.',
    status: !hasMainKeyword ? 'improvement' : descContainsKeyword ? 'good' : 'problem',
    score: !hasMainKeyword ? 5 : descContainsKeyword ? 8 : 0,
    priority: 'high',
    category: 'keywords',
    suggestions: !hasMainKeyword
      ? ['Définissez un mot-clé principal pour activer cette vérification.']
      : descContainsKeyword 
        ? [] 
        : [`Ajoutez le mot-clé "${keywords.main}" dans votre méta description.`]
  });
  
  // Analyse de la densité du mot-clé principal
  const mainKeywordDensity = stats.keywordDensity.main || 0;
  let keywordDensityStatus: 'good' | 'improvement' | 'problem' = !hasMainKeyword ? 'improvement' : 'good';
  let keywordDensityScore = !hasMainKeyword ? 5 : 10;
  const keywordDensitySuggestions: string[] = [];
  
  if (!hasMainKeyword) {
    keywordDensitySuggestions.push('Définissez un mot-clé principal pour analyser sa densité.');
  } else if (mainKeywordDensity < 0.5) {
    keywordDensityStatus = 'problem';
    keywordDensityScore = 3;
    keywordDensitySuggestions.push(`La densité du mot-clé principal (${mainKeywordDensity.toFixed(2)}%) est trop faible. Visez entre 0.5% et 2.5%.`);
  } else if (mainKeywordDensity > 2.5) {
    keywordDensityStatus = 'improvement';
    keywordDensityScore = 5;
    keywordDensitySuggestions.push(`La densité du mot-clé principal (${mainKeywordDensity.toFixed(2)}%) est trop élevée. Visez entre 0.5% et 2.5%.`);
  } else {
    keywordDensitySuggestions.push('La densité de votre mot-clé principal est optimale.');
  }
  
  results.push({
    id: 'keyword-density',
    title: 'Densité du mot-clé principal',
    description: !hasMainKeyword 
      ? 'Aucun mot-clé principal défini pour analyse.' 
      : `La densité du mot-clé principal est de ${mainKeywordDensity.toFixed(2)}%.`,
    status: keywordDensityStatus,
    score: keywordDensityScore,
    priority: 'medium',
    category: 'keywords',
    suggestions: keywordDensitySuggestions.length > 0 
      ? keywordDensitySuggestions 
      : ['La densité de votre mot-clé principal est bonne.']
  });
  
  // Vérification de la présence du mot-clé dans le premier paragraphe
  const firstParagraph = content.match(/<p[^>]*>(.*?)<\/p>/i)?.[1] || '';
  const keywordInFirstParagraph = hasMainKeyword && firstParagraph.toLowerCase().includes(keywords.main.toLowerCase());
  
  results.push({
    id: 'keyword-in-first-paragraph',
    title: 'Mot-clé dans le premier paragraphe',
    description: !hasMainKeyword
      ? 'Aucun mot-clé principal défini pour vérification.'
      : keywordInFirstParagraph 
        ? 'Votre mot-clé principal est présent dans le premier paragraphe.' 
        : 'Votre mot-clé principal n\'est pas présent dans le premier paragraphe.',
    status: !hasMainKeyword ? 'improvement' : keywordInFirstParagraph ? 'good' : 'improvement',
    score: !hasMainKeyword ? 5 : keywordInFirstParagraph ? 7 : 3,
    priority: 'medium',
    category: 'keywords',
    suggestions: !hasMainKeyword
      ? ['Définissez un mot-clé principal pour activer cette vérification.']
      : keywordInFirstParagraph 
        ? [] 
        : [`Ajoutez le mot-clé "${keywords.main}" dans le premier paragraphe.`]
  });
  
  // Analyse de la structure du contenu
  
  // Vérification de la présence d'un H1
  const hasH1 = stats.headingCount.h1 > 0;
  const tooManyH1 = stats.headingCount.h1 > 1;
  
  let h1Status: 'good' | 'improvement' | 'problem' = 'good';
  let h1Score = 10;
  const h1Suggestions: string[] = [];
  
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
    // Extraire le contenu de tous les H1 (même s'il ne devrait y en avoir qu'un)
    // Utiliser une expression régulière plus robuste qui capture le contenu HTML complet
    const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
    let h1Match;
    const allH1Contents = [];
    
    // Récupérer tous les H1 du contenu
    while ((h1Match = h1Regex.exec(content)) !== null) {
      // Nettoyer le contenu HTML en supprimant toutes les balises
      const cleanedContent = h1Match[1].replace(/<[^>]*>/g, '');
      allH1Contents.push(cleanedContent);
    }
    
    // Joindre tous les contenus H1 pour la recherche
    h1Content = allH1Contents.join(' ');
    
    if (keywords.main && h1Content) {
      // Vérifier si le mot-clé principal est présent dans le contenu H1
      // Utiliser une recherche insensible à la casse
      const keywordRegex = new RegExp(`\\b${keywords.main.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      const keywordInH1 = keywordRegex.test(h1Content);
      
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
    
    results.push({
      id: 'impactful-words-in-h1',
      title: 'Mots impactants dans le titre H1',
      description: impactfulWordsInH1.length > 0
        ? `Votre titre H1 contient ${impactfulWordsInH1.length} mot(s) impactant(s).`
        : 'Votre titre H1 ne contient pas de mots impactants.',
      status: impactfulWordsInH1.length > 0 ? 'good' : 'improvement',
      score: Math.min(10, impactfulWordsInH1.length * 3),
      priority: 'medium',
      category: 'structure',
      suggestions: impactfulWordsInH1.length > 0 
        ? [] 
        : ['Ajoutez des mots impactants dans votre titre H1 pour le rendre plus attractif.']
    });
  }
  
  // Vérification de la présence de sous-titres (H2, H3, H4)
  const hasSubheadings = stats.headingCount.h2 > 0 || stats.headingCount.h3 > 0 || stats.headingCount.h4 > 0;
  
  results.push({
    id: 'subheadings-presence',
    title: 'Sous-titres',
    description: hasSubheadings
      ? `Votre contenu contient des sous-titres (${stats.headingCount.h2} H2, ${stats.headingCount.h3} H3, ${stats.headingCount.h4} H4).`
      : 'Votre contenu ne contient pas de sous-titres.',
    status: hasSubheadings ? 'good' : 'problem',
    score: hasSubheadings ? 8 : 0,
    priority: 'medium',
    category: 'structure',
    suggestions: hasSubheadings 
      ? [] 
      : ['Ajoutez des sous-titres (H2, H3, H4) pour structurer votre contenu et améliorer sa lisibilité.']
  });
  
  // Analyse de la longueur du contenu
  let contentLengthStatus: 'good' | 'improvement' | 'problem' = 'good';
  let contentLengthScore = 10;
  const contentLengthSuggestions: string[] = [];
  
  if (stats.wordCount < 300) {
    contentLengthStatus = 'problem';
    contentLengthScore = 2;
    contentLengthSuggestions.push('Votre contenu est trop court. Visez au moins 600 mots pour un bon référencement.');
  } else if (stats.wordCount < 600) {
    contentLengthStatus = 'improvement';
    contentLengthScore = 5;
    contentLengthSuggestions.push('Votre contenu pourrait être plus long. Visez au moins 600 mots pour un bon référencement.');
  } else if (stats.wordCount > 2500) {
    contentLengthStatus = 'good';
    contentLengthScore = 10;
    contentLengthSuggestions.push('Votre contenu est très complet, ce qui est excellent pour le référencement.');
  }
  
  results.push({
    id: 'content-length',
    title: 'Longueur du contenu',
    description: `Votre contenu contient ${stats.wordCount} mots.`,
    status: contentLengthStatus,
    score: contentLengthScore,
    priority: 'high',
    category: 'readability',
    suggestions: contentLengthSuggestions
  });
  
  return results;
};
