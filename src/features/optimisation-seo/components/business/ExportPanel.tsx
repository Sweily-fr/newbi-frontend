import React, { useState } from 'react';
import { useBlogSeo } from '../../hooks/useBlogSeo';

const ExportPanel: React.FC = () => {
  const { exportContent } = useBlogSeo();
  const [exportFormat, setExportFormat] = useState<'html' | 'markdown' | 'text'>('html');
  const [showExportedContent, setShowExportedContent] = useState(false);
  const [exportedContent, setExportedContent] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleExport = () => {
    const content = exportContent(exportFormat);
    setExportedContent(content);
    setShowExportedContent(true);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportedContent)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
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
    a.download = `contenu-blog.${exportFormat === 'html' ? 'html' : exportFormat === 'markdown' ? 'md' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Exporter le contenu</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Format d'export</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="exportFormat"
              value="html"
              checked={exportFormat === 'html'}
              onChange={() => setExportFormat('html')}
            />
            <span className="ml-2">HTML</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="exportFormat"
              value="markdown"
              checked={exportFormat === 'markdown'}
              onChange={() => setExportFormat('markdown')}
            />
            <span className="ml-2">Markdown</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="exportFormat"
              value="text"
              checked={exportFormat === 'text'}
              onChange={() => setExportFormat('text')}
            />
            <span className="ml-2">Texte brut</span>
          </label>
        </div>
      </div>
      
      <button
        onClick={handleExport}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        Générer l'export
      </button>
      
      {showExportedContent && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Contenu exporté</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleCopyToClipboard}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded text-sm transition-colors flex items-center"
              >
                {copySuccess ? 'Copié !' : 'Copier'}
              </button>
              <button
                onClick={handleDownload}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded text-sm transition-colors flex items-center"
              >
                Télécharger
              </button>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <pre className="whitespace-pre-wrap text-sm font-mono overflow-x-auto max-h-60 overflow-y-auto">
              {exportedContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPanel;
