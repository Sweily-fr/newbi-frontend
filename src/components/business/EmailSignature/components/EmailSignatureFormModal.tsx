import React, { useState, useCallback, useEffect } from 'react';
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
  // URL de base de l'API pour les images - essayer différentes façons d'accéder aux variables d'environnement
  const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || "http://localhost:4000";

  // Fonction pour préfixer l'URL du logo avec l'URL de l'API si nécessaire
  // Utiliser useCallback pour éviter que la fonction ne change à chaque rendu
  const getFullLogoUrl = useCallback((logoPath: string | undefined) => {
    if (!logoPath) return '';
    if (logoPath.startsWith('http')) return logoPath; // Déjà une URL complète
    return `${apiUrl}${logoPath.startsWith('/') ? '' : '/'}${logoPath}`;
  }, [apiUrl]);
  
  // État pour la signature en cours d'édition (pour la prévisualisation)
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
    console.log('Données reçues du formulaire:', data);
    
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
      logoUrl: extractRelativePath(data.logoUrl), // Extraire le chemin relatif du logo
      showLogo: data.showLogo,
      isDefault: data.isDefault,
      // Ajouter les propriétés liées à la photo de profil
      profilePhotoUrl: extractRelativePath(data.profilePhotoUrl), // Extraire le chemin relatif de la photo
      profilePhotoBase64: data.profilePhotoBase64,
      profilePhotoToDelete: data.profilePhotoToDelete,
      profilePhotoSize: data.profilePhotoSize,
      // Ajouter les propriétés liées aux réseaux sociaux
      socialLinksDisplayMode: data.socialLinksDisplayMode,
      socialLinksIconStyle: data.socialLinksIconStyle,
      socialLinksIconBgColor: data.socialLinksIconBgColor,
      socialLinksIconColor: data.socialLinksIconColor,
      // Ajouter les propriétés liées à la police
      fontFamily: data.fontFamily,
      fontSize: data.fontSize,
      // Ajouter les propriétés liées à la disposition
      layout: data.layout,
      horizontalSpacing: data.horizontalSpacing
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
  // Utiliser useCallback avec un délai pour éviter les boucles infinies
  const handleFormChange = useCallback((data: Partial<EmailSignature>) => {
    // Utiliser une fonction de mise à jour pour éviter les problèmes de fermeture
    setFormData(prevData => {
      // Vérifier si les données ont réellement changé pour éviter les rendus inutiles
      if (JSON.stringify(prevData) === JSON.stringify(data)) {
        return prevData; // Retourner les données précédentes si aucun changement
      }
      
      // S'assurer que les URLs sont correctement préfixées
      const updatedData = { ...data };
      
      // Traiter l'URL du logo
      if (updatedData.logoUrl) {
        updatedData.logoUrl = getFullLogoUrl(updatedData.logoUrl);
      }
      
      // Traiter l'URL de la photo de profil
      if (updatedData.profilePhotoUrl && !updatedData.profilePhotoUrl.startsWith('data:')) {
        updatedData.profilePhotoUrl = getFullLogoUrl(updatedData.profilePhotoUrl);
      }
      
      console.log('Mise à jour des données de prévisualisation:', updatedData);
      return updatedData;
    });
  }, [getFullLogoUrl]);

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
          <div className="w-3/5 overflow-y-auto bg-gray-50 p-6">
            <h3 className="text-lg font-medium mb-4">Prévisualisation de la signature</h3>
            <div className="bg-white p-6 border rounded-md shadow-sm">
              <EmailSignaturePreview signature={formData} />
            </div>
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
