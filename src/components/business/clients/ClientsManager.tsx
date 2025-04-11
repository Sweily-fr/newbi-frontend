import { Modal } from '../../feedback/Modal';
import { ConfirmationModal } from '../../feedback/ConfirmationModal';
import { ClientForm } from '../../forms/clients/ClientForm';
import { TrashIcon, PencilIcon, UserGroupIcon, ExclamationTriangleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Table, Column } from '../../../components/data-display/Table';
import { Button } from '../../../components/ui/Button';
import { useClientsManager } from '../../../hooks/useClientsManager';
import { Client } from '../../../types/client';
import { useState } from 'react';

export const ClientsManager = () => {
  const [isCancelConfirmationOpen, setIsCancelConfirmationOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
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
    handleSearch
  } = useClientsManager();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Une erreur est survenue</div>;

  // Définir les colonnes pour le composant Table
  const columns: Column<Client>[] = [
    { header: 'Nom', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Ville', accessor: (client) => client.address?.city || '-' },
    { header: 'Pays', accessor: (client) => client.address?.country || '-' },
    {
      header: 'Actions',
      accessor: (client) => (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(client);
            }}
            className="text-indigo-600 hover:text-indigo-900 mr-4"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(client.id);
            }}
            className="text-red-600 hover:text-red-900"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Clients</h2>
        <Button
          onClick={openCreateModal}
          variant="primary"
        >
          Ajouter un client
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Rechercher un client..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                // Délai avant de déclencher la recherche pour éviter trop de requêtes
                const timeoutId = setTimeout(() => {
                  handleSearch(e.target.value);
                }, 300);
                return () => clearTimeout(timeoutId);
              }}
            />
          </div>
          {searchInput && (
            <button
              className="ml-2 p-1 rounded-full hover:bg-gray-200"
              onClick={() => {
                setSearchInput("");
                handleSearch("");
              }}
            >
              <span className="sr-only">Effacer la recherche</span>
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

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
          description: "Vous n'avez pas encore ajouté de clients à votre compte.",
          action: (
            <Button
              onClick={openCreateModal}
              variant="primary"
            >
              Ajouter un client
            </Button>
          )
        }}
        pagination={{
          currentPage,
          totalItems,
          itemsPerPage,
          onPageChange: handlePageChange,
          onItemsPerPageChange: handleItemsPerPageChange,
          itemsPerPageOptions: [5, 10, 25, 50]
        }}
        pagination={{
          currentPage,
          totalItems,
          itemsPerPage,
          onPageChange: handlePageChange,
          rowsPerPageOptions: [5, 10, 25, 50],
          onItemsPerPageChange: handleItemsPerPageChange
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedClient ? 'Modifier le client' : 'Ajouter un client'}
        maxWidth="2xl"
        maxHeight="80vh"
        footer={
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsCancelConfirmationOpen(true)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              form="clientForm"
            >
              {selectedClient ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        }
      >
        <ClientForm
          id="clientForm"
          initialData={selectedClient}
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
        maxWidth="sm"
      >
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Êtes-vous sûr de vouloir supprimer ce client ?</h3>
          <p className="text-sm text-gray-500 mb-6">
            Cette action est irréversible. Toutes les données associées à ce client seront définitivement supprimées.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={closeDeleteModal}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteClient}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};