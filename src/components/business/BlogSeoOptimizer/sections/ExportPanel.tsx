import React, { useState } from 'react';
import { useBlogSeo } from '../context';

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#f0eeff] transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-5 text-gray-800 flex items-center">
          <svg className="mr-2 h-5 w-5 text-[#5b50ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exporter le contenu
        </h2>
        
        <div className="mb-5 bg-white p-0 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Format d'exportation
          </label>
          <div className="flex flex-wrap gap-4">
            {[
              { id: 'html', label: 'HTML', icon: '</>' },
              { id: 'markdown', label: 'Markdown', icon: 'MD' },
              { id: 'text', label: 'Texte brut', icon: 'Aa' }
            ].map((format) => (
              <label 
                key={format.id}
                className={`
                  flex items-center justify-center px-4 py-2 rounded-md cursor-pointer
                  transition-all duration-200 border
                  ${exportFormat === format.id 
                    ? 'bg-[#5b50ff] text-white border-[#5b50ff]' 
                    : 'bg-white text-gray-700 border-[#e6e1ff] hover:bg-[#f9f8ff]'}
                `}
              >
                <input
                  type="radio"
                  className="sr-only"
                  checked={exportFormat === format.id}
                  onChange={() => setExportFormat(format.id as 'html' | 'markdown' | 'text')}
                />
                <span className="font-mono mr-2">{format.icon}</span>
                <span>{format.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#5b50ff] hover:bg-[#4a41e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff] transition-all duration-200 transform hover:translate-y-[-1px]"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Exporter
          </button>
        </div>
        
        {showExportedContent && (
          <div className="mt-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <svg className="mr-2 h-4 w-4 text-[#5b50ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Contenu exporté
              </h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  disabled={copySuccess}
                  className={`
                    inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff]
                    ${copySuccess 
                      ? 'border-green-500 text-green-600 bg-green-50' 
                      : 'border-[#e6e1ff] text-[#5b50ff] bg-white hover:bg-[#f9f8ff]'}
                  `}
                >
                  {copySuccess ? (
                    <>
                      <svg className="mr-1 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copié !
                    </>
                  ) : (
                    <>
                      <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copier
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center px-3 py-1.5 border border-[#e6e1ff] text-sm font-medium rounded-md text-[#5b50ff] bg-white hover:bg-[#f9f8ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b50ff] transition-all duration-200"
                >
                  <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Télécharger
                </button>
              </div>
            </div>
            <div className="bg-[#f0eeff] p-5 rounded-lg overflow-auto max-h-96 border border-[#e6e1ff] shadow-inner">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
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
