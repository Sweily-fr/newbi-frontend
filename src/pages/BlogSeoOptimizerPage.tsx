import React, { useEffect } from 'react';
import { SEOHead } from '../components/specific/SEO/SEOHead';
import BlogSeoOptimizer from './BlogSeoOptimizer';

const BlogSeoOptimizerPage: React.FC = () => {
  // Définition des métadonnées pour le SEO
  const pageTitle = "Optimisation SEO pour Blog | Newbi";
  const pageDescription = "Améliorez le référencement de vos articles de blog avec notre outil d'optimisation SEO. Analysez et optimisez votre contenu pour un meilleur classement sur les moteurs de recherche.";
  const keywords = "optimisation SEO, référencement blog, rédaction SEO, analyse de contenu, mots-clés, optimisation blog";
  
  // Effet pour faire défiler vers le haut lors du chargement de la page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={keywords}
        schemaType="WebApplication"
        schemaName="Optimisation SEO pour Blog | Newbi"
        ogImage="https://www.newbi.fr/images/PNG/Logo_Texte_Purple.png"
        canonicalUrl="https://www.newbi.fr/blog-seo-optimizer"
        additionalSchemaData={{
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web'
        }}
        schemaPrice="14.99"
        isPremium={true}
      />
      
      <main className="w-full">
        <BlogSeoOptimizer />
      </main>
    </>
  );
};

export default BlogSeoOptimizerPage;
