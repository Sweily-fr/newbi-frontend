import React from 'react';

export interface TabItem {
  id: string | null;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string | null;
  onTabChange: (tabId: string | null) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'compact-blue' | 'simple-tabs';
}

/**
 * Composant de navigation par onglets réutilisable
 */
export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  variant = 'default'
}) => {
  // Rendu des onglets en fonction du variant
  const renderTabs = () => {
    // Variante simple-tabs inspirée de l'image
    if (variant === 'simple-tabs') {
      return (
        <div className={`flex border border-gray-200 rounded-md overflow-hidden ${className}`}>
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id ?? 'all'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTabChange(tab.id);
              }}
              className={`
                px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out
                ${activeTab === tab.id 
                  ? 'bg-[#5b50ff] text-white' 
                  : 'bg-white text-black hover:bg-gray-50'}
                ${tab.id !== tabs[0].id ? 'border-l border-gray-200' : ''}
              `}
            >
              <div className="flex items-center">
                {tab.icon && (
                  <span className="mr-1.5">
                    {tab.icon}
                  </span>
                )}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`
                    ml-1.5 rounded-full px-1.5 py-0.5 text-xs
                    ${activeTab === tab.id 
                      ? 'bg-white text-[#5b50ff]' 
                      : 'bg-gray-200 text-gray-700'}
                  `}>
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      );
    }
    
    // Variante compact-blue avec moins de padding et fond bleu transparent
    if (variant === 'compact-blue') {
      return (
        <div className={`flex space-x-1 ${className}`}>
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id ?? 'all'}
              onClick={(e) => {
                // Arrêter la propagation de l'événement pour éviter la soumission du formulaire
                e.preventDefault();
                e.stopPropagation();
                onTabChange(tab.id);
              }}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
                ${activeTab === tab.id 
                  ? 'bg-[#5b50ff] text-white' 
                  : 'text-black hover:bg-white'}
              `}
            >
              <div className="flex items-center">
                {tab.icon && (
                  <span className="mr-1.5">
                    {tab.icon}
                  </span>
                )}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`
                    ml-1.5 rounded-full px-1.5 py-0.5 text-xs
                    ${activeTab === tab.id 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-700'}
                  `}>
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      );
    }
    
    // Variante pills
    if (variant === 'pills') {
      return (
        <div className={`flex space-x-1 border-b border-gray-200 ${className} relative overflow-hidden`}>
          {tabs.map((tab) => {
            // Déterminer la couleur du badge en fonction du type d'onglet
            let badgeColor = 'bg-gray-400';
            if (tab.id === 'DRAFT') badgeColor = 'bg-orange-400';
            if (tab.id === 'PENDING') badgeColor = 'bg-gray-400';
            if (tab.id === 'CANCELED') badgeColor = 'bg-red-600';
            if (tab.id === 'COMPLETED') badgeColor = 'bg-green-600';
            if (tab.id === null) badgeColor = 'bg-white';
            
            return (
              <button
                type="button"
                key={tab.id ?? 'all'}
                onClick={(e) => {
                  // Arrêter la propagation de l'événement pour éviter la soumission du formulaire
                  e.preventDefault();
                  e.stopPropagation();
                  onTabChange(tab.id);
                }}
                className={`px-4 py-2 font-medium text-sm relative transition-all duration-300 ease-in-out ${activeTab === tab.id ? 'text-[#5b50ff]' : 'text-black'} hover:text-gray-700`}
                style={{
                  // Utiliser un pseudo-élément pour une animation plus fluide
                  '--tab-indicator-width': activeTab === tab.id ? '100%' : '0%',
                  '--tab-indicator-opacity': activeTab === tab.id ? '1' : '0',
                }}
              >
                <div className="flex items-center">
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs text-white transform transition-all duration-300 ${activeTab === tab.id ? 'bg-[#5b50ff]' : 'bg-gray-400'} ${activeTab === tab.id ? 'scale-110' : 'scale-100'}`}>
                      {tab.count}
                    </span>
                  )}
                  {/* Indicateur animé sous l'onglet actif */}
                  <div 
                    className={`absolute bottom-0 left-0 h-0.5 bg-[#5b50ff] transition-all duration-300 ease-in-out`}
                    style={{
                      width: activeTab === tab.id ? '100%' : '0%',
                      opacity: activeTab === tab.id ? 1 : 0,
                      transform: `translateX(${activeTab === tab.id ? '0' : '-10px'})`
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      );
    }
    
    // Variant par défaut
    return (
      <nav className={`flex ${className}`} aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id ?? 'all'}
            onClick={(e) => {
              // Arrêter la propagation de l'événement pour éviter la soumission du formulaire
              e.preventDefault();
              e.stopPropagation();
              onTabChange(tab.id);
            }}
            className={`px-4 py-3 rounded-md w-full text-left flex items-center transition-all duration-300 ease-in-out ${
              activeTab === tab.id
                ? 'bg-[#5b50ff] text-white font-medium shadow-sm'
                : 'bg-transparent text-black hover:text-black'
            }`}
          >
            {tab.icon && (
              <span className={`mr-3 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`}>
                {tab.icon}
              </span>
            )}
            <span className="font-medium">{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`ml-auto rounded-full px-2 py-0.5 text-xs transform transition-all duration-300 ${
                activeTab === tab.id ? 'bg-[#5b50ff] text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    );
  };
  
  return renderTabs();
};