import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Notification } from '../components/feedback/Notification';
import { 
  CREATE_INVOICE_MUTATION, 
  UPDATE_INVOICE_MUTATION,
  GET_NEXT_INVOICE_NUMBER
} from '../graphql/invoices';
import { GET_INVOICES } from '../graphql/queries';
import { GET_CLIENTS, CREATE_CLIENT } from '../graphql/client';
import { GET_USER_INFO } from '../graphql/queries';
import { Item, CustomField, Client, CompanyInfo } from '../types';

export interface UseInvoiceFormProps {
  invoice?: any;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  showNotifications?: boolean;
}

export const useInvoiceForm = ({ 
  invoice, 
  onClose, 
  onSubmit, 
  showNotifications = false
}: UseInvoiceFormProps) => {
  // États du formulaire
  const [selectedClient, setSelectedClient] = useState<string>(() => {
    return invoice?.client?.id || '';
  });
  const [isNewClient, setIsNewClient] = useState(false);
  
  // Initialiser newClient avec des valeurs par défaut ou les valeurs de l'invoice si disponibles
  const defaultNewClient = {
    type: 'COMPANY', // Type par défaut: entreprise
    name: '',
    email: '',
    street: '',
    city: '',
    country: '',
    postalCode: '',
    // Champs spécifiques aux entreprises
    siret: '',
    vatNumber: '',
    // Champs spécifiques aux particuliers
    firstName: '',
    lastName: ''
  };
  
  const [newClient, setNewClient] = useState(defaultNewClient);
  
  // Fonction pour réinitialiser le nouveau client
  const resetNewClient = () => {
    setNewClient(defaultNewClient);
  };
  
  // Fonction personnalisée pour gérer le changement de mode client
  const handleClientModeChange = (isNew: boolean) => {
    
    // Prévenir les appels inutiles si l'état ne change pas
    if (isNew === isNewClient) {
      return;
    }
    
    // Mettre à jour l'état
    setIsNewClient(isNew);
    
    // Si on passe à nouveau client, réinitialiser les données du nouveau client
    if (isNew) {
      resetNewClient();
    }
  };
  const [items, setItems] = useState<Item[]>(
    invoice?.items ? invoice.items.map((item: any) => ({
      ...item,
      quantity: parseFloat(item.quantity.toString()),
      unitPrice: parseFloat(item.unitPrice.toString()),
      vatRate: parseFloat(item.vatRate?.toString() || '20'),
      unit: item.unit || 'unité',
      discount: item.discount || 0,
      discountType: item.discountType || 'FIXED',
      details: item.details || ''
    })) : [{ description: '', quantity: 1, unitPrice: 0, vatRate: 20, unit: 'unité', discount: 0, discountType: 'FIXED' }]
  );
  // Ne pas définir de statut par défaut, laisser le backend le gérer
  const [status, setStatus] = useState(invoice?.status || '');
  const [submitAsDraft, setSubmitAsDraft] = useState(false);
  
  // Nous n'utilisons plus cet effet car nous allons forcer le statut directement dans handleSubmit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [headerNotes, setHeaderNotes] = useState(invoice?.headerNotes || '');
  const [footerNotes, setFooterNotes] = useState(invoice?.footerNotes || '');
  const [termsAndConditions, setTermsAndConditions] = useState(invoice?.termsAndConditions || '');
  const [termsAndConditionsLinkTitle, setTermsAndConditionsLinkTitle] = useState(invoice?.termsAndConditionsLinkTitle || '');
  const [termsAndConditionsLink, setTermsAndConditionsLink] = useState(invoice?.termsAndConditionsLink || '');
  const [discount, setDiscount] = useState<number>(invoice?.discount || 0);
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>(invoice?.discountType || 'FIXED');
  const [customFields, setCustomFields] = useState<CustomField[]>(
    invoice?.customFields || []
  );
  const [isDeposit, setIsDeposit] = useState(invoice?.isDeposit || false);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [invoicePrefix, setInvoicePrefix] = useState<string>(invoice?.prefix || (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `F-${year}${month}-`;
  })());
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState<string>(invoice?.purchaseOrderNumber || '');
  // Helper function to safely format dates
  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    try {
      let date: Date;
      
      // Check if dateString is a timestamp (number)
      if (!isNaN(Number(dateString))) {
        // It's a timestamp, convert to number and create Date
        date = new Date(Number(dateString));
      } else {
        // Try to parse as regular date string
        date = new Date(dateString);
      }
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error("Error parsing date:", error);
      // If there's any error parsing the date, return today's date
      return new Date().toISOString().split('T')[0];
    }
  };

  const [issueDate, setIssueDate] = useState(formatDate(invoice?.issueDate));
  const [executionDate, setExecutionDate] = useState(formatDate(invoice?.executionDate));
  const [dueDate, setDueDate] = useState(formatDate(invoice?.dueDate));
  const [hasDifferentShippingAddress, setHasDifferentShippingAddress] = useState(invoice?.hasDifferentShippingAddress || false);
  const [shippingAddress, setShippingAddress] = useState(invoice?.shippingAddress || {
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const defaultCompanyInfo: CompanyInfo = {
    name: '',
    email: '',
    phone: '',
    website: '',
    siret: '',
    vatNumber: '',
    logo: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    bankDetails: undefined
  };

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
    if (invoice?.companyInfo) {
      const { bankDetails, ...rest } = invoice.companyInfo;
      return {
        ...rest,
        bankDetails: bankDetails ? {
          iban: bankDetails.iban,
          bic: bankDetails.bic,
          bankName: bankDetails.bankName
        } : undefined
      };
    }
    return defaultCompanyInfo;
  });
  const [useBankDetails, setUseBankDetails] = useState(false);
  const [bankDetailsComplete, setBankDetailsComplete] = useState(false);
  const [bankDetailsReadOnly, setBankDetailsReadOnly] = useState(false);

  // Requêtes GraphQL
  // Utiliser une limite élevée pour récupérer tous les clients d'un coup
  const { data: clientsData } = useQuery(GET_CLIENTS, {
    variables: {
      page: 1,
      limit: 1000, // Limite élevée pour récupérer tous les clients
      search: ""
    }
  });
  const { data: userData } = useQuery(GET_USER_INFO);
  const { data: invoicesData, refetch: refetchInvoices } = useQuery(GET_INVOICES);
  const { data: nextInvoiceNumberData, refetch: refetchNextInvoiceNumber } = useQuery(GET_NEXT_INVOICE_NUMBER, {
    variables: { prefix: invoicePrefix },
    skip: !!invoice?.number // Ne pas exécuter si on modifie une facture existante
  });

  // Mutations GraphQL
  const [createInvoice] = useMutation(CREATE_INVOICE_MUTATION, {
    onCompleted: () => {
      if (showNotifications) {
        Notification.success('Facture créée avec succès', {
          position: 'bottom-left'
        });
      }
      onClose();
    },
    refetchQueries: [
      { query: GET_INVOICES },
      'GetInvoices'
    ],
    onError: (error) => {
      if (showNotifications) {
        Notification.error('Erreur lors de la création de la facture', {
          position: 'bottom-left'
        });
      }
      console.error('Error creating invoice:', error);
    },
  });

  const [updateInvoice] = useMutation(UPDATE_INVOICE_MUTATION, {
    onCompleted: () => {
      if (showNotifications) {
        Notification.success('Facture modifiée avec succès', {
          position: 'bottom-left'
        });
      }
      refetchInvoices();
      onClose();
    },
    refetchQueries: [
      { query: GET_INVOICES },
      'GetInvoices'
    ],
    onError: (error) => {
      if (showNotifications) {
        Notification.error('Erreur lors de la modification de la facture', {
          position: 'bottom-left'
        });
      }
      console.error('Error updating invoice:', error);
    },
  });

  const [createClient] = useMutation(CREATE_CLIENT, {
    onError: (error) => {
      if (showNotifications) {
        Notification.error('Erreur lors de la création du client', {
          position: 'bottom-left'
        });
      }
      console.error('Error creating client:', error);
    },
  });

  // Effets
  useEffect(() => {
    // Vérifier si la facture a des coordonnées bancaires non vides
    if (invoice?.companyInfo?.bankDetails) {
      const { iban, bic, bankName } = invoice.companyInfo.bankDetails;
      const hasBankDetails = Boolean(iban || bic || bankName);
      setUseBankDetails(hasBankDetails);
    }
  }, [invoice]);

  // Initialiser le préfixe de facture avec celui de la dernière facture créée
  useEffect(() => {
    if (!invoice && invoicesData?.invoices?.invoices?.length > 0) {
      // Trier les factures par date de création (la plus récente en premier)
      const sortedInvoices = [...invoicesData.invoices.invoices].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      // Utiliser le préfixe de la facture la plus récente
      if (sortedInvoices.length > 0 && sortedInvoices[0].prefix) {
        setInvoicePrefix(sortedInvoices[0].prefix);
      }
    }
  }, [invoice, invoicesData]);

  // Initialiser automatiquement le numéro de facture
  useEffect(() => {
    if (invoice?.number) {
      // Si on modifie une facture existante, utiliser son numéro
      setInvoiceNumber(invoice.number);
    } else if (nextInvoiceNumberData?.nextInvoiceNumber) {
      // Si on a récupéré le prochain numéro de facture via l'API, l'utiliser
      setInvoiceNumber(nextInvoiceNumberData.nextInvoiceNumber);
    } else if (invoicesData?.invoices?.invoices?.length > 0) {
      // Sinon, trouver le plus grand numéro de facture et l'incrémenter
      try {
        const invoices = invoicesData.invoices.invoices;
        const samePrefix = invoices.filter((inv: { prefix: string; number: string }) => inv.prefix === invoicePrefix);
        
        if (samePrefix.length > 0) {
          // Trouver le plus grand numéro avec le même préfixe
          const maxNumber = Math.max(...samePrefix.map((inv: { prefix: string; number: string }) => 
            parseInt(inv.number, 10) || 0
          ));
          
          // Incrémenter et formater avec des zéros
          const nextNumber = String(maxNumber + 1).padStart(6, '0');
          setInvoiceNumber(nextNumber);
        } else {
          // Si aucune facture avec ce préfixe, commencer à 1
          setInvoiceNumber('000001');
        }
      } catch (error) {
        console.error('Erreur lors du calcul du numéro de facture:', error);
        setInvoiceNumber('000001');
      }
    } else {
      // Par défaut, commencer à 1
      setInvoiceNumber('000001');
    }
  }, [invoice, nextInvoiceNumberData, invoicesData, invoicePrefix]);

  useEffect(() => {
    // Mettre à jour les coordonnées bancaires quand useBankDetails change ou quand userData est disponible
    if (useBankDetails && userData?.me?.company?.bankDetails) {
      const { iban, bic, bankName } = userData.me.company.bankDetails;
      setCompanyInfo(prev => ({
        ...prev,
        bankDetails: { iban, bic, bankName }
      }));
    }
  }, [useBankDetails, userData]);

  useEffect(() => {
    // Vérifier si tous les champs bancaires sont remplis
    const allBankDetailsComplete = companyInfo.bankDetails && (
      companyInfo.bankDetails.iban &&
      companyInfo.bankDetails.bic &&
      companyInfo.bankDetails.bankName
    );
    setBankDetailsComplete(!!allBankDetailsComplete);
  }, [companyInfo.bankDetails]);

  useEffect(() => {
    // Réexécuter la requête pour le prochain numéro de facture lorsque le préfixe change
    if (!invoice?.number) {
      refetchNextInvoiceNumber({ prefix: invoicePrefix });
    }
  }, [invoicePrefix, refetchNextInvoiceNumber, invoice]);

  useEffect(() => {
    // Mettre à jour purchaseOrderNumber lorsque la facture change
    if (invoice && invoice.purchaseOrderNumber) {
      setPurchaseOrderNumber(invoice.purchaseOrderNumber);
    }
  }, [invoice]);

  useEffect(() => {
    if (invoice && invoice.termsAndConditions) {
      setTermsAndConditions(invoice.termsAndConditions);
    }
    if (invoice && invoice.footerNotes) {
      setFooterNotes(invoice.footerNotes);
    }
  }, [invoice]);

  useEffect(() => {
    // Mettre à jour les liens des conditions générales lorsque la facture change
    if (invoice && invoice.termsAndConditionsLinkTitle) {
      setTermsAndConditionsLinkTitle(invoice.termsAndConditionsLinkTitle);
    }
    if (invoice && invoice.termsAndConditionsLink) {
      setTermsAndConditionsLink(invoice.termsAndConditionsLink);
    }
  }, [invoice]);

  useEffect(() => {
    if (userData?.me?.company) {
      // Assurer que l'adresse est toujours définie
      const company = userData.me.company;
      setCompanyInfo({
        ...company,
        address: company.address || {
          street: '',
          city: '',
          postalCode: '',
          country: ''
        }
      });
    }
  }, [userData?.me?.company]);

  // Handlers
  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, vatRate: 20, unit: 'unité', discount: 0, discountType: 'FIXED' }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };
  
  // Fonction pour mettre à jour un item complet avec les données d'un produit
  const handleProductSelect = (index: number, product: {
    id: string;
    name: string;
    description?: string;
    unitPrice?: number;
    vatRate?: number;
    unit?: string;
  }) => {    
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
    
  };

  const handleAddCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }]);
  };

  const handleRemoveCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleCustomFieldChange = (index: number, field: 'key' | 'value', value: string) => {
    const newCustomFields = [...customFields];
    newCustomFields[index][field] = value;
    setCustomFields(newCustomFields);
  };

  const calculateTotals = () => {
    let totalHT = 0;
    let totalVAT = 0;

    items.forEach(item => {
      let itemHT = item.quantity * item.unitPrice;
      
      // Appliquer la remise au niveau de l'item si elle existe
      if (item.discount) {
        if (item.discountType === 'PERCENTAGE') {
          itemHT = itemHT * (1 - (item.discount / 100));
        } else {
          itemHT = Math.max(0, itemHT - item.discount);
        }
      }
      
      const itemVAT = itemHT * (item.vatRate / 100);
      totalHT += itemHT;
      totalVAT += itemVAT;
    });

    const totalTTC = totalHT + totalVAT;

    let discountAmount = 0;
    if (discount) {
      if (discountType === 'PERCENTAGE') {
        discountAmount = (totalHT * discount) / 100;
      } else {
        discountAmount = discount;
      }
    }

    // Vérifier si la remise est supérieure au total HT
    // Si c'est le cas, limiter finalTotalHT à 0 (et non pas négatif)
    const finalTotalHT = Math.max(0, totalHT - discountAmount);
    const finalTotalTTC = finalTotalHT + totalVAT;

    return {
      totalHT,
      totalVAT,
      totalTTC,
      finalTotalHT,
      finalTotalTTC,
      discountAmount
    };
  };

  const handleSubmit = async (e: React.FormEvent, asDraft?: boolean) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Utiliser asDraft s'il est fourni, sinon utiliser submitAsDraft (pour compatibilité)
    const isDraft = asDraft !== undefined ? asDraft : submitAsDraft;
    
    // Mettre à jour submitAsDraft pour la cohérence
    if (isDraft !== submitAsDraft) {
      setSubmitAsDraft(isDraft);
    }
    
    // Déterminer le statut à utiliser
    let status;
    if (isDraft) {
      // Si on demande explicitement un brouillon, utiliser DRAFT
      status = 'DRAFT';
    } else if (invoice && invoice.status === 'DRAFT') {
      // Si on met à jour une facture existante qui est en brouillon, conserver son statut DRAFT
      status = 'DRAFT';
    } else {
      // Sinon (nouvelle facture ou facture non-brouillon), utiliser PENDING
      status = 'PENDING';
    }

    try {
      if (!userData?.me?.company) {
        if (showNotifications) {
          Notification.error('Veuillez configurer vos informations d\'entreprise avant de créer une facture', {
            position: 'bottom-left'
          });
        }
        setIsSubmitting(false);
        return;
      }
      // Calculer les totaux pour la facture (utilisés dans les logs et pour vérification)
      calculateTotals();
      
      // S'assurer que le client sélectionné est bien défini, sinon utiliser celui de la facture existante
    const effectiveSelectedClient = selectedClient || (invoice?.client?.id || '');
    
    // Vérifier que clients est un tableau avant d'utiliser find()
    // Utiliser items car clientsData.clients est un objet avec une propriété items qui contient le tableau des clients
    const clients = clientsData?.clients?.items || [];
    
    // Rechercher le client sélectionné dans la liste des clients
    // Utiliser une variable locale différente pour éviter toute confusion avec la variable globale
    const localSelectedClientData = !isNewClient ? (Array.isArray(clients) ? clients.find((c: Client) => c.id === effectiveSelectedClient) : null) : null;
      
      // Fonction pour récupérer les données complètes du client
      const getClientData = () => {
        if (isNewClient) {
          // Déterminer le type de client en fonction des champs remplis
          let clientType = newClient.type || 'COMPANY';
          // Si firstName et lastName sont remplis, c'est un particulier
          if (newClient.firstName && newClient.lastName) {
            clientType = 'INDIVIDUAL';
          }
          
          // Si c'est un nouveau client, on utilise les données saisies
          return {
            type: clientType,
            name: newClient.name,
            email: newClient.email || "client@example.com", // Email obligatoire
            address: {
              street: newClient.street || "Adresse non spécifiée",
              city: newClient.city || "Ville non spécifiée",
              postalCode: newClient.postalCode || "00000",
              country: newClient.country || "France",
            },
            // Champs spécifiques aux entreprises
            siret: clientType === 'COMPANY' ? (newClient.siret || "12345678901234") : "",
            vatNumber: clientType === 'COMPANY' ? (newClient.vatNumber || "FR12345678901") : "",
            // Champs spécifiques aux particuliers
            firstName: newClient.firstName || "",
            lastName: newClient.lastName || ""
          };
        } else {
          // Si on modifie une facture existante et que le client est déjà dans la facture
          if (invoice && invoice.client) {
            // S'assurer que les champs SIRET et TVA sont renseignés pour les entreprises
            const clientType = invoice.client.type || 'COMPANY';
            const needsSiretAndVat = clientType === 'COMPANY';
            
            // Toujours fournir des valeurs par défaut pour SIRET et TVA si le client est une entreprise
            const siret = invoice.client.siret || (needsSiretAndVat ? "12345678901234" : "");
            const vatNumber = invoice.client.vatNumber || (needsSiretAndVat ? "FR12345678901" : "");
            
            return {
              id: invoice.client.id,
              type: clientType,
              name: invoice.client.name,
              email: invoice.client.email || "client@example.com",
              address: {
                street: invoice.client.address?.street || "Adresse non spécifiée",
                city: invoice.client.address?.city || "Ville non spécifiée",
                postalCode: invoice.client.address?.postalCode || "00000",
                country: invoice.client.address?.country || "France",
              },
              siret: siret,
              vatNumber: vatNumber,
              firstName: invoice.client.firstName || "",
              lastName: invoice.client.lastName || ""
            };
          }
          
          // Si un client existant est sélectionné, utiliser ses données
          if (localSelectedClientData) {            
            // Déterminer le type de client en fonction des champs remplis ou utiliser le type existant
            let clientType = localSelectedClientData.type || 'COMPANY';
            // Si firstName et lastName sont remplis et qu'il n'y a pas de type défini, c'est un particulier
            if (!localSelectedClientData.type && localSelectedClientData.firstName && localSelectedClientData.lastName) {
              clientType = 'INDIVIDUAL';
            }
            
            // Déterminer si on a besoin de SIRET et TVA (uniquement pour les entreprises)
            const needsSiretAndVat = clientType === 'COMPANY';
            
            const siret = localSelectedClientData.siret || (needsSiretAndVat ? "12345678901234" : "");
            const vatNumber = localSelectedClientData.vatNumber || (needsSiretAndVat ? "FR12345678901" : "");
            
            return {
              id: localSelectedClientData.id,
              type: clientType,
              name: localSelectedClientData.name,
              email: localSelectedClientData.email || "client@example.com", // Email obligatoire
              address: {
                street: localSelectedClientData.address?.street || "Adresse non spécifiée",
                city: localSelectedClientData.address?.city || "Ville non spécifiée",
                postalCode: localSelectedClientData.address?.postalCode || "00000",
                country: localSelectedClientData.address?.country || "France",
              },
              siret,
              vatNumber,
              firstName: localSelectedClientData.firstName || "",
              lastName: localSelectedClientData.lastName || ""
            };
          }
          
          // Si aucun client n'est sélectionné, utiliser les données de l'utilisateur comme fallback
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
      };
      
      // Récupérer les données complètes du client
      const clientData = getClientData();

      let clientId = clientData.id || effectiveSelectedClient;

      // If it's a new client, create it first
      if (isNewClient) {
        try {
          const { data: newClientData } = await createClient({
            variables: {
              input: {
                name: newClient.name,
                email: newClient.email,
                type: newClient.type, // Ajout du type de client
                firstName: newClient.firstName, // Ajout du prénom pour les particuliers
                lastName: newClient.lastName, // Ajout du nom pour les particuliers
                address: {
                  street: newClient.street,
                  city: newClient.city,
                  postalCode: newClient.postalCode,
                  country: newClient.country
                },
                siret: newClient.siret,
                vatNumber: newClient.vatNumber
              }
            }
          });
          clientId = newClientData.createClient.id;
          if (showNotifications) {
            Notification.success('Client créé avec succès', {
              position: 'bottom-left'
            });
          }
        } catch (error) {
          if (showNotifications) {
            Notification.error('Erreur lors de la création du client', {
              position: 'bottom-left'
            });
          }
          console.error('Error:', error);
          setIsSubmitting(false);
          return;
        }
      }

      // Utiliser les valeurs actuelles des champs bancaires
      // Si la case est cochée et qu'au moins un champ est rempli, envoyer les coordonnées bancaires
      const bankDetails = useBankDetails ? {
        iban: companyInfo.bankDetails?.iban,
        bic: companyInfo.bankDetails?.bic,
        bankName: companyInfo.bankDetails?.bankName
      } : {iban: "", bic: "", bankName: ""};

      // Nettoyer les champs personnalisés en ne gardant que key et value
      const cleanCustomFields = customFields
        .filter(field => field.key && field.value)
        .map(({ key, value }) => ({ key, value }));

      const invoiceData = {
        client: {
          id: isNewClient ? clientId : (clientData.id || effectiveSelectedClient),
          type: clientData.type,
          name: clientData.name,
          email: clientData.email,
          address: {
            street: clientData.address.street,
            city: clientData.address.city,
            postalCode: clientData.address.postalCode,
            country: clientData.address.country
          },
          // Champs spécifiques aux entreprises
          siret: clientData.siret,
          vatNumber: clientData.vatNumber,
          // Champs spécifiques aux particuliers
          firstName: clientData.firstName,
          lastName: clientData.lastName
        },
        items: items.map(({ id, ...item }) => ({
          description: item.description,
          quantity: parseFloat(item.quantity.toString()),
          unitPrice: parseFloat(item.unitPrice.toString()),
          vatRate: parseFloat(item.vatRate.toString()),
          unit: item.unit || 'unité',
          discount: item.discount || 0,
          discountType: item.discountType || 'FIXED',
          details: item.details || ''
        })),
        // Utiliser le statut déterminé plus haut
        status: status,
        headerNotes,
        footerNotes,
        termsAndConditions,
        termsAndConditionsLinkTitle,
        termsAndConditionsLink,
        discount,
        discountType,
        companyInfo: {
          name: companyInfo.name,
          email: companyInfo.email,
          phone: companyInfo.phone,
          website: companyInfo.website,
          siret: companyInfo.siret,
          vatNumber: companyInfo.vatNumber,
          logo: companyInfo.logo,
          address: {
            street: companyInfo.address.street,
            city: companyInfo.address.city,
            postalCode: companyInfo.address.postalCode,
            country: companyInfo.address.country
          },
          bankDetails
        },
        customFields: cleanCustomFields,
        isDeposit,
        issueDate,
        executionDate: executionDate || null,
        dueDate,
        number: invoiceNumber,
        prefix: invoicePrefix,
        purchaseOrderNumber
      };

      if (!invoice) {
        // Creating new invoice
        try {
          // Récupérer une dernière fois le numéro de facture pour s'assurer qu'il est unique
          const freshInvoiceNumber = invoiceNumber;          
          // Mettre à jour le numéro dans les données de la facture
          const finalInvoiceData = {
            ...invoiceData,
            number: freshInvoiceNumber
          };
          
          await createInvoice({
            variables: {
              input: finalInvoiceData
            }
          });
          if (onSubmit) onSubmit(finalInvoiceData);
        } catch (error) {
          if (showNotifications) {
            Notification.error('Erreur lors de la création de la facture', {
              position: 'bottom-left'
            });
          }
          console.error('Error:', error);
        }
      } else {
        // Updating existing invoice
        try {
          await updateInvoice({
            variables: {
              id: invoice.id,
              input: invoiceData
            }
          });
          if (onSubmit) onSubmit(invoiceData);
        } catch (error) {
          if (showNotifications) {
            Notification.error('Erreur lors de la modification de la facture', {
              position: 'bottom-left'
            });
          }
          console.error('Error:', error);
        }
      }
    } catch (error) {
      if (showNotifications) {
        Notification.error('Erreur lors de la soumission de la facture', {
          position: 'bottom-left'
        });
      }
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
      setSubmitAsDraft(false);
    }
  };

  // Récupérer l'URL de l'API à partir des variables d'environnement ou utiliser une valeur par défaut
  const apiUrl = import.meta.env.VITE_API_URL + "/" || 'http://localhost:4000';

  return {
    // États
    selectedClient,
    setSelectedClient,
    isNewClient,
    setIsNewClient,
    handleClientModeChange,
    newClient,
    setNewClient,
    items,
    setItems,
    status,
    setStatus,
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
    setCustomFields,
    isDeposit,
    setIsDeposit,
    invoiceNumber,
    setInvoiceNumber,
    invoicePrefix,
    setInvoicePrefix,
    purchaseOrderNumber,
    setPurchaseOrderNumber,
    issueDate,
    setIssueDate,
    executionDate,
    setExecutionDate,
    dueDate,
    setDueDate,
    companyInfo,
    setCompanyInfo,
    useBankDetails,
    setUseBankDetails,
    bankDetailsComplete,
    bankDetailsReadOnly,
    setBankDetailsReadOnly,
    hasDifferentShippingAddress,
    setHasDifferentShippingAddress,
    shippingAddress,
    setShippingAddress,
    
    // Données
    clientsData,
    userData,
    invoicesData,
    nextInvoiceNumberData,
    
    // Fonctions utilitaires
    formatDate,
    calculateTotals,
    
    // Handlers
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleProductSelect, // Nouvelle fonction pour mettre à jour un item complet
    handleAddCustomField,
    handleRemoveCustomField,
    handleCustomFieldChange,
    handleSubmit,
    
    // Constantes
    apiUrl,
    isSubmitting,
    setSubmitAsDraft
  };
};