import React, { useState, useRef } from 'react';
import { SearchNormal1, Cloud, DocumentText, Calculator, Box1, Chart, Setting4 } from 'iconsax-react';

// Interface pour les outils d'intégration
interface IntegrationTool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'not_connected' | 'coming_soon';
  url: string;
}

export const IntegrationsManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Liste des intégrations disponibles (toutes en "bientôt disponible")
  const [integrationTools] = useState<IntegrationTool[]>([
    {
      id: 'oracle',
      name: 'Oracle',
      description: 'Synchronisez vos données avec Oracle pour une gestion centralisée',
      icon: <Cloud size="28" variant="Linear" color="#fff" />,
      status: 'coming_soon',
      url: 'https://oracle.com'
    },
    {
      id: 'sage',
      name: 'Sage',
      description: 'Intégrez vos données comptables et financières avec Sage',
      icon: <Calculator size="28" variant="Linear" color="#fff" />,
      status: 'coming_soon',
      url: 'https://sage.com'
    },
    {
      id: 'acd',
      name: 'ACD',
      description: 'Connectez vos logiciels ACD pour une gestion comptable optimisée',
      icon: <DocumentText size="28" variant="Linear" color="#fff" />,
      status: 'coming_soon',
      url: 'https://acd-groupe.fr'
    },
    {
      id: 'odoo',
      name: 'Odoo',
      description: 'Synchronisez vos données avec Odoo pour une gestion intégrée',
      icon: <Box1 size="28" variant="Linear" color="#fff" />,
      status: 'coming_soon',
      url: 'https://odoo.com'
    },
    {
      id: 'pennylane',
      name: 'Pennylane',
      description: 'Intégrez vos données comptables avec Pennylane',
      icon: <Chart size="28" variant="Linear" color="#fff" />,
      status: 'coming_soon',
      url: 'https://pennylane.tech'
    },
    {
      id: 'cegid-quadra',
      name: 'Cegid Quadra',
      description: 'Connectez vos logiciels Cegid Quadra pour une gestion comptable optimisée',
      icon: <DocumentText size="28" variant="Linear" color="#fff" />,
      status: 'coming_soon',
      url: 'https://cegid.com/fr/produits/quadra/'
    },
    {
      id: 'cegid-loop',
      name: 'Cegid Loop',
      description: 'Synchronisez vos données avec Cegid Loop pour une gestion intégrée',
      icon: <Setting4 size="28" variant="Linear" color="#fff" />,
      status: 'coming_soon',
      url: 'https://cegid.com/fr/produits/loop/'
    }
  ]);

  // Filtrer les outils en fonction de la recherche
  const filteredTools = integrationTools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fonction pour gérer le changement dans la barre de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        Intégrations
      </h2>
      
      {/* Barre de recherche */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchNormal1 size="20" variant="Linear" color="#9ca3af" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Rechercher une intégration..."
          value={searchQuery}
          onChange={handleSearchChange}
          ref={searchInputRef}
        />
      </div>
      
      {/* Liste des outils d'intégration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredTools.map((tool) => (
          <div key={tool.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full opacity-60">
            <div className="p-4 flex-grow">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center bg-[#5b50ff]">
                  {tool.icon}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{tool.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{tool.description}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                    Bientôt disponible
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 pt-0 mt-auto border-t border-gray-100">
              <button
                disabled={true}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-gray-500 bg-gray-200 cursor-not-allowed"
              >
                Bientôt disponible
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTools.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune intégration trouvée pour "{searchQuery}"</p>
        </div>
      )}
      
      <div className="bg-[#f0eeff] p-4 rounded-2xl border border-[#e6e1ff] mt-8">
        <p className="text-sm text-gray-600">
          <span className="text-[#5b50ff] font-medium">Information :</span> Newbi travaille activement sur l'intégration avec les principaux logiciels de comptabilité et de gestion. Ces intégrations vous permettront de synchroniser automatiquement vos données entre Newbi et vos autres outils de gestion. Restez informés des nouvelles intégrations disponibles !
        </p>
      </div>
    </div>
  );
};
