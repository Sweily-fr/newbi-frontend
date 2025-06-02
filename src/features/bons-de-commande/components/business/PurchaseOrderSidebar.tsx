import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  DocumentText, 
  Edit, 
  Trash, 
  Receipt21, 
  ClipboardTick,
  ClipboardClose,
  DocumentLike
} from 'iconsax-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { 
  CHANGE_PURCHASE_ORDER_STATUS_MUTATION,
  DELETE_PURCHASE_ORDER_MUTATION,
  GET_PURCHASE_ORDER
} from '../../graphql';
import { PurchaseOrder } from '../../types';
import { formatCurrency } from '../../../../utils/formatters';
import ConfirmDialog from '../../../../components/common/ConfirmDialog';
import PurchaseOrderInvoiceCreationModal from '../../../../features/bons-de-commande/components/business/PurchaseOrderInvoiceCreationModal';

interface PurchaseOrderSidebarProps {
  purchaseOrderId: string;
  onClose: () => void;
}

const PurchaseOrderSidebar: React.FC<PurchaseOrderSidebarProps> = ({ purchaseOrderId, onClose }) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  
  const { data, loading, error, refetch } = useQuery(GET_PURCHASE_ORDER, {
    variables: { id: purchaseOrderId },
    fetchPolicy: 'network-only',
  });

  const [deletePurchaseOrder] = useMutation(DELETE_PURCHASE_ORDER_MUTATION, {
    onCompleted: () => {
      toast.success('Bon de commande supprimé avec succès');
      onClose();
      navigate('/bons-de-commande');
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    }
  });

  const [changePurchaseOrderStatus] = useMutation(CHANGE_PURCHASE_ORDER_STATUS_MUTATION, {
    onCompleted: (data) => {
      const status = data.changePurchaseOrderStatus.status;
      const statusMessages: Record<string, string> = {
        DRAFT: 'Le bon de commande est maintenant en brouillon',
        PENDING: 'Le bon de commande est maintenant en attente',
        COMPLETED: 'Le bon de commande est maintenant complété',
        CANCELED: 'Le bon de commande est maintenant annulé'
      };
      toast.success(statusMessages[status] || 'Statut mis à jour avec succès');
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur lors du changement de statut: ${error.message}`);
    }
  });

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6">Erreur: {error.message}</div>;

  const purchaseOrder: PurchaseOrder = data?.purchaseOrder;
  if (!purchaseOrder) return <div className="p-6">Bon de commande non trouvé</div>;

  const handleDeleteConfirm = () => {
    deletePurchaseOrder({ variables: { id: purchaseOrderId } });
  };

  const handleStatusChange = (newStatus: string) => {
    changePurchaseOrderStatus({ 
      variables: { 
        id: purchaseOrderId, 
        status: newStatus 
      } 
    });
  };

  const handleEdit = () => {
    navigate(`/bons-de-commande/${purchaseOrderId}/edit`);
  };

  const handleViewDetails = () => {
    navigate(`/bons-de-commande/${purchaseOrderId}`);
  };

  const handleConvertToInvoice = () => {
    setShowConvertModal(true);
  };

  const getStatusBadgeClass = (status: string) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'DRAFT':
        return `${baseClass} bg-gray-200 text-gray-800`;
      case 'PENDING':
        return `${baseClass} bg-blue-100 text-blue-800`;
      case 'COMPLETED':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'CANCELED':
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-gray-200 text-gray-800`;
    }
  };

  const getStatusActions = () => {
    switch (purchaseOrder.status) {
      case 'DRAFT':
        return (
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => handleStatusChange('PENDING')}
              className="flex items-center justify-between px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
            >
              <span className="flex items-center">
                <DocumentText size={18} className="mr-2" />
                Passer en attente
              </span>
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => handleStatusChange('CANCELED')}
              className="flex items-center justify-between px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
            >
              <span className="flex items-center">
                <ClipboardClose size={18} className="mr-2" />
                Annuler
              </span>
              <ArrowRight size={16} />
            </button>
          </div>
        );
      case 'PENDING':
        return (
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => handleStatusChange('COMPLETED')}
              className="flex items-center justify-between px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
            >
              <span className="flex items-center">
                <ClipboardTick size={18} className="mr-2" />
                Marquer comme complété
              </span>
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => handleStatusChange('CANCELED')}
              className="flex items-center justify-between px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
            >
              <span className="flex items-center">
                <ClipboardClose size={18} className="mr-2" />
                Annuler
              </span>
              <ArrowRight size={16} />
            </button>
          </div>
        );
      case 'CANCELED':
        return (
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => handleStatusChange('DRAFT')}
              className="flex items-center justify-between px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <span className="flex items-center">
                <DocumentLike size={18} className="mr-2" />
                Repasser en brouillon
              </span>
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => handleStatusChange('PENDING')}
              className="flex items-center justify-between px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
            >
              <span className="flex items-center">
                <DocumentText size={18} className="mr-2" />
                Passer en attente
              </span>
              <ArrowRight size={16} />
            </button>
          </div>
        );
      case 'COMPLETED':
        return (
          <div className="flex flex-col space-y-2">
            {!purchaseOrder.convertedToInvoice && (
              <button 
                onClick={handleConvertToInvoice}
                className="flex items-center justify-between px-4 py-2 bg-violet-50 text-violet-700 rounded-md hover:bg-violet-100 transition-colors"
              >
                <span className="flex items-center">
                  <Receipt21 size={18} className="mr-2" />
                  Convertir en facture
                </span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-lg overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Détails du bon de commande</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">
              {purchaseOrder.prefix}{purchaseOrder.number}
            </h3>
            <span className={getStatusBadgeClass(purchaseOrder.status || '')}>
              {purchaseOrder.status === 'DRAFT' && 'Brouillon'}
              {purchaseOrder.status === 'PENDING' && 'En attente'}
              {purchaseOrder.status === 'COMPLETED' && 'Complété'}
              {purchaseOrder.status === 'CANCELED' && 'Annulé'}
            </span>
          </div>
          <p className="text-gray-600">
            Créé le {format(new Date(purchaseOrder.createdAt || ''), 'dd MMMM yyyy', { locale: fr })}
          </p>
          {purchaseOrder.validUntil && (
            <p className="text-gray-600">
              Valable jusqu'au {format(new Date(purchaseOrder.validUntil), 'dd MMMM yyyy', { locale: fr })}
            </p>
          )}
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-2">Client</h4>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="font-medium">{purchaseOrder.client?.name}</p>
            <p className="text-gray-600">{purchaseOrder.client?.email}</p>
            {purchaseOrder.client?.address && (
              <p className="text-gray-600 text-sm mt-1">
                {purchaseOrder.client.address.street}, {purchaseOrder.client.address.postalCode} {purchaseOrder.client.address.city}
              </p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-2">Montant</h4>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between">
              <span>Total HT</span>
              <span>{formatCurrency(purchaseOrder.totalHT || 0)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>TVA</span>
              <span>{formatCurrency(purchaseOrder.totalVAT || 0)}</span>
            </div>
            {purchaseOrder.discount && purchaseOrder.discount > 0 && (
              <div className="flex justify-between mt-1 text-red-600">
                <span>Remise</span>
                <span>-{formatCurrency(purchaseOrder.discountAmount || 0)}</span>
              </div>
            )}
            <div className="flex justify-between mt-2 font-bold">
              <span>Total TTC</span>
              <span>{formatCurrency(purchaseOrder.finalTotalTTC || 0)}</span>
            </div>
          </div>
        </div>

        {purchaseOrder.convertedToInvoice && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Facture liée</h4>
            <div 
              className="bg-violet-50 p-3 rounded-md cursor-pointer hover:bg-violet-100 transition-colors"
              onClick={() => navigate(`/factures/${purchaseOrder.convertedToInvoice?.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Receipt21 size={18} className="text-violet-600 mr-2" />
                  <span className="font-medium text-violet-700">Facture {purchaseOrder.convertedToInvoice.number}</span>
                </div>
                <ArrowRight size={16} className="text-violet-600" />
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h4 className="font-semibold mb-2">Actions</h4>
          <div className="flex flex-col space-y-2">
            <button 
              onClick={handleViewDetails}
              className="flex items-center justify-between px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <span className="flex items-center">
                <DocumentText size={18} className="mr-2" />
                Voir les détails
              </span>
              <ArrowRight size={16} />
            </button>
            
            {purchaseOrder.status !== 'COMPLETED' && (
              <button 
                onClick={handleEdit}
                className="flex items-center justify-between px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span className="flex items-center">
                  <Edit size={18} className="mr-2" />
                  Modifier
                </span>
                <ArrowRight size={16} />
              </button>
            )}
            
            {(purchaseOrder.status === 'DRAFT' || purchaseOrder.status === 'PENDING') && !purchaseOrder.convertedToInvoice && (
              <button 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="flex items-center justify-between px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
              >
                <span className="flex items-center">
                  <Trash size={18} className="mr-2" />
                  Supprimer
                </span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-2">Changer le statut</h4>
          {getStatusActions()}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le bon de commande"
        message="Êtes-vous sûr de vouloir supprimer ce bon de commande ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />

      {showConvertModal && (
        <PurchaseOrderInvoiceCreationModal
          purchaseOrder={purchaseOrder}
          onClose={() => setShowConvertModal(false)}
          onSuccess={() => {
            setShowConvertModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default PurchaseOrderSidebar;
