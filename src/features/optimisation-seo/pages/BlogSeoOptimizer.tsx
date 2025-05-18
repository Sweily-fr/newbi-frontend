import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogSeoProvider } from '../context';
import { RichTextEditor } from '../components/editor';
import { KeywordsMetaForm, SeoScorePanel } from '../components/business';
import RecommendationsPanel from '../components/editor/RichTextEditor/RecommendationsPanel';
import { useBlogSeo } from '../hooks/useBlogSeo';
import { ToolLayout } from '../../../components/layout/ToolLayout';
import { LockClosedIcon } from '@heroicons/react/24/outline';

export const BlogSeoOptimizerContent: React.FC = () => {
  const { state } = useBlogSeo();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'keywords' | 'score' | 'recommendations'>('keywords');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  
  // Activer les onglets et changer vers l'onglet Score SEO après une analyse
  useEffect(() => {
    if (state.analysisResults && Object.keys(state.analysisResults).length > 0) {
      setHasAnalyzed(true);
      setActiveTab('score'); // Changer automatiquement vers l'onglet Score SEO
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
    <div className="min-h-screen w-full flex flex-col bg-gray-50 p-6 pb-0 mb-12">
      <div className="flex w-full gap-6 h-full">
        {/* Colonne de gauche - Onglets (4/12) */}
        <div className="w-4/12 flex flex-col bg-white shadow-sm rounded-lg">
          {/* Onglets */}
          <div className="flex border-b border-gray-100">
            <button
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'keywords' 
                  ? 'text-[#5b50ff] border-b-2 border-[#5b50ff] font-semibold' 
                  : 'text-[#5b50ff] hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('keywords')}
            >
              Mots-clés
            </button>
            
            <div className="relative group flex-1">
              <button
                className={`w-full py-3 text-center font-medium transition-colors ${
                  !hasAnalyzed 
                    ? 'text-gray-300' 
                    : activeTab === 'recommendations' 
                      ? 'text-[#5b50ff] border-b-2 border-[#5b50ff] font-semibold' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleTabChange('recommendations')}
                disabled={!hasAnalyzed}
              >
                <div className="relative inline-flex items-center justify-center">
                  <span className={`relative ${!hasAnalyzed ? 'cursor-pointer' : ''}`}>
                    <span className={`relative ${hasAnalyzed ? 'text-[#5b50ff]' : 'text-gray-300'}`}>Recommandations</span>
                    {!hasAnalyzed && (
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                        <LockClosedIcon className="h-6 w-6 text-[#5b50ff] stroke-2" />
                      </span>
                    )}
                  </span>
                </div>
              </button>
              {!hasAnalyzed && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-max bg-gray-800 text-white text-xs rounded py-1.5 px-2.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg">
                  Effectuez une analyse pour débloquer
                </div>
              )}
            </div>
            
            <div className="relative group flex-1">
              <button
                className={`w-full py-3 text-center font-medium transition-colors ${
                  !hasAnalyzed 
                    ? 'text-gray-300' 
                    : activeTab === 'score' 
                      ? 'text-[#5b50ff] border-b-2 border-[#5b50ff] font-semibold' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleTabChange('score')}
                disabled={!hasAnalyzed}
              >
                <div className="relative inline-flex items-center justify-center">
                  <span className={`relative ${!hasAnalyzed ? 'cursor-pointer' : ''}`}>
                    <span className={`relative ${hasAnalyzed ? 'text-[#5b50ff]' : 'text-gray-300'}`}>Score SEO</span>
                    {!hasAnalyzed && (
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                        <LockClosedIcon className="h-6 w-6 text-[#5b50ff] stroke-2" />
                      </span>
                    )}
                  </span>
                </div>
              </button>
              {!hasAnalyzed && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-max bg-gray-800 text-white text-xs rounded py-1.5 px-2.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg">
                  Effectuez une analyse pour débloquer
                </div>
              )}
            </div>
          </div>
          
          {/* Contenu des onglets */}
          <div className="h-[calc(100%-48px)] overflow-auto flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'keywords' && (
                <motion.div
                  key="keywords"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <KeywordsMetaForm />
                </motion.div>
              )}
              
              {activeTab === 'score' && (
                <motion.div
                  key="score"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SeoScorePanel />
                </motion.div>
              )}
              
              {activeTab === 'recommendations' && (
                <motion.div
                  key="recommendations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <RecommendationsPanel 
                    analysisResults={state.analysisResults}
                    expandedCategories={expandedCategories}
                    setExpandedCategories={setExpandedCategories}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Colonne de droite - Éditeur (8/12) */}
        <div className="w-8/12 flex flex-col bg-white shadow-sm rounded-lg">
          <RichTextEditor 
            placeholder="Commencez à rédiger votre contenu ici..." 
            className="flex-1" 
          />
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
