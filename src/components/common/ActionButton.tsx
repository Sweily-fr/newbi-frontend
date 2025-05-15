import React, { useRef, ReactNode, useLayoutEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { More } from 'iconsax-react';
import { TableMenuContext } from './Table';

// Interface pour le contexte de menu importée depuis Table.tsx

// Type pour les actions du menu
export interface ActionMenuItem<T> {
  label: string;
  icon?: ReactNode;
  onClick: (item: T) => void;
  variant?: 'default' | 'danger';
  disabled?: (item: T) => boolean;
  tooltip?: (item: T) => string | undefined;
}

// Props pour le bouton d'action
export interface ActionButtonProps<T> {
  item: T;
  actions: ActionMenuItem<T>[];
  buttonLabel?: string;
  className?: string;
  menuId?: string; // Identifiant unique du menu pour la gestion d'état global
}

/**
 * Composant ActionButton réutilisable pour les tableaux
 * Affiche un bouton avec une icône "More" qui ouvre un menu déroulant d'actions
 */
export function ActionButton<T>({
  item,
  actions,
  buttonLabel = "Actions",
  className = '',
  menuId = 'default'
}: ActionButtonProps<T>) {
  // Utiliser le contexte du tableau pour gérer l'état global des menus
  const tableMenuContext = useContext(TableMenuContext);
  
  // Déterminer si ce menu est ouvert en fonction du contexte global
  const isOpen = tableMenuContext.activeMenuId === menuId;
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Nous n'avons plus besoin de ce gestionnaire de clic externe
  // car il est maintenant géré dans useLayoutEffect

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Mettre à jour l'état global du menu actif
    if (isOpen) {
      tableMenuContext.setActiveMenuId(null);
    } else {
      tableMenuContext.setActiveMenuId(menuId);
    }
  };

  // Référence pour le conteneur du menu
  const menuContainerRef = useRef<HTMLDivElement>(null);
  
  // Mise à jour de la position du menu lors de l'ouverture et au scroll
  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current || !menuContainerRef.current) return;
    
    const updateMenuPosition = () => {
      if (!buttonRef.current || !menuContainerRef.current) return;
      
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 224; // Largeur fixe du menu (w-56 = 14rem = 224px)
      
      // Calculer la position pour aligner le menu à gauche du bouton
      const leftPosition = Math.max(10, buttonRect.left - menuWidth + buttonRect.width);
      
      // Appliquer les positions
      menuContainerRef.current.style.top = `${buttonRect.bottom + 8}px`;
      menuContainerRef.current.style.left = `${leftPosition}px`;
    };
    
    // Mettre à jour la position immédiatement et à chaque scroll
    updateMenuPosition();
    window.addEventListener('scroll', updateMenuPosition, true);
    window.addEventListener('resize', updateMenuPosition);
    
    // Fermer le menu lors d'un clic en dehors
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuContainerRef.current && 
        buttonRef.current && 
        !menuContainerRef.current.contains(e.target as Node) &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        tableMenuContext.setActiveMenuId(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', updateMenuPosition, true);
      window.removeEventListener('resize', updateMenuPosition);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, tableMenuContext]);

  return (
    <>
      <div className={`relative ${className}`}>
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white hover:bg-[#f0eeff] transition-colors duration-150 border border-gray-200"
          aria-label={buttonLabel}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <More size={20} variant="Linear" color="#9ca3af" />
        </button>
      </div>
      
      {isOpen && createPortal(
        <div 
          ref={menuContainerRef}
          className="fixed w-56 rounded-lg shadow-lg bg-white border border-gray-100 overflow-hidden"
          style={{ 
            boxShadow: '0 4px 20px rgba(91, 80, 255, 0.15)',
            zIndex: 999999
          }}
        >
          <div className="py-0" role="menu" aria-orientation="vertical">
            {actions.map((action, index) => {
              const isDisabled = action.disabled ? action.disabled(item) : false;
              const tooltipText = action.tooltip ? action.tooltip(item) : undefined;
              
              return (
                <button
                  key={index}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors duration-150 
                    ${action.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-[#f0eeff]'}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed hover:bg-white' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDisabled) {
                      action.onClick(item);
                      tableMenuContext.setActiveMenuId(null);
                    }
                  }}
                  role="menuitem"
                  disabled={isDisabled}
                  title={tooltipText}
                  aria-disabled={isDisabled}
                >
                  <span className="flex items-center justify-center w-5 h-5">
                    {action.icon}
                  </span>
                  <span className="font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default ActionButton;
