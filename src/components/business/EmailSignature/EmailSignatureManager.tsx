import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { EmailSignaturesTable, EmailSignature } from './components/EmailSignaturesTable';
import { DELETE_EMAIL_SIGNATURE, SET_DEFAULT_EMAIL_SIGNATURE } from '../../../graphql/emailSignatures';
import { Notification } from '../../feedback/Notification';
import { ConfirmationModal } from '../../feedback/ConfirmationModal';
import { EmailSignatureFormModal } from './components/EmailSignatureFormModal';

export const EmailSignatureManager: React.FC = () => {


  // État pour la modale de confirmation
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // États pour gérer les modales et les actions
  const [signatureToDelete, setSignatureToDelete] = useState<EmailSignature | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedSignature, setSelectedSignature] = useState<EmailSignature | null>(null);

  // Mutation pour supprimer une signature
  const [deleteEmailSignature] = useMutation(DELETE_EMAIL_SIGNATURE, {
    onCompleted: () => {
      Notification.success(`La signature "${signatureToDelete?.name}" a été supprimée avec succès.`);
      setSignatureToDelete(null);
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la suppression de la signature: ${error.message}`);
    },
    refetchQueries: ['GetEmailSignatures']
  });

  // Mutation pour définir une signature comme signature par défaut
  const [setDefaultEmailSignature] = useMutation(SET_DEFAULT_EMAIL_SIGNATURE, {
    onCompleted: () => {
      Notification.success('La signature par défaut a été mise à jour avec succès.');
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la définition de la signature par défaut: ${error.message}`);
    },
    refetchQueries: ['GetEmailSignatures']
  });

  // Fonction pour ouvrir le formulaire de création
  const handleAddSignature = () => {
    console.log('handleAddSignature appelé');
    setSelectedSignature(null);
    setIsFormModalOpen(true);
    console.log('isFormModalOpen après modification:', true);
  };

  // Fonction pour ouvrir le formulaire d'édition
  const handleEditSignature = (signature: EmailSignature) => {
    setSelectedSignature(signature);
    setIsFormModalOpen(true);
  };

  // Fonction pour fermer le formulaire
  const handleCloseForm = () => {
    setIsFormModalOpen(false);
    setSelectedSignature(null);
  };

  // Fonction pour gérer la suppression d'une signature
  const handleDeleteSignature = (signature: EmailSignature) => {
    setSignatureToDelete(signature);
    setConfirmModal({
      isOpen: true,
      title: 'Confirmer la suppression',
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
