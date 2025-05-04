import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  ClientFormData,
  ClientFormProps,
  ClientType,
} from "../../../types/client";
import {
  Form,
  TextField,
  FieldGroup,
  FormActions,
  Select,
  Button,
} from "../../../components/ui";
import useCompanySearch, {
  CompanySearchResult,
  CompanyNameResult,
} from "../../../hooks/useCompanySearch";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import {
  EMAIL_PATTERN,
  SIRET_PATTERN,
  VAT_PATTERN,
  STREET_PATTERN,
  CITY_PATTERN,
  POSTAL_CODE_PATTERN,
  COUNTRY_PATTERN,
  EMAIL_ERROR_MESSAGE,
  SIRET_ERROR_MESSAGE,
  VAT_ERROR_MESSAGE,
  STREET_ERROR_MESSAGE,
  CITY_ERROR_MESSAGE,
  POSTAL_CODE_ERROR_MESSAGE,
  COUNTRY_ERROR_MESSAGE,
} from "../../../constants/formValidations";

export const ClientForm: React.FC<ClientFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  id,
}) => {
  // Définir le type de client par défaut (COMPANY si non spécifié)
  const [clientType, setClientType] = useState<ClientType>(
    initialData?.type || ClientType.COMPANY
  );

  // Déterminer si nous sommes en mode édition (initialData présent)
  const isEditMode = !!initialData;

  // État pour la recherche d'entreprises
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  // En mode édition, on affiche directement le formulaire sans la recherche
  const [showManualEntry, setShowManualEntry] = useState(isEditMode);
  
  // Hook personnalisé pour la recherche d'entreprises
  const { 
    isLoading, 
    isRetrying,
    errorMessage,
    companyData, 
    companiesList, 
    searchCompany, 
    retryLastSearch,
    resetSearch
  } = useCompanySearch();
  
  const { register, handleSubmit, watch, setValue, control, formState: { errors, isSubmitting } } = useForm<ClientFormData>({
    defaultValues: {
      ...initialData,
      type: initialData?.type || ClientType.COMPANY
    },
    mode: "onBlur", // Validate on blur for better user experience
  });
  
  // Observer les changements du type de client
  const watchedType = watch("type");
  
  // Mettre à jour l'état local quand le type change dans le formulaire
  useEffect(() => {
    if (watchedType) {
      setClientType(watchedType as ClientType);
    }
  }, [watchedType]);

  // Fonction pour remplir le formulaire avec les données de l'entreprise trouvée
  const fillFormWithCompanyData = (company: CompanySearchResult) => {
    // Initialiser les valeurs avec les données de l'API
    let streetValue = company.address.street;
    let postalCodeValue = company.address.postalCode;
    let cityValue = company.address.city;
    
    // Format observé: "229 rue saint-honore 75001 Paris"
    // Extraire le code postal (5 chiffres) et la ville qui suit
    const postalCityMatch = streetValue.match(/(.*?)\s+(\d{5})\s+([^,]+)$/);
    
    if (postalCityMatch) {
      // Extraire les composants de l'adresse
      streetValue = postalCityMatch[1].trim(); // La rue sans le code postal et la ville
      postalCodeValue = postalCityMatch[2].trim(); // Le code postal (5 chiffres)
      cityValue = postalCityMatch[3].trim(); // La ville
    } else {
      // Si le format principal n'est pas détecté, essayer d'autres formats
      // Format alternatif: "Rue, Code Postal Ville"
      const altFormatMatch = streetValue.match(/^(.+),\s*(\d{5})\s+(.+)$/);
      
      if (altFormatMatch) {
        streetValue = altFormatMatch[1].trim();
        postalCodeValue = altFormatMatch[2].trim();
        cityValue = altFormatMatch[3].trim();
      } else if (/^\d{5}$/.test(cityValue)) {
        // Si le champ city contient un code postal, essayer de trouver la ville dans l'adresse
        postalCodeValue = cityValue; // Utiliser le code postal du champ city
        
        // Chercher dans la chaîne d'adresse un format "XXXXX Ville"
        const cityInAddressMatch = streetValue.match(/\b(\d{5})\s+([^,\d]+)\b/);
        if (cityInAddressMatch) {
          cityValue = cityInAddressMatch[2].trim(); // La ville après le code postal
          // Enlever le code postal et la ville de l'adresse
          streetValue = streetValue.replace(cityInAddressMatch[0], '').trim();
        }
      }
    }
    
    // Mettre à jour les champs du formulaire avec les valeurs extraites
    setValue("name", company.name);
    setValue("siret", company.siret);
    setValue("vatNumber", company.vatNumber || "");
    setValue("address.street", streetValue);
    setValue("address.city", cityValue);
    setValue("address.postalCode", postalCodeValue);
    setValue("address.country", company.address.country);
    
    // Réinitialiser l'interface utilisateur
    resetSearch();
    setSearchTerm("");
    setShowResults(false);
    setShowManualEntry(true); // Afficher le formulaire pour compléter les informations
  };

  // Fonction pour rechercher une entreprise
  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchCompany(searchTerm.trim());
      setShowResults(true);
    }
  };

  // Fonction pour gérer les changements dans le champ de recherche
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Si l'utilisateur efface le champ, on cache les résultats
    if (!e.target.value.trim()) {
      setShowResults(false);
      resetSearch();
    }
  };

  // Fonction pour sélectionner une entreprise à partir des résultats de recherche
  const handleSelectCompany = (company: CompanyNameResult) => {
    // Rechercher les détails complets de l'entreprise par SIRET
    searchCompany(company.siret);
    setShowResults(false);
  };

  return (
    <Form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      spacing="loose"
      className="px-4"
    >
      {/* Recherche d'entreprises - Uniquement pour les entreprises et en mode création */}
      {clientType === ClientType.COMPANY && (
        <>
          {!showManualEntry && !isEditMode ? (
            <FieldGroup spacing="normal">
              <div className="mb-6 relative">
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <div className="flex-grow">
                      <TextField
                        id="companySearch"
                        name="companySearch"
                        label="Rechercher une entreprise (SIRET, SIREN ou nom)"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        helpText="Entrez un SIRET (14 chiffres), un SIREN (9 chiffres) ou un nom d'entreprise (min. 3 caractères)"
                        placeholder="Nom de l'entreprise, N°SIREN, N°SIRET..."
                      />
                    </div>
                    <div className="self-end mb-[46px]">
                      <Button
                        onClick={handleSearch}
                        disabled={
                          isLoading ||
                          !searchTerm.trim() ||
                          searchTerm.length < 3
                        }
                        variant="secondary"
                        size="md"
                      >
                        {isLoading
                          ? isRetrying
                            ? "Nouvel essai..."
                            : "Recherche..."
                          : "Rechercher"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Dropdown des résultats de recherche - positionné en dehors du champ de recherche */}
                {showResults && companiesList.length > 0 && (
                  <div className="relative mt-4">
                    <div className="z-40 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                      <ul className="divide-y divide-gray-200">
                        {companiesList.map((company, index) => (
                          <li
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer rounded-md flex justify-between items-center"
                            onClick={() => handleSelectCompany(company)}
                          >
                            <div className="flex-1 mr-2 overflow-hidden">
                              <p className="font-medium text-sm truncate">
                                {company.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                SIRET: {company.siret} | SIREN: {company.siren}
                              </p>
                            </div>
                            <Button size="sm" variant="secondary">
                              Sélectionner
                            </Button>
                          </li>
                        ))}
                      </ul>
                      <div className="p-2 border-t border-gray-200">
                        <Button
                          onClick={() => setShowResults(false)}
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Fermer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Résultat de recherche par SIRET - positionné en dehors du champ de recherche */}
                {companyData && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium">
                          {companyData.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          SIRET: {companyData.siret}
                        </p>
                        <p className="text-xs text-gray-500">
                          Adresse: {companyData.address.street},{" "}
                          {companyData.address.postalCode}{" "}
                          {companyData.address.city}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            fillFormWithCompanyData(companyData);
                            setShowManualEntry(true);
                          }}
                          variant="primary"
                          size="sm"
                        >
                          Utiliser ces données
                        </Button>
                        <Button
                          onClick={resetSearch}
                          variant="secondary"
                          size="sm"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Espace supplémentaire pour augmenter la hauteur de la modal */}
                {!showResults && !companyData && (
                  <div className="py-8 my-6">
                    <div className="text-center text-gray-400 italic">
                      <p>
                        Utilisez la recherche ci-dessus pour trouver une
                        entreprise
                      </p>
                      <p className="text-sm mt-1">
                        Les informations seront automatiquement remplies
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowManualEntry(true);
                      resetSearch();
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
                  >
                    <PlusCircleIcon className="h-4 w-4 mr-1" />
                    Ajouter une entreprise manuellement
                  </button>
                </div>

                {/* Affichage des erreurs de connexion */}
                {errorMessage && (
                  <div className="mt-4 bg-red-50 p-4 rounded-md border border-red-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Erreur de connexion
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>
                            Impossible de se connecter au service de recherche
                            d'entreprises.
                          </p>
                        </div>
                        <div className="mt-3 flex space-x-3">
                          <Button
                            onClick={retryLastSearch}
                            variant="secondary"
                            size="sm"
                          >
                            Réessayer
                          </Button>
                          <Button
                            onClick={() => setShowManualEntry(true)}
                            variant="primary"
                            size="sm"
                          >
                            Saisie manuelle
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FieldGroup>
          ) : (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {isEditMode ? "Informations du client" : "Saisie manuelle des informations"}
                </h3>
                {!isEditMode && (
                  <Button
                    onClick={() => setShowManualEntry(false)}
                    variant="secondary"
                    size="sm"
                  >
                    Revenir à la recherche
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {showManualEntry && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  id="client-type"
                  name="type"
                  label="Type de client"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    resetSearch();
                  }}
                  options={[
                    { value: ClientType.COMPANY, label: "Entreprise" },
                    { value: ClientType.INDIVIDUAL, label: "Particulier" },
                  ]}
                  required
                />
              )}
            />

            <TextField
              id="name"
              label="Nom"
              name="name"
              register={register}
              error={errors.name}
              required
              validation={{
                required: "Le nom est requis",
                pattern: {
                  value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{2,50}$/,
                  message:
                    "Le nom doit contenir entre 2 et 50 caractères et ne peut contenir que des lettres, espaces, tirets ou apostrophes",
                },
              }}
            />
          </div>

          {clientType === ClientType.INDIVIDUAL && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
              <TextField
                id="firstName"
                label="Prénom"
                name="firstName"
                register={register}
                error={errors.firstName}
                validation={{
                  pattern: {
                    value: /^[a-zA-ZÀ-ÿ\s-]{1,50}$/,
                    message: "Prénom invalide",
                  },
                }}
              />
              <TextField
                id="lastName"
                label="Nom de famille"
                name="lastName"
                register={register}
                error={errors.lastName}
                validation={{
                  pattern: {
                    value: /^[a-zA-ZÀ-ÿ\s-]{1,50}$/,
                    message: "Nom de famille invalide",
                  },
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
            <TextField
              id="email"
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              required
              validation={{
                required: "L'email est requis",
                pattern: {
                  value: EMAIL_PATTERN,
                  message: EMAIL_ERROR_MESSAGE,
                },
              }}
            />

            <TextField
              id="siret"
              label="SIRET"
              name="siret"
              register={register}
              error={errors.siret}
              helpText="Format attendu : 14 chiffres"
              validation={{
                pattern: {
                  value: SIRET_PATTERN,
                  message: SIRET_ERROR_MESSAGE,
                },
              }}
            />
          </div>

          <div className="mb-4">
            <TextField
              id="vatNumber"
              label="Numéro de TVA"
              name="vatNumber"
              register={register}
              error={errors.vatNumber}
              helpText="Format attendu : FR suivi de 11 chiffres"
              validation={{
                pattern: {
                  value: VAT_PATTERN,
                  message: VAT_ERROR_MESSAGE,
                },
              }}
            />
          </div>

          <FieldGroup title="Adresse" spacing="normal">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
              <TextField
                id="street"
                label="Rue"
                name="address.street"
                register={register}
                error={errors.address?.street}
                required
                validation={{
                  required: "La rue est requise",
                  pattern: {
                    value: STREET_PATTERN,
                    message: STREET_ERROR_MESSAGE,
                  },
                }}
              />

              <TextField
                id="city"
                label="Ville"
                name="address.city"
                register={register}
                error={errors.address?.city}
                required
                validation={{
                  required: "La ville est requise",
                  pattern: {
                    value: CITY_PATTERN,
                    message: CITY_ERROR_MESSAGE,
                  },
                }}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
              <TextField
                id="postalCode"
                label="Code postal"
                name="address.postalCode"
                register={register}
                error={errors.address?.postalCode}
                required
                validation={{
                  required: "Le code postal est requis",
                  pattern: {
                    value: POSTAL_CODE_PATTERN,
                    message: POSTAL_CODE_ERROR_MESSAGE,
                  },
                }}
              />

              <TextField
                id="country"
                label="Pays"
                name="address.country"
                register={register}
                error={errors.address?.country}
                required
                validation={{
                  required: "Le pays est requis",
                  pattern: {
                    value: COUNTRY_PATTERN,
                    message: COUNTRY_ERROR_MESSAGE,
                  },
                }}
              />
            </div>
          </FieldGroup>
        </>
      )}

      {showManualEntry && onCancel && (
        <div className="flex justify-end space-x-4 mt-4">
          <FormActions
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            align="right"
          />
        </div>
      )}
    </Form>
  );
};
