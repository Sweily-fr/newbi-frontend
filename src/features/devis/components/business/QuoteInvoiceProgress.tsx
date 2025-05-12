import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_QUOTE } from '../../graphql/quotes';
import { Notification } from '../../../../components/';

interface Invoice {
  id: string;
  prefix: string;
  number: string;
  status: 'DRAFT' | 'PENDING' | 'COMPLETED';
  finalTotalTTC?: number;
  isDeposit?: boolean;
}

interface QuoteInvoiceProgressProps {
  quoteTotal: number;
  linkedInvoices?: Invoice[];
  quoteId?: string;
  refreshInterval?: number;
}

export const QuoteInvoiceProgress: React.FC<QuoteInvoiceProgressProps> = ({
  quoteTotal,
  linkedInvoices: initialLinkedInvoices = [],
  quoteId,
  refreshInterval = 2000 // 2 secondes par défaut
}) => {
  // Utiliser useQuery pour récupérer les données du devis en temps réel
  const { data, refetch, startPolling, stopPolling } = useQuery(GET_QUOTE, {
    variables: { id: quoteId },
    skip: !quoteId,
    fetchPolicy: 'network-only', // Forcer la récupération depuis le réseau à chaque fois
    notifyOnNetworkStatusChange: true, // Important pour détecter les changements de statut réseau
    onError: (error) => {
      console.error('Erreur lors de la récupération des données du devis:', error);
      Notification.error('Erreur lors de la mise à jour des factures liées', {
        duration: 5000,
        position: 'bottom-left'
      });
    }
  });
  
  // Utiliser directement les données du serveur si disponibles, sinon utiliser les props initiales
  const linkedInvoices = data?.quote?.linkedInvoices || initialLinkedInvoices;
  
  // Forcer un rafraîchissement immédiat lors du montage du composant
  useEffect(() => {
    if (quoteId) {
      refetch();
    }
  }, [quoteId, refetch]);
  
  // Démarrer le polling lorsque le composant est monté
  useEffect(() => {
    if (quoteId) {
      startPolling(refreshInterval);
      
      // Force un premier rafraîchissement immédiat
      refetch();
      
      return () => {
        stopPolling();
      };
    }
    
    return undefined;
  }, [quoteId, refreshInterval, startPolling, stopPolling, refetch]);
  // Calculer le montant total des factures
  const invoicedAmount = linkedInvoices.reduce((sum: number, invoice: Invoice) => sum + (invoice.finalTotalTTC || 0), 0);
  
  // Calculer le pourcentage facturé
  const invoicedPercentage = (invoicedAmount / quoteTotal) * 100;
  
  // Calculer le montant et le pourcentage restants
  const remainingAmount = quoteTotal - invoicedAmount;
  const remainingPercentage = 100 - invoicedPercentage;

  // Filtrer les factures terminées (COMPLETED)
  const completedInvoices = linkedInvoices.filter((invoice: Invoice) => invoice.status === 'COMPLETED');
  const completedAmount = completedInvoices.reduce((sum: number, invoice: Invoice) => sum + (invoice.finalTotalTTC || 0), 0);
  const completedPercentage = (completedAmount / quoteTotal) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Progression de facturation</h3>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Barre de progression */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500">Facturé</span>
            <span className="text-xs font-medium text-gray-700">{invoicedPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${invoicedPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Barre de progression des factures terminées */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500">Encaissé</span>
            <span className="text-xs font-medium text-gray-700">{completedPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${completedPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Informations sur les montants */}
        <div className="pt-2 border-t border-gray-100 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Montant total :</span>
            <span className="font-medium text-gray-800">{quoteTotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Montant facturé :</span>
            <span className="font-medium text-gray-800">{invoicedAmount.toFixed(2)} € ({invoicedPercentage.toFixed(1)}%)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Montant encaissé :</span>
            <span className="font-medium text-gray-800">{completedAmount.toFixed(2)} € ({completedPercentage.toFixed(1)}%)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Reste à facturer :</span>
            <span className="font-medium text-gray-800">{remainingAmount.toFixed(2)} € ({remainingPercentage.toFixed(1)}%)</span>
          </div>
        </div>

        {/* Liste des factures liées */}
        {linkedInvoices.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Factures liées</h4>
            <ul className="space-y-2">
              {linkedInvoices.map((invoice: Invoice) => (
                <li key={invoice.id} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-gray-700">
                      {invoice.isDeposit ? "Acompte" : "Facture"} {invoice.prefix}{invoice.number}
                    </span>
                    <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                      invoice.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {invoice.status === 'COMPLETED' ? 'Terminée' :
                       invoice.status === 'PENDING' ? 'À encaisser' :
                       'Brouillon'}
                    </span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {invoice.finalTotalTTC?.toFixed(2)} €
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
