import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { 
  DELETE_INVOICE_MUTATION,
  CHANGE_INVOICE_STATUS_MUTATION 
} from '../graphql/invoices';
import { GET_INVOICES } from '../graphql/queries';
import { Notification } from '../components/feedback';
import { formatDateShort } from '../utils/date';
import { useLocation } from 'react-router-dom';

// Type pour les onglets de filtrage
export type TabType = 'DRAFT' | 'PENDING' | 'COMPLETED' | null;

export const useInvoices = () => {
  // États locaux
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [quoteId, setQuoteId] = useState<string | null>(null);

  const location = useLocation();
  // const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const quoteIdParam = urlParams.get('quoteId');
    if (quoteIdParam) {
      setQuoteId(quoteIdParam);
    }
  }, [location.search]);

  const rowsPerPageOptions = [5, 10, 25, 50];

  // Requête pour récupérer les factures avec optimisation de performance
  const { loading, error, data, refetch } = useQuery(GET_INVOICES, {
    variables: {
      status: activeTab,
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm || undefined
    },
    fetchPolicy: 'network-only', // Forcer une requête réseau pour obtenir les données les plus récentes
    notifyOnNetworkStatusChange: true, // Pour détecter les changements d'état du réseau
  });

  // Filtrer les factures en fonction du terme de recherche
  const filteredInvoices = data?.invoices.invoices.filter(invoice => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();

    // Format the date for comparison
    const formattedDate = formatDateShort(invoice.createdAt).toLowerCase();
    
    // Format the price for comparison
    const formattedPrice = `${invoice.totalTTC.toFixed(2)} €`.toLowerCase();
    const priceNumber = invoice.totalTTC;

    // Try to parse the search term as a number for price comparison
    const searchNumber = parseFloat(searchTerm.replace(',', '.'));
    const isPriceSearch = !isNaN(searchNumber);

    return (
      invoice.number.toLowerCase().includes(searchLower) ||
      invoice.client.name.toLowerCase().includes(searchLower) ||
      invoice.client.email.toLowerCase().includes(searchLower) ||
      formattedDate.includes(searchLower) ||
      formattedPrice.includes(searchLower) ||
      (isPriceSearch && Math.abs(priceNumber - searchNumber) < 0.01) // Compare prices with small tolerance
    );
  }) || [];

  // Gestion de la pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  // Mutations pour les opérations CRUD
  const [deleteInvoice] = useMutation(DELETE_INVOICE_MUTATION, {
    onCompleted: () => {
      // Forcer une mise à jour immédiate du cache et une requête réseau
      refetch();
      Notification.success('Facture supprimée avec succès', {
        duration: 5000,
        position: 'bottom-left'
      });
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la suppression de la facture: ${error.message}`, {
        duration: 8000,
        position: 'bottom-left'
      });
    },
    update: (cache, { data: { deleteInvoice } }) => {
      // Mise à jour manuelle du cache pour supprimer immédiatement la facture de l'UI
      if (deleteInvoice && deleteInvoice.id) {
        // Récupérer les données actuelles du cache
        const existingData = cache.readQuery({
          query: GET_INVOICES,
          variables: {
            status: activeTab,
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm || undefined
          }
        });
        
        if (existingData && existingData.invoices) {
          // Filtrer la facture supprimée
          const updatedInvoices = existingData.invoices.invoices.filter(
            (invoice: any) => invoice.id !== deleteInvoice.id
          );
          
          // Mettre à jour le cache avec les nouvelles données
          cache.writeQuery({
            query: GET_INVOICES,
            variables: {
              status: activeTab,
              page: currentPage,
              limit: itemsPerPage,
              search: searchTerm || undefined
            },
            data: {
              invoices: {
                ...existingData.invoices,
                invoices: updatedInvoices,
                totalCount: existingData.invoices.totalCount - 1
              }
            }
          });
        }
      }
    }
  });

  const [changeInvoiceStatus] = useMutation(CHANGE_INVOICE_STATUS_MUTATION, {
    onCompleted: () => {
      refetch();
      Notification.success('Statut de la facture mis à jour avec succès', {
        duration: 5000,
        position: 'bottom-left'
      });
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la mise à jour du statut de la facture: ${error.message}`, {
        duration: 8000,
        position: 'bottom-left'
      });
    }
  });

  // Fonctions de gestion des factures
  const handleCreateInvoice = (/* invoiceData: any */) => {
    // La création se fait maintenant entièrement dans useInvoiceForm
    // Cette fonction est appelée par onSubmit du InvoiceFormModal
    // et sert juste à fermer le modal et rafraîchir les données
    setIsCreateModalOpen(false);
    // Forcer une mise à jour complète pour récupérer les données les plus récentes
    refetch();
    Notification.success('Facture créée avec succès', {
      duration: 5000,
      position: 'bottom-left'
    });
  };

  const handleUpdateInvoice = (/* id: string, invoiceData: any */) => {
    // La mise à jour se fait maintenant entièrement dans useInvoiceForm
    // Cette fonction est appelée par onSubmit du InvoiceFormModal
    // et sert juste à fermer le modal et rafraîchir les données
    setIsEditModalOpen(false);
    // Forcer une mise à jour complète pour récupérer les données les plus récentes
    refetch();
    Notification.success('Facture mise à jour avec succès', {
      duration: 5000,
      position: 'bottom-left'
    });
  };

  const handleDeleteInvoice = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      // Appeler la mutation avec l'ID de la facture à supprimer
      deleteInvoice({
        variables: { id },
        // Optimistic UI: supprimer immédiatement la facture de l'interface avant que la requête ne soit terminée
        optimisticResponse: {
          __typename: 'Mutation',
          deleteInvoice: {
            __typename: 'Invoice',
            id: id,
            success: true
          }
        }
      });
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    changeInvoiceStatus({
      variables: {
        id,
        status: newStatus,
      },
    });
  };

  return {
    // États
    selectedInvoice,
    setSelectedInvoice,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    activeTab,
    setActiveTab,
    isSidebarOpen,
    setIsSidebarOpen,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    rowsPerPageOptions,
    quoteId,
    setQuoteId,
    
    // Données
    loading,
    error,
    data,
    filteredInvoices,
    
    // Fonctions
    handlePageChange,
    handleCreateInvoice,
    handleUpdateInvoice,
    handleDeleteInvoice,
    handleStatusChange,
    refetch
  };
};