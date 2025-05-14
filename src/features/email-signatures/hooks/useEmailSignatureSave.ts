import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { Notification } from '../../../components/common/Notification';
import { CREATE_EMAIL_SIGNATURE, UPDATE_EMAIL_SIGNATURE } from '../graphql/mutations';
import { EmailSignature } from '../types';

/**
 * Hook pour gérer l'enregistrement des signatures de mail
 */
export const useEmailSignatureSave = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mutation pour créer une signature
  const [createEmailSignature] = useMutation(CREATE_EMAIL_SIGNATURE, {
    onCompleted: (data) => {
      Notification.success(`La signature "${data.createEmailSignature.name}" a été créée avec succès.`);
      setIsSubmitting(false);
      setError(null);
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la création de la signature: ${error.message}`);
      setIsSubmitting(false);
      setError(error.message);
    },
    refetchQueries: ['GetEmailSignatures']
  });

  // Mutation pour mettre à jour une signature
  const [updateEmailSignature] = useMutation(UPDATE_EMAIL_SIGNATURE, {
    onCompleted: (data) => {
      Notification.success(`La signature "${data.updateEmailSignature.name}" a été mise à jour avec succès.`);
      setIsSubmitting(false);
      setError(null);
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la mise à jour de la signature: ${error.message}`);
      setIsSubmitting(false);
      setError(error.message);
    },
    refetchQueries: ['GetEmailSignatures']
  });

  /**
   * Fonction pour nettoyer les données avant de les envoyer au serveur
   * @param data Les données de la signature à nettoyer
   * @returns Les données nettoyées
   */
  const cleanSignatureData = (data: Partial<EmailSignature>) => {
    // Fonction pour extraire le chemin relatif d'une URL
    const extractRelativePath = (url: string | undefined): string | undefined => {
      if (!url) return undefined;
      if (url.startsWith('data:')) return url; // Base64, ne pas modifier
      
      // Si l'URL contient l'URL de base de l'API, l'extraire
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
      if (url.startsWith(apiUrl)) {
        return url.replace(apiUrl, '').replace(/^\/+/, ''); // Supprimer l'URL de base et les slashes au début
      }
      
      // Si c'est déjà un chemin relatif ou une autre URL, la retourner telle quelle
      return url;
    };
    
    // Nettoyer les données avant de les envoyer au serveur
    return {
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
      templateId: data.templateId,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      logoUrl: extractRelativePath(data.logoUrl), // Extraire le chemin relatif du logo
      showLogo: data.showLogo,
      isDefault: data.isDefault,
      // Ajouter les propriétés liées à la photo de profil
      profilePhotoUrl: extractRelativePath(data.profilePhotoUrl), // Extraire le chemin relatif de la photo
      profilePhotoBase64: data.profilePhotoBase64,
      profilePhotoSize: data.profilePhotoSize,
      // Ajouter les propriétés liées aux réseaux sociaux
      socialLinksDisplayMode: data.socialLinksDisplayMode,
      socialLinksIconStyle: data.socialLinksIconStyle,
      socialLinksPosition: data.socialLinksPosition,
      // Ajouter les propriétés liées à la police
      fontFamily: data.fontFamily,
      fontSize: data.fontSize,
      // Ajouter les propriétés liées à la disposition
      layout: data.layout,
      horizontalSpacing: data.horizontalSpacing,
      verticalSpacing: data.verticalSpacing,
      verticalAlignment: data.verticalAlignment,
      imagesLayout: data.imagesLayout
    };
  };

  /**
   * Fonction pour sauvegarder une signature
   * @param signature Les données de la signature à sauvegarder
   * @param onSuccess Callback appelé en cas de succès
   */
  const saveEmailSignature = async (
    signature: Partial<EmailSignature>,
    onSuccess?: () => void
  ) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const cleanedData = cleanSignatureData(signature);
      
      if (signature.id) {
        // Mise à jour d'une signature existante
        await updateEmailSignature({
          variables: {
            id: signature.id,
            input: cleanedData
          }
        });
      } else {
        // Création d'une nouvelle signature
        await createEmailSignature({
          variables: {
            input: cleanedData
          }
        });
      }
      
      // Appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la signature:', error);
      setError('Une erreur est survenue lors de la sauvegarde de la signature');
      setIsSubmitting(false);
    }
  };

  return {
    saveEmailSignature,
    isSubmitting,
    error
  };
};
