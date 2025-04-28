import { InvoiceFormModal } from '../components/forms/invoices/InvoiceFormModal';
import { Button } from '../components/ui';
import { useInvoices, TabType } from '../hooks/useInvoices';
import { TabNavigation } from '../components/navigation/TabNavigation';
import { SearchInput } from '../components/ui';
import { InvoiceSidebar } from '../components/business/invoices/InvoiceSidebar';
import { InvoicesTable } from '../components/business/invoices/InvoicesTable';
import { useQuery } from '@apollo/client';
import { GET_INVOICES } from '../graphql/queries';
import { Notification } from '../components/feedback';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const InvoicesPage = () => {
  const { quoteId } = useParams();
  const {
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
    error,
    handlePageChange,
    handleCreateInvoice,
    handleUpdateInvoice,
    handleDeleteInvoice,
    handleStatusChange
  } = useInvoices();

  // Ouvrir automatiquement le modal de création lorsqu'un quoteId est présent
  useEffect(() => {
    if (quoteId) {
      setIsCreateModalOpen(true);
    }
  }, [quoteId, setIsCreateModalOpen]);

  // Gestion des erreurs avec le composant Notification
  useEffect(() => {
    if (error) {
      Notification.error(error.message, {
        position: 'bottom-left',
        duration: 5000
      });
    }
  }, [error]);

  // Requête pour récupérer uniquement les statistiques des factures
  const { loading: statsLoading, error: statsError, data: statsData } = useQuery(GET_INVOICES, {
    variables: {},
    fetchPolicy: 'cache-and-network',
  });
  
  // Gestion des erreurs avec le composant Notification
  useEffect(() => {
    if (statsError) {
      Notification.error(statsError.message, {
        position: 'bottom-left',
        duration: 5000
      });
    }
  }, [statsError]);
  
  if (statsLoading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Gestion des Factures</h1>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Nouvelle Facture
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <TabNavigation
              tabs={[
                { id: null, label: 'Toutes', count: statsData?.invoiceStats.totalCount || 0 },
                { id: 'DRAFT', label: 'Brouillons', count: statsData?.invoiceStats.draftCount || 0 },
                { id: 'PENDING', label: 'À encaisser', count: statsData?.invoiceStats.pendingCount || 0 },
                { id: 'COMPLETED', label: 'Terminées', count: statsData?.invoiceStats.completedCount || 0 }
              ]}
              activeTab={activeTab}
              onTabChange={(tabId) => {
                // Conversion explicite du type pour s'assurer que tabId est bien un TabType
                setActiveTab(tabId as TabType);
                setCurrentPage(1);
              }}
              variant="simple-tabs"
            />
          
            <SearchInput
              placeholder="Rechercher par numéro, client, date, ou montant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              width="w-72"
            />
          </div>
        </div>

        {/* Composant de tableau de factures avec chargement indépendant */}
        <InvoicesTable 
          activeTab={activeTab}
          searchTerm={searchTerm}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageChange={handlePageChange}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1); // Reset to first page when changing items per page
          }}
          onSelectInvoice={(invoice) => {
            setSelectedInvoice(invoice);
            setIsSidebarOpen(true);
          }}
          onCreateInvoice={() => setIsCreateModalOpen(true)}
        />

      </div>

      {/* Affichage direct du formulaire de facture en plein écran */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <InvoiceFormModal
          invoice={isEditModalOpen ? selectedInvoice : undefined}
          onClose={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
          }}
          onSubmit={(data) => {
            if (isEditModalOpen && selectedInvoice) {
              handleUpdateInvoice(selectedInvoice.id, data);
            } else {
              handleCreateInvoice(data);
            }
          }}
        />
      )}

      <InvoiceSidebar
          invoice={selectedInvoice || undefined}
          isOpen={isSidebarOpen && selectedInvoice !== null}
          onClose={() => setIsSidebarOpen(false)}
          onEdit={() => {
            // Vérifier que la facture n'est pas en statut PENDING avant d'autoriser l'édition
            if (selectedInvoice && selectedInvoice.status !== 'PENDING') {
              setIsEditModalOpen(true);
              setIsSidebarOpen(false);
            } else {
              Notification.error("Les factures en statut 'À encaisser' ne peuvent pas être modifiées", {
                position: 'bottom-left',
                duration: 5000
              });
            }
          }}
          onDelete={() => {
            handleDeleteInvoice(selectedInvoice.id);
            setIsSidebarOpen(false);
          }}
          onStatusChange={(newStatus) => {
            handleStatusChange(selectedInvoice.id, newStatus);
            setIsSidebarOpen(false);
          }}
        />
    </div>
  );
};
