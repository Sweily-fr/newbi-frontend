import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { SEOHead } from '../components/specific/SEO/SEOHead';
import ExpenseList from '../features/depenses/components/lists/ExpenseList';
import ExpenseFormModal from '../features/depenses/components/forms/ExpenseFormModal';
import ExpensePreview from '../features/depenses/components/forms/ExpensePreview';
import { useExpenses } from '../features/depenses/hooks/useExpenses';
import { 
  Expense, 
  ExpenseStatus,
  CreateExpenseData,
  ExpenseCategory
} from '../features/depenses/types';
import { 
  Add, 
  Receipt2, 
  SearchNormal1 as Search
} from 'iconsax-react';
import { logger } from '../utils/logger';

// Styles définis avec Tailwind CSS directement dans les composants

const ExpensesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const { 
    expenses,
    loading,
    hasNextPage,
    refetchExpenses,
    loadMoreExpenses,
    deleteExpense,
    changeExpenseStatus
  } = useExpenses();
  
  useEffect(() => {
    // Récupérer les dépenses au chargement de la page
    refetchExpenses();
    logger.debug('Fetching expenses');
  }, [refetchExpenses]);
  
  // Fonction pour filtrer les dépenses par la recherche
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Ouvre le formulaire de création de dépense avec une dépense vide
  const handleCreateExpense = () => {
    setSelectedExpense(null);
    setIsFormModalOpen(true);
  };
  
  // Fonction pour créer une dépense à partir des données OCR
  const handleCreateExpenseFromOCR = (data: CreateExpenseData) => {
    logger.debug('Création d\'une dépense à partir des données OCR:', data);
    
    // Créer une nouvelle dépense avec les données OCR
    const newExpense: Partial<Expense> = {
      title: data.title || 'Nouvelle dépense',
      amount: data.amount || 0,
      date: data.date || new Date().toISOString().split('T')[0],
      category: data.category as ExpenseCategory || ExpenseCategory.OTHER,
      status: ExpenseStatus.DRAFT,
      notes: `Créé à partir d'un document importé${data.invoiceNumber ? ` (N° ${data.invoiceNumber})` : ''}`,
      files: [],
      ocrMetadata: data.ocrData
    };
    
    // Ouvrir le modal de création avec les données pré-remplies
    setSelectedExpense(newExpense as Expense);
    setIsFormModalOpen(true);
  };
  
  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsFormModalOpen(true);
  };
  
  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsPreviewOpen(true);
  };
  
  const handleDeleteExpense = async (expense: Expense) => {
    try {
      await deleteExpense(expense.id);
      refetchExpenses();
    } catch (error) {
      logger.error('Error deleting expense:', error);
    }
  };
  
  const handleFormSubmit = () => {
    setIsFormModalOpen(false);
    refetchExpenses();
  };
  
  const handleFormCancel = () => {
    setIsFormModalOpen(false);
  };
  
  // Filtrer les dépenses en fonction de la recherche
  const filteredExpenses = expenses.filter(expense => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      expense.title.toLowerCase().includes(query) ||
      (expense.vendor && expense.vendor.toLowerCase().includes(query)) ||
      (expense.description && expense.description.toLowerCase().includes(query)) ||
      (expense.invoiceNumber && expense.invoiceNumber.toLowerCase().includes(query))
    );
  });
  
  const handleStatusChange = async (expenseId: string, newStatus: ExpenseStatus) => {
    try {
      await changeExpenseStatus(expenseId, newStatus);
      refetchExpenses();
    } catch (error) {
      logger.error('Error changing expense status:', error);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <SEOHead 
        title="Gestion des dépenses | Newbi"
        description="Gérez vos dépenses professionnelles, suivez vos remboursements et analysez vos coûts."
      />
      
      <PageHeader
        title="Gestion des dépenses"
        description="Suivez et gérez vos dépenses professionnelles"
        icon={<Receipt2 size={32} variant="Bold" color="#5b50ff" />}
        actions={
          <div className="flex gap-3">
            <Button
              className="bg-[#5b50ff] border-[#5b50ff] hover:bg-[#4a41e0] hover:border-[#4a41e0]"
              onClick={handleCreateExpense}
            >
              <Add size={20} className="mr-2" color="#ffffff" />
              Créer une dépense
            </Button>
            <Button
              variant="outline"
              className="border-[#5b50ff] text-[#5b50ff] hover:bg-[#f0eeff]"
              onClick={() => {
                // Ouvrir le modal d'import OCR dans ExpenseList
                const importButton = document.querySelector('[data-import-button]');
                if (importButton) {
                  (importButton as HTMLButtonElement).click();
                }
              }}
            >
              <Receipt2 size={20} className="mr-2" color="#5b50ff" />
              Importer une facture
            </Button>
          </div>
        }
      />
      
      <div className="mt-8">
        <div className="mb-6">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Rechercher une dépense..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} color="#9ca3af" />
          </div>
        </div>
        
        <div id="expense-list-container">
          <ExpenseList
            expenses={filteredExpenses}
            hasNextPage={hasNextPage}
            loading={loading}
            onView={handleViewExpense}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            onLoadMore={loadMoreExpenses}
            onCreateExpense={handleCreateExpenseFromOCR}
          />
        </div>
        
        <ExpenseFormModal
          isOpen={isFormModalOpen}
          onClose={handleFormCancel}
          onSuccess={handleFormSubmit}
          expense={selectedExpense || undefined}
        />
        
        <ExpensePreview
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          expense={selectedExpense}
          onEdit={handleEditExpense}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default ExpensesPage;
