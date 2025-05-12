import React, { useEffect } from 'react';
import { SEOHead } from '../components/specific/SEO/SEOHead';
import { BlogSeoOptimizer } from '../features/optimisation-seo';

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
        ogImage="https://newbi.fr/images/PNG/Logo_Texte_Purple.png"
        canonicalUrl="https://newbi.fr/blog-seo-optimizer"
        additionalSchemaData={{
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web'
        }}
        schemaPrice="14.99"
        isPremium={true}
      />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-3 text-gray-800">Optimisation SEO pour Blog</h1>
          <p className="text-lg text-gray-600 max-w-3xl">Créez et optimisez votre contenu pour un meilleur référencement sur les moteurs de recherche. Notre outil analyse votre texte et vous propose des améliorations ciblées.</p>
        </section>
        
        <section className="bg-[#f9f8ff] p-6 rounded-lg border border-[#f0eeff] shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#5b50ff] flex items-center">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Pourquoi optimiser votre contenu ?
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Améliorez votre visibilité sur les moteurs de recherche</li>
            <li>Attirez un trafic qualifié sur votre site</li>
            <li>Augmentez votre taux de conversion</li>
            <li>Renforcez votre autorité dans votre domaine</li>
          </ul>
        </section>
        
        <section>
          <BlogSeoOptimizer />
        </section>
      </main>
    </>
  );
};

export default BlogSeoOptimizerPage;
