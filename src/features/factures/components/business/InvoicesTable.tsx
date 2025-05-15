import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_INVOICES } from '../../graphql/invoices';
import { Table, ActionMenuItem } from '../../../../components/common/Table';
import { formatDateShort } from '../../../../utils/date';
import { Spinner } from '../../../../components/common/Spinner';
import { Button } from '../../../../components/';
import { Notification } from '../../../../components/';
import { DocumentText, ClipboardTick, Timer, NoteText, CloseCircle, Edit2, Trash, Printer, ArrowDown, Receipt21 } from 'iconsax-react';

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
  onEditInvoice?: (invoice: Invoice) => void;
  onDeleteInvoice?: (invoice: Invoice) => void;
  onDownloadInvoice?: (invoice: Invoice) => void;
  onPrintInvoice?: (invoice: Invoice) => void;
  onDuplicateInvoice?: (invoice: Invoice) => void;
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
  onCreateInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onDownloadInvoice,
  onPrintInvoice,
  onDuplicateInvoice
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
        statusText = 'À encaisser';
        variant = 'primary';
        icon = <Timer size={16} variant="Bold" className="mr-2" color="#5b50ff" />;
        break;
      case 'COMPLETED':
        statusText = 'Payée';
        variant = 'success';
        icon = <ClipboardTick size={16} variant="Bold" className="mr-2" color="#10b981" />;
        break;
      case 'CANCELED':
        statusText = 'Annulée';
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

  // En cas d'erreur, on affiche quand même le tableau mais vide
  // Les notifications s'occuperont d'informer l'utilisateur de l'erreur

  // Définir les actions disponibles pour le menu d'actions des factures
  const getActionItems = (): ActionMenuItem<Invoice>[] => {
    const items: ActionMenuItem<Invoice>[] = [];
    
    // Action pour voir la facture (toujours disponible)
    items.push({
      label: 'Voir la facture',
      icon: <DocumentText size={16} variant="Linear" color="#5b50ff" />,
      onClick: (invoice) => onSelectInvoice(invoice)
    });
    
    // Action pour modifier la facture si disponible
    if (onEditInvoice) {
      items.push({
        label: 'Modifier',
        icon: <Edit2 size={16} variant="Linear" color="#5b50ff" />,
        onClick: (invoice) => onEditInvoice(invoice)
      });
    }
    
    // Action pour télécharger la facture si disponible
    if (onDownloadInvoice) {
      items.push({
        label: 'Télécharger',
        icon: <ArrowDown size={16} variant="Linear" color="#5b50ff" />,
        onClick: (invoice) => onDownloadInvoice(invoice)
      });
    }
    
    // Action pour imprimer la facture si disponible
    if (onPrintInvoice) {
      items.push({
        label: 'Imprimer',
        icon: <Printer size={16} variant="Linear" color="#5b50ff" />,
        onClick: (invoice) => onPrintInvoice(invoice)
      });
    }
    
    // Action pour dupliquer la facture si disponible
    if (onDuplicateInvoice) {
      items.push({
        label: 'Dupliquer',
        icon: <Receipt21 size={16} variant="Linear" color="#5b50ff" />,
        onClick: (invoice) => onDuplicateInvoice(invoice)
      });
    }
    
    // Action pour supprimer la facture si disponible (toujours en dernier)
    if (onDeleteInvoice) {
      items.push({
        label: 'Supprimer',
        icon: <Trash size={16} variant="Linear" color="#ef4444" />,
        onClick: (invoice) => onDeleteInvoice(invoice),
        variant: 'danger'
      });
    }
    
    return items;
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
            isAction: true,
            accessor: 'id',
            className: 'text-right'
          }
        ]}
        data={invoices}
        keyExtractor={(invoice) => invoice.id}
        actionItems={getActionItems()}
        actionButtonLabel="Actions de facture"
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
