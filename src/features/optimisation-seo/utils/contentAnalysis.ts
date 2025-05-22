import { ContentAnalysisResult, ContentStats, KeywordData, MetaTagsData } from '../types';

interface LinkStats {
  internal: number;
  external: number;
  internalLinks: string[];
  externalLinks: string[];
}

interface MediaStats {
  images: number;
  imagesWithoutAlt: number;
  videos: number;
  videosWithoutAlt: number;
  imageTags: Array<{src: string; alt: string}>;
  videoTags: Array<{src: string; alt: string}>;
}

/**
 * Compte les liens internes et externes dans le contenu
 */
const countLinks = (content: string, baseDomain: string = ''): LinkStats => {
  if (!content) return { internal: 0, external: 0, internalLinks: [], externalLinks: [] };
  
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
  const links: string[] = [];
  let match;
  
  // Récupérer tous les liens
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[2];
    if (href && !href.startsWith('#')) {
      links.push(href);
    }
  }
  
  // Séparer les liens internes et externes
  const result: LinkStats = {
    internal: 0,
    external: 0,
    internalLinks: [],
    externalLinks: []
  };
  
  links.forEach(link => {
    try {
      const url = new URL(link, baseDomain ? `https://${baseDomain}` : undefined);
      const isInternal = !baseDomain || 
                        url.hostname === baseDomain || 
                        url.hostname.endsWith(`.${baseDomain}`);
      
      if (isInternal) {
        result.internal++;
        if (!result.internalLinks.includes(link)) {
          result.internalLinks.push(link);
        }
      } else {
        result.external++;
        if (!result.externalLinks.includes(link)) {
          result.externalLinks.push(link);
        }
      }
    } catch {
      // Si l'URL est invalide, on la considère comme interne (lien relatif)
      result.internal++;
      if (!result.internalLinks.includes(link)) {
        result.internalLinks.push(link);
      }
    }
  });
  
  return result;
};

/**
 * Analyse les images et vidéos dans le contenu
 */
const analyzeMedia = (content: string): MediaStats => {
  if (!content) return { 
    images: 0, 
    imagesWithoutAlt: 0, 
    videos: 0, 
    videosWithoutAlt: 0, 
    imageTags: [], 
    videoTags: [] 
  };

  // Analyser les images
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']?([^"'\s>]*)["']?[^>]*>/gi;
  const images: Array<{src: string; alt: string}> = [];
  let imgMatch;
  
  while ((imgMatch = imgRegex.exec(content)) !== null) {
    const src = imgMatch[1];
    const alt = (imgMatch[2] || '').trim();
    images.push({ src, alt });
  }

  // Analyser les vidéos
  const videoRegex = /<video[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const videos: Array<{src: string; alt: string}> = [];
  let videoMatch;
  
  while ((videoMatch = videoRegex.exec(content)) !== null) {
    const src = videoMatch[1];
    // Extraire l'attribut alt s'il existe
    const altMatch = videoMatch[0].match(/alt=["']([^"']*)["']/i);
    const alt = (altMatch ? altMatch[1] : '').trim();
    videos.push({ src, alt });
  }

  return {
    images: images.length,
    imagesWithoutAlt: images.filter(img => !img.alt).length,
    videos: videos.length,
    videosWithoutAlt: videos.filter(video => !video.alt).length,
    imageTags: images,
    videoTags: videos
  };
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
  const isContentEmpty = !content || content === '';
  
  const results: ContentAnalysisResult[] = [];
  
  // Déclaration de hasMainKeyword au début de la fonction
  const hasMainKeyword = keywords.main && keywords.main.trim() !== '';
  
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
  
  // Vérification du titre
  if (!metaTags.title) {
    results.push({
      id: 'meta-title-missing',
      title: 'Titre manquant',
      description: 'Aucun titre n\'a été défini pour votre contenu.',
      status: 'problem',
      score: 0,
      priority: 'high',
      category: 'meta',
      suggestions: ['Ajoutez un titre accrocheur pour améliorer votre référencement et attirer les lecteurs.']
    });
  } else {
    // Vérification de la longueur du titre
    const titleLength = metaTags.title.length;
    const isTitleLengthOptimal = titleLength >= 30 && titleLength <= 60;
    
    results.push({
      id: 'title-length',
      title: 'Longueur du titre',
      description: `Votre titre fait ${titleLength} caractères.`,
      status: isTitleLengthOptimal ? 'good' : 'improvement',
      score: isTitleLengthOptimal ? 10 : 5,
      priority: 'high',
      category: 'meta',
      suggestions: isTitleLengthOptimal 
        ? ['Parfait ! Votre titre a une longueur optimale pour le référencement.']
        : [
            'Un bon titre SEO fait entre 30 et 60 caractères.',
            titleLength < 30 ? 'Votre titre est trop court. Ajoutez des détails pertinents.' : 'Votre titre est trop long. Essayez de le rendre plus concis.'
          ]
    });
    
    // Vérification de la présence de mots-clés dans le titre
    if (hasMainKeyword) {
      const titleContainsKeyword = metaTags.title.toLowerCase().includes(keywords.main.toLowerCase());
      results.push({
        id: 'keyword-in-meta-title',
        title: 'Mot-clé dans le titre',
        description: titleContainsKeyword 
          ? `Votre mot-clé principal "${keywords.main}" est présent dans le titre.` 
          : `Votre mot-clé principal "${keywords.main}" n'est pas présent dans le titre.`,
        status: titleContainsKeyword ? 'good' : 'problem',
        score: titleContainsKeyword ? 10 : 3,
        priority: 'high',
        category: 'meta',
        suggestions: titleContainsKeyword 
          ? ['Parfait ! Votre mot-clé principal est bien présent dans le titre.'] 
          : [`Ajoutez le mot-clé "${keywords.main}" dans votre titre pour améliorer le référencement.`]
      });
    }
  }
  
  // Vérification de la description
  if (!metaTags.description) {
    results.push({
      id: 'meta-description-missing',
      title: 'Description manquante',
      description: 'Aucune méta description n\'a été définie pour votre contenu.',
      status: 'problem',
      score: 0,
      priority: 'high',
      category: 'meta',
      suggestions: ['Ajoutez une description attrayante qui incitera les utilisateurs à cliquer sur votre résultat de recherche.']
    });
  } else {
    // Vérification de la longueur de la description
    const descLength = metaTags.description.length;
    const isDescLengthOptimal = descLength >= 70 && descLength <= 160;
    
    results.push({
      id: 'description-length',
      title: 'Longueur de la description',
      description: `Votre description fait ${descLength} caractères.`,
      status: isDescLengthOptimal ? 'good' : 'improvement',
      score: isDescLengthOptimal ? 10 : 5,
      priority: 'medium',
      category: 'meta',
      suggestions: isDescLengthOptimal 
        ? ['Parfait ! Votre description a une longueur optimale pour le référencement.']
        : [
            'Une bonne description SEO fait entre 70 et 160 caractères.',
            descLength < 70 ? 'Votre description est trop courte. Ajoutez plus de détails pour attirer les lecteurs.' : 'Votre description est trop longue. Elle pourrait être tronquée dans les résultats de recherche.'
          ]
    });
    
    // Vérification de la présence de mots-clés dans la description
    if (hasMainKeyword) {
      const descContainsKeyword = metaTags.description.toLowerCase().includes(keywords.main.toLowerCase());
      results.push({
        id: 'keyword-in-meta-desc',
        title: 'Mot-clé dans la description',
        description: descContainsKeyword 
          ? `Votre mot-clé principal "${keywords.main}" est présent dans la description.` 
          : `Votre mot-clé principal "${keywords.main}" n'est pas présent dans la description.`,
        status: descContainsKeyword ? 'good' : 'improvement',
        score: descContainsKeyword ? 8 : 4,
        priority: 'medium',
        category: 'meta',
        suggestions: descContainsKeyword 
          ? ['Parfait ! Votre mot-clé principal est bien présent dans la description.'] 
          : [`Envisagez d'ajouter le mot-clé "${keywords.main}" dans votre description pour améliorer le référencement.`]
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
  
  // Vérification de la présence du mot-clé principal dans le titre
  const titleContainsKeyword = hasMainKeyword && metaTags.title.toLowerCase().includes(keywords.main.toLowerCase());
  results.push({
    id: 'keyword-in-title',
    title: 'Mot-clé principal dans le titre',
    description: hasMainKeyword
      ? titleContainsKeyword 
        ? 'Votre mot-clé principal est présent dans le titre.' 
        : 'Votre mot-clé principal n\'est pas présent dans le titre.'
      : 'Aucun mot-clé principal défini.',
    status: hasMainKeyword 
      ? (titleContainsKeyword ? 'good' : 'problem')
      : 'improvement',
    score: hasMainKeyword 
      ? (titleContainsKeyword ? 10 : 0)
      : 5,
    priority: 'high',
    category: 'keywords',
    suggestions: hasMainKeyword
      ? (titleContainsKeyword 
          ? ['Parfait ! Votre mot-clé principal est bien présent dans le titre.']
          : [`Ajoutez le mot-clé "${keywords.main}" dans votre titre.`])
      : ['Définissez un mot-clé principal pour optimiser votre référencement.']
  });
  
  // Vérification de la présence du mot-clé principal dans la méta description
  const descContainsKeyword = hasMainKeyword && metaTags.description.toLowerCase().includes(keywords.main.toLowerCase());
  results.push({
    id: 'keyword-in-meta',
    title: 'Mot-clé principal dans la méta description',
    description: hasMainKeyword
      ? (descContainsKeyword 
          ? 'Votre mot-clé principal est présent dans la méta description.' 
          : 'Votre mot-clé principal n\'est pas présent dans la méta description.')
      : 'Aucun mot-clé principal défini.',
    status: hasMainKeyword 
      ? (descContainsKeyword ? 'good' : 'problem')
      : 'improvement',
    score: hasMainKeyword 
      ? (descContainsKeyword ? 8 : 0)
      : 4,
    priority: 'high',
    category: 'keywords',
    suggestions: hasMainKeyword
      ? (descContainsKeyword 
          ? ['Parfait ! Votre mot-clé principal est bien présent dans la méta description.']
          : [`Ajoutez le mot-clé "${keywords.main}" dans votre méta description.`])
      : ['Définissez un mot-clé principal pour optimiser votre référencement.']
  });
  
  // Analyse de la densité du mot-clé principal
  const mainKeywordDensity = stats.keywordDensity.main || 0;
  results.push({
    id: 'keyword-density',
    title: 'Densité du mot-clé principal',
    description: hasMainKeyword
      ? `La densité du mot-clé principal est de ${mainKeywordDensity.toFixed(2)}%.`
      : 'Aucun mot-clé principal défini.',
    status: !hasMainKeyword 
      ? 'improvement' 
      : mainKeywordDensity >= 0.5 && mainKeywordDensity <= 2.5 
        ? 'good' 
        : mainKeywordDensity < 0.5 
          ? 'problem' 
          : 'improvement',
    score: !hasMainKeyword 
      ? 4 
      : mainKeywordDensity >= 0.5 && mainKeywordDensity <= 2.5 
        ? 10 
        : mainKeywordDensity < 0.5 
          ? 3 
          : 5,
    priority: 'medium',
    category: 'keywords',
    suggestions: !hasMainKeyword
      ? ['Définissez un mot-clé principal pour analyser sa densité.']
      : mainKeywordDensity < 0.5
        ? [`La densité de votre mot-clé principal est de ${mainKeywordDensity.toFixed(2)}%, ce qui est trop faible. Visez entre 0.5% et 2.5%.`]
        : mainKeywordDensity > 2.5
          ? [`La densité de votre mot-clé principal est de ${mainKeywordDensity.toFixed(2)}%, ce qui est trop élevé. Visez entre 0.5% et 2.5%.`]
          : [`Parfait ! La densité de votre mot-clé principal est de ${mainKeywordDensity.toFixed(2)}%, ce qui est optimal.`]
  });
  
  // Vérification de la présence du mot-clé principal dans le premier paragraphe
  const firstParagraph = content.match(/<p[^>]*>(.*?)<\/p>/i)?.[1] || '';
  const keywordInFirstParagraph = hasMainKeyword && firstParagraph.toLowerCase().includes(keywords.main.toLowerCase());
  
  results.push({
    id: 'keyword-in-first-paragraph',
    title: 'Mot-clé dans le premier paragraphe',
    description: hasMainKeyword
      ? (keywordInFirstParagraph 
          ? 'Votre mot-clé principal est présent dans le premier paragraphe.' 
          : 'Votre mot-clé principal n\'est pas présent dans le premier paragraphe.')
      : 'Aucun mot-clé principal défini.',
    status: hasMainKeyword 
      ? (keywordInFirstParagraph ? 'good' : 'improvement')
      : 'improvement',
    score: hasMainKeyword 
      ? (keywordInFirstParagraph ? 7 : 3)
      : 4,
    priority: 'medium',
    category: 'keywords',
    suggestions: hasMainKeyword
      ? (keywordInFirstParagraph 
          ? ['Parfait ! Votre mot-clé principal est bien présent dans le premier paragraphe.']
          : [`Ajoutez le mot-clé "${keywords.main}" dans le premier paragraphe.`])
      : ['Définissez un mot-clé principal pour optimiser votre référencement.']
  });
  
  // Analyse de la structure du contenu
  
  // Vérification de la présence d'un H1
  const hasH1 = stats.structure.headings.h1 > 0;
  const tooManyH1 = stats.structure.headings.h1 > 1;
  
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
        ? `Votre contenu contient ${stats.structure.headings.h1} titres H1.` 
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
  
  // Vérification du mot-clé dans le H1
  if (!hasH1) {
    results.push({
      id: 'keyword-in-h1',
      title: 'Mot-clé principal dans le titre H1',
      description: 'Aucun titre H1 trouvé dans le contenu.',
      status: 'problem',
      score: 0,
      priority: 'high',
      category: 'keywords',
      suggestions: ['Ajoutez un titre H1 à votre contenu et incluez-y votre mot-clé principal.']
    });
  } else if (!hasMainKeyword) {
    results.push({
      id: 'keyword-in-h1',
      title: 'Mot-clé principal dans le titre H1',
      description: 'Aucun mot-clé principal défini pour vérification.',
      status: 'improvement',
      score: 5,
      priority: 'high',
      category: 'keywords',
      suggestions: ['Définissez un mot-clé principal pour optimiser votre référencement.']
    });
  } else {
    // Vérifier si le mot-clé principal est présent dans le contenu H1
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
      suggestions: keywordInH1 
        ? ['Parfait ! Votre mot-clé principal est bien présent dans le titre H1.'] 
        : [`Ajoutez le mot-clé "${keywords.main}" dans votre titre H1 pour améliorer le référencement.`]
    });
  }
  
  // Analyse des médias (images et vidéos)
  const mediaStats = analyzeMedia(content);
  
  // Vérification des images
  results.push({
    id: 'images-count',
    title: 'Images dans le contenu',
    description: mediaStats.images > 0 
      ? `Votre contenu contient ${mediaStats.images} image(s).`
      : 'Aucune image trouvée dans votre contenu.',
    status: mediaStats.images >= 3 ? 'good' : mediaStats.images > 0 ? 'improvement' : 'problem',
    score: mediaStats.images >= 3 ? 10 : mediaStats.images > 0 ? 5 : 0,
    priority: 'medium',
    category: 'images',
    suggestions: mediaStats.images >= 3 
      ? ['Parfait ! Votre contenu contient suffisamment d\'images.']
      : [
          `Ajoutez au moins ${3 - mediaStats.images} image(s) supplémentaire(s) pour améliorer l'attrait visuel.`,
          'Les images aident à briser le texte et à rendre le contenu plus engageant.'
        ]
  });

  // Vérification des balises alt des images
  results.push({
    id: 'images-alt-tags',
    title: 'Balises alt des images',
    description: mediaStats.images === 0
      ? 'Aucune image trouvée pour vérifier les balises alt.'
      : mediaStats.imagesWithoutAlt === 0
        ? 'Toutes vos images ont une balise alt.'
        : `${mediaStats.imagesWithoutAlt} image(s) sur ${mediaStats.images} n'ont pas de balise alt.`,
    status: mediaStats.images === 0 
      ? 'improvement' 
      : mediaStats.imagesWithoutAlt === 0 
        ? 'good' 
        : 'problem',
    score: mediaStats.images === 0 
      ? 5 
      : mediaStats.imagesWithoutAlt === 0 
        ? 10 
        : 3,
    priority: 'high',
    category: 'images',
    suggestions: mediaStats.images === 0
      ? ['Ajoutez des images à votre contenu pour améliorer son attrait visuel.']
      : mediaStats.imagesWithoutAlt === 0
        ? ['Parfait ! Toutes vos images ont une balise alt descriptive.']
        : [
            'Ajoutez des balises alt à toutes vos images pour améliorer l\'accessibilité et le référencement.',
            'Les balises alt devraient décrire brièvement le contenu de l\'image.'
          ]
  });

  // Vérification des vidéos
  results.push({
    id: 'videos-count',
    title: 'Vidéos dans le contenu',
    description: mediaStats.videos > 0 
      ? `Votre contenu contient ${mediaStats.videos} vidéo(s).`
      : 'Aucune vidéo trouvée dans votre contenu.',
    status: mediaStats.videos >= 1 ? 'good' : 'improvement',
    score: mediaStats.videos >= 1 ? 10 : 5,
    priority: 'low',
    category: 'images',
    suggestions: mediaStats.videos >= 1 
      ? ['Parfait ! Votre contenu contient des vidéos.']
      : [
          'Envisagez d\'ajouter une vidéo pour améliorer l\'engagement des utilisateurs.',
          'Les vidéos peuvent aider à expliquer des concepts complexes ou à montrer des démonstrations.'
        ]
  });

  // Vérification des balises alt des vidéos
  results.push({
    id: 'videos-alt-tags',
    title: 'Balises alt des vidéos',
    description: mediaStats.videos === 0
      ? 'Aucune vidéo trouvée pour vérifier les balises alt.'
      : mediaStats.videosWithoutAlt === 0
        ? 'Toutes vos vidéos ont une balise alt.'
        : `${mediaStats.videosWithoutAlt} vidéo(s) sur ${mediaStats.videos} n'ont pas de balise alt.`,
    status: mediaStats.videos === 0 
      ? 'improvement' 
      : mediaStats.videosWithoutAlt === 0 
        ? 'good' 
        : 'problem',
    score: mediaStats.videos === 0 
      ? 5 
      : mediaStats.videosWithoutAlt === 0 
        ? 10 
        : 3,
    priority: 'medium',
    category: 'images',
    suggestions: mediaStats.videos === 0
      ? ['Envisagez d\'ajouter des vidéos pour améliorer l\'engagement des utilisateurs.']
      : mediaStats.videosWithoutAlt === 0
        ? ['Parfait ! Toutes vos vidéos ont une balise alt descriptive.']
        : [
            'Ajoutez des balises alt à toutes vos vidéos pour améliorer l\'accessibilité.',
            'Les balises alt pour les vidéos devraient décrire brièvement le contenu de la vidéo.'
          ]
  });
  
  // Analyse des liens
  const linkStats = countLinks(content, 'votredomaine.com'); // Remplacez par votre domaine réel
  
  // Vérification des liens externes
  results.push({
    id: 'external-links',
    title: 'Liens externes',
    description: linkStats.external > 0 
      ? `Votre contenu contient ${linkStats.external} lien(s) externe(s).`
      : 'Aucun lien externe trouvé dans votre contenu.',
    status: linkStats.external >= 3 ? 'good' : linkStats.external > 0 ? 'improvement' : 'problem',
    score: linkStats.external >= 3 ? 10 : linkStats.external > 0 ? 5 : 0,
    priority: 'medium',
    category: 'links',
    suggestions: linkStats.external >= 3 
      ? ['Parfait ! Votre contenu contient suffisamment de liens externes.']
      : [
          `Ajoutez au moins ${3 - linkStats.external} lien(s) externe(s) supplémentaire(s) pour améliorer votre référencement.`,
          'Les liens externes de qualité vers des sources fiables améliorent la crédibilité de votre contenu.'
        ]
  });
  
  // Vérification des liens internes
  results.push({
    id: 'internal-links',
    title: 'Liens internes',
    description: linkStats.internal > 0 
      ? `Votre contenu contient ${linkStats.internal} lien(s) interne(s).`
      : 'Aucun lien interne trouvé dans votre contenu.',
    status: linkStats.internal >= 3 ? 'good' : linkStats.internal > 0 ? 'improvement' : 'problem',
    score: linkStats.internal >= 3 ? 10 : linkStats.internal > 0 ? 5 : 0,
    priority: 'medium',
    category: 'links',
    suggestions: linkStats.internal >= 3 
      ? ['Parfait ! Votre contenu contient suffisamment de liens internes.']
      : [
          `Ajoutez au moins ${3 - linkStats.internal} lien(s) interne(s) supplémentaire(s) pour améliorer la structure de votre site.`,
          'Les liens internes aident les moteurs de recherche à comprendre la hiérarchie de votre site.',
          'Pensez à lier vers des articles connexes ou des pages importantes de votre site.'
        ]
  });
  
  // Vérification de la présence de mots impactants dans le titre H1 si H1 existe
  if (hasH1) {
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
  const hasSubheadings = stats.structure.headings.h2 > 0 || stats.structure.headings.h3 > 0 || stats.structure.headings.h4 > 0;
  
  results.push({
    id: 'subheadings-presence',
    title: 'Sous-titres',
    description: hasSubheadings
      ? `Votre contenu contient des sous-titres (${stats.structure.headings.h2} H2, ${stats.structure.headings.h3} H3, ${stats.structure.headings.h4} H4).`
      : 'Votre contenu ne contient pas de sous-titres.',
    status: hasSubheadings ? 'good' : 'problem',
    score: hasSubheadings ? 8 : 0,
    priority: 'medium',
    category: 'structure',
    suggestions: hasSubheadings 
      ? [] 
      : ['Ajoutez des sous-titres (H2, H3, H4) pour structurer votre contenu et améliorer sa lisibilité.']
  });
  
  // Analyse de la lisibilité pour un public jeune (15 ans)
  const isEasyToRead = stats.readability.fleschScore >= 70; // Score Flesch-Kincaid pour un public de 13-15 ans
  const isModeratelyDifficult = stats.readability.fleschScore >= 60 && stats.readability.fleschScore < 70;
  const isDifficult = stats.readability.fleschScore < 60;
  
  // Analyse de la longueur des phrases
  const isSentenceLengthOptimal = stats.readability.avgSentenceLength <= 15; // Moins de 15 mots par phrase en moyenne
  
  // Vérification de la simplicité du langage
  const complexWordPercentage = stats.readability.complexWordPercentage;
  const isLanguageSimple = complexWordPercentage <= 10; // Moins de 10% de mots complexes
  
  // Analyse de la longueur du contenu (adaptée aux jeunes lecteurs)
  let contentLengthStatus: 'good' | 'improvement' | 'problem' = 'good';
  let contentLengthScore = 10;
  const contentLengthSuggestions: string[] = [];
  
  if (stats.length.words < 400) {
    contentLengthStatus = 'problem';
    contentLengthScore = 2;
    contentLengthSuggestions.push('Votre contenu est trop court. Visez au moins 400 mots pour maintenir l\'intérêt des jeunes lecteurs.');
  } else if (stats.length.words < 800) {
    contentLengthStatus = 'improvement';
    contentLengthScore = 5;
    contentLengthSuggestions.push('Votre contenu est bien, mais il pourrait être un peu plus long. Visez 800 mots pour un contenu complet.');
  } else if (stats.length.words > 1500) {
    contentLengthStatus = 'improvement';
    contentLengthScore = 8;
    contentLengthSuggestions.push('Votre contenu est très complet, mais attention à ne pas être trop long pour les jeunes lecteurs. Pensez à le découper en plusieurs parties si nécessaire.');
  }
  
  // Ajout des vérifications de lisibilité
  if (isDifficult) {
    contentLengthStatus = 'problem';
    contentLengthScore = Math.max(2, contentLengthScore - 3);
    contentLengthSuggestions.push('Votre contenu est trop complexe pour des jeunes de 15 ans. Simplifiez le vocabulaire et les phrases.');
  } else if (isModeratelyDifficult) {
    contentLengthStatus = 'improvement';
    contentLengthScore = Math.max(5, contentLengthScore - 1);
    contentLengthSuggestions.push('Votre contenu est un peu difficile. Essayez de simplifier certaines phrases ou d\'expliquer les termes complexes.');
  }
  
  if (!isSentenceLengthOptimal) {
    contentLengthStatus = 'improvement';
    contentLengthSuggestions.push(`Vos phrases font en moyenne ${stats.readability.avgSentenceLength.toFixed(1)} mots. Essayez de faire des phrases plus courtes (moins de 15 mots en moyenne).`);
  }
  
  if (!isLanguageSimple) {
    contentLengthStatus = 'improvement';
    contentLengthSuggestions.push(`Votre contenu contient ${complexWordPercentage.toFixed(1)}% de mots complexes. Pour des jeunes de 15 ans, essayez de rester sous les 10%.`);
  }
  
  results.push({
    id: 'content-readability',
    title: 'Lisibilité pour les 15 ans et +',
    description: `
      • ${stats.length.words} mots (${stats.length.characters} caractères)
      • ${stats.length.paragraphs} paragraphes, ${stats.length.sentences} phrases
      • Temps de lecture: ${stats.length.readingTime} min
      • Score de lisibilité: ${stats.readability.fleschScore.toFixed(1)}/100
      • Longueur moyenne des phrases: ${stats.readability.avgSentenceLength.toFixed(1)} mots
      • ${stats.readability.complexWordPercentage.toFixed(1)}% de mots complexes (${stats.readability.complexWords} mots)
    `,
    status: contentLengthStatus,
    score: contentLengthScore,
    priority: 'high',
    category: 'readability',
    suggestions: contentLengthSuggestions
  });
  
  return results;
};
