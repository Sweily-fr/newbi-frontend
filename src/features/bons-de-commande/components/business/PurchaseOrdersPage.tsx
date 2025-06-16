import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { 
  DocumentText, 
  Add, 
  SearchNormal1, 
  CloseCircle 
} from 'iconsax-react';
import { GET_PURCHASE_ORDERS, GET_PURCHASE_ORDER_STATS } from '../../graphql';
import PurchaseOrdersTable from './PurchaseOrdersTable';
import PurchaseOrderSidebar from './PurchaseOrderSidebar';
import { formatCurrency } from '../../../../utils/formatters';
import DateRangePicker from '../../../../components/common/DateRangePicker';
import { PurchaseOrder } from '../../types';

const PurchaseOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sidebarId = searchParams.get('id');

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const limit = 10;

  // Effet pour le debounce de la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Réinitialiser la page à 1 quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedStatus, dateRange]);

  // Requête pour les bons de commande
  const { data, loading, refetch } = useQuery(GET_PURCHASE_ORDERS, {
    variables: {
      page: currentPage,
      limit,
      search: debouncedSearchTerm || undefined,
      status: selectedStatus || undefined,
      startDate: dateRange.startDate ? dateRange.startDate.toISOString() : undefined,
      endDate: dateRange.endDate ? dateRange.endDate.toISOString() : undefined
    },
    fetchPolicy: 'network-only'
  });

  // Requête pour les statistiques
  const { data: statsData } = useQuery(GET_PURCHASE_ORDER_STATS, {
    fetchPolicy: 'network-only'
  });

  const purchaseOrders: PurchaseOrder[] = data?.purchaseOrders?.purchaseOrders || [];
  const totalCount = data?.purchaseOrders?.totalCount || 0;
  const stats = statsData?.purchaseOrderStats || {
    totalCount: 0,
    draftCount: 0,
    pendingCount: 0,
    completedCount: 0,
    canceledCount: 0,
    totalAmount: 0
  };

  const handleStatusFilter = (status: string | null) => {
    if (selectedStatus === status) {
      setSelectedStatus(null);
    } else {
      setSelectedStatus(status);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedStatus(null);
    setDateRange({ startDate: null, endDate: null });
  };

  const hasActiveFilters = !!debouncedSearchTerm || !!selectedStatus || !!dateRange.startDate || !!dateRange.endDate;

  const closeSidebar = () => {
    navigate('/bons-de-commande');
  };

  return (
    <div className="flex h-full">
      <div className={`flex-1 overflow-hidden transition-all ${sidebarId ? 'mr-0 lg:mr-96' : ''}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0 flex items-center text-gray-800">
              <DocumentText size={28} className="mr-2 text-violet-600" />
              Bons de commande
            </h1>
            <button
              onClick={() => navigate('/bons-de-commande/new')}
              className="flex items-center justify-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
            >
              <Add size={20} className="mr-1" />
              Nouveau bon de commande
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-violet-50 rounded-lg p-4 flex flex-col">
                <span className="text-sm text-violet-600 mb-1">Total</span>
                <span className="text-2xl font-bold text-violet-800">{stats.totalCount}</span>
                <span className="text-sm text-violet-600 mt-1">{formatCurrency(stats.totalAmount || 0)}</span>
              </div>
              <div 
                className={`rounded-lg p-4 flex flex-col cursor-pointer ${selectedStatus === 'DRAFT' ? 'bg-gray-800 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => handleStatusFilter('DRAFT')}
              >
                <span className={`text-sm ${selectedStatus === 'DRAFT' ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Brouillons</span>
                <span className="text-2xl font-bold">{stats.draftCount}</span>
              </div>
              <div 
                className={`rounded-lg p-4 flex flex-col cursor-pointer ${selectedStatus === 'PENDING' ? 'bg-blue-800 text-white' : 'bg-blue-50 hover:bg-blue-100'}`}
                onClick={() => handleStatusFilter('PENDING')}
              >
                <span className={`text-sm ${selectedStatus === 'PENDING' ? 'text-blue-200' : 'text-blue-600'} mb-1`}>En attente</span>
                <span className="text-2xl font-bold">{stats.pendingCount}</span>
              </div>
              <div 
                className={`rounded-lg p-4 flex flex-col cursor-pointer ${selectedStatus === 'COMPLETED' ? 'bg-green-800 text-white' : 'bg-green-50 hover:bg-green-100'}`}
                onClick={() => handleStatusFilter('COMPLETED')}
              >
                <span className={`text-sm ${selectedStatus === 'COMPLETED' ? 'text-green-200' : 'text-green-600'} mb-1`}>Complétés</span>
                <span className="text-2xl font-bold">{stats.completedCount}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchNormal1 size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par numéro, client..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="flex items-center">
              <DateRangePicker
                onChange={(range) => setDateRange({
                  startDate: range.startDate,
                  endDate: range.endDate
                })}
                initialRange={dateRange.startDate && dateRange.endDate ? {
                  startDate: dateRange.startDate,
                  endDate: dateRange.endDate
                } : undefined}
                className="w-64"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <CloseCircle size={18} className="mr-1" />
                Effacer les filtres
              </button>
            )}
          </div>

          <div className="flex-1 overflow-auto bg-white rounded-lg shadow-sm">
            <PurchaseOrdersTable
              purchaseOrders={purchaseOrders}
              totalCount={totalCount}
              currentPage={currentPage}
              limit={limit}
              onPageChange={setCurrentPage}
              onRefetch={refetch}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {sidebarId && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 z-20 transform transition-transform duration-300 ease-in-out bg-white shadow-lg">
          <PurchaseOrderSidebar
            purchaseOrderId={sidebarId}
            onClose={closeSidebar}
          />
        </div>
      )}
    </div>
  );
};

export default PurchaseOrdersPage;
