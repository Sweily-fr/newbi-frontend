// src/components/layout/Sidebar.tsx
import React, { ReactNode } from 'react';
import { Button } from '../ui';

export interface SidebarProps {
  /**
   * Contrôle si la sidebar est ouverte ou fermée
   */
  isOpen: boolean;
  
  /**
   * Fonction appelée lorsque l'utilisateur ferme la sidebar
   */
  onClose: () => void;
  
  /**
   * Titre affiché dans l'en-tête de la sidebar
   */
  title: string;
  
  /**
   * Contenu principal de la sidebar
   */
  children: ReactNode;
  
  /**
   * Actions affichées en bas de la sidebar (boutons, etc.)
   */
  actions?: ReactNode;
  
  /**
   * Largeur de la sidebar (par défaut: 32rem)
   */
  width?: string;
  
  /**
   * Position de la sidebar (par défaut: droite)
   */
  position?: 'left' | 'right';
  
  /**
   * Classe CSS supplémentaire pour la sidebar
   */
  className?: string;
  
  /**
   * Indique si l'overlay doit être affiché (par défaut: true)
   */
  showOverlay?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  width = 'w-[32rem]',
  position = 'right',
  className = '',
  showOverlay = true,
}) => {
  // Détermine la classe de transformation en fonction de la position
  const transformClass = position === 'right' 
    ? isOpen ? 'translate-x-0' : 'translate-x-full'
    : isOpen ? 'translate-x-0' : '-translate-x-full';
  
  // Détermine la position de la sidebar
  const positionClass = position === 'right' ? 'right-0' : 'left-0';
  
  return (
    <>
      {/* Overlay */}
      {showOverlay && isOpen && (
        <div
          className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300 ease-in-out z-40 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 ${positionClass} ${width} bg-white shadow-lg transform transition-all duration-300 ease-in-out z-[1000] ${transformClass} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 id="sidebar-title" className="text-lg font-medium">{title}</h2>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="text-gray-400 hover:text-gray-500 p-1"
              aria-label="Fermer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>

          {/* Actions */}
          {actions && (
            <div className="border-t border-gray-200 p-6 space-y-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );
};