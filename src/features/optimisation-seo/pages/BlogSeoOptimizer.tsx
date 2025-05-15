import React, { useState, useEffect } from 'react';
import { BlogSeoProvider } from '../context';
import { RichTextEditor } from '../components/editor';
import { ExportPanel, KeywordsMetaForm, SeoScorePanel } from '../components/business';
import RecommendationsPanel from '../components/editor/RichTextEditor/RecommendationsPanel';
import { useBlogSeo } from '../hooks/useBlogSeo';
import { ToolLayout } from '../../../components/layout/ToolLayout';
import { LockClosedIcon } from '@heroicons/react/24/outline';

const BlogSeoOptimizerContent: React.FC = () => {
  const { state } = useBlogSeo();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'keywords' | 'score' | 'recommendations'>('keywords');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  
  // Activer les onglets si une analyse a été effectuée
  useEffect(() => {
    if (state.analysisResults && Object.keys(state.analysisResults).length > 0) {
      setHasAnalyzed(true);
    }
  }, [state.analysisResults]);
  
  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (tab: 'keywords' | 'score' | 'recommendations') => {
    if ((tab === 'score' || tab === 'recommendations') && !hasAnalyzed) {
      return; // Empêche le changement d'onglet si non analysé
    }
    setActiveTab(tab);
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 p-6 overflow-x-hidden">
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <div className="flex-1 flex w-full overflow-hidden gap-6 max-w-full">
          {/* Colonne de gauche - Onglets (4/12) */}
          <div className="w-4/12 flex flex-col h-[calc(100vh-200px)] rounded-xl overflow-visible">
            {/* Onglets */}
            <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-6 overflow-visible">
              <button
                className={`py-4 text-center font-medium px-4 cursor-pointer ${activeTab === 'keywords' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('keywords')}
              >
                Mots-clés
              </button>
              <div className="flex-1"></div>
              <div className="relative group">
                <div className="relative">
                  <button
                    className={`py-4 text-center font-medium px-4 relative cursor-pointer ${
                      !hasAnalyzed ? 'text-gray-400' : 
                      activeTab === 'recommendations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => handleTabChange('recommendations')}
                    disabled={!hasAnalyzed}
                  >
                    <span className="relative">
                      Recommandations
                      {!hasAnalyzed && (
                        <span className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                          <LockClosedIcon className="h-6 w-6 text-gray-500" />
                        </span>
                      )}
                    </span>
                  </button>
                  {!hasAnalyzed && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-max bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-50">
                      Effectuez une analyse pour débloquer
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1"></div>
              <div className="relative group">
                <div className="relative">
                  <button
                    className={`py-4 text-center font-medium px-4 relative cursor-pointer ${
                      !hasAnalyzed ? 'text-gray-400' : 
                      activeTab === 'score' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => handleTabChange('score')}
                    disabled={!hasAnalyzed}
                  >
                    <span className="relative">
                      Score SEO
                      {!hasAnalyzed && (
                        <span className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                          <LockClosedIcon className="h-6 w-6 text-gray-500" />
                        </span>
                      )}
                    </span>
                  </button>
                  {!hasAnalyzed && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-max bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-50">
                      Effectuez une analyse pour débloquer
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contenu des onglets */}
            <div className="flex-1 overflow-y-auto rounded-b-xl">
              {activeTab === 'keywords' && (
                <KeywordsMetaForm />
              )}
              
              {activeTab === 'score' && (
                <SeoScorePanel />
              )}
              
              {activeTab === 'recommendations' && (
                <RecommendationsPanel 
                  analysisResults={state.analysisResults}
                  expandedCategories={expandedCategories}
                  setExpandedCategories={setExpandedCategories}
                />
              )}
            </div>
          </div>
          
          {/* Colonne de droite - Éditeur (8/12) */}
          <div className="w-8/12 flex flex-col h-[calc(100vh-200px)]">
            <div className="h-full bg-white rounded-xl shadow-sm">
              <RichTextEditor placeholder="Commencez à rédiger votre contenu ici..." />
            </div>
          </div>
        </div>
        
        {/* Panneau d'export en bas */}
        <div className="mt-4 p-4 sticky bottom-0 z-20 w-full">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <ExportPanel />
          </div>
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

// Exportation nommée pour correspondre à l'import dans index.ts
export { BlogSeoOptimizer as default };
