// src/components/layout/Sidebar.tsx
import React, { ReactNode, useEffect } from 'react';
import { Button } from '../';

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
  // Effet pour bloquer le défilement de la page lorsque la sidebar est ouverte
  useEffect(() => {
    const body = document.body;
    if (isOpen) {
      // Sauvegarder la position actuelle du défilement
      const scrollY = window.scrollY;
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflowY = 'scroll';
    } else {
      // Restaurer la position du défilement
      const scrollY = body.style.top;
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      body.style.overflowY = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY.replace('-', '')) || 0);
      }
    }
    
    // Nettoyer l'effet lors du démontage du composant
    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      body.style.overflowY = '';
    };
  }, [isOpen]);
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
          className={`fixed inset-0 bg-gray-700 bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ease-in-out z-40 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 ${positionClass} ${width} bg-white shadow-xl transform transition-all duration-400 ease-out z-[1000] ${transformClass} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h2 id="sidebar-title" className="text-xl font-semibold text-gray-900">{title}</h2>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="text-gray-900 hover:text-[#4a41e0] hover:bg-[#f0eeff] rounded-full p-2 transition-all duration-200"
              aria-label="Fermer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {children}
          </div>

          {/* Actions */}
          {actions && (
            <div className="border-t border-gray-100 bg-[#f8f7ff] p-6 space-y-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );
};