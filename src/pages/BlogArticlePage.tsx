import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/specific/SEO/SEOHead';
import { FAQSchema } from '../components/specific/SEO/SchemaMarkup';
import { getArticleBySlug, getRelatedArticles } from '../features/blog';
import { BlogArticle } from '../types/blog';
import { ROUTES } from '../routes/constants';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

const BlogArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const foundArticle = getArticleBySlug(slug);
      
      if (foundArticle) {
        setArticle(foundArticle);
        setRelatedArticles(getRelatedArticles(foundArticle, 3));
      } else {
        // Rediriger vers la page 404 si l'article n'existe pas
        navigate(ROUTES.NOT_FOUND);
      }
    }
    
    setIsLoading(false);
    
    // Scroll to top when article changes
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5b50ff]"></div>
      </div>
    );
  }

  if (!article) {
    return null; // La redirection vers 404 se fera dans le useEffect
  }

  return (
    <div className="blog-article-page">
      <SEOHead
        title={article.metaTitle || article.title}
        description={article.metaDescription || article.excerpt}
        keywords={article.metaKeywords}
        schemaType="Article"
        schemaName={article.title}
        ogImage={article.featuredImage}
        additionalSchemaData={{
          datePublished: article.publishDate,
          dateModified: article.updatedDate || article.publishDate,
          author: {
            '@type': 'Person',
            name: article.author
          },
          publisher: {
            '@type': 'Organization',
            name: 'Newbi',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.newbi.fr/images/logo.png'
            }
          },
          image: article.featuredImage
        }}
      />
      
      {article.faq && article.faq.length > 0 && (
        <FAQSchema items={article.faq} />
      )}
      
      <div className="container mx-auto px-4 py-12">
        {/* Fil d'Ariane */}
        <div className="text-sm text-gray-500 mb-8">
          <Link to={ROUTES.HOME} className="hover:text-[#5b50ff]">Accueil</Link>
          <span className="mx-2">/</span>
          <Link to={ROUTES.BLOG} className="hover:text-[#5b50ff]">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{article.title}</span>
        </div>
        
        {/* En-tête de l'article */}
        <div className="mb-12 text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {article.categories.map(category => (
              <Link 
                key={category}
                to={`${ROUTES.BLOG}?category=${encodeURIComponent(category)}`}
                className="inline-block bg-[#f0eeff] text-[#5b50ff] px-3 py-1 rounded-full text-sm hover:bg-[#e6e1ff] transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>
          
          <div className="flex items-center justify-center text-gray-600 mb-8">
            <span>{article.author}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(article.publishDate)}</span>
            <span className="mx-2">•</span>
            <span>{article.readTime} min de lecture</span>
          </div>
          
          <div className="w-full max-w-4xl mx-auto rounded-xl shadow-lg h-96 flex items-center justify-start bg-gradient-to-r from-[#5b50ff] to-[#6a60ff] p-8 text-left">
            <h2 className="text-5xl w-4/5 font-bold text-white">
              Passez à la vitesse supérieure avec Newbi, réinventez votre activité
            </h2>
          </div>
        </div>
        
        {/* Contenu de l'article */}
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900" {...props} />,
                h2: (props) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900" {...props} />,
                h3: (props) => <h3 className="text-xl font-bold mt-5 mb-2 text-gray-800" {...props} />,
                h4: (props) => <h4 className="text-lg font-bold mt-4 mb-2 text-gray-800" {...props} />,
                p: (props) => <p className="my-4 text-gray-700 leading-relaxed" {...props} />,
                ul: (props) => <ul className="list-disc pl-6 my-4 text-gray-700" {...props} />,
                ol: (props) => <ol className="list-decimal pl-6 my-4 text-gray-700" {...props} />,
                li: (props) => <li className="mb-2" {...props} />,
                a: (props) => <a className="text-[#5b50ff] hover:text-[#4a41e0] transition-colors" {...props} />,
                blockquote: (props) => <blockquote className="border-l-4 border-[#5b50ff] pl-4 py-2 my-4 bg-[#f0eeff] italic" {...props} />,
                code: (props) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
                pre: (props) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono" {...props} />,
                strong: (props) => <strong className="font-bold text-gray-900" {...props} />,
                em: (props) => <em className="italic" {...props} />,
                img: ({src, alt, ...props}) => (
                  <img 
                    src={src} 
                    alt={alt} 
                    className="rounded-lg my-6 max-w-full h-auto shadow-md" 
                    {...props} 
                  />
                ),
                table: (props) => (
                  <div className="overflow-x-auto my-6">
                    <table className="min-w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-sm" {...props} />
                  </div>
                ),
                thead: (props) => <thead className="bg-[#f0eeff]" {...props} />,
                tbody: (props) => <tbody {...props} />,
                tr: (props) => <tr className="border-b border-gray-200 hover:bg-gray-50" {...props} />,
                th: (props) => <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-[#5b50ff] bg-[#f0eeff]" {...props} />,
                td: (props) => <td className="border border-gray-300 px-4 py-3 text-gray-700" {...props} />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
          
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <Link 
                    key={tag}
                    to={`${ROUTES.BLOG}?tag=${encodeURIComponent(tag)}`}
                    className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* FAQ si présente */}
          {article.faq && article.faq.length > 0 && (
            <div className="mt-12 pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>
              <div className="space-y-6">
                {article.faq.map((item, index) => (
                  <div key={index} className="bg-[#f0eeff] rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-[#5b50ff] mb-3">{item.question}</h3>
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Partage sur les réseaux sociaux */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Partager cet article</h3>
            <div className="flex space-x-4">
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1DA1F2] text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
                aria-label="Partager sur Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a 
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0A66C2] text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
                aria-label="Partager sur LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1877F2] text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
                aria-label="Partager sur Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Articles connexes */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-8 text-center">Articles connexes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map(relatedArticle => (
                <div key={relatedArticle.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                  <div className="h-48 w-full bg-gradient-to-r from-[#5b50ff] to-[#6a60ff] flex items-center p-6">
                    <h3 className="text-xl font-bold text-white line-clamp-3">
                      {relatedArticle.title}
                    </h3>
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {relatedArticle.categories.slice(0, 2).map(category => (
                        <span 
                          key={category} 
                          className="inline-block bg-[#f0eeff] text-[#5b50ff] text-xs px-2 py-1 rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    <Link 
                      to={`${ROUTES.BLOG}/${relatedArticle.slug}`} 
                      className="block mt-1 text-lg leading-tight font-bold text-gray-900 hover:text-[#4a41e0] transition-colors"
                    >
                      {relatedArticle.title}
                    </Link>
                    <p className="mt-2 text-gray-500">
                      {formatDate(relatedArticle.publishDate)} • {relatedArticle.readTime} min de lecture
                    </p>
                  </div>
                  <div className="px-6 pb-6">
                    <Link 
                      to={`${ROUTES.BLOG}/${relatedArticle.slug}`}
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
          </div>
        )}
        
        {/* Appel à l'action */}
        <div className="mt-16 bg-[#f0eeff] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[#5b50ff] mb-4">Vous avez aimé cet article ?</h2>
          <p className="text-gray-700 mb-6">Découvrez Newbi, la solution tout-en-un pour gérer votre entreprise efficacement.</p>
          <Link 
            to={ROUTES.HOME}
            className="inline-flex items-center px-6 py-3 bg-[#5b50ff] text-white rounded-md hover:bg-[#4a41e0] transition-colors"
          >
            Essayer Newbi gratuitement
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogArticlePage;
