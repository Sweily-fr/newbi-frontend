import React from 'react';
import { BlogSeoProvider } from './context';
import RichTextEditor from './sections/RichTextEditor';
import SeoScorePanel from './sections/SeoScorePanel';
import KeywordsMetaForm from './sections/KeywordsMetaForm';
import ExportPanel from './sections/ExportPanel';

const BlogSeoOptimizer: React.FC = () => {
  return (
    <BlogSeoProvider>
      {/* Section du haut avec formulaire de mots-clés et score SEO côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Formulaire de mots-clés et méta-données */}
        <div className="lg:col-span-2">
          <KeywordsMetaForm />
        </div>
        
        {/* Score SEO */}
        <div>
          <SeoScorePanel />
        </div>
      </div>
      
      {/* Éditeur de contenu avec recommandations */}
      <div className="mb-6">
        <RichTextEditor />
      </div>
      
      {/* Panneau d'exportation */}
      <div>
        <ExportPanel />
      </div>
    </BlogSeoProvider>
  );
};

export { BlogSeoOptimizer };
export * from './types';
export * from './utils';
export * from './context';
