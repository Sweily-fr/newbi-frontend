import React, { useState } from 'react';
import { BlogSeoProvider } from '../context';
import { RichTextEditor } from '../components/editor';
import { ExportPanel, KeywordsMetaForm, SeoScorePanel } from '../components/business';
import RecommendationsPanel from '../components/editor/RichTextEditor/RecommendationsPanel';
import { useBlogSeo } from '../hooks/useBlogSeo';
import { ToolLayout } from '../../../components/layout/ToolLayout';

const BlogSeoOptimizerContent: React.FC = () => {
  const { state } = useBlogSeo();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="flex flex-col gap-6">
        {/* Section 1: Mots-clés et Score SEO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Mots-clés (gauche) */}
          <div className="lg:col-span-8">
            <KeywordsMetaForm />
          </div>
          
          {/* Score SEO global (droite) */}
          <div className="lg:col-span-4">
            <SeoScorePanel />
          </div>
        </div>
        
        {/* Section 2: Éditeur et Recommandations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Éditeur de texte riche (gauche) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <RichTextEditor placeholder="Commencez à rédiger votre contenu ici..." />
            </div>
          </div>
          
          {/* Recommandations (droite) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recommandations</h2>
                {state.analysisResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="text-gray-400 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-600">Commencez à rédiger votre contenu et ajoutez un mot-clé principal pour obtenir des recommandations.</p>
                  </div>
                ) : (
                  <RecommendationsPanel 
                    analysisResults={state.analysisResults}
                    expandedCategories={expandedCategories}
                    setExpandedCategories={setExpandedCategories}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Section 3: Panneau d'exportation (bas) */}
        <div className="w-full">
          <ExportPanel />
        </div>
      </div>
    </div>
  );
};

const BlogSeoOptimizer: React.FC = () => {
  return (
    <ToolLayout>
      <BlogSeoProvider>
        <BlogSeoOptimizerContent />
      </BlogSeoProvider>
    </ToolLayout>
  );
};

export default BlogSeoOptimizer;
