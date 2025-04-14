import React, { ReactNode } from 'react';
import { Dialog } from '@headlessui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  maxHeight?: string;
  footer?: ReactNode;
}

/**
 * Composant Modal réutilisable
 * 
 * @param isOpen - État d'ouverture de la modale
 * @param onClose - Fonction appelée à la fermeture de la modale
 * @param title - Titre de la modale
 * @param children - Contenu de la modale
 * @param maxWidth - Largeur maximale de la modale ('sm', 'md', 'lg', 'xl', '2xl')
 * @param maxHeight - Hauteur maximale de la modale (ex: '80vh', '500px')
 * @param footer - Contenu du pied de modale (ex: boutons d'action)
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  maxHeight,
  footer,
}) => {

  // Mapping des classes de largeur maximale
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[9999]">
      {/* Overlay semi-transparent */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Conteneur centré */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel 
          className={`mx-auto ${maxWidthClasses[maxWidth]} w-full rounded-3xl bg-white shadow-xl flex flex-col overflow-hidden`} 
          style={{ maxHeight: maxHeight || '80vh' }}
        >
          {/* Titre de la modale */}
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 p-8 pb-4">
            {title}
          </Dialog.Title>

          {/* Contenu de la modale avec défilement */}
          <div className="flex-1 overflow-y-auto p-8 pt-0 pb-4">
            {children}
          </div>

          {/* Pied de modale fixe (optionnel) */}
          {footer && (
            <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-3xl">
              {footer}
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
