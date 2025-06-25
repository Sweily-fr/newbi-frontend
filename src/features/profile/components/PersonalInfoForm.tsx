import { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { UPDATE_PROFILE, UPLOAD_PROFILE_PICTURE, DELETE_PROFILE_PICTURE, GET_PROFILE } from '../graphql';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUploader } from '@/components/common/ImageUploader';
import { Notification } from '@/components/common/Notification';
import { getNameValidationRules, getPhoneValidationRules } from '@/utils/validators';
import { DisableAccountModal } from './DisableAccountModal';
import { CancelSubscriptionModal } from './CancelSubscriptionModal';
import { SubscriptionContext } from '@/context/SubscriptionContext.context';
import axios from 'axios';

interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  phone: string;
}

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
  
  // État pour les modales
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [isCancelSubscriptionModalOpen, setIsCancelSubscriptionModalOpen] = useState(false);
  
  // Accéder au contexte d'abonnement
  const { subscription } = useContext(SubscriptionContext);
  
  // Initialisation de react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<PersonalInfoFormData>({
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      phone: initialData?.phone || ''
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
    onCompleted: () => {
      // Pas de notification ici car elle est redondante avec celle de la mise à jour du profil
      
      // Réinitialiser les états après la suppression réussie
      setPreviewImage(null);
      setProfileImageBase64(null);
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
      Notification.success('Photo de profil supprimée avec succès', {
        duration: 5000,
        position: 'bottom-left'
      });
      
      // Réinitialiser les états après la suppression réussie
      setPreviewImage(null);
      setProfileImageBase64(null);
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

  // Fonction pour gérer la suppression de l'image
  const handleDeleteImage = async () => {
    try {
      // Déclencher directement la suppression de l'image
      await deleteProfilePicture();
      // Réinitialiser les états
      setPreviewImage(null);
      setProfileImageBase64(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      Notification.error('Une erreur est survenue lors de la suppression de l\'image', {
        duration: 5000,
        position: 'bottom-left'
      });
    }
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

  const onSubmit = async (data: PersonalInfoFormData) => {
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
      // La suppression de l'image est maintenant gérée directement dans handleDeleteImage
    } catch (error: unknown) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className=" bg-card text-card-foreground">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Informations personnelles</h3>
          <p className="text-sm text-muted-foreground">Gérez vos informations personnelles et les paramètres de votre compte.</p>
        </div>
        <div className="p-6 pt-0 space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-start gap-4">
              <div className="relative">
                <ImageUploader
                  imageUrl={initialData?.profilePicture || ''}
                  apiBaseUrl={`${import.meta.env.VITE_API_URL}`}
                  previewImage={previewImage}
                  isLoading={updateLoading || uploadLoading || deleteLoading}
                  loadingMessage="Traitement de l'image en cours..."
                  onFileSelect={handleFileSelect}
                  onDelete={handleDeleteImage}
                  maxSizeMB={2}
                  acceptedFileTypes="image/*"
                  imageSize={96}
                  roundedStyle="full"
                  objectFit="cover"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input 
                  id="firstName" 
                  {...register('firstName', getNameValidationRules('Le prénom'))}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input 
                  id="lastName" 
                  {...register('lastName', getNameValidationRules('Le nom'))}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  type="tel"
                  {...register('phone', getPhoneValidationRules())}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                <p className="text-sm text-muted-foreground">
                  Format: +33 suivi de 9 chiffres minimum (ex: +33612345678) ou 06/07 suivi de 8 chiffres (ex: 0612345678)
                </p>
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={updateLoading || uploadLoading || deleteLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {(updateLoading || uploadLoading || deleteLoading) ? (
                  <span>Enregistrement...</span>
                ) : (
                  <span>Enregistrer les modifications</span>
                )}
              </Button>
            </div>
          </form>

          {/* Séparateur */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Zone de danger
              </span>
            </div>
          </div>

          {/* Zone de danger */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-destructive">Désactiver mon compte</h4>
              <p className="text-sm text-muted-foreground">
                La désactivation de votre compte le rendra inaccessible. Vous pourrez le réactiver ultérieurement en vous reconnectant.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleDisableAccountClick}
              className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
            >
              Désactiver mon compte
            </Button>
          </div>
        </div>
      </div>

      <DisableAccountModal
        isOpen={isDisableModalOpen}
        onClose={() => setIsDisableModalOpen(false)}
      />
      
      <CancelSubscriptionModal
        isOpen={isCancelSubscriptionModalOpen}
        onClose={() => setIsCancelSubscriptionModalOpen(false)}
        onManageSubscription={handleSubscription}
      />
    </div>
  );
};
