import React from 'react';
import { formatCurrency } from '../../../../utils/formatters';

interface PurchaseOrderInvoiceProgressProps {
  distribution: number[];
  totalAmount: number;
}

const PurchaseOrderInvoiceProgress: React.FC<PurchaseOrderInvoiceProgressProps> = ({
  distribution,
  totalAmount
}) => {
  // Calculer le total des pourcentages
  const totalPercentage = distribution.reduce((acc, val) => acc + val, 0);
  
  // Générer des couleurs pour chaque segment
  const getSegmentColor = (index: number) => {
    const colors = [
      'bg-violet-500',
      'bg-violet-400',
      'bg-violet-300',
      'bg-violet-200',
      'bg-violet-100'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="mt-4">
      <div className="text-sm text-gray-600 mb-2 flex justify-between">
        <span>Répartition des factures</span>
        <span className={totalPercentage !== 100 ? 'text-red-500 font-medium' : 'text-green-600 font-medium'}>
          Total: {totalPercentage}%
        </span>
      </div>
      
      <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden flex">
        {distribution.map((percentage, index) => {
          const width = `${percentage}%`;
          return (
            <div
              key={index}
              className={`${getSegmentColor(index)} h-full`}
              style={{ width }}
              title={`Facture ${index + 1}: ${percentage}% (${formatCurrency(totalAmount * percentage / 100)})`}
            />
          );
        })}
      </div>
      
      <div className="mt-2 grid grid-cols-1 gap-2">
        {distribution.map((percentage, index) => (
          <div key={index} className="flex justify-between text-sm">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${getSegmentColor(index)} mr-2`} />
              <span>Facture {index + 1}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium mr-2">{percentage}%</span>
              <span className="text-gray-600">{formatCurrency(totalAmount * percentage / 100)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseOrderInvoiceProgress;
