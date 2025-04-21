import React, { ReactNode } from 'react';
import { CommunityButton } from '../ui/CommunityButton';

interface ToolLayoutProps {
  children: ReactNode;
}

/**
 * Layout commun pour toutes les pages d'outils
 * Inclut le bouton de communauté fixe en bas à gauche
 */
export const ToolLayout: React.FC<ToolLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      {/* Contenu principal */}
      {children}
      
      {/* Bouton fixe pour rejoindre la communauté */}
      <CommunityButton />
    </div>
  );
};
