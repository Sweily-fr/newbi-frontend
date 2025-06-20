import { InvoiceFormModal } from '../features/factures/components/forms/InvoiceFormModal';
import { Button } from '../components/';
import { useInvoices, TabType } from '../features/factures/hooks/useInvoices';
import { TabNavigation } from '../components/specific/navigation/TabNavigation';
import { SearchInput } from '../components/';
import { DocumentText, DocumentCopy, DocumentLike, ClipboardTick } from 'iconsax-react';
import { InvoiceSidebar } from '../features/factures/components/business/InvoiceSidebar';
import { InvoicesTable } from '../features/factures/components/business/InvoicesTable';
import { useQuery } from '@apollo/client';
import { LogoLoader } from '../components/common/LogoLoader';
import { GET_INVOICES } from '../features/factures/graphql/invoices';
import { Notification } from '../components/common/Notification';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SEOHead } from '../components/specific/SEO/SEOHead';
import { SchemaMarkup } from '../components/specific/SEO/SchemaMarkup';
import { seoConfig } from '../config/seoConfig';

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
  
  if (statsLoading) return <div className="flex justify-center items-center h-screen"><LogoLoader size="md" /></div>;

  return (
    <>
      <SEOHead 
        title={seoConfig.invoices.title}
        description={seoConfig.invoices.description}
        keywords={seoConfig.invoices.keywords}
        canonicalUrl={seoConfig.invoices.canonicalUrl}
        ogImage={seoConfig.invoices.ogImage}
        schemaType={seoConfig.invoices.schemaType}
        noindex={false}
      />
      
      {/* Données structurées Service */}
      <SchemaMarkup 
        type="Service"
        name="Gestion des Factures Newbi"
        description="Solution complète de facturation pour professionnels, auto-entrepreneurs et PME"
        url="https://www.newbi.fr/factures"
        additionalData={{
          "provider": {
            "@type": "Organization",
            "name": "Newbi",
            "url": "https://www.newbi.fr/"
          },
          "serviceType": "Facturation en ligne",
          "offers": {
            "@type": "Offer",
            "price": "14.99",
            "priceCurrency": "EUR"
          }
        }}
      />
      
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
                { 
                  id: null, 
                  label: 'Toutes', 
                  count: statsData?.invoiceStats.totalCount || 0,
                  icon: <DocumentText size={20} variant="Outline" color="currentColor" />
                },
                { 
                  id: 'DRAFT', 
                  label: 'Brouillons', 
                  count: statsData?.invoiceStats.draftCount || 0,
                  icon: <DocumentCopy size={20} variant="Outline" color="currentColor" />
                },
                { 
                  id: 'PENDING', 
                  label: 'À encaisser', 
                  count: statsData?.invoiceStats.pendingCount || 0,
                  icon: <DocumentLike size={20} variant="Outline" color="currentColor" />
                },
                { 
                  id: 'COMPLETED', 
                  label: 'Terminées', 
                  count: statsData?.invoiceStats.completedCount || 0,
                  icon: <ClipboardTick size={20} variant="Outline" color="currentColor" />
                }
              ]}
              activeTab={activeTab}
              onTabChange={(tabId) => {
                // Conversion explicite du type pour s'assurer que tabId est bien un TabType
                setActiveTab(tabId as TabType);
                setCurrentPage(1);
              }}
              variant="modern"
            />
          
            <SearchInput
              placeholder="Rechercher par numéro, client..."
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
    </>
  );
};
