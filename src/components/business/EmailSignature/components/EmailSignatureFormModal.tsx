import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ConfirmationModal } from '../../../feedback/ConfirmationModal';
import { EmailSignatureForm } from './EmailSignatureForm';
import { EmailSignaturePreview } from './EmailSignaturePreview';
import { EmailSignature } from './EmailSignaturesTable';
import { CREATE_EMAIL_SIGNATURE, UPDATE_EMAIL_SIGNATURE } from '../../../../graphql/emailSignatures';
import { Notification } from '../../../feedback/Notification';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface EmailSignatureFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  signature?: EmailSignature;
}

export const EmailSignatureFormModal: React.FC<EmailSignatureFormModalProps> = ({
  isOpen,
  onClose,
  signature
}) => {
  console.log('EmailSignatureFormModal - isOpen:', isOpen);
  // État pour la signature en cours d'édition (pour la prévisualisation)
  const [formData, setFormData] = useState<Partial<EmailSignature>>(signature || {});
  
  // État pour la modal de confirmation
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Mutation pour créer une signature
  const [createEmailSignature] = useMutation(CREATE_EMAIL_SIGNATURE, {
    onCompleted: () => {
      Notification.success(`La signature "${formData.name}" a été créée avec succès.`);
      onClose();
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la création de la signature: ${error.message}`);
    },
    refetchQueries: ['GetEmailSignatures']
  });

  // Mutation pour mettre à jour une signature
  const [updateEmailSignature] = useMutation(UPDATE_EMAIL_SIGNATURE, {
    onCompleted: () => {
      Notification.success(`La signature "${formData.name}" a été mise à jour avec succès.`);
      onClose();
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la mise à jour de la signature: ${error.message}`);
    },
    refetchQueries: ['GetEmailSignatures']
  });

  // Gestionnaire pour la soumission du formulaire
  const handleSubmit = (data: Partial<EmailSignature>) => {
    // Nettoyer les données avant de les envoyer au serveur
    const cleanedData = {
      name: data.name,
      fullName: data.fullName,
      jobTitle: data.jobTitle,
      email: data.email,
      phone: data.phone,
      mobilePhone: data.mobilePhone,
      website: data.website,
      address: data.address,
      companyName: data.companyName,
      // Nettoyer l'objet socialLinks en supprimant le champ __typename
      socialLinks: data.socialLinks ? {
        linkedin: data.socialLinks.linkedin,
        twitter: data.socialLinks.twitter,
        facebook: data.socialLinks.facebook,
        instagram: data.socialLinks.instagram
      } : undefined,
      template: data.template,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      logoUrl: data.logoUrl,
      isDefault: data.isDefault
    };

    if (signature) {
      // Mise à jour d'une signature existante
      updateEmailSignature({
        variables: {
          id: signature.id,
          input: cleanedData
        }
      });
    } else {
      // Création d'une nouvelle signature
      createEmailSignature({
        variables: {
          input: cleanedData
        }
      });
    }
  };

  // Gestionnaire pour la mise à jour des données du formulaire (pour la prévisualisation)
  const handleFormChange = (data: Partial<EmailSignature>) => {
    setFormData(data);
  };

  // Gestionnaire pour demander confirmation avant de fermer
  const handleCloseRequest = () => {
    setShowConfirmationModal(true);
  };

  // Gestionnaire pour fermer la modal
  const handleConfirmClose = () => {
    setShowConfirmationModal(false);
    onClose();
  };

  // Gestionnaire pour annuler la fermeture
  const handleCancelClose = () => {
    setShowConfirmationModal(false);
  };

  // Ne pas forcer le rendu ici, laisser le composant Modal gérer l'affichage

  // Si la modal n'est pas ouverte, ne rien afficher
  if (!isOpen) {
    return null;
  }
  
  return (
    <>
      <div className="fixed inset-0 bg-white z-[9999] flex flex-col h-screen w-screen">
        {/* En-tête avec titre et bouton de fermeture */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {signature ? 'Modifier la signature' : 'Créer une signature'}
          </h2>
          <button
            onClick={handleCloseRequest}
            className="p-1 mr-4"
            aria-label="Fermer"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Contenu principal */}
        <div className="flex flex-1 h-full overflow-hidden">
          {/* Formulaire à gauche */}
          <div className="w-2/5 overflow-y-auto px-6 pt-6 border-r">
            <EmailSignatureForm
              initialData={signature}
              onSubmit={(data) => {
                handleFormChange(data);
                handleSubmit(data);
              }}
              onCancel={handleCloseRequest}
              onChange={handleFormChange} // Mise à jour en temps réel
            />
          </div>
          
          {/* Prévisualisation à droite */}
          <div className="w-3/5 overflow-y-auto bg-gray-50">
            <EmailSignaturePreview signature={formData} />
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        title="Confirmation"
        message="Toute progression non enregistrée sera perdue. Êtes-vous sûr de vouloir continuer ?"
        confirmButtonText="Continuer"
        cancelButtonText="Annuler"
        confirmButtonVariant="danger"
      />
    </>
  );
};
