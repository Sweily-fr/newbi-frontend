import React from 'react';
import { CircularProgressBar } from '../CircularProgressBar';

// Type pour les éléments de navigation
export interface NavigationItem {
  id: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  tooltip?: string;
}

interface NavigationSidebarProps {
  /**
   * Liste des éléments de navigation à afficher
   */
  items: NavigationItem[];
  
  /**
   * ID de l'élément actif
   */
  activeItemId: string;
  
  /**
   * Fonction appelée lorsqu'un élément est cliqué
   */
  onItemClick: (itemId: string) => void;
  
  /**
   * Valeur de progression à afficher (0-100)
   */
  progress?: number;
  
  /**
   * Texte à afficher au survol de la barre de progression
   */
  progressTooltip?: string;
  
  /**
   * Couleur principale pour les éléments actifs
   */
  primaryColor?: string;
  
  /**
   * Couleur de fond pour les éléments actifs
   */
  activeBackgroundColor?: string;
  
  /**
   * Position fixe de la sidebar
   */
  fixed?: boolean;
  
  /**
   * Décalage du haut pour la position fixe (ex: '80px')
   */
  topOffset?: string;
  
  /**
   * Composant de logo à afficher en haut de la sidebar
   */
  logo?: React.ReactNode;
}

/**
 * Sidebar de navigation verticale réutilisable
 * Positionnée à l'extrême gauche, peut être fixée pour rester visible au scroll
 */
export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  items,
  activeItemId,
  onItemClick,
  progress,
  progressTooltip = 'Progression',
  primaryColor = '#5b50ff', // Couleur principale Newbi
  activeBackgroundColor = '#f0eeff',
  fixed = true,
  topOffset = '80px',
  logo
}) => {
  // Classes de positionnement de la sidebar
  const sidebarPositionClasses = fixed 
    ? `fixed left-0 top-[${topOffset}] bottom-0` 
    : 'relative';
  
  return (
    <div className={`w-20 bg-white flex flex-col items-center py-8 shadow-[2px_0px_5px_rgba(0,0,0,0.05)] ${sidebarPositionClasses}`}>
      <div className="flex flex-col items-center space-y-8">
        {/* Logo en haut */}
        {logo ? (
          <div className="mb-8 flex items-center justify-center">
            {logo}
          </div>
        ) : (
          // Logo Newbi par défaut
          <div className="mb-8 flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-[#b19aff]"></div>
              <div className="w-3 h-3 rounded-full bg-[#5b50ff]"></div>
            </div>
          </div>
        )}
        
        {/* Éléments de navigation */}
        {items.map(item => {
          const isActive = item.id === activeItemId;
          return (
            <button 
              key={item.id}
              onClick={() => onItemClick(item.id)} 
              className={`p-2 rounded-xl transition-all ${isActive ? `bg-[${activeBackgroundColor}] text-[${primaryColor}]` : `text-[#222] hover:text-[${primaryColor}]`}`}
              title={item.tooltip}
            >
              {isActive && item.activeIcon ? item.activeIcon : item.icon}
            </button>
          );
        })}
      </div>
      
      {/* Barre de progression circulaire en bas de la sidebar */}
      {progress !== undefined && (
        <div className="mt-auto mb-2 relative group">
          <CircularProgressBar 
            progress={progress} 
            size={40} 
            strokeWidth={2.5}
            circleColor="#E3E2E5"
            progressColor={primaryColor}
          />
          <div className="absolute left-full ml-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {progressTooltip}: {progress}%
          </div>
        </div>
      )}
    </div>
  );
};
