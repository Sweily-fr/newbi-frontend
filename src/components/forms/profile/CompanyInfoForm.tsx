import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { UPDATE_COMPANY } from "../../../graphql/profile";
import { CompanyInfoFormProps } from "../../../types/company";
import { useCompanyForm } from "../../../hooks";
import { Notification } from "../../../components/feedback";
import {
  Form,
  TextField,
  TextFieldURL,
  FieldGroup,
  FormActions,
  ImageUploader,
  Select,
} from "../../";
import {
  getNameValidationRules,
  getPhoneValidationRules,
  getEmailValidationRules,
  getSiretValidationRules,
  getVatValidationRules,
  getUrlValidationRules,
  getCapitalSocialValidationRules,
  getRCSValidationRules,
  IBAN_REGEX,
  BIC_REGEX,
  isFieldRequiredForCompanyStatus,
} from "../../../utils/validators";

export const CompanyInfoForm = ({ initialData }: CompanyInfoFormProps) => {

  // Le log nous permet de vérifier si la valeur est bien récupérée du backend
  // Utiliser react-hook-form
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    mode: "onBlur", // Validation à la perte de focus
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      website: initialData?.website || "",
      siret: initialData?.siret || "",
      vatNumber: initialData?.vatNumber || "",
      capitalSocial: initialData?.capitalSocial || "",
      rcs: initialData?.rcs || "",
      transactionCategory: initialData?.transactionCategory || "",
      vatPaymentCondition: initialData?.vatPaymentCondition || "NONE",
      companyStatus: initialData?.companyStatus || "AUTRE",
      street: initialData?.address?.street || "",
      city: initialData?.address?.city || "",
      postalCode: initialData?.address?.postalCode || "",
      country: initialData?.address?.country || "",
      iban: initialData?.bankDetails?.iban || "",
      bic: initialData?.bankDetails?.bic || "",
      bankName: initialData?.bankDetails?.bankName || "",
    },
  });

  // Observer les valeurs des champs bancaires
  const iban = watch("iban");
  const bic = watch("bic");
  const bankName = watch("bankName");

  // Observer le statut juridique pour les validations conditionnelles
  const companyStatus = watch("companyStatus");

  // Fonction pour déterminer si un champ est obligatoire en fonction du statut juridique
  const isFieldRequired = (fieldName: string): boolean => {
    return isFieldRequiredForCompanyStatus(fieldName, companyStatus);
  };

  // Utiliser useEffect pour s'assurer que la valeur du statut d'entreprise est correctement initialisée
  useEffect(() => {
    // Force la mise à jour de la valeur du select, même si la valeur par défaut est déjà définie
    // Cela garantit que le select affiche la bonne valeur, même si react-hook-form a déjà une valeur par défaut
    if (initialData?.companyStatus) {
      setValue("companyStatus", initialData.companyStatus);
    } else {
      // Si aucun statut n'est défini, utiliser 'AUTRE' comme valeur par défaut
      setValue("companyStatus", "AUTRE");
    }
  }, [initialData, setValue]);

  // Vérifier si au moins un des champs bancaires est rempli
  const anyBankFieldFilled = Boolean(iban || bic || bankName);

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
    resetLogoState,
  } = useCompanyForm({
    initialLogo: initialData?.logo || "",
    onLogoChange: (logoUrl) => {
      setFormData((prev) => ({
        ...prev,
        logo: logoUrl,
      }));
    },
  });

  // Récupérer l'URL de l'API à partir des variables d'environnement ou utiliser une valeur par défaut
  const apiUrl = import.meta.env.VITE_API_URL + '/' || "http://localhost:4000";

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "",
    logo: initialData?.logo || "",
    siret: initialData?.siret || "",
    vatNumber: initialData?.vatNumber || "",
    transactionCategory: initialData?.transactionCategory || "",
    vatPaymentCondition: initialData?.vatPaymentCondition || "NONE",
    companyStatus: initialData?.companyStatus || "AUTRE",
    address: {
      street: initialData?.address?.street || "",
      city: initialData?.address?.city || "",
      postalCode: initialData?.address?.postalCode || "",
      country: initialData?.address?.country || "",
    },
    bankDetails: {
      iban: initialData?.bankDetails?.iban || "",
      bic: initialData?.bankDetails?.bic || "",
      bankName: initialData?.bankDetails?.bankName || "",
    },
  });

  const [updateCompany, { loading: updateLoading }] = useMutation(
    UPDATE_COMPANY,
    {
      onCompleted: () => {
        Notification.success(
          "Informations de l'entreprise mises à jour avec succès",
          {
            duration: 5000,
            position: "bottom-left",
          }
        );
        // Réinitialiser l'image base64 après la sauvegarde
        resetLogoState();
      },
      onError: (error) => {
        // L'erreur est déjà affichée par le toaster dans App.tsx
        console.error("Erreur lors de la mise à jour de l'entreprise:", error);
      },
    }
  );

  const onSubmit = hookFormSubmit(async (data) => {
    // Si le logo doit être supprimé
    // if (logoToDelete) {
    //   const deleted = await deleteLogoFromServer(false); // Ne pas afficher les notifications ici
    //   if (deleted) {
    //     console.log("Logo supprimé avec succès");
    //     // Continuer avec la mise à jour du reste des informations
    //   }
    // }

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
      capitalSocial: data.capitalSocial,
      rcs: data.rcs,
      transactionCategory: data.transactionCategory,
      vatPaymentCondition: data.vatPaymentCondition,
      companyStatus: data.companyStatus,
      address: {
        street: data.street,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
      },
      // Si tous les champs bancaires sont vides, envoyer des valeurs vides
      // Sinon, envoyer les valeurs saisies
      bankDetails: allBankFieldsEmpty
        ? {
            iban: "",
            bic: "",
            bankName: "",
          }
        : {
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
        <div className="sm:col-span-2 flex flex-col items-center justify-center mb-6">
          <label
            htmlFor="logo"
            className="text-sm font-medium mb-3 text-gray-700"
          >
            Logo de votre entreprise
          </label>
          <ImageUploader
            imageUrl={formData.logo}
            apiBaseUrl={apiUrl}
            previewImage={previewImage}
            isLoading={isUploading || uploadLoading || deleteLoading}
            loadingMessage={
              isUploading
                ? "Téléchargement en cours..."
                : "Enregistrement en cours..."
            }
            onFileSelect={handleLogoUpload}
            onDelete={() => {
              if (formData.logo) {
                // Si un logo existe en BDD, marquer pour suppression
                setLogoToDelete(true);
              }
              setFormData({ ...formData, logo: "" });
              // Ne pas réinitialiser logoToDelete ici
            }}
            fileInputRef={fileInputRef}
            maxSizeMB={2}
            acceptedFileTypes="image/*"
            objectFit="adaptive"
            imageSize={128}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:col-span-2">
          <div className="sm:col-span-2">
            <TextField
              id="name"
              name="name"
              label="Nom de l'entreprise"
              register={register}
              error={errors.name}
              validation={getNameValidationRules("Le nom de l'entreprise")}
              required
            />
          </div>
          <div>
            <Select
              id="companyStatus"
              name="companyStatus"
              label={
                <div className="flex items-center">
                  Statut juridique
                  <div className="relative inline-block ml-1 group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#5b50ff] cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute left-0 bottom-full mb-2 w-64 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                      Les champs obligatoires (marqués par *) varient selon le statut juridique sélectionné.
                    </div>
                  </div>
                </div>
              }
              register={register}
              error={errors.companyStatus}
              onChange={(e) => {
                // Mise à jour du statut juridique
                setValue("companyStatus", e.target.value);
                
                // Déclencher la validation des champs qui dépendent du statut juridique
                if (isFieldRequiredForCompanyStatus('siret', e.target.value)) {
                  trigger("siret");
                }
                if (isFieldRequiredForCompanyStatus('vatNumber', e.target.value)) {
                  trigger("vatNumber");
                }
                if (isFieldRequiredForCompanyStatus('capitalSocial', e.target.value)) {
                  trigger("capitalSocial");
                }
                if (isFieldRequiredForCompanyStatus('rcs', e.target.value)) {
                  trigger("rcs");
                }
              }}
              options={[
                { value: "SARL", label: "SARL" },
                { value: "SAS", label: "SAS" },
                { value: "EURL", label: "EURL" },
                { value: "SASU", label: "SASU" },
                { value: "EI", label: "EI" },
                { value: "EIRL", label: "EIRL" },
                { value: "SA", label: "SA" },
                { value: "SNC", label: "SNC" },
                { value: "SCI", label: "SCI" },
                { value: "SCOP", label: "SCOP" },
                { value: "ASSOCIATION", label: "Association" },
                { value: "AUTO_ENTREPRENEUR", label: "Auto-entrepreneur" },
                { value: "AUTRE", label: "Autre" },
              ]}
            />
          </div>
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
            error={errors.siret}
            required={isFieldRequired('siret')}
            helpText="14 chiffres sans espaces (ex: 12345678901234)"
            validation={{
              ...getSiretValidationRules(),
              required: isFieldRequired('siret') 
                ? "Le numéro SIRET est obligatoire pour ce statut juridique" 
                : false
            }}
          />
        </div>

        <div>
          <TextField
            id="vatNumber"
            name="vatNumber"
            label="Numéro de TVA"
            register={register}
            error={errors.vatNumber}
            required={isFieldRequired('vatNumber')}
            helpText="Format FR + 11 chiffres (ex: FR12345678901)"
            validation={{
              ...getVatValidationRules(),
              required: isFieldRequired('vatNumber') 
                ? "Le numéro de TVA est obligatoire pour ce statut juridique" 
                : false
            }}
          />
        </div>

        <div>
          <TextField
            id="capitalSocial"
            name="capitalSocial"
            label="Capital social"
            register={register}
            error={errors.capitalSocial}
            required={isFieldRequired('capitalSocial')}
            helpText="Montant sans symbole € (ex: 10000)"
            validation={{
              ...getCapitalSocialValidationRules(),
              required: isFieldRequired('capitalSocial') 
                ? "Le capital social est obligatoire pour ce statut juridique" 
                : false
            }}
          />
        </div>

        <div>
          <TextField
            id="rcs"
            name="rcs"
            label="RCS"
            register={register}
            error={errors.rcs}
            required={isFieldRequired('rcs')}
            helpText="Registre du Commerce et des Sociétés (ex: Paris B 123 456 789)"
            validation={{
              ...getRCSValidationRules(),
              required: isFieldRequired('rcs') 
                ? "Le RCS est obligatoire pour ce statut juridique" 
                : false
            }}
          />
        </div>

        <div>
          <Select
            id="transactionCategory"
            name="transactionCategory"
            label="Catégorie de transaction"
            register={register}
            error={errors.transactionCategory}
            required
            options={[
              { value: "GOODS", label: "Livraison de biens" },
              { value: "SERVICES", label: "Prestations de services" },
              { value: "MIXED", label: "Opérations mixtes" },
            ]}
          />
        </div>

        <div>
          <Select
            id="vatPaymentCondition"
            name="vatPaymentCondition"
            label="Régime de TVA"
            register={register}
            error={errors.vatPaymentCondition}
            options={[
              { value: "NONE", label: "Aucun" },
              { value: "ENCAISSEMENTS", label: "Encaissements" },
              { value: "DEBITS", label: "Débits" },
              { value: "EXONERATION", label: "Exonération" }
            ]}
            validation={{
              required: "Veuillez sélectionner un régime de TVA"
            }}  
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Coordonnées bancaires
          </h3>
          <div className="bg-[#f0eeff] p-3 rounded-md border border-[#e6e1ff] mb-4">
            <p className="text-sm text-gray-600">
              <span className="text-[#5b50ff] font-medium">
                Note:
              </span>{" "}
              Les coordonnées bancaires sont optionnelles. Vous pouvez soit
              laisser tous les champs vides, soit tous les remplir. Si vous
              remplissez un des champs bancaires, tous les champs deviennent
              obligatoires.
            </p>
          </div>
          <FieldGroup className="mb-4">
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
                    required: bankFieldsRequired
                      ? "L'IBAN est obligatoire lorsque des informations bancaires sont fournies"
                      : false,
                    validate: {
                      ibanFormat: (value) => {
                        // Ne valider le format que si une valeur est présente
                        return (
                          !value ||
                          IBAN_REGEX.test(value) ||
                          "L'IBAN doit être au format français valide (FR suivi de 25 caractères)"
                        );
                      },
                    },
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
                    required: bankFieldsRequired
                      ? "Le BIC est obligatoire lorsque des informations bancaires sont fournies"
                      : false,
                    validate: {
                      bicFormat: (value) => {
                        // Ne valider le format que si une valeur est présente
                        return (
                          !value ||
                          BIC_REGEX.test(value) ||
                          "Le BIC doit être au format valide (8 ou 11 caractères)"
                        );
                      },
                    },
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
                    required: bankFieldsRequired
                      ? "Le nom de la banque est obligatoire lorsque des informations bancaires sont fournies"
                      : false,
                  }}
                />
              </div>
            </div>
            <div className="sm:col-span-2 mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setValue("iban", "");
                  setValue("bic", "");
                  setValue("bankName", "");
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
        submitText={
          isUploading || uploadLoading || deleteLoading
            ? "Enregistrement..."
            : "Enregistrer mes informations"
        }
        isSubmitting={
          isUploading || uploadLoading || deleteLoading || updateLoading
        }
      />
    </Form>
  );
};
