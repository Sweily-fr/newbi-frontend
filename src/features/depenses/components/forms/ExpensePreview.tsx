import React, { useState } from 'react';
import Button from '../../../../components/common/Button';
import Tooltip from '../../../../components/common/Tooltip';
import Modal from '../../../../components/common/Modal';

// Composant Badge simplifié avec Tailwind CSS
type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-amber-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };
  
  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium leading-none rounded-md whitespace-nowrap ${getVariantClasses()} ${className}`}>
      {children}
    </span>
  );
};

// Composant ConfirmDialog simplifié avec Tailwind CSS
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'info'
}) => {
  const getTitleColor = () => {
    switch (variant) {
      case 'danger':
        return 'text-red-500';
      case 'warning':
        return 'text-amber-500';
      default:
        return 'text-[#5b50ff]';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <h3 className={`text-lg font-semibold ${getTitleColor()}`}>{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
import { 
  Expense, 
  ExpenseStatus, 
  EXPENSE_CATEGORY_LABELS, 
  EXPENSE_STATUS_LABELS, 
  EXPENSE_PAYMENT_METHOD_LABELS 
} from '../../types';
import { 
  Edit, 
  TickCircle, 
  CloseCircle, 
  DocumentText, 
  InfoCircle
} from 'iconsax-react';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
// Import relatif au composant ExpenseFileList créé précédemment
import { ExpenseFileList } from '../index';

// Styles définis avec Tailwind CSS directement dans les composants

const getStatusColor = (status: ExpenseStatus) => {
  switch (status) {
    case ExpenseStatus.APPROVED:
      return 'success';
    case ExpenseStatus.REJECTED:
      return 'error';
    case ExpenseStatus.PAID:
      return 'success';
    case ExpenseStatus.PENDING:
      return 'warning';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: ExpenseStatus) => {
  switch (status) {
    case ExpenseStatus.APPROVED:
      return <TickCircle size={16} variant="Bold" color="#4CAF50" />;
    case ExpenseStatus.REJECTED:
      return <CloseCircle size={16} variant="Bold" color="#F44336" />;
    case ExpenseStatus.PAID:
      return <TickCircle size={16} variant="Bold" color="#4CAF50" />;
    case ExpenseStatus.PENDING:
      return <InfoCircle size={16} variant="Bold" color="#FF9800" />;
    default:
      return <DocumentText size={16} variant="Bold" color="#5b50ff" />;
  }
};

interface ExpensePreviewProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (expense: Expense) => void;
  onStatusChange: (expenseId: string, status: ExpenseStatus) => void;
}

const ExpensePreview: React.FC<ExpensePreviewProps> = ({
  expense,
  isOpen,
  onClose,
  onEdit,
  onStatusChange
}) => {
  const [confirmStatus, setConfirmStatus] = useState<ExpenseStatus | null>(null);
  
  // Si expense est null, ne pas rendre le contenu
  if (!expense) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6">
          <p className="text-center text-gray-500">Aucune dépense sélectionnée</p>
        </div>
      </Modal>
    );
  }
  
  const handleStatusChange = async (status: ExpenseStatus) => {
    try {
      onStatusChange(expense.id, status);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6 md:flex-row flex-col md:gap-0 gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold m-0 mb-2 text-gray-900">{expense.title}</h2>
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant={getStatusColor(expense.status)} 
                className="uppercase text-xs font-semibold"
              >
                {getStatusIcon(expense.status)}
                {EXPENSE_STATUS_LABELS[expense.status]}
              </Badge>
              <span className="text-gray-500 text-sm">
                {formatDate(expense.date)}
              </span>
            </div>
            
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {formatCurrency(expense.amount, expense.currency)}
            </div>
            
            {expense.description && (
              <p className="text-gray-600 mb-4">{expense.description}</p>
            )}
            
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onEdit(expense)}
              >
                <Edit size={16} className="mr-2" color="#5b50ff" />
                Modifier
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 md:items-end">
            {expense.status === ExpenseStatus.PENDING && (
              <div className="flex gap-2">
                <Tooltip content="Approuver">
                  <Button
                    variant="primary"
                    className="bg-emerald-500 hover:bg-emerald-600 border-emerald-500"
                    size="sm"
                    onClick={() => setConfirmStatus(ExpenseStatus.APPROVED)}
                  >
                    <TickCircle size={16} color="#4CAF50" />
                  </Button>
                </Tooltip>
                <Tooltip content="Rejeter">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setConfirmStatus(ExpenseStatus.REJECTED)}
                  >
                    <CloseCircle size={16} color="#F44336" />
                  </Button>
                </Tooltip>
              </div>
            )}
            
            <Tooltip content="Télécharger">
              <Button 
                variant="outline" 
                size="sm"
              >
                Télécharger
              </Button>
            </Tooltip>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Détails de la dépense</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Catégorie</p>
                  <p className="font-medium">{EXPENSE_CATEGORY_LABELS[expense.category]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Méthode de paiement</p>
                  <p className="font-medium">{EXPENSE_PAYMENT_METHOD_LABELS[expense.paymentMethod]}</p>
                </div>
                {expense.paymentDate && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date de paiement</p>
                    <p className="font-medium">{formatDate(expense.paymentDate)}</p>
                  </div>
                )}
                {expense.vatAmount !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Montant TVA</p>
                    <p className="font-medium">{formatCurrency(expense.vatAmount, expense.currency)}</p>
                  </div>
                )}
                {expense.vatRate !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Taux de TVA</p>
                    <p className="font-medium">{expense.vatRate}%</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 mb-1">TVA déductible</p>
                  <p className="font-medium">{expense.isVatDeductible ? 'Oui' : 'Non'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Informations fournisseur</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {expense.vendor ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fournisseur</p>
                    <p className="font-medium">{expense.vendor}</p>
                  </div>
                  {expense.vendorVatNumber && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">N° TVA</p>
                      <p className="font-medium">{expense.vendorVatNumber}</p>
                    </div>
                  )}
                  {expense.invoiceNumber && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">N° Facture</p>
                      <p className="font-medium">{expense.invoiceNumber}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Aucune information fournisseur</p>
              )}
            </div>
          </div>
        </div>
        
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Fichiers attachés</h3>
        {expense.files && expense.files.length > 0 ? (
          <ExpenseFileList files={expense.files} />
        ) : (
          <p className="font-normal mt-0 text-base mb-4">Aucun fichier attaché</p>
        )}
        
        {/* Confirmation de changement de statut */}
        <ConfirmDialog
          isOpen={!!confirmStatus}
          onClose={() => setConfirmStatus(null)}
          onConfirm={() => {
            if (confirmStatus) {
              handleStatusChange(confirmStatus);
              setConfirmStatus(null);
            }
          }}
          title={`${confirmStatus === ExpenseStatus.APPROVED ? 'Approuver' : 'Rejeter'} la dépense`}
          message={`Êtes-vous sûr de vouloir ${confirmStatus === ExpenseStatus.APPROVED ? 'approuver' : 'rejeter'} cette dépense ?`}
          confirmText={confirmStatus === ExpenseStatus.APPROVED ? 'Approuver' : 'Rejeter'}
          cancelText="Annuler"
          variant={confirmStatus === ExpenseStatus.REJECTED ? 'danger' : 'info'}
        />
      </div>
    </Modal>
  );
};

export default ExpensePreview;
