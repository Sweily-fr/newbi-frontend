import React, { useState, useEffect, useRef } from 'react';
import { Client } from '../../../../types';
import { ClientType } from '../../../../types/client';
import { TabNavigation } from '../../../navigation';
import { Select, TextField, FieldGroup, Button } from '../../../ui';
import useCompanySearch, { CompanySearchResult, CompanyNameResult } from '../../../../hooks/useCompanySearch';
import { PlusCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  EMAIL_PATTERN,
  SIRET_PATTERN,
  VAT_PATTERN,
  STREET_PATTERN,
  CITY_PATTERN,
  POSTAL_CODE_PATTERN,
  COUNTRY_PATTERN,
  SIRET_ERROR_MESSAGE,
  VAT_ERROR_MESSAGE,
  STREET_ERROR_MESSAGE,
  CITY_ERROR_MESSAGE,
  POSTAL_CODE_ERROR_MESSAGE,
  COUNTRY_ERROR_MESSAGE
} from '../../../../constants/formValidations';

interface ClientSelectionProps {
  isNewClient: boolean;
  setIsNewClient: (isNew: boolean) => void;
  selectedClient: string;
  setSelectedClient: (clientId: string) => void;
  newClient: {
    name: string;
    email: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
    siret: string;
    vatNumber: string;
    type: ClientType;
    firstName?: string;
    lastName?: string;
  };
  setNewClient: (client: Partial<{
    name: string;
    email: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
    siret: string;
    vatNumber: string;
    type: ClientType;
    firstName?: string;
    lastName?: string;
  }>) => void;
  clientsData?: { clients: { items: Client[], totalItems: number, currentPage: number, totalPages: number } };
  invoice?: {
    client?: {
      id: string;
      name: string;
      email: string;
    };
    [key: string]: any;
  };
  selectedClientData?: Client | null;
}

export const ClientSelection: React.FC<ClientSelectionProps> = ({
  isNewClient,
  setIsNewClient,
  selectedClient,
  setSelectedClient,
  newClient,
  setNewClient,
  clientsData,
  invoice,
  selectedClientData
}) => {
  // Référence pour suivre si le composant a été monté
  const isMounted = useRef(false);
  
  // État pour gérer les erreurs de validation
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // États pour la recherche d'entreprise
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  
  // Hook personnalisé pour la recherche d'entreprises
  const { 
    isLoading, 
    errorMessage,
    companyData, 
    companiesList, 
    searchCompany, 
    resetSearch
  } = useCompanySearch();
  
  // Fonction pour remplir le formulaire avec les données de l'entreprise trouvée
  const fillFormWithCompanyData = React.useCallback((company: CompanySearchResult) => {
    setNewClient({
      ...newClient,
      name: company.name,
      siret: company.siret,
      vatNumber: company.vatNumber || "",
      street: company.address.street,
      city: company.address.city,
      postalCode: company.address.postalCode,
      country: company.address.country,
      type: ClientType.COMPANY // S'assurer que le type est bien défini comme entreprise
    });
    resetSearch();
    setSearchTerm("");
    setShowResults(false);
    setShowManualEntry(true); // Afficher le formulaire pour compléter les informations
  }, [newClient, resetSearch, setNewClient, setSearchTerm, setShowResults, setShowManualEntry]);

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
    // Définir explicitement le type comme entreprise avant de rechercher les détails
    setNewClient({
      ...newClient,
      type: ClientType.COMPANY
    });
    
    // Rechercher les détails complets de l'entreprise par SIRET
    searchCompany(company.siret);
    setShowResults(false);
  };
  
  // Initialiser le type de client par défaut si non défini
  useEffect(() => {
    if (isNewClient) {
      // Vérifier si le type est défini et valide
      if (!newClient.type || newClient.type === '' as unknown as ClientType || 
          (newClient.type !== ClientType.COMPANY && newClient.type !== ClientType.INDIVIDUAL)) {
        setNewClient({
          ...newClient,
          type: ClientType.COMPANY // Valeur par défaut: entreprise
        });
      }
    }
    
    // Réinitialiser l'affichage du formulaire manuel quand on change de type
    if (newClient.type === ClientType.INDIVIDUAL) {
      setShowManualEntry(true);
    } else {
      // Pour les entreprises, on garde l'état actuel
      // Le formulaire ne s'affiche que si showManualEntry est true
    }
  }, [isNewClient, newClient, setNewClient]);
  
  // Effet pour remplir le formulaire quand les données de l'entreprise sont disponibles
  useEffect(() => {
    if (companyData) {
      fillFormWithCompanyData(companyData);
    }
  }, [companyData, fillFormWithCompanyData]);
  
  // Effet qui s'exécute au montage ET lorsque invoice ou selectedClientData change
  useEffect(() => {    
    console.log('Effet déclenché - État actuel:', {
      'invoice': invoice,
      'invoice?.client?.id': invoice?.client?.id,
      'invoice?.client?.name': invoice?.client?.name,
      'selectedClient': selectedClient,
      'selectedClientData': selectedClientData,
      'isNewClient': isNewClient,
      'isMounted': isMounted.current
    });
    
    if (!isNewClient) {
      // Si on modifie une facture existante (avec un client) et qu'aucun client n'est sélectionné
      if (invoice?.client?.id && !selectedClient) {
        // Initialiser le client de la facture
        console.log('Initialisation - Facture existante avec client:', {
          'invoice.client.id': invoice.client.id,
          'invoice.client.name': invoice.client.name
        });
        setSelectedClient(invoice.client.id);
      }
      // Si on a un client sélectionné et que les données de ce client sont disponibles
      else if (selectedClient && selectedClientData) {
        // Conserver le client sélectionné manuellement
        console.log('Initialisation - Client déjà sélectionné avec données:', {
          'selectedClient': selectedClient,
          'selectedClientData.name': selectedClientData.name
        });
      } 
      // Si on a un client sélectionné mais pas de données (peut-être en cours de chargement)
      else if (selectedClient) {
        console.log('Initialisation - Client sélectionné mais données non disponibles:', selectedClient);
      } 
      // Aucun client sélectionné
      else {
        console.log('Initialisation - Nouvelle facture sans client sélectionné');
      }
      // Ne rien faire d'autre - laisser le client non sélectionné pour une nouvelle facture
    }
    
    // Marquer le composant comme monté
    isMounted.current = true;
    
    return () => {
      // Nettoyer lors du démontage
      isMounted.current = false;
    };
  }, [invoice, selectedClient, selectedClientData, isNewClient, setSelectedClient]); // Exécuter l'effet lorsque invoice, selectedClient, selectedClientData ou isNewClient change
  
  // Effet pour réagir aux changements de données après le montage initial
  useEffect(() => {
    // Ne pas exécuter lors du montage initial
    if (!isMounted.current) return;
    
    // Si on est en mode "client existant"
    if (!isNewClient) {
      // Si on a une facture avec un client et qu'aucun client n'est sélectionné
      if (invoice?.client?.id && !selectedClient) {
        console.log('Mise à jour - Initialisation du client de la facture:', {
          'invoice.client.id': invoice.client.id,
          'invoice.client.name': invoice.client.name
        });
        setSelectedClient(invoice.client.id);
      }
      // Pour une nouvelle facture, ne pas sélectionner automatiquement de client
      // sauf si l'utilisateur en a déjà sélectionné un
    }
  }, [invoice, isNewClient, selectedClient, setSelectedClient]); // Dépendances minimales
  
  // Effet pour initialiser le client lors du premier chargement d'une facture existante
  useEffect(() => {
    // Seulement au premier chargement ou changement de facture
    if (invoice?.client?.id && !isNewClient && !selectedClient) {
      console.log('Initialisation du client pour une facture existante:', {
        'invoice.client.id': invoice.client.id,
        'invoice.client.name': invoice.client.name
      });
      setSelectedClient(invoice.client.id);
    }
    
    // Initialiser showManualEntry en fonction du type de client
    if (isNewClient) {
      setShowManualEntry(newClient.type === ClientType.INDIVIDUAL);
    }
  }, [invoice, isNewClient, selectedClient, setSelectedClient, newClient.type]);
  
  // Générer les options de clients
  const clientOptions = React.useMemo(() => {
    // Commencer avec une liste vide
    const options = [];
    
    // Si on a une facture avec un client, s'assurer qu'il est toujours inclus en premier
    if (invoice?.client?.id) {
      
      // Ajouter le client de la facture en premier
      options.push({
        value: invoice.client.id,
        label: `${invoice.client.name} (${invoice.client.email})`
      });
      
      // Initialiser le client seulement si aucun client n'est sélectionné
      if (!isNewClient && !selectedClient && invoice.client?.id) {
        console.log('Initialisation du client de la facture:', invoice.client.id);
        // Mettre à jour selectedClient de manière asynchrone pour éviter les problèmes de rendu
        setTimeout(() => setSelectedClient(invoice.client.id), 0);
      }
    }
    
    // Si on a des clients dans les données
    if (clientsData?.clients?.items) {
      // Ajouter tous les clients sauf celui de la facture (déjà ajouté)
      clientsData.clients.items.forEach((client: Client) => {
        // Ne pas ajouter le client de la facture (déjà ajouté plus haut)
        if (client.id !== invoice?.client?.id) {
          options.push({
            value: client.id,
            label: `${client.name} (${client.email})`
          });
        }
      });
    }
    
    // Vérifier si le client sélectionné est présent dans les options
    if (selectedClient && !options.some(option => option.value === selectedClient)) {      
      // Si le client sélectionné n'est pas dans les options mais que nous avons les données de la facture,
      // ajouter le client de la facture aux options
      if (invoice?.client?.id && invoice.client.id === selectedClient) {
        options.push({
          value: invoice.client.id,
          label: `${invoice.client.name} (${invoice.client.email})`
        });
      }
      // Si le client sélectionné n'est toujours pas dans les options, chercher dans clientsData
      else if (clientsData?.clients?.items) {
        const client = clientsData.clients.items.find(c => c.id === selectedClient);
        if (client) {
          options.push({
            value: client.id,
            label: `${client.name} (${client.email})`
          });
        }
      }
    }
    
    return options;
  }, [clientsData, invoice, selectedClient, isNewClient, setSelectedClient]);
  
  // Commentaires sur le fonctionnement :
  // 1. Si on modifie une facture existante, le client de cette facture est automatiquement sélectionné
  // 2. Si aucun client n'est sélectionné mais qu'il y a des options disponibles, on sélectionne le premier
  // 3. Le composant Select utilise la valeur contrôlée (value) plutôt que defaultValue

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center space-x-4">
        <label className="block text-sm font-medium text-gray-700">
          Client
        </label>
        <TabNavigation
          tabs={[
            { id: 'existing', label: 'Client existant' },
            { id: 'new', label: 'Nouveau client' }
          ]}
          activeTab={isNewClient ? 'new' : 'existing'}
          variant="simple-tabs"
          onTabChange={(tabId) => {   
            // Éviter les mises à jour inutiles si l'état ne change pas
            const newIsNewClient = tabId === 'new';
            if (newIsNewClient === isNewClient) {
              return;
            }
            
            // Mettre à jour l'état du mode client
            setIsNewClient(newIsNewClient);
            
            // Réinitialiser les erreurs de validation lors du changement
            setValidationErrors({});
            
            // Si on passe à "Client existant", s'assurer que selectedClient est défini
            if (!newIsNewClient && !selectedClient && clientOptions.length > 0) {
              // Si on a une facture avec un client, sélectionner ce client
              
              if (invoice?.client?.id) {
                // Vérifier si le client de la facture est dans les options
                const invoiceClientOption = clientOptions.find(option => option.value === invoice.client?.id);
                if (invoiceClientOption && invoice.client?.id) {
                  console.log('Sélection du client de la facture:', invoice.client.id);
                  setSelectedClient(invoice.client.id);
                } else {
                  // Si le client de la facture n'est pas dans les options, sélectionner le premier client
                  console.log('Client de la facture non trouvé dans les options, sélection du premier client');
                  setSelectedClient(clientOptions[0].value);
                }
              } else {
                // Si pas de facture, sélectionner le premier client
                console.log('Pas de facture, sélection du premier client');
                setSelectedClient(clientOptions[0].value);
              }
            }
          }}
          /* Variant déjà défini plus haut */
        />
      </div>

      {!isNewClient ? (
        <div>
          {/* Utiliser un select HTML standard pour un meilleur fonctionnement */}
          <div className="w-full">
            {/* Affichage des informations de débogage */}
            {/* Utiliser l'ID du client de la facture si elle existe, sinon utiliser selectedClient */}
            <Select
              id="client-select"
              name="client"
              value={selectedClient}
              onChange={(e) => {setSelectedClient(e.target.value)}}
              required={!isNewClient}
              placeholder="Sélectionner un client"
              options={clientOptions}
            />
          </div>
        </div>
      ) : (
        <FieldGroup spacing="tight" className="space-y-3">
          <div className="mb-4">
            <label htmlFor="client-type" className="block text-sm font-medium text-gray-700 mb-1">
              Type de client
            </label>
            <Select
              id="client-type"
              name="type"
              value={newClient.type || ClientType.COMPANY}
              onChange={(e) => {
                const newType = e.target.value as ClientType;
                // S'assurer que le type est correctement défini
                const validType = newType === ClientType.INDIVIDUAL ? ClientType.INDIVIDUAL : ClientType.COMPANY;
                
                setNewClient({ ...newClient, type: validType });
                
                // Réinitialiser les champs spécifiques au type de client
                if (validType === ClientType.INDIVIDUAL) {
                  setShowManualEntry(true); // Afficher le formulaire pour les particuliers
                } else {
                  setShowManualEntry(false); // Masquer le formulaire pour les entreprises
                  resetSearch();
                  setSearchTerm("");
                }
                
                console.log('Type de client mis à jour:', validType);
              }}
              required={isNewClient}
              options={[
                { value: ClientType.COMPANY, label: 'Entreprise' },
                { value: ClientType.INDIVIDUAL, label: 'Particulier' }
              ]}
            />
          </div>

          {/* Recherche d'entreprise - Uniquement pour les entreprises */}
          {newClient.type === ClientType.COMPANY && !showManualEntry && (
            <div className="mb-4">
              <div className="relative">
                <div className="flex space-x-2">
                  <div className="flex-grow">
                    <TextField
                      id="company-search"
                      name="companySearch"
                      label="Rechercher une entreprise"
                      value={searchTerm}
                      onChange={handleSearchInputChange}
                      placeholder="Nom, SIRET ou SIREN"
                      helpText="Saisissez le nom, SIRET ou SIREN de l'entreprise"
                      className="w-full"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearch();
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-end pb-2 mb-4">
                    <Button
                      variant="secondary"
                      onClick={handleSearch}
                      disabled={!searchTerm.trim() || isLoading}
                      className="h-[50px]"
                    >
                      <MagnifyingGlassIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                {/* Résultats de recherche */}
                {showResults && companiesList.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                    <ul className="py-1">
                      {companiesList.map((company, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectCompany(company)}
                        >
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-gray-500">
                            SIRET: {company.siret}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Message d'erreur */}
                {errorMessage && (
                  <div className="mt-2 text-red-500 text-sm">{errorMessage}</div>
                )}
                
                {/* État de chargement */}
                {isLoading && (
                  <div className="mt-2 text-gray-500 text-sm">Recherche en cours...</div>
                )}
              </div>
              
              {/* Bouton pour ajouter manuellement */}
              <button
                type="button"
                className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                onClick={() => setShowManualEntry(true)}
              >
                <PlusCircleIcon className="h-5 w-5 mr-1" />
                Ajouter un client manuellement
              </button>
            </div>
          )}
          
          {/* Formulaire manuel - Affiché uniquement si showManualEntry est true ou si c'est un particulier */}
          {(showManualEntry || newClient.type === ClientType.INDIVIDUAL) && (
            <>
              {/* Bouton pour revenir à la recherche - Uniquement visible pour les entreprises en mode manuel */}
              {newClient.type === ClientType.COMPANY && (
                <Button
                  variant="secondary"
                  className="mb-4"
                  onClick={() => setShowManualEntry(false)}
                >
                  <MagnifyingGlassIcon className="h-5 w-5 mr-1" />
                  Revenir à la recherche d'entreprise
                </Button>
              )}
              
              {newClient.type === ClientType.INDIVIDUAL ? (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <TextField
                id="client-firstName"
                name="firstName"
                label="Prénom"
                value={newClient.firstName || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setNewClient({ ...newClient, firstName: newValue });
                  // Validation du prénom
                  if (isNewClient && newValue.trim() === '') {
                    setValidationErrors(prev => ({
                      ...prev,
                      firstName: "Le prénom est requis"
                    }));
                  } else if (newValue && !/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{2,50}$/.test(newValue)) {
                    setValidationErrors(prev => ({
                      ...prev,
                      firstName: "Le prénom doit contenir entre 2 et 50 caractères et ne peut contenir que des lettres, espaces, tirets ou apostrophes"
                    }));
                  } else {
                    setValidationErrors(prev => {
                      const { firstName, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                required={isNewClient && newClient.type === ClientType.INDIVIDUAL}
                className="w-full"
                error={validationErrors.firstName}
              />
              <TextField
                id="client-lastName"
                name="lastName"
                label="Nom"
                value={newClient.lastName || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setNewClient({ ...newClient, lastName: newValue });
                  // Validation du nom
                  if (isNewClient && newValue.trim() === '') {
                    setValidationErrors(prev => ({
                      ...prev,
                      lastName: "Le nom est requis"
                    }));
                  } else if (newValue && !/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{2,50}$/.test(newValue)) {
                    setValidationErrors(prev => ({
                      ...prev,
                      lastName: "Le nom doit contenir entre 2 et 50 caractères et ne peut contenir que des lettres, espaces, tirets ou apostrophes"
                    }));
                  } else {
                    setValidationErrors(prev => {
                      const { lastName, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                required={isNewClient && newClient.type === ClientType.INDIVIDUAL}
                className="w-full"
                error={validationErrors.lastName}
              />
            </div>
          ) : (
            <TextField
              id="client-name"
              name="name"
              label="Nom de l'entreprise"
              value={newClient.name}
              onChange={(e) => {
                const newValue = e.target.value;
                setNewClient({ ...newClient, name: newValue });
                // Validation du nom seulement si le champ a été touché
                if (isNewClient && newValue.trim() === '' && newValue !== newClient.name) {
                  setValidationErrors(prev => ({
                    ...prev,
                    name: "Le nom de l'entreprise est requis"
                  }));
                } else if (newValue && !/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-'&.]{2,50}$/.test(newValue)) {
                  setValidationErrors(prev => ({
                    ...prev,
                    name: "Le nom doit contenir entre 2 et 50 caractères et ne peut contenir que des lettres, chiffres, espaces, tirets, apostrophes, & ou points"
                  }));
                } else {
                  setValidationErrors(prev => {
                    const { name, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              required={isNewClient}
              className="w-full mb-4"
              error={validationErrors.name}
            />
          )}
          
          <TextField
            id="client-email"
            name="email"
            label="Email"
            type="email"
            value={newClient.email}
            onChange={(e) => {
              const newValue = e.target.value;
              setNewClient({ ...newClient, email: newValue });
              // Validation de l'email seulement si le champ a été touché
              if (isNewClient && newValue.trim() === '' && newValue !== newClient.email) {
                setValidationErrors(prev => ({
                  ...prev,
                  email: "L'email du client est requis"
                }));
              } else if (newValue && !EMAIL_PATTERN.test(newValue)) {
                setValidationErrors(prev => ({
                  ...prev,
                  email: "Veuillez entrer une adresse email valide"
                }));
              } else {
                setValidationErrors(prev => {
                  const { email, ...rest } = prev;
                  return rest;
                });
              }
            }}
            required={isNewClient}
            className="w-full"
            error={validationErrors.email}
          />
          
          {newClient.type === ClientType.COMPANY && (
            <div className="grid grid-cols-2 gap-4">
              <TextField
                id="client-siret"
                name="siret"
                label="SIRET"
                value={newClient.siret || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setNewClient({ ...newClient, siret: newValue });
                  // Validation du SIRET
                  if (newClient.type === ClientType.COMPANY && isNewClient && newValue.trim() === '') {
                    setValidationErrors(prev => ({
                      ...prev,
                      siret: "Le SIRET est requis pour une entreprise"
                    }));
                  } else if (newValue && !SIRET_PATTERN.test(newValue)) {
                    setValidationErrors(prev => ({
                      ...prev,
                      siret: SIRET_ERROR_MESSAGE
                    }));
                  } else {
                    setValidationErrors(prev => {
                      const { siret, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                required={isNewClient && newClient.type === ClientType.COMPANY}
                pattern={SIRET_PATTERN.toString().slice(1, -1)}
                title="Le numéro SIRET doit contenir exactement 14 chiffres"
                helpText="Format : 14 chiffres sans espaces ni tirets (ex: 12345678901234)"
                className="w-full"
                error={validationErrors.siret}
              />
              
              <TextField
                id="client-vat"
                name="vatNumber"
                label="Numéro de TVA"
                value={newClient.vatNumber || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setNewClient({ ...newClient, vatNumber: newValue });
                  // Validation du numéro de TVA
                  if (newValue && !VAT_PATTERN.test(newValue)) {
                    setValidationErrors(prev => ({
                      ...prev,
                      vatNumber: VAT_ERROR_MESSAGE
                    }));
                  } else {
                    setValidationErrors(prev => {
                      const { vatNumber, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                pattern={VAT_PATTERN.toString().slice(1, -1)}
                title="Le numéro de TVA doit commencer par FR suivi de 11 chiffres"
                helpText="Format : FR suivi de 11 chiffres (ex: FR12345678901)"
                className="w-full"
                error={validationErrors.vatNumber}
              />
            </div>
          )}
          
          <TextField
            id="client-street"
            name="street"
            label="Rue"
            value={newClient.street}
            onChange={(e) => {
              const newValue = e.target.value;
              setNewClient({ ...newClient, street: newValue });
              // Validation de la rue
              if (isNewClient && newValue.trim() === '') {
                setValidationErrors(prev => ({
                  ...prev,
                  street: "L'adresse est requise"
                }));
              } else if (newValue && !STREET_PATTERN.test(newValue)) {
                setValidationErrors(prev => ({
                  ...prev,
                  street: STREET_ERROR_MESSAGE
                }));
              } else {
                setValidationErrors(prev => {
                  const { street, ...rest } = prev;
                  return rest;
                });
              }
            }}
            required={isNewClient}
            className="w-full"
            error={validationErrors.street}
          />
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <TextField
                id="client-postal-code"
                name="postalCode"
                label="Code postal"
                value={newClient.postalCode}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setNewClient({ ...newClient, postalCode: newValue });
                  // Validation du code postal
                  if (isNewClient && newValue.trim() === '') {
                    setValidationErrors(prev => ({
                      ...prev,
                      postalCode: "Le code postal est requis"
                    }));
                  } else if (newValue && !POSTAL_CODE_PATTERN.test(newValue)) {
                    setValidationErrors(prev => ({
                      ...prev,
                      postalCode: POSTAL_CODE_ERROR_MESSAGE
                    }));
                  } else {
                    setValidationErrors(prev => {
                      const { postalCode, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                pattern={POSTAL_CODE_PATTERN.toString().slice(1, -1)}
                title="Le code postal doit contenir 5 chiffres"
                helpText="Format : 5 chiffres (ex: 75001)"
                required={isNewClient}
                className="w-full"
                error={validationErrors.postalCode}
              />
            </div>
            <div className="col-span-2">
              <TextField
                id="client-city"
                name="city"
                label="Ville"
                value={newClient.city}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setNewClient({ ...newClient, city: newValue });
                  // Validation de la ville
                  if (isNewClient && newValue.trim() === '') {
                    setValidationErrors(prev => ({
                      ...prev,
                      city: "La ville est requise"
                    }));
                  } else if (newValue && !CITY_PATTERN.test(newValue)) {
                    setValidationErrors(prev => ({
                      ...prev,
                      city: CITY_ERROR_MESSAGE
                    }));
                  } else {
                    setValidationErrors(prev => {
                      const { city, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                required={isNewClient}
                className="w-full"
                error={validationErrors.city}
              />
            </div>
          </div>
          
          <TextField
            id="client-country"
            name="country"
            label="Pays"
            value={newClient.country}
            onChange={(e) => {
              const newValue = e.target.value;
              setNewClient({ ...newClient, country: newValue });
              // Validation du pays
              if (isNewClient && newValue.trim() === '') {
                setValidationErrors(prev => ({
                  ...prev,
                  country: "Le pays est requis"
                }));
              } else if (newValue && !COUNTRY_PATTERN.test(newValue)) {
                setValidationErrors(prev => ({
                  ...prev,
                  country: COUNTRY_ERROR_MESSAGE
                }));
              } else {
                setValidationErrors(prev => {
                  const { country, ...rest } = prev;
                  return rest;
                });
              }
            }}
            helpText="Exemple : France"
            required={isNewClient}
            className="w-full"
            error={validationErrors.country}
          />
            </>
          )}
        </FieldGroup>
      )}
    </div>
  );
};
