import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  DocumentText, 
  ArrowRight, 
  Receipt21, 
  Edit, 
  Trash 
} from 'iconsax-react';
import { useMutation } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { PurchaseOrder } from '../../types';
import { formatCurrency } from '../../../../utils/formatters';
import { DELETE_PURCHASE_ORDER_MUTATION } from '../../graphql';
import ConfirmDialog from '../../../../components/common/ConfirmDialog';
// Ces importations sont utilisées dans les composants EmptyState et Pagination
import EmptyState from '../../../../components/common/EmptyState';
import Pagination from '../../../../components/common/Pagination';

interface PurchaseOrdersTableProps {
  purchaseOrders: PurchaseOrder[];
  totalCount: number;
  currentPage: number;
  limit: number;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
  loading: boolean;
}

const PurchaseOrdersTable: React.FC<PurchaseOrdersTableProps> = ({
  purchaseOrders,
  totalCount,
  currentPage,
  limit,
  onPageChange,
  onRefetch,
  loading
}) => {
  const navigate = useNavigate();
  const [purchaseOrderToDelete, setPurchaseOrderToDelete] = useState<string | null>(null);

  const [deletePurchaseOrder] = useMutation(DELETE_PURCHASE_ORDER_MUTATION, {
    onCompleted: () => {
      toast.success('Bon de commande supprimé avec succès');
      onRefetch();
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    }
  });

  const handleDelete = () => {
    if (purchaseOrderToDelete) {
      deletePurchaseOrder({ variables: { id: purchaseOrderToDelete } });
      setPurchaseOrderToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium">Brouillon</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">En attente</span>;
      case 'COMPLETED':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Complété</span>;
      case 'CANCELED':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Annulé</span>;
      default:
        return <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium">Inconnu</span>;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-16 bg-gray-100 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  if (!purchaseOrders || purchaseOrders.length === 0) {
    return (
      <EmptyState
        icon={<DocumentText size={48} />}
        title="Aucun bon de commande"
        description="Vous n'avez pas encore créé de bon de commande."
        actionLabel="Créer un bon de commande"
        onAction={() => navigate('/bons-de-commande/new')}
      />
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numéro
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchaseOrders.map((purchaseOrder) => (
              <tr 
                key={purchaseOrder.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/bons-de-commande/${purchaseOrder.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {purchaseOrder.prefix}{purchaseOrder.number}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{purchaseOrder.client?.name}</div>
                  <div className="text-xs text-gray-500">{purchaseOrder.client?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {purchaseOrder.issueDate && format(new Date(purchaseOrder.issueDate), 'dd MMM yyyy', { locale: fr })}
                  </div>
                  {purchaseOrder.validUntil && (
                    <div className="text-xs text-gray-500">
                      Valide jusqu'au {format(new Date(purchaseOrder.validUntil), 'dd/MM/yyyy', { locale: fr })}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(purchaseOrder.finalTotalTTC || 0)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(purchaseOrder.status || '')}
                  {purchaseOrder.convertedToInvoice ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Receipt21 size={12} className="mr-1" />
                      Facturé
                    </span>
                  ) : null}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/bons-de-commande/${purchaseOrder.id}`);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                      title="Voir les détails"
                    >
                      <DocumentText size={18} />
                    </button>
                    
                    {(purchaseOrder.status === 'DRAFT' || purchaseOrder.status === 'PENDING') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/bons-de-commande/${purchaseOrder.id}/edit`);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    
                    {(purchaseOrder.status === 'DRAFT' || purchaseOrder.status === 'PENDING') && !purchaseOrder.convertedToInvoice && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPurchaseOrderToDelete(purchaseOrder.id || '');
                        }}
                        className="text-red-500 hover:text-red-700"
                        title="Supprimer"
                      >
                        <Trash size={18} />
                      </button>
                    )}
                    
                    {purchaseOrder.status === 'COMPLETED' && !purchaseOrder.convertedToInvoice && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/bons-de-commande/${purchaseOrder.id}?convert=true`);
                        }}
                        className="text-violet-500 hover:text-violet-700"
                        title="Convertir en facture"
                      >
                        <Receipt21 size={18} />
                      </button>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/bons-de-commande/${purchaseOrder.id}`);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={limit}
          onPageChange={onPageChange}
        />
      </div>

      <ConfirmDialog
        isOpen={!!purchaseOrderToDelete}
        onClose={() => setPurchaseOrderToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer le bon de commande"
        message="Êtes-vous sûr de vouloir supprimer ce bon de commande ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
};

export default PurchaseOrdersTable;
