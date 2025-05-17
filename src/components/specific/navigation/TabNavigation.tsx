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
  variant?: 'default' | 'pills' | 'compact-blue' | 'simple-tabs' | 'modern';
}

// Composant spécifique pour la variante modern avec transition de slide
const ModernTabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}) => {
  // Utiliser useRef pour stocker les références aux boutons
  const buttonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  
  // Réinitialiser les références si le nombre d'onglets change
  React.useEffect(() => {
    buttonRefs.current = buttonRefs.current.slice(0, tabs.length);
  }, [tabs]);
  
  // Trouver l'index de l'onglet actif pour l'animation de slide
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
  
  // Effet pour forcer une mise à jour après le premier rendu pour s'assurer que l'indicateur est positionné correctement
  const [isInitialized, setIsInitialized] = React.useState(false);
  React.useEffect(() => {
    // Attendre que les références soient disponibles après le premier rendu
    if (!isInitialized) {
      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);
  
  return (
    <div className={`inline-flex items-center gap-0 px-1.5 py-1 bg-gray-100 rounded-xl relative ${className}`}>
      {/* Indicateur de slide qui se déplace */}
      <div 
        className="absolute bg-white rounded-lg shadow-sm transition-all duration-300 ease-in-out" 
        style={{
          top: '5px',
          bottom: '5px',
          left: activeIndex !== -1 && buttonRefs.current[activeIndex] 
            ? (buttonRefs.current[activeIndex]?.offsetLeft || 0) - 2 
            : (buttonRefs.current[0]?.offsetLeft || 0) - 2,
          width: activeIndex !== -1 && buttonRefs.current[activeIndex] 
            ? buttonRefs.current[activeIndex]?.offsetWidth || 0 
            : buttonRefs.current[0]?.offsetWidth || 0,
          opacity: activeIndex !== -1 || isInitialized ? 1 : 0,
        }}
      />
      
      {tabs.map((tab, index) => (
        <button
          type="button"
          key={tab.id ?? 'all'}
          ref={(el) => { buttonRefs.current[index] = el; }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTabChange(tab.id);
          }}
          className={`
            flex items-center justify-center gap-2 px-5 py-2 rounded-lg transition-colors duration-300 ease-in-out mx-0.5 z-10
            ${activeTab === tab.id 
              ? 'text-gray-700' 
              : 'text-gray-500 hover:text-gray-700'}
          `}
        >
          {tab.icon && (
            <span className="flex items-center justify-center w-5 h-5 text-gray-500">
              {tab.icon}
            </span>
          )}
          <span className="font-medium text-sm">{tab.label}</span>
          {tab.count !== undefined && (
            <span className={`
              flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ml-1.5
              ${activeTab === tab.id 
                ? 'bg-gray-100 text-gray-700' 
                : 'bg-gray-200 text-gray-700'}
            `}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

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
    // Variante modern avec transition de slide
    if (variant === 'modern') {
      return <ModernTabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        className={className} 
      />;
    }
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
                px-4 py-2 text-sm font-medium transition-all rounded-2xl duration-200 ease-in-out
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
                px-3 py-1.5 rounded-2xl text-sm font-medium transition-all duration-200 ease-in-out
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
        <div className={`flex space-x-1 border-b border-gray-200 rounded-2xl ${className} relative overflow-hidden`}>
          {tabs.map((tab) => {
            // Déterminer la couleur du badge directement dans le JSX
            const getBadgeColor = () => {
              switch(tab.id) {
                case 'DRAFT': return 'bg-orange-400';
                case 'PENDING': return 'bg-gray-400';
                case 'CANCELED': return 'bg-red-600';
                case 'COMPLETED': return 'bg-green-600';
                case null: return 'bg-white';
                default: return 'bg-gray-400';
              }
            };
            
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
                // Using className-based styling instead of inline styles
              >
                <div className="flex items-center">
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs text-white transform transition-all duration-300 ${activeTab === tab.id ? 'bg-[#5b50ff]' : getBadgeColor()} ${activeTab === tab.id ? 'scale-110' : 'scale-100'}`}>
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
            className={`px-4 py-4 rounded-2xl w-full text-left flex items-center transition-all duration-300 ease-in-out ${
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