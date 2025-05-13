// Base de données de mots-clés précis par domaine
const keywordDatabase: Record<string, Record<string, string[]>> = {
  // Marketing Digital
  'marketing': {
    'marketing digital': ['stratégie digitale', 'marketing en ligne', 'marketing internet', 'webmarketing', 'marketing numérique', 'marketing web', 'marketing online', 'transformation digitale', 'présence en ligne', 'visibilité en ligne'],
    'marketing de contenu': ['stratégie de contenu', 'content marketing', 'rédaction web', 'storytelling', 'calendrier éditorial', 'blog d’entreprise', 'articles de blog', 'infographie', 'livre blanc', 'webinaire'],
    'email marketing': ['newsletter', 'campagne emailing', 'segmentation', 'automation marketing', 'taux d’ouverture', 'taux de clic', 'CRM', 'base de données clients', 'logiciel emailing', 'marketing automation'],
    'réseaux sociaux': ['community management', 'social media', 'facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube', 'pinterest', 'social selling'],
    'publicité': ['google ads', 'facebook ads', 'instagram ads', 'linkedin ads', 'display', 'retargeting', 'remarketing', 'campagne publicitaire', 'budget publicitaire', 'ROI'],
    'conversion': ['taux de conversion', 'call-to-action', 'landing page', 'tunnel de conversion', 'optimisation conversion', 'A/B testing', 'UX design', 'expérience utilisateur', 'formulaire de contact', 'lead generation'],
    'marque': ['identité de marque', 'image de marque', 'notoriété', 'positionnement', 'valeurs', 'promesse de marque', 'charte graphique', 'logo', 'slogan', 'storytelling'],
  },
  
  // SEO
  'seo': {
    'référencement naturel': ['optimisation SEO', 'référencement google', 'positionnement google', 'première page google', 'ranking', 'serp', 'algorithme google', 'search console', 'indexation', 'crawl'],
    'contenu SEO': ['rédaction SEO', 'contenu optimisé', 'balise title', 'meta description', 'balises h1 h2', 'structure de contenu', 'maillage interne', 'longue traîne', 'densité de mots-clés', 'rich snippets'],
    'technique SEO': ['vitesse de chargement', 'responsive design', 'expérience mobile', 'https', 'url canonique', 'sitemap', 'robots.txt', 'erreur 404', 'redirection 301', 'structured data'],
    'backlinks': ['netlinking', 'link building', 'lien externe', 'autorité de domaine', 'guest blogging', 'nofollow', 'dofollow', 'ancre de lien', 'profil de liens', 'qualité des liens'],
    'local SEO': ['référencement local', 'google my business', 'avis google', 'pack local', 'fiche établissement', 'géolocalisation', 'annuaires locaux', 'carte google maps', 'NAP', 'citations locales'],
    'e-commerce SEO': ['optimisation e-commerce', 'catégories produits', 'fiches produits', 'avis produits', 'rich snippets produits', 'schema.org', 'microdonnées', 'recherche interne', 'filtres produits', 'url produits'],
  },
  
  // E-commerce
  'e-commerce': {
    'boutique en ligne': ['site e-commerce', 'marketplace', 'plateforme e-commerce', 'shopify', 'woocommerce', 'prestashop', 'magento', 'panier d’achat', 'catalogue produits', 'fiche produit'],
    'vente en ligne': ['tunnel d’achat', 'conversion', 'taux d’abandon', 'upsell', 'cross-sell', 'panier moyen', 'processus d’achat', 'expérience client', 'parcours client', 'satisfaction client'],
    'paiement': ['paiement en ligne', 'paiement sécurisé', 'stripe', 'paypal', 'carte bancaire', 'paiement mobile', 'paiement fractionné', 'transaction', 'remboursement', 'devise'],
    'logistique': ['livraison', 'expédition', 'transporteur', 'suivi de commande', 'gestion des stocks', 'entrepôt', 'emballage', 'retour produit', 'click and collect', 'dropshipping'],
    'client': ['service client', 'support client', 'fidélisation', 'programme fidélité', 'CRM', 'segmentation client', 'avis clients', 'satisfaction client', 'réclamation', 'SAV'],
  },
  
  // Business
  'business': {
    'entrepreneuriat': ['création entreprise', 'startup', 'business plan', 'modèle économique', 'business model canvas', 'financement', 'investisseur', 'pitch', 'incubateur', 'accélérateur'],
    'stratégie': ['plan stratégique', 'objectifs', 'KPI', 'indicateurs de performance', 'analyse concurrentielle', 'avantage concurrentiel', 'proposition de valeur', 'vision', 'mission', 'valeurs'],
    'management': ['leadership', 'gestion d’équipe', 'recrutement', 'ressources humaines', 'culture d’entreprise', 'motivation', 'performance', 'évaluation', 'formation', 'développement'],
    'finance': ['comptabilité', 'trésorerie', 'budget', 'investissement', 'financement', 'chiffre d’affaires', 'marge', 'rentabilité', 'fiscalité', 'bilan'],
    'innovation': ['R&D', 'développement produit', 'design thinking', 'agilité', 'transformation digitale', 'disruption', 'propriété intellectuelle', 'brevet', 'prototype', 'MVP'],
  },
  
  // Tech
  'tech': {
    'développement web': ['frontend', 'backend', 'fullstack', 'javascript', 'react', 'angular', 'vue.js', 'node.js', 'php', 'python'],
    'applications mobiles': ['app mobile', 'android', 'ios', 'react native', 'flutter', 'swift', 'kotlin', 'application native', 'PWA', 'app store'],
    'intelligence artificielle': ['machine learning', 'deep learning', 'algorithme', 'big data', 'data science', 'chatbot', 'automatisation', 'traitement naturel du langage', 'NLP', 'reconnaissance d’image'],
    'cloud computing': ['saas', 'paas', 'iaas', 'aws', 'azure', 'google cloud', 'cloud privé', 'cloud hybride', 'virtualisation', 'serveur'],
    'cybersecurité': ['sécurité informatique', 'protection des données', 'RGPD', 'hacking', 'firewall', 'cryptage', 'authentification', 'gestion des accès', 'audit sécurité', 'ransomware'],
  }
};

// Dictionnaire plat pour la recherche rapide
const flatKeywordDictionary: Record<string, string[]> = {};

// Aplatir la base de données pour faciliter la recherche
Object.entries(keywordDatabase).forEach(([ , subcategories]) => {
  Object.entries(subcategories).forEach(([subcategory, keywordList]) => {
    flatKeywordDictionary[subcategory] = keywordList;
  });
});

// Mots-clés génériques pour les cas où aucune correspondance n'est trouvée
const genericKeywords = [
  'optimisation', 'stratégie', 'analyse', 'performance', 'amélioration',
  'conseil', 'guide', 'tendance', 'méthode', 'solution', 'outil', 'service',
  'formation', 'expert', 'professionnel', 'comparatif', 'meilleur', 'exemple',
  'cas pratique', 'tutoriel'
];

// Fonction pour trouver des mots-clés similaires dans le dictionnaire
const findSimilarKeywords = (keyword: string): string[] => {
  if (!keyword.trim()) return genericKeywords;
  
  // Normaliser le mot-clé (minuscules, sans accents)
  const normalizedKeyword = keyword.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const words = normalizedKeyword.split(/\s+/);
  
  // 1. Recherche exacte dans les sous-catégories
  for (const [subcategory, keywords] of Object.entries(flatKeywordDictionary)) {
    const normalizedSubcategory = subcategory.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (normalizedSubcategory === normalizedKeyword) {
      return keywords;
    }
  }
  
  // 2. Recherche par correspondance partielle dans les sous-catégories
  const matchingSubcategories: [string, number][] = [];
  
  for (const [subcategory, keywords] of Object.entries(flatKeywordDictionary)) {
    const normalizedSubcategory = subcategory.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const subcategoryWords = normalizedSubcategory.split(/\s+/);
    
    // Calculer le score de correspondance
    let matchScore = 0;
    words.forEach(word => {
      if (normalizedSubcategory.includes(word)) matchScore += 2;
      subcategoryWords.forEach(subWord => {
        if (word === subWord) matchScore += 3;
        else if (word.includes(subWord) || subWord.includes(word)) matchScore += 1;
      });
    });
    
    if (matchScore > 0) {
      matchingSubcategories.push([subcategory, matchScore]);
    }
  }
  
  // Si on a des correspondances, prendre celle avec le meilleur score
  if (matchingSubcategories.length > 0) {
    matchingSubcategories.sort((a, b) => b[1] - a[1]);
    const bestMatch = matchingSubcategories[0][0];
    return flatKeywordDictionary[bestMatch];
  }
  
  // 3. Recherche dans les mots-clés eux-mêmes
  const allKeywords: string[] = [];
  const keywordScores: Map<string, number> = new Map();
  
  // Parcourir tous les mots-clés et calculer un score de pertinence
  Object.values(flatKeywordDictionary).forEach(keywordList => {
    keywordList.forEach(kw => {
      const normalizedKw = kw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const kwWords = normalizedKw.split(/\s+/);
      
      let score = 0;
      words.forEach(word => {
        if (normalizedKw.includes(word)) score += 2;
        kwWords.forEach(kwWord => {
          if (word === kwWord) score += 3;
          else if (word.includes(kwWord) || kwWord.includes(word)) score += 1;
        });
      });
      
      if (score > 0) {
        keywordScores.set(kw, (keywordScores.get(kw) || 0) + score);
        if (!allKeywords.includes(kw)) {
          allKeywords.push(kw);
        }
      }
    });
  });
  
  // Trier les mots-clés par score et prendre les 10 meilleurs
  if (allKeywords.length > 0) {
    return allKeywords
      .sort((a, b) => (keywordScores.get(b) || 0) - (keywordScores.get(a) || 0))
      .slice(0, 10);
  }
  
  // Si aucune correspondance n'est trouvée, renvoyer des mots-clés génériques
  return genericKeywords;
};

// Interface pour les résultats de l'API Datamuse
interface DatamuseWord {
  word: string;
  score: number;
  tags?: string[];
}

// Essayer l'API Datamuse
async function fetchDatamuseSuggestions(keyword: string): Promise<string[]> {
  try {
    // Essayer avec rel_jja (adjectifs fréquemment associés)
    const responseJja = await fetch(
      `https://api.datamuse.com/words?rel_jja=${encodeURIComponent(keyword)}&max=5`
    );
    
    if (!responseJja.ok) {
      throw new Error('Erreur avec l\'API Datamuse');
    }
    
    const dataJja: DatamuseWord[] = await responseJja.json();
    const jjaResults = dataJja.map(item => item.word);
    
    // Essayer avec rel_trg (termes associés/déclencheurs)
    const responseTrg = await fetch(
      `https://api.datamuse.com/words?rel_trg=${encodeURIComponent(keyword)}&max=5`
    );
    
    if (!responseTrg.ok) {
      throw new Error('Erreur avec l\'API Datamuse');
    }
    
    const dataTrg: DatamuseWord[] = await responseTrg.json();
    const trgResults = dataTrg.map(item => item.word);
    
    // Essayer avec ml (sens similaire)
    const responseMl = await fetch(
      `https://api.datamuse.com/words?ml=${encodeURIComponent(keyword)}&max=5`
    );
    
    if (!responseMl.ok) {
      throw new Error('Erreur avec l\'API Datamuse');
    }
    
    const dataMl: DatamuseWord[] = await responseMl.json();
    const mlResults = dataMl.map(item => item.word);
    
    // Combiner les résultats et éliminer les doublons
    const combinedResults = [...jjaResults, ...trgResults, ...mlResults];
    return combinedResults.filter((word, index, self) => 
      self.indexOf(word) === index
    ).slice(0, 10);
  } catch (error) {
    console.error('Erreur avec l\'API Datamuse:', error);
    return [];
  }
}

// Fonction principale qui combine l'API Datamuse et le dictionnaire local
export const fetchKeywordSuggestions = async (keyword: string): Promise<string[]> => {
  if (!keyword.trim()) return [];
  
  // Récupérer les suggestions locales
  const localSuggestions = findSimilarKeywords(keyword);
  
  // Essayer l'API Datamuse en parallèle
  try {
    const apiSuggestions = await fetchDatamuseSuggestions(keyword);
    
    if (apiSuggestions.length > 0) {
      // Combiner les résultats de l'API et du dictionnaire local
      // Prioriser les résultats de l'API mais garder quelques suggestions locales
      const combinedResults = [...apiSuggestions];
      
      // Ajouter quelques suggestions locales qui ne sont pas déjà dans les résultats de l'API
      for (const suggestion of localSuggestions) {
        if (!combinedResults.includes(suggestion)) {
          combinedResults.push(suggestion);
          if (combinedResults.length >= 10) break;
        }
      }
      
      return combinedResults;
    }
  } catch (error) {
    console.error('Erreur avec l\'API Datamuse:', error);
  }
  
  // Fallback: utiliser uniquement le dictionnaire local
  return localSuggestions;
};
