import React from 'react';
import Card from '../../../../components/common/Card';
import { 
  ExpenseCategory 
} from '../../types';
import { 
  Chart, 
  Money, 
  DocumentText, 
  TickCircle, 
  CloseCircle, 
  Calendar, 
  Category 
} from 'iconsax-react';
import { formatCurrency } from '../../../../utils/formatters';
import { logger } from '../../../../utils/logger';

// Styles définis avec Tailwind CSS directement dans les composants

interface ExpenseStatsProps {
  loading: boolean;
  totalAmount: number;
  currency: string;
  expenseCount: number;
  approvedAmount: number;
  rejectedAmount: number;
  pendingAmount: number;
  monthlyChange: number;
  categoryDistribution: Record<ExpenseCategory, number>;
}

const ExpenseStats: React.FC<ExpenseStatsProps> = ({
  loading,
  totalAmount,
  currency,
  expenseCount,
  approvedAmount,
  rejectedAmount,
  pendingAmount,
  monthlyChange,
  categoryDistribution
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="p-4">
            <div className="animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Trouver la catégorie principale
  let mainCategory = 'Aucune';
  if (Object.entries(categoryDistribution).length > 0) {
    mainCategory = Object.entries(categoryDistribution)
      .sort((a, b) => b[1] - a[1])[0][0];
    logger.debug('Main expense category:', mainCategory);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(91,80,255,0.12)] text-[#5b50ff]">
            <Money size={24} variant="Bold" />
          </div>
          <h3 className="text-sm font-medium text-gray-500 m-0">Montant total</h3>
        </div>
        <div className="text-2xl font-semibold text-gray-900">{formatCurrency(totalAmount, currency)}</div>
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className={`font-medium ${monthlyChange > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {monthlyChange > 0 ? '+' : ''}{monthlyChange}%
          </span>
          <span className="text-gray-500">vs mois précédent</span>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(16,185,129,0.12)] text-emerald-500">
            <DocumentText size={24} variant="Bold" />
          </div>
          <h3 className="text-sm font-medium text-gray-500 m-0">Nombre de dépenses</h3>
        </div>
        <div className="text-2xl font-semibold text-gray-900">{expenseCount}</div>
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className="text-gray-500">Total des dépenses enregistrées</span>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(245,158,11,0.12)] text-amber-500">
            <Category size={24} variant="Bold" />
          </div>
          <h3 className="text-sm font-medium text-gray-500 m-0">Catégorie principale</h3>
        </div>
        <div className="text-2xl font-semibold text-gray-900">
          {mainCategory}
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className="text-gray-500">Basé sur le montant total</span>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(59,130,246,0.12)] text-blue-500">
            <Chart size={24} variant="Bold" />
          </div>
          <h3 className="text-sm font-medium text-gray-500 m-0">Statut des dépenses</h3>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-1">
              <TickCircle size={16} color="#10b981" variant="Bold" />
              <span className="text-xs text-gray-500">Approuvées</span>
            </div>
            <div className="text-base font-medium">
              {formatCurrency(approvedAmount, currency)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <CloseCircle size={16} color="#ef4444" variant="Bold" />
              <span className="text-xs text-gray-500">Rejetées</span>
            </div>
            <div className="text-base font-medium">
              {formatCurrency(rejectedAmount, currency)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Calendar size={16} color="#f59e0b" variant="Bold" />
              <span className="text-xs text-gray-500">En attente</span>
            </div>
            <div className="text-base font-medium">
              {formatCurrency(pendingAmount, currency)}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExpenseStats;
