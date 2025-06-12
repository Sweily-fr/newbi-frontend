import React, { useState } from 'react';
import { Table } from '../../../../components/common/Table';
import { Column } from '@/components/common/Table';
import Button from '../../../../components/common/Button';
import { ConfirmDialog } from '../../../../components/common/ConfirmDialog';
import { 
  Expense, 
  ExpenseStatus, 
  ExpenseCategory,
  EXPENSE_CATEGORY_LABELS, 
  EXPENSE_STATUS_LABELS,
  OCRMetadata,
  CreateExpenseData
} from '../../types';
import { 
  Edit, 
  Trash, 
  TickCircle, 
  CloseCircle, 
  DocumentText, 
  InfoCircle, 
  Eye, 
  DocumentUpload,
  Add
} from 'iconsax-react';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
import { logger } from '../../../../utils/logger';
import ExpenseImportModal from '../forms/ExpenseImportModal';

// Fonction pour obtenir l'icône et les classes en fonction du statut
const renderStatus = (status: ExpenseStatus) => {
  let variant = '';
  const statusText = EXPENSE_STATUS_LABELS[status];
  let icon = null;

  switch (status) {
    case ExpenseStatus.DRAFT:
      variant = 'warning';
      icon = <DocumentText size={16} variant="Bold" className="mr-2" color="#f59e0b" />;
      break;
    case ExpenseStatus.PENDING:
      variant = 'primary';
      icon = <InfoCircle size={16} variant="Bold" className="mr-2" color="#5b50ff" />;
      break;
    case ExpenseStatus.APPROVED:
      variant = 'success';
      icon = <TickCircle size={16} variant="Bold" className="mr-2" color="#10b981" />;
      break;
    case ExpenseStatus.PAID:
      variant = 'success';
      icon = <TickCircle size={16} variant="Bold" className="mr-2" color="#10b981" />;
      break;
    case ExpenseStatus.REJECTED:
      variant = 'danger';
      icon = <CloseCircle size={16} variant="Bold" className="mr-2" color="#ef4444" />;
      break;
    default:
      variant = 'default';
      icon = <DocumentText size={16} variant="Bold" className="mr-2" color="#6b7280" />;
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

interface ExpenseListProps {
  expenses: Expense[];
  hasNextPage: boolean;
  loading: boolean;
  onView: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onLoadMore: () => void;
  onCreateExpense?: (data: CreateExpenseData) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  hasNextPage,
  loading,
  onView,
  onEdit,
  onDelete,
  onLoadMore,
  onCreateExpense
}) => {
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);

  const handleDelete = (expense: Expense) => {
    setExpenseToDelete(expense);
  };

  const confirmDelete = async () => {
    if (expenseToDelete) {
      await onDelete(expenseToDelete);
      setExpenseToDelete(null);
    }
  };
  

  const handleProcessOCR = async (ocrData: OCRMetadata, file: File) => {
    try {
      setIsProcessing(true);
      setOcrError(null);
      
      // Créer un objet compatible avec CreateExpenseData
      const expenseData: CreateExpenseData = {
        title: ocrData.vendorName || 'Nouvelle dépense',
        amount: ocrData.totalAmount || 0,
        date: ocrData.invoiceDate || new Date().toISOString().split('T')[0],
        vendor: ocrData.vendorName,
        vendorVatNumber: ocrData.vendorVatNumber,
        invoiceNumber: ocrData.invoiceNumber,
        category: ExpenseCategory.OTHER,
        ocrData: {
          ...ocrData,
          vendorName: ocrData.vendorName,
          invoiceDate: ocrData.invoiceDate,
          totalAmount: ocrData.totalAmount,
          vendorVatNumber: ocrData.vendorVatNumber,
          rawExtractedText: ocrData.rawExtractedText || ''
        },
        ocrFile: file
      };
      
      if (onCreateExpense) {
        await onCreateExpense(expenseData);
      }
      
      setIsImportModalOpen(false);
    } catch (error) {
      logger.error('Erreur lors de la création de la dépense depuis OCR:', error);
      setOcrError('Une erreur est survenue lors du traitement de la facture. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleImportClick = () => {
    setOcrError(null);
    setIsImportModalOpen(true);
  };

  // Rendu du modal d'importation
  const renderImportModal = () => {
    return (
      <ExpenseImportModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setOcrError(null);
        }}
        onCreateExpense={handleProcessOCR}
      />
    );
  };

  // Rendu du bouton d'importation
  const renderImportButton = () => {
    return (
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline"
          className="border-[#5b50ff] text-[#5b50ff] hover:bg-[#f0eeff]"
          onClick={handleImportClick}
          data-import-button
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#5b50ff] mr-2"></div>
              Traitement...
            </>
          ) : (
            <>
              <DocumentUpload size={20} className="mr-2" color="#5b50ff" />
              Importer une facture
            </>
          )}
        </Button>
      </div>
    );
  };

  // Configuration des colonnes du tableau
  const columns: Column<Expense>[] = [
    {
      header: 'Description',
      accessor: (row: Expense) => (
        <div className="font-medium text-gray-900">
          {row.title}
          {row.vendor && <div className="text-sm text-gray-500">{row.vendor}</div>}
          {row.invoiceNumber && <div className="text-xs text-gray-400">Facture #{row.invoiceNumber}</div>}
        </div>
      ),
      className: 'min-w-[200px]',
      align: 'left' as const
    },
    {
      header: 'Montant',
      accessor: (row: Expense) => (
        <div className="font-medium">
          {formatCurrency(row.amount, 'EUR')}
        </div>
      ),
      align: 'left' as const,
      className: 'min-w-[120px]'
    },
    {
      header: 'Catégorie',
      accessor: (row: Expense) => EXPENSE_CATEGORY_LABELS[row.category],
      className: 'min-w-[150px]',
      align: 'left' as const
    },
    {
      header: 'Date',
      accessor: (row: Expense) => formatDate(row.date),
      className: 'min-w-[120px]',
      align: 'left' as const
    },
    {
      header: 'Statut',
      accessor: (row: Expense) => renderStatus(row.status),
      className: 'min-w-[120px]',
      align: 'left' as const
    },
    {
      header: 'Actions',
      accessor: (row: Expense) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onView(row)}
            className="text-[#5b50ff] hover:text-[#4a41e0] p-1 rounded-full hover:bg-[#f0eeff]"
            title="Voir les détails"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onEdit(row)}
            className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
            title="Modifier"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
            title="Supprimer"
          >
            <Trash size={18} />
          </button>
        </div>
      ),
      align: 'right' as const,
      isAction: true,
      className: 'min-w-[100px] text-right pr-6 [&>div]:justify-end [&>div]:w-full'
    }
  ];

  return (
    <div className="space-y-6">
      {renderImportButton()}
      {renderImportModal()}
      
      <Table
        columns={columns}
        data={expenses}
        keyExtractor={(expense) => expense.id}
        emptyState={{
          icon: <DocumentText size={48} className="mx-auto text-gray-400" />,
          title: 'Aucune dépense',
          description: 'Commencez par créer votre première dépense',
          action: (
            <Button
              onClick={() => {
                if (onCreateExpense) {
                  onCreateExpense({
                    title: 'Nouvelle dépense',
                    amount: 0,
                    date: new Date().toISOString().split('T')[0],
                    category: ExpenseCategory.OTHER,
                    ocrData: {
                      vendorName: '',
                      invoiceDate: new Date().toISOString().split('T')[0],
                      totalAmount: 0,
                      vendorVatNumber: '',
                      rawExtractedText: ''
                    },
                    ocrFile: new File([], '')
                  });
                }
              }}
              className="bg-[#5b50ff] hover:bg-[#4a41e0] text-white"
            >
              <Add size={20} className="mr-2" />
              Nouvelle dépense
            </Button>
          )
        }}
      />
      
      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={onLoadMore}
            variant="outline"
            disabled={loading}
            className="border-[#5b50ff] text-[#5b50ff] hover:bg-[#f0eeff]"
          >
            {loading ? 'Chargement...' : 'Afficher plus'}
          </Button>
        </div>
      )}
      
      <ConfirmDialog
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer la dépense"
        message="Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
      
      {ocrError && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center">
          <CloseCircle size={20} className="mr-2" />
          <span>{ocrError}</span>
          <button 
            onClick={() => setOcrError(null)}
            className="ml-4 text-red-700 hover:text-red-900"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
