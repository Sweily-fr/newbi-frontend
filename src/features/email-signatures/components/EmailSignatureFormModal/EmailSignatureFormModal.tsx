import React, { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ConfirmationModal } from '../../../../components/feedback/ConfirmationModal';
import { Notification } from '../../../../components/feedback/Notification';
import { EmailSignatureEditor } from '../EmailSignatureEditor';
import { EmailSignature } from '../../types';
import { CREATE_EMAIL_SIGNATURE, UPDATE_EMAIL_SIGNATURE } from '../../../../graphql/emailSignatures';

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
  // URL de base de l'API pour les images
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // Fonction pour préfixer l'URL du logo avec l'URL de l'API si nécessaire
  const getFullLogoUrl = useCallback((logoPath: string | undefined) => {
    if (!logoPath) return '';
    if (logoPath.startsWith('http')) return logoPath; // Déjà une URL complète
    return `${apiUrl}${logoPath.startsWith('/') ? '' : '/'}${logoPath}`;
  }, [apiUrl]);
  
  // État pour la signature en cours d'édition
  const [formData, setFormData] = useState<Partial<EmailSignature>>(signature ? {
    ...signature,
    logoUrl: signature.logoUrl ? getFullLogoUrl(signature.logoUrl) : '',
    profilePhotoUrl: signature.profilePhotoUrl ? getFullLogoUrl(signature.profilePhotoUrl) : ''
  } : {});
  
  // Initialiser les données du formulaire lorsque la signature change
  useEffect(() => {
    if (signature) {
      setFormData({
        ...signature,
        logoUrl: signature.logoUrl ? getFullLogoUrl(signature.logoUrl) : '',
        profilePhotoUrl: signature.profilePhotoUrl ? getFullLogoUrl(signature.profilePhotoUrl) : ''
      });
    } else {
      setFormData({});
    }
  }, [signature, getFullLogoUrl]);
  
  // État pour la modal de confirmation
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Mutation pour créer une signature
  const [createEmailSignature, { loading: createLoading, error: createError }] = useMutation(CREATE_EMAIL_SIGNATURE, {
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
  const [updateEmailSignature, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_EMAIL_SIGNATURE, {
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
    // Fonction pour extraire le chemin relatif d'une URL
    const extractRelativePath = (url: string | undefined): string | undefined => {
      if (!url) return undefined;
      if (url.startsWith('data:')) return url; // Base64, ne pas modifier
      
      // Si l'URL contient l'URL de base de l'API, l'extraire
      if (url.startsWith(apiUrl)) {
        return url.replace(apiUrl, '').replace(/^\/+/, ''); // Supprimer l'URL de base et les slashes au début
      }
      
      // Si c'est déjà un chemin relatif ou une autre URL, la retourner telle quelle
      return url;
    };
    
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
      template: data.template || 'simple',
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      logoUrl: extractRelativePath(data.logoUrl),
      showLogo: data.showLogo,
      isDefault: data.isDefault,
      socialLinks: data.socialLinks,
      profilePhotoUrl: extractRelativePath(data.profilePhotoUrl),
      profilePhotoBase64: data.profilePhotoBase64,
      profilePhotoToDelete: data.profilePhotoToDelete,
      profilePhotoSize: data.profilePhotoSize,
      layout: data.layout,
      horizontalSpacing: data.horizontalSpacing,
      verticalSpacing: data.verticalSpacing,
      verticalAlignment: data.verticalAlignment,
      imagesLayout: data.imagesLayout,
      fontFamily: data.fontFamily,
      fontSize: data.fontSize,
      socialLinksDisplayMode: data.socialLinksDisplayMode,
      socialLinksPosition: data.socialLinksPosition,
      socialLinksIconStyle: data.socialLinksIconStyle
    };
    
    if (signature?.id) {
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

  // Gestionnaire pour les changements dans le formulaire (pour la prévisualisation)
  const handleFormChange = (data: Partial<EmailSignature>) => {
    setFormData(data);
  };

  // Gestionnaire pour la demande de fermeture
  const handleCloseRequest = () => {
    // Si des modifications ont été apportées, demander confirmation
    if (JSON.stringify(formData) !== JSON.stringify(signature)) {
      setShowConfirmationModal(true);
    } else {
      onClose();
    }
  };

  // Gestionnaire pour confirmer la fermeture
  const handleConfirmClose = () => {
    setShowConfirmationModal(false);
    onClose();
  };

  // Gestionnaire pour annuler la fermeture
  const handleCancelClose = () => {
    setShowConfirmationModal(false);
  };

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
        <div className="flex-1 overflow-y-auto p-6">
          <EmailSignatureEditor
            initialData={formData}
            onSubmit={handleSubmit}
            onCancel={handleCloseRequest}
            onChange={handleFormChange}
            isLoading={createLoading || updateLoading}
            error={createError?.message || updateError?.message || null}
          />
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
