import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { 
  DELETE_QUOTE_MUTATION,
  CHANGE_QUOTE_STATUS_MUTATION,
  GET_QUOTES,
  GET_QUOTE_STATS
} from '../graphql/quotes';
import { Notification } from '../../../components/';
import { Quote } from '../../../types';

// Type pour les onglets de filtrage
export type TabType = 'DRAFT' | 'PENDING' | 'COMPLETED' | 'CANCELED' | null;

export const useQuotes = () => {
  // États locaux
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const rowsPerPageOptions = [5, 10, 25, 50];

  // Requête pour récupérer les devis avec optimisation de performance
  const { loading, error, data, refetch } = useQuery(GET_QUOTES, {
    variables: {
      status: activeTab,
      search: searchTerm,
      page: currentPage,
      limit: itemsPerPage
    },
    fetchPolicy: 'cache-and-network', // Utiliser le cache et mettre à jour en arrière-plan
    notifyOnNetworkStatusChange: true, // Pour détecter les changements d'état du réseau
  });

  // Requête pour récupérer les statistiques des devis
  const { loading: statsLoading, error: statsError, data: statsData, refetch: refetchStats } = useQuery(GET_QUOTE_STATS, {
    fetchPolicy: 'cache-and-network',
  });

  // Récupérer les devis depuis la réponse paginée
  const quotes = data?.quotes?.quotes || [];
  const totalCount = data?.quotes?.totalCount || 0;
  const hasNextPage = data?.quotes?.hasNextPage || false;

  // Gestion de la pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  // Mutations pour les opérations CRUD
  const [deleteQuote] = useMutation(DELETE_QUOTE_MUTATION, {
    onCompleted: () => {
      refetch();
      Notification.success('Devis supprimé avec succès', {
        duration: 5000,
        position: 'bottom-left'
      });
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la suppression du devis: ${error.message}`, {
        duration: 8000,
        position: 'bottom-left'
      });
    }
  });

  const [changeQuoteStatus] = useMutation(CHANGE_QUOTE_STATUS_MUTATION, {
    onCompleted: (data) => {
      // Rafraîchir les données du tableau et les statistiques
      refetch();
      refetchStats();
      
      // Mettre à jour le devis sélectionné avec le nouveau statut
      if (selectedQuote && selectedQuote.id === data.changeQuoteStatus.id) {
        setSelectedQuote({
          ...selectedQuote,
          status: data.changeQuoteStatus.status
        });
      }
      
      Notification.success('Statut du devis mis à jour avec succès', {
        duration: 5000,
        position: 'bottom-left'
      });
    },
    onError: (error) => {
      Notification.error(`Erreur lors de la mise à jour du statut du devis: ${error.message}`, {
        duration: 8000,
        position: 'bottom-left'
      });
    }
  });

  // Fonctions de gestion des devis
  const handleCreateQuote = () => {
    // La création se fait entièrement dans useQuoteForm
    // Cette fonction est appelée par onSubmit du QuoteFormModal
    // et sert juste à fermer le modal et rafraîchir les données
    setIsCreateModalOpen(false);
    
    // Rafraîchir explicitement les données
    refetch();
    refetchStats();
    
    Notification.success('Devis créé avec succès', {
      duration: 5000,
      position: 'bottom-left'
    });
  };

  const handleUpdateQuote = () => {
    // La mise à jour se fait entièrement dans useQuoteForm
    // Cette fonction est appelée par onSubmit du QuoteFormModal
    // et sert juste à fermer le modal et rafraîchir les données
    setIsEditModalOpen(false);
    
    // Rafraîchir explicitement les données
    refetch();
    refetchStats();
    
    Notification.success('Devis mis à jour avec succès', {
      duration: 5000,
      position: 'bottom-left'
    });
  };

  const handleDeleteQuote = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      deleteQuote({
        variables: { id },
      });
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    changeQuoteStatus({
      variables: {
        id,
        status: newStatus,
      },
    });
  };

  return {
    // États
    selectedQuote,
    setSelectedQuote,
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
    
    // Données
    loading,
    error,
    data,
    quotes,
    totalCount,
    hasNextPage,
    statsLoading,
    statsError,
    statsData,
    
    // Fonctions
    handlePageChange,
    handleCreateQuote,
    handleUpdateQuote,
    handleDeleteQuote,
    handleStatusChange,
    refetch
  };
};
