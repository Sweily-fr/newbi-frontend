import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  ClientFormData,
  ClientFormProps,
  ClientType,
} from "../../types";

// Interface pour les résultats de recherche d'entreprise
interface CompanySearchResult {
  id: string;
  name: string;
  siret: string;
  vatNumber: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}
import {
  Form,
  TextField,
  FieldGroup,
  FormActions,
  Button,
} from "../../../../components";
import Radio from "../../../../components/common/Radio";
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
} from "../../../../constants/formValidations";
import { Add } from "iconsax-react";
import Checkbox from "../../../../components/common/Checkbox";

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
  // En mode édition, on affiche directement le formulaire sans la recherche
  const [showManualEntry, setShowManualEntry] = useState(isEditMode);
  // État pour les résultats de recherche
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  // État pour indiquer si une recherche est en cours
  const [isSearching, setIsSearching] = useState(false);
  
  const { register, handleSubmit, watch, setValue, control, formState: { errors, isSubmitting } } = useForm<ClientFormData>({
    defaultValues: {
      ...initialData,
      type: initialData?.type || ClientType.COMPANY
    },
    mode: "onBlur", // Validate on blur for better user experience
  });
  
  // Fonction de soumission personnalisée pour gérer la validation conditionnelle
  const onFormSubmit = (data: ClientFormData) => {
    // Validation spécifique selon le type de client
    if (data.type === ClientType.INDIVIDUAL) {
      // Pour un particulier, vérifier que firstName et lastName sont remplis
      if (!data.firstName || !data.lastName) {
        // Afficher une erreur ou gérer l'erreur de validation
        return;
      }
      // Le champ name n'est pas pertinent pour un particulier, on peut le remplir avec firstName + lastName
      data.name = `${data.firstName} ${data.lastName}`;
      // Les champs spécifiques aux entreprises ne sont pas requis
      data.siret = data.siret || "";
      data.vatNumber = data.vatNumber || "";
    } else {
      // Pour une entreprise, vérifier que name et siret sont remplis
      if (!data.name || !data.siret) {
        // Afficher une erreur ou gérer l'erreur de validation
        return;
      }
      // Les champs spécifiques aux particuliers ne sont pas requis
      data.firstName = data.firstName || "";
      data.lastName = data.lastName || "";
    }
    
    // Appeler la fonction onSubmit fournie par le parent
    onSubmit(data);
  };
  
  // Observer les changements du type de client
  const watchedType = watch("type");
  
  // Mettre à jour l'état local quand le type change dans le formulaire
  useEffect(() => {
    if (watchedType) {
      setClientType(watchedType as ClientType);
      
      // Réinitialiser les champs spécifiques au type de client
      if (watchedType === ClientType.COMPANY) {
        setValue("firstName", "");
        setValue("lastName", "");
      } else if (watchedType === ClientType.INDIVIDUAL) {
        setValue("siret", "");
        setValue("vatNumber", "");
      }
    }
  }, [watchedType, setValue]);

  // Fonction pour gérer les changements dans le champ de recherche
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Réinitialiser les résultats si le champ est vidé
    if (e.target.value.trim() === "") {
      setSearchResults([]);
    }
  };
  
  // Fonction pour rechercher une entreprise
  const handleSearch = () => {
    if (searchTerm.trim().length < 3) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    // Utilisation de données mockées pour simuler la recherche
    setTimeout(() => {
      try {
        // Création de résultats de recherche basés sur le terme de recherche
        const mockData = [
          { 
            id: "12345678901234", 
            name: "Newbi SAS", 
            siret: "12345678901234", 
            vatNumber: "FR12345678901",
            address: {
              street: "1 rue de la Paix",
              city: "Paris",
              postalCode: "75001",
              country: "France"
            }
          },
          { 
            id: "98765432109876", 
            name: "Tech Solutions", 
            siret: "98765432109876", 
            vatNumber: "FR98765432109",
            address: {
              street: "25 avenue des Champs-Élysées",
              city: "Paris",
              postalCode: "75008",
              country: "France"
            }
          },
          { 
            id: "45678912345678", 
            name: "Digital Consulting", 
            siret: "45678912345678", 
            vatNumber: "FR45678912345",
            address: {
              street: "42 boulevard Haussmann",
              city: "Paris",
              postalCode: "75009",
              country: "France"
            }
          },
          { 
            id: "78912345678912", 
            name: "Web Factory", 
            siret: "78912345678912", 
            vatNumber: "FR78912345678",
            address: {
              street: "8 rue de Rivoli",
              city: "Paris",
              postalCode: "75004",
              country: "France"
            }
          },
          { 
            id: "23456789123456", 
            name: "Data Intelligence", 
            siret: "23456789123456", 
            vatNumber: "FR23456789123",
            address: {
              street: "15 rue du Faubourg Saint-Honoré",
              city: "Paris",
              postalCode: "75008",
              country: "France"
            }
          },
          { 
            id: "56789123456789", 
            name: "Sweily", 
            siret: "56789123456789", 
            vatNumber: "FR56789123456",
            address: {
              street: "10 rue de la Victoire",
              city: "Paris",
              postalCode: "75009",
              country: "France"
            }
          }
        ];
        
        // Filtrer les résultats en fonction du terme de recherche
        const results = mockData.filter(company => 
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.siret.includes(searchTerm)
        );
        
        setSearchResults(results);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500); // Délai pour simuler la recherche
  };
  
  // Fonction pour sélectionner une entreprise des résultats
  const selectCompany = (company: CompanySearchResult) => {
    // Si le type de client est une entreprise, on remplit le champ name
    // Sinon, pour un particulier, on essaie de décomposer le nom en prénom et nom
    if (clientType === ClientType.COMPANY) {
      setValue("name", company.name);
      setValue("siret", company.siret);
      setValue("vatNumber", company.vatNumber);
    } else if (clientType === ClientType.INDIVIDUAL) {
      // Pour un particulier, on essaie de décomposer le nom
      const nameParts = company.name.split(' ');
      if (nameParts.length >= 2) {
        // Prénom = premier mot, Nom = reste
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        setValue("firstName", firstName);
        setValue("lastName", lastName);
      } else {
        // Si on ne peut pas décomposer, on met tout dans le nom de famille
        setValue("firstName", "");
        setValue("lastName", company.name);
      }
    }
    
    // Remplir les champs d'adresse si disponibles
    if (company.address) {
      if (company.address.street) setValue("address.street", company.address.street);
      if (company.address.city) setValue("address.city", company.address.city);
      if (company.address.postalCode) setValue("address.postalCode", company.address.postalCode);
      if (company.address.country) setValue("address.country", company.address.country);
    }
    
    setShowManualEntry(true);
    setSearchResults([]);
  };

  return (
    <Form onSubmit={handleSubmit(onFormSubmit)} id={id} className="space-y-8 mx-auto px-4">
      {/* Section de sélection du type de client */}
      <div className="mb-8 p-6 bg-[#f0eeff] rounded-2xl shadow-sm border border-[#e6e1ff]">
        <h3 className="text-lg font-medium text-gray-900 mb-4 text-left">Type de client</h3>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="mt-2 flex space-x-6">
              <Radio
                id="company-type"
                name="type"
                value={ClientType.COMPANY}
                label="Entreprise"
                checked={field.value === ClientType.COMPANY}
                onChange={() => {
                  field.onChange(ClientType.COMPANY);
                  setClientType(ClientType.COMPANY);
                }}
                className="text-[#5b50ff] focus:ring-[#4a41e0]"
              />
              <Radio
                id="individual-type"
                name="type"
                value={ClientType.INDIVIDUAL}
                label="Particulier"
                checked={field.value === ClientType.INDIVIDUAL}
                onChange={() => {
                  field.onChange(ClientType.INDIVIDUAL);
                  setClientType(ClientType.INDIVIDUAL);
                }}
                className="text-[#5b50ff] focus:ring-[#4a41e0]"
              />
            </div>
          )}
        />
      </div>
      
      {/* Recherche d'entreprises - Uniquement pour les entreprises et en mode création */}
      {clientType === ClientType.COMPANY && !showManualEntry && (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder="Rechercher une entreprise par nom ou SIRET"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent"
            />
            <Button
              type="button"
              variant="primary"
              disabled={searchTerm.length < 3 || isSearching}
              onClick={handleSearch}
              className="whitespace-nowrap bg-[#5b50ff] hover:bg-[#4a41e0] text-white rounded-2xl px-4 py-2"
            >
              {isSearching ? "Recherche..." : "Rechercher"}
            </Button>
          </div>
          
          {/* Résultats de recherche */}
          {searchResults.length > 0 && (
            <div className="mt-4 mb-4 bg-white rounded-lg shadow-sm border border-[#e6e1ff] overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {searchResults.map((company) => (
                  <li key={company.id} className="p-4 hover:bg-[#f0eeff] cursor-pointer" onClick={() => selectCompany(company)}>
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{company.name}</p>
                        <p className="text-sm text-gray-500">SIRET: {company.siret}</p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        className="text-xs text-[#5b50ff] bg-[#f0eeff] hover:bg-[#e6e1ff] rounded-lg px-3 py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectCompany(company);
                        }}
                      >
                        Sélectionner
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {searchTerm.length >= 3 && searchResults.length === 0 && !isSearching && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
              Aucune entreprise trouvée. Veuillez essayer avec un autre terme ou créer une nouvelle entreprise.
            </div>
          )}
          
          <div className="flex justify-center pt-8">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowManualEntry(true)}
              className="text-sm text-[#5b50ff] bg-[#f0eeff] hover:bg-[#e6e1ff] rounded-2xl px-4 py-2"
            >
              <Add size={20} color="#5b50ff" variant="Linear" className="mr-2" />
              Saisie manuelle
            </Button>
          </div>
        </div>
      )}

      {(showManualEntry || clientType === ClientType.INDIVIDUAL) && (
        <>
          {clientType === ClientType.COMPANY && showManualEntry && (
            <div className="flex justify-end mb-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowManualEntry(false)}
                className="text-sm text-[#5b50ff] bg-[#f0eeff] hover:bg-[#e6e1ff] rounded-2xl px-4 py-2"
              >
                Retour à la recherche
              </Button>
            </div>
          )}
          <FieldGroup title="Informations générales" spacing="normal" className="bg-white p-6 rounded-2xl shadow-sm border border-[#e6e1ff]">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 mb-8">
              {clientType === ClientType.INDIVIDUAL ? (
                <>
                  <TextField
                    id="firstName"
                    label="Prénom"
                    name="firstName"
                    placeholder="Ex: Jean"
                    register={register}
                    error={errors.firstName}
                    required
                    validation={{
                      required: "Le prénom est requis pour un particulier",
                      pattern: {
                        value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{2,50}$/,
                        message: "Le prénom doit contenir entre 2 et 50 caractères et ne peut contenir que des lettres, espaces, tirets ou apostrophes",
                      },
                    }}
                  />
                  
                  <TextField
                    id="lastName"
                    label="Nom"
                    name="lastName"
                    placeholder="Ex: Dupont"
                    register={register}
                    error={errors.lastName}
                    required
                    validation={{
                      required: "Le nom est requis pour un particulier",
                      pattern: {
                        value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{2,50}$/,
                        message: "Le nom doit contenir entre 2 et 50 caractères et ne peut contenir que des lettres, espaces, tirets ou apostrophes",
                      },
                    }}
                  />
                </>
              ) : (
                <TextField
                  id="name"
                  label="Nom de l'entreprise"
                  name="name"
                  placeholder="Ex: Newbi SAS"
                  register={register}
                  error={errors.name}
                  required={clientType === ClientType.COMPANY}
                  validation={{
                    required: clientType === ClientType.COMPANY ? "Le nom de l'entreprise est requis" : false,
                  }}
                  className="sm:col-span-2"
                />
              )}

              <TextField
                id="email"
                label="Email"
                name="email"
                placeholder="Ex: contact@exemple.com"
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
                className={clientType === ClientType.INDIVIDUAL ? "" : "sm:col-span-2"}
              />
            </div>

            {clientType === ClientType.COMPANY && (
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 mb-8">
                <TextField
                  id="siret"
                  label="SIRET"
                  name="siret"
                  placeholder="Ex: 12345678901234"
                  register={register}
                  error={errors.siret}
                  required={clientType === ClientType.COMPANY}
                  validation={{
                    required: clientType === ClientType.COMPANY ? "Le SIRET est requis pour une entreprise" : false,
                    pattern: {
                      value: SIRET_PATTERN,
                      message: SIRET_ERROR_MESSAGE,
                    },
                  }}
                />

                <TextField
                  id="vatNumber"
                  label="Numéro de TVA"
                  name="vatNumber"
                  placeholder="Ex: FR12345678901"
                  register={register}
                  error={errors.vatNumber}
                  validation={{
                    pattern: {
                      value: VAT_PATTERN,
                      message: VAT_ERROR_MESSAGE,
                    },
                  }}
                />
              </div>
            )}

            <div className="mb-8">
              <TextField
                id="street"
                label="Rue"
                name="address.street"
                placeholder="Ex: 1 rue de la Paix"
                register={register}
                error={errors.address?.street}
                required
                className="w-full"
                validation={{
                  required: "La rue est requise",
                  pattern: {
                    value: STREET_PATTERN,
                    message: STREET_ERROR_MESSAGE,
                  },
                }}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 mb-8">
              <TextField
                id="city"
                label="Ville"
                name="address.city"
                placeholder="Ex: Paris"
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

            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 mb-8">
              <TextField
                id="postalCode"
                label="Code postal"
                name="address.postalCode"
                placeholder="Ex: 75001"
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
                placeholder="Ex: France"
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
          
          <div className="mt-8 mb-6">
            <Controller
              name="hasDifferentShippingAddress"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="hasDifferentShippingAddress"
                  name="hasDifferentShippingAddress"
                  label="Adresse de livraison différente"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  error={errors.hasDifferentShippingAddress}
                />
              )}
            />
          </div>

          {watch("hasDifferentShippingAddress") && (
            <FieldGroup title="Adresse de livraison" spacing="normal" className="mt-6 p-6 bg-[#f0eeff] rounded-lg shadow-sm border border-[#e6e1ff]">
              <div className="mb-8">
                <TextField
                  id="shipping-street"
                  label="Rue"
                  name="shippingAddress.street"
                  placeholder="Ex: 1 rue de la Paix"
                  register={register}
                  error={errors.shippingAddress?.street}
                  required
                  className="w-full"
                  validation={{
                    required: "La rue est requise",
                    pattern: {
                      value: STREET_PATTERN,
                      message: STREET_ERROR_MESSAGE,
                    },
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 mb-8">
                <TextField
                  id="shipping-city"
                  label="Ville"
                  name="shippingAddress.city"
                  placeholder="Ex: Paris"
                  register={register}
                  error={errors.shippingAddress?.city}
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

              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 mb-8">
                <TextField
                  id="shipping-postalCode"
                  label="Code postal"
                  name="shippingAddress.postalCode"
                  placeholder="Ex: 75001"
                  register={register}
                  error={errors.shippingAddress?.postalCode}
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
                  id="shipping-country"
                  label="Pays"
                  name="shippingAddress.country"
                  placeholder="Ex: France"
                  register={register}
                  error={errors.shippingAddress?.country}
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
          )}
        </>
      )}

      {showManualEntry && onCancel && (
        <div className="flex justify-end space-x-6 mt-10">
          <FormActions
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            align="right"
            className="mt-2"
          />
        </div>
      )}
    </Form>
  );
};
