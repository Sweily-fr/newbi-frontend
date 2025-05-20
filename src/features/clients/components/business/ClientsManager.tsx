import { Modal } from "../../../../components/";
import { ConfirmationModal } from "../../../../components/common/ConfirmationModal";
import { ClientForm } from "../forms/";
import {
  UserGroupIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Table, Column } from "../../../../components/common/Table";
import { Button, SearchInput } from "../../../../components/";
import { useClientsManager } from "../../hooks";
import { Client } from "../../types";
import { useState, useRef } from "react";
import { Edit, Trash } from "iconsax-react";

export const ClientsManager = () => {
  const [isCancelConfirmationOpen, setIsCancelConfirmationOpen] =
    useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    clients,
    loading,
    error,
    isModalOpen,
    isDeleteModalOpen,
    selectedClient,
    // clientToDelete non utilisé mais conservé pour la structure
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
    totalItems,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    // Fonction de recherche
    handleSearch,
  } = useClientsManager();

  // Fonction pour effectuer la recherche
  const performSearch = async () => {
    setIsSearching(true);
    try {
      await handleSearch(searchInput);
    } finally {
      setIsSearching(false);
    }
  };

  // Fonction pour effacer la recherche
  const clearSearch = async () => {
    setSearchInput("");
    setIsSearching(true);
    try {
      await handleSearch("");
    } finally {
      setIsSearching(false);
    }
  };

  // Gérer la soumission du formulaire de recherche (touche Entrée)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  // Afficher un état de chargement seulement au chargement initial, pas pendant la recherche
  if (loading && !isSearching) return <div>Chargement...</div>;
  if (error) return <div>Une erreur est survenue</div>;

  // Définir les colonnes pour le composant Table
  const columns: Column<Client>[] = [
    { header: "Nom", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Ville", accessor: (client) => client.address?.city || "-" },
    { header: "Pays", accessor: (client) => client.address?.country || "-" },
    {
      header: "Actions",
      accessor: (client) => (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(client);
            }}
            className="text-indigo-600 hover:text-indigo-900 mr-4"
          >
            <Edit size="20" color="#5b50ff" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(client.id);
            }}
            className="text-red-600 hover:text-red-900"
          >
            <Trash size="20" color="red" />
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Mes clients</h2>
        <Button onClick={openCreateModal} variant="primary">
          Ajouter un client
        </Button>
      </div>

      {/* Barre de recherche */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <SearchInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={clearSearch}
          isLoading={isSearching}
          width="w-[300px]"
          className="py-3"
        />
        <Button type="submit" variant="secondary" className="h-[100%]">
          Rechercher
        </Button>
      </form>

      {/* Indicateur de recherche en cours */}
      {isSearching && (
        <div className="bg-[#f0eeff] text-[#5b50ff] text-sm py-2 px-4 rounded-md flex items-center justify-center">
          <div className="mr-2 h-4 w-4 border-t-2 border-r-2 border-[#5b50ff] rounded-full animate-spin"></div>
          Recherche en cours...
        </div>
      )}

      <Table
        columns={columns}
        data={clients as Client[]}
        keyExtractor={(client) => client.id}
        onRowClick={() => {
          // Action optionnelle lors du clic sur une ligne
        }}
        emptyState={{
          icon: <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />,
          title: "Aucun client",
          description: searchInput
            ? "Aucun client ne correspond à votre recherche."
            : "Vous n'avez pas encore ajouté de clients à votre compte.",
          action: (
            <Button onClick={openCreateModal} variant="primary">
              Ajouter un client
            </Button>
          ),
        }}
        pagination={{
          currentPage,
          totalItems,
          itemsPerPage,
          onPageChange: handlePageChange,
          onItemsPerPageChange: handleItemsPerPageChange,
          rowsPerPageOptions: [5, 10, 25, 50],
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedClient ? "Modifier le client" : "Ajouter un client"}
        size="2xl"
        maxHeight="80vh"
        footer={
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsCancelConfirmationOpen(true)}
            >
              Annuler
            </Button>
            <Button type="submit" variant="primary" form="clientForm">
              {selectedClient ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        }
      >
        <ClientForm
          id="clientForm"
          initialData={selectedClient || undefined}
          onSubmit={selectedClient ? handleUpdateClient : handleCreateClient}
        />
      </Modal>

      {/* Modale de confirmation d'annulation */}
      <ConfirmationModal
        isOpen={isCancelConfirmationOpen}
        onClose={() => setIsCancelConfirmationOpen(false)}
        onConfirm={() => {
          setIsCancelConfirmationOpen(false);
          closeModal();
        }}
        title="Confirmation d'annulation"
        message="Êtes-vous sûr de vouloir annuler ? Les modifications non enregistrées seront perdues."
        confirmButtonText="Oui, annuler"
        cancelButtonText="Non, continuer"
        confirmButtonVariant="danger"
      />

      {/* Modale de confirmation de suppression */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirmation de suppression"
        size="sm"
      >
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Êtes-vous sûr de vouloir supprimer ce client ?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Cette action est irréversible. Toutes les données associées à ce
            client seront définitivement supprimées.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={closeDeleteModal}>
              Annuler
            </Button>
            <Button variant="danger" onClick={confirmDeleteClient}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
