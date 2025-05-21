// Définition des types locaux pour éviter les dépendances circulaires
type ContentAnalysisResultStatus = 'good' | 'improvement' | 'problem';
type ContentAnalysisResultCategory = 'keywords' | 'structure' | 'readability' | 'meta' | 'links' | 'images';
type ContentAnalysisResultPriority = 'high' | 'medium' | 'low';

interface ContentAnalysisResult {
  id: string;
  title: string;
  description: string;
  status: ContentAnalysisResultStatus;
  score: number;
  priority: ContentAnalysisResultPriority;
  category: ContentAnalysisResultCategory;
  suggestions?: string[];
}

// Fonction pour obtenir la couleur de la bordure en fonction du statut
export const getStatusBorderColor = (status: 'good' | 'improvement' | 'problem') => {
  switch (status) {
    case 'good':
      return 'border-l-4 border-green-500';
    case 'improvement':
      return 'border-l-4 border-[#5b50ff]';
    case 'problem':
      return 'border-l-4 border-red-500';
    default:
      return 'border-l-4 border-gray-300';
  }
};

// Fonction pour obtenir le nom de l'icône en fonction du statut
// Nous retournons une chaîne de caractères plutôt que du JSX car nous sommes dans un fichier .ts
export const getStatusIconName = (status: 'good' | 'improvement' | 'problem'): string => {
  switch (status) {
    case 'good':
      return 'check-circle';
    case 'improvement':
      return 'exclamation-circle';
    case 'problem':
      return 'x-circle';
    default:
      return 'information-circle';
  }
};

// Fonction pour obtenir la classe de couleur de l'icône en fonction du statut
export const getStatusIconColor = (status: 'good' | 'improvement' | 'problem'): string => {
  switch (status) {
    case 'good':
      return 'text-green-500';
    case 'improvement':
      return 'text-[#5b50ff]';
    case 'problem':
      return 'text-red-500';
    default:
      return 'text-gray-400';
  }
};

// Fonction pour grouper les résultats par catégorie
export const groupResultsByCategory = (results: ContentAnalysisResult[]) => {
  const grouped: Record<string, ContentAnalysisResult[]> = {
    keywords: [],
    structure: [],
    readability: [],
    meta: [],
    links: [],
    images: []
  };

  results.forEach(result => {
    if (grouped[result.category]) {
      grouped[result.category].push(result);
    }
  });

  return grouped;
};

// Fonction pour obtenir le titre de la catégorie
export const getCategoryTitle = (category: string) => {
  switch (category) {
    case 'keywords':
      return 'Mots-clés';
    case 'structure':
      return 'Structure du contenu';
    case 'readability':
      return 'Lisibilité';
    case 'meta':
      return 'Méta-données';
    case 'links':
      return 'Liens (internes & externes)';
    case 'images':  // La clé reste 'images' pour la rétrocompatibilité
      return 'Médias (images & vidéos)';
    default:
      return category;
  }
};

// Fonction pour obtenir le nom de l'icône de la catégorie
// Nous retournons une chaîne de caractères plutôt que du JSX car nous sommes dans un fichier .ts
export const getCategoryIconName = (category: string): string => {
  switch (category) {
    case 'keywords':
      return 'tag';
    case 'structure':
      return 'menu';
    case 'readability':
      return 'pencil';
    case 'meta':
      return 'document-text';
    case 'links':
      return 'link';
    case 'images':
      return 'photograph';
    default:
      return 'information-circle';
  }
};

// Pour maintenir la compatibilité avec les composants existants, nous exportons getCategoryIconName 
// sous le nom getCategoryIcon 
export const getCategoryIcon = getCategoryIconName;

// Fonction pour obtenir la description de l'icône de la catégorie
export const getCategoryIconDescription = (category: string): string => {
  switch (category) {
    case 'keywords':
      return 'Mots-clés et densité';
    case 'structure':
      return 'Structure du document';
    case 'readability':
      return 'Lisibilité du texte';
    case 'meta':
      return 'Méta-données';
    case 'links':
      return 'Liens internes et externes';
    case 'images':
      return 'Images et attributs alt';
    default:
      return 'Information générale';
  }
};

// Fonction pour obtenir l'évaluation du nombre de mots
export const getWordCountRating = (count: number): { label: string; color: string } => {
  if (count > 2500) {
    return { label: 'Excellent', color: 'text-green-600' };
  } else if (count >= 2000 && count <= 2500) {
    return { label: 'Très bien', color: 'text-green-500' };
  } else if (count >= 1500 && count < 2000) {
    return { label: 'Bien', color: 'text-[#5b50ff]' };
  } else if (count >= 1000 && count < 1500) {
    return { label: 'À améliorer', color: 'text-[#8a82ff]' };
  } else if (count >= 600 && count < 1000) {
    return { label: 'Insuffisant', color: 'text-orange-500' };
  } else {
    return { label: 'Médiocre', color: 'text-red-500' };
  }
};

// Fonction pour calculer le nombre de mots
export const calculateWordCount = (text: string): number => {
  // Nettoyage du contenu HTML pour l'analyse textuelle
  const textContent = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Comptage des mots
  const words = textContent.split(' ').filter(word => word.length > 0);
  return words.length;
};

// Fonction pour nettoyer les espaces superflus dans le contenu HTML
export const cleanupExcessiveSpaces = (content: string): string => {
  if (!content) return content;
  
  // 1. Nettoyer les espaces multiples entre les mots (en préservant les balises HTML)
  let cleanContent = content.replace(/([^>])\s{3,}([^<])/g, '$1 $2'); // Permet 1-2 espaces
  
  // 2. Nettoyer les espaces avant les balises fermantes et après les balises ouvrantes
  // Mais préserver les espaces pour les titres et paragraphes
  cleanContent = cleanContent.replace(/\s{2,}<\/(span|strong|em|a|b|i|u|code|mark)/g, '</$1');
  cleanContent = cleanContent.replace(/>(span|strong|em|a|b|i|u|code|mark)\s{2,}/g, '>$1');
  
  // 3. Préserver les espaces entre les titres et paragraphes, mais nettoyer les espaces excessifs
  // Conserver un espace après les balises ouvrantes de titre et paragraphe
  cleanContent = cleanContent.replace(/<(h[1-6]|p)>\s{3,}/g, '<$1> ');
  // Conserver un espace avant les balises fermantes de titre et paragraphe
  cleanContent = cleanContent.replace(/\s{3,}<\/(h[1-6]|p)>/g, ' </$1>');
  
  // 4. Nettoyer les espaces multiples dans les attributs
  cleanContent = cleanContent.replace(/([a-zA-Z-]+)="\s+([^"]*?)\s+"/g, '$1="$2"');
  
  // 5. Remplacer les sauts de ligne multiples par un seul saut de ligne
  cleanContent = cleanContent.replace(/(<br\s*\/?>){3,}/g, '<br><br>'); // Permet jusqu'à 2 sauts de ligne
  
  // 6. Conserver un espace entre les paragraphes et titres
  cleanContent = cleanContent.replace(/<\/(h[1-6]|p)>\s*<(h[1-6]|p)>/g, '</$1>\n<$2>');
  
  // 7. Supprimer uniquement les paragraphes complètement vides
  cleanContent = cleanContent.replace(/<p>\s*<\/p>/g, '');
  
  return cleanContent;
};
