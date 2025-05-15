import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_QUOTES } from '../../graphql/quotes';
import { Table } from '../../../../components/common/Table';
import { formatDateShort } from '../../../../utils/date';
import { Spinner } from '../../../../components/common/Spinner';
import { Button } from '../../../../components/';
import { Notification } from '../../../../components/';
import { DocumentText, ClipboardTick, Timer, NoteText, CloseCircle, DocumentCopy } from 'iconsax-react';

// Type pour les onglets de filtrage
export type TabType = 'DRAFT' | 'PENDING' | 'COMPLETED' | 'CANCELED' | null;

// Interface pour les données de devis
interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  unit: string;
  discount?: number;
  discountType?: string;
  details?: string;
}

interface QuoteClient {
  id: string;
  name: string;
  email: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  siret?: string;
  vatNumber?: string;
}

interface Quote {
  id: string;
  number: string;
  prefix: string;
  status: string;
  issueDate: string;
  executionDate?: string;
  dueDate: string;
  createdAt: string;
  totalHT: number;
  totalTTC: number;
  totalVAT: number;
  client: QuoteClient;
  items: QuoteItem[];
  customFields?: Array<{ key: string; value: string }>;
  convertedToInvoice?: boolean;
  invoiceId?: string;
}

interface QuotesTableProps {
  activeTab: TabType;
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  rowsPerPageOptions: number[];
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onSelectQuote: (quote: Quote) => void;
  onCreateQuote?: () => void;
  onRefresh?: (refetchFn: () => Promise<unknown>) => void;
}

export const QuotesTable: React.FC<QuotesTableProps> = ({
  activeTab,
  searchTerm,
  currentPage,
  itemsPerPage,
  rowsPerPageOptions,
  onPageChange,
  onItemsPerPageChange,
  onSelectQuote,
  onCreateQuote,
  onRefresh
}) => {
  const [localLoading, setLocalLoading] = useState(false);
  
  // Requête pour récupérer les devis
  const { loading, error, data, refetch } = useQuery(GET_QUOTES, {
    variables: {
      status: activeTab,
      search: searchTerm,
      page: currentPage,
      limit: itemsPerPage
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  // Effet pour gérer l'état de chargement local
  useEffect(() => {
    if (loading) {
      setLocalLoading(true);
    } else {
      // Ajouter un petit délai pour éviter un flash de l'UI
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  // Effet pour gérer les erreurs
  useEffect(() => {
    if (error) {
      Notification.error(error.message, {
        position: 'bottom-left',
        duration: 5000
      });
    }
  }, [error]);
  
  // Exposer la fonction de rafraîchissement au composant parent
  useEffect(() => {
    if (onRefresh && refetch) {
      onRefresh(refetch);
    }
  }, [onRefresh, refetch]);

  // Récupérer les devis depuis la réponse paginée
  const quotes = data?.quotes?.quotes || [];
  const totalCount = data?.quotes?.totalCount || 0;
  const hasNextPage = data?.quotes?.hasNextPage || false;

  // Les devis sont déjà paginés par l'API
  const displayedQuotes = quotes;

  // Gérer l'affichage du statut
  const renderStatus = (status: string) => {
    let variant = '';
    let statusText = '';
    let icon = null;

    switch (status) {
      case 'DRAFT':
        statusText = 'Brouillon';
        variant = 'warning';
        icon = <NoteText size={16} variant="Bold" className="mr-2" color="#f59e0b" />;
        break;
      case 'PENDING':
        statusText = 'En attente';
        variant = 'primary';
        icon = <Timer size={16} variant="Bold" className="mr-2" color="#5b50ff" />;
        break;
      case 'COMPLETED':
        statusText = 'Accepté';
        variant = 'success';
        icon = <ClipboardTick size={16} variant="Bold" className="mr-2" color="#10b981" />;
        break;
      case 'CANCELED':
        statusText = 'Annulé';
        variant = 'danger';
        icon = <CloseCircle size={16} variant="Bold" className="mr-2" color="#ef4444" />;
        break;
      default:
        statusText = 'Inconnu';
        variant = 'default';
        icon = <CloseCircle size={16} variant="Bold" className="mr-2" color="#6b7280" />;
    }

    // Classes pour les différentes variantes de tags
    const variantClasses = {
      primary: 'bg-[#f0eeff] text-[#5b50ff] border border-[#e6e1ff]',
      success: 'bg-[#ecfdf5] text-[#10b981] border border-[#d1fae5]',
      warning: 'bg-[#fffbeb] text-[#f59e0b] border border-[#fef3c7]',
      danger: 'bg-[#fef2f2] text-[#ef4444] border border-[#fee2e2]',
      default: 'bg-gray-100 text-gray-800 border border-gray-200'
    };

    return (
      <span className={`px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-[16px] shadow-sm transition-all duration-200 ${variantClasses[variant as keyof typeof variantClasses]}`}>
        {icon}
        {statusText}
      </span>
    );
  };

  // Afficher si le devis a été converti en facture
  const renderConvertedStatus = (quote: Quote) => {
    if (quote.convertedToInvoice) {
      return (
        <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-[16px] shadow-sm transition-all duration-200 bg-[#f0eeff] text-[#5b50ff] border border-[#e6e1ff]">
          <DocumentCopy size={16} variant="Bold" className="mr-2" color="#5b50ff" />
          Facturé
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-[16px] shadow-sm transition-all duration-200 bg-gray-100 text-gray-600 border border-gray-200">
        <DocumentText size={16} variant="Bold" className="mr-2" color="#6b7280" />
        Non facturé
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-white shadow overflow-hidden sm:rounded-md">
        {localLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-10">
            <Spinner size="lg" />
          </div>
        )}
      
        <Table
          columns={[
            {
              header: 'Numéro',
              accessor: (quote: Quote) => (
                <span className="font-medium text-gray-900">
                  {quote.prefix}{quote.number}
                </span>
              )
            },
            {
              header: 'Client',
              accessor: (quote) => quote.client.name,
              className: 'text-gray-500'
            },
            {
              header: 'Statut',
              accessor: (quote: Quote) => renderStatus(quote.status),
              className: 'text-center'
            },
            {
              header: 'Conversion',
              accessor: (quote: Quote) => renderConvertedStatus(quote),
              className: 'text-center'
            },
            {
              header: 'Date',
              accessor: (quote: Quote) => formatDateShort(quote.issueDate),
              className: 'text-gray-500'
            },
            {
              header: 'Montant',
              accessor: (quote: Quote) => `${quote.totalTTC?.toFixed(2) || '0.00'} €`,
              className: 'text-right text-gray-900 font-medium'
            },
            {
              header: 'Actions',
              isAction: true,
              accessor: 'id',
              className: 'text-right'
            }
          ]}
          data={displayedQuotes}
          keyExtractor={(quote: Quote) => quote.id}
          actionItems={[
            {
              label: 'Voir le devis',
              icon: <DocumentText size={18} variant="Bulk" color="#5b50ff" />,
              onClick: (quote) => onSelectQuote(quote)
            }
          ]}
          actionButtonLabel="Actions de devis"
          emptyState={{
            title: 'Aucun devis',
            description: 'Commencez par créer un nouveau devis.',
            action: onCreateQuote ? (
              <Button
                variant="primary"
                size="md"
                onClick={onCreateQuote}
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
            ) : null
          }}
          pagination={{
            currentPage,
            totalItems: totalCount,
            itemsPerPage,
            onPageChange,
            rowsPerPageOptions,
            onItemsPerPageChange: (newItemsPerPage) => {
              onItemsPerPageChange(newItemsPerPage);
            },
            hasNextPage
          }}
        />
      </div>
    </div>
  );
};
