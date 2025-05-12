import { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { UPDATE_PROFILE, UPLOAD_PROFILE_PICTURE, DELETE_PROFILE_PICTURE, GET_PROFILE } from '../graphql';
import { 
  Form, 
  TextField, 
  FormActions, 
  FieldGroup,
  ImageUploader,
  Button
} from '../../../components';
import { Notification } from '../../../components/feedback';
import { getNameValidationRules, getPhoneValidationRules } from '../../../utils/validators';
import { DisableAccountModal } from './DisableAccountModal';
import { CancelSubscriptionModal } from './CancelSubscriptionModal';
import { SubscriptionContext } from '../../../context/SubscriptionContext.context';
import axios from 'axios';

interface PersonalInfoFormProps {
  initialData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    profilePicture?: string;
  };
}

export const PersonalInfoForm = ({ initialData }: PersonalInfoFormProps) => {
  // État pour stocker l'image en base64
  const [profileImageBase64, setProfileImageBase64] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [pictureToDelete, setPictureToDelete] = useState(false);
  
  // État pour les modales
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [isCancelSubscriptionModalOpen, setIsCancelSubscriptionModalOpen] = useState(false);
  
  // Accéder au contexte d'abonnement
  const { subscription } = useContext(SubscriptionContext);
  
  // État local pour les données du formulaire
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    phone: initialData?.phone || '',
    profilePicture: initialData?.profilePicture || ''
  });
  
  const { 
    register, 
    handleSubmit: hookFormSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      phone: initialData?.phone || '',
    }
  });

  const [updateProfile, { loading: updateLoading }] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: GET_PROFILE }],
    onCompleted: () => {
      Notification.success('Profil mis à jour avec succès', {
        duration: 5000,
        position: 'bottom-left'
      });
      
      // Réinitialiser les états après la sauvegarde réussie si aucune autre mutation n'est en cours
      if (!updateLoading && !uploadLoading && !deleteLoading) {
        setPreviewImage(null);
        setProfileImageBase64(null);
        setPictureToDelete(false);
      }
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la mise à jour: ${error.message}`, {
        duration: 8000,
        position: 'bottom-left'
      });
    },
  });

  const [uploadProfilePicture, { loading: uploadLoading }] = useMutation(UPLOAD_PROFILE_PICTURE, {
    refetchQueries: [{ query: GET_PROFILE }],
    onCompleted: (data) => {
      // Mettre à jour l'état local avec la nouvelle URL de l'image
      const newProfilePicture = data.uploadProfilePicture.profile.profilePicture;
      setFormData(prev => ({
        ...prev,
        profilePicture: newProfilePicture
      }));
      
      // Pas de notification ici car elle est redondante avec celle de la mise à jour du profil
      
      // Réinitialiser les états après la sauvegarde réussie
      setPreviewImage(null);
      setProfileImageBase64(null);
      setPictureToDelete(false);
    },
    onError: (error) => {
      Notification.error(`Erreur lors de l'upload de la photo: ${error.message}`, {
        duration: 8000,
        position: 'bottom-left'
      });
    },
  });

  const [deleteProfilePicture, { loading: deleteLoading }] = useMutation(DELETE_PROFILE_PICTURE, {
    refetchQueries: [{ query: GET_PROFILE }],
    onCompleted: () => {
      // Mettre à jour l'état local
      setFormData(prev => ({
        ...prev,
        profilePicture: ''
      }));
      
      Notification.success('Photo de profil supprimée avec succès', {
        duration: 5000,
        position: 'bottom-left'
      });
      
      // Réinitialiser les états après la suppression réussie
      setPreviewImage(null);
      setProfileImageBase64(null);
      setPictureToDelete(false);
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la suppression de la photo: ${error.message}`, {
        duration: 8000,
        position: 'bottom-left'
      });
    },
  });

  // Gestion de la sélection d'un fichier image
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      Notification.error('Le fichier est trop volumineux. Taille maximale: 2MB', {
        duration: 5000,
        position: 'bottom-left'
      });
      return;
    }

    // Créer un objet FileReader pour lire le fichier
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewImage(base64String);
      setProfileImageBase64(base64String);
      setPictureToDelete(false);
    };
    reader.readAsDataURL(file);
  };

  // Gestion de la suppression de l'image
  const handleDeleteImage = () => {
    setPreviewImage(null);
    setProfileImageBase64(null);
    setPictureToDelete(true);
    
    // Mettre à jour l'état local immédiatement pour l'UI
    setFormData(prev => ({
      ...prev,
      profilePicture: ''
    }));
  };

  // Fonction pour gérer le clic sur le bouton de désactivation du compte
  const handleDisableAccountClick = () => {
    // Vérifier si l'utilisateur a un abonnement premium actif
    if (subscription?.licence) {
      setIsCancelSubscriptionModalOpen(true);
    } else {
      setIsDisableModalOpen(true);
    }
  };

  // Fonction pour gérer l'abonnement premium
  const handleSubscription = async () => {
    try {
      // Récupérer le token d'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token d\'authentification trouvé');
        return;
      }
      
      // Appeler l'endpoint pour créer une session de portail client
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-customer-portal-session`,
        {},
        {
          headers: {
            Authorization: token
          }
        }
      );
      
      // Rediriger vers l'URL de la session
      if (response.data.url) {
        window.open(response.data.url, '_blank');
        setIsCancelSubscriptionModalOpen(false);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la session de portail client:', error);
      Notification.error('Une erreur est survenue lors de la création de la session de portail client.', {
        duration: 5000,
        position: 'bottom-left'
      });
    }
  };

  const onSubmit = hookFormSubmit(async (data) => {
    try {
      // Mise à jour du profil (sans l'image)
      await updateProfile({
        variables: {
          input: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          },
        },
      });
      
      // Si une nouvelle image a été sélectionnée, l'uploader séparément
      if (profileImageBase64) {
        await uploadProfilePicture({
          variables: {
            base64Image: profileImageBase64,
          },
        });
      } 
      // Si l'image doit être supprimée explicitement
      else if (pictureToDelete) {
        await deleteProfilePicture();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  });

  return (
    <>
      <Form onSubmit={onSubmit}>
        <FieldGroup>
          <div className="flex justify-center mb-6">
            <ImageUploader
              imageUrl={formData.profilePicture || ''}
              apiBaseUrl={`${import.meta.env.VITE_API_URL}/`}
              previewImage={previewImage}
              isLoading={updateLoading || uploadLoading || deleteLoading}
              loadingMessage="Traitement de l'image en cours..."
              onFileSelect={handleFileSelect}
              onDelete={handleDeleteImage}
              // Ne pas passer fileInputRef pour éviter l'erreur de type
              maxSizeMB={2}
              acceptedFileTypes="image/*"
              helpText="Format recommandé : PNG ou JPG, max 2MB"
            />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              id="firstName"
              name="firstName"
              label="Prénom"
              register={register}
              validation={getNameValidationRules('Le prénom')}
              error={errors.firstName}
            />

            <TextField
              id="lastName"
              name="lastName"
              label="Nom"
              register={register}
              validation={getNameValidationRules('Le nom')}
              error={errors.lastName}
            />

            <TextField
              id="phone"
              name="phone"
              label="Téléphone"
              type="tel"
              register={register}
              validation={getPhoneValidationRules()}
              error={errors.phone}
              helpText="Format: +33 suivi de 9 chiffres minimum (ex: +33612345678) ou 06/07 suivi de 8 chiffres (ex: 0612345678)"
            />
          </div>
        </FieldGroup>

        <FormActions
          isSubmitting={updateLoading || uploadLoading || deleteLoading}
          submitText={(updateLoading || uploadLoading || deleteLoading) ? 'Enregistrement...' : 'Enregistrer'}
        />
      </Form>
      
      {/* Section pour la désactivation du compte */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Désactivation du compte</h3>
        <p className="text-sm text-gray-600 mb-4">
          La désactivation de votre compte rendra celui-ci inaccessible. Vous pourrez le réactiver ultérieurement en tentant de vous connecter avec vos identifiants habituels.
        </p>
        {subscription?.licence && (
          <p className="text-sm text-blue-600 mb-4">
            <strong>Note :</strong> Vous disposez d'un abonnement premium actif. Vous devez d'abord résilier votre abonnement avant de pouvoir désactiver votre compte.
          </p>
        )}
        <Button 
          variant="danger" 
          onClick={handleDisableAccountClick}
        >
          Désactiver mon compte
        </Button>
      </div>
      
      {/* Modal de désactivation du compte */}
      <DisableAccountModal 
        isOpen={isDisableModalOpen} 
        onClose={() => setIsDisableModalOpen(false)} 
      />

      {/* Modal d'information sur l'abonnement actif */}
      <CancelSubscriptionModal 
        isOpen={isCancelSubscriptionModalOpen} 
        onClose={() => setIsCancelSubscriptionModalOpen(false)}
        onManageSubscription={handleSubscription}
      />
    </>
  );
};
