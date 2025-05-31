import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { TabNavigation } from '../components/specific/navigation/TabNavigation';
import { SEOHead } from '../components/specific/SEO/SEOHead';
import { 
  ExpenseList, 
  ExpenseFilters, 
  ExpenseStats, 
  ExpenseFormModal, 
  ExpensePreview 
} from '../features/depenses/components';
import { useExpenses } from '../features/depenses/hooks/useExpenses';
import { 
  Expense, 
  ExpenseFilters as ExpenseFiltersType, 
  ExpenseStatus,
  OCRMetadata,
  CreateExpenseData,
  ExpenseCategory
} from '../features/depenses/types';
import { 
  Add, 
  Receipt2, 
  DocumentText, 
  Chart, 
  ArrowRight2 
} from 'iconsax-react';
import { logger } from '../utils/logger';

// Styles définis avec Tailwind CSS directement dans les composants

const initialFilters: ExpenseFiltersType = {
  search: '',
  startDate: null,
  endDate: null,
  category: '',
  status: '',
  tags: []
};

const ExpensesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>('list');
  
  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (tabId: string | null) => {
    if (tabId) setActiveTab(tabId);
  };
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [filters, setFilters] = useState<ExpenseFiltersType>(initialFilters);
  
  const { 
    expenses,
    loading,
    hasNextPage,
    stats,
    updateFilters,
    refetchExpenses,
    loadMoreExpenses,
    deleteExpense,
    changeExpenseStatus
  } = useExpenses();
  
  // Extraire les statistiques avec des valeurs par défaut
  const totalAmount = stats?.totalAmount || 0;
  const expenseCount = stats?.totalCount || 0;
  
  // Calculer les montants par statut à partir des données byStatus
  const approvedAmount = stats?.byStatus?.find(s => s.status === ExpenseStatus.APPROVED)?.amount || 0;
  const rejectedAmount = stats?.byStatus?.find(s => s.status === ExpenseStatus.REJECTED)?.amount || 0;
  const pendingAmount = stats?.byStatus?.find(s => s.status === ExpenseStatus.PENDING)?.amount || 0;
  
  // Calculer la variation mensuelle (si disponible)
  const currentMonth = new Date().getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const currentMonthData = stats?.byMonth?.find(m => new Date(m.month).getMonth() === currentMonth);
  const previousMonthData = stats?.byMonth?.find(m => new Date(m.month).getMonth() === previousMonth);
  const monthlyChange = previousMonthData?.amount && previousMonthData.amount !== 0
    ? ((currentMonthData?.amount || 0) - (previousMonthData?.amount || 0)) / previousMonthData.amount * 100
    : 0;
  
  // Utiliser les données de catégorie directement
  const categoryDistribution = stats?.byCategory || [];
  
  useEffect(() => {
    // Mettre à jour les filtres dans le hook useExpenses
    updateFilters(filters);
    // Ensuite, récupérer les dépenses
    refetchExpenses();
    logger.debug('Fetching expenses with filters:', filters);
  }, [filters, refetchExpenses, updateFilters]);
  
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
  
  const handleFiltersChange = (newFilters: ExpenseFiltersType) => {
    setFilters(newFilters);
  };
  
  const handleResetFilters = () => {
    setFilters(initialFilters);
  };
  
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
        icon={<Receipt2 size={32} variant="Bold" className="text-[#5b50ff]" />}
        actions={
          <Button
            className="bg-[#5b50ff] border-[#5b50ff] hover:bg-[#4a41e0] hover:border-[#4a41e0]"
            onClick={handleCreateExpense}
          >
            <Add size={20} className="mr-2" />
            Créer une dépense
          </Button>
        }
      />
      
      <div className="mt-8">
        <TabNavigation
          tabs={[
            {
              id: 'list',
              label: 'Liste des dépenses',
              icon: <DocumentText size={20} />
            },
            {
              id: 'stats',
              label: 'Statistiques',
              icon: <Chart size={20} />
            }
          ]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          variant="pills"
        />
        
        <div className="mt-6">
          {activeTab === 'list' && (
            <div className="mt-6">
              <ExpenseFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={handleResetFilters}
              />
              
              <ExpenseList
                expenses={expenses}
                hasNextPage={hasNextPage}
                loading={loading}
                onView={handleViewExpense}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
                onLoadMore={loadMoreExpenses}
                onCreateExpense={handleCreateExpenseFromOCR}
              />
            </div>
          )}
          
          {activeTab === 'stats' && (
            <div className="mt-6">
              <ExpenseStats
                loading={loading}
                totalAmount={totalAmount}
                currency="EUR"
                expenseCount={expenseCount}
                approvedAmount={approvedAmount}
                rejectedAmount={rejectedAmount}
                pendingAmount={pendingAmount}
                monthlyChange={monthlyChange}
                categoryDistribution={categoryDistribution}
              />
              
              <ExpenseList
                expenses={expenses}
                hasNextPage={hasNextPage}
                loading={loading}
                onView={handleViewExpense}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
                onLoadMore={loadMoreExpenses}
                onCreateExpense={handleCreateExpenseFromOCR}
              />
            </div>
          )}
        </div>
        
        <ExpenseFormModal
          isOpen={isFormModalOpen}
          onClose={handleFormCancel}
          onSubmit={handleFormSubmit}
          expense={selectedExpense}
          onStatusChange={handleStatusChange}
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
