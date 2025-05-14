import React from 'react';
import { Modal } from './Modal';
import { Button } from '..';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ModalPriority } from './constants';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariant?: 'primary' | 'danger' | 'secondary';
  isLoading?: boolean;
  priority?: ModalPriority; // Nouvelle prop pour définir la priorité de la modale
  preventBackgroundClose?: boolean; // Empêche la fermeture en cliquant sur l'arrière-plan
  overlayOpacity?: number; // Opacité de l'overlay (0-100)
}

/**
 * Composant de modale de confirmation unifié
 * Remplace à la fois ConfirmationModal et HighPriorityConfirmationModal
 * Utilise la couleur primaire de Newbi (#5b50ff) pour les ombres
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirmer',
  cancelButtonText = 'Annuler',
  confirmButtonVariant = 'danger',
  isLoading = false,
  priority = 'critical', // Par défaut, les modales de confirmation ont la priorité la plus élevée
  preventBackgroundClose = false,
  overlayOpacity = 10 // Overlay semi-transparent avec teinte violette
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      priority={priority}
      preventBackgroundClose={preventBackgroundClose}
      overlayOpacity={overlayOpacity}
      size="sm"
      className="shadow-lg shadow-[#5b50ff]/10" // Ombre avec la couleur primaire de Newbi
      zIndex={9999} // Assure que le modal apparaît au-dessus de tous les autres éléments
    >
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button
          type="button"
          variant={confirmButtonVariant}
          className="w-full sm:ml-3 sm:w-auto"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Chargement...' : confirmButtonText}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="mt-3 w-full sm:mt-0 sm:w-auto"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelButtonText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
