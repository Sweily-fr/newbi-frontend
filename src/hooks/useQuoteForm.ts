import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Notification } from "../components/feedback/Notification";
import {
  CREATE_QUOTE_MUTATION,
  UPDATE_QUOTE_MUTATION,
  GET_NEXT_QUOTE_NUMBER,
} from "../graphql/quotes";
import { GET_QUOTES } from "../graphql/quotes";
import { GET_CLIENTS, CREATE_CLIENT } from "../graphql/client";
import { GET_USER_INFO } from "../graphql/queries";
import { /* Quote, */ Item, CustomField, /* Client, */ CompanyInfo } from "../types";

export interface UseQuoteFormProps {
  quote?: any;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  showNotifications?: boolean;
}

export const useQuoteForm = ({
  quote,
  onClose,
  onSubmit,
  showNotifications = false,
}: UseQuoteFormProps) => {
  // États du formulaire
  const [selectedClient, setSelectedClient] = useState<string>(() => {
    return quote?.client?.id || "";
  });
  const [isNewClient, setIsNewClient] = useState(false);

  // Initialiser newClient avec des valeurs par défaut ou les valeurs du devis si disponibles
  const defaultNewClient = {
    type: 'COMPANY', // Type par défaut: entreprise
    name: "",
    email: "",
    street: "",
    city: "",
    country: "",
    postalCode: "",
    // Champs spécifiques aux entreprises
    siret: "",
    vatNumber: "",
    // Champs spécifiques aux particuliers
    firstName: "",
    lastName: ""
  };

  const [newClient, setNewClient] = useState(defaultNewClient);

  // État pour les éléments du devis
  const [items, setItems] = useState<Item[]>(() => {
    return quote?.items?.length > 0
      ? quote.items.map((item: any) => ({
          description: item.description || "",
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
          vatRate: item.vatRate || 20,
          unit: item.unit || "unité",
          discount: item.discount || 0,
          discountType: item.discountType || "PERCENTAGE",
          details: item.details || "",
        }))
      : [
          {
            description: "",
            quantity: 1,
            unitPrice: 0,
            vatRate: 20,
            unit: "unité",
            discount: 0,
            discountType: "PERCENTAGE",
            details: "",
          },
        ];
  });

  // État pour le statut du devis
  const [status, setStatus] = useState<"DRAFT" | "PENDING" | "COMPLETED">(
    () => {
      return quote?.status || "PENDING";
    }
  );

  // États pour les notes et conditions
  const [headerNotes, setHeaderNotes] = useState<string>(() => {
    return quote?.headerNotes || "";
  });

  const [footerNotes, setFooterNotes] = useState<string>(() => {
    return quote?.footerNotes || "";
  });

  const [termsAndConditions, setTermsAndConditions] = useState<string>(() => {
    return quote?.termsAndConditions || "";
  });

  const [termsAndConditionsLinkTitle, setTermsAndConditionsLinkTitle] =
    useState<string>(() => {
      return quote?.termsAndConditionsLinkTitle || "";
    });

  const [termsAndConditionsLink, setTermsAndConditionsLink] = useState<string>(
    () => {
      return quote?.termsAndConditionsLink || "";
    }
  );

  // État pour la remise
  const [discount, setDiscount] = useState<number>(() => {
    return quote?.discount || 0;
  });

  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">(
    () => {
      return quote?.discountType || "PERCENTAGE";
    }
  );

  // État pour les champs personnalisés
  const [customFields, setCustomFields] = useState<CustomField[]>(() => {
    return quote?.customFields || [];
  });

  // États pour les informations générales du devis
  const [quoteNumber, setQuoteNumber] = useState<string>(() => {
    return quote?.number || "";
  });

  const [quotePrefix, setQuotePrefix] = useState<string>(() => {
    if (quote?.prefix) {
      return quote.prefix;
    } else {
      // Générer le préfixe au format D-AAAAMM-
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      return `D-${year}${month}-`;
    }
  });

  const [issueDate, setIssueDate] = useState<string>(() => {
    return quote?.issueDate || new Date().toISOString().split("T")[0];
  });

  const [validUntil, setValidUntil] = useState<string>(() => {
    // Par défaut, valide 30 jours après la date d'émission
    if (quote?.validUntil) return quote.validUntil;

    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split("T")[0];
  });

  // État pour les informations de l'entreprise
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
    return (
      quote?.companyInfo || {
        name: "",
        email: "",
        phone: "",
        website: "",
        siret: "",
        vatNumber: "",
        logo: "",
        transactionCategory: "",
        address: {
          street: "",
          city: "",
          postalCode: "",
          country: "",
        },
        bankDetails: {
          iban: "",
          bic: "",
          bankName: "",
        },
      }
    );
  });

  // État pour les coordonnées bancaires
  const [useBankDetails, setUseBankDetails] = useState<boolean>(() => {
    return quote?.companyInfo?.bankDetails?.iban ? true : false;
  });

  const [bankDetailsReadOnly, setBankDetailsReadOnly] =
    useState<boolean>(false);

  // État pour la soumission du formulaire
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitAsDraft, setSubmitAsDraft] = useState<boolean>(false);

  // Requêtes GraphQL
  const { data: clientsData } = useQuery(GET_CLIENTS);
  const { data: userData } = useQuery(GET_USER_INFO);
  
  // Mettre à jour les informations de l'entreprise avec les données du profil utilisateur
  useEffect(() => {
    if (userData?.me?.company && !quote?.companyInfo) {
      // Si nous avons des données utilisateur et qu'il s'agit d'un nouveau devis
      setCompanyInfo({
        name: userData.me.company.name || "",
        email: userData.me.company.email || "",
        phone: userData.me.company.phone || "",
        website: userData.me.company.website || "",
        siret: userData.me.company.siret || "",
        vatNumber: userData.me.company.vatNumber || "",
        logo: userData.me.company.logo || "",
        transactionCategory: userData.me.company.transactionCategory || "",
        address: {
          street: userData.me.company.address?.street || "",
          city: userData.me.company.address?.city || "",
          postalCode: userData.me.company.address?.postalCode || "",
          country: userData.me.company.address?.country || "",
        },
        bankDetails: {
          iban: userData.me.company.bankDetails?.iban || "",
          bic: userData.me.company.bankDetails?.bic || "",
          bankName: userData.me.company.bankDetails?.bankName || "",
        },
      });
    }
  }, [userData, quote]);

  // Requête pour récupérer le prochain numéro de devis
  const { data: nextQuoteNumberData, refetch: refetchNextQuoteNumber } =
    useQuery(GET_NEXT_QUOTE_NUMBER, {
      fetchPolicy: "network-only",
    });

  // Mutations GraphQL
  const [createQuote /* , { loading: createLoading } */] = useMutation(
    CREATE_QUOTE_MUTATION
  );
  const [updateQuote /* , { loading: updateLoading } */] = useMutation(
    UPDATE_QUOTE_MUTATION
  );
  const [createClient] = useMutation(CREATE_CLIENT);

  // URL de l'API
  const apiUrl = import.meta.env.REACT_APP_API_URL || "http://localhost:4000";

  // Effet pour initialiser les informations de l'entreprise à partir des données utilisateur
  useEffect(() => {
    if (userData?.me?.company && !quote) {
      const company = userData.me.company;
      setCompanyInfo({
        name: company.name || "",
        email: company.email || "",
        phone: company.phone || "",
        website: company.website || "",
        siret: company.siret || "",
        vatNumber: company.vatNumber || "",
        logo: company.logo || "",
        transactionCategory: company.transactionCategory || "",
        address: {
          street: company.address?.street || "",
          city: company.address?.city || "",
          postalCode: company.address?.postalCode || "",
          country: company.address?.country || "",
        },
        bankDetails: {
          iban: company.bankDetails?.iban || "",
          bic: company.bankDetails?.bic || "",
          bankName: company.bankDetails?.bankName || "",
        },
      });
    }
  }, [userData, quote]);

  // Effet pour initialiser le numéro de devis
  useEffect(() => {
    if (nextQuoteNumberData?.nextQuoteNumber && !quote) {
      setQuoteNumber(nextQuoteNumberData.nextQuoteNumber);
    }
  }, [nextQuoteNumberData, quote]);

  // Fonction pour calculer les totaux
  const calculateTotals = () => {
    // Calcul du total HT
    const totalHT = items.reduce((acc, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      // Appliquer la remise sur l'article si elle existe
      if (item.discount && item.discount > 0) {
        if (item.discountType === "PERCENTAGE") {
          return acc + itemTotal * (1 - item.discount / 100);
        } else {
          return acc + (itemTotal - item.discount);
        }
      }
      return acc + itemTotal;
    }, 0);

    // Calcul de la TVA
    const totalVAT = items.reduce((acc, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      // Appliquer la remise sur l'article si elle existe
      let itemHT = itemTotal;
      if (item.discount && item.discount > 0) {
        if (item.discountType === "PERCENTAGE") {
          itemHT = itemTotal * (1 - item.discount / 100);
        } else {
          itemHT = itemTotal - item.discount;
        }
      }
      return acc + itemHT * (item.vatRate / 100);
    }, 0);

    // Calcul du total TTC
    const totalTTC = totalHT + totalVAT;

    // Calcul du montant de la remise globale
    let discountAmount = 0;
    if (discount > 0) {
      if (discountType === "PERCENTAGE") {
        discountAmount = totalHT * (discount / 100);
      } else {
        discountAmount = discount;
      }
    }

    // Calcul des totaux finaux après remise globale
    const finalTotalHT = Math.max(0, totalHT - discountAmount);
    const finalTotalTTC = finalTotalHT + totalVAT;

    return {
      totalHT,
      totalVAT,
      totalTTC,
      discountAmount,
      finalTotalHT,
      finalTotalTTC,
    };
  };

  // Calculer les totaux à chaque changement des éléments ou de la remise
  const totals = calculateTotals();

  // Fonction pour gérer le changement de mode client (existant ou nouveau)
  const handleClientModeChange = (isNew: boolean) => {
    setIsNewClient(isNew);
    if (isNew) {
      setSelectedClient("");
    } else {
      setNewClient(defaultNewClient);
    }
  };

  // Fonction pour ajouter un élément au devis
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
        vatRate: 20,
        unit: "unité",
        discount: 0,
        discountType: "PERCENTAGE",
        details: "",
      },
    ]);
  };

  // Fonction pour supprimer un élément du devis
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Fonction pour gérer les changements dans un élément
  const handleItemChange = (index: number, field: keyof Item, value: any) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setItems(newItems);
  };

  // Fonction pour sélectionner un produit et remplir automatiquement les champs de l'item
  const handleProductSelect = (index: number, product: {
    id: string;
    name: string;
    description?: string;
    unitPrice?: number;
    vatRate?: number;
    unit?: string;
  }) => {
    console.log('handleProductSelect appelé avec le produit:', product.name);
    
    // Créer une copie du tableau d'items
    const newItems = [...items];
    
    // Créer un nouvel objet item en conservant les propriétés existantes
    // qui ne doivent pas être modifiées
    newItems[index] = {
      ...newItems[index],
      description: product.name,
      details: product.description || '',
      unitPrice: product.unitPrice !== undefined && product.unitPrice !== null ? product.unitPrice : 0,
      vatRate: product.vatRate !== undefined && product.vatRate !== null ? product.vatRate : 20,
      unit: product.unit || 'unité',
      // Conserver la quantité existante ou initialiser à 1
      quantity: newItems[index].quantity || 1
    };
    
    // Mettre à jour le tableau d'items en une seule fois
    setItems(newItems);
    
    console.log('Item mis à jour avec succès via handleProductSelect');
  };

  // Fonction pour ajouter un champ personnalisé
  const handleAddCustomField = () => {
    setCustomFields([...customFields, { key: "", value: "" }]);
  };

  // Fonction pour supprimer un champ personnalisé
  const handleRemoveCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  // Fonction pour gérer les changements dans un champ personnalisé
  const handleCustomFieldChange = (
    index: number,
    field: keyof CustomField,
    value: string
  ) => {
    const newCustomFields = [...customFields];
    newCustomFields[index] = {
      ...newCustomFields[index],
      [field]: value,
    };
    setCustomFields(newCustomFields);
  };

  // Fonction pour vérifier si les coordonnées bancaires sont complètes
  const bankDetailsComplete =
    useBankDetails &&
    companyInfo.bankDetails?.iban &&
    companyInfo.bankDetails?.bic &&
    companyInfo.bankDetails?.bankName;

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent, asDraft?: boolean) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Utiliser le paramètre asDraft s'il est fourni, sinon utiliser l'état submitAsDraft
    const isDraft = asDraft !== undefined ? asDraft : submitAsDraft;
    console.log("handleSubmit - asDraft:", asDraft, "isDraft:", isDraft);

    try {
      // Récupérer le numéro de devis le plus récent pour éviter les doublons
      await refetchNextQuoteNumber();
      const freshQuoteNumber = quote
        ? quoteNumber
        : nextQuoteNumberData?.nextQuoteNumber || quoteNumber;

      // S'assurer que nous avons un numéro de devis valide
      if (!freshQuoteNumber && !quote) {
        console.error("Impossible de récupérer un numéro de devis valide");
        if (showNotifications) {
          Notification.error(
            "Erreur: impossible de générer un numéro de devis valide"
          );
        }
        setIsSubmitting(false);
        return;
      }

      // Fonction pour récupérer les données complètes du client
      const getClientData = () => {
        // Forcer le type à COMPANY par défaut si aucun type n'est spécifié
        // C'est nécessaire car le type est requis par le serveur
        
        if (isNewClient) {
          // Déterminer le type de client en fonction des champs remplis
          let clientType = newClient.type || 'COMPANY';
          // Si firstName et lastName sont remplis, c'est un particulier
          if (newClient.firstName && newClient.lastName) {
            clientType = 'INDIVIDUAL';
          }
  
          // Si c'est un nouveau client, on utilise les données saisies
          const clientData = {
            type: clientType,
            name: newClient.name,
            email: newClient.email,
            address: {
              street: newClient.street,
              city: newClient.city,
              postalCode: newClient.postalCode,
              country: newClient.country,
            },
            // Champs spécifiques aux entreprises
            siret: newClient.siret || "",
            vatNumber: newClient.vatNumber || "",
            // Champs spécifiques aux particuliers
            firstName: newClient.firstName || "",
            lastName: newClient.lastName || ""
          };
          console.log("Returning new client data", clientData);
          return clientData;
        } else {
          // Si c'est un client existant, on le récupère depuis les données
          console.log("Looking for existing client", {
            selectedClient,
            clientsData,
            'clientsData?.clients': clientsData?.clients,
          });

          // Si on modifie un devis existant et que le client est déjà dans le devis
          if (quote && quote.client) {
            return {
              id: quote.client.id,
              type: quote.client.type, // Utiliser le type exact du client sans valeur par défaut
              name: quote.client.name,
              email: quote.client.email,
              address: {
                street: quote.client.address.street,
                city: quote.client.address.city,
                postalCode: quote.client.address.postalCode,
                country: quote.client.address.country,
              },
              // Champs spécifiques aux entreprises
              siret: quote.client.siret || "",
              vatNumber: quote.client.vatNumber || "",
              // Champs spécifiques aux particuliers
              firstName: quote.client.firstName || "",
              lastName: quote.client.lastName || ""
            };
          }

          // Rechercher le client par ID
    // Vérifier que clientsData et clients existent et que clients est un tableau
    // Utiliser items car clientsData.clients est un objet avec une propriété items qui contient le tableau des clients
    const clients = clientsData?.clients?.items || [];
    
    // Log pour débogage
    console.log('Client sélectionné (ID):', selectedClient);
    console.log('Structure de clientsData:', {
      'clientsData': clientsData,
      'clientsData?.clients': clientsData?.clients,
      'clientsData?.clients?.items': clientsData?.clients?.items,
    });
    
    // Rechercher le client sélectionné dans la liste des clients
    const selectedClientData = Array.isArray(clients) 
      ? clients.find((c) => c.id === selectedClient)
      : undefined;
    
    // Log pour débogage
    console.log('Client trouvé dans la liste:', selectedClientData);
          if (!selectedClientData) {
            console.warn("Client non trouvé", {
              selectedClient,
              clients: Array.isArray(clients) ? clients.map((c) => ({
                id: c.id,
                name: c.name,
                type: c.type
              })) : [],
            });

            // Si aucun client n'est trouvé mais qu'il y a des clients disponibles, utiliser le premier
            if (Array.isArray(clients) && clients.length > 0) {
              return {
                id: clients[0].id,
                type: clients[0].type, // Utiliser le type exact du client sans valeur par défaut
                name: clients[0].name,
                email: clients[0].email,
                address: {
                  street: clients[0].address.street,
                  city: clients[0].address.city,
                  postalCode: clients[0].address.postalCode,
                  country: clients[0].address.country,
                },
                // Champs spécifiques aux entreprises
                siret: clients[0].siret || "",
                vatNumber: clients[0].vatNumber || "",
                // Champs spécifiques aux particuliers
                firstName: clients[0].firstName || "",
                lastName: clients[0].lastName || ""
              };
            }
          }
          // Vérifier que selectedClientData existe
          if (!selectedClientData) {
            console.error("Aucun client sélectionné trouvé et aucun client par défaut disponible");
            
            // Vérifier si nous avons des données utilisateur pour pré-remplir les champs
            const userCompany = userData?.me?.company || {};
            
            // Si nous avons des données de l'utilisateur avec firstName et lastName, créer un client de type INDIVIDUAL
            // sinon créer un client de type COMPANY avec les données de l'entreprise
            const isIndividual = userData?.me?.firstName && userData?.me?.lastName;
            
            if (isIndividual) {
              // Créer un client de type particulier avec les données de l'utilisateur
              return {
                id: "", // ID vide, sera géré côté serveur
                type: 'INDIVIDUAL',
                name: `${userData.me.firstName} ${userData.me.lastName}`,
                email: userData.me.email || "client@example.com", // Email obligatoire
                address: {
                  street: userCompany.address?.street || "Adresse non spécifiée",
                  city: userCompany.address?.city || "Ville non spécifiée",
                  postalCode: userCompany.address?.postalCode || "00000",
                  country: userCompany.address?.country || "France",
                },
                siret: "", // Pas obligatoire pour un particulier
                vatNumber: "", // Pas obligatoire pour un particulier
                firstName: userData.me.firstName || "Prénom",
                lastName: userData.me.lastName || "Nom"
              };
            } else {
              // Créer un client de type entreprise avec les données de l'entreprise de l'utilisateur
              return {
                id: "", // ID vide, sera géré côté serveur
                type: 'COMPANY',
                name: userCompany.name || "Entreprise par défaut",
                email: userCompany.email || "entreprise@example.com", // Email obligatoire
                address: {
                  street: userCompany.address?.street || "Adresse non spécifiée",
                  city: userCompany.address?.city || "Ville non spécifiée",
                  postalCode: userCompany.address?.postalCode || "00000",
                  country: userCompany.address?.country || "France",
                },
                siret: userCompany.siret || "12345678901234", // SIRET obligatoire pour une entreprise
                vatNumber: userCompany.vatNumber || "FR12345678901", // TVA obligatoire pour une entreprise
                firstName: "",
                lastName: ""
              };
            }
          }
          
          // Déterminer le type de client en fonction des champs remplis ou utiliser le type existant
          let clientType = selectedClientData.type || 'COMPANY';
          // Si firstName et lastName sont remplis et qu'il n'y a pas de type défini, c'est un particulier
          if (!selectedClientData.type && selectedClientData.firstName && selectedClientData.lastName) {
            clientType = 'INDIVIDUAL';
          }
          
          // Si le type est COMPANY, vérifier que nous avons les champs obligatoires
          const needsSiretAndVat = clientType === 'COMPANY';
          const siret = selectedClientData.siret || (needsSiretAndVat ? "12345678901234" : "");
          const vatNumber = selectedClientData.vatNumber || (needsSiretAndVat ? "FR12345678901" : "");
          console.log("jojo ", selectedClientData);
          
          return {
            id: selectedClientData.id,
            type: clientType, // Utiliser le type calculé ou par défaut
            name: selectedClientData.name,
            email: selectedClientData.email || "client@example.com", // Email obligatoire
            address: {
              street: selectedClientData.address?.street || "",
              city: selectedClientData.address?.city || "",
              postalCode: selectedClientData.address?.postalCode || "",
              country: selectedClientData.address?.country || "",
            },
            // Champs spécifiques aux entreprises
            siret: siret,
            vatNumber: vatNumber,
            // Champs spécifiques aux particuliers
            firstName: selectedClientData.firstName || "",
            lastName: selectedClientData.lastName || ""
          };
        }
      };

      // Créer un nouveau client si nécessaire
      // Variable utilisée pour stocker l'ID du client
      // Si un nouveau client est créé, cette variable sera mise à jour
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let clientId = selectedClient;
      if (isNewClient) {
        const { data: clientData } = await createClient({
          variables: {
            input: {
              name: newClient.name,
              email: newClient.email,
              address: {
                street: newClient.street,
                city: newClient.city,
                postalCode: newClient.postalCode,
                country: newClient.country,
              },
              // Utiliser le type exact du client s'il existe, sinon déterminer en fonction des champs
              type: newClient.type || ((newClient.firstName && newClient.lastName) ? 'INDIVIDUAL' : (quote?.client?.type || 'COMPANY')),
              // Log pour déboguer le type de client
              ...(console.log("Type de client lors de la création:", {
                'détecté': (newClient.firstName && newClient.lastName) ? 'INDIVIDUAL' : (newClient.type || quote?.client?.type || 'COMPANY'),
                'newClient.type': newClient.type,
                'quote?.client?.type': quote?.client?.type,
                'hasFirstLastName': !!(newClient.firstName && newClient.lastName)
              }), {}),
              // Champs spécifiques aux entreprises
              siret: newClient.siret,
              vatNumber: newClient.vatNumber,
              // Champs spécifiques aux particuliers
              firstName: newClient.firstName,
              lastName: newClient.lastName,
            },
          },
        });
        clientId = clientData.createClient.id;
      }

      // Calculer les totaux
      // Variable non utilisée
      // const totals = calculateTotals();
      console.log("submitAsDraft", submitAsDraft);
      // Préparer les données communes du devis
      const commonQuoteData = {
        prefix: quotePrefix,
        status: isDraft ? "DRAFT" : status,
        issueDate,
        validUntil,
        companyInfo: {
          name: companyInfo.name,
          email: companyInfo.email,
          phone: companyInfo.phone,
          website: companyInfo.website,
          siret: companyInfo.siret,
          vatNumber: companyInfo.vatNumber,
          logo: companyInfo.logo,
          transactionCategory: companyInfo.transactionCategory,
          address: {
            street: companyInfo.address.street,
            city: companyInfo.address.city,
            postalCode: companyInfo.address.postalCode,
            country: companyInfo.address.country,
          },
          bankDetails: useBankDetails
            ? {
                iban: companyInfo.bankDetails?.iban,
                bic: companyInfo.bankDetails?.bic,
                bankName: companyInfo.bankDetails?.bankName,
              }
            : null,
        },
        items: items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          vatRate: item.vatRate,
          unit: item.unit,
          discount: item.discount,
          discountType: item.discountType,
          details: item.details,
        })),
        discount,
        discountType,
        headerNotes,
        footerNotes,
        termsAndConditions,
        termsAndConditionsLinkTitle,
        termsAndConditionsLink,
        customFields: customFields
          .filter((field) => field.key && field.value)
          .map(({ key, value }) => ({ key, value })),
        client: {
          ...getClientData(),
          // S'assurer que le type est toujours défini, même pour les clients existants
          type: getClientData().type || 'COMPANY'
        },
      };

      let result;

      // Logs détaillés pour vérifier les données du client avant envoi
      const clientDataToSend = getClientData();
      console.log("CLIENT DATA BEING SENT TO SERVER:", clientDataToSend);
      console.log("CLIENT TYPE DETAILS (FINAL):", {
        'newClient.type': newClient.type,
        'quote?.client?.type': quote?.client?.type,
        'isNewClient': isNewClient,
        'hasFirstLastName': !!(newClient.firstName && newClient.lastName),
        'finalType': clientDataToSend.type,
        'typeInClientData': clientDataToSend.type,
        'isTypeString': typeof clientDataToSend.type === 'string',
        'isTypeUndefined': typeof clientDataToSend.type === 'undefined'
      });
      
      // Alerte si le type n'est pas défini correctement
      if (!clientDataToSend.type && isNewClient && newClient.firstName && newClient.lastName) {
        console.warn("ATTENTION: Le type de client devrait être INDIVIDUAL mais n'est pas défini!");
      }

      if (!quote) {
        // Pour la création, on laisse le backend générer un numéro unique
        const createQuoteData = {
          ...commonQuoteData,
          number: freshQuoteNumber,
        };

        result = await createQuote({
          variables: {
            input: createQuoteData,
          },
          refetchQueries: [{ query: GET_QUOTES }],
        });

        if (showNotifications) {
          Notification.success("Devis créé avec succès");
        }

        if (onSubmit) onSubmit(result.data?.createQuote);
      } else {
        // Mise à jour d'un devis existant
        try {
          // Pour la mise à jour, on inclut le numéro
          const updateQuoteData = {
            ...commonQuoteData,
            number: freshQuoteNumber,
          };

          result = await updateQuote({
            variables: {
              id: quote.id,
              input: updateQuoteData,
            },
            refetchQueries: [{ query: GET_QUOTES }],
          });

          if (showNotifications) {
            Notification.success("Devis mis à jour avec succès");
          }

          if (onSubmit) onSubmit(result.data?.updateQuote);
        } catch (error) {
          if (showNotifications) {
            Notification.error("Erreur lors de la mise à jour du devis");
          }
          console.error("Error:", error);
          setIsSubmitting(false);
          return;
        }
      }

      // Fermer le modal
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission du devis:", error);

      if (showNotifications) {
        Notification.error("Une erreur est survenue lors de la création du devis");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedClient,
    setSelectedClient,
    isNewClient,
    setIsNewClient,
    handleClientModeChange,
    newClient,
    setNewClient,
    items,
    status,
    setStatus,
    handleProductSelect,
    headerNotes,
    setHeaderNotes,
    footerNotes,
    setFooterNotes,
    termsAndConditions,
    setTermsAndConditions,
    termsAndConditionsLinkTitle,
    setTermsAndConditionsLinkTitle,
    termsAndConditionsLink,
    setTermsAndConditionsLink,
    discount,
    setDiscount,
    discountType,
    setDiscountType,
    customFields,
    quoteNumber,
    setQuoteNumber,
    quotePrefix,
    setQuotePrefix,
    issueDate,
    setIssueDate,
    validUntil,
    setValidUntil,
    companyInfo,
    setCompanyInfo,
    useBankDetails,
    setUseBankDetails,
    bankDetailsComplete,
    bankDetailsReadOnly,
    setBankDetailsReadOnly,

    // Données
    clientsData,
    userData,

    // Fonctions utilitaires
    calculateTotals,

    // Handlers
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleAddCustomField,
    handleRemoveCustomField,
    handleCustomFieldChange,
    handleSubmit,

    // Constantes
    apiUrl,
    isSubmitting,
    setSubmitAsDraft,
    totals,
  };
};
