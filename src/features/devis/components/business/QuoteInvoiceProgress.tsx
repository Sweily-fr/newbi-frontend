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
    <div className="bg-white rounded-lg shadow-sm border border-[#e6e1ff] overflow-hidden">
      <div className="px-4 py-3 bg-[#f0eeff] border-b border-[#e6e1ff]">
        <h3 className="text-sm font-medium text-[#5b50ff] flex items-center">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          Progression de facturation
        </h3>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Barre de progression */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Facturé
            </span>
            <span className="text-xs font-medium text-[#5b50ff]">{invoicedPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#f0eeff] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#5b50ff] rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${invoicedPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Barre de progression des factures terminées */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Encaissé
            </span>
            <span className="text-xs font-medium text-[#4a41e0]">{completedPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#f0eeff] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#4a41e0] rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${completedPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Informations sur les montants */}
        <div className="pt-3 border-t border-[#f0eeff] space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Montant total :</span>
            <span className="font-medium text-gray-800">{quoteTotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Montant facturé :</span>
            <span className="font-medium text-[#5b50ff]">{invoicedAmount.toFixed(2)} € ({invoicedPercentage.toFixed(1)}%)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Montant encaissé :</span>
            <span className="font-medium text-[#4a41e0]">{completedAmount.toFixed(2)} € ({completedPercentage.toFixed(1)}%)</span>
          </div>
          <div className="flex justify-between text-sm bg-[#f0eeff] p-2 rounded-md mt-2">
            <span className="text-gray-700 font-medium">Reste à facturer :</span>
            <span className="font-medium text-gray-800">{remainingAmount.toFixed(2)} € ({remainingPercentage.toFixed(1)}%)</span>
          </div>
        </div>

        {/* Liste des factures liées */}
        {linkedInvoices.length > 0 && (
          <div className="pt-3 border-t border-[#f0eeff]">
            <h4 className="text-xs font-medium text-[#5b50ff] mb-3 flex items-center">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Factures liées
            </h4>
            <ul className="space-y-2.5">
              {linkedInvoices.map((invoice: Invoice) => (
                <li key={invoice.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-[#f0eeff] transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="mr-2 w-6 h-6 rounded-full bg-[#e6e1ff] flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#5b50ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-700 font-medium">
                        {invoice.isDeposit ? "Acompte" : "Facture"} {invoice.prefix}{invoice.number}
                      </span>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        invoice.status === 'COMPLETED' ? 'bg-[#e6e1ff] text-[#4a41e0]' :
                        invoice.status === 'PENDING' ? 'bg-[#f0eeff] text-[#5b50ff]' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {invoice.status === 'COMPLETED' ? 'Terminée' :
                        invoice.status === 'PENDING' ? 'À encaisser' :
                        'Brouillon'}
                      </span>
                    </div>
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
