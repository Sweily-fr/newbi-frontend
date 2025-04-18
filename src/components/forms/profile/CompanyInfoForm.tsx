import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { UPDATE_COMPANY } from '../../../graphql/profile';
import { CompanyInfoFormProps } from '../../../types/company';
import { useCompanyForm } from '../../../hooks';
import { Notification } from '../../../components/feedback';
import { 
  Form, 
  TextField, 
  TextFieldURL,
  Button, 
  FieldGroup,
  FormActions,
  ImageUploader
} from '../../../components/ui';
import { 
  getNameValidationRules, 
  getPhoneValidationRules, 
  getEmailValidationRules,
  getSiretValidationRules,
  getVatValidationRules,
  getUrlValidationRules,
  getIbanValidationRules,
  getBicValidationRules,
  IBAN_REGEX,
  BIC_REGEX
} from '../../../utils/validators';

export const CompanyInfoForm = ({ initialData }: CompanyInfoFormProps) => {
  // Utiliser react-hook-form
  const { 
    register, 
    handleSubmit: hookFormSubmit, 
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      website: initialData?.website || '',
      siret: initialData?.siret || '',
      vatNumber: initialData?.vatNumber || '',
      street: initialData?.address?.street || '',
      city: initialData?.address?.city || '',
      postalCode: initialData?.address?.postalCode || '',
      country: initialData?.address?.country || '',
      iban: initialData?.bankDetails?.iban || '',
      bic: initialData?.bankDetails?.bic || '',
      bankName: initialData?.bankDetails?.bankName || '',
    }
  });

  // Observer les valeurs des champs bancaires
  const iban = watch('iban');
  const bic = watch('bic');
  const bankName = watch('bankName');

  // Vérifier si au moins un des champs bancaires est rempli
  const anyBankFieldFilled = Boolean(iban || bic || bankName);
  
  // Vérifier si tous les champs bancaires sont remplis
  const allBankFieldsFilled = Boolean(iban && bic && bankName);
  
  // Si au moins un champ est rempli mais pas tous, alors tous sont requis
  const bankFieldsRequired = anyBankFieldFilled;

  // Utiliser le hook personnalisé pour gérer le logo
  const {
    fileInputRef,
    previewImage,
    base64Image,
    isUploading,
    logoToDelete,
    uploadLoading,
    deleteLoading,
    setLogoToDelete,
    handleLogoUpload,
    uploadLogoToServer,
    deleteLogoFromServer,
    resetLogoState
  } = useCompanyForm({
    initialLogo: initialData?.logo || '',
    onLogoChange: (logoUrl) => {
      setFormData(prev => ({
        ...prev,
        logo: logoUrl
      }));
    }
  });

  // Récupérer l'URL de l'API à partir des variables d'environnement ou utiliser une valeur par défaut
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    website: initialData?.website || '',
    logo: initialData?.logo || '',
    siret: initialData?.siret || '',
    vatNumber: initialData?.vatNumber || '',
    address: {
      street: initialData?.address?.street || '',
      city: initialData?.address?.city || '',
      postalCode: initialData?.address?.postalCode || '',
      country: initialData?.address?.country || '',
    },
    bankDetails: {
      iban: initialData?.bankDetails?.iban || '',
      bic: initialData?.bankDetails?.bic || '',
      bankName: initialData?.bankDetails?.bankName || '',
    },
  });

  const [updateCompany, { loading: updateLoading }] = useMutation(UPDATE_COMPANY, {
    onCompleted: () => {
      Notification.success('Informations de l\'entreprise mises à jour avec succès', {
        duration: 5000,
        position: 'bottom-left'
      });
      // Réinitialiser l'image base64 après la sauvegarde
      resetLogoState();
    },
    onError: (error) => {
      // L'erreur est déjà affichée par le toaster dans App.tsx
      console.error("Erreur lors de la mise à jour de l'entreprise:", error);
    },
  });

  const onSubmit = hookFormSubmit(async (data) => {
    // Si le logo doit être supprimé
    if (logoToDelete) {
      console.log('Suppression du logo demandée');
      const deleted = await deleteLogoFromServer(false); // Ne pas afficher les notifications ici
      if (deleted) {
        console.log('Logo supprimé avec succès');
        // Continuer avec la mise à jour du reste des informations
      }
    }

    // Vérifier si tous les champs bancaires sont vides
    const allBankFieldsEmpty = !data.iban && !data.bic && !data.bankName;

    // Préparer les données du formulaire
    const formattedData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      website: data.website,
      logo: formData.logo, // Utiliser le logo du state
      siret: data.siret,
      vatNumber: data.vatNumber,
      address: {
        street: data.street,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
      },
      // Si tous les champs bancaires sont vides, envoyer des valeurs vides
      // Sinon, envoyer les valeurs saisies
      bankDetails: allBankFieldsEmpty ? {
        iban: '',
        bic: '',
        bankName: '',
      } : {
        iban: data.iban,
        bic: data.bic,
        bankName: data.bankName,
      },
    };

    // Si une nouvelle image a été sélectionnée mais pas encore uploadée
    if (base64Image) {
      const newLogoUrl = await uploadLogoToServer(false); // Ne pas afficher les notifications ici
      if (newLogoUrl) {
        // Mettre à jour le formulaire avec le nouveau logo
        formattedData.logo = newLogoUrl;
      }
    }

    // Soumettre le formulaire
    await updateCompany({
      variables: {
        input: formattedData,
      },
    });
  });

  return (
    <Form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
            Logo
          </label>
          <ImageUploader
            imageUrl={formData.logo}
            apiBaseUrl={apiUrl}
            previewImage={previewImage}
            isLoading={isUploading || uploadLoading || deleteLoading}
            loadingMessage={isUploading ? "Téléchargement en cours..." : "Enregistrement en cours..."}
            onFileSelect={handleLogoUpload}
            onDelete={() => {
              if (formData.logo) {
                console.log('Marquage du logo pour suppression:', formData.logo);
                // Si un logo existe en BDD, marquer pour suppression
                setLogoToDelete(true);
              }
              setFormData({ ...formData, logo: '' });
              // Ne pas réinitialiser logoToDelete ici
            }}
            fileInputRef={fileInputRef}
            maxSizeMB={2}
            acceptedFileTypes="image/*"
            objectFit='adaptive'
            imageSize={128}
          />
        </div>

        <div className="sm:col-span-2">
          <TextField
            id="companyName"
            name="name"
            label="Nom de l'entreprise"
            register={register}
            validation={getNameValidationRules("Le nom de l'entreprise")}
            error={errors.name}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <TextField
            id="email"
            name="email"
            label="Email"
            type="email"
            register={register}
            validation={getEmailValidationRules()}
            error={errors.email}
            required
          />
        </div>

        <div>
          <TextField
            id="phone"
            name="phone"
            label="Téléphone"
            type="tel"
            register={register}
            validation={getPhoneValidationRules()}
            error={errors.phone}
            helpText="Format: +33 suivi de 9 chiffres minimum ou 06/07 suivi de 8 chiffres"
          />
        </div>

        <div>
          <TextFieldURL
            id="website"
            name="website"
            label="Site web"
            register={register}
            validation={getUrlValidationRules()}
            error={errors.website}
            placeholder="exemple.com"
          />
        </div>

        <div>
          <TextField
            id="siret"
            name="siret"
            label="Numéro SIRET"
            register={register}
            validation={getSiretValidationRules()}
            error={errors.siret}
            required
          />
        </div>

        <div>
          <TextField
            id="vatNumber"
            name="vatNumber"
            label="Numéro de TVA"
            register={register}
            validation={getVatValidationRules()}
            error={errors.vatNumber}
          />
        </div>

        <div className="sm:col-span-2">
          <TextField
            id="street"
            name="street"
            label="Rue"
            register={register}
            error={errors.street}
            required
          />
        </div>

        <div>
          <TextField
            id="city"
            name="city"
            label="Ville"
            register={register}
            error={errors.city}
            required
          />
        </div>

        <div>
          <TextField
            id="postalCode"
            name="postalCode"
            label="Code postal"
            register={register}
            error={errors.postalCode}
            required
          />
        </div>

        <div>
          <TextField
            id="country"
            name="country"
            label="Pays"
            register={register}
            error={errors.country}
            required
          />
        </div>

        <div className="sm:col-span-2 mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Coordonnées bancaires</h3>
          <p className="text-sm text-gray-500 mb-4">
            Note: Les coordonnées bancaires sont optionnelles. Vous pouvez soit laisser tous les champs vides, soit tous les remplir. Si vous remplissez un des champs bancaires, tous les champs deviennent obligatoires.
          </p>
          <FieldGroup title="Coordonnées bancaires" className="mb-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextField
                  id="iban"
                  name="iban"
                  label="IBAN"
                  register={register}
                  error={errors.iban}
                  helpText="Format FR de numéro de compte bancaire (ex: FR + 2 chiffres + 23 caractères)"
                  validation={{
                    required: bankFieldsRequired ? 'L\'IBAN est obligatoire lorsque des informations bancaires sont fournies' : false,
                    validate: {
                      ibanFormat: (value) => {
                        // Ne valider le format que si une valeur est présente
                        return !value || IBAN_REGEX.test(value) || 'L\'IBAN doit être au format français valide (FR suivi de 25 caractères)';
                      }
                    }
                  }}
                />
              </div>

              <div>
                <TextField
                  id="bic"
                  name="bic"
                  label="BIC/SWIFT"
                  register={register}
                  error={errors.bic}
                  helpText="Code d'identification bancaire international (ex: BNPAFRPPXXX)"
                  validation={{
                    required: bankFieldsRequired ? 'Le BIC est obligatoire lorsque des informations bancaires sont fournies' : false,
                    validate: {
                      bicFormat: (value) => {
                        // Ne valider le format que si une valeur est présente
                        return !value || BIC_REGEX.test(value) || 'Le BIC doit être au format valide (8 ou 11 caractères)';
                      }
                    }
                  }}
                />
              </div>

              <div>
                <TextField
                  id="bankName"
                  name="bankName"
                  label="Nom de la banque"
                  register={register}
                  error={errors.bankName}
                  validation={{
                    required: bankFieldsRequired ? 'Le nom de la banque est obligatoire lorsque des informations bancaires sont fournies' : false
                  }}
                />
              </div>
            </div>
            <div className="sm:col-span-2 mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setValue('iban', '');
                  setValue('bic', '');
                  setValue('bankName', '');
                }}
                className="px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Réinitialiser les coordonnées bancaires
              </button>
            </div>
          </FieldGroup>
        </div>
      </div>

      <FormActions
        submitText={isUploading || uploadLoading || deleteLoading ? 'Enregistrement...' : 'Enregistrer'}
        isSubmitting={isUploading || uploadLoading || deleteLoading || updateLoading}
      />
    </Form>
  );
};
