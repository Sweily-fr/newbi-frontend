import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_INVOICES } from '../../graphql/invoices';
import { Table } from '../../../../components/data-display/Table';
import { formatDateShort } from '../../../../utils/date';
import { Spinner } from '../../../../components/feedback/Spinner';
import { Button } from '../../../../components/ui';
import { Notification } from '../../../../components/feedback';

// Type pour les onglets de filtrage
export type TabType = 'DRAFT' | 'PENDING' | 'COMPLETED' | null;

// Interface pour les données de facture
interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  unit: string;
  discount?: number;
  discountType?: string;
  details?: string;
}

interface InvoiceClient {
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

interface Invoice {
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
  client: InvoiceClient;
  items: InvoiceItem[];
  customFields?: Array<{ key: string; value: string }>;
}

interface InvoicesTableProps {
  activeTab: TabType;
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  rowsPerPageOptions: number[];
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onSelectInvoice: (invoice: Invoice) => void;
  onCreateInvoice?: () => void;
}

export const InvoicesTable: React.FC<InvoicesTableProps> = ({
  activeTab,
  searchTerm,
  currentPage,
  itemsPerPage,
  rowsPerPageOptions,
  onPageChange,
  onItemsPerPageChange,
  onSelectInvoice,
  onCreateInvoice
}) => {
  const [localLoading, setLocalLoading] = useState(false);
  
  // Requête pour récupérer les factures avec pagination côté serveur
  const { loading, error, data } = useQuery(GET_INVOICES, {
    variables: {
      status: activeTab,
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm || undefined
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

  // Utiliser directement les données paginées renvoyées par le serveur
  const invoices: Invoice[] = data?.invoices?.invoices || [];
  const totalCount = data?.invoices?.totalCount || 0;
  const hasNextPage = data?.invoices?.hasNextPage || false;

  // Gérer l'affichage du statut
  const renderStatus = (status: string) => {
    let statusIcon = null;
    let statusText = '';
    let textColor = '';

    switch (status) {
      case 'DRAFT':
        statusText = 'Brouillon';
        textColor = 'text-gray-600';
        statusIcon = (
          <span className="w-4 h-4 mr-1 text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
          </span>
        );
        break;
      case 'PENDING':
        statusText = 'À encaisser';
        textColor = 'text-purple-600';
        statusIcon = (
          <span className="w-4 h-4 mr-1 text-purple-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
            </svg>
          </span>
        );
        break;
      case 'COMPLETED':
        statusText = 'Payée';
        textColor = 'text-green-600';
        statusIcon = (
          <span className="w-4 h-4 mr-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </span>
        );
        break;
      case 'CANCELED':
        statusText = 'Annulée';
        textColor = 'text-red-600';
        statusIcon = (
          <span className="w-4 h-4 mr-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
            </svg>
          </span>
        );
        break;
      default:
        statusText = 'Inconnu';
        textColor = 'text-gray-800';
    }

    return (
      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${textColor} bg-white`}>
        {statusIcon}
        {statusText}
      </span>
    );
  };

  // En cas d'erreur, on affiche quand même le tableau mais vide
  // Les notifications s'occuperont d'informer l'utilisateur de l'erreur

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
            accessor: (invoice) => (
              <span className="font-medium text-gray-900">
                {invoice.prefix}{invoice.number}
              </span>
            )
          },
          {
            header: 'Client',
            accessor: (invoice) => invoice.client.name,
            className: 'text-gray-500'
          },
          {
            header: 'Statut',
            accessor: (invoice) => renderStatus(invoice.status),
            className: 'text-center'
          },
          {
            header: 'Date',
            accessor: (invoice) => formatDateShort(invoice.issueDate),
            className: 'text-gray-500'
          },
          {
            header: 'Montant',
            accessor: (invoice) => `${invoice.totalTTC.toFixed(2)} €`,
            className: 'text-right text-gray-900 font-medium'
          },
          {
            header: 'Actions',
            accessor: (invoice) => (
              <button
                onClick={() => onSelectInvoice(invoice)}
                className="text-[#5b50ff] hover:text-[#4a41e0] font-medium cursor-pointer"
              >
                Voir
              </button>
            ),
            className: 'text-right'
          }
        ]}
        data={invoices}
        keyExtractor={(invoice) => invoice.id}
        emptyState={{
          title: 'Aucune facture',
          description: 'Commencez par créer une nouvelle facture.',
          action: onCreateInvoice ? (
            <Button
              variant="primary"
              size="md"
              onClick={onCreateInvoice}
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
