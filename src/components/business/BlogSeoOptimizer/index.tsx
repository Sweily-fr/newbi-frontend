import React from 'react';
import { BlogSeoProvider } from './context';
import RichTextEditor from './components/RichTextEditor';
import SeoScorePanel from './components/SeoScorePanel';
import KeywordsMetaForm from './components/KeywordsMetaForm';
import ExportPanel from './components/ExportPanel';

const BlogSeoOptimizer: React.FC = () => {
  return (
    <BlogSeoProvider>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale - Éditeur de texte */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Éditeur de contenu</h2>
              <RichTextEditor />
            </div>
          </div>
          
          <ExportPanel />
        </div>
        
        {/* Colonne latérale - Score SEO et recommandations */}
        <div className="space-y-6">
          <KeywordsMetaForm />
          <SeoScorePanel />
        </div>
      </div>
    </BlogSeoProvider>
  );
};

export { BlogSeoOptimizer };
export * from './types';
export * from './utils';
export * from './context';
