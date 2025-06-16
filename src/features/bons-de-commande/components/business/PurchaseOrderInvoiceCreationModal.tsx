import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Receipt21, ArrowRight } from 'iconsax-react';
import { CONVERT_PURCHASE_ORDER_TO_INVOICE_DETAILED_MUTATION } from '../../graphql';
import { PurchaseOrder } from '../../types';
import { formatCurrency } from '../../../../utils/formatters';
import PurchaseOrderInvoiceProgress from './PurchaseOrderInvoiceProgress';

interface PurchaseOrderInvoiceCreationModalProps {
  purchaseOrder: PurchaseOrder;
  onClose: () => void;
  onSuccess: () => void;
}

const PurchaseOrderInvoiceCreationModal: React.FC<PurchaseOrderInvoiceCreationModalProps> = ({
  purchaseOrder,
  onClose,
  onSuccess
}) => {
  const navigate = useNavigate();
  const [isDeposit, setIsDeposit] = useState(false);
  const [depositPercentage, setDepositPercentage] = useState(30);
  const [distribution, setDistribution] = useState<number[]>([100]);
  const [isMultipleInvoices, setIsMultipleInvoices] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState(2);

  const [convertToInvoice, { loading }] = useMutation(CONVERT_PURCHASE_ORDER_TO_INVOICE_DETAILED_MUTATION, {
    onCompleted: (data) => {
      const invoice = data.convertPurchaseOrderToInvoice;
      toast.success('Bon de commande converti en facture avec succès');
      onSuccess();
      navigate(`/factures/${invoice.id}`);
    },
    onError: (error) => {
      toast.error(`Erreur lors de la conversion: ${error.message}`);
    }
  });

  const handleSubmit = () => {
    const variables: any = {
      id: purchaseOrder.id,
      isDeposit: isDeposit,
      skipValidation: true
    };

    if (isDeposit || isMultipleInvoices) {
      if (isDeposit) {
        variables.distribution = [depositPercentage];
      } else if (isMultipleInvoices) {
        variables.distribution = distribution;
      }
    }

    convertToInvoice({ variables });
  };

  const handleDistributionChange = (index: number, value: number) => {
    const newDistribution = [...distribution];
    newDistribution[index] = value;
    setDistribution(newDistribution);
  };

  const handleInvoiceCountChange = (count: number) => {
    setInvoiceCount(count);
    // Réinitialiser la distribution avec des valeurs égales
    const equalValue = Math.floor(100 / count);
    const remainder = 100 - (equalValue * count);
    
    const newDistribution = Array(count).fill(equalValue);
    newDistribution[0] += remainder; // Ajouter le reste à la première facture
    
    setDistribution(newDistribution);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b bg-violet-50">
          <h2 className="text-lg font-semibold text-violet-800 flex items-center">
            <Receipt21 size={20} className="mr-2 text-violet-600" />
            Convertir en facture
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Informations du bon de commande</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Numéro</span>
                <span>{purchaseOrder.prefix}{purchaseOrder.number}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Client</span>
                <span>{purchaseOrder.client?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Montant total</span>
                <span className="font-semibold">{formatCurrency(purchaseOrder.finalTotalTTC || 0)}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Type de conversion</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 p-3 rounded-md border hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="conversionType"
                  checked={!isDeposit && !isMultipleInvoices}
                  onChange={() => {
                    setIsDeposit(false);
                    setIsMultipleInvoices(false);
                  }}
                  className="form-radio h-5 w-5 text-violet-600"
                />
                <div>
                  <span className="font-medium">Facture complète</span>
                  <p className="text-sm text-gray-500">Convertir le bon de commande en une facture pour le montant total</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-md border hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="conversionType"
                  checked={isDeposit}
                  onChange={() => {
                    setIsDeposit(true);
                    setIsMultipleInvoices(false);
                  }}
                  className="form-radio h-5 w-5 text-violet-600"
                />
                <div className="flex-1">
                  <span className="font-medium">Facture d'acompte</span>
                  <p className="text-sm text-gray-500 mb-2">Créer une facture d'acompte pour un pourcentage du montant total</p>
                  
                  {isDeposit && (
                    <div className="flex items-center mt-2">
                      <input
                        type="range"
                        min="1"
                        max="99"
                        value={depositPercentage}
                        onChange={(e) => setDepositPercentage(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="ml-2 min-w-[50px] text-center font-medium text-violet-700">{depositPercentage}%</span>
                    </div>
                  )}
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-md border hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="conversionType"
                  checked={isMultipleInvoices}
                  onChange={() => {
                    setIsDeposit(false);
                    setIsMultipleInvoices(true);
                  }}
                  className="form-radio h-5 w-5 text-violet-600"
                />
                <div className="flex-1">
                  <span className="font-medium">Factures multiples</span>
                  <p className="text-sm text-gray-500 mb-2">Diviser le bon de commande en plusieurs factures</p>
                  
                  {isMultipleInvoices && (
                    <div className="mt-3">
                      <div className="flex items-center mb-3">
                        <span className="mr-2 text-sm">Nombre de factures:</span>
                        <select
                          value={invoiceCount}
                          onChange={(e) => handleInvoiceCountChange(parseInt(e.target.value))}
                          className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                          {[2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-3">
                        {distribution.map((value, index) => (
                          <div key={index} className="flex items-center">
                            <span className="mr-2 text-sm min-w-[80px]">Facture {index + 1}:</span>
                            <input
                              type="range"
                              min="1"
                              max="100"
                              value={value}
                              onChange={(e) => handleDistributionChange(index, parseInt(e.target.value))}
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="ml-2 min-w-[50px] text-center font-medium text-violet-700">{value}%</span>
                          </div>
                        ))}
                      </div>
                      
                      <PurchaseOrderInvoiceProgress 
                        distribution={distribution} 
                        totalAmount={purchaseOrder.finalTotalTTC || 0} 
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
          >
            {loading ? 'Conversion...' : (
              <>
                <span>Convertir</span>
                <ArrowRight size={16} className="ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderInvoiceCreationModal;
