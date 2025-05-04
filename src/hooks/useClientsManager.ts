import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CLIENTS, CREATE_CLIENT, UPDATE_CLIENT, DELETE_CLIENT } from '../graphql/client';
import { Notification } from '../components/feedback/Notification';
import { ClientFormData, Client } from '../types/client';

/**
 * Fonction utilitaire pour nettoyer un objet des champs __typename ajoutés par Apollo
 * @param obj L'objet à nettoyer
 * @returns Une copie nettoyée de l'objet
 */
const removeTypename = <T>(obj: T): T => {
  // Créer une copie de l'objet
  const cleanedObj = { ...obj } as Record<string, unknown>;
  
  // Supprimer __typename de l'objet
  if ('__typename' in cleanedObj) {
    delete cleanedObj.__typename;
  }
  
  // Parcourir les propriétés de l'objet
  Object.keys(cleanedObj).forEach(key => {
    // Si la propriété est un objet, appliquer récursivement la fonction
    if (cleanedObj[key] && typeof cleanedObj[key] === 'object' && !Array.isArray(cleanedObj[key])) {
      cleanedObj[key] = removeTypename(cleanedObj[key] as Record<string, unknown>);
    }
    // Si la propriété est un tableau d'objets, appliquer la fonction à chaque élément
    else if (Array.isArray(cleanedObj[key])) {
      cleanedObj[key] = (cleanedObj[key] as unknown[]).map((item: unknown) => 
        typeof item === 'object' && item !== null ? removeTypename(item as Record<string, unknown>) : item
      );
    }
  });
  
  return cleanedObj as T;
};

export const useClientsManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data, loading, error, refetch } = useQuery(GET_CLIENTS, {
    variables: {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm || undefined
    },
    fetchPolicy: "network-only"
  });
  
  const [createClient] = useMutation(CREATE_CLIENT, {
    onCompleted: () => {
      refetch(); // Utiliser refetch au lieu de refetchQueries pour prendre en compte les variables
    }
  });
  
  const [updateClient] = useMutation(UPDATE_CLIENT, {
    onCompleted: () => {
      refetch();
    }
  });
  
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    onCompleted: () => {
      refetch();
    }
  });

  const handleCreateClient = async (formData: ClientFormData) => {
    try {
      // Vérifier si les champs obligatoires sont remplis
      const requiredFields = ['name', 'email'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof ClientFormData]);
      
      // Vérifier si les champs d'adresse obligatoires sont remplis
      const requiredAddressFields = ['street', 'city', 'postalCode', 'country'];
      const missingAddressFields = formData.address ? 
        requiredAddressFields.filter(field => !formData.address?.[field as keyof typeof formData.address]) : 
        requiredAddressFields;
      
      // Si des champs obligatoires sont manquants, afficher un message d'erreur spécifique
      if (missingFields.length > 0 || missingAddressFields.length > 0) {
        let errorMessage = 'Veuillez remplir les champs obligatoires : ';
        
        if (missingFields.length > 0) {
          const fieldLabels = {
            name: 'Nom',
            email: 'Email'
          };
          errorMessage += missingFields.map(field => fieldLabels[field as keyof typeof fieldLabels]).join(', ');
        }
        
        if (missingAddressFields.length > 0) {
          const addressLabels = {
            street: 'Rue',
            city: 'Ville',
            postalCode: 'Code postal',
            country: 'Pays'
          };
          if (missingFields.length > 0) errorMessage += ' et ';
          errorMessage += missingAddressFields.map(field => addressLabels[field as keyof typeof addressLabels]).join(', ');
        }
        
        Notification.error(errorMessage, {
          duration: 5000,
          position: 'bottom-left'
        });
        return;
      }
      
      // Nettoyer les données du formulaire des champs __typename
      const cleanedData = removeTypename(formData);
      
      await createClient({
        variables: {
          input: cleanedData,
        },
      });
      setIsModalOpen(false);
      Notification.success(`Client ${formData.name} créé avec succès`, {
        duration: 4000,
        position: 'bottom-left'
      });
    } catch (error) {
      console.error('Error creating client:', error);
      Notification.error('Erreur lors de la création du client', {
        duration: 5000,
        position: 'bottom-left'
      });
    }
  };

  const handleUpdateClient = async (formData: ClientFormData) => {
    try {
      // Vérifier si les champs obligatoires sont remplis
      const requiredFields = ['name', 'email'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof ClientFormData]);
      
      // Vérifier si les champs d'adresse obligatoires sont remplis
      const requiredAddressFields = ['street', 'city', 'postalCode', 'country'];
      const missingAddressFields = formData.address ? 
        requiredAddressFields.filter(field => !formData.address?.[field as keyof typeof formData.address]) : 
        requiredAddressFields;
      
      // Si des champs obligatoires sont manquants, afficher un message d'erreur spécifique
      if (missingFields.length > 0 || missingAddressFields.length > 0) {
        let errorMessage = 'Veuillez remplir les champs obligatoires : ';
        
        if (missingFields.length > 0) {
          const fieldLabels = {
            name: 'Nom',
            email: 'Email'
          };
          errorMessage += missingFields.map(field => fieldLabels[field as keyof typeof fieldLabels]).join(', ');
        }
        
        if (missingAddressFields.length > 0) {
          const addressLabels = {
            street: 'Rue',
            city: 'Ville',
            postalCode: 'Code postal',
            country: 'Pays'
          };
          if (missingFields.length > 0) errorMessage += ' et ';
          errorMessage += missingAddressFields.map(field => addressLabels[field as keyof typeof addressLabels]).join(', ');
        }
        
        Notification.error(errorMessage, {
          duration: 5000,
          position: 'bottom-left'
        });
        return;
      }
      
      // Nettoyer les données du formulaire des champs __typename
      const cleanedData = removeTypename<ClientFormData>(formData as any);
      
      await updateClient({
        variables: {
          id: selectedClient?.id,
          input: cleanedData,
        },
      });
      setIsModalOpen(false);
      setSelectedClient(null);
      Notification.success(`Client ${formData.name} mis à jour avec succès`, {
        duration: 4000,
        position: 'bottom-left'
      });
    } catch (error) {
      console.error('Error updating client:', error);
      Notification.error('Erreur lors de la mise à jour du client', {
        duration: 5000,
        position: 'bottom-left'
      });
    }
  };

  const openDeleteModal = (id: string) => {
    setClientToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setClientToDelete(null);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;
    
    try {
      await deleteClient({
        variables: { id: clientToDelete },
      });
      Notification.success('Client supprimé avec succès', {
        duration: 4000,
        position: 'bottom-left'
      });
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting client:', error);
      Notification.error('Erreur lors de la suppression du client', {
        duration: 5000,
        position: 'bottom-left'
      });
    }
  };

  const openCreateModal = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  // Fonctions de gestion de la pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Réinitialiser à la première page lors du changement de nombre d'éléments par page
  };
  
  // Fonction pour gérer la recherche
  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
  };

  return {
    clients: data?.clients?.items || [],
    loading,
    error,
    isModalOpen,
    isDeleteModalOpen,
    selectedClient,
    clientToDelete,
    handleCreateClient,
    handleUpdateClient,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteClient,
    openCreateModal,
    openEditModal,
    closeModal,
    // Données et fonctions de pagination
    currentPage,
    totalItems: data?.clients?.totalItems || 0,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    // Fonction de recherche
    handleSearch,
    searchTerm
  };
};