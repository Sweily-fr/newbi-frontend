import { useEffect, useState } from 'react';
import { Button } from '../components/common/Button';
import { useQuotes, TabType } from '../features/devis/hooks';
import { TabNavigation } from '../components/specific/navigation/TabNavigation';
import { DocumentText, DocumentCopy, DocumentLike, ClipboardTick, CloseCircle } from 'iconsax-react';
import { SearchInput } from '../components/';
import { QuoteSidebar } from '../features/devis/components/business/QuoteSidebar';
import { QuotesTable } from '../features/devis/components/business/QuotesTable';
import { Notification } from '../components/common/Notification';
import { useQuery } from '@apollo/client';
import { LogoLoader } from '../components/common/LogoLoader';
import { GET_QUOTE_STATS } from '../features/devis/graphql/quotes';
import { QuoteFormModal } from '../features/devis/components/forms/QuoteFormModal';
import { SEOHead } from '../components/specific/SEO/SEOHead';
import { SchemaMarkup } from '../components/specific/SEO/SchemaMarkup';
import { seoConfig } from '../config/seoConfig';

export const QuotesPage = () => {
  const {
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
    error,
    handlePageChange,
    handleDeleteQuote,
    handleStatusChange
  } = useQuotes();

  // Référence pour stocker la fonction de rafraîchissement du tableau
  const [refreshQuotesTable, setRefreshQuotesTable] = useState<(() => Promise<any>) | null>(null);

  // Requête pour récupérer uniquement les statistiques des devis
  const { loading: statsLoading, error: statsError, data: statsData, refetch: refetchStats } = useQuery(GET_QUOTE_STATS, {
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
    
    if (error) {
      Notification.error(error.message, {
        position: 'bottom-left',
        duration: 5000
      });
    }
  }, [statsError, error]);
  
  if (statsLoading) return <div className="flex justify-center items-center h-screen"><LogoLoader size="md" /></div>;

  return (
    <>
      <SEOHead 
        title={seoConfig.quotes.title}
        description={seoConfig.quotes.description}
        keywords={seoConfig.quotes.keywords}
        canonicalUrl={seoConfig.quotes.canonicalUrl}
        ogImage={seoConfig.quotes.ogImage}
        schemaType={seoConfig.quotes.schemaType}
        noindex={false}
      />
      
      {/* Données structurées Service */}
      <SchemaMarkup 
        type="Service"
        name="Gestion des Devis Newbi"
        description="Solution complète de création et gestion de devis pour professionnels, auto-entrepreneurs et PME"
        url="https://www.newbi.fr/devis"
        additionalData={{
          "provider": {
            "@type": "Organization",
            "name": "Newbi",
            "url": "https://www.newbi.fr/"
          },
          "serviceType": "Gestion de devis en ligne",
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
            <h1 className="text-2xl font-semibold text-gray-900">Gestion des Devis</h1>
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
              Nouveau Devis
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <TabNavigation
              tabs={[
                { 
                  id: null, 
                  label: 'Tous', 
                  count: statsData?.quoteStats.totalCount || 0,
                  icon: <DocumentText size={20} variant="Outline" color="currentColor" />
                },
                { 
                  id: 'DRAFT', 
                  label: 'Brouillons', 
                  count: statsData?.quoteStats.draftCount || 0,
                  icon: <DocumentCopy size={20} variant="Outline" color="currentColor" />
                },
                { 
                  id: 'PENDING', 
                  label: 'En attente', 
                  count: statsData?.quoteStats.pendingCount || 0,
                  icon: <DocumentLike size={20} variant="Outline" color="currentColor" />
                },
                { 
                  id: 'CANCELED', 
                  label: 'Annulés', 
                  count: statsData?.quoteStats.canceledCount || 0,
                  icon: <CloseCircle size={20} variant="Outline" color="currentColor" />
                },
                { 
                  id: 'COMPLETED', 
                  label: 'Acceptés', 
                  count: statsData?.quoteStats.completedCount || 0,
                  icon: <ClipboardTick size={20} variant="Outline" color="currentColor" />
                }
              ]}
              activeTab={activeTab}
              onTabChange={(tabId) => {
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

        {/* Composant de tableau de devis avec chargement indépendant */}
        <QuotesTable 
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
          onSelectQuote={(quote) => {
            setSelectedQuote(quote);
            setIsSidebarOpen(true);
          }}
          onCreateQuote={() => setIsCreateModalOpen(true)}
          onRefresh={(refetchFn) => setRefreshQuotesTable(() => refetchFn)}
        />

      </div>

      {/* Affichage du formulaire de devis en plein écran */}
      {isCreateModalOpen && (
        <QuoteFormModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={() => {
            setIsCreateModalOpen(false);
            // Rafraîchir explicitement les données après création
            refetchStats();
            if (refreshQuotesTable) refreshQuotesTable();
            Notification.success('Devis créé avec succès', {
              position: 'bottom-left',
              duration: 3000
            });
          }}
        />
      )}
      
      {isEditModalOpen && selectedQuote && (
        <QuoteFormModal
          quote={selectedQuote}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={() => {
            setIsEditModalOpen(false);
            // Rafraîchir explicitement les données après mise à jour
            refetchStats();
            if (refreshQuotesTable) refreshQuotesTable();
            Notification.success('Devis mis à jour avec succès', {
              position: 'bottom-left',
              duration: 3000
            });
          }}
        />
      )}

      <QuoteSidebar
        quote={selectedQuote as any}
        isOpen={isSidebarOpen && selectedQuote !== null}
        onClose={() => setIsSidebarOpen(false)}
        onEdit={() => {
          setIsEditModalOpen(true);
          setIsSidebarOpen(false);
        }}
        onDelete={() => {
          if (selectedQuote && selectedQuote.id) {
            handleDeleteQuote(selectedQuote.id);
            setIsSidebarOpen(false);
          }
        }}
        onStatusChange={(newStatus) => {
          if (selectedQuote && selectedQuote.id) {
            handleStatusChange(selectedQuote.id, newStatus);
          }
        }}
      />
    </div>
    </>
  );
};
