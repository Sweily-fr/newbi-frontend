import React, { useState } from 'react';
import { useBlogSeo } from '../context';

const ExportPanel: React.FC = () => {
  const { exportContent } = useBlogSeo();
  const [exportFormat, setExportFormat] = useState<'html' | 'markdown' | 'text'>('html');
  const [showExportedContent, setShowExportedContent] = useState(false);
  const [exportedContent, setExportedContent] = useState('');

  const handleExport = () => {
    const content = exportContent(exportFormat);
    setExportedContent(content);
    setShowExportedContent(true);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportedContent)
      .then(() => {
        alert('Contenu copié dans le presse-papiers !');
      })
      .catch(err => {
        console.error('Erreur lors de la copie :', err);
        alert('Impossible de copier le contenu. Veuillez réessayer.');
      });
  };

  const handleDownload = () => {
    const blob = new Blob([exportedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    let extension = '';
    switch (exportFormat) {
      case 'html':
        extension = 'html';
        break;
      case 'markdown':
        extension = 'md';
        break;
      case 'text':
        extension = 'txt';
        break;
    }
    
    a.download = `article-optimise.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Exporter le contenu</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Format d'exportation
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-blue-600"
                checked={exportFormat === 'html'}
                onChange={() => setExportFormat('html')}
              />
              <span className="ml-2">HTML</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-blue-600"
                checked={exportFormat === 'markdown'}
                onChange={() => setExportFormat('markdown')}
              />
              <span className="ml-2">Markdown</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-blue-600"
                checked={exportFormat === 'text'}
                onChange={() => setExportFormat('text')}
              />
              <span className="ml-2">Texte brut</span>
            </label>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Exporter
          </button>
        </div>
        
        {showExportedContent && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Contenu exporté</h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copier
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Télécharger
                </button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {exportedContent}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportPanel;
