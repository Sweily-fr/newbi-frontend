import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Notification } from "../../../components/common/Notification";
import {
  CREATE_QUOTE_MUTATION,
  UPDATE_QUOTE_MUTATION,
  GET_NEXT_QUOTE_NUMBER,
} from "../graphql/quotes";
import { GET_QUOTES } from "../graphql/quotes";
import { GET_CLIENTS, CREATE_CLIENT } from "../../../features/clients/graphql/";
import { GET_USER_INFO } from "../../../graphql/queries";
import {
  /* Quote, */ Item,
  CustomField,
  /* Client, */ CompanyInfo,
} from "../../../types";

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
    type: "COMPANY", // Type par défaut: entreprise
    name: "",
    email: "",
    street: "",
    city: "",
    country: "",
    postalCode: "",
    // Adresse de livraison
    hasDifferentShippingAddress: false,
    shippingAddress: {
      street: "",
      city: "",
      postalCode: "",
      country: ""
    },
    // Champs spécifiques aux entreprises
    siret: "",
    vatNumber: "",
    // Champs spécifiques aux particuliers
    firstName: "",
    lastName: "",
  };

  const [newClient, setNewClient] = useState(defaultNewClient);

  // État pour les éléments du devis
  const [items, setItems] = useState<Item[]>(() => {
    return quote?.items?.length > 0
      ? quote.items.map((item: any) => ({
          description: item.description || "",
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
          vatRate: item.vatRate ?? 20,
          unit: item.unit || "unité",
          discount: item.discount || 0,
          discountType: item.discountType || "PERCENTAGE",
          details: item.details || "",
          vatExemptionText: item.vatExemptionText || "",
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
            vatExemptionText: "",
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
      // Générer un préfixe par défaut basé sur la date
      const now = new Date();
      const year = now.getFullYear().toString();
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

  // État pour l'utilisation des coordonnées bancaires
  const [useBankDetails, setUseBankDetails] = useState<boolean>(() => {
    return quote?.companyInfo?.bankDetails ? true : false;
  });

  // État pour les coordonnées bancaires en lecture seule
  const [bankDetailsReadOnly, setBankDetailsReadOnly] = useState<boolean>(true);

  // Fonction pour vérifier si les coordonnées bancaires sont complètes
  const bankDetailsComplete =
    useBankDetails &&
    companyInfo.bankDetails?.iban &&
    companyInfo.bankDetails?.bic &&
    companyInfo.bankDetails?.bankName;

  // État pour la soumission du formulaire
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitAsDraft, setSubmitAsDraft] = useState<boolean>(false);

  // Requêtes GraphQL
  const { data: clientsData } = useQuery(GET_CLIENTS);
  const { data: userData } = useQuery(GET_USER_INFO);

  // Mettre à jour les informations de l'entreprise avec les données du profil utilisateur
  useEffect(() => {
    if (userData?.me?.company && !quote?.companyInfo) {
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

  // Effet pour initialiser le numéro de devis à partir des données du serveur
  useEffect(() => {
    if (nextQuoteNumberData?.nextQuoteNumber && !quote) {
      setQuoteNumber(nextQuoteNumberData.nextQuoteNumber);
    }
  }, [nextQuoteNumberData, quote]);
  
  // Fonction pour calculer les totaux
  const calculateTotals = () => {
    let subtotal = 0;
    let totalVAT = 0;
    let totalWithoutVAT = 0;
    let totalWithVAT = 0;
    let totalDiscount = 0;
    
    // Objet pour suivre les montants par taux de TVA
    const vatDetails: Record<number, { rate: number; amount: number; baseAmount: number }> = {};

    // Calculer les totaux pour chaque élément
    items.forEach((item) => {
      const quantity = item.quantity || 0;
      const unitPrice = item.unitPrice || 0;
      const vatRate = item.vatRate || 0;
      const itemDiscount = item.discount || 0;
      const itemDiscountType = item.discountType || "PERCENTAGE";

      // Calculer le montant avant remise
      let itemTotal = quantity * unitPrice;

      // Appliquer la remise sur l'élément
      let itemDiscountAmount = 0;
      if (itemDiscountType === "PERCENTAGE") {
        itemDiscountAmount = (itemTotal * itemDiscount) / 100;
      } else {
        itemDiscountAmount = Math.min(itemDiscount, itemTotal); // Éviter les remises négatives
      }
      itemTotal -= itemDiscountAmount;
      totalDiscount += itemDiscountAmount;

      // Ajouter au sous-total
      subtotal += itemTotal;

      // Initialiser les détails de TVA pour ce taux
      if (!vatDetails[vatRate]) {
        vatDetails[vatRate] = { rate: vatRate, amount: 0, baseAmount: 0 };
      }
      vatDetails[vatRate].baseAmount += itemTotal;
    });

    // Appliquer la remise globale
    let globalDiscountAmount = 0;
    if (discount > 0) {
      if (discountType === "PERCENTAGE") {
        globalDiscountAmount = (subtotal * discount) / 100;
      } else {
        globalDiscountAmount = Math.min(discount, subtotal); // Éviter les remises négatives
      }
      
      // Appliquer la remise globale proportionnellement à chaque base de TVA
      if (globalDiscountAmount > 0 && subtotal > 0) {
        const discountRatio = globalDiscountAmount / subtotal;
        
        // Ajuster les bases de TVA en fonction de la remise globale
        Object.keys(vatDetails).forEach((rateKey) => {
          const rate = Number(rateKey);
          const detail = vatDetails[rate];
          const rateDiscount = detail.baseAmount * discountRatio;
          
          // Réduire la base imposable pour ce taux de TVA
          detail.baseAmount -= rateDiscount;
        });
        
        subtotal -= globalDiscountAmount;
        totalDiscount += globalDiscountAmount;
      }
    }
    
    // Recalculer la TVA après application de toutes les remises
    totalVAT = 0;
    Object.keys(vatDetails).forEach((rateKey) => {
      const rate = Number(rateKey);
      const detail = vatDetails[rate];
      
      // Calculer le montant de TVA sur la base ajustée
      detail.amount = (detail.baseAmount * rate) / 100;
      totalVAT += detail.amount;
    });

    // Calculer les totaux finaux
    totalWithoutVAT = subtotal;
    totalWithVAT = subtotal + totalVAT;
    
    // Convertir l'objet vatDetails en tableau trié par taux
    const vatRates = Object.values(vatDetails).sort((a, b) => a.rate - b.rate);

    return {
      subtotal: subtotal,
      totalVAT: totalVAT,
      totalWithoutVAT: totalWithoutVAT,
      totalWithVAT: totalWithVAT,
      totalDiscount: totalDiscount,
      vatRates: vatRates // Ajouter les détails des différents taux de TVA
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
        vatExemptionText: "",
      },
    ]);
  };

  // Fonction pour supprimer un élément du devis
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Fonction pour gérer les changements dans un élément
  const handleItemChange = (index: number, field: keyof Item, value: any) => {
    // Créer une copie du tableau d'items
    const newItems = [...items];
    
    // Si le champ modifié est vatRate, vérifier si nous devons effacer vatExemptionText
    if (field === 'vatRate' && parseFloat(value.toString()) !== 0 && newItems[index].vatExemptionText) {
      // Si le taux de TVA n'est pas 0, supprimer la mention d'exonération
      newItems[index] = { 
        ...newItems[index], 
        [field]: value,
        vatExemptionText: undefined 
      };
    } else {
      // Mise à jour normale
      newItems[index] = { ...newItems[index], [field]: value };
    }
    
    // Mettre à jour l'état
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
    try {
      // Vérifier si le produit a un prix unitaire valide
      if (product.unitPrice === undefined || product.unitPrice === null) {
        console.warn('Le produit n\'a pas de prix unitaire valide:', product);
      }

      // Extraire les valeurs du produit avec des valeurs par défaut sécurisées
      const {
        name,
        description = '',
        unitPrice = 0,
        vatRate = 20,
        unit = 'unité'
      } = product;
      
      // Approche directe : mettre à jour l'item directement dans le tableau
      const newItems = [...items];
      
      // Conserver la quantité et le discount existants
      const existingQuantity = newItems[index]?.quantity || 1;
      const existingDiscount = newItems[index]?.discount || 0;
      const existingDiscountType = newItems[index]?.discountType || 'PERCENTAGE';
      
      // Créer un nouvel objet item complet
      newItems[index] = {
        description: name,
        details: description,
        unitPrice: unitPrice,
        vatRate: vatRate,
        unit: unit,
        quantity: existingQuantity,
        discount: existingDiscount,
        discountType: existingDiscountType,
        // Ajouter la gestion du champ vatExemptionText
        // Si le taux de TVA est 0, conserver la mention existante, sinon la supprimer
        vatExemptionText: vatRate === 0 ? newItems[index]?.vatExemptionText : undefined
      };
      
      // Mettre à jour le tableau d'items en une seule fois
      setItems(newItems);
      
      console.log('Produit importé avec succès:', {
        index,
        product,
        updatedItem: newItems[index]
      });
    } catch (error) {
      console.error('Erreur lors de l\'importation du produit:', error);
    }
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
    field: "key" | "value",
    value: string
  ) => {
    const newCustomFields = [...customFields];
    newCustomFields[index] = {
      ...newCustomFields[index],
      [field]: value,
    };
    setCustomFields(newCustomFields);
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent, asDraft?: boolean) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Utiliser le paramètre asDraft s'il est fourni, sinon utiliser l'état submitAsDraft
    const isDraft = asDraft !== undefined ? asDraft : submitAsDraft;

    // Fonction utilitaire pour nettoyer les objets d'adresse (supprimer __typename)
    const cleanAddressObject = (address: any) => {
      if (!address) return undefined;
      
      // Créer un nouvel objet sans le champ __typename
      return {
        street: address.street || "",
        city: address.city || "",
        postalCode: address.postalCode || "",
        country: address.country || ""
      };
    };

    // Fonction pour obtenir les données du client sans créer de nouveau client
    const getClientData = async () => {
      // Si c'est un nouveau client, retourner les données du formulaire
      if (isNewClient) {
        // Préparer l'objet d'adresse de livraison si nécessaire
        const shippingAddressData = newClient.hasDifferentShippingAddress && newClient.shippingAddress ? {
          street: newClient.shippingAddress.street || "",
          city: newClient.shippingAddress.city || "",
          postalCode: newClient.shippingAddress.postalCode || "",
          country: newClient.shippingAddress.country || ""
        } : undefined;

        // Retourner les données du formulaire sans créer de client
        const clientData: any = {
          id: "", // ID vide, sera géré côté serveur
          type: newClient.type,
          // Pour un client particulier, on utilise la concaténation du prénom et du nom comme nom complet
          name: newClient.type === "INDIVIDUAL" 
            ? `${newClient.firstName || ''} ${newClient.lastName || ''}`.trim() 
            : newClient.name,
          email: newClient.email,
          address: {
            street: newClient.street || "",
            city: newClient.city || "",
            postalCode: newClient.postalCode || "",
            country: newClient.country || "",
          },
          hasDifferentShippingAddress: newClient.hasDifferentShippingAddress || false,
          shippingAddress: shippingAddressData,
          siret: newClient.type === "COMPANY" ? newClient.siret : undefined,
          vatNumber: newClient.type === "COMPANY" ? newClient.vatNumber : undefined,
        };
        
        // Ajouter les champs spécifiques aux particuliers
        if (newClient.type === "INDIVIDUAL") {
          clientData.firstName = newClient.firstName;
          clientData.lastName = newClient.lastName;
        }
        
        return clientData;
      } else if (quote && quote.client) {
        // Si on modifie un devis existant et que le client est déjà dans le devis
        return {
          id: quote.client.id,
          type: quote.client.type, // Utiliser le type exact du client sans valeur par défaut
          name: quote.client.name,
          email: quote.client.email,
          address: {
            street: quote.client.address?.street || "",
            city: quote.client.address?.city || "",
            postalCode: quote.client.address?.postalCode || "",
            country: quote.client.address?.country || "",
          },
          hasDifferentShippingAddress: quote.client.hasDifferentShippingAddress || false,
          shippingAddress: quote.client.hasDifferentShippingAddress ? cleanAddressObject(quote.client.shippingAddress) : undefined,
          siret: quote.client.siret || "",
          vatNumber: quote.client.vatNumber || "",
          firstName: quote.client.firstName || "",
          lastName: quote.client.lastName || "",
        };
      } else if (selectedClient && clientsData?.clients?.items) {
        // Si un client existant est sélectionné
        const selectedClientData = clientsData.clients.items.find(
          (client: any) => client.id === selectedClient
        );

        if (!selectedClientData) {
          // Si le client n'est pas trouvé, utiliser les données de l'utilisateur connecté
          const userCompany = userData?.me?.company || {};
          if (userData?.me?.firstName && userData?.me?.lastName) {
            // Créer un client de type particulier avec les données de l'utilisateur
            return {
              id: "", // ID vide, sera géré côté serveur
              type: "INDIVIDUAL",
              name: `${userData.me.firstName} ${userData.me.lastName}`,
              email: userData.me.email || "client@example.com", // Email obligatoire
              address: {
                street:
                  userCompany.address?.street || "Adresse non spécifiée",
                city: userCompany.address?.city || "Ville non spécifiée",
                postalCode: userCompany.address?.postalCode || "00000",
                country: userCompany.address?.country || "France",
              },
              hasDifferentShippingAddress: false,
              siret: "", // Pas obligatoire pour un particulier
              vatNumber: "", // Pas obligatoire pour un particulier
              firstName: userData.me.firstName || "Prénom",
              lastName: userData.me.lastName || "Nom",
            };
          } else {
            // Créer un client de type entreprise avec les données de l'entreprise de l'utilisateur
            return {
              id: "", // ID vide, sera géré côté serveur
              type: "COMPANY",
              name: userCompany.name || "Entreprise par défaut",
              email: userCompany.email || "entreprise@example.com", // Email obligatoire
              address: {
                street:
                  userCompany.address?.street || "Adresse non spécifiée",
                city: userCompany.address?.city || "Ville non spécifiée",
                postalCode: userCompany.address?.postalCode || "00000",
                country: userCompany.address?.country || "France",
              },
              hasDifferentShippingAddress: false,
              siret: userCompany.siret || "12345678901234", // Obligatoire pour une entreprise
              vatNumber: userCompany.vatNumber || "FR12345678901", // Obligatoire pour une entreprise
              firstName: "",
              lastName: "",
            };
          }
        }

        // Déterminer le type de client en fonction des champs disponibles
        let clientType = selectedClientData.type;
        if (!clientType) {
          clientType = selectedClientData.firstName && selectedClientData.lastName
            ? "INDIVIDUAL"
            : "COMPANY";
        }

        // Vérifier si les champs SIRET et TVA sont nécessaires
        const needsSiretAndVat = clientType === "COMPANY";
        const siret =
          selectedClientData.siret ||
          (needsSiretAndVat ? "12345678901234" : "");
        const vatNumber =
          selectedClientData.vatNumber ||
          (needsSiretAndVat ? "FR12345678901" : "");

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
          hasDifferentShippingAddress: selectedClientData.hasDifferentShippingAddress || false,
          shippingAddress: selectedClientData.hasDifferentShippingAddress ? cleanAddressObject(selectedClientData.shippingAddress) : undefined,
          siret: siret,
          vatNumber: vatNumber,
          firstName: selectedClientData.firstName || "",
          lastName: selectedClientData.lastName || "",
        };
      }
      
      // Si aucune des conditions ci-dessus n'est remplie, retourner un client par défaut
      return {
        id: "",
        type: "COMPANY",
        name: "Client par défaut",
        email: "client@example.com",
        address: {
          street: "",
          city: "",
          postalCode: "",
          country: "France",
        },
        hasDifferentShippingAddress: false,
        siret: "",
        vatNumber: "",
        firstName: "",
        lastName: "",
      };
    };

    try {

      // Créer un nouveau client si nécessaire
      let clientId = "";
      if (isNewClient) {
        // Validation des champs obligatoires pour les nouveaux clients
        if (newClient.type === "INDIVIDUAL") {
          if (!newClient.firstName?.trim() || !newClient.lastName?.trim()) {
            Notification.error("Pour un client particulier, le prénom et le nom sont obligatoires");
            setIsSubmitting(false);
            return;
          }
        }
        
        // Validation pour les entreprises
        if (newClient.type === "COMPANY" && !newClient.name?.trim()) {
          Notification.error("Le nom de l'entreprise est obligatoire");
          setIsSubmitting(false);
          return;
        }

        // Validation de l'email pour tous les types de clients
        if (!newClient.email?.trim()) {
          Notification.error("L'email est obligatoire pour tous les clients");
          setIsSubmitting(false);
          return;
        }

        try {
          // Préparer l'objet d'adresse de livraison si nécessaire
          const shippingAddressData = newClient.hasDifferentShippingAddress && newClient.shippingAddress ? {
            street: newClient.shippingAddress.street || "",
            city: newClient.shippingAddress.city || "",
            postalCode: newClient.shippingAddress.postalCode || "",
            country: newClient.shippingAddress.country || ""
          } : undefined;

          // Créer un nouveau client dans la base de données
          // Préparer les données du client pour la création
          const clientInput: any = {
            type: newClient.type,
            // Pour un client particulier, on utilise la concaténation du prénom et du nom comme nom complet
            name: newClient.type === "INDIVIDUAL" 
              ? `${newClient.firstName || ''} ${newClient.lastName || ''}`.trim() 
              : newClient.name,
            email: newClient.email,
            address: {
              street: newClient.street || "",
              city: newClient.city || "",
              postalCode: newClient.postalCode || "",
              country: newClient.country || "",
            },
            hasDifferentShippingAddress: newClient.hasDifferentShippingAddress || false,
            shippingAddress: shippingAddressData,
          };
          
          // Ajouter les champs spécifiques au type de client
          if (newClient.type === "COMPANY") {
            clientInput.siret = newClient.siret;
            clientInput.vatNumber = newClient.vatNumber;
          } else if (newClient.type === "INDIVIDUAL") {
            clientInput.firstName = newClient.firstName;
            clientInput.lastName = newClient.lastName;
          }
          
          const { data } = await createClient({
            variables: {
              input: clientInput,
            },
          });
          
          // Récupérer l'ID du client nouvellement créé
          clientId = data.createClient.id;
          console.log("Nouveau client créé avec l'ID:", clientId);
        } catch (error) {
          console.error("Erreur lors de la création du client:", error);
          // En cas d'erreur, on continue avec un ID vide
          clientId = "";
        }
      }

      // Récupérer les données du client
      const clientDataToSend = await getClientData();
      
      // Si un nouveau client a été créé, mettre à jour son ID
      if (isNewClient && clientId) {
        clientDataToSend.id = clientId;
      }

      // Alerte si le type n'est pas défini correctement
      if (
        !clientDataToSend.type &&
        isNewClient &&
        newClient.firstName &&
        newClient.lastName
      ) {
        console.warn(
          "ATTENTION: Le type de client devrait être INDIVIDUAL mais n'est pas défini!"
        );
      }
      
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
          address: {
            street: companyInfo.address?.street || "",
            city: companyInfo.address?.city || "",
            postalCode: companyInfo.address?.postalCode || "",
            country: companyInfo.address?.country || "",
          },
          // Suppression du champ legalForm qui n'est pas défini dans le schéma GraphQL
          siret: companyInfo.siret || "",
          vatNumber: companyInfo.vatNumber || "",
          logo: companyInfo.logo || "",
          transactionCategory: companyInfo.transactionCategory,
          // Inclure les coordonnées bancaires si l'option useBankDetails est activée
          bankDetails: useBankDetails && userData?.me?.company?.bankDetails ? {
            iban: userData.me.company.bankDetails.iban || "",
            bic: userData.me.company.bankDetails.bic || "",
            bankName: userData.me.company.bankDetails.bankName || ""
          } : undefined
        },
        // Suppression du champ useBankDetails qui n'est pas défini dans le schéma GraphQL
        items: items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          vatRate: item.vatRate,
          unit: item.unit,
          discount: item.discount,
          discountType: item.discountType,
          details: item.details,
          vatExemptionText: item.vatExemptionText,
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
        client: clientDataToSend,
      };

      let result;

      if (!quote) {
        // Pour la création, on laisse le backend générer un numéro unique
        const createQuoteData = {
          ...commonQuoteData,
          number: quoteNumber,
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
          // Pour la mise à jour, nous devons toujours envoyer un objet client complet avec tous les champs requis
          
          // Préparer les données du client pour la mise à jour
          let clientForUpdate;
          
          if (isNewClient) {
            // Si c'est un nouveau client, utiliser les données du nouveau client
            clientForUpdate = getClientData();
          } else if (selectedClient && clientsData?.clients?.items) {
            // Si un client existant est sélectionné, utiliser ses données complètes
            const selectedClientData = clientsData.clients.items.find(
              (client: any) => client.id === selectedClient
            );
            
            if (selectedClientData) {
              clientForUpdate = {
                id: selectedClient,
                type: selectedClientData.type || 'COMPANY',
                name: selectedClientData.name || '',
                email: selectedClientData.email || '',
                address: cleanAddressObject(selectedClientData.address) || {
                  street: '',
                  city: '',
                  postalCode: '',
                  country: ''
                },
                // Utiliser les données d'adresse de livraison du client sélectionné
                hasDifferentShippingAddress: selectedClientData.hasDifferentShippingAddress || false,
                shippingAddress: selectedClientData.hasDifferentShippingAddress && selectedClientData.shippingAddress ? 
                  cleanAddressObject(selectedClientData.shippingAddress) : undefined,
                siret: selectedClientData.siret || '',
                vatNumber: selectedClientData.vatNumber || '',
                firstName: selectedClientData.firstName || '',
                lastName: selectedClientData.lastName || ''
              };
            } else {
              // Si le client sélectionné n'est pas trouvé, utiliser le client du devis existant
              clientForUpdate = {
                id: quote?.client?.id,
                type: quote?.client?.type || 'COMPANY',
                name: quote?.client?.name || '',
                email: quote?.client?.email || '',
                address: cleanAddressObject(quote?.client?.address) || {
                  street: '',
                  city: '',
                  postalCode: '',
                  country: ''
                },
                // Utiliser les données d'adresse de livraison du client existant
                hasDifferentShippingAddress: quote?.client?.hasDifferentShippingAddress || false,
                shippingAddress: quote?.client?.hasDifferentShippingAddress && quote?.client?.shippingAddress ? 
                  cleanAddressObject(quote?.client?.shippingAddress) : undefined,
                siret: quote?.client?.siret || '',
                vatNumber: quote?.client?.vatNumber || '',
                firstName: quote?.client?.firstName || '',
                lastName: quote?.client?.lastName || ''
              };
            }
          } else {
            // Si aucun client n'est sélectionné, utiliser le client du devis existant
            clientForUpdate = {
              id: quote?.client?.id,
              type: quote?.client?.type || 'COMPANY',
              name: quote?.client?.name || '',
              email: quote?.client?.email || '',
              address: cleanAddressObject(quote?.client?.address) || {
                street: '',
                city: '',
                postalCode: '',
                country: ''
              },
              // Utiliser les données d'adresse de livraison du client existant
              hasDifferentShippingAddress: quote?.client?.hasDifferentShippingAddress || false,
              shippingAddress: quote?.client?.hasDifferentShippingAddress && quote?.client?.shippingAddress ? 
                cleanAddressObject(quote?.client?.shippingAddress) : undefined,
              siret: quote?.client?.siret || '',
              vatNumber: quote?.client?.vatNumber || '',
              firstName: quote?.client?.firstName || '',
              lastName: quote?.client?.lastName || ''
            };
          }
          
          // Créer l'objet de données pour la mise à jour avec le client correctement formaté
          const updateQuoteData = {
            ...commonQuoteData,
            number: quoteNumber,
            client: clientForUpdate
          };
          
          // Ajouter des logs pour déboguer
          console.log('Mise à jour du devis avec les données:', updateQuoteData);
          console.log('Client sélectionné ID:', selectedClient);
          console.log('Client pour mise à jour:', clientForUpdate);

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
        Notification.error(
          "Une erreur est survenue lors de la création du devis"
        );
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
