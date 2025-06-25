import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { UPDATE_COMPANY } from "../graphql";
import { CompanyInfo, CompanyInfoFormProps } from "../types";
import { useCompanyForm } from "../hooks";
import { Notification, FormActions, ImageUploader } from "../../../components";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
  // Initialisation de react-hook-form avec les valeurs par défaut
  const form = useForm<CompanyInfo>({
    mode: "onBlur",
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      website: initialData?.website || "",
      siret: initialData?.siret || "",
      vatNumber: initialData?.vatNumber || "",
      capitalSocial: initialData?.capitalSocial || "",
      rcs: initialData?.rcs || "",
      transactionCategory: (initialData?.transactionCategory as 'goods' | 'services' | 'mixed') || undefined,
      vatPaymentCondition: (initialData?.vatPaymentCondition as 'ENCAISSEMENTS' | 'DEBITS' | 'EXONERATION' | 'NONE') || 'NONE',
      companyStatus: (initialData?.companyStatus as 'SARL' | 'SAS' | 'EURL' | 'SASU' | 'EI' | 'EIRL' | 'SA' | 'SNC' | 'SCI' | 'SCOP' | 'ASSOCIATION' | 'AUTRE') || 'AUTRE',
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
    },
    resolver: undefined,
  });

  const { control, watch, setValue, trigger, formState: { errors }, handleSubmit } = form;

  // Observer les valeurs des champs nécessaires
  const companyStatus = watch('companyStatus');
  const bankDetails = watch('bankDetails');
  const { iban, bic, bankName } = bankDetails || {};

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
    uploadLoading,
    deleteLoading,
    handleLogoUpload,
    uploadLogoToServer,
    resetLogoState,
    deleteLogoFromServer,
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

  // Fonction de soumission du formulaire
  const onSubmit = async (data: CompanyInfo) => {
    try {
      // Vérifier si le logo a été modifié
      const logoToSave = base64Image ? base64Image : formData.logo;

      // Préparer les données à envoyer
      const companyData = {
        ...data,
        logo: logoToSave,
        // S'assurer que les champs optionnels vides sont bien envoyés comme null
        website: data.website || null,
        siret: data.siret || null,
        vatNumber: data.vatNumber || null,
        capitalSocial: data.capitalSocial || null,
        rcs: data.rcs || null,
        bankDetails: data.bankDetails.iban || data.bankDetails.bic || data.bankDetails.bankName
          ? {
              iban: data.bankDetails.iban || null,
              bic: data.bankDetails.bic || null,
              bankName: data.bankDetails.bankName || null,
            }
          : null,
      };

      // Appel de la mutation pour mettre à jour l'entreprise
      await updateCompany({
        variables: {
          input: companyData,
        },
      });

      // Mettre à jour les données du formulaire avec les données renvoyées par le serveur
      setFormData(companyData);

    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'entreprise:", error);
      Notification.error("Une erreur est survenue lors de la mise à jour de l'entreprise");
    }
  };

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

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2 flex flex-col items-start justify-center mb-6">
            <Label
              htmlFor="logo"
              className="text-sm font-medium mb-3 text-gray-700"
            >
              Logo de votre entreprise
            </Label>
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
              onDelete={async () => {
                if (formData.logo) {
                  try {
                    await deleteLogoFromServer();
                  } catch (error) {
                    console.error("Erreur lors de la suppression du logo:", error);
                    return; // Ne pas effacer le logo en cas d'erreur
                  }
                }
                setFormData(prev => ({ ...prev, logo: "" }));
              }}
              fileInputRef={fileInputRef}
              maxSizeMB={2}
              acceptedFileTypes="image/*"
              objectFit="adaptive"
              imageSize={128}
            />
          </div>
          <div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="companyStatus">
                  Statut juridique
                </Label>
                <div className="relative inline-block ml-1 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#5b50ff] cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="absolute left-0 bottom-full mb-2 w-64 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    Les champs obligatoires (marqués par *) varient selon le statut juridique sélectionné.
                  </div>
                </div>
              </div>
              <Select
                value={watch("companyStatus")}
                onValueChange={(value) => {
                  setValue("companyStatus", value);
                  trigger("companyStatus");
                  
                  // Déclencher la validation des champs qui dépendent du statut juridique
                  if (isFieldRequiredForCompanyStatus('siret', value)) {
                    trigger("siret");
                  }
                  if (isFieldRequiredForCompanyStatus('vatNumber', value)) {
                    trigger("vatNumber");
                  }
                  if (isFieldRequiredForCompanyStatus('capitalSocial', value)) {
                    trigger("capitalSocial");
                  }
                  if (isFieldRequiredForCompanyStatus('rcs', value)) {
                    trigger("rcs");
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un statut juridique" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SARL">SARL</SelectItem>
                  <SelectItem value="SAS">SAS</SelectItem>
                  <SelectItem value="EURL">EURL</SelectItem>
                  <SelectItem value="SASU">SASU</SelectItem>
                  <SelectItem value="EI">EI</SelectItem>
                  <SelectItem value="EIRL">EIRL</SelectItem>
                  <SelectItem value="SA">SA</SelectItem>
                  <SelectItem value="SNC">SNC</SelectItem>
                  <SelectItem value="SCI">SCI</SelectItem>
                  <SelectItem value="SCOP">SCOP</SelectItem>
                  <SelectItem value="ASSOCIATION">Association</SelectItem>
                  <SelectItem value="AUTO_ENTREPRENEUR">Auto-entrepreneur</SelectItem>
                  <SelectItem value="AUTRE">Autre</SelectItem>
                </SelectContent>
              </Select>
              {errors.companyStatus && (
                <p className="text-sm text-red-500 mt-1">{errors.companyStatus.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormField
              control={control}
              name="email"
              rules={getEmailValidationRules()}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contact@monentreprise.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={control}
              name="phone"
              rules={getPhoneValidationRules()}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+33 XXXXXXXXX ou 06XXXXXXXX"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-1">
                    Format: +33 suivi de 9 chiffres minimum ou 06/07 suivi de 8 chiffres
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <div className="space-y-2">
            <Label htmlFor="website">Site web</Label>
            <div className="flex">
              <FormField
                control={control}
                name="website"
                rules={getUrlValidationRules()}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-l-none"
                        placeholder="exemple.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="siret">
              Numéro SIRET {isFieldRequired('siret') && <span className="text-red-500">*</span>}
            </Label>
            <FormField
              control={control}
              name="siret"
              rules={isFieldRequired('siret') ? getSiretValidationRules() : {}}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="12345678901234"
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">14 chiffres sans espaces (ex: 12345678901234)</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vatNumber">
              Numéro de TVA intracommunautaire {isFieldRequired('vatNumber') && <span className="text-red-500">*</span>}
            </Label>
            <FormField
              control={control}
              name="vatNumber"
              rules={isFieldRequired('vatNumber') ? getVatValidationRules() : {}}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="FR12345678901"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capitalSocial">
              Capital social {isFieldRequired('capitalSocial') && <span className="text-red-500">*</span>}
            </Label>
            <FormField
              control={control}
              name="capitalSocial"
              rules={isFieldRequired('capitalSocial') ? getCapitalSocialValidationRules() : {}}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="10000.00"
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">Montant en euros (ex: 10000.00)</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rcs">
              Ville d'immatriculation RCS {isFieldRequired('rcs') && <span className="text-red-500">*</span>}
            </Label>
            <FormField
              control={control}
              name="rcs"
              rules={isFieldRequired('rcs') ? getRCSValidationRules() : {}}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="PARIS"
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">Ville du greffe d'immatriculation (ex: PARIS)</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="transactionCategory">
              Catégorie de transaction <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("transactionCategory")}
              onValueChange={(value) => setValue("transactionCategory", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="goods">Vente de biens</SelectItem>
                <SelectItem value="services">Prestation de services</SelectItem>
                <SelectItem value="mixed">Mixte (biens et services)</SelectItem>
              </SelectContent>
            </Select>
            {errors.transactionCategory && (
              <p className="text-sm text-red-500">{errors.transactionCategory.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <FormField
              control={control}
              name="vatPaymentCondition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Régime de TVA <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un régime de TVA" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NONE">Aucun</SelectItem>
                      <SelectItem value="ENCAISSEMENTS">Encaissements</SelectItem>
                      <SelectItem value="DEBITS">Débits</SelectItem>
                      <SelectItem value="EXONERATION">Exonération</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

          <div className="sm:col-span-2 space-y-2">
            <FormField
              control={control}
              name="address.street"
              rules={{ required: "La rue est requise" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Rue <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormField
              control={control}
              name="address.city"
              rules={{ required: "La ville est requise" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ville <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={control}
              name="address.postalCode"
              rules={{ required: "Le code postal est requis" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Code postal <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormField
              control={control}
              name="address.country"
              rules={{ required: "Le pays est requis" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Pays <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
          <div className="space-y-4 mb-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField
                  control={control}
                  name="bankDetails.iban"
                  rules={{
                    required: bankFieldsRequired
                      ? "L'IBAN est obligatoire lorsque des informations bancaires sont fournies"
                      : false,
                    validate: {
                      ibanFormat: (value: string) => {
                        return (
                          !value ||
                          IBAN_REGEX.test(value) ||
                          "L'IBAN doit être au format français valide (FR suivi de 25 caractères)"
                        );
                      },
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        IBAN {bankFieldsRequired && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">
                        Format FR de numéro de compte bancaire (ex: FR + 2 chiffres + 23 caractères)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={control}
                  name="bankDetails.bic"
                  rules={{
                    required: bankFieldsRequired
                      ? "Le BIC est obligatoire lorsque des informations bancaires sont fournies"
                      : false,
                    validate: {
                      bicFormat: (value: string) => {
                        return (
                          !value ||
                          BIC_REGEX.test(value) ||
                          "Le BIC doit être au format valide (8 ou 11 caractères)"
                        );
                      },
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        BIC/SWIFT {bankFieldsRequired && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">
                        Code d'identification bancaire international (ex: BNPAFRPPXXX)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={control}
                  name="bankDetails.bankName"
                  rules={{
                    required: bankFieldsRequired
                      ? "Le nom de la banque est obligatoire lorsque des informations bancaires sont fournies"
                      : false,
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nom de la banque {bankFieldsRequired && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-2 mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setValue("bankDetails.iban", "");
                    setValue("bankDetails.bic", "");
                    setValue("bankDetails.bankName", "");
                  }}
                  className="px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Réinitialiser les coordonnées bancaires
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t">
          <FormActions
            submitText={
              isUploading || uploadLoading || deleteLoading || updateLoading
                ? "Enregistrement en cours..."
                : "Enregistrer les modifications"
            }
            isSubmitting={
              isUploading || uploadLoading || deleteLoading || updateLoading
            }
            className="py-3"
          />
        </div>
      </form>
    </Form>
  );
};

export default CompanyInfoForm;
