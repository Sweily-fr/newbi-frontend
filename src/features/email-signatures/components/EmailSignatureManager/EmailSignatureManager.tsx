import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ConfirmationModal } from '../../../../components/feedback/ConfirmationModal';
import { EmailSignaturesTable } from '../../../../components/business/EmailSignature/components/EmailSignaturesTable';
import { EmailSignatureFormModal } from '../EmailSignatureFormModal';
import { EmailSignature } from '../../types';
import { DELETE_EMAIL_SIGNATURE, SET_DEFAULT_EMAIL_SIGNATURE } from '../../../../graphql/emailSignatures';
import { Notification } from '../../../../components/feedback/Notification';

export const EmailSignatureManager: React.FC = () => {
  // État pour la modal de formulaire
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  
  // État pour la signature sélectionnée (pour l'édition)
  const [selectedSignature, setSelectedSignature] = useState<EmailSignature | null>(null);
  
  // État pour la modal de confirmation
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Mutation pour supprimer une signature
  const [deleteEmailSignature] = useMutation(DELETE_EMAIL_SIGNATURE, {
    onCompleted: () => {
      Notification.success('La signature a été supprimée avec succès.');
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la suppression de la signature: ${error.message}`);
    },
    refetchQueries: ['GetEmailSignatures']
  });

  // Mutation pour définir une signature par défaut
  const [setDefaultEmailSignature] = useMutation(SET_DEFAULT_EMAIL_SIGNATURE, {
    onCompleted: () => {
      Notification.success('La signature par défaut a été mise à jour avec succès.');
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la mise à jour de la signature par défaut: ${error.message}`);
    },
    refetchQueries: ['GetEmailSignatures']
  });

  // Fonction pour ouvrir la modal d'ajout de signature
  const handleAddSignature = () => {
    setSelectedSignature(null);
    setIsFormModalOpen(true);
  };

  // Fonction pour ouvrir la modal d'édition de signature
  const handleEditSignature = (signature: EmailSignature) => {
    setSelectedSignature(signature);
    setIsFormModalOpen(true);
  };

  // Fonction pour fermer la modal de formulaire
  const handleCloseForm = () => {
    setIsFormModalOpen(false);
    setSelectedSignature(null);
  };

  // Fonction pour supprimer une signature
  const handleDeleteSignature = (signature: EmailSignature) => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer la signature',
      message: `Êtes-vous sûr de vouloir supprimer la signature "${signature.name}" ? Cette action est irréversible.`,
      onConfirm: () => {
        deleteEmailSignature({ variables: { id: signature.id } });
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  // Fonction pour définir une signature comme signature par défaut
  const handleSetDefault = (signature: EmailSignature) => {
    setDefaultEmailSignature({ variables: { id: signature.id } });
  };

  return (
    <div>
      <EmailSignaturesTable
        onAddSignature={handleAddSignature}
        onEditSignature={handleEditSignature}
        onDeleteSignature={handleDeleteSignature}
        onSetDefault={handleSetDefault}
      />

      {/* Modale de formulaire de signature */}
      <EmailSignatureFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseForm}
        signature={selectedSignature || undefined}
      />

      {/* Modale de confirmation */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        confirmButtonText="Supprimer"
        cancelButtonText="Annuler"
        confirmButtonVariant="danger"
      />
    </div>
  );
};
