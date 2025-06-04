import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/specific/SEO/SEOHead';
import { blogArticles, getRecentArticles } from '../features/blog';
import { BlogArticle } from '../types/blog';
import { ROUTES } from '../routes/constants';

const BlogPage: React.FC = () => {
  // État pour la catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // État pour le nombre d'articles à afficher
  const [displayCount, setDisplayCount] = useState<number>(9);
  // État pour l'article à la une
  const [featuredArticle, setFeaturedArticle] = useState<BlogArticle | null>(null);
  
  // Extraction des catégories uniques
  const allCategories = Array.from(
    new Set(blogArticles.flatMap(article => article.categories))
  ).sort();
  
  // Fonction pour garantir l'unicité des articles par ID
  const getUniqueArticles = (articles: BlogArticle[]): BlogArticle[] => {
    const uniqueMap = new Map<string, BlogArticle>();
    articles.forEach(article => {
      if (!uniqueMap.has(article.id)) {
        uniqueMap.set(article.id, article);
      }
    });
    return Array.from(uniqueMap.values());
  };
  
  // Obtenir la liste complète des articles sans doublons
  const uniqueAllArticles = getUniqueArticles(blogArticles);
  
  // Calcul des articles filtrés à partir de la catégorie sélectionnée
  // Cette approche garantit qu'il n'y a jamais de duplication
  const filteredArticles = selectedCategory
    ? getUniqueArticles(uniqueAllArticles.filter(article => article.categories.includes(selectedCategory)))
    : uniqueAllArticles;
  
  // Initialisation de l'article à la une au chargement du composant
  useEffect(() => {
    setFeaturedArticle(getRecentArticles(1)[0]);
  }, []);
  
  // Réinitialiser le compteur d'affichage lorsque la catégorie change
  useEffect(() => {
    setDisplayCount(9);
  }, [selectedCategory]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="blog-page">
      <SEOHead
        title="Blog Newbi | Conseils et astuces pour entrepreneurs et TPE/PME"
        description="Découvrez des articles pratiques sur la facturation, les devis, la gestion d'entreprise et plus encore. Conseils d'experts pour entrepreneurs et TPE/PME."
        keywords="blog entreprise, conseils entrepreneurs, facturation, devis, gestion TPE/PME"
        schemaType="Blog"
        ogImage="/images/blog/blog-newbi-og.jpg"
      />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Blog Newbi</h1>
        
        {/* Filtres par catégorie */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === null 
                ? 'bg-[#5b50ff] text-white' 
                : 'bg-[#f0eeff] text-[#5b50ff] hover:bg-[#e6e1ff]'
            } transition-colors`}
            onClick={() => setSelectedCategory(null)}
          >
            Tous les articles
          </button>
          
          {allCategories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === category 
                  ? 'bg-[#5b50ff] text-white' 
                  : 'bg-[#f0eeff] text-[#5b50ff] hover:bg-[#e6e1ff]'
              } transition-colors`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Article à la une */}
        {featuredArticle && !selectedCategory && (
          <div className="featured-article mb-16">
            <div className="bg-white rounded-xl shadow-md overflow-hidden md:flex">
              <div className="md:flex-shrink-0 md:w-1/2">
                <img 
                  className="h-64 w-full object-cover md:h-full" 
                  src={featuredArticle.featuredImage} 
                  alt={featuredArticle.title} 
                />
              </div>
              <div className="p-8 md:w-1/2">
                <div className="uppercase tracking-wide text-sm text-[#5b50ff] font-semibold mb-1">
                  Article à la une
                </div>
                <Link 
                  to={`${ROUTES.BLOG}/${featuredArticle.slug}`} 
                  className="block mt-1 text-2xl leading-tight font-bold text-gray-900 hover:text-[#4a41e0] transition-colors"
                >
                  {featuredArticle.title}
                </Link>
                <p className="mt-2 text-gray-500">
                  {formatDate(featuredArticle.publishDate)} • {featuredArticle.readTime} min de lecture
                </p>
                <p className="mt-4 text-gray-700">
                  {featuredArticle.excerpt}
                </p>
                <Link 
                  to={`${ROUTES.BLOG}/${featuredArticle.slug}`}
                  className="mt-6 inline-flex items-center px-4 py-2 bg-[#5b50ff] text-white rounded-md hover:bg-[#4a41e0] transition-colors"
                >
                  Lire l'article
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* Liste des articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.slice(0, displayCount).map(article => (
            <div key={article.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
              <img 
                className="h-48 w-full object-cover" 
                src={article.featuredImage} 
                alt={article.title} 
              />
              <div className="p-6 flex-grow">
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.categories.map(category => (
                    <span 
                      key={category} 
                      className="inline-block bg-[#f0eeff] text-[#5b50ff] text-xs px-2 py-1 rounded-full"
                      onClick={() => setSelectedCategory(category)}
                      style={{ cursor: 'pointer' }}
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <Link 
                  to={`${ROUTES.BLOG}/${article.slug}`} 
                  className="block mt-1 text-xl leading-tight font-bold text-gray-900 hover:text-[#4a41e0] transition-colors"
                >
                  {article.title}
                </Link>
                <p className="mt-2 text-gray-500">
                  {formatDate(article.publishDate)} • {article.readTime} min de lecture
                </p>
                <p className="mt-3 text-gray-700 line-clamp-3">
                  {article.excerpt}
                </p>
              </div>
              <div className="px-6 pb-6">
                <Link 
                  to={`${ROUTES.BLOG}/${article.slug}`}
                  className="inline-flex items-center text-[#5b50ff] hover:text-[#4a41e0] transition-colors"
                >
                  Lire l'article
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bouton Afficher plus */}
        {filteredArticles.length > displayCount && (
          <div className="text-center mt-12">
            <button
              onClick={() => setDisplayCount(prevCount => prevCount + 9)}
              className="px-6 py-3 bg-[#5b50ff] text-white rounded-md hover:bg-[#4a41e0] transition-colors inline-flex items-center"
            >
              Afficher plus d'articles
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Message si aucun article ne correspond au filtre */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Aucun article ne correspond à cette catégorie.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-[#5b50ff] text-white rounded-md hover:bg-[#4a41e0] transition-colors"
              onClick={() => setSelectedCategory(null)}
            >
              Voir tous les articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
