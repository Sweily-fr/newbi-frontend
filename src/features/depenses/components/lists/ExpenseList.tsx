import React, { useState } from 'react';
import { Table, ActionMenuItem } from '../../../../components/common/Table';
import Button from '../../../../components/common/Button';
import { ConfirmDialog } from '../../../../components/common/ConfirmDialog';
import { 
  Expense, 
  ExpenseStatus, 
  EXPENSE_CATEGORY_LABELS, 
  EXPENSE_STATUS_LABELS,
  OCRMetadata
} from '../../types';
import { 
  Edit, 
  Trash, 
  TickCircle, 
  CloseCircle, 
  DocumentText, 
  InfoCircle, 
  Eye, 
  Receipt2,
  Add
} from 'iconsax-react';
import { formatCurrency, formatDate } from '../../../../utils/formatters';

// Styles définis avec Tailwind CSS directement dans les composants

// Fonction utilitaire pour obtenir l'icône en fonction du statut
// (Utilisée dans le rendu des badges de statut)

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

// Interface pour les données de création de dépense à partir d'OCR
export interface CreateExpenseData {
  title: string;
  amount: number;
  date: string;
  vendor?: string;
  vendorVatNumber?: string;
  invoiceNumber?: string;
  vatAmount?: number;
  currency?: string;
  ocrFile: File;
  ocrData: OCRMetadata;
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
  
  const handleDelete = (expense: Expense) => {
    setExpenseToDelete(expense);
  };
  
  const confirmDelete = () => {
    if (expenseToDelete) {
      onDelete(expenseToDelete);
      setExpenseToDelete(null);
    }
  };
  
  // Définir les actions disponibles pour le menu d'actions
  const getActionItems = (): ActionMenuItem<Expense>[] => {
    const items: ActionMenuItem<Expense>[] = [
      {
        label: 'Voir',
        icon: <Eye size={16} variant="Linear" color="#5b50ff" />,
        onClick: (expense) => onView(expense)
      },
      {
        label: 'Modifier',
        icon: <Edit size={16} variant="Linear" color="#5b50ff" />,
        onClick: (expense) => onEdit(expense)
      },
      {
        label: 'Supprimer',
        icon: <Trash size={16} variant="Linear" color="#ef4444" />,
        onClick: (expense) => handleDelete(expense),
        variant: 'danger'
      }
    ];
    
    return items;
  };
  
  
  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#f0eeff] text-[#5b50ff] mb-4">
          <Receipt2 size={40} variant="Bold" color="#5b50ff" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Aucune dépense</h3>
        <p className="text-gray-500 mb-6 text-center">Vous n'avez pas encore créé de dépense. Commencez par en créer une nouvelle.</p>
        
        <div className="flex gap-4">
          <Button 
            className="bg-[#5b50ff] border-[#5b50ff] hover:bg-[#4a41e0] hover:border-[#4a41e0]"
            onClick={() => onCreateExpense && onCreateExpense({} as CreateExpenseData)}
          >
            <Add size={18} className="mr-2" color="#ffffff" />
            Créer une dépense
          </Button>
          
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Liste des dépenses</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table
          columns={[
            {
              header: 'Titre',
              accessor: (row: Expense) => row.title,
              className: 'min-w-[200px]',
              align: 'left'
            },
            {
              header: 'Montant',
              accessor: (row: Expense) => (
                <div className="font-medium text-left w-full">
                  {formatCurrency(row.amount, row.currency)}
                </div>
              ),
              align: 'left',
              className: 'min-w-[120px]'
            },
            {
              header: 'Catégorie',
              accessor: (row: Expense) => EXPENSE_CATEGORY_LABELS[row.category],
              className: 'min-w-[150px]',
              align: 'left'
            },
            {
              header: 'Date',
              accessor: (row: Expense) => formatDate(row.date),
              className: 'min-w-[120px]',
              align: 'left'
            },
            {
              header: 'Statut',
              accessor: (row: Expense) => renderStatus(row.status),
              className: 'min-w-[120px]',
              align: 'left'
            },
            {
              header: 'Actions',
              accessor: () => null,
              align: 'right',
              isAction: true,
              className: 'min-w-[100px] text-right pr-6 [&>div]:justify-end [&>div]:w-full'
            }
          ]}
          data={expenses}
          keyExtractor={(expense) => expense.id}
          className={`${loading ? 'opacity-70' : ''}`}
          actionItems={getActionItems()}
          actionButtonLabel="Actions"
        />
      </div>
      
      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            isLoading={loading}
          >
            Charger plus
          </Button>
        </div>
      )}
      
      <ConfirmDialog
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer la dépense"
        message={`Êtes-vous sûr de vouloir supprimer la dépense "${expenseToDelete?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
      
    </div>
  );
};

export default ExpenseList;
